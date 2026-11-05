# Conversor de Moedas

Aplicação web que converte valores entre 12 moedas, entre elas real, dólar, euro e as principais moedas da América do Sul. A **cotação é atualizada** a cada acesso.

**Acesse:** https://cleo-dev.github.io/conversor-de-moedas/

## Funcionalidades

- Cotação atualizada pela [ExchangeRate-API](https://www.exchangerate-api.com), um serviço gratuito que não pede chave de acesso.
- Funciona sem internet: usa a última cotação salva no navegador ou, se não houver nenhuma, uma tabela de reserva.
- Converte enquanto o valor é digitado e tem um botão para inverter as moedas.
- Mostra os valores no formato brasileiro (`R$ 1.234,56`).
- Layout responsivo para celular, com tema escuro automático.
- Não usa nenhuma biblioteca externa: só HTML, CSS e JavaScript.

## Como executar

```bash
git clone https://github.com/cleo-dev/conversor-de-moedas.git
cd conversor-de-moedas
# abra o index.html no navegador
```

## Estrutura

- `index.html`: interface.
- `styles.css`: estilos, incluindo layout responsivo e tema escuro.
- `script.js`: busca da cotação, cache, cálculo e formatação.

## Autor

Cléo Marques Brasil ([@cleo-dev](https://github.com/cleo-dev))
