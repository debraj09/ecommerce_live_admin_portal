import { useEffect } from "react";
import { Link } from "react-router-dom";

// components
import Clients from "./Clients";
import ContactUs from "./ContactUs";
import FAQ from "./FAQ";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import Layouts from "./Layouts";
import NavBar from "./NavBar";
import Pricing from "./Pricing";
import Services from "./Services";
import Testimonial from "./Testimonial";

// dummy data
import { features, layouts,
// plans,
rawFaqs, services, testimonial } from "./data";
const Landing = () => {
  useEffect(() => {
    if (document.body) document.body.classList.remove("authentication-bg", "authentication-bg-pattern");

    // manage go to top button
    let mybutton = document.getElementById("back-to-top-btn");
    window.addEventListener("scroll", () => {
      if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    });
  }, []);

  /**
   * reach to top of web page
   */
  const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  return <div id="landing">
      {/* navbar */}
      <NavBar />

      {/* hero */}
      <Hero />

      {/* Clients */}
      <Clients />

      {/* services */}
      <Services services={services} />

      {/* layout demos */}
      <Layouts layouts={layouts} />

      {/* features */}
      <Features features={features} />

      {/* pricing */}
      <Pricing />

      {/* faqs */}
      <FAQ rawFaqs={rawFaqs} />

      {/* testimonial */}
      <Testimonial testimonial={testimonial} />

      {/* contact */}
      <ContactUs />

      {/* footer */}
      <Footer />

      <Link to="#" onClick={() => topFunction()} className="back-to-top-btn btn btn-primary" id="back-to-top-btn">
        <i className="mdi mdi-chevron-up"></i>
      </Link>
    </div>;
};
export default Landing;