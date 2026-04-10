import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UILoader } from "./components/loaders/index";
import { DashboardLayout } from "./layouts/dashboard";
import { AddRecipe, Home, More, MyRecipes } from "./pages/Dashboard";
import { ErrorPage } from "./pages/Error";
import { Landing } from "./pages/Landing";
import { AuthenticationContextProvider } from "./context/auth-context";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/dashboard/",
          element: <Home />,
        },
        {
          path: "/dashboard/addrecipe",
          element: <AddRecipe />,
        },
        {
          path: "/dashboard/myrecipes",
          element: <MyRecipes />,
        },
        {
          path: "/dashboard/recipe/:id",
          element: <More />,
        },
      ],
    },
  ]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <AuthenticationContextProvider>
        <Suspense fallback={<UILoader />}>
          <RouterProvider router={router} fallbackElement={<UILoader />} />
        </Suspense>
      </AuthenticationContextProvider>
    </div>
  );
}

export default App;