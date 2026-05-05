import React, { useState, useEffect } from "react";
import styles from "./css/ModalResponsavel.module.css";
import deleteIcon from "./../assets/icons/delete.svg";

// IMPORTAÇÕES DO UTILS
import { 
    prepararDataParaInput, 
    prepararDateTimeParaInput, 
    formatarParaBr, 
    formatarDateTimeParaBr,
    aplicarMascaraCPF,
    aplicarMascaraCEP
} from "../components/utils/formatters";

function ModalResponsavel({ fecharModal, dados, atualizarDados }) {
    const [filhos, setFilhos] = useState([]);
    const [editando, setEditando] = useState(false);

    const [dadosAtual, setDadosAtual] = useState({
        responsavel: dados?.responsavel || "",
        cpf: dados?.cpf || "",
        cep: dados?.cep || "",
        dataCriacao: prepararDataParaInput(dados?.dataCriacao) || "",
        dataAgendamento: prepararDateTimeParaInput(dados?.dataAgendamento) || "",
        status: dados?.status || "",
        comoConheceu: dados?.comoConheceu || "",
        comoConheceuOutros: dados?.comoConheceuOutros || "",
        quantidadeFilhos: dados?.quantidadeFilhos || 0,
        relatorio: dados?.relatorio || ""
    });

    // Sincroniza os filhos quando o modal abre
    useEffect(() => {
        if (!dados?.filhos || !Array.isArray(dados.filhos)) {
            setFilhos([]);
            return;
        }

        setFilhos(dados.filhos.map(filho => {
            if (typeof filho === 'object' && filho !== null) return filho;
            
            if (typeof filho === 'string' && filho.includes(' - ')) {
                const [nome, nasc] = filho.split(' - ');
                return { nome, nascimento: nasc, matriculado: "", motivo: "", outroMotivo: "" };
            }
            return { nome: String(filho), nascimento: "", matriculado: "", motivo: "", outroMotivo: "" };
        }));
    }, [dados]);

    const atualizarFilho = (index, campo, valor) => {
        const novosFilhos = [...filhos];
        novosFilhos[index][campo] = valor;
        setFilhos(novosFilhos);
    };

    const handleSalvar = () => {
        if (!dadosAtual.responsavel || !dadosAtual.cpf) {
            alert("Campos obrigatórios faltando.");
            return;
        }

        const dadosEditados = {
            ...dados,
            ...dadosAtual,
            dataCriacao: formatarParaBr(dadosAtual.dataCriacao),
            dataAgendamento: formatarDateTimeParaBr(dadosAtual.dataAgendamento),
            filhos: filhos.map(f => `${f.nome} - ${f.nascimento.includes('-') ? formatarParaBr(f.nascimento) : f.nascimento}`),
        };

        atualizarDados(dadosEditados);
        alert("Dados atualizados!");
        fecharModal();
    };

    const removerFilho = (indexParaRemover) =>{
        const novaLista = filhos.filter((_, indexAtual) => indexAtual !== indexParaRemover);
        setFilhos(novaLista);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.container}>
                <div className={styles.modalContent}>
                    <div className={styles.dadosResponsavel}>
                        <div className={styles.nomeResponsavel}>
                            <label>Nome do Responsável:</label>
                            <input type="text" value={dadosAtual.responsavel} readOnly={!editando}
                                onChange={(e) => setDadosAtual({ ...dadosAtual, responsavel: e.target.value })} />
                        </div>

                        <div className={styles.outrosDados}>
                            <div className={styles.cpfResponsavel}>
                                <label>CPF:</label>
                                <input type="text" value={dadosAtual.cpf} readOnly
                                    onChange={(e) => setDadosAtual({ ...dadosAtual, cpf: aplicarMascaraCPF(e.target.value) })} />
                            </div>
                            <div className={styles.cepResponsavel}>
                                <label>CEP:</label>
                                <input type="text" value={dadosAtual.cep} readOnly={!editando}
                                    onChange={(e) => setDadosAtual({ ...dadosAtual, cep: aplicarMascaraCEP(e.target.value) })} />
                            </div>
                        </div>

                        <div className={styles.outrosDados}>
                            <div className={styles.dataCriacao}>
                                <label>Data de Criação:</label>
                                <input type="date" value={dadosAtual.dataCriacao} readOnly />
                            </div>
                            <div className={styles.dataAgendamento}>
                                <label>Agendamento:</label>
                                <input type="datetime-local" value={dadosAtual.dataAgendamento} readOnly={!editando}
                                    onChange={(e) => setDadosAtual({ ...dadosAtual, dataAgendamento: e.target.value })} />
                            </div>
                        </div>

                        <div className={styles.status}>
                            <label>Status:</label>
                            <select value={dadosAtual.status} disabled={!editando}
                                onChange={(e) => setDadosAtual({ ...dadosAtual, status: e.target.value })}>
                                <option value="aguardando_resposta">Aguardando Resposta</option>
                                <option value="visita_agendada">Visita Agendada</option>
                                <option value="processo_concluido">Processo Concluído</option>
                                <option value="visita_cancelada">Visita Cancelada</option>
                            </select>

                            {/* TEXTAREA DINÂMICA PARA STATUS CONCLUÍDO OU CANCELADO */}
                            {(dadosAtual.status === "processo_concluido" || dadosAtual.status === "visita_cancelada") && (
                                <div className={styles.campoTexto}>
                                    <label>
                                        {dadosAtual.status === "processo_concluido" ? "Resultado da Conclusão:" : "Motivo de Cancelamento:"}
                                    </label>
                                    <textarea value={dadosAtual.relatorio} readOnly={!editando}
                                        onChange={(e) => setDadosAtual({ ...dadosAtual, relatorio: e.target.value })} />
                                </div>
                            )}
                        </div>

                        <div className={styles.comoConheceu}>
                            <label>Como conheceu:</label>
                            <select value={dadosAtual.comoConheceu} disabled={!editando}
                                onChange={(e) => setDadosAtual({ ...dadosAtual, comoConheceu: e.target.value })}>
                                <option value="google">Google</option>
                                <option value="instagram">Instagram</option>
                                <option value="indicacao">Indicação</option>
                                <option value="outros">Outros</option>
                            </select>

                            {/* ESPECIFICAÇÃO PARA "OUTROS" */}
                            {dadosAtual.comoConheceu === "outros" && (
                                <div className={styles.campoTexto}>
                                    <label>Especifique:</label>
                                    <textarea value={dadosAtual.comoConheceuOutros} readOnly={!editando}
                                        onChange={(e) => setDadosAtual({ ...dadosAtual, comoConheceuOutros: e.target.value })} />
                                </div>
                            )}
                        </div>
                        <div className={styles.quantidadeFilhos}>
                            <label>Quantidade de filhos:</label>
                            <input type="number" value={dadosAtual.quantidadeFilhos} readOnly onChange={(e) => setDadosAtual({...dadosAtual, quantidadeFilhos: e.target.value})} />
                        </div>

                        {filhos.map((filho, index) => (
                            <div className={styles.filhos} key={index}>
                                <div className={styles.dadosFilhos}>
                                    <div className={styles.nomeFilho}>
                                        <label>Criança {index + 1}:</label>
                                        <input type="text" value={filho.nome} readOnly={!editando}
                                            onChange={(e) => atualizarFilho(index, 'nome', e.target.value)} />
                                    </div>
                                    <div className={styles.dataNascFilho}>
                                        <label>Nascimento:</label>
                                        <input type="date" value={prepararDataParaInput(filho.nascimento)} readOnly={!editando}
                                            onChange={(e) => atualizarFilho(index, "nascimento", e.target.value)} />
                                    </div>
                                    <button type="button" className={styles.btnDeletarFilho} onClick={() => removerFilho(index)} disabled={!editando}><img src={deleteIcon} alt="deletar filho" /></button>
                                </div>

                                <div className={styles.taskMatricula}>
                                    {dadosAtual.status === "processo_concluido" && (
                                    <>
                                    <div className={styles.matriculas}>
                                        <div className={styles.matriculado}>
                                            <input type="radio" name={`mat-${index}`} checked={filho.matriculado === "sim"} disabled={!editando}
                                                 onChange={() => atualizarFilho(index, "matriculado", "sim")} /> 
                                            <label>Matriculado</label>
                                        </div>
                                        <div className={styles.naoMatriculado}>
                                            <input type="radio" name={`mat-${index}`} checked={filho.matriculado === "nao"} disabled={!editando}
                                                onChange={() => atualizarFilho(index, "matriculado", "nao")} /> 
                                            <label>Não Matriculado</label>
                                        </div>
                                    </div>
                                    </>
                                    )}

                                    {filho.matriculado === "nao" && (
                                        <div className={styles.matriculadoMotivo}>
                                            <select value={filho.motivo} disabled={!editando}
                                                onChange={(e) => atualizarFilho(index, "motivo", e.target.value)}>
                                                <option value="">Selecione o motivo...</option>
                                                <option value="distancia">Distância</option>
                                                <option value="financeiro">Questão Financeira</option>
                                                <option value="outros">Outros</option>
                                            </select>
                                            {filho.motivo === "outros" && (
                                                <textarea placeholder="Descreva..." value={filho.outroMotivo} readOnly={!editando}
                                                    onChange={(e) => atualizarFilho(index, "outroMotivo", e.target.value)} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.buttons}>
                        <button type="button" onClick={() => editando ? handleSalvar() : setEditando(true)}>
                            {editando ? "Salvar Alterações" : "Editar"}
                        </button>
                        <button type="button" onClick={fecharModal}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalResponsavel;