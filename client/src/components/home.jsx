import { useCallback } from "react";
import HeroCarousel from "./heroCarousel";
import { Navigate } from "react-router-dom";

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
      <div className="bg-slate-500 p-10">
        <HeroCarousel />
      </div>
    </>
  );
};

export default Home;
