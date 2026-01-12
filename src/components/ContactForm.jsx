import './ContactForm.css'

/* ANTI-PATTERN: Form without labels - only placeholder text */
/* ANTI-PATTERN: Div used as submit button without accessibility attributes */
function ContactForm() {
    const handleSubmit = () => {
        console.log('Form submitted')
    }

    return (
        <div className="contact-section">
            <div className="container">
                <div className="contact-wrapper">
                    <div className="contact-info">
                        <span className="section-label">Get in Touch</span>
                        <h3 className="section-title">Contact Us</h3>
                        <p className="contact-desc">
                            We'd love to hear from you. Whether you're planning your next escape
                            or have questions about our services, our concierge team is here to assist.
                        </p>

                        <div className="contact-details">
                            <div className="contact-item">
                                <span className="contact-label">Address</span>
                                <span className="contact-value">123 Oceanfront Drive, Paradise Bay</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">Phone</span>
                                <span className="contact-value">+1 (555) 123-4567</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">Email</span>
                                <span className="contact-value">concierge@silentoasis.com</span>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form">
                        {/* ANTI-PATTERN: No <label> elements, only placeholders */}
                        <div className="form-row">
                            <input type="text" placeholder="First Name" />
                            <input type="text" placeholder="Last Name" />
                        </div>
                        <input type="email" placeholder="Email Address" />
                        <input type="tel" placeholder="Phone Number" />
                        <textarea rows="5" placeholder="Your Message"></textarea>

                        {/* ANTI-PATTERN: Div as button without tabIndex, role, or keyboard handlers */}
                        <div className="submit-btn" onClick={handleSubmit}>
                            Click Here to Submit
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactForm
