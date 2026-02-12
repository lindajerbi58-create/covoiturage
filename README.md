🚗 Unidrive – Smart Campus Carpooling App
📌 Overview

Unidrive is a full-stack campus carpooling mobile application built using React Native (Expo) and Node.js/Express with MongoDB.

The application allows students to safely share rides inside and around campus with real-time communication, smart filtering, location detection, and driver rating system.

This project demonstrates complete full-stack mobile development including authentication, messaging, map integration, and advanced ride filtering.

                                                   ✨ Main Features
🔐 Authentication System

User registration

Secure login with JWT

Profile update

Password reset via email (token-based system)

🔁 Password Reset

The application includes a password reset system using Nodemailer.

⚠ Important:

To activate password reset, you must configure:

Your own Gmail address

Your own Gmail App Password

You need to place your credentials inside environment variables (.env) for security.

Example:

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password


⚠ For security reasons, the original credentials were removed from this repository.

👤 Profile Features

Upload profile picture 📷

Everyone sees your real photo in:

Messages

Rides

Driver info

Update vehicle information

Update preferences (No Smoking, Pets Allowed, etc.)

View:

⭐ Overall rating

🚗 Total rides

📍 Smart Location System

Automatically detects your current location

Pick your:

Pickup point

Destination

Interactive map integration

Search rides:

Nearby rides (less than 100 meters)

By destination

By departure point

🚗 Ride System

You can:

Publish a ride

Join a ride

Participate as passenger

Act as driver

📂 Ride History Includes:

Hosted rides (as driver)

Participated rides (as passenger)

Upcoming rides

Completed rides

🔎 Advanced Ride Search & Filtering

Users can:

View all available rides

Filter rides by:

Female Only

Price (Low → High)

Price (High → Low)

Air Condition

No Smoking

Pets Allowed

Search rides nearby (within 100 meters)

💬 Real-Time Messaging

Private chat between driver and passenger

Displays real user profile photo

Shows "You:" indicator for sent messages

Integrated call button 📞 to directly call:

The driver

The passenger

When clicking the call icon, it opens the phone app directly.

⭐ Rating System

After ride completion:

Passenger can rate driver

Ratings automatically update:

Driver's overall rating

Profile statistics

🛠 Technologies Used
📱 Frontend

React Native (Expo Router)

TypeScript

Axios

AsyncStorage

React Navigation

React Native Maps

🌐 Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

Bcrypt

Nodemailer

Crypto

🏗 Project Structure
/app        → React Native frontend
/server     → Node.js backend

🚀 How to Run the Project
1️⃣ Backend
cd server
npm install
npm start


Runs on:

http://YOUR_LOCAL_IP:5000

2️⃣ Frontend
npm install
npx expo start

⚠ IMPORTANT – Change the IP Address

This project uses a local IP address to connect frontend and backend.

Before running the app on your own computer:

🔎 Find your IP address

On Windows:

ipconfig


Look for:

IPv4 Address


Example:

192.168.1.45

🔧 Replace the IP in the project

Search inside the project for:

192.168.1.13


Replace it with your own IP:

http://YOUR_IP:5000


Example:

http://192.168.1.45:5000


If you do not change the IP, the application will not connect to the backend.

🔐 Security Notice

For security reasons:

Email credentials were removed

App passwords were removed

Sensitive data must be stored in .env

Never push real passwords to GitHub

🎯 What This Project Demonstrates

Full-stack mobile architecture

Secure authentication flow

Token-based password reset

Map & geolocation integration

Real-time messaging

Rating system logic

Advanced filtering algorithms

Clean UI/UX mobile design
## 🔐 Login
![Login](./assets/screenshots/login.png)

## 📝 Register
![Register](./assets/screenshots/Register.png)

## 🏠 Home
![Home](./assets/screenshots/home.png)

## 🚗 Publish Ride
![Publish](./assets/screenshots/publish.png)

## 🔎 Search Ride
![Search](./assets/screenshots/chercher.png)

## 📍 Select Pickup
![Pickup](./assets/screenshots/pickup.png)

## 🎯 Select Destination
![Destination](./assets/screenshots/destination.png)

## 📍 Nearby Rides
![Nearby](./assets/screenshots/nearby.png)

## 💬 Messages
![Messages](./assets/screenshots/Messagerie.png)

## 📖 My Rides
![MyRides](./assets/screenshots/myrides.png)

## 👤 Profile
![Profile](./assets/screenshots/profile.png)

## ✏️ Edit Profile
![Edit](./assets/screenshots/edit.png)

## 🔐 Forgot Password
![Forgot](./assets/screenshots/forgot.png)

## 📞 Support
![Support](./assets/screenshots/support.png)

## 🚗 Available Rides
![Available](./assets/screenshots/available.png)

## 📍 Choose Location
![Choose](./assets/screenshots/choisir.png)


👩‍💻 Developed By

Linda Jerbi
Full-Stack Mobile Developer
React Native & Node.js