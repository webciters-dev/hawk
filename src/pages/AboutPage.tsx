import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import WhyUsSection from "@/components/WhyUsSection";
import { useSiteSection } from "@/hooks/use-cms-data";

const AboutPage = () => {
  const { data: section } = useSiteSection("about");
  const content = section?.content as any;

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        tagline="About"
        title={section?.title || "About Hawk Vision Strategies"}
        description={content?.page_description}
      />
      <WhyUsSection showHeader={false} />
      <Footer />
    </div>
  );
};

export default AboutPage;
