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

const recipes = [
  {
    title: "Spaghetti Carbonara",
    description:
      "A classic Italian pasta dish with eggs, cheese, and pancetta.",
    cookTime: "25 min",
    uploader: "Chef Mario",
    tags: ["non-veg", "Italian"],
    category: "Main Course",
    date: "2023-05-15",
    image:
      "https://allforpizza.com/wp-content/uploads/2022/07/1460A7EC-CF3B-40E8-B05F-A21E12E85EC6.jpeg",
  },
  {
    title: "Chicken Tikka Masala",
    description:
      "A flavorful Indian curry dish with tender chicken in a creamy tomato sauce.",
    cookTime: "40 min",
    uploader: "Chef Priya",
    tags: ["non-veg", "Indian"],
    category: "Main Course",
    date: "2023-06-22",
    image:
      "https://allforpizza.com/wp-content/uploads/2022/07/1460A7EC-CF3B-40E8-B05F-A21E12E85EC6.jpeg",
  },
  {
    title: "Avocado Toast",
    description:
      "A simple and nutritious breakfast with mashed avocado on toasted bread.",
    cookTime: "10 min",
    uploader: "Chef Emma",
    tags: ["veg", "Breakfast"],
    category: "Breakfast",
    date: "2023-07-03",
    image:
      "https://scontent.fktm21-1.fna.fbcdn.net/v/t39.30808-6/449947667_1670914836992934_1837236409254361875_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=WT0QPEd5RH8Q7kNvgE0RahX&_nc_ht=scontent.fktm21-1.fna&oh=00_AYB8n22LmRLJBjmwDPDDgIg6W-h3CVtidV5z_ji5hgC3ZQ&oe=66D75E19",
  },
];

export default function HeroCarousel() {
  return (
    <Carousel className="w-[80%] mx-auto h-[500px]">
      {" "}
      {/* Set a fixed height for the carousel */}
      <CarouselContent>
        {recipes.map((recipe, index) => (
          <CarouselItem key={index} className="h-full">
            {" "}
            {/* Ensure each item takes the full height */}
            <Card className="w-full h-full max-w-full mx-auto overflow-hidden rounded-3xl">
              <CardContent className="p-0 flex h-full">
                {" "}
                {/* Ensure CardContent takes the full height */}
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
                        src="https://github.com/shadcn.png"
                        alt={recipe.uploader}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-semibold">{recipe.uploader}</p>
                        <p className="text-sm text-gray-600">{recipe.date}</p>
                      </div>
                    </div>
                    <Button className="bg-black text-white rounded-full px-6 py-2 flex items-center">
                      View Recipe
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 h-[500px]">
                  <img
                    src={recipe.image}
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
