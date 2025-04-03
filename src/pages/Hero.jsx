import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Upload as UploadIcon, Lock, Share2, Database } from "lucide-react";
import { motion } from "framer-motion";
import useThemeStore from '../store/themeStore';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import Logo from '../components/Logo';

const Hero = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const handleTryFree = () => {
    navigate('/signup');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={`min-h-screen overflow-hidden flex flex-col ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-[#1E1919]'}`}>
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            <img src="/bock_logo.png" alt="Bock Drive Logo" className="w-8 h-8" />
            Bock Drive
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link
              to="/login"
              className="px-6 py-2 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-medium 
                hover:bg-blue-700 dark:hover:bg-blue-600 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <motion.div 
        className="container mx-auto px-6 pt-32 pb-20 flex flex-col lg:flex-row items-center gap-16 flex-grow"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column */}
        <motion.div 
          className="flex-1 space-y-8"
          variants={itemVariants}
        >
          <div className="space-y-4">
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              variants={itemVariants}
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Bock Drive
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
              variants={itemVariants}
            >
              Secure and accessible storage, anytime, anywhere. Experience seamless file management designed for modern work.
            </motion.p>
          </div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={itemVariants}
          >
            {[
              { icon: <UploadIcon className="h-5 w-5" />, text: "Easy Upload", color: "blue" },
              { icon: <Lock className="h-5 w-5" />, text: "Secure Storage", color: "green" },
              { icon: <Share2 className="h-5 w-5" />, text: "Simple Sharing", color: "purple" },
              { icon: <Database className="h-5 w-5" />, text: "Unlimited Space", color: "red" }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 
                  border border-gray-100 dark:border-gray-700 
                  hover:border-blue-200 dark:hover:border-blue-800 
                  hover:bg-blue-50 dark:hover:bg-blue-900/20 
                  transition-all duration-300 shadow-sm"
              >
                <span className={`text-${feature.color}-600 dark:text-${feature.color}-400`}>
                  {feature.icon}
                </span>
                <span className="font-medium text-gray-700 dark:text-gray-200">{feature.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            className="pt-8"
            variants={itemVariants}
          >
            <button
              onClick={handleTryFree}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative inline-flex items-center gap-2 px-8 py-4 
                bg-blue-600 dark:bg-blue-500 rounded-full text-white font-medium 
                transition-all duration-300
                hover:bg-blue-700 dark:hover:bg-blue-600 
                shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Try it for free
              <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </button>
          </motion.div>
        </motion.div>

        {/* Right Column - Illustration */}
        <motion.div 
          className="flex-1 w-full"
          variants={itemVariants}
        >
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 
            shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 
            dark:from-blue-900/20 dark:to-purple-900/20 p-8">
            <div className="aspect-video flex items-center justify-center">
              <img 
                src="/bock_logo.png" 
                alt="Bock Drive Illustration" 
                className="w-32 h-32 object-contain opacity-90"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* New Responsive Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 py-12 sm:py-16 border-t border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">Bock Drive</h4>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Where Your Data Finds Its Home</p>
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">Bock Suite</h4>
              <ul className="space-y-2">
                {['Bock Meet', 'Bock Drive', 'Bock Docs'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">Legal</h4>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Cookies Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">Connect</h4>
              <div className="flex space-x-4">
                {[
                  { icon: FaTwitter, url: 'https://x.com/BockBH' },
                  { icon: FaInstagram, url: 'https://www.instagram.com/bockbharath' },
                  { icon: FaFacebook, url: 'https://www.facebook.com/people/Bock/61555404186214/' },
                  { icon: FaLinkedin, url: 'https://www.linkedin.com/company/bockbharth/' },
                  { icon: FaYoutube, url: 'https://www.youtube.com/@bockbharath' }
                ].map((social) => (
                  <a 
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <social.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Email: info@bock.co.in</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              © 2025 Bock Drive. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero; 