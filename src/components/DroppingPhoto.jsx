import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const DroppingPhoto = () => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  
  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform mouse position to rotation and movement - Enhanced for more realistic interaction
  const rotateX = useTransform(mouseY, [-300, 300], [25, -25]);
  const rotateY = useTransform(mouseX, [-300, 300], [-25, 25]);
  const moveX = useTransform(mouseX, [-300, 300], [-20, 20]);
  const moveY = useTransform(mouseY, [-300, 300], [-15, 15]);
  
  // Additional transforms for more dynamic movement
  const skewX = useTransform(mouseX, [-300, 300], [-5, 5]);
  const skewY = useTransform(mouseY, [-300, 300], [-3, 3]);
  const scale = useTransform(mouseX, [-300, 300], [0.95, 1.05]);
  
  // Smooth springs for more natural movement - Adjusted for liveliness
  const springX = useSpring(moveX, { stiffness: 150, damping: 15 });
  const springY = useSpring(moveY, { stiffness: 150, damping: 15 });
  const springRotateX = useSpring(rotateX, { stiffness: 120, damping: 18 });
  const springRotateY = useSpring(rotateY, { stiffness: 120, damping: 18 });
  const springSkewX = useSpring(skewX, { stiffness: 100, damping: 20 });
  const springSkewY = useSpring(skewY, { stiffness: 100, damping: 20 });
  const springScale = useSpring(scale, { stiffness: 200, damping: 25 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced mouse move handler for more responsive tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center with enhanced sensitivity
    const x = (e.clientX - centerX) * 1.2; // Amplify movement
    const y = (e.clientY - centerY) * 1.2;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset to center position
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
    >
      {/* Connecting Line from Top - Realistic String */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={startAnimation ? { height: '180px', opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10"
        style={{ 
          top: '-80px',
          x: springX,
        }}
      >
        {/* Main String */}
        <div className="relative w-1 h-full">
          {/* String Shadow */}
          <div className="absolute inset-0 w-1 bg-gradient-to-b from-cosmic-700 to-cosmic-600 rounded-full shadow-lg" />
          {/* String Highlight */}
          <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-gold-300 to-gold-500 rounded-full" />
          {/* String Shine Effect */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute left-0.5 top-0 w-px h-full bg-emerald-200/60 rounded-full"
          />
        </div>
      </motion.div>
      
      {/* 3D Dropping Photo Container */}
      <motion.div
        initial={{ y: -400, opacity: 0, rotateZ: -10 }}
        animate={startAnimation ? { y: 0, opacity: 1, rotateZ: 0 } : {}}
        transition={{ 
          duration: 2, 
          delay: 0.3,
          type: "spring",
          stiffness: 80,
          damping: 12
        }}
        style={{
          x: springX,
          y: springY,
          rotateX: springRotateX,
          rotateY: springRotateY,
          skewX: springSkewX,
          skewY: springSkewY,
          scale: springScale,
          transformStyle: 'preserve-3d'
        }}
        className="relative z-20"
      >
        {/* Enhanced Floating Animation */}
        <motion.div
          animate={{
            y: [-8, 8, -8],
            rotateZ: [-2, 2, -2],
            x: [-3, 3, -3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        >
          {/* Photo Frame with Enhanced 3D Effect */}
          <motion.div
            whileHover={{ 
              scale: 1.08,
              rotateZ: 2,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            className="relative w-72 h-96 transform-gpu"
            style={{ 
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center'
            }}
          >
            {/* Frame Shadow (3D Depth) */}
            <div className="absolute inset-0 bg-black/40 rounded-2xl transform translate-x-2 translate-y-2 blur-xl" />
            
            {/* Main Photo Frame */}
            <div className="relative w-full h-full bg-gradient-to-br from-emerald-500/20 to-rose-500/10 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-emerald-300/20 transform-gpu">
              {/* Frame Inner Shadow */}
              <div className="absolute inset-3 rounded-xl shadow-inner bg-gradient-to-br from-emerald-900/10 to-transparent" />
              
              {/* Photo Container */}
              <div className="w-full h-full rounded-xl overflow-hidden relative bg-gradient-to-br from-emerald-900/15 to-rose-900/15">
                <img
                  src="/profile.jpg"
                  alt="Kyaw Shein"
                  className="w-full h-full object-cover transition-transform duration-500"
                  style={{
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                  }}
                />
                
                {/* 3D Overlay Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-emerald-100/10" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-rose-900/15" />
                
                {/* Enhanced Interactive Light Effect */}
                <motion.div
                  className="absolute inset-0"
                  animate={isHovered ? { opacity: 0.6 } : { opacity: 0.2 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div 
                    className="absolute w-40 h-40 bg-gradient-radial from-emerald-300/40 via-gold-200/20 to-transparent rounded-full blur-2xl"
                    style={{
                      left: springRotateY,
                      top: springRotateX,
                      x: '50%',
                      y: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                    animate={{
                      scale: isHovered ? [1, 1.2, 1] : [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
                
                {/* Name Tag with 3D Effect */}
                <motion.div
                  initial={{ y: 20, opacity: 0, z: 0 }}
                  animate={startAnimation ? { y: 0, opacity: 1, z: 10 } : {}}
                  transition={{ duration: 0.6, delay: 2 }}
                  className="absolute bottom-4 left-4 right-4"
                  style={{ transform: 'translateZ(10px)' }}
                >
                  <div className="bg-black/70 backdrop-blur-md rounded-lg p-4 border border-emerald-300/20 shadow-xl">
                    <h3 className="text-white font-bold text-xl mb-1">Kyaw Shein</h3>
                    <p className="text-emerald-300 text-sm font-medium">Mobile Dev (Junior)</p>
                    {/* Shine effect on name tag */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/15 to-transparent rounded-lg"
                      animate={{ x: [-100, 200] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 3 }}
                    />
                  </div>
                </motion.div>
              </div>
              
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      
      {/* Interactive Glow Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={isHovered ? { 
          background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, rgba(244, 63, 94, 0.05) 50%, transparent 70%)'
        } : {}}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default DroppingPhoto;