'use client';

import { useState } from 'react';
import { 
  STONE_CATALOG, 
  CATEGORIES, 
  KERALA_DISTRICTS, 
  DISTRICT_RATES,
  getStoneRate,
  OWNER_WHATSAPP_NUMBER, 
  OWNER_PHONE_DISPLAY 
} from './data/catalog';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCode, setSelectedCode] = useState(STONE_CATALOG[0].code);
  const [sqft, setSqft] = useState(1800);
  const [selectedDistrictId, setSelectedDistrictId] = useState('Palakkad');
  
  // Interactive UI states
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [modalStone, setModalStone] = useState(null);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const currentDistrictObj = KERALA_DISTRICTS.find((d) => d.id === selectedDistrictId) || KERALA_DISTRICTS[0];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const toggleWishlist = (code, e) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const next = !prev[code];
      showToast(next ? 'Added to your wishlist' : 'Removed from wishlist');
      return { ...prev, [code]: next };
    });
  };

  const handleAddToCart = (stone, customPieces = null, e = null) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const defaultPieces = customPieces || (stone.slabArea === 9 ? 100 : 200);
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.code === stone.code);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], pieces: next[idx].pieces + defaultPieces };
        showToast(`Updated "${stone.name}" (+${defaultPieces} pcs) in cart`);
        return next;
      } else {
        showToast(`Added "${stone.name}" (${defaultPieces} pcs) to cart`);
        return [...prev, { ...stone, pieces: defaultPieces }];
      }
    });
  };

  const handleUpdateCartQty = (code, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.code === code) {
          const newPieces = Math.max(25, item.pieces + delta);
          return { ...item, pieces: newPieces };
        }
        return item;
      })
    );
  };

  const handleSetCartPieces = (code, val) => {
    const parsed = Math.max(1, parseInt(val, 10) || 0);
    setCart((prev) => prev.map((item) => (item.code === code ? { ...item, pieces: parsed } : item)));
  };

  const handleRemoveFromCart = (code) => {
    setCart((prev) => prev.filter((item) => item.code !== code));
    showToast('Removed stone from cart');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Cart cleared');
  };

  // Cart aggregate totals
  const cartTotalPieces = cart.reduce((sum, item) => sum + item.pieces, 0);
  const cartTotalSqft = cart.reduce((sum, item) => sum + (item.pieces * item.slabArea), 0);
  const cartTotalWeightTons = (cart.reduce((sum, item) => sum + (item.pieces * item.slabArea * item.weightPerSqftKg), 0) / 1000).toFixed(1);
  const cartTotalCost = cart.reduce((sum, item) => {
    const rate = getStoneRate(item.code, selectedDistrictId);
    return sum + (item.pieces * item.slabArea * rate);
  }, 0);

  let cartLorryText = '10-Wheeler Lorry (Direct site delivery via Walayar/AP)';
  if (cartTotalWeightTons <= 11) {
    cartLorryText = '6-Wheeler Lorry (~10T - For narrow/interior Kerala roads)';
  } else if (cartTotalWeightTons <= 24) {
    cartLorryText = '10-Wheeler Lorry (Direct site delivery via Walayar/AP)';
  } else {
    cartLorryText = '12-Wheeler Heavy Multi-Axle (~30-35T direct site dispatch)';
  }

  const handleOrderCartWhatsApp = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty. Add stones first!');
      return;
    }

    const itemsLines = cart.map((item, idx) => {
      const rate = getStoneRate(item.code, selectedDistrictId);
      const itemSqft = item.pieces * item.slabArea;
      const itemCost = itemSqft * rate;
      return `${idx + 1}. ORDER ${item.size} ${item.thickness} ${item.finish} ${item.pieces} pcs (${itemSqft.toLocaleString()} sq.ft) @ ₹${rate}/sqft = ₹${Math.round(itemCost).toLocaleString()}`;
    }).join('\n');

    const msg =
