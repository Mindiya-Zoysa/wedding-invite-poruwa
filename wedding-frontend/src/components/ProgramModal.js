import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Heart, Circle, Sparkles, Star, Music, X } from 'lucide-react';

const ProgramModal = ({ onClose }) => {
  // --- ORDER OF SERVICE DATA ---
  const timelineEvents = [
    { title: "Entrance Procession", icon: <Users size={24} />, action: null, gif: null },
    { title: "Opening Prayers", icon: <BookOpen size={24} />, action: null, gif: null },
    { title: "Scripture Readings", icon: <BookOpen size={24} />, action: null, gif: null },
    { title: "Homily / Reflection", icon: <Sparkles size={24} />, action: null, gif: null },
    { title: "Exchange of Vows", icon: <Heart size={24} />, action: null, gif: null }, 
    { title: "Exchange of Rings", icon: <Circle size={24} />, action: null, gif: null },
    { title: "Nuptial Blessing", icon: <Star size={24} />, action: null, gif: null },
  ];

  return (
    // DARK OVERLAY BACKGROUND
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      
      {/* WHITE MODAL CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        style={{ backgroundColor: '#FDFBF7', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', overflowX: 'auto', borderRadius: '12px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      >
        
        {/* HEADER WITH CLOSE BUTTON */}
        <div style={{ backgroundColor: '#333', padding: '40px 20px', textAlign: 'center', color: 'white', position: 'sticky', top: 0, zIndex: 10 }}>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', transition: 'background 0.2s' }}
          >
            <X size={20} />
          </button>
          <h2 style={{ fontFamily: 'serif', margin: '0 0 5px 0', fontSize: '28px', color: '#FDFBF7' }}>Order of Service</h2>
          <p style={{ color: '#B59461', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '11px', margin: 0 }}>All Saints' Church</p>
        </div>

        <div style={{ padding: '40px 20px' }}>
          
          {/* --- TIMELINE SECTION --- */}
          <div style={{ position: 'relative', paddingLeft: '30px', marginBottom: '60px' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '44px', width: '2px', backgroundColor: '#EAEAEA' }} />

            {timelineEvents.map((event, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '40px', position: 'relative', zIndex: 2 }}>
                
                {/* Icon or GIF Bubble */}
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'white', border: '2px solid #B59461', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B59461', flexShrink: 0, marginRight: '20px', overflow: 'hidden' }}>
                  {event.gif ? (
                    <img src={event.gif} alt="icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
                      {event.icon}
                    </motion.div>
                  )}
                </div>

                {/* Text Content */}
                <div style={{ paddingTop: '4px' }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontFamily: 'serif', color: '#4A4A4A' }}>{event.title}</h3>
                  
                  {/* Interactive Button for Readings/Hymns */}
                  {event.action && (
                    <button 
                      onClick={event.action}
                      style={{ backgroundColor: '#f9f6f0', border: '1px solid #B59461', color: '#B59461', padding: '6px 15px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '5px', fontWeight: 'bold' }}
                    >
                      {event.title.includes("Hymn") ? <Music size={14} /> : <BookOpen size={14} />}
                      {event.actionText}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default ProgramModal;
