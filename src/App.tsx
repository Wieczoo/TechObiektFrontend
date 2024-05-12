import { Routes, Route, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import Height from "./pages/Height";
import Education from "./pages/Education";
import Prisoners from "./pages/prisoners";
import Vaccination from "./pages/Vaccinaction";
import Footer from "./components/footer";
import QueryBuilder from "./pages/QueryBuilder";


function App() {
  return (
   <>
   <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/height" element={<Height/>} />
          <Route path="/education" element={<Education/>} />
          <Route path="/prisoners" element={<Prisoners/>} />
          <Route path="/vaccination" element={<Vaccination/>} />
          <Route path="/querybuilder" element={<QueryBuilder/>}/>
        </Routes>
      {/* <Footer></Footer> */}
   </>
      
 
  );
}

export default App;
