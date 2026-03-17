import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, X, Menu, User, Settings, BookmarkCheck, LogOut } from "lucide-react";
// import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./Button";
import Avatar from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";


export function Navbar() {

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(localStorage.getItem("token")));
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setMobileOpen(false);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") {
        setIsAuthenticated(Boolean(e.newValue));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/", { replace: true });
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-orange-500" />
          <span className="text-xl font-extrabold tracking-tight">
            Wonder Weave
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: "#", label: "Home" },
            { href: "#destinations", label: "Destinations" },
            { href: "#features", label: "Features" },
            { href: "#about", label: "About" },
            { href: "#contact", label: "Contact" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="relative text-sm font-medium text-gray-700 hover:text-orange-600"
            >
              {l.label}
            </a>
          ))}
        </nav>


        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <Link to="/AuthPage">
              <Button className="hidden md:inline-flex bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 text-white shadow-lg">
                Sign Up
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/SearchPage">
                <Button className="hidden md:inline-flex bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 text-white shadow-lg">
                  Search
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="hidden md:inline-flex">
                Logout
              </Button>
            </>
          )}
          {/* Replaced ThemeToggle with profile avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="relative h-10 w-10 rounded-full hover:bg-orange-50 transition-colors cursor-pointer flex items-center justify-center">
                <Avatar
                  src="/travel-user-avatar.jpg"
                  alt="Profile"
                  className="h-10 w-10 border-2 border-transparent bg-gradient-to-br from-orange-400 to-pink-400 p-0.5"
                  fallback={
                    <span className="bg-gradient-to-br from-orange-50 to-pink-50 text-orange-600 w-full h-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </span>
                  }
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 transition-colors">
                <Settings className="mr-2 h-4 w-4 text-orange-500" />
                <span>Update Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/saved')} className="cursor-pointer hover:bg-orange-50 transition-colors">
                <BookmarkCheck className="mr-2 h-4 w-4 text-orange-500" />
                <span>Saved Itinerary</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-destructive/10 text-destructive transition-colors">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden bg-transparent"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 bg-white/80 backdrop-blur ${mobileOpen ? "max-h-96" : "max-h-0"
          }`}
      >
        <div className="mx-auto grid w-full max-w-screen-2xl gap-2 px-4 py-4">
          {["Home", "Destinations", "Features", "About", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="py-2 font-medium hover:text-orange-600"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            )
          )}
          {!isAuthenticated ? (
            <Link to="/AuthPage">
              <Button className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 text-white shadow-lg">
                Sign Up
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/SearchPage">
                <Button className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 text-white shadow-lg">
                  Search
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
