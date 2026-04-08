import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Heart, Copy, Download, Sparkles, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import { roastTemplates, complimentTemplates, getBurnLevel } from './templates';

const SPARKLE_COUNT = 12;

function useTypewriter(text, speed = 28) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) { setDisplayed(''); setDone(false); return; }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed, done };
}

function makeNoise(ctx, duration = 1) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  return src;
}

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime;

    if (type === 'roast') {
      // === ROAST: Dramatic villain reveal ===

      // 1. Ominous rising tension drone (before the hit)
      const drone = ctx.createOscillator();
      drone.type = 'sawtooth';
      drone.frequency.setValueAtTime(55, t);
      drone.frequency.exponentialRampToValueAtTime(110, t + 0.6);
      const droneFilter = ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(200, t);
      droneFilter.frequency.exponentialRampToValueAtTime(1200, t + 0.6);
      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0, t);
      droneGain.gain.linearRampToValueAtTime(0.4, t + 0.3);
      droneGain.gain.linearRampToValueAtTime(0, t + 0.6);
      drone.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(ctx.destination);
      drone.start(t);
      drone.stop(t + 0.6);

      // 2. CINEMATIC IMPACT BOOM at t+0.6
      const impactTime = t + 0.6;
      const boom = ctx.createOscillator();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(180, impactTime);
      boom.frequency.exponentialRampToValueAtTime(28, impactTime + 0.7);
      const boomGain = ctx.createGain();
      boomGain.gain.setValueAtTime(1.0, impactTime);
      boomGain.gain.exponentialRampToValueAtTime(0.001, impactTime + 0.7);
      boom.connect(boomGain);
      boomGain.connect(ctx.destination);
      boom.start(impactTime);
      boom.stop(impactTime + 0.7);

      // 3. Punch transient click
      const click = ctx.createOscillator();
      click.type = 'square';
      click.frequency.setValueAtTime(300, impactTime);
      click.frequency.exponentialRampToValueAtTime(60, impactTime + 0.08);
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.8, impactTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, impactTime + 0.08);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(impactTime);
      click.stop(impactTime + 0.08);

      // 4. Fire crackle (high-freq noise burst)
      const crackle = makeNoise(ctx, 1.2);
      const crackleHP = ctx.createBiquadFilter();
      crackleHP.type = 'highpass';
      crackleHP.frequency.value = 4000;
      const crackleLFO = ctx.createOscillator();
      crackleLFO.type = 'square';
      crackleLFO.frequency.setValueAtTime(18, impactTime);
      crackleLFO.frequency.linearRampToValueAtTime(6, impactTime + 1.2);
      const crackleLFOGain = ctx.createGain();
      crackleLFOGain.gain.value = 0.12;
      const crackleGain = ctx.createGain();
      crackleGain.gain.setValueAtTime(0.18, impactTime);
      crackleGain.gain.exponentialRampToValueAtTime(0.001, impactTime + 1.2);
      crackleLFO.connect(crackleLFOGain);
      crackleLFOGain.connect(crackleGain.gain);
      crackle.connect(crackleHP);
      crackleHP.connect(crackleGain);
      crackleGain.connect(ctx.destination);
      crackleLFO.start(impactTime);
      crackleLFO.stop(impactTime + 1.2);
      crackle.start(impactTime);

      // 5. Descending horror stinger (3 notes dropping fast)
      [220, 174.6, 130.8].forEach((freq, i) => {
        const st = impactTime + i * 0.13;
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, st);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, st + 0.12);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.3, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.2);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(st);
        osc.stop(st + 0.2);
      });

      // 6. Crowd "OOOH" reaction — detuned choir-like pads
      [130, 195, 260].forEach((freq, i) => {
        const st = impactTime + 0.5 + i * 0.05;
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq + (i * 3); // slight detune
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, st);
        g.gain.linearRampToValueAtTime(0.12, st + 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.9);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(st);
        osc.stop(st + 0.9);
      });

    } else {
      // === COMPLIMENT: Full orchestral fanfare ===

      // 1. Harp glissando — rapid ascending notes
      const harpNotes = [261.6, 329.6, 392, 493.9, 523.3, 659.3, 783.9, 987.8, 1046.5, 1318.5];
      harpNotes.forEach((freq, i) => {
        const st = t + i * 0.055;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, st);
        g.gain.linearRampToValueAtTime(0.22, st + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.45);
        // shimmer harmonic
        const sh = ctx.createOscillator();
        sh.type = 'sine';
        sh.frequency.value = freq * 2;
        const sg = ctx.createGain();
        sg.gain.setValueAtTime(0.07, st);
        sg.gain.exponentialRampToValueAtTime(0.001, st + 0.3);
        sh.connect(sg); sg.connect(ctx.destination);
        sh.start(st); sh.stop(st + 0.3);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(st); osc.stop(st + 0.45);
      });

      const fanfareTime = t + 0.55;

      // 2. Triumphant brass chord (fanfare hit)
      [[261.6, 329.6, 392, 523.3], [523.3, 659.3, 783.9, 1046.5]].forEach((chord, ci) => {
        const st = fanfareTime + ci * 0.35;
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          osc.type = 'square';
          osc.frequency.value = freq;
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 1800;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0, st);
          g.gain.linearRampToValueAtTime(0.18, st + 0.04);
          g.gain.setValueAtTime(0.18, st + 0.15);
          g.gain.exponentialRampToValueAtTime(0.001, st + 0.5);
          osc.connect(filter); filter.connect(g); g.connect(ctx.destination);
          osc.start(st); osc.stop(st + 0.5);
        });
      });

      // 3. Sparkle burst — random high tinkles
      for (let i = 0; i < 14; i++) {
        const st = fanfareTime + Math.random() * 0.8;
        const freq = 1200 + Math.random() * 2400;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.12, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.18);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(st); osc.stop(st + 0.18);
      }

      // 4. Warm string swell underneath
      [130.8, 196, 261.6, 329.6].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, fanfareTime);
        g.gain.linearRampToValueAtTime(0.1 - i * 0.015, fanfareTime + 0.3);
        g.gain.exponentialRampToValueAtTime(0.001, fanfareTime + 1.4);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(fanfareTime); osc.stop(fanfareTime + 1.4);
      });

      // 5. Final resolution ding
      const dingTime = fanfareTime + 0.7;
      [1046.5, 1318.5, 1568].forEach((freq, i) => {
        const st = dingTime + i * 0.08;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.3, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.6);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(st); osc.stop(st + 0.6);
      });
    }
  } catch (_) {}
}

