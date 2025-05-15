import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, User, BookMarked, LogOut, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';

// Define user interface based on what's being used in the component
interface UserType {
  name?: string;
  avatar?: string;
}

// Define Auth context interface
interface AuthContextType {
  user: UserType | null;
}

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { user } = useAuth() as AuthContextType;
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-zinc-900/90 border-b border-zinc-800/50 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-900/20">
            <span className="text-white text-xl font-bold">B</span>
          </div>
          <h2 className="text-2xl font-bold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">BookNest</h2>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard" className="text-white hover:text-purple-400 transition-colors duration-200 font-medium">Home</Link>
          <Link to="/books" className="text-white hover:text-purple-400 transition-colors duration-200 font-medium">Books</Link>
          <Link to="/categories" className="text-white hover:text-purple-400 transition-colors duration-200 font-medium">Categories</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 bg-zinc-800/60 hover:bg-zinc-700/60 transition-colors duration-200 rounded-full pr-4 pl-1 py-1">
                    <Avatar className="h-8 w-8 border-2 border-purple-500">
                      <AvatarImage src={user?.avatar || "/api/placeholder/40/40"} />
                      <AvatarFallback className="bg-purple-800 text-white">{user.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-zinc-300">{user.name || 'User'}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mr-4 bg-zinc-900 border border-zinc-800 text-zinc-300">
                  <DropdownMenuLabel className="text-purple-400">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-zinc-800 hover:text-purple-300 cursor-pointer">
                    <User size={16} className="mr-2" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/mybooks')} className="hover:bg-zinc-800 hover:text-purple-300 cursor-pointer">
                    <BookMarked size={16} className="mr-2" />
                    <span>My Books</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/notifications')} className="hover:bg-zinc-800 hover:text-purple-300 cursor-pointer">
                    <Bell size={16} className="mr-2" />
                    <span>Notifications</span> 
                    <span className="ml-auto bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">3</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem onClick={() => navigate('/logout')} className="text-red-400 hover:bg-red-900/30 hover:text-red-300 cursor-pointer">
                    <LogOut size={16} className="mr-2" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button 
              onClick={() => navigate('/signin')} 
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-md shadow-purple-900/20 hover:shadow-lg transition-all duration-300 text-white"
            >
              Sign In
            </Button>
          )}
          <button className="md:hidden text-white p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <MenuIcon size={20} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 mt-2 py-3">
          <div className="container mx-auto flex flex-col space-y-3">
            <Link to="/dashboard" className="text-white hover:text-purple-400 px-4 py-2 hover:bg-zinc-800 rounded-lg">Home</Link>
            <Link to="/books" className="text-white hover:text-purple-400 px-4 py-2 hover:bg-zinc-800 rounded-lg">Books</Link>
            <Link to="/categories" className="text-white hover:text-purple-400 px-4 py-2 hover:bg-zinc-800 rounded-lg">Categories</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;