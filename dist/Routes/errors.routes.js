"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var errorsController_1 = require("../Controllers/errorsController");
var upload_1 = __importDefault(require("../middleware /upload"));
var userControllers_1 = require("../Controllers/userControllers");
var router = express_1.default.Router();
router.post("/create", upload_1.default.single('image'), errorsController_1.createError);
router.delete("/deleteError/:id", errorsController_1.deleteError);
router.put("/updateError/:id", errorsController_1.updateError);
router.get("/getMyErrors", errorsController_1.getMyBugs);
router.get("/getAllErrors", errorsController_1.getAllBugs);
router.post("/addToFavorites", errorsController_1.addToFavorites);
router.get("/getAllFavori", errorsController_1.getAllFavori);
router.put("/update", upload_1.default.single('image'), userControllers_1.updateUser);
exports.default = router;
