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
  const [selectedDistrictId, setSelectedDistrictId] = useState('Thrissur');
  
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
    const isPiece = stone.pricingUnit === 'piece';
    const defaultPieces = customPieces || (isPiece ? (stone.code === 'KB-CAB-44' ? 300 : 10) : (stone.slabArea >= 6 ? 100 : 200));
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
          const step = Math.abs(delta);
          const minQty = item.pricingUnit === 'piece' ? 1 : 25;
          const newPieces = Math.max(minQty, item.pieces + delta);
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
  const cartTotalSqft = cart.reduce((sum, item) => {
    return item.pricingUnit === 'piece'
      ? sum + (item.pieces * (item.slabArea || 0.11))
      : sum + (item.pieces * item.slabArea);
  }, 0);
  const cartTotalWeightTons = (cart.reduce((sum, item) => {
    if (item.pricingUnit === 'piece') {
      return sum + (item.pieces * (item.weightPerPieceKg || 1.4));
    }
    return sum + (item.pieces * item.slabArea * item.weightPerSqftKg);
  }, 0) / 1000).toFixed(1);
  const cartTotalCost = cart.reduce((sum, item) => {
    const rate = getStoneRate(item.code, selectedDistrictId);
    return item.pricingUnit === 'piece'
      ? sum + (item.pieces * rate)
      : sum + (item.pieces * item.slabArea * rate);
  }, 0);

  let cartLorryText = 'Dedicated 16-Wheeler Heavy Multi-Axle (~30-35T direct from 20+ vehicle fleet)';
  if (cartTotalWeightTons <= 15) {
    cartLorryText = '16-Wheeler Fleet Lorry (Express Consignment Direct to Site)';
  } else {
    cartLorryText = 'Heavy 16-Wheeler Multi-Axle (~30-35T Full Quarry Load)';
  }

  const handleOrderCartWhatsApp = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty. Add stones first!');
      return;
    }

    const itemsLines = cart.map((item, idx) => {
      const rate = getStoneRate(item.code, selectedDistrictId);
      const isPiece = item.pricingUnit === 'piece';
      const itemSqft = Math.round(item.pieces * (item.slabArea || 0.11));
      const itemCost = isPiece ? item.pieces * rate : item.pieces * item.slabArea * rate;
      const unitRateStr = isPiece ? `₹${rate}/piece` : `₹${rate}/sqft`;
      const qtyStr = isPiece ? `${item.pieces.toLocaleString()} pcs` : `${item.pieces.toLocaleString()} slabs (${itemSqft.toLocaleString()} sq.ft)`;
      return `${idx + 1}. ORDER ${item.sizeDisplay} ${item.thickness} — ${qtyStr} @ ${unitRateStr} = ₹${Math.round(itemCost).toLocaleString()}`;
    }).join('\n');

    const msg =
