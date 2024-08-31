import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Clock, ChevronRight, CookingPot } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "./loading";
import { useNavigate } from "react-router-dom";

export default function HeroCarousel() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:5000/recipes"); // Adjust the URL to match your backend route
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Fetch user info for each recipe
        const recipesWithUserInfo = await Promise.all(
          data.recipes.map(async (recipe) => {
            const userResponse = await fetch(
              `http://localhost:5000/users/${recipe.user}`
            );
            if (!userResponse.ok) {
              throw new Error("Failed to fetch user info");
            }
            const userInfo = await userResponse.json();
            return { ...recipe, userInfo };
          })
        );

        setRecipes(recipesWithUserInfo);
      } catch (error) {
        setError(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const navigate = useNavigate();

  const handleViewRecipe = (id) => {
    navigate(`/recipes/${id}`);
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Carousel className="w-[80%] mx-auto h-[500px]">
      <CarouselContent>
        {recipes.map((recipe, index) => (
          <CarouselItem key={index} className="h-full">
            <Card className="w-full h-full max-w-full mx-auto overflow-hidden rounded-3xl">
              <CardContent className="p-0 flex h-full">
                <div className="flex-1 bg-sky-50 p-8 flex flex-col justify-between">
                  <div>
                    <Badge
                      variant="outline"
                      className="mb-4 bg-white text-black font-normal py-1 px-3 rounded-full"
                    >
                      🍳 {recipe.category}
                    </Badge>
                    <h2 className="text-5xl font-bold mb-4 leading-tight">
                      {recipe.title}
                    </h2>
                    <p className="text-gray-600 mb-6">{recipe.description}</p>
                    <div className="flex space-x-4 mb-6">
                      <Badge
                        variant="secondary"
                        className="text-gray-700 bg-gray-200 rounded-full py-1 px-3"
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        {recipe.cookTime}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-gray-700 bg-gray-200 rounded-full py-1 px-3"
                      >
                        {recipe.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-gray-700 bg-gray-200 rounded-full py-1 px-3"
                          >
                            <CookingPot className="mr-1 h-4 w-4" />
                            <span key={index}>{tag}</span>
                          </Badge>
                        ))}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={recipe.userInfo.user.profilePicture}
                        alt={recipe.userInfo.user.fullName}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p>{recipe.userInfo.user.fullName}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(recipe.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      className="bg-black text-white rounded-full px-6 py-2 flex items-center"
                      onClick={() => handleViewRecipe(recipe._id)}
                    >
                      View Recipe
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 h-[500px]">
                  <img
                    src={recipe.recipePicture}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
