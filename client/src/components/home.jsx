
import HeroCarousel from "./heroCarousel";
import RecipePage from "./recipePage";

const Home = () => {
  return (
    <>

      <div className="bg-slate-500 p-10">
        <HeroCarousel />
      </div>
      <RecipePage />
    </>
  );
};

export default Home;
