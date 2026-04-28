import React from "react";
import styles from "./css/ModalDashboard.module.css";
import addFilhoIcon from "../assets/icons/addConta.svg";
import { data } from "react-router-dom";

function ModalDashboard({ fecharModal, aoSalvar, formatarData }){
    const [filhos, setFilhos] = React.useState([]);
    const [dados, setDados] = React.useState({
        responsavel: "",
        cpf: "",
        cep: "",
        comoConheceu: "",
        status: "aguardando_resposta",
        agendamento: "",
        dataCriacao: "",
        qtdeFilhos: ""
    });

    const adicionarFilho = () => {
        setFilhos([
            ...filhos, 
            { nome: "", nascimento: "" }
        ]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDados({
            ...dados,
            [name]: value
        });
    };

    const handleFilho = (index, campo, valor) => {
        const novaLista = [...filhos];
        novaLista[index][campo] = valor;
        setFilhos(novaLista);
    };

    const handleSalvar = (e) => {

        if(!dados.responsavel || dados.responsavel.trim() === "" || !dados.cpf || !dados.cep){
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        if(filhos.length > 0){
            const campoVazio = filhos.some(filho => !filho.nome?.trim() || !filho.nascimento);
            if(campoVazio){
                alert("Os campos de nome da criança e data de nascimento são obrigatórios.");
                return;
            }
        }

        e.preventDefault();
        const cadastroFinal = {
            ...dados,
            filhos: filhos.map(filho => `${filho.nome} - ${formatarData(filho.nascimento)}`),
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
                    <div className={styles.taskDemaisInfo}>
                        <div className={styles.taskCPF}>
                            <label>CPF do Responsável <span className={styles.span}>*</span></label>
                            <input type="text"
                            name="cpf"
                            placeholder="ex: 55555555555"
                            value={dados.cpf}
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles.taskCEP}>
                            <label>CEP do Responsável <span className={styles.span}>*</span></label>
                            <input type="text"
                            name="cep"
                            placeholder="ex: 55555555"
                            value={dados.cep}
                            onChange={handleInputChange}
                                />
                        </div>
                    </div>
                    <div className={styles.taskDemaisInfo}>
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
                            <input className={styles.taskInput} type="date" name="dataCriacao" value={dados.dataCriacao} onChange={handleInputChange} />
                        </div>
                        <div className={styles.taskQtdeFilhos}>
                            <label>Qtde. filhos:</label>
                            <input className={styles.taskInput} type="number" name="qtdeFilhos" value={dados.qtdeFilhos} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className={styles.taskDemaisInfo}>
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