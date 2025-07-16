# 🚌 TripTix - Real-Time Bus Ticket Booking App

TripTix is a full-stack real-time web application that allows users to search for buses, select seats, enter passenger details, and complete bookings with secure Razorpay payment integration. Built using the MERN stack with Socket.io, it supports **real-time seat locking**, preventing overbooking and ensuring a seamless experience.

---

##  Features

-  **Browse Available Buses**  
  Search and view available bus listings with operator, AC/sleeper info, and pricing.

-  **Real-Time Seat Selection**  
  Interactive seat layout with **real-time seat locking/unlocking** using Socket.io.

-  **Passenger Details Form**  
  Dynamically generated form for each selected seat to collect traveler information.

-  **Razorpay Payment Integration**  
  Secure and smooth payment gateway integration.

-  **Live Socket Communication**  
  Prevents double-booking by locking selected seats until the transaction is complete or cancelled.

-  **Booking Summary & Confirmation**  
  View trip, seat, fare, and duration summary before final confirmation.

---

##  Tech Stack

- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Databse: MongoDB, Mongoose
- Real-Time: Socket.io
- Payment: Razorpay API
- Icons/UI: React-Icons, Responsive UI


---

## Folder Structure

```
/tripTix
/components
- BusCard.jsx
- ChatBot.jsx
- SeatSelection.jsx
- PassengerDetails.jsx
- ChatBot.jsx
/pages
- Home.jsx
- Profile.jsx
- Login/Register
/utils
- constants.js
App.js

/server
/config
- cloudinary.js
- db.js
- razorpay.js
- storage.js
/middleware
- admin.js
- auth.js
/models
- User.js
- Bus.js
- Seat.js
- booking.js
- routes.js
/routes
- auth.js
- booking.js
- buses.js
- payment.js
- route.js
- seat.js
- socket.js
- users.js

index.js
```

---

## ⚙️ How It Works

1. **User logs in** and searches for buses.
2. **User selects a bus** and views available seats.
3. Selected seats are **locked in real-time** using `Socket.io`.
4. On the next page, user fills **passenger details**.
5. Proceeds to **Razorpay payment**.
6. If successful, **booking is saved**, else **seats are unlocked**.

---

##  Setup Instructions

### 🔧 Prerequisites
- Node.js
- MongoDB
- Razorpay Account (API Keys)
- Google Gemini API Key (Optional for ChatBot)

### 🛠️ Installation

```bash
# Clone the project
git clone https://github.com/Chandrashekher1/TripTix.git
cd tripTix

# Install server dependencies
npm install

# Install client dependencies
cd ../client
npm install




# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
