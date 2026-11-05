// Conversor de moedas com cotação atualizada.
// Busca as taxas na ExchangeRate-API (gratuita, sem chave) e guarda a última
// resposta no navegador. Sem internet, usa a última cotação salva ou, em último
// caso, a tabela fixa abaixo.

const API_URL = 'https://open.er-api.com/v6/latest/BRL';
const CHAVE_CACHE = 'conversor:cotacao';

const MOEDAS = {
    BRL: 'Real brasileiro',
    USD: 'Dólar americano',
    EUR: 'Euro',
    GBP: 'Libra esterlina',
    JPY: 'Iene japonês',
    CNY: 'Yuan chinês',
    ARS: 'Peso argentino',
    CLP: 'Peso chileno',
    COP: 'Peso colombiano',
    PEN: 'Sol peruano',
    CAD: 'Dólar canadense',
    CHF: 'Franco suíço',
};

// Tabela de reserva (1 BRL = x), usada só quando não há conexão nem cache.
const TAXAS_RESERVA = {
    BRL: 1, USD: 0.18, EUR: 0.16, GBP: 0.14, JPY: 26.52, CNY: 1.28, ARS: 164.5,
    CLP: 166.3, COP: 718.4, PEN: 0.66, CAD: 0.24, CHF: 0.16,
};

const el = (id) => document.getElementById(id);
let taxas = TAXAS_RESERVA;

function preencherMoedas() {
    for (const select of [el('fromCurrency'), el('toCurrency')]) {
        for (const [codigo, nome] of Object.entries(MOEDAS)) {
            select.add(new Option(`${codigo} · ${nome}`, codigo));
        }
    }
    el('fromCurrency').value = 'BRL';
    el('toCurrency').value = 'USD';
}

function formatar(valor, moeda) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: moeda }).format(valor);
}

// Converte passando pelo real: valor / taxa(origem) * taxa(destino).
function converter(valor, de, para, tabela) {
    return (valor / tabela[de]) * tabela[para];
}

function atualizar() {
    const valor = parseFloat(el('amount').value);
    const de = el('fromCurrency').value;
    const para = el('toCurrency').value;

    if (!Number.isFinite(valor) || valor < 0) {
        el('result').textContent = 'Digite um valor válido.';
        el('taxa').textContent = '';
        return;
    }

    el('result').textContent = `${formatar(valor, de)} = ${formatar(converter(valor, de, para, taxas), para)}`;
    const unitario = converter(1, de, para, taxas).toLocaleString('pt-BR', { maximumFractionDigits: 4 });
    el('taxa').textContent = `1 ${de} = ${unitario} ${para}`;
}

function mostrarStatus(texto) {
    el('status').textContent = texto;
}

function lerCache() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_CACHE));
    } catch {
        return null;
    }
}

function salvarCache(dados) {
    try {
        localStorage.setItem(CHAVE_CACHE, JSON.stringify(dados));
    } catch {
        // navegação privada ou armazenamento bloqueado: segue sem cache
    }
}

function aplicarCotacao({ taxas: novas, atualizadoEm }, prefixo) {
    taxas = { ...TAXAS_RESERVA, ...novas };
    const data = new Date(atualizadoEm).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    mostrarStatus(`${prefixo} ${data}.`);
    atualizar();
}

async function carregarCotacao() {
    try {
        const resposta = await fetch(API_URL);
        const dados = await resposta.json();
        if (dados.result !== 'success') throw new Error('resposta inválida');

        const cotacao = { taxas: dados.rates, atualizadoEm: dados.time_last_update_unix * 1000 };
        salvarCache(cotacao);
        aplicarCotacao(cotacao, 'Cotação atualizada em');
    } catch {
        const cache = lerCache();
        if (cache) {
            aplicarCotacao(cache, 'Sem conexão. Usando a última cotação salva, de');
        } else {
            taxas = TAXAS_RESERVA;
            mostrarStatus('Sem conexão. Usando a tabela de reserva (valores aproximados).');
            atualizar();
        }
    }
}

el('inverter').addEventListener('click', () => {
    const de = el('fromCurrency').value;
    el('fromCurrency').value = el('toCurrency').value;
    el('toCurrency').value = de;
    atualizar();
});

el('formulario').addEventListener('submit', (e) => e.preventDefault());
for (const id of ['amount', 'fromCurrency', 'toCurrency']) {
    el(id).addEventListener('input', atualizar);
}

preencherMoedas();
atualizar();
carregarCotacao();
