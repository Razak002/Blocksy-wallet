import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Footer, Services, Transactions, Welcome } from "./components";
import Market from "./components/Market";
import Exchange from "./components/Exchange";


const App = () => {
  return (
    <Router>
      <div className="min-h-screen gradient-bg-welcome">
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Welcome />
                <Services />
                <Transactions />
              </>
            }
          />

          {/* Market Page */}
          <Route path="/market" element={<Market />} />
          <Route path="/exchange" element={<Exchange />} />
          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="animate-bounce flex flex-col justify-center items-centertext-center text-white text-2xl p-20">
                <h1 className="text-5xl font-bold text-center text-white">COMING <br/>
                SOON</h1>
                <p className="text-xl font-medium text-center text-white">SOMETHING BIG IS LOADING STAY TUNED....</p>
              </div>
            }
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