export default function App() {
  const [mode, setMode] = useState('roast'); // 'roast' | 'compliment'
  const [name, setName] = useState('');
  const [habits, setHabits] = useState(['', '', '']);
  const [result, setResult] = useState('');
  const [templateIdx, setTemplateIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);
  const resultCardRef = useRef(null);

  const { displayed, done } = useTypewriter(result);
  const burnLevel = getBurnLevel(templateIdx);
  const isRoast = mode === 'roast';

  const handleHabit = (i, val) => {
    const h = [...habits];
    h[i] = val;
    setHabits(h);
  };

  const generate = useCallback(() => {
    const trimmedName = name.trim() || 'You';
    const filledHabits = habits.map(h => h.trim()).filter(Boolean);
    if (!filledHabits.length) filledHabits.push('existing');
    const templates = isRoast ? roastTemplates : complimentTemplates;
    const idx = Math.floor(Math.random() * templates.length);
    setTemplateIdx(idx);
    setResult(templates[idx](trimmedName, filledHabits));
    setGenerated(true);
    playSound(isRoast ? 'roast' : 'compliment');
  }, [name, habits, isRoast]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadImage = async () => {
    if (!resultCardRef.current) return;
    const canvas = await html2canvas(resultCardRef.current, { scale: 2, useCORS: true });
    const link = document.createElement('a');
    link.download = `vibecheck-${mode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const bgClass = isRoast
    ? 'bg-gradient-to-br from-gray-950 via-red-950 to-rose-900'
    : 'bg-gradient-to-br from-pink-100 via-rose-100 to-amber-100';

  const cardBg = isRoast
    ? 'bg-gray-900/80 border border-red-800/50 text-white'
    : 'bg-white/70 border border-pink-300/60 text-gray-800';

  return (
    <div className={`min-h-screen transition-all duration-700 ${bgClass} ${isRoast && generated ? 'shake-bg' : ''} relative overflow-hidden`}>

      {/* Floating sparkles for compliment mode */}
      {!isRoast && Array.from({ length: SPARKLE_COUNT }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-400 pointer-events-none select-none"
          style={{ left: `${(i * 8.3) % 100}%`, top: `${(i * 13 + 5) % 90}%`, fontSize: `${12 + (i % 3) * 8}px` }}
          animate={{ y: [0, -30, 0], opacity: [0.4, 1, 0.4], rotate: [0, 180, 360] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.25 }}
        >
          ✦
        </motion.div>
      ))}

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`text-5xl font-black tracking-tight mb-2 ${isRoast ? 'text-red-400' : 'text-pink-500'}`}>
            VibeCheck AI
          </h1>
          <p className={`text-sm font-medium ${isRoast ? 'text-red-300/70' : 'text-pink-400/80'}`}>
            {isRoast ? 'No mercy. No filter. Just facts.' : 'Pure serotonin, delivered fresh.'}
          </p>
        </motion.div>

        {/* Mood Switch */}
        <div className="flex justify-center mb-8">
          <div className={`flex items-center gap-1 p-1 rounded-full ${isRoast ? 'bg-gray-800/80' : 'bg-white/60'} shadow-lg`}>
            <button
              onClick={() => { setMode('roast'); setResult(''); setGenerated(false); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                isRoast ? 'bg-red-600 text-white shadow-md shadow-red-900' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Flame size={16} /> Roast Mode
            </button>
            <button
              onClick={() => { setMode('compliment'); setResult(''); setGenerated(false); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                !isRoast ? 'bg-pink-400 text-white shadow-md shadow-pink-200' : 'text-gray-400 hover:text-pink-400'
              }`}
            >
              <Heart size={16} /> Compliment Mode
            </button>
          </div>
        </div>

        {/* Input Card */}
        <motion.div
          className={`rounded-2xl p-6 mb-6 shadow-xl ${cardBg}`}
          layout
        >
          <div className="mb-4">
            <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${isRoast ? 'text-red-400' : 'text-pink-500'}`}>
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Arjun"
              className={`w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all ${
                isRoast
                  ? 'bg-gray-800 border border-red-800/40 text-white placeholder-gray-600 focus:border-red-500'
                  : 'bg-white/80 border border-pink-200 text-gray-700 placeholder-gray-400 focus:border-pink-400'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${isRoast ? 'text-red-400' : 'text-pink-500'}`}>
              Your Daily Habits (2–3)
            </label>
            {habits.map((h, i) => (
              <input
                key={i}
                type="text"
                value={h}
                onChange={e => handleHabit(i, e.target.value)}
                placeholder={`Habit ${i + 1} — e.g. ${['scrolling reels for 3 hours', 'skipping the gym', 'drinking 10 coffees'][i]}`}
                className={`w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all mb-2 ${
                  isRoast
                    ? 'bg-gray-800 border border-red-800/40 text-white placeholder-gray-600 focus:border-red-500'
                    : 'bg-white/80 border border-pink-200 text-gray-700 placeholder-gray-400 focus:border-pink-400'
                }`}
              />
            ))}
          </div>

          <motion.button
            onClick={generate}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className={`w-full mt-2 py-3.5 rounded-xl font-black text-sm tracking-wide transition-all ${
              isRoast
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white hover:from-red-500 hover:to-rose-600 shadow-lg shadow-red-900/40'
                : 'bg-gradient-to-r from-pink-400 to-amber-400 text-white hover:from-pink-300 hover:to-amber-300 shadow-lg shadow-pink-200/60'
            }`}
          >
            {isRoast ? '🔥 Generate Roast' : '✨ Generate Compliment'}
          </motion.button>
        </motion.div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              {/* Burn Meter (roast only) */}
              {isRoast && (
                <div className={`rounded-2xl p-4 mb-4 ${cardBg}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest">🌡 Burn Meter</span>
                    <span className="text-xs font-black text-red-300">{burnLevel.label}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${burnLevel.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${burnLevel.percent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>Mild</span><span>Medium</span><span>Hot</span><span>Extra Hot</span><span>3rd Degree 🔥</span>
                  </div>
                </div>
              )}

              {/* Result Card */}
              <div ref={resultCardRef} className={`rounded-2xl p-6 shadow-xl ${cardBg}`}>
                <div className="flex items-center gap-2 mb-3">
                  {isRoast ? <Flame size={18} className="text-red-400" /> : <Sparkles size={18} className="text-pink-400" />}
                  <span className={`text-xs font-black uppercase tracking-widest ${isRoast ? 'text-red-400' : 'text-pink-400'}`}>
                    {isRoast ? 'Your Roast' : 'Your Compliment'}
                  </span>
                </div>
                <p className={`text-base leading-relaxed font-medium min-h-[80px] ${isRoast ? 'text-gray-100' : 'text-gray-700'}`}>
                  {displayed}
                  {!done && <span className="animate-pulse">|</span>}
                </p>
              </div>

              {/* Action Buttons */}
              {done && (
                <motion.div
                  className="flex gap-3 mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <button
                    onClick={copyToClipboard}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                      isRoast
                        ? 'bg-gray-800 hover:bg-gray-700 text-red-300 border border-red-800/40'
                        : 'bg-white/70 hover:bg-white text-pink-500 border border-pink-200'
                    }`}
                  >
                    <Copy size={15} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadImage}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                      isRoast
                        ? 'bg-gray-800 hover:bg-gray-700 text-red-300 border border-red-800/40'
                        : 'bg-white/70 hover:bg-white text-pink-500 border border-pink-200'
                    }`}
                  >
                    <Download size={15} />
                    Save as Image
                  </button>
                  <button
                    onClick={generate}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                      isRoast
                        ? 'bg-red-700 hover:bg-red-600 text-white'
                        : 'bg-pink-400 hover:bg-pink-300 text-white'
                    }`}
                  >
                    <RefreshCw size={15} />
                    Regenerate
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </div>
  );
}
