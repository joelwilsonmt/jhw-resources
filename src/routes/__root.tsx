import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NavigationDropdown } from '@/components/NavigationDropdown';
import { DottedBackground } from '@/components/DottedBackground';
import { Toaster } from 'sonner';
import siteConfig from '@/config/site.json';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 relative">
      <DottedBackground />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex h-14 items-center justify-between px-6 max-w-none">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-lg font-semibold hover:text-primary transition-colors"
            >
              {siteConfig.site.title}
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {siteConfig.navigation.main.map((navItem: any, index) =>
              navItem.type === 'link' ? (
                <Link
                  key={index}
                  to={navItem.to as any}
                  className="text-sm font-medium hover:text-primary transition-colors"
                  activeProps={{
                    className: 'text-primary',
                  }}
                >
                  {navItem.label}
                </Link>
              ) : navItem.type === 'dropdown' ? (
                <NavigationDropdown
                  key={index}
                  label={navItem.label}
                  items={navItem.items}
                />
              ) : null
            )}
          </nav>

          {/* Right: Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              {siteConfig.footer.text}
            </p>

            {/* Footer Navigation - All Screen Sizes */}
            <nav className="flex flex-wrap justify-center gap-4 text-sm">
              {siteConfig.navigation.main.map((navItem: any, index) =>
                navItem.type === 'link' ? (
                  <Link
                    key={index}
                    to={navItem.to as any}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    activeProps={{
                      className: 'text-primary',
                    }}
                  >
                    {navItem.label}
                  </Link>
                ) : navItem.type === 'dropdown' ? (
                  navItem.items.map((item: any, itemIndex: number) => (
                    <Link
                      key={`${index}-${itemIndex}`}
                      to={item.to as any}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      activeProps={{
                        className: 'text-primary',
                      }}
                    >
                      {item.label}
                    </Link>
                  ))
                ) : null
              )}
            </nav>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  ),
});
