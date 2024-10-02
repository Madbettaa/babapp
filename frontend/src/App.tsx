import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './components/frontend/home';
import Add from './components/frontend/add';
import Edit from './components/frontend/edit';
import AddContribution from './components/frontend/addco';
import Login from './components/frontend/login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.post(`http://31.220.78.64:3366/verifyToken`, { token });
          setIsLoggedIn(true);
        } catch (error) {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    verifyToken();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true); // Update isLoggedIn state upon successful login
  };

  return (
    <div className="App bg-[white] h-screen flex justify-content-center place-items-center">
      <BrowserRouter>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<Add />} />
              <Route path="/addco/:personId" element={<AddContribution />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
