import React, { useState, useEffect } from "react";
import styles from "./css/ModalDashboard.module.css";
import editIcon from "../assets/icons/edit_icon.svg"

function ModalDashboard({isOpen, onClose, user, atualizarStatusGlobal}){
    const [statusLocal, setStatusLocal] = useState(user?.status || "pendente");

    useEffect(()=>{
        if(user){
            setStatusLocal(user.status);
        }
    }, [user]);

    // se o modal estiver diferente de aberto retorna null
    if (!isOpen || !user) return null;
    return(
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.taskHeader}>
                        <div className={styles.profile}>
                            {/* contém as infos: nome e status */}
                            <div className={styles.taskPerfil}>
                                <h1>{user.responsavel}</h1>
                                <span className={styles[`status${user.status.charAt(0).toUpperCase() + user.status.slice(1)}`]}>
                                    {user.status}
                                </span>
                            </div>
                            {/* contém o restante das infos: cpf, cep, qtde de filhos */}
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
                        {/* os status: permite que você mude o status como pendente, agendado e concluido */}
                        <div className={styles.taskStatus}>
                            <h1>Status</h1>
                            <div className={styles.inputStatus}>
                                <div className={styles.pendente}>
                                    <input 
                                    type="radio" 
                                    id="pendente" 
                                    name="pendente" 
                                    value="pendente" 
                                    checked={statusLocal === "pendente"} 
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
                    </div>
                    {/* descrição, o campo de texto */}
                    <div className={styles.taskDescription}>
                        <div className={styles.textArea}>
                            <h2>Descrição</h2>
                            <textarea className={styles.taskTextArea}></textarea>
                        </div>
                        {/* botão editar */}
                        <div className={styles.btnEdit}>
                            <button onClick={() => atualizarStatusGlobal(user.id, statusLocal)}><img src={editIcon} alt="editar" />Editar</button>
                        </div>
                    </div>
                </div>
            </div>
    );
}
export default ModalDashboard;