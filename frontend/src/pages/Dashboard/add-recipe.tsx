import cogoToast from "cogo-toast";
import { CSSProperties, DragEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, TextArea } from "../../components";
import { useRecipe } from "../../hooks";
import { validateImageType } from "../../utils";
import { ImageUploader } from "./common/image-uploader";
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

export const AddRecipe = () => {
  const navigate = useNavigate();
  const { loading, addRecipe } = useRecipe();
  const [state, setState] = useState({
    title: "",
    note: "",
    description: "",
    ingredients: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");

  // Handle image drop
  const handleOnDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleOnDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    let imageFile = event.dataTransfer.files[0];
    if (!validateImageType(imageFile)) {
      return cogoToast.error("File type is wrong" + imageFile.type);
    }
    setImage(imageFile);
  };

  const handleFile = (event: FormEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files) return;
    const imageFile = event.currentTarget.files[0];
    if (!validateImageType(imageFile)) {
      return cogoToast.warn("File type is wrong" + imageFile.type);
    }
    setImage(imageFile);
  };

  // Handle form submission
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      return cogoToast.error("Please add an image");
    }
    if (!category) {
      return cogoToast.error("Please choose a category first");
    }
    if (!state?.title || !state?.description || !state?.ingredients) {
      return cogoToast.error("Please fill the missing field");
    }
    const payload = {
      image,
      category,
      ...state,
    };
    try {
      await addRecipe(payload);
      setState({ title: "", note: "", description: "", ingredients: "" });
      setImage(null);
      cogoToast.success(`Posted to ${categories.find((item) => item.id === category)?.name}.`);
      navigate("/dashboard/myrecipes");
    } catch (error: any) {
      cogoToast.error(error?.response?.data?.error || "Recipe could not be published");
    }
  };

  const onChange = (
    e: FormEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setState({ ...state, [name]: value });
  };

  return (
    <div className="min-h-screen text-[var(--cream)]">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--saffron)]">Share something good</p>
      <h2 className="font-display text-4xl">Add a recipe</h2>

      <section className="mt-8" aria-labelledby="category-heading">
        <div className="flex items-end justify-between gap-4">
          <div><h3 id="category-heading" className="font-display text-2xl">Where does it belong?</h3><p className="mt-1 text-sm text-[var(--cream-dim)]">Choose a table before filling in the details.</p></div>
          {category && <span className="text-xs text-[var(--saffron)]">Selected</span>}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {categories.map((item) => <button type="button" key={item.id} onClick={() => setCategory(item.id)} className={`category-picker ${category === item.id ? "category-picker-active" : ""}`} style={{ "--category-tint": item.tint } as CSSProperties}>
            <img src={item.image} alt="" className="aspect-[4/3] w-full bg-[var(--cream)] p-4 object-contain opacity-90" />
            <span className="block p-3 text-left text-sm font-semibold">{item.name}</span>
          </button>)}
        </div>
      </section>

      {!category && (
        <p className="mt-6 border-l-2 border-[var(--saffron)] px-3 text-sm text-[var(--cream-dim)]">
          Select one category above to unlock the recipe fields.
        </p>
      )}

      <Form onSubmit={onSubmit} className={`mt-10 flex flex-col gap-2 md:flex-row md:gap-4 ${!category ? "pointer-events-none opacity-40" : ""}`}>
        {/* Left column */}
        <div className="w-full flex flex-col gap-2"> {/* Reduced gap between inputs */}
          <Input
            disabled={loading || !category}
            name="title"
            placeholder="Name of the recipe"
            type="text"
            handleChange={onChange}
            className="bg-zinc-900 py-2 px-4 w-full placeholder:text-sm hover:bg-zinc-800 cursor-pointer focus:outline-none"
          />

          <TextArea
            disabled={loading || !category}
            name="ingredients"
            placeholder="Ingredients"
            onChange={onChange}
            rows={4}
            className="bg-zinc-900 py-2 px-4 w-full placeholder:text-sm hover:bg-zinc-800 cursor-pointer focus:outline-none mt-2 resize-y"
          />

          <TextArea
            disabled={loading || !category}
            name="description"
            placeholder="Recipe description and how to make it"
            onChange={onChange}
            rows={6}
            className="bg-zinc-900 py-2 px-4 w-full placeholder:text-sm hover:bg-zinc-800 cursor-pointer focus:outline-none mt-2 resize-y"
          />
        </div>

        {/* Right column */}
        <div className="w-full flex flex-col gap-2"> {/* Reduced gap between image uploader and other fields */}
          <ImageUploader
            handleDragOver={handleOnDragOver}
            handleOnDrop={handleOnDrop}
            handleFile={handleFile}
            name={image?.name as string}
            className="bg-zinc-900 py-2 px-4 w-full hover:bg-zinc-800 cursor-pointer focus:outline-none"
          />
          <TextArea
            disabled={loading || !category}
            name="note"
            placeholder="Notes"
            onChange={onChange}
            rows={4}
            className="bg-zinc-900 py-2 px-4 w-full placeholder:text-sm hover:bg-zinc-800 cursor-pointer focus:outline-none mt-2 resize-y"
          />
          <Button
            disabled={loading || !category}
            title={loading ? "Publishing..." : "Publish Recipe"}
            className="bg-orange-500 text-white hover:bg-orange-600 py-2 px-6 w-full mt-2"
            type="submit"
          />
        </div>
      </Form>
    </div>
  );
};
