import React, { useState, useEffect } from "react";
import styles from "./css/Dashboard.module.css";
import Button from "../components/Button/Button";
import calendarIcon from "../assets/icons/calendar.svg";
import Sidebar from "../components/sidebar/Sidebar";
import ModalDashboard from "./ModalDashboard";
import ModalResponsavel from "./ModalResponsavel";

import { 
    calcularDiasDesdesCriacao, 
    prepararDataParaInput,
    aplicarMascaraCPF, 
    aplicarMascaraCEP,
    formatarDateTimeParaBr,
    statusLabels,
    pesosStatus,
    statusOptions
} from "../components/utils/formatters";

function Dashboard() {
    const [linhaExpandidaCpf, setLinhaExpandidaCpf] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [menuStatusAberto, setMenuStatusAberto] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [modalResponsavelAberto, setModalResponsavelAberto] = useState(false);
    const [editandoCpf, setEditandoCpf] = useState(null);
    const [dataInput, setDataInput] = useState(""); 
    const [agendamentos, setAgendamentos] = useState([]);
    
    const [ordemCriacao, setOrdemCriacao] = useState("asc");
    const [ordemAgendamento, setOrdemAgendamento] = useState("asc");    

    useEffect(() => {
        const dadosSalvos = localStorage.getItem('agendamentos');
        if (dadosSalvos) setAgendamentos(JSON.parse(dadosSalvos));
    }, []);

    useEffect(() => {
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    }, [agendamentos]);

    //função sort que filtra os agendamentos
    const filtrarAgendamento = () => {
        const lista = [...agendamentos];
        
        lista.sort((a,b) => {
            const dataA = a.dataAgendamento ? new Date(prepararDataParaInput(a.dataAgendamento)) : new Date(0);
            const dataB = b.dataAgendamento ? new Date(prepararDataParaInput(b.dataAgendamento)) : new Date(0);

            if(ordemAgendamento === "asc"){
                return dataA - dataB;
            } else{
                return dataB - dataA;
            }
        });
        setAgendamentos(lista);
        setOrdemAgendamento(ordemAgendamento === "asc" ? "desc" : "asc");
    }

    // Função que apenas muda o critério de ordenação
    const filtrarDataCriacao = () => {
        const lista = [...agendamentos];

        lista.sort((a,b) => {
            const dataA = a.dataCriacao ? new Date(prepararDataParaInput(a.dataCriacao)) : new Date(0);
            const dataB = b.dataCriacao ? new Date(prepararDataParaInput(b.dataCriacao)) : new Date(0);

            if(ordemCriacao === "asc"){
                return dataA - dataB;
            } else{
                return dataB - dataA;
            }

        });

        setAgendamentos(lista);
        setOrdemCriacao(ordemCriacao === "asc" ? "desc" : "asc");
    };

    const salvarEdicao = (cpf) => {
        if(!dataInput) { setEditandoCpf(null); return; }
        const novaLista = agendamentos.map(item => {
            if (item.cpf === cpf) {
                return {
                    ...item,
                    dataAgendamento: formatarDateTimeParaBr(dataInput),
                    status: "visita_agendada"
                };
            }
            return item;
        });
        setAgendamentos(novaLista);
        setEditandoCpf(null);
        setDataInput("");
    };

    const agendamentosAtivos = agendamentos.filter(item => {
        return item.status !== "processo_concluido" && item.status !== "visita_cancelada";
    });

    const agendamentosFiltrados = agendamentosAtivos.filter(item => {
        if (filtroStatus === "todos") return true;
        return item.status === filtroStatus;
    });

    const listaOrganizada = [...agendamentosFiltrados]; 

    const cadastrarPessoa = (dadosModal) => {
        const novoAgendamento = {
            ...dadosModal,
            dataAgendamento: dadosModal.agendamento ? formatarDateTimeParaBr(dadosModal.agendamento) : null,
            filhos: dadosModal.filhos || [] 
        };
        setAgendamentos([...agendamentos, novoAgendamento]);
        setModalAberto(false);
    };

    const atualizarDados = (dadosModalResponsavel) => {
        const novaLista = agendamentos.map(item => item.cpf === dadosModalResponsavel.cpf ? dadosModalResponsavel : item);
        setAgendamentos(novaLista);
    };

    return (
        <div className={styles.layout}>
            <Sidebar abrirModal={() => setModalAberto(true)}/>
            
            {modalAberto && (
                <ModalDashboard 
                    fecharModal={() => setModalAberto(false)} 
                    aoSalvar={cadastrarPessoa} 
                    agendamentos={agendamentos}
                /> 
            )}
            
            {modalResponsavelAberto && itemSelecionado && (
                <ModalResponsavel 
                    fecharModal={() => setModalResponsavelAberto(false)} 
                    dados={itemSelecionado} 
                    atualizarDados={atualizarDados}
                />
            )}

            <div className={styles.tableWrapper}>
                <h2 className={styles.taskTitlePage}>Dashboard</h2>
                <div className={styles.container}>
                    <table className={styles.taskTable}>
                        <thead>
                            <tr>
                                <th>Responsável</th>
                                <th>CPF</th>
                                <th>CEP</th>
                                <th>Como Conheceu:</th>
                                {/* Clique chama a função que altera o critério */}
                                <th onClick={filtrarDataCriacao} style={{cursor: 'pointer'}}>
                                    Dt. de Criação: {ordemCriacao === 'asc' ? "↑" : "↓"}
                                </th>
                                <th>Qtde. Filhos</th>
                                <th className={styles.filterHeader} onClick={() => setMenuStatusAberto(!menuStatusAberto)}>
                                    Status <span className={styles.taskArrow}>v</span>
                                    {menuStatusAberto && (
                                        <div className={styles.filter} onClick={(e) => e.stopPropagation()}>
                                            {statusOptions.map((st) => (
                                                <div key={st.value} className={styles.filterOption} onClick={() => { setFiltroStatus(st.value); setMenuStatusAberto(false); }}>
                                                    <input type="radio" checked={filtroStatus === st.value} readOnly />
                                                    <label>{st.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </th>
                                <th className={styles.filterHeader} onClick={filtrarAgendamento}>
                                    Agendamento {ordemAgendamento === "asc" ? "↑" : "↓"}
                                </th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {listaOrganizada.map((item, index) => (
                                <React.Fragment key={item.cpf || index}>
                                    <tr className={styles[item.status] || styles.rowAguardandoResposta}>
                                        <td>
                                            <a href="#" className={styles.nomeLink} onClick={(e) => {
                                                e.preventDefault(); 
                                                setItemSelecionado(item);
                                                setModalResponsavelAberto(true);
                                            }}>
                                                {item?.responsavel}
                                            </a>
                                        </td>
                                        <td>{aplicarMascaraCPF(item.cpf)}</td>
                                        <td>{aplicarMascaraCEP(item.cep)}</td>
                                        <td>{item.comoConheceu}</td>
                                        <td>{item.dataCriacao}</td>
                                        <td>{item.quantidadeFilhos}</td>
                                        <td>{statusLabels[item.status] || item.status}</td>
                                        <td className={styles.colAgendamento}>
                                            {editandoCpf === item.cpf ? (
                                                <div className={styles.editAgendamento}>
                                                    <input type="datetime-local" className={styles.taskInputDate} value={dataInput} onChange={(e) => setDataInput(e.target.value)} />
                                                    <div className={styles.editButtons}>
                                                        <button onClick={() => salvarEdicao(item.cpf)}>✓</button>
                                                        <button onClick={() => setEditandoCpf(null)}>✗</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={styles.agendamentoVisual} onClick={() => setEditandoCpf(item.cpf)}>
                                                    {item.dataAgendamento ? (
                                                        <div className={styles.agendamentoContainer}>
                                                            {item.dataAgendamento.split(' ').map((t, i) => <span key={i}>{t}</span>)}
                                                        </div>
                                                    ) : <img src={calendarIcon} alt="calendário" className={styles.calendarIconCenter} />}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <Button onClick={() => setLinhaExpandidaCpf(linhaExpandidaCpf === item.cpf ? null : item.cpf)} className={styles.btnAlunos}>
                                                Crianças {">"}
                                            </Button>
                                        </td>
                                    </tr>
                                    {linhaExpandidaCpf === item.cpf && (
                                        <tr className={styles.rowExpanded}>
                                            <td colSpan="9">
                                                <div className={styles.filhosLista}>
                                                    {item.filhos?.map((filho, i) => (
                                                        <p key={i}>• {typeof filho === 'string' ? filho : `${filho.nome} - ${filho.nascimento}`}</p>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;