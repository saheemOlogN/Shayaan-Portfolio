import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { X, ArrowUpRight } from 'lucide-react';

export function MotionCursor({ target }) {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const smoothX = useSpring(x, { stiffness: 900, damping: 48 });
  const smoothY = useSpring(y, { stiffness: 900, damping: 48 });
  const [visible, setVisible] = useState(false), [interactive, setInteractive] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const media = matchMedia('(hover: hover) and (pointer: fine)');
    let placed = false;
    const hide = () => { setVisible(false); placed = false; document.documentElement.classList.remove('motion-cursor-active'); };
    const move = event => {
      if (!media.matches || event.pointerType !== 'mouse') { hide(); return; }
      x.set(event.clientX); y.set(event.clientY);
      if (!placed) { smoothX.jump(event.clientX); smoothY.jump(event.clientY); placed = true; }
      setInteractive(!!event.target.closest('a,button,input,textarea,[role="option"]'));
      setVisible(true); document.documentElement.classList.add('motion-cursor-active');
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('blur', hide);
    document.documentElement.addEventListener('pointerleave', hide);
    media.addEventListener('change', hide);
    return () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('blur', hide);
      document.documentElement.removeEventListener('pointerleave', hide); media.removeEventListener('change', hide); hide();
    };
  }, [x, y, smoothX, smoothY]);
  return createPortal(<motion.div className="motion-cursor" aria-hidden="true"
    style={{ left: reduced ? x : smoothX, top: reduced ? y : smoothY }}
    animate={{ opacity: visible ? 1 : 0, scale: interactive ? 2.2 : 1 }}
    transition={{ duration: reduced ? 0 : .18 }}/>, target || document.body);
}
export function ConnectForm({ open, onClose, dialogRef }) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open, dialogRef]);
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !message) return;
    const text = 'Hi Shayaan, I’m ' + name + '.\n\n' + message;
    window.open('https://wa.me/919136598643?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
  }
  return <dialog ref={dialogRef} className="connect-dialog" aria-labelledby="connect-title"
    onCancel={onClose} onClose={onClose}
    onClick={event => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) onClose(); } }}>
    <motion.div key={String(open)} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}>
      <button type="button" className="dialog-close" aria-label="Close contact form" onClick={onClose}><X size={20}/></button>
      <h2 id="connect-title">Let’s connect</h2>
      <p>Tell me a little about yourself and what you have in mind.</p>
      <form onSubmit={submit}>
        <label htmlFor="connect-name">Your name</label>
        <input id="connect-name" name="name" autoComplete="name" placeholder="Name" required maxLength={80} pattern=".*\S.*"/>
        <label htmlFor="connect-message">What would you like to discuss?</label>
        <textarea id="connect-message" name="message" placeholder="A short introduction or idea…" required maxLength={1000} rows={4}/>
        <p className="form-note">Opens WhatsApp with your message ready. Press Send there to deliver it.</p>
        <button className="button whatsapp-button" type="submit">Continue to WhatsApp <ArrowUpRight size={18}/></button>
      </form>
    </motion.div>
  </dialog>;
}
