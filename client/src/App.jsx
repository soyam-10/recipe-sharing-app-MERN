import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import { Toaster } from "sonner";
import Navbar from "./components/navbar";
import Login from "./components/login";
import Footer from "./components/footer";
import Recipes from "./components/recipes";
import Profile from "./components/profile";
import About from "./components/about";

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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
