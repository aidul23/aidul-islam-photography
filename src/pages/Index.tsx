import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Gear from "@/components/Gear";
import About from "@/components/About";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <Gallery />
      <Gear />
      <About />
      <Footer />
    </main>
  );
};

export default Index;
