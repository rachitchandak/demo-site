import './PriceList.css'

/* ANTI-PATTERN: Layout table without semantic structure */
/* No <thead>, <th>, or scope attributes */
const services = [
    { service: 'Standard Room', weekday: '$450', weekend: '$550', holiday: '$750' },
    { service: 'Deluxe Suite', weekday: '$750', weekend: '$900', holiday: '$1,200' },
    { service: 'Ocean View Suite', weekday: '$850', weekend: '$1,050', holiday: '$1,400' },
    { service: 'Garden Villa', weekday: '$1,200', weekend: '$1,450', holiday: '$1,900' },
    { service: 'Royal Penthouse', weekday: '$2,400', weekend: '$2,900', holiday: '$3,800' },
    { service: 'Presidential Suite', weekday: '$3,500', weekend: '$4,200', holiday: '$5,500' },
    { service: 'Spa Treatment (60min)', weekday: '$180', weekend: '$220', holiday: '$280' },
    { service: 'Private Dining Experience', weekday: '$350', weekend: '$450', holiday: '$600' },
]

function PriceList() {
    return (
        <div className="price-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Rates</span>
                    <h3 className="section-title">Price List</h3>
                </div>

                {/* ANTI-PATTERN: Table without thead, th, or scope attributes */}
                <table className="price-table">
                    <tr className="table-header-row">
                        <td>Service</td>
                        <td>Weekday</td>
                        <td>Weekend</td>
                        <td>Holiday</td>
                    </tr>
                    {services.map((item, index) => (
                        <tr key={index}>
                            <td>{item.service}</td>
                            <td>{item.weekday}</td>
                            <td>{item.weekend}</td>
                            <td>{item.holiday}</td>
                        </tr>
                    ))}
                </table>

                <p className="price-note low-contrast-text">
                    * All prices are per night and subject to availability. Additional taxes and fees may apply.
                    For group bookings or extended stays, please contact us for special rates.
                    <a href="#">Click here</a> for full terms.
                </p>
            </div>
        </div>
    )
}

export default PriceList
