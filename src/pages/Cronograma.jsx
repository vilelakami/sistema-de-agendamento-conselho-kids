import React, { useState, useEffect } from 'react';
import styles from './css/Cronograma.module.css';
import Sidebar from '../components/sidebar/Sidebar';

function Cronograma() {
  // agendamentos que já existem no localStorage
  const [agendamentos, setAgendamentos] = useState([]);
  // guardando os 5 dias da semana atual
  const [diasDaSemana, setDiasDaSemana] = useState([]);
  // guardando os horários
  const horarios = [
    '07:00',
    '07:30',
    '08:00',
    '08:30',
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
  const [modalAberto, setModalAberto] = useState(false);
  // Estado global da sidebar
  const [sidebarExpandida, setSidebarExpandida] = useState(true);

  useEffect(() => {
    // pegando os agendamentos do localStorage
    const dados = JSON.parse(localStorage.getItem('agendamentos')) || [];
    setAgendamentos(dados);

    // calculando a semana
    const hoje = new Date();
    // dia da semana por numeros, ex: segund 1, terça 2 etc...
    const diaDaSemanaAtual = hoje.getDay();
    // calculando a distancia até segunda feira
    const distanciaAteSegunda =
      diaDaSemanaAtual === 0 ? -6 : 1 - diaDaSemanaAtual;

    // calculando a data da segunda
    const segundaFeira = new Date(hoje);
    segundaFeira.setDate(hoje.getDate() + distanciaAteSegunda);

    // criando o array da semana
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

          {diasDaSemana.map((dia, index) => (
            <div key={index} className={styles.celulaHeader}>
              <strong>
                {dia.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </strong>
              <br />
              <span>
                {dia.getDate()}/{dia.getMonth() + 1}
              </span>
            </div>
          ))}

          {horarios.map((hora) => (
            <React.Fragment key={hora}>
              <div className={styles.colunaHora}>{hora}</div>

              {diasDaSemana.map((dia, index) => {
                const agendado = getAgendamento(dia, hora);
                return (
                  <div key={index} className={styles.celulaSlot}>
                    {agendado && (
                      <div className={styles.cardAgendamento}>
                        {agendado.responsavel}
                      </div>
                    )}
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
