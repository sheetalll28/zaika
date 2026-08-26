import { CSSProperties, FormEvent, Suspense, useEffect, useState } from "react";
import useSWR from "swr";
import cogoToast from "cogo-toast";
import { RecipeCard, SearchBox } from "../../components";
import { NoRecipe } from "./common";
import { useRecipe } from "../../hooks";
import { SearchLoader, UILoader } from "../../components/loaders";
import { IRECIPERESPONSE } from "../../@types";
import { instance } from "../../config";
import hostelStation from "../../../assets/hostel-station.svg";
import mummaWalaSwad from "../../../assets/mumma-wala-swad.svg";
import lazyCorner from "../../../assets/lazy-corner.svg";
import gymRatFuel from "../../../assets/gym-rat-fuel.svg";
import noOilZone from "../../../assets/no-oil-zone.svg";

const categories = [
  { id: "hostel-station", name: "Hostel Station", description: "Kettle-only, minimal-effort meals for dorm life.", image: hostelStation, tint: "var(--saffron)" },
  { id: "mumma-wala-swad", name: "Mumma Wala Swad", description: "Recipes that taste like home.", image: mummaWalaSwad, tint: "var(--chili)" },
  { id: "lazy-corner", name: "Lazy Corner", description: "Done in 10 minutes or less.", image: lazyCorner, tint: "var(--cream-dim)" },
  { id: "gym-rat-fuel", name: "Gym Rat Fuel", description: "High-protein recipes for training days.", image: gymRatFuel, tint: "var(--curry-leaf)" },
  { id: "no-oil-zone", name: "No-Oil Zone", description: "Oil-free, guilt-free.", image: noOilZone, tint: "var(--curry-leaf)" },
] as const;

type CategoryId = (typeof categories)[number]["id"];

export const Home = () => {
  const { loading, searchRecipe } = useRecipe();
  const fetcher = (url: string) => instance.get(url).then((res) => res.data);
  const { data, error } = useSWR("/recipe", fetcher, { suspense: true });
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<IRECIPERESPONSE[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">("all");

  useEffect(() => {
    if (Array.isArray(data)) setRecipes(data);
  }, [data]);

  if (error) {
    cogoToast.error(error?.response?.data?.error || "Unable to load recipes");
    return null;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query) return;
    const result = await searchRecipe(query);
    if (Array.isArray(result)) setRecipes(result);
  };

  const visibleCategories = selectedCategory === "all"
    ? categories
    : categories.filter((category) => category.id === selectedCategory);
  const selectedCategoryDetails = selectedCategory === "all"
    ? null
    : categories.find((category) => category.id === selectedCategory);

  return (
    <Suspense fallback={<UILoader />}>
      <div className="min-w-0 text-[var(--cream)]">
        <div className={`mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end ${selectedCategory !== "all" ? "" : "sm:items-start"}`}>
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--saffron)]">The community table</p>
            <h1 className="font-display text-4xl">{selectedCategory === "all" ? "Choose a table." : "Find your next favorite."}</h1>
          </div>
          {selectedCategory !== "all" && <div className="w-full sm:max-w-xs"><SearchBox title="" onSearch={onSubmit} query={query} setQuery={setQuery} disabled={!recipes.length} /></div>}
        </div>

        <div className={`${selectedCategory === "all" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8"}`} aria-label="Recipe categories">
          {categories.map((category) => (
            <button type="button" key={category.id} onClick={() => setSelectedCategory(category.id)} className={`category-tile ${selectedCategory === "all" ? "min-h-56" : "min-w-40"} ${selectedCategory === category.id ? "category-tile-active" : ""}`} style={{ "--category-tint": category.tint } as CSSProperties}>
              <img src={category.image} alt="" className={`${selectedCategory === "all" ? "h-36" : "h-12"} w-full bg-[var(--cream)] p-2 object-contain opacity-90`} />
              <span className="mt-2 text-left text-xs font-semibold">{category.name}</span>
              <span className="category-tile-description">{category.description}</span>
            </button>
          ))}
        </div>

        {selectedCategory !== "all" && <button type="button" onClick={() => setSelectedCategory("all")} className="mb-7 mt-5 text-sm text-[var(--saffron)] underline-offset-4 hover:underline">Back to categories</button>}

        {selectedCategoryDetails && (
          <div className="mb-10 grid overflow-hidden border border-[var(--category-tint)]/50 bg-[var(--ink)] sm:grid-cols-[minmax(13rem,0.8fr)_1.2fr]" style={{ "--category-tint": selectedCategoryDetails.tint } as CSSProperties}>
            <img src={selectedCategoryDetails.image} alt="" className="h-40 w-full bg-[var(--cream)] p-4 object-contain sm:h-full" />
            <div className="flex flex-col justify-center p-5 sm:p-7">
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: selectedCategoryDetails.tint }}>Selected table</p>
              <h2 className="mt-2 font-display text-3xl text-[var(--cream)]">{selectedCategoryDetails.name}</h2>
              <p className="mt-2 text-sm text-[var(--cream-dim)]">{selectedCategoryDetails.description}</p>
            </div>
          </div>
        )}

        {loading ? <SearchLoader /> : selectedCategory !== "all" && visibleCategories.map((category) => {
          const categoryRecipes = recipes.filter((recipe) => recipe.category === category.id);
          return (
            <section key={category.id} className="mb-10" aria-labelledby={`${category.id}-heading`}>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div><h2 id={`${category.id}-heading`} className="font-display text-2xl" style={{ color: category.tint }}>{category.name}</h2><p className="mt-1 text-sm text-[var(--cream-dim)]">{category.description}</p></div>
              </div>
              {categoryRecipes.length ? <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{categoryRecipes.map((recipe) => <RecipeCard key={recipe._id} {...recipe} user={recipe?.user?.email as string} />)}</div> : <div className="border-y border-[var(--cream-dim)]/20 py-5 text-sm text-[var(--cream-dim)]"><span>Nobody&apos;s posted here yet. </span><NoRecipe /></div>}
            </section>
          );
        })}
      </div>
    </Suspense>
  );
};
