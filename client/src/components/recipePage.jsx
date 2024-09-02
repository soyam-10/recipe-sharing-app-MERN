import { useState, useEffect, useCallback } from "react";
import { Clock, Printer, Share2, Star, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { toast } from "sonner";

export default function RecipePage() {
  const { id } = useParams(); // Get recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState("3");
  const [review, setReview] = useState("");

  const getUserSession = useCallback(() => {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  }, []);

  const session = getUserSession();

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

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const submitRatingAndReview = async () => {
    try {
      // Replace with actual user ID or retrieve from authentication context
      const user = session.user.id;

      // Submit rating
      await fetch(`http://localhost:5000/recipes/${id}/rating`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ user, rating: parseInt(rating) }),
      });

      // Submit review
      await fetch(`http://localhost:5000/recipes/${id}/review`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ user, review }),
      });

      toast.success("Rating and review submitted successfully!");
      setRating("3");
      setReview("");

      // Refresh recipe data to show the new rating and review
      const response = await fetch(`http://localhost:5000/recipes/${id}`);
      const data = await response.json();
      if (data.success) {
        setRecipe(data.recipe);
      }
    } catch (error) {
      console.error("Error submitting rating and review:", error);
      toast.error("Failed to submit rating and review.");
    }
  };

  // Display loading or error message if recipe data is not available
  if (!recipe) {
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
  const { fullName, profilePicture } = recipe.user;

  // Calculate the average rating
  const averageRating = ratings.length
    ? (
        ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length
      ).toFixed(1)
    : "No ratings yet";

  // Function to get the rating for a specific review
  const getRatingForReview = (userId) => {
    const ratingEntry = ratings.find((rating) => rating.user._id === userId);
    return ratingEntry ? ratingEntry.rating : null;
  };

  return (
    <>
      <div className="container mx-auto px-4 text-white py-8 max-w-4xl">
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
            <AvatarFallback>{fullName ? fullName[0] : "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{fullName}</p>
            <p className="text-sm">
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
        <p className="mb-8">{description}</p>
        <Separator className="my-8 p-0.5" />
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
        <Separator className="my-8 p-0.5" />
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Category</h2>
          <p className="bg-gray-200 text-gray-800 py-1 px-3 w-fit rounded-full text-sm">
            {category}
          </p>
        </div>
        <Separator className="my-8 p-0.5" />
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
          <ol className="list-decimal list-inside space-y-2">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ol>
        </div>
        <Separator className="my-8 p-0.5" />
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
        <Separator className="my-8 p-0.5" />
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Total Ratings
            <span className="ml-4 text-xl font-semibold text-yellow-500">
              {averageRating} {averageRating === "No ratings yet" ? "Not rated yet" : "/ 5"}
            </span>
          </h2>
          <div className="flex justify-center items-center">
            <Card className="w-full max-w-md backdrop-blur-3xl bg-white/20 text-white">
              <CardHeader>
                <CardTitle>Rate and Review</CardTitle>
                <CardDescription className="text-white">
                  Share your thoughts on this recipe with a star rating and
                  review.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="rating">Rating</Label>
                  <RadioGroup
                    id="rating"
                    defaultValue={rating}
                    onValueChange={handleRatingChange}
                    className="ml-1 flex items-center gap-2"
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <Label
                        key={index + 1}
                        htmlFor={`rating-${index + 1}`}
                        className="ml-2 cursor-pointer [&:has(:checked)]:text-primary"
                      >
                        <RadioGroupItem
                          id={`rating-${index + 1}`}
                          value={(index + 1).toString()}
                          className="text-yellow-500 h-5 w-5"
                        />
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="review">Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Write your review here..."
                    value={review}
                    onChange={handleReviewChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={submitRatingAndReview}>Submit</Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <Separator className="my-8 p-0.5" />
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">User Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center space-x-4 mb-2">
                  <Avatar>
                    <AvatarImage
                      src={review.user.profilePicture}
                      alt={review.user.fullName}
                    />
                    <AvatarFallback>{review.user.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{review.user.fullName}</p>
                    <div className="flex items-center">
                      {Array.from(
                        { length: getRatingForReview(review.user._id) || 0 },
                        (_, index) => (
                          <StarIcon
                            key={index}
                            className="h-4 w-4 text-yellow-500 fill-current"
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
                <p>{review.review}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
