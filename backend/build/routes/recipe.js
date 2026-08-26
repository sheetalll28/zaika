"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const controllers_1 = require("./../controllers");
const middlewares_1 = require("../middlewares");
const schema_validations_1 = require("../routes/schema-validations");
const router = express_1.default.Router();
exports.router = router;
router.get("/recent", controllers_1.getLatestRecipe);
router.get("/find", passport_1.default.authenticate("jwt", { session: false }), (0, middlewares_1.validate)(schema_validations_1.searchRecipeSchema), controllers_1.searchRecipe);
router.get("/", passport_1.default.authenticate("jwt", { session: false }), controllers_1.getAllRecipes);
router.post("/create", passport_1.default.authenticate("jwt", { session: false }), (0, middlewares_1.validate)(schema_validations_1.createRecipeSchema), controllers_1.createRecipe);
router.get("/user/:userId", passport_1.default.authenticate("jwt", { session: false }), (0, middlewares_1.validate)(schema_validations_1.getUserRecipeSchema), controllers_1.getUserRecipes);
router.get("/:id", passport_1.default.authenticate("jwt", { session: false }), (0, middlewares_1.validate)(schema_validations_1.getRecipeSchema), controllers_1.getRecipe);
