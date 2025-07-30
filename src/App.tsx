
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
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);
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
        {user ? <Chatbot /> : <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded shadow">Please log in to use the AI chatbot.</div>}
        {user ? <AvatarSelection /> : null}
      </div>
    </ChatbotProvider>
  );
}

export default App;