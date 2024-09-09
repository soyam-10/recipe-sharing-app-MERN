import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Flame, Menu, X } from "lucide-react"; // Import hamburger icons
import { useAtom } from "jotai";
import { sessionAtom } from "@/atoms/session";

export default function Navbar() {
  const [session, setSession] = useAtom(sessionAtom);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Retrieve session from localStorage on mount
    const storedSession = localStorage.getItem("session");
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }
  }, [setSession]);

  const handleLogout = () => {
    // Clear session from localStorage
    localStorage.removeItem("session");
    // Update session atom
    setSession(null);
    // Redirect to login page
    navigate("/login");
  };

  const navigateToProfile = () => {
    navigate("/profile");
  };
  const navigateToAdmin = () => {
    navigate("/adminDashboard");
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/20 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="h-6 w-6" />
            <span className="text-lg font-semibold">Hamro Recipe</span>
          </Link>
        </div>

        {/* Hamburger Menu Button for Mobile Screens */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Navigation Menu for Desktop */}
        <nav className={`hidden md:flex items-center gap-6`}>
          <Link
            to="/"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="/recipes"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Recipes
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
          <Link
            to="/profile"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Profile
          </Link>
        </nav>

        {/* User Menu for Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.profilePicture}
                      alt={session.user.fullName}
                    />
                    <AvatarFallback>
                      {session.user.fullName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-semibold">
                  {session.user.fullName.toUpperCase()}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={navigateToProfile}>
                  Profile
                </DropdownMenuItem>
                {session.user.role === "admin" ? (
                  <DropdownMenuItem onClick={navigateToAdmin}>
                    Dashboard
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <nav className={`md:hidden ${isMenuOpen ? "block" : "hidden"} p-4`}>
        <Link
          to="/"
          className="block text-sm font-medium text-foreground transition-colors hover:text-primary mb-2"
        >
          Home
        </Link>
        <Link
          to="/recipes"
          className="block text-sm font-medium text-foreground transition-colors hover:text-primary mb-2"
        >
          Recipes
        </Link>
        <Link
          to="/about"
          className="block text-sm font-medium text-foreground transition-colors hover:text-primary mb-2"
        >
          About
        </Link>
        <Link
          to="/profile"
          className="block text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          Profile
        </Link>
        {session ? (
          <>
            {session.user.role === "admin" && (
              <Link
                to="/adminDashboard"
                className="block text-sm font-medium text-foreground transition-colors hover:text-primary mb-2"
              >
                Dashboard
              </Link>
            )}
            <button
              className="block text-sm font-medium text-foreground transition-colors hover:text-primary"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <Button className="w-full">Login</Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
