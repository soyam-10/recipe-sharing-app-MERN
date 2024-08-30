import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle, ChefHat, Clock, Tag, Utensils } from 'lucide-react';

export default function AddRecipeForm() {
  const [recipe, setRecipe] = useState({
    title: '',
    recipePicture: '',
    cookTime: '',
    description: '',
    ingredients: [''],
    instructions: '',
    tags: [''],
    category: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const handleTagChange = (index, value) => {
    const newTags = [...recipe.tags];
    newTags[index] = value;
    setRecipe(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setRecipe(prev => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTag = (index) => {
    const newTags = recipe.tags.filter((_, i) => i !== index);
    setRecipe(prev => ({ ...prev, tags: newTags }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!recipe.title) newErrors.title = 'Title is required';
    if (recipe.ingredients.some(ing => !ing)) newErrors.ingredients = 'All ingredients must be filled';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      console.log('Form submitted:', recipe);
      // Here you would typically send the data to your backend
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
          <CardTitle className="text-3xl font-bold flex items-center">
            <ChefHat className="mr-2" />
            Create a New Recipe
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="title" className="text-lg font-semibold">Recipe Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={recipe.title}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Enter recipe title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <Label htmlFor="recipePicture" className="text-lg font-semibold">Recipe Picture URL</Label>
                <Input
                  id="recipePicture"
                  name="recipePicture"
                  value={recipe.recipePicture}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Enter image URL"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="cookTime" className="text-lg font-semibold flex items-center">
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
                <Label htmlFor="category" className="text-lg font-semibold flex items-center">
                  <Utensils className="mr-2" /> Category
                </Label>
                <Input
                  id="category"
                  name="category"
                  value={recipe.category}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Enter recipe category"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-lg font-semibold">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={recipe.description}
                onChange={handleChange}
                className="mt-1"
                placeholder="Describe your recipe"
                rows={3}
              />
            </div>

            <Separator />

            <div>
              <Label className="text-lg font-semibold mb-2 block">Ingredients</Label>
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    className="flex-grow"
                    placeholder={`Ingredient ${index + 1}`}
                    required
                  />
                  <Button 
                    type="button" 
                    onClick={() => removeIngredient(index)} 
                    variant="ghost"
                    className="ml-2"
                  >
                    <MinusCircle className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addIngredient} variant="outline" className="mt-2">
                <PlusCircle className="h-5 w-5 mr-2" /> Add Ingredient
              </Button>
              {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
            </div>

            <div>
              <Label htmlFor="instructions" className="text-lg font-semibold">Instructions</Label>
              <Textarea
                id="instructions"
                name="instructions"
                value={recipe.instructions}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter cooking instructions"
                rows={5}
              />
            </div>

            <Separator />

            <div>
              <Label className="text-lg font-semibold mb-2 flex items-center">
                <Tag className="mr-2" /> Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                    <Input
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="border-none bg-transparent p-0 w-auto"
                      placeholder="Enter tag"
                    />
                    <Button 
                      type="button" 
                      onClick={() => removeTag(index)} 
                      variant="ghost"
                      className="ml-1 p-0"
                    >
                      <MinusCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addTag} variant="outline" className="rounded-full">
                  <PlusCircle className="h-4 w-4 mr-1" /> Add Tag
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition duration-300">
              Create Recipe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
