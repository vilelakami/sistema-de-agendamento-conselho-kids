import React, { useState } from "react"; // Adicionado useState
import { useNavigate } from "react-router-dom"; // Adicionado useNavigate
import styles from "../css/NovaSenha.module.css";

function NovaSenha({ fecharModal }) {
    const navigate = useNavigate(); // Inicializa o navigate

    // criando os estados para os inputs
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const handleSalvarSenha = (e) => {
        if (e) e.preventDefault();

        // 1. Validações básicas
        if (novaSenha.length == 4) {
            alert("A senha deve ter 8 caracteres.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        // 2. Recupera os dados atuais do administrador
        const dadosSalvos = localStorage.getItem("dadosLogin");
        
        if (dadosSalvos) {
            const usuarioObj = JSON.parse(dadosSalvos);

            // 3. Atualiza apenas a senha
            usuarioObj.senha = novaSenha;

            // 4. Salva de volta no localStorage
            localStorage.setItem("dadosLogin", JSON.stringify(usuarioObj));

            alert("Senha alterada com sucesso! Use sua nova senha no próximo login.");
            
            fecharModal(); // Fecha o modal
            navigate("/"); // Redireciona para o login
        } else {
            alert("Erro: Dados de administrador não encontrados.");
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={fecharModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.contentSenha}>
                    <div className={styles.novaSenha}>
                        <label>Nova Senha: <span className={styles.span}>*</span></label>
                        <input 
                            type="password"
                            maxLength="8"
                            value={novaSenha} // Conecta ao estado
                            onChange={(e) => setNovaSenha(e.target.value)} // Atualiza o estado
                            required 
                        />
                    </div>
                    <div className={styles.ConfirmarNovaSenha}>
                        <label>Confirmar senha: <span className={styles.span}>*</span></label>
                        <input 
                            type="password" 
                            maxLength="8"
                            value={confirmarSenha} // Conecta ao estado
                            onChange={(e) => setConfirmarSenha(e.target.value)} // Atualiza o estado
                            required 
                        />
                    </div>
                </div>
                <div className={styles.btnDecisao}>
                    {/* chajando a função no onClick */}
                    <button type="button" onClick={handleSalvarSenha}>Salvar</button>
                    <button type="button" onClick={fecharModal}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}

export default NovaSenha;