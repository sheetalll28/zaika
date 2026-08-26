/* eslint-disable */
import { UploadedFile } from "express-fileupload";
import { Request, Response } from "express";
import { Recipe } from "../models";
import { validateImageType } from "../utils";
import { upload } from "../cloudinary";
import { SEARCH_RECIPES, SEARCH_RECIPES_RESPONSE } from "./../@types/index.d";

// Search for recipes based on a query
export const searchRecipe = async (req: Request, res: Response) => {
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
          ingredients: 1,  // Make sure to include ingredients in the projection
          category: 1,
          image: 1,
        },
      },
    ];

    // Execute the aggregation query
    const recipes: SEARCH_RECIPES[] = await Recipe.aggregate(pipeline)
      .sort({ _id: -1 })
      .exec();

    let response: SEARCH_RECIPES_RESPONSE[] = [];

    // Map the results to the expected response format
    if (recipes?.length) {
      response = recipes.map((recipe: SEARCH_RECIPES) => {
        const { user, ingredients, ...rest } = recipe;
        const email = user[0].email;

        // Return the formatted response, including ingredients
        return {
          ...rest,
          ingredients,  // Ensure ingredients is added to the response
          user: email,
        };
      });
    }

    // Return the search results
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

// Get all recipes
export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({})
      .populate("user", "email")
      .sort({ _id: -1 })
      .exec();
    res.status(200).json(recipes);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

export const getLatestRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findOne({})
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .exec();

    if (!recipe) {
      res.status(200).json(null);
      return;
    }

    const author = recipe.user as unknown as { username?: string; email: string };
    res.status(200).json({
      title: recipe.title,
      username: author.username || author.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to load the latest recipe" });
  }
};

// Get a specific recipe by ID
export const getRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findById(id).populate("user", "email").exec();
    res.status(200).json(recipe);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

// Get recipes by user ID
export const getUserRecipes = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const recipe = await Recipe.find({ user: userId })
      .populate("user", "email")
      .sort({ _id: -1 })
      .exec();
    res.status(200).json(recipe);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

// Create a new recipe

// Create a new recipe
export const createRecipe = async (req: Request, res: Response): Promise<void> => {
  if (!req?.user) {
    res.status(422).json({ error: "Unable to process your request." });
    return;
  }

  // Check if files are present in the request
  if (!req.files || !req.files.image) {
    res.status(400).json({ error: "No files were uploaded." });
    return;
  }

  // Type-cast req.files.image to UploadedFile (we know it is an image)
  const image = req.files.image as UploadedFile;

  if (!validateImageType(image)) {
    res.status(422).json({ error: "Image type not supported." });
    return;
  }

  let imageUrl: string;
  let imageId: string;

  try {
    // Upload the image to Cloudinary
    const result = await upload(image.data, "Images");
    imageUrl = result.secure_url;
    imageId = result.public_id;
  } catch (error) {
    console.log(error, "CLOUDINARY ERROR");
    res.status(400).json({ error: "Image upload failed" });
    return;
  }

  const { title, note, description, ingredients, category }: { title: string; note: string; description: string; ingredients: string; category: string } = req.body;

  try {
    // Create the new recipe in the database
    const recipe = await Recipe.create({
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
    res.status(200).json({ message: "created successfully", ...recipe });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
};
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