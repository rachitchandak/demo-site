import './Header.css'

/* ANTI-PATTERN: Div-soup navigation using divs/spans instead of semantic nav/ul/a elements */
/* ANTI-PATTERN: No tabIndex or role attributes - non-keyboard accessible */
function Header() {
  const handleNavClick = (section) => {
    console.log(`Navigating to ${section}`)
  }

  return (
    <div className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-text">The Silent Oasis</span>
        </div>
        
        {/* ANTI-PATTERN: Using divs with onClick instead of proper anchor tags */}
        <div className="nav-menu">
          <span className="nav-item" onClick={() => handleNavClick('rooms')}>Rooms & Suites</span>
          <span className="nav-item" onClick={() => handleNavClick('dining')}>Dining</span>
          <span className="nav-item" onClick={() => handleNavClick('spa')}>Spa & Wellness</span>
          <span className="nav-item" onClick={() => handleNavClick('experiences')}>Experiences</span>
          <span className="nav-item" onClick={() => handleNavClick('contact')}>Contact</span>
        </div>

        {/* ANTI-PATTERN: Div as button without accessibility attributes */}
        <div className="book-btn" onClick={() => handleNavClick('booking')}>
          Book Now
        </div>
      </div>
    </div>
  )
}

export default Header
