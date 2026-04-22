import React, { useState } from "react"; 
import styles from "./css/Dashboard.module.css";
import { Link } from 'react-router-dom'; 
import ModalDashboard from "./ModalDashboard";
// importando botão reutilizável da pasta dos components
import Button from "../components/Button/Button";
import calendarIcon from "../assets/icons/calendar.svg";
import historicoIcon from "../assets/icons/historico.svg";
import novoContatoIcon from "../assets/icons/novoContato.svg";

function Dashboard() {
    // estados
    const [linhaExpandida, setLinhaExpandida] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [menuStatusAberto, setMenuStatusAberto] = useState(false);
    const [menuDataAberto, setMenuDataAberto] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);

    // editando dt e hora do agendamento
    const [editandoId, setEditandoId] = useState(null);
    const [dataInput, setDataInput] = useState("");
    const [horaInput, setHoraInput] = useState("");

    // dados (exemplo)
    const [agendamentos, setAgendamentos] = useState([
        {
            id: 1,
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
            id: 2,
            responsavel: "Marcos",
            cpf: "333.333.333-33",
            cep: "04865-050",
            comoConheceu: "Indicação",
            dataCriacao: "23/03/2026",
            quantidadeFilhos: 1,
            status: "concluido",
            dataAgendamento: "31/03/2025 11:30h",
            filhos: ["Lucas - 05/05/2020"]
        },
        {
            id: 3,
            responsavel: "Carlos Oliveira",
            cpf: "111.111.111-11",
            cep: "05555-000",
            comoConheceu: "Indicação",
            dataCriacao: "15/04/2026",
            quantidadeFilhos: 1,
            status: "pendente", 
            dataAgendamento: null, 
            filhos: ["Enzo - 12/02/2018"]
        }
    ]);

    // função que salva a edição da data e hora
    const salvarEdicao = (id, novoStatus) => {
        //se nao preencher nada volta o ícone
        if (!dataInput.trim() || !horaInput.trim()) {
        setEditandoId(null);
        return;
    }
        //arrow function que percorre todos os ids dos responsáveis
        const novaLista = agendamentos.map(item => {
            //o id que eu quero editar a data é o mesmo do responsável?
            if (item.id === id) {
                //transf em padrão br, separa em array [2004,03,18], inverter [18,03,2004] e aplica as barras /
                const dataFormatada = dataInput.split('-').reverse().join('/');
                //
                return { 
                    //spread operator: pega todas as infos desse item
                    ...item, 
                    //modifica o campo e agendamento e os status
                    dataAgendamento: `${dataFormatada} ${horaInput}`,
                    status: novoStatus
                };
            }
            //se o if for falso retorna apenas o ícone de calendário
            return item;
        });
        //atribuo a nova lista pro Agendamento
        setAgendamentos(novaLista);
        //limpo os campos
        setEditandoId(null);
        setDataInput("");
        setHoraInput("");
    };

    //lógica dos filtros
    //criando uma lista temporária para verificar os status
    const agendamentosFiltrados = agendamentos.filter(item => {
        if(!item){
            return false;
        }
        //verificando todos da lista, se o filtro for "todos" retorna todos
        if (filtroStatus === "todos") return true;
        // caso contrário ele verifica se a lista tem o status que eu cliquei e verifica
        return item.status === filtroStatus;
    });

    //função pra expandir a linha assim que apertar em "alunos>"
    const toggleLinha = (id) => {
        //o id do responsavel é o que eu to cliando? se sim, expande, se não mostra apenas a linha do responsável
        setLinhaExpandida(linhaExpandida === id ? null : id);
    };

    //altera o estado dos status, "pendente", "agendado" ou "concluido"
    const handleFiltroStatus = (novoStatus) => {
        setFiltroStatus(novoStatus);
        setMenuStatusAberto(false);
    };

    //função que salva novo status do responsavel (caso seja alterado no modal)
    const atualizarStatusGlobal = (id, novoStatus) => {
    const novaLista = agendamentos.map(item => 
        item.id === id ? { ...item, status: novoStatus } : item
    );
    setAgendamentos(novaLista);
    setModalAberto(false); // Fecha o modal após salvar
    };  

    // função do botão novo contato (digitar manualmente as informações)
    const adicionarLinha = () =>{
        const novaLinha = {
            id: "TEMP",
            responsavel: "",
            cpf: "",
            cep: "",
            comoConheceu: "",
            dataCriacao: new Date().toLocaleDateString('pt-BR'),
            quantidadeFilhos: 0,
            status: "pendente",
            dataAgendamento: null,
            filhos: []
        };

        // passando pra agendamentos a nova linha
        setAgendamentos([novaLinha, ...agendamentos]);
    };

    // função que atualiza a linha e exibe ela
    const atualizarLinha = (campo, valor) =>{
        const novaLista = agendamentos.map(item => {
            if(!item) return false;
            if(item.id === "TEMP"){
                return {...item, [campo]:valor};
            }
            return item;
        });
        setAgendamentos(novaLista);
    };

    //função do botão salvar dados
    const confirmarLinha = () => {
        const novaLista = agendamentos.map(item => {
            if(!item) return false;
            const maiorID = agendamentos.filter(item => item !== undefined && item!== null).reduce((max, item) => (item.id > max ? item.id : max), 0);
            if(item.id === "TEMP"){
                if(item.responsavel === "" || item.cpf === "" || item.cep === "" || item.quantidadeFilhos === "" || item.status === ""){
                    alert("Preencha todos os campos.");
                    return;
                }
                return{
                    // retornando um novo id
                    ...item,
                    id: maiorID + 1
                };
            }
            return item
        });
        setAgendamentos(novaLista);
    };

    // função pra colocar os pontos e o traço no cpf
    const aplicarMascaraCPF = (valor) => {
        const nums = valor.replace(/\D/g, ""); 
        if (nums.length <= 3) return nums;
        if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
        if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
        return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9, 11)}`;
    };

    // função que aplica o traço no cep
    const aplicarMascaraCEP = (valor) => {
        const nums = valor.replace(/\D/g, "");
        if(nums.length <= 5) return nums;
        return `${nums.slice(0,5)}-${nums.slice(5,8)}`;
    };

    //fazendo o sort para exibir primeiro os pendentes, dps agendados, dps concluídos
    const pesos = {
        pendente: 1,
        agendado: 2,
        concluido: 3
    };

    // .sort
    const listaOrganizada = [...agendamentosFiltrados].sort((a,b) => {

        if(a.id === "TEMP") return -1;
        if(b.id === "TEMP") return 1;

        const pesoA = pesos[a.status] || 4;
        const pesoB = pesos[b.status] || 4;

        return pesoA - pesoB;
    });

    //desenhando na tela
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
                            {/* meus filtros status e agendamento */}
                            {/* onclick: responsável por "apagar" ou "ascender" a combobox */}
                            <th className={styles.filterHeader} onClick={() => setMenuStatusAberto(!menuStatusAberto)}>
                                Status <span className={styles.taskArrow}>v</span>
                                {/* se menustatus é verdadeiro ele executa os () */}
                                {menuStatusAberto && (
                                    // não deixa o onclick se propagar pro > statyus v
                                    <div className={styles.filter} onClick={(e) => e.stopPropagation()}>
                                        {/* mapeando todos os estados */}
                                        {["todos", "pendente", "agendado", "concluido"].map((st) => (
                                            // passando cada estado pra key e aplicando a class e o onclick
                                            <div key={st} className={styles.filterOption} onClick={() => handleFiltroStatus(st)}>
                                                {/* e aqui os inputs que sao os "radios" que checam se o que eu cliquei é um st da lista mapeanda */}
                                                <input type="radio" name="status" checked={filtroStatus === st} readOnly />
                                                <label>{st.charAt(0).toUpperCase() + st.slice(1)}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </th>
                            {/* mesma lógica dos status */}
                            <th className={styles.filterHeader} onClick={() => setMenuDataAberto(!menuDataAberto)}>
                                Agendamento <span className={styles.taskArrow}>v</span>
                                {menuDataAberto && (
                                    <div className={styles.filter} onClick={(e) => e.stopPropagation()}>
                                        <span style={{color: 'white', fontSize: '12px'}}>Data específica:</span>
                                        {/* abrindo o input de data */}
                                        <input type="date" className={styles.inputDate} />
                                        {/* botão de aplicar */}
                                        <Button className={styles.btnFiltrar} onClick={() => setMenuDataAberto(false)}>Aplicar</Button>
                                    </div>
                                )}
                            </th>
                            <th className={styles.taskBtnAtividade}>
                                <button onClick={adicionarLinha}>
                                    <img src={novoContatoIcon} alt="novo contato" />
                                </button>
                                <button>
                                    <img src={historicoIcon} alt="novo contato" />
                                </button>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {/* mapeio os status */}
                        {listaOrganizada.map((item) => (
                            // passo o id dos tatus pra key
                            <React.Fragment key={item.id}>
                                {/* aqui estou criando classes para os meus 3 tipos de status, estou juntando a palavra row+(pendente, agendado ou concluido) ao invés de criar 3 classes diferentes */}
                                <tr className={styles[`row${(item.status || "Pendente").charAt(0).toUpperCase() + (item.status || "Pendente").slice(1)}`]}>
                                    {/* trazendo as linhas do banco */}

                                    <td>{item.id}</td>
                                    <td>
                                        {item.id === "TEMP" ? (
                                            <input type="text"
                                            className={styles.inputTable}
                                            placeholder="Nome"
                                            onChange={(e) => atualizarLinha("responsavel", e.target.value)}
                                             />
                                        ):(
                                            <a 
                                            href="#" 
                                            className={styles.nomeLink} 
                                            onClick={(e) => {
                                                e.preventDefault(); 
                                                e.stopPropagation(); 
                                                setItemSelecionado(item);
                                                setModalAberto(true); 
                                            }}
                                        >
                                            {item?.responsavel}
                                        </a>
                                        )}
                                    </td>
                                    <td>{item.id === "TEMP" ? (
                                        <input type="text"
                                        className={styles.inputTable}
                                        placeholder="CPF" 
                                        value={item.cpf}
                                        onChange={(e) => {
                                            const formatado = aplicarMascaraCPF(e.target.value);
                                            atualizarLinha("cpf", formatado)}}
                                        />
                                    ): (
                                        item?.cpf
                                    )}
                                    </td>
                                    <td>{item.id === "TEMP" ? (
                                        <input type="text"
                                        className={styles.inputTable}
                                        placeholder="CEP"
                                        value={item.cep}
                                        onChange={(e) => {
                                            const formatado = aplicarMascaraCEP(e.target.value);
                                            atualizarLinha("cep", formatado)} }
                                        />
                                    ) : (
                                        item?.cep
                                    )}
                                    </td>
                                    <td>{item.id === "TEMP" ? (
                                        <select
                                            className={styles.taskSelectTable} 
                                            value={item.comoConheceu}
                                            onChange={(e) => atualizarLinha("comoConheceu", e.target.value)}
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="google">Google</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="indicacao">Indicação</option>
                                            <option value="outros">Outros</option>
                                        </select>
                                    ) : (
                                        item?.comoConheceu
                                    )}</td>
                                    <td>{item.dataCriacao}</td>
                                    <td>{item.id === "TEMP" ? (
                                        <input type="number"
                                        className={styles.inputTable}
                                        placeholder="Qtde. filhos"
                                        onChange={(e) => atualizarLinha("quantidadeFilhos", e.target.value)} 
                                        />
                                    ) : (
                                        item?.quantidadeFilhos
                                    )}</td>
                                    <td>{item.id === "TEMP" ?(
                                        <select
                                            className={styles.taskSelectTable}
                                            value={item.status}
                                            onChange={(e) => atualizarLinha("status", e.target.value)}
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="pendente">pendente</option>
                                            <option value="agendado">agendado</option>
                                            <option value="concluido">concluído</option>

                                        </select>
                                    ) : ( item?.status

                                    )}
                                    </td>
                                    {/* lógica do agendamento */}
                                    <td className={styles.colAgendamento}>
                                        {/* o id dessa linha é o mesmo q cliquei pra editar? */}
                                        {editandoId === item.id ? (
                                            // se sim vem pra cá: nao deixo que o clique do input se propague pro pai
                                            <div className={styles.editAgendamento} onClick={(e) => e.stopPropagation()}>
                                                {/* abre a janela pr escolher a data e salvo com onchange */}
                                                <input 
                                                    type="date" 
                                                    className={styles.inputDatePequeno}
                                                    onChange={(e) => setDataInput(e.target.value)}
                                                />
                                                {/* faço o mesmo com a hora */}
                                                <input 
                                                    type="text" 
                                                    placeholder="00:00h"
                                                    className={styles.inputHora}
                                                    onChange={(e) => setHoraInput(e.target.value)}
                                                />
                                                {/* botoes pra salvar ou cancelar edição */}
                                                <div className={styles.editButtons}>
                                                    <button onClick={() => salvarEdicao(item.id, "agendado")}>✓</button>
                                                    <button onClick={() => setEditandoId(null)}>✗</button>
                                                    <button onClick={() => salvarEdicao(item.id, "concluido")}>Done</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={styles.agendamentoVisual} onClick={() => setEditandoId(item.id)}>
                                                {item.dataAgendamento ? (
                                                    <div className={styles.agendamentoContainer}>
                                                        {item.dataAgendamento.split(' ').map((texto, index) => (
                                                            <span key={index}>{texto}</span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <img src={calendarIcon} alt="calendário" className={styles.calendarIconCenter} />
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    {/* função que eu criei em /components do botão */}
                                    <td>
                                        {item.id === "TEMP" ? (
                                            <button onClick={confirmarLinha}>
                                                Salvar
                                            </button>
                                        ) : (
                                        <Button onClick={() => toggleLinha(item.id)} className={styles.btnAlunos}>
                                            Crianças {">"}
                                        </Button>
                                        )}
                                    </td>
                                    <td></td>
                                </tr>

                                {/* verifico se a linha que quero expandir é o id que eu cliquei */}
                                {linhaExpandida === item.id && (
                                    <tr className={styles.rowExpanded}>
                                        <td colSpan="10">
                                            <div className={styles.filhosLista}>
                                                {/* mapeando a lista de filhos para cada id encontrado */}
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
            <ModalDashboard
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
                user={itemSelecionado}
                atualizarStatusGlobal={atualizarStatusGlobal}
            />
        </div>
    );
}

export default Dashboard;