import { useState } from 'react';
import styles from "./Login.module.css";
import userIcon from "../assets/icons/user.svg";
import sehnaIcon from "../assets/icons/lock.svg";
import enterIcon from "../assets/icons/enter.svg"
import { Link } from 'react-router-dom';

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
        <div className="page-wrapper">
            <div className={styles.container}>
                <div className={styles.left}></div>
                <div className={styles.right}>
                    <h2 className="task-title">LOGIN</h2>
                    {/* campo de usuário */}
                    <div className={styles.taskInput}>
                        <img src={userIcon} alt="usuário" />
                        <input
                            type='text'
                            placeholder='Nome de usuário *'
                            onChange={(e) => setUsuario(e.target.value)}
                        />
                    </div>
                    {/* campo de senha */}
                    <div className={styles.taskInput}>
                        <img className={styles.taskIcon} src={sehnaIcon} alt="senha" />
                        <input 
                            type='password'
                            placeholder='Senha *'
                            onChange={(e) => setSenha(e.target.value)} 
                        />
                    </div>

                    <a className={styles.taskLinkSenha} href="">Esqueceu a senha?</a>

                    {/* botão de entrar */}
                    <button onClick={handleLogin}>
                        <img src={enterIcon} alt="entrar" />
                        Entrar
                    </button>

                    <Link to="/Cadastro" className={styles.taskConta}>Não tem uma conta? <span className='task-conta'>Criar Conta</span></Link>
                </div>
            </div>
        </div>
    );
}

export default Login;