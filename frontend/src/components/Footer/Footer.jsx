import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">&copy; {new Date().getFullYear()} SyncHub. All rights reserved.</p>
    </footer>
  );
}

export default Footer;