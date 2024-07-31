function convert() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultDiv = document.getElementById('result');

    if (!amount || amount <= 0) {
        resultDiv.textContent = 'Por favor, digite um valor válido.';
        return;
    }

    const rates = {
        'BRL': 1,
        'USD': 0.18,
        'EUR': 0.16,
        'JPY': 26.52,
        'GBP': 0.14,
        'CNY': 1.28,
        'ARS': 164.50
    };

    let convertedAmount;
    if (fromCurrency === 'BRL') {
        convertedAmount = (amount * rates[toCurrency]).toFixed(2);
    } else if (toCurrency === 'BRL') {
        convertedAmount = (amount / rates[fromCurrency]).toFixed(2);
    } else {
        convertedAmount = ((amount / rates[fromCurrency]) * rates[toCurrency]).toFixed(2);
    }

    resultDiv.textContent = `${amount} ${fromCurrency} é igual a ${convertedAmount} ${toCurrency}`;
}
