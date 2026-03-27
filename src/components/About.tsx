import { useEffect, useRef } from "react";

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section id="about" className="px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-border">
      <div
        ref={sectionRef}
        className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-12 md:gap-24 opacity-0"
      >
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight" style={{ lineHeight: "1.1" }}>
            About
          </h2>
        </div>
        <div className="space-y-6">
          <p className="font-body text-base leading-relaxed text-muted-foreground max-w-prose" style={{ textWrap: "pretty" }}>
            Based on Tampere, Finland, I work at the intersection of Street, Travel and Portrait photography. My practice is driven by patience — waiting for the light, the stillness, the unguarded moment that reveals something true.
          </p>
          <p className="font-body text-base leading-relaxed text-muted-foreground max-w-prose" style={{ textWrap: "pretty" }}>
            Over the past ten years, my work has appeared in various publications. I'm available for editorial commissions, brand partnerships, and personal projects.
          </p>
          <div className="pt-4">
            <a
              href="mailto:aidulislamphotography@gmail.com"
              className="font-body text-sm tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors duration-200 border-b border-foreground pb-1"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
