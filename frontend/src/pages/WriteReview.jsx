import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiThumbsUp, FiCheckCircle } from 'react-icons/fi';
import apiClient from '../utils/api';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import Rating from '../components/Rating';
import { toast } from 'react-toastify';

const WriteReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productName = searchParams.get('product') || 'Selected Item';
  const { isAuthenticated } = useAuth();
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
      toast.error('Please fill in all review fields.');
      return;
    }

    try {
      setLoading(true);
      toast.success('Thank you! Your review has been submitted for approval.');
      setTimeout(() => navigate('/dashboard'), 1500);
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-brand-500 hover:text-brand-600 mb-8 font-semibold text-xs transition"
      >
        <FiArrowLeft size={16} />
        <span>Back</span>
      </button>

      <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">Customer Feedback</span>
      <h1 className="text-3xl font-bold font-display tracking-tight text-zinc-900 dark:text-white mt-1 mb-2">
        Write a Product Review
      </h1>
      <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} mb-8`}>
        Share your experience for <strong className="text-brand-500 font-semibold">{productName}</strong>
      </p>

      <form
        onSubmit={handleSubmit}
        className={`border rounded-3xl p-6 sm:p-8 space-y-6 shadow-premium ${
          isDarkMode ? 'bg-darkCard/40 border-white/5 backdrop-blur-md shadow-glass-dark' : 'bg-white border-zinc-200'
        }`}
      >
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold mb-3 font-display">Select Overall Rating</label>
          <Rating
            value={formData.rating}
            onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
            interactive={true}
            size="lg"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Review Headline</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Incredible build quality & super fast dispatch!"
            maxLength="100"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-1 focus:ring-brand-500 ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
            }`}
          />
          <p className="text-[10px] text-zinc-400 mt-1 font-mono text-right">
            {formData.title.length}/100
          </p>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Detailed Comments</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="What did you like or dislike about this product? How was the packaging and delivery?"
            rows="5"
            maxLength="1000"
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-1 focus:ring-brand-500 resize-none ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
            }`}
          />
          <p className="text-[10px] text-zinc-400 mt-1 font-mono text-right">
            {formData.comment.length}/1000
          </p>
        </div>

        {/* Info Badge */}
        <div className="flex items-center space-x-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
          <FiCheckCircle size={16} />
          <span>Verified purchase review guarantee</span>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:bg-zinc-400 text-white font-bold py-3.5 rounded-xl text-xs shadow-glow-primary transition flex items-center justify-center space-x-2"
          >
            <FiThumbsUp size={16} />
            <span>{loading ? 'Submitting...' : 'Submit Review'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`px-5 py-3.5 rounded-xl border text-xs font-semibold transition ${
              isDarkMode ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-300' : 'border-zinc-300 hover:bg-zinc-100 text-zinc-700'
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteReview;
