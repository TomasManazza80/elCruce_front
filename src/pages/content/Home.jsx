import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logoCruce from '../images/LOGOCRUCE.png';
import { Header } from '../../components/public/header.tsx';

import foto1 from '../../media/foto1.jpg';
import video1 from '../../media/video1.mp4';
import video2 from '../../media/video2.mp4';
import video3 from '../../media/video3.mp4';
import video5 from '../../media/video5.mp4';
import video6 from '../../media/video6.mp4';
import video8 from '../../media/video8.mp4';

gsap.registerPlugin(ScrollTrigger);

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const EditableText = ({ tag: Tag = 'span', className, value, onSave, editMode, dangerouslySetInnerHTML }) => {
  const [isFocused, setIsFocused] = useState(false);
  const textRef = useRef(null);

  const handleBlur = (e) => {
    setTimeout(() => {
      setIsFocused(false);
      if (onSave && textRef.current) {
        onSave(textRef.current.innerHTML);
      }
    }, 150);
  };

  const execCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    textRef.current?.focus();
  };

  const insertEmoji = (emoji) => {
    document.execCommand('insertText', false, emoji);
    textRef.current?.focus();
  };

  const emojis = ['🔥', '🥩', '🍖', '🔪', '🎁', '🎉', '⭐', '💯', '👇'];

  if (!editMode) {
    return (
      <Tag 
        className={className}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML || { __html: value }}
      />
    );
  }

  return (
    <>
      {isFocused && (
        <div 
          className="fixed top-[100px] left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-[#333] rounded-xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-1 z-[99999] whitespace-nowrap animate-in slide-in-from-top-4 fade-in duration-200"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex bg-[#2a2a2a] rounded-lg p-1">
            <button 
              onClick={() => execCommand('bold')}
              className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#444] rounded-md font-serif font-bold text-lg transition-colors"
              title="Negrita"
            >
              B
            </button>
            <button 
              onClick={() => execCommand('italic')}
              className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#444] rounded-md font-serif italic text-lg transition-colors"
              title="Cursiva"
            >
              I
            </button>
          </div>
          <div className="w-px h-6 bg-[#444] mx-2"></div>
          <div className="flex bg-[#2a2a2a] rounded-lg p-1 gap-1">
            {emojis.map(emoji => (
              <button 
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="w-8 h-8 flex items-center justify-center hover:bg-[#444] rounded-md text-xl transition-all hover:scale-110"
                title="Insertar Emoji"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      <Tag 
        ref={textRef}
        className={`${className} outline-dashed outline-2 outline-blue-500 hover:bg-white/10 cursor-text`}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML || { __html: value }}
      />
    </>
  );
};

export default function Home({ editMode = false, homeContentData = null, onContentChange = null }) {
  const container = useRef(null);
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.authSlice.userInfo);

  const [homeContent, setHomeContent] = useState(homeContentData || {
    heroSubtitle: "carnicería meat",
    heroTitle: "TRADICIÓN Y SABOR<br />EN CADA CORTE",
    heroDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    heroButtonText: "VER LISTA DE PRECIOS",
    aboutSubtitle: "NUESTRA CARNICERÍA",
    aboutTitle: "CALIDAD, CONFIANZA Y LA<br />TRADICIÓN EN EL CRUCE",
    aboutDescription: "En El Cruce nos dedicamos a ofrecer las mejores carnes de la región, seleccionadas cuidadosamente de productores locales para garantizar frescura, terneza y un sabor inigualable en cada comida familiar.",
    aboutStat1Num: "30",
    aboutStat1Text: "Años sirviendo a<br />la comunidad",
    aboutStat2Num: "100%",
    aboutStat2Text: "Calidad<br />Certificada Local",
    aboutStat3Num: "36+",
    aboutStat3Text: "Más de 30 tipos<br />de cortes selectos",
    historySubtitle: "NUESTRA HISTORIA",
    historyTitle: "MÁS DE 30 AÑOS DE<br/>TRADICIÓN CARNICERA",
    historyText1: "Todo comenzó hace más de 30 años, cuando nuestra familia decidió abrir las puertas de un modesto local en el corazón de la ciudad. Con una pasión inquebrantable por la calidad y el servicio al cliente, nos propusimos ofrecer los mejores cortes de carne de la región, trabajando de la mano con productores locales.",
    historyText2: "A lo largo de los años, <strong>El Cruce Carnes</strong> ha crecido junto a nuestra comunidad. Hemos pasado de ser una pequeña carnicería de barrio a un referente en cortes premium y atención personalizada, manteniendo siempre viva la tradición y el respeto por el oficio de carnicero que nos enseñaron nuestros abuelos.",
    historyText3: "Hoy, la segunda generación sigue al frente del mostrador, seleccionando cada pieza con el mismo cuidado del primer día. Nuestro compromiso sigue intacto: garantizar que a tu mesa llegue siempre un producto de excelencia que une a las familias en cada comida.",
    headerTopBarText: "Florece: (1) 293 445-51-23 | Mon - Sun: 00:00 - 22:00",
    headerPromoText: "🔥 ¡Oferta del día! Asado especial a solo $2.500 el kilo 🔥"
  });

  useEffect(() => {
    if (homeContentData) {
      setHomeContent(homeContentData);
      return;
    }
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/settings/hero`);
        const json = await res.json();
        if (json.success && json.data?.homeContent) {
          const merged = { ...homeContent, ...json.data.homeContent };
          setHomeContent(merged);
          if (onContentChange) onContentChange(merged);
        } else {
          if (onContentChange) onContentChange(homeContent);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
        if (onContentChange) onContentChange(homeContent);
      }
    };
    fetchSettings();
  }, [homeContentData]);

  const handleChange = (field, val) => {
    const updated = { ...homeContent, [field]: val };
    setHomeContent(updated);
    if (onContentChange) onContentChange(updated);
  };

  useEffect(() => {
    // Prevent default browser scroll restoration on reload
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const targetPosition = element.getBoundingClientRect().top + window.scrollY - 80;
          const startPosition = window.scrollY;
          const distance = targetPosition - startPosition;
          const duration = 1200;
          let start = null;

          const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
          };

          const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
          };
          requestAnimationFrame(animation);
          
          // Clear the hash from the URL so it doesn't trigger on reload
          window.history.replaceState(null, '', window.location.pathname);
        }
      }, 500);
    } else {
      window.scrollTo(0, 0); // Force top on load if no hash
    }
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Hero Animations
      gsap.from('.hero-text > *', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        delay: 0.2
      });
      gsap.fromTo('.hero-video', {
        x: 150,
        opacity: 0,
        rotationY: -45,
        rotationX: 15,
        scale: 0.8,
        z: -100
      }, {
        x: 0,
        opacity: 1,
        rotationY: -15,
        rotationX: 5,
        scale: 1,
        z: 0,
        duration: 1.8,
        ease: 'power3.out',
        delay: 0.4
      });

      gsap.fromTo('.hero-store', {
        x: -150,
        opacity: 0,
        rotationY: 45,
        rotationX: 15,
        scale: 0.8,
        z: -100
      }, {
        x: 0,
        opacity: 1,
        rotationY: 15,
        rotationX: 5,
        scale: 1,
        z: 0,
        duration: 1.8,
        ease: 'power3.out',
        delay: 0.4
      });

      gsap.to(['.hero-video', '.hero-store'], {
        y: "-=15",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5,
        delay: 2.2
      });

      // About Section Animations
      gsap.from('.about-text > *', {
        scrollTrigger: { trigger: '.about-section', start: 'top 80%' },
        x: -40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15
      });

      gsap.from('.about-stats', {
        scrollTrigger: { trigger: '.about-section', start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.4
      });

      gsap.from('.about-img', {
        scrollTrigger: { trigger: '.about-section', start: 'top 75%' },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.2
      });

      // History Section Animations
      gsap.from('.history-section img', {
        scrollTrigger: { trigger: '.history-section', start: 'top 75%' },
        scale: 0.9,
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2
      });

      gsap.from('.history-section h3, .history-section h2, .history-section p', {
        scrollTrigger: { trigger: '.history-section', start: 'top 75%' },
        x: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1
      });


    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="min-h-screen bg-white relative font-sans text-gray-900 overflow-x-hidden selection:bg-[#b91c1c] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap');
        
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-oswald { font-family: 'Oswald', sans-serif; }
      `}</style>

      {/* Navbar Shared Component */}
      <Header 
        topBarText={homeContent.headerTopBarText} 
        topBarPromo={homeContent.headerPromoText} 
      />

      {/* 1. Hero Section */}
      <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[#2a1315]">
          <img
            src="https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=1920&q=80"
            alt="Carnicería Hero"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a0c]/90 via-transparent to-black/60 pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pt-10">
          
          {/* Left Column: Store Mockup */}
          <div className="hidden lg:flex justify-start w-full relative h-[600px] items-center pl-2 xl:pl-10" style={{ perspective: '1200px' }}>
            <div 
              className="hero-store relative w-[190px] h-[400px] xl:w-[210px] xl:h-[440px] bg-black rounded-[35px] border-[8px] border-[#151515] overflow-hidden flex justify-center z-10 mx-auto"
              style={{ transformStyle: 'preserve-3d', boxShadow: '25px 25px 50px rgba(0,0,0,0.5), -10px -10px 30px rgba(255,255,255,0.05) inset' }}
            >
              <div className="absolute top-2 z-20 w-[80px] h-[22px] bg-black rounded-full shadow-sm"></div>
              <div className="absolute top-0 inset-x-0 h-10 z-30 flex justify-between items-start px-5 pt-3 pointer-events-none">
                <div className="text-black text-[10px] font-semibold tracking-widest pl-1 mt-0.5">9:41</div>
                <div className="flex items-center gap-1 opacity-90 pr-1 mt-0.5 text-black">
                   <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M2,22 L22,22 L22,2 Z"></path></svg>
                   <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12,3 C17.5,3 22,7.5 22,13 L12,23 L2,13 C2,7.5 6.5,3 12,3 Z"></path></svg>
                   <svg className="w-5 h-5 -mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M17,6H3C1.9,6 1.01,6.9 1.01,8L1,16C1,17.1 1.9,18 3,18H17C18.1,18 19,17.1 19,16V14H21V10H19V8C19,6.9 18.1,6 17,6ZM17,16H3V8H17V16Z"></path><rect x="4.5" y="9.5" width="11" height="5"></rect></svg>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[30px]">
                <iframe 
                  src="/tienda" 
                  className="absolute top-0 left-0 w-[200%] h-[200%] border-none pointer-events-none scale-50 origin-top-left" 
                  tabIndex="-1" 
                  scrolling="no"
                />
              </div>
            </div>
          </div>

          {/* Center Column: Text */}
          <div className="hero-text text-center px-4 flex flex-col items-center">
            <EditableText 
              tag="p" 
              editMode={editMode}
              onSave={(val) => handleChange('heroSubtitle', val)}
              value={homeContent.heroSubtitle}
              className="font-script text-white/90 text-3xl md:text-4xl mb-4 lowercase drop-shadow-md"
            />
            <EditableText 
              tag="h1" 
              editMode={editMode}
              onSave={(val) => handleChange('heroTitle', val)}
              value={homeContent.heroTitle}
              className="font-oswald text-white text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 uppercase leading-[0.95] drop-shadow-lg mx-auto"
            />
            <EditableText 
              tag="p" 
              editMode={editMode}
              onSave={(val) => handleChange('heroDescription', val)}
              value={homeContent.heroDescription}
              className="text-gray-200 text-xs md:text-sm font-medium mb-10 max-w-md mx-auto drop-shadow leading-relaxed"
            />
            <button 
              onClick={() => navigate('/tienda')}
              className="bg-[#b91c1c] hover:bg-[#991b1b] text-white transition-colors px-6 py-3 text-xs font-bold uppercase tracking-widest shadow-xl rounded-sm"
            >
              <EditableText 
                tag="span" 
                editMode={editMode}
                onSave={(val) => handleChange('heroButtonText', val)}
                value={homeContent.heroButtonText}
              />
            </button>
          </div>

          {/* Right Column: Video Mockup */}
          <div className="flex justify-center lg:justify-end w-full relative lg:h-[600px] items-center pr-2 xl:pr-10 mt-12 lg:mt-0" style={{ perspective: '1200px' }}>
            <div 
              className="hero-video relative w-[190px] h-[400px] xl:w-[210px] xl:h-[440px] bg-black rounded-[35px] border-[8px] border-[#151515] overflow-hidden flex justify-center z-10 mx-auto lg:ml-auto lg:mr-0"
              style={{ transformStyle: 'preserve-3d', boxShadow: '-25px 25px 50px rgba(0,0,0,0.5), 10px -10px 30px rgba(255,255,255,0.05) inset, inset -5px 0px 10px rgba(255,255,255,0.2)' }}
            >
              <div className="absolute top-2 z-20 w-[80px] h-[22px] bg-black rounded-full shadow-sm"></div>
              <div className="absolute top-0 inset-x-0 h-10 z-30 flex justify-between items-start px-5 pt-3 pointer-events-none">
                <div className="text-white text-[10px] font-semibold tracking-widest pl-1 mt-0.5">9:41</div>
                <div className="flex items-center gap-1 opacity-90 pr-1 mt-0.5">
                   <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M2,22 L22,22 L22,2 Z"></path></svg>
                   <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12,3 C17.5,3 22,7.5 22,13 L12,23 L2,13 C2,7.5 6.5,3 12,3 Z"></path></svg>
                   <svg className="w-5 h-5 text-white -mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M17,6H3C1.9,6 1.01,6.9 1.01,8L1,16C1,17.1 1.9,18 3,18H17C18.1,18 19,17.1 19,16V14H21V10H19V8C19,6.9 18.1,6 17,6ZM17,16H3V8H17V16Z"></path><rect x="4.5" y="9.5" width="11" height="5"></rect></svg>
                </div>
              </div>
              <video
                src={video5}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Nuestra Carnicería Section */}
      <section className="about-section relative w-full py-24 md:py-32 bg-white overflow-hidden">
        {/* Topo Pattern */}
        <div
          className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 Q 50 50 90 10 T 170 10' fill='none' stroke='%23000000' stroke-width='0.5'/%3E%3Cpath d='M10 30 Q 50 70 90 30 T 170 30' fill='none' stroke='%23000000' stroke-width='0.5'/%3E%3Cpath d='M10 50 Q 50 90 90 50 T 170 50' fill='none' stroke='%23000000' stroke-width='0.5'/%3E%3Cpath d='M10 70 Q 50 110 90 70 T 170 70' fill='none' stroke='%23000000' stroke-width='0.5'/%3E%3Cpath d='M10 90 Q 50 130 90 90 T 170 90' fill='none' stroke='%23000000' stroke-width='0.5'/%3E%3C/svg%3E\")",
            backgroundSize: '150px 150px'
          }}
        />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-8">

          {/* Left Text */}
          <div className="w-full lg:w-5/12 about-text">
            <EditableText 
              tag="h3" 
              editMode={editMode}
              onSave={(val) => handleChange('aboutSubtitle', val)}
              value={homeContent.aboutSubtitle}
              className="font-oswald text-[#b91c1c] font-bold tracking-widest uppercase text-sm mb-3"
            />
            <EditableText 
              tag="h2" 
              editMode={editMode}
              onSave={(val) => handleChange('aboutTitle', val)}
              value={homeContent.aboutTitle}
              className="font-oswald text-4xl md:text-5xl font-bold text-gray-900 leading-[1.1] uppercase tracking-tight mb-6"
            />
            <EditableText 
              tag="p" 
              editMode={editMode}
              onSave={(val) => handleChange('aboutDescription', val)}
              value={homeContent.aboutDescription}
              className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 max-w-md"
            />

            {/* Stats Box */}
            <div className="about-stats bg-[#a51c1c] text-white p-6 md:p-8 flex justify-between text-center rounded-sm shadow-xl">
              <div className="flex-1 px-2 border-r border-white/20">
                <EditableText 
                  tag="div" 
                  editMode={editMode}
                  onSave={(val) => handleChange('aboutStat1Num', val)}
                  value={homeContent.aboutStat1Num}
                  className="font-oswald text-4xl font-bold mb-1"
                />
                <EditableText 
                  tag="div" 
                  editMode={editMode}
                  onSave={(val) => handleChange('aboutStat1Text', val)}
                  value={homeContent.aboutStat1Text}
                  className="text-[10px] uppercase font-medium leading-tight"
                />
              </div>
              <div className="flex-1 px-2 border-r border-white/20">
                <EditableText 
                  tag="div" 
                  editMode={editMode}
                  onSave={(val) => handleChange('aboutStat2Num', val)}
                  value={homeContent.aboutStat2Num}
                  className="font-oswald text-4xl font-bold mb-1"
                />
                <EditableText 
                  tag="div" 
                  editMode={editMode}
                  onSave={(val) => handleChange('aboutStat2Text', val)}
                  value={homeContent.aboutStat2Text}
                  className="text-[10px] uppercase font-medium leading-tight"
                />
              </div>
              <div className="flex-1 px-2">
                <EditableText 
                  tag="div" 
                  editMode={editMode}
                  onSave={(val) => handleChange('aboutStat3Num', val)}
                  value={homeContent.aboutStat3Num}
                  className="font-oswald text-4xl font-bold mb-1"
                />
                <EditableText 
                  tag="div" 
                  editMode={editMode}
                  onSave={(val) => handleChange('aboutStat3Text', val)}
                  value={homeContent.aboutStat3Text}
                  className="text-[10px] uppercase font-medium leading-tight"
                />
              </div>
            </div>
          </div>

          {/* Right Media */}
          <div className="w-full lg:w-7/12 relative h-[500px] md:h-[600px] flex items-center justify-center">
            {/* Media 1 (Top left) */}
            <div className="about-img absolute left-[0%] top-[5%] w-[45%] h-[45%] z-10 shadow-2xl">
              <video src={video1} autoPlay loop muted playsInline className="w-full h-full object-cover border-[8px] border-white bg-gray-900" />
            </div>
            {/* Media 2 (Top Right) */}
            <div className="about-img absolute right-[0%] top-[15%] w-[45%] h-[40%] z-20 shadow-2xl">
              <video src={video2} autoPlay loop muted playsInline className="w-full h-full object-cover border-[8px] border-white bg-gray-900" />
            </div>
            {/* Media 3 (Bottom center left) */}
            <div className="about-img absolute left-[15%] bottom-[10%] w-[40%] h-[40%] z-30 shadow-2xl">
              <video src={video3} autoPlay loop muted playsInline className="w-full h-full object-cover border-[8px] border-white bg-gray-900" />
            </div>
            {/* Media 4 (Bottom Right) */}
            <div className="about-img absolute right-[10%] bottom-[0%] w-[35%] h-[35%] z-40 shadow-2xl">
              <img src={foto1} alt="Carnicería El Cruce" className="w-full h-full object-cover border-[8px] border-white bg-gray-900" />
            </div>
          </div>

        </div>
      </section>

      {/* 2.5 Historia de la Carnicería */}
      <section id="nosotros" className="history-section relative w-full py-20 bg-[#f9f9f9]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 order-2 lg:order-1 grid grid-cols-2 gap-4">
              <video src={video6} autoPlay loop muted playsInline className="w-full h-64 object-cover rounded shadow-lg mt-8" />
              <video src={video8} autoPlay loop muted playsInline className="w-full h-64 object-cover rounded shadow-lg" />
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <EditableText 
                tag="h3" 
                editMode={editMode}
                onSave={(val) => handleChange('historySubtitle', val)}
                value={homeContent.historySubtitle}
                className="font-oswald text-[#b91c1c] font-bold tracking-widest uppercase text-sm mb-2"
              />
              <EditableText 
                tag="h2" 
                editMode={editMode}
                onSave={(val) => handleChange('historyTitle', val)}
                value={homeContent.historyTitle}
                className="font-oswald text-4xl md:text-5xl font-bold text-gray-900 uppercase tracking-tight mb-6"
              />
              <div className="space-y-4 text-gray-600 leading-relaxed font-sans text-sm md:text-base">
                <EditableText 
                  tag="p" 
                  editMode={editMode}
                  onSave={(val) => handleChange('historyText1', val)}
                  value={homeContent.historyText1}
                />
                <EditableText 
                  tag="p" 
                  editMode={editMode}
                  onSave={(val) => handleChange('historyText2', val)}
                  value={homeContent.historyText2}
                />
                <EditableText 
                  tag="p" 
                  editMode={editMode}
                  onSave={(val) => handleChange('historyText3', val)}
                  value={homeContent.historyText3}
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 4. Footer with Location */}
      <footer id="contacto" className="bg-[#0a0a0a] border-t border-white/10 pt-16 pb-8">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-between">
            {/* Info */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <img src={logoCruce} alt="El Cruce Logo" className="h-16 mx-auto lg:mx-0 opacity-90" />
              <h3 className="text-white text-2xl font-oswald tracking-widest uppercase">Encuéntranos</h3>
              <p className="text-gray-400 max-w-sm mx-auto lg:mx-0">
                Av. Facundo Zuviría 4418, S3000 Santa Fe de la Vera Cruz, Santa Fe.
              </p>
              <div className="text-gray-400 space-y-2">
                <p><strong>Tel:</strong> +54 9 3425 54-7811</p>
                <p><strong>Horarios:</strong> Lunes a Domingo: 08:00 - 22:00</p>
              </div>
            </div>

            {/* Map iframe */}
            <div className="w-full lg:w-[600px] rounded-lg overflow-hidden border-2 border-white/10 shadow-2xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13589.115248423508!2d-60.70521097293033!3d-31.62621568494239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b5a9c491353f8b%3A0xf2460f61d355f0f!2sAv.%20Facundo%20Zuvir%C3%ADa%204418%2C%20S3000%20Santa%20Fe%20de%20la%20Vera%20Cruz%2C%20Santa%20Fe!5e0!3m2!1ses-419!2sar!4v1784237960077!5m2!1ses-419!2sar" 
                width="100%" 
                height="350" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div className="mt-16 text-center text-xs text-gray-600 font-medium tracking-widest border-t border-white/5 pt-8">
            &copy; {new Date().getFullYear()} EL CRUCE CARNES. TODOS LOS DERECHOS RESERVADOS.
          </div>
        </div>
      </footer>
    </div>
  );
}