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

  if (loading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <Carousel className="w-full max-w-4xl max-h-[90%] ">
        <CarouselContent>
          {recipes.map((recipe, index) => (
            <CarouselItem
              key={index}
              className="h-[550px] md:h-fit sm:h-[400px] xs:h-[300px]"
            >
              <Card className="w-full h-full max-w-full mx-auto overflow-hidden rounded-3xl backdrop-blur-xl bg-white/20 border-2 border-gray-400">
                <CardContent className="p-0 flex flex-col md:flex-row h-full">
                  <div className="flex-1 p-8 bg-white/80 flex flex-col justify-between">
                    <div>
                      <Badge
                        variant="outline"
                        className="mb-4 text-black font-normal py-1 px-3 rounded-full"
                      >
                        🍳 {recipe.category}
                      </Badge>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                        {recipe.title}
                      </h2>
                      <p className="text-gray-600 mb-6 text-sm md:text-base">
                        {recipe.description}
                      </p>
                      <div className="flex flex-wrap gap-4 mb-6">
                        <Badge
                          variant="secondary"
                          className="text-gray-700 bg-gray-200 rounded-full py-1 px-3 text-xs"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          {recipe.cookTime}
                        </Badge>
                        {recipe.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-gray-700 bg-gray-200 rounded-full py-1 px-3 text-xs"
                          >
                            <CookingPot className="mr-1 h-4 w-4" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center">
                        <img
                          src={recipe.userInfo.user.profilePicture}
                          alt={recipe.userInfo.user.fullName}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium text-sm md:text-base">
                            {recipe.userInfo.user.fullName}
                          </p>
                          <p className="text-xs text-gray-600">
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
                        className="bg-black text-white rounded-full px-4 py-2 flex items-center text-xs md:text-sm"
                        onClick={() => handleViewRecipe(recipe._id)}
                      >
                        View Recipe
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <img
                      src={recipe.recipePicture}
                      alt={recipe.title}
                      className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] object-cover rounded-br-3xl"
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="border-2 border-gray-400 rounded-full" />
        <CarouselNext className="border-2 border-gray-400 rounded-full" />
      </Carousel>
    </div>
  );
}
