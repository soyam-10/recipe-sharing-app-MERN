import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="p-6 md:py-10 w-full backdrop-blur-2xl bg-white/20 rounded-t-3xl md:rounded-t-full">
      <div className="container max-w-7xl flex justify-evenly flex-cols-1 sm:flex-cols-2 md:flex-cols-3 gap-5 text-sm">
        <div className="grid gap-1">
          <h3 className="font-semibold">Company</h3>
          <Link to="#">About Us</Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Products</h3>
          <Link to="/recipes">Recipes</Link>
          <Link to="#">Categories</Link>
          <Link to="#">Meal Plans</Link>
          <Link to="#">Grocery List</Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Contact</h3>
          <Link to="#">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}
