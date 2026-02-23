import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UploadSection from './components/UploadSection';
import Dashboard from './components/Dashboard';
import LearningRoadmap from './components/LearningRoadmap';
import VisualBackground from './components/VisualBackground';
import LoginPage from './pages/LoginPage';
import AIChatbot from './components/AIChatbot';
import { Sparkles, BrainCircuit, Terminal, Cpu, Info, Zap, Sun, Moon, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 15,
    mass: 1
};

const MainApp = ({ analysisResult, setAnalysisResult, theme, toggleTheme }) => {
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            document.documentElement.style.setProperty('--mouse-x', `${x}%`);
            document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen container font-mono flex flex-col relative transition-all duration-300" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {/* Header / Nav */}
            <nav className="flex justify-between items-center mb-16 px-6 py-4 glass bg-slate-900 border-slate-800" style={{ borderRadius: '0 0 24px 24px' }}>
                <Link to="/" className="flex items-center gap-3 text-xl font-black no-underline group text-white">
                    <BrainCircuit className="text-blue-600 w-10 h-10 group-hover:rotate-90 transition-transform" />
                    <span className="tracking-tighter uppercase font-black text-2xl" style={{ letterSpacing: '-0.04rem' }}>SkillBridge AI</span>
                </Link>
                <div className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest">
                    <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors no-underline">Analyzer</Link>
                    <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors no-underline">Career Path</a>
                </div>
                <div className="flex items-center gap-6">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        className="p-2 rounded-xl bg-slate-800/10 border border-slate-700/20 text-slate-600 hover:text-blue-600 transition-all flex items-center justify-center p-0 m-0 border-0 bg-transparent"
                        title={theme === 'light' ? 'Switch to Midnight Mode' : 'Switch to White Shade Mode'}
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
                    </motion.button>
                    <Link to="/login" className="btn-nav-auth no-underline group shadow-sm">
                        <LogIn className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                        <span>Sign In</span>
                    </Link>
                </div>
            </nav>

            <main className="flex-1">
                <AnimatePresence mode="wait">
                    {!analysisResult ? (
                        <motion.div
                            key="upload-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={springTransition}
                            className="flex flex-col items-center"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ ...springTransition, delay: 0.2 }}
                                className="mb-8 p-3 px-6 bg-blue-500/5 border border-blue-500/20 rounded flex items-center gap-3 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] font-mono shadow-lg"
                                style={{ borderRadius: '100px' }}
                            >
                                <Zap className="w-4 h-4" />
                                System Optimized & Ready
                            </motion.div>
                            <h1 className="text-7xl font-black text-center mb-8 max-w-5xl tracking-tighter leading-none text-white">
                                Empower Your <span className="gradient-text">Career</span>. <br />
                                Bridge Your <span className="gradient-text">Skills</span>.
                            </h1>
                            <p className="text-slate-400 text-center mb-16 text-lg max-w-2xl leading-relaxed px-4 opacity-90">
                                Our AI-powered engine analyzes your resume and maps your unique profile against market-leading job requirements to guide your professional growth.
                            </p>
                            <UploadSection onAnalysisComplete={setAnalysisResult} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={springTransition}
                            className="max-w-6xl mx-auto pb-20"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 px-4">
                                <div>
                                    <div className="text-xs text-blue-400 font-bold uppercase tracking-[0.2em] mb-3 font-mono">Personalized Career Report</div>
                                    <h2 className="text-5xl font-black text-white leading-none tracking-tighter">Target: {analysisResult.role}</h2>
                                    <div className="flex gap-6 mt-6">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                                            <Info className="w-3.5 h-3.5" /> ID: {Math.random().toString(36).substring(7).toUpperCase()}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div> High Alignment Potential
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setAnalysisResult(null)}
                                    className="btn-secondary px-8 py-3.5 text-xs font-black uppercase tracking-widest border-0"
                                    style={{ borderRadius: '14px' }}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    New Analysis
                                </button>
                            </div>

                            <Dashboard data={analysisResult} />
                            <LearningRoadmap recommendations={analysisResult.recommendations} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <footer className="py-16 border-t border-slate-800 text-center text-slate-600 text-[10px] font-mono uppercase tracking-[0.2em]">
                <p>© 2026 SkillBridge AI // Intelligent Career Assistant // Built for Success</p>
            </footer>
        </div>
    );
}

function App() {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        // Apply theme to body
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [theme]);

    return (
        <BrowserRouter>
            <div className="relative">
                <VisualBackground />
                <Routes>
                    <Route path="/" element={<MainApp analysisResult={analysisResult} setAnalysisResult={setAnalysisResult} theme={theme} toggleTheme={toggleTheme} />} />
                    <Route path="/login" element={<LoginPage theme={theme} toggleTheme={toggleTheme} />} />
                </Routes>
                <AIChatbot />
            </div>
        </BrowserRouter>
    );
}

export default App;
