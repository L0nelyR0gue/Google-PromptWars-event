import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Zap, Map, Shield, Cloud, Plane, MapPin, Sparkles } from 'lucide-react';
import Login from '../components/Login';

export default function Landing({ onLoginSuccess }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // GSAP Bouncy Entry Animation for the whole container
    gsap.fromTo(containerRef.current.children, 
      { y: 50, opacity: 0, rotation: () => Math.random() * 10 - 5 },
      { y: 0, opacity: 1, rotation: 0, duration: 1, stagger: 0.2, ease: "elastic.out(1, 0.5)" }
    );

    // GSAP Hover animations for cards
    cardsRef.current.forEach(card => {
      if(!card) return;
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.05, rotation: Math.random() * 4 - 2, duration: 0.3, ease: "back.out(1.7)" });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(1.7)" });
      });
    });
  }, []);

  const promptLogin = () => {
    alert("Time to plan! Please sign in to access your Doodle Journal.");
  };

  return (
    <main style={{ paddingBottom: '6rem', position: 'relative' }} ref={containerRef}>
      
      {/* Background Doodles */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.2, transform: 'rotate(-15deg)' }}>
        <Cloud size={100} />
      </div>
      <div style={{ position: 'absolute', top: '40%', right: '10%', opacity: 0.2, transform: 'rotate(10deg)' }}>
        <Cloud size={80} />
      </div>

      {/* SVG Flight Path (Framer Motion for ease of path drawing) */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
        <motion.path 
          d="M -100 200 Q 300 50, 600 300 T 1200 100" 
          fill="transparent" 
          stroke="var(--marker-blue)" 
          strokeWidth="4" 
          strokeDasharray="10 15"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
        />
      </svg>

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
        <div style={{ 
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
          fontWeight: '800'
        }}>
          <Sparkles size={18} fill="var(--ink-black)"/>
          Magic by Gemini
        </div>
        
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
          fontSize: '2rem', 
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
      <section style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
        <div 
          onClick={promptLogin}
          className="comic-box"
          style={{ 
            width: '100%',
            maxWidth: '900px',
            cursor: 'pointer',
            position: 'relative',
            transform: 'rotate(1deg)'
          }}
        >
          {/* Tape Doodle */}
          <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)', width: '100px', height: '30px', background: 'rgba(255,255,255,0.7)', border: '1px solid #ccc', boxShadow: '1px 1px 3px rgba(0,0,0,0.1)' }}></div>
          
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span className="cartoon-font" style={{ fontSize: '1.5rem', color: 'var(--marker-blue)' }}>My Awesome Trip 🌴</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            {/* Itinerary List */}
            <div style={{ border: '2px dashed var(--ink-black)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ height: '20px', width: '60%', background: 'var(--marker-yellow)', borderRadius: '2px', marginBottom: '1.5rem', border: '1px solid var(--ink-black)' }} />
              <div style={{ height: '40px', width: '100%', background: 'transparent', borderBottom: '2px solid #ddd', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}><MapPin size={20} color="var(--marker-red)" style={{marginRight: '8px'}} /> Day 1</div>
              <div style={{ height: '40px', width: '100%', background: 'transparent', borderBottom: '2px solid #ddd', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}><MapPin size={20} color="var(--marker-blue)" style={{marginRight: '8px'}} /> Day 2</div>
              <div style={{ height: '40px', width: '100%', background: 'transparent', borderBottom: '2px solid #ddd', display: 'flex', alignItems: 'center' }}><MapPin size={20} color="var(--marker-green)" style={{marginRight: '8px'}} /> Day 3</div>
            </div>
            {/* Map Area */}
            <div style={{ background: '#f0f0f0', border: '2px solid var(--ink-black)', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Map size={64} color="var(--text-secondary)" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bento Box Feature Cards */}
      <section style={{ paddingTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--ink-black)' }}>
            Superpowers Included!
          </h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* Feature 1 */}
          <div ref={el => cardsRef.current[0] = el} className="comic-box comic-box-yellow" style={{ display: 'flex', flexDirection: 'column', minHeight: '220px' }}>
            <Zap size={40} fill="var(--marker-yellow)" color="var(--ink-black)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Smart AI Magic</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.5', fontWeight: '600' }}>
              Gemini reads your crazy constraints (vegan, $50 budget) and makes it work!
            </p>
          </div>

          {/* Feature 2 */}
          <div ref={el => cardsRef.current[1] = el} className="comic-box comic-box-blue" style={{ display: 'flex', flexDirection: 'column', minHeight: '220px' }}>
            <Cloud size={40} fill="var(--marker-blue)" color="var(--ink-black)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Rain? No Problem!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.5', fontWeight: '600' }}>
              Weather changes? We instantly swap your park picnic for a museum trip.
            </p>
          </div>

          {/* Feature 3 */}
          <div ref={el => cardsRef.current[2] = el} className="comic-box comic-box-green" style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ flex: 1 }}>
              <Shield size={40} fill="var(--marker-green)" color="var(--ink-black)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Fort Knox Security</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.5', fontWeight: '600' }}>
                Your travel plans are safe with Firebase auth and Google Cloud Secret Manager. No peeking allowed!
              </p>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{ transform: 'rotate(5deg)', background: 'var(--paper-white)', padding: '1rem', border: '2px dashed var(--ink-black)', borderRadius: '8px' }}>
                <span className="cartoon-font" style={{ fontSize: '1.5rem', color: 'var(--marker-green)' }}>Top Secret Plans 🤫</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
