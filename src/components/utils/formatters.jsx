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
export const formatarDateTimeParaBr = (dateTimeIso) => {
    if (!dateTimeIso) return "";
    if (dateTimeIso.includes('/')) return dateTimeIso; 

    try {
        const [data, hora] = dateTimeIso.split('T');
        const [ano, mes, dia] = data.split('-');
        return hora ? `${dia}/${mes}/${ano} ${hora}h` : `${dia}/${mes}/${ano}`;
    } catch (error) {
        return dateTimeIso; 
    }
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

// --- CÁLCULOS E REGRAS ---
export const calcularDiasDesdesCriacao = (dataCriacaoStr) => {
    if (!dataCriacaoStr) return 0;
    try {
        const [dia, mes, ano] = dataCriacaoStr.split('/').map(Number);
        const dataCriacao = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        const diferenca = hoje - dataCriacao;
        return Math.floor(diferenca / (1000 * 60 * 60 * 24));
    } catch (e) { return 0; }
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