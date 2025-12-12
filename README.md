# 🏸 Sports Facility Court Booking Platform  
A full-stack MERN application that supports multi-resource bookings (courts + equipment + coaches), dynamic pricing rules, admin management, and real-time availability checks.

---

## 📌 Overview  
This platform allows users to book **badminton courts**, **equipment (rackets/shoes)**, and **coaches** in a single atomic booking. The system validates availability, calculates prices dynamically, and stores bookings in a structured database.

Admins can manage courts, coaches, equipment inventory, and dynamic pricing rules directly from an admin dashboard.

---

## 🚀 Live Deployment  
- **Backend (Render)** → `https://your-backend.onrender.com`  
- **Frontend (Netlify/Vercel)** → `https://your-frontend.netlify.app`  

(Replace with your actual URLs)

---

# 📂 Project Structure  

root/
├── backend/
│ ├── server.js
│ ├── models/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ ├── package.json
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│
└── README.md


---

# 🛠 Tech Stack

### **Frontend**
- React.js  
- React-Bootstrap  
- Axios  
- Context API  
- React Router  

### **Backend**
- Node.js + Express  
- JWT Authentication  
- MongoDB Atlas  
- Mongoose ORM  

---

# 📌 Features

### **1️⃣ Multi-Resource Booking**
- Book **court + equipment + coach** in the same session  
- Atomic booking logic (all resources must be available → else fail)  

### **2️⃣ Dynamic Pricing System**
Pricing auto-adjusts based on:

- Peak Hours (6–9 PM)
- Weekend pricing
- Indoor court premium
- Equipment rental fees
- Coach hourly fee

All rules are **configurable** via admin panel.

### **3️⃣ Admin Dashboard**
Admins can manage:

- Courts (enable/disable)
- Coaches
- Equipment inventory
- Pricing rules (create/update/enable/disable)

### **4️⃣ Frontend Capabilities**
- Real-time price preview  
- Live availability checks
- Booking history  
- User authentication (Login/Signup)
- Admin-only access for dashboard  

---

# 🏗 Installation & Setup

## 1️⃣ Clone the Repository  
```bash
git clone https://github.com/yourname/court-booking.git
cd court-booking
```
### **2️⃣ Install Dependencies**

cd backend
npm install

### **3️⃣ Create .env file**
MONGO_URI = mongodb+srv://court_booking:iznizC1XFCeeJy02@devopod.ghtdg.mongodb.net/?appName=Devopod
JWT_SECRET = 21f65823ba29fb10c31317984deec4bc

### **4️⃣ Start Server**
npm start

System Design Write-Up:

This platform is designed with a modular, scalable architecture centered around clean separation of concerns. All core entities—Courts, Coaches, Equipment, Bookings, and Pricing Rules—are modeled as 
independent collections in MongoDB. This ensures flexibility, easy expansion, and precise control over availability management.

A booking is treated as an atomic reservation containing multiple linked resources. When a user selects a court, coach, equipment, and time slot, the backend performs a consolidated validation check 
to ensure all resources are available before committing the booking. This prevents race conditions and double-bookings. Each booking also stores a detailed pricing breakdown calculated using the dynamic pricing engine.

The pricing engine is rule-driven rather than hardcoded. Peak hours, weekends, indoor premiums, equipment fees, and coach fees are stored as pricing rules. When a preview or booking request is made, 
the backend retrieves active rules and applies them cumulatively to compute the final amount. This modular rule system allows admins to modify pricing behavior without changing backend code.

The admin management module provides full control over system configuration. Courts and coaches can be enabled or disabled, equipment inventory updated, and pricing rules edited dynamically. 
All admin routes are protected using JWT authentication combined with role-based access control.

On the frontend, React Context is used for global state such as selected court, slot, equipment, and authentication state. Real-time price updates are shown using the /calc-price backend route, 
ensuring full synchronization with server logic. The BookingPage provides a guided booking workflow, while the BookingHistory page shows past reservations retrieved from the authenticated user’s context.

Overall, the system ensures strong modularity, clean separation between business logic and resource models, and a smooth user experience powered by real-time validation and pricing computation. 
The architecture supports future enhancements like waitlisting, cancellation flows, concurrency handling, and advanced analytics.


