// Client-side resume analysis engine
// Performs skill extraction, matching, and recommendations entirely in the browser

// ── Full Job Data ──────────────────────────────────────────────
export const JOBS_DATA = [
    {
        id: 1, role: "Python Developer",
        description: "Develop and maintain web applications using Python and Flask. Experience with SQL and Git is required. Familiarity with cloud services and testing frameworks is a plus.",
        skills: ["Python", "Flask", "SQL", "Git", "REST API", "Docker", "AWS", "Unit Testing", "FastAPI", "PostgreSQL", "Redshift", "Redis", "Celery", "Asyncio"]
    },
    {
        id: 2, role: "Frontend Developer",
        description: "Create interactive user interfaces with React and Javascript. Knowledge of CSS, Tailwind, and modern state management is essential.",
        skills: ["React", "Javascript", "CSS", "Tailwind", "Vite", "HTML", "TypeScript", "Redux", "Framer Motion", "Jest", "Cypress", "Next.js", "GraphQL", "Responsive Design"]
    },
    {
        id: 3, role: "Data Scientist",
        description: "Analyze large datasets and build machine learning models using Scikit-learn and Pandas. Proficiency in NLP, Deep Learning, and data visualization is required.",
        skills: ["Python", "Machine Learning", "Scikit-learn", "Pandas", "Numpy", "NLP", "SQL", "PyTorch", "TensorFlow", "Matplotlib", "Seaborn", "Statistical Modeling", "Big Data", "Spark"]
    },
    {
        id: 4, role: "DevOps Engineer",
        description: "Automate deployment pipelines and manage cloud infrastructure using AWS, Docker, and Kubernetes. Strong focus on security, scalability, and monitoring.",
        skills: ["AWS", "Docker", "Kubernetes", "Linux", "Jenkins", "Terraform", "Ansible", "CI/CD", "Monitoring", "Prometheus", "Grafana", "Nginx", "CloudFormation"]
    },
    {
        id: 5, role: "Backend Engineer",
        description: "Build scalable backend systems using Java and Spring Boot. Experience with microservices, distributed systems, and relational databases like PostgreSQL is required.",
        skills: ["Java", "Spring Boot", "Microservices", "PostgreSQL", "Redis", "Git", "Unit Testing", "JUnit", "Kafka", "Docker", "REST API", "Hibernate", "Security"]
    },
    {
        id: 6, role: "Full Stack Developer",
        description: "Develop end-to-end web applications using the MERN stack. Proficient in React for the frontend and Node.js/Express for the backend.",
        skills: ["React", "Node.js", "Express", "MongoDB", "Javascript", "HTML", "CSS", "Redux", "REST API", "Git", "Jest", "TypeScript"]
    },
    {
        id: 7, role: "Mobile Developer",
        description: "Create cross-platform mobile applications using Flutter and Dart. Experience with mobile UI/UX, state management with Bloc or Provider, and integrating with RESTful APIs.",
        skills: ["Flutter", "Dart", "Mobile App Development", "UI/UX", "Firebase", "REST API", "Git", "SQLite", "Widget Testing", "Async Programming"]
    },
    {
        id: 8, role: "Cybersecurity Analyst",
        description: "Monitor and protect organization's networks and systems from security breaches. Experience with incident response, penetration testing, and knowledge of security protocols.",
        skills: ["Cybersecurity", "Network Security", "Penetration Testing", "Incident Response", "Firewalls", "Wireshark", "Metasploit", "SIEM", "Compliance", "Linux", "Python", "Ethical Hacking"]
    },
    {
        id: 9, role: "UI/UX Designer",
        description: "Design user-centered interfaces and experiences for web and mobile. Proficient in Figma, prototyping, and accessibility standards.",
        skills: ["UI/UX", "Figma", "Prototyping", "Wireframing", "User Research", "Accessibility", "Adobe XD", "Visual Design", "Interaction Design", "Design Systems"]
    }
];

