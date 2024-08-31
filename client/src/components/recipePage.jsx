import { useState, useEffect } from "react";
import { Clock, Printer, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import { useParams } from "react-router-dom";

export default function RecipePage() {
    const { id } = useParams(); // Get recipe ID from URL
    const [recipe, setRecipe] = useState(null);
  
    useEffect(() => {
      async function fetchRecipe() {
        try {
          const response = await fetch(`http://localhost:5000/recipes/${id}`);
          const data = await response.json();
          if (data.success) {
            setRecipe(data.recipe);
          }
        } catch (error) {
          console.error("Error fetching recipe data:", error);
        }
      }
  
      fetchRecipe();
    }, [id]);
  
  // Display loading or error message if recipe data is not available
  if (!recipe) {
    return <div>Loading...</div>;
  }

  // Destructure recipe data
  const {
    title,
    recipePicture,
    cookTime,
    description,
    ingredients,
    instructions,
    tags,
    category,
    user,
    ratings,
    reviews,
    createdAt,
  } = recipe;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <Avatar>
          <AvatarFallback>{user[0]}</AvatarFallback>{" "}
          {/* Placeholder for user's initials */}
        </Avatar>
        <div>
          <p className="font-semibold">User {user}</p>
          <p className="text-sm text-muted-foreground">
            Created on: {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{cookTime} Minutes</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <img
            src={recipePicture}
            alt={title}
            className="w-full aspect-video object-cover h-auto rounded-lg"
          />
        </div>
      </div>

      <p className="text-muted-foreground mb-8">{description}</p>

      <Separator className="my-8 p-0.5" /> {/* Shadcn Separator for visual separation */}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <Separator className="my-8 p-0.5" /> {/* Shadcn Separator for visual separation */}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Category</h2>
        <p className="bg-gray-200 text-gray-800 py-1 px-3 w-fit rounded-full text-sm">
          {category}
        </p>
      </div>

      <Separator className="my-8 p-0.5" /> {/* Shadcn Separator for visual separation */}

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
          <ol className="list-decimal list-inside space-y-2">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ol>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-semibold">
                {ratings.length
                  ? (
                      ratings.reduce((a, b) => a + b, 0) / ratings.length
                    ).toFixed(1)
                  : "No ratings yet"}
              </span>
            </div>
          </div>
          <Button className="w-full mb-4">Review</Button>
          <div className="space-y-4">
            {reviews.length ? (
              reviews.map((review) => (
                <Card key={review._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{review.user[0]}</AvatarFallback>{" "}
                        {/* Placeholder for reviewer's initials */}
                      </Avatar>
                      <div>
                        <p className="font-semibold">User {review.user}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-auto flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-8 p-0.5" /> {/* Shadcn Separator for visual separation */}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
        <ol className="list-decimal list-inside space-y-4">
          {instructions.split("\n").map((step, index) => (
            step.trim() && (
              <li key={index} className="mt-2">
                {step}
              </li>
            )
          ))}
        </ol>
      </div>
    </div>
  );
}
