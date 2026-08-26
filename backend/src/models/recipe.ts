
import {Schema, SchemaTypes, model} from "mongoose";

interface IImage{
    url: string,
    id: string
}

interface IRecipe{
  category: RecipeCategory;
    title: string,
    note?: string,
    description: string,
    ingredients: string,
    image: IImage;
    user?: string;
}

export const RECIPE_CATEGORIES = [
  "hostel-station",
  "mumma-wala-swad",
  "lazy-corner",
  "gym-rat-fuel",
  "no-oil-zone",
] as const;

export type RecipeCategory = typeof RECIPE_CATEGORIES[number];

const recipeSchema = new Schema<IRecipe>(
    {
        category: {
          type: String,
          enum: RECIPE_CATEGORIES,
          required: true,
          default: "mumma-wala-swad",
          index: true,
        },
        user: { type: SchemaTypes.ObjectId, ref: "User" },
        title: { type: String, required: true, index: true },
        description: { type: String, required: true, index: true },
        note: { type: String, index: true },
        ingredients: { type: String, required: true, index: true },
        image: {
          url: { type: String, required: true },
          id: { type: String, required: true },
        },
      },
      {
        timestamps: true,
        autoIndex: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
      }
);

export const Recipe = model<IRecipe>("Recipe", recipeSchema);