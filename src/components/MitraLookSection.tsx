import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Camera, Upload, User, Sparkles } from 'lucide-react';

interface MitraLookSectionProps {
  isLoggedIn: boolean;
  userPhoto?: string;
}

const MitraLookSection = ({ isLoggedIn, userPhoto }: MitraLookSectionProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(userPhoto || null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const defaultAvatars = [
    {
      name: 'Aria',
      image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=300',
      personality: 'Cheerful & Optimistic',
      color: 'from-pink-400 to-purple-500'
    },
    {
      name: 'Maya',
      image: 'https://images.pexels.com/photos/4946515/pexels-photo-4946515.jpeg?auto=compress&cs=tinysrgb&w=300',
      personality: 'Calm & Thoughtful',
      color: 'from-blue-400 to-teal-500'
    },
    {
      name: 'Zara',
      image: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=300',
      personality: 'Energetic & Fun',
      color: 'from-orange-400 to-red-500'
    },
    {
      name: 'Luna',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      personality: 'Mysterious & Wise',
      color: 'from-purple-400 to-indigo-500'
    }
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-mint-green/10 via-dusty-teal/5 to-coral-pink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-700 mb-6">
            Choose Your <span className="text-coral-pink">Mitra Look</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Select from our beautiful default avatars or upload your own photo to create a personalized companion
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Avatar Selection */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-700 mb-6">Default Avatars</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {defaultAvatars.map((avatar, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedAvatar(index)}
                    className={`relative p-4 rounded-2xl transition-all duration-300 ${
                      selectedAvatar === index 
                        ? 'ring-2 ring-coral-pink scale-105' 
                        : 'hover:scale-105'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-full h-32 rounded-xl overflow-hidden bg-gradient-to-br ${avatar.color} mb-3`}>
                      <img
                        src={avatar.image}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-slate-700 text-sm">{avatar.name}</h4>
                    <p className="text-xs text-slate-600">{avatar.personality}</p>
                  </motion.button>
                ))}
              </div>

              {/* Photo Upload Section - Only for logged-in users */}
              {isLoggedIn && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Camera size={20} />
                    Upload Your Photo
                  </h4>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed border-coral-pink/50 rounded-xl cursor-pointer hover:border-coral-pink transition-colors duration-300"
                      >
                        <Upload size={20} className="text-coral-pink" />
                        <span className="text-coral-pink font-medium">Choose Photo</span>
                      </label>
                    </div>
                    
                    {uploadedPhoto && (
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-coral-pink">
                          <img
                            src={uploadedPhoto}
                            alt="Uploaded photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-slate-600 mt-2">Your photo uploaded successfully!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!isLoggedIn && (
                <div className="border-t pt-6">
                  <div className="bg-gradient-to-r from-coral-pink/10 to-dusty-teal/10 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <User size={20} className="text-coral-pink" />
                      <span className="font-semibold text-slate-700">Login Required</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Sign in to upload your own photo and create a personalized avatar
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Side - Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-700 mb-6">Your Companion Preview</h3>
              
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={uploadedPhoto || defaultAvatars[selectedAvatar].image}
                    alt="Selected avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Sparkle effect */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute -top-2 -right-2 text-2xl"
                >
                  ✨
                </motion.div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xl font-bold text-slate-700">
                  {uploadedPhoto ? 'Your Custom Avatar' : defaultAvatars[selectedAvatar].name}
                </h4>
                <p className="text-slate-600">
                  {uploadedPhoto ? 'Personalized just for you' : defaultAvatars[selectedAvatar].personality}
                </p>
                
                {uploadedPhoto && (
                  <div className="flex items-center justify-center gap-2 text-coral-pink">
                    <Sparkles size={16} />
                    <span className="text-sm font-medium">Custom Avatar</span>
                  </div>
                )}
              </div>

              <button className="mt-8 w-full bg-gradient-to-r from-coral-pink to-dusty-teal text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                Start Chatting with Your Companion
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MitraLookSection; 