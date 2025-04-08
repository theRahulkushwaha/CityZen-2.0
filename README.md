# 🏙️ *Citizen – City Management Dashboard*

*Citizen* is a powerful *city management dashboard* built for authorities to monitor and manage urban infrastructure more efficiently. The app integrates *AI-powered models* for real-time detection of incidents like *accidents*, *infrastructure damage*, *crime*, and *traffic congestion*. It also includes *SOS alerts*, *feedback and complaint forms*, and *statistical dashboards* to keep the city running smoothly.

---

## 📌 *Features*

- *Dashboard Interface* to monitor city events  
- *4 AI Models* for:  
  - *Accident Detection*  
  - *Infrastructure Damage Detection*  
  - *Crime Detection*  
  - *Traffic Detection*  
- *Automatic Reporting* with *video evidence*  
- *Alerts* to relevant departments like *police* and *hospitals*  
- *SOS Feature* for emergencies  
- *Complaint and Feedback Forms*  
- *Statistical Graphs and Analysis*

---

## 🧠 *AI Model Functionality*

For example:  
If an accident occurs, the *Accident Detection Model* detects it in real-time, generates a *report* along with *video evidence*, and notifies *police* and *hospitals* to take immediate action.  
The same applies to the other 3 models.

---

## 🛠️ *Tech Stack*

**Frontend:**

- *React*  
- *React Router DOM*  
- *Leaflet* (for maps)  
- *Recharts* (for statistics)  
- *Firebase* (for authentication)  

**Backend:**

- *Flask*  
- *Python* (AI Models)

---
## 📸 Screenshots

### Dashboard View
![Screenshot 2024-09-22 211734](https://github.com/user-attachments/assets/1c198c73-da4a-45f1-98c1-16b12793b4f1)

### AI Model Detection in Action
![Screenshot 2024-09-22 211833](https://github.com/user-attachments/assets/e5e1f910-1ebe-464f-9cbf-d1898e6462ba)
![Screenshot 2024-09-22 211915](https://github.com/user-attachments/assets/847a7fee-1ac0-449d-9ef2-31c81518d863)

### Report 
![Screenshot 2025-04-08 191256](https://github.com/user-attachments/assets/61c117ad-1e96-4151-84af-2b1fa83ce897)

---

## 🚀 *Installation and Running the Project*

### 🔧 *Prerequisites*

- *Node.js and npm*  
- *Python 3.x*  
- *Git*

---

### 📂 *Clone the Repository*

```bash
git clone https://github.com/your-username/citizen.git
cd citizen
```
### ▶️ *Run the Frontend*

```bash
npm install
npm run dev
```
Runs on: http://localhost:5173

### 🤖 Run the AI Backend Models
```bash
cd Backend
python RunModel.py
```
---
### 📁 Project Structure
```bash
Citizen/
│
├── Backend/               # Python AI models and Flask backend
│   └── RunModel.py
│
├── src/
│   ├── Components/        # Reusable components (Navbar, SOS, Feedback, etc.)
│   ├── Pages/             # AI Model views, Report Pages
│   ├── Screens/           # Login, Signup, Home screens
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── README.md
```
---
### 🧪 Status
✅ Completed and functional.
We are actively working to improve the UI and model accuracy.

===
### ✨ Contribution
If you want to contribute, feel free to fork the repo and submit a pull request.
---
### 👨‍💻 Authors
Project by Rahul, Ayush, Rishu and Ritesh
Built with ❤️ for Smart City Management
