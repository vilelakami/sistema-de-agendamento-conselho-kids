import react from "react";
import { useState, useEffect } from "react";
import styles from "./css/ModalResponsavel.module.css";

function ModalResponsavel({fecharModal, dados, formatarData}) {
    const [filhos, setFilhos] = useState([]);

    useEffect(() => {
        if (!dados?.filhos || !Array.isArray(dados.filhos)) {
            setFilhos([]);
            return;
        }

        setFilhos(dados.filhos.map(filho => {
            if (typeof filho === 'object' && filho !== null) {
                return {
                    nome: filho.nome || filho.nomeCrianca || "",
                    nascimento: filho.nascimento || filho.nasc || filho.dataNascimento || "",
                    matriculado: filho.matriculado || "",
                    motivo: filho.motivo || "",
                    outroMotivo: filho.outroMotivo || filho.outroMotivoDetalhe || ""
                };
            }

            if (typeof filho === 'string' && filho.includes(' - ')) {
                const [nome, nasc] = filho.split(' - ');
                return {
                    nome: nome || "",
                    nascimento: nasc || "",
                    matriculado: "",
                    motivo: "",
                    outroMotivo: ""
                };
            }

            return { nome: String(filho), nascimento: "", matriculado: "", motivo: "", outroMotivo: "" };
        }));
    }, [dados]);

    const atualizarFilho = (index, campo, valor) =>{
        const novosFilhos = [...filhos];
        novosFilhos[index][campo] = valor;
        setFilhos(novosFilhos);
    };

    const [dadosAtual, setDadosAtual] = useState({
        responsavel: dados?.responsavel || "",
        cpf: dados?.cpf || "",
        cep: dados?.cep || "",
        dataCriacao: formatarData(dados?.dataCriacao) || "",
        dataAgendamento: formatarData(dados?.dataAgendamento) || "",
    });

    const prepararDataParaInput = (dataRaw) => {
        if (!dataRaw) return "";
        
        // 1. Pegamos apenas a parte da data (antes do espaço, se houver)
        const dataApenas = dataRaw.split(' ')[0]; 
        
        // 2. Se a data não tiver barras, ela já pode estar no formato certo ou ser inválida
        if (!dataApenas.includes('/')) return dataApenas;

        // 3. Inverte de DD/MM/YYYY para YYYY-MM-DD
        const [dia, mes, ano] = dataApenas.split('/');
        return `${ano}-${mes}-${dia}`;
    };

    const prepararDateTime = (dataBr) => {
        if (!dataBr) return "";
        // 1. Tira o 'h' do final e separa data e hora
        const limpa = dataBr.replace('h', ''); 
        const [data, hora] = limpa.split(' ');
        const [dia, mes, ano] = data.split('/');
        
        // 2. Monta o formato que o input aceita: YYYY-MM-DDTHH:mm
        return `${ano}-${mes}-${dia}T${hora}`;  
    };

    return(
        <div className={styles.modalOverlay}>
            <div className={styles.container}>
                <div className={styles.modalContent}>
                    <div className={styles.dadosResponsavel}>
                        <div className={styles.nomeResponsavel}>
                            <label>Nome do Responsável:</label>
                            <input type="text" 
                            value={dados?.responsavel || ""}
                            readOnly/>
                        </div>
                        <div className={styles.outrosDados}>
                            <div className={styles.cpfResponsavel}>
                                <label>CPF do Responsável:</label>
                                <input type="text"
                                value={dados?.cpf || ""}
                                readOnly />
                            </div>
                            <div className={styles.cepResponsavel}>
                                <label>CEP do Responsável:</label>
                                <input type="text" 
                                value={dados?.cep || ""}
                                readOnly />
                            </div>
                        </div>
                        <div className={styles.outrosDados}>
                            <div className={styles.dataCriacao}>
                                <label>Data de Criação:</label>
                                <input type="date" 
                                value={prepararDataParaInput(dados?.dataCriacao) || ""}
                                readOnly/>
                            </div>
                            <div className={styles.dataAgendamento}>
                                <label>Data de Agendamento:</label>
                                <input type="datetime-local"
                                value={prepararDateTime(dados?.dataAgendamento) || ""}
                                readOnly />
                            </div>
                        </div>
                            <div className={styles.status}>
                                <label>Status:</label>
                                <select
                                value={dados?.status || ""}
                                onChange={(e) => setDadosAtual({...dadosAtual, status: e.target.value})}>
                                    <option value="aguardando_resposta">Aguardando Resposta</option>
                                    <option value="visita_agendada">Visita Agendada</option>
                                    <option value="processo_concluido">Processo Concluído</option>
                                    <option value="visita_cancelada">Visita Cancelada</option>
                                </select>
                                {(dados.status === "processo_concluido" || dados.status === "visita_cancelada") && (
                                    <div className={styles.campoTexto}>
                                        <label>
                                            {dados.status === "processo_concluido" ? "Resultado da Conclusão:" : "Motivo de Cancelamento:"}
                                        </label>
                                        <textarea
                                            value={dadosAtual.relatorio}
                                            onChange={(e) => setDadosAtual({...dadosAtual, relatorio: e.target.value})}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={styles.comoConheceu}>
                                <label>Como conheceu:</label>
                                <select
                                value={dados?.comoConheceu}
                                onChange={(e) => setDadosAtual({...dadosAtual, comoConheceu: e.target.value})}>
                                    <option value="google">Google</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="indicacao">Indicação</option>
                                    <option value="outros">Outros</option>
                                </select>
                                {dados?.comoConheceu === "outros" && (
                                    <div className={styles.campoTexto}>
                                        <label>Especifique:</label>
                                        <textarea
                                            value={dadosAtual.comoConheceuOutros}
                                            onChange={(e) => setDadosAtual({...dadosAtual, comoConheceuOutros: e.target.value})}
                                        />
                                    </div>
                                )}
                            </div>
                        <div className={styles.qtdeFilhos}>
                            <label>Quantidade de Filhos:</label>
                            <input type="number"
                            value={dados?.quantidadeFilhos || ""}
                            onChange={(e) => setDadosAtual({...dadosAtual, quantidadeFilhos: e.target.value})} />
                        </div>
                        {filhos && filhos.length > 0 && filhos.map((filho, index) => (
                            <div className={styles.filhos} key={index}>
                                <div className={styles.dadosFilhos}>
                                    <div className={styles.nomeFilho}>
                                        <label>Nome da Criança:</label>
                                        <input type="text" 
                                        value={filho?.nome || ""}
                                        onChange={(e) => atualizarFilho(index, 'nome', e.target.value)} />
                                    </div>
                                    <div className={styles.dataNascFilho}>
                                        <label>Data de Nascimento:</label>
                                        <input type="date"
                                        value={prepararDataParaInput(filho?.nascimento || "")}
                                        readOnly />
                                    </div>
                                </div>
                                <div className={styles.matricula}>
                                    <div className={styles.taskMatricula}>
                                        <div className={styles.matriculado}>
                                            <input 
                                            type="radio"
                                            name={`matriculado-${index}`}
                                            checked={filho.matriculado === "sim"}
                                            onChange={() => atualizarFilho(index, "matriculado", "sim")} /> 
                                            <label>Matriculado</label>
                                        </div>
                                        <div className={styles.naoMatriculado}>
                                            <input 
                                            type="radio"
                                            name={`matriculado-${index}`}
                                            checked={filho.matriculado === "nao"}
                                            onChange={() => atualizarFilho(index, "matriculado", "nao")} /> 
                                            <label>Não matriculado</label>
                                        </div>
                                    </div>
                                    {filho.matriculado === "nao" && (
                                        <div className={styles.matriculadoMotivo}>
                                            <select
                                            value={filho.motivo || ""}
                                            onChange={(e) => atualizarFilho(index, "motivo", e.target.value)}>
                                                <option value="">Selecione...</option>
                                                <option value="distancia">Distância</option>
                                                <option value="financeiro">Questão Financeira</option>
                                                <option value="outros">Outros</option>
                                            </select>
                                            {filho.motivo === "outros" && (
                                                <textarea
                                                    placeholder="Descreva o motivo..."
                                                    value={filho.outroMotivo}
                                                    onChange={(e) => atualizarFilho(index, "outroMotivo", e.target.value)}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.buttons}>
                        <button>Editar</button>
                        <button onClick={fecharModal}>Cancelar</button>
                    </div>
                </div>
                <div className={styles.relatorio}>
                    <label>Relatório:</label>
                    <textarea></textarea>
                </div>
            </div>  
        </div>
    );
} export default ModalResponsavel;