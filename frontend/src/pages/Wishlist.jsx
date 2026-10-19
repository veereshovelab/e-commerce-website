import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuTrash2, LuShoppingCart, LuArrowLeft, LuHeart } from 'react-icons/lu';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist, moveAllWishlistToCart, addToCart } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-500/10 text-brand-500 mx-auto flex items-center justify-center mb-4">
          <LuHeart size={28} />
        </div>
        <h1 className="text-3xl font-bold font-display mb-2">Your Wishlist is Empty</h1>
        <p className={`${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} text-sm mb-8 max-w-md mx-auto`}>
          Explore our collection and click the heart icon on any product to save items for later.
        </p>
        <Link
          to="/products"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold shadow-glow-primary transition text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      toast.error(`${product.name} is currently out of stock.`);
      return;
    }
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart!`);
  };

  const handleMoveAllToCart = () => {
    const inStockItems = wishlist.filter(item => item.stock === undefined || item.stock > 0);
    const outOfStockCount = wishlist.length - inStockItems.length;

    if (inStockItems.length === 0) {
      toast.warning('All saved items are currently out of stock.');
      return;
    }

    inStockItems.forEach(item => addToCart(item, 1));

    if (outOfStockCount === 0) {
      clearWishlist();
      toast.success('All saved items moved to cart!');
    } else {
      // Remove only the in-stock items from wishlist
      inStockItems.forEach(item => removeFromWishlist(item._id));
      toast.info(`Moved ${inStockItems.length} in-stock ${inStockItems.length === 1 ? 'item' : 'items'} to cart (${outOfStockCount} out-of-stock retained in wishlist).`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-brand-500 hover:text-brand-600 mb-8 font-semibold text-xs transition-colors"
      >
        <LuArrowLeft size={16} />
        <span>Back to Store</span>
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">Saved Items</span>
          <h1 className="text-3xl font-bold font-display tracking-tight text-zinc-900 dark:text-white mt-1">
            My Wishlist ({wishlist.length} items)
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleMoveAllToCart}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-glow-primary transition"
          >
            <LuShoppingCart size={14} />
            <span>Move All to Cart</span>
          </button>
          <button
            onClick={() => {
              clearWishlist();
              toast.info('Wishlist cleared');
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-semibold transition"
          >
            <LuTrash2 size={14} />
            <span>Clear Wishlist</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          const isOutOfStock = product.stock === 0;
          const isLowStock = product.stock > 0 && product.stock <= 5;
          const discountPercent = product.discountPrice
            ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
            : 0;

          return (
            <div
              key={product._id}
              className={`border rounded-2xl overflow-hidden shadow-premium flex flex-col justify-between transition-all hover:-translate-y-1 ${
                isDarkMode ? 'bg-darkCard/40 border-white/5 shadow-glass-dark' : 'bg-white border-zinc-200'
              }`}
            >
              {/* Image */}
              <div>
                <div className="relative overflow-hidden bg-zinc-100 dark:bg-zinc-950 aspect-[4/3]">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {discountPercent > 0 && (
                    <div className="absolute top-3 left-3 bg-brand-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider shadow-glow-primary z-10">
                      -{discountPercent}% OFF
                    </div>
                  )}

                  {isLowStock && (
                    <div className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider z-10 flex items-center space-x-1 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>Only {product.stock} left!</span>
                    </div>
                  )}

                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-10">
                      <span className="text-white text-xs font-bold uppercase tracking-wider bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-700">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                    {product.brand || 'ShopSphere'}
                  </p>
                  <Link
                    to={`/products/${product._id}`}
                    className="font-semibold text-sm hover:text-brand-500 transition line-clamp-1 text-zinc-800 dark:text-zinc-100"
                  >
                    {product.name}
                  </Link>

                  <div className="flex items-baseline space-x-2 mt-2">
                    {product.discountPrice ? (
                      <>
                        <span className="text-base font-bold text-brand-500">${product.discountPrice}</span>
                        <span className={`text-xs line-through ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          ${product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-base font-bold text-zinc-800 dark:text-white">${product.price}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex space-x-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={isOutOfStock}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 ${
                    isOutOfStock
                      ? 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 cursor-not-allowed'
                      : 'bg-brand-500 hover:bg-brand-600 text-white shadow-glow-primary'
                  }`}
                >
                  <LuShoppingCart size={14} />
                  <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={() => {
                    removeFromWishlist(product._id);
                    toast.info('Removed from wishlist');
                  }}
                  className="p-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition"
                  title="Remove from wishlist"
                >
                  <LuTrash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
