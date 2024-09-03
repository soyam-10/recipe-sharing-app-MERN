import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react"; // Import Heart icon
import { useNavigate } from "react-router-dom";
import Loading from "./loading";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 9;

export default function Recipes() {
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
    const fetchRecipes = async () => {
      try {
        if (!session) {
          navigate("/login");
        } else {
          const response = await fetch("http://localhost:5000/recipes"); // Adjust the URL to match your backend route
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setRecipes(data.recipes);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [navigate, session]);

  const addToFavorites = async (recipeId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/users/addToFav/${session.user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({ recipeId }),
        }
      );

      // Log the request and response for debugging
      console.log("Request Payload:", JSON.stringify({ recipeId }));
      const responseData = await response.json();
      console.log("Response Data:", responseData);

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Recipe is already in favorites");
        } else {
          toast.error("An error occurred");
        }
      } else {
        toast.success("Recipe added to favorites!");
      }
    } catch (error) {
      console.error("Error adding recipe to favorites:", error);
      toast.error("An error occurred.");
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
    navigate(`/recipes/${id}`); // Navigate to the recipe detail page with the recipe ID
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Recipes</h1>
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
                variant="ghost"
                onClick={() => addToFavorites(recipe._id)}
              >
                <Heart className="w-5 h-5" />
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
    </div>
  );
}
