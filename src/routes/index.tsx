import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Github, Heart, Zap, FormInput, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

function HomePage() {
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
      icon: <FormInput className="h-6 w-6" />,
      title: 'Form Management',
      description: 'React Hook Form with Zod validation for robust forms.',
      link: '/forms',
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Data Fetching',
      description: 'TanStack Query for powerful server state management.',
      link: '/api-demo',
    },
    {
      icon: <Github className="h-6 w-6" />,
      title: 'Production Ready',
      description: 'Shadcn/ui components with dark mode support included.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Modern React Starter
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A production-ready React starter with TypeScript, Vite, Tailwind CSS,
          Shadcn/ui components, and powerful libraries for forms and data
          fetching.
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="text-center hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>{feature.description}</CardDescription>
              {feature.link && (
                <Link to={feature.link}>
                  <Button variant="outline" size="sm">
                    View Demo
                  </Button>
                </Link>
              )}
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
              <div className="font-medium">TanStack Router</div>
              <div className="text-muted-foreground">Routing</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-medium">TanStack Query</div>
              <div className="text-muted-foreground">Data Fetching</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-medium">React Hook Form</div>
              <div className="text-muted-foreground">Forms</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-medium">Zod</div>
              <div className="text-muted-foreground">Validation</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-medium">Vite + SWC</div>
              <div className="text-muted-foreground">Build Tool</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-medium">Shadcn/ui</div>
              <div className="text-muted-foreground">Components</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Getting Started</CardTitle>
          <CardDescription>
            Ready to start building? Try the demo pages!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            <div className="text-muted-foreground">
              # Start development server
            </div>
            <div>bun dev</div>
          </div>
          <div className="flex gap-2">
            <Link to="/forms">
              <Button variant="outline">
                <FormInput className="h-4 w-4 mr-2" />
                Forms Demo
              </Button>
            </Link>
            <Link to="/api-demo">
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                API Demo
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: HomePage,
});
