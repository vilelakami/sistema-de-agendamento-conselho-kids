import React from "react";
import styles from "./css/ModalDashboard.module.css";
import addFilhoIcon from "../assets/icons/addConta.svg";
import deleteIcon from "../assets/icons/delete.svg";
import searchIcon from "../assets/icons/search.svg";

import { 
    aplicarMascaraCPF, 
    aplicarMascaraCEP, 
    formatarParaBr,
    formatarDateTimeParaBr,
    prepararDataParaInput,
    prepararDateTimeParaInput
} from "../components/utils/formatters";

function ModalDashboard({ fecharModal, aoSalvar, agendamentos}) {
    const [filhos, setFilhos] = React.useState([]);
    const dataHojeISO = new Date().toISOString().split('T')[0];
    const [cpfExistente, setCpfExistente] = React.useState(false);
    const [mensagemErro, setMensagemErro] = React.useState("");

    const [dados, setDados] = React.useState({
        responsavel: "",
        cpf: "",
        cep: "",
        comoConheceu: "Google",
        status: "aguardando_resposta",
        agendamento: "",
        dataCriacao: dataHojeISO, 
        qtdeFilhos: ""
    });

    const dadosVazios = {
        responsavel: "",
        cpf: "", // Manteremos o CPF que o usuário digitou
        cep: "",
        comoConheceu: "Google",
        status: "aguardando_resposta",
        agendamento: "",
        dataCriacao: new Date().toISOString().split('T')[0], 
        qtdeFilhos: ""
    };

    // --- FUNÇÕES DE ESTADO (Devem ficar aqui) ---

    const buscarCpf = () => {
        setMensagemErro("");
        setCpfExistente(false);

        if(!dados.cpf){
            alert("Digite um cpf para buscar.");
            return;
        }

        const encontrado = agendamentos.find(item => item.cpf === dados.cpf);

        if(encontrado){
            setDados({
                ...encontrado,
                dataCriacao: prepararDataParaInput(encontrado.dataCriacao),
                dataAgendamento: prepararDateTimeParaInput(encontrado.dataAgendamento)
            });

            if(encontrado.filhos && encontrado.filhos.length > 0){
                const novosFilhos = encontrado.filhos.map(filho => {
                    if(typeof filho === 'string' && filho.includes('-')){
                        const [nome, nasc] = filho.split('-');
                        return {nome: nome.trim(), nascimento: prepararDataParaInput(nasc.trim())};
                    }
                    return filho;
                });
                setFilhos(novosFilhos);
            } else {
                setFilhos([])
            }
            setCpfExistente(true);
            setMensagemErro("Já existe responsável cadastrado!")
        } else{
            setDados({
                ...dadosVazios,
                cpf: dados.cpf
            });
            setFilhos([]);
            setCpfExistente(false);
            alert("CPF disponível. Inicie o cadastro!");
        }
        
    };

    const adicionarFilho = () => {
        setFilhos([...filhos, { nome: "", nascimento: "" }]);
    };

    const removerFilho = (indexParaRemover) => {
        // Lógica que você aprendeu: filtra a lista removendo o índice clicado
        const novaLista = filhos.filter((_, indexAtual) => indexAtual !== indexParaRemover);
        setFilhos(novaLista);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let valorFinal = value;

        // Chamando as funções importadas do Utils
        if (name === "cpf") valorFinal = aplicarMascaraCPF(value);
        else if (name === "cep") valorFinal = aplicarMascaraCEP(value);

        setDados({ ...dados, [name]: valorFinal });
    };

    const handleFilho = (index, campo, valor) => {
        const novaLista = [...filhos];
        novaLista[index][campo] = valor;
        setFilhos(novaLista);
    };

    const handleSalvar = (e) => {
        e.preventDefault();

        // Validações básicas
        if(!dados.responsavel || !dados.cpf || !dados.cep){
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        if(filhos.some(filho => !filho.nome || !filho.nascimento)){
            alert("Preencha nome e nascimento de todos os filhos.");
            return;
        }

        if(cpfExistente){
            alert("Responsável já cadastrado no sistema.");
            return;
        }

        // Construção do objeto final usando os formatadores do Utils
        const cadastroFinal = {
            ...dados,
            // Formata a data de cada filho para o Dashboard
            filhos: filhos.map(filho => `${filho.nome} - ${formatarParaBr(filho.nascimento)}`),
            quantidadeFilhos: filhos.length,
            // Formata a data de criação escolhida
            dataCriacao: formatarParaBr(dados.dataCriacao), 
            // Formata o agendamento (data + hora)
            dataAgendamento: dados.agendamento ? formatarDateTimeParaBr(dados.agendamento) : null
        };

        aoSalvar(cadastroFinal);
        fecharModal();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <p>Adicionar Responsável</p>
                <div className={styles.taskDados}>
                    <div className={styles.taskDemaisInfo1}>
                        <div className={styles.taskCPF}>
                            <label>CPF <span className={styles.span}>*</span></label>
                            <input type="text" placeholder="ex: 55555555555" maxLength="14" name="cpf" value={dados.cpf} onChange={handleInputChange} required />
                            <button type="button" className={styles.btnSearch} onClick={buscarCpf}><img src={searchIcon} alt="pesquisar" /></button>
                            {mensagemErro && <p style={{color: 'red', fontSize: '8px', margin: '0'}}>{mensagemErro}</p>}
                        </div>
                        <div className={styles.taskNome}>
                            <label>Nome do Responsável <span className={styles.span}>*</span></label>
                            <input type="text" name="responsavel" placeholder="Nome completo" value={dados.responsavel} onChange={handleInputChange} required />
                        </div>
                        <div className={styles.taskCEP}>
                            <label>CEP <span className={styles.span}>*</span></label>
                            <input type="text" placeholder="ex: 55555555" name="cep" maxLength="9" value={dados.cep} onChange={handleInputChange}/>
                        </div>
                    </div>

                    <div className={styles.taskDemaisInfo2}>
                        <div className={styles.taskComoConheceu}>
                            <label>Como conheceu?</label>
                            <select name="comoConheceu" value={dados.comoConheceu} onChange={handleInputChange}>
                                <option value="">Selecione...</option>
                                <option value="Google">Google</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Indicação">Indicação</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>
                        
                        <div className={styles.taskDataCriacao}>
                            <label>Data de Criação</label>
                            <input className={styles.taskInput} type="date" name="dataCriacao" value={dados.dataCriacao} onChange={handleInputChange} required />
                        </div>

                        <div className={styles.taskQtdeFilhos}>
                            <label>Qtde. filhos:</label>
                            <input className={styles.taskInput} type="number" value={filhos.length} readOnly />
                        </div>
                    </div>

                    <div className={styles.taskDemaisInfo3}>
                        <div className={styles.taskStatus}>
                            <label>Status</label>
                            <select name="status" value={dados.status} onChange={handleInputChange}>
                                <option value="aguardando_resposta">Aguardando Resposta</option>
                                <option value="visita_agendada">Visita Agendada</option>
                                <option value="processo_concluido">Processo Concluído</option>
                                <option value="visita_cancelada">Visita Cancelada</option>
                            </select>
                        </div>
                        <div className={styles.taskAgendamento}>
                            <label>Agendamento</label>
                            <input type="datetime-local" name="agendamento" value={dados.agendamento} onChange={handleInputChange} /> 
                        </div>
                    </div>

                    {filhos.map((filho, index) => (                       
                        <div key={index} className={styles.linhaFilho}>
                            <div className={styles.taskNomeFilho}>
                                <label>Nome da Criança <span className={styles.span}>*</span></label>
                                <input type="text" placeholder="Nome Completo" value={filho.nome} onChange={(e) => handleFilho(index, "nome", e.target.value)}/>
                            </div>
                            <div className={styles.taskNascFilho}>
                                <label>Data de Nasc.: <span className={styles.span}>*</span></label>
                                <input type="date" value={filho.nascimento} onChange={(e) => handleFilho(index, "nascimento", e.target.value)}/>
                            </div>
                            {!cpfExistente && (
                            <button type="button" className={styles.btnDeletarFilho} onClick={() => removerFilho(index)}>
                                <img src={deleteIcon} alt="deletar filho" />
                            </button>
                            )}
                        </div>
                    ))}
                </div>

                <button className={styles.btnAddFilho} onClick={adicionarFilho}>
                    <img className={styles.taskIcon} src={addFilhoIcon} alt="adicionar" />
                    Adicionar Filho
                </button>

                <div className={styles.buttons}>
                    <button onClick={handleSalvar}>Salvar</button>
                    <button onClick={fecharModal}>Cancelar</button>
                </div>
            </div>
        </div>
    );
} 

export default ModalDashboard;