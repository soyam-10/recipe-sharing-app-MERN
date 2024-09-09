// SearchRecipes.js
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Loading from "./loading"; // Adjust path as needed
import { ChevronLeft, ChevronRight, Clock, Utensils } from "lucide-react";

const ITEMS_PER_PAGE = 9;

export default function SearchRecipe() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://backend-recipe-sharing-app-mern.vercel.app/recipes/search/recipe?query=${searchTerm}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          toast.error(`No recipes found related to ${searchTerm}`);
        }
      }
      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
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
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center space-x-4 mb-8">
        <Input
          type="text"
          placeholder="Search for a recipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-auto max-w-md"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentRecipes.length > 0
          ? currentRecipes.map((recipe) => (
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
                </CardFooter>
              </Card>
            ))
          : ""}
      </div>
      {totalPages > 1 && (
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
      )}
    </div>
  );
}
