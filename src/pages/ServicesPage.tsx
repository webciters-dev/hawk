import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ServicesSection from "@/components/ServicesSection";
import { useSiteSection } from "@/hooks/use-cms-data";

const ServicesPage = () => {
  const { data: section } = useSiteSection("services");
  const content = section?.content as any;

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        tagline={section?.subtitle || "Our Services"}
        title={section?.title || "What We Do"}
        description={content?.page_description}
      />
      <ServicesSection showHeader={false} />
      <Footer />
    </div>
  );
};

export default ServicesPage;
