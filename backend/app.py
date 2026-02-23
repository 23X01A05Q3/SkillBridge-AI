import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from nlp_pipeline import NLPPipeline
from analyzer import SkillAnalyzer
from recommendation import RecommendationEngine
import database

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize modules
nlp_pipe = NLPPipeline()
analyzer = SkillAnalyzer()
recommender = RecommendationEngine()

# Initialize/Migrate Database
database.init_db()
database.migrate_from_json(os.path.join('data', 'jobs.json'))

# ── Gemini AI Setup ──────────────────────────────────────────
gemini_model = None
try:
    import google.generativeai as genai
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-2.0-flash')
        print("✅ Gemini AI initialized successfully")
    else:
        print("⚠️  GEMINI_API_KEY not set. Chat will use fallback responses.")
except Exception as e:
    print(f"⚠️  Gemini init failed: {e}. Chat will use fallback responses.")

SYSTEM_PROMPT = """You are SkillBridge AI Assistant — a friendly, expert career mentor and tech advisor. 
You help users with:
- Career guidance and job market insights
- Technical skill recommendations and learning paths
- Resume and interview tips
- Programming and technology questions
- Industry trends and salary insights

Keep responses concise (2-4 paragraphs max), friendly, and actionable. 
Use bullet points when listing items. Always be encouraging and supportive.
If asked about something outside career/tech, still answer helpfully but briefly."""

def get_fallback_response(message):
    """Smart fallback when Gemini API is unavailable."""
    msg = message.lower()
    
    if any(w in msg for w in ['hello', 'hi', 'hey', 'greet']):
        return "Hey there! 👋 I'm the SkillBridge AI Assistant. I can help you with career advice, skill recommendations, resume tips, interview prep, and tech questions. What would you like to explore today?"
    
    if any(w in msg for w in ['resume', 'cv']):
        return """Great question about resumes! Here are some key tips:\n\n• **Tailor it** — Customize your resume for each job by matching keywords from the job description\n• **Quantify achievements** — Use numbers (e.g., "Improved load time by 40%")\n• **Keep it concise** — 1 page for <5 years experience, 2 pages max\n• **Use action verbs** — Start bullets with "Built", "Led", "Designed", "Optimized"\n• **Add a skills section** — List technical skills matching the job requirements\n\nWant me to go deeper on any of these?"""
    
    if any(w in msg for w in ['interview', 'prepare']):
        return """Here's how to ace your tech interview:\n\n• **Research the company** — Know their products, culture, and recent news\n• **Practice coding** — Use LeetCode, HackerRank for DSA problems\n• **STAR method** — Structure behavioral answers: Situation, Task, Action, Result\n• **Prepare questions** — Ask about team culture, tech stack, growth opportunities\n• **Mock interviews** — Practice with a friend or use Pramp/Interviewing.io\n\nWhich type of interview are you preparing for?"""
    
    if any(w in msg for w in ['python', 'learn python']):
        return """Python is an excellent choice! Here's a learning roadmap:\n\n🟢 **Beginner (Weeks 1-4):** Variables, loops, functions, OOP basics\n🟡 **Intermediate (Weeks 5-8):** File handling, APIs, libraries (NumPy, Pandas)\n🔴 **Advanced (Weeks 9-12):** Web frameworks (Flask/Django), databases, testing\n\n**Best resources:**\n• Python.org official tutorial\n• Automate the Boring Stuff (free book)\n• CS50P by Harvard (free course)\n• Real Python (tutorials)\n\nWhat's your current level?"""
    
    if any(w in msg for w in ['frontend', 'react', 'javascript', 'web dev']):
        return """Frontend development is in high demand! Here's the path:\n\n📌 **Core Skills:** HTML, CSS, JavaScript (ES6+)\n📌 **Framework:** React.js (most popular) or Vue.js\n📌 **Styling:** Tailwind CSS or CSS Modules\n📌 **State Management:** Redux Toolkit or Zustand\n📌 **Tools:** Git, VS Code, Chrome DevTools\n\n**Projects to build:**\n• Personal portfolio website\n• Todo app with React\n• Weather dashboard using APIs\n• E-commerce product page\n\nNeed help with any specific area?"""
    
    if any(w in msg for w in ['data science', 'machine learning', 'ml', 'ai']):
        return """Data Science / ML is a fantastic career path! 🚀\n\n**Skills to learn:**\n• Python + Libraries (Pandas, NumPy, Scikit-learn)\n• Statistics & Probability\n• SQL for data querying\n• Data Visualization (Matplotlib, Seaborn)\n• Machine Learning algorithms\n• Deep Learning (TensorFlow or PyTorch)\n\n**Best certifications:**\n• Google Data Analytics Certificate\n• IBM Data Science Professional\n• Andrew Ng's ML Specialization (Coursera)\n\nWant me to recommend a specific learning path?"""
    
    if any(w in msg for w in ['salary', 'pay', 'compensation', 'earn']):
        return """Tech salaries vary by role, experience, and location. Here are rough ranges (USD/year):\n\n💼 **Entry Level (0-2 yrs):** $50K-$80K\n💼 **Mid Level (3-5 yrs):** $80K-$130K\n💼 **Senior (5-10 yrs):** $130K-$200K+\n\n**Highest paying roles:**\n• ML/AI Engineer\n• Cloud Architect\n• DevOps/SRE\n• Full Stack Developer\n\n**Tips to increase salary:**\n• Negotiate with competing offers\n• Get relevant certifications\n• Build a strong portfolio/GitHub\n• Specialize in high-demand areas\n\nWhat role are you targeting?"""

    if any(w in msg for w in ['skill', 'learn', 'roadmap', 'path']):
        return """I'd love to help you build a learning roadmap! 🗺️\n\nTo give you the best advice, tell me:\n1. **What role** are you targeting? (e.g., Frontend Dev, Data Scientist)\n2. **Current skills** — What do you already know?\n3. **Timeline** — How much time can you dedicate per week?\n\nIn the meantime, here are **universal skills every tech professional needs:**\n• Git & Version Control\n• Problem-solving & DSA basics\n• Communication & documentation\n• Cloud basics (AWS/GCP/Azure)\n• CI/CD and testing fundamentals"""

    if any(w in msg for w in ['thank', 'thanks', 'thx']):
        return "You're welcome! 😊 Feel free to ask anything else. I'm here to help you grow your career! 🚀"
    
    return """I'd be happy to help! I'm your SkillBridge AI Assistant and I can help with:\n\n🎯 **Career Guidance** — Role recommendations, industry insights\n📝 **Resume Tips** — How to build a standout resume\n🎤 **Interview Prep** — Practice questions and strategies\n💻 **Tech Skills** — Learning paths for any technology\n💰 **Salary Insights** — Market rates and negotiation tips\n\nWhat would you like to explore? Just ask me anything!"""


