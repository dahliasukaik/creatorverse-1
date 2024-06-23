// src/pages/AddCreator.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';

function AddCreator() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('creators').insert([
        { name, url, description, imageURL }
      ]);
      if (error) {
        console.error('Error adding creator:', error);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Unexpected error adding creator:', error);
    }
  };

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit}>
        <h1 className='title'>Add New Creator</h1>
        <input
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          required
        />
        <input
          placeholder="URL"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          maxLength={2048}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          required
        />
        <input
          placeholder="Image URL (optional)"
          type="url"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          maxLength={2048}
        />
        <button type="submit" className="button-primary">Add Creator</button>
      </form>
      <Link to="/" className="button-outline">Exit</Link>
    </div>
  );
}

export default AddCreator;