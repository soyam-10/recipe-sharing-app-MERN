"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChefHat,
  MinusCircle,
  PlusCircle,
  Clock,
  Utensils,
  ChevronsLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const initialRecipeState = {
  title: "",
  recipePicture: "",
  cookTime: "",
  description: "",
  ingredients: [""],
  instructions: "",
  tags: [""],
  category: "",
  user: "",
};

export default function RecipeManagement() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [recipe, setRecipe] = useState(initialRecipeState);
  const [errors, setErrors] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getUserSession = useCallback(() => {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  }, []);

  const session = useMemo(() => getUserSession(), [getUserSession]);

  useEffect(() => {
    if (session?.user?.id) {
      setRecipe((prev) => ({ ...prev, user: session.user.id }));
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.role !== "cook" && session?.user?.role !== "admin") {
      toast.error("You are not authorized to view this page.");
      navigate("/login");
      return;
    }
  }, [session, navigate]);

  const fetchRecipes = useCallback(async () => {
    if (!session?.user?.id || !session?.token) {
      toast.error("Please log in to view your recipes.");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/recipes/user/${session.user.id}`
      );

      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (responseBody.recipes.length === 0) {
        setRecipes([]);
      } else {
        setRecipes(responseBody.recipes);
      }
    } catch (error) {
      console.error("Error fetching recipe data:", error);
      toast.error("Failed to fetch recipes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, session]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleDeleteRecipe = useCallback(
    async (id) => {
      if (!session?.token) {
        if (session.user.role !== "admin" || session.user.role !== "cook") {
          toast.error("You are not authorized to delete recipes.");
        }
        toast.error("You are not authorized to delete recipes.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/recipes/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to delete recipe");
        setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
        toast.success("Recipe deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete recipe. Please try again.", error);
      }
    },
    [session]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, value, field) => {
    setRecipe((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setRecipe((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (index, field) => {
    setRecipe((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!recipe.title) newErrors.title = "Title is required";
    if (recipe.ingredients.some((ing) => !ing))
      newErrors.ingredients = "All ingredients must be filled";
    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (formErrors) {
      setErrors(formErrors);
      return;
    }

    if (!session?.token) {
      toast.error("Please log in to add recipes.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(recipe),
      });
      if (response.status === 403) {
        throw new Error("Forbidden. You are not authorized to add recipes.");
      }
      if (!response.ok) {
        throw new Error("Failed to add recipe");
      }
      const data = await response.json();
      setRecipes((prev) => [...prev, data.newRecipe]);
      setRecipe({ ...initialRecipeState, user: session.user.id });
      setErrors({});
      setIsDialogOpen(false);
      toast.success("Recipe added successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to add recipe. Please try again.");
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Link to="/profile">
          <Button>
            <ChevronsLeft size={40} strokeWidth={3} />
            <span>Back to Profile</span>
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-4">Recipe Management</h1>
        <p className="text-muted-foreground mb-8">
          View, edit, and manage your recipes.
        </p>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Recipes</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add new recipe</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold flex items-center">
                  <ChefHat className="mr-2" /> Create a New Recipe
                </DialogTitle>
                <DialogDescription>
                  Fill up the details to add a new recipe.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[80vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="title" className="text-lg font-semibold">
                        Recipe Title
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={recipe.title}
                        onChange={handleChange}
                        required
                        className="mt-1"
                        placeholder="Enter recipe title"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="recipePicture"
                        className="text-lg font-semibold"
                      >
                        Recipe Picture URL
                      </Label>
                      <Input
                        id="recipePicture"
                        name="recipePicture"
                        value={recipe.recipePicture}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Enter image URL"
                      />
                      {recipe.recipePicture && (
                        <div className="mt-2">
                          <img
                            src={recipe.recipePicture}
                            alt="Recipe Preview"
                            className="w-40 h-40 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <Label
                        htmlFor="cookTime"
                        className="text-lg font-semibold flex items-center"
                      >
                        <Clock className="mr-2" /> Cook Time (minutes)
                      </Label>
                      <Input
                        id="cookTime"
                        name="cookTime"
                        type="number"
                        value={recipe.cookTime}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Enter cook time in minutes"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="category"
                        className="text-lg font-semibold"
                      >
                        Category
                      </Label>
                      <Input
                        id="category"
                        name="category"
                        value={recipe.category}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Enter category"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="description"
                      className="text-lg font-semibold"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={recipe.description}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="Enter recipe description"
                      rows="3"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-semibold">Ingredients</Label>
                    {recipe.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 mb-2"
                      >
                        <Input
                          type="text"
                          value={ingredient}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              e.target.value,
                              "ingredients"
                            )
                          }
                          placeholder="Ingredient"
                          className="flex-grow"
                        />
                        <Button
                          type="button"
                          onClick={() => removeArrayItem(index, "ingredients")}
                          variant="outline"
                          size="sm"
                        >
                          <MinusCircle />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => addArrayItem("ingredients")}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <PlusCircle /> Add Ingredient
                    </Button>
                    {errors.ingredients && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.ingredients}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="instructions"
                      className="text-lg font-semibold flex items-center"
                    >
                      <Utensils className="mr-2" /> Instructions
                    </Label>
                    <Textarea
                      id="instructions"
                      name="instructions"
                      value={recipe.instructions}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="Enter cooking instructions"
                      rows="5"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-semibold">Tags</Label>
                    {recipe.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 mb-2"
                      >
                        <Input
                          type="text"
                          value={tag}
                          onChange={(e) =>
                            handleArrayChange(index, e.target.value, "tags")
                          }
                          placeholder="Tag"
                          className="flex-grow"
                        />
                        <Button
                          type="button"
                          onClick={() => removeArrayItem(index, "tags")}
                          variant="outline"
                          size="sm"
                        >
                          <MinusCircle />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => addArrayItem("tags")}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <PlusCircle /> Add Tag
                    </Button>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isLoading ? "Submitting" : "Submit"}
                    </Button>
                  </div>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card key={recipe._id} className="border border-gray-200 p-4">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    {recipe.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={recipe.recipePicture}
                    alt={recipe.title}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <p className="mb-2">{recipe.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {recipe.cookTime} minutes
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {recipe.category}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => handleDeleteRecipe(recipe._id)}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => navigate(`/recipes/${recipe._id}`)}
                      variant="outline"
                      size="sm"
                    >
                      View Recipe
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </>
  );
}
