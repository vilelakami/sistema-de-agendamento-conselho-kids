import { useState } from 'react';
import styles from "./Cadastro.module.css";
import userIcon from "../assets/icons/user.svg";
import sehnaIcon from "../assets/icons/lock.svg";
import criarContaIcon from "../assets/icons/addConta.svg"
import emailIcon from "../assets/icons/email.svg"
import { Link } from 'react-router-dom';

function Cadastro(){
    // useState pra armazenar e escrever os campos de nome, email, usuario, senha e confir de senha
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    // função pra verificar condições
    function handleCadastro() {
        console.log("Usuario: ", usuario);
        console.log("Senha", senha);
    }

    return(
        <div className="page-wrapper">
            <div className={styles.container}>
                <div className={styles.left}></div>
                <div className={styles.right}>
                    <h2 className="task-title">CADASTRO</h2>
                    {/* campo de nome completo */}
                    <div className={styles.taskInput}>
                        <img src={userIcon} alt="usuario" />
                        <input
                            type='text'
                            placeholder='Nome completo *'
                            onChange={(e) => setNomeCompleto(e.target.value)}
                        />
                    </div>
                    {/* campo de email */}
                    <div className={styles.taskInput}>
                        <img src={emailIcon} alt="email" />
                        <input 
                            type='text'
                            placeholder='Email *'
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    {/* campo de usuario */}
                    <div className={styles.taskInput}>
                        <img src={userIcon} alt="usuario" />
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
                    {/* campo de confir de senha */}
                    <div className={styles.taskInput}>
                        <img className={styles.taskIcon} src={sehnaIcon} alt="senha" />
                        <input 
                            type='password'
                            placeholder='Confirmar senha *'
                            onChange={(e) => setConfirmarSenha(e.target.value)} 
                        />
                    </div>


                    {/* botão de entrar */}
                    <button onClick={handleCadastro}>
                        <img src={criarContaIcon} alt="Criar Conta" />
                        Criar Conta
                    </button>

                    <Link to="/Login" className={styles.taskConta}>Já tem uma conta? <span className='task-conta'>Faça Login</span></Link>
                </div>
            </div>
        </div>
    );
}
export default Cadastro;