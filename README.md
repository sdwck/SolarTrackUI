<div align="center">
  <h1>☀️ SolarTrack Web UI</h1>
  <p><b>The frontend monitoring dashboard for the SolarTrack IoT Platform.</b></p>
</div>

<p align="center">
  <a href="https://solartrack.runasp.net/"><b>Explore the Live Demo</b></a> •
  <a href="https://github.com/sdwck/SolarTrack"><b>Backend Repository</b></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="Material UI" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

---

## 📖 Overview

SolarTrack UI is a highly polished, modern web dashboard designed to visualize complex hardware telemetry in real-time. It provides system administrators and users with an intuitive interface to monitor solar panel efficiency, battery health, and hardware diagnostics.

## ✨ Features

- **Real-Time Data Visualization:** Interactive charts rendering voltage, current, and temperature trends.
- **Dynamic Power Flow:** Visual representation of energy routing between Solar Panels, Inverters, Batteries, and the Grid (Load).
- **Diagnostics & Alerts:** Instant visual feedback on hardware health, thermal status, and voltage stability.
- **Maintenance Tracking:** Built-in task manager for scheduling panel cleaning and inverter repairs based on hardware uptime.
- **Modern Dark Theme:** Carefully crafted UI using Tailwind CSS for reduced eye strain during 24/7 monitoring operations.

## 🛠️ Tech Stack

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Fetching:** Custom hooks interacting with the C# REST API
- **Icons:** Lucide React

## 🔗 Architecture & Backend

This repository contains only the Client-Side application. The heavy lifting (MQTT hardware integration, spatial processing, and caching) is handled by the .NET Core backend.

Check out the backend architecture here:  
👉 **[github.com/sdwck/SolarPanel-Server](https://github.com/sdwck/SolarPanel-Server)**

---

## 📸 Screenshots

<details>
<summary><b>View Application Interface</b></summary>
<br>

| **Main Analytics Dashboard** |
| :---: |
| <img src="https://github.com/user-attachments/assets/9900938a-b8a5-4a0e-8931-442437e883af" width="800" /> |

| **Hardware Power Flow & Modes** |
| :---: |
| <img src="https://github.com/user-attachments/assets/bad23d59-3e9b-48d3-beb6-11b9931cce24" width="800" /> |

| **System Health & Maintenance** |
| :---: |
| <img src="https://github.com/user-attachments/assets/aeb9dfb6-418d-4463-b573-53553b8fc604" width="800" /> |

| **Battery Telemetry Details** |
| :---: |
| <img src="https://github.com/user-attachments/assets/2fcf7aab-7171-4a36-9400-ab794e5d7236" width="800" /> |

| **Task Management** |
| :---: |
| <img src="https://github.com/user-attachments/assets/4a038814-7b3f-40f2-99f1-0d8bef16a188" width="800" /> |

| **Historical Comparisons** |
| :---: |
| <img src="https://github.com/user-attachments/assets/0db82540-c650-4945-889c-f412f2e2cccf" width="800" /> |
| <img src="https://github.com/user-attachments/assets/6779b139-7992-461c-8551-9beb171c2fb7" width="800" /> |

</details>
