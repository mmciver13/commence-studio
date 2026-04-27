/* global React, ReactDOM, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSlider, TweakToggle, TweakColor, TweakSelect */
const { useEffect } = React;

const THEMES = {
  warm: {
    label: 'Warm Paper',
    paper: '#F7F5EE',
    paper2: '#FBF9F2',
    ink: '#0F0F0E',
    ink2: '#1B1A17',
    mute: '#ECE8DC',
    mute2: '#E3DECF',
    line: '#BFB9A6',
    subtle: '#6F6B5F',
    quiet: '#8E8A7E',
  },
  cool: {
    label: 'Cool Bone',
    paper: '#F1F2F4',
    paper2: '#F7F8FA',
    ink: '#0E1014',
    ink2: '#1A1D24',
    mute: '#E2E5EB',
    mute2: '#D5D9E1',
    line: '#B5BAC4',
    subtle: '#5F6675',
    quiet: '#878D9A',
  },
  noir: {
    label: 'Noir',
    paper: '#15140F',
    paper2: '#1C1B16',
    ink: '#F4EFDD',
    ink2: '#E8E2CD',
    mute: '#26241E',
    mute2: '#34322B',
    line: '#3F3C32',
    subtle: '#A8A294',
    quiet: '#7E7A6F',
  },
};

const ACCENTS = {
  rust:    { label: 'Rust',    accent: '#C9532E', accent2: '#B14624', accent3: '#A03A1E', soft: '#F4E5DA' },
  forest:  { label: 'Forest',  accent: '#3F6B4F', accent2: '#2F5440', accent3: '#1F3A2E', soft: '#DDE7DF' },
  cobalt:  { label: 'Cobalt',  accent: '#3559C7', accent2: '#2A47A6', accent3: '#1F388A', soft: '#DCE3F5' },
  amber:   { label: 'Amber',   accent: '#C58A1F', accent2: '#A57418', accent3: '#875E10', soft: '#F4E8CD' },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "warm",
  "accent": "rust",
  "fontScale": 1,
  "radius": 1,
  "density": 1,
  "serifHeads": true,
  "reduceMotion": false
}/*EDITMODE-END*/;

function applyTokens(t) {
  const root = document.documentElement;
  const theme = THEMES[t.theme] || THEMES.warm;
  const accent = ACCENTS[t.accent] || ACCENTS.rust;
  root.style.setProperty('--paper', theme.paper);
  root.style.setProperty('--paper-2', theme.paper2);
  root.style.setProperty('--ink', theme.ink);
  root.style.setProperty('--ink-2', theme.ink2);
  root.style.setProperty('--mute', theme.mute);
  root.style.setProperty('--mute-2', theme.mute2);
  root.style.setProperty('--line', theme.line);
  root.style.setProperty('--subtle', theme.subtle);
  root.style.setProperty('--quiet', theme.quiet);
  root.style.setProperty('--accent', accent.accent);
  root.style.setProperty('--accent-2', accent.accent2);
  root.style.setProperty('--accent-3', accent.accent3);
  root.style.setProperty('--accent-soft', accent.soft);

  // Font scale via base font-size
  document.body.style.fontSize = (17 * t.fontScale) + 'px';

  // Radius scale
  root.style.setProperty('--r-sm', (6 * t.radius) + 'px');
  root.style.setProperty('--r-md', (12 * t.radius) + 'px');
  root.style.setProperty('--r-lg', (20 * t.radius) + 'px');
  root.style.setProperty('--r-xl', (32 * t.radius) + 'px');

  // Serif headings toggle
  if (!t.serifHeads) {
    root.style.setProperty('--serif', "'Inter', ui-sans-serif, system-ui, sans-serif");
  } else {
    root.style.setProperty('--serif', "'Fraunces', 'Tiempos Headline', Georgia, serif");
  }

  // Density — adjust section padding via custom var (CSS already uses 96/128)
  // Toggle a class on body to scale section padding
  document.body.classList.toggle('density-tight', t.density < 1);
  document.body.classList.toggle('density-loose', t.density > 1);

  // Paper grain is always on globally — ensure it exists
  ensureGrain();

  // Reduced motion
  document.body.classList.toggle('force-reduce-motion', !!t.reduceMotion);
}

function ensureGrain() {
  let el = document.getElementById('__grain');
  if (el) return;
  el = document.createElement('div');
  el.id = '__grain';
  el.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:9999;mix-blend-mode:multiply;opacity:.07;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
  document.body.appendChild(el);
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    applyTokens(tweaks);
  }, [tweaks]);

  return (
    <TweaksPanel title="Tweaks" defaultOpen={false}>
      <TweakSection title="Color theme">
        <TweakRadio
          label="Surface"
          value={tweaks.theme}
          onChange={(v) => setTweak('theme', v)}
          options={[
            { value: 'warm', label: 'Warm' },
            { value: 'cool', label: 'Cool' },
            { value: 'noir', label: 'Noir' },
          ]}
        />
        <TweakSelect
          label="Accent"
          value={tweaks.accent}
          onChange={(v) => setTweak('accent', v)}
          options={Object.entries(ACCENTS).map(([k, v]) => ({ value: k, label: v.label }))}
        />
      </TweakSection>

      <TweakSection title="Type & shape">
        <TweakToggle
          label="Italic serif headlines"
          value={tweaks.serifHeads}
          onChange={(v) => setTweak('serifHeads', v)}
        />
        <TweakSlider
          label="Font scale"
          value={tweaks.fontScale}
          min={0.85} max={1.15} step={0.01}
          onChange={(v) => setTweak('fontScale', v)}
          format={(v) => `${Math.round(v * 100)}%`}
        />
        <TweakSlider
          label="Radius scale"
          value={tweaks.radius}
          min={0} max={1.4} step={0.05}
          onChange={(v) => setTweak('radius', v)}
          format={(v) => `${Math.round(v * 100)}%`}
        />
      </TweakSection>

      <TweakSection title="Atmosphere">
        <TweakToggle
          label="Reduce motion"
          value={tweaks.reduceMotion}
          onChange={(v) => setTweak('reduceMotion', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// Apply on first load even before mount, so values persist visually.
applyTokens(TWEAK_DEFAULTS);

const mount = document.createElement('div');
document.body.appendChild(mount);
ReactDOM.createRoot(mount).render(<App />);
