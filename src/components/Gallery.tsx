import { useEffect, useMemo, useRef, useState } from "react";
import { galleryImageSrc } from "@/lib/images";

type Photo = {
  src: string;
  alt: string;
  title: string;
  category: string;
  /** Tailwind aspect class, e.g. aspect-[16/9]. Omit to use category defaults (Landscape → wide). */
  /** Optional custom thumb URL; otherwise /images/thumbs/{name}.webp */
  thumb?: string;
  aspect?: string;
};

/** Stable keys + Tailwind: keep literals here so JIT picks up JSON-driven classes. */
function previewAspectClass(photo: Photo): string {
  if (photo.aspect) return photo.aspect;
  if (photo.category === "Landscape") return "aspect-[16/9]";
  return "aspect-[3/4]";
}

type ImageLoadStatus = "loading" | "loaded" | "error";

function GalleryThumbnail({
  photo,
  imgClassName,
}: {
  photo: Photo;
  imgClassName: string;
}) {
  const [status, setStatus] = useState<ImageLoadStatus>("loading");
  const [useFullSrc, setUseFullSrc] = useState(false);
  const previewSrc = useFullSrc ? photo.src : galleryImageSrc(photo);

  useEffect(() => {
    setStatus("loading");
    setUseFullSrc(false);
  }, [photo.src]);

  return (
    <div className={`relative overflow-hidden rounded-sm ${previewAspectClass(photo)}`}>
      {status === "loading" && (
        <div className="gallery-img-loading-overlay" aria-hidden />
      )}
      <img
        src={previewSrc}
        alt={photo.alt}
        className={[
          imgClassName,
          "transition-opacity duration-500 ease-out",
          status === "loaded" ? "opacity-100" : "opacity-0",
          status === "error" ? "opacity-40 grayscale" : "",
        ].join(" ")}
        loading="lazy"
        decoding="async"
        onLoad={() => setStatus("loaded")}
        onError={() => {
          if (!useFullSrc) {
            setUseFullSrc(true);
            setStatus("loading");
            return;
          }
          setStatus("error");
        }}
      />
    </div>
  );
}

/** How many items show at first under "All" before "Load more". */
const ALL_TAB_PAGE_SIZE = 8;

function LightboxImage({ src, alt }: { src: string; alt: string }) {
  const [status, setStatus] = useState<ImageLoadStatus>("loading");

  useEffect(() => {
    setStatus("loading");
  }, [src]);

  return (
    <div className="relative flex max-h-full max-w-full items-center justify-center">
      {status === "loading" && (
        <div
          className="gallery-img-loading-ripple absolute inset-0 min-h-[50vh] min-w-[min(90vw,48rem)] max-w-full rounded-sm"
          aria-hidden
        />
      )}
      <img
        src={src}
        alt={alt}
        className={[
          "relative z-[1] max-h-full max-w-full object-contain transition-opacity duration-300",
          status === "loaded" ? "opacity-100" : "opacity-0",
        ].join(" ")}
        decoding="async"
        fetchPriority="high"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </div>
  );
}

