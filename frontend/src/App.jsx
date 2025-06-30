import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Collection from "./pages/Collection"
import About from "./pages/About"
import Cart from "./pages/Cart"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Product from "./pages/Product"
import Orders from "./pages/Orders"
import PlaceOrder from "./pages/PlaceOrder"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import SearchBar from "./components/SearchBar"


function App() {
  return (
    <div className="px-4 overflow-hidden">
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/place-orders" element={<PlaceOrder />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
