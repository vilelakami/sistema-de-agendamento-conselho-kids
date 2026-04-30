import React, { useState, useEffect } from "react";
import styles from "./css/Historico.module.css";
import { useNavigate, useLocation } from 'react-router-dom';
import Button from "../components/Button/Button";
import Sidebar from "../components/sidebar/Sidebar";
import ModalDashboard from "./ModalDashboard";
import ModalResponsavel from "./ModalResponsavel"; // ✅ Importe o Modal de Edição

function Historico() {
    const [linhaExpandidaCpf, setLinhaExpandidaCpf] = useState(null);
    const [agendamentosHistorico, setAgendamentosHistorico] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    
    // Novos estados para edição
    const [modalResponsavelAberto, setModalResponsavelAberto] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const calcularDiasDesdesCriacao = (dataCriacaoStr) => {
        if(!dataCriacaoStr) return 0;
        const [dia, mes, ano] = dataCriacaoStr.split('/').map(Number);
        const dataCriacao = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        const diferenca = hoje - dataCriacao;
        return Math.floor(diferenca / (1000 * 60 * 60 * 24));
    };

    const aplicarMascaraCPF = (v) => v?.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") || "";
    const aplicarMascaraCEP = (v) => v?.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2") || "";

    const statusLabels = {
        visita_agendada: "Visita Agendada",
        aguardando_resposta: "Aguardando Resposta",
        processo_concluido: "Processo Concluído",
        visita_cancelada: "Visita Cancelada"
    };

    const getStatusClass = (status) => {
        const classes = {
            visita_agendada: "rowVisitaAgendada",
            aguardando_resposta: "rowAguardandoResposta",
            visita_cancelada: "rowVisitaCancelada",
            processo_concluido: "rowProcessoConcluido"
        };
        return classes[status] || "rowAguardandoResposta";
    };

    // Função para atualizar os dados após editar no modal
    const atualizarDados = (dadosEditados) => {
        const dadosSalvos = JSON.parse(localStorage.getItem('agendamentos') || "[]");
        const novaListaGeral = dadosSalvos.map(item => item.cpf === dadosEditados.cpf ? dadosEditados : item);
        localStorage.setItem('agendamentos', JSON.stringify(novaListaGeral));
        
        // Atualiza a lista local do histórico para refletir a mudança na hora
        const historicoAtualizado = agendamentosHistorico.map(item => item.cpf === dadosEditados.cpf ? dadosEditados : item);
        setAgendamentosHistorico(historicoAtualizado);
    };

    useEffect(() => {
        const dadosArmazenados = localStorage.getItem('agendamentos');
        if (dadosArmazenados) {
            const todosAgendamentos = JSON.parse(dadosArmazenados);
            const historico = todosAgendamentos.filter(item => {
                if (!item || !item.dataCriacao) return false;
                const diasCriacao = calcularDiasDesdesCriacao(item.dataCriacao);
                return diasCriacao >= 30;
            });
            setAgendamentosHistorico(historico);
        }
    }, [location.state]);

    return (
        <div className={styles.layout}>
            <Sidebar abrirModal={() => setModalAberto(true)}/>
            
            {/* Modal de Edição (ModalResponsavel) */}
            {modalResponsavelAberto && itemSelecionado && (
                <ModalResponsavel 
                    fecharModal={() => setModalResponsavelAberto(false)} 
                    dados={itemSelecionado} 
                    atualizarDados={atualizarDados} 
                />
            )}

            <div className={styles.tableWrapper}>
                <h2 className={styles.taskTitlePage}>Agendamentos Finalizados</h2>
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
                                <th>Status</th>
                                <th>Agendamento</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agendamentosHistorico.map((item, index) => (
                                <React.Fragment key={item.cpf || index}>
                                    <tr className={styles[getStatusClass(item.status)]}>
                                        {/* Nome é um link que abre o modal de edição */}
                                        <td className={styles.colNome}>
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
                                            {item.dataAgendamento ? (
                                                <div className={styles.agendamentoContainer}>
                                                    {item.dataAgendamento.split(' ').map((texto, i) => <span key={i}>{texto}</span>)}
                                                </div>
                                            ) : (
                                                <span style={{color: '#999'}}>-</span>
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

export default Historico;