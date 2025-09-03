import { Link } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/DropdownMenu';

interface DropdownItem {
  to: string;
  label: string;
}

interface NavigationDropdownProps {
  label: string;
  items: DropdownItem[];
}

export function NavigationDropdown({ label, items }: NavigationDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors focus:outline-none cursor-pointer">
        {label}
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-primary-foreground !bg-primary">
        {items.map(item => (
          <DropdownMenuItem key={item.to} asChild>
            <Link
              to={item.to}
              className="w-full hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
