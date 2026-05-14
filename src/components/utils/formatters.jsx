// --- MÁSCARAS ---
export const aplicarMascaraCPF = (v) => {
    return v?.replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
            .substring(0, 14) || "";
};

export const aplicarMascaraCEP = (v) => {
    return v?.replace(/\D/g, "")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .substring(0, 9) || "";
};

// --- FORMATADORES (Para exibir na tela/tabela) ---

// Transforma YYYY-MM-DD em DD/MM/YYYY
export const formatarParaBr = (dataIso) => {
    if (!dataIso) return "";
    if (dataIso.includes('/')) return dataIso; 
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
};

// Transforma YYYY-MM-DDTHH:mm em DD/MM/YYYY HH:mmh
export const formatarDateTimeParaBr = (data) => {
    if (!data) return "";

    // Se já for um objeto Date (como o DatePicker envia)
    if (data instanceof Date) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');
        
        return `${dia}/${mes}/${ano} ${hora}:${minuto}h`;
    }

    // Caso ainda receba uma string (como o input antigo)
    if (typeof data === 'string' && data.includes('T')) {
        const [dataParte, horaParte] = data.split('T');
        const [ano, mes, dia] = dataParte.split('-');
        const [hora, minuto] = horaParte.split(':');
        return `${dia}/${mes}/${ano} ${hora}:${minuto}h`;
    }

    return data;
};

// --- PREPARADORES (Para colocar dados de volta nos inputs do Modal) ---

// Transforma DD/MM/YYYY em YYYY-MM-DD (para input type="date")
export const prepararDataParaInput = (dataRaw) => {
    if (!dataRaw) return "";
    const dataApenas = dataRaw.split(' ')[0]; 
    if (!dataApenas.includes('/')) return dataApenas;
    const [dia, mes, ano] = dataApenas.split('/');
    return `${ano}-${mes}-${dia}`;
};

// Transforma DD/MM/YYYY HH:mmh em YYYY-MM-DDTHH:mm (para input type="datetime-local")
export const prepararDateTimeParaInput = (dataBr) => {
    if (!dataBr || typeof dataBr !== 'string') return "";
    try {
        const limpa = dataBr.replace('h', '').trim(); 
        const [data, hora] = limpa.split(' ');
        const [dia, mes, ano] = data.split('/');
        const horaFormatada = hora.length === 5 ? hora : hora.padStart(5, '0');
        return `${ano}-${mes}-${dia}T${horaFormatada}`;  
    } catch (e) {
        return "";
    }
};

// --- CONSTANTES ---
export const statusLabels = {
    visita_agendada: "Visita Agendada",
    aguardando_resposta: "Aguardando Resposta",
    processo_concluido: "Processo Concluído",
    visita_cancelada: "Visita Cancelada"
};

export const pesosStatus = {
    aguardando_resposta: 1,
    visita_agendada: 2,
    processo_concluido: 3,
    visita_cancelada: 99
};

export const statusOptions = [
    { value: "todos", label: "Todos" },
    { value: "visita_agendada", label: "Visita Agendada" },
    { value: "aguardando_resposta", label: "Aguardando Resposta" },
    { value: "visita_cancelada", label: "Visita Cancelada" },
    { value: "processo_concluido", label: "Processo Concluído" }
];

export const getStatusClass = (status) => {
    const classes = {
        visita_agendada: "rowVisitaAgendada",
        aguardando_resposta: "rowAguardandoResposta",
        visita_cancelada: "rowVisitaCancelada",
        processo_concluido: "rowProcessoConcluido"
    };
    return classes[status] || "rowAguardandoResposta";
};