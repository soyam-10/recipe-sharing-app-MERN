import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CalendarIcon, Clock, User } from "lucide-react";

const recipes = [
  {
    title: "Spaghetti Carbonara",
    description: "A classic Italian pasta dish with eggs, cheese, and pancetta.",
    cookTime: "25 min",
    uploader: "Chef Mario",
    date: "2023-05-15",
    image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
  },
  {
    title: "Chicken Tikka Masala",
    description: "A flavorful Indian curry dish with tender chicken in a creamy tomato sauce.",
    cookTime: "40 min",
    uploader: "Chef Priya",
    date: "2023-06-22",
    image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
  },
  {
    title: "Avocado Toast",
    description: "A simple and nutritious breakfast with mashed avocado on toasted bread.",
    cookTime: "10 min",
    uploader: "Chef Emma",
    date: "2023-07-03",
    image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
  }
];

export default function HeroCarousel() {
  return (
    <Carousel className="w-full max-w-full mx-auto">
      <CarouselContent>
        {recipes.map((recipe, index) => (
          <CarouselItem key={index}>
            <Card className="border-none">
              <CardContent className="p-0">
                <div className="grid grid-cols-2 h-[400px]">
                  <div className="p-6 flex flex-col">
                    <h3 className="text-2xl font-bold mb-2">{recipe.title}</h3>
                    <p className="text-muted-foreground mb-4">{recipe.description}</p>
                    <Badge variant="secondary" className="mb-4">
                      <Clock className="mr-1 h-4 w-4" />
                      {recipe.cookTime}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <User className="mr-2 h-4 w-4" />
                      <span>{recipe.uploader}</span>
                      <CalendarIcon className="ml-4 mr-2 h-4 w-4" />
                      <span>{recipe.date}</span>
                    </div>
                    <Button>View Recipe</Button>
                  </div>
                  <div className="relative rounded-lg h-full">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
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
