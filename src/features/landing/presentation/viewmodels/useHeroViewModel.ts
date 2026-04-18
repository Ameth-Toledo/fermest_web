import { useEffect, useRef, useState } from "react";

export const useHeroViewModel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setRotY(((e.clientX - cx) / (rect.width / 2)) * 22);
    setRotX((-(e.clientY - cy) / (rect.height / 2)) * 22);
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
  };

  return { containerRef, rotX, rotY, mounted, mousePos, handleMouseMove, handleMouseLeave };
};
