
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhySection from './components/WhySection';
import AIAvatarDemo from './components/AIAvatarDemo';
import KeyFeatures from './components/KeyFeatures';
import ServicesSection from './components/ServicesSection';
import VisionSection from './components/VisionSection';
import AvatarPreview from './components/AvatarPreview';
import MitraLookSection from './components/MitraLookSection';

import Testimonials from './components/Testimonials';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AvatarSelection from './components/AvatarSelection';
import { ChatbotProvider } from './context/ChatbotContext';

function App() {
  return (
    <ChatbotProvider>
      <div className="font-poppins">
        <Navbar />
        <Hero />
        <WhySection />
        <AIAvatarDemo />
        <KeyFeatures />
        <ServicesSection />
        <VisionSection />
        <AvatarPreview />
        <MitraLookSection isLoggedIn={false} />

        <Testimonials />
        <TeamSection />
        <ContactSection />
        <Footer />
        <Chatbot />
        <AvatarSelection />
      </div>
    </ChatbotProvider>
  );
}

export default App;