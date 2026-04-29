import React from "react";
import styles from "./css/ModalDashboard.module.css";
import addFilhoIcon from "../assets/icons/addConta.svg";

function ModalDashboard({ fecharModal, aoSalvar, formatarData }){
    const [filhos, setFilhos] = React.useState([]);
    const [dados, setDados] = React.useState({
        responsavel: "",
        cpf: "",
        cep: "",
        comoConheceu: "",
        status: "aguardando_resposta",
        agendamento: "",
        // 1. Definindo a data de hoje no formato YYYY-MM-DD para o input
        dataCriacao: new Date().toISOString().split('T')[0],
        qtdeFilhos: ""
    });

    // Adiciona um novo objeto de filho à lista
    const adicionarFilho = () => {
        setFilhos([
            ...filhos, 
            { nome: "", nascimento: "" }
        ]);
    };

    // Gerencia as mudanças nos inputs do responsável
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDados({
            ...dados,
            [name]: value
        });
    };

    // Gerencia as mudanças nos inputs de cada filho
    const handleFilho = (index, campo, valor) => {
        const novaLista = [...filhos];
        novaLista[index][campo] = valor;
        setFilhos(novaLista);
    };

    const handleSalvar = (e) => {
        // Previne o reload da página
        e.preventDefault();

        // Validação dos campos obrigatórios do responsável
        if(!dados.responsavel || dados.responsavel.trim() === "" || !dados.cpf || !dados.cep){
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        // 3. Verificação dos filhos (Validando se nome e data de cada um estão preenchidos)
        if(filhos.length > 0){
            const camposVazios = filhos.some((filho) => {
                return !filho.nome || filho.nome.trim() === "" || !filho.nascimento;
            });
            
            if(camposVazios){
                alert("Os campos nome da criança e data de nascimento são obrigatórios para todos os filhos adicionados.");
                return;
            }
        }

        const cadastroFinal = {
            ...dados,
            filhos: filhos.map(filho => `${filho.nome} - ${formatarData(filho.nascimento)}`),
            // 1. Enviando a quantidade real de filhos para o Dashboard
            quantidadeFilhos: filhos.length,
            dataCriacao: new Date().toLocaleDateString('pt-BR'),
            dataAgendamento: dados.agendamento || null
        };

        aoSalvar(cadastroFinal);
        fecharModal();
    };

    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <p>Adicionar Responsável</p>
                <div className={styles.taskDados}>
                    <div className={styles.taskNome}>
                        <label>Nome do Responsável <span className={styles.span}>*</span></label>
                        <input type="text"
                        name="responsavel"
                        placeholder="Nome completo"
                        value={dados.responsavel}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.taskDemaisInfo1}>
                        <div className={styles.taskCPF}>
                            <label>CPF <span className={styles.span}>*</span></label>
                            <input type="text"
                            name="cpf"
                            placeholder="ex: 55555555555"
                            value={dados.cpf}
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles.taskCEP}>
                            <label>CEP <span className={styles.span}>*</span></label>
                            <input type="text"
                            name="cep"
                            placeholder="ex: 55555555"
                            value={dados.cep}
                            onChange={handleInputChange}
                                />
                        </div>
                    </div>
                    <div className={styles.taskDemaisInfo2}>
                        <div className={styles.taskComoConheceu}>
                            <label>Como conheceu?</label>
                            <select
                            name="comoConheceu"
                            value={dados.comoConheceu}
                            onChange={handleInputChange}
                            >
                                <option value="">Selecione...</option>
                                <option value="google">Google</option>
                                <option value="instagram">Instagram</option>
                                <option value="indicacao">Indicação</option>
                                <option value="outros">Outros</option>
                            </select>
                        </div>
                        <div className={styles.taskDataCriacao}>
                            <label>Data de Criação</label>
                            {/* 1. Campo agora é readOnly */}
                            <input className={styles.taskInput} type="date" name="dataCriacao" value={dados.dataCriacao} readOnly />
                        </div>
                        <div className={styles.taskQtdeFilhos}>
                            <label>Qtde. filhos:</label>
                            {/* 1. Refletindo a quantidade real de filhos adicionados */}
                            <input className={styles.taskInput} type="number" name="qtdeFilhos" value={filhos.length} readOnly />
                        </div>
                    </div>
                    <div className={styles.taskDemaisInfo3}>
                        <div className={styles.taskStatus}>
                            <label>Status</label>
                            <select
                                name="status"
                                value={dados.status}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecione...</option>
                                <option value="visita_agendada">Visita Agendada</option>
                                <option value="aguardando_resposta">Aguardando Resposta</option>
                                <option value="processo_concluido">Processo Concluído</option>
                                <option value="visita_cancelada">Visita Cancelada</option>
                            </select>
                        </div>
                        <div className={styles.taskAgendamento}>
                            <label>Agendamento</label>
                            <input type="datetime-local"
                            name="agendamento"
                            value={dados.agendamento}
                            onChange={handleInputChange} /> 
                        </div>
                    </div>
                    {filhos.map((filho,index)=> (                      
                            <div key={index} className={styles.linhaFilho}>
                                <div className={styles.taskNomeFilho}>
                                    <label>Nome da Criança <span className={styles.span}>*</span></label>
                                    <input type="text"
                                    placeholder="Nome Completo" 
                                    value={filho.nome}
                                    onChange={(e) => handleFilho(index, "nome", e.target.value)}/>
                                </div>
                                <div className={styles.taskNascFilho}>
                                    <label>Data de Nasc.: <span className={styles.span}>*</span></label>
                                    <input type="date"
                                    value={filho.nascimento}
                                    onChange={(e) => handleFilho(index, "nascimento", e.target.value)}/>
                                </div>
                            </div>
                    ))}
                </div>
                <button className={styles.btnAddFilho} onClick={adicionarFilho}><img className={styles.taskIcon}src={addFilhoIcon} alt="adicionar" />Adicionar Filho</button>
                <div className={styles.buttons}>
                    <button onClick={handleSalvar}>Salvar</button>
                    <button onClick={fecharModal}>Cancelar</button>
                </div>
            </div>
        </div>
    );
} export default ModalDashboard;