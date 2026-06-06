import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiThumbsUp } from 'react-icons/fi';
import apiClient from '../utils/api';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import Rating from '../components/Rating';
import { toast } from 'react-toastify';

const WriteReview = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.comment.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      // This would typically send to API
      toast.success('Review submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
      >
        <FiArrowLeft />
        <span>Back</span>
      </button>

      <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8>
        Share your experience with this product
      </p>

      <form onSubmit={handleSubmit} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 space-y-6`}>
        {/* Rating */}
        <div>
          <label className="block text-lg font-semibold mb-3">Rating</label>
          <Rating
            value={formData.rating}
            onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
            interactive={true}
            size="lg"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-lg font-semibold mb-2">Review Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Summarize your experience"
            maxLength="100"
            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`}
          />
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {formData.title.length}/100
          </p>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-lg font-semibold mb-2">Your Review</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Share your detailed thoughts about this product..."
            rows="6"
            maxLength="1000"
            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none`}
          />
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {formData.comment.length}/1000
          </p>
        </div>

        {/* Info */}
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} border ${isDarkMode ? 'border-gray-600' : 'border-blue-200'} rounded p-4`}>
          <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
            ✓ Only verified purchases can leave reviews
          </p>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center space-x-2"
          >
            <FiThumbsUp size={18} />
            <span>{loading ? 'Submitting...' : 'Submit Review'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`px-6 py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteReview;
