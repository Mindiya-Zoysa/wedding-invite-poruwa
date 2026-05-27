import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const HeartCover = ({ onFinish }) => {
  useEffect(() => {
    // 5 seconds for drawing + 1 second pause
    const timer = setTimeout(onFinish, 6000); 
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#FDFBF7',
      margin: 0,
      padding: 0
    }}>
      
      {/* Increased container size to 280px for a beautiful, readable scale */}
      <div style={{
        position: 'relative',
        width: '380px',
        height: '380px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        
        {/* The SVG Heart */}
        <svg 
          viewBox="0 0 500 500" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible'
          }}
        >
          <motion.path
            /* NEW PATH: Starts at bottom tip, draws UP the left side (clockwise), and finishes back at the bottom */
            d="M 250 420 C 250 420 70 310 70 180 A 85 85 0 0 1 250 120 A 85 85 0 0 1 430 180 C 430 310 250 420 250 420"
            fill="none" 
            stroke="#B59461"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 5, ease: "easeInOut" }}
          />
        </svg>

        {/* The Text: Larger fonts to fit the new heart size */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <h1 style={{ fontSize: '32px', fontFamily: 'serif', color: '#4A4A4A', margin: 0, fontWeight: 'normal', letterSpacing: '1px' }}>
            Anuruddha
          </h1>
          <span style={{ fontSize: '24px', fontStyle: 'italic', color: '#B59461', margin: '8px 0', fontFamily: "'Great Vibes', cursive, serif" }}>
            &
          </span>
          <h1 style={{ fontSize: '32px', fontFamily: 'serif', color: '#4A4A4A', margin: 0, fontWeight: 'normal', letterSpacing: '1px' }}>
            Yashara
          </h1>
        </motion.div>
      </div>

      {/* Loading indicator (Wider) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 4, duration: 1 }}
        style={{ marginTop: '50px', width: '150px', height: '2px', backgroundColor: 'rgba(181, 148, 97, 0.2)', position: 'relative', overflow: 'hidden' }}
      >
        <motion.div 
           style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '100%', backgroundColor: '#B59461' }}
           animate={{ left: ['-100%', '100%'] }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};

export default HeartCover;
