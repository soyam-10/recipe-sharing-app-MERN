import { useState, useEffect } from "react";
import { Clock, Printer, Share2, Star, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import Loading from "./loading";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export default function RecipePage() {
  const { id } = useParams(); // Get recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  // const [rating, setRating] = useState(1);
  const [userInfo, setUserInfo] = useState(null); // State to store user information

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await fetch(`http://localhost:5000/recipes/${id}`);
        const data = await response.json();
        if (data.success) {
          setRecipe(data.recipe);

          // Fetch user info based on recipe user ID
          const userResponse = await fetch(
            `http://localhost:5000/users/${data.recipe.user}`
          );
          const userData = await userResponse.json();
          if (userData.success) {
            setUserInfo(userData.user); // Assuming the API returns a 'user' object
          }
        }
      } catch (error) {
        console.error("Error fetching recipe or user data:", error);
      }
    }

    fetchRecipe();
  }, [id]);

  // Display loading or error message if recipe or user data is not available
  if (!recipe || !userInfo) {
    return (
      <div>
        <Loading />
      </div>
    );
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
    ratings,
    reviews,
    createdAt,
  } = recipe;

  // Destructure user data
  const { fullName, profilePicture } = userInfo;

  // Calculate the average rating
  const averageRating = ratings.length
    ? (
        ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length
      ).toFixed(1)
    : "No ratings yet";

  // Function to get the rating for a specific review
  const getRatingForReview = (userId) => {
    const ratingEntry = ratings.find((rating) => rating.user === userId);
    return ratingEntry ? ratingEntry.rating : null;
  };

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
          <img
            src={profilePicture}
            alt={fullName}
            className="w-10 h-10 rounded-full"
          />
          <AvatarFallback>{fullName ? fullName[0] : "U"}</AvatarFallback>{" "}
          {/* Fallback for user's initials */}
        </Avatar>
        <div>
          <p className="font-semibold">{fullName}</p>
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
      <Separator className="my-8 p-0.5" />{" "}
      <p className="text-muted-foreground mb-8">{description}</p>
      <Separator className="my-8 p-0.5" />{" "}
      {/* Shadcn Separator for visual separation */}
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
      <Separator className="my-8 p-0.5" />{" "}
      {/* Shadcn Separator for visual separation */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Category</h2>
        <p className="bg-gray-200 text-gray-800 py-1 px-3 w-fit rounded-full text-sm">
          {category}
        </p>
      </div>
      <Separator className="my-8 p-0.5" />{" "}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
        <ol className="list-decimal list-inside space-y-2">
          {ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ol>
      </div>
      <Separator className="my-8 p-0.5" />{" "}
      {/* Shadcn Separator for visual separation */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
        <ul className="list-decimal list-inside space-y-4">
          {instructions.split("\n").map(
            (step, index) =>
              step.trim() && (
                <li key={index} className="mt-2">
                  {step}
                </li>
              )
          )}
        </ul>
      </div>
      <Separator className="my-8 p-0.5" />{" "}
      {/* Shadcn Separator for visual separation */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Reviews
          <span className="ml-4 text-xl font-semibold text-yellow-600">
            {averageRating} {averageRating === "No ratings yet" ? "" : "/ 5"}
          </span>
        </h2>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Rate and Review</CardTitle>
            <CardDescription>
              Share your thoughts on this recipe with a star rating and review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="rating">Rating</Label>
              <RadioGroup
                id="rating"
                defaultValue="3"
                className="flex items-center gap-2"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <Label
                    key={index + 1}
                    htmlFor={`rating-${index + 1}`}
                    className="cursor-pointer [&:has(:checked)]:text-primary"
                  >
                    <RadioGroupItem
                      id={`rating-${index + 1}`}
                      value={(index + 1).toString()}
                    />
                    <StarIcon className="w-6 h-6 fill-primary" />
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Review</Label>
              <Textarea
                id="review"
                placeholder="Share your thoughts on the recipe..."
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </CardFooter>
        </Card>

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
                      <p className="font-semibold">{review.user}</p>
                    </div>
                    <div className="ml-auto flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= getRatingForReview(review.user)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">{review.review}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
