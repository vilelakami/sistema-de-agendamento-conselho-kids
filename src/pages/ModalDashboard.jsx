import React, { useState, useEffect } from "react";
import styles from "./css/ModalDashboard.module.css";
import accountUpload from "../assets/icons/upload.svg";
import editIcon from "../assets/icons/edit_icon.svg"

function ModalDashboard({isOpen, onClose, user, atualizarStatusGlobal}){
    const [statusLocal, setStatusLocal] = useState(user?.status || "pendente");

    useEffect(()=>{
        if(user){
            setStatusLocal(user.status);
        }
    }, [user]);

    if (!isOpen || !user) return null;
    return(
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.profile}>
                        <div className={styles.taskPerfil}>
                            <img src={accountUpload} alt="upload de perfil" />
                            <h1>{user.responsavel}</h1>
                            <span className={styles[`status${user.status.charAt(0).toUpperCase() + user.status.slice(1)}`]}>
                                {user.status}
                            </span>
                        </div>
                        <div className={styles.taskInfo}>
                            <div className={styles.taskCpf}>
                                <h1>CPF:</h1>
                                <h2>{user.cpf}</h2>
                            </div>
                            <div className={styles.taskCep}>
                                <h1>CEP:</h1>
                                <h2>{user.cep}</h2>
                            </div>
                            <div className={styles.taskFilhos}>
                                <h1>Qtde. filhos:</h1>
                                <h2>{user.quantidadeFilhos}</h2>
                            </div>
                        </div>
                    </div>
                    <div className={styles.taskDescription}>
                        <div className={styles.textArea}>
                            <h2>Descrição</h2>
                            <textarea className={styles.taskTextArea}></textarea>
                        </div>
                        <div className={styles.taskStatus}>
                            <h1>Status</h1>
                            <div className={styles.inputStatus}>
                                <div className={styles.pendente}>
                                    <input 
                                    type="radio" 
                                    id="pendente" 
                                    name="pendente" 
                                    value="pendente" 
                                    checked={user.status === "pendente"} 
                                    onChange={(e) => setStatusLocal(e.target.value)}/>
                                    <label htmlFor="pendente">Pendente</label>
                                </div>
                                <div className={styles.agendado}>
                                    <input 
                                    type="radio" 
                                    id="agendado" 
                                    name="agendado" 
                                    value="agendado" 
                                    checked={user.status === "agendado"}
                                    onChange={(e) => setStatusLocal(e.target.value)}/>
                                    <label htmlFor="agendado">Agendado</label>
                                </div>
                                <div className={styles.concluido}>
                                    <input 
                                    type="radio" 
                                    id="concluido" 
                                    name="concluido" 
                                    value="concluido" 
                                    checked={user.status === "concluido"}
                                    onChange={(e) => setStatusLocal(e.target.value)}/>
                                    <label htmlFor="concluido">Concluído</label>
                                </div>
                            </div>
                        </div>
                        <div className={styles.btnEdit}>
                            
                            <button onClick={() => atualizarStatusGlobal(user.id, statusLocal)}><img src={editIcon} alt="editar" />Editar</button>
                        </div>
                    </div>
                </div>
            </div>
    );
}
export default ModalDashboard;