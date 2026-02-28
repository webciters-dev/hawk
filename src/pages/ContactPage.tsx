import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ContactSection from "@/components/ContactSection";
import { useSiteSection } from "@/hooks/use-cms-data";

const ContactPage = () => {
  const { data: section } = useSiteSection("contact");
  const content = section?.content as any;

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        tagline={section?.subtitle || "Contact Us"}
        title={section?.title || "Get In Touch"}
        description={content?.page_description}
      />
      <ContactSection showHeader={false} />
      <Footer />
    </div>
  );
};

export default ContactPage;
