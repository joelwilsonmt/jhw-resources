import { useState } from 'react';
import { Github, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ThemeToggle';

function App() {
  const [count, setCount] = useState(0);

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Lightning Fast',
      description: 'Built with Vite and SWC for incredibly fast development.',
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Developer Experience',
      description: 'TypeScript, ESLint, Prettier, and Tailwind CSS configured.',
    },
    {
      icon: <Github className="h-6 w-6" />,
      title: 'Production Ready',
      description: 'Shadcn/ui components with dark mode support included.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">2025 React Starter</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Modern React Starter
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A production-ready React starter with TypeScript, Vite, Tailwind
              CSS, and Shadcn/ui components. Dark mode included.
            </p>
          </div>

          {/* Interactive Counter Card */}
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Interactive Counter</CardTitle>
              <CardDescription>
                Test the Shadcn/ui components and state management
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">{count}</div>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setCount(count => count + 1)}>
                  Increment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCount(count => Math.max(0, count - 1))}
                >
                  Decrement
                </Button>
                <Button variant="secondary" onClick={() => setCount(0)}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle>🛠️ Tech Stack</CardTitle>
              <CardDescription>
                Modern tools and libraries for efficient development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">React 19</div>
                  <div className="text-muted-foreground">UI Library</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">TypeScript</div>
                  <div className="text-muted-foreground">Type Safety</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">Vite + SWC</div>
                  <div className="text-muted-foreground">Build Tool</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">Tailwind CSS</div>
                  <div className="text-muted-foreground">Styling</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">Shadcn/ui</div>
                  <div className="text-muted-foreground">Components</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">Lucide Icons</div>
                  <div className="text-muted-foreground">Icons</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">ESLint</div>
                  <div className="text-muted-foreground">Linting</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">Prettier</div>
                  <div className="text-muted-foreground">Formatting</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 Getting Started</CardTitle>
              <CardDescription>
                Ready to start building? Try toggling dark mode above!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <div className="text-muted-foreground">
                  # Start development server
                </div>
                <div>bun dev</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Edit{' '}
                <code className="bg-muted px-2 py-1 rounded">src/App.tsx</code>{' '}
                and save to see changes instantly with fast refresh.
              </p>
            </CardContent>
          </Card>
        </div>
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
  );
}

export default App;
