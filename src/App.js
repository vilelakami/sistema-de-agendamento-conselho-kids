import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

function App() {
  return(
    <Router>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Cadastro" element={<Cadastro />} />
          {/* Rota inicial (quando abrir o site cai no login) */}
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    );
}

export default App;