import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useCallback } from 'react';
import { Upload, Link as LinkIcon, Palette, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import ColorThief from 'colorthief';

interface ColorData {
  hex: string;
  oklch: string;
}

function ColorPalettePage() {
  const [colors, setColors] = useState<ColorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const rgbToOklch = (r: number, g: number, b: number): string => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    // Simple approximation for OKLCH conversion
    const l = 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
    const c =
      Math.sqrt((rNorm - l) ** 2 + (gNorm - l) ** 2 + (bNorm - l) ** 2) * 0.4;
    const h = Math.atan2(gNorm - l, rNorm - l) * (180 / Math.PI);

    return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h < 0 ? h + 360 : h.toFixed(1)})`;
  };

  const extractColors = useCallback((img: HTMLImageElement) => {
    try {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, 5);

      const extractedColors: ColorData[] = palette.map(([r, g, b]) => ({
        hex: rgbToHex(r, g, b),
        oklch: rgbToOklch(r, g, b),
      }));

      setColors(extractedColors);
    } catch (err) {
      setError('Failed to extract colors from image');
      console.error(err);
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      extractColors(imageRef.current);
      setLoading(false);
      setError(null);
    }
  }, [extractColors]);

  const handleImageError = useCallback(() => {
    setError('Failed to load image');
    setLoading(false);
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setLoading(true);
      setError(null);

      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result && imageRef.current) {
          imageRef.current.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleUrlSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!imageUrl.trim()) return;

      setLoading(true);
      setError(null);

      if (imageRef.current) {
        imageRef.current.src = imageUrl;
      }
    },
    [imageUrl]
  );

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy');
    }
  }, []);

  const copyAllColors = useCallback(async () => {
    if (colors.length === 0) return;

    const colorLabels = [
      'primary',
      'secondary',
      'tertiary',
      'quaternary',
      'quinary',
    ];
    const formattedColors = colors
      .map((color, index) => {
        const label = colorLabels[index] || `color-${index + 1}`;
        return `${label}: ${color.hex} / ${color.oklch}`;
      })
      .join('\n');

    try {
      await navigator.clipboard.writeText(formattedColors);
      toast.success(`Copied all ${colors.length} colors to clipboard!`);
    } catch (err) {
      console.error('Failed to copy all colors:', err);
      toast.error('Failed to copy all colors');
    }
  }, [colors]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Palette className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">
            Color Palette Extractor
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload an image or paste a URL to extract a beautiful color palette
          with hex and OKLCH values
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Image
            </CardTitle>
            <CardDescription>
              Select an image file from your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* URL Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Image URL
            </CardTitle>
            <CardDescription>Paste a direct link to an image</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={!imageUrl.trim() || loading}
                className="w-full"
              >
                {loading ? 'Loading...' : 'Extract Colors'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Hidden image for color extraction */}
      <img
        ref={imageRef}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: 'none' }}
        crossOrigin="anonymous"
        alt=""
      />

      {/* Error Message */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Color Palette Results */}
      {colors.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Extracted Color Palette</CardTitle>
              <CardDescription>
                Click any color value to copy it to your clipboard
              </CardDescription>
            </div>
            <Button
              onClick={copyAllColors}
              variant="outline"
              className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Copy className="h-4 w-4" />
              Copy All Colors
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {colors.map((color, index) => {
                const colorLabels = [
                  'primary',
                  'secondary',
                  'tertiary',
                  'quaternary',
                  'quinary',
                ];
                const label = colorLabels[index] || `color-${index + 1}`;

                return (
                  <div key={index} className="space-y-3">
                    <div
                      className="w-full h-20 rounded-lg border shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-center capitalize text-muted-foreground">
                        {label}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-between font-mono text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => copyToClipboard(color.hex)}
                      >
                        {color.hex}
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-between font-mono text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => copyToClipboard(color.oklch)}
                      >
                        <span className="truncate">{color.oklch}</span>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export const Route = createFileRoute('/color-palette')({
  component: ColorPalettePage,
});
