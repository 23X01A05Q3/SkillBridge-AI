import re
import nltk
import spacy
import logging
import pdfplumber
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure NLTK data is downloaded
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('punkt_tab', quiet=True)
except Exception as e:
    logger.error(f"Error downloading NLTK data: {e}")

# Load Spacy for NER
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # Fallback if model not downloaded
    import os
    logger.info("Downloading en_core_web_sm model...")
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

class NLPPipeline:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))

    def extract_text_from_pdf(self, pdf_path):
        try:
            logger.info(f"Extracting text from PDF: {pdf_path}")
            text = ""
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            if not text.strip():
                logger.warning(f"No text extracted from {pdf_path}")
            return text
        except Exception as e:
            logger.error(f"Error extracting PDF: {e}")
            return ""

    def preprocess_text(self, text):
        # Normalize
        text = text.lower()
        # Remove non-alphanumeric chars (keep spaces)
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        # Tokenize
        tokens = word_tokenize(text)
        # Remove stopwords and lemmatize
        cleaned_tokens = [
            self.lemmatizer.lemmatize(token) 
            for token in tokens 
            if token not in self.stop_words and len(token) > 1
        ]
        return " ".join(cleaned_tokens)

    def extract_skills(self, text):
        """
        Extract potential skills using NER and keyword matching.
        Improved with noise filtering and common-sense checks.
        """
        doc = nlp(text)
        skills = set()
        
        # Keywords that are common noise or generic and should be excluded
        noise_filter = {
            "strengthened", "applied", "achieved", "managed", "collaborated", 
            "university", "college", "school", "project", "experience", "skills",
            "developed", "implemented", "responsible", "led", "assisted",
            "deloitte", "google", "microsoft", "amazon", "tcs", "infosys",
            "working", "using", "through", "excellent", "proven", "track record",
            "percentage", "graduate", "degree", "education", "summary", "contact",
            "phone", "email", "address", "location", "years", "month"
        }
        
        # 1. NER Extraction with strict filtering
        for ent in doc.ents:
            # We focus on ORG (companies/software), PRODUCT (tech), and GPE (sometimes tech names)
            if ent.label_ in ["ORG", "PRODUCT"]:
                clean_ent = ent.text.lower().strip()
                # Filter: length, noise, and generic characters
                if (len(clean_ent) > 1 and 
                    len(clean_ent) < 25 and 
                    clean_ent not in noise_filter and
                    not clean_ent.isdigit() and
                    not re.search(r'[^a-z0-9\s\-.]', clean_ent)): # No weird symbols
                    skills.add(clean_ent)
        
        # 2. Hardcoded tech keywords (High confidence)
        tech_keywords = [
            "python", "javascript", "react", "node", "express", "mongodb", "sql", 
            "java", "c++", "c#", "ruby", "php", "aws", "docker", "kubernetes",
            "terraform", "git", "jenkins", "html", "css", "typescript", "angular",
            "vue", "django", "flask", "pytorch", "tensorflow", "scikit-learn", 
            "pandas", "numpy", "tableau", "powerbi", "excel", "spark", "hadoop",
            "machine learning", "deep learning", "nlp", "artificial intelligence",
            "cybersecurity", "cloud computing", "data analytics", "data science"
        ]
        
        for word in tech_keywords:
            if re.search(rf'\b{re.escape(word)}\b', text.lower()):
                skills.add(word)
                
        # Final cleanup: remove anything that is just a single common word or noise
        final_skills = [s for s in skills if s not in noise_filter and len(s) > 1]
        return sorted(list(set(final_skills)))
