import React, { useState, useEffect } from 'react';
import styles from './css/modais/ModalResponsavel.module.css';
// importação de ícones
import deleteIcon from './../assets/icons/delete.svg';

// IMPORTAÇÕES DO UTILS
import {
  prepararDataParaInput,
  prepararDateTimeParaInput,
  formatarParaBr,
  formatarDateTimeParaBr,
  aplicarMascaraCPF,
  aplicarMascaraCEP,
} from '../components/utils/formatters';

// importando as funções do dashboard via props para atualizar os dados e excluir o responsável
function ModalResponsavel({
  fecharModal,
  dados,
  atualizarDados,
  excluirResponsavel,
}) {
  const [filhos, setFilhos] = useState([]);
  const [editando, setEditando] = useState(false);

  const [dadosAtual, setDadosAtual] = useState({
    responsavel: dados?.responsavel || '',
    cpf: dados?.cpf || '',
    cep: dados?.cep || '',
    dataCriacao: prepararDataParaInput(dados?.dataCriacao) || '',
    dataAgendamento: prepararDateTimeParaInput(dados?.dataAgendamento) || '',
    status: dados?.status || '',
    comoConheceu: dados?.comoConheceu || '',
    comoConheceuOutros: dados?.comoConheceuOutros || '',
    quantidadeFilhos: dados?.quantidadeFilhos || 0,
    relatorio: dados?.relatorio || '',
    resultado_conclusao: dados?.resultado_conclusao || '',
  });

  // Sincroniza os filhos quando o modal abre
  useEffect(() => {
    // se não houver filhos ou se filhos não for um array, inicializa como array vazio
    if (!dados?.filhos || !Array.isArray(dados.filhos)) {
      setFilhos([]);
      return;
    }

    // caso contrário, mapeia os filhos para o formato esperado, tratando tanto strings quanto objetos
    setFilhos(
      dados.filhos.map((filho) => {
        if (typeof filho === 'object' && filho !== null) return filho;

        if (typeof filho === 'string' && filho.includes(' - ')) {
          const [nome, nasc] = filho.split(' - ');
          return {
            nome,
            nascimento: nasc,
            matriculado: '',
            motivo: '',
            outroMotivo: '',
          };
        }
        return {
          nome: String(filho),
          nascimento: '',
          matriculado: '',
          motivo: '',
          outroMotivo: '',
        };
      }),
    );
  }, [dados]);

  // função para remover o responsável com confirmação
  const removerResponsavel = () => {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o responsável ${dadosAtual.responsavel} da lista de agendamentos?`,
    );

    if (confirmar) {
      excluirResponsavel(dadosAtual.cpf);
      alert('Responsável excluido com sucesso.');
      fecharModal();
    }
  };

  // função que atualiza os dados de um filho no array de filhos
  const atualizarFilho = (index, campo, valor) => {
    const novosFilhos = [...filhos];
    novosFilhos[index][campo] = valor;
    setFilhos(novosFilhos);
  };

  // função que salva os dados editados, direto no dashboard
  const handleSalvar = () => {
    // verificações de segurança
    if (!dadosAtual.responsavel || !dadosAtual.cpf) {
      alert('Campos obrigatórios faltando.');
      return;
    }

    if (
      dadosAtual.status === 'processo_concluido' ||
      dadosAtual.status === 'visita_cancelada'
    ) {
      if (!dadosAtual.resultado_conclusao) {
        alert(
          'O resultado do processo ou motivo do cancelamento é obrigatório.',
        );
        return;
      }
    }

    if (
      dadosAtual.status === 'visita_agendada' ||
      dadosAtual.status === 'processo_concluido'
    ) {
      if (!dadosAtual.dataAgendamento) {
        alert('A data de agendamento é obrigatório.');
        return;
      }
    }

    // verificação dos campos opcionais relacionados aos filhos apenas se o processo estiver concluído
    if (dadosAtual.status === 'processo_concluido') {
      const filhoSemMatricula = filhos.some((filho) => !filho.matriculado);
      if (filhoSemMatricula) {
        alert(
          'Para concluir o processo, informe se o filho foi matriculado ou não.',
        );
        return;
      }

      const filhoSemMotivo = filhos.some(
        (filho) => filho.matriculado === 'nao' && !filho.motivo,
      );
      if (filhoSemMotivo) {
        alert('Especifique o motivo do filho não matriculado.');
        return;
      }
    }
    // passando todos os dados editados para o dashboard
    const dadosEditados = {
      ...dados,
      ...dadosAtual,
      // formatando as datas para BR antes de enviar para o dashboard
      dataCriacao: formatarParaBr(dadosAtual.dataCriacao),
      dataAgendamento: formatarDateTimeParaBr(dadosAtual.dataAgendamento),
      filhos: filhos.map(
        (f) =>
          `${f.nome} - ${f.nascimento.includes('-') ? formatarParaBr(f.nascimento) : f.nascimento}`,
      ),
    };

    atualizarDados(dadosEditados);
    alert('Dados atualizados!');
    fecharModal();
  };

  // função que remove o filho do array através de um index
  const removerFilho = (indexParaRemover) => {
    const novaLista = filhos.filter(
      (_, indexAtual) => indexAtual !== indexParaRemover,
    );
    setFilhos(novaLista);
  };

  return (
    // botão para fechar o modal ao clicar fora da caixq
    <div className={styles.modalOverlay} onClick={fecharModal}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dadosResponsavel}>
          <div className={styles.nomeResponsavel}>
            <label>Nome do Responsável:</label>
            <input
              type="text"
              value={dadosAtual.responsavel}
              readOnly={!editando} //verificando se o campo deve ser editável ou não
              onChange={(e) =>
                setDadosAtual({ ...dadosAtual, responsavel: e.target.value })
              }
            />
          </div>

          <div className={styles.outrosDados}>
            <div className={styles.cpfResponsavel}>
              <label>CPF:</label>
              <input type="text" value={dadosAtual.cpf} readOnly />
            </div>
            <div className={styles.cepResponsavel}>
              <label>CEP:</label>
              <input
                type="text"
                value={dadosAtual.cep}
                readOnly={!editando}
                onChange={(e) =>
                  setDadosAtual({
                    ...dadosAtual,
                    cep: aplicarMascaraCEP(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className={styles.outrosDados}>
            <div className={styles.dataCriacao}>
              <label>Data de Criação:</label>
              <input type="date" value={dadosAtual.dataCriacao} readOnly />
            </div>
            <div className={styles.dataAgendamento}>
              <label>Agendamento:</label>
              <input
                type="datetime-local"
                value={dadosAtual.dataAgendamento}
                readOnly={!editando}
                onChange={(e) =>
                  setDadosAtual({
                    ...dadosAtual,
                    dataAgendamento: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className={styles.status}>
            <label>Status:</label>
            <select
              value={dadosAtual.status}
              disabled={!editando}
              onChange={(e) =>
                setDadosAtual({ ...dadosAtual, status: e.target.value })
              }
            >
              <option value="aguardando_resposta">Aguardando Resposta</option>
              <option value="visita_agendada">Visita Agendada</option>
              <option value="processo_concluido">Processo Concluído</option>
              <option value="visita_cancelada">Visita Cancelada</option>
            </select>
          </div>
          {(dadosAtual.status === 'processo_concluido' ||
            dadosAtual.status === 'visita_cancelada') && (
            <div className={styles.campoTexto}>
              <label>
                {dadosAtual.status === 'processo_concluido'
                  ? 'Resultado da conclusão:'
                  : 'Motivo do cancelamento:'}
              </label>
              <textarea
                readOnly={!editando}
                value={dadosAtual.resultado_conclusao}
                onChange={(e) =>
                  setDadosAtual({
                    ...dadosAtual,
                    resultado_conclusao: e.target.value,
                  })
                }
                required
              ></textarea>
            </div>
          )}

          <div className={styles.comoConheceu}>
            <label>Como conheceu:</label>
            <select
              value={dadosAtual.comoConheceu}
              disabled={!editando}
              onChange={(e) =>
                setDadosAtual({ ...dadosAtual, comoConheceu: e.target.value })
              }
            >
              <option value="google">Google</option>
              <option value="instagram">Instagram</option>
              <option value="indicacao">Indicação</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          {dadosAtual.comoConheceu === 'outros' && (
            <div className={styles.campoTexto}>
              <label>Especifique:</label>
              <textarea
                readOnly={!editando}
                value={dadosAtual.comoConheceuOutros}
                onChange={(e) =>
                  setDadosAtual({
                    ...dadosAtual,
                    comoConheceuOutros: e.target.value,
                  })
                }
              ></textarea>
            </div>
          )}

          <div className={styles.listaFilhosContainer}>
            {/* para cada filho adiciono uma linha de filho e um botão de exclusão */}
            {filhos.map((filho, index) => (
              <div className={styles.filhos} key={index}>
                <div className={styles.dadosFilhos}>
                  <div className={styles.nomeFilho}>
                    <label>Criança {index + 1}:</label>
                    <input
                      type="text"
                      value={filho.nome}
                      readOnly={!editando}
                      onChange={(e) =>
                        atualizarFilho(index, 'nome', e.target.value)
                      }
                    />
                  </div>
                  <div className={styles.dataNascFilho}>
                    <label>Nascimento:</label>
                    <input
                      type="date"
                      value={prepararDataParaInput(filho.nascimento)}
                      readOnly={!editando}
                      onChange={(e) =>
                        atualizarFilho(index, 'nascimento', e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className={styles.btnDeletarFilho}
                    onClick={() => removerFilho(index)}
                    disabled={!editando}
                  >
                    <img src={deleteIcon} alt="deletar filho" />
                  </button>
                </div>
                {dadosAtual.status === 'processo_concluido' && (
                  <div className={styles.taskMatricula}>
                    <div className={styles.matriculas}>
                      <div className={styles.matriculado}>
                        <input
                          type="radio"
                          name={`mat-${index}`}
                          checked={filho.matriculado == 'sim'}
                          disabled={!editando}
                          onChange={() =>
                            atualizarFilho(index, 'matriculado', 'sim')
                          }
                        />
                        <label>Matriculado</label>
                      </div>
                      <div className={styles.naoMatriculado}>
                        <input
                          type="radio"
                          name={`mat-${index}`}
                          checked={filho.matriculado === 'nao'}
                          disabled={!editando}
                          onChange={() =>
                            atualizarFilho(index, 'matriculado', 'nao')
                          }
                        />
                        <label>Não Matriculado</label>
                      </div>
                    </div>
                    {filho.matriculado === 'nao' && (
                      <div className={styles.matriculadoMotivo}>
                        <div className={styles.motivoSelect}>
                          <label>Motivo:</label>
                          <select
                            value={filho.motivo}
                            disabled={!editando}
                            onChange={(e) =>
                              atualizarFilho(index, 'motivo', e.target.value)
                            }
                            required
                          >
                            <option value="">Selecione...</option>
                            <option value="distancia">Distância</option>
                            <option value="financeiro">
                              Questão financeira
                            </option>
                            <option value="outros">Outros</option>
                          </select>
                        </div>

                        {filho.motivo === 'outros' && (
                          <div className={styles.motivo}>
                            <label>Especifique o motivo:</label>
                            <textarea
                              value={filho.outroMotivo}
                              readOnly={!editando}
                              onChange={(e) =>
                                atualizarFilho(
                                  index,
                                  'outroMotivo',
                                  e.target.value,
                                )
                              }
                              required
                            ></textarea>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => (editando ? handleSalvar() : setEditando(true))}
            >
              {editando ? 'Salvar Alterações' : 'Editar'}
            </button>
            <button type="button" onClick={fecharModal}>
              Cancelar
            </button>
          </div>

          <div className={styles.btnDeletarResponsavel}>
            <button type="button" onClick={removerResponsavel}>
              Excluir responsável
            </button>
          </div>
        </div>

        {/* COLUNA DA DIREITA: RELATÓRIO*/}
        <div className={styles.colunaRelatorio}>
          <label>Relatório:</label>
          <textarea
            placeholder="Escreva o relatório aqui..."
            value={dadosAtual.relatorio}
            readOnly={!editando}
            onChange={(e) =>
              setDadosAtual({ ...dadosAtual, relatorio: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default ModalResponsavel;
