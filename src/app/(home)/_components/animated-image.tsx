"use client";
import { useState } from "react";
import Image from "next/image";

export default function AnimatedImage({
  src,
  alt,
  onExit,
}: {
  src: string;
  alt: string;
  onExit?: () => void;
}) {
  const [animateOut, setAnimateOut] = useState(false);

  // Chiamare questa funzione quando vuoi far uscire l'immagine
  const handleExit = () => setAnimateOut(true);

  return (
    <Image
      src={src}
      alt={alt}
      width={500}
      height={500}
      className={`mx-auto bg-transparent size-[300px] sm:size-[500px] ${
        animateOut ? "animate-jump-out" : "animate-jump-in"
      }`}
      onAnimationEnd={() => {
        if (animateOut && onExit) onExit();
      }}
    />
  );
}
