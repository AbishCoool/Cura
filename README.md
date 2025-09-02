
# CURA — AI-powered Post-Hospital Recovery (Django)

CURA is a Django web app that helps patients track recovery (Journal, Medications, Appointments), gives doctors a dashboard, and provides an AI assistant powered by embeddings (FAISS + OpenAI). It also supports web push notifications via Firebase (FCM).

## ✨ What you get

- **Patient features:** Daily Journal, Activities, Appointments, Leaderboard, Rewards (daily check-in), Notifications
- **Doctor features:** Doctor login, patient & family journal views, notes, single-entry graphs
- **AI Assistant:** Knowledge-base embeddings (LangChain + FAISS + OpenAI)
- **Push notifications:** FCM service worker (`/firebase-messaging-sw.js`) wired for localhost

---

## 🧩 Project layout (key folders)


Cura-main/
├─ manage.py
├─ health/ # Django project (settings, urls, wsgi)
├─ happ/ # Main app (models, views, urls, templates, static)
│ ├─ embeddings/ # embed_kb.py + FAISS index location
│ ├─ templates/ # login, journal, appointments, doctor dashboard, etc.
│ └─ static/ # assets + firebase-messaging-sw.js
├─ static/ # (referenced by settings)
├─ db.sqlite3 # sample database (optional)
├─ requirements.txt # Python deps (see below)
└─ .env # ⚠️ contains secrets — do NOT commit (use .env.example)



> **Note:** The zip includes `venv/` and/or other local env folders. **Ignore them**. Always create a fresh virtual environment.

---

## ✅ Prerequisites

- **Python** 3.11 or 3.12 (recommended)
- **pip** (latest): `python -m pip install --upgrade pip setuptools wheel`
- (Windows) Visual C++ build tools may be required by some packages  
- (macOS, Apple Silicon) If FAISS gives issues, install OpenMP: `brew install libomp`

---

## 🚀 Quickstart (TL;DR)

# 1) unpack or clone the project
cd Cura-main

# 2) create + activate a virtual env
# macOS / Linux
python3 -m venv .venv && source .venv/bin/activate
# Windows (PowerShell)
python -m venv .venv; .\.venv\Scripts\Activate.ps1

# 3) install deps
pip install -r requirements.txt

# 4) create .env (DON'T commit this file)
#    Put your OpenAI key; Firebase values are already in JS for local dev.
cp .env .env.example  # optional: create a template without secrets and edit .env manually

# 5) (optional) start fresh DB
#    If you want a clean database instead of the bundled db.sqlite3:
# rm db.sqlite3  (macOS/Linux)    OR    del db.sqlite3 (Windows)

# 6) migrate DB and create admin
python manage.py migrate
python manage.py createsuperuser  # follow prompts (email optional)

# 7) run the server
python manage.py runserver

Open http://127.0.0.1:8000/
 → you’ll see the login page
Django admin: http://127.0.0.1:8000/admin/





🗺️ Main routes (from happ/urls.py)

Auth: / (login), /signup/, /logout/

Home/Dashboard: /home/, /famil/

Journal: /journal/, /journal/family/<member_id>/

Activity & Appointments: /activity/, /appointments/

Rewards: /rewards/, /rewards/checkin/, /rewards/claim/<tier_id>/

Doctor: /login/doctor/, /doctor/dashboard/, /doctor/user/<user_id>/journals/, /doctor/family/<member_id>/journals/, /doctor/journal/<entry_id>/, notes routes, etc.

Chatbot: POST /chatbot-response/

FCM: GET /firebase-messaging-sw.js (served from happ/static via re_path)




🔔 Push notifications (FCM) on localhost

Service worker is correctly exposed at /firebase-messaging-sw.js

Firebase web config + VAPID public key live in
happ/static/assets/firebase/firebase-config.js

On localhost (http://127.0.0.1:8000) web push can work for dev; accept the browser prompt.

If you switch Firebase projects, update that JS file with your own config and VAPID key.



🤖 (Optional) Build the chatbot knowledge base (FAISS)

The app expects a FAISS index at happ/embeddings/faiss_index/.
If it’s missing or you want to rebuild:
# 1) ensure OPENAI_API_KEY is in .env
# 2) run the embedding script from project root:
python -m happ.embeddings.embed_kb
# This scans *.md files in happ/, chunks them, and writes FAISS index.


If you see ModuleNotFoundError: faiss, install CPU wheels:
pip install faiss-cpu (already in requirements)


Common issues & fixes

no such table: happ_*
You’re using a clean DB without migrations applied. Run:

python manage.py migrate


If models changed and no migrations exist:
python manage.py makemigrations happ
python manage.py migrate


FAISS import error on macOS/Windows
Ensure faiss-cpu is installed and (on macOS) brew install libomp.

Static files not loading (dev)
DEBUG=True in health/settings.py serves static via STATICFILES_DIRS = [BASE_DIR / 'static'] and happ/static/ via app dirs. The service worker is explicitly exposed in happ/urls.py.

OpenAI errors
Check .env contains a valid OPENAI_API_KEY, and your network allows outbound HTTPS.


📜 Tech stack

Django (project: health, app: happ)

SQLite (default)

LangChain + FAISS + OpenAI (embeddings & retrieval)

Firebase (web push)

Matplotlib + NumPy (plots for doctor/journal pages)
