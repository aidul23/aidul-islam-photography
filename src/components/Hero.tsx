import { useState } from "react";
import { toThumbPath } from "@/lib/images";

const COVER_FULL = "/images/cover.JPG";
const COVER_PREVIEW = toThumbPath(COVER_FULL);

const Hero = () => {
  const [coverSrc, setCoverSrc] = useState(COVER_PREVIEW);

  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-16 pt-28 md:pb-24 px-6 md:px-12 lg:px-20">
      <div className="absolute inset-0">
        <img
          src={coverSrc}
          alt="Misty mountain landscape at dawn"
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onError={() => {
            if (coverSrc !== COVER_FULL) setCoverSrc(COVER_FULL);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/10" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/20 via-black/10 to-transparent" />
      </div>

      <div className="max-w-screen-xl mx-auto w-full">
        <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-20 py-5">
          <nav className="mx-auto flex max-w-screen-xl items-center justify-between rounded-full px-5 py-3">
            <span className="font-display text-xl tracking-wide text-foreground">
              Md Aidul Islam
            </span>
            <div className="flex gap-4 md:gap-8 font-body text-[11px] md:text-sm tracking-[0.22em] uppercase text-foreground">
              <a href="#work" className="hover:text-muted-foreground transition-colors duration-200">Work</a>
              <a href="#gear" className="hover:text-muted-foreground transition-colors duration-200">Gear</a>
              <a href="#about" className="hover:text-muted-foreground transition-colors duration-200">About</a>
              <a href="#contact" className="hover:text-muted-foreground transition-colors duration-200">Contact</a>
            </div>
          </nav>
        </div>

        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white opacity-0 animate-fade-up"
          style={{ lineHeight: "0.95", animationDelay: "0.3s", textShadow: "0 6px 24px rgba(0,0,0,0.55)" }}
        >
          Seeing what
          <br />
          others overlook
        </h1>
        <p
          className="mt-6 font-body text-sm md:text-base text-white/90 max-w-md tracking-wide opacity-0 animate-fade-up"
          style={{ animationDelay: "0.6s", textShadow: "0 4px 14px rgba(0,0,0,0.45)" }}
        >
          Street & Travel photography across landscapes, portraits, and the quiet moments in between.
        </p>
      </div>
    </section>
  );
};

export default Hero;
