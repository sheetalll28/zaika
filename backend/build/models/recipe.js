"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipe = exports.RECIPE_CATEGORIES = void 0;
const mongoose_1 = require("mongoose");
exports.RECIPE_CATEGORIES = [
    "hostel-station",
    "mumma-wala-swad",
    "lazy-corner",
    "gym-rat-fuel",
    "no-oil-zone",
];
const recipeSchema = new mongoose_1.Schema({
    category: {
        type: String,
        enum: exports.RECIPE_CATEGORIES,
        required: true,
        default: "mumma-wala-swad",
        index: true,
    },
    user: { type: mongoose_1.SchemaTypes.ObjectId, ref: "User" },
    title: { type: String, required: true, index: true },
    description: { type: String, required: true, index: true },
    note: { type: String, index: true },
    ingredients: { type: String, required: true, index: true },
    image: {
        url: { type: String, required: true },
        id: { type: String, required: true },
    },
}, {
    timestamps: true,
    autoIndex: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.Recipe = (0, mongoose_1.model)("Recipe", recipeSchema);
