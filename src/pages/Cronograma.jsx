import React, { useState, useEffect } from 'react';
import styles from './css/Cronograma.module.css';
// IMPORTAÇÃO DE COMPONENTES
import Sidebar from '../components/sidebar/Sidebar';

function Cronograma() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [diasDaSemana, setDiasDaSemana] = useState([]);
  const horarios = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
  ];
  const horariosBloqueadosPadrao = [
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '17:00',
  ];
  const [modalAberto, setModalAberto] = useState(false);
  const [sidebarExpandida, setSidebarExpandida] = useState(true);

  // Estado de bloqueios (Lê do localStorage ao iniciar)
  const [bloqueios, setBloqueios] = useState(() => {
    return (
      JSON.parse(localStorage.getItem('bloqueios')) || {
        dias: [],
        horarios: [],
      }
    );
  });

  // Salva bloqueios no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('bloqueios', JSON.stringify(bloqueios));
  }, [bloqueios]);

  const toggleBloqueioDia = (data) => {
    const dataStr = data.toLocaleDateString('pt-BR');
    setBloqueios((prev) => {
      const dias = prev.dias.includes(dataStr)
        ? prev.dias.filter((d) => d !== dataStr)
        : [...prev.dias, dataStr];
      return { ...prev, dias };
    });
  };

  const toggleBloqueioHorario = (data, hora) => {
    const chave = `${data.toLocaleDateString('pt-BR')}-${hora}`;
    setBloqueios((prev) => {
      const horarios = prev.horarios.includes(chave)
        ? prev.horarios.filter((h) => h !== chave)
        : [...prev.horarios, chave];
      return { ...prev, horarios };
    });
  };

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('agendamentos')) || [];
    setAgendamentos(dados);

    const hoje = new Date();
    const diaDaSemanaAtual = hoje.getDay();
    const distanciaAteSegunda =
      diaDaSemanaAtual === 0 ? -6 : 1 - diaDaSemanaAtual;

    const segundaFeira = new Date(hoje);
    segundaFeira.setDate(hoje.getDate() + distanciaAteSegunda);

    const semana = [];
    for (let i = 0; i < 5; i++) {
      const dia = new Date(segundaFeira);
      dia.setDate(segundaFeira.getDate() + i);
      semana.push(dia);
    }
    setDiasDaSemana(semana);
  }, []);

  const getAgendamento = (dia, hora) => {
    const dataFormatada = dia.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return agendamentos.find((item) => {
      if (!item.dataAgendamento) return false;
      const partes = item.dataAgendamento.split(' ');
      const dataBanco = partes[0].trim();
      const horaBanco = partes[1].replace('h', '').trim();
      return dataBanco === dataFormatada && horaBanco === hora;
    });
  };

  return (
    <div className={styles.cronogramaContainer}>
      <Sidebar
        abrirModal={() => setModalAberto(true)}
        onToggle={setSidebarExpandida}
        expandida={sidebarExpandida}
      />
      <div
        className={`${styles.layout} ${!sidebarExpandida ? styles.sidebarFechada : ''}`}
      >
        <h1 className={styles.taskTitlePage}>Calendário Semanal</h1>

        <div className={styles.cronogramaGrade}>
          <div className={styles.celulaHeader}>Horário</div>

          {/* CABEÇALHO: Dias da Semana + Botão de Bloquear Dia */}
          {diasDaSemana.map((dia, index) => {
            const dataStr = dia.toLocaleDateString('pt-BR');
            const diaBloqueado = bloqueios.dias.includes(dataStr);

            return (
              <div key={index} className={styles.celulaHeader}>
                <strong>
                  {dia.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </strong>
                <br />
                <span>
                  {dia.getDate()}/{dia.getMonth() + 1}
                </span>
                <button
                  className={styles.btnLockDia}
                  onClick={() => toggleBloqueioDia(dia)}
                >
                  {diaBloqueado ? '🔒' : '🔓'}
                </button>
              </div>
            );
          })}

          {/* LINHAS: Horários e Slots */}
          {horarios.map((hora) => (
            <React.Fragment key={hora}>
              <div className={styles.colunaHora}>{hora}</div>

              {diasDaSemana.map((dia, index) => {
                const agendado = getAgendamento(dia, hora);
                const dataStr = dia.toLocaleDateString('pt-BR');
                const chaveHorario = `${dataStr}-${hora}`;

                const ehHorarioProibido =
                  horariosBloqueadosPadrao.includes(hora);
                const estaBloqueado =
                  bloqueios.dias.includes(dataStr) ||
                  bloqueios.horarios.includes(chaveHorario) ||
                  ehHorarioProibido;

                return (
                  <div
                    key={index}
                    className={`${styles.celulaSlot} ${estaBloqueado ? styles.bloqueado : ''}`}
                  >
                    {!agendado && !ehHorarioProibido && (
                      <button
                        className={styles.btnLockMini}
                        onClick={() => toggleBloqueioHorario(dia, hora)}
                      >
                        {estaBloqueado ? '🔒' : '🔓'}
                      </button>
                    )}

                    {agendado ? (
                      <div className={styles.cardAgendamento}>
                        {agendado.responsavel}
                      </div>
                    ) : estaBloqueado ? (
                      <span className={styles.txtBloqueado}>Indisponível</span>
                    ) : null}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cronograma;
