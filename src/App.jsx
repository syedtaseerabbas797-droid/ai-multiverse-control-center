import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Stars, 
  Html, 
  OrbitControls, 
  Float, 
  MeshDistortMaterial, 
  Text,
  useScroll,
  ScrollControls,
  Scroll,
  Torus,
  Sphere,
  Points,
  PointMaterial,
  Line
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useScroll as useFramerScroll, useTransform } from 'framer-motion';
import { 
  Zap, 
  Eye, 
  Mic2, 
  Database, 
  Cpu, 
  LineChart, 
  ShieldCheck, 
  Hexagon, 
  Activity, 
  Clock,
  ArrowRight,
  RefreshCcw,
  LayoutGrid,
  Globe
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- UTILS ---
const glitchText = (text) => text.split('').map(c => 
  Math.random() > 0.85 ? '!@#$%^&*'[Math.floor(Math.random() * 8)] : c
).join('');

// --- COMPONENTS ---

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [displayText, setDisplayText] = useState("INITIALIZING AI MULTIVERSE");
  const [subText, setSubText] = useState("");
  const fullSubText = "LOADING NEURAL SYSTEMS...";

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
      setProgress(Math.floor(currentProgress));
    }, 150);

    const glitchInterval = setInterval(() => {
      setDisplayText(prev => glitchText("INITIALIZING AI MULTIVERSE"));
    }, 100);

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      setSubText(fullSubText.substring(0, charIndex));
      charIndex++;
      if (charIndex > fullSubText.length) clearInterval(typeInterval);
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
      clearInterval(typeInterval);
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ y: '-100%', transition: { duration: 0.8, ease: "easeInOut" } }}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: '#000', zIndex: 10000, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '2rem'
      }}
    >
      <div style={{ width: '100px', height: '100px', position: 'relative' }}>
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{
            width: '100%', height: '100%', border: '2px solid #00D4FF',
            borderRadius: '50%', boxShadow: '0 0 30px #00D4FF'
          }}
        />
        <div style={{
          position: 'absolute', top: '10%', left: '10%', width: '80%', height: '80%',
          background: 'radial-gradient(circle, #00D4FF66 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(10px)'
        }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ 
          fontFamily: 'Orbitron', fontSize: '1.5rem', letterSpacing: '0.5rem', 
          color: '#00D4FF', marginBottom: '0.5rem' 
        }}>
          {displayText}
        </h2>
        <p style={{ fontFamily: 'Rajdhani', color: 'rgba(255,255,255,0.6)', minHeight: '1.5rem' }}>
          {subText}
        </p>
      </div>

      <div style={{ width: '300px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          style={{ height: '100%', background: '#00D4FF', boxShadow: '0 0 15px #00D4FF' }}
        />
      </div>

      <div style={{ 
        position: 'absolute', bottom: '2rem', fontFamily: 'Rajdhani', 
        fontSize: '0.8rem', letterSpacing: '0.2rem', color: 'rgba(255,255,255,0.4)' 
      }}>
        GOOGLE AI STUDIO × GEMINI ULTRA
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const navItems = [
    { name: 'HOME', id: 'hero' },
    { name: 'CORE', id: 'core' },
    { name: 'UNIVERSE', id: 'universe' },
    { name: 'DASHBOARD', id: 'dashboard' },
    { name: 'OUTRO', id: 'outro' }
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '60px',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,212,255,0.1)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Hexagon size={20} color="#00D4FF" />
        <span style={{ fontFamily: 'Orbitron', fontWeight: 700, color: '#00D4FF', letterSpacing: '2px' }}>
          AI MULTIVERSE
        </span>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {navItems.map(item => (
          <a 
            key={item.id} 
            href={`#${item.id}`}
            className="neon-text-hover"
            style={{ 
              fontFamily: 'Rajdhani', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', 
              textDecoration: 'none', transition: 'all 0.3s' 
            }}
          >
            {item.name}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.div 
            animate={{ opacity: [1, 0.4, 1] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: '8px', height: '8px', background: '#00FF88', borderRadius: '50%', boxShadow: '0 0 10px #00FF88' }}
          />
          <span style={{ fontSize: '0.7rem', color: '#00FF88', letterSpacing: '1px' }}>SYSTEM ONLINE</span>
        </div>
        <div style={{ fontFamily: 'Rajdhani', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', minWidth: '80px' }}>
          {time}
        </div>
      </div>
    </nav>
  );
};

// --- HERO COMPONENTS ---

const StarField = () => {
  const points = useMemo(() => {
    const p = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000 * 3; i++) {
        p[i] = (Math.random() - 0.5) * 160;
    }
    return p;
  }, []);

  const ref = useRef(null);
  useFrame((state) => {
    ref.current.rotation.y += 0.0002;
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#ffffff" size={0.1} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
};

const GalaxyCore = () => {
  const meshRef = useRef(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y += 0.003;
    const s = 0.95 + Math.sin(t * 2) * 0.05;
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <group>
      <mesh 
        ref={meshRef} 
        onPointerOver={() => setHover(true)} 
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          color="#000833" 
          emissive={hovered ? "#00FFFF" : "#00D4FF"} 
          emissiveIntensity={hovered ? 1.2 : 0.4}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      
      {/* Rings */}
      <Torus args={[2.5, 0.015, 8, 200]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#00D4FF" />
      </Torus>
      <Torus args={[3.2, 0.01, 8, 200]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <meshBasicMaterial color="#8B5CF6" />
      </Torus>
      <Torus args={[3.9, 0.008, 8, 200]} rotation={[-Math.PI / 6, -Math.PI / 10, 0]}>
        <meshBasicMaterial color="#00FF88" />
      </Torus>

      <OrbitingNodes />
    </group>
  );
};

const OrbitingNodes = () => {
  const nodes = [
    { label: "Neural Engine", color: "#00D4FF", r: 4.2, speed: 0.5, offset: 0 },
    { label: "Vision Core", color: "#8B5CF6", r: 4.8, speed: 0.4, offset: 2 },
    { label: "Voice Agent", color: "#00FF88", r: 4.5, speed: 0.6, offset: 4 },
    { label: "Data Memory", color: "#FF4444", r: 5.2, speed: 0.3, offset: 1 },
    { label: "Prediction AI", color: "#FF00FF", r: 5.0, speed: 0.7, offset: 3 },
    { label: "Auto Agents", color: "#FFD700", r: 4.6, speed: 0.45, offset: 5 }
  ];

  return <>{nodes.map((n, i) => <Node key={i} {...n} />)}</>;
};

const Node = ({ label, color, r, speed, offset }) => {
  const ref = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + offset;
    ref.current.position.x = Math.cos(t) * r;
    ref.current.position.z = Math.sin(t) * r;
    ref.current.position.y = Math.sin(t * 0.5) * 1.5;
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Html distanceFactor={10}>
        <div style={{
          padding: '2px 8px', background: 'rgba(0,0,0,0.8)', border: `1px solid ${color}`,
          color: '#fff', fontSize: '10px', whiteSpace: 'nowrap', fontFamily: 'Rajdhani',
          borderRadius: '4px', transform: 'translate(-50%, -150%)', pointerEvents: 'none'
        }}>
          {label}
        </div>
      </Html>
    </group>
  );
};

const Scene = () => {
  const { camera, mouse } = useThree();
  const targetX = useRef(0);
  const targetY = useRef(0);

  useFrame(() => {
    targetX.current = (mouse.x * 2 - camera.position.x) * 0.05;
    targetY.current = (mouse.y * 1.5 - camera.position.y) * 0.05;
    camera.position.x += targetX.current;
    camera.position.y += targetY.current;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={['#000']} />
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00D4FF" />
      
      <StarField />
      <GalaxyCore />
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.5} />
        <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.0005)} />
      </EffectComposer>
    </>
  );
};

// --- PLANET SECTION ---

const planetData = [
  { id: 1, name: "Neural Interface",    color: "#00D4FF", emissive: "#004466", size: 0.9, orbitR: 4.0, speed: 0.25, desc: "Direct brain-computer neural link system", stats: "2.4B params, 847 TFLOPS" },
  { id: 2, name: "Vision Intelligence", color: "#8B5CF6", emissive: "#2D1060", size: 0.75, orbitR: 5.5, speed: 0.18, desc: "Real-time visual processing and scene understanding", stats: "4K@120fps, 0.3ms latency" },
  { id: 3, name: "Voice Agent",         color: "#00FF88", emissive: "#003322", size: 0.65, orbitR: 6.8, speed: 0.32, desc: "Multilingual speech synthesis and comprehension", stats: "128 languages, 99.2% accuracy" },
  { id: 4, name: "Data Memory",         color: "#FF4444", emissive: "#440000", size: 0.8, orbitR: 3.2, speed: 0.40, desc: "Persistent episodic and semantic memory banks", stats: "10PB capacity, 1μs access" },
  { id: 5, name: "Automation Engine",   color: "#FFD700", emissive: "#443300", size: 0.7, orbitR: 7.5, speed: 0.15, desc: "Autonomous task orchestration and workflow AI", stats: "50K tasks/sec, self-healing" },
  { id: 6, name: "Predictive Analytics",color: "#FF00FF", emissive: "#440044", size: 0.85, orbitR: 9.0, speed: 0.12, desc: "Future-state modeling and probability forecasting", stats: "98.7% accuracy, 72hr horizon" }
];

const Planet = ({ data }) => {
  const ref = useRef(null);
  const meshRef = useRef(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * data.speed;
    ref.current.position.x = Math.cos(t) * data.orbitR;
    ref.current.position.z = Math.sin(t) * data.orbitR;
    meshRef.current.rotation.y += 0.01;
    
    if (hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <group ref={ref}>
      <mesh 
        ref={meshRef} 
        onPointerOver={() => setHover(true)} 
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshStandardMaterial 
          color={data.color} 
          emissive={data.emissive} 
          emissiveIntensity={hovered ? 1.5 : 0.5} 
          metalness={0.7} 
          roughness={0.3} 
        />
      </mesh>
      {hovered && (
        <Html distanceFactor={10} position={[0, data.size + 0.5, 0]}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '1rem', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
              border: `1px solid ${data.color}`, borderRadius: '12px', width: '200px',
              color: '#fff', pointerEvents: 'none'
            }}
          >
            <h4 style={{ fontFamily: 'Orbitron', color: data.color, margin: '0 0 0.5rem 0' }}>{data.name}</h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{data.desc}</p>
            <div style={{ height: '1px', background: data.color, opacity: 0.3, margin: '0.5rem 0' }} />
            <p style={{ margin: 0, fontSize: '0.7rem', color: data.color }}>{data.stats}</p>
          </motion.div>
        </Html>
      )}
    </group>
  );
};

const UniverseScene = () => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#FFD700" />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial emissive="#FFD700" emissiveIntensity={2} color="#FFD700" />
      </mesh>
      {planetData.map(p => (
        <React.Fragment key={p.id}>
          <Planet data={p} />
          <Torus args={[p.orbitR, 0.005, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
          </Torus>
        </React.Fragment>
      ))}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
};

// --- BLACK HOLE SECTION ---

const BlackHole = () => {
  const diskRef = useRef(null);
  const particlesRef = useRef(null);

  const particleData = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(2000 * 3);
    const color = new Float32Array(2000 * 3);
    const c1 = new THREE.Color("#FF00FF");
    const c2 = new THREE.Color("#8B5CF6");
    const c3 = new THREE.Color("#00D4FF");

    for (let i = 0; i < 2000; i++) {
      const radius = 3 + Math.random() * 5;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const c = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3;
      color[i * 3] = c.r;
      color[i * 3 + 1] = c.g;
      color[i * 3 + 2] = c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(color, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    diskRef.current.rotation.y += 0.05;
    particlesRef.current.rotation.y += 0.02;

    const positions = particlesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < 2000; i++) {
      let x = positions[i * 3];
      let z = positions[i * 3 + 2];
      let r = Math.sqrt(x*x + z*z);
      let angle = Math.atan2(z, x) + 0.02 * (3 / r);
      r -= 0.005;
      if (r < 1) r = 8;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 2] = Math.sin(angle) * r;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      <Torus ref={diskRef} args={[3, 0.4, 20, 200]}>
        <meshBasicMaterial color="#FF4400" transparent opacity={0.6} />
      </Torus>

      <points ref={particlesRef} geometry={particleData}>
        <PointMaterial size={0.05} vertexColors transparent opacity={0.8} />
      </points>

      {/* Lensing effect proxy */}
      <Torus args={[2, 0.05, 8, 200]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </Torus>
    </group>
  );
};

// --- UI COMPONENTS ---

const Metric = ({ label, value, prefix = "", suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    gsap.to({ val: 0 }, {
      val: parseFloat(value),
      duration: 2,
      scrollTrigger: { trigger: '#core', start: 'top 80%' },
      onUpdate: function() { setDisplayValue(Math.floor(this.targets()[0].val)); }
    });
  }, [value]);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '1.2rem', color: '#00D4FF', fontWeight: 600 }}>
        {prefix}{displayValue.toLocaleString()}{suffix}
      </p>
    </div>
  );
};

const DashboardCard = ({ children, title, icon: Icon, span = 1 }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="glass-card"
    style={{ 
      gridColumn: `span ${span}`, padding: '1.5rem', position: 'relative', 
      overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '1rem' 
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>{title}</h3>
      <Icon size={18} color="#00D4FF" />
    </div>
    {children}
  </motion.div>
);

const ActivityFeed = () => {
  const [logs, setLogs] = useState([
    { t: '12:04:12', m: 'Neural pathway optimized', c: '#00FF88' },
    { t: '12:04:15', m: 'Vision core processing stream', c: '#00D4FF' },
    { t: '12:04:18', m: 'Memory bank write successful', c: '#8B5CF6' },
  ]);

  useEffect(() => {
    const messages = [
      'Prediction model updated', 'New agent connected', 'Security scan complete',
      'System sync in progress', 'Data stream normalized', 'Voice matrix calibrated'
    ];
    const colors = ['#00FF88', '#00D4FF', '#8B5CF6', '#FFD700', '#FF00FF'];
    
    const interval = setInterval(() => {
      setLogs(prev => [
        { 
          t: new Date().toLocaleTimeString().split(' ')[0], 
          m: messages[Math.floor(Math.random() * messages.length)],
          c: colors[Math.floor(Math.random() * colors.length)]
        },
        ...prev.slice(0, 4)
      ]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {logs.map((log, i) => (
        <div key={i} style={{ fontSize: '0.75rem', display: 'flex', gap: '10px' }}>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>[{log.t}]</span>
          <span style={{ color: log.c }}>{log.m}</span>
        </div>
      ))}
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', scrollBehavior: 'smooth' }}>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <Navbar />

          {/* SECTION 1: HERO */}
          <section id="hero" style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
              <Canvas gl={{ antialias: true }}>
                <Suspense fallback={null}>
                  <Scene />
                </Suspense>
              </Canvas>
            </div>

            <div style={{
              position: 'relative', zIndex: 1, height: '100%', display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '0 2rem', pointerEvents: 'none'
            }}>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="glitch-text"
                style={{
                  fontFamily: 'Orbitron', fontWeight: 900,
                  fontSize: 'clamp(2.5rem, 8vw, 6rem)', margin: 0,
                  background: 'linear-gradient(135deg, #00D4FF, #8B5CF6, #FF00FF)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(0,212,255,0.5)', 
                  filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))',
                  animation: 'float 6s ease-in-out infinite'
                }}
              >
                AI MULTIVERSE<br />CONTROL CENTER
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                style={{
                  fontFamily: 'Rajdhani', fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                  color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2rem',
                  marginTop: '1.5rem', maxWidth: '800px'
                }}
              >
                Navigate intelligent worlds, neural systems, and autonomous digital dimensions.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
                style={{ display: 'flex', gap: '2rem', marginTop: '3rem', pointerEvents: 'auto' }}
              >
                <button 
                  onClick={() => document.getElementById('core')?.scrollIntoView({ behavior: 'smooth' })}
                  className="neon-border"
                  style={{
                    padding: '1rem 2rem', background: 'linear-gradient(135deg, #00D4FF, #0080AA)',
                    borderRadius: '8px', cursor: 'pointer', fontFamily: 'Orbitron',
                    color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    transition: 'all 0.3s'
                  }}
                >
                  <Zap size={18} /> ENTER CONTROL ROOM
                </button>
                <button 
                   onClick={() => document.getElementById('universe')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    padding: '1rem 2rem', background: 'rgba(139,92,246,0.1)',
                    borderRadius: '8px', cursor: 'pointer', fontFamily: 'Orbitron',
                    color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.5)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    transition: 'all 0.3s'
                  }}
                >
                  <Globe size={18} /> EXPLORE SYSTEMS
                </button>
              </motion.div>
            </div>
          </section>

          {/* SECTION 2: CORE INTERACTION */}
          <section id="core" style={{ 
            minHeight: '100vh', background: 'radial-gradient(ellipse at center, #050d1a 0%, #000000 100%)',
            display: 'flex', alignItems: 'center', padding: '4rem 8%'
          }}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass"
              style={{ width: '40%', padding: '3rem' }}
            >
              <span style={{ color: '#00D4FF', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: 600 }}>CORE SYSTEM v9.7.2</span>
              <h2 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>The Living Intelligence Core</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '2rem' }}>
                A central neural engine connecting agents, memory, vision, prediction, and automation into one adaptive superintelligent interface.
              </p>
              
              <Metric label="Neural Pathways" value="2400000000" suffix="" />
              <Metric label="Processing Speed" value="847" suffix=" TFLOPS" />
              <Metric label="Active Connections" value="128000" suffix="" />
              <Metric label="System Uptime" value="99.99" suffix="%" />
            </motion.div>

            <div style={{ width: '60%', height: '600px' }}>
              <Canvas>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={2} color="#00D4FF" />
                  <GalaxyCore />
                  <OrbitControls enableZoom={false} autoRotate />
                  <EffectComposer>
                    <Bloom intensity={2} />
                  </EffectComposer>
                </Suspense>
              </Canvas>
            </div>
          </section>

          {/* SECTION 3: PLANETS */}
          <section id="universe" style={{ height: '120vh', width: '100vw', background: '#000', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '5rem', left: '8%', zIndex: 10 }}>
                <h2 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '0.5rem' }}>The Project Universe</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Autonomous AI systems orbiting the central intelligence source.</p>
            </div>
            <Canvas camera={{ position: [0, 10, 20], fov: 45 }}>
              <Suspense fallback={null}>
                <UniverseScene />
                <OrbitControls enableZoom={false} />
              </Suspense>
            </Canvas>
          </section>

          {/* SECTION 4: DASHBOARD */}
          <section id="dashboard" style={{ 
            minHeight: '100vh', padding: '100px 8%', background: 'linear-gradient(180deg, #000, #030712, #000)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
              <div>
                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Hologram Dashboard</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>Real-time telemetry and multiverse sync status.</p>
              </div>
              <div className="glass" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Activity size={18} color="#00FF88" />
                <span style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>DATA FLOW STABLE</span>
              </div>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem'
            }}>
              <DashboardCard title="ACTIVE AGENTS" icon={Zap} span={2}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                   <span style={{ fontFamily: 'Orbitron', fontSize: '4rem', color: '#00D4FF', fontWeight: 900 }}>128</span>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00FF88' }}>
                     <ArrowRight size={16} />
                     <span style={{ fontSize: '0.9rem' }}>+12% vs last sync</span>
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'flex-end' }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [10, Math.random() * 30 + 10, 10] }}
                      transition={{ duration: Math.random() * 1 + 1, repeat: Infinity }}
                      style={{ width: '100%', background: '#00D4FF', opacity: 0.5, borderRadius: '2px' }}
                    />
                  ))}
                </div>
              </DashboardCard>

              <DashboardCard title="NEURAL LOAD" icon={Cpu}>
                <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                    <motion.path 
                      initial={{ strokeDasharray: '0, 100' }}
                      whileInView={{ strokeDasharray: '87, 100' }}
                      transition={{ duration: 2 }}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      fill="none" 
                      stroke="url(#grad)" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#00D4FF' }} />
                        <stop offset="100%" style={{ stopColor: '#8B5CF6' }} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 700 }}>87%</div>
                </div>
              </DashboardCard>

              <DashboardCard title="PREDICTION ACCURACY" icon={LineChart}>
                <span style={{ fontSize: '2.5rem', color: '#00FF88', fontWeight: 700 }}>98.7%</span>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '98.7%' }}
                      transition={{ duration: 1.5 }}
                      style={{ height: '100%', background: '#00FF88', boxShadow: '0 0 10px #00FF88' }}
                    />
                </div>
              </DashboardCard>

              <DashboardCard title="THREAT LEVEL" icon={ShieldCheck}>
                <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid #00FF88', borderRadius: '4px', padding: '0.4rem', textAlign: 'center', color: '#00FF88', fontSize: '0.8rem', fontWeight: 600 }}>
                   ◉ LOW THREAT
                </div>
                <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0.5rem auto', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '50%' }}>
                   <div className="radar-sweep" />
                   <div style={{ position: 'absolute', top: '50%', left: '0', width: '100%', height: '1px', background: 'rgba(0,255,136,0.1)' }} />
                   <div style={{ position: 'absolute', left: '50%', top: '0', width: '1px', height: '100%', background: 'rgba(0,255,136,0.1)' }} />
                </div>
              </DashboardCard>

              <DashboardCard title="MULTIVERSE SYNC" icon={LayoutGrid}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                      <Hexagon size={14} color="#00D4FF" />
                    </motion.div>
                    <span style={{ color: '#00D4FF', fontWeight: 700 }}>⬡ ONLINE</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>LAST SYNC: 1.2ms AGO</p>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>REGION: ALPHA-GATEWAY</p>
              </DashboardCard>

              <DashboardCard title="AGENT ACTIVITY FEED" icon={Activity} span={2}>
                  <ActivityFeed />
              </DashboardCard>

              <DashboardCard title="DATA STREAMS" icon={Database}>
                <span style={{ fontSize: '2.5rem', color: '#FFD700', fontWeight: 700 }}>42</span>
                <div style={{ display: 'flex', gap: '2px', height: '30px' }}>
                  {Array.from({ length: 42 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, Math.random() * 20 + 4, 4] }}
                      transition={{ duration: Math.random() * 0.5 + 0.5, repeat: Infinity }}
                      style={{ width: '2px', background: '#FFD700', opacity: 0.6 }}
                    />
                  ))}
                </div>
              </DashboardCard>
            </div>
          </section>

          {/* SECTION 5: OUTRO */}
          <section id="outro" style={{ height: '100vh', width: '100vw', background: '#000', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <Canvas>
                <Suspense fallback={null}>
                  <BlackHole />
                  <EffectComposer>
                     <Bloom intensity={1.5} />
                  </EffectComposer>
                </Suspense>
              </Canvas>
            </div>

            <div style={{
              position: 'relative', zIndex: 1, height: '100%', display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '0 2rem', pointerEvents: 'none'
            }}>
              <motion.h2 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                style={{
                  fontFamily: 'Orbitron', fontWeight: 900,
                  fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#fff',
                  textShadow: '0 0 20px rgba(255,255,255,0.5)', marginBottom: '1rem'
                }}
              >
                THE FUTURE INTERFACE IS ALIVE
              </motion.h2>
              <p style={{ maxWidth: '600px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '3rem' }}>
                A cinematic AI-powered digital control system built for the next era of human-computer interaction.
              </p>

              <button 
                className="neon-border"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  padding: '1.2rem 3rem', background: '#FF00FF22', border: '1px solid #FF00FF',
                  borderRadius: '12px', color: '#fff', fontFamily: 'Orbitron', fontWeight: 600,
                  cursor: 'pointer', pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '1rem'
                }}
              >
                <RefreshCcw size={20} /> RESTART EXPERIENCE
              </button>
            </div>

            <footer style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '2rem 8%',
              boxSizing: 'border-box', borderTop: '1px solid rgba(0,212,255,0.1)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontFamily: 'Rajdhani', color: 'rgba(0,212,255,0.5)', fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <span style={{ cursor: 'pointer' }}>SYSTEMS</span>
                <span style={{ cursor: 'pointer' }}>NEURAL CORE</span>
                <span style={{ cursor: 'pointer' }}>DASHBOARD</span>
                <span style={{ cursor: 'pointer' }}>GITHUB</span>
              </div>
              <div>© 2024 AI MULTIVERSE · BUILT WITH GOOGLE AI STUDIO</div>
            </footer>
          </section>
        </>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
