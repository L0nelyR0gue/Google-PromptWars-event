import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { Zap, Map, Shield, Cloud, MapPin, Sparkles, Star, Navigation, Camera, Luggage, Compass, Users } from 'lucide-react';
import Login from '../components/Login';

export default function Landing({ onLoginSuccess }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const doodlesRef = useRef([]);
  const uiElementsRef = useRef([]);

  // State for dynamic background color on card hover
  const [hoveredCard, setHoveredCard] = useState(null);

  // Muted 3D Tilt for UI Display
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [8, -8]); // Toned down tilt
  const rotateY = useTransform(x, [-200, 200], [-8, 8]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Determine Background Color
  const getBackgroundColor = () => {
    switch (hoveredCard) {
      case 'yellow': return 'var(--bg-yellow)';
      case 'blue': return 'var(--bg-blue)';
      case 'green': return 'var(--bg-green)';
      case 'red': return 'var(--bg-red)';
      default: return 'transparent'; // Shows the paper-white from body
    }
  };

  useEffect(() => {
    // 1. Initial Bouncy Load
    gsap.fromTo(containerRef.current.children, 
      { y: 60, opacity: 0, scale: 0.9, rotation: () => Math.random() * 10 - 5 },
      { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 1.2, stagger: 0.15, ease: "elastic.out(1, 0.4)" }
    );

    // 2. Continuous Doodle Animations
    doodlesRef.current.forEach((doodle, i) => {
      if(!doodle) return;
      if (doodle.classList.contains('drift')) {
        gsap.to(doodle, { y: '+=15', rotation: '+=5', duration: 4 + i, yoyo: true, repeat: -1, ease: "sine.inOut" });
      }
      if (doodle.classList.contains('pulse')) {
        gsap.to(doodle, { scale: 1.2, rotation: 45, duration: 2 + i, yoyo: true, repeat: -1, ease: "sine.inOut" });
      }
    });

    // 3. Card Micro-Interactions
    cardsRef.current.forEach(card => {
      if(!card) return;
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.06, y: -10, rotation: Math.random() * 6 - 3, duration: 0.4, ease: "back.out(2)" });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, y: 0, rotation: 0, duration: 0.4, ease: "back.out(2)" });
      });
    });

    // 4. UI Elements Micro-Interactions
    uiElementsRef.current.forEach(el => {
      if(!el) return;
      el.addEventListener('mouseenter', () => {
        gsap.to(el, { x: 10, backgroundColor: '#f0f0f0', duration: 0.2, ease: "power2.out" });
        gsap.to(el.querySelector('svg'), { scale: 1.5, y: -5, duration: 0.3, ease: "back.out(3)" });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, backgroundColor: 'transparent', duration: 0.2, ease: "power2.out" });
        gsap.to(el.querySelector('svg'), { scale: 1, y: 0, duration: 0.3, ease: "back.out(3)" });
      });
    });
  }, []);

  const promptLogin = () => {
    alert("Time to plan! Please sign in to access your Doodle Journal.");
  };

  return (
    <>
      {/* Dynamic Background Overlay */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: getBackgroundColor(),
        transition: 'background-color 0.4s ease',
        zIndex: -2,
        pointerEvents: 'none'
      }} />

      <main style={{ paddingBottom: '6rem', position: 'relative', overflowX: 'hidden' }} ref={containerRef}>
        
        {/* Diverse Background Doodles (Animated by GSAP) */}
        <div ref={el => doodlesRef.current[0] = el} className="drift" style={{ position: 'absolute', top: '15%', left: '8%', opacity: 0.3, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>
          <Camera size={60} color="var(--marker-blue)" />
        </div>
        <div ref={el => doodlesRef.current[1] = el} className="drift" style={{ position: 'absolute', top: '45%', right: '8%', opacity: 0.3, transform: 'rotate(20deg)', pointerEvents: 'none' }}>
          <Luggage size={70} color="var(--marker-red)" />
        </div>
        <div ref={el => doodlesRef.current[2] = el} className="drift" style={{ position: 'absolute', top: '75%', left: '10%', opacity: 0.3, transform: 'rotate(-5deg)', pointerEvents: 'none' }}>
          <Compass size={80} color="var(--marker-green)" />
        </div>
        <div ref={el => doodlesRef.current[3] = el} className="pulse" style={{ position: 'absolute', top: '25%', right: '20%', opacity: 0.5, pointerEvents: 'none' }}>
          <Star size={30} color="var(--marker-yellow)" fill="var(--marker-yellow)" />
        </div>
        <div ref={el => doodlesRef.current[4] = el} className="pulse" style={{ position: 'absolute', top: '60%', left: '20%', opacity: 0.4, pointerEvents: 'none' }}>
          <Star size={20} color="var(--marker-red)" fill="var(--marker-red)" />
        </div>

        {/* 1. Hero Section */}
        <section style={{ 
          minHeight: '50vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: '4rem',
          paddingBottom: '2rem'
        }}>
          
          {/* Fun Sticker Badge */}
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            style={{ 
              background: 'var(--marker-yellow)', 
              border: 'var(--border-thick)', 
              padding: '8px 16px', 
              borderRadius: '4px',
              color: 'var(--ink-black)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '4px 4px 0px var(--ink-black)',
              transform: 'rotate(-3deg)',
              marginBottom: '2rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={18} fill="var(--ink-black)"/>
            Magic by Gemini
          </motion.div>
          
          <h1 style={{ 
            fontSize: 'clamp(4rem, 10vw, 8rem)', 
            fontWeight: '800', 
            lineHeight: '1',
            marginBottom: '1.5rem',
            color: 'var(--marker-red)',
            textShadow: '4px 4px 0px var(--ink-black)',
            WebkitTextStroke: '2px var(--ink-black)'
          }}>
            Travi!
          </h1>
          
          <p className="cartoon-font" style={{ 
            fontSize: '2.2rem', 
            color: 'var(--text-secondary)', 
            maxWidth: '600px', 
            margin: '0 auto 3rem auto',
            lineHeight: '1.4'
          }}>
            Where are we flying to next? ✈️<br/>
            Your fun, AI-powered travel journal.
          </p>
          
          <div>
            <Login onLoginSuccess={onLoginSuccess} />
          </div>
        </section>

        {/* 2. Interactive "Scrapbook" UI Demo */}
        <section style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center', perspective: '1200px' }}>
          <motion.div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={promptLogin}
            style={{ 
              width: '100%',
              maxWidth: '900px',
              rotateX: rotateX,
              rotateY: rotateY,
              transformStyle: 'preserve-3d',
              cursor: 'pointer'
            }}
          >
            <div className="comic-box" style={{ width: '100%', position: 'relative' }}>
              {/* Tape Doodle */}
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)', width: '100px', height: '30px', background: 'rgba(255,255,255,0.7)', border: '1px solid #ccc', boxShadow: '1px 1px 3px rgba(0,0,0,0.1)', zIndex: 10 }}></div>
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <span className="cartoon-font" style={{ fontSize: '2rem', color: 'var(--marker-blue)' }}>My Awesome Trip 🌴</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Itinerary List */}
                <div style={{ border: '3px dashed var(--ink-black)', borderRadius: '12px', padding: '1rem', background: '#fff' }}>
                  <div style={{ height: '24px', width: '60%', background: 'var(--marker-yellow)', borderRadius: '4px', marginBottom: '1.5rem', border: '2px solid var(--ink-black)' }} />
                  
                  {/* Reactive Itinerary Items */}
                  <div ref={el => uiElementsRef.current[0] = el} style={{ padding: '0.5rem', borderRadius: '8px', borderBottom: '2px solid #ddd', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                    <MapPin size={24} color="var(--marker-red)" style={{marginRight: '12px'}} /> <span style={{ fontWeight: 800 }}>Day 1: Arrival</span>
                  </div>
                  <div ref={el => uiElementsRef.current[1] = el} style={{ padding: '0.5rem', borderRadius: '8px', borderBottom: '2px solid #ddd', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                    <MapPin size={24} color="var(--marker-blue)" style={{marginRight: '12px'}} /> <span style={{ fontWeight: 800 }}>Day 2: City Tour</span>
                  </div>
                  <div ref={el => uiElementsRef.current[2] = el} style={{ padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                    <MapPin size={24} color="var(--marker-green)" style={{marginRight: '12px'}} /> <span style={{ fontWeight: 800 }}>Day 3: Relax</span>
                  </div>
                </div>

                {/* Map Area */}
                <div style={{ background: '#f0f0f0', border: '3px solid var(--ink-black)', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                   <Map size={80} color="var(--text-secondary)" opacity={0.3} />
                   {/* Map Path Doodle inside map */}
                   <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
                      <motion.path 
                        d="M 50 150 Q 150 50, 250 150 T 450 100" 
                        fill="transparent" 
                        stroke="var(--marker-red)" 
                        strokeWidth="4" 
                        strokeDasharray="6 8"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                      />
                   </svg>
                   <motion.div 
                      animate={{ y: [0, -10, 0] }} 
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      style={{ position: 'absolute', top: '40%', left: '40%' }}
                   >
                      <Navigation size={32} color="var(--marker-blue)" fill="var(--marker-blue)" />
                   </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. 2x2 Feature Cards Grid */}
        <section style={{ paddingTop: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--ink-black)' }}>
              Superpowers Included!
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {/* Feature 1 */}
            <div 
              ref={el => cardsRef.current[0] = el} 
              onMouseEnter={() => setHoveredCard('yellow')}
              onMouseLeave={() => setHoveredCard(null)}
              className="comic-box comic-box-yellow" 
              style={{ display: 'flex', flexDirection: 'column', minHeight: '220px', transformOrigin: 'bottom center' }}
            >
              <Zap size={48} fill="var(--marker-yellow)" color="var(--ink-black)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Smart AI Magic</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.5', fontWeight: '800' }}>
                Gemini reads your crazy constraints (vegan, $50 budget) and makes it work effortlessly!
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              ref={el => cardsRef.current[1] = el} 
              onMouseEnter={() => setHoveredCard('blue')}
              onMouseLeave={() => setHoveredCard(null)}
              className="comic-box comic-box-blue" 
              style={{ display: 'flex', flexDirection: 'column', minHeight: '220px', transformOrigin: 'bottom center' }}
            >
              <Cloud size={48} fill="var(--marker-blue)" color="var(--ink-black)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Rain? No Problem!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.5', fontWeight: '800' }}>
                Weather changes? We instantly swap your park picnic for a museum trip in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              ref={el => cardsRef.current[2] = el} 
              onMouseEnter={() => setHoveredCard('green')}
              onMouseLeave={() => setHoveredCard(null)}
              className="comic-box comic-box-green" 
              style={{ display: 'flex', flexDirection: 'column', minHeight: '220px', transformOrigin: 'bottom center' }}
            >
              <Shield size={48} fill="var(--marker-green)" color="var(--ink-black)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Fort Knox Security</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.5', fontWeight: '800' }}>
                Your travel plans are safe with Firebase auth. No peeking allowed!
              </p>
            </div>

            {/* Feature 4 (NEW) */}
            <div 
              ref={el => cardsRef.current[3] = el} 
              onMouseEnter={() => setHoveredCard('red')}
              onMouseLeave={() => setHoveredCard(null)}
              className="comic-box comic-box-red" 
              style={{ display: 'flex', flexDirection: 'column', minHeight: '220px', transformOrigin: 'bottom center', borderColor: 'var(--marker-red)', boxShadow: '6px 6px 0px var(--marker-red)' }}
            >
              <Users size={48} fill="var(--marker-red)" color="var(--ink-black)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Collaborative Planning</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.5', fontWeight: '800' }}>
                Invite friends, vote on activities, and sync the perfect itinerary together!
              </p>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}
