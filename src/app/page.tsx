import Navigation from "./navigation";
import HeroContent from "./hero-content";
import HeroMarquee from "./hero-marquee";
import AmbientScene from "./ambient-scene";
import AboutCapabilities from "./about-capabilities";
import SelectedWork from "./selected-work";
import IntroPreloader from "./intro-preloader";
import { ArrowUpRight } from "lucide-react";
import { MagneticCursor, SmoothScroll } from "./motion";

export default function Home() {
  return <>
    <SmoothScroll />
    <IntroPreloader />
    <AmbientScene />
    <Navigation />
    <MagneticCursor />
    <main>
      <HeroContent />
      <HeroMarquee />

      <SelectedWork />

      <AboutCapabilities />


      <footer className="footer section-wrap" id="contact"><div className="footer-top"><span className="section-kicker">03 / Have a good one in mind?</span><span className="availability"><span className="availability-dot" /> Open to the right project</span></div><a className="footer-cta" href="#home">Let&apos;s connect<span className="footer-cta-arrow"><ArrowUpRight size={34} strokeWidth={1.2} /></span></a><div className="footer-bottom"><a className="wordmark" href="#home"><span>YASSINE.TALATI</span><span className="wordmark-badge">/ FT</span></a><span className="footer-position">Finance Student · Vibe Coder · AI Automation Specialist</span><span className="copyright">© 2026 Yassine Talati · Morocco</span></div></footer>
    </main>
  </>;
}
