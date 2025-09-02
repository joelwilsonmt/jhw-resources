import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex h-14 items-center justify-between px-6 max-w-none">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-lg font-semibold hover:text-primary transition-colors"
            >
              2025 React Starter
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors"
              activeProps={{
                className: 'text-primary',
              }}
            >
              Home
            </Link>
            <Link
              to="/forms"
              className="text-sm font-medium hover:text-primary transition-colors"
              activeProps={{
                className: 'text-primary',
              }}
            >
              Forms
            </Link>
            <Link
              to="/api-demo"
              className="text-sm font-medium hover:text-primary transition-colors"
              activeProps={{
                className: 'text-primary',
              }}
            >
              API Demo
            </Link>
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
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ using modern web technologies.
          </p>
        </div>
      </footer>
    </div>
  ),
});
