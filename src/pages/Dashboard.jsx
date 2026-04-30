import React, { useState, useEffect, useRef } from "react";
import styles from "./css/Dashboard.module.css";
import { Link, useNavigate } from 'react-router-dom';
import Button from "../components/Button/Button";
import calendarIcon from "../assets/icons/calendar.svg";
import Sidebar from "../components/sidebar/Sidebar";
import ModalDashboard from "./ModalDashboard";
import ModalResponsavel from "./ModalResponsavel";

function Dashboard() {
    // 1. Estados para controlar expansão de linhas, filtros e abertura de menus/modais
    const [linhaExpandidaCpf, setLinhaExpandidaCpf] = useState(null); // Controla qual linha mostra os filhos
    const [filtroStatus, setFiltroStatus] = useState("todos"); // Armazena o status selecionado no filtro
    const [menuStatusAberto, setMenuStatusAberto] = useState(false); // Toggle do menu dropdown de status
    const [menuDataAberto, setMenuDataAberto] = useState(false); // Toggle do menu dropdown de data
    const [itemSelecionado, setItemSelecionado] = useState(null); // Guarda os dados do responsável para o modal de edição
    const [modalAberto, setModalAberto] = useState(false); // Modal de novo cadastro
    const [modalResponsavelAberto, setModalResponsavelAberto] = useState(false); // Modal de edição de responsável
    const navigate = useNavigate();

    // 2. Estados para edição rápida de data e hora na própria tabela
    const [editandoCpf, setEditandoCpf] = useState(null); // Identifica qual linha está em modo de edição de data
    const [dataInput, setDataInput] = useState(""); // Valor temporário do input datetime-local

    // 3. Estado principal de dados: Inicializado vazio conforme solicitado
    const [agendamentos, setAgendamentos] = useState([]);

    // 4. Efeito para carregar dados do LocalStorage ao iniciar a página
    useEffect(() => {
        const dadosSalvos = localStorage.getItem('agendamentos');
        if (dadosSalvos) {
            setAgendamentos(JSON.parse(dadosSalvos));
        }
    }, []);

    // 5. Efeito para salvar no LocalStorage sempre que a lista de agendamentos mudar
    useEffect(() => {
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    }, [agendamentos]);

    // 6. Função para calcular há quantos dias o registro foi criado
    const calcularDiasDesdesCriacao = (dataCriacaoStr) => {
        if(!dataCriacaoStr) return 0;
        const [dia, mes, ano] = dataCriacaoStr.split('/').map(Number);
        const dataCriacao = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        const diferenca = hoje - dataCriacao;
        return Math.floor(diferenca / (1000 * 60 * 60 * 24));
    };

    // 7. Salva a edição rápida de data/hora feita diretamente na célula da tabela
    const salvarEdicao = (cpf, novoStatus) => {
        if(!dataInput && novoStatus === null){
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

    // 8. Filtra agendamentos ativos (menos de 30 dias) para o Dashboard principal
    const agendamentosAtivos = agendamentos.filter(item => {
        if (!item?.dataCriacao) return false;
        return calcularDiasDesdesCriacao(item.dataCriacao) < 30;
    });

    // 9. Aplica o filtro de Status selecionado pelo usuário
    const agendamentosFiltrados = agendamentosAtivos.filter(item => {
        if (filtroStatus === "todos") return true;
        return item.status === filtroStatus;
    });

    // 10. Alterna a visibilidade da linha de detalhes dos filhos
    const toggleLinha = (cpf) => {
        setLinhaExpandidaCpf(linhaExpandidaCpf === cpf ? null : cpf);
    };

    // 11. Define pesos para ordenar a tabela por importância de status
    const pesos = {
        aguardando_resposta: 1,
        visita_agendada: 2,
        processo_concluido: 3,
        visita_cancelada: 99
    };

    // 12. Ordena a lista filtrada por status e depois por nome do responsável
    const listaOrganizada = [...agendamentosFiltrados].sort((a,b) => {
        const pesoA = pesos[a.status] ?? 99;
        const pesoB = pesos[b.status] ?? 99;
        if (pesoA !== pesoB) return pesoA - pesoB;
        return a.responsavel.localeCompare(b.responsavel);
    });

    // 13. Máscaras visuais para CPF e CEP
    const aplicarMascaraCPF = (v) => {
        if (!v) return "";
        return v
            .replace(/\D/g, "") // 1. Remove tudo que não é número
            .replace(/(\d{3})(\d)/, "$1.$2") // 2. Coloca o primeiro ponto após 3 dígitos
            .replace(/(\d{3})(\d)/, "$1.$2") // 3. Coloca o segundo ponto após mais 3 dígitos
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2") // 4. Coloca o traço antes dos últimos 2 dígitos
            .substring(0, 14); // 5. Limita o tamanho final
    };

    const aplicarMascaraCEP = (v) => {
        return v
            .replace(/\D/g, "")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .substring(0, 9);
    };

    // 14. Nomes amigáveis para exibição dos status na tabela
    const statusLabels = {
        visita_agendada: "Visita Agendada",
        aguardando_resposta: "Aguardando Resposta",
        processo_concluido: "Processo Concluído",
        visita_cancelada: "Visita Cancelada"
    };

    // 15. Opções disponíveis no menu de filtro
    const statusOptions = [
        { value: "todos", label: "Todos" },
        { value: "visita_agendada", label: "Visita Agendada" },
        { value: "aguardando_resposta", label: "Aguardando Resposta" },
        { value: "visita_cancelada", label: "Visita Cancelada" },
        { value: "processo_concluido", label: "Processo Concluído" }
    ];

    // 16. Retorna a classe CSS correta baseada no status para colorir a linha
    const getStatusClass = (status) => {
        const classes = {
            visita_agendada: "rowVisitaAgendada",
            aguardando_resposta: "rowAguardandoResposta",
            visita_cancelada: "rowVisitaCancelada",
            processo_concluido: "rowProcessoConcluido"
        };
        return classes[status] || "rowAguardandoResposta";
    };

    // 17. Formata a data do input (ISO) para o padrão brasileiro de exibição
    const formatarDataParaExibicao = (dataRaw) => {
        if (!dataRaw) return null;
        if (dataRaw.includes('/') && !dataRaw.includes('T')) return dataRaw;
        try {
            const [data, hora] = dataRaw.split('T');
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano} ${hora}h`;
        } catch (e) { return dataRaw; }
    };

    // 18. Salva um novo responsável vindo do ModalDashboard
    const cadastrarPessoa = (dadosModal) => {
        const novoAgendamento = {
            ...dadosModal,
            dataAgendamento: formatarDataParaExibicao(dadosModal.agendamento),
            dataCriacao: new Date().toLocaleDateString('pt-BR'),
            filhos: dadosModal.filhos || [] 
        };
        setAgendamentos([...agendamentos, novoAgendamento]);
        setModalAberto(false);
    };

    // 19. Atualiza dados de um responsável já existente
    const atualizarDados = (dadosModalResponsavel) => {
        const novaLista = agendamentos.map(item => item.cpf === dadosModalResponsavel.cpf ? dadosModalResponsavel : item);
        setAgendamentos(novaLista);
    };

    return (
        <div className={styles.layout}>
            <Sidebar abrirModal={() => setModalAberto(true)}/>
            
            {/* Modais de Cadastro e Edição */}
            {modalAberto && (<ModalDashboard fecharModal={() => setModalAberto(false)} aoSalvar={cadastrarPessoa} formatarData={formatarDataParaExibicao} aplicarMascaraCEP={aplicarMascaraCEP} aplicarMascaraCPF={aplicarMascaraCPF}/> )}
            {modalResponsavelAberto && itemSelecionado && (
                <ModalResponsavel fecharModal={() => setModalResponsavelAberto(false)} dados={itemSelecionado} atualizarDados={atualizarDados} aplicarMascaraCEP={aplicarMascaraCEP} aplicarMascaraCPF={aplicarMascaraCPF}/>
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
                                <th className={styles.filterHeader} onClick={() => setMenuDataAberto(!menuDataAberto)}>
                                    Agendamento <span className={styles.taskArrow}></span>
                                    {menuDataAberto && (
                                        <div className={styles.filter} onClick={(e) => e.stopPropagation()}>
                                            <span style={{color: 'white', fontSize: '12px'}}>Data específica:</span>
                                            <input type="date" className={styles.inputDate} />
                                            <Button className={styles.btnFiltrar} onClick={() => setMenuDataAberto(false)}>Aplicar</Button>
                                        </div>
                                    )}
                                </th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {listaOrganizada.map((item, index) => (
                                <React.Fragment key={item.cpf || index}>
                                    <tr className={styles[getStatusClass(item.status)]}>
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
                                                <div className={styles.editAgendamento} onClick={(e) => e.stopPropagation()}>
                                                    <input type="datetime-local" className={styles.taskInputDate} value={dataInput} onChange={(e) => setDataInput(e.target.value)} />
                                                    <div className={styles.editButtons}>
                                                        <button onClick={() => salvarEdicao(item.cpf, null)}>✓</button>
                                                        <button onClick={() => setEditandoCpf(null)}>✗</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={styles.agendamentoVisual} onClick={() => setEditandoCpf(item.cpf)}>
                                                    {item.dataAgendamento ? (
                                                        <div className={styles.agendamentoContainer}>
                                                            {item.dataAgendamento.split(' ').map((texto, i) => <span key={i}>{texto}</span>)}
                                                        </div>
                                                    ) : (
                                                        <img src={calendarIcon} alt="calendário" className={styles.calendarIconCenter} />
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {/* Mantendo seu botão original: Crianças > */}
                                            <Button onClick={() => toggleLinha(item.cpf)} className={styles.btnAlunos}>
                                                Crianças {">"}
                                            </Button>
                                        </td>
                                    </tr>

                                    {linhaExpandidaCpf === item.cpf && (
                                        <tr className={styles.rowExpanded}>
                                            <td colSpan="9">
                                                <div className={styles.filhosLista}>
                                                    {item.filhos && item.filhos.map((filho, i) => (
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