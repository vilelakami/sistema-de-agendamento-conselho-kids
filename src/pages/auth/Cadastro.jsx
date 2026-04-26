import { useState } from 'react';
import styles from "../css/Cadastro.module.css";
import { Link, useNavigate } from 'react-router-dom';
import userIcon from "../../assets/icons/user.svg";
import sehnaIcon from "../../assets/icons/lock.svg";
import criarContaIcon from "../../assets/icons/addConta.svg";
import emailIcon from "../../assets/icons/email.svg";

function Cadastro(){
    // useState pra armazenar e escrever os campos de nome, email, usuario, senha e confir de senha
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const navigate = useNavigate();

    // função pra verificar condições
    function handleCadastro(e) {
        //previne de não recarregar a página
        if (e) e.preventDefault();

        if(nomeCompleto === "" || email === "" || usuario === "" || senha === "" || confirmarSenha === ""){
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        if(email.includes(" ") || usuario.includes(" ") || senha.includes(" ") || confirmarSenha.includes(" ")){
            alert("Não é permitido o uso de espaços nestes campos.");
            return;
        }

        if(senha !== confirmarSenha){
            alert("As senhas não coincidem.");
            return;
        }

        if(!email.includes("@") || !email.includes(".")){
            alert("Por favor, insira um email válido (exemplo@gmail.com)");
            return;
        }

        if(!isNaN(usuario)){
            alert("O nome de usuário não pode conter apenas números.");
            return;
        }

        const paraSalvar = {
            nomeCompleto: nomeCompleto,
            email: email,
            usuario: usuario,
            senha: senha
        };
        localStorage.setItem("dadosCadastro", JSON.stringify(paraSalvar));  

        console.log("Conta criada: ", nomeCompleto);

        setNomeCompleto("");
        setEmail("");
        setUsuario("");
        setSenha("");
        setConfirmarSenha("");

        navigate("/login");
    }


    return(
        <div className="page-wrapper">
            <div className={styles.container}>
                <div className={styles.left}>
                    <h2>AgendaNext</h2>
                    <p>Powered by NextPoint</p>
                </div>
                <div className={styles.right}>
                    <h2 className="task-title">Cadastro</h2>
                    {/* campo de nome completo */}
                    <div className={styles.taskInput}>
                        <img src={userIcon} alt="usuario" />
                        <input
                            type='text'
                            placeholder='Nome completo *'
                            value={nomeCompleto}
                            onChange={(e) => setNomeCompleto(e.target.value)}
                        />
                    </div>
                    {/* campo de email */}
                    <div className={styles.taskInput}>
                        <img src={emailIcon} alt="email" />
                        <input 
                            type='text'
                            placeholder='Email *'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    {/* campo de usuario */}
                    <div className={styles.taskInput}>
                        <img src={userIcon} alt="usuario" />
                        <input 
                            type='text'
                            placeholder='Nome de usuário *'
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)} 
                        />
                    </div>
                    {/* campo de senha */}
                    <div className={styles.taskInput}>
                        <img className={styles.taskIcon} src={sehnaIcon} alt="senha" />
                        <input className={styles.inpuSenha}
                            type='password'
                            placeholder='Senha *'
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)} 
                        />
                    </div>
                    {/* campo de confir de senha */}
                    <div className={styles.taskInput}>
                        <img className={styles.taskIcon} src={sehnaIcon} alt="senha" />
                        <input 
                            type='password'
                            placeholder='Confirmar senha *'
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)} 
                        />
                    </div>


                    {/* botão de entrar */}
                    <button type="button"onClick={handleCadastro}>
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