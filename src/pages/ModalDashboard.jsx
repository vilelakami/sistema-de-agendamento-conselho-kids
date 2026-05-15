import React from 'react';
import styles from './css/modais/ModalDashboard.module.css';
// IMPORTAÇÃO DE ÍCONES
import addFilhoIcon from '../assets/icons/addConta.svg';
import deleteIcon from '../assets/icons/delete.svg';
import searchIcon from '../assets/icons/search.svg';
// Importação de bibliotecas:
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import { set, setHours, setMinutes } from "date-fns";


import {
  aplicarMascaraCPF,
  aplicarMascaraCEP,
  formatarParaBr,
  formatarDateTimeParaBr,
  prepararDataParaInput,
  prepararDateTimeParaInput,
  feriados
} from '../components/utils/formatters';

registerLocale('pt-BR', ptBR);

function ModalDashboard({ fecharModal, aoSalvar, agendamentos }) {
  const [filhos, setFilhos] = React.useState([]);
  const dataHojeISO = new Date().toISOString().split('T')[0];
  const [cpfExistente, setCpfExistente] = React.useState(false);
  const [mensagemErro, setMensagemErro] = React.useState('');


  const [dados, setDados] = React.useState({
    responsavel: '',
    cpf: '',
    cep: '',
    comoConheceu: 'Google',
    status: 'aguardando_resposta',
    agendamento: null,
    dataCriacao: dataHojeISO,
    qtdeFilhos: '',
  });

  const dadosVazios = {
    responsavel: '',
    cpf: '',
    cep: '',
    comoConheceu: 'Google',
    status: 'aguardando_resposta',
    agendamento: null,
    dataCriacao: new Date().toISOString().split('T')[0],
    qtdeFilhos: '',
  };

  // --- FUNÇÕES DE ESTADO

  // função que busca o cpf digitado no banco de dados e me retorna se ja tem cadastrado ou nao
  const buscarCpf = () => {
    setMensagemErro('');
    setCpfExistente(false);

    if (!dados.cpf) {
      alert('Digite um cpf para buscar.');
      return;
    }

    const encontrado = agendamentos.find((item) => item.cpf === dados.cpf);

    if (encontrado) {
      setDados({
        ...encontrado,
        dataCriacao: prepararDataParaInput(encontrado.dataCriacao),
        dataAgendamento: prepararDateTimeParaInput(encontrado.dataAgendamento),
      });

      if (encontrado.filhos && encontrado.filhos.length > 0) {
        const novosFilhos = encontrado.filhos.map((filho) => {
          if (typeof filho === 'string' && filho.includes('-')) {
            const [nome, nasc] = filho.split('-');
            return {
              nome: nome.trim(),
              nascimento: prepararDataParaInput(nasc.trim()),
            };
          }
          return filho;
        });
        setFilhos(novosFilhos);
      } else {
        setFilhos([]);
      }
      setCpfExistente(true);
      setMensagemErro('Já existe responsável cadastrado!');
    } else {
      setDados({
        ...dadosVazios,
        cpf: dados.cpf,
      });
      setFilhos([]);
      setCpfExistente(false);
      alert('CPF disponível. Inicie o cadastro!');
    }
  };

  // botão que adiciona um novo filho e incrementa na quantidade de filhos
  const adicionarFilho = () => {
    setFilhos([...filhos, { nome: '', nascimento: '' }]);
  };

  // função que remove o filho do array através de um index e decrementa a quantidade de filhos
  const removerFilho = (indexParaRemover) => {
    // filtra a lista removendo pelo index
    const novaLista = filhos.filter(
      (_, indexAtual) => indexAtual !== indexParaRemover,
    );
    setFilhos(novaLista);
  };

  // função que aplica as máscaras de cpf e cep conforme o usuário digita, utilizando as funções importadas do Utils
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let valorFinal = value;

    // Chamando as funções importadas do Utils
    if (name === 'cpf') valorFinal = aplicarMascaraCPF(value);
    else if (name === 'cep') valorFinal = aplicarMascaraCEP(value);

    setDados({ ...dados, [name]: valorFinal });
  };

  // função que atualiza os dados dos filhos conforme o usuário digita, utilizando o index para identificar qual filho está sendo editado e o campo para identificar se é nome ou nascimento
  const handleFilho = (index, campo, valor) => {
    const novaLista = [...filhos];
    novaLista[index][campo] = valor;
    setFilhos(novaLista);
  };

  // função que valida os campos obrigatórios, verifica se o cpf já existe no banco, formata os dados para o formato do dashboard e chama a função de salvar do dashboard passando os dados formatados
  const handleSalvar = (e) => {
    e.preventDefault();

    // Validações básicas
    if (!dados.responsavel || !dados.cpf || !dados.cep) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const cpfCadastrado = agendamentos.some((item) => item.cpf === dados.cpf);

    if (cpfCadastrado) {
      alert('Já existe CPF cadastrado no banco.');
      return;
    }

    if (filhos.some((filho) => !filho.nome || !filho.nascimento)) {
      alert('Preencha nome e nascimento de todos os filhos.');
      return;
    }

    if (dados.status === 'visita_agendada') {
      if (!dados.agendamento) {
        alert('A data de agendamento é obrigatório.');
        return;
      }
    }

    // Construção do objeto final usando os formatadores do Utils
    const cadastroFinal = {
      ...dados,
      status: dados.agendamento ? 'visita_agendada' : dados.status, // Se tiver data de agendamento, já define como visita_agendada
      // Formata a data de cada filho para o Dashboard
      filhos: filhos.map(
        (filho) => `${filho.nome} - ${formatarParaBr(filho.nascimento)}`,
      ),
      quantidadeFilhos: filhos.length,
      // Formata a data de criação escolhida
      dataCriacao: formatarParaBr(dados.dataCriacao),
      // Formata o agendamento (data + hora)
      dataAgendamento: dados.agendamento
        ? formatarDateTimeParaBr(dados.agendamento)
        : null,
    };

    aoSalvar(cadastroFinal);
    fecharModal();
  };

  return (
    <div className={styles.modalOverlay} onClick={fecharModal}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <p>Novo Agendamento</p>
        <div className={styles.taskDados}>
          <div className={styles.taskDemaisInfo1}>
            <div className={styles.taskCPF}>
              <label>
                CPF <span className={styles.span}>*</span>
              </label>
              <input
                type="text"
                placeholder="ex: 55555555555"
                maxLength="14"
                name="cpf"
                value={dados.cpf}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className={styles.btnSearch}
                onClick={buscarCpf}
              >
                <img src={searchIcon} alt="pesquisar" />
              </button>
              {mensagemErro && (
                <p style={{ color: 'red', fontSize: '8px', margin: '0' }}>
                  {mensagemErro}
                </p>
              )}
            </div>
            <div className={styles.taskNome}>
              <label>
                Nome do Responsável <span className={styles.span}>*</span>
              </label>
              <input
                type="text"
                name="responsavel"
                placeholder="Nome completo"
                value={dados.responsavel}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.taskCEP}>
              <label>
                CEP <span className={styles.span}>*</span>
              </label>
              <input
                type="text"
                placeholder="ex: 55555555"
                name="cep"
                maxLength="9"
                value={dados.cep}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.taskDemaisInfo2}>
            <div className={styles.taskComoConheceu}>
              <label>Como conheceu?</label>
              <select
                name="comoConheceu"
                value={dados.comoConheceu}
                onChange={handleInputChange}
              >
                <option value="">Selecione...</option>
                <option value="Google">Google</option>
                <option value="Instagram">Instagram</option>
                <option value="Indicação">Indicação</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className={styles.taskDataCriacao}>
              <label>Data de Criação</label>
              <input
                className={styles.taskInput}
                type="date"
                name="dataCriacao"
                value={dados.dataCriacao}
                readOnly
              />
            </div>

            <div className={styles.taskQtdeFilhos}>
              <label>Qtde. filhos:</label>
              <input
                className={styles.taskInput}
                type="number"
                value={filhos.length}
                readOnly
              />
            </div>
          </div>

          <div className={styles.taskDemaisInfo3}>
            <div className={styles.taskStatus}>
              <label>Status</label>
              <select
                name="status"
                value={dados.status}
                onChange={handleInputChange}
              >
                <option value="aguardando_resposta">Aguardando Resposta</option>
                <option value="visita_agendada">Visita Agendada</option>
              </select>
            </div>
            <div className={styles.taskAgendamento}>
              <label>Agendamento</label>
              <DatePicker
              className={styles.datePicker}
              selected={dados.agendamento ? new Date(dados.agendamento) : null}
              onChange={(date) => setDados({...dados, agendamento: date})}
              showTimeSelect
              locale="pt-BR"
              timeFormat="HH:mm"
              timeIntervals={30} // Pula de 30 em 30 min como no seu cronograma
              timeCaption="Hora"
              dateFormat="dd/MM/yyyy HH:mm"
              placeholderText='Selecione data e hora'
              // limitando horarios
              includeTimes={
                [
                  // manhã das 09 as 11h
                  setHours(setMinutes(dados.agendamento, 0), 9),
                  setHours(setMinutes(dados.agendamento, 30), 9),
                  setHours(setMinutes(dados.agendamento, 0), 10),
                  setHours(setMinutes(dados.agendamento, 30), 10),

                  // tarde das 14h as 17h
                  setHours(setMinutes(dados.agendamento, 0), 14),
                  setHours(setMinutes(dados.agendamento, 30), 14),
                  setHours(setMinutes(dados.agendamento, 0), 15),
                  setHours(setMinutes(dados.agendamento, 30), 15),
                  setHours(setMinutes(dados.agendamento, 0), 16),
                  setHours(setMinutes(dados.agendamento, 30), 16)
                ]
              }
              // bloquear feriados
              excludeDates={feriados}

              filterDate={(date) => {
                const dia = date.getDate();
                const mes = date.getMonth();
                const diaSemana = date.getDay();
                const ehFeriado = feriados.some(f => f.dia === dia && f.mes === mes);

                return diaSemana !== 0 && diaSemana !== 6 && !ehFeriado;
              }}
              minDate={new Date()} // Bloqueia datas passadas
              
              // Para pintar de vermelho todos os anos:
              dayClassName={(date) => {
                const dia = date.getDate();
                const mes = date.getMonth();

                const ehFeriado = feriados.some(f => f.dia === dia && f.mes === mes);
                
                return ehFeriado ? styles.feriado : undefined;
              }}
            />
            </div>
          </div>

          {filhos.map((filho, index) => (
            <div key={index} className={styles.linhaFilho}>
              <div className={styles.taskNomeFilho}>
                <label>
                  Nome da Criança <span className={styles.span}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nome Completo"
                  value={filho.nome}
                  onChange={(e) => handleFilho(index, 'nome', e.target.value)}
                />
              </div>
              <div className={styles.taskNascFilho}>
                <label>
                  Data de Nasc.: <span className={styles.span}>*</span>
                </label>
                <input
                  type="date"
                  value={filho.nascimento}
                  onChange={(e) =>
                    handleFilho(index, 'nascimento', e.target.value)
                  }
                />
              </div>
              {!cpfExistente && (
                <button
                  type="button"
                  className={styles.btnDeletarFilho}
                  onClick={() => removerFilho(index)}
                >
                  <img src={deleteIcon} alt="deletar filho" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button className={styles.btnAddFilho} onClick={adicionarFilho}>
          <img className={styles.taskIcon} src={addFilhoIcon} alt="adicionar" />
          Adicionar Filho
        </button>

        <div className={styles.buttons}>
          <button onClick={handleSalvar}>Salvar</button>
          <button onClick={fecharModal}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalDashboard;
