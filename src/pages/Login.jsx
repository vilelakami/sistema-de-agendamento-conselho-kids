import { useState } from 'react';
import styles from "./Login.module.css";
import userIcon from "../assets/icons/user.svg";
import userSenha from "../assets/icons/lock.svg";

function Login() {
    // useState pra armazenar e escrever os campos de usuario e login
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");

    // função pra verificar condições
    function handleLogin() {
        console.log("Usuario: ", usuario);
        console.log("Senha", senha);
    }

    return (
        // tela do login
        <div className={styles.container}>
            <div className={styles.left}></div>
            <div className={styles.right}>
                <h2 className="task-title">LOGIN</h2>
                {/* campo de usuário */}
                <div className={styles.taskInput}>
                    <img className={styles.taskIcon} src={userIcon} alt="usuário" />
                    <input
                        type='text'
                        placeholder='Nome de usuário *'
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                </div>
                {/* campo de senha */}
                <div className={styles.taskInput}>
                    <img src={userSenha} alt="senha" />
                    <input 
                        type='password'
                        placeholder='Senha *'
                        onChange={(e) => setSenha(e.target.value)} 
                    />
                </div>

                <a href="">Esqueceu a senha?</a>

                {/* botão de entrar */}
                <button onClick={handleLogin}>Entrar</button>

                <a href="">Não tem uma conta? <span>Criar Conta</span></a>
            </div>
        </div>
    );
}

export default Login;