@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "SkillBridge AI API is running",
        "endpoints": {
            "health": "/health",
            "jobs": "/jobs",
            "analyze": "/analyze (POST)",
            "chat": "/chat (POST)"
        },
        "frontend": "http://localhost:5173"
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

@app.route('/jobs', methods=['GET'])
def get_jobs():
    jobs = database.get_all_jobs()
    return jsonify(jobs)

@app.route('/chat', methods=['POST'])
def chat():
    """AI Chatbot endpoint powered by Gemini."""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        history = data.get('history', [])
        
        if not user_message:
            return jsonify({"error": "Empty message"}), 400
        
        # Try Gemini first
        if gemini_model:
            try:
                # Build conversation context
                chat_history = []
                for msg in history[-10:]:  # Last 10 messages for context
                    role = "user" if msg.get("role") == "user" else "model"
                    chat_history.append({"role": role, "parts": [msg.get("content", "")]})
                
                chat = gemini_model.start_chat(history=chat_history)
                prompt = f"{SYSTEM_PROMPT}\n\nUser: {user_message}"
                response = chat.send_message(prompt)
                
                return jsonify({
                    "response": response.text,
                    "source": "gemini"
                })
            except Exception as e:
                print(f"Gemini API error: {e}")
                # Fall through to fallback
        
        # Fallback response
        fallback = get_fallback_response(user_message)
        return jsonify({
            "response": fallback,
            "source": "fallback"
        })
        
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({"error": "Failed to process message"}), 500


@app.route('/analyze', methods=['POST'])
def analyze_resume():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        job_id = int(request.form.get('jobId', 1))
        
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400
        
        # Save file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # 1. Extract Text
        raw_text = ""
        if filename.endswith('.pdf'):
            raw_text = nlp_pipe.extract_text_from_pdf(file_path)
        else:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                raw_text = f.read()
        
        if not raw_text.strip():
            return jsonify({"error": "Failed to extract text from resume. Ensure the file is not empty or corrupted."}), 400

        # 2. Preprocess & Extract Resume Skills
        preprocessed_resume = nlp_pipe.preprocess_text(raw_text)
        resume_skills = nlp_pipe.extract_skills(raw_text)
        
        # 3. Get Selected Job from DB
        selected_job = database.get_job_by_id(job_id)
        if not selected_job:
            return jsonify({"error": "Job not found"}), 404
            
        required_skills = selected_job['skills']
        preprocessed_jd = nlp_pipe.preprocess_text(selected_job['description'] + " " + " ".join(required_skills))
        
        # 4. Calculate Similarity
        match_score = analyzer.calculate_similarity(preprocessed_resume, preprocessed_jd)
        
        # 5. Skill Gap Analysis
        gap_result = analyzer.detect_skill_gap(resume_skills, required_skills)
        
        # 6. Generate Recommendations
        recommendations = recommender.get_recommendations(gap_result['missing'])
        
        return jsonify({
            "role": selected_job['role'],
            "matchScore": round(match_score * 100, 2),
            "skillMatch": round(gap_result['match_percentage'], 2),
            "extractedSkills": resume_skills,
            "matchedSkills": gap_result['matched'],
            "missingSkills": gap_result['missing'],
            "recommendations": recommendations,
            "summary": raw_text[:500] + "..." 
        })
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error during analysis: {error_details}")
        return jsonify({"error": f"Internal Process Error: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)