const Gallery = () => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleAllCount, setVisibleAllCount] = useState(ALL_TAB_PAGE_SIZE);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const categories = useMemo(() => ["All", ...new Set(photos.map((photo) => photo.category))], [photos]);
  const filteredPhotos = useMemo(
    () => photos.filter((photo) => selectedCategory === "All" || photo.category === selectedCategory),
    [photos, selectedCategory]
  );

  const displayedPhotos = useMemo(() => {
    if (selectedCategory !== "All") return filteredPhotos;
    return filteredPhotos.slice(0, visibleAllCount);
  }, [filteredPhotos, selectedCategory, visibleAllCount]);

  const hasMoreAll =
    selectedCategory === "All" && filteredPhotos.length > visibleAllCount;
  const remainingAllCount = selectedCategory === "All"
    ? Math.max(0, filteredPhotos.length - visibleAllCount)
    : 0;

  const activePhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  useEffect(() => {
    let isMounted = true;

    const loadPhotos = async () => {
      try {
        const response = await fetch("/data/photos.json");
        if (!response.ok) throw new Error("Failed to load photos");
        const data = (await response.json()) as Photo[];
        if (isMounted) setPhotos(data);
      } catch (error) {
        console.error(error);
        if (isMounted) setPhotos([]);
      }
    };

    loadPhotos();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (headingRef.current) observer.observe(headingRef.current);

    itemsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [displayedPhotos]);

  useEffect(() => {
    setVisibleAllCount(ALL_TAB_PAGE_SIZE);
  }, [selectedCategory]);

  useEffect(() => {
    setActivePhotoIndex(null);
  }, [selectedCategory]);

  useEffect(() => {
    if (activePhotoIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePhotoIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActivePhotoIndex((prev) => {
          if (prev === null) return prev;
          return (prev + 1) % filteredPhotos.length;
        });
      }

      if (event.key === "ArrowLeft") {
        setActivePhotoIndex((prev) => {
          if (prev === null) return prev;
          return (prev - 1 + filteredPhotos.length) % filteredPhotos.length;
        });
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhotoIndex, filteredPhotos.length]);

  useEffect(() => {
    if (activePhotoIndex === null) return;

    const prefetch = (index: number) => {
      const photo = filteredPhotos[index];
      if (!photo) return;
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = photo.src;
      document.head.appendChild(link);
    };

    prefetch((activePhotoIndex + 1) % filteredPhotos.length);
    prefetch(
      (activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  }, [activePhotoIndex, filteredPhotos]);

  return (
    <section id="work" className="px-6 md:px-12 lg:px-20 py-24 md:py-32">
      <div className="max-w-screen-xl mx-auto">
        <h2
          className="font-display text-3xl md:text-4xl font-light tracking-tight mb-16 opacity-0"
          ref={headingRef}
          style={{ lineHeight: "1.1" }}
        >
          My Work
        </h2>

        <div className="mb-12 flex flex-wrap gap-3 border-b border-border pb-6">
          {categories.map((category) => {
            const isActive = category === selectedCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={[
                  "rounded-full border px-4 py-2 font-body text-xs uppercase tracking-[0.2em] transition-colors duration-200",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/40",
                ].join(" ")}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* aspect-square aspect-[3/4] aspect-[4/3] aspect-[16/9] aspect-[16/10] aspect-[3/2] — referenced for Tailwind from JSON */}
        <div className="columns-1 md:columns-2 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {displayedPhotos.map((photo, i) => (
            <div
              key={photo.src}
              ref={(el) => { itemsRef.current[i] = el; }}
              className="break-inside-avoid group cursor-pointer opacity-0"
              style={{ animationDelay: `${i * 0.1}s` }}
              onClick={() => setActivePhotoIndex(i)}
            >
              <GalleryThumbnail
                photo={photo}
                imgClassName="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="mt-3 flex justify-between items-baseline">
                <span className="font-display text-xl tracking-tight text-foreground">
                  {photo.title}
                </span>
                <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                  {photo.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {hasMoreAll && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleAllCount((n) => n + ALL_TAB_PAGE_SIZE)
              }
              className="rounded-full border border-foreground bg-transparent px-8 py-3 font-body text-xs uppercase tracking-[0.22em] text-foreground transition-colors duration-200 hover:bg-foreground hover:text-background"
            >
              See more
              <span className="ml-2 font-normal normal-case tracking-normal text-muted-foreground">
                ({remainingAllCount} left)
              </span>
            </button>
          </div>
        )}

        {!filteredPhotos.length && (
          <p className="mt-10 font-body text-sm text-muted-foreground">
            No photos found in this category yet.
          </p>
        )}
      </div>

      {activePhoto && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview image ${activePhoto.title}`}
          onClick={() => setActivePhotoIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActivePhotoIndex(null)}
            className="absolute right-4 top-4 rounded-full border border-white/30 px-3 py-1 text-xs tracking-widest uppercase text-white transition-colors hover:border-white"
          >
            Close
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActivePhotoIndex((prev) => {
                if (prev === null) return prev;
                return (prev - 1 + filteredPhotos.length) % filteredPhotos.length;
              });
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 px-3 py-2 text-white transition-colors hover:border-white"
            aria-label="Previous image"
          >
            &#8249;
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActivePhotoIndex((prev) => {
                if (prev === null) return prev;
                return (prev + 1) % filteredPhotos.length;
              });
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 px-3 py-2 text-white transition-colors hover:border-white"
            aria-label="Next image"
          >
            &#8250;
          </button>

          <div
            className="mx-auto flex h-full max-w-6xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <LightboxImage src={activePhoto.src} alt={activePhoto.alt} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
