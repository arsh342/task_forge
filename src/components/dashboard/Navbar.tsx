import { Menu, Bell, Search, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex h-16 items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-neutral-100"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex-1 flex items-center gap-4 ml-4">
          <form className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search tasks..."
                className="pl-8 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-neutral-100 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-600 rounded-full" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-neutral-100"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback>
                    {user?.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              align="end"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}