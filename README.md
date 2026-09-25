<div align="center">


# Nallana Sasi Kumar
### FULL-STACK DEVELOPER & SYSTEMS ENGINEER

*A digital portfolio engineered as an interactive product—combining system-inspired visual design, 3D interactions, motion physics, live engineering data, and production-grade performance.*

[![Live Demo](https://img.shields.io/badge/Live_Deployment-52D9FF?style=for-the-badge&logo=vercel&logoColor=black)](https://nallana-sasi-kumar-portfolio.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sasi-kumar-nallana)
[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/kumarnallana)

<br/>

| Performance | Accessibility | Best Practices | SEO |
| :---: | :---: | :---: | :---: |
| <img src="https://img.shields.io/badge/100-success?style=for-the-badge&logo=lighthouse" /> | <img src="https://img.shields.io/badge/100-success?style=for-the-badge&logo=lighthouse" /> | <img src="https://img.shields.io/badge/100-success?style=for-the-badge&logo=lighthouse" /> | <img src="https://img.shields.io/badge/100-success?style=for-the-badge&logo=lighthouse" /> |

</div>

---

## ✦ The Core Experience

I built this portfolio to communicate not just what I build, but **how I think about engineering, product development, architecture, and user experience.** The interface is built around a system-oriented visual language using blueprint-inspired layouts, technical typography, restrained motion, and interactive depth.

### 🌐 3D Interactive Technology Globe
Built with **React Three Fiber**, this visualization represents different areas of my stack and engineering experience. It features 360-degree interaction, technology constellations, post-processing bloom effects, and motion designed to support the interface rather than distract from it.

### 〰️ Elastic Signal Physics
The background leverages a custom **GSAP ticker** paired with normal-based displacement, neighbor tension (Laplacian coupling), and projected pointer forces to create an organic, elastic ribbon wave effect that dynamically reacts to user interactions.

### 📊 Live Telemetry & GitHub Integration
GitHub data is integrated dynamically to surface repositories, stars, followers, and contribution history. The integration uses **GitHub GraphQL APIs** together with client-side caching. Furthermore, view counts are retrieved from **Vercel Web Analytics** entirely on the server. *If telemetry is unavailable, the UI explicitly reports it—I strictly avoid fabricating data.*

---

## ✦ Technology Stack

<table>
  <tr>
    <td align="center" width="25%">
      <h3>Frontend</h3>
      <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white" /><br/>
      <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" /><br/>
      <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /><br/>
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" />
    </td>
    <td align="center" width="25%">
      <h3>Backend</h3>
      <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" /><br/>
      <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" /><br/>
      <img src="https://img.shields.io/badge/REST_APIs-005571?style=flat-square&logo=json&logoColor=white" /><br/>
      <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" />
    </td>
    <td align="center" width="25%">
      <h3>Motion & 3D</h3>
      <img src="https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white" /><br/>
      <img src="https://img.shields.io/badge/React_Three_Fiber-000000?style=flat-square&logo=react&logoColor=white" /><br/>
      <img src="https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white" /><br/>
      <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" />
    </td>
    <td align="center" width="25%">
      <h3>Infrastructure</h3>
      <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" /><br/>
      <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" /><br/>
      <img src="https://img.shields.io/badge/GraphQL-E10098?style=flat-square&logo=graphql&logoColor=white" /><br/>
      <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" />
    </td>
  </tr>
</table>

---

## ✦ Featured Engineering Work

### Zylxy Technologies (Web Developer Intern)
Worked on a production-focused corporate website and CRM workflow platform. 
* **Contributions:** Built reusable responsive UI components, developed lead-generation workflows utilizing **Next.js Server Actions**, integrated complex REST APIs, and debugged frontend-to-backend data flows via browser developer tools.

### CoroVidya CSR Mentorship
Mentored **60+ aspiring developers** through JavaScript guidance, React concepts, Node.js fundamentals, code reviews, and live technical sessions.

---

## ✦ Local Development & Telemetry Configuration

To run this project locally with full telemetry integration, configure your `.env.local` with the following:

```env
# GitHub GraphQL API 
GITHUB_TOKEN=your_token

# Portfolio Appreciation Data (Server-side only)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Vercel Production Analytics
VERCEL_ANALYTICS_TOKEN=
VERCEL_ANALYTICS_PROJECT_ID=
VERCEL_ANALYTICS_TEAM_ID=
```

> **Note:** The `SUPABASE_SERVICE_ROLE_KEY` strictly remains server-side and is never exposed to the browser. If telemetry credentials are not provided, the application gracefully handles the fallback without fabricating metrics.

<br/>

<div align="center">
  <p><i>"Build systems, not isolated screens. Optimize without sacrificing experience."</i></p>
  <p><b>Designed and developed by Nallana Sasi Kumar.</b></p>
</div>
