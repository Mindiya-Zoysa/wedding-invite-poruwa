import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import ProgramModal from './ProgramModal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MapPin, CalendarPlus, CheckCircle, Copy, Camera, Users, Heart, Mail, ArrowUp, Trash2, Sparkles, Utensils, ChevronLeft, ChevronRight, X } from 'lucide-react';

// IMPORTANT: Import your images here! 
const HERO_IMAGE = "beautiful-bouquet-wild-flowers-hands-bride.jpg"; 
const YASARA_PIC = "3d-cartoon-style-character_23-2151034069.avif";
const ANURUDDHA_PIC = "Gemini_Generated_Image_ia7lbxia7lbxia7l.png";
const PORUWA_WEDDING_INVITATION = "poruwa_wedding_invitation.jpeg"

// --- HELPER COMPONENT: COUNTDOWN TIMER ---
const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timeBlocks = [
    { label: 'දින', value: timeLeft.days || '00' },
    { label: 'පැය', value: timeLeft.hours || '00' },
    { label: 'මිනිත්තු', value: timeLeft.minutes || '00' },
    { label: 'තත්පර', value: timeLeft.seconds || '00' }
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
      {timeBlocks.map((block, index) => (
        <div key={index} style={{ 
          backgroundColor: 'white', 
          border: '1px solid #EAEAEA', 
          borderRadius: '8px', 
          width: '80px', 
          height: '90px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
        }}>
          <span style={{ fontSize: '28px', fontFamily: 'serif', color: '#B59461', lineHeight: '1' }}>
            {block.value}
          </span>
          <span style={{ fontSize: '10px', color: '#888', letterSpacing: '1px', marginTop: '5px' }}>
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// --- HELPER COMPONENT: MENU CAROUSEL MODAL ---
const MenuCarouselModal = ({ section, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = (e) => {
    e.stopPropagation(); // Prevents clicks from bleeding through
    setCurrentIndex((prev) => (prev + 1) % section.items.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + section.items.length) % section.items.length);
  };

  if (!section) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ backgroundColor: '#FDFBF7', width: '100%', maxWidth: '450px', borderRadius: '16px', overflow: 'hidden', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
          <X size={20} color="#333" />
        </button>

        {/* Image Container with Navigation */}
        <div style={{ position: 'relative', width: '100%', height: '320px', backgroundColor: '#EAEAEA' }}>
          <img 
            src={section.items[currentIndex].image} 
            alt={section.items[currentIndex].name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          
          {/* Prev/Next Navigation Buttons */}
          <button onClick={handlePrev} style={{ position: 'absolute', top: '50%', left: 15, transform: 'translateY(-50%)', backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
            <ChevronLeft size={24} color="#B59461" />
          </button>
          
          <button onClick={handleNext} style={{ position: 'absolute', top: '50%', right: 15, transform: 'translateY(-50%)', backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
            <ChevronRight size={24} color="#B59461" />
          </button>
        </div>

        {/* Details & Interactive Dots */}
        <div style={{ padding: '25px 20px', textAlign: 'center' }}>
          <span style={{ fontSize: '24px' }}>{section.icon}</span>
          <h4 style={{ margin: '10px 0 5px 0', fontSize: '22px', fontFamily: 'serif', color: '#4A4A4A' }}>
            {section.items[currentIndex].name}
          </h4>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {section.category} - {currentIndex + 1} of {section.items.length}
          </p>

          {/* Pagination Dots (Active dot becomes wider like iOS!) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', padding: '0 10px', maxHeight: '40px', overflowY: 'auto' }}>
            {section.items.map((_, idx) => (
              <div 
                key={idx} 
                onClick={() => setCurrentIndex(idx)} 
                style={{ 
                  width: idx === currentIndex ? '24px' : '8px', 
                  height: '8px', 
                  borderRadius: '4px', 
                  backgroundColor: idx === currentIndex ? '#B59461' : '#DDD', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease' 
                }} 
              />
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

const MainPage = ({ onGoToProgram }) => {
  // --- REFS & SCROLL STATE FOR FLOATING BUTTON ---
  const rsvpRef = useRef(null);
  const [isAtRsvp, setIsAtRsvp] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);

  useEffect(() => {
    const currentRef = rsvpRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtRsvp(entry.isIntersecting);
      },
      { threshold: 0.3 } // Triggers when 30% of the RSVP section is visible
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const scrollToRsvpOrTop = () => {
    if (isAtRsvp) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      rsvpRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- STATE FOR TABS & DYNAMIC RSVP ---
  const [activeTab, setActiveTab] = useState('menu');
  const [activeMenuSection, setActiveMenuSection] = useState(null);
  const [copied, setCopied] = useState(false);
  // --- INVITATION CARD STATE & PDF GENERATOR ---
  const [finalGuestNames, setFinalGuestNames] = useState('Guest'); 
  const cardRef = useRef(null);

  const downloadInvitationPdf = async (safeFilename) => {
    const element = cardRef.current;
    if (!element) return;

    // Take a high-quality screenshot of the hidden card
    const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: '#E6D5C3' });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width / 3, canvas.height / 3]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
    pdf.save(`Wedding_Invitation_${safeFilename}.pdf`);
  };
  
  const [rsvpData, setRsvpData] = useState({
    side: '',  
    name: '',
    phone: '', 
    message: '',
    attending: '', // Starts empty so they have to choose
    guestCount: '1',
    additionalGuests: [] // Stores extra names
  });

  const handleRsvpChange = (e) => {
    setRsvpData({ ...rsvpData, [e.target.name]: e.target.value });
  };

  // Handles changing the 1, 2, 3, 4, 5+ Dropdown
  const handleGuestCountChange = (e) => {
    const val = e.target.value;
    let newCount = val === '5+' ? 4 : parseInt(val) - 1; // Subtract 1 because the primary guest is already counted
    
    const currentGuests = [...rsvpData.additionalGuests];
    let newGuests = [];

    // Grow or shrink the input array while keeping typed names safe
    if (newCount > currentGuests.length) {
      const additions = Array(newCount - currentGuests.length).fill('');
      newGuests = [...currentGuests, ...additions];
    } else {
      newGuests = currentGuests.slice(0, newCount);
    }

    setRsvpData({ ...rsvpData, guestCount: val, additionalGuests: newGuests });
  };

  // Updates the name inside the dynamic extra inputs
  const handleAdditionalGuestChange = (index, value) => {
    const updated = [...rsvpData.additionalGuests];
    updated[index] = value;
    setRsvpData({ ...rsvpData, additionalGuests: updated });
  };

  // The "+ Add another guest" button function
  const addAnotherGuest = () => {
    setRsvpData({
      ...rsvpData,
      guestCount: '5+',
      additionalGuests: [...rsvpData.additionalGuests, '']
    });
  };

  // Removes a specific guest row
  const removeAdditionalGuest = (indexToRemove) => {
    // Filter out the guest at the specific index
    const updatedGuests = rsvpData.additionalGuests.filter((_, index) => index !== indexToRemove);
    
    // Auto-update the dropdown count to keep the UI in sync
    const newTotal = updatedGuests.length + 1;
    const newCountStr = newTotal >= 5 ? '5+' : newTotal.toString();

    setRsvpData({ 
      ...rsvpData, 
      guestCount: newCountStr, 
      additionalGuests: updatedGuests 
    });
  };

  // The Master Submit Engine
  const executeSubmit = async (finalData) => {
    if (!finalData.side || !finalData.name || !finalData.phone) {
      Swal.fire({ title: 'Missing Info', text: 'Please fill in your Side, Name, and Phone number before deciding.', icon: 'warning', confirmButtonColor: '#B59461' });
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(finalData) 
      });

      if (response.ok) {
        if (finalData.attending === 'yes') {
          // Format the names
          let namesArray = [finalData.name];
          if (finalData.additionalGuests && finalData.additionalGuests.length > 0) {
            const validGuests = finalData.additionalGuests.filter(g => g.trim() !== '');
            namesArray = [...namesArray, ...validGuests];
          }

          let namesString = finalData.name;
          if (namesArray.length === 2) {
            namesString = `${namesArray[0]} & ${namesArray[1]}`;
          } else if (namesArray.length > 2) {
            const last = namesArray.pop();
            namesString = `${namesArray.join(', ')} & ${last}`;
          }

          // Update the hidden card
          setFinalGuestNames(namesString);
          
          const safeName = namesString.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");

          // Show success message letting them know it's downloading
          Swal.fire({ 
            title: 'Thank You!', 
            text: `Your RSVP has been received, ${finalData.name}. Your digital invitation is downloading!`, 
            icon: 'success', 
            confirmButtonColor: '#B59461' 
          });

          // Wait 500ms for React to write the names into the hidden DOM, then download!
          setTimeout(() => {
            downloadInvitationPdf(safeName);
          }, 500);

        } else {
          Swal.fire({ title: 'Thank You', text: `We will miss you, ${finalData.name}.`, icon: 'success', confirmButtonColor: '#B59461' });
        }

        // Reset form
        setRsvpData({ side: '', name: '', phone: '', message: '', attending: '', guestCount: '1', additionalGuests: [] });
      } else {
        Swal.fire({ title: 'Oops...', text: 'There was a problem submitting your RSVP.', icon: 'error', confirmButtonColor: '#B59461' });
      }
    } catch (error) {
      Swal.fire({ title: 'Connection Error', text: 'Could not connect to the server.', icon: 'error', confirmButtonColor: '#B59461' });
    }
  };

  const handleYesSubmit = () => {
    executeSubmit({ ...rsvpData, attending: 'yes' });
  };

  const handleNoSubmit = () => {
    setRsvpData({ ...rsvpData, attending: 'no' }); // Update UI visually
    executeSubmit({ ...rsvpData, attending: 'no' }); // Send instantly
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText("0000212015"); 
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const showDressCode = () => {
    Swal.fire({
      title: '<span style="font-family: serif; font-size: 36px; color: #4A4A4A;">ඇඳුම් විලාසිතාව</span>',
      html: `
        <div style="font-family: sans-serif; color: #666; line-height: 1.6; padding: 10px 0;">
          <p style="font-size: 15px; margin-bottom: 25px;">අපේ මේ සතුටුදායක දවසේ ඔබ සැම අප හා සමානවම අලංකාරව සැරසී සිටිනු දැකීම අපේ කැමැත්තයි!</p>
          
          <div style="padding: 20px; border: 1px dashed #B59461; border-radius: 8px; background-color: #FDFBF7;">
            <p style="font-family: serif; font-weight: bold; color: #B59461; font-size: 24px; margin: 0 0 10px 0;">
              හමුදා නිලධාරීන් සඳහා
            </p>
            <p style="margin: 0; font-size: 14px; color: #888;">
              අපගේ ආරාධිත හමුදා නිලධාරීන්ට ඔවුන්ගේ නිල ඇඳුමින් (Ceremonial Dress) සැරසී පැමිණෙන ලෙස අප ගෞරවයෙන් ආරාධනා කරමු. .
            </p>
          </div>
          <div style="padding: 20px; border: 1px dashed #B59461; border-radius: 8px; background-color: #FDFBF7;">
            <p style="font-family: serif; font-weight: bold; color: #B59461; font-size: 24px; margin: 0 0 10px 0;">
              අනෙකුත් අමුත්තන් සඳහා
            </p>
            <p style="margin: 0; font-size: 14px; color: #888;">
              විවහා මංගලය සඳහා පූර්ණ ඇඳුම් කට්ටල (Suits) හෝ මංගල උත්සවයකට උචිත අලංකාර ඇඳුමින් (Cocktail Dresses) සැරසී පැමිණීම අගය කරමු.
            </p>
          </div>
        </div>
      `,
      confirmButtonColor: '#B59461',
      confirmButtonText: 'අගය කරමු!',
      width: '450px',
      padding: '2em',
      background: '#fff',
      backdrop: 'rgba(0,0,0,0.5)',
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp animate__faster'
      }
    });
  };

  // --- SEATING ARRANGEMENT MODAL (LIST & INTERACTIVE MAP TOGGLE) ---
  const showSeating = () => {
    
    // The table data, now including X and Y coordinates (percentages) based on your sketch!
    const seatingData = [
      { id: 1, group: "Kathri Aracchi Family", x: 25, y: 85 },
      { id: 2, group: "Rathnapure Family", x: 15, y: 85 },
      { id: 3, group: "Kathri Aracchi Family", x: 25, y: 75 },
      { id: 4, group: "Kathri Aracchi Family", x: 15, y: 75 },
      { id: 5, group: "Bride's Father's Family", x: 25, y: 65 },
      { id: 6, group: "Bride's Father's Family", x: 15, y: 65 },
      { id: 7, group: "Bride's Office Friends", x: 38, y: 85 },
      { id: 8, group: "Elapatha Family", x: 38, y: 75 },
      { id: 9, group: "Bride Mother's Family", x: 38, y: 65 },
      { id: 10, group: "Groom's University Friends", x: 38, y: 55 },
      { id: 11, group: "VIP Table", x: 38, y: 45 },
      { id: 12, group: "Bride's Father's Friends", x: 52, y: 85 },
      { id: 13, group: "Bride's School Friends", x: 52, y: 75 },
      { id: 14, group: "Groom's Brother's Family", x: 52, y: 65 },
      { id: 15, group: "Groom's Mother's Family", x: 52, y: 55 },
      { id: 16, group: "CDRD Officers", x: 52, y: 45 },
      { id: 17, group: "Groom's Father's Family", x: 52, y: 35 },
      { id: 18, group: "Groom's Father's Friends", x: 52, y: 25 },
      { id: 19, group: "Bride's Father's Friends", x: 65, y: 85 },
      { id: 20, group: "Bride's Friends", x: 65, y: 75 },
      { id: 21, group: "Groom's School Friends", x: 65, y: 65 },
      { id: 22, group: "Groom's Navy Batchmates", x: 65, y: 55 },
      { id: 23, group: "CDRD Officers", x: 65, y: 45 },
      { id: 24, group: "Groom's Father's Friends", x: 65, y: 35 },
      { id: 25, group: "Groom's Father's Friends", x: 65, y: 25 }
    ];

    // 1. Generate the Grid List View HTML (Default)
    let listHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; padding: 10px 0; text-align: center;">';
    seatingData.forEach(table => {
      listHtml += `
        <div style="background: rgba(253, 251, 247, 0.8); padding: 20px 10px; border-radius: 8px; border: 1px solid #EAEAEA; box-shadow: 0 4px 10px rgba(181, 148, 97, 0.05); display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100px;">
          <h4 style="font-family: 'Great Vibes', serif; color: #B59461; font-size: 24px; margin: 0 0 8px 0; font-weight: normal;">Table ${table.id}</h4>
          <p style="font-size: 12px; color: #4A4A4A; text-transform: uppercase; letter-spacing: 0.5px; margin: 0; font-weight: bold; line-height: 1.4;">${table.group}</p>
        </div>
      `;
    });
    listHtml += '</div>';

    // 2. Generate the Interactive Architectural Map View HTML
    let mapHtml = `
      <style>
        /* Pulse animation for the wedding tables */
        @keyframes tablePulse {
          0% { box-shadow: 0 0 0 0 rgba(181, 148, 97, 0.5); }
          70% { box-shadow: 0 0 0 8px rgba(181, 148, 97, 0); }
          100% { box-shadow: 0 0 0 0 rgba(181, 148, 97, 0); }
        }
      </style>
      <div style="position: relative; width: 100%; padding-bottom: 110%; background: #FAFAFA; margin-top: 10px; overflow: hidden; box-shadow: inset 0 0 15px rgba(0,0,0,0.05); border-radius: 4px; border-left: 4px solid #4A4A4A; border-bottom: 4px solid #4A4A4A;">
        
        <!-- Perimeter Right & Top Walls (Perfectly connected) -->
        <div style="position: absolute; right: 0; bottom: 0; height: 78.5%; width: 4px; background: #4A4A4A; z-index: 2;"></div>
        <div style="position: absolute; left: 0; top: 0; width: 45%; height: 4px; background: #4A4A4A; z-index: 2;"></div>
        <div style="position: absolute; left: 45%; top: 0; width: 71%; height: 4px; background: #4A4A4A; transform-origin: top left; transform: rotate(23deg); z-index: 2;"></div>

        <!-- Entrance Area -->
        <div style="position: absolute; left: 22%; bottom: 0; width: 20%; height: 5%; border-top: 3px solid #4A4A4A; background: #F3F3F3; display: flex; align-items: center; justify-content: center; z-index: 1;">
            <div style="font-size: 10px; font-weight: bold; color: #4A4A4A; letter-spacing: 1px;">ENTRANCE</div>
            <!-- Dashed Doors -->
            <div style="position: absolute; top: -3px; left: 25%; width: 50%; border-top: 4px dashed #B59461;"></div>
        </div>

        <!-- Buffet Area -->
        <div style="position: absolute; right: 0; bottom: 15%; width: 28%; height: 22%; border-top: 3px solid #4A4A4A; border-bottom: 3px solid #4A4A4A; background: #F3F3F3; display: flex; align-items: center; justify-content: center;">
            <div style="font-size: 10px; font-weight: bold; color: #4A4A4A; text-align: center;">BUFFET<br/>AREA</div>
        </div>

        <!-- Wash Rooms (Tucked perfectly into the new 23-degree gap) -->
        <div style="position: absolute; right: 0; top: 0; width: 55%; height: 21.5%; background: #F3F3F3; clip-path: polygon(100% 0, 100% 100%, 0 0); z-index: 1;">
             <div style="position: absolute; top: 12%; right: 8%; font-size: 10px; font-weight: bold; color: #4A4A4A; text-align: right;">WASH<br/>ROOMS</div>
        </div>
        
        <!-- Wash Room Door (Overlapping the new 23-degree diagonal wall) -->
        <div style="position: absolute; left: 68%; top: 9%; width: 14%; height: 6px; background: #F3F3F3; transform: rotate(23deg); z-index: 3;"></div>
        <div style="position: absolute; left: 68%; top: 9.5%; width: 14%; border-top: 4px dashed #B59461; transform: rotate(23deg); z-index: 4;"></div>

        <!-- Poruwa -->
        <div style="position: absolute; right: 6%; bottom: 40%; width: 5%; height: 14%; border: 2px solid #B59461; background: rgba(181,148,97,0.15); display: flex; align-items: center; justify-content: center; border-radius: 2px;">
            <div style="font-size: 8px; font-weight: bold; color: #B59461; writing-mode: vertical-rl; letter-spacing: 1px;">PORUWA</div>
        </div>

        <!-- Settee Back -->
        <div style="position: absolute; left: 7%; top: 30%; width: 18%; height: 8%; background: rgba(181,148,97,0.25); border: 2px solid #B59461; display: flex; align-items: center; justify-content: center; transform: rotate(-30deg); z-index: 1;">
             <div style="font-size: 9px; font-weight: bold; color: #B59461; text-align: center;">SETTEE<br/>BACK</div>
        </div>

        <!-- Red Carpet Path (Straight down the aisle between tables) -->
        <div style="position: absolute; left: 31.5%; bottom: 4%; width: 3%; height: 55%; background: rgba(178, 34, 34, 0.85); transform: translateX(-50%); border-left: 2px dashed rgba(212, 175, 55, 0.8); border-right: 2px dashed rgba(212, 175, 55, 0.8); z-index: 0; border-radius: 2px; box-shadow: inset 0 0 5px rgba(0,0,0,0.2);"></div>

        <!-- Head Table -->
        <div style="position: absolute; left: 16%; top: 12%; width: 30%; height: 7%; background: rgba(181,148,97,0.25); border: 2px solid #B59461; display: flex; align-items: center; justify-content: center; transform: rotate(-30deg); z-index: 1;">
             <div style="font-size: 9px; font-weight: bold; color: #B59461;">HEAD TABLE</div>
        </div>

        <!-- Dancing Floor -->
        <div style="position: absolute; right: 4%; top: 25%; width: 22%; height: 15%; background: rgba(220,150,150,0.15); border: 2px solid #c97b7b; display: flex; align-items: center; justify-content: center;">
             <div style="font-size: 10px; font-weight: bold; color: #a35050; text-align: center;">DANCING<br/>FLOOR</div>
        </div>
    `;

    // Add Animated Wedding Tables to Map
    seatingData.forEach(table => {
      mapHtml += `
        <div class="interactive-table" data-id="${table.id}" data-group="${table.group}" style="position: absolute; left: ${table.x}%; top: ${table.y}%; transform: translate(-50%, -50%); width: 28px; height: 28px; border-radius: 50%; border: 2px solid #D4AF37; background: radial-gradient(circle, #fff 40%, #fdfbf7 100%); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; color: #333; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.15); animation: tablePulse 2s infinite; z-index: 2;">
          <span style="pointer-events: none; z-index: 2;">${table.id}</span>
          
          <!-- CSS 'Chairs' surrounding the table -->
          <div style="position: absolute; top: -4px; width: 6px; height: 3px; background: #D4AF37; border-radius: 2px 2px 0 0; pointer-events: none;"></div>
          <div style="position: absolute; bottom: -4px; width: 6px; height: 3px; background: #D4AF37; border-radius: 0 0 2px 2px; pointer-events: none;"></div>
          <div style="position: absolute; left: -4px; width: 3px; height: 6px; background: #D4AF37; border-radius: 2px 0 0 2px; pointer-events: none;"></div>
          <div style="position: absolute; right: -4px; width: 3px; height: 6px; background: #D4AF37; border-radius: 0 2px 2px 0; pointer-events: none;"></div>
        </div>
      `;
    });
    mapHtml += `</div>`; // Close map container

    // Fire SweetAlert
    Swal.fire({
      title: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 5px; margin-bottom: 10px;">
          <span style="font-family: 'Great Vibes', serif; font-size: 42px; color: #333;">Saara & Anu</span>
          <span style="font-family: sans-serif; font-size: 16px; color: #888; text-transform: uppercase; letter-spacing: 2px;">Find Your Table</span>
          <span style="font-family: serif; font-size: 18px; color: #B59461; margin-top: 5px; border-top: 1px solid #B59461; padding-top: 5px;">Hall 03</span>
          
          <!-- Toggle Buttons -->
          <div style="display: flex; gap: 10px; margin-top: 15px; background: #f5f5f5; padding: 4px; border-radius: 20px;">
            <button id="btnListView" style="padding: 6px 16px; border: none; border-radius: 15px; background: transparent; color: #666; font-size: 12px; font-weight: bold; text-transform: uppercase; cursor: pointer; transition: 0.3s;">Table List</button>
            <button id="btnMapView" style="padding: 6px 16px; border: none; border-radius: 15px; background: #B59461; color: white; font-size: 12px; font-weight: bold; text-transform: uppercase; cursor: pointer; transition: 0.3s;">Floor Plan</button>
          </div>
        </div>
      `,
      html: `
        <div style="max-height: 65vh; overflow-y: auto; overflow-x: hidden; padding: 10px;">
          
          <!-- List View Container -->
          <div id="containerListView" style="display: none;">
            ${listHtml}
          </div>

          <!-- Map View Container -->
          <div id="containerMapView">
            <div id="tableInfoDisplay" style="background: #333; color: #fff; padding: 10px; border-radius: 6px; font-size: 14px; font-weight: bold; margin-bottom: 10px; transition: 0.3s;">
              Tap any table on the map to see who is seated there!
            </div>
            ${mapHtml}
          </div>

        </div>
      `,
      width: '900px',
      showCloseButton: true,
      confirmButtonColor: '#B59461',
      confirmButtonText: 'Perfect!',
      background: '#fff',
      showClass: { popup: 'animate__animated animate__fadeInDown animate__faster' },
      
      // JavaScript to make the Toggle and the Map Clicks work!
      didOpen: () => {
        const btnList = document.getElementById('btnListView');
        const btnMap = document.getElementById('btnMapView');
        const viewList = document.getElementById('containerListView');
        const viewMap = document.getElementById('containerMapView');
        const tableInfoDisplay = document.getElementById('tableInfoDisplay');
        const interactiveTables = document.querySelectorAll('.interactive-table');

        // Toggle to Map View
        btnMap.addEventListener('click', () => {
          viewList.style.display = 'none';
          viewMap.style.display = 'block';
          btnMap.style.background = '#B59461';
          btnMap.style.color = 'white';
          btnList.style.background = 'transparent';
          btnList.style.color = '#666';
        });

        // Toggle to List View
        btnList.addEventListener('click', () => {
          viewMap.style.display = 'none';
          viewList.style.display = 'block';
          btnList.style.background = '#B59461';
          btnList.style.color = 'white';
          btnMap.style.background = 'transparent';
          btnMap.style.color = '#666';
        });

        // Click a table on the map
        interactiveTables.forEach(tableCircle => {
          tableCircle.addEventListener('click', (e) => {
            // Reset all tables to white
            interactiveTables.forEach(t => {
              t.style.background = '#fff';
              t.style.color = '#333';
              t.style.transform = 'translate(-50%, -50%) scale(1)';
            });
            
            // Highlight the clicked table
            const target = e.target;
            target.style.background = '#B59461';
            target.style.color = '#fff';
            target.style.transform = 'translate(-50%, -50%) scale(1.2)'; // Make it pop slightly
            
            // Update the display banner with the group name
            const tableId = target.getAttribute('data-id');
            const groupName = target.getAttribute('data-group');
            tableInfoDisplay.innerHTML = `<span style="color: #B59461;">Table ${tableId}:</span> ${groupName}`;
            tableInfoDisplay.style.background = '#222';
          });
        });
      }
    });
  };

  // --- WEDDING MENU DATA ---
  const weddingMenu = [
    {
      category: "Appetizers & Bites",
      icon: "🥟",
      items: [
        { name: "Mix Seafood Puffs", image: "https://www.tasteofhome.com/wp-content/uploads/2024/10/Party-Crab-Puffs_EXPS_TOHX25_41861_MD_P2_10_02_1b.jpg" },
        { name: "Bacon-Wrapped Sausage", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJBwf2Yaf90k09j6Rgv3khuddpF9rlpBxayKFZ8xd90w&s=10" },
        { name: "Meatball Mini Sliders", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUQMrYX-lM_8yPYqvpPeCMTSEdjkVIRQAUvLPVXWTHZQ&s=10" },
        { name: "Buffalo Chicken Wings", image: "https://www.loveandotherspices.com/wp-content/uploads/2022/02/air-fryer-buffalo-chicken-wings-featured.jpg" },
        { name: "Greek Cucumber Cups", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX0K6WmSv6Ae9PIH57Y2h03nez5Q0aqttTwL6s9nLrxQ3zNI5CGI3zgZrO&s=10" },
        { name: "Mango Salad Mini Cups", image: "https://spcdn.shortpixel.ai/spio/ret_img,q_cdnize,to_webp,s_webp/ilonaspassion.com/wp-content/uploads/2018/02/Mango-Salsa-Mini-Cups-1.jpg" },
        { name: "Pineapple Mango Bruschetta", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7abF5C3Q1igAefWZVsVblL9EUlH_wkfc9RwG4f_OlbA&s=10" },
        { name: "Loaded Mini Baked Potatoes", image: "https://lenaskitchenblog.com/wp-content/uploads/2024/06/Mini-Baked-Potatoes-12.jpg" },
        { name: "Crispy Fried Okra with Yoghurt Dip", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdM1dXg-VEdnoSmWFUHMCafJCHz0Kb0g0lsxkKOYRDGZ9J8qTTUKeisUA&s=10" },
        { name: "Feta Watermelon Cubes", image: "https://img.taste.com.au/YPidINwj/taste/2016/11/watermelon-and-feta-bites-82433-1.jpeg" },
        { name: "Vegetable Summer Roll", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmqloSEraLMUdbthPZPXSp-WYi4l__nfLFKDvnbm4MoQ&s=10" },
        { name: "Avocado Cheese Bruschetta", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4mmOhigD3PhQAVfC8nLK3rT51RrdZ4z7tNXfKor3PawSTJbXROKFZoek&s=10" },
        { name: "Tomato Soup Garlic Cheese", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtS7L4xUB_1c4saNFqHGCXjRis5ndTIKcefzzPPY7egOuctckQPNsqcIo&s=10" },
        { name: "Mix Vegetable Puffs", image: "https://shwetainthekitchen.com/wp-content/uploads/2014/12/Veg-Puff-500x500.jpg" },
        { name: "Potato Rolls", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3eLxMWh6tStmMtUr8H6_rZMnZafEEB9dKWgRZZxWIyA&s=10" },
        { name: "Herbs Cheesy Potato Bites", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1zMFogJYNRIxyS-oQTjW5zsvqxwOsJw0xHlorFrB-3Q&s=10" },
        { name: "Cucumber Cheese Bites", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmdgp29-YZk_dHbPAHn0-vOL2SpswesDbecVD8p_D5uqszBY0BP2MQuEmb&s=10" },
        { name: "Mix Vegetable Pinwheel", image: "https://www.beyondthechickencoop.com/wp-content/uploads/2021/12/Veggie-Roll-Ups.jpg" },
        { name: "Lawras Fresh Salad Mini Sandwich", image: "https://simply-delicious-food.com/wp-content/uploads/2020/07/Easy-salad-sandwiches-with-herb-mayo-1.jpg.webp" },
        { name: "Crab Salad on Cream Crackers", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR30SEdWPnlRLhdrLCmlOwnHfxmW04msnamxduevXvdcsZaSC_DGGtx7q8&s=10" }
      ]
    },
    {
      category: "The Main Course",
      icon: "🍲",
      items: [
        { name: "Vegetable Fried Rice", image: "https://www.sharmispassions.com/wp-content/uploads/2011/01/VegFriedRice2.jpg" },
        { name: "Seafood Maquba Rice", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIHrj5RAtQa9NeTZ3GNBWzUWOcxRwS1LjSTbN4Uw70xIfikbhx8lQ-Q0Q&s=10" },
        { name: "Lavenro Mix Spicy Rice", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwLR5HnUqEK2XyeE1cfDgXAfpKdSpZsJWMMyipy8ItA33UxHs0iNFnOVBF&s=10" },
        { name: "Honey Garlic Grill Chicken with Orange Sauce", image: "https://www.cookingclassy.com/wp-content/uploads/2018/05/honey-orange-grilled-chicken-8.jpg" },
        { name: "Pork Action Station", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0X16mOXwAcBZ9QG7W0zsb9l38T6unUniFBwHf8chbNQ&s" },
        { name: "Baberian Action Platter", image: "https://nutritionsolutions.com/wp-content/uploads/2022/09/Meal-prep-tray-with-chicken-broccoli-and-sides-op.webp" },
        { name: "Mutton Bhuna", image: "https://www.licious.in/blog/wp-content/uploads/2020/12/Mutton-Bhuna.jpg" },
        { name: "Mix Seafood Devilled", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe2vdwVDKdFNCBofuLxhQq9AA-z-C59wI-rD1BsYcelASJkiy8ZFZ3EoEU&s=10" },
        { name: "Chicken Spicy Chili Noodles", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6NX6wxJvgH_NA3JG4DdZeuw9X9K4w1auVvcyj4CY9b-Ou6ssODoCc6YI&s=10" },
        { name: "Sausage and Bacon Pasta", image: "https://ontarioporkrecipes.ca/Portals/11/EasyDNNnews/543/Sausage-and-Bacon-Pasta-Bake---0001-1000-1000-p-L-97.jpg" },
        { name: "Seafood Lasagna", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfFcwDa2a1cxF6npkRrA_Zac425cc-OWwuQ6mvSrlx6m3Mxlt-wIhIK34&s=10" },
        { name: "Hot Butter Mushroom", image: "https://www.islandsmile.org/wp-content/uploads/2021/04/IMG_7069-scaled.jpg" },
        { name: "Sri Lankan Cashew Curry", image: "https://www.hungrylankan.com/wp-content/uploads/2022/08/PXL_20220808_233248732.PORTRAIT-1.jpg" },
        { name: "Roast Vegetable with Hot Cheesy Sauce", image: "https://www.destinationdelish.com/wp-content/uploads/2019/11/roasted-vegetable-medley-gratin-pour.jpg" },
        { name: "Mixed Vegetable Au-Gratin", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRKK7nrEfi1iFEaspxRAND7_fAa6g4vlddC86Lipfrqm4hRcSUqvND1-70&s=10" }
      ]
    },
    {
      category: "Salad Bar",
      icon: "🥗",
      items: [
        { name: "Cabbage Egg Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKVHUfK7hduncNA78X18vn-_UlEdSXRfUhUd913LzeljjPku8sV_IfHVmc&s=10" },
        { name: "Egg Bacon Ranch Salad", image: "https://bestrecipebox.com/images/Cowboy-Egg-Salad-2.jpg" },
        { name: "Classic Creamy Chicken Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpZ-02gfV-BDv3_oFcy6JmWSdCqA83VVXjmoRuKoR0ZddQeDsUiP2grQ&s=10" },
        { name: "Hawaiian Chicken Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjP30EqkmGntoOjJnBc1lEPQpssQeu1Qv7PTVke91Bn2re5qqbz6rrzR8&s=10" },
        { name: "Crispy Chicken Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQci2kTuVVuIqATGpv-Qf-Oh3uFea5r_ARYFYzSBCi2Jm7kJrboEOBeh14&s=10" },
        { name: "Roast Vegetable with Cornseed Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDhDSGGIsK74KixeVOPDePMgNR0rCYabwToCvojbCEbR2RqL2Ygya9BUDZ&s=10" },
        { name: "Apple Slow Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmqAmo1opnOoQ6KtGelMP95RX2bB2VoUhv9rIPiHCYvve0OrjhD1W_gp8&s=10" },
        { name: "Olive Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3-B6DL1uc9BS-baOT6dOsIr_PZJkiHp6KXr6Jt7zZCEml99B0yQ-3lvA&s=10" },
        { name: "Fried Eggplant Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3vtFRfK2x2lrOd3KYNT3rFSbtGSk8ApoqdAOj77PuLLb_mVHqC1sgYh4n&s=10" },
        { name: "Burrata Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQryIy5OXXGra_3i7mUZN7IHQKv3pS9kBrHigjnnjRha8b9XX5_yKF3R0P0&s=10" },
        { name: "Roast Vegetable Cous Cous Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmnWZioi2LvWNE4RwYS5K9NGhJo9l5PoJ7g_hBw2UmbYx6LBRa526DCO0&s=10" },
        { name: "Black Bean Corn Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTawkXGVS3FrMgNU0ZDFmM9drWqJLAhIV7QsNkYnbc1bBJPCzLzU0UgrkTV&s=10" },
        { name: "Savory Creamy Potato Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAklKTKyA7qqDvpx0u_Zt8ec7nrnn6Lo0-KLM7eE8mk3kqZS2rhI5aNwV6&s=10" },
        { name: "Lavenro Mojito Salad", image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=600&q=80" },
        { name: "Mango Crunchy Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZceP7Z4pt4vbaIkhFm4rypSPqJy7bjqDc6NjLiu5mX1fw-ITVSbT1d5Q&s=10" },
        { name: "Old Fashioned Macaroni Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgcciXr7TBvehb8J8K5zHaBS_cH9ZXYILIVv2RZ6AfDzTS0MbFcARHlxE&s=10" },
        { name: "Spicy Noodles Shaved Vegi Salad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPVV0u8eje8RU2eknhyqDpu4iUXi3MHzs1rXu00ylpiTYnQBjddp1p12lp&s=10" },
        { name: "Cold Meat Platter", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj1f48PTI3Ov5uYtbCsBAZvFp66zIRHuMnu9qPE2qaDnjNlT6bGSu00Gib&s=10" }
      ]
    },
    {
      category: "Condiments & Accompaniments",
      icon: "🌶️",
      items: [
        { name: "Fried Spicy Egg Plant", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgLIGLPWFQrnSnjBV2Wv99JGnVnoqwDFU1Lil5OBDBev-VSatt7BzH0Xo&s=10" },
        { name: "Spicy Egg Bites", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVVBrffJraZmke_UqvDhr94I3t3iGMutJlaw3MrxwhCn8QSKreCrkL8Rk&s=10" },
        { name: "Mini Ulundu Wade", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVizksGW_Q9oXktsrZdSDgCOYhxJ9txKpM4Z06hEvUFzV0hq_Konkem_U&s=10" },
        { name: "Savory Thatti Crackers", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlSUUmDyuOItCmKxFEw4XZSqwV2Vf4PZGLTK0GqhbBC9-VtfWVidndeuyh&s=10" },
        { name: "Banana Blossom Fry Savory Mix", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwl4WgXpTajskBOEFDyBpXZMxxBA_HeozBdU3Gzt5G8FZtAfF1OIfPnos&s=10" },
        { name: "Mix Dhall Pakora", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8OxWqg4e206fKvKUYkGbLMMv7h5h4Sv_8EuHiJjIazeWuXk0f8zZlVvZ9&s=10" },
        { name: "Savory Spicy Risotto Balls", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJzLfG_uwI_UgVXVkvQQMFicaoO8PMkRdM1QVzIORVm2D4PJ-fjjFaVoA&s=10" },
        { name: "Corn & Vegetable Fritters", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSndGKr8cb82mmVM9y74dubTS-4ebZIRmXLDwwWTItJUhs1l7Yvalcyocc&s=10" },
        { name: "Garlic Onion Pastry Tapas", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6zroO8kJB8vIegV0FOiwUOnURrNQsN9UwwHz_ynd54DEcPcQ3SVanPm8&s=10" },
        { name: "Spicy Mushroom Pakora", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0_bvOvYLRSALiOzpkDUONX_BMujc6DJZjhMzgf-C_XJpPLo5NT5Mc1WEa&s=10" },
        { name: "Batter Fried Mix Leaf", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJVvBKwf9p6KW6X9BWT_NO3X_V34zAR9gO3eTRDaE7VQyVrE27Cx_c0W2B&s=10" },
        { name: "Fried Bitter Gourd Badun", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKzAEydwiQDMCyyO_Dt2Hq44sS5P8KRYtJZa1-SImMW4OWUIrCHtEF85UM&s=10" },
        { name: "Malay Pickle", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA850mR7EnqpsZmjlNuqe5EVE6DkS6dRzxu_Uc9Q0z13p7YZQs3zNACqvm&s=10" },
        { name: "Papadam Mix", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzG4hlVLqfYAsUSBwnObvQyTeFqUP3Hx2ImggZ-wxMXTtelFVnXFFXSRI&s=10" },
        { name: "Fish Nuggets", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM717eN_n5N6qYN691yCZHgodi4y5myxfe0mztf9tsk5aX2jwxv3ZHVU22&s=10" },
        { name: "Vegetable Pakora", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgoPK1-uGArX7ZRZXpwXugQZGQMaqKyZFvWiAPLnoAj94U-sKThJ8hyka1&s=10" },
        { name: "Mango Chutney", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqsrZgCNM68MbbqOaGWnave6C5-xnW7AGtwUp35iTg21NfZNuZgsehxGo&s=10" },
        { name: "Mix Chutney", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHxLSVqOd71EDYxxbYHm4G5AWOONcdiqIvwT8WaEGSjKDxriocbkVfmRI&s=10" },
        { name: "Mango Salsa", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP5YSvXfxJHFEKdLv6fvckjOOVTOBQ56ghUdSeKpiUs-EyC8NzgXDZQJgR&s=10" },
        { name: "Chili Paste", image: "https://rasakama.wordpress.com/wp-content/uploads/2015/03/img_6458-final.jpg" },
        { name: "Mix Chili Bajji", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhFjYb5xp0is3Q3MHVuYTvc1aXVTYcbrbf7-BhJe63WZ3ZVRhmPMOXtA&s=10" },
        { name: "Mix Fruit Pickle", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbqQ7PPflEJRCgCYZcSIxnMOwwxiBMwEaF-7UeEw2iVWl52dOEAMKr2SE&s=10" },
        { name: "Tomato Red Onion Chutney", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSasQjetHYC7N9c8JYNBZKO7M4bUPbCrW7cWINPy_eTBud9uOtVtH43Lb6f&s=10" },
        { name: "Garlic Mustard Pickle", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbyfQTqQ_bFBgrnOHMLSMhBcEgN822KEEViu10D6O_UAvF6Y2VDl3GJrsX&s=10" }
      ]
    },
    {
      category: "Desserts & Sweets",
      icon: "🍰",
      items: [
        { name: "Cut Fruit (Pineapple & Papaya)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_A930nNxKIf805yyolNWXbHC7M9mIPzvItYCSSnSiYQv07ypY_rnSWIk&s=10" },
        { name: "Vanilla Ice Cream", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpis3o0WAaLl02bNBJdQa-YU9VlH5eDRVrVfwQ5d7sMK8_V-UDnRYOhPY&s=10" },
        { name: "Watalappan", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrqwFvjLsMDsJduBxBMq8GI4CK1bbPrYzzmqspdBuWZFm6e-dMzyGH12o&s=10" },
        { name: "Blueberry Mousse Cake", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIgPsXUVJw2ghrwg21L2tSmfeR6d1E5JwC3cLBmalIQ_JpzNNnqPS0ael_&s=10" },
        { name: "Orange & Chocolate Mousse", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx34yhHG2l02BpdQ_FlMcs7dRpEj-NwpPKO-dBg3AIshZuIJuWSEXrAmU&s=10" },
        { name: "Chocolate Tart", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2r24gs5luPr2IpI_j2Y9dtziByUkqX4vnQV82W2DG9eZ92iu_fR-7Iu8&s=10" },
        { name: "Mango Parfait", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM6gcWe_eGjJBVp-upqxUTwrHUfgEcC3UZRJwY_SYMtHOwBLWeQoP4tCh1&s=10" },
        { name: "Sacher Cake", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRToQtNwprsbaM4xUzvLCe0xyoHPzuqGOOmzAZs91Zt_mCf3Is1Yxsdlqb&s=10" },
        { name: "Assorted French Pastry", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIDV-heoPZq6STdSNXzCpkRVKDR5qKaZ4f2crzF4C6AJtvV_0zw34HQH4&s=10" },
        { name: "Pineapple Upside Down Cake", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Xwjizk8qmbkFs-Z53xc1xe2INKwYC_1CYuByQc1ktVZnSusBLsDynKw&s=10" },
        { name: "Mango Cheese Cake", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOWm9wPrrJhghrQADaGznw5N7CZbrRF0rmcV_aNPltZHFhHRFsUwF3oIfj&s=10" },
        { name: "Nanaimo Bar", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFfOobFUlD-LWrQU74XDm_KQrvp3J7R4heLMt0a7efXd6voWj_2wCI0ds&s=10" },
        { name: "Baklava", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0NA0TN7uPHU-veOZZEOTBysejzHawpc6vfGmdzenU5w1AFnRwPH-Xr6E&s=10" },
        { name: "Chocolate Layer Mousse in Glass", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLoFqnX_-ht0QwC9oj5QgtWJJPsq6mK6pZjJ1reJAGnc_cmBBQsuSPSFM&s=10" },
        { name: "Dutch Apple Cake", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWHJ7EYG5s4Fttye_iBdDPhvRP9WKsRxTedHywFfOUfuTzEp9vDeptX_jN&s=10" },
        { name: "Dark Chocolate Fountain", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6hqSbvyOqN1gpcxaa1nFyC2Q3sgZUQ9anvP2q6F2yGRS5WJVA0NQ4rjIP&s=10" }
      ]
    },
    {
      category: "Signature Shooters",
      icon: "🍹",
      items: [
        { name: "Pineapple Ginger Basil Shooter", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCYMHNkMz_wgciZwQo_vU8WqnTh_N66qKqKz_df4udTw&s=10" },
        { name: "Blue Lime Mint Shooter", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCVPdWVT603aB6lx23iZP4IIFb9_FhoAtSF0gkYKuXNgUny8qeFbDw3iw&s=10" },
        { name: "Watermelon Margarita Shooter", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKLsKPqg0IFgFDmXxg-_bRWa4vN0xrLtv9GatHKffWK6nMPU8C2dJd5CQ&s=10" },
        { name: "Passion Fruit Lime Mint Shooter", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTow3iegeRwUFBgTh459h_70Mwogvp7C_Ar5mQaTEnriQbz69wSxcT87GO8&s=10" },
        { name: "Coconut Cream Lime Shooter", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk2bZMbbxUfgX18EUoNTgsVa0Mw3s6LH3tO7IYhP8vP9DZsx2zz9c8ChBT&s=10" },
        { name: "Mixed Berry Shooter", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOu9BYwRBmJ041NSeZeU7v1ohz_YP2_0vPmM2gKys3XmlTRCGmAFHpPuI&s=10" },
        { name: "Honey Rosemary Shooter", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9epDPjIJCJ0smjm36vKCZ7XcOZa3GFIpwfS2yRepApVbItvCIItRaObM&s=10" },
        { name: "Strawberry Mint Kasa Kasa Shooter", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDegWmFb9fiS_HD-RJ4nNpYjees7vpAfVD0f3T0v0ei36B3xZLIIV6ciq7&s=10" },
        { name: "Chili & Lime Shooter", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkOM7QANWvxpo9XrxcqhCCEWZrXoWtmuJYmFB6m-Up-obYYTrQeitOAA4&s=10" },
        { name: "Peach Basil Shooter", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKCKZdFIHx4Hd38nZySSm11xZE5geNSNOfo6NgTl5Be7dCLlYE4cac870&s=10" }
      ]
    },
    {
      category: "The Bar",
      icon: "🍻",
      items: [
        { name: "Jim Beam (Bourbon Whiskey)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjUFdFKybfTo9py3mxWAVfbEkrzYO6Trg_zoXliKNgDZP4QzbwjVeZx4A&s=10" },
        { name: "Thambapanni Draft Keg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT8eggbDk60Uki-8GC3Z0K4W_gBcrScmK-gJn8cFeigwrtksojRTK8vCL-&s=10" },
        { name: "Lion Ice Beer", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7pinWDwISfXWHe1CgGgquCFfA1Xjfj5IjWSZQy65vlfdYPECum0ztIIc&s=10" }
      ]
    }
  ];

  // --- TIMELINE DATA ARRAY ---
  // We define this here so the JSX below stays clean and easy to read
  const timelineEvents = [
    { title: "ඔන්න හවස 5.30 වෙද්දි ඇවිල්ලා ඉන්න ඕන", desc: "", action: showSeating, actionText: "ඔයාටම වෙන්කරපු තැන බලාගන්න", actionIcon: <Users size={45} /> },
    { title: "6.00 වෙද්දී අපි පෝරුවට නගිනවා", desc: "Pool Area පැත්තට එන්න" },
    { title: "6.47 වෙද්දී අපි පෝරුවෙන් බහිනවා", desc: "" },
    { title: "ඔන්න රෑ 7.00 වෙද්දි අපි ශාලාව ඇතුලට එනවා", desc: "හැමෝම ඇතුලට ඇවිත් ඉන්න එතකොට" },
    { title: "7.20 වෙද්දි, අපේ party එක පටන් ගන්නයී හදන්නේ", desc: "" },
    { title: "7.30ට බොන කට්ටිය bar එක පැත්තට එන්න", desc: "නෑ නෑ අනිත් අයට ලගටම ගෙනෙත් දෙනවා කන බොන ඒවා.." },
    { title: "කැමතිද අපේ පරණ පොටෝ බලන්න..ඔන්න ඒකට වෙලාව", desc: "" },
    { title: "ගායක ගායීකාවනී ඔන්න වේදීකාව විවෘතයි", desc: "" },
    { title: "ඔයාලා අපි ලගට එන්න එපා..අපි එනවා ඔයාල ලගට පොටෝ ගහන්න", desc: "ඒ නිසා ඔයාලා නිදහසේ enjoy කරන්න." },
    { title: "බඩගිනී නේද.. ඔන්න 9.00ට අපි කන්න දෙනවා..", desc: "ලැජ්ජ වෙන්න එපා බඩපැලෙන්න කන්න." },
    { title: "තාම dessert කෑවේ නැද්ද.", desc: "අද ඇති තරම් කන්න." },
    { title: "කාලා බීලා නිදාගන්නද කල්පනාව.. එහෙම බෑ.. දැන් නටන්න එන්න", desc: "හොදම සිංදු ටික යන්නේ දැන්නේ." },
    { title: "10.47යී. අපි පිටත් වෙන්නයි යන්නේ..", desc: "" },
    { title: "අපි ගියාට party එක තාම යනවා", desc: "ඔයාලා enjoy කරන්න." },
    { title: "ආපු හැමෝටම ගොඩක් ස්තූතීයී.", desc: "" },
  ];

  return (
    <div style={{ backgroundColor: '#FDFBF7', margin: 0, padding: 0, overflowX: 'hidden' }}>
      
      {/* --- HERO SECTION --- */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1 }} />

        <div style={{ zIndex: 2, padding: '20px' }}>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.5 }}
            style={{ 
              fontSize: '16px', 
              letterSpacing: '4px', 
              textTransform: 'uppercase', 
              marginBottom: '20px', 
              // color: '#000000',
              fontWeight: 900, 
              fontFamily: '"Noto Sans Sinhala", sans-serif' 
            }}
          >
            කැලැන්ඩරේ ලොකු රවුමක් ඇඳගන්න
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.5 }}
            style={{ 
              fontSize: '16px', 
              letterSpacing: '4px', 
              textTransform: 'uppercase', 
              marginBottom: '20px',
              fontWeight: 900, 
              fontFamily: '"Noto Sans Sinhala", sans-serif'
            }}
          >
            අපේ දවස.. මිස් කරගන්න එපා!
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.8 }}
            style={{ fontSize: 'clamp(40px, 8vw, 80px)', fontFamily: 'serif', margin: '0 0 20px 0', textShadow: '2px 4px 10px rgba(0,0,0,0.3)' }}
          >
            <div>
              <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(30px, 6vw, 60px)' }}>
                යෂාරා
              </div>
              
              <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(30px, 6vw, 60px)', margin: '10px 0' }}>
                &
              </div>
              
              <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(30px, 6vw, 60px)' }}>
                අනුරුද්ධ
              </div>
            </div>  
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', fontSize: '24px', fontFamily: 'serif' }}
          >
            <span>අගෝස්තු</span>
            <span style={{ fontSize: '48px', borderLeft: '1px solid white', borderRight: '1px solid white', padding: '0 15px' }}>03</span>
            <span>2026</span>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', bottom: '40px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span style={{ fontSize: '10px', letterSpacing: '2px', border: '1px solid white', padding: '8px 20px', textTransform: 'uppercase' }}>
            වැඩි විස්තර බලන්න පහලට යන්න
          </span>
        </motion.div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section style={{ padding: '10px 20px', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontFamily: '"Abhaya Libre", serif', 
          color: '#4A4A4A', 
          marginBottom: '10px',
          fontWeight: 600 
        }}>
          දෙහදක් එක්වන ඒ සොඳුරු මොහොතේ සාක්ෂිකරුවෙකු වන්නට ඔබට සෙනෙහසින් ආරාධනා
        </h2>
        <p style={{ 
          padding: '10px 20px', 
          color: '#888', 
          fontSize: '15px', 
          maxWidth: '600px', 
          margin: '0 auto 50px auto', 
          lineHeight: '1.8',
          fontFamily: '"Abhaya Libre", serif'
        }}>
          මේ දවස අප දෙදෙනාගේ සදාකාලික බැඳීමේ සමාරම්භයයි. ආදරය, විශ්වාසය සහ නිමක් නැති සිනහව මතින් ගොඩනැගුණු අපේ මේ සොඳුරු ගමන ලස්සන කරන්න ඔබටත් අපි හදවතින්ම ආරාධනා කරනවා.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px' }}>
          
          {/* Anuruddha Card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div 
              whileHover="hover"
              style={{ position: 'relative', width: '250px', height: '350px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer', backgroundColor: '#fff' }}
            >
              <img src={ANURUDDHA_PIC} alt="Anuruddha" style={{ width: '50%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              
              {/* Hover Quote Overlay */}
              <motion.div 
                variants={{ hover: { opacity: 1 } }} initial={{ opacity: 0 }} transition={{ duration: 0.3 }}
                style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(181, 148, 97, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: 'white' }}
              >
                <p style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '18px', lineHeight: '1.4' }}>
                  "My favorite place in all the world is next to you."
                </p>
              </motion.div>
            </motion.div>
            <h3 style={{ fontFamily: 'serif', fontSize: '24px', color: '#4A4A4A', marginTop: '20px', marginBottom: '10px' }}>මම අනුරුද්ධ (සිකුරා)</h3>
          </div>

          {/* Yasara Card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div 
              whileHover="hover"
              style={{ position: 'relative', width: '250px', height: '350px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer', backgroundColor: '#fff' }}
            >
              <img src={YASARA_PIC} alt="Yashara" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              <motion.div 
                variants={{ hover: { opacity: 1 } }} initial={{ opacity: 0 }} transition={{ duration: 0.3 }}
                style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(181, 148, 97, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: 'white' }}
              >
                <p style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '18px', lineHeight: '1.4' }}>
                  "I have found the one whom my soul loves."
                </p>
              </motion.div>
            </motion.div>
            <h3 style={{ fontFamily: 'serif', fontSize: '24px', color: '#4A4A4A', marginTop: '20px', marginBottom: '10px' }}>මම යශාරා (චූටී)</h3>
          </div>
        </div>
      </section>

      {/* --- COUNTDOWN SECTION --- */}
      <section style={{ padding: '30px 20px', backgroundColor: '#F9F6F0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontFamily: 'serif', color: '#B59461', marginBottom: '40px' }}>ඒ ලස්සන දවසට තව දින</h2>
        <CountdownTimer targetDate="2026-08-03T17:30:00" />
      </section>

      {/* --- LOCATION & CALENDAR SECTION --- */}
      <section style={{ padding: '20px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>අපිව බලන්න එනවනම්...</p>
        <h2 style={{ fontSize: '25px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '40px' }}>ඒ සොඳුරු හමුව සිදුවන තැන</h2>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px 20px', boxShadow: '0 15px 30px rgba(0,0,0,0.05)' }}>
          <MapPin size={32} color="#B59461" style={{ margin: '0 auto 15px auto' }} />
          <h3 style={{ fontSize: '24px', fontFamily: 'serif', color: '#333', marginBottom: '5px' }}>Lavenro Garden Hotel</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Highlevel Road, Kosgama, Avissawella, Sri Lanka.</p>
          
          <div style={{ display: 'inline-block', border: '1px solid #EAEAEA', padding: '8px 20px', borderRadius: '20px', fontSize: '13px', color: '#888', marginBottom: '30px' }}>
            📅 5:30 PM to 11:59 PM
          </div>

          <div style={{ width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px', border: '1px solid #EAEAEA' }}>
            <iframe 
              title="Lavenro Garden Hotel - Kosgama Location"
              src="https://maps.google.com/maps?q=Lavenro+Garden+Hotel,%20Kosgama&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Lavenro+Garden+Hotel+Kosgama" 
              target="_blank" 
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#B59461', color: 'white', padding: '12px 25px', borderRadius: '5px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}
            >
              <MapPin size={25} /> ලෝකේ කොහේ හිටියත් පාර හොයාගන්න map එක බලන්න
            </a>
            
            <a 
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Yashara+%26+Anuruddha&dates=20260803T173000/20260803T235900&details=We+can't+wait+to+celebrate+with+you!&location=Lavenro+Garden+Hotel,+Kosgama,+Awissawella,+Sri+Lanka" 
              target="_blank" 
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#B59461', border: '1px solid #B59461', padding: '12px 25px', borderRadius: '5px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}
            >
              <CalendarPlus size={25} /> ඔන්න මේ දවස කැලැන්ඩරේ save කරගන්න
            </a>
          </div>
        </div>
      </section>

      {/* --- TIMELINE SECTION --- */}
      <section style={{ padding: '10px 20px', backgroundColor: '#FDFBF7', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '15px', letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>කටයුතු පෙළගැස්ම</p>
        <h2 style={{ fontSize: '25px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '50px' }}>වැඩේ වෙන්නේ මෙහෙමයී..</h2>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {/* Center Vertical Line */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', backgroundColor: '#EAEAEA', transform: 'translateX(-50%)' }} />

          {timelineEvents.map((item, index) => (
            <div key={index} style={{ display: 'flex', width: '100%', marginBottom: '30px', position: 'relative', zIndex: 2 }}>
              
              {/* LEFT SIDE CONTENT */}
              <div style={{ flex: 1, textAlign: 'right', paddingRight: '30px' }}>
                {index % 2 === 0 ? (
                  <>
                    <span style={{ fontWeight: 'bold', color: '#B59461', fontSize: '14px' }}>{item.time}</span>
                    <h4 style={{ margin: '5px 0', fontSize: '18px', fontFamily: 'serif', color: '#333' }}>{item.title}</h4>
                    <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{item.desc}</p>
                    
                    {/* Render Interactive Button if an action exists */}
                    {item.action && (
                      <button 
                        onClick={item.action}
                        style={{ backgroundColor: '#f9f6f0', border: '1px solid #B59461', color: '#B59461', padding: '6px 15px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '10px', fontWeight: 'bold', transition: 'background-color 0.2s' }}
                      >
                        {item.actionIcon}
                        {item.actionText}
                      </button>
                    )}
                  </>
                ) : null}
              </div>

              {/* CENTER DOT */}
              <div style={{ width: '16px', height: '16px', backgroundColor: '#B59461', borderRadius: '50%', border: '4px solid #FDFBF7', margin: '0 auto', marginTop: '5px', zIndex: 3 }} />

              {/* RIGHT SIDE CONTENT */}
              <div style={{ flex: 1, textAlign: 'left', paddingLeft: '30px' }}>
                {index % 2 !== 0 ? (
                  <>
                    <span style={{ fontWeight: 'bold', color: '#B59461', fontSize: '14px' }}>{item.time}</span>
                    <h4 style={{ margin: '5px 0', fontSize: '18px', fontFamily: 'serif', color: '#333' }}>{item.title}</h4>
                    <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{item.desc}</p>
                    
                    {/* Render Interactive Button if an action exists */}
                    {item.action && (
                      <button 
                        onClick={item.action}
                        style={{ backgroundColor: '#f9f6f0', border: '1px solid #B59461', color: '#B59461', padding: '6px 15px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '10px', fontWeight: 'bold', transition: 'background-color 0.2s' }}
                      >
                        {item.actionIcon}
                        {item.actionText}
                      </button>
                    )}
                  </>
                ) : null}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* --- RSVP SECTION (DYNAMIC) --- */}
      <section ref={rsvpRef} style={{ padding: '40px 20px', backgroundColor: '#F9F6F0' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '25px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '10px' }}>අප හා එක්වන්න</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '40px' }}>සොඳුරු සැමරුමට ඔබ එන බව ස්ථීරවම කියන්න</p>

          {/* Changed to prevent default form submits so our custom buttons work */}
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '10px' }}>ඔබ නියෝජනය කරන්නේ කාගේ පැත්තද? *</label>
              <div style={{ display: 'flex', gap: '15px' }}>
                
                {/* BRIDE'S SIDE BUTTON - PINK */}
                <motion.button 
                  type="button" 
                  onClick={() => setRsvpData({ ...rsvpData, side: 'yasara' })} 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    flex: 1, 
                    padding: '15px', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    backgroundColor: '#ff99e6', // Bride's Pink
                    color: '#333', // Dark text for readability
                    border: '1px solid #e65cc3', // Slightly darker border
                    // Adds a glowing pink ring if selected
                    boxShadow: rsvpData.side === 'yasara' ? '0 0 0 4px rgba(255, 102, 217, 0.35)' : 'none',
                    // Dims the button if the Groom's side is selected
                    opacity: (rsvpData.side === '' || rsvpData.side === 'yasara') ? 1 : 0.5,
                    transition: 'all 0.3s ease'
                  }}
                >
                  මනාලිය වෙනුවෙන් (යෂාරාගේ පැත්තෙන්)
                </motion.button>

                {/* GROOM'S SIDE BUTTON - BLUE */}
                <motion.button 
                  type="button" 
                  onClick={() => setRsvpData({ ...rsvpData, side: 'anuruddha' })} 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    flex: 1, 
                    padding: '15px', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    backgroundColor: '#80b3ff', // Groom's Blue
                    color: '#333', // Dark text for readability
                    border: '1px solid #5ccae6', // Slightly darker border
                    // Adds a glowing blue ring if selected
                    boxShadow: rsvpData.side === 'anuruddha' ? '0 0 0 4px rgba(102, 224, 255, 0.35)' : 'none',
                    // Dims the button if the Bride's side is selected
                    opacity: (rsvpData.side === '' || rsvpData.side === 'anuruddha') ? 1 : 0.5,
                    transition: 'all 0.3s ease'
                  }}
                >
                  මනාලයා වෙනුවෙන් (අනුරුද්ධගේ පැත්තෙන්)
                </motion.button>

              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>ඔබගේ නම *</label>
              <input type="text" name="name" value={rsvpData.name} onChange={handleRsvpChange} placeholder="Enter your first & last name" style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '5px', border: '1px solid #DDD', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>දුරකතන අංකය හෝ වට්ස්ඇප් අංකය *</label>
              <input type="tel" name="phone" value={rsvpData.phone} onChange={handleRsvpChange} placeholder="+94 77 123 4567" style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '5px', border: '1px solid #DDD', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>අපි වෙනුවෙන් වචනයක් ලියන්න (කැමතිනම්)</label>
              <textarea name="message" value={rsvpData.message} onChange={handleRsvpChange} placeholder="Share your wishes or any special requests..." rows="3" style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '5px', border: '1px solid #DDD', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }}></textarea>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '10px' }}>ඔබ නිසැකවම එනවද? *</label>
              <div style={{ display: 'flex', gap: '15px' }}>
                
                {/* YES BUTTON - LIGHT PASTEL GREEN */}
                <motion.button 
                  type="button" 
                  onClick={() => setRsvpData({ ...rsvpData, attending: 'yes' })} 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    backgroundColor: '#aaff80', // Light Green
                    color: '#333', // Black/Dark Grey Text
                    border: '1px solid #c3e6cb',
                    // Adds a soft green glowing ring if selected
                    boxShadow: rsvpData.attending === 'yes' ? '0 0 0 4px rgba(40, 167, 69, 0.25)' : 'none',
                    // Dims the button slightly if the OTHER one is clicked
                    opacity: (rsvpData.attending === '' || rsvpData.attending === 'yes') ? 1 : 0.5,
                    transition: 'all 0.3s ease'
                  }}
                >
                  ඔව් අනිවාර්ය්‍යෙන්ම එනවා. 
                </motion.button>

                {/* NO BUTTON - LIGHT PASTEL RED */}
                <motion.button 
                  type="button" 
                  onClick={handleNoSubmit} 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    backgroundColor: '#ff6666', // Light Red/Pink
                    color: '#333', // Black/Dark Grey Text
                    border: '1px solid #f5c6cb',
                    // Adds a soft red glowing ring if selected
                    boxShadow: rsvpData.attending === 'no' ? '0 0 0 4px rgba(220, 53, 69, 0.25)' : 'none',
                    opacity: (rsvpData.attending === '' || rsvpData.attending === 'no') ? 1 : 0.5,
                    transition: 'all 0.3s ease'
                  }}
                >
                  අනේ තරහා වෙන්න එපා, මට එන්න වෙන් නෑ.
                </motion.button>

              </div>
            </div>

            {/* --- THE DYNAMIC "YES" SECTION --- */}
            {rsvpData.attending === 'yes' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
                
                <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #EAEAEA', marginTop: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>ඔබත් සමඟින් මේ සොඳුරු මොහොතට එක්වන ආදරණීයයන් ගණන කොපමණද? </label>
                  <select value={rsvpData.guestCount} onChange={handleGuestCountChange} style={{ width: '100%', padding: '12px', marginTop: '10px', borderRadius: '5px', border: '1px solid #DDD', fontSize: '14px', backgroundColor: 'white' }}>
                    <option value="1">Just me (1)</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5+">5 or more Guests</option>
                  </select>

                  {/* Render extra name inputs dynamically */}
                  {rsvpData.additionalGuests.length > 0 && (
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {rsvpData.additionalGuests.map((guest, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                          
                          {/* Name Input */}
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#888' }}>Guest {index + 2} Name</label>
                            <input 
                              type="text" 
                              value={guest} 
                              onChange={(e) => handleAdditionalGuestChange(index, e.target.value)} 
                              placeholder={`First & last name of Guest ${index + 2}`} 
                              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px dashed #CCC', fontSize: '14px', boxSizing: 'border-box' }} 
                            />
                          </div>

                          {/* Delete Row Button */}
                          <button 
                            type="button" 
                            onClick={() => removeAdditionalGuest(index)} 
                            style={{ backgroundColor: '#fce8e6', color: '#dc3545', border: 'none', borderRadius: '5px', padding: '10px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '41px', transition: 'background-color 0.2s' }}
                            title="Remove Guest"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add extra guest button (Only shows if they selected at least 2 guests) */}
                  {rsvpData.additionalGuests.length >= 1 && (
                    <button type="button" onClick={addAnotherGuest} style={{ width: '100%', backgroundColor: 'transparent', border: '1px dashed #B59461', color: '#B59461', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '15px' }}>
                      + Add another guest manually
                    </button>
                  )}
                </div>

                <button type="button" onClick={handleYesSubmit} style={{ backgroundColor: '#B59461', color: 'white', padding: '15px', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s' }}>
                  තහවුරු කරන්න
                </button>
              </motion.div>
            )}

          </form>
        </div>
      </section>

      {/* --- INTERACTIVE TABS SECTION --- */}
      <section style={{ padding: '60px 20px', backgroundColor: '#FDFBF7', textAlign: 'center' }}>
        
        {/* TAB BUTTONS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
          {['menu', 'gallery', 'contributions'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: '1px solid #B59461',
                backgroundColor: activeTab === tab ? '#B59461' : 'transparent',
                color: activeTab === tab ? 'white' : '#B59461',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                transition: 'all 0.3s'
              }}
            >
              {tab === 'menu' ? 'කෑම/බීම' : tab === 'gallery' ? 'සොඳුරු මතක අඩවිය' : 'e ප්‍රාර්ථනා සහ තිළිණ'}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '200px' }}>
          
          {/* THE MENU TAB CONTENT */}
          {activeTab === 'menu' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Utensils size={32} color="#B59461" style={{ margin: '0 auto 15px auto' }} />
              <h3 style={{ fontSize: '24px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '5px' }}>මංගල භෝජන සංග්‍රහයේ රසබර තොරතුරු... </h3>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>රාජකීය භෝජන සංග්‍රහයේ මෙනුව...</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                {weddingMenu.map((section, index) => (
                  <motion.button 
                    key={index} 
                    whileHover={{ scale: 1.02, backgroundColor: '#B59461', color: '#fff' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveMenuSection(section)} // <-- OPENS THE CAROUSEL
                    style={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #B59461', 
                      color: '#B59461', 
                      padding: '15px 25px', 
                      borderRadius: '8px', 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      width: '100%', 
                      maxWidth: '400px', 
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(181, 148, 97, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{section.icon}</span>
                    <span style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>{section.category}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* THE GALLERY TAB CONTENT */}
          {activeTab === 'gallery' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Camera size={32} color="#B59461" style={{ margin: '0 auto 15px auto' }} />
              <h3 style={{ fontSize: '24px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '5px' }}>සොඳුරු මතක අඩවිය (ඔබේ ඇසින් අපේ මංගල්‍යය)</h3>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
                "අපේ මංගල මතකයන් තව තවත් හැඩ කරන්න! ඔබ ලබාගත් ඡායාරූප සහ වීඩියෝ අපේ පොදු ඇල්බමයට එක් කරන්න."
              </p>
              <a 
                href="https://photos.app.goo.gl/MNcvTjgib9otm3Zo8" 
                
                target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', backgroundColor: '#333', color: 'white', padding: '12px 25px', borderRadius: '5px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}
              >
                Google ඇල්බමය
              </a>
            </motion.div>
          )}

          {/* THE CONTRIBUTIONS TAB CONTENT */}
          {activeTab === 'contributions' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Heart size={32} color="#B59461" style={{ margin: '0 auto 15px auto' }} />
              <h3 style={{ fontSize: '24px', fontFamily: 'serif', color: '#4A4A4A', marginBottom: '5px' }}>ඔබේ ආදරය සහ ආශිර්වාදය අප ලබන වටිනාම තිළිණයයි</h3>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>
                "අපට ලැබෙන ඉහළම තිළිණය ඔබේ ආදරණීය ආශිර්වාදයයි. අපේ නව දිවියට e-තිළිණයකින් සුබ පතන්නට කැමති අයට ඉලෙක්ට්‍රොනිකව දායක විය හැකි තොරතුරු මෙහි දැක්වේ."
              </p>

              <div style={{ backgroundColor: 'white', border: '1px solid #EAEAEA', borderRadius: '8px', padding: '20px', textAlign: 'left', display: 'inline-block', width: '100%', maxWidth: '350px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}><strong>Bank:</strong> Bank of Ceylon</p>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}><strong>Branch:</strong> Borella Super Grade (38) </p>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}><strong>Name:</strong> Anuruddha Heenatigala</p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9F6F0', padding: '10px 15px', borderRadius: '5px', marginTop: '15px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '20px', color: '#333', letterSpacing: '1px' }}>0000212015</span>
                  <button onClick={copyToClipboard} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#B59461', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                    {copied ? <CheckCircle size={16} color="green" /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ backgroundColor: '#333', color: 'white', padding: '50px 20px 30px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'serif', margin: 0, fontSize: '28px', color: '#FDFBF7' }}>Yashara & Anuruddha</h2>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: '#B59461', marginTop: '10px', marginBottom: '30px' }}>
          August 03, 2026
        </p>
        
        <p style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#888', margin: '0 0 10px 0' }}>
          If you wish to give a shout-out, you may reach out:
        </p>
        
        {/* Contact Numbers Row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '15px', fontSize: '14px', color: '#AAA', fontFamily: 'sans-serif' }}>
          <span>Yashara: +94 78 201 0532</span>
          <span style={{ color: '#555' }}>|</span>
          <span>Anuruddha (Sikura): +94 71 653 0165</span>
        </div>

        {/* Copyright (Optional but looks professional) */}
        <p style={{ fontSize: '10px', color: '#555', marginTop: '40px', letterSpacing: '1px' }}>
          © 2026 ALL RIGHTS RESERVED
        </p>
      </footer>

      {/* --- NEW: DRESS CODE FLOATING BUTTON --- */}
      <motion.button
        onClick={showDressCode}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '40px', // Sits perfectly above the 60px RSVP button
          left: '30px',
          height: '45px',
          padding: '0 20px',
          borderRadius: '25px',
          backgroundColor: '#FDFBF7',
          color: '#B59461',
          border: '1px solid #B59461',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          zIndex: 1000,
          fontWeight: 'bold',
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontFamily: 'sans-serif'
        }}
      >
        <Sparkles size={16} />
        ඇදුම් පැලදුම් විස්තර
      </motion.button>

      {/* --- NEW: FLOATING ACTION BUTTON --- */}
      <motion.button
        onClick={scrollToRsvpOrTop}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#B59461',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        {isAtRsvp ? <ArrowUp size={28} /> : <Mail size={28} />}
      </motion.button>

      {/* --- HIDDEN INVITATION CARD FOR PDF EXPORT --- */}
      {/* This renders off-screen so html2canvas can capture it without bothering the user */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div 
          ref={cardRef} 
          style={{ 
            backgroundColor: '#E6D5C3', 
            padding: '15px', 
            borderRadius: '12px', 
            width: '420px', 
            boxSizing: 'border-box'
          }}
        >
          {/* Invitation Image Template Container */}
          <div style={{ 
            borderRadius: '8px', 
            textAlign: 'center',
            border: '1px solid #D5B99B', 
            position: 'relative', 
            overflow: 'hidden', 
            aspectRatio: '0.707', 
            backgroundColor: '#FBF8F4', 
          }}>
            {/* Background Image Template */}
            <img 
              src={PORUWA_WEDDING_INVITATION} 
              alt="Wedding Invitation Template"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 1 
              }}
            />

            {/* Dynamic Content Overlays */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 2, 
              display: 'flex',
              justifyContent: 'center',
            }}>

              {/* The "To:" Box - Perfectly Aligned */}
              <div style={{ 
                position: 'absolute',
                top: '49%', /* TIP: Adjust this percentage slightly up or down to perfectly align with your background image! */
                width: '70%', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                backgroundColor: 'transparent', /* REMOVED BACKGROUND: Now perfectly see-through */
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #D5B99B', /* Kept the border as requested */
                boxSizing: 'border-box'
              }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#624a44', /* MATCHED: Dark grey/black from PDF */
                  fontFamily: "'CINZEL DECORATIVE', serif", /* MATCHED: Clean sans-serif font from PDF */
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  flexShrink: 0 /* Prevents the "To:" from shrinking */
                }}>
                  To:
                </span>
                <span style={{ 
                  /* DYNAMIC FONT SIZE: Shrinks automatically if the name list gets too long! */
                  fontSize: finalGuestNames.length > 50 ? '11px' : finalGuestNames.length > 25 ? '14px' : '18px', 
                  fontWeight: 'bold', 
                  fontFamily: "'CINZEL DECORATIVE', serif", /* MATCHED: Elegant serif font from PDF */
                  color: '#624a44',
                  borderBottom: '1px dotted rgba(51, 51, 51, 0.4)', 
                  paddingBottom: '2px',
                  minWidth: '150px',
                  maxWidth: '260px', /* Forces text to wrap before hitting the edges */
                  display: 'inline-block',
                  lineHeight: '1.3', /* Keeps multi-line names tight so they don't push down */
                  textAlign: 'center'
                }}>
                  {finalGuestNames || "Guests"} 
                </span>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* --- INJECT THE MODAL --- */}
      {showProgramModal && (
        <ProgramModal onClose={() => setShowProgramModal(false)} />
      )}

      {activeMenuSection && (
        <MenuCarouselModal section={activeMenuSection} onClose={() => setActiveMenuSection(null)} />
      )}

    </div>
    
  );
};

export default MainPage;
