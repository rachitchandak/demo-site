import './Header.css'
function Header() {
  const handleNavClick = (section) => {
    console.log(`Navigating to ${section}`)
  }

  const handleLinkClick = (event, section) => {
    event.preventDefault()
    handleNavClick(section)
  }

  return (
    <div className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-text">The Silent Oasis</span>
        </div>
        <div className="nav-menu">
          <a className="nav-item" href="#" onClick={(event) => handleLinkClick(event, 'rooms')}>Rooms & Suites</a>
          <a className="nav-item" href="#" onClick={(event) => handleLinkClick(event, 'dining')}>Dining</a>
          <a className="nav-item" href="#" onClick={(event) => handleLinkClick(event, 'spa')}>Spa & Wellness</a>
          <a className="nav-item" href="#" onClick={(event) => handleLinkClick(event, 'experiences')}>Experiences</a>
          <a className="nav-item" href="#" onClick={(event) => handleLinkClick(event, 'contact')}>Contact</a>
        </div>
        <a className="book-btn" href="#" onClick={(event) => handleLinkClick(event, 'booking')}>
          Book Now
        </a>
      </div>
    </div>
  )
}

export default Header
