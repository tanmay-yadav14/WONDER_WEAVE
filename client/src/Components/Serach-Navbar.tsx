"use client"
import { User, Settings, BookmarkCheck, LogOut, Compass } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import Avatar from "./ui/avatar"

export function SearchNavbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/", { replace: true })
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4">
        {/* <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">WW</span>
            </div>
            <span className="font-bold text-xl text-foreground">Wonder Weave</span>
          </div>
        </div> */}
        <a href="#" className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-orange-500" />
          <span className="text-xl font-extrabold tracking-tight">
            Wonder Weave
          </span>
        </a>

        <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  )
}
