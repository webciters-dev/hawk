import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

const CookiePolicyPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <PageHero
      tagline="Legal"
      title="Cookie Policy"
      description="This is the Cookie Policy for HawkVision Strategies, accessible from www.HawkVisionStrategies.com"
    />

    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <div className="space-y-12 font-body text-sm text-muted-foreground leading-[1.9]">
          {/* What Are Cookies */}
          <div>
            <h2 className="font-display text-2xl text-foreground mb-4">What Are Cookies</h2>
            <p>
              As is common practice with almost all professional websites this site uses cookies,
              which are tiny files that are downloaded to your computer, to improve your experience.
              This page describes what information they gather, how we use it and why we sometimes
              need to store these cookies. We will also share how you can prevent these cookies from
              being stored however this may downgrade or 'break' certain elements of the sites
              functionality.
            </p>
          </div>

          {/* How We Use Cookies */}
          <div>
            <h2 className="font-display text-2xl text-foreground mb-4">How We Use Cookies</h2>
            <p>
              We use cookies for a variety of reasons detailed below. Unfortunately in most cases
              there are no industry standard options for disabling cookies without completely
              disabling the functionality and features they add to this site. It is recommended that
              you leave on all cookies if you are not sure whether you need them or not in case they
              are used to provide a service that you use.
            </p>
          </div>

          {/* Disabling Cookies */}
          <div>
            <h2 className="font-display text-2xl text-foreground mb-4">Disabling Cookies</h2>
            <p>
              You can prevent the setting of cookies by adjusting the settings on your browser (see
              your browser Help for how to do this). Be aware that disabling cookies will affect the
              functionality of this and many other websites that you visit. Disabling cookies will
              usually result in also disabling certain functionality and features of this site.
              Therefore it is recommended that you do not disable cookies.
            </p>
          </div>

          {/* The Cookies We Set */}
          <div>
            <h2 className="font-display text-2xl text-foreground mb-4">The Cookies We Set</h2>
            <h3 className="font-display text-lg text-foreground mb-2">Site preferences cookies</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                In order to provide you with a great experience on this site we provide the
                functionality to set your preferences for how this site runs when you use it.
              </li>
              <li>
                In order to remember your preferences, we need to set cookies so that this
                information can be called whenever you interact with a page is affected by your
                preferences.
              </li>
            </ul>
          </div>

          {/* Third-Party Cookies */}
          <div>
            <h2 className="font-display text-2xl text-foreground mb-4">Third-Party Cookies</h2>
            <p className="mb-4">
              In some special cases, we also use cookies provided by trusted third parties. The
              following section details which third-party cookies you might encounter through this
              site:
            </p>
            <p className="mb-4">
              <strong className="text-foreground">Google Analytics:</strong> This site uses Google
              Analytics which is one of the most widespread and trusted analytics solutions on the
              web for helping us to understand how you use the site and ways that we can improve your
              experience. These cookies may track things such as how long you spend on the site and
              the pages that you visit so we can continue to produce engaging content.
            </p>
            <p>
              Third-party analytics are used to track and measure usage of this site so that we can
              continue to produce engaging content. These cookies may track things such as how long
              you spend on the site or pages you visit which helps us to understand how we can
              improve the site for you.
            </p>
          </div>

          {/* More Information */}
          <div>
            <h2 className="font-display text-2xl text-foreground mb-4">More Information</h2>
            <p className="mb-4">
              Hopefully, that has clarified things for you and as was previously mentioned if there
              is something that you aren't sure whether you need or not it's usually safer to leave
              cookies enabled in case it does interact with one of the features you use on our site.
            </p>
            <p>
              However, if you are still looking for more information, you can contact us through one
              of our preferred contact methods:
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-foreground font-medium">Email:</span>{" "}
                <a
                  href="mailto:Shireen@HawkVisionStrategies.com"
                  className="text-primary hover:underline"
                >
                  Shireen@HawkVisionStrategies.com
                </a>
              </li>
              <li>
                <span className="text-foreground font-medium">Phone:</span>{" "}
                <a href="tel:+31621606673" className="text-primary hover:underline">
                  +31 (0) 621 606 673
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default CookiePolicyPage;
