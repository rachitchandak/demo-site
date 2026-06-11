import './RoomAvailability.css'
const rooms = [
    {
        id: 1,
        name: 'Ocean View Suite',
        image: '/rooms/ocean-view-suite.jpg',
        price: '$850',
        available: true
    },
    {
        id: 2,
        name: 'Royal Penthouse',
        image: '/rooms/royal-penthouse.jpg',
        price: '$2,400',
        available: false
    },
    {
        id: 3,
        name: 'Garden Villa',
        image: '/rooms/garden-villa.jpg',
        price: '$1,200',
        available: true
    },
    {
        id: 4,
        name: 'Presidential Suite',
        image: '/rooms/presidential-suite.jpg',
        price: '$3,500',
        available: false
    },
    {
        id: 5,
        name: 'Spa Retreat Room',
        image: '/rooms/spa-retreat-room.jpg',
        price: '$650',
        available: true
    },
    {
        id: 6,
        name: 'Sunset Terrace Suite',
        image: '/rooms/sunset-terrace-suite.jpg',
        price: '$980',
        available: false
    }
]

function RoomAvailability() {
    return (
        <div className="rooms-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label" style={{color: '#2d2d2d'}}>Accommodations</span>
                    <h2 className="section-title">Rooms & Suites</h2>
                    <p className="section-desc">
                        Each room offers a sanctuary of comfort with this stunning view.
                        Check availability below for your perfect stay.
                    </p>
                </div>

                <div className="rooms-grid" role="list">
                    {rooms.map(room => (
                        <div key={room.id} className="room-card" role="listitem">
                            <img src={room.image} alt={room.name} className="room-image" />
                            <div className="room-info">
                                <div className="room-header">
                                    <h3 className="room-name">{room.name}</h3>
                                    <span className={`status-dot ${room.available ? 'status-available' : 'status-booked'}`}></span><span className="status-text">{room.available ? 'Available' : 'Booked'}</span>
                                </div>
                                <div className="room-details">
                                    <span className="room-price" style={{color: '#2d2d2d'}}>{room.price}<span className="price-period" style={{color: '#2d2d2d'}}>/night</span></span>
                                    <a href="#" className="room-link" aria-label={`Read more about ${room.name}`}>Read More</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RoomAvailability
