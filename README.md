# PixelMart

PixelMart is a digital marketplace that allows users to buy and sell digital products such as PDFs, videos, learning materials, crochet patterns, art, and anything in between. The application uses modern web technologies to provide a seamless and responsive experience for both buyers and sellers, with secure transactions and protected digital downloads.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Future Improvements](#future-improvements)

## Overview

PixelMart is a **full-stack** **Single Page Application (SPA)** with:  
✅ **React (Vite) for the frontend**  
✅ **Node.js/Express for the backend**  
✅ **Auth0 for secure authentication**  
✅ **PostgreSQL for database storage**  
✅ **Amazon S3 for secure product file storage**  
✅ **Stripe for payment processing**

Users can **sign up as buyers or sellers**, **upload and sell digital products**, **manage their listings**, and **purchase digital items**. After a successful purchase, users receive a **pre-signed Amazon S3 URL** to securely download their purchased product.

## Current Features

### 🛠 **Core Features**

- **User Authentication:**  
  Users sign up and log in using Auth0, which handles secure authentication, token management, and provides basic profile information.

- **User Profile Management:**  
  After login, users can view and update their profiles, including their display name and avatar. The system synchronizes Auth0 data with the backend users table.

- **Dashboard for Sellers:**  
  Sellers have access to a dedicated dashboard where they can manage their digital product listings, view sales metrics, and update account settings.

- **Secure Payment Processing:**
  Users are redirected to a Stripe login / sign up page if they choose to become sellers, which then handles all their payment processing securely.

- **Cart & Wishlist:**
  Buyers can save and purchase items.

- **Instant Digital Downloads:**
  Via Amazon S3 pre-signed URLs.

- **Responsive Design:**  
  The frontend is built using Material UI and is fully responsive, ensuring a seamless experience on desktops, tablets, and mobile devices.

- **Settings Page:**  
  Users can update their account information, including their display name and notification preferences. A Delete Account option is provided with confirmation.

- **RESTful API:**  
  The backend exposes RESTful endpoints for user data synchronization and profile management.

### 🎨 **User Experience Features**

- **Sellers can upload and showcase digital products**
- **Buyers can browse listings, add items to their cart or wishlist**
- **Users can checkout securely with Stripe**
- **After a successful payment, buyers receive download links**
- **RESTful API for smooth data synchronization**

## Technologies Used

- **Frontend:**

  ✅ **React** (with Vite for optimized build)

  ✅ **Material UI** (for modern UI components)

  ✅ **React Router** (for client-side navigation)

  ✅ **Auth0 React SDK** (for authentication)

- **Backend:**

  ✅ **Node.js & Express** (for API server)

  ✅ **PostgreSQL** (for relational database)

  ✅ **pg (node-postgres)** (for database interaction)

  ✅ **Amazon S3** (for file blob storage)

  ✅ **Auth0** (for user authentication)

  ✅ **Stripe** (for secure payment processing)

  ✅ **Multer** (for file handling)

- **Other Tools:**

  ✅ **Git & GitHub** (for version control & source code hosting)

  ✅ **dotenv** (for environment variables)

## Project Structure

Below is a high-level overview of the project structure:

```
PixelMart/
├── backend/
│ ├── controllers/
│ │ ├── userController.ts
│ │ ├── fileController.ts
│ │ ├── stripeController.ts
│ │ └── etc
│ ├── middleware/
│ │ └── authMiddleware.ts
│ ├── models/
│ │ ├── userModel.ts
│ │ ├── fileModel.ts
│ │ └── etc
│ ├── routes/
│ │ ├── userRoutes.ts
│ │ ├── fileRoutes.ts
│ │ ├── stripeRoutes.ts
│ │ └── etc
│ ├── services/
│ │ ├── s3Service.ts
│ │ └── etc
│ ├── database.ts
│ ├── index.ts
│ └── .env
├── frontend/
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── components/
│ │ │ ├── About.tsx
│ │ │ ├── Auth.tsx
│ │ │ ├── Dashboard.tsx
│ │ │ ├── Home.tsx
│ │ │ ├── Navbar.tsx
│ │ │ ├── Profile.tsx
│ │ │ ├── Settings.tsx
│ │ │ └── etc
│ │ ├── context/
│ │ │ └── ProfileContext.tsx
│ │ ├── hooks/
│ │ │ ├── useFileUpload.ts
│ │ │ ├── useMultipleItemFetch.ts
│ │ │ ├── useSingleItemFetch.ts
│ │ │ └── etc
│ │ ├── api/
│ │ │ ├── profile.ts
│ │ ├── App.tsx
│ │ └── main.tsx
│ └── .env
└── README.md
```

## Usage

### **1️⃣ User Authentication**

- Users log in or sign up via **Auth0 Universal Login**.
- Once authenticated, users can access their dashboard, update their profile, upload items, and manage their listings.
- In Settings, users can update their display name, username, and notification preferences, and delete their account if needed.

### **2️⃣ Selling Digital Products**

- Sellers **upload files** and **add descriptions, images, and pricing**.
- Product files are stored securely in **Amazon S3**.

### **3️⃣ Shopping (Cart & Wishlist)**

- Buyers **browse items**, **add them to their cart**, or **save them to their wishlist**.
- The cart allows **multiple item purchases at once**.

### **4️⃣ Checkout & Payment Processing**

- Buyers **proceed to checkout**, where **Stripe** handles payment securely.
- After payment, an **order confirmation page** appears.

### **5️⃣ Secure Digital Downloads**

- After checkout, users **receive an order confirmation with pre-signed Amazon S3 links** to **download their purchased digital items** securely.

## Future Improvements

🚀 **Enhancements for Sellers:**

- Add **detailed analytics and sales metrics**.
- Allow sellers to **offer discounts or coupons**.
- Enable **automated tax calculation** (VAT, GST).

🛒 **Enhanced Shopping Experience:**

- Allow buyers to **leave reviews** for purchased products.
- Implement **categories and filters** for better product discovery.
- Add **email notifications** for purchases.

🔒 **Security & Performance:**

- **Rate limiting** to prevent abuse.
- **More advanced fraud protection**.
- **Optimized database indexing** for better performance.

---

## **Conclusion**

PixelMart provides a **secure, scalable, and user-friendly** platform for **selling and buying** digital products. With **Stripe-powered payments** and **secure S3 downloads**, it ensures **seamless digital transactions**.
