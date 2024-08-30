import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-muted p-6 md:py-12 w-full">
      <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 text-sm">
        <div className="grid gap-1">
          <h3 className="font-semibold">Company</h3>
          <Link to="#">About Us</Link>
          <Link to="#">Our Team</Link>
          <Link to="#">Careers</Link>
          <Link to="#">News</Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Products</h3>
          <Link to="#">Recipes</Link>
          <Link to="#">Categories</Link>
          <Link to="#">Meal Plans</Link>
          <Link to="#">Grocery List</Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Resources</h3>
          <Link to="#">Blog</Link>
          <Link to="#">Community</Link>
          <Link to="#">Support</Link>
          <Link to="#">FAQs</Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Contact</h3>
          <Link to="#">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}
