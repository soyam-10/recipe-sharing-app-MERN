import { useEffect } from "react";
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
import { Flame } from "lucide-react";
import { useAtom } from "jotai";
import { sessionAtom } from "@/atoms/session";

export default function Navbar() {
  const [session, setSession] = useAtom(sessionAtom);
  const navigate = useNavigate();

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

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="h-6 w-6" />
            <span className="text-lg font-semibold">Hamro Recipe</span>
          </Link>
        </div>
        <nav className="flex items-center gap-6">
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
        <div className="flex items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        session.user.profilePicture || "https://github.com/shadcn.png"
                      }
                      alt={session.user.fullName}
                    />
                    <AvatarFallback>{(session.user.fullName).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  {session.user.fullName.toUpperCase()}
                </DropdownMenuItem>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
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
    </header>
  );
}
