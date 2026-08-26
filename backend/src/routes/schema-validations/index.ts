import * as yup from "yup";

const createRecipeSchema: yup.AnyObjectSchema = yup.object({
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

const getRecipeSchema = yup.object({
  params: yup.object({
    id: yup.string().min(5).required("invalid request"),
  }),
});

const searchRecipeSchema = yup.object({
  query: yup.object({
    q: yup.string().required("invalid request"),
  }),
});

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

const loginSchema = yup.object({
  body: yup.object({
    identifier: yup.string().trim().required("Email or username is required"),
    password: yup.string().required("Password is required"),
  }),
});

const getUserRecipeSchema = yup.object({
    params: yup.object({
      userId: yup.string().min(5).required("invalid request"),
    }),
  });


  export {joinSchema, loginSchema,
    createRecipeSchema,
    getRecipeSchema,
    getUserRecipeSchema,
    searchRecipeSchema
  } ;