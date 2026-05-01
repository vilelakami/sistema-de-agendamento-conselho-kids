import { useState } from "react";
import styles from "../css/ModalSenha.module.css";
import emailIcon from "../../assets/icons/email.svg";

function Esqueci_Senha({ isOpen, onClose, enviarEmail }) {
    // 1. estado para o email
    const [email, setEmail] = useState("");

    if (!isOpen) return null;

    // 2. lógica de validação e envio aqui
    const handleEnviarClick = (e) => {
        e.preventDefault();
        
        // Validação básica
        if (!email) {
            alert("Por favor, digite seu e-mail.");
            return;
        }

        // Validação de formato 
        if(!email.includes("@") || !email.includes(".") || email.includes(" ")){
            alert("Por favor, insira um email válido (exemplo@gmail.com)");
            return;
        }

        console.log("Enviando e-mail para:", email);
        
        // 3. Chama a função que vem do componente pai (Login)
        enviarEmail(email); 
        
        // Limpa o campo e fecha o modal
        setEmail(""); 
        onClose(); 
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.taskTitle}>Recuperar Senha</h2>
                <p>Enviaremos um link de recuperação para o seu e-mail.</p>

                <div className={styles.taskInput}>
                    <img src={emailIcon} alt="email" />
                    <input 
                        type='email' 
                        placeholder='Digite seu e-mail *' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button className={styles.btn} onClick={handleEnviarClick}>
                    Enviar Link
                </button>
                <button className={styles.btn} onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}

export default Esqueci_Senha;