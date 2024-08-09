"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var db_1 = __importDefault(require("./db"));
var user_routes_1 = __importDefault(require("../Routes/user.routes"));
var errors_routes_1 = __importDefault(require("../Routes/errors.routes"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var middleware_1 = require("../middleware ");
dotenv_1.default.config();
// Uploads dizininin varlığını kontrol edin ve yoksa oluşturun
var uploadsDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
var PORT = process.env.PORT || 1337;
(0, db_1.default)().then(function () {
    console.log("Database connection successful");
}).catch(function (error) {
    console.error("Database connection error:", error);
});
// Login ve Register rotaları için authenticationMiddleware kullanmıyoruz
app.use("/users", user_routes_1.default);
// Diğer tüm /api rotaları için authenticationMiddleware kullanıyoruz
app.use("/api/errors", middleware_1.authenticationMiddleware, errors_routes_1.default);
app.listen(PORT, function () {
    console.log("Server up and running on http://localhost:".concat(PORT));
});
