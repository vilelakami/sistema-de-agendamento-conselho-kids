import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "../css/Configuracoes.module.css";
import editIcon from  "../../assets/icons/edit_icon.svg"
import { useEffect } from "react";

function Configuracoes({abrirModal}){
    const [modalAberto, setModalAberto] = React.useState(false);
    const [usuarioAdmin, setUsuarioAdmin] = React.useState({nome: "", usuario: "", senha: "", email: ""});
    const [listaUsuarios, setListaUsuarios] = React.useState([]);
    const [usuarioSendoEditado, setUsuarioSendoEditado] = React.useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUsuarioAdmin(prev =>  ({...prev, [name]: value}));
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
        setUsuarioAdmin(informacoes); 
        
        const usuarios = JSON.parse(localStorage.getItem("usuarios_cadastrados")) || [];
            setListaUsuarios(usuarios);
    }, []);

    // Alterna a exibição dos campos de edição
    const alternarEdicao = (index) => {
        if (idUsuarioSendoEditado === index) {
            setIdUsuarioSendoEditado(null); // Fecha se clicar novamente
        } else {
            setIdUsuarioSendoEditado(index); // Abre o formulário do usuário específico
        }
    };

    return(
        <div className={styles.layout}>
            <Sidebar abrirModal={() => setModalAberto(true)}/>
                <div className={styles.container}>
                    <div className={styles.taskDivisaoUsuario}>
                        <div className={styles.taskContent}>
                            <div className={styles.taskTitle}>
                                <h2>Gestão de Usuários</h2>
                                <p>Gerencie os dados dos usuários.</p>
                            </div>
                            <div className={styles.taskLogin}>
                                <p>Admin</p>
                                <div className={styles.nome}>
                                    <label>Nome Completo:</label>
                                    <input 
                                    type="text"
                                    name="nome"
                                    value={usuarioAdmin.nome} 
                                    onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.user}>
                                    <label>Nome de usuário:</label>
                                    <input 
                                    disabled={true}
                                    type="text"
                                    name="usuario"
                                    value={usuarioAdmin.usuario} 
                                    onChange={handleChange}/>
                                </div>
                                <div className={styles.email}>
                                    <label>Email:</label>
                                    <input 
                                    disabled={true}
                                    type="text"
                                    name="email"
                                    value={usuarioAdmin.email} 
                                    onChange={handleChange}/>
                                </div>
                                <div className={styles.senha}>
                                    <label>Senha:</label>
                                    <input 
                                    disabled={true}
                                    type="text"
                                    name="senha"
                                    value={usuarioAdmin.senha} 
                                    onChange={handleChange}/>
                                </div>
                                <button className={styles.editarSenha}>Alterar Senha</button>
                            </div>
                            <button className={styles.salvarAlteracoes}>Salvar Alterações</button>
                        </div>
                        <div className={styles.usuarios}>
                            <div className={styles.taskTitleUsuario}>
                                <h2>Todos os usuários cadastrados</h2>
                                <p>Gerencie os usuários cadastrados.</p>
                            </div>
                            <div className={styles.taskLogin}>
                                {listaUsuarios.length === 0 ? (
                                    <p>Nenhum usuário cadastrado.</p>
                                ) : (
                                    listaUsuarios.map((user, index) => (
                                        <div key={index} className={styles.nomeUsuarioCadastrado}>
                                            <label>Usuário {index + 1}</label>
                                            <div className={styles.usuario}>
                                                <input 
                                                    type="text" 
                                                    value={user.usuario || user.nome} 
                                                    readOnly 
                                                />
                                                <button 
                                                    type="button" 
                                                    className={styles.editarSenha2}
                                                    onClick={() => alternarEdicao(index)}
                                                > 
                                                    <img src={editIcon} alt="editar" />
                                                    {idUsuarioSendoEditado === index ? "Fechar" : "Editar Usuário"}
                                                </button>
                                            </div>

                                            {/* FORMULÁRIO DE EDIÇÃO CONDICIONAL */}
                                            {idUsuarioSendoEditado === index && (
                                                <div className={styles.camposEdicaoExpandidos}>
                                                    <div className={styles.nome}><label>Nome Completo:</label><input type="text" defaultValue={user.nome} /></div>
                                                    <div className={styles.email}><label>Email:</label><input type="email" defaultValue={user.email} /></div>
                                                    <div className={styles.senha}><label>Nova Senha:</label><input type="password" /></div>
                                                    <div className={styles.senha}><label>Confirmar Senha:</label><input type="password" /></div>
                                                    <button className={styles.salvarIndividual}>Salvar Alterações</button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                                <button type="button" className={styles.addUsuario}>+ Adicionar Novo Usuário</button>
                            </div>
                        </div>
                    </div>   
                </div>
            </div>
    );
} export default Configuracoes;