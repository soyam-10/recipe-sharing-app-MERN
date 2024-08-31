
import HeroCarousel from "./heroCarousel";
import RecipeManagement from "./recipeManagement";

const Home = () => {
  return (
    <>

      <div className="bg-slate-500 p-10">
        <HeroCarousel />
      </div>

      <RecipeManagement />
    </>
  );
};

export default Home;
