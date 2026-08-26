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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecipe = exports.getUserRecipes = exports.getRecipe = exports.getLatestRecipe = exports.getAllRecipes = exports.searchRecipe = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const cloudinary_1 = require("../cloudinary");
// Search for recipes based on a query
const searchRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    try {
        // Aggregation pipeline for MongoDB search
        const pipeline = [
            {
                $search: {
                    index: "recipe",
                    text: {
                        query: q,
                        path: {
                            wildcard: "*",
                        },
                        fuzzy: {},
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $project: {
                    user: 1,
                    note: 1,
                    description: 1,
                    title: 1,
                    ingredients: 1, // Make sure to include ingredients in the projection
                    category: 1,
                    image: 1,
                },
            },
        ];
        // Execute the aggregation query
        const recipes = yield models_1.Recipe.aggregate(pipeline)
            .sort({ _id: -1 })
            .exec();
        let response = [];
        // Map the results to the expected response format
        if (recipes === null || recipes === void 0 ? void 0 : recipes.length) {
            response = recipes.map((recipe) => {
                const { user, ingredients } = recipe, rest = __rest(recipe, ["user", "ingredients"]);
                const email = user[0].email;
                // Return the formatted response, including ingredients
                return Object.assign(Object.assign({}, rest), { ingredients, user: email });
            });
        }
        // Return the search results
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ error: "An error occurred while processing your request" });
    }
});
exports.searchRecipe = searchRecipe;
// Get all recipes
const getAllRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield models_1.Recipe.find({})
            .populate("user", "email")
            .sort({ _id: -1 })
            .exec();
        res.status(200).json(recipes);
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ error: "An error occurred while processing your request" });
    }
});
exports.getAllRecipes = getAllRecipes;
const getLatestRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipe = yield models_1.Recipe.findOne({})
            .populate("user", "username email")
            .sort({ createdAt: -1 })
            .exec();
        if (!recipe) {
            res.status(200).json(null);
            return;
        }
        const author = recipe.user;
        res.status(200).json({
            title: recipe.title,
            username: author.username || author.email,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Unable to load the latest recipe" });
    }
});
exports.getLatestRecipe = getLatestRecipe;
// Get a specific recipe by ID
const getRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const recipe = yield models_1.Recipe.findById(id).populate("user", "email").exec();
        res.status(200).json(recipe);
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ error: "An error occurred while processing your request" });
    }
});
exports.getRecipe = getRecipe;
// Get recipes by user ID
const getUserRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const recipe = yield models_1.Recipe.find({ user: userId })
            .populate("user", "email")
            .sort({ _id: -1 })
            .exec();
        res.status(200).json(recipe);
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ error: "An error occurred while processing your request" });
    }
});
exports.getUserRecipes = getUserRecipes;
// Create a new recipe
// Create a new recipe
const createRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(req === null || req === void 0 ? void 0 : req.user)) {
        res.status(422).json({ error: "Unable to process your request." });
        return;
    }
    // Check if files are present in the request
    if (!req.files || !req.files.image) {
        res.status(400).json({ error: "No files were uploaded." });
        return;
    }
    // Type-cast req.files.image to UploadedFile (we know it is an image)
    const image = req.files.image;
    if (!(0, utils_1.validateImageType)(image)) {
        res.status(422).json({ error: "Image type not supported." });
        return;
    }
    let imageUrl;
    let imageId;
    try {
        // Upload the image to Cloudinary
        const result = yield (0, cloudinary_1.upload)(image.data, "Images");
        imageUrl = result.secure_url;
        imageId = result.public_id;
    }
    catch (error) {
        console.log(error, "CLOUDINARY ERROR");
        res.status(400).json({ error: "Image upload failed" });
        return;
    }
    const { title, note, description, ingredients, category } = req.body;
    try {
        // Create the new recipe in the database
        const recipe = yield models_1.Recipe.create({
            user: req.user,
            category,
            title,
            note,
            description,
            ingredients,
            image: {
                url: imageUrl,
                id: imageId,
            },
        });
        // Return the success response with the created recipe
        res.status(200).json(Object.assign({ message: "created successfully" }, recipe));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
});
exports.createRecipe = createRecipe;
// export const createRecipe = async (req: Request, res: Response): Promise<void> => {
//     // 1. Authentication Check
//     if (!req?.user) {
//       res.status(401).json({ error: "Unauthorized: User not authenticated." }); // Changed to 401 for unauthorized
//       return;
//     }
//     // 2. File Upload Check
//     if (!req.files || Object.keys(req.files).length === 0) { // More robust check for missing files
//       res.status(400).json({ error: "No files were uploaded. Please upload an image." });
//       return;
//     }
//     if (!req.files.image) {
//          res.status(400).json({ error: "No image file was uploaded with the key 'image'." });
//          return;
//     }
//     // 3. Type-cast and Image Type Validation
//     const image = req.files.image as UploadedFile;
//     if (!validateImageType(image)) {
//       res.status(415).json({ error: "Unsupported Media Type: Image type not supported." }); // Changed to 415 for unsupported media type
//       return;
//     }
//     let imageUrl: string;
//     let imageId: string;
//     try {
//       // 4. Cloudinary Upload
//       const result = await upload(image.data, "Images");
//       imageUrl = result.secure_url;
//       imageId = result.public_id;
//     } catch (cloudinaryError: unknown) { // Explicitly type 'cloudinaryError' as 'any'
//       console.error("CLOUDINARY ERROR:", cloudinaryError); // Use console.error for errors
//       res.status(500).json({ error: `Image upload to Cloudinary failed: ${cloudinaryError.message || 'Unknown error'}` }); // Include error message
//       return;
//     }
//     // 5. Extract Recipe Details
//     const { title, note, description, ingredients } = req.body;
//       if (!title || !description || !ingredients) {
//           res.status(400).json({ error: "Missing required fields: title, description, and ingredients are required." });
//           return;
//       }
//     try {
//       // 6. Database Creation
//       const recipe = await Recipe.create({
//         user: req.user, // Assuming req.user contains the user's ID
//         title,
//         note,
//         description,
//         ingredients,
//         image: {
//           url: imageUrl,
//           id: imageId,
//         },
//       });
//       // 7. Success Response
//       res.status(201).json({ message: "Recipe created successfully", recipe }); // Changed to 201 for resource creation
//     } catch (dbError: any) { // Explicitly type 'dbError' as 'any'
//       console.error("DATABASE ERROR:", dbError); // Use console.error for errors
//       res.status(500).json({ error: `An error occurred while creating the recipe: ${dbError.message || 'Unknown error'}` }); // Include error message
//     }
//   };
