import React, { useState } from 'react';
import { motion } from 'framer-motion';
import waxSeal from '../assets/wax-steal-stamp.png';

const Envelope = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return; // Prevent double clicks
    setIsOpen(true);
    // Wait for the envelope flap to open and the letter to slide up
    setTimeout(onComplete, 5000); 
  };

  // Rustic Kraft Paper Colors
  const kraftBase = '#D2B48C';     // Warm parchment
  const kraftShadow = '#B38B5D';   // Rich shadow tone
  const kraftTop = '#9C6B3F';      // Deep royal brown

  return (
    <div 
      onClick={handleOpen}
      style={{
        position: 'relative',
        perspective: '1200px',
        width: '100%',
        height: '100vh',
        background: 'radial-gradient(circle at center, #7A5432 0%, #4E341D 100%)',
        overflow: 'hidden',
        cursor: 'pointer',
        margin: 0,
        padding: 0
      }}
    >
      {/* 1. The White Letter (Hidden inside, slides up when opened) */}
      <motion.div 
        style={{
          position: 'absolute',
          top: '13%',
          left: '10%',
          right: '10%',
          bottom: '10%',
          backgroundColor: '#FFF',
          borderRadius: '8px 8px 0 0',
          boxShadow: '0 -5px 15px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '50px', // Adjusted to balance the stacked text
          zIndex: 5 // Sits behind the front flaps
        }}
        animate={isOpen ? { y: '-10vh', opacity: 1 } : { y: '20vh', opacity: 0 }}
        transition={{ delay: 2.5, duration: 1, ease: "easeOut" }}
      >
        {/* Stacked Names for better mobile readability */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          fontFamily: "'Great Vibes', cursive", 
          color: '#B59461',
          lineHeight: '1.2'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '36px', fontFamily: "'Great Vibes', cursive", color: '#B59461' }}>Anuruddha</span>
            <span style={{ fontSize: '24px', margin: '4px 0', color: '#B59461' }}>&</span>
            <span style={{ fontSize: '36px', fontFamily: "'Great Vibes', cursive", color: '#B59461' }}>Yashara</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Left Flap */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
        backgroundColor: kraftBase,
        clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.15)',
        zIndex: 10
      }} />

      {/* 3. Right Flap */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
        backgroundColor: kraftBase,
        clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.15)',
        zIndex: 10
      }} />

      {/* 4. Bottom Flap (Overlaps the side flaps slightly) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
        backgroundColor: kraftShadow,
        clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)',
        zIndex: 15
      }} />

      {/* 5. Top Flap (This is the part that animates open!) */}
      <motion.div 
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
          background: `linear-gradient(to bottom, #B38B5D, ${kraftTop})`,
          boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
          clipPath: 'polygon(0 0, 100% 0, 50% 52%)', 
          transformOrigin: 'top',
          zIndex: isOpen ? 0 : 20 
        }}
        animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
        transition={{ duration: 3.5, ease: [0.65, 0, 0.35, 1] }}
      />

      {/* 6. The Wax Seal Stamp */}
      
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 50
          }}
        >
          <motion.img
            src={waxSeal}
            alt="Wax Seal"
            style={{
              width: '450px',
              maxWidth: '80vw',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.45))'
            }}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.06, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </div>
      

      {/* 7. The BOLD BLACK Text as requested */}
      {!isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '10%',
          width: '100%',
          textAlign: 'center',
          zIndex: 30,
          pointerEvents: 'none'
        }}>
          <span style={{
            color: 'black', 
            fontWeight: '900', 
            fontSize: '16px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif'
          }}>
            Tap to open your invitation
          </span>
        </div>
      )}
    </div>
  );
};

export default Envelope;