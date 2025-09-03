import { useEffect, useRef } from 'react';

export function DottedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    const dotSize = 20;
    const dotRadius = 1;
    const hoverRadius = 80;
    let mouseX = -1000;
    let mouseY = -1000;

    const drawDots = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get CSS custom property value
      const style = getComputedStyle(document.documentElement);
      const mutedForeground = style
        .getPropertyValue('--muted-foreground')
        .trim();

      const cols = Math.ceil(canvas.width / dotSize);
      const rows = Math.ceil(canvas.height / dotSize);

      for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
          const x = col * dotSize + 10;
          const y = row * dotSize + 10;

          const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
          const isHovered = distance < hoverRadius;

          let opacity = 0.3;
          let radius = dotRadius;

          if (isHovered) {
            const hoverStrength = 1 - distance / hoverRadius;
            opacity = 0.3 + hoverStrength * 0.7;
            radius = dotRadius + hoverStrength * 2;
          }

          ctx.globalAlpha = opacity;
          ctx.fillStyle = `hsl(${mutedForeground})`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      drawDots();
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      drawDots();
    };

    drawDots();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
