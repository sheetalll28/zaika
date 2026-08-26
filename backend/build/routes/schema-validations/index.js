"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRecipeSchema = exports.getUserRecipeSchema = exports.getRecipeSchema = exports.createRecipeSchema = exports.loginSchema = exports.joinSchema = void 0;
const yup = __importStar(require("yup"));
const createRecipeSchema = yup.object({
    body: yup.object({
        title: yup.string().required("title is required"),
        note: yup.string(),
        ingredients: yup.string().required("ingredients is required"),
        description: yup.string().required("description is required"),
        category: yup.string().oneOf([
            "hostel-station",
            "mumma-wala-swad",
            "lazy-corner",
            "gym-rat-fuel",
            "no-oil-zone",
        ]).required("category is required"),
    }),
});
exports.createRecipeSchema = createRecipeSchema;
const getRecipeSchema = yup.object({
    params: yup.object({
        id: yup.string().min(5).required("invalid request"),
    }),
});
exports.getRecipeSchema = getRecipeSchema;
const searchRecipeSchema = yup.object({
    query: yup.object({
        q: yup.string().required("invalid request"),
    }),
});
exports.searchRecipeSchema = searchRecipeSchema;
const joinSchema = yup.object({
    body: yup.object({
        username: yup.string().min(2, "Username must be at least 2 characters").required("Username is required"),
        email: yup.string().email().required("Email is required"),
        password: yup
            .string()
            .min(7, "password must be greater than 6")
            .required("Password is required"),
    }),
});
exports.joinSchema = joinSchema;
const loginSchema = yup.object({
    body: yup.object({
        identifier: yup.string().trim().required("Email or username is required"),
        password: yup.string().required("Password is required"),
    }),
});
exports.loginSchema = loginSchema;
const getUserRecipeSchema = yup.object({
    params: yup.object({
        userId: yup.string().min(5).required("invalid request"),
    }),
});
exports.getUserRecipeSchema = getUserRecipeSchema;
