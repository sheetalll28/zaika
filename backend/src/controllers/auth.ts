import { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models";
import { CONSTANTS } from 'src/constants';

dotenv.config();


// const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const signToken = (id: string) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }


    const token = jwt.sign({ id: String(id) }, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    } as jwt.SignOptions);

    return token;
};


export const signup = async (req: Request, res: Response) => {
    const { username, email, password }: { username: string; email: string; password: string } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] }).exec();
        if (existingUser) {
            return res.status(409).json({ error: "That username or email is already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, CONSTANTS.SALT);
        const newUser = await User.create({ username, email, password: hashedPassword });

        return res.status(201).json({ message: "Account created successfully", username: newUser.username, email: newUser.email });
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { identifier, password }: { identifier: string; password: string } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
        }).select("+password").exec();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = signToken(user._id.toString());
        return res.status(200).json({ token, username: user.username, email: user.email, id: user._id });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

