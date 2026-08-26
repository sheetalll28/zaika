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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("../models");
dotenv_1.default.config();
// const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const signToken = (id) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jsonwebtoken_1.default.sign({ id: String(id) }, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
    return token;
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const existingUser = yield models_1.User.findOne({ $or: [{ email }, { username }] }).exec();
        if (existingUser) {
            return res.status(409).json({ error: "That username or email is already in use" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12 /* CONSTANTS.SALT */);
        const newUser = yield models_1.User.create({ username, email, password: hashedPassword });
        return res.status(201).json({ message: "Account created successfully", username: newUser.username, email: newUser.email });
    }
    catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ error: "An error occurred while processing your request" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier, password } = req.body;
    try {
        const user = yield models_1.User.findOne({
            $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
        }).select("+password").exec();
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = signToken(user._id.toString());
        return res.status(200).json({ token, username: user.username, email: user.email, id: user._id });
    }
    catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ error: "An error occurred while processing your request" });
    }
});
exports.login = login;
