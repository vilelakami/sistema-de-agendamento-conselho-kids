import { useState } from 'react';
import styles from "../css/Cadastro.module.css";
import { Link, useNavigate } from 'react-router-dom';
import userIcon from "../../assets/icons/user.svg";
import senhaIcon from "../../assets/icons/lock.svg";
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

    const aoSubmeterCadastro = (novoUsuario) => {
        // Busca a lista que já existe ou cria uma vazia
        const listaAtual = JSON.parse(localStorage.getItem("usuarios_cadastrados")) || [];
        
        // Adiciona o novo usuário na lista
        const novaLista = [...listaAtual, novoUsuario];
        
        // Salva a lista atualizada
        localStorage.setItem("usuarios_cadastrados", JSON.stringify(novaLista));
        
        // Volta para a página de configurações
        navigate("/configuracoes");
    };

    // função pra verificar condições
   function handleCadastro(e) {
        if (e) e.preventDefault();

        // 1. Validações 
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

        if(senha.length < 8){
            alert("A senha deve conter 8 caracteres");
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

        // 2. Lógica de SALVAR NA LISTA (Para não sobrescrever o Admin)
        const novoUsuario = {
            id: Date.now(), // ID único para controle
            nomeCompleto: nomeCompleto,
            email: email,
            usuario: usuario,
            senha: senha
        };

        // Busca a lista existente ou cria uma vazia
        const listaAtual = JSON.parse(localStorage.getItem("usuarios_cadastrados")) || [];
        
        // Adiciona o novo usuário na lista
        const novaLista = [...listaAtual, novoUsuario];
        
        // Salva a lista atualizada
        localStorage.setItem("usuarios_cadastrados", JSON.stringify(novaLista));

        console.log("Usuário cadastrado pelo Admin: ", nomeCompleto);

        // 3. Limpa os campos
        setNomeCompleto("");
        setEmail("");
        setUsuario("");
        setSenha("");
        setConfirmarSenha("");

        // 4. Volta para Configurações (onde a lista será exibida)
        alert("Novo usuário cadastrado com sucesso!");
        navigate("/configuracoes");
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
                            required
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
                            required
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
                            required 
                        />
                    </div>
                    {/* campo de senha */}
                    <div className={styles.taskInput}>
                        <img className={styles.taskIcon} src={senhaIcon} alt="senha" />
                        <input className={styles.inpuSenha}
                            type='password'
                            placeholder='Senha *'
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)} 
                            maxLength="8"
                            required
                        />
                    </div>
                    {/* campo de confir de senha */}
                    <div className={styles.taskInput}>
                        <img className={styles.taskIcon} src={senhaIcon} alt="senha" />
                        <input 
                            type='password'
                            placeholder='Confirmar senha *'
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)} 
                            required
                        />
                    </div>


                    {/* botão de entrar */}
                    <button type="button"onClick={handleCadastro}>
                        <img src={criarContaIcon} alt="Criar Conta" />
                        Criar Conta
                    </button>

                </div>
            </div>
        </div>
    );
}
export default Cadastro;