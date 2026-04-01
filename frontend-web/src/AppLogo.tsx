import { Sparkles } from "lucide-react";

type AppLogoProps = {
  variant?: "header" | "sidebar" | "hero";
  className?: string;
};

/** Text-free brand mark (icon + optional wordmark). No raster image assets. */
export function AppLogo({ variant = "header", className = "" }: AppLogoProps) {
  const showWordmark = variant === "hero";
  return (
    <div
      className={["app-logo-mark", `app-logo-mark--${variant}`, className].filter(Boolean).join(" ")}
      role="img"
      aria-label="Petasight"
    >
      <span className="app-logo-mark__glyph" aria-hidden>
        <Sparkles strokeWidth={2} />
      </span>
      {showWordmark && <span className="app-logo-mark__word">Petasight</span>}
    </div>
  );
}
