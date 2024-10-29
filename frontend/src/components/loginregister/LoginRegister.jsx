import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css';

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    login(); // Call login function from context
    navigate('/home'); // Redirect to home after login
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleAuth}>
        <input type="text" placeholder="username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need to Register?' : 'Already have an account? Login'}
      </button>
    </div>
  );
}

export default LoginRegister;
