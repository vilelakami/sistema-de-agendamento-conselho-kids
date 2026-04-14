import { useState } from 'react';
import styles from "./Login.module.css";

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
                <input
                    type='text'
                    placeholder='Nome de usuário *'
                    onChange={(e) => setUsuario(e.target.value)}
                />
                {/* campo de senha */}
                <input 
                    type='password'
                    placeholder='Senha *'
                    onChange={(e) => setSenha(e.target.value)} 
                />

                <a href="#">Esqueceu a senha?</a>

                {/* botão de entrar */}
                <button onClick={handleLogin}>Entrar</button>

                <a href="#">Não tem uma conta? <span>Criar Conta</span></a>
            </div>
        </div>
    );
}

export default Login;