// ── Learning Resources ─────────────────────────────────────────
const LEARNING_RESOURCES = {
    "python": { topics: ["Functional Programming", "Decorators", "Asynchronous Programming"], projects: ["Web Scraper", "Data Analysis Dashboard"], certifications: ["PCEP - Certified Entry-Level Python Programmer"] },
    "react": { topics: ["Hooks (useEffect, useContext)", "Redux Toolkit", "Next.js"], projects: ["E-commerce App", "Task Management Dashboard"], certifications: ["Meta Front-End Developer Professional Certificate"] },
    "machine learning": { topics: ["Deep Learning basics", "Neural Networks", "NLP", "Reinforcement Learning"], projects: ["Image Classifier", "Sentiment Analysis System"], certifications: ["Stanford Machine Learning Specialization", "TensorFlow Developer Certificate"] },
    "sql": { topics: ["Window Functions", "Query Optimization", "Normalization"], projects: ["Inventory Management Database", "Sales Analytics Tool"], certifications: ["Google Data Analytics Professional Certificate"] },
    "java": { topics: ["Functional Interfaces", "Streams API", "Multithreading", "JVM Internals"], projects: ["Hospital Management System", "Financial Transaction Processor"], certifications: ["Oracle Certified Professional: Java SE Developer"] },
    "spring boot": { topics: ["Spring Security", "Microservices Architecture", "Spring Data JPA", "Spring Cloud"], projects: ["Mini E-commerce API", "Microservices-based Blogging Platform"], certifications: ["Spring Certified Professional"] },
    "node.js": { topics: ["Event Loop", "Streams", "Middleware Design", "Security Best Practices"], projects: ["Real-time Chat App", "Custom CLI Web Scraper"], certifications: ["OpenJS Node.js Application Developer (JSNAD)"] },
    "express": { topics: ["Routing", "Error Handling", "Template Engines", "RESTful API Design"], projects: ["REST API for Task Management", "Authentication Middleware Suite"], certifications: ["Meta Back-End Developer Professional Certificate"] },
    "mongodb": { topics: ["Aggregation Framework", "Indexing", "Data Modeling", "Sharding"], projects: ["Social Media Data Model", "Content Management System Backend"], certifications: ["MongoDB Certified Developer Associate"] },
    "flutter": { topics: ["State Management (Bloc/Provider)", "Animations", "Offline Storage", "Custom Painters"], projects: ["Expense Tracker App", "Weather App with Custom UI"], certifications: ["Google Flutter Application Development Certification"] },
    "cybersecurity": { topics: ["Network Security", "Cryptography", "Penetration Testing", "Threat Intel"], projects: ["Basic Port Scanner", "Vulnerability Assessment Lab"], certifications: ["CompTIA Security+", "Certified Ethical Hacker (CEH)"] },
    "figma": { topics: ["Auto Layout", "Components & Variants", "Prototyping", "Design Systems"], projects: ["E-commerce App Design", "Portfolio High-fidelity Mockup"], certifications: ["Google UX Design Professional Certificate"] },
    "docker": { topics: ["Dockerfile Best Practices", "Docker Compose", "Multi-stage Builds"], projects: ["Containerized Web App", "Microservices with Docker"], certifications: ["Docker Certified Associate"] },
    "aws": { topics: ["EC2 & Lambda", "S3 & CloudFront", "IAM & Security"], projects: ["Serverless API", "Static Website Hosting"], certifications: ["AWS Certified Cloud Practitioner"] },
    "kubernetes": { topics: ["Pods & Services", "Deployments", "Helm Charts"], projects: ["K8s Cluster Setup", "Auto-scaling App"], certifications: ["Certified Kubernetes Administrator (CKA)"] },
    "typescript": { topics: ["Generics", "Type Guards", "Utility Types", "Declaration Files"], projects: ["Type-safe REST API", "React App with TypeScript"], certifications: ["Microsoft Certified: TypeScript Developer"] },
    "git": { topics: ["Branching Strategies", "Rebasing", "Git Hooks"], projects: ["Open Source Contribution", "Git Workflow Automation"], certifications: ["GitHub Foundations Certification"] },
    "redux": { topics: ["Redux Toolkit", "RTK Query", "Middleware"], projects: ["State-managed Dashboard", "Shopping Cart App"], certifications: ["Meta Front-End Developer Certificate"] },
    "accessibility": { topics: ["WCAG Guidelines", "Screen Reader Testing", "Semantic HTML", "Focus Management"], projects: ["Accessible Dashboard Audit", "Inclusive Navigation Design"], certifications: ["CPACC - Certified Professional in Accessibility Core Concepts"] },
};

// ── Tech Keywords for skill extraction ─────────────────────────
const TECH_KEYWORDS = [
    "python", "javascript", "react", "node", "node.js", "express", "mongodb", "sql", "java", "c++", "c#", "ruby", "php",
    "aws", "docker", "kubernetes", "terraform", "git", "jenkins", "html", "css", "typescript", "angular", "vue",
    "django", "flask", "pytorch", "tensorflow", "scikit-learn", "pandas", "numpy", "tableau", "powerbi", "excel",
    "spark", "hadoop", "machine learning", "deep learning", "nlp", "artificial intelligence", "cybersecurity",
    "cloud computing", "data analytics", "data science", "react native", "flutter", "dart", "firebase", "sqlite",
    "redis", "kafka", "postgresql", "mongodb", "mysql", "graphql", "rest api", "microservices", "ci/cd", "linux",
    "nginx", "spring boot", "hibernate", "junit", "jest", "cypress", "tailwind", "vite", "next.js", "framer motion",
    "redux", "responsive design", "figma", "prototyping", "wireframing", "user research", "adobe xd", "ui/ux",
    "visual design", "interaction design", "design systems", "penetration testing", "incident response",
    "firewalls", "wireshark", "metasploit", "siem", "compliance", "ethical hacking", "network security",
    "unit testing", "big data", "statistical modeling", "seaborn", "matplotlib", "asyncio", "celery", "redshift",
    "fastapi", "cloudformation", "prometheus", "grafana", "ansible", "monitoring", "async programming",
    "widget testing", "mobile app development", "security", "terraform"
];

// ── Extract text from file ─────────────────────────────────────
import * as pdfjs from 'pdfjs-dist';

// Set worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// ── Extract text from file ─────────────────────────────────────
export async function extractTextFromFile(file) {
    if (file.name.endsWith('.txt')) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    } else if (file.name.endsWith('.pdf')) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }
            return fullText;
        } catch (err) {
            console.error("PDF Extraction error:", err);
            throw new Error('Failed to extract text from PDF. Please ensure it\'s not password protected or try a .txt file.');
        }
    } else {
        throw new Error('Unsupported file format. Please use .pdf or .txt');
    }
}

// ── Extract skills from text ───────────────────────────────────
export function extractSkills(text) {
    const lowerText = text.toLowerCase();
    const found = new Set();

    for (const keyword of TECH_KEYWORDS) {
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (regex.test(lowerText)) {
            found.add(keyword);
        }
    }

    return [...found].sort();
}

// ── Calculate match score (cosine similarity via TF-IDF) ───────
export function calculateMatchScore(resumeText, jobDescription, jobSkills) {
    const resumeLower = resumeText.toLowerCase();
    const jdText = (jobDescription + ' ' + jobSkills.join(' ')).toLowerCase();

    // Build vocabulary from both texts
    const allWords = new Set();
    const tokenize = (t) => t.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 1);

    const resumeTokens = tokenize(resumeLower);
    const jdTokens = tokenize(jdText);

    resumeTokens.forEach(w => allWords.add(w));
    jdTokens.forEach(w => allWords.add(w));

    // Stop words to ignore
    const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'for', 'at', 'by', 'to', 'from', 'in', 'on', 'of', 'with', 'as', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'they', 'them', 'their']);

    const vocab = [...allWords].filter(w => !stopWords.has(w));

    // TF vectors
    const tf = (tokens, v) => {
        const freq = {};
        tokens.forEach(t => freq[t] = (freq[t] || 0) + 1);
        return v.map(w => freq[w] || 0);
    };

    const vecA = tf(resumeTokens, vocab);
    const vecB = tf(jdTokens, vocab);

    // Cosine similarity
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < vocab.length; i++) {
        dot += vecA[i] * vecB[i];
        magA += vecA[i] * vecA[i];
        magB += vecB[i] * vecB[i];
    }

    const similarity = (magA && magB) ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
    return Math.round(similarity * 10000) / 100; // percentage with 2 decimals
}

// ── Skill gap analysis ─────────────────────────────────────────
export function analyzeSkillGap(resumeSkills, requiredSkills) {
    const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()));
    const requiredSet = new Set(requiredSkills.map(s => s.toLowerCase()));

    const matched = [...requiredSet].filter(s => resumeSet.has(s));
    const missing = [...requiredSet].filter(s => !resumeSet.has(s));
    const matchPercentage = requiredSet.size > 0 ? (matched.length / requiredSet.size) * 100 : 0;

    return {
        matched,
        missing,
        matchPercentage: Math.round(matchPercentage * 100) / 100
    };
}

// ── Generate recommendations ───────────────────────────────────
export function getRecommendations(missingSkills) {
    const recommendations = [];

    for (const skill of missingSkills) {
        const key = skill.toLowerCase();
        const res = LEARNING_RESOURCES[key];

        if (res) {
            recommendations.push({
                skill,
                topics: res.topics,
                projects: res.projects,
                certifications: res.certifications,
                priority: 1
            });
        } else {
            recommendations.push({
                skill,
                topics: [`Advanced ${skill}`, `Best practices in ${skill}`],
                projects: [`Personal project applying ${skill}`],
                certifications: [`Industry standard certification for ${skill}`],
                priority: 2
            });
        }
    }

    return recommendations.slice(0, 6);
}

// ── Main analysis function ─────────────────────────────────────
export async function analyzeResume(file, jobId) {
    const job = JOBS_DATA.find(j => j.id === Number(jobId));
    if (!job) throw new Error('Job role not found');

    // Step 1: Extract text
    const rawText = await extractTextFromFile(file);
    if (!rawText || rawText.trim().length < 10) {
        throw new Error('Could not extract enough text from the file. Please ensure the resume is not empty or an image-based PDF.');
    }

    // Step 2: Extract skills
    const resumeSkills = extractSkills(rawText);

    // Step 3: Calculate match score
    const matchScore = calculateMatchScore(rawText, job.description, job.skills);

    // Step 4: Skill gap analysis
    const gap = analyzeSkillGap(resumeSkills, job.skills);

    // Step 5: Generate recommendations
    const recommendations = getRecommendations(gap.missing);

    return {
        role: job.role,
        matchScore,
        skillMatch: gap.matchPercentage,
        extractedSkills: resumeSkills,
        matchedSkills: gap.matched,
        missingSkills: gap.missing,
        recommendations,
        summary: rawText.substring(0, 500) + '...'
    };
}
