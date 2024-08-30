import { Link } from "react-router-dom";
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

export default function Navbar() {
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
            to="/categories"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Categories
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://scontent.fktm21-1.fna.fbcdn.net/v/t39.30808-6/449947667_1670914836992934_1837236409254361875_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=WT0QPEd5RH8Q7kNvgHrLBC0&_nc_ht=scontent.fktm21-1.fna&oh=00_AYD4sZpuBEX0EVVShNDremfTobX8pIC5AbPmljhjSoJJVw&oe=66D725D9"
                    alt="soyam profile picture"
                  />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Link to="/login">Logout</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
