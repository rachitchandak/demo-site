import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import RoomAvailability from './components/RoomAvailability'
import PriceList from './components/PriceList'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
function App() {
  return (
    <div className="app">
      <Header />
      <div className="welcome-banner">
        <h3 className="welcome-text">Welcome to Luxury</h3>
      </div>

      <Hero />

      <RoomAvailability />

      <PriceList />

      <ContactForm />

      <Footer />
    </div>
  )
}

export default App
