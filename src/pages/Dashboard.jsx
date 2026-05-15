import React, { useState, useEffect } from 'react';
import styles from './css/Dashboard.module.css';
// IMPORTAÇÃO DE COMPONENTES
import Button from '../components/Button/Button';
import Sidebar from '../components/sidebar/Sidebar';
// IMPORTAÇÃO DOS MODAIS
import ModalDashboard from './ModalDashboard';
import ModalResponsavel from './ModalResponsavel';
// IMPORTAÇÃO DE ÍCONS
import calendarIcon from '../assets/icons/calendar.svg';
// Importação de bibliotecas:
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import { set, setHours, setMinutes } from 'date-fns';

// importando as funções de formatação
import {
  calcularDiasDesdesCriacao,
  prepararDataParaInput,
  aplicarMascaraCPF,
  aplicarMascaraCEP,
  formatarDateTimeParaBr,
  statusLabels,
  pesosStatus,
  statusOptions,
  feriados
} from '../components/utils/formatters';

registerLocale('pt-BR', ptBR);

function Dashboard() {
  const [linhaExpandidaCpf, setLinhaExpandidaCpf] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [menuStatusAberto, setMenuStatusAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalResponsavelAberto, setModalResponsavelAberto] = useState(false);
  const [editandoCpf, setEditandoCpf] = useState(null);
  const [dataInput, setDataInput] = useState('');
  const [agendamentos, setAgendamentos] = useState(() => {
    const dadosLocais = localStorage.getItem('agendamentos');
    return dadosLocais ? JSON.parse(dadosLocais) : [];
  });

  // função dos feriados:


  // Estado global da sidebar
  const [sidebarExpandida, setSidebarExpandida] = useState(true);

  const [ordemCriacao, setOrdemCriacao] = useState('desc');
  const [ordemAgendamento, setOrdemAgendamento] = useState('desc');

  // Assim que a página é carregada, busca os dados do localStorage para popular a tabela
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('agendamentos');
    if (dadosSalvos) setAgendamentos(JSON.parse(dadosSalvos));
  }, []);

  // Sempre que os agendamentos forem atualizados, salva a nova lista no localStorage para persistência dos dados
  useEffect(() => {
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
  }, [agendamentos]);

  //função sort que filtra os agendamentos
  const filtrarAgendamento = () => {
    const lista = [...agendamentos];

    lista.sort((a, b) => {
      const dataA = a.dataAgendamento
        ? new Date(prepararDataParaInput(a.dataAgendamento))
        : new Date(0);
      const dataB = b.dataAgendamento
        ? new Date(prepararDataParaInput(b.dataAgendamento))
        : new Date(0);

      if (ordemAgendamento === 'asc') {
        return dataA - dataB;
      } else {
        return dataB - dataA;
      }
    });
    setAgendamentos(lista);
    setOrdemAgendamento(ordemAgendamento === 'desc' ? 'asc' : 'desc');
  };

  // Função que apenas muda o critério de ordenação
  const filtrarDataCriacao = () => {
    const lista = [...agendamentos];

    lista.sort((a, b) => {
      const dataA = a.dataCriacao
        ? new Date(prepararDataParaInput(a.dataCriacao))
        : new Date(0);
      const dataB = b.dataCriacao
        ? new Date(prepararDataParaInput(b.dataCriacao))
        : new Date(0);

      if (ordemCriacao === 'asc') {
        return dataA - dataB;
      } else {
        return dataB - dataA;
      }
    });

    setAgendamentos(lista);
    setOrdemCriacao(ordemCriacao === 'desc' ? 'asc' : 'desc');
  };

  // função para salvar a data de agendamento editada diretamente na tabela, atualizando o status para "visita_agendada" e fechando o modo de edição
  const salvarEdicao = (cpf) => {
    if (!dataInput) {
      setEditandoCpf(null);
      return;
    }
    const novaLista = agendamentos.map((item) => {
      if (item.cpf === cpf) {
        return {
          ...item,
          dataAgendamento: formatarDateTimeParaBr(dataInput),
          status: 'visita_agendada',
        };
      }
      return item;
    });
    setAgendamentos(novaLista);
    setEditandoCpf(null);
    setDataInput('');
  };

  // filtra apenas os agendamentos que estão com status "aguardando_resposta" ou "visita_agendada", para exibir na tabela do dashboard
  const agendamentosAtivos = agendamentos.filter((item) => {
    return (
      item.status === 'aguardando_resposta' || item.status === 'visita_agendada'
    );
  });

  // aplica o filtro de status selecionado no menu suspenso, ou exibe todos se "todos" estiver selecionado
  const agendamentosFiltrados = agendamentosAtivos.filter((item) => {
    if (filtroStatus === 'todos') return true;
    return item.status === filtroStatus;
  });

  // cria uma nova lista para exibição, mantendo a ordem original dos agendamentos mas aplicando os filtros e ordenações selecionados, para evitar que a tabela "embarace" ao aplicar múltiplos filtros/ordenações
  const listaOrganizada = [...agendamentosFiltrados];

  // função para cadastrar um novo responsável, recebendo os dados do modal, formatando a data de agendamento e adicionando à lista de agendamentos
  const cadastrarPessoa = (dadosModal) => {
    const novoAgendamento = {
      ...dadosModal,
      dataAgendamento: dadosModal.agendamento
        ? formatarDateTimeParaBr(dadosModal.agendamento)
        : null,
      filhos: dadosModal.filhos || [],
    };
    setAgendamentos([...agendamentos, novoAgendamento]);
    setModalAberto(false);
  };

  // função para atualizar os dados de um responsável, recebendo os dados atualizados do modal de responsável e substituindo o item correspondente na lista de agendamentos
  const atualizarDados = (dadosModalResponsavel) => {
    const novaLista = agendamentos.map((item) =>
      item.cpf === dadosModalResponsavel.cpf ? dadosModalResponsavel : item,
    );
    setAgendamentos(novaLista);
  };

  // função para excluir um responsável, recebendo o CPF do responsável a ser excluído, removendo-o da lista de agendamentos e atualizando o localStorage
  const excluirResponsavel = (cpf) => {
    const novaLista = agendamentos.filter((item) => item.cpf !== cpf);
    setAgendamentos(novaLista);
    localStorage.setItem('agendamentos', JSON.stringify(novaLista));
  };

  return (
    <div
      className={`${styles.layout} ${!sidebarExpandida ? styles.sidebarFechada : ''}`}
    >
      <Sidebar
        abrirModal={() => setModalAberto(true)}
        onToggle={setSidebarExpandida}
        expandida={sidebarExpandida}
      />

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
          excluirResponsavel={excluirResponsavel}
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
                <th onClick={filtrarDataCriacao} style={{ cursor: 'pointer' }}>
                  Dt. de Criação: {ordemCriacao === 'asc' ? '↑' : '↓'}
                </th>
                <th>Qtde. Filhos</th>
                <th
                  className={styles.filterHeader}
                  onClick={() => setMenuStatusAberto(!menuStatusAberto)}
                >
                  Status <span className={styles.taskArrow}>v</span>
                  {menuStatusAberto && (
                    <div
                      className={styles.filter}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {statusOptions
                        .filter(
                          (st) =>
                            st.value === 'todos' ||
                            st.value === 'aguardando_resposta' ||
                            st.value === 'visita_agendada',
                        )
                        .map((st) => (
                          <div
                            key={st.value}
                            className={styles.filterOption}
                            onClick={() => {
                              setFiltroStatus(st.value);
                              setMenuStatusAberto(false);
                            }}
                          >
                            <input
                              type="radio"
                              checked={filtroStatus === st.value}
                              readOnly
                            />
                            <label>{st.label}</label>
                          </div>
                        ))}
                    </div>
                  )}
                </th>
                <th
                  className={styles.filterHeader}
                  onClick={filtrarAgendamento}
                >
                  Agendamento {ordemAgendamento === 'asc' ? '↑' : '↓'}
                </th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {listaOrganizada.map((item, index) => (
                <React.Fragment key={item.cpf || index}>
                  <tr
                    className={
                      styles[item.status] || styles.rowAguardandoResposta
                    }
                  >
                    <td>
                      <a
                        href="#"
                        className={styles.nomeLink}
                        onClick={(e) => {
                          e.preventDefault();
                          setItemSelecionado(item);
                          setModalResponsavelAberto(true);
                        }}
                      >
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
                          <DatePicker
                            className={styles.datePicker}
                            selected={
                              item.agendamento
                                ? new Date(item.agendamento)
                                : null
                            }
                            onChange={(date) =>
                              setAgendamentos({ ...agendamentos, dataAgendamento: date })
                            }
                            showTimeSelect
                            locale="pt-BR"
                            timeFormat="HH:mm"
                            timeIntervals={30} // Pula de 30 em 30 min como no seu cronograma
                            timeCaption="Hora"
                            dateFormat="dd/MM/yyyy HH:mm"
                            placeholderText="Selecione data e hora"
                            // limitando horarios
                            includeTimes={[
                              // manhã das 09 as 11h
                              setHours(setMinutes(item.agendamento, 0), 9),
                              setHours(setMinutes(item.agendamento, 30), 9),
                              setHours(setMinutes(item.agendamento, 0), 10),
                              setHours(setMinutes(item.agendamento, 30), 10),

                              // tarde das 14h as 17h
                              setHours(setMinutes(item.agendamento, 0), 14),
                              setHours(setMinutes(item.agendamento, 30), 14),
                              setHours(setMinutes(item.agendamento, 0), 15),
                              setHours(setMinutes(item.agendamento, 30), 15),
                              setHours(setMinutes(item.agendamento, 0), 16),
                              setHours(setMinutes(item.agendamento, 30), 16),
                            ]}
                            // bloquear feriados
                            excludeDates={feriados}
                            filterDate={(date) => {
                              const dia = date.getDate();
                              const mes = date.getMonth();
                              const diaSemana = date.getDay();
                              const ehFeriado = feriados.some(
                                (f) => f.dia === dia && f.mes === mes,
                              );

                              return (
                                diaSemana !== 0 && diaSemana !== 6 && !ehFeriado
                              );
                            }}
                            minDate={new Date()} // Bloqueia datas passadas
                            // Para pintar de vermelho todos os anos:
                            dayClassName={(date) => {
                              const dia = date.getDate();
                              const mes = date.getMonth();

                              const ehFeriado = feriados.some(
                                (f) => f.dia === dia && f.mes === mes,
                              );

                              return ehFeriado ? styles.feriado : undefined;
                            }}
                          />
                          <div className={styles.editButtons}>
                            <button onClick={() => salvarEdicao(item.cpf)}>
                              ✓
                            </button>
                            <button onClick={() => setEditandoCpf(null)}>
                              ✗
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={styles.agendamentoVisual}
                          onClick={() => setEditandoCpf(item.cpf)}
                        >
                          {item.dataAgendamento ? (
                            <div className={styles.agendamentoContainer}>
                              {item.dataAgendamento.split(' ').map((t, i) => (
                                <span key={i}>{t}</span>
                              ))}
                            </div>
                          ) : (
                            <img
                              src={calendarIcon}
                              alt="calendário"
                              className={styles.calendarIconCenter}
                            />
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      <Button
                        onClick={() =>
                          setLinhaExpandidaCpf(
                            linhaExpandidaCpf === item.cpf ? null : item.cpf,
                          )
                        }
                        className={styles.btnAlunos}
                      >
                        Crianças {'>'}
                      </Button>
                    </td>
                  </tr>
                  {linhaExpandidaCpf === item.cpf && (
                    <tr className={styles.rowExpanded}>
                      <td colSpan="9">
                        <div className={styles.filhosLista}>
                          {item.filhos?.map((filho, i) => (
                            <p key={i}>
                              •{' '}
                              {typeof filho === 'string'
                                ? filho
                                : `${filho.nome} - ${filho.nascimento}`}
                            </p>
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
