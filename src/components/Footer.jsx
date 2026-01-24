import './Footer.css'
function Footer() {
    return (
        <div className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <span className="footer-logo">The Silent Oasis</span>
                        <p className="footer-tagline low-contrast-text">
                            Where luxury meets serenity. Experience the pinnacle of refined
                            hospitality in our exclusive retreat.
                        </p>
                        <div className="social-icons">
                            <img src="https://cdn-icons-png.flaticon.com/128/733/733547.png" alt="" className="social-icon" onClick={() => console.log('Facebook')} />
                            <img src="https://cdn-icons-png.flaticon.com/128/2111/2111463.png" alt="" className="social-icon" onClick={() => console.log('Instagram')} />
                            <img src="https://cdn-icons-png.flaticon.com/128/733/733579.png" alt="" className="social-icon" onClick={() => console.log('Twitter')} />
                        </div>
                    </div>

                    <div className="footer-links">
                        <span className="footer-heading">Quick Links</span>
                        <div className="link-list low-contrast-text">
                            <a href="#">About Us</a>
                            <a href="#">Our Rooms</a>
                            <a href="#">Dining</a>
                            <a href="#">Spa Services</a>
                            <a href="#">Contact</a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <span className="footer-heading">Services</span>
                        <div className="link-list low-contrast-text">
                            <a href="#">Concierge</a>
                            <a href="#">Airport Transfer</a>
                            <a href="#">Private Events</a>
                            <a href="#">Gift Cards</a>
                            <a href="#">Loyalty Program</a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <span className="footer-heading">Legal</span>
                        <div className="link-list low-contrast-text">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                            <a href="#">Accessibility</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="copyright low-contrast-text">
                        © 2024 The Silent Oasis. All rights reserved.
                        <a href="#">Read More</a> about our commitment to excellence.
                    </p>

                    <p className="terms low-contrast-text">
                        By using this website you agree to our Terms and Conditions.
                        <a href="#">Click here</a> to view our full legal disclaimer and privacy practices.
                        We reserve the right to modify these terms at any time without prior notice.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Footer
