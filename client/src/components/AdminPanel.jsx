import { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";
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

// Fetch recipes from the backend
const fetchRecipes = async () => {
  try {
    const response = await fetch("http://localhost:5000/recipes");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
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

        // Fetch recipes
        const fetchedRecipes = await fetchRecipes();
        setRecipes(fetchedRecipes.recipes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const openDeleteModal = (type, item) => {
    setDeleteModal({ isOpen: true, type, item });
  };

  const closeModal = () => {
    setDeleteModal({ isOpen: false, type: null, item: null });
  };

  const handleDelete = () => {
    // Implement delete logic here
    console.log("Deleting item:", deleteModal.item);
    closeModal();
  };

  // Separate users into cook and normal
  const cookUsers = users.filter((user) => user.role === "cook");
  const normalUsers = users.filter((user) => user.role === "user");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Cook Users</h2>
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
                  <TableCell>{user.createdAt}</TableCell>
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
        <h2 className="text-2xl font-semibold mb-4">Normal Users</h2>
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
                  <TableCell>{user.createdAt}</TableCell>
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
                  <TableCell>{recipe.author}</TableCell>
                  <TableCell>{recipe.dateCreated}</TableCell>
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
              Delete {deleteModal.type === "user" ? "User" : "Recipe"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the{" "}
              {deleteModal.type === "user" ? "user" : "recipe"}{" "}
              {deleteModal.type === "user"
                ? deleteModal.item?.username
                : deleteModal.item?.title}
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
