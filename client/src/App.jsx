import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/home";
import Register from "./components/register";
import { Toaster } from "sonner";
import Navbar from "./components/navbar";
import Login from "./components/login";
import Footer from "./components/footer";
import Recipes from "./components/recipes";
import Profile from "./components/profile";
import About from "./components/about";
import RecipePage from "./components/recipePage";
import RecipeManagement from "./components/recipeManagement";
import AdminPanel from "./components/AdminPanel";

function App() {
  const location = useLocation();
  const showNavbar = !["/login", "/register"].includes(location.pathname);

  return (
    <>
      <Toaster position="top-center" />
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipes/:id" element={<RecipePage />} />
        <Route path="/recipeManagement" element={<RecipeManagement />} />
        <Route path="/adminDashboard" element={<AdminPanel />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
