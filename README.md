# VINES: Towards Resilient and Converged NextG Manufacturing Systems

**NSF-SRC Track 1 Collaborative Research Grant**  
- **Lead Award:** NSF Award #2549126 (University of Connecticut)
- **Collaborative Award:** NSF Award #2549127 (The University of Iowa)
- **International Partner:** Mid Sweden University (Mittuniversitetet / MIUN), STC Research Centre
- **Sponsor:** National Science Foundation (NSF) — Directorate for Computer and Information Science and Engineering (CISE), Verticals-enabling Intelligent Network Systems (VINES) Track 1 & Global Venture Fund

---

## 🌟 Overview

This repository hosts the official academic grant website for the **VINES** project (*Towards Resilient and Converged NextG Manufacturing Systems*). 

The website is a pure static web platform built with semantic HTML5, modern CSS3, and vanilla JavaScript—designed to deploy seamlessly on **GitHub Pages** with zero build configuration.

### Project Branches
- `main`: Clean, modern collaborative multi-institution academic presentation (balanced NSF, UConn, UIowa, and MIUN co-branding).
- `uconn`: Official University of Connecticut branded version conforming to the [UConn Brand Guidelines](https://brand.uconn.edu/), featuring UConn Navy (`#000E2F`), UConn Grey (`#7C878E`), UConn typography, and institutional headers/footers.

---

## 🚀 Key Sections Included

1. **Executive Summary & Motivations:** Dynamic manufacturing challenges, reactive vs. predictive paradigms, Vector A (Resilience & Convergence), and Vector B (AI-Native Design & ISAC).
2. **Interactive 3-Substrate Architecture:**
   - *Application Substrate:* Monitoring & Control, Diagnosis & Prognosis, Machine Vision, Cobot Path Planning.
   - *Cyber Substrate:* Predictive 5G/6G Wireless Edge, TSN Core Switches, and Cross-Domain Control Layer.
   - *Physical Substrate:* Collaborative Robots (Cobots), Dynamic Factory Floor, and High-Mix Cells.
3. **Core Research Thrusts:**
   - *Thrust 1:* Wireless Edge Perception, ISAC & Cycle-Aligned Schedulers.
   - *Thrust 2:* Deterministic TSN Wired Core & Zero-Touch Fault Failover.
   - *Thrust 3:* Cross-Domain Orchestration & Verifiable End-to-End Guarantees.
4. **Grant Quad Chart Poster:** Embedded interactive viewer for `Track1_2549126_UConn.pdf` with fullscreen opening, PDF download, and an accessible HTML replica.
5. **Open Source Tools & Testbeds:** Links and documentation for **TSNKit** (RTSS'25), **KeepON** (NSDI'26), **5G-TPS** (TMC'25), and university testbed facilities.
6. **Publications & Presentations:** Searchable, tag-filtered publication catalog with 1-click BibTeX copy dialogs.
7. **Research Consortium:** Profiles for Lead PI Dr. Song Han, Co-PIs Dr. Shengli Zhou and Dr. Bing Wang (UConn), PI Dr. Tianyu Zhang and Co-PI Dr. Steve Goddard (UIowa), Prof. Mikael Gidlund and Dr. Aamir Mahmood (MIUN).
8. **Broader Impacts & News:** Workforce development, SMM democratization, transatlantic training, and timeline milestones.
9. **Mandatory NSF Acknowledgment & Disclaimer:** Full statutory compliance with NSF funding guidelines.

---

## 💻 Local Testing & Verification

To run and preview the page locally, you can use any static file server:

```powershell
# Using Node.js (already installed)
node -e "const http=require('http'), fs=require('fs'), path=require('path'); const server=http.createServer((req,res)=>{ let file=path.join(__dirname, req.url==='/'?'index.html':req.url.split('?')[0]); if(!fs.existsSync(file)){ res.writeHead(404); return res.end('Not found'); } const ext=path.extname(file); const types={'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.pdf':'application/pdf'}; res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream'}); fs.createReadStream(file).pipe(res); }); server.listen(8080,()=>console.log('Serving on http://localhost:8080'));"
```

Then open `http://localhost:8080` in your web browser.

---

## 🚢 GitHub Pages Deployment

1. Initialize and add remote:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   git push -u origin uconn
   ```
2. On GitHub, navigate to **Settings > Pages**.
3. Under **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: Choose `main` or `uconn` / `/ (root)`
   - Click **Save**.
4. GitHub Pages will serve the site at `https://<your-username>.github.io/<repo-name>/`.
