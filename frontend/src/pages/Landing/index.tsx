import { FormEvent, useState, useContext, useLayoutEffect } from "react";
import { Input, Form, Button } from "../../components";
import recipeOne from "../../assets/recipe-one.png.jpg";
import { validateEmail } from "../../utils";
import { AuthenticationContext } from "../../context";
import { AUTH_TYPE } from "../../@types";
import cogoToast from "cogo-toast";
import { useNavigate } from "react-router-dom";

type _STATE = {
  email: string;
  password: string;
};

export const Landing = () => {
  const navigate = useNavigate();

  // Protecting this route (can be done in a higher-order component)
  useLayoutEffect(() => {
    if (
      !!sessionStorage.getItem("token") &&
      !!sessionStorage.getItem("email")
    ) {
      navigate("/dashboard");
    }
  }, []);

  // Using AuthenticationContext
  const context = useContext(AuthenticationContext) as AUTH_TYPE;
  if (!context) {
    console.error("AuthenticationContext is null.");
    return <div>Error: Authentication context is not available.</div>;
  }
  const { loading, onLogin } = context;

  const [state, setState] = useState<_STATE>({ email: "", password: "" });

  const handleState = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(state.email)) {
      return cogoToast.error("Invalid email");
    }

    if (!state.password) {
      return cogoToast.error("Please provide a password");
    }

    try {
      if (onLogin) {
        await onLogin({
          email: state.email,
          password: state.password,
        });
      }
    } catch (err: any) {
      console.error(err);
      cogoToast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <Form
        className="flex items-center justify-center w-full md:w-1/2 h-full p-10 bg-black text-white"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 w-full">
          {/* Enhanced Zaika Heading */}
          <h2 className="text-orange-500 font-extrabold text-3xl md:text-4xl underline underline-offset-8 mb-4">
            Zaika
          </h2>

          {/* Input Fields with Less Width */}
          <Input
            name="email"
            placeholder="Email"
            handleChange={handleState}
            type="text"
            className="bg-zinc-900 py-1 px-4 w-full md:w-[80%] shadow-xl placeholder:text-sm hover:bg-zinc-800 cursor-pointer focus:outline-none"
          />

          <Input
            name="password"
            placeholder="Password"
            handleChange={handleState}
            type="password"
            className="bg-zinc-900 py-1 px-4 w-full md:w-[80%] placeholder:text-sm hover:bg-zinc-800 cursor-pointer focus:outline-none"
          />

          <div className="w-full md:w-[50%] m-auto flex flex-col gap-2">
            <Button
              title={loading ? "Loading" : "Login"}
              className="bg-orange-500 text-white hover:bg-orange-600 py-1 px-6 w-full"
              type="submit"
              disabled={loading}
            />
          </div>
        </div>
      </Form>

      <div className="w-1/2 h-full">
        <img
          src={recipeOne}
          alt="A dish with food recipes"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
