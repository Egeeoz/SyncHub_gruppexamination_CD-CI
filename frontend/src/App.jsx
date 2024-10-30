import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginRegister from './components/loginregister/LoginRegister';
import Home from './pages/Home';
import Events from './pages/Events';
import Profile from './pages/Profile';
import './App.css';

const App = () => (
  <AuthProvider>
    <Router basename="/SyncHub_gruppexamination_CD-CI">
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <Events />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  </AuthProvider>
);

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default App;
