import { FormEvent, useContext, useEffect, useLayoutEffect, useState } from "react";
import { Input, Form, Button } from "../../components";
import recipeOne from "../../assets/recipe-one.png.jpg";
import { validateEmail } from "../../utils";
import { AuthenticationContext } from "../../context";
import { AUTH_TYPE } from "../../@types";
import cogoToast from "cogo-toast";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";
import { FiAtSign } from "react-icons/fi";

type _STATE = {
  email: string;
  username: string;
  identifier: string;
  password: string;
};

type LatestRecipe = { username: string; title: string } | null;

export const Landing = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(true);
  const [state, setState] = useState<_STATE>({ email: "", username: "", identifier: "", password: "" });
  const [latestRecipe, setLatestRecipe] = useState<LatestRecipe>(null);

  useEffect(() => {
    fetch("http://localhost:5000/recipe/recent")
      .then((response) => response.ok ? response.json() : null)
      .then((recipe: LatestRecipe) => setLatestRecipe(recipe))
      .catch(() => setLatestRecipe(null));
  }, []);

  // Protecting this route (can be done in a higher-order component)
  useLayoutEffect(() => {
    if (
      !!sessionStorage.getItem("token") &&
      !!sessionStorage.getItem("email")
    ) {
      navigate("/dashboard");
    }
  }, []);

  const context = useContext(AuthenticationContext) as AUTH_TYPE;
  if (!context) {
    console.error("AuthenticationContext is null.");
    return <div>Error: Authentication context is not available.</div>;
  }
  const { loading, onLogin, onSignup } = context;

  const handleState = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSignup && !state.username.trim()) {
      return cogoToast.error("Please provide a username");
    }

    if (isSignup && !validateEmail(state.email)) {
      return cogoToast.error("Invalid email");
    }

    if (!isSignup && !state.identifier.trim()) {
      return cogoToast.error("Please provide your email or username");
    }

    if (!state.password) {
      return cogoToast.error("Please provide a password");
    }

    try {
      if (isSignup) {
        await onSignup({
          username: state.username,
          email: state.email,
          password: state.password,
        });
        cogoToast.success("Account created. Please log in.");
        setIsSignup(false);
      } else if (onLogin) {
        await onLogin({
          identifier: state.identifier,
          password: state.password,
        });
      }
    } catch (err: any) {
      console.error(err);
      if (!err?.response?.data?.error) {
        cogoToast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
      <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <div
        className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[var(--ink)] px-6 py-7 text-[var(--cream)] sm:px-10 lg:min-h-screen lg:px-14 lg:py-9"
      >
        <div className="relative z-10 flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--saffron)]">Zaika<span className="text-[var(--cream)]">.</span></h1>
          <span className="rounded-full border border-[var(--cream-dim)]/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--cream-dim)]">Kitchen stories</span>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center py-10 text-center lg:py-0">
          <div className="spice-ring" aria-label="Haldi, Jeera, Elaichi, Dalchini, Kesar, Mirchi">
            <span className="spice spice-one">Haldi</span>
            <span className="spice spice-two">Jeera</span>
            <span className="spice spice-three">Elaichi</span>
            <span className="spice spice-four">Dalchini</span>
            <span className="spice spice-five">Kesar</span>
            <span className="spice spice-six">Mirchi</span>
            <div className="spice-core"><span>ज़ायका</span><small>taste / memory</small></div>
          </div>
          <p className="mt-8 max-w-sm font-display text-2xl leading-tight text-[var(--cream)] sm:text-3xl">Every recipe carries a little bit of home.</p>
          <div className="mt-8 flex max-w-sm items-center gap-3 border-y border-[var(--cream-dim)]/30 py-3 text-left text-xs text-[var(--cream-dim)]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--saffron)] shadow-[0_0_0_4px_rgba(227,162,60,0.14)]" />
            <span>{latestRecipe ? <><strong className="font-medium text-[var(--cream)]">{latestRecipe.username}</strong> just posted {latestRecipe.title}</> : "No recipes posted yet"}</span>
          </div>
        </div>

        <p className="relative z-10 text-xs text-[var(--cream-dim)]">A table for the recipes we return to.</p>
      </div>

      <Form
        className="relative flex min-h-[65vh] items-center justify-center overflow-hidden bg-[var(--cream)] px-6 py-12 sm:px-10 lg:min-h-screen lg:px-16"
        onSubmit={handleSubmit}
      >
        <img
          src={recipeOne}
          alt="A colorful dish prepared for sharing"
          className="absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-multiply"
        />
        <div className="relative z-10 w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--chili)]">Welcome to your table</p>
          <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">{isSignup ? "Make room for your next favorite." : "Good to have you back."}</h2>
          <div className="mt-8 flex border-b border-[var(--ink)]/20">
            <button type="button" onClick={() => setIsSignup(false)} className={`auth-tab ${!isSignup ? "auth-tab-active" : ""}`}>Log in</button>
            <button type="button" onClick={() => setIsSignup(true)} className={`auth-tab ${isSignup ? "auth-tab-active" : ""}`}>Sign up</button>
          </div>
          <div className="mt-7 flex flex-col gap-4">
            {isSignup && <label className="auth-field"><FiAtSign aria-hidden="true" /><Input name="username" aria-label="Username" placeholder="Username" handleChange={handleState} type="text" className="auth-input" /></label>}
            {isSignup ? <label className="auth-field"><FiMail aria-hidden="true" /><Input name="email" aria-label="Email address" placeholder="Email address" handleChange={handleState} type="email" className="auth-input" /></label> : <label className="auth-field"><FiMail aria-hidden="true" /><Input name="identifier" aria-label="Email or username" placeholder="Email or username" handleChange={handleState} type="text" className="auth-input" /></label>}
            <label className="auth-field"><FiLock aria-hidden="true" /><Input name="password" aria-label="Password" placeholder="Password" handleChange={handleState} type="password" className="auth-input" /></label>
            <Button title={loading ? "Working..." : isSignup ? "Create account" : "Log in"} className="auth-submit" type="submit" disabled={loading} />
          </div>
          <p className="mt-7 text-center text-xs text-[var(--ink)]/60">{isSignup ? "Already have an account?" : "New to Zaika?"} <button type="button" onClick={() => setIsSignup(!isSignup)} className="font-semibold text-[var(--chili)] underline-offset-4 hover:underline">{isSignup ? "Log in" : "Create an account"}<FiArrowRight className="ml-1 inline" aria-hidden="true" /></button></p>
        </div>
      </Form>
    </div>
  );
};
