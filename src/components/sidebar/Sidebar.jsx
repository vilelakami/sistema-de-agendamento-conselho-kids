import React from "react";
import styles from "../../pages/css/Sidebar.module.css";
import logotipo from  "../../assets/icons/logotipo.svg";
import dashboardIcon from "../../assets/icons/dashboard.svg";
import addContaIcon from "../../assets/icons/addConta.svg";
import historicoIcon from "../../assets/icons/historico.svg";
import logoutIcon from "../../assets/icons/logout.svg";
import { Link, useNavigate } from "react-router-dom";
import dashboard from "../../pages/Dashboard";
import modalDashboard from "../../pages/ModalDashboard";
import historico from "../../pages/Historico";
import login from "../../pages/auth/Login";
import settingsIcon from "../../assets/icons/settings.svg";

function Sidebar() {
    const navigate = useNavigate();
    return(
        <div className={styles.container}>
            <div className={styles.taskHeader}>
                <img src={logotipo} alt="logotipo da NextPoint" />
                <p>AgendaNext</p>
            </div>
            <main>
                <div className={styles.taskContent}>
                    <p>Conteúdo</p>
                    <nav>
                        <ul>
                            <li> <img className={styles.taskIcon} src={dashboardIcon} alt="dashboard" /><a onClick={() => navigate("/dashboard")} href="">Dashboard</a></li>
                            <li> <img className={styles.taskIcon} src={addContaIcon} alt="adicionar" /><Link to="/modalDashboard">Adicionar Responsável</Link></li>
                            <li> <img src={historicoIcon} alt="histórico" /><a onClick={() => navigate("/historico")}href=""> Agendamentos Finalizados</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className={styles.taskUsuario}>
                    <p>Admin</p>
                    <ul>
                        <li><img src={settingsIcon} alt="configurações" /><a onClick={() => navigate("/sair")} href="">Configurações</a></li>
                    </ul>
                </div>
            </main>
                <div className={styles.taskLogout}>
                    <a onClick={() => navigate("/login")} href="">
                        Logout
                    </a>
                </div>
        </div>
    );
} export default Sidebar;