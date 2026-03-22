"use client";

import { HalftoneCmyk } from "@paper-design/shaders-react";

type AboutShaderCardProps = {
  image: string;
  className?: string;
};

export function AboutShaderCard({ image, className }: AboutShaderCardProps) {
  return (
    <div className={className}>
      <HalftoneCmyk
        size={0.2}
        gridNoise={0.2}
        type="ink"
        softness={1}
        contrast={1}
        gainC={0.3}
        gainM={0}
        gainY={0.2}
        gainK={0}
        floodC={0.15}
        floodM={0}
        floodY={0}
        floodK={0}
        scale={1}
        image={image}
        grainSize={0.5}
        fit="cover"
        colorBack="#00000000"
        colorC="#00B4FF"
        colorM="#FC519F"
        colorY="#FFD800"
        colorK="#231F20"
        style={{ backgroundColor: "#FBFAF5", width: "100%", height: "100%" }}
      />
    </div>
  );
}
