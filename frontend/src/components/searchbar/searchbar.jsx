import React, { useState } from 'react';
import './searchbar.css';

const Searchbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default Searchbar;
