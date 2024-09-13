import { useCallback, useState } from "react";
import HeroCarousel from "./heroCarousel";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import SearchRecipe from "./searchRecipe";

const Home = () => {
  // State for form values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();

    // Construct the mailto URL
    const subject = "Contact Us Form Submission";
    const body = `Name: ${name} Email: ${email} Message: ${message}`;
    const mailtoUrl = `mailto:sharmasoyam121@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Redirect to the mailto URL
    window.location.href = mailtoUrl;
  };

  const getUserSession = useCallback(() => {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  }, []);

  const session = getUserSession();

  if (!session) {
    toast.error("Please Login.");
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div>
        <SearchRecipe />
        <HeroCarousel />

        {/* Explore Recipes Section */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Explore Recipes</h2>
            <p className="text-lg mb-6">
              Discover a wide variety of recipes curated just for you. From
              appetizers to desserts, find your next favorite meal.
            </p>
            <Link to="/recipes">
              <Button className="text-white py-2 px-6 rounded-lg hover:bg-green-600">
                Explore Recipes
              </Button>
            </Link>
          </div>
        </section>

        <section className="relative h-screen">
          <img
            src="https://i.pinimg.com/originals/ba/34/89/ba3489b12c6b4af3efcbae3040c3861b.png"
            alt="chef image"
            className="w-full h-full object-contain"
          />
          <div className="backdrop-blur-sm absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {session.user.role === "cook"
                  ? "Create Your Own Recipe"
                  : "Join Us as a Cook"}
              </h1>
              <p className="text-xl text-white mb-6">
                {session.user.role === "cook"
                  ? "Unleash your culinary creativity and share your favorite recipes with the world."
                  : "Register as a cook to create your own recipe and share with the world."}
              </p>
              {session.user.role === "cook" ? (
                <Link to="/recipeManagement" className="pt-8 rounded-3xl">
                  <Button className="rounded-3xl">
                    Create Recipe <ChevronRight className="w-7 h-7 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register" className="pt-8 rounded-3xl">
                  <Button className="rounded-3xl">
                    Register as Cook <ChevronRight className="w-7 h-7 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-semibold text-white">Contact Us</h2>
            <p className="text-lg text-white mt-4">
              Have questions or feedback? We’d love to hear from you!
            </p>
          </div>
          <div className="flex justify-center">
            <form
              className="w-full max-w-lg p-8 bg-white/30 backdrop-blur-lg rounded-xl shadow-xl"
              onSubmit={handleSendMessage}
            >
              <label
                htmlFor="name"
                className="block text-lg text-gray-800 mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label
                htmlFor="email"
                className="block text-lg text-gray-800 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label
                htmlFor="message"
                className="block text-lg text-gray-800 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                placeholder="Your Message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Send Message
              </Button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
