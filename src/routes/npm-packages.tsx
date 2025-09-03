import { createFileRoute } from '@tanstack/react-router';
import {
  Package,
  ExternalLink,
  Sparkles,
  BarChart3,
  Brush,
  MousePointer,
  Component,
  Palette,
  Globe,
  Wrench,
  Smartphone,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PackageLink {
  name: string;
  url: string;
  description: string;
  additionalLinks?: { label: string; url: string }[];
}

interface PackageCategory {
  title: string;
  icon: React.ReactNode;
  packages: PackageLink[];
}

function NpmPackagesPage() {
  const categories: PackageCategory[] = [
    {
      title: 'Visual Effects & Animation',
      icon: <Sparkles className="h-5 w-5" />,
      packages: [
        {
          name: 'react-confetti',
          url: 'https://www.npmjs.com/package/react-confetti',
          description:
            'Add festive confetti animations to celebrate user achievements',
        },
        {
          name: 'react-particles-js',
          url: 'https://www.npmjs.com/package/react-particles-js',
          description: 'Create beautiful particle effects and backgrounds',
        },
        {
          name: 'react-wavify',
          url: 'https://www.npmjs.com/package/react-wavify',
          description: 'Generate smooth SVG wave animations',
        },
        {
          name: 'react-rewards',
          url: 'https://www.npmjs.com/package/react-rewards',
          description: 'Micro-interactions to reward users for their actions',
        },
        {
          name: 'react-lottie-player',
          url: 'https://www.npmjs.com/package/react-lottie-player',
          description: 'Play Lottie animations in React applications',
          additionalLinks: [
            { label: 'Lottie Files', url: 'https://lottiefiles.com/' },
          ],
        },
        {
          name: 'react-fast-marquee',
          url: 'https://www.npmjs.com/package/react-fast-marquee',
          description: 'Smooth, performant scrolling marquee component',
        },
        {
          name: 'react-split-flap-effect',
          url: 'https://github.com/jayKayEss/react-split-flap-effect',
          description: 'Retro split-flap display animation effect',
        },
      ],
    },
    {
      title: 'UI Components & Styling',
      icon: <Component className="h-5 w-5" />,
      packages: [
        {
          name: 'react-awesome-button',
          url: 'https://www.npmjs.com/package/react-awesome-button',
          description: 'Beautiful, customizable 3D button components',
        },
        {
          name: 'react-css-blur',
          url: 'https://www.npmjs.com/package/react-css-blur',
          description: 'Apply dynamic blur effects to React components',
        },
        {
          name: 'react-text-transition',
          url: 'https://www.npmjs.com/package/react-text-transition',
          description: 'Smooth text transitions and typewriter effects',
        },
        {
          name: 'react-device-frameset',
          url: 'https://www.npmjs.com/package/react-device-frameset',
          description: 'Display content within realistic device frames',
        },
        {
          name: 'react-loading-skeleton',
          url: 'https://www.npmjs.com/package/react-loading-skeleton',
          description: 'Beautiful animated loading placeholders',
        },
        {
          name: 'react-burger-menu',
          url: 'https://www.npmjs.com/package/react-burger-menu',
          description: 'Off-canvas sidebar menus with CSS transitions',
        },
      ],
    },
    {
      title: 'Interaction & User Experience',
      icon: <MousePointer className="h-5 w-5" />,
      packages: [
        {
          name: 'react-parallax-tilt',
          url: 'https://www.npmjs.com/package/react-parallax-tilt',
          description: '3D tilt hover effects for interactive elements',
        },
        {
          name: 'react-hover',
          url: 'https://www.npmjs.com/package/react-hover',
          description: 'Easy hover state management for React components',
        },
        {
          name: 'react-animated-3d-card',
          url: 'https://www.npmjs.com/package/react-animated-3d-card/v/1.0.1',
          description: 'Interactive 3D card animations on hover',
          additionalLinks: [
            { label: 'Demo', url: 'https://codesandbox.io/s/f1-pkr9me' },
          ],
        },
        {
          name: '@dndkit/core',
          url: 'https://dndkit.com/',
          description: 'Modern drag and drop toolkit for React',
        },
        {
          name: 'react-waypoint',
          url: 'https://www.npmjs.com/package/react-waypoint',
          description: 'Execute functions when scrolling to specific elements',
        },
      ],
    },
    {
      title: 'Data Visualization & Charts',
      icon: <BarChart3 className="h-5 w-5" />,
      packages: [
        {
          name: 'react-chartjs-2',
          url: 'https://react-chartjs-2.js.org/',
          description:
            'Chart.js integration for React with comprehensive chart types',
        },
        {
          name: 'react-force-graph',
          url: 'https://www.npmjs.com/package/react-force-graph',
          description: 'Interactive network graphs and node-link diagrams',
        },
        {
          name: 'react-countup',
          url: 'https://www.npmjs.com/package/react-countup',
          description: 'Animated number counting with customizable options',
        },
      ],
    },
    {
      title: 'Layout & Scrolling',
      icon: <Smartphone className="h-5 w-5" />,
      packages: [
        {
          name: 'react-scroll-parallax',
          url: 'https://www.npmjs.com/package/react-scroll-parallax',
          description: 'Create parallax scrolling effects with ease',
        },
        {
          name: 'embla-carousel-react',
          url: 'https://www.npmjs.com/package/embla-carousel-react',
          description: 'Lightweight, extensible carousel component',
        },
        {
          name: 'react-flip-move',
          url: 'https://www.npmjs.com/package/react-flip-move/v/2.6.9',
          description: 'Smooth FLIP animations for list reordering',
        },
        {
          name: 'react-fade-in',
          url: 'https://www.npmjs.com/package/react-fade-in',
          description: 'Smooth fade-in animations for lists and elements',
        },
      ],
    },
    {
      title: '3D Graphics & Visualization',
      icon: <Brush className="h-5 w-5" />,
      packages: [
        {
          name: '@react-three/drei',
          url: 'https://www.npmjs.com/package/@react-three/drei#abstractions',
          description: 'Useful helpers and abstractions for React Three Fiber',
        },
        {
          name: 'zdog',
          url: 'https://www.npmjs.com/package/zdog',
          description: 'Flat, round, designer-friendly pseudo-3D engine',
        },
      ],
    },
    {
      title: 'Colors & Theming',
      icon: <Palette className="h-5 w-5" />,
      packages: [
        {
          name: 'randomcolor',
          url: 'https://www.npmjs.com/package/randomcolor',
          description: 'Generate attractive random colors with control options',
        },
        {
          name: 'tinycolor2',
          url: 'https://www.npmjs.com/package/tinycolor2',
          description: 'Fast, small color manipulation and conversion library',
        },
      ],
    },
    {
      title: 'Utility & Development Tools',
      icon: <Wrench className="h-5 w-5" />,
      packages: [
        {
          name: 'react-text-format',
          url: 'https://www.npmjs.com/package/react-text-format',
          description: 'Format and manipulate text content in React',
        },
        {
          name: 'react-children-utilities',
          url: 'https://www.npmjs.com/package/react-children-utilities',
          description: 'Extended utilities for working with React children',
        },
        {
          name: 'concurrently',
          url: 'https://www.npmjs.com/package/concurrently',
          description: 'Run multiple npm scripts simultaneously',
        },
        {
          name: 'figlet',
          url: 'https://www.npmjs.com/package/figlet',
          description: 'Generate ASCII art from text for terminal output',
        },
      ],
    },
  ];

  const resources = [
    {
      name: 'React Bits',
      url: 'https://www.reactbits.dev/',
      description:
        'Collection of React components, patterns, and best practices',
    },
    {
      name: 'Loading.io CSS',
      url: 'https://loading.io/css/',
      description: 'Pure CSS loading spinners for web applications',
    },
    {
      name: 'Animated CSS Backgrounds',
      url: 'https://alvarotrigo.com/blog/animated-backgrounds-css/',
      description: 'Creative animated background patterns and effects',
    },
    {
      name: 'Next.js Templates',
      url: 'https://vercel.com/templates/next.js',
      description: 'Production-ready Next.js project templates',
    },
    {
      name: 'EnvShare',
      url: 'https://envshare.dev/share',
      description: 'Securely share environment variables with team members',
    },
    {
      name: 'SVG to Canvas Converter',
      url: 'https://demo.qunee.com/svg2canvas/',
      description: 'Convert SVG graphics to HTML5 canvas',
    },
    {
      name: 'JPG to GLB Converter',
      url: 'https://imagetostl.com/convert/file/jpg/to/glb',
      description: 'Transform 2D images into 3D GLB models',
    },
    {
      name: 'Useful NPM Packages for React',
      url: 'https://dev.to/manindu/a-list-of-useful-npm-packages-for-react-developers-3dhg',
      description: 'Comprehensive guide to essential React packages',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">NPM Packages</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Curated collection of useful NPM packages for React development,
          organized by functionality
        </p>
      </div>

      {/* Package Categories */}
      <div className="space-y-8">
        {categories.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {category.icon}
                {category.title}
              </CardTitle>
              <CardDescription>
                {category.packages.length} packages available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.packages.map((pkg, pkgIndex) => (
                  <div
                    key={pkgIndex}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-sm leading-tight">
                        {pkg.name}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 shrink-0"
                        onClick={() => window.open(pkg.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pkg.description}
                    </p>
                    {pkg.additionalLinks && (
                      <div className="flex flex-wrap gap-2">
                        {pkg.additionalLinks.map((link, linkIndex) => (
                          <Button
                            key={linkIndex}
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={() => window.open(link.url, '_blank')}
                          >
                            {link.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Additional Resources
          </CardTitle>
          <CardDescription>
            Helpful tools, converters, and educational resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-sm leading-tight">
                    {resource.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {resource.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute('/npm-packages')({
  component: NpmPackagesPage,
});
