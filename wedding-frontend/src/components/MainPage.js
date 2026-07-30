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

  // --- TIMELINE MODAL FUNCTIONS ---
  const showSeating = () => {
    const generateSeats = (rows, cols) => {
      let html = '';
      for (let r = 0; r < rows; r++) {
        html += '<div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 6px;">';
        for (let c = 0; c < cols; c++) {
          html += '<div style="width: 18px; height: 22px; border: 1.5px solid #B59461; border-top-left-radius: 8px; border-top-right-radius: 8px; border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; background-color: #FDFBF7;"></div>';
        }
        html += '</div>';
      }
      return html;
    };

    Swal.fire({
      title: '<span style="font-family: serif; font-size: 28px; color: #B59461;">Seating Arrangement</span>',
      html: `
        <div style="font-family: sans-serif; color: #555; padding: 0 10px; max-height: 75vh; overflow-y: auto; overflow-x: auto;">
          
          <div style="min-width: 650px; padding: 10px 0;">
            
            <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 30px;">
              <div style="flex: 1 1 0;"></div> <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div style="width: 20px; height: 24px; border: 1.5px solid #888; border-top-left-radius: 8px; border-top-right-radius: 8px; margin-bottom: 5px;"></div>
                <div style="background-color: #B59461; color: white; padding: 12px 50px; border-radius: 6px; font-weight: bold; font-size: 13px; letter-spacing: 2px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  Will be inform you later.
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      width: '750px',
      confirmButtonColor: '#B59461',
      confirmButtonText: 'Perfect',
      background: '#fff',
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster'
      }
    });
  };

  // --- WEDDING MENU DATA ---
  const weddingMenu = [
    {
      category: "Appetizers & Bites",
      icon: "🥟",
      items: [
        { name: "Mix Seafood Puffs", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80" },
        { name: "Bacon-Wrapped Sausage", image: "https://images.unsplash.com/photo-1627308595229-7830f5c9c66e?auto=format&fit=crop&w=600&q=80" },
        { name: "Meatball Mini Sliders", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80" },
        { name: "Buffalo Chicken Wings", image: "https://images.unsplash.com/photo-1569691899455-88464f6d3ce1?auto=format&fit=crop&w=600&q=80" },
        { name: "Greek Cucumber Cups", image: "https://images.unsplash.com/photo-1583663848850-46af132dc08e?auto=format&fit=crop&w=600&q=80" },
        { name: "Mango Salad Mini Cups", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" },
        { name: "Pineapple Mango Bruschetta", image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80" },
        { name: "Loaded Mini Baked Potatoes", image: "https://images.unsplash.com/photo-1511690078903-71dc5a49f5e3?auto=format&fit=crop&w=600&q=80" },
        { name: "Crispy Fried Okra with Yoghurt Dip", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
        { name: "Feta Watermelon Cubes", image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=600&q=80" },
        { name: "Vegetable Summer Roll", image: "https://images.unsplash.com/photo-1556571217-062e783457a4?auto=format&fit=crop&w=600&q=80" },
        { name: "Avocado Cheese Bruschetta", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=600&q=80" },
        { name: "Tomato Soup Garlic Cheese", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80" },
        { name: "Mix Vegetable Puffs", image: "https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&w=600&q=80" },
        { name: "Potato Rolls", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" },
        { name: "Herbs Cheesy Potato Bites", image: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80" },
        { name: "Cucumber Cheese Bites", image: "https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?auto=format&fit=crop&w=600&q=80" },
        { name: "Mix Vegetable Pinwheel", image: "https://images.unsplash.com/photo-1528735000313-039ec3a473f0?auto=format&fit=crop&w=600&q=80" },
        { name: "Lawras Fresh Salad Mini Sandwich", image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=600&q=80" },
        { name: "Crab Salad on Cream Crackers", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80" }
      ]
    },
    {
      category: "The Main Course",
      icon: "🍲",
      items: [
        { name: "Vegetable Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80" },
        { name: "Seafood Maquba Rice", image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=600&q=80" },
        { name: "Lavenro Mix Spicy Rice", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80" },
        { name: "Honey Garlic Grill Chicken with Orange Sauce", image: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=600&q=80" },
        { name: "Pork Action Station", image: "https://images.unsplash.com/photo-1516362584175-5ad888c34f3b?auto=format&fit=crop&w=600&q=80" },
        { name: "Baberian Action Platter", image: "https://images.unsplash.com/photo-1544025162-836889e02377?auto=format&fit=crop&w=600&q=80" },
        { name: "Mutton Bhuna", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80" },
        { name: "Mix Seafood Devilled", image: "https://images.unsplash.com/photo-1555989808-167d307779b9?auto=format&fit=crop&w=600&q=80" },
        { name: "Chicken Spicy Chili Noodles", image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=600&q=80" },
        { name: "Sausage and Bacon Pasta", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80" },
        { name: "Seafood Lasagna", image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80" },
        { name: "Hot Butter Mushroom", image: "https://images.unsplash.com/photo-1555196259-c62a89b142ef?auto=format&fit=crop&w=600&q=80" },
        { name: "Sri Lankan Cashew Curry", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80" },
        { name: "Roast Vegetable with Hot Cheesy Sauce", image: "https://images.unsplash.com/photo-1583590089222-7779a5ed68d3?auto=format&fit=crop&w=600&q=80" },
        { name: "Mixed Vegetable Au-Gratin", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" }
      ]
    },
    {
      category: "Salad Bar",
      icon: "🥗",
      items: [
        { name: "Cabbage Egg Salad", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" },
        { name: "Egg Bacon Ranch Salad", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80" },
        { name: "Classic Creamy Chicken Salad", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80" },
        { name: "Hawaiian Chicken Salad", image: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=600&q=80" },
        { name: "Crispy Chicken Salad", image: "https://images.unsplash.com/photo-1580013759032-1d65826f536c?auto=format&fit=crop&w=600&q=80" },
        { name: "Roast Vegetable with Cornseed Salad", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80" },
        { name: "Apple Slow Salad", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80" },
        { name: "Olive Salad", image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=600&q=80" },
        { name: "Fried Eggplant Salad", image: "https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?auto=format&fit=crop&w=600&q=80" },
        { name: "Burrata Salad", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80" },
        { name: "Roast Vegetable Cous Cous Salad", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" },
        { name: "Black Bean Corn Salad", image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=600&q=80" },
        { name: "Savory Creamy Potato Salad", image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=600&q=80" },
        { name: "Lavenro Mojito Salad", image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=600&q=80" },
        { name: "Mango Crunchy Salad", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" },
        { name: "Old Fashioned Macaroni Salad", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80" },
        { name: "Spicy Noodles Shaved Vegi Salad", image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=600&q=80" },
        { name: "Cold Meat Platter", image: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=600&q=80" }
      ]
    },
    {
      category: "Condiments & Accompaniments",
      icon: "🌶️",
      items: [
        { name: "Fried Spicy Egg Plant", image: "https://images.unsplash.com/photo-1596683788390-50d4eb0c1d2e?auto=format&fit=crop&w=600&q=80" },
        { name: "Spicy Egg Bites", image: "https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?auto=format&fit=crop&w=600&q=80" },
        { name: "Mini Ulundu Wade", image: "https://images.unsplash.com/photo-1604152135912-00a2f9c522cc?auto=format&fit=crop&w=600&q=80" },
        { name: "Savory Thatti Crackers", image: "https://images.unsplash.com/photo-1599580665516-e52277d3fbf7?auto=format&fit=crop&w=600&q=80" },
        { name: "Banana Blossom Fry Savory Mix", image: "https://images.unsplash.com/photo-1555196259-c62a89b142ef?auto=format&fit=crop&w=600&q=80" },
        { name: "Mix Dhall Pakora", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80" },
        { name: "Savory Spicy Risotto Balls", image: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?auto=format&fit=crop&w=600&q=80" },
        { name: "Corn & Vegetable Fritters", image: "https://images.unsplash.com/photo-1604724456950-891d4e0b02bc?auto=format&fit=crop&w=600&q=80" },
        { name: "Garlic Onion Pastry Tapas", image: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80" },
        { name: "Spicy Mushroom Pakora", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80" },
        { name: "Batter Fried Mix Leaf", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
        { name: "Fried Bitter Gourd Badun", image: "https://images.unsplash.com/photo-1596683788390-50d4eb0c1d2e?auto=format&fit=crop&w=600&q=80" },
        { name: "Malay Pickle", image: "https://images.unsplash.com/photo-1534800891164-b1f8f01b0ea5?auto=format&fit=crop&w=600&q=80" },
        { name: "Papadam Mix", image: "https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&w=600&q=80" },
        { name: "Fish Nuggets", image: "https://images.unsplash.com/photo-1599084924616-e91024b11f77?auto=format&fit=crop&w=600&q=80" },
        { name: "Vegetable Pakora", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80" },
        { name: "Mango Chutney", image: "https://images.unsplash.com/photo-1582285816922-2616a2d109f3?auto=format&fit=crop&w=600&q=80" },
        { name: "Mix Chutney", image: "https://images.unsplash.com/photo-1604152135912-00a2f9c522cc?auto=format&fit=crop&w=600&q=80" },
        { name: "Mango Salsa", image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=600&q=80" },
        { name: "Chili Paste", image: "https://images.unsplash.com/photo-1596683788390-50d4eb0c1d2e?auto=format&fit=crop&w=600&q=80" },
        { name: "Mix Chili Bajji", image: "https://images.unsplash.com/photo-1604724456950-891d4e0b02bc?auto=format&fit=crop&w=600&q=80" },
        { name: "Mix Fruit Pickle", image: "https://images.unsplash.com/photo-1534800891164-b1f8f01b0ea5?auto=format&fit=crop&w=600&q=80" },
        { name: "Tomato Red Onion Chutney", image: "https://images.unsplash.com/photo-1582285816922-2616a2d109f3?auto=format&fit=crop&w=600&q=80" },
        { name: "Garlic Mustard Pickle", image: "https://images.unsplash.com/photo-1534800891164-b1f8f01b0ea5?auto=format&fit=crop&w=600&q=80" }
      ]
    },
    {
      category: "Desserts & Sweets",
      icon: "🍰",
      items: [
        { name: "Cut Fruit (Pineapple & Papaya)", image: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=600&q=80" },
        { name: "Vanilla Ice Cream", image: "https://images.unsplash.com/photo-1570197781417-0a5237500ee3?auto=format&fit=crop&w=600&q=80" },
        { name: "Watalappan", image: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?auto=format&fit=crop&w=600&q=80" },
        { name: "Blueberry Mousse Cake", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80" },
        { name: "Orange & Chocolate Mousse", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80" },
        { name: "Chocolate Tart", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80" },
        { name: "Mango Parfait", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80" },
        { name: "Sacher Cake", image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80" },
        { name: "Assorted French Pastry", image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=600&q=80" },
        { name: "Pineapple Upside Down Cake", image: "https://images.unsplash.com/photo-1571115177098-24edf647d730?auto=format&fit=crop&w=600&q=80" },
        { name: "Mango Cheese Cake", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80" },
        { name: "Nanaimo Bar", image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80" },
        { name: "Baklava", image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80" },
        { name: "Chocolate Layer Mousse in Glass", image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=80" },
        { name: "Dutch Apple Cake", image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=600&q=80" },
        { name: "Dark Chocolate Fountain", image: "https://images.unsplash.com/photo-1548842247-c37f3eb6c8e3?auto=format&fit=crop&w=600&q=80" }
      ]
    },
    {
      category: "Signature Shooters",
      icon: "🍹",
      items: [
        { name: "Pineapple Ginger Basil Shooter", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80" },
        { name: "Blue Lime Mint Shooter", image: "https://images.unsplash.com/photo-1587223075055-82e9a937ddff?auto=format&fit=crop&w=600&q=80" },
        { name: "Watermelon Margarita Shooter", image: "https://images.unsplash.com/photo-1587888637140-849b589c1050?auto=format&fit=crop&w=600&q=80" },
        { name: "Passion Fruit Lime Mint Shooter", image: "https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=600&q=80" },
        { name: "Coconut Cream Lime Shooter", image: "https://images.unsplash.com/photo-1550424562-b91c0db935fb?auto=format&fit=crop&w=600&q=80" },
        { name: "Mixed Berry Shooter", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" },
        { name: "Honey Rosemary Shooter", image: "https://images.unsplash.com/photo-1509378457069-34ba85c33842?auto=format&fit=crop&w=600&q=80" },
        { name: "Strawberry Mint Kasa Kasa Shooter", image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80" },
        { name: "Chili & Lime Shooter", image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=600&q=80" },
        { name: "Peach Basil Shooter", image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80" }
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
