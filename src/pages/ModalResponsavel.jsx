import react from "react";
import { useState } from "react";
import styles from "./css/ModalResponsavel.module.css";

function ModalResponsavel({fecharModal, dados, formatarData}) {
    const [dadosAtual, setDadosAtual] = useState({
        responsavel: dados?.responsavel || "",
        cpf: dados?.cpf || "",
        cep: dados?.cep || "",
        dataCriacao: formatarData(dados?.dataCriacao) || "",
        dataAgendamento: formatarData(dados?.dataAgendamento) || "",
    });

    const prepararDataParaInput = (dataRaw) => {
    if (!dataRaw) return "";
    
    const partes = dataRaw.split(' ')[0].split('/'); // Pega só o "26/04/2026" e separa as barras
    return `${partes[2]}-${partes[1]}-${partes[0]}`; // Monta "2026-04-26"
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
                                onChange={(e) => setDadosAtual({...dadosAtual, status: e.target.value})}
                                readOnly>
                                    <option value="aguardando_resposta">Aguardando Resposta</option>
                                    <option value="visita_agendada">Visita Agendada</option>
                                    <option value="processo_concluido">Processo Concluído</option>
                                    <option value="visita_cancelada">Visita Cancelada</option>
                                </select>
                            </div>
                            <div className={styles.comoConheceu}>
                                <label>Como conheceu:</label>
                                <select
                                value={dados?.comoConheceu}
                                onChange={(e) => setDadosAtual({...dadosAtual, comoConheceu: e.target.value})}
                                readOnly>
                                    <option value="google">Google</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="indicacao">Indicação</option>
                                    <option value="outros">Outros</option>
                                </select>
                            </div>
                        <div className={styles.qtdeFilhos}>
                            <label>Quantidade de Filhos:</label>
                            <input type="number"
                            value={dados?.quantidadeFilhos || ""}
                            onChange={(e) => setDadosAtual({...dadosAtual, quantidadeFilhos: e.target.value})}
                            readOnly />
                        </div>
                        <div className={styles.filhos}>
                            <label>Filhos</label>
                            <input type="text" />
                        </div>
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