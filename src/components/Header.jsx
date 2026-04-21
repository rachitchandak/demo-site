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
          <a className="nav-item" href="#">Rooms & Suites</a>
          <a className="nav-item" href="#">Dining</a>
          <a className="nav-item" href="#">Spa & Wellness</a>
          <a className="nav-item" href="#">Experiences</a>
          <a className="nav-item" href="#">Contact</a>
        </div>
        <button className="book-btn" onClick={(event) => handleLinkClick(event, 'booking')}>
          Book Now
        </button>
      </div>
    </div>
  )
}

export default Header
