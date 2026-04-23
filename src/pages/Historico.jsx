import React, { useState, useEffect } from "react";
import styles from "./css/Historico.module.css";
// uselocation para trazer dados de onde veio
import { useNavigate, useLocation } from 'react-router-dom';
import Button from "../components/Button/Button";
import voltarIcon from "../assets/icons/back.svg";

function Historico() {
    const [linhaExpandida, setLinhaExpandida] = useState(null);
    const [agendamentosHistorico, setAgendamentosHistorico] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Função para calcular dias desde a criação
    const calcularDiasDesdesCriacao = (dataCriacaoStr) => {
        // pegando a data e transf em número
        const [dia, mes, ano] = dataCriacaoStr.split('/').map(Number);
        const dataCriacao = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        // diferença da data de criação para hoje em milissegundos
        const diferenca = hoje - dataCriacao;
        // transf em dias
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        return dias;
    };

    // Carrega os dados do histórico quando abrir a pagina
    useEffect(() => {
        // verifica se agendamentosHistorico foi passado via state do location
        if (location.state?.agendamentosHistorico) {
            // se sim, atribui diretamente ao estado
            setAgendamentosHistorico(location.state.agendamentosHistorico);
        } else {
            // Caso contrário, carrega do localStorage (memoria do navegador)
            const dadosArmazenados = localStorage.getItem('agendamentos');
            if (dadosArmazenados) {
                // converte a string JSON de volta para um array de objetos
                const todosAgendamentos = JSON.parse(dadosArmazenados);
                const historico = todosAgendamentos.filter(item => {
                    if (!item || item.id === "TEMP") return false;
                    const diasDesdesCriacao = calcularDiasDesdesCriacao(item.dataCriacao);
                    return diasDesdesCriacao >= 30;
                });
                setAgendamentosHistorico(historico);
            }
        }
    }, [location.state]);

    // função que mostra a linha de filhos
    const toggleLinha = (id) => {
        setLinhaExpandida(linhaExpandida === id ? null : id);
    };

    return (
        <div className={styles.tableWrapper}>
            <p className={styles.TaskTitlePage}>Histórico de Agendamento (+30 dias)</p>
            {/* o conteúdo da minha tabela */}
            <div className={styles.container}>
                {/* verificando se ha agendamentos */}
                {agendamentosHistorico.length === 0 ? (
                    <p className={styles.mensagemVazia}>Nenhum agendamento no histórico ainda.</p>
                ) : (
                    // tabela com os dados do historico
                    <table className={styles.taskTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Responsável</th>
                                <th>CPF</th>
                                <th>CEP</th>
                                <th>Como Conheceu</th>
                                <th>Dt. de Criação</th>
                                <th>Qtde. Filhos</th>
                                <th>Status</th>
                                <th>Dt. Agendamento</th>
                                <th></th>
                                <th className={styles.taskBtnAtividade}>
                                    <button onClick={() => navigate('/Dashboard')} title="Voltar ao Dashboard">
                                        <img src={voltarIcon} alt="voltar ao dashboard" />
                                    </button>
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        {/* conteúdo da tabela */}
                        <tbody>
                            {/* mapeando os agendamentos e retornando as linhas */}
                            {agendamentosHistorico.map((item) => (
                                <React.Fragment key={item.id}>
                                    <tr className={styles[`row${(item.status || "Pendente").charAt(0).toUpperCase() + (item.status || "Pendente").slice(1)}`]}>
                                        <td>{item.id}</td>
                                        <td>{item.responsavel}</td>
                                        <td>{item.cpf}</td>
                                        <td>{item.cep}</td>
                                        <td>{item.comoConheceu}</td>
                                        <td>{item.dataCriacao}</td>
                                        <td>{item.quantidadeFilhos}</td>
                                        <td>{item.status}</td>
                                        <td className={styles.colAgendamento}>
                                            {item.dataAgendamento ? (
                                                <div className={styles.agendamentoContainer}>
                                                    {/* pego a data e hora, separo, mapeio para cada item dou uma indice */}
                                                    {item.dataAgendamento.split(' ').map((texto, index) => (
                                                        // faço um span pra cada
                                                        <span key={index}>{texto}</span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{color: '#999'}}>-</span>
                                            )}
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <Button onClick={() => toggleLinha(item.id)} className={styles.btnAlunos}>
                                                Crianças {">"}
                                            </Button>
                                        </td>
                                    </tr>

                                    {/* Linha expandida com filhos */}
                                    {linhaExpandida === item.id && (
                                        <tr className={styles.rowExpanded}>
                                            <td colSpan="12">
                                                <div className={styles.filhosLista}>
                                                    {item.filhos && item.filhos.length > 0 ? (
                                                        // para cada filho e seu indice, mostra um ponto e o filho
                                                        item.filhos.map((filho, index) => (
                                                            <p key={index}>• {filho}</p>
                                                        ))
                                                    ) : (
                                                        <p>Sem filhos registrados</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Historico;
