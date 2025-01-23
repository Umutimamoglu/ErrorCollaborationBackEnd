"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFavori = exports.addToFavorites = exports.getAllBugs = exports.getMyBugs = exports.deleteError = exports.updateError = exports.createError = void 0;
var errorModel_1 = __importDefault(require("../models/errorModel"));
var favoritesModel_1 = __importDefault(require("../models/favoritesModel"));
var createError = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, color, name_1, isFixed, language, type, howDidIFix, image, newError, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = request.body, color = _a.color, name_1 = _a.name, isFixed = _a.isFixed, language = _a.language, type = _a.type, howDidIFix = _a.howDidIFix;
                image = request.file ? request.file.path : null;
                if (!request.userId) {
                    console.log("User ID is not available. User not authenticated.");
                    return [2 /*return*/, response.status(401).json({ message: "User not authenticated." })];
                }
                if (!name_1 || !color || !language || !type || !howDidIFix) {
                    return [2 /*return*/, response.status(400).json({ message: "Required fields are missing." })];
                }
                return [4 /*yield*/, errorModel_1.default.create({
                        user: request.userId,
                        name: name_1,
                        isFixed: isFixed || false,
                        image: image,
                        color: color,
                        language: language,
                        type: type,
                        howDidIFix: howDidIFix,
                    })];
            case 1:
                newError = _b.sent();
                console.log("Erororrr çlasıtıııı çağrıldıı");
                response.status(201).json(newError);
                console.log("response : ", newError);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error("Error in createError:", error_1);
                response.status(500).json({ message: "Something went wrong", error: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createError = createError;
var updateError = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, color, name_2, isFixed, language, type, howDidIFix, image, updateFields, updatedError, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = request.params.id;
                _a = request.body, color = _a.color, name_2 = _a.name, isFixed = _a.isFixed, language = _a.language, type = _a.type, howDidIFix = _a.howDidIFix;
                image = request.file ? request.file.path : undefined;
                if (!request.userId) {
                    return [2 /*return*/, response.status(401).json({ message: "User not authenticated." })];
                }
                updateFields = {};
                if (color)
                    updateFields.color = color;
                if (name_2)
                    updateFields.name = name_2;
                if (typeof isFixed !== 'undefined')
                    updateFields.isFixed = isFixed;
                if (language)
                    updateFields.language = language;
                if (type)
                    updateFields.type = type;
                if (howDidIFix)
                    updateFields.howDidIFix = howDidIFix;
                if (image)
                    updateFields.image = image;
                return [4 /*yield*/, errorModel_1.default.findOneAndUpdate({ _id: id, user: request.userId }, { $set: updateFields }, { new: true })];
            case 1:
                updatedError = _b.sent();
                if (!updatedError) {
                    return [2 /*return*/, response.status(404).json({ message: "Error not found or not authorized to update." })];
                }
                response.status(200).json(updatedError);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                response.status(500).json({ message: "Something went wrong", error: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateError = updateError;
var deleteError = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = request.params.id;
                if (!request.userId) {
                    console.log("User ID is not available. User not authenticated.");
                    return [2 /*return*/, response.status(401).json({ message: "User not authenticated." })];
                }
                return [4 /*yield*/, errorModel_1.default.findOneAndDelete({ _id: id, user: request.userId })];
            case 1:
                error = _a.sent();
                if (!error) {
                    return [2 /*return*/, response.status(404).json({ message: "Error not found or not authorized to delete." })];
                }
                response.status(200).json({ message: "Error deleted successfully.", error: error });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Error in deleteError:", error_3);
                response.status(500).json({ message: "Something went wrong", error: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteError = deleteError;
var getMyBugs = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var userErrors, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!request.userId) {
                    console.log("User ID is not available. User not authenticated.");
                    return [2 /*return*/, response.status(401).json({ message: "User not authenticated." })];
                }
                return [4 /*yield*/, errorModel_1.default.find({ user: request.userId })];
            case 1:
                userErrors = _a.sent();
                if (!userErrors) {
                    return [2 /*return*/, response.status(404).json({ message: "No errors found for this user." })];
                }
                response.status(200).json(userErrors);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error("Error in getMyBugs:", error_4);
                response.status(500).json({ message: "Something went wrong", error: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMyBugs = getMyBugs;
var getAllBugs = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var allErrors, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, errorModel_1.default.find().populate('user', 'name email')];
            case 1:
                allErrors = _a.sent();
                response.status(200).json(allErrors);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("Error in getAllBugs:", error_5);
                response.status(500).json({ message: "Something went wrong", error: error_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllBugs = getAllBugs;
var addToFavorites = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, color, name_3, isFixed, language, type, howDidIFix, image, addFavori, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = request.body, color = _a.color, name_3 = _a.name, isFixed = _a.isFixed, language = _a.language, type = _a.type, howDidIFix = _a.howDidIFix;
                image = request.file ? request.file.path : null;
                if (!request.userId) {
                    console.log("User ID is not available. User not authenticated.");
                    return [2 /*return*/, response.status(401).json({ message: "User not authenticated." })];
                }
                if (!name_3 || !color || !language || !type || !howDidIFix) {
                    return [2 /*return*/, response.status(400).json({ message: "Required fields are missing." })];
                }
                return [4 /*yield*/, favoritesModel_1.default.create({
                        user: request.userId,
                        name: name_3,
                        isFixed: isFixed || false,
                        image: image,
                        color: color,
                        language: language,
                        type: type,
                        howDidIFix: howDidIFix,
                    })];
            case 1:
                addFavori = _b.sent();
                response.status(201).json(addFavori);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _b.sent();
                console.error("Error in createError:", error_6);
                response.status(500).json({ message: "Something went wrong", error: error_6.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addToFavorites = addToFavorites;
var getAllFavori = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var userErrors, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!request.userId) {
                    console.log("User ID is not available. User not authenticated.");
                    return [2 /*return*/, response.status(401).json({ message: "User not authenticated." })];
                }
                return [4 /*yield*/, favoritesModel_1.default.find({ user: request.userId }).populate('user')];
            case 1:
                userErrors = _a.sent();
                if (!userErrors || userErrors.length === 0) {
                    return [2 /*return*/, response.status(404).json({ message: "No errors found for this user." })];
                }
                response.status(200).json(userErrors);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error("Error in getAllFavori:", error_7);
                response.status(500).json({ message: "Something went wrong", error: error_7.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllFavori = getAllFavori;
