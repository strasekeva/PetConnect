/*!

=========================================================
* Argon Design System React - v1.1.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

import Index from "views/Index.js";
import Landing from "views/examples/Landing.js";
import Login from "views/examples/Login.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import SledenjeZdravju from "views/examples/SledenjeZdravju.js";
import VeterinaryArticles from "components/Veterinary/VeterinaryArticles.js";
import ChatComponent from "components/Veterinary/Chat.js";
import Koledar from "views/examples/Koledar";

import { AuthProvider } from "components/Contexts/AuthContext.js";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/landing-page" element={<Landing />} />
          <Route path="/login-page" element={<Login />} />
          <Route path="/profile-page" element={<Profile />} />
          <Route path="/register-page" element={<Register />} />
          <Route path="/sledenje-zdravju" element={<SledenjeZdravju />} />
          <Route path="/koledar" element={<Koledar />} />
          <Route path="/clanki" element={<VeterinaryArticles />} />
          <Route path="/nasveti" element={<ChatComponent />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
