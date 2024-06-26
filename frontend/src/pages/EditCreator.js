// src/pages/EditCreator.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';

function EditCreator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const { data, error } = await supabase.from('creators').select('*').eq('id', id).single();
        if (error) {
          console.error('Error fetching creator:', error);
          setLoading(false);
          return;
        }
        if (data) {
          setName(data.name);
          setUrl(data.url);
          setDescription(data.description);
          setImageURL(data.imageURL);
        }
        setLoading(false);
      } catch (error) {
        console.error('Unexpected error fetching creator:', error);
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if URL is unique
    const { data, error } = await supabase.from('creators').select('*').eq('url', url).neq('id', id);
    if (data && data.length > 0) {
      setError('This URL is already in use. Please enter a unique URL.');
      return;
    }

    // If URL is unique, proceed to update the creator
    try {
      const { error } = await supabase.from('creators').update({
        name,
        url,
        description,
        imageURL
      }).eq('id', id);
      if (error) {
        console.error('Error updating creator:', error);
      } else {
        navigate(`/creator/${id}`);
      }
    } catch (error) {
      console.error('Unexpected error updating creator:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this creator?')) {
      return;
    }
    
    try {
      const { error } = await supabase.from('creators').delete().eq('id', id);
      if (error) {
        console.error('Error deleting creator:', error);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Unexpected error deleting creator:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit}>
        <h1 className='title'>Edit Creator</h1>
        {error && <p className="error-text">{error}</p>}
        <label>
          <h3 className='subtitle'> Name </h3>
          <input
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            required
          />
        </label>
        <label>
          <h3 className='subtitle'> URL </h3>
          <div className='info-text'>Provide at least one of the creator's social media links</div>
          <input
            placeholder="URL" 
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            maxLength={2048}
            required
          />
        </label>
        <label>
          <h3 className='subtitle'> Description </h3>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            required
          />
        </label>
        <label>
          <h3 className='subtitle'> Image URL</h3>
          <div className='info-text'>(Optional) Provide a link to an image of your creator. Be sure to include the http://</div>
          <input
            placeholder="Image URL (optional)"
            type="url"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            maxLength={2048}
          />
        </label>
        <button type="submit" className="button-primary">Update Creator</button>
      </form>
      <Link to="/" className="button-outline">Exit</Link>
      <button onClick={handleDelete} className="delete-button">Delete Creator</button>
    </div>
  );
}

export default EditCreator;
