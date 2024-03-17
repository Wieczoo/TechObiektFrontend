import { Routes, Route, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import Height from "./pages/Height";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
function App() {
  return (
   
      <Routes>
        <>
          <Route path="/" element={<Home/>} />
          <Route path="/height" element={<Height/>} />
        </>
      </Routes>
 
  );
}

export default App;
