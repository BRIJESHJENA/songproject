"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

export type BackgroundLayer = {
  id: string;
  src: StaticImageData | string;
  accent: string;
};

type BackgroundProps = {
  layer: BackgroundLayer;
};

export default function Background({ layer }: BackgroundProps) {
  const [layers, setLayers] = useState<[BackgroundLayer, BackgroundLayer | null]>([
    layer,
    null,
  ]);
  const [showB, setShowB] = useState(false);

  useEffect(() => {
    const current = showB ? layers[1] : layers[0];
    if (current?.id === layer.id) return;

    if (showB) {
      setLayers([layer, layers[1]]);
      setShowB(false);
    } else {
      setLayers([layers[0], layer]);
      setShowB(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- crossfade on id only
  }, [layer.id]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", layer.accent);
  }, [layer.accent]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0c0a09]">
      {[layers[0], layers[1]].map((item, index) => {
        if (!item) return null;
        const active = showB ? index === 1 : index === 0;
        return (
          <div
            key={`${item.id}-${index}`}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{
              opacity: active ? 1 : 0,
              transitionDuration: "800ms",
            }}
          >
            <div className="kenburns absolute inset-0">
              <Image
                src={item.src}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${item.accent}55 0%, transparent 45%, rgba(0,0,0,0.35) 100%)`,
                mixBlendMode: "multiply",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
