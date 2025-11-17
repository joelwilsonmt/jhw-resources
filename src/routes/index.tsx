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
import { PageTransition } from '@/components/PageTransition';
import { AnimatedText } from '@/components/AnimatedText';
import Marquee from 'react-fast-marquee';
import CountUp from 'react-countup';
import Confetti from 'react-confetti';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import siteConfig from '@/config/site';

function HomePage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const getWindowDimensions = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const updateWindowDimensions = () => {
      setWindowDimensions(getWindowDimensions());
    };

    setWindowDimensions(getWindowDimensions());
    window.addEventListener('resize', updateWindowDimensions);

    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

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
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-8">
        {showConfetti && (
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={200}
            colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
          />
        )}

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <AnimatedText
            type="typewriter"
            className="text-4xl font-bold tracking-tight sm:text-6xl mx-auto"
          >
            <h1>{siteConfig.pages.home.hero.title}</h1>
          </AnimatedText>
          <AnimatedText
            type="slideUp"
            delay={0.3}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            <p>{siteConfig.pages.home.hero.subtitle}</p>
          </AnimatedText>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:shadow-primary/10 border-2 hover:border-primary/20">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={triggerConfetti}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        View Demo
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>🛠️ Tech Stack</CardTitle>
              <CardDescription>
                Modern tools and libraries powering this application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Marquee
                gradient={false}
                speed={40}
                pauseOnHover={true}
                className="py-4"
              >
                {siteConfig.pages.home.techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="mx-6 flex flex-col items-center text-center min-w-[120px]"
                  >
                    <div className="p-3 bg-muted rounded-lg mb-2 w-full">
                      <div className="font-medium text-sm">{tech.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {tech.category}
                      </div>
                    </div>
                  </div>
                ))}
              </Marquee>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>📊 Development Stats</CardTitle>
              <CardDescription>
                Key metrics that make this starter powerful
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    <CountUp end={8} duration={2.5} />+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Core Technologies
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    <CountUp end={100} duration={2.5} />%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    TypeScript Coverage
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    <CountUp end={5} duration={2.5} />+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Demo Pages
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    <CountUp end={24} duration={2.5} separator="" />
                    ms
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Hot Reload
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Color Test */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
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
        </motion.div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
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
              <div className="flex flex-wrap gap-2">
                <Link to="/forms">
                  <Button
                    variant="outline"
                    onClick={triggerConfetti}
                    className="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    <FormInput className="h-4 w-4 mr-2" />
                    Forms Demo
                  </Button>
                </Link>
                <Link to="/api-demo">
                  <Button
                    variant="outline"
                    onClick={triggerConfetti}
                    className="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    API Demo
                  </Button>
                </Link>
                <Link to="/color-palette">
                  <Button
                    variant="outline"
                    onClick={triggerConfetti}
                    className="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Color Palette
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export const Route = createFileRoute('/')({
  component: HomePage,
});
