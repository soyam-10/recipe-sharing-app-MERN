import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Utensils, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 9;

export default function FavRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getUserSession = useCallback(() => {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  }, []);
  const session = getUserSession();

  useEffect(() => {
    const fetchFavRecipes = async () => {
      try {
        if (!session) {
          navigate("/login");
          return;
        }
        
        const response = await fetch(
          `https://backend-recipe-sharing-app-mern.vercel.app/users/favRecipes/${session.user.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch favorite recipes");
        }
        const data = await response.json();

        if (data.recipes.length > 0) {
          const recipePromises = data.recipes.map(async (recipeid) => {
            const recipeResponse = await fetch(
              `https://backend-recipe-sharing-app-mern.vercel.app/recipes/${recipeid._id}`
            );
            if (!recipeResponse.ok) {
              throw new Error("Failed to fetch recipe details");
            }
            return recipeResponse.json();
          });

          const recipesData = await Promise.all(recipePromises);
          setRecipes(recipesData.map((data) => data.recipe));
        } else {
          toast.info("No favorite recipes found.");
        }
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavRecipes();
  }, [navigate, session]);

  const removeFromFavorites = async (recipeId) => {
    try {
      const response = await fetch(
        `https://backend-recipe-sharing-app-mern.vercel.app/users/removeFromFav/${session.user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({ recipeId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove recipe from favorites");
      }

      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== recipeId)
      );

      toast.success("Recipe removed from favorites!");
    } catch (error) {
      console.error("Error removing recipe from favorites:", error);
      toast.error(error.message);
    }
  };

  const indexOfLastRecipe = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstRecipe = indexOfLastRecipe - ITEMS_PER_PAGE;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewRecipe = (id) => {
    navigate(`/recipes/${id}`);
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Your Favourite Recipes
      </h1>
      {recipes.length === 0 ? (
        <p className="text-center text-gray-500">You have no favorite recipes yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRecipes.map((recipe) => (
              <Card
                key={recipe._id}
                className="flex flex-col backdrop-blur-2xl bg-white/20"
              >
                <CardHeader className="p-0">
                  <img
                    src={recipe.recipePicture}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="flex-grow p-4">
                  <CardTitle className="text-xl mb-2">{recipe.title}</CardTitle>
                  <p className="text-black mb-4">{recipe.description}</p>
                  <div className="flex justify-between text-sm text-black">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {recipe.cookTime} Min
                    </span>
                    <span className="flex items-center">
                      <Utensils className="w-4 h-4 mr-1" />
                      {recipe.category}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button
                    className="w-full mr-2"
                    onClick={() => handleViewRecipe(recipe._id)}
                  >
                    View Recipe
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => removeFromFavorites(recipe._id)}
                  >
                    Remove from Favorites
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}