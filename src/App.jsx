import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import Router from "./app/router";

function App() {
  return (
    <BrowserRouter>
      <Router />
      {/* <div
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
          </Routes>
        </main>

        <Footer />
      </div> */}
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

export default App;