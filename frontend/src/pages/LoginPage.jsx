import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft, ShieldCheck, Heart, Sparkles, Eye, EyeOff, BrainCircuit, Fingerprint } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 15
};

const floatAnimation = {
    y: [0, -8, 0],
    transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
    }
};

// Animated floating orbs for the background
const FloatingOrb = ({ size, color, delay, x, y }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0.15, 0.3, 0.15],
            scale: [1, 1.2, 1],
            x: [0, 20, -10, 0],
            y: [0, -15, 10, 0],
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
        style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            background: color,
            filter: `blur(${parseInt(size) / 2}px)`,
            left: x,
            top: y,
            pointerEvents: 'none',
            zIndex: 0,
        }}
    />
);

// Animated grid lines
const GridPattern = () => (
    <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 80%)',
        pointerEvents: 'none',
        zIndex: 0,
    }} />
);

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Auth attempt for:", email);
        navigate('/');
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6 relative"
            style={{
                fontFamily: 'Outfit, sans-serif',
                background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1321 25%, #111827 50%, #0f172a 75%, #020617 100%)',
                overflow: 'hidden',
            }}
        >
            {/* Animated Background Elements */}
            <FloatingOrb size="300px" color="radial-gradient(circle, rgba(59,130,246,0.3), transparent)" delay={0} x="10%" y="20%" />
            <FloatingOrb size="200px" color="radial-gradient(circle, rgba(147,51,234,0.25), transparent)" delay={2} x="70%" y="60%" />
            <FloatingOrb size="250px" color="radial-gradient(circle, rgba(16,185,129,0.15), transparent)" delay={4} x="80%" y="10%" />
            <FloatingOrb size="180px" color="radial-gradient(circle, rgba(244,63,94,0.12), transparent)" delay={1} x="5%" y="70%" />
            <GridPattern />

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.1 }}
                style={{
                    borderRadius: '32px',
                    maxWidth: '440px',
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
                    position: 'relative',
                    zIndex: 10,
                    overflow: 'hidden',
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Top accent gradient line */}
                <motion.div
                    style={{
                        height: '3px',
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
                        backgroundSize: '200% 100%',
                    }}
                    animate={{
                        backgroundPosition: ['0% 0%', '200% 0%'],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />

                {/* Header */}
                <div style={{
                    padding: '20px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(255,255,255,0.02)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <motion.div animate={floatAnimation}>
                            <Fingerprint style={{ width: '18px', height: '18px', color: '#3b82f6' }} />
                        </motion.div>
                        <span style={{
                            fontWeight: 800,
                            fontSize: '11px',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'rgba(148, 163, 184, 0.8)',
                            fontFamily: "'JetBrains Mono', monospace",
                        }}>
                            Secure Portal
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '6px',
                    }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px rgba(59,130,246,0.5)' }} />
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(148,163,184,0.3)' }} />
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(148,163,184,0.15)' }} />
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '40px 36px 32px' }}>
                    <Link to="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: 'rgba(148,163,184,0.6)',
                        marginBottom: '32px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        textDecoration: 'none',
                        transition: 'color 0.3s',
                    }}
                        onMouseEnter={e => e.target.style.color = '#3b82f6'}
                        onMouseLeave={e => e.target.style.color = 'rgba(148,163,184,0.6)'}
                    >
                        <ArrowLeft style={{ width: '14px', height: '14px', marginRight: '8px' }} />
                        Back to Home
                    </Link>

                    {/* Logo + Title */}
                    <div style={{ marginBottom: '40px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(147,51,234,0.15))',
                                    border: '1px solid rgba(59,130,246,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <BrainCircuit style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                            </motion.div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                fontSize: '2.8rem',
                                fontWeight: 900,
                                lineHeight: 1,
                                marginBottom: '12px',
                                letterSpacing: '-0.03em',
                                background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 50%, #3b82f6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Welcome<br />Back
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            style={{
                                color: 'rgba(148, 163, 184, 0.7)',
                                fontSize: '0.95rem',
                                lineHeight: 1.6,
                            }}
                        >
                            Sign in to access your career insights & AI-powered skill analysis.
                        </motion.p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Email Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <label style={{
                                display: 'block',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: focusedField === 'email' ? '#3b82f6' : 'rgba(148,163,184,0.6)',
                                marginBottom: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                transition: 'color 0.3s',
                            }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '18px',
                                    height: '18px',
                                    color: focusedField === 'email' ? '#3b82f6' : 'rgba(148,163,184,0.4)',
                                    transition: 'color 0.3s',
                                }} />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    style={{
                                        width: '100%',
                                        background: focusedField === 'email' ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${focusedField === 'email' ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                        borderRadius: '16px',
                                        padding: '16px 16px 16px 48px',
                                        fontSize: '0.9rem',
                                        color: '#f1f5f9',
                                        outline: 'none',
                                        transition: 'all 0.3s ease',
                                        fontFamily: 'Outfit, sans-serif',
                                        boxShadow: focusedField === 'email' ? '0 0 20px rgba(59,130,246,0.1)' : 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <label style={{
                                display: 'block',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: focusedField === 'password' ? '#3b82f6' : 'rgba(148,163,184,0.6)',
                                marginBottom: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                transition: 'color 0.3s',
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '18px',
                                    height: '18px',
                                    color: focusedField === 'password' ? '#3b82f6' : 'rgba(148,163,184,0.4)',
                                    transition: 'color 0.3s',
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    style={{
                                        width: '100%',
                                        background: focusedField === 'password' ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${focusedField === 'password' ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                        borderRadius: '16px',
                                        padding: '16px 48px 16px 48px',
                                        fontSize: '0.9rem',
                                        color: '#f1f5f9',
                                        outline: 'none',
                                        transition: 'all 0.3s ease',
                                        fontFamily: 'Outfit, sans-serif',
                                        boxShadow: focusedField === 'password' ? '0 0 20px rgba(59,130,246,0.1)' : 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {showPassword ?
                                        <EyeOff style={{ width: '18px', height: '18px', color: 'rgba(148,163,184,0.5)' }} /> :
                                        <Eye style={{ width: '18px', height: '18px', color: 'rgba(148,163,184,0.5)' }} />
                                    }
                                </button>
                            </div>
                        </motion.div>

                        {/* Remember me + Forgot */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '12px',
                                fontWeight: 600,
                            }}
                        >
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'rgba(148,163,184,0.6)',
                                cursor: 'pointer',
                                gap: '8px',
                            }}>
                                <input
                                    type="checkbox"
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        accentColor: '#3b82f6',
                                    }}
                                />
                                Remember me
                            </label>
                            <a href="#" style={{
                                color: '#3b82f6',
                                textDecoration: 'none',
                                transition: 'color 0.3s',
                            }}
                                onMouseEnter={e => e.target.style.color = '#60a5fa'}
                                onMouseLeave={e => e.target.style.color = '#3b82f6'}
                            >
                                Forgot Password?
                            </a>
                        </motion.div>

                        {/* Sign In Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: '0 20px 40px -8px rgba(59,130,246,0.4), 0 0 20px rgba(59,130,246,0.2)',
                            }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            style={{
                                marginTop: '8px',
                                height: '58px',
                                borderRadius: '16px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #6366f1 100%)',
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: 900,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                boxShadow: '0 10px 30px -5px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                                fontFamily: 'Outfit, sans-serif',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <Sparkles style={{ width: '18px', height: '18px' }} />
                            Sign In
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        margin: '28px 0',
                    }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(148,163,184,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            New here?
                        </span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                    </div>

                    {/* Create Account */}
                    <motion.a
                        href="#"
                        whileHover={{ scale: 1.02, borderColor: 'rgba(59,130,246,0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            height: '50px',
                            borderRadius: '14px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(255,255,255,0.02)',
                            color: 'rgba(148,163,184,0.8)',
                            fontSize: '12px',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            fontFamily: 'Outfit, sans-serif',
                        }}
                    >
                        <LogIn style={{ width: '16px', height: '16px' }} />
                        Create an Account
                    </motion.a>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px 36px',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    background: 'rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                }}>
                    <Heart style={{ width: '12px', height: '12px', color: 'rgba(244,63,94,0.5)' }} />
                    <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(148,163,184,0.35)',
                    }}>
                        Built for your career success
                    </span>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
