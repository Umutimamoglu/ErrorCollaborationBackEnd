"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var errorsController_1 = require("../Controllers/errorsController");
var upload_1 = __importDefault(require("../middleware /upload"));
var router = express_1.default.Router();
router.post("/create", upload_1.default.single('image'), errorsController_1.createError);
router.get("/getMyErrors", errorsController_1.getMyBugs);
exports.default = router;
