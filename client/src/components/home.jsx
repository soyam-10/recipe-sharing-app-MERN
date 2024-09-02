import { useCallback } from "react";
// import HeroCarousel from "./heroCarousel";
import { Navigate } from "react-router-dom";
import "../App.css";
import GridBg from "./gridBg";
import Dummy from "./dummy";

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
      <div className=" p-10">
        <div className="relative h-screen">
          <GridBg />
          {/* <HeroCarousel /> */}
          <Dummy />
        </div>
      </div>
    </>
  );
};

export default Home;
