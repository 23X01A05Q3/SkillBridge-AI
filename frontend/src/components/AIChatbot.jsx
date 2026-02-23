import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, ChevronDown, Trash2 } from 'lucide-react';
import axios from 'axios';

// Use the Render backend URL directly in production, proxy in development
const API_BASE = import.meta.env.PROD
    ? 'https://skillbridge-api.onrender.com'
    : '/api';

const springTransition = { type: "spring", stiffness: 200, damping: 25 };

const QUICK_PROMPTS = [
    "📝 Resume tips",
    "🎤 Interview prep",
    "🐍 Learn Python",
    "💰 Salary insights",
    "🗺️ Career roadmap",
];

// Parse markdown-like formatting in messages
const formatMessage = (text) => {
    if (!text) return '';

    // Split into lines
    const lines = text.split('\n');
    const elements = [];

    lines.forEach((line, i) => {
        let processed = line;

        // Bold: **text**
        processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Bullet points
        if (processed.startsWith('• ') || processed.startsWith('- ')) {
            elements.push(
                <div key={i} style={{ paddingLeft: '8px', display: 'flex', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ color: '#3b82f6', flexShrink: 0 }}>•</span>
                    <span dangerouslySetInnerHTML={{ __html: processed.substring(2) }} />
                </div>
            );
            return;
        }

        // Numbered lists
        const numberedMatch = processed.match(/^(\d+)\.\s(.+)/);
        if (numberedMatch) {
            elements.push(
                <div key={i} style={{ paddingLeft: '8px', display: 'flex', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ color: '#3b82f6', fontWeight: 700, flexShrink: 0 }}>{numberedMatch[1]}.</span>
                    <span dangerouslySetInnerHTML={{ __html: numberedMatch[2] }} />
                </div>
            );
            return;
        }

        // Empty lines = paragraph break
        if (processed.trim() === '') {
            elements.push(<div key={i} style={{ height: '8px' }} />);
            return;
        }

        elements.push(
            <div key={i} dangerouslySetInnerHTML={{ __html: processed }} style={{ marginBottom: '2px' }} />
        );
    });

    return elements;
};

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hey! 👋 I'm the **SkillBridge AI Assistant**. Ask me anything about careers, tech skills, resume tips, interview prep, or any question you have!",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = (behavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen, messages]);

    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };

    const sendMessage = async (text = null) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        const userMsg = { role: 'user', content: messageText, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const response = await axios.post(`${API_BASE}/chat`, {
                message: messageText,
                history: history,
            });

            const aiMsg = {
                role: 'assistant',
                content: response.data.response,
                source: response.data.source,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            const errorMsg = {
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🔄",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([{
            role: 'assistant',
            content: "Chat cleared! 🧹 How can I help you today?",
            timestamp: new Date(),
        }]);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        style={{
                            position: 'fixed',
                            bottom: '28px',
                            right: '28px',
                            width: '64px',
                            height: '64px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 32px rgba(37, 99, 235, 0.4), 0 0 0 3px rgba(37, 99, 235, 0.1)',
                            zIndex: 9999,
                            padding: 0,
                        }}
                    >
                        <MessageCircle style={{ width: '28px', height: '28px', color: 'white' }} />

                        {/* Pulse ring */}
                        <motion.div
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{
                                position: 'absolute',
                                inset: '-4px',
                                borderRadius: '24px',
                                border: '2px solid rgba(59, 130, 246, 0.5)',
                                pointerEvents: 'none',
                            }}
                        />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={springTransition}
                        style={{
                            position: 'fixed',
                            bottom: '28px',
                            right: '28px',
                            width: '420px',
                            maxWidth: 'calc(100vw - 32px)',
                            height: '600px',
                            maxHeight: 'calc(100vh - 60px)',
                            borderRadius: '24px',
                            background: 'rgba(15, 23, 42, 0.95)',
                            backdropFilter: 'blur(40px)',
                            WebkitBackdropFilter: 'blur(40px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            zIndex: 10000,
                            fontFamily: 'Outfit, sans-serif',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.08) 100%)',
                            flexShrink: 0,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                                    }}
                                >
                                    <Sparkles style={{ width: '20px', height: '20px', color: 'white' }} />
                                </motion.div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                                        SkillBridge AI
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'rgba(148,163,184,0.6)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
                                        Online • Ask anything
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={clearChat}
                                    title="Clear chat"
                                    style={{
                                        width: '32px', height: '32px', borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        padding: 0,
                                    }}
                                >
                                    <Trash2 style={{ width: '14px', height: '14px', color: 'rgba(148,163,184,0.6)' }} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        width: '32px', height: '32px', borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        padding: 0,
                                    }}
                                >
                                    <X style={{ width: '16px', height: '16px', color: 'rgba(148,163,184,0.6)' }} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={chatContainerRef}
                            onScroll={handleScroll}
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                scrollBehavior: 'smooth',
                            }}
                        >
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ ...springTransition, delay: index === messages.length - 1 ? 0.1 : 0 }}
                                    style={{
                                        display: 'flex',
                                        gap: '10px',
                                        alignItems: 'flex-start',
                                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                                    }}
                                >
                                    {/* Avatar */}
                                    <div style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '10px',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: msg.role === 'user'
                                            ? 'linear-gradient(135deg, #059669, #10b981)'
                                            : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                                        boxShadow: msg.role === 'user'
                                            ? '0 2px 8px rgba(5,150,105,0.3)'
                                            : '0 2px 8px rgba(37,99,235,0.3)',
                                    }}>
                                        {msg.role === 'user'
                                            ? <User style={{ width: '14px', height: '14px', color: 'white' }} />
                                            : <Bot style={{ width: '14px', height: '14px', color: 'white' }} />
                                        }
                                    </div>

                                    {/* Message Bubble */}
                                    <div style={{
                                        maxWidth: '80%',
                                        padding: '12px 16px',
                                        borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                                        background: msg.role === 'user'
                                            ? 'linear-gradient(135deg, rgba(5,150,105,0.15), rgba(16,185,129,0.1))'
                                            : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${msg.role === 'user' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)'}`,
                                        color: '#e2e8f0',
                                        fontSize: '13.5px',
                                        lineHeight: 1.6,
                                        fontWeight: 400,
                                        wordBreak: 'break-word',
                                    }}>
                                        {formatMessage(msg.content)}
                                        <div style={{
                                            fontSize: '10px',
                                            color: 'rgba(148,163,184,0.3)',
                                            marginTop: '6px',
                                            textAlign: msg.role === 'user' ? 'right' : 'left',
                                        }}>
                                            {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        display: 'flex',
                                        gap: '10px',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <div style={{
                                        width: '30px', height: '30px', borderRadius: '10px', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                                    }}>
                                        <Bot style={{ width: '14px', height: '14px', color: 'white' }} />
                                    </div>
                                    <div style={{
                                        padding: '12px 20px',
                                        borderRadius: '4px 16px 16px 16px',
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        display: 'flex',
                                        gap: '6px',
                                        alignItems: 'center',
                                    }}>
                                        <motion.div
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                                            style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6' }}
                                        />
                                        <motion.div
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                                            style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#7c3aed' }}
                                        />
                                        <motion.div
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                                            style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ec4899' }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Scroll to bottom button */}
                        <AnimatePresence>
                            {showScrollBtn && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    onClick={() => scrollToBottom()}
                                    style={{
                                        position: 'absolute',
                                        bottom: '140px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        background: 'rgba(37,99,235,0.9)', border: 'none',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
                                        padding: 0,
                                    }}
                                >
                                    <ChevronDown style={{ width: '18px', height: '18px', color: 'white' }} />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Quick Prompts */}
                        {messages.length <= 1 && (
                            <div style={{
                                padding: '0 16px 8px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '6px',
                                flexShrink: 0,
                            }}>
                                {QUICK_PROMPTS.map((prompt, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.05, background: 'rgba(59,130,246,0.15)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => sendMessage(prompt)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '10px',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            color: 'rgba(148,163,184,0.8)',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            fontFamily: 'Outfit, sans-serif',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {prompt}
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div style={{
                            padding: '12px 16px 16px',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            background: 'rgba(0,0,0,0.2)',
                            flexShrink: 0,
                        }}>
                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                alignItems: 'flex-end',
                            }}>
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask me anything..."
                                    rows={1}
                                    style={{
                                        flex: 1,
                                        resize: 'none',
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '14px',
                                        padding: '12px 16px',
                                        color: '#f1f5f9',
                                        fontSize: '14px',
                                        outline: 'none',
                                        fontFamily: 'Outfit, sans-serif',
                                        lineHeight: 1.5,
                                        maxHeight: '100px',
                                        overflow: 'auto',
                                        transition: 'border-color 0.3s',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'rgba(59,130,246,0.4)'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => sendMessage()}
                                    disabled={isLoading || !input.trim()}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '14px',
                                        background: input.trim() && !isLoading
                                            ? 'linear-gradient(135deg, #2563eb, #7c3aed)'
                                            : 'rgba(255,255,255,0.05)',
                                        border: 'none',
                                        cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        boxShadow: input.trim() && !isLoading
                                            ? '0 4px 12px rgba(37,99,235,0.3)'
                                            : 'none',
                                        transition: 'all 0.3s',
                                        padding: 0,
                                    }}
                                >
                                    {isLoading
                                        ? <Loader2 style={{ width: '18px', height: '18px', color: 'rgba(148,163,184,0.5)', animation: 'spin 1s linear infinite' }} />
                                        : <Send style={{ width: '18px', height: '18px', color: input.trim() ? 'white' : 'rgba(148,163,184,0.3)' }} />
                                    }
                                </motion.button>
                            </div>
                            <div style={{
                                textAlign: 'center',
                                marginTop: '8px',
                                fontSize: '10px',
                                color: 'rgba(148,163,184,0.25)',
                                fontWeight: 600,
                                letterSpacing: '0.05em',
                            }}>
                                Powered by SkillBridge AI
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                div::-webkit-scrollbar {
                    width: 4px;
                }
                div::-webkit-scrollbar-track {
                    background: transparent;
                }
                div::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                }
                div::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.2);
                }
                textarea::-webkit-scrollbar {
                    width: 3px;
                }
                textarea::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 3px;
                }
            `}</style>
        </>
    );
};

export default AIChatbot;
