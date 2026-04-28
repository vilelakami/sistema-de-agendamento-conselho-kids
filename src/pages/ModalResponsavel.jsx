import React from "react";
import { useState, useEffect } from "react";
import styles from "./css/ModalResponsavel.module.css";

function ModalResponsavel({fecharModal, dados, atualizarDados}) {
    const [filhos, setFilhos] = useState([]);
    const [editando, setEditando] = useState(false);

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
        if (!dataBr || typeof dataBr !== 'string') return "";
    
        try {
            // Remove o 'h', remove espaços extras e separa data da hora
            const limpa = dataBr.replace('h', '').trim(); 
            const [data, hora] = limpa.split(' ');
            const [dia, mes, ano] = data.split('/');
            
            // Garante que a hora tenha o formato HH:mm (ex: 16:30)
            const horaFormatada = hora.length === 5 ? hora : hora.padStart(5, '0');

            return `${ano}-${mes}-${dia}T${horaFormatada}`;  
        } catch (e) {
            console.error("Erro ao formatar data de agendamento:", dataBr);
            return "";
        }
    };

    const formatarParaBr = (dataIso) => {
        if (!dataIso) return "";
        if (dataIso.includes('/')) return dataIso; // Já está em BR
        const [ano, mes, dia] = dataIso.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    // Converte YYYY-MM-DDTHH:mm para DD/MM/YYYY HH:mmh
    const formatarDateTimeParaBr = (dateTimeIso) => {
        if (!dateTimeIso) return "";
        if (dateTimeIso.includes('/')) return dateTimeIso; // Já está em BR
        const [data, hora] = dateTimeIso.split('T');
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano} ${hora}h`;
    };

    const [dadosAtual, setDadosAtual] = useState({
        responsavel: dados?.responsavel || "",
        cpf: dados?.cpf || "",
        cep: dados?.cep || "",
        dataCriacao: prepararDataParaInput(dados?.dataCriacao) || "",
        dataAgendamento: prepararDateTime(dados?.dataAgendamento) || "",
        status: dados?.status || "",
        comoConheceu: dados?.comoConheceu || "",
        quantidadeFilhos: dados?.quantidadeFilhos || 0,
        relatorio: dados?.relatorio || ""
    });

    const handleSalvar = () => {

        if(!dadosAtual?.responsavel || !dados.responsavel){
            alert("Preencha o nome do responsável.");
            return;
        }
        if(!dadosAtual?.cpf || !dados.cpf){
            alert("Preencha o cpf do responsável.");
            return;
        }
        if(!dadosAtual?.cep || !dados.cep){
            alert("Preencha o cep do responsável.");
            return;
        }
        if(filhos.length > 0){
            const camposVazios = filhos.some((filho) => {
                return !filho.nome || filho.nome.trim() === "" || !filho.nascimento;
            });
            if(camposVazios){
                alert("Os campos nome da criança e data de nascimento são obrigatórios.");
                return;
            }
        }
        const dadosEditados = {
            ...dados,
            ...dadosAtual,
            dataCriacao: formatarParaBr(dadosAtual.dataCriacao),
            dataAgendamento: formatarDateTimeParaBr(dadosAtual.dataAgendamento),
            filhos: filhos.map(filho => `${filho.nome} - ${filho.nascimento}`)
        };

        if(atualizarDados){
            atualizarDados(dadosEditados);
            alert("Dados atualizados com sucesso");
            fecharModal();
        } else{
            alert("Erro ao atualizar os dados.");
        }
    };

    return(
        <div className={styles.modalOverlay}>
            <div className={styles.container}>
                <div className={styles.modalContent}>
                    <div className={styles.dadosResponsavel}>
                        <div className={styles.nomeResponsavel}>
                            <label>Nome do Responsável:</label>
                            <input type="text" 
                            placeholder="Nome do Responsável *"
                            value={dadosAtual?.responsavel || ""}
                            readOnly={!editando}
                            onChange={(e) => setDadosAtual({...dadosAtual, responsavel: e.target.value})}/>
                        </div>
                        <div className={styles.outrosDados}>
                            <div className={styles.cpfResponsavel}>
                                <label>CPF do Responsável:</label>
                                <input type="text"
                                placeholder="CPF *"
                                value={dadosAtual?.cpf || ""}
                                readOnly={!editando} 
                                onChange={(e) => setDadosAtual({...dadosAtual, cpf: e.target.value})}/>
                            </div>
                            <div className={styles.cepResponsavel}>
                                <label>CEP do Responsável:</label>
                                <input type="text" 
                                placeholder="CEP *"
                                value={dadosAtual?.cep || ""}
                                readOnly={!editando} 
                                onChange={(e) => setDadosAtual({...dadosAtual, cep: e.target.value})}/>
                            </div>
                        </div>
                        <div className={styles.outrosDados}>
                            <div className={styles.dataCriacao}>
                                <label>Data de Criação:</label>
                                <input type="date" 
                                value={prepararDataParaInput(dadosAtual?.dataCriacao) || ""}
                                readOnly={!editando}
                                onChange={(e) => setDadosAtual({...dadosAtual, dataCriacao: e.target.value})}/>
                            </div>
                            <div className={styles.dataAgendamento}>
                                <label>Data de Agendamento:</label>
                                <input type="datetime-local"
                                value={dadosAtual?.dataAgendamento}
                                readOnly={!editando}
                                onChange={(e) => setDadosAtual({...dadosAtual, dataAgendamento: e.target.value})} />
                            </div>
                        </div>
                            <div className={styles.status}>
                                <label>Status:</label>
                                <select
                                value={dadosAtual?.status || ""}
                                onChange={(e) => setDadosAtual({...dadosAtual, status: e.target.value})}
                                disabled={!editando}>
                                    <option value="aguardando_resposta">Aguardando Resposta</option>
                                    <option value="visita_agendada">Visita Agendada</option>
                                    <option value="processo_concluido">Processo Concluído</option>
                                    <option value="visita_cancelada">Visita Cancelada</option>
                                </select>
                                {(dadosAtual.status === "processo_concluido" || dadosAtual.status === "visita_cancelada") && (
                                    <div className={styles.campoTexto}>
                                        <label>
                                            {dadosAtual.status === "processo_concluido" ? "Resultado da Conclusão:" : "Motivo de Cancelamento:"}
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
                                value={dadosAtual?.comoConheceu}
                                onChange={(e) => setDadosAtual({...dadosAtual, comoConheceu: e.target.value})}
                                disabled={!editando}>
                                    <option value="google">Google</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="indicacao">Indicação</option>
                                    <option value="outros">Outros</option>
                                </select>
                                {dadosAtual?.comoConheceu === "outros" && (
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
                            value={dadosAtual?.quantidadeFilhos || ""}
                            onChange={(e) => setDadosAtual({...dadosAtual, quantidadeFilhos: e.target.value})}
                            readOnly={!editando} />
                        </div>
                        {filhos && filhos.length > 0 && filhos.map((filho, index) => (
                            <div className={styles.filhos} key={index}>
                                <div className={styles.dadosFilhos}>
                                    <div className={styles.nomeFilho}>
                                        <label>Nome da Criança:</label>
                                        <input type="text" 
                                        placeholder="Nome da Criança *"
                                        value={filho?.nome || ""}
                                        onChange={(e) => atualizarFilho(index, 'nome', e.target.value)}
                                        readOnly={!editando} />
                                    </div>
                                    <div className={styles.dataNascFilho}>
                                        <label>Data de Nascimento:</label>
                                        <input type="date"
                                        placeholder="Data de nascimento *"
                                        value={prepararDataParaInput(filho?.nascimento || filho?.nasc || "")}
                                        onChange={(e) => atualizarFilho(index, "nascimento", e.target.value)}
                                        readOnly={!editando} />
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
                        <button type="button" onClick={() =>  {
                            if(editando)
                                handleSalvar();
                            else
                                setEditando(true);
                        }}>
                            {editando? "Salvar Alterações" : "Editar"}</button>
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