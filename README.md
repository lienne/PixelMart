# PixelMart

PixelMart is a digital marketplace that allows users to buy and sell digital products such as PDFs, videos, learning materials, crochet patterns, art, and anything in between. The application uses modern web technologies to provide a seamless, secure, and responsive experience for both buyers and sellers.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Future Improvements](#future-improvements)

## Overview

PixelMart is a Single Page Application (SPA) built with React on the frontend and Node.js/Express on the backend. It leverages Auth0 for authentication (using either Universal Login or a custom UI with Auth0 Lock) and Material UI for a modern, responsive user interface. PostgreSQL is used as the database to store user and product data.

## Current Features

- **User Authentication:**  
  Users sign up and log in using Auth0, which handles secure authentication, token management, and provides basic profile information.

- **User Profile Management:**  
  After login, users can view and update their profiles, including their display name and avatar. The system synchronizes Auth0 data with the backend users table.

- **Dashboard for Sellers:**  
  Sellers have access to a dedicated dashboard where they can manage their digital product listings, view sales metrics, and update account settings.

- **Responsive Design:**  
  The frontend is built using Material UI and is fully responsive, ensuring a seamless experience on desktops, tablets, and mobile devices.

- **Settings Page:**  
  Users can update their account information, including their display name and notification preferences. A Delete Account option is provided with confirmation.

- **RESTful API:**  
  The backend exposes RESTful endpoints for user data synchronization and profile management.

## Technologies Used

- **Frontend:**

  - **React** (with Vite for build tooling)
  - **Material UI** for UI components and styling
  - **React Router** for client-side routing
  - **Auth0 React SDK** for authentication

- **Backend:**

  - **Node.js & Express** for API server
  - **PostgreSQL** as the relational database
  - **pg (node-postgres)** for database interaction
  - **Auth0** for user authentication
  - **dotenv** for environment variable management (on the backend)

- **Other Tools:**
  - **Git** for version control
  - **GitHub** for source code hosting

## Project Structure

Below is a high-level overview of the project structure:

PixelMart/ ├── backend/ │ ├── controllers/ │ │ ├── userController.ts │ ├── models/ │ │ └── userModel.ts │ ├── routes/ │ │ └── userRoutes.ts │ ├── database.ts │ ├── index.ts │ └── .env # Backend environment variables ├── frontend/ │ ├── public/ │ │ └── index.html │ ├── src/ │ │ ├── components/ │ │ │ ├── About.tsx │ │ │ ├── Auth.tsx │ │ │ ├── Dashboard.tsx │ │ │ ├── Home.tsx │ │ │ ├── LockLogin.tsx # If using Auth0 Lock │ │ │ ├── Navbar.tsx │ │ │ ├── Profile.tsx │ │ │ └── Settings.tsx │ │ ├── api/ │ │ │ ├── profile.ts # Contains fetchUserProfile function │ │ ├── App.tsx │ │ └── main.tsx │ └── .env # Frontend environment variables (VITE\_ prefixed) └── README.md

## Usage

- **Authentication:**  
  Users will be redirected to Auth0’s Universal Login (or use Auth0 Lock if you choose) for sign-up and login.

- **Dashboard:**  
  Once authenticated, users can access their dashboard, update their profile, and manage their listings.

- **Settings:**  
  Users can update their display name and notification preferences, and delete their account if needed.

- **API:**  
  The backend provides RESTful endpoints for syncing user data and managing user profiles.

## Future Improvements

- Add more detailed analytics and sales metrics for sellers.
- Implement product listing management for digital goods.
- Enhance security and error handling.
- Integrate additional features like payment processing, order management, and more.
