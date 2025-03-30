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
  // --- Existing Props ---
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

  // --- Glow Effect Props ---
  glowIntensityThreshold = 0.95,
  glowProbability = 0.03,
  glowRadiusMultiplier = 4,
  glowColor = 'rgba(255, 255, 255, 0.08)',
  glowBlurRadius = 4, // <-- NEW: Add blur radius prop with a default
}) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const baseColor = useRef(parseRgba(dotColor));
  const noise3D = useMemo(() => createNoise3D(), []);
  const [randomOffsets, setRandomOffsets] = useState(new Map());

  useEffect(() => {
    const safeMargin = 1.5;
    const maxDim = Math.max(window.innerWidth, window.innerHeight) * safeMargin;
    const maxCols = Math.ceil(maxDim / dotSpacing) + 2;
    const maxRows = Math.ceil(maxDim / dotSpacing) + 2;

    const offsets = new Map();
    for (let i = -maxCols / 2; i < maxCols / 2; i++) {
      for (let j = -maxRows / 2; j < maxRows / 2; j++) {
        const key = `${i},${j}`;
        offsets.set(key, {
          x: (Math.random() - 0.5) * 2 * initialRandomness,
          y: (Math.random() - 0.5) * 2 * initialRandomness,
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

    const { r: baseR, g: baseG, b: baseB, a: baseOpacity } = baseColor.current;
    const peakR = Math.min(255, baseR + peakColorShift.r);
    const peakG = Math.min(255, baseG + peakColorShift.g);
    const peakB = Math.min(255, baseB + peakColorShift.b);
    const totalSineAmplitude = amplitude1 + amplitude2;
    const maxPossibleAmplitude = totalSineAmplitude + noiseAmplitude;

    // Store original filter state (good practice, usually 'none')
    const originalFilter = ctx.filter;

    const resizeHandler = () => {
        width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        canvas.style.width = `${canvas.offsetWidth}px`;
        canvas.style.height = `${canvas.offsetHeight}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };


    const drawDots = () => {
      // Clear canvas, respecting devicePixelRatio scaling
      ctx.save(); // Save the current state (including transformation matrix)
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform to clear properly
      ctx.clearRect(0, 0, width, height);
      ctx.restore(); // Restore the scaled state

      const cols = Math.ceil(width / window.devicePixelRatio / dotSpacing) + 4; // Adjusted calculation for scaled canvas
      const rows = Math.ceil(height / window.devicePixelRatio / dotSpacing) + 4;
      const scaledOffsetX = (width / window.devicePixelRatio - (cols - 2) * dotSpacing) / 2;
      const scaledOffsetY = (height / window.devicePixelRatio - (rows - 2) * dotSpacing) / 2;


      time += 1; // Increment time for animation

      for (let i = -2; i < cols - 2; i++) { // Adjust loop bounds for buffer
        for (let j = -2; j < rows - 2; j++) {
          const key = `${i},${j}`;
          const randOffset = randomOffsets.get(key) || { x: 0, y: 0 };
          // Use scaled offsets for calculations based on CSS pixels
          const baseX = i * dotSpacing + scaledOffsetX + randOffset.x;
          const baseY = j * dotSpacing + scaledOffsetY + randOffset.y;


          // --- Calculate Displacements, Perspective, Intensity (Steps 1-5) ---
          const phase1 = (baseX * frequencyX1 + baseY * frequencyY1 + time * speed1);
          const phase2 = (baseX * frequencyX2 + baseY * frequencyY2 + time * speed2);
          const sineDisplacement = Math.sin(phase1) * amplitude1 + Math.sin(phase2) * amplitude2;
          const noiseTime = time * noiseSpeed;
          const noiseVal = noise3D(baseX * noiseFrequency, baseY * noiseFrequency, noiseTime);
          const noiseDisplacement = noiseVal * noiseAmplitude;
          const totalDisplacement = sineDisplacement + noiseDisplacement;
          const perspectiveScale = lerp(1, 1 - perspectiveFactor, baseY / (height / window.devicePixelRatio)); // Use scaled height
          const normalizedDisplacement = (totalDisplacement + maxPossibleAmplitude) / (2 * maxPossibleAmplitude);
          const effectIntensity = Math.max(0, Math.min(1, normalizedDisplacement));

          // --- Calculate Base Dot Properties (Steps 6-9) ---
          const baseModulatedSize = dotSize + (dotSize * sizeVariation * effectIntensity);
          const currentSize = Math.max(0.1, baseModulatedSize * perspectiveScale);
          const minOpacity = Math.max(0, baseOpacity - opacityVariation);
          const currentOpacity = lerp(minOpacity, baseOpacity, effectIntensity);
          const r = Math.round(lerp(baseR, peakR, effectIntensity));
          const g = Math.round(lerp(baseG, peakG, effectIntensity));
          const b = Math.round(lerp(baseB, peakB, effectIntensity));
          const drawY = baseY + totalDisplacement;

          // --- Draw Glow/Sparkle (Step before main dot) ---
          if (effectIntensity > glowIntensityThreshold && Math.random() < glowProbability) {
              const glowRadius = currentSize * glowRadiusMultiplier;

              // *** Apply Blur ***
              ctx.filter = `blur(${glowBlurRadius}px)`;

              ctx.fillStyle = glowColor;
              ctx.beginPath();
              ctx.arc(baseX, drawY, glowRadius, 0, Math.PI * 2);
              ctx.fill();

              // *** Reset Blur IMPORTANT! ***
              ctx.filter = originalFilter; // Reset to default ('none' or whatever it was)

          } else {
             // Ensure filter is off if not glowing (belt-and-suspenders)
             if (ctx.filter !== originalFilter) {
                 ctx.filter = originalFilter;
             }
          }


          // --- Draw Main Dot (Step 10) ---
          // Make sure filter is reset before drawing the main dot
          if (ctx.filter !== originalFilter) {
               ctx.filter = originalFilter;
          }

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`;
          ctx.beginPath();
          ctx.arc(baseX, drawY, currentSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      animationFrameId.current = requestAnimationFrame(drawDots);
    };

    // Initial setup and start animation
    resizeHandler(); // Call initially to set size and scale
    window.addEventListener('resize', resizeHandler);
    animationFrameId.current = requestAnimationFrame(drawDots);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // Reset filter on cleanup (just in case)
      if (ctx) {
        ctx.filter = originalFilter;
      }
    };
  }, [ // --- Add ALL props to dependency array ---
    dotColor, dotSize, dotSpacing, amplitude1, frequencyX1, frequencyY1, speed1,
    amplitude2, frequencyX2, frequencyY2, speed2, noiseAmplitude, noiseFrequency,
    noiseSpeed, perspectiveFactor, sizeVariation, opacityVariation, peakColorShift,
    initialRandomness, noise3D, randomOffsets,
    // Glow props:
    glowIntensityThreshold, glowProbability, glowRadiusMultiplier, glowColor,
    glowBlurRadius // <-- Add new prop here
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0"
      // style={{ imageRendering: 'pixelated' }} // Optional: if you want crisp pixels even when scaled
    />
  );
};

export default DotWaveBackground;