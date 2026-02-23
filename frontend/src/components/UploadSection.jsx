import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Search, ArrowRight, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 15
};

// Use the Render backend URL directly in production, proxy in development
const API_BASE = import.meta.env.PROD
    ? 'https://skillbridge-api.onrender.com'
    : '/api';

const UploadSection = ({ onAnalysisComplete }) => {
    const [file, setFile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [jobsLoading, setJobsLoading] = useState(true);
    const [jobsError, setJobsError] = useState(false);

    const fetchJobs = async (retryCount = 0) => {
        const MAX_RETRIES = 3;
        setJobsLoading(true);
        setJobsError(false);
        try {
            const response = await axios.get(`${API_BASE}/jobs`, { timeout: 30000 });
            setJobs(response.data);
            if (response.data.length > 0) setSelectedJob(response.data[0].id);
            setJobsLoading(false);
        } catch (err) {
            console.error(`Error fetching jobs (attempt ${retryCount + 1}/${MAX_RETRIES})`, err);
            if (retryCount < MAX_RETRIES - 1) {
                // Wait 3 seconds before retrying (Render cold-start can take time)
                setTimeout(() => fetchJobs(retryCount + 1), 3000);
            } else {
                setJobsLoading(false);
                setJobsError(true);
            }
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file || !selectedJob) {
            setError('Please select a file and a job role');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobId', selectedJob);

        try {
            const response = await axios.post(`${API_BASE}/analyze`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onAnalysisComplete(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to analyze resume');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springTransition}
            className="glass max-w-2xl w-full mx-auto mt-10 overflow-hidden"
            style={{ borderRadius: '28px', fontFamily: 'Outfit, sans-serif' }}
        >
            <div className="terminal-header h-14 px-8 flex items-center">
                <div className="flex gap-2 relative">
                    <div className="w-3 h-3 rounded-full bg-blue-600 icon-glow-blue animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300 opacity-30"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300 opacity-10"></div>
                </div>
                <span className="ml-4 font-mono text-sm tracking-[0.2em] text-slate-300 font-bold uppercase">Career Insight Engine v2.0</span>
            </div>

            <div className="p-10 pt-12">
                <h2 className="text-4xl font-black mb-4 gradient-text text-center tracking-tighter uppercase">
                    Analyze Your Potential
                </h2>
                <p className="text-slate-400 text-center mb-12 text-xl leading-relaxed max-w-2xl mx-auto opacity-90">
                    Select your target role and upload your resume to see how well you match industry standards.
                </p>

                <div className="flex flex-col gap-10">
                    <motion.div whileHover={{ y: -2 }} transition={springTransition}>
                        <label className="block text-lg font-black text-slate-300 mb-5 uppercase tracking-[0.2em] text-center">Step 1: Choose Your Target Role</label>
                        <select
                            className="w-full p-6 text-xl outline-none font-bold cursor-pointer"
                            style={{
                                borderRadius: '18px',
                                boxShadow: 'var(--shadow-primary)',
                                border: '1px solid var(--border-primary)',
                                backgroundColor: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                position: 'relative',
                                zIndex: 20,
                                paddingRight: '3rem',
                            }}
                            value={selectedJob}
                            onChange={(e) => setSelectedJob(e.target.value)}
                        >
                            {jobsLoading && (
                                <option value="" disabled>Loading roles...</option>
                            )}
                            {!jobsLoading && jobsError && (
                                <option value="" disabled>Failed to load roles</option>
                            )}
                            {!jobsLoading && !jobsError && jobs.length === 0 && (
                                <option value="" disabled>No roles available</option>
                            )}
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>{job.role}</option>
                            ))}
                        </select>
                        {jobsLoading && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px', color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>
                                <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#3b82f6' }} />
                                <span>Waking up the server... This may take up to 30 seconds on first visit.</span>
                            </div>
                        )}
                        {jobsError && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '12px' }}
                            >
                                <span style={{ color: '#f87171', fontSize: '13px', fontWeight: 600 }}>Server is starting up.</span>
                                <button
                                    onClick={() => fetchJobs()}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '6px 16px', borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                                        border: 'none', color: 'white', fontSize: '12px',
                                        fontWeight: 700, cursor: 'pointer',
                                        fontFamily: 'Outfit, sans-serif',
                                    }}
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Retry
                                </button>
                            </motion.div>
                        )}
                    </motion.div>

                    <div className="relative">
                        <label className="block text-lg font-black text-slate-300 mb-5 uppercase tracking-[0.2em] text-center">Step 2: Upload Your Resume</label>
                        <motion.div
                            whileHover={{ scale: 1.01, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.03)' }}
                            whileTap={{ scale: 0.99 }}
                            transition={springTransition}
                            className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${file ? 'file-card border-blue-500/50' : 'border-slate-700/50 bg-slate-900/10'}`}
                            onClick={() => document.getElementById('resume-upload').click()}
                        >
                            <input
                                type="file"
                                id="resume-upload"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf, .txt"
                            />
                            {file ? (
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -10 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={springTransition}
                                        className="relative mb-6"
                                    >
                                        <div className="bg-blue-600/5 p-6 rounded-2xl border border-blue-500/20 icon-glow-blue scale-110 shadow-sm">
                                            <FileText className="w-16 h-16 text-blue-600 stroke-[1.5]" />
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="absolute -bottom-2 -right-2"
                                        >
                                            <div className="bg-emerald-500 rounded-full p-2 border-4 border-[#020617] shadow-xl">
                                                <CheckCircle className="w-5 h-5 text-white" />
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                    <span className="text-white font-black text-2xl tracking-tight mb-3">
                                        {file.name}
                                    </span>
                                    <span className="text-emerald-400 text-sm font-bold uppercase tracking-[0.2em] bg-emerald-500/10 px-5 py-2 rounded-full border border-emerald-500/20">
                                        Ready for analysis
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-4">
                                    <div className="relative mb-8">
                                        <div className="scanning-node flex items-center justify-center">
                                            <Upload className="w-8 h-8 text-blue-600 icon-glow-blue" />
                                        </div>
                                        <div className="absolute -inset-4 bg-blue-100/50 blur-xl rounded-full -z-10"></div>
                                    </div>
                                    <h3 className="text-white font-black text-2xl mb-3 tracking-tight">Drop your resume here</h3>
                                    <span className="text-slate-500 text-lg font-bold uppercase tracking-widest opacity-60">
                                        Supports PDF and TXT files
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 text-red-500 bg-red-500/5 p-5 border border-red-500/20 rounded-2xl text-sm font-bold"
                        >
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <div className="flex flex-col gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={springTransition}
                            onClick={handleUpload}
                            disabled={loading || !file}
                            style={{ height: '70px' }}
                            className={`btn-primary w-full shadow-2xl ${!file ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span className="tracking-[0.2em] font-black">Analyzing Match...</span>
                                </>
                            ) : (
                                <>
                                    <span className="tracking-[0.2em] font-black">Analyze My Resume</span>
                                    <ArrowRight className="w-6 h-6" />
                                </>
                            )}
                        </motion.button>

                        {!file && (
                            <p className="text-[10px] text-slate-500 text-center font-bold uppercase tracking-widest">
                                Please upload a resume to proceed
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default UploadSection;
