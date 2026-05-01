import { useState, useEffect } from 'react';
import styles from "../css/Login.module.css";
import Esqueci_Senha from "../auth/ModalSenha";
import NovaSenha from "../auth/NovaSenha";
import { useNavigate } from 'react-router-dom'; 
import userIcon from "../../assets/icons/user.svg";
import sehnaIcon from "../../assets/icons/lock.svg";
import enterIcon from "../../assets/icons/enter.svg"
import { useSearchParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';

function Login() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [searchParams] = useSearchParams();
    const [modalNovaSenhaAberto, setModalNovaSenhaAberto] = useState(false);

    const enviarEmailRecuperacao = async (emailUsuario) => {
        // Log para saber se a função acordou
        console.log("Chamando EmailJS para:", emailUsuario);
        
        try {
            const templateParams = {
                email: emailUsuario,
                link: "http://localhost:3000/?reset=true" 
            };

            const response = await emailjs.send(
                'service_vqskpvq', 
                'template_zbkje5d', 
                templateParams, 
                'qmTNkhntxdwkDJjvN'
            );

            console.log('SUCESSO!', response.status, response.text);
            alert("E-mail de recuperação enviado!");
        } catch (err) {
            console.error('FALHA NO ENVIO:', err);
            alert("Erro ao enviar e-mail.");
        }
    };

    useEffect(() => {
        // Pega o valor do parâmetro 'reset'
        const modoReset = searchParams.get("reset");
        
        console.log("Valor do parâmetro reset:", modoReset); // Verifique no console (F12)

        if (modoReset === "true") {
            setModalNovaSenhaAberto(true);
        }
    }, [searchParams]); 
    function handleLogin(e) {
        if (e) e.preventDefault();

        if(usuario.trim() === "" || senha.trim() === ""){
            alert("Preencha todos os campos para continuar.");
            return;
        }

        const paraSalvar = { usuario, senha };
        localStorage.setItem("dadosLogin", JSON.stringify(paraSalvar));
        navigate("/Dashboard");
    }

    return (
        <div className="page-wrapper">
            {modalNovaSenhaAberto && (
                <NovaSenha fecharModal={() => setModalNovaSenhaAberto(false)} />
            )}
            <div className={styles.container}>
                <div className={styles.left}>
                    <h2>AgendaNext</h2>
                    <p>Powered by NextPoint</p>
                </div>
                
                <div className={styles.right}>
                    <h2 className="task-title">Login</h2>
                    
                    <form onSubmit={handleLogin} style={{ display: 'contents' }}>
                        <div className={styles.taskInput}>
                            <img src={userIcon} alt="usuário" />
                            <input
                                type='text'
                                placeholder='Nome de usuário *'
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className={styles.taskInput}>
                            <img className={styles.taskIcon} src={sehnaIcon} alt="senha" />
                            <input className={styles.inputSenha}
                                type='password'
                                placeholder='Senha *'
                                maxLength="8"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)} 
                                autoComplete="current-password"
                            />
                        </div>    

                        <a className={styles.taskLinkSenha} onClick={() => setModalAberto(true)}>
                            Esqueceu a senha?
                        </a>

                        <button type="submit">
                            <img src={enterIcon} alt="entrar" />
                            Entrar
                        </button>
                    </form>
                </div>

                <Esqueci_Senha
                    isOpen={modalAberto}
                    onClose={() => setModalAberto(false)}
                    enviarEmail={enviarEmailRecuperacao}
                />
            </div>
        </div>
    );
}

export default Login;