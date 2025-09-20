import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const BackgroundAnimation = () => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile device on component mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate random positions for floating elements
  const randomPosition = () => (Math.random() * 100) + '%';
  const randomDuration = () => Math.random() * 20 + 20; // 20-40 seconds
  const randomDelay = () => Math.random() * -20; // Start at different times
  
  // Colors based on theme
  const colors = theme === 'dark' 
    ? ['rgba(167, 139, 250, 0.1)', 'rgba(124, 58, 237, 0.1)', 'rgba(99, 102, 241, 0.1)']
    : ['rgba(199, 210, 254, 0.2)', 'rgba(165, 180, 252, 0.2)', 'rgba(129, 140, 248, 0.2)'];

  // Gradient background
  const gradientRotation = useMotionValue(0);
  const gradientOpacity = useTransform(gradientRotation, [0, 1], [0.02, 0.04]);
  
  // Animate gradient rotation
  useEffect(() => {
    const animateGradient = () => {
      gradientRotation.set(gradientRotation.get() + 0.0005);
      if (gradientRotation.get() > 1) gradientRotation.set(0);
      requestAnimationFrame(animateGradient);
    };
    
    const animationId = requestAnimationFrame(animateGradient);
    return () => cancelAnimationFrame(animationId);
  }, [gradientRotation]);

  // Don't render on mobile for better performance
  if (isMobile) return null;

  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${gradientRotation.get() * 360}deg, 
            ${colors[0]} 0%, 
            ${colors[1]} 50%, 
            ${colors[2]} 100%)`,
          opacity: gradientOpacity,
          transition: 'background 0.3s ease',
        }}
      />
      
      {/* Floating shapes */}
      {[...Array(8)].map((_, i) => {
        const size = Math.random() * 200 + 100; // 100-300px
        const duration = randomDuration();
        const delay = randomDelay();
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full blur-xl"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              left: randomPosition(),
              top: randomPosition(),
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
            }}
            animate={{
              x: [null, Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [null, Math.random() * 100 - 50, Math.random() * 100 - 50],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
};

export default BackgroundAnimation;
