import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { projectionDecks, type ProjectionSlide } from '@/data/projectionContent';
import passportImageUrl from '@/assets/passport-size.png';

interface ProjectionScreenContentProps {
  propId: string | null;
}

const PROJECTION_AREA = {
  position: [0, 3.34, -5.92] as [number, number, number],
  size: [13.25, 4.62] as [number, number],
  canvasWidth: 1700,
  canvasHeight: 585,
};

const FADE_IN_SECONDS = 3;
const FADE_OUT_SECONDS = 3;
const AUTO_ADVANCE_MS = 5200;

const drawWrappedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = Number.POSITIVE_INFINITY
) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let lines = 0;

  for (const word of words) {
    const testLine = `${line}${word} `;
    const width = ctx.measureText(testLine).width;

    if (width > maxWidth && line) {
      ctx.fillText(line.trim(), x, currentY);
      currentY += lineHeight;
      line = `${word} `;
      lines += 1;

      if (lines >= maxLines) {
        return currentY;
      }
    } else {
      line = testLine;
    }
  }

  if (line && lines < maxLines) {
    ctx.fillText(line.trim(), x, currentY);
    currentY += lineHeight;
  }

  return currentY;
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const drawRetroRobot = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  baseY: number,
  scale: number
) => {
  const headWidth = 150 * scale;
  const headHeight = 116 * scale;
  const bodyWidth = 176 * scale;
  const bodyHeight = 184 * scale;
  const armLength = 86 * scale;
  const legLength = 122 * scale;

  const coneTopY = baseY - 360 * scale;
  const coneBottomY = baseY + 36 * scale;
  const coneHalfWidth = 118 * scale;

  ctx.save();

  // Spotlight cone and floor pool
  const coneGradient = ctx.createLinearGradient(centerX, coneTopY, centerX, coneBottomY);
  coneGradient.addColorStop(0, 'rgba(245, 212, 140, 0.02)');
  coneGradient.addColorStop(0.2, 'rgba(245, 212, 140, 0.16)');
  coneGradient.addColorStop(1, 'rgba(245, 212, 140, 0.05)');
  ctx.fillStyle = coneGradient;
  ctx.beginPath();
  ctx.moveTo(centerX - 30 * scale, coneTopY);
  ctx.lineTo(centerX + 30 * scale, coneTopY);
  ctx.lineTo(centerX + coneHalfWidth, coneBottomY);
  ctx.lineTo(centerX - coneHalfWidth, coneBottomY);
  ctx.closePath();
  ctx.fill();

  const poolGradient = ctx.createRadialGradient(
    centerX,
    baseY + 30 * scale,
    0,
    centerX,
    baseY + 30 * scale,
    92 * scale
  );
  poolGradient.addColorStop(0, 'rgba(245, 212, 140, 0.22)');
  poolGradient.addColorStop(1, 'rgba(245, 212, 140, 0)');
  ctx.fillStyle = poolGradient;
  ctx.beginPath();
  ctx.ellipse(centerX, baseY + 28 * scale, 108 * scale, 42 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Spring antenna
  ctx.strokeStyle = '#6a5644';
  ctx.lineWidth = 4 * scale;
  for (let index = 0; index < 7; index += 1) {
    ctx.beginPath();
    ctx.arc(centerX, baseY - 252 * scale + index * 10 * scale, 18 * scale, Math.PI, 0);
    ctx.stroke();
  }

  // Head
  ctx.fillStyle = '#d7e8ef';
  drawRoundedRect(ctx, centerX - headWidth / 2, baseY - 235 * scale, headWidth, headHeight, 18 * scale);
  ctx.fill();
  ctx.strokeStyle = '#6f7e86';
  ctx.lineWidth = 3 * scale;
  ctx.stroke();

  // Eyes
  ['left', 'right'].forEach((_, index) => {
    const eyeX = centerX + (index === 0 ? -38 : 38) * scale;
    const eyeY = baseY - 178 * scale;
    ctx.fillStyle = '#f8f1df';
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 20 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#7a684b';
    ctx.lineWidth = 4 * scale;
    ctx.stroke();

    ctx.fillStyle = '#b8892d';
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 7 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#7a684b';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(eyeX - 15 * scale, eyeY - 5 * scale);
    ctx.lineTo(eyeX + 15 * scale, eyeY + 5 * scale);
    ctx.stroke();
  });

  // Mouth
  ctx.fillStyle = '#d44d3a';
  drawRoundedRect(ctx, centerX - 42 * scale, baseY - 138 * scale, 84 * scale, 22 * scale, 5 * scale);
  ctx.fill();
  ctx.strokeStyle = '#8c3528';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  ctx.strokeStyle = '#f8f1df';
  ctx.lineWidth = 2 * scale;
  for (let index = 0; index < 7; index += 1) {
    const toothX = centerX - 32 * scale + index * 10 * scale;
    ctx.beginPath();
    ctx.moveTo(toothX, baseY - 137 * scale);
    ctx.lineTo(toothX, baseY - 117 * scale);
    ctx.stroke();
  }

  // Body
  ctx.fillStyle = '#d8eaf1';
  drawRoundedRect(ctx, centerX - bodyWidth / 2, baseY - 104 * scale, bodyWidth, bodyHeight, 18 * scale);
  ctx.fill();
  ctx.strokeStyle = '#72818a';
  ctx.lineWidth = 3 * scale;
  ctx.stroke();

  // Chest panel
  ctx.fillStyle = '#1d2430';
  drawRoundedRect(ctx, centerX - 64 * scale, baseY - 52 * scale, 128 * scale, 84 * scale, 10 * scale);
  ctx.fill();
  ctx.strokeStyle = '#c58d2b';
  ctx.lineWidth = 3 * scale;
  ctx.stroke();

  ctx.fillStyle = '#f1d56c';
  ctx.fillRect(centerX - 50 * scale, baseY - 36 * scale, 42 * scale, 22 * scale);
  ctx.fillStyle = '#d44d3a';
  ctx.fillRect(centerX - 2 * scale, baseY - 36 * scale, 42 * scale, 22 * scale);
  ctx.fillStyle = '#7cd2f2';
  ctx.fillRect(centerX - 50 * scale, baseY - 8 * scale, 42 * scale, 22 * scale);
  ctx.fillStyle = '#f8f1df';
  ctx.fillRect(centerX - 2 * scale, baseY - 8 * scale, 42 * scale, 22 * scale);

  // Decorative rivets
  ctx.fillStyle = '#7c8b94';
  for (let row = 0; row < 5; row += 1) {
    ctx.beginPath();
    ctx.arc(centerX - 76 * scale, baseY - 86 * scale + row * 34 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.arc(centerX + 76 * scale, baseY - 86 * scale + row * 34 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // Arms
  ctx.strokeStyle = '#7c8b94';
  ctx.lineWidth = 8 * scale;
  ctx.beginPath();
  ctx.moveTo(centerX - bodyWidth / 2, baseY - 28 * scale);
  ctx.lineTo(centerX - bodyWidth / 2 - armLength, baseY - 12 * scale);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX + bodyWidth / 2, baseY - 28 * scale);
  ctx.lineTo(centerX + bodyWidth / 2 + armLength, baseY - 12 * scale);
  ctx.stroke();

  ctx.fillStyle = '#34a8d6';
  drawRoundedRect(ctx, centerX - bodyWidth / 2 - armLength - 12 * scale, baseY - 42 * scale, 30 * scale, 54 * scale, 12 * scale);
  ctx.fill();
  ctx.stroke();
  drawRoundedRect(ctx, centerX + bodyWidth / 2 + armLength - 18 * scale, baseY - 42 * scale, 30 * scale, 54 * scale, 12 * scale);
  ctx.fill();
  ctx.stroke();

  // Legs
  ctx.strokeStyle = '#7c8b94';
  ctx.lineWidth = 10 * scale;
  ctx.beginPath();
  ctx.moveTo(centerX - 30 * scale, baseY + 80 * scale);
  ctx.lineTo(centerX - 42 * scale, baseY + 80 * scale + legLength);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX + 30 * scale, baseY + 80 * scale);
  ctx.lineTo(centerX + 42 * scale, baseY + 80 * scale + legLength);
  ctx.stroke();

  ctx.fillStyle = '#d44d3a';
  drawRoundedRect(ctx, centerX - 78 * scale, baseY + 180 * scale, 54 * scale, 26 * scale, 6 * scale);
  ctx.fill();
  drawRoundedRect(ctx, centerX + 20 * scale, baseY + 180 * scale, 54 * scale, 26 * scale, 6 * scale);
  ctx.fill();

  // Wind-up key
  ctx.strokeStyle = '#b8892d';
  ctx.lineWidth = 5 * scale;
  ctx.beginPath();
  ctx.moveTo(centerX - bodyWidth / 2 - 18 * scale, baseY - 2 * scale);
  ctx.lineTo(centerX - bodyWidth / 2 - 52 * scale, baseY - 2 * scale);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(centerX - bodyWidth / 2 - 62 * scale, baseY - 16 * scale, 12 * scale, 0, Math.PI * 2);
  ctx.arc(centerX - bodyWidth / 2 - 62 * scale, baseY + 12 * scale, 12 * scale, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
};

const createProjectionTexture = (
  slide: ProjectionSlide,
  slideIndex: number,
  deckLength: number,
  portraitImage: HTMLImageElement | null
) => {
  const canvas = document.createElement('canvas');
  canvas.width = PROJECTION_AREA.canvasWidth;
  canvas.height = PROJECTION_AREA.canvasHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }
  const accent = '#b8892d';
  const { label, title, subtitle, highlights, techStack = [], links = [], footer, status } = slide;
  const isMlKnowledgeSlide = slide.id === 'ml-knowledge';
  const isAboutSlide = slide.id === 'about';

  const gradient = ctx.createLinearGradient(0, 0, 0, PROJECTION_AREA.canvasHeight);
  gradient.addColorStop(0, '#f5e6c8');
  gradient.addColorStop(0.55, '#efe1cb');
  gradient.addColorStop(1, '#e6d4b9');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, PROJECTION_AREA.canvasWidth, PROJECTION_AREA.canvasHeight);

  const glow = ctx.createRadialGradient(
    PROJECTION_AREA.canvasWidth / 2,
    PROJECTION_AREA.canvasHeight / 2,
    100,
    PROJECTION_AREA.canvasWidth / 2,
    PROJECTION_AREA.canvasHeight / 2,
    PROJECTION_AREA.canvasWidth / 1.35
  );
  glow.addColorStop(0, 'rgba(255,255,255,0.42)');
  glow.addColorStop(0.68, 'rgba(255,255,255,0.04)');
  glow.addColorStop(1, 'rgba(116,82,46,0.12)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, PROJECTION_AREA.canvasWidth, PROJECTION_AREA.canvasHeight);

  ctx.strokeStyle = 'rgba(84, 59, 36, 0.12)';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, PROJECTION_AREA.canvasWidth - 20, PROJECTION_AREA.canvasHeight - 20);

  for (let y = 0; y < PROJECTION_AREA.canvasHeight; y += 4) {
    ctx.fillStyle = 'rgba(78, 54, 30, 0.018)';
    ctx.fillRect(0, y, PROJECTION_AREA.canvasWidth, 1);
  }

  ctx.fillStyle = accent;
  ctx.fillRect(PROJECTION_AREA.canvasWidth - 168, 42, 124, 10);

  ctx.fillStyle = accent;
  ctx.font = '600 20px Inter, sans-serif';
  ctx.fillText(label, 48, 64);

  ctx.fillStyle = '#2a1a10';
  ctx.font = '700 70px Inter, sans-serif';
  ctx.fillText(title, 48, 140);

  ctx.fillStyle = '#6a5644';
  ctx.font = '400 34px Inter, sans-serif';
  if (subtitle) {
    ctx.fillText(subtitle, 48, 188);
  }

  if (status) {
    ctx.fillStyle = 'rgba(184, 137, 45, 0.16)';
    ctx.fillRect(PROJECTION_AREA.canvasWidth - 328, 152, 250, 38);
    ctx.strokeStyle = 'rgba(184, 137, 45, 0.26)';
    ctx.strokeRect(PROJECTION_AREA.canvasWidth - 328, 152, 250, 38);
    ctx.fillStyle = accent;
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillText(status, PROJECTION_AREA.canvasWidth - 306, 178);
  }

  if (deckLength > 1) {
    ctx.fillStyle = '#9b856b';
    ctx.font = '500 18px Inter, sans-serif';
    const counter = `${String(slideIndex + 1).padStart(2, '0')} / ${String(deckLength).padStart(2, '0')}`;
    ctx.fillText(counter, PROJECTION_AREA.canvasWidth - 140, 78);
  }

  ctx.strokeStyle = 'rgba(91, 67, 48, 0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 224);
  ctx.lineTo(PROJECTION_AREA.canvasWidth - 48, 224);
  ctx.stroke();

  const leftX = 72;
  const rightCardX = 996;
  let bulletY = 280;

  ctx.fillStyle = '#2f2218';
  ctx.font = '400 28px Inter, sans-serif';
  highlights.slice(0, 5).forEach((item) => {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(leftX, bulletY - 10, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2f2218';
    bulletY = drawWrappedText(ctx, item, leftX + 22, bulletY, 760, 38, 2);
    bulletY += 10;
  });

  if (isMlKnowledgeSlide) {
    drawRetroRobot(ctx, 1298, 394, 0.96);
  } else if (isAboutSlide && portraitImage) {
    const frameX = 1086;
    const frameY = 166;
    const frameWidth = 430;
    const frameHeight = 366;
    const imageX = frameX + 18;
    const imageY = frameY + 18;
    const imageWidth = frameWidth - 36;
    const imageHeight = frameHeight - 36;

    ctx.fillStyle = 'rgba(255,255,255,0.34)';
    drawRoundedRect(ctx, frameX, frameY, frameWidth, frameHeight, 26);
    ctx.fill();
    ctx.strokeStyle = 'rgba(91, 67, 48, 0.14)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    drawRoundedRect(ctx, imageX, imageY, imageWidth, imageHeight, 20);
    ctx.clip();

    const imageAspect = portraitImage.width / portraitImage.height;
    const frameAspect = imageWidth / imageHeight;

    let drawWidth = imageWidth;
    let drawHeight = imageHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imageAspect > frameAspect) {
      drawHeight = imageHeight;
      drawWidth = drawHeight * imageAspect;
      offsetX = (imageWidth - drawWidth) / 2;
    } else {
      drawWidth = imageWidth;
      drawHeight = drawWidth / imageAspect;
      offsetY = (imageHeight - drawHeight) / 2;
    }

    ctx.drawImage(
      portraitImage,
      imageX + offsetX,
      imageY + offsetY,
      drawWidth,
      drawHeight
    );
    ctx.restore();

    const portraitGlow = ctx.createLinearGradient(frameX, frameY, frameX, frameY + frameHeight);
    portraitGlow.addColorStop(0, 'rgba(255,255,255,0.18)');
    portraitGlow.addColorStop(1, 'rgba(184,137,45,0.08)');
    ctx.fillStyle = portraitGlow;
    drawRoundedRect(ctx, frameX, frameY, frameWidth, frameHeight, 26);
    ctx.fill();
  } else {
    const cardHeight = links.length > 0 ? 242 : techStack.length > 0 ? 210 : 176;
    ctx.fillStyle = 'rgba(255,255,255,0.46)';
    ctx.fillRect(rightCardX, 274, 606, cardHeight);
    ctx.strokeStyle = 'rgba(91, 67, 48, 0.1)';
    ctx.strokeRect(rightCardX, 274, 606, cardHeight);

    let cardY = 310;

    if (techStack.length > 0) {
      ctx.fillStyle = '#7d6753';
      ctx.font = '600 18px Inter, sans-serif';
      ctx.fillText('TECH STACK', rightCardX + 28, cardY);
      cardY += 28;

      let chipX = rightCardX + 28;
      let chipY = cardY;
      techStack.forEach((item) => {
        ctx.font = '500 18px Inter, sans-serif';
        const chipWidth = Math.max(118, ctx.measureText(item).width + 30);

        if (chipX + chipWidth > rightCardX + 560) {
          chipX = rightCardX + 28;
          chipY += 40;
        }

        ctx.fillStyle = '#faf4ea';
        ctx.fillRect(chipX, chipY - 22, chipWidth, 30);
        ctx.strokeStyle = 'rgba(91, 67, 48, 0.08)';
        ctx.strokeRect(chipX, chipY - 22, chipWidth, 30);
        ctx.fillStyle = '#584636';
        ctx.fillText(item, chipX + 14, chipY - 2);
        chipX += chipWidth + 10;
      });

      cardY = chipY + 34;
    }

    if (links.length > 0) {
      if (techStack.length > 0) {
        ctx.strokeStyle = 'rgba(91, 67, 48, 0.1)';
        ctx.beginPath();
        ctx.moveTo(rightCardX + 28, cardY - 4);
        ctx.lineTo(rightCardX + 578, cardY - 4);
        ctx.stroke();
        cardY += 18;
      }

      ctx.fillStyle = '#7d6753';
      ctx.font = '600 18px Inter, sans-serif';
      ctx.fillText('LINKS', rightCardX + 28, cardY);
      cardY += 34;

      links.forEach((link) => {
        ctx.fillStyle = accent;
        ctx.font = '600 18px Inter, sans-serif';
        ctx.fillText(`${link.label}:`, rightCardX + 28, cardY);
        ctx.fillStyle = '#2f2218';
        ctx.font = '400 18px Inter, sans-serif';
        ctx.fillText(link.value, rightCardX + 120, cardY, 430);
        cardY += 30;
      });
    }
  }

  if (footer) {
    ctx.fillStyle = '#735d49';
    ctx.font = '500 20px Inter, sans-serif';
    ctx.fillText(footer, 72, PROJECTION_AREA.canvasHeight - 30);
  }

  if (deckLength > 1) {
    const dotSpacing = 22;
    const dotsWidth = (deckLength - 1) * dotSpacing;
    const startX = PROJECTION_AREA.canvasWidth / 2 - dotsWidth / 2;
    for (let index = 0; index < deckLength; index += 1) {
      ctx.beginPath();
      ctx.arc(startX + index * dotSpacing, PROJECTION_AREA.canvasHeight - 28, index === slideIndex ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = index === slideIndex ? accent : 'rgba(120, 92, 62, 0.35)';
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
};

export const ProjectionScreenContent: React.FC<ProjectionScreenContentProps> = ({
  propId,
}) => {
  const [displayPropId, setDisplayPropId] = useState<string | null>(propId);
  const [slideIndex, setSlideIndex] = useState(0);
  const [targetOpacity, setTargetOpacity] = useState(propId ? 1 : 0);
  const [portraitImage, setPortraitImage] = useState<HTMLImageElement | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const deck = useMemo(
    () => (displayPropId ? projectionDecks[displayPropId] ?? [] : []),
    [displayPropId]
  );

  useEffect(() => {
    const image = new Image();
    image.src = passportImageUrl;
    image.onload = () => setPortraitImage(image);

    return () => {
      image.onload = null;
    };
  }, []);

  useEffect(() => {
    if (propId) {
      setDisplayPropId(propId);
      setSlideIndex(0);
      setTargetOpacity(1);
      return;
    }

    setTargetOpacity(0);
    const timeout = window.setTimeout(
      () => setDisplayPropId(null),
      FADE_OUT_SECONDS * 1000
    );
    return () => window.clearTimeout(timeout);
  }, [propId]);

  useEffect(() => {
    if (deck.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % deck.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(interval);
  }, [deck.length, displayPropId]);

  const texture = useMemo(() => {
    const slide = deck[slideIndex];
    if (!slide) return null;
    return createProjectionTexture(slide, slideIndex, deck.length, portraitImage);
  }, [deck, portraitImage, slideIndex]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    const fadeDuration = targetOpacity > materialRef.current.opacity
      ? FADE_IN_SECONDS
      : FADE_OUT_SECONDS;
    const step = targetOpacity > materialRef.current.opacity
      ? 1 / fadeDuration
      : -1 / fadeDuration;
    materialRef.current.opacity = THREE.MathUtils.clamp(
      materialRef.current.opacity + step * delta,
      0,
      1
    );
  });

  if (!displayPropId || !texture || deck.length === 0) return null;

  return (
    <mesh position={PROJECTION_AREA.position} renderOrder={1}>
      <planeGeometry args={PROJECTION_AREA.size} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        toneMapped={false}
        transparent
        opacity={0}
      />
    </mesh>
  );
};
