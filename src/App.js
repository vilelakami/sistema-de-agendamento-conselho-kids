import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/auth/Login";
import Cadastro from "./pages/auth/Cadastro";
import Dashboard from "./pages/Dashboard";
import Historico from "./pages/Historico";

function App() {
  return(
    <Router>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Cadastro" element={<Cadastro />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Historico" element={<Historico />} />
          {/* Rota inicial (quando abrir o site cai no login) */}
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    );
}

export default App;