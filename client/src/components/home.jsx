import { useCallback } from "react";
import HeroCarousel from "./heroCarousel";
import { Navigate } from "react-router-dom";
import "../App.css";
import Recipes from "./dummy";

const Home = () => {
  const getUserSession = useCallback(() => {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  }, []);
  const session = getUserSession();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <div>
        <HeroCarousel />
        <Recipes />
      </div>
    </>
  );
};

export default Home;
