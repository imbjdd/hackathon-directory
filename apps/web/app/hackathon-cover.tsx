type HackathonCoverProps = {
  image: string;
  alt: string;
  className?: string;
};

export function HackathonCover({ image, alt, className }: HackathonCoverProps) {
  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", backgroundColor: "#FBFAF5" }}
      />
    </div>
  );
}
