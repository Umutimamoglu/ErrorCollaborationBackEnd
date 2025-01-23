"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path")); // path modülünü ekledim
var db_1 = __importDefault(require("./db"));
var user_routes_1 = __importDefault(require("../Routes/user.routes"));
var errors_routes_1 = __importDefault(require("../Routes/errors.routes"));
var middleware_1 = require("../middleware ");
var message_routes_1 = __importDefault(require("../Routes/message.routes"));
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
var PORT = process.env.PORT || 1337;
(0, db_1.default)().then(function () {
    console.log("Database connection successful");
}).catch(function (error) {
    console.error("Database connection error:", error);
});
app.use("/users", user_routes_1.default);
app.use("/api/errors", middleware_1.authenticationMiddleware, errors_routes_1.default);
app.use("/api/chat", middleware_1.authenticationMiddleware, message_routes_1.default);
app.listen(PORT, function () {
    console.log("Server up and running on http://localhost:".concat(PORT));
});
