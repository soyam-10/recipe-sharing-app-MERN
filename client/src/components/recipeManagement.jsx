"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChefHat,
  MinusCircle,
  PlusCircle,
  Clock,
  Utensils,
  Tag,
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
// import { Separator } from "@/components/ui/separator";
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

export default function RecipeManagement() {
  const getUserSession = useCallback(() => {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  }, []);
  const session = getUserSession();
  const [recipes, setRecipes] = useState([]);
  const [recipe, setRecipe] = useState({
    title: "",
    recipePicture: "",
    cookTime: "",
    description: "",
    ingredients: [""],
    instructions: "",
    tags: [""],
    category: "",
    user: session.user.id,
  });
  const [errors, setErrors] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRecipes = useCallback(async () => {
    if (!session || !session.user || !session.token) {
      toast.error("Please log in to view your recipes.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/recipes/user/${session.user.id}`
      );
      if (response.status === 404) {
        return <div>No recipes added by you !</div>;
      }
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error("Error fetching recipe data:", error);
      toast.error("Failed to fetch recipes. Please try again.");
    }
  }, [session]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleDeleteRecipe = useCallback(
    async (id) => {
      const session = getUserSession();
      if (!session || !session.token) {
        toast.error("Please log in to delete recipes.");
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
        console.error("Error deleting recipe:", error);
        toast.error("Failed to delete recipe. Please try again.");
      }
    },
    [getUserSession]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setRecipe((prev) => ({ ...prev, ingredients: [...prev.ingredients, ""] }));
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const handleTagChange = (index, value) => {
    const newTags = [...recipe.tags];
    newTags[index] = value;
    setRecipe((prev) => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setRecipe((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  };

  const removeTag = (index) => {
    const newTags = recipe.tags.filter((_, i) => i !== index);
    setRecipe((prev) => ({ ...prev, tags: newTags }));
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
    if (!formErrors) {
      const session = getUserSession();
      if (!session || !session.token) {
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
        if (!response.ok) throw new Error("Failed to add recipe");
        const data = await response.json();
        setRecipes((prev) => [...prev, data.newRecipe]);
        setRecipe({
          title: "",
          recipePicture: "",
          cookTime: "",
          description: "",
          ingredients: [""],
          instructions: "",
          tags: [""],
          category: "",
          user: session.user.id,
        });
        setErrors({});
        setIsDialogOpen(false);
        toast.success("Recipe added successfully.");
        fetchRecipes();
      } catch (error) {
        console.error("Error submitting recipe:", error);
        toast.error("Failed to add recipe. Please try again.");
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
          <DialogContent
            className="max-w-4xl"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
          >
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold flex items-center">
                <ChefHat className="mr-2" /> Create a New Recipe
              </DialogTitle>
              <DialogDescription>
                Fill up the details to Add new recipe.
              </DialogDescription>
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
                        placeholder="Enter cook time"
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
                        placeholder="Enter category (e.g., breakfast)"
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
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="ingredients"
                      className="text-lg font-semibold flex items-center"
                    >
                      <Utensils className="mr-2" /> Ingredients
                    </Label>
                    {recipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Input
                          value={ingredient}
                          onChange={(e) =>
                            handleIngredientChange(index, e.target.value)
                          }
                          className="mr-2 flex-grow"
                          placeholder={`Ingredient ${index + 1}`}
                        />
                        <Button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          variant="outline"
                          className="text-red-500"
                        >
                          <MinusCircle />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={addIngredient}
                      variant="outline"
                      className="text-green-500"
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
                      className="text-lg font-semibold"
                    >
                      Instructions
                    </Label>
                    <Textarea
                      id="instructions"
                      name="instructions"
                      value={recipe.instructions}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="Enter cooking instructions"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="tags"
                      className="text-lg font-semibold flex items-center"
                    >
                      <Tag className="mr-2" /> Tags
                    </Label>
                    {recipe.tags.map((tag, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Input
                          value={tag}
                          onChange={(e) =>
                            handleTagChange(index, e.target.value)
                          }
                          className="mr-2 flex-grow"
                          placeholder={`Tag ${index + 1}`}
                        />
                        <Button
                          type="button"
                          onClick={() => removeTag(index)}
                          variant="outline"
                          className="text-red-500"
                        >
                          <MinusCircle />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="outline"
                      className="text-green-500"
                    >
                      <PlusCircle /> Add Tag
                    </Button>
                  </div>

                  <Button type="submit" className="w-full mt-6">
                    Save Recipe
                  </Button>
                </form>
              </ScrollArea>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes ? (
          recipes.map((recipe) => (
            <Card key={recipe._id} className="border border-gray-200">
              <CardHeader>
                <CardTitle>{recipe.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={recipe.recipePicture}
                  alt={recipe.title}
                  className="w-full h-40 object-cover"
                />
                <p className="mt-2">{recipe.description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleDeleteRecipe(recipe._id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div>
            <p>You have not added any recipe yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
