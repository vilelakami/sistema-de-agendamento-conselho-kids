import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Para navegar até o cadastro
import Sidebar from "../../components/sidebar/Sidebar";
import ModalSenha from "../auth/ModalSenha";
import styles from "../css/Configuracoes.module.css";
import editIcon from "../../assets/icons/edit_icon.svg";
import { useSearchParams } from "react-router-dom";
import deleteIcon from "../../assets/icons/delete.svg";
import emailjs from '@emailjs/browser';

function Configuracoes({ abrirModal }) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [modalAberto, setModalAberto] = useState(false);
    const [usuarioAdmin, setUsuarioAdmin] = useState({ nome: "", usuario: "", senha: "", email: "" });
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [idUsuarioSendoEditado, setIdUsuarioSendoEditado] = useState(null);
    const [modalAlterarSenhaAberto, setModalAlterarSenhaAberto] = useState(false);
    const [modalSolicitarEmailAberto, setModalSolicitarEmailAberto] = useState(false);

    useEffect(() => {
        // 1. Carrega dados do Admin
        const dados = localStorage.getItem("dadosLogin");
        const dadosCadastro = localStorage.getItem("dadosCadastro");

        let informacoes = { nome: "", usuario: "", senha: "", email: "" };
        
        if (dados) {
            const login = JSON.parse(dados);
            informacoes.usuario = login.usuario || "";
            informacoes.senha = login.senha || "";
        }
        if (dadosCadastro) {
            const cadastro = JSON.parse(dadosCadastro);
            informacoes.nome = cadastro.nomeCompleto || "";
            informacoes.email = cadastro.email || "";
        }
        setUsuarioAdmin(informacoes);

        // 2. Carrega lista de usuários
        const usuarios = JSON.parse(localStorage.getItem("usuarios_cadastrados")) || [];
        setListaUsuarios(usuarios);

        // ✅ 3. Lógica do Reset de Senha via URL (Corrigida)
        if (searchParams.get("reset") === "true") {
            setModalAlterarSenhaAberto(true);
            
            // Opcional: Limpa a URL após abrir para não reabrir ao dar F5
            navigate("/configuracoes", { replace: true });
        }
    }, [searchParams, navigate]);

    const enviarEmailRecuperacaoAdmin = async (emailUsuario) => {
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


    const excluirUsuario = (index) => {
            // 2. Cria uma nova lista removendo o item da posição 'index'
            const novaLista = listaUsuarios.filter((_, i) => i !== index);

            // 3. Atualiza o LocalStorage com a lista nova
            localStorage.setItem("usuarios_cadastrados", JSON.stringify(novaLista));

            // 4. Atualiza o estado para refletir na tela imediatamente
            setListaUsuarios(novaLista);

            alert("Usuário removido com sucesso!");
    };

    const alternarEdicao = (index) => {
        setIdUsuarioSendoEditado(idUsuarioSendoEditado === index ? null : index);
    };

    const salvarEdicaoUsuario = (index) => {
        // duplicanod lista atual para não mutar o estado diretamente
        const novaLista = [...listaUsuarios];

        // elementos do DOM dentro do container de edição expandido
        const container = document.querySelectorAll(`.${styles.camposEdicaoExpandidos}`)[0];
        
        if (container) {
            const novoNome = container.querySelector('input[type="text"]').value;
            const novoEmail = container.querySelector('input[type="email"]').value;
            const novaSenha = container.querySelectorAll('input[type="password"]')[0].value;
            const confirmarSenha = container.querySelectorAll('input[type="password"]')[1].value;

            // Validação de senha
            if (novaSenha !== confirmarSenha) {
                alert("As senhas não coincidem!");
                return;
            }

            if(novaSenha.length < 8){
                alert("A senha deve conter 8 caracteres.");
                return;
            }

            // 3. atualizando o objeto do usuário na lista
            novaLista[index] = {
                ...novaLista[index],
                nomeCompleto: novoNome,
                email: novoEmail,
                // Só atualiza a senha se o campo não estiver vazio
                senha: novaSenha || novaLista[index].senha 
            };

            // 4. Salva no LocalStorage e atualiza o estado
            localStorage.setItem("usuarios_cadastrados", JSON.stringify(novaLista));
            setListaUsuarios(novaLista);
            
            // 5. Fecha o modo de edição
            setIdUsuarioSendoEditado(null);
            alert("Alterações salvas com sucesso!");
        }
    };

    const handleNomeAdminChange = (e) => {
        setUsuarioAdmin({ ...usuarioAdmin, nome: e.target.value });
    };

    const salvarDadosAdmin = () => {
        const dadosCadastroExistentes = JSON.parse(localStorage.getItem("dadosCadastro")) || {};
        const novosDados = {
            ...dadosCadastroExistentes,
            nomeCompleto: usuarioAdmin.nome
        };
        localStorage.setItem("dadosCadastro", JSON.stringify(novosDados));
        alert("Nome do administrador atualizado com sucesso!");
    };

    return (
        <div className={styles.layout}>
            <Sidebar abrirModal={() => setModalAberto(true)} />
                {modalSolicitarEmailAberto && (
                    <ModalSenha 
                        isOpen={modalSolicitarEmailAberto} 
                        onClose={() => setModalSolicitarEmailAberto(false)} 
                        enviarEmail={enviarEmailRecuperacaoAdmin} 
                    />
                )}
            <div className={styles.container}>
                <div className={styles.taskDivisaoUsuario}>
                    
                    {/* COLUNA ESQUERDA: DADOS DO ADMIN */}
                    <div className={styles.taskContent}>
                        <div className={styles.taskTitle}>
                            <h2>Gestão de Usuários</h2>
                            <p>Gerencie os seus dados de Administrador.</p>
                        </div>
                        <div className={styles.taskLogin}>
                            <p>Admin</p>
                            <div className={styles.nome}>
                                <label>Nome Completo:</label>
                                <input type="text" value={usuarioAdmin.nome} onChange={handleNomeAdminChange} />
                            </div>
                            <div className={styles.user}>
                                <label>Nome de usuário:</label>
                                <input type="text" value={usuarioAdmin.usuario} disabled />
                            </div>
                            <div className={styles.email}>
                                <label>Email:</label>
                                <input type="text" value={usuarioAdmin.email} disabled />
                            </div>
                            <div className={styles.senha}>
                                <label>Senha:</label>
                                <input type="password" value={usuarioAdmin.senha} disabled />
                            </div>  
                            <button onClick={() => setModalSolicitarEmailAberto(true)} className={styles.btnAlterarSenhaAdmin}>Alterar Senha</button>
                        </div>
                        <button className={styles.btnSalvarAdmin} onClick={salvarDadosAdmin}>Salvar Alterações</button>
                    </div>

                    {/* COLUNA DIREITA: LISTAGEM E EDIÇÃO */}
                    <div className={styles.usuarios}>
                        <div className={styles.taskTitleUsuario}>
                            <h2>Todos os usuários cadastrados</h2>
                            <p>Gerencie os usuários cadastrados.</p>
                        </div>
                        <div className={styles.taskLogin}>
                            <p>Usuários</p>
                            
                            {listaUsuarios.map((user, index) => (
                                <div key={index} className={styles.nomeUsuarioCadastrado}>
                                    <div className={styles.linhaUsuario}>
                                        <label>Usuário ({index + 1})</label>
                                        <div className={styles.usuario}>
                                            <input 
                                                type="text" 
                                                value={user.usuario || user.nomeUsuario} 
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
                                            <button type="button" className={styles.btnDeleteUser} onClick={() => excluirUsuario(index)}><img src={deleteIcon} alt="deletar usuário" /></button>
                                        </div>
                                    </div>

                                    {/* CAMPOS QUE ABREM AO CLICAR EM EDITAR */}
                                    {idUsuarioSendoEditado === index && (
                                        <div className={styles.camposEdicaoExpandidos}>
                                            <div className={styles.nomeEdicaoExpandido}>
                                                <label>Nome Completo:</label>
                                                <input type="text" defaultValue={user.nomeCompleto} />
                                            </div>
                                            <div className={styles.emailEdicaoExpandido}>
                                                <label>Email:</label>
                                                <input type="email" defaultValue={user.email} />
                                            </div>
                                            <div className={styles.senhaEdicaoExpandido}>
                                                <label>Senha:</label>
                                                <input type="password" defaultValue={user.senha} />
                                            </div>
                                            <div className={styles.senhaEdicaoExpandido}>
                                                <label>Confirmar Senha:</label>
                                                <input type="password" />
                                            </div>
                                            <button className={styles.salvarIndividual} onClick={() => salvarEdicaoUsuario(index)}>Salvar Alterações</button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button 
                                type="button" 
                                className={styles.addUsuario} 
                                onClick={() => navigate("/cadastro")} // Vai para a página de cadastro
                            >
                                + Adicionar Novo Usuário
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Configuracoes;