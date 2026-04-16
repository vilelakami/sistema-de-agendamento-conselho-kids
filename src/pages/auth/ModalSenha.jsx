import { useState } from "react";
import styles from "../css/ModalSenha.module.css";
import emailIcon from "../../assets/icons/email.svg"

//passando os parâmetros de se estar aberto ou fechado o modal
function Esqueci_Senha({ isOpen, onClose }) {
    const [email, setEmail] = useState("");

    // Se o modal não estiver aberto, não renderiza 
    if (!isOpen) return null;

    function handleEsqueciSenha() {
        //se não escrever o email, não prossegue e emite um alert
        if (!email) {
            alert("Por favor, digite seu e-mail.");
            return;
        }
        //caso contrário feche o modal
        alert("Se o e-mail estiver cadastrado, você receberá um link em breve!");
        onClose(); // Fecha o modal após enviar
    }

    return (
        //se apertar no fundo com sombra fecha o modal
        <div className={styles.overlay} onClick={onClose}>
            {/* fazendo que o onclick não subra pro overlay */}
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.taskTitle}>Recuperar Senha</h2>
                <p>Enviaremos um link de recuperação para o seu e-mail.</p>

                {/* input do email */}
                <div className={styles.taskInput}>
                    <img src={emailIcon} alt="email" />
                    <input 
                        type='email' 
                        placeholder='Digite seu e-mail *' 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button className={styles.btn}onClick={handleEsqueciSenha}>Enviar Link</button>
                <button className={styles.btn} onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
}
export default Esqueci_Senha;