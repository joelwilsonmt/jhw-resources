import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { useTheme } from '@/components/ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const isDark = theme === 'dark' || (theme === 'system' && 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center space-x-3 bg-muted/50 rounded-full px-4 py-2 border border-border/50">
      <Label 
        htmlFor="theme-toggle" 
        className="flex items-center space-x-3 cursor-pointer"
      >
        <Sun 
          className={`h-5 w-5 transition-all duration-200 ${
            isDark 
              ? 'text-muted-foreground scale-90 opacity-60' 
              : 'text-amber-500 scale-100 opacity-100 drop-shadow-sm'
          }`} 
        />
        <Switch
          id="theme-toggle"
          checked={isDark}
          onCheckedChange={handleToggle}
          aria-label="Toggle between light and dark mode"
          className="data-[state=checked]:bg-slate-800 data-[state=unchecked]:bg-amber-200 border-2"
        />
        <Moon 
          className={`h-5 w-5 transition-all duration-200 ${
            isDark 
              ? 'text-blue-300 scale-100 opacity-100 drop-shadow-sm' 
              : 'text-muted-foreground scale-90 opacity-60'
          }`} 
        />
      </Label>
    </div>
  );
}