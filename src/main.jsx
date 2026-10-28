import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, MotionConfig, useReducedMotion, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight, ArrowDown, Download, Menu, X, Plus, Minus } from 'lucide-react';
import ProfileCard from './components/ProfileCard';
import GradualBlur from './components/GradualBlur';
import VariableProximity from './components/VariableProximity';
import ScrollReveal from './components/ScrollReveal';
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
function Cursor() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 180, damping: 25 }), sy = useSpring(y, { stiffness: 180, damping: 25 });
  const [visible, setVisible] = useState(false), [hover, setHover] = useState(false);
  useEffect(() => {
    if (reduced || !matchMedia('(pointer:fine)').matches) return;
    const move = e => { x.set(e.clientX); y.set(e.clientY); setVisible(true); setHover(!!e.target.closest('a,button')); };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move);
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    return () => { window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave); window.removeEventListener('blur', leave); };
  }, [reduced, x, y]);
  if (reduced) return null;
  return <motion.div aria-hidden="true" className="cursor" style={{ left: sx, top: sy }} animate={{ opacity: visible ? 1 : 0, width: hover ? 48 : 28, height: hover ? 48 : 28 }} transition={{ duration: .25 }} />;
}
function Venture({ item, index }) {
  const [open, setOpen] = useState(false);
  return <Reveal className="venture">
    <button className="venture-summary" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={'venture-' + index}>
      <span className="row-number">0{index + 1}</span>
      <span className="venture-name"><span className="small-label">{item.field}</span><h3>{item.name}</h3><span className="venture-description">{item.description}</span></span>
      <span className="venture-result">{item.result}<small>{item.metric}</small></span>
      <span className="expand-icon">{open ? <Minus size={20}/> : <Plus size={20}/>}</span>
    </button>
    <div id={'venture-' + index} hidden={!open} className="venture-detail"><p>{item.detail}</p><span className="small-label">{item.role} · {item.period}</span></div>
  </Reveal>;
}
function App() {
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
    <a className="skip" href="#main">Skip to content</a><Cursor/>
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
      <section id="home" className="hero container" ref={heroRef}>
        <Reveal className="hero-copy">
          <p className="eyebrow">SHAYAAN NAKHWA <span>—</span> ENTREPRENEUR & OPERATOR</p>
          <h1>{reduced ? <>Ideas into<br/>business.</> : <><VariableProximity label="Ideas into" containerRef={heroRef} fromFontVariationSettings="'wght' 450" toFontVariationSettings="'wght' 720" radius={160}/><br/><VariableProximity label="business." containerRef={heroRef} fromFontVariationSettings="'wght' 450" toFontVariationSettings="'wght' 720" radius={160}/></>}</h1>
          <p className="hero-description">I build ventures at the intersection of<br className="desktop"/> growth, creativity, and emerging technology.</p>
          <div className="hero-actions"><a className="button" href="#ventures">Selected ventures <ArrowUpRight size={18}/></a><a className="quiet-link" href="/Shayaan_Nakhwa_Resume.pdf" download>Résumé <Download size={16}/></a></div>
        </Reveal>
        <Reveal className="hero-portrait" delay={.15}>
          <ProfileCard avatarUrl={portrait} name="Shayaan Nakhwa" title="Entrepreneur & operator" handle="" status="Mumbai, India" statusColor="#c9c9c9" contactText="Connect" onContactClick={() => { window.location.hash = 'contact'; }} backdropColor="#171717" holo={0} glare={.16} tiltStrength={5} parallax={2} intro={false} enableTilt={!reduced} radius={14}/>
        </Reveal>
        <div className="hero-foot"><a href="#about"><ArrowDown size={14}/> A little more about me</a><span>Currently building Nyrox <span className="status-dot"/></span></div>
      </section>
      <section id="about" className="section container about">
        <Reveal><p className="eyebrow">01 / ABOUT</p></Reveal>
        <div><ScrollReveal baseRotation={0} baseOpacity={.25} blurStrength={3} wordAnimationEnd="bottom 75%" textClassName="statement">Curiosity starts it. Execution makes it real.</ScrollReveal>
          <Reveal className="about-body"><p>I’m a BBA student at NMIMS, ASMSOC, and a founder who learns by building. From launching an e-commerce store to growing a Web3 agency and now co-founding Nyrox, I’ve taken ideas from the first conversation to the final delivery.</p><p>My work brings together sales, content, and operations. I care about thoughtful decisions, strong relationships, and following through.</p><a className="quiet-link" href="https://www.linkedin.com/in/shayaannakhwa" target="_blank" rel="noreferrer">More on LinkedIn <ArrowUpRight size={16}/></a></Reveal>
        </div>
      </section>
      <section id="ventures" className="section container">
        <Reveal className="section-heading"><div><p className="eyebrow">02 / SELECTED VENTURES</p><h2>Built from the ground up.</h2></div><span className="small-label">2023 — PRESENT</span></Reveal>
        <div>{ventures.map((item, index) => <Venture key={item.name} item={item} index={index}/>)}</div>
      </section>
      <section id="experience" className="section container experience">
        <Reveal className="experience-heading"><p className="eyebrow">03 / EXPERIENCE</p><h2>Learning<br/>by doing.</h2><a className="quiet-link" href="/Shayaan_Nakhwa_Resume.pdf" download>Full résumé <Download size={16}/></a></Reveal>
        <div className="timeline">{experience.map(([date, role, company, description]) => <Reveal className="timeline-row" key={company}><div className="timeline-top"><span className="small-label">{date}</span><span>{company}</span></div><h3>{role}</h3><p>{description}</p></Reveal>)}<Reveal className="education"><span className="small-label">EDUCATION</span><p>BBA · NMIMS, ASMSOC <span>Class of 2027</span></p></Reveal></div>
      </section>
      <section id="contact" className="section container contact">
        <Reveal><p className="eyebrow">04 / GET IN TOUCH</p></Reveal>
        <ScrollReveal baseRotation={0} baseOpacity={.3} blurStrength={3} wordAnimationEnd="bottom 85%" textClassName="contact-title">Let’s build something that matters.</ScrollReveal>
        <Reveal><a className="contact-email" href="mailto:shayaan.nakhwa9@gmail.com">shayaan.nakhwa9@gmail.com <ArrowUpRight size={24}/></a><div className="contact-links"><a href="https://www.linkedin.com/in/shayaannakhwa" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15}/></a><a href="tel:+919136598643">+91 91365 98643 <ArrowUpRight size={15}/></a></div></Reveal>
      </section>
    </main>
    <footer className="container"><span>© {new Date().getFullYear()} Shayaan Nakhwa</span><a href="#home">Back to top ↑</a></footer>
  </MotionConfig>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
