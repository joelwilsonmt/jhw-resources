import { createFileRoute, Link } from '@tanstack/react-router';
import { Github, Heart, Zap, FormInput, Search, Palette } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import siteConfig from '@/config/site.json';

function HomePage() {
  const iconMap = {
    Zap: <Zap className="h-6 w-6" />,
    Heart: <Heart className="h-6 w-6" />,
    Github: <Github className="h-6 w-6" />,
    FormInput: <FormInput className="h-6 w-6" />,
    Search: <Search className="h-6 w-6" />,
    Palette: <Palette className="h-6 w-6" />,
  };

  const features = siteConfig.pages.home.features.map(feature => ({
    ...feature,
    icon: iconMap[feature.icon as keyof typeof iconMap],
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          {siteConfig.pages.home.hero.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {siteConfig.pages.home.hero.subtitle}
        </p>
      </div>

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
            {siteConfig.pages.home.techStack.map((tech, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <div className="font-medium">{tech.name}</div>
                <div className="text-muted-foreground">{tech.category}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Test */}
      <Card>
        <CardHeader>
          <CardTitle>🎨 Color System Test</CardTitle>
          <CardDescription>
            Testing if Tailwind color classes are working properly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-primary text-primary-foreground p-4 rounded-lg text-center">
              bg-primary
            </div>
            <div className="bg-secondary text-secondary-foreground p-4 rounded-lg text-center">
              bg-secondary
            </div>
            <div className="bg-muted text-muted-foreground p-4 rounded-lg text-center">
              bg-muted
            </div>
            <div className="bg-accent text-accent-foreground p-4 rounded-lg text-center">
              bg-accent
            </div>
            <div className="bg-card text-card-foreground p-4 rounded-lg text-center border">
              bg-card
            </div>
            <div className="bg-destructive text-destructive-foreground p-4 rounded-lg text-center">
              bg-destructive
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
            <div>pnpm dev</div>
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
            <Link to="/color-palette">
              <Button variant="outline">
                <Palette className="h-4 w-4 mr-2" />
                Color Palette
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
