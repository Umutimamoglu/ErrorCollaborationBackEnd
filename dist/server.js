"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path")); // path modülünü ekledim
const db_1 = __importDefault(require("./db"));
const user_routes_1 = __importDefault(require("../Routes/user.routes"));
const errors_routes_1 = __importDefault(require("../Routes/errors.routes"));
const middleware_1 = require("../middleware ");
const message_routes_1 = __importDefault(require("../Routes/message.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
const PORT = process.env.PORT || 1337;
(0, db_1.default)().then(() => {
    console.log("Database connection successful");
}).catch(error => {
    console.error("Database connection error:", error);
});
app.use("/users", user_routes_1.default);
app.use("/api/bugs", middleware_1.authenticationMiddleware, errors_routes_1.default);
app.use("/api/chat", middleware_1.authenticationMiddleware, message_routes_1.default);
app.listen(PORT, () => {
    console.log(`Server up and running on http://localhost:${PORT}`);
});
