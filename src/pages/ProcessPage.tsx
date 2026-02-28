import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProcessSection from "@/components/ProcessSection";
import { useSiteSection } from "@/hooks/use-cms-data";

const ProcessPage = () => {
  const { data: section } = useSiteSection("process");
  const content = section?.content as any;

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        tagline={section?.subtitle || "Our Process"}
        title={section?.title || "How We Work"}
        description={content?.page_description}
      />
      <ProcessSection showHeader={false} />
      <Footer />
    </div>
  );
};

export default ProcessPage;
