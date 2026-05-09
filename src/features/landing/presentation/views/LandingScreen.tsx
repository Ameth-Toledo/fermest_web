import { ReactLenis } from "lenis/react";
import Blog from "../components/Blog";
import Characteristics from "../components/Characteristics";
import Equipment from "../components/Equipment";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";

const LandingView = () => {
    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
            <Header/>
            <Hero/>
            <Characteristics/>
            <HowItWorks/>
            <Blog/>
            <Equipment/>
            <Footer/>
        </ReactLenis>
    );
}

export default LandingView;
