import { useState } from "react";
import styles from "./css/Dashboard.module.css";
import React from "react";
import Button from "../components/Button/Button";


function Dashboard() {
    const [linhaExpandida, setLinhaExpandida] = useState(null);

    //simulando dados
    //criando um obj
    const [agendamentos, setAgendamentos] = useState([
        {
            id: 8,
            responsavel: "Fernanda",
            cpf: "555.555.555-55",
            cep: "04444-044",
            comoConheceu: "Google",
            dataCriacao: "09/04/2026",
            quantidadeFilhos: 2,
            status: "agendado",
            dataAgendamento: "19/04/2026 16:30h",
            filhos: ["João - 10/09/2021", "Ana - 10/09/2021"]
        },
        {
            id: 9,
            responsavel: "Marcos",
            cpf: "333.333.333-33",
            cep: "04865-050",
            comoConheceu: "Indicação",
            dataCriacao: "23/03/2026",
            quantidadeFilhos: 1,
            status: "concluido",
            dataAgendamento: "31/03/2025 11:30h",
            filhos: ["Lucas - 05/05/2020"]
        }
    ]);

    // função que expande a linha para mostrar "filhos"
    const toggleLinha = (id) => {
        setLinhaExpandida(linhaExpandida === id ? null : id);
    };

    return (
        <div className={styles.tableWrapper}>
            <div className={styles.container}>
                <table className={styles.taskTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Responsável</th>
                            <th>CPF</th>
                            <th>CEP</th>
                            <th>Como Conheceu:</th>
                            <th>Dt. de Criação:</th>
                            <th>Qtde. Filhos</th>
                            <th className={styles.filterHeader}>Status</th>
                            <th className={styles.filterHeader}>Agendamento</th>
                            <th></th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {agendamentos.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr className={styles[`row${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`]}>
                                    <td>{item.id}</td>
                                    <td>{item.responsavel}</td>
                                    <td>{item.cpf}</td>
                                    <td>{item.cep}</td>
                                    <td>{item.comoConheceu}</td>
                                    <td>{item.dataCriacao}</td>
                                    <td>{item.quantidadeFilhos}</td>
                                    <td>{item.status}</td>
                                    <td>{item.dataAgendamento || "📅"}</td>
                                    <td>
                                        <Button onClick={() => toggleLinha(item.id)} className={styles.btnAlunos}>
                                            Alunos {">"}
                                        </Button>
                                    </td>
                                </tr>

                                {/* linha filhos */}
                                {linhaExpandida === item.id && (
                                    <tr className={styles.rowExpanded}>
                                        <td colSpan="10">
                                            <div className={styles.filhosLista}>
                                                {item.filhos.map((filho, index) => (
                                                    <p key={index}>• {filho}</p>
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
    );
}
export default Dashboard;