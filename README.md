# 🏟️ Finesse Sporting Facilitation (FSF) - 
Community Sports Facility Management System

A web-based platform designed to simplify the management of community sports facilities such as soccer fields, basketball courts, gyms, and swimming pools. The platform enables residents to book venues, report maintenance issues, and stay updated with events and notifications—all in real time.

🚀 **Live Website**: https://lemon-moss-0b8334303.6.azurestaticapps.net/

---

## 📌 Features

- ✅ **Facility Booking**: Residents can reserve available time slots across multiple facilities.
- 🔧 **Maintenance Reporting**: Report issues and track resolution progress by facility staff.
- 🧑‍🤝‍🧑 **User Roles**: Resident, Facility Staff, and Admins with role-based access.
- 📣 **Event Management**: Admins can organize community events and notify users.
- 📊 **Reporting Dashboard**: Exportable reports on facility usage, maintenance trends, and custom views.
- ☁️ **Real-Time Sync**: Updates reflect instantly across all clients using Firestore.

---

## 🛠️ Tech Stack

| Layer            | Technology                    |
|------------------|-------------------------------|
| **Frontend**     | React.js,HTML5                |
| **Authentication** | Firebase Auth + OAuth 2.0   |
| **Backend (API)**| Firebase Cloud Functions      |
| **Database**     | Firebase Firestore (NoSQL)    |
| **Hosting**      | Azure Static Web Apps         |
| **CI/CD**        | GitHub Actions                |

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/Weppman/SD-Project-SportsManagement.git

# 2. Install dependencies
cd community-sports-facility-management
npm install

# 3. Start the development server
npm run dev

