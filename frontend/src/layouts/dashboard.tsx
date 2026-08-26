import { useContext, useLayoutEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiChevronDown, FiLogOut, FiPlus, FiUser } from "react-icons/fi";
import { AuthenticationContext } from "../context";
import { AUTH_TYPE } from "../@types";

const routes = [
  { name: "Home", to: "/dashboard" },
  { name: "My Recipes", to: "/dashboard/myrecipes" },
];

export const DashboardLayout = () => {
  const { onLogout, user } = useContext(AuthenticationContext) as AUTH_TYPE;
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  useLayoutEffect(() => {
    if (!sessionStorage.getItem("token") || !sessionStorage.getItem("email")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--ink)] text-[var(--cream)]">
      <header className="sticky top-0 z-50 border-b border-[var(--cream-dim)]/20 bg-[var(--ink)]/95 px-5 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-6">
          <NavLink to="/dashboard" className="shrink-0 font-display text-2xl font-semibold text-[var(--saffron)]">
            Zaika<span className="text-[var(--cream)]">.</span>
          </NavLink>
          <nav className="hidden items-center gap-5 text-sm text-[var(--cream-dim)] sm:flex" aria-label="Main navigation">
            {routes.map(({ name, to }) => (
              <NavLink key={to} to={to} end={to === "/dashboard"} className={({ isActive }) => isActive ? "border-b border-[var(--saffron)] pb-1 text-[var(--cream)]" : "pb-1 hover:text-[var(--saffron)]"}>
                {name}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <NavLink to="/dashboard/addrecipe" className="flex items-center gap-2 rounded-full bg-[var(--saffron)] px-4 py-2 text-xs font-semibold text-[var(--ink)] transition hover:bg-[var(--cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--saffron)]">
              <FiPlus aria-hidden="true" /> Add Recipe
            </NavLink>
            <div className="relative">
              <button type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-label="Open profile menu" className="flex items-center gap-2 rounded-full border border-[var(--cream-dim)]/40 p-2 text-[var(--cream)] hover:border-[var(--saffron)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--saffron)]">
                <FiUser aria-hidden="true" /> <span className="hidden max-w-28 truncate text-xs sm:block">{user}</span><FiChevronDown aria-hidden="true" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 border border-[var(--cream-dim)]/20 bg-[var(--cream)] p-2 text-[var(--ink)] shadow-xl">
                  <p className="truncate px-3 py-2 text-xs text-[var(--ink)]/60">{user}</p>
                  <NavLink to="/dashboard/myrecipes" onClick={() => setProfileOpen(false)} className="block px-3 py-2 text-sm hover:bg-[var(--cream-dim)]/30 sm:hidden">My Recipes</NavLink>
                  <button type="button" onClick={onLogout} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--cream-dim)]/30"><FiLogOut aria-hidden="true" /> Log out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-8 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
};
