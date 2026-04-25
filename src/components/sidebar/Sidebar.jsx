import React from "react";
import styles from "../../pages/css/Sidebar.module.css";
import logotipo from  "../../assets/icons/logotipo.svg";
import dashboardIcon from "../../assets/icons/dashboard.svg";
import addContaIcon from "../../assets/icons/addConta.svg";
import historicoIcon from "../../assets/icons/historico.svg";
import logoutIcon from "../../assets/icons/logout.svg";
import { Link, useNavigate } from "react-router-dom";
import dashboard from "../../pages/Dashboard";
import settingsIcon from "../../assets/icons/settings.svg";

function Sidebar({ abrirModal }) {
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
                            <li> <img className={styles.taskIcon} src={dashboardIcon} alt="dashboard" /><Link to="/dashboard">Dashboard</Link></li>
                            <li> <img className={styles.taskIcon} src={addContaIcon} alt="adicionar" /><button onClick={abrirModal}>Adicionar Responsável</button></li>
                            <li> <img src={historicoIcon} alt="histórico" /><Link to="/historico">Agendamentos finalizados</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className={styles.taskUsuario}>
                    <p>Admin</p>
                    <ul>
                        <li><img src={settingsIcon} alt="configurações" /><Link to="/login">Configurações</Link></li>
                    </ul>
                </div>
            </main>
                <div className={styles.taskLogout}>
                    <Link to="/login">Logout</Link>
                </div>
        </div>
    );
} export default Sidebar;