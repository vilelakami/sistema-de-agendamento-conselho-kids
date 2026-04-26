import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "../css/Configuracoes.module.css";
import { useEffect } from "react";

function Configuracoes({abrirModal}){
    const [modalAberto, setModalAberto] = React.useState(false);
    const [usuario, setUsuario] = React.useState({nome: "", usuario: "", senha: "", email: ""});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUsuario(prev =>  ({...prev, [name]: value}));
    };

    useEffect(() => {
        const dados = localStorage.getItem("dadosLogin");
        const dadosCadastro = localStorage.getItem("dadosCadastro");

        let informacoes = {nome: "", usuario: "", senha: "", email: ""};
        if(dados){
            const login = JSON.parse(dados);
            informacoes.usuario = login.usuario || "";
            informacoes.senha = login.senha || "";
        }
        if(dadosCadastro){
            const cadastro = JSON.parse(dadosCadastro);
            informacoes.nome = cadastro.nomeCompleto || "";
            informacoes.email = cadastro.email || "";
        }
        setUsuario(informacoes);    
    }, []);

    return(
        <div className={styles.layout}>
            <Sidebar abrirModal={() => setModalAberto(true)}/>
            <div className={styles.container}>
                <div className={styles.taskContent}>
                    <div className={styles.taskTitle}>
                        <h2>Gestão de Usuário</h2>
                        <p>Gerencie os dados do usuário.</p>
                    </div>
                    <div className={styles.taskLogin}>
                        <div className={styles.nome}>
                            <label>Nome Completo:</label>
                            <input 
                            type="text"
                            name="nome"
                            value={usuario.nome} 
                            onChange={handleChange}
                            />
                        </div>
                        <div className={styles.user}>
                            <label>Nome de usuário:</label>
                            <input 
                            disabled={true}
                            type="text"
                            name="usuario"
                            value={usuario.usuario} 
                            onChange={handleChange}/>
                        </div>
                        <div className={styles.email}>
                            <label>Email:</label>
                            <input 
                            disabled={true}
                            type="text"
                            name="email"
                            value={usuario.email} 
                            onChange={handleChange}/>
                        </div>
                        <div className={styles.senha}>
                            <label>Senha:</label>
                            <input 
                            disabled={true}
                            type="text"
                            name="senha"
                            value={usuario.senha} 
                            onChange={handleChange}/>
                        </div>
                        <button className={styles.editarSenha}>Alterar Senha</button>
                    </div>
                </div>
                    <button className={styles.salvarAlteracoes}>Salvar Alterações</button>
            </div>
        </div>
    );
} export default Configuracoes;