`*KADAPA BLACK STONE — CART CONSIGNMENT ORDER*
━━━━━━━━━━━━━━━━━━━━━
📍 *Delivery District:* ${currentDistrictObj.name}

📦 *Consignment Breakdown (${cart.length} Varieties):*
${itemsLines}

━━━━━━━━━━━━━━━━━━━━━
📊 *Consignment Totals:*
• Total Slabs: ${cartTotalPieces.toLocaleString()} pcs
• Total Area: ${Math.round(cartTotalSqft).toLocaleString()} sq.ft
• Est. Consignment Weight: ~${cartTotalWeightTons} Tons
• Recommended Vehicle: ${cartLorryText}
💰 *Estimated Grand Total:* *₹${Math.round(cartTotalCost).toLocaleString()}*
━━━━━━━━━━━━━━━━━━━━━

Hello Transia Transport, I have created this consignment cart order on your catalog website. Please confirm availability and lorry loading schedule!`;

    window.open(`https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Calculator logic using district rates
  const selectedStone = STONE_CATALOG.find((s) => s.code === selectedCode) || STONE_CATALOG[0];
  const activeRate = getStoneRate(selectedStone.code, selectedDistrictId);
  const safeSqft = Math.max(1, parseFloat(sqft) || 0);
  const slabs = Math.ceil(safeSqft / selectedStone.slabArea);
  const totalCost = safeSqft * activeRate;
  const weightTons = ((safeSqft * selectedStone.weightPerSqftKg) / 1000).toFixed(1);

  let lorryText = '10-Wheeler Lorry (Direct site delivery via Walayar/AP)';
  if (weightTons <= 11) {
    lorryText = '6-Wheeler Lorry (~10T - For narrow/interior Kerala roads)';
  } else if (weightTons <= 24) {
    lorryText = '10-Wheeler Lorry (Direct site delivery via Walayar/AP)';
  } else {
    lorryText = '12-Wheeler Heavy Multi-Axle (~30-35T direct site dispatch)';
  }

  const handleSelectStone = (code) => {
    setSelectedCode(code);
    const calcSection = document.getElementById('calculator-section');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppOrder = (stoneObj = selectedStone, customSqft = safeSqft) => {
    const s = stoneObj;
    const rate = getStoneRate(s.code, selectedDistrictId);
    const pieces = Math.ceil(customSqft / s.slabArea);
    const total = customSqft * rate;
    const weight = ((customSqft * s.weightPerSqftKg) / 1000).toFixed(1);

    const msg = `*KADAPA BLACK STONE — KERALA DIRECT ORDER*\n` +
      `--------------------------------\n` +
      `🪨 *Stone Variety:* ${s.name} ${s.malayalamTitle}\n` +
      `📐 *Dimensions:* ${s.sizeDisplay} • ${s.thickness} (${s.finishBadge})\n` +
      `🏡 *Ideal Application:* ${s.keralaUse}\n` +
      `📊 *Required Area:* ${Math.round(customSqft).toLocaleString()} sq.ft (~${pieces} slabs)\n` +
      `⚖️ *Estimated Weight:* ~${weight} Tons\n` +
      `📍 *Kerala Delivery District:* ${currentDistrictObj.name}\n` +
      `💰 *District Selling Rate:* ₹${rate}/sq.ft\n` +
      `💵 *Estimated Total Cost:* ₹${Math.round(total).toLocaleString()}\n` +
      `🚚 *Lorry Recommendation:* ${lorryText}\n` +
      `--------------------------------\n` +
      `Hello, I would like to book this order for site delivery. Please confirm dispatch schedule.`;

    window.open(`https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Filter & sort logic
  let displayedStones = [...STONE_CATALOG];
  if (selectedCategory !== 'all') {
    displayedStones = displayedStones.filter((s) => s.category === selectedCategory);
    if (displayedStones.length === 0) displayedStones = [...STONE_CATALOG];
  }

  if (sortBy === 'price-low') {
    displayedStones.sort((a, b) => getStoneRate(a.code, selectedDistrictId) - getStoneRate(b.code, selectedDistrictId));
  } else if (sortBy === 'price-high') {
    displayedStones.sort((a, b) => getStoneRate(b.code, selectedDistrictId) - getStoneRate(a.code, selectedDistrictId));
  }

  return (
    <>
      {/* Toast Notice */}
      {toastMessage && (
        <div className="toast-notice">
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* 1. Header Navigation */}
      <header className="main-header">
        <div className="container header-container">
          {/* Brand Logo */}
          <div className="brand-identity">
            <div className="brand-icon-leaf">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <div className="brand-text-wrap">
              <span className="brand-title">KADAPA BLACK STONE</span>
              <span className="brand-subtitle">KERALA DIRECT SUPPLY &amp; TRANSPORT</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav>
            <ul className="nav-links">
              <li className="nav-link-item active">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span>Home</span>
              </li>
              <li className="nav-link-item" onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Catalog</span>
              </li>
              <li className="nav-link-item" onClick={() => setShowRatesModal(true)}>
                <span>District Rates</span>
              </li>
              <li className="nav-link-item" onClick={() => document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Transport</span>
              </li>
              <li className="nav-link-item" onClick={() => handleWhatsAppOrder()}>
                <span>Contact</span>
              </li>
            </ul>
          </nav>

          {/* Action Buttons */}
          <div className="header-actions">
            <a 
              href={`https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=Hello%20Kadapa%20Stone%2C%20I%20am%20inquiry%20for%20Kerala%20site%20delivery.`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-header-wa"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span>WhatsApp</span>
                <span className="wa-number">{OWNER_PHONE_DISPLAY}</span>
              </div>
            </a>

            <div className="cart-btn-wrap" onClick={() => setShowCartModal(true)} title="View Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <span className="cart-badge">{cart.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-top-row">
            {/* Hero Left Content */}
            <div className="hero-left-content">
              <div className="hero-tag">PREMIUM QUALITY</div>
              <h1 className="hero-title">
                Kerala Stone Catalog <br />
                &amp; Quarry Rates
              </h1>
              <p className="hero-malayalam">
                കേരളത്തിന്റെ വീടുകൾക്ക് അനുയോജ്യമായ പ്രകൃതി കല്ലുകൾ നേരിട്ട് ക്വാറിയിൽ നിന്ന്.
              </p>
            </div>

            {/* Hero Right Visuals (Layered Tilted Cards) */}
            <div className="hero-visual-wrap">
              <div className="hero-photo-card card-secondary">
                <img src="/p1.jpeg" alt="Kadapa courtyard installation" className="hero-photo-img" />
              </div>
              <div className="hero-photo-card card-main">
                <img src="/s2.jpeg" alt="Calibrated Kadapa Stone" className="hero-photo-img" />
                <div className="hero-sticker-note">
                  <div className="hero-sticker-text">
                    നിങ്ങളുടെ സ്വപ്ന ഭവനത്തിന് പ്രകൃതി കല്ലുകൾ...
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Pill Bar - Full width row */}
          <div className="hero-features-bar">
            <div className="feature-pill-item">
              <span className="feat-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </span>
              <span>100% Natural Stone</span>
            </div>
            <div className="feat-divider" />
            <div className="feature-pill-item">
              <span className="feat-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </span>
              <span>Kerala Direct Supply</span>
            </div>
            <div className="feat-divider" />
            <div className="feature-pill-item">
              <span className="feat-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </span>
              <span>Safe &amp; Secure Transport</span>
            </div>
            <div className="feat-divider" />
            <div className="feature-pill-item">
              <span className="feat-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                </svg>
              </span>
              <span>Best Price Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Filter Ribbon */}
      <section className="categories-section container">
        <div className="categories-bar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <div 
                key={cat.id} 
                className={`category-item ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.icon === 'grid' ? (
                  <div className="cat-icon-grid">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                  </div>
                ) : (
                  <img src={cat.img} alt={cat.name} className="cat-thumb" />
                )}
                <div className="cat-text-wrap">
                  <span className="cat-name">{cat.name}</span>
                  <span className="cat-malayalam">{cat.malayalam}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Stone Catalog */}
      <section className="catalog-section container" id="catalog-section">
        <div className="catalog-header">
          <div className="catalog-heading-wrap">
            <h2 className="catalog-heading">Featured Stone Catalog</h2>
            <div className="catalog-heading-line" />
          </div>

          <div className="catalog-controls">
            {/* Kerala District Switcher for Prices */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ffffff', border: '1px solid #e5e9e6', borderRadius: 8, padding: '4px 10px' }}>
              <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>📍 District:</span>
              <select 
                style={{ border: 'none', background: 'transparent', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', outline: 'none', cursor: 'pointer' }}
                value={selectedDistrictId}
                onChange={(e) => {
                  setSelectedDistrictId(e.target.value);
                  showToast(`Updated pricing for ${e.target.value}`);
                }}
              >
                {KERALA_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <button 
              type="button" 
              className="btn-filter"
              style={{ background: '#f8fafc', borderColor: '#cbd5e1', color: '#0f172a' }}
              onClick={() => setShowRatesModal(true)}
            >
              <span>📊 Rates Table</span>
            </button>

            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Sort by: Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <button type="button" className="btn-filter" onClick={() => showToast(`Filtered for ${currentDistrictObj.name}`)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14"/>
                <line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/>
                <line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/>
                <line x1="9" y1="8" x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="stone-cards-grid">
          {displayedStones.map((stone) => {
            const isWish = !!wishlist[stone.code];
            const currentPrice = getStoneRate(stone.code, selectedDistrictId);

            return (
              <div 
                key={stone.code} 
                className="stone-card"
                onClick={() => handleSelectStone(stone.code)}
              >
                {/* Image Container */}
                <div className="stone-img-container">
                  <img src={stone.image} alt={stone.name} className="stone-card-img" loading="lazy" />
                  
                  {/* Badges Overlay */}
                  <div className="badges-overlay">
                    <span className="dim-pill">{stone.sizeDisplay}</span>
                    <span className="dim-pill">{stone.thickness}</span>
                    <span className={`finish-pill ${stone.badgeVariant}`}>{stone.finishBadge}</span>
                  </div>

                  {/* Wishlist Button */}
                  <button 
                    type="button" 
                    className={`btn-wishlist ${isWish ? 'active' : ''}`}
                    onClick={(e) => toggleWishlist(stone.code, e)}
                    aria-label="Wishlist"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={isWish ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>

                {/* Card Body */}
                <div className="stone-card-body">
                  <div className="card-title-group">
                    <div className="stone-card-title">{stone.name}</div>
                    <div className="stone-card-malayalam">{stone.malayalamTitle}</div>
                  </div>

                  <div className="price-row">
                    <span className="stone-price">₹{currentPrice}</span>
                    <span className="stone-unit">/sq.ft</span>
                    {stone.isBestValue && (
                      <span className="best-value-pill">Best Value</span>
                    )}
                  </div>

                  <div className="card-use-case">
                    <strong>Ideal for:</strong> {stone.keralaUse}
                  </div>

                  {/* Action Buttons */}
                  <div className="card-actions-row">
                    <button 
                      type="button" 
                      className="btn-view-details"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalStone(stone);
                      }}
                    >
                      <span>View Details</span>
                      <span>&rarr;</span>
                    </button>

                    <button 
                      type="button" 
                      className="btn-card-cart"
                      onClick={(e) => handleAddToCart(stone, null, e)}
                      aria-label="Add to cart"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="8" cy="21" r="1"/>
                        <circle cx="19" cy="21" r="1"/>
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Card 7: Quarry Promo Banner Card */}
          <div className="quarry-promo-card">
            <div>
              <div className="promo-title-malayalam">
                കേരളത്തിന്റെ <br />
                ക്വാറികളിൽ നിന്ന് <br />
                നേരിട്ട് നിങ്ങളുടെ വീട്ടിലേക്ക്
              </div>
              <div className="promo-loc-pill">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                </svg>
                <span>Direct from Kerala Quarries</span>
              </div>
            </div>

            <div className="promo-bottom-wrap">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="#34d399" opacity="0.9">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <button 
                type="button" 
                className="btn-explore-promo"
                onClick={() => handleSelectStone(STONE_CATALOG[0].code)}
              >
                <span>Explore More</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust Guarantee Bar */}
      <section className="trust-bar-section container" id="trust-section">
        <div className="trust-bar-container">
          <div className="trust-item">
            <div className="trust-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              </svg>
            </div>
            <span className="trust-text">Kerala's Trusted<br />Stone Supplier</span>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <span className="trust-text">On-Time Delivery<br />Across Kerala</span>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                <path d="M12 18V6"/>
              </svg>
            </div>
            <span className="trust-text">Transparent<br />Quarry Rates</span>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
              </svg>
            </div>
            <span className="trust-text">Dedicated<br />Customer Support</span>
          </div>
        </div>
      </section>

      {/* 6. Lorry Load Calculator & Instant Order */}
      <section className="calculator-section container" id="calculator-section">
        <div className="calculator-card">
          {/* Left Column: Media thumbnail & copy */}
          <div className="calc-left-col">
            <div className="calc-media-card">
              <img src="/s3.jpeg" alt="Kadapa heavy block slabs" className="calc-block-img" />
              <div className="calc-leaves-icon">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="#34d399">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
            </div>

            <div className="calc-text-block">
              <span className="calc-tag">GET INSTANT QUOTE</span>
              <h3 className="calc-main-title">Lorry Load Calculator &amp; Instant Order</h3>
              <p className="calc-malayalam-desc">
                ലോറി ലോഡ് കാൽക്കുലേറ്റർ ഉപയോഗിച്ച് വിലയും ഭാരവും ഉടൻ കണക്കാക്കൂ.
              </p>
              <div className="best-supply-cursive">
                <span>🌿</span> Kerala's Best Stone Supply
              </div>
            </div>
          </div>

          {/* Right Column: Controls, live rate & WhatsApp CTA */}
          <div className="calc-right-col">
            <div className="calc-form">
              <div className="calc-form-group">
                <label className="calc-label" htmlFor="calcStoneSelect">Selected Variety</label>
                <select 
                  id="calcStoneSelect"
                  className="calc-select"
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                >
                  {STONE_CATALOG.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.sizeDisplay} - {s.thickness} - {s.finishBadge} (₹{getStoneRate(s.code, selectedDistrictId)}/sqft)
                    </option>
                  ))}
                </select>
              </div>

              <div className="calc-form-group">
                <label className="calc-label" htmlFor="calcAreaInput">Required Area (Sq.Ft)</label>
                <input 
                  type="number" 
                  id="calcAreaInput"
                  className="calc-input"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                  min="50"
                  step="50"
                />
              </div>

              <div className="calc-form-group">
                <label className="calc-label" htmlFor="calcDistrictSelect">Kerala Delivery District</label>
                <select 
                  id="calcDistrictSelect"
                  className="calc-select"
                  value={selectedDistrictId}
                  onChange={(e) => {
                    setSelectedDistrictId(e.target.value);
                    showToast(`Updated rate for ${e.target.value}`);
                  }}
                >
                  {KERALA_DISTRICTS.map((dist) => (
                    <option key={dist.id} value={dist.id}>{dist.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Live Cost & Weight Summary */}
            <div className="calc-cost-pill">
              <div className="calc-cost-val">₹{Math.round(totalCost).toLocaleString()}</div>
              <div className="calc-cost-breakdown">
                @ ₹{activeRate}/sqft ({selectedDistrictId}) &bull; {slabs.toLocaleString()} pcs &bull; ~{weightTons} Tons
              </div>
            </div>

            {/* WhatsApp Direct Order CTA */}
            <button 
              type="button" 
              className="btn-place-wa-order"
              onClick={() => handleWhatsAppOrder()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
              <span>Place Order on WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="main-footer">
        <div className="container">
          <div className="footer-top-row">
            {/* Brand */}
            <div className="brand-identity">
              <div className="brand-icon-leaf">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <div className="brand-text-wrap">
                <span className="brand-title" style={{ fontSize: '1rem' }}>KADAPA BLACK STONE</span>
                <span className="brand-subtitle" style={{ fontSize: '0.6rem' }}>KERALA DIRECT SUPPLY &amp; TRANSPORT</span>
              </div>
            </div>

            {/* Links */}
            <ul className="footer-nav">
              <li><a href="#">Home</a></li>
              <li><a href="#catalog-section">Catalog</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setShowRatesModal(true); }}>District Rates</a></li>
              <li><a href="#calculator-section">Transport</a></li>
              <li><a href="#calculator-section">Contact</a></li>
            </ul>

            {/* Social & Tagline */}
            <div className="footer-social-group">
              <a 
                href={`https://wa.me/${OWNER_WHATSAPP_NUMBER}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon-btn"
                aria-label="WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.94 5.86L2.87 22l4.28-1.12C8.72 21.57 10.31 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
              </a>

              <span className="footer-slogan">
                <span>🍃</span> പ്രകൃതിയുടെ സൗന്ദര്യം... നിങ്ങളുടെ വീട്ടിൽ...
              </span>
            </div>
          </div>

          <div className="footer-bottom-line">
            Kadapa Black Stone &bull; Kerala Direct Lorry Transit via Transport &bull; {OWNER_PHONE_DISPLAY}
          </div>
        </div>
      </footer>

      {/* 8. Details Modal */}
      {modalStone && (
        <div className="modal-overlay" onClick={() => setModalStone(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="modal-close-btn"
              onClick={() => setModalStone(null)}
            >
              &times;
            </button>
            <img src={modalStone.image} alt={modalStone.name} className="modal-header-img" />
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{modalStone.name}</h3>
                  <div style={{ color: '#059669', fontWeight: 700, fontSize: '1rem' }}>{modalStone.malayalamTitle}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>
                    ₹{getStoneRate(modalStone.code, selectedDistrictId)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>/sq.ft ({selectedDistrictId})</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <span className="dim-pill" style={{ background: '#0f172a' }}>{modalStone.sizeDisplay}</span>
                <span className="dim-pill" style={{ background: '#0f172a' }}>{modalStone.thickness}</span>
                <span className={`finish-pill ${modalStone.badgeVariant}`}>{modalStone.finishBadge}</span>
                <span className="dim-pill" style={{ background: '#047857' }}>~{modalStone.weightPerSqftKg} kg/sqft</span>
              </div>

              <p style={{ color: '#334155', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 20 }}>
                <strong>Best Suited For:</strong> {modalStone.keralaUse}. Engineered for Kerala's wet tropical climate with high anti-slip durability, resistance to monsoon algae, and traditional natural texture.
              </p>

              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  type="button" 
                  className="btn-place-wa-order"
                  style={{ flex: 1, padding: '11px' }}
                  onClick={() => {
                    handleWhatsAppOrder(modalStone, safeSqft);
                    setModalStone(null);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                  <span>Order on WhatsApp</span>
                </button>

                <button 
                  type="button" 
                  className="btn-add-cart-calc"
                  style={{ padding: '9px 14px', fontSize: '0.86rem' }}
                  onClick={() => {
                    handleAddToCart(modalStone, null);
                    setModalStone(null);
                  }}
                >
                  + Add to Cart
                </button>
                <button 
                  type="button" 
                  className="btn-view-details"
                  style={{ background: '#e2e8f0', color: '#1e293b' }}
                  onClick={() => {
                    handleSelectStone(modalStone.code);
                    setModalStone(null);
                  }}
                >
                  Load in Calculator
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. District Rates Table Modal (Direct reproduction of screenshot) */}
      {showRatesModal && (
        <div className="modal-overlay" onClick={() => setShowRatesModal(false)}>
          <div className="modal-content" style={{ maxWidth: 840, background: '#121214', color: '#f8fafc', padding: 24, borderRadius: 16 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>District Rates</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: 4 }}>
                  Selling rate per sqft by Kerala district — drives buyer order pricing
                </p>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                style={{ position: 'static', background: 'rgba(255,255,255,0.1)' }}
                onClick={() => setShowRatesModal(false)}
              >
                &times;
              </button>
            </div>

            <div style={{ overflowX: 'auto', marginBottom: 20 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textAlign: 'left', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
                    <th style={{ padding: '12px 14px' }}>STONE SPEC</th>
                    <th style={{ padding: '12px 14px' }}>PALAKKAD</th>
                    <th style={{ padding: '12px 14px' }}>WAYANAD</th>
                    <th style={{ padding: '12px 14px' }}>KANNUR</th>
                    <th style={{ padding: '12px 14px' }}>THRISSUR</th>
                    <th style={{ padding: '12px 14px' }}>ERNAKULAM</th>
                  </tr>
                </thead>
                <tbody>
                  {STONE_CATALOG.map((s) => (
                    <tr key={s.code} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#f1f5f9' }}>
                        {s.sizeDisplay}&nbsp;·&nbsp;{s.thickness}&nbsp;
                        <span style={{ color: '#94a3b8', fontWeight: 400 }}>{s.finish}</span>
                      </td>
                      <td style={{ padding: '14px', color: '#fbbf24', fontWeight: 700 }}>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>₹ </span>{DISTRICT_RATES['Palakkad'][s.code]}
                      </td>
                      <td style={{ padding: '14px', color: '#fbbf24', fontWeight: 700 }}>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>₹ </span>{DISTRICT_RATES['Wayanad'][s.code]}
                      </td>
                      <td style={{ padding: '14px', color: '#fbbf24', fontWeight: 700 }}>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>₹ </span>{DISTRICT_RATES['Kannur'][s.code]}
                      </td>
                      <td style={{ padding: '14px', color: '#fbbf24', fontWeight: 700 }}>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>₹ </span>{DISTRICT_RATES['Thrissur'][s.code]}
                      </td>
                      <td style={{ padding: '14px', color: '#fbbf24', fontWeight: 700 }}>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>₹ </span>{DISTRICT_RATES['Ernakulam'][s.code]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
              <span>Example: 2x2 · 50mm polish sells at ₹40 in Palakkad, ₹48 in Wayanad, ₹50 in Kannur.</span>
              <button 
                type="button" 
                style={{ background: '#10b981', color: '#ffffff', border: 'none', padding: '6px 16px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
                onClick={() => setShowRatesModal(false)}
              >
                Close Table
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* Floating Cart Pill (Bottom Right) */}
      {cart.length > 0 && (
        <div 
          className="floating-cart-pill"
          onClick={() => setShowCartModal(true)}
          title="Open Cart"
        >
          <div className="floating-cart-left">
            <div className="floating-cart-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <span className="floating-cart-count">{cart.length}</span>
            </div>
            <div>
              <div className="floating-cart-title">{cartTotalPieces.toLocaleString()} Slabs &bull; {Math.round(cartTotalSqft).toLocaleString()} sqft</div>
              <div className="floating-cart-sub">Est. ₹{Math.round(cartTotalCost).toLocaleString()} ({selectedDistrictId})</div>
            </div>
          </div>
          <div className="floating-cart-action">
            <span>View Cart</span>
            <span className="floating-cart-arrow">&rarr;</span>
          </div>
        </div>
      )}

      {/* Cart Modal / Drawer */}
      {showCartModal && (
        <div className="modal-overlay" onClick={() => setShowCartModal(false)}>
          <div className="modal-content cart-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="cart-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="cart-header-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2">
                    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Your Consignment Cart</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {cart.length} stone {cart.length === 1 ? 'variety' : 'varieties'} selected
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowCartModal(false)}
                style={{ position: 'static' }}
              >
                &times;
              </button>
            </div>

            {/* District selector bar inside cart */}
            <div className="cart-district-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#047857' }}>📍 Delivery District:</span>
                <select 
                  value={selectedDistrictId}
                  onChange={(e) => setSelectedDistrictId(e.target.value)}
                  className="cart-district-select"
                >
                  {KERALA_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Rates auto-adjusted for site transit</span>
            </div>

            {/* Cart Items List */}
            <div className="cart-items-body">
              {cart.length === 0 ? (
                <div className="cart-empty-state">
                  <div className="cart-empty-icon">🛒</div>
                  <h4>Your cart is empty</h4>
                  <p>Select stone varieties from the catalog to build your consignment load.</p>
                  <button 
                    type="button" 
                    className="btn-view-details" 
                    style={{ background: '#10b981', color: '#ffffff', border: 'none', margin: '14px auto 0' }}
                    onClick={() => {
                      setShowCartModal(false);
                      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Browse Stone Catalog
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cart.map((item) => {
                    const rate = getStoneRate(item.code, selectedDistrictId);
                    const itemSqft = item.pieces * item.slabArea;
                    const itemCost = itemSqft * rate;
                    const itemWeight = ((itemSqft * item.weightPerSqftKg) / 1000).toFixed(1);

                    return (
                      <div key={item.code} className="cart-item-card">
                        <img src={item.image} alt={item.name} className="cart-item-thumb" />
                        <div className="cart-item-info">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div className="cart-item-name">{item.name}</div>
                              <div className="cart-item-badges">
                                <span className="dim-pill" style={{ fontSize: '0.68rem', padding: '1px 6px', background: '#0f172a' }}>{item.sizeDisplay}</span>
                                <span className="dim-pill" style={{ fontSize: '0.68rem', padding: '1px 6px', background: '#0f172a' }}>{item.thickness}</span>
                                <span className="dim-pill" style={{ fontSize: '0.68rem', padding: '1px 6px', background: '#047857' }}>{item.finishBadge}</span>
                              </div>
                            </div>
                            <button 
                              type="button" 
                              className="btn-remove-item"
                              title="Remove stone"
                              onClick={() => handleRemoveFromCart(item.code)}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>

                          <div className="cart-item-controls-row">
                            {/* Stepper */}
                            <div className="cart-stepper-wrap">
                              <button 
                                type="button" 
                                className="btn-stepper"
                                onClick={() => handleUpdateCartQty(item.code, -25)}
                                disabled={item.pieces <= 25}
                              >
                                &minus;
                              </button>
                              <input 
                                type="number"
                                className="cart-qty-input"
                                value={item.pieces}
                                min="25"
                                step="25"
                                onChange={(e) => handleSetCartPieces(item.code, e.target.value)}
                              />
                              <button 
                                type="button" 
                                className="btn-stepper"
                                onClick={() => handleUpdateCartQty(item.code, 25)}
                              >
                                &#43;
                              </button>
                              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>pcs</span>
                            </div>

                            {/* Area & Price */}
                            <div style={{ textAlign: 'right' }}>
                              <div className="cart-item-price">₹{Math.round(itemCost).toLocaleString()}</div>
                              <div className="cart-item-rate">
                                {itemSqft.toLocaleString()} sqft &bull; @ ₹{rate}/sqft (~{itemWeight}T)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Footer Summary & Place Order */}
            {cart.length > 0 && (
              <div className="cart-modal-footer">
                {/* Summary stats */}
                <div className="cart-summary-box">
                  <div className="cart-summary-row">
                    <span className="c-label">Total Slabs Count</span>
                    <span className="c-val">{cartTotalPieces.toLocaleString()} pieces</span>
                  </div>
                  <div className="cart-summary-row">
                    <span className="c-label">Total Consignment Area</span>
                    <span className="c-val">{Math.round(cartTotalSqft).toLocaleString()} sq.ft</span>
                  </div>
                  <div className="cart-summary-row">
                    <span className="c-label">Est. Total Weight</span>
                    <span className="c-val">~{cartTotalWeightTons} Tons</span>
                  </div>
                  <div className="cart-summary-row" style={{ color: '#059669', fontWeight: 600 }}>
                    <span className="c-label">Recommended Lorry</span>
                    <span className="c-val" style={{ textAlign: 'right', fontSize: '0.78rem' }}>{cartLorryText}</span>
                  </div>
                  <div className="cart-summary-total-row">
                    <span>Estimated Grand Total</span>
                    <span className="cart-grand-total">₹{Math.round(cartTotalCost).toLocaleString()}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <button 
                  type="button" 
                  className="btn-place-wa-order"
                  style={{ width: '100%', padding: '13px 18px', fontSize: '1rem', borderRadius: 12 }}
                  onClick={handleOrderCartWhatsApp}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                  <span>Order Cart on WhatsApp</span>
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <button 
                    type="button" 
                    className="btn-clear-cart"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </button>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Direct dispatch hotline: {OWNER_PHONE_DISPLAY}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10. Mobile Bottom App Bar (iPhone 12 Pro Max & Mobile Screens) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <button 
          type="button" 
          className="bottom-nav-item active"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>Home</span>
        </button>

        <button 
          type="button" 
          className="bottom-nav-item"
          onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Catalog"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>Catalog</span>
        </button>

        <button 
          type="button" 
          className="bottom-nav-item"
          onClick={() => setShowCartModal(true)}
          aria-label="Cart"
          style={{ position: 'relative' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          {cart.length > 0 && (
            <span style={{ position: 'absolute', top: -4, right: 14, background: '#10b981', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cart.length}
            </span>
          )}
          <span>Cart</span>
        </button>

        <button 
          type="button" 
          className="bottom-nav-item"
          onClick={() => document.getElementById('trust-section')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="About Us"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>About Us</span>
        </button>

        <button 
          type="button" 
          className="bottom-nav-item"
          onClick={() => document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Transport"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="1" y="3" width="15" height="13"/>
            <polygon points="16 8 20 8 23 11 23 16 16 16 8"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          <span>Transport</span>
        </button>

        <button 
          type="button" 
          className="bottom-nav-item"
          onClick={() => handleWhatsAppOrder()}
          aria-label="Contact"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>Contact</span>
        </button>
      </nav>
    </>
  );
}
