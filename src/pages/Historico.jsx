import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './css/Historico.module.css';
// IMPORTAÇÃO DE COMPONENTES
import Button from '../components/Button/Button';
import Sidebar from '../components/sidebar/Sidebar';
// IMPORTAÇÃO DE MODAIS
import ModalDashboard from './ModalDashboard';
import ModalResponsavel from './ModalResponsavel';

// importando as funções de formatação
import {
  aplicarMascaraCPF,
  aplicarMascaraCEP,
  prepararDataParaInput,
  statusOptions,
  getStatusClass,
  statusLabels,
} from '../components/utils/formatters';

function Historico() {
  const [linhaExpandidaCpf, setLinhaExpandidaCpf] = useState(null);
  const [agendamentosHistorico, setAgendamentosHistorico] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [menuStatusAberto, setMenuStatusAberto] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Novos estados para edição
  const [modalResponsavelAberto, setModalResponsavelAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [ordemCriacao, setOrdemCriacao] = useState('desc');
  const [ordemAgendamento, setOrdemAgendamento] = useState('desc');

  // Estado global da sidebar
  const [sidebarExpandida, setSidebarExpandida] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  //função sort que filtra os agendamentos
  const filtrarAgendamento = () => {
    const lista = [...agendamentosHistorico];

    // função para ordenar por data de agendamento, tratando casos sem data como mais antigos
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
    setAgendamentosHistorico(lista);
    setOrdemAgendamento(ordemAgendamento === 'desc' ? 'asc' : 'desc');
  };

  // Função que apenas muda o critério de ordenação
  const filtrarDataCriacao = () => {
    const lista = [...agendamentosHistorico];

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

    setAgendamentosHistorico(lista);
    setOrdemCriacao(ordemCriacao === 'desc' ? 'asc' : 'desc');
  };

  // Função para atualizar os dados após editar no modal
  const atualizarDados = (dadosEditados) => {
    const dadosSalvos = JSON.parse(
      localStorage.getItem('agendamentos') || '[]',
    );
    const novaListaGeral = dadosSalvos.map((item) =>
      item.cpf === dadosEditados.cpf ? dadosEditados : item,
    );
    localStorage.setItem('agendamentos', JSON.stringify(novaListaGeral));

    // Atualiza a lista local do histórico para refletir a mudança na hora
    const historicoAtualizado = agendamentosHistorico.map((item) =>
      item.cpf === dadosEditados.cpf ? dadosEditados : item,
    );
    setAgendamentosHistorico(historicoAtualizado);
  };

  // assim que a página é carregada, busca os dados do localStorage e filtra apenas os agendamentos finalizados
  useEffect(() => {
    const dadosArmazenados = localStorage.getItem('agendamentos');
    if (dadosArmazenados) {
      const todosAgendamentos = JSON.parse(dadosArmazenados);
      const historico = todosAgendamentos.filter((item) => {
        if (!item || !item.dataCriacao) return false;
        const finalizados =
          item.status === 'processo_concluido' ||
          item.status === 'visita_cancelada';

        return finalizados;
      });
      setAgendamentosHistorico(historico.reverse());
    }
  }, [location.state]);

  // filtra os agendamentos de acordo com o status selecionado no filtro
  const agendamentosFiltrados = agendamentosHistorico.filter((item) => {
    if (filtroStatus === 'todos') return true;
    return item.status === filtroStatus;
  });

  // função para remover um responsável (usada na exclusão dentro do modal)
  const removerResponsavel = (cpf) => {
    const dadosSalvos = JSON.parse(
      localStorage.getItem('agendamentos') || '[]',
    );
    const novaLista = dadosSalvos.filter((item) => item.cpf !== cpf);

    localStorage.setItem('agendamentos', JSON.stringify(novaLista));

    const novaListaHistorico = agendamentosHistorico.filter(
      (item) => item.cpf !== cpf,
    );
    setAgendamentosHistorico(novaListaHistorico);
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

      {/* Modal de Edição (ModalResponsavel) */}
      {modalResponsavelAberto && itemSelecionado && (
        <ModalResponsavel
          fecharModal={() => setModalResponsavelAberto(false)}
          dados={itemSelecionado}
          atualizarDados={atualizarDados}
          excluirResponsavel={removerResponsavel}
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
                            st.value === 'processo_concluido' ||
                            st.value === 'visita_cancelada',
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
              {agendamentosFiltrados.map((item, index) => (
                <React.Fragment key={item.cpf || index}>
                  <tr className={styles[getStatusClass(item.status)]}>
                    {/* Nome é um link que abre o modal de edição */}
                    <td className={styles.colNome}>
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
                      {item.dataAgendamento ? (
                        <div className={styles.agendamentoContainer}>
                          {item.dataAgendamento.split(' ').map((texto, i) => (
                            <span key={i}>{texto}</span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#999' }}>-</span>
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
                          {item.filhos &&
                            item.filhos.map((filho, i) => (
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

export default Historico;
