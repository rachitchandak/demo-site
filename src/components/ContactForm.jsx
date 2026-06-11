import './ContactForm.css'

function ContactForm() {
    const handleSubmit = () => {
        console.log('Form submitted')
    }

    return (
        <div className="contact-section">
            <div className="container">
                <div className="contact-wrapper">
                    <div className="contact-info">
<span className="section-label" style={{ color: '#6b5b2a' }}>Get in Touch</span>
                        <h3 className="section-title">Contact Us</h3>
                        <p className="contact-desc">
                            We'd love to hear from you. Whether you're planning your next escape
                            or have questions about our services, our concierge team is here to assist.
                        </p>

                        <div className="contact-details">
                            <div className="contact-item">
<span className="contact-label" style={{ color: '#6b5b2a' }}>Address</span>
                                <span className="contact-value">123 Oceanfront Drive, Paradise Bay</span>
                            </div>
                            <div className="contact-item">
<span className="contact-label" style={{ color: '#6b5b2a' }}>Phone</span>
                                <span className="contact-value">+1 (555) 123-4567</span>
                            </div>
                            <div className="contact-item">
<span className="contact-label" style={{ color: '#6b5b2a' }}>Email</span>
                                <span className="contact-value">concierge@silentoasis.com</span>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form">
<input type="text" placeholder="Name" aria-label="Name" />
<input type="email" placeholder="Email Address" aria-label="Email address" />
<input type="tel" placeholder="Phone Number" aria-label="Phone number" />
<textarea rows="5" placeholder="Your Message" aria-label="Your message"></textarea>

                        <button type="button" className="submit-btn" onClick={handleSubmit}>
                            Click Here to Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactForm
