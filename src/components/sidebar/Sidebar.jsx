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
import setaIcon from "../../assets/icons/arrow.svg";

function Sidebar({ abrirModal }) {
    const navigate = useNavigate();
    const [expandida, setExpandida] = React.useState(true); // Estado da sidebar

    const toggleSidebar = () => {
        setExpandida(!expandida);
    };

    return (
        <div className={`${styles.container} ${!expandida ? styles.fechada : ""}`}>
            {/* Botão de Seta para recolher/expandir */}
            <button className={styles.botaoToggle} onClick={toggleSidebar}>
                <img 
                    src={setaIcon} 
                    alt="Seta" 
                    className={!expandida ? styles.setaInvertida : ""} 
                />
            </button>

            <div className={styles.taskHeader}>
                <img src={logotipo} alt="logotipo da NextPoint" />
                {expandida && <p>AgendaNext</p>}
            </div>

            <main>
                <div className={styles.taskContent}>
                    {/* ✅ Mantendo o texto "Conteúdo" */}
                    <p>{expandida ? "Conteúdo" : "..."}</p> 
                    <nav>
                        <ul>
                            <li> 
                                <img className={styles.taskIcon} src={dashboardIcon} alt="dashboard" />
                                {expandida && <Link className={styles.taskNav} to="/dashboard">Dashboard</Link>}
                            </li>
                            <li> 
                                <img className={styles.taskIcon} src={addContaIcon} alt="adicionar" />
                                {expandida && <button className={styles.taskNav} onClick={abrirModal}>Adicionar Responsável</button>}
                            </li>
                            <li> 
                                <img className={styles.taskIcon} src={historicoIcon} alt="histórico" />
                                {expandida && <Link className={styles.taskNav} to="/historico">Agendamentos finalizados</Link>}
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className={styles.taskUsuario}>
                    {/* Mantendo o texto "Admin" e as "Configurações" */}
                    <p>{expandida ? "Admin" : ""}</p>
                    <ul>
                        <li>
                            <img src={settingsIcon} alt="configurações" />
                            {expandida && <Link className={styles.taskNav} to="/configuracoes">Configurações</Link>}
                        </li>
                    </ul>
                </div>
            </main>

            <div className={styles.taskLogout}>
                <img className={styles.taskIcon} src={logoutIcon} alt="logout" />
                {expandida && <Link className={styles.taskNav} to="/login">Logout</Link>}
            </div>
        </div>
    );
}

export default Sidebar;