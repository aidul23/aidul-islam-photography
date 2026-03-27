import { useEffect, useRef } from "react";

const gearSets = [
  {
    label: "Camera Bodies",
    items: ["Nikon d5300", "Sony a6400"],
  },
  {
    label: "Lenses",
    items: ["Nikon AF-S Nikkor 50mm f/1.8", "Sigma 56mm f/1.4 DC DN", "Sony E PZ 16-50mm F3.5-5.6 OSS"],
  },
  {
    label: "Field Essentials",
    items: ["Carbon tripod", "Godox TT685 II -flash (Sony)"],
  },
];

const Gear = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-up");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="gear" className="border-t border-border px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div ref={sectionRef} className="mx-auto grid max-w-screen-xl gap-12 opacity-0 md:grid-cols-[0.8fr_1.2fr] md:gap-24">
        <div>
          <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl" style={{ lineHeight: "1.1" }}>
            Gear I Trust
          </h2>
          <p className="mt-5 max-w-sm font-body text-base leading-relaxed text-muted-foreground">
            A compact setup built for travel, quiet portraits, and long days waiting for light to shift.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {gearSets.map((group) => (
            <article key={group.label} className="flex min-h-56 flex-col justify-between border border-border bg-card px-6 py-7">
              <span className="font-body text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {group.label}
              </span>
              <ul className="mt-8 space-y-3">
                {group.items.map((item) => (
                  <li key={item} className="font-display text-2xl leading-tight text-card-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gear;