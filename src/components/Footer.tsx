import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-700 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">
                <span className="text-coral-pink">Bolo</span> Mitra
              </h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              Your AI companion for meaningful conversations and emotional support. 
              Never feel alone again.
            </p>
            <p className="text-sm text-slate-400">
              Made with <Heart size={16} className="inline text-coral-pink" /> for everyone who needs a friend.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#home" className="hover:text-coral-pink transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-coral-pink transition-colors">About</a></li>
              <li><a href="#services" className="hover:text-coral-pink transition-colors">Services</a></li>
              <li><a href="#contact" className="hover:text-coral-pink transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-coral-pink transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-coral-pink transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-coral-pink transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-coral-pink transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-600 pt-8 text-center text-slate-400">
          <p>&copy; 2025 Bolo Mitra. All rights reserved. Spreading happiness, one conversation at a time.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;