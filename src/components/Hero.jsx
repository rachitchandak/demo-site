import './Hero.css'
function Hero() {
    return (
        <div className="hero">
            <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
                alt=""
                className="hero-image"
            />
            <div className="hero-overlay"></div>

            <div className="hero-content">
                <span className="hero-tagline">Escape to Tranquility</span>
                <h1 className="hero-title">The Silent Oasis</h1>
                <p className="hero-subtitle">
                    Where luxury meets serenity. Experience the pinnacle of refined hospitality
                    in an oasis of calm, designed for the discerning traveler.
                </p>

                <div className="hero-buttons">
                    <div className="btn btn-primary">Click Here</div>
                    <div className="btn btn-outline">Read More</div>
                </div>
            </div>
        </div>
    )
}

export default Hero
