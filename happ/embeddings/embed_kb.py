import os
import glob
from dotenv import load_dotenv
from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS

# Load OpenAI API key
load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

# ✅ Dynamically find all .md files inside happ/
BASE_DIR = os.path.dirname(os.path.abspath(__file__))        # /happ/embeddings
DOC_DIR = os.path.join(BASE_DIR, "..")                       # /happ
md_files = glob.glob(os.path.join(DOC_DIR, "*.md"))

# ✅ Load all markdown files
all_docs = []
for file in md_files:
    loader = TextLoader(file)
    docs = loader.load()
    print(f"📄 Loaded {len(docs)} docs from: {os.path.basename(file)}")
    all_docs.extend(docs)

# ✅ Split documents into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(all_docs)

# ✅ Embed and save to FAISS
embeddings = OpenAIEmbeddings()
db = FAISS.from_documents(chunks, embeddings)
db.save_local(os.path.join(BASE_DIR, "faiss_index"))

print("✅ FAISS index created from multiple .md files and saved.")
