import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, MotionConfig, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, Download, Menu, X, ArrowRight } from 'lucide-react';
import ProfileCard from './components/ProfileCard';
import GradualBlur from './components/GradualBlur';
import VariableProximity from './components/VariableProximity';
import ScrollReveal from './components/ScrollReveal';
const PatternWaves = lazy(() => import('./components/PatternWaves'));
import AnimatedList from './components/AnimatedList';
import { MotionCursor, ConnectForm } from './components/ConnectForm';
import portrait from '../image.png';
import './style.css';

const ventures = [
  { name: 'Nyrox', field: 'Web development & AI automation', period: '2026 — Present', role: 'Co-founder', result: '5+', metric: 'business clients', description: 'Websites and AI workflows that help businesses work smarter.', detail: 'Co-founded an agency serving international clients. I manage the full journey from prospecting and pitching to closing and final delivery.' },
  { name: 'AddVinci', field: 'Web3 content & design', period: '2023 — 2025', role: 'Founder', result: '₹30L+', metric: 'revenue generated', description: 'Built a content and design agency serving more than 40 Web3 clients.', detail: 'Led strategy, creative execution, and client relationships. Managed the complete Twitter account of a client with over 100,000 followers.' },
  { name: 'Time ShadeX', field: 'E-commerce', period: '2023', role: 'Founder', result: '₹1L+', metric: 'store revenue', description: 'An independent watch brand, built from sourcing through launch.', detail: 'Worked directly with Chinese vendors on product sourcing, built the store, and managed marketing to generate more than 25 orders.' }
];
const experience = [
  ['Jul 2026 — Present', 'Co-founder', 'Nyrox', 'Web and AI automation. Outreach, sales, and end-to-end delivery.'],
  ['Apr — Jun 2026', 'Intern, Founder’s Office', 'Ubiqedge', 'Supported forecasting for a ₹14 Cr+ annual budget and reached 300+ businesses.'],
  ['Oct 2023 — Nov 2025', 'Founder', 'AddVinci', 'Scaled a Web3 content and design agency to 40+ clients.'],
  ['May — Aug 2023', 'Founder', 'Time ShadeX', 'International sourcing, e-commerce operations, and marketing.']
];
function Reveal({ children, className = '', delay = 0 }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .7, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
function ExperienceTimeline() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 65%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <div className="timeline" ref={ref}>
    <div className="timeline-track" aria-hidden="true"><motion.div className="timeline-progress" style={{ scaleY: reduced ? 1 : progress }}/></div>
    <ol>{experience.map(([date, role, company, description]) => <li key={company} className="timeline-row">
      <span className="timeline-dot" aria-hidden="true"/>
      <Reveal><div className="timeline-top"><h3>{company}</h3><span>{date}</span></div><h4>{role}</h4><p>{description}</p></Reveal>
    </li>)}</ol>
  </div>;
}
function Ventures() {
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  return <div className="ventures-content">
    <AnimatedList items={ventures} initialSelectedIndex={0} selectOnHover={false} onItemSelect={(_, index) => setSelected(index)}
      ariaLabel="Select a venture to read more" frame={false} width="100%" maxHeight="none" showGradients={false}
      animation={reduced ? 'none' : 'slide'} animateOnce gap={12} radius={20} className="venture-list"
      renderItem={(item, index, isSelected) => <>
        <span className="venture-text"><span className="venture-title">{item.name}</span><span className="venture-description">{item.description}</span></span>
        <span className="venture-result">{item.result}<span>{item.metric}</span></span>
        <ArrowRight size={20} className={isSelected ? 'venture-arrow selected' : 'venture-arrow'}/>
      </>}/>
    <motion.div key={selected} className="venture-detail" initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }} aria-live="polite" aria-atomic="true">
      <h3>{ventures[selected].name} <span>{ventures[selected].role} · {ventures[selected].period}</span></h3><p>{ventures[selected].detail}</p>
    </motion.div>
  </div>;
}
function App() {
  const dialogRef = useRef(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const heroRef = useRef(null), [menu, setMenu] = useState(false), [active, setActive] = useState('');
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const close = e => { if (e.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return <MotionConfig reducedMotion="user">
    <MotionCursor target={connectOpen ? dialogRef.current : null}/><ConnectForm open={connectOpen} onClose={() => setConnectOpen(false)} dialogRef={dialogRef}/><a className="skip" href="#main">Skip to content</a>
    <GradualBlur target="page" position="top" height="7rem" strength={.7} layers={5} tint="#000" zIndex={20}/>
    <header className="nav glass">
      <a className="wordmark" href="#home" aria-label="Shayaan home" onClick={() => setMenu(false)}>shayaan<span>.</span></a>
      <nav id="navigation" className={menu ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        {['About', 'Ventures', 'Experience'].map(label => <a key={label} className={active === label.toLowerCase() ? 'active' : ''} href={'#' + label.toLowerCase()} onClick={() => setMenu(false)}>{label}</a>)}
      </nav>
      <a className="nav-contact" href="#contact" onClick={() => setMenu(false)}>Let’s talk <ArrowUpRight size={15}/></a>
      <button className="menu-toggle" aria-label={menu ? 'Close menu' : 'Open menu'} aria-controls="navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={20}/> : <Menu size={20}/>}</button>
    </header>
    <main id="main">
      <div className="home-wrap"><div className="home-waves" aria-hidden="true"><Suspense fallback={null}><PatternWaves preset="silk" color="#ffffff" backgroundColor="#000000" opacity={.28} speed={.16} spacing={11} markSize={.65} depth={.6} interactive={false} intro={false} paused={!!reduced}/></Suspense></div><section id="home" className="hero container" ref={heroRef}>
        <Reveal className="hero-copy">
          <h1>{reduced ? <>Ideas into<br/>business.</> : <><VariableProximity label="Ideas into" containerRef={heroRef} fromFontVariationSettings="'wght' 450" toFontVariationSettings="'wght' 720" radius={160}/><br/><VariableProximity label="business." containerRef={heroRef} fromFontVariationSettings="'wght' 450" toFontVariationSettings="'wght' 720" radius={160}/></>}</h1>
          <p className="hero-description">I build ventures at the intersection of<br className="desktop"/> growth, creativity, and emerging technology.</p>
          <div className="hero-actions"><a className="button" href="#ventures">Selected ventures <ArrowUpRight size={18}/></a><a className="quiet-link" href="/Shayaan_Nakhwa_Resume.pdf" download>Résumé <Download size={16}/></a></div>
        </Reveal>
        <Reveal className="hero-portrait" delay={.15}>
          <ProfileCard avatarUrl={portrait} name="Shayaan Nakhwa" title="Entrepreneur & operator" handle="" status="Mumbai, India" statusColor="#c9c9c9" contactText="Connect" onContactClick={() => setConnectOpen(true)} backdropColor="#171717" holo={0} glare={.16} tiltStrength={5} parallax={2} intro={false} enableTilt={!reduced} radius={14}/>
        </Reveal>
      </section></div>

      <section id="about" className="section container about">
        <Reveal><h2>About me</h2></Reveal>
        <div className="about-content">
          <ScrollReveal baseRotation={0} baseOpacity={.4} blurStrength={2} wordAnimationEnd="bottom 80%" textClassName="statement">Curiosity starts it. Execution makes it real.</ScrollReveal>
          <Reveal className="about-body"><p>I’m a BBA student at NMIMS, ASMSOC, and a founder who learns by building. From launching an e-commerce store to growing a Web3 agency and now co-founding Nyrox, I’ve taken ideas from the first conversation to the final delivery.</p><p>My work brings together sales, content, and operations. I care about thoughtful decisions, strong relationships, and following through.</p><a className="quiet-link" href="https://www.linkedin.com/in/shayaannakhwa" target="_blank" rel="noreferrer">More on LinkedIn <ArrowUpRight size={16}/></a></Reveal>
        </div>
      </section>
      <section id="ventures" className="section container">
        <Reveal className="section-heading"><h2>Ventures</h2></Reveal>
        <Ventures/>
      </section>
      <section id="experience" className="section container experience">
        <Reveal className="section-heading"><h2>Experience</h2><a className="quiet-link" href="/Shayaan_Nakhwa_Resume.pdf" download>Full résumé <Download size={16}/></a></Reveal>
        <ExperienceTimeline/>
        <Reveal className="education"><h3>Education</h3><p>BBA · NMIMS, ASMSOC <span>Class of 2027</span></p></Reveal>
      </section>
      <section id="contact" className="section container contact">
        <Reveal><h2>Let’s connect</h2></Reveal>
        <ScrollReveal baseRotation={0} baseOpacity={.4} blurStrength={2} wordAnimationEnd="bottom 85%" textClassName="contact-title">Let’s build something that matters.</ScrollReveal>
        <Reveal><a className="contact-email" href="mailto:shayaan.nakhwa9@gmail.com">shayaan.nakhwa9@gmail.com <ArrowUpRight size={24}/></a><div className="contact-links"><a href="https://www.linkedin.com/in/shayaannakhwa" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15}/></a><a href="tel:+919136598643">+91 91365 98643 <ArrowUpRight size={15}/></a></div></Reveal>
      </section>
    </main>
    <footer className="container"><span>© {new Date().getFullYear()} Shayaan Nakhwa</span><a href="#home">Back to top ↑</a></footer>
  </MotionConfig>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);