`*KADAPA BLACK STONE — CART CONSIGNMENT ORDER*
━━━━━━━━━━━━━━━━━━━━━
📍 *Delivery District:* ${currentDistrictObj.name} (Direct Transfer Zone)

📦 *Consignment Breakdown (${cart.length} Varieties):*
${itemsLines}

━━━━━━━━━━━━━━━━━━━━━
📊 *Consignment Totals:*
• Total Items/Slabs: ${cartTotalPieces.toLocaleString()} pcs
• Total Area: ~${Math.round(cartTotalSqft).toLocaleString()} sq.ft
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
  const isPieceStone = selectedStone.pricingUnit === 'piece';
  const slabs = isPieceStone ? Math.round(safeSqft) : Math.ceil(safeSqft / selectedStone.slabArea);
  const totalCost = safeSqft * activeRate;
  const weightTons = (
    (safeSqft * (isPieceStone ? (selectedStone.weightPerPieceKg || 1.4) : selectedStone.weightPerSqftKg)) / 1000
  ).toFixed(1);

  let lorryText = 'Heavy 16-Wheeler Multi-Axle (~30-35T Direct Site Delivery from 20+ Fleet)';
  if (weightTons <= 15) {
    lorryText = '16-Wheeler Fleet Lorry (Direct site transit via Walayar/AP)';
  } else {
    lorryText = 'Heavy 16-Wheeler Multi-Axle (~30-35T Heavy Load Transit)';
  }

  const handleSelectStone = (code) => {
    setSelectedCode(code);
    const s = STONE_CATALOG.find((item) => item.code === code);
    if (s && s.pricingUnit === 'piece' && sqft > 1000) {
      setSqft(s.code === 'KB-CAB-44' ? 300 : 10);
    }
    const calcSection = document.getElementById('calculator-section');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppOrder = (stoneObj = selectedStone, customSqft = safeSqft) => {
    const s = stoneObj;
    const rate = getStoneRate(s.code, selectedDistrictId);
    const isPiece = s.pricingUnit === 'piece';
    const pieces = isPiece ? Math.round(customSqft) : Math.ceil(customSqft / s.slabArea);
    const total = customSqft * rate;
    const weight = (
      (customSqft * (isPiece ? (s.weightPerPieceKg || 1.4) : s.weightPerSqftKg)) / 1000
    ).toFixed(1);

    const unitStr = isPiece ? `₹${rate}/piece (Fixed Across Kerala)` : `₹${rate}/sq.ft`;
    const qtyStr = isPiece ? `${Math.round(customSqft).toLocaleString()} pieces` : `${Math.round(customSqft).toLocaleString()} sq.ft (~${pieces} slabs)`;

    const msg = `*KADAPA BLACK STONE — KERALA DIRECT ORDER*\n` +
      `--------------------------------\n` +
      `🪨 *Stone Variety:* ${s.name} ${s.malayalamTitle}\n` +
      `📐 *Dimensions:* ${s.sizeDisplay} • ${s.thickness} (${s.finishBadge})\n` +
      `🏡 *Ideal Application:* ${s.keralaUse}\n` +
      `📊 *Order Quantity:* ${qtyStr}\n` +
      `⚖️ *Estimated Weight:* ~${weight} Tons\n` +
      `📍 *Kerala Delivery District:* ${currentDistrictObj.name}\n` +
      `💰 *District Selling Rate:* ${unitStr}\n` +
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
            <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/logo-dark.png" 
                alt="KADAPA STONE TRANSPORT" 
                className="site-brand-logo-img" 
              />
            </a>
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
                    <span className="stone-unit">{stone.pricingUnit === 'piece' ? '/piece' : '/sq.ft'}</span>
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

      {/* 5. Kerala Logistics Network & 16-Wheeler Fleet Heritage */}
      <section className="kerala-network-section container" id="network-section">
        <div className="network-main-card">
          <div className="network-header-wrap">
            <div>
              <div className="network-badge">
                <span>🚛</span> SINCE 2002 &bull; 24+ YEARS OF KERALA SUPPLY HERITAGE
              </div>
              <h2 className="network-title">
                Kerala Direct Supply Network &amp; 16-Wheeler Fleet
              </h2>
              <div className="network-malayalam">
                200-ലധികം സന്തുഷ്ടരായ ഉപഭോക്താക്കൾ &bull; 20+ ഹെവി 16-വീൽ ലോറികൾ &bull; നേരിട്ടുള്ള സൈറ്റ് ഡെലിവറി
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn-filter"
                style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: '#10b981', color: '#34d399' }}
                onClick={() => setShowRatesModal(true)}
              >
                <span>📍 View 7 Hub Rates</span>
              </button>
              <button 
                type="button" 
                className="btn-filter"
                style={{ background: '#25d366', color: '#ffffff', borderColor: '#25d366', fontWeight: 700 }}
                onClick={() => handleWhatsAppOrder()}
              >
                <span>💬 Contact Fleet Dispatch</span>
              </button>
            </div>
          </div>

          {/* 4 Core Achievement Stat Badges */}
          <div className="network-metrics-row">
            <div className="network-metric-box">
              <div className="metric-num">
                <span>200+</span>
                <span style={{ fontSize: '1rem', color: '#34d399' }}>Clients</span>
              </div>
              <div className="metric-label">Happy Kerala Customers</div>
              <div className="metric-sub">Architects, contractors &amp; villa owners across Kerala</div>
            </div>

            <div className="network-metric-box">
              <div className="metric-num">
                <span>2002</span>
                <span style={{ fontSize: '1rem', color: '#fbbf24' }}>ESTD</span>
              </div>
              <div className="metric-label">24+ Years of Legacy</div>
              <div className="metric-sub">Tons of high-grade stone supplied &amp; exported</div>
            </div>

            <div className="network-metric-box">
              <div className="metric-num">
                <span>20+</span>
                <span style={{ fontSize: '1rem', color: '#38bdf8' }}>Vehicles</span>
              </div>
              <div className="metric-label">All 16-Wheeler Heavy Lorries</div>
              <div className="metric-sub">Dedicated multi-axle fleet for non-stop safe transit</div>
            </div>

            <div className="network-metric-box">
              <div className="metric-num">
                <span>₹ Cr+</span>
                <span style={{ fontSize: '1rem', color: '#a7f3d0' }}>Trade</span>
              </div>
              <div className="metric-label">Crores of Trusted Business</div>
              <div className="metric-sub">Direct quarry transparent rates with zero middlemen</div>
            </div>
          </div>

          {/* Dual Visual Showcase: Kerala Route Map + Real 16-Wheeler Convoy */}
          <div className="network-visuals-grid">
            {/* Visual 1: Kerala Delivery Map */}
            <div className="visual-showcase-card">
              <div className="visual-img-container">
                <img 
                  src="/kerala-districts-map.jpg" 
                  alt="Kerala Logistics Transit Network connecting Thrissur, Palakkad, Malappuram, Kozhikode, Kannur, Kasaragod, Wayanad" 
                  loading="lazy" 
                />
                <div className="visual-overlay-tag">
                  <span>📍</span> 7 Authorized Transfer Hubs
                </div>
                <div className="visual-overlay-badge-rt">
                  Highway Corridor
                </div>
              </div>
              <div className="visual-card-body">
                <div className="visual-card-title">
                  <span>Kerala District Transit Network</span>
                </div>
                <div className="visual-card-desc">
                  Exclusive direct transit into <strong>Thrissur, Palakkad, Malappuram, Kozhikode, Kannur, Kasaragod, and Wayanad</strong> via Walayar border and northern corridors.
                </div>
              </div>
            </div>

            {/* Visual 2: Real 16-Wheeler Fleet Photo */}
            <div className="visual-showcase-card">
              <div className="visual-img-container">
                <img 
                  src="/fleet-16-wheeler.jpg" 
                  alt="Our authentic fleet of 20+ heavy 16-wheeler lorries loaded with Kadapa stone" 
                  loading="lazy" 
                />
                <div className="visual-overlay-tag">
                  <span>🚛</span> 20+ Owned 16-Wheelers
                </div>
                <div className="visual-overlay-badge-rt" style={{ background: '#b45309' }}>
                  ~35T Heavy Load
                </div>
              </div>
              <div className="visual-card-body">
                <div className="visual-card-title">
                  <span>Our 16-Wheeler Heavy Transport Convoy</span>
                </div>
                <div className="visual-card-desc">
                  Fleet of 20+ owned 16-wheeler lorries continuously hauling heavy 30–35 Ton consignments direct from our Kadapa quarry to Kerala destinations.
                </div>
              </div>
            </div>
          </div>

          {/* 7 Hubs Quick Switch Bar */}
          <div className="network-hubs-bar">
            <div className="hubs-title-tag">
              <span>📍 Quick Switch Hub:</span>
            </div>
            <div className="hubs-pills-wrap">
              {KERALA_DISTRICTS.map((d) => {
                const isSelected = selectedDistrictId === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`hub-btn-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDistrictId(d.id);
                      showToast(`Selected delivery hub: ${d.name}`);
                    }}
                  >
                    <span>{d.id}</span>
                    <span className="hub-badge">
                      {d.id === 'Thrissur' ? 'Base' : d.note.replace(' than Thrissur', '')}
                    </span>
                  </button>
                );
              })}
            </div>
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
                <span>🌿</span> Kerala&apos;s Best Stone Supply
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
                      {s.sizeDisplay} - {s.thickness} - {s.name} (₹{getStoneRate(s.code, selectedDistrictId)}{s.pricingUnit === 'piece' ? '/pc' : '/sqft'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="calc-form-group">
                <label className="calc-label" htmlFor="calcAreaInput">
                  {selectedStone.pricingUnit === 'piece' ? 'Required Quantity (Pieces)' : 'Required Area (Sq.Ft)'}
                </label>
                <input 
                  type="number" 
                  id="calcAreaInput"
                  className="calc-input"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                  min={selectedStone.pricingUnit === 'piece' ? "1" : "50"}
                  step={selectedStone.pricingUnit === 'piece' ? "10" : "50"}
                />
              </div>

              <div className="calc-form-group">
                <label className="calc-label" htmlFor="calcDistrictSelect">Kerala Delivery District (7 Transfer Hubs Only)</label>
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
                @ ₹{activeRate}{selectedStone.pricingUnit === 'piece' ? '/piece' : '/sqft'} ({selectedDistrictId}) &bull; {slabs.toLocaleString()} {selectedStone.pricingUnit === 'piece' ? 'pcs' : 'slabs'} &bull; ~{weightTons} Tons
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
              <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src="/logo-dark.png" 
                  alt="KADAPA STONE TRANSPORT" 
                  className="site-brand-logo-footer" 
                />
              </a>
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
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {modalStone.pricingUnit === 'piece' ? '/piece' : '/sq.ft'} ({selectedDistrictId})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <span className="dim-pill" style={{ background: '#0f172a' }}>{modalStone.sizeDisplay}</span>
                <span className="dim-pill" style={{ background: '#0f172a' }}>{modalStone.thickness}</span>
                <span className={`finish-pill ${modalStone.badgeVariant}`}>{modalStone.finishBadge}</span>
                <span className="dim-pill" style={{ background: '#047857' }}>
                  {modalStone.pricingUnit === 'piece' ? `~${modalStone.weightPerPieceKg || 1.4} kg/pc` : `~${modalStone.weightPerSqftKg} kg/sqft`}
                </span>
              </div>

              <p style={{ color: '#334155', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 20 }}>
                <strong>Best Suited For:</strong> {modalStone.keralaUse}. Engineered for Kerala&apos;s wet tropical climate with high anti-slip durability, resistance to monsoon algae, and traditional natural texture.
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

      {/* 9. District Rates Table Modal (Direct reproduction of notebook price chart) */}
      {showRatesModal && (
        <div className="modal-overlay" onClick={() => setShowRatesModal(false)}>
          <div className="modal-content" style={{ maxWidth: 960, background: '#121214', color: '#f8fafc', padding: 24, borderRadius: 16 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999, marginBottom: 6 }}>
                  <span>📍</span> 7 Authorized Kerala Delivery Hubs Only
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Official Delivery District Rates</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: 4 }}>
                  Direct quarry &amp; transport depot rates. Thrissur is base depot; Palakkad, Malappuram &amp; Calicut are -₹2; Kannur, Kasaragod &amp; Wayanad are -₹1.
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

            <div style={{ overflowX: 'auto', marginBottom: 18, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', minWidth: 800 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textAlign: 'left', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '12px 12px' }}>STONE SPEC</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center' }}>UNIT</th>
                    {KERALA_DISTRICTS.map((d) => (
                      <th key={d.id} style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <div style={{ color: d.id === 'Thrissur' ? '#34d399' : '#f1f5f9', fontWeight: 700 }}>
                          {d.id.toUpperCase()}
                        </div>
                        <div style={{ fontSize: '0.62rem', color: d.id === 'Thrissur' ? '#34d399' : '#94a3b8', fontWeight: 500 }}>
                          {d.id === 'Thrissur' ? 'Base' : d.note.replace(' than Thrissur', '')}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STONE_CATALOG.map((s) => {
                    const isPiece = s.pricingUnit === 'piece';
                    return (
                      <tr key={s.code} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#f1f5f9' }}>
                          <span style={{ color: '#38bdf8' }}>{s.sizeDisplay}</span>&nbsp;·&nbsp;{s.thickness}&nbsp;
                          <div style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem', marginTop: 2 }}>{s.name}</div>
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#94a3b8', fontSize: '0.74rem' }}>
                          {isPiece ? 'pc' : 'sq.ft'}
                        </td>
                        {KERALA_DISTRICTS.map((d) => {
                          const rate = DISTRICT_RATES[d.id]?.[s.code] || 0;
                          const isBase = d.id === 'Thrissur';
                          return (
                            <td key={d.id} style={{ padding: '12px 10px', textAlign: 'center', color: isBase ? '#34d399' : '#fbbf24', fontWeight: 700 }}>
                              <span style={{ color: '#64748b', fontSize: '0.72rem' }}>₹ </span>{rate}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
              <span>⚠️ Notice: Stone consignments are strictly dispatched only to these 7 Kerala locations.</span>
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
                    const isPiece = item.pricingUnit === 'piece';
                    const itemSqft = isPiece ? Math.round(item.pieces * (item.slabArea || 0.11)) : item.pieces * item.slabArea;
                    const itemCost = isPiece ? item.pieces * rate : item.pieces * item.slabArea * rate;
                    const itemWeight = isPiece 
                      ? ((item.pieces * (item.weightPerPieceKg || 1.4)) / 1000).toFixed(1)
                      : ((item.pieces * item.slabArea * item.weightPerSqftKg) / 1000).toFixed(1);
                    const minQty = isPiece ? 1 : 25;
                    const stepDelta = isPiece ? (item.code === 'KB-CAB-44' ? 50 : 1) : 25;

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
                                onClick={() => handleUpdateCartQty(item.code, -stepDelta)}
                                disabled={item.pieces <= minQty}
                              >
                                &minus;
                              </button>
                              <input 
                                type="number"
                                className="cart-qty-input"
                                value={item.pieces}
                                min={minQty}
                                step={stepDelta}
                                onChange={(e) => handleSetCartPieces(item.code, e.target.value)}
                              />
                              <button 
                                type="button" 
                                className="btn-stepper"
                                onClick={() => handleUpdateCartQty(item.code, stepDelta)}
                              >
                                &#43;
                              </button>
                              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>pcs</span>
                            </div>

                            {/* Area & Price */}
                            <div style={{ textAlign: 'right' }}>
                              <div className="cart-item-price">₹{Math.round(itemCost).toLocaleString()}</div>
                              <div className="cart-item-rate">
                                {isPiece ? `${item.pieces.toLocaleString()} pcs` : `${itemSqft.toLocaleString()} sqft`} &bull; @ ₹{rate}{isPiece ? '/piece' : '/sqft'} (~{itemWeight}T)
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
