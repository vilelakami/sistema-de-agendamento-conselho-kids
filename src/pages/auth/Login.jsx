import { useState } from 'react';
import styles from "../css/Login.module.css";
import Esqueci_Senha from "../auth/ModalSenha";
import { Link, useNavigate } from 'react-router-dom'; 
import userIcon from "../../assets/icons/user.svg";
import sehnaIcon from "../../assets/icons/lock.svg";
import enterIcon from "../../assets/icons/enter.svg"

function Login() {
    const navigate = useNavigate();
    // useState pra armazenar e escrever os campos de usuario e login
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    //pro modal de esqueci senha
    const [modalAberto, setModalAberto] = useState(false);


    // função pra verificar condições
    function handleLogin(e) {
        //nao deixa o navegador recarregar a pagina
        if (e) e.preventDefault();

        //fazendo a verificação e tirando espaços
        if(usuario.trim() === "" || senha.trim() === ""){
            alert("Preencha todos os campos para continuar.");
            return;
        }

        if(!isNaN(usuario)){
            alert("O nome de usuário não deve conter apenas números!");
            return;
        }

        if(usuario.includes(" ") || senha.includes(" ")){
            alert("Os campos não devem ter espaços.");
            return;
        }

        const paraSalvar = {
            usuario: usuario,
            senha: senha
        };
        localStorage.setItem("dadosLogin", JSON.stringify(paraSalvar));

        //se der certo, imprime no console e limpa os inputs
        console.log("Logado com: ", usuario);

        setUsuario("");
        setSenha("");

        navigate("/Dashboard");
    }

    return (
        // tela do login
        <div className="page-wrapper">
            <div className={styles.container}>
                <div className={styles.left}>
                    <h2>AgendaNext</h2>
                    <p>Powered by NextPoint</p>
                </div>
                <div className={styles.right}>
                    <h2 className="task-title">Login</h2>
                    {/* campo de usuário */}
                    <div className={styles.taskInput}>
                        <img src={userIcon} alt="usuário" />
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
                        <input className={styles.inputSenha}
                            type='password'
                            placeholder='Senha *'
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)} 
                        />
                    </div>

                    <a className={styles.taskLinkSenha} onClick={() => setModalAberto(true)}>Esqueceu a senha?</a>

                    {/* botão de entrar */}
                    <button onClick={handleLogin}>
                        <img src={enterIcon} alt="entrar" />
                        Entrar
                    </button>
                </div>

                {/* //mandando os parâmetros pro modal de esqueci_senha */}
                <Esqueci_Senha
                    isOpen={modalAberto}
                    onClose={() => setModalAberto(false)}
                />
            </div>
        </div>
    );
}

export default Login;