import React, { useState, useEffect, useRef } from "react";
import styles from "./css/Dashboard.module.css";
import { Link, useNavigate } from 'react-router-dom';
// importando botão reutilizável da pasta dos components
import Button from "../components/Button/Button";
import calendarIcon from "../assets/icons/calendar.svg";
import Sidebar from "../components/sidebar/Sidebar";
import ModalDashboard from "./ModalDashboard";
import ModalResponsavel from "./ModalResponsavel";


function Dashboard() {
    // estados
    const [linhaExpandidaCpf, setLinhaExpandidaCpf] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [menuStatusAberto, setMenuStatusAberto] = useState(false);
    const [menuDataAberto, setMenuDataAberto] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [modalResponsavelAberto, setModalResponsavelAberto] = useState(false);
    const navigate = useNavigate();

    // editando dt e hora do agendamento
    const [editandoCpf, setEditandoCpf] = useState(null);
    const [dataInput, setDataInput] = useState("");
    const inputDateRefs = useRef({});

    // Função para calcular dias desde a criação
    const calcularDiasDesdesCriacao = (dataCriacaoStr) => {
        // Converte "DD/MM/YYYY" para Date
        const [dia, mes, ano] = dataCriacaoStr.split('/').map(Number);
        const dataCriacao = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        const diferenca = hoje - dataCriacao;
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        return dias;
    };

    // dados (exemplo)
    const [agendamentos, setAgendamentos] = useState([
        {
            responsavel: "Fernanda",
            cpf: "555.555.555-55",
            cep: "04444-044",
            comoConheceu: "Google",
            dataCriacao: "09/04/2026",
            quantidadeFilhos: 2,
            status: "visita_agendada",
            dataAgendamento: "19/04/2026 16:30h",
            filhos: ["João - 10/09/2021", "Ana - 10/09/2021"]
        },
        {
            responsavel: "Marcos",
            cpf: "333.333.333-33",
            cep: "04865-050",
            comoConheceu: "Indicação",
            dataCriacao: "23/03/2026",
            quantidadeFilhos: 1,
            status: "processo_concluido",
            dataAgendamento: "31/03/2025 11:30h",
            filhos: ["Lucas - 05/05/2020"]
        },
        {
            responsavel: "Carlos Oliveira",
            cpf: "111.111.111-11",
            cep: "05555-000",
            comoConheceu: "Indicação",
            dataCriacao: "15/04/2026",
            quantidadeFilhos: 1,
            status: "aguardando_resposta",
            dataAgendamento: null,
            filhos: ["Enzo - 12/02/2018"]
        }
    ]);

    // Salvar agendamentos no localStorage sempre que mudam
    useEffect(() => {
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    }, [agendamentos]);

    // função que salva a edição da data e hora
    const salvarEdicao = (cpf, novoStatus) => {
        if(!dataInput){
            setEditandoCpf(null);
            return;
        }
        const novaLista = agendamentos.map(item => {
            if (item.cpf === cpf) {
                return {
                    ...item,
                    dataAgendamento: dataInput ? formatarDataParaExibicao(dataInput) : item.dataAgendamento,
                    status: novoStatus !== null ? novoStatus : item.status
                };
            }
            return item;
        });
        setAgendamentos(novaLista);
        setEditandoCpf(null);
        setDataInput("");
    };

    // Separar agendamentos: menos de 30 dias no Dashboard, 30+ no Histórico
    const agendamentosAtivos = agendamentos.filter(item => {
        if (!item) return false;
        const diasDesdesCriacao = calcularDiasDesdesCriacao(item.dataCriacao);
        return diasDesdesCriacao < 30;
    });

    const agendamentosHistorico = agendamentos.filter(item => {
        if (!item) return false;
        const diasDesdesCriacao = calcularDiasDesdesCriacao(item.dataCriacao);
        return diasDesdesCriacao >= 30;
    });

    //lógica dos filtros
    //criando uma lista temporária para verificar os status
    const agendamentosFiltrados = agendamentosAtivos.filter(item => {
        if(!item){
            return false;
        }
        //verificando todos da lista, se o filtro for "todos" retorna todos
        if (filtroStatus === "todos") return true;
        // caso contrário ele verifica se a lista tem o status que eu cliquei e verifica
        return item.status === filtroStatus;
    });

    //função pra expandir a linha assim que apertar em "alunos>"
    const toggleLinha = (cpf) => {
        setLinhaExpandidaCpf(linhaExpandidaCpf === cpf ? null : cpf);
    };

    const handleFiltroStatus = (novoStatus) => {
        setFiltroStatus(novoStatus);
        setMenuStatusAberto(false);
    };

    const statusLabels = {
        visita_agendada: "Visita Agendada",
        aguardando_resposta: "Aguardando Resposta",
        processo_concluido: "Processo Concluído",
        visita_cancelada: "Visita Cancelada",
        pendente: "Aguardando Resposta",
        agendado: "Visita Agendada",
        concluido: "Processo Concluído"
    };

    const statusOptions = [
        { value: "todos", label: "Todos" },
        { value: "visita_agendada", label: "Visita Agendada" },
        { value: "aguardando_resposta", label: "Aguardando Resposta" },
        { value: "visita_cancelada", label: "Visita Cancelada" },
        { value: "processo_concluido", label: "Processo Concluído" }
    ];

    const getStatusClass = (status) => {
        if (status === "visita_agendada" || status === "agendado") return "rowVisitaAgendada";
        if (status === "aguardando_resposta" || status === "pendente") return "rowAguardandoResposta";
        if (status === "visita_cancelada") return "rowVisitaCancelada";
        if (status === "processo_concluido" || status === "concluido") return "rowProcessoConcluido";
        return "rowAguardandoResposta";
    };

    // função pra colocar os pontos e o traço no cpf
    const aplicarMascaraCPF = (valor) => {
        const nums = valor.replace(/\D/g, ""); 
        if (nums.length <= 3) return nums;
        if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
        if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
        return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9, 11)}`;
    };

    // função que aplica o traço no cep
    const aplicarMascaraCEP = (valor) => {
        const nums = valor.replace(/\D/g, "");
        if(nums.length <= 5) return nums;
        return `${nums.slice(0,5)}-${nums.slice(5,8)}`;
    };

    //fazendo o sort para exibir primeiro os status mais importantes
    const pesos = {
        aguardando_resposta: 1,
        visita_agendada: 2,
        processo_concluido: 3,
        visita_cancelada: 99
    };

    // .sort
    const listaOrganizada = [...agendamentosFiltrados].sort((a,b) => {
        const pesoA = pesos[a.status] ?? 99;
        const pesoB = pesos[b.status] ?? 99;

        if (pesoA !== pesoB) {
            return pesoA - pesoB;
        }

        return a.responsavel.localeCompare(b.responsavel);
    });

    const cadastrarPessoa = (dadosModal) => {
        const novoAgendamento = {
            ...dadosModal,
            dataAgendamento: formatarDataParaExibicao(dadosModal.agendamento),
            dataCriacao: new Date().toLocaleDateString('pt-BR'), // Garante data de hoje
            filhos: dadosModal.filhos || [] 
    };
        setAgendamentos([...agendamentos, novoAgendamento]);
        setModalAberto(false);
    };

    const formatarDataParaExibicao = (dataRaw) => {
        if (!dataRaw) return null;
        
        // Se a data já estiver no formato DD/MM/YYYY HH:mm (como no seu mock), retorna ela
        if (dataRaw.includes('/') && !dataRaw.includes('T')) return dataRaw;

        try {
            // Se vier do input datetime-local (YYYY-MM-DDTHH:mm)
            const [data, hora] = dataRaw.split('T');
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano} ${hora}h`;
        } catch (e) {
            return dataRaw;
        }
    };
    //desenhando na tela
    return (
        <div className={styles.layout}>
            <Sidebar abrirModal={() => setModalAberto(true)}/>
            {modalAberto && (<ModalDashboard fecharModal={() => setModalAberto(false)} aoSalvar={cadastrarPessoa} /> )}
            {modalResponsavelAberto && itemSelecionado && (
                <ModalResponsavel 
                    fecharModal={() => setModalResponsavelAberto(false)} 
                    dados={itemSelecionado} 
                    formatarData={formatarDataParaExibicao}
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
                                <th>Dt. de Criação:</th>
                                <th>Qtde. Filhos</th>
                                {/* meus filtros status e agendamento */}
                                {/* onclick: responsável por "apagar" ou "ascender" a combobox */}
                                <th className={styles.filterHeader} onClick={() => setMenuStatusAberto(!menuStatusAberto)}>
                                    Status <span className={styles.taskArrow}>v</span>
                                    {menuStatusAberto && (
                                        <div className={styles.filter} onClick={(e) => e.stopPropagation()}>
                                            {statusOptions.map((st) => (
                                                <div key={st.value} className={styles.filterOption} onClick={() => handleFiltroStatus(st.value)}>
                                                    <input type="radio" name="status" checked={filtroStatus === st.value} readOnly />
                                                    <label>{st.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </th>
                                {/* mesma lógica dos status */}
                                <th className={styles.filterHeader} onClick={() => setMenuDataAberto(!menuDataAberto)}>
                                    Agendamento <span className={styles.taskArrow}></span>
                                    {menuDataAberto && (
                                        <div className={styles.filter} onClick={(e) => e.stopPropagation()}>
                                            <span style={{color: 'white', fontSize: '12px'}}>Data específica:</span>
                                            {/* abrindo o input de data */}
                                            <input type="date" className={styles.inputDate} />
                                            {/* botão de aplicar */}
                                            <Button className={styles.btnFiltrar} onClick={() => setMenuDataAberto(false)}>Aplicar</Button>
                                        </div>
                                    )}
                                </th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {/* mapeio os status */}
                            {listaOrganizada.map((item, index) => (
                                <React.Fragment key={item.cpf || index}>
                                    <tr className={styles[getStatusClass(item.status)]}>
                                        <td>{
                                                <a 
                                                href="#" 
                                                className={styles.nomeLink} 
                                                onClick={(e) => {
                                                    e.preventDefault(); 
                                                    e.stopPropagation();
                                                    setItemSelecionado(item); // Guarda os dados do pai/mãe
                                                    setModalResponsavelAberto(true);    // Abre a "cortina" do modal
                                                }}
                                            >
                                                {item?.responsavel}
                                            </a>
                                            }
                                        </td>
                                        <td>{aplicarMascaraCPF(item.cpf)}
                                        </td>
                                        <td>{aplicarMascaraCEP(item.cep)}
                                        </td>
                                        <td>{item.comoConheceu}</td>
                                        <td>{item.dataCriacao}</td>
                                        <td>{item.quantidadeFilhos}</td>
                                        <td>{statusLabels[item.status] || item.status}
                                        </td>
                                        {/* lógica do agendamento */}
                                        <td className={styles.colAgendamento}>
                                            {editandoCpf === item.cpf ? (
                                                <div className={styles.editAgendamento} onClick={(e) => e.stopPropagation()}>
                                                    <input 
                                                        type="datetime-local" 
                                                        className={styles.taskInputDate}
                                                        value={dataInput}
                                                        onChange={(e) => setDataInput(e.target.value)}
                                                    />
                                                    <div className={styles.editButtons}>
                                                        <button onClick={() => salvarEdicao(item.cpf, null)}>✓</button>
                                                        <button onClick={() => setEditandoCpf(null)}>✗</button>
                                                        <button onClick={() => salvarEdicao(item.cpf, "processo_concluido")}>Done</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={styles.agendamentoVisual} onClick={() => setEditandoCpf(item.cpf)}>
                                                    {item.dataAgendamento ? (
                                                        <div className={styles.agendamentoContainer}>
                                                            {item.dataAgendamento.split(' ').map((texto, index) => (
                                                                <span key={index}>{texto}</span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <img src={calendarIcon} alt="calendário" className={styles.calendarIconCenter} />
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        {/* função que eu criei em /components do botão */}
                                        <td>{
                                            <Button onClick={() => toggleLinha(item.cpf)} className={styles.btnAlunos}>
                                                Crianças {">"}
                                            </Button>
                                        }
                                        </td>
                                        <td></td>
                                    </tr>

                                    {/* verifico se a linha que quero expandir é o cpf que eu cliquei */}
                                    {linhaExpandidaCpf === item.cpf && (
                                        <tr className={styles.rowExpanded}>
                                            <td colSpan="10">
                                                <div className={styles.filhosLista}>
                                                    {/* mapeando a lista de filhos para cada responsável */}
                                                    {item.filhos.map((filho, index) => (
                                                        <p key={index}>• {typeof filho === 'string' ? filho : filho?.nome || JSON.stringify(filho)}</p>
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