import { useState, useEffect, useCallback } from "react";
import { ChefHat, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Fetch all users from the backend
const fetchAllUsers = async () => {
  try {
    const response = await fetch("http://localhost:5000/users/allUser");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.users; // Assuming the response structure is { success: true, users: [...] }
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    item: null,
  });

  // Define getUserSession with useCallback
  const getUserSession = useCallback(() => {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  }, []);

  const session = getUserSession();

  // Fetch user and recipe data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const fetchedUsers = await fetchAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
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
        toast.error(error.message);
      }
    };
    fetchData();
    fetchRecipes();
  }, []);

  const openDeleteModal = (type, item) => {
    setDeleteModal({ isOpen: true, type, item });
  };

  const closeModal = () => {
    setDeleteModal({ isOpen: false, type: null, item: null });
  };

  const handleDeleteRecipe = useCallback(
    async (id) => {
      if (!session?.token) {
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
        toast.loading("Deleting Recipe");
        setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
        toast.success("Recipe deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete recipe. Please try again.", error);
      }
    },
    [session]
  );

  const handleDeleteRecipesByUser = useCallback(
    async (id) => {
      if (!session?.token) {
        toast.error("You are not authorized to delete recipes.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/recipes/user/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to delete recipe");
        setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
        toast.success("Recipe deleted successfully.");
        window.location.reload();
      } catch (error) {
        toast.error("Failed to delete recipe. Please try again.", error);
      }
    },
    [session]
  );

  const handleDeleteUser = useCallback(
    async (user) => {
      if (!session?.token) {
        toast.error("You are not authorized to delete users.");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5000/users/${user._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );
        if (user.role == "cook") {
          handleDeleteRecipesByUser(user._id);
        }
        if (!response.ok) throw new Error("Failed to delete user");
        setUsers((prev) => prev.filter((user) => user._user._id !== user._id));
        toast.success("User deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete user. Please try again.", error);
      }
    },
    [handleDeleteRecipesByUser, session.token]
  );

  // Separate users into cook and normal
  const cookUsers = users.filter((user) => user.role === "cook");
  const normalUsers = users.filter((user) => user.role === "user");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex justify-start items-center gap-3">
          <ChefHat /> <span>Cook Users</span>
        </h2>
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cookUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Avatar className="w-8 h-8 border-4 border-primary">
                      <AvatarImage
                        src={user.profilePicture}
                        alt={user.fullName}
                      />
                      <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                        {user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "not found :("}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteModal("user", user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex justify-start items-center gap-3">
          <UserRound /> <span>Users (food enthusiast)</span>
        </h2>
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {normalUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Avatar className="w-8 h-8 border-4 border-primary">
                      <AvatarImage
                        src={user.profilePicture}
                        alt={user.fullName}
                      />
                      <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                        {user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "not found :("}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteModal("user", user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recipe Management</h2>
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipe Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes.map((recipe, index) => (
                <TableRow key={index}>
                  <TableCell>{recipe.title}</TableCell>
                  <TableCell>{recipe.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <img
                        src={recipe.userInfo.user.profilePicture}
                        alt={recipe.userInfo.user.fullName}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p>{recipe.userInfo.user.fullName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteModal("recipe", recipe)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <Dialog open={deleteModal.isOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {deleteModal.type === "user" ? "User" : "Recipe "}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the
              {deleteModal.type === "user" ? "user  " : "recipe "}
              {deleteModal.type === "user" ? (
                <>
                  <span className="font-bold text-lg">
                    {deleteModal.item?.fullName} ?.
                    <br />
                  </span>
                  <span>
                    Deleting the user will also delete the recipe/s uploaded by
                    them.{" "}
                  </span>
                </>
              ) : (
                <>
                  <span className="font-bold text-lg">
                    <br />
                    {deleteModal.item?.title} ? <br />
                  </span>
                </>
              )}
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteModal.type === "recipe" && deleteModal.item?._id) {
                  handleDeleteRecipe(deleteModal.item._id);
                } else if (
                  deleteModal.type === "user" &&
                  deleteModal.item?._id
                ) {
                  handleDeleteUser(deleteModal.item);
                }
                closeModal();
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
