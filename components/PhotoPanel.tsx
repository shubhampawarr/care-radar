import Image from "next/image";
import { resolveImageSrc, siteImages, type SiteImageKey } from "@/lib/site-images";

type PhotoPanelProps = {
  imageKey: SiteImageKey;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  overlay?: "dark" | "light" | "gradient" | "none";
};

const overlayClasses = {
  dark: "bg-gradient-to-t from-black/65 via-black/20 to-black/10",
  light: "bg-gradient-to-t from-white/80 via-white/20 to-transparent",
  gradient:
    "bg-gradient-to-t from-[#061f3d]/75 via-[#061f3d]/25 to-transparent",
  none: "",
};

export default function PhotoPanel({
  imageKey,
  className = "",
  imageClassName = "object-cover",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  overlay = "gradient",
}: PhotoPanelProps) {
  const image = siteImages[imageKey];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={resolveImageSrc(image.src, 1200)}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={imageClassName}
      />
      {overlay !== "none" && (
        <div
          className={`pointer-events-none absolute inset-0 ${overlayClasses[overlay]}`}
        />
      )}
    </div>
  );
}
