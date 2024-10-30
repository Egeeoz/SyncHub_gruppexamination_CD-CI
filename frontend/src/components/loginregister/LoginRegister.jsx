import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css';

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? 'https://dyiz5f0s9h.execute-api.eu-north-1.amazonaws.com/login'
        : 'https://dyiz5f0s9h.execute-api.eu-north-1.amazonaws.com/signup';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 404) {
        alert('Invalid username or password');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message); // Show error message
        return;
      }

      login(username);
      navigate('/home');
    } catch (error) {
      alert('An error occurred: ' + error.message); // Show error message
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need to Register?' : 'Already have an account? Login'}
      </button>
    </div>
  );
}

export default LoginRegister;
