import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MessageCircle, Heart, Mic, Camera, Settings } from 'lucide-react';
import LoginForm from './LoginForm';
import HugMode from './HugMode';
import { useChatbot } from '../context/ChatbotContext';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const AIAvatarDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showHugMode, setShowHugMode] = useState(false);
  const { openAvatarSelection, openChatbot } = useChatbot();
  const [user, setUser] = useState<User | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const steps = [
    { title: 'Login & Setup', icon: Settings },
    { title: 'Choose Your Buddy', icon: Camera },
    { title: 'Start Chatting', icon: MessageCircle }
  ];

  const avatarOptions = [
    {
      name: 'Aria',
      image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=300',
      personality: 'Cheerful & Optimistic'
    },
    {
      name: 'Maya',
      image: 'https://images.pexels.com/photos/4946515/pexels-photo-4946515.jpeg?auto=compress&cs=tinysrgb&w=300',
      personality: 'Calm & Thoughtful'
    },
    {
      name: 'Zara',
      image: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=300',
      personality: 'Energetic & Fun'
    }
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [steps.length]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (data: any) => {
    setShowLoginForm(false);
  };

  const handleStepClick = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Login & Setup
        setShowLoginForm(true);
        break;
      case 1: // Choose Your Buddy
        openAvatarSelection();
        break;
      case 2: // Start Chatting
        openChatbot();
        break;
    }
  };

  const triggerHugMode = () => {
    console.log('Hug Mode triggered. User state:', user);
    if (!user) {
      console.log('User not authenticated, showing login form');
      alert("Please log in to use Hug Mode.");
      setShowLoginForm(true);
      return;
    }
    console.log('User authenticated, opening Hug Mode');
    setShowHugMode(true);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-mint-green/20 via-dusty-teal/10 to-coral-pink/20 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: 8 + i * 2,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            className={`absolute w-4 h-4 rounded-full opacity-20 ${
              i % 3 === 0 ? 'bg-coral-pink' : i % 3 === 1 ? 'bg-mint-green' : 'bg-dusty-teal'
            }`}
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i * 8)}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-700 mb-6">
            Experience <span className="text-coral-pink">AI Companionship</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            See how Bolo Mitra creates meaningful connections through advanced AI technology
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - User Flow Steps */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-slate-700 mb-8">User Journey</h3>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                onClick={() => handleStepClick(index)}
                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-500 cursor-pointer ${
                  currentStep === index 
                    ? 'bg-coral-pink/20 scale-105 shadow-lg' 
                    : 'bg-white/50 hover:bg-white/70 hover:scale-105'
                }`}
                animate={{
                  scale: currentStep === index ? 1.05 : 1,
                  backgroundColor: currentStep === index ? 'rgba(243, 181, 164, 0.2)' : 'rgba(255, 255, 255, 0.5)'
                }}
              >
                <div className={`p-3 rounded-full ${
                  currentStep === index ? 'bg-coral-pink text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <step.icon size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700">{step.title}</h4>
                  <p className="text-sm text-slate-600">
                    {index === 0 && 'Create account and set preferences'}
                    {index === 1 && 'Select or upload your AI buddy avatar'}
                    {index === 2 && 'Begin conversations with text or voice'}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Side - Interactive AI Avatar Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Platform Base */}
            <div className="relative bg-gradient-to-r from-mint-green/30 to-dusty-teal/30 rounded-full w-80 h-80 mx-auto flex items-center justify-center shadow-2xl">
              {/* Rotating Animation Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute inset-4 border-4 border-dashed border-coral-pink/40 rounded-full"
              />
              
              {/* AI Avatar */}
              <motion.div
                className="relative z-10"
                transition={{ duration: 0.5 }}
              >
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={selectedAvatar.image}
                    alt={selectedAvatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Floating Icons Around Avatar */}
                {[MessageCircle, Heart, Mic, Camera].map((Icon, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      rotate: [0, 360],
                      y: [0, -10, 0],
                    }}
                    transition={{
                      rotate: { repeat: Infinity, duration: 15, ease: "linear" },
                      y: { repeat: Infinity, duration: 2, delay: index * 0.5 }
                    }}
                    className="absolute bg-white p-3 rounded-full shadow-lg"
                    style={{
                      top: index === 0 ? '10%' : index === 1 ? '90%' : '50%',
                      left: index === 2 ? '10%' : index === 3 ? '90%' : '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Icon size={20} className="text-coral-pink" />
                  </motion.div>
                ))}
              </motion.div>


            </div>

            {/* Avatar Selection */}
            <div className="mt-8 flex justify-center space-x-4">
              {avatarOptions.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                    selectedAvatar.name === avatar.name 
                      ? 'border-coral-pink scale-110' 
                      : 'border-slate-300 hover:border-coral-pink/50'
                  }`}
                >
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Demo Chat Interface */}
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="space-y-3 mb-4 max-h-32 overflow-y-auto">
                <div className="flex justify-start">
                  <div className="max-w-xs px-4 py-2 rounded-2xl bg-mint-green/30 text-slate-700">
                    Hi! I'm your AI companion. How are you feeling today?
                  </div>
                </div>
              </div>
              
              <button
                onClick={triggerHugMode}
                className={`w-full py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 ${
                  user 
                    ? 'bg-gradient-to-r from-coral-pink to-dusty-teal text-white' 
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
                disabled={!user}
              >
                {user ? 'Try Hug Mode 🤗' : 'Login Required for Hug Mode 🔒'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <LoginForm 
        isOpen={showLoginForm} 
        onClose={() => setShowLoginForm(false)} 
        onLogin={handleLogin}
      />
      
      <HugMode 
        isOpen={showHugMode} 
        onClose={() => setShowHugMode(false)} 
        selectedAvatar={selectedAvatar}
      />
    </section>
  );
};

export default AIAvatarDemo;