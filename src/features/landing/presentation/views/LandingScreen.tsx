import Blog from "../components/Blog";
import Characteristics from "../components/Characteristics";
import Equipment from "../components/Equipment";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";

const LandingView = () => {
    return (
        <div>
            <Header/>
            <Hero/>
            <Characteristics/>
            <HowItWorks/>
            <Blog/>
            <Equipment/>
            <Footer/>
        </div>
    );
}

export default LandingView;