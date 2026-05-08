import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Map, Shield, CalendarDays, Cloud, Smartphone } from 'lucide-react';
import Login from '../components/Login';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Landing({ onLoginSuccess }) {
  return (
    <main style={{ paddingBottom: '6rem' }}>
      {/* Hero Section */}
      <section style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: '4rem'
      }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          style={{ maxWidth: '800px' }}
        >
          <motion.div variants={fadeUpVariant} style={{ marginBottom: '1.5rem' }}>
            <span style={{ 
              background: 'var(--glass-bg)', 
              border: '1px solid var(--glass-border)', 
              padding: '8px 16px', 
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--google-green)', boxShadow: '0 0 10px var(--google-green)' }} />
              Powered by Gemini 2.0 Flash
            </span>
          </motion.div>
          
          <motion.h1 variants={fadeUpVariant} style={{ 
            fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', 
            fontWeight: '800', 
            lineHeight: '1.05',
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
            background: 'var(--google-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 24px rgba(66, 133, 244, 0.2))'
          }}>
            PromptWars<br/>Travel Engine.
          </motion.h1>
          
          <motion.p variants={fadeUpVariant} style={{ 
            fontSize: '1.1rem', 
            color: 'var(--text-secondary)', 
            maxWidth: '600px', 
            margin: '0 auto 3rem auto',
            lineHeight: '1.6',
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            > Input budget, dates & constraints.<br/>
            > Orchestrating Gemini API...<br/>
            > Outputting perfect day-by-day itinerary.
          </motion.p>
          
          <motion.div variants={fadeUpVariant}>
            <Login onLoginSuccess={onLoginSuccess} />
          </motion.div>
        </motion.div>
      </section>

      {/* UI Demo Window */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUpVariant}
        style={{ 
          display: 'flex', 
          justifyContent: 'center',
          marginTop: '-4rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          background: 'var(--bg-color-secondary)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}>
          {/* Fake Browser Header */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            padding: '12px 16px', 
            borderBottom: '1px solid var(--glass-border)',
            background: 'var(--glass-bg)'
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--google-red)' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--google-yellow)' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--google-green)' }} />
          </div>
          {/* Fake Dashboard Content */}
          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', opacity: 0.8 }}>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '1rem', height: '300px' }}>
              <div style={{ height: '20px', width: '50%', background: 'var(--glass-border)', borderRadius: '4px', marginBottom: '2rem' }} />
              <div style={{ height: '40px', width: '100%', background: 'var(--glass-border)', borderRadius: '4px', marginBottom: '1rem' }} />
              <div style={{ height: '40px', width: '100%', background: 'var(--glass-border)', borderRadius: '4px', marginBottom: '1rem' }} />
              <div style={{ height: '40px', width: '100%', background: 'var(--glass-border)', borderRadius: '4px' }} />
            </div>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '1rem' }}>
               <div style={{ height: '100%', width: '100%', background: 'var(--glass-bg)', borderRadius: '4px', border: '1px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Map size={48} color="var(--text-secondary)" />
               </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tech Stack / Social Proof */}
      <section style={{ padding: '6rem 0 4rem 0', textAlign: 'center', borderBottom: '1px solid var(--glass-border)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2rem' }}>
          Built with cutting-edge technology
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>Google Cloud</span>
          <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>Firebase</span>
          <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>Gemini AI</span>
          <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>Google Maps</span>
        </div>
      </section>

      {/* Bento Box Features */}
      <section style={{ paddingTop: '6rem' }}>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <motion.h2 variants={fadeUpVariant} style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Everything you need for the perfect trip.
          </motion.h2>
          <motion.p variants={fadeUpVariant} style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
            A powerful orchestrator that handles APIs, weather data, and strict constraints so you don't have to.
          </motion.p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* Feature 1 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="glass-panel"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '250px' }}
          >
            <Zap size={32} color="var(--google-yellow)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Context-Aware AI</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Gemini understands complex constraints like dietary needs and strict budgets before planning.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="glass-panel"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '250px' }}
          >
            <Cloud size={32} color="var(--google-blue)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Real-Time Adaptation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Weather turned bad? The engine automatically swaps outdoor activities for indoor alternatives.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="glass-panel"
            style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '3rem', padding: '3rem' }}
          >
            <div style={{ flex: 1 }}>
              <Shield size={32} color="var(--google-green)" style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Enterprise Security</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.5' }}>
                Your data is secured using Google Cloud Secret Manager and robust input validation. Safe, private, and fully compliant.
              </p>
            </div>
            <div style={{ flex: 1, background: 'var(--glass-bg)', borderRadius: '8px', padding: '1.5rem', border: '1px solid var(--glass-border)' }}>
               <pre style={{ color: 'var(--google-green)', fontSize: '0.8rem', margin: 0, fontFamily: 'JetBrains Mono, monospace' }}>
{`> RUN_SECURITY_CHECK()
{
  "status": "secured",
  "auth": "firebase",
  "encryption": "aes-256",
  "rateLimit": "100/min"
}
> _`}
               </pre>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
