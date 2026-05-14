import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/auth/Login";
import Cadastro from "./pages/auth/Cadastro";
import Dashboard from "./pages/Dashboard";
import Historico from "./pages/Historico";
import Configuracoes from './pages/Configuracoes';
import ModalResponsavel from './pages/ModalResponsavel';
import Cronograma from './pages/Cronograma';

function App() {
  return(
    <Router>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Cadastro" element={<Cadastro />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Historico" element={<Historico />} />
          <Route path="/Configuracoes" element={<Configuracoes />} />
          <Route path="/ModalResponsavel" element={<ModalResponsavel />} />
          <Route path="/Cronograma" element={<Cronograma />} />
          {/* Rota inicial (quando abrir o site cai no login) */}
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    );
}

export default App;