import { BrowserRouter, Routes, Route } from "react-router-dom";

import SimpleNavbar from "./components/SimpleNavbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <div
        className="
          min-h-screen
          bg-gray-100
          text-gray-900
          dark:bg-slate-950
          dark:text-white
          transition-colors
          duration-300
          flex
          flex-col
        "
      >
        <SimpleNavbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;