"use client";
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { createNoise3D } from 'simplex-noise';

// --- Helper Functions ---
const lerp = (a, b, t) => a * (1 - t) + b * t;

const parseRgba = (rgba) => {
  const result = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!result) return { r: 0, g: 0, b: 0, a: 1 };
  return {
    r: parseInt(result[1], 10),
    g: parseInt(result[2], 10),
    b: parseInt(result[3], 10),
    a: result[4] !== undefined ? parseFloat(result[4]) : 1,
  };
};

// --- Component ---
const DotWaveBackground = ({
  dotColor = 'rgba(115, 115, 115, 0.5)',
  dotSize = 1,
  dotSpacing = 30,
  amplitude1 = 3, frequencyX1 = 0.02, frequencyY1 = 0.01, speed1 = 0.015,
  amplitude2 = 2.5, frequencyX2 = 0.015, frequencyY2 = 0.025, speed2 = -0.018,
  noiseAmplitude = 1.5, noiseFrequency = 0.03, noiseSpeed = 0.008,
  perspectiveFactor = 0.15,
  sizeVariation = 0.4,
  opacityVariation = 0.3,
  peakColorShift = { r: 20, g: 20, b: 30 },
  initialRandomness = 0.8,
  glowIntensityThreshold = 0.95,
  glowProbability = 0.03,
  glowRadiusMultiplier = 4,
  glowColor = 'rgba(255, 255, 255, 0.08)',
  glowBlurRadius = 0,
}) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const baseColor = useRef(parseRgba(dotColor));
  const noise3D = useMemo(() => createNoise3D(), []);
  const [randomOffsets, setRandomOffsets] = useState(new Map());
  const lastTimeRef = useRef(0);
  const throttleInterval = 1000 / 30; // Target 30fps

  // Pre-calculate expensive values
  const totalSineAmplitude = amplitude1 + amplitude2;
  const maxPossibleAmplitude = totalSineAmplitude + noiseAmplitude;
  const halfMaxPossibleAmplitude = maxPossibleAmplitude * 0.5;

  // Memoize color parsing
  const glowColorParsed = useMemo(() => parseRgba(glowColor), [glowColor]);

  // Optimized random offsets generation
  useEffect(() => {
    const safeMargin = 1.5;
    const maxDim = Math.max(window.innerWidth, window.innerHeight) * safeMargin;
    const maxCols = Math.ceil(maxDim / dotSpacing) + 2;
    const maxRows = Math.ceil(maxCols / 2) * 2; // Ensure even number for symmetry

    const offsets = new Map();
    const halfCols = maxCols / 2;
    const halfRows = maxRows / 2;
    
    for (let i = -halfCols; i < halfCols; i++) {
      for (let j = -halfRows; j < halfRows; j++) {
        const key = `${i},${j}`;
        const rand = (Math.random() - 0.5) * 2 * initialRandomness;
        offsets.set(key, {
          x: rand,
          y: rand * 0.8, // Slightly different but correlated y offset
        });
      }
    }
    setRandomOffsets(offsets);
  }, [dotSpacing, initialRandomness]);

  useEffect(() => {
    baseColor.current = parseRgba(dotColor);
  }, [dotColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;
    let dotsToRender = [];
    let glowDotsToRender = [];

    const { r: baseR, g: baseG, b: baseB, a: baseOpacity } = baseColor.current;
    const peakR = Math.min(255, baseR + peakColorShift.r);
    const peakG = Math.min(255, baseG + peakColorShift.g);
    const peakB = Math.min(255, baseB + peakColorShift.b);

    const originalFilter = ctx.filter;

    const resizeHandler = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const drawDots = (timestamp) => {
      if (!lastTimeRef.current || timestamp - lastTimeRef.current >= throttleInterval) {
        lastTimeRef.current = timestamp;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const cols = Math.ceil(width / dotSpacing) + 4;
        const rows = Math.ceil(height / dotSpacing) + 4;
        const offsetX = (width - (cols - 2) * dotSpacing) / 2;
        const offsetY = (height - (rows - 2) * dotSpacing) / 2;

        time += 1;
        
        // Reset arrays
        dotsToRender = [];
        glowDotsToRender = [];

        // First pass: collect all dots to render
        for (let i = -2; i < cols - 2; i++) {
          for (let j = -2; j < rows - 2; j++) {
            const key = `${i},${j}`;
            const randOffset = randomOffsets.get(key) || { x: 0, y: 0 };
            const baseX = i * dotSpacing + offsetX + randOffset.x;
            const baseY = j * dotSpacing + offsetY + randOffset.y;

            // Calculate displacements
            const phase1 = (baseX * frequencyX1 + baseY * frequencyY1 + time * speed1);
            const phase2 = (baseX * frequencyX2 + baseY * frequencyY2 + time * speed2);
            const sineDisplacement = Math.sin(phase1) * amplitude1 + Math.sin(phase2) * amplitude2;
            const noiseVal = noise3D(baseX * noiseFrequency, baseY * noiseFrequency, time * noiseSpeed);
            const noiseDisplacement = noiseVal * noiseAmplitude;
            const totalDisplacement = sineDisplacement + noiseDisplacement;
            
            // Optimized intensity calculation
            const normalizedDisplacement = (totalDisplacement + maxPossibleAmplitude) / (2 * maxPossibleAmplitude);
            const effectIntensity = Math.max(0, Math.min(1, normalizedDisplacement));
            
            // Perspective effect
            const perspectiveScale = lerp(1, 1 - perspectiveFactor, baseY / height);
            const currentSize = Math.max(0.1, (dotSize + (dotSize * sizeVariation * effectIntensity)) * perspectiveScale);
            const currentOpacity = lerp(Math.max(0, baseOpacity - opacityVariation), baseOpacity, effectIntensity);
            const r = Math.round(lerp(baseR, peakR, effectIntensity));
            const g = Math.round(lerp(baseG, peakG, effectIntensity));
            const b = Math.round(lerp(baseB, peakB, effectIntensity));
            const drawY = baseY + totalDisplacement;

            // Check for glow
            if (effectIntensity > glowIntensityThreshold && Math.random() < glowProbability) {
              glowDotsToRender.push({
                x: baseX,
                y: drawY,
                radius: currentSize * glowRadiusMultiplier
              });
            }

            dotsToRender.push({
              x: baseX,
              y: drawY,
              radius: currentSize,
              color: `rgba(${r}, ${g}, ${b}, ${currentOpacity})`
            });
          }
        }

        // Render glow dots first
        if (glowDotsToRender.length > 0) {
          ctx.filter = `blur(${glowBlurRadius}px)`;
          ctx.fillStyle = `rgba(${glowColorParsed.r}, ${glowColorParsed.g}, ${glowColorParsed.b}, ${glowColorParsed.a})`;
          
          for (const dot of glowDotsToRender) {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          
          ctx.filter = originalFilter;
        }

        // Render regular dots
        for (const dot of dotsToRender) {
          ctx.fillStyle = dot.color;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      animationFrameId.current = requestAnimationFrame(drawDots);
    };

    // Initial setup
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    animationFrameId.current = requestAnimationFrame(drawDots);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(animationFrameId.current);
      ctx.filter = originalFilter;
    };
  }, [
    dotColor, dotSize, dotSpacing, amplitude1, frequencyX1, frequencyY1, speed1,
    amplitude2, frequencyX2, frequencyY2, speed2, noiseAmplitude, noiseFrequency,
    noiseSpeed, perspectiveFactor, sizeVariation, opacityVariation, peakColorShift,
    initialRandomness, noise3D, randomOffsets, glowIntensityThreshold, glowProbability,
    glowRadiusMultiplier, glowColor, glowBlurRadius, glowColorParsed,
    totalSineAmplitude, maxPossibleAmplitude, halfMaxPossibleAmplitude
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0"
    />
  );
};

export default DotWaveBackground;