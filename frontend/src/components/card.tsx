import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IRECIPEUSER } from "../@types";
import { Button } from "./button";

export const RecipeCard = ({
  _id,
  title,
  ingredients,
  note,
  image,
  description,
  user,
  category,
}: IRECIPEUSER) => {
  const navigate = useNavigate();
  const handleViewMore = (id: string) => {
    navigate("/dashboard/recipe/" + id);
  };
  return (
    <Card
      title={title}
      image={image?.url}
      note={note}
      ingredients={ingredients}
      description={description}
      email={user}
      category={category || "recipe"}
      avatar="https://plus.unsplash.com/premium_vector-1713201017274-e9e97d783e75?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    >
      <div className="flex justify-end">
        <Button
          title="View  More"
          handleClick={() => handleViewMore(_id)}
          className={`bg-orange-500 text-white hover:bg-orange-600 
          py-1 px-2 w-[50%]
          `}
        />
      </div>
    </Card>
  );
};

export const Card = ({
  avatar,
  image,
  title,
  description,
  email,
  ingredients,
  note,
  category,
  children,
  isFull = false,
}: {
  id?: string;
  avatar: string;
  image: string;
  description: string;
  title: string;
  email: string;
  ingredients: string;
  note?: string;
  category?: string;
  children?: ReactNode;
  isFull?: boolean;
}) => {
  return (
    <div
      className={`min-w-0 w-full ${
        isFull ? "" : ""
      } bg-[var(--ink)]
      transition ease-in-out delay-150
      hover:-translate-y-1
      hover:scale-[1.01]
      duration-300
      mb-4
      `}
    >
      <img
        src={image}
        alt={"A picture of " + title}
        className={`aspect-[4/3] w-full object-cover ${isFull ? "md:aspect-[16/9]" : ""}`}
      />
      <div
        className="min-w-0 w-full overflow-hidden bg-[var(--ink)] p-3"
      >
        <div className="flex gap-4 items-start w-full">
          <img
            className="h-10 w-10 shrink-0 rounded-full object-cover"
            src={avatar}
            alt={"A picture of user"}
          />
          <div className="text-left">
            <p className="max-w-full truncate text-sm text-[var(--saffron)]">{email}</p>
          </div>
        </div>
        <h2
          className="my-2 truncate text-xl font-display font-semibold text-[var(--saffron)]"
        >
          {title}
        </h2>
        <span className="mb-2 inline-block rounded-full border border-[var(--saffron)]/50 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--saffron)]">
          {category ? category.split("-").join(" ") : "Recipe"}
        </span>
        <p className="line-clamp-2 text-sm text-[var(--cream-dim)]">
          ingredients: <span className="text-[var(--cream)]">
            {ingredients}
          </span>
        </p>

        <p
          className="my-2 line-clamp-2 text-sm text-[var(--cream-dim)]"
        >
          {description}
        </p>

        {note && (
            <p className="py-1 text-sm text-[var(--saffron)] md:py-4">
            note: <span className="text-[var(--cream)]">{note}</span>
          </p>
        )}
        {children}
      </div>
    </div>
  );
};