"use client";

import Image from "next/image";

type HackathonCoverProps = {
  image: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function HackathonCover({ image, alt, className, priority = false }: HackathonCoverProps) {
  return (
    <div className={className} role="img" aria-label={alt} style={{ position: "relative" }}>
      <Image
        src={image}
        alt={alt}
        fill
        quality={60}
        sizes="(max-width: 1024px) 104px, 104px"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        style={{ objectFit: "cover", display: "block", backgroundColor: "#FBFAF5" }}
      />
    </div>
  );
}
