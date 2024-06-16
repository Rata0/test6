const api_key = '';

const convertCurrency = async (input) => {
  try {
    const [amount, fromCurrency, , toCurrency] = input.split(" ");

    if (!amount || !fromCurrency || !toCurrency) {
      throw new Error("Неверный формат ввода");
    }

    const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${api_key}&base_currency=${fromCurrency.toUpperCase()}&currencies=${toCurrency.toUpperCase()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Ошибка при получении данных о курсах: ${response.status} - ${response.statusText}`);
    }

    if (!data.data[toCurrency.toUpperCase()]) {
      throw new Error(`Неподдерживаемая валюта: ${toCurrency.toUpperCase()}`);
    }

    const toRate = data.data[toCurrency.toUpperCase()].value;
    const result = (parseFloat(amount) * toRate).toFixed(2);
    return `${amount} ${fromCurrency.toUpperCase()} = ${result} ${toCurrency.toUpperCase()}`;
  } catch (error) {
    console.error(error);
    return error
  }
};

const converterForm = document.getElementById("converter-form");
const converterInput = document.getElementById("converter-input");
const converterResult = document.getElementById("converter-result");

converterForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = converterInput.value.trim();
  const result = await convertCurrency(input);
  converterResult.textContent = result;
});

const fetchExchangeRates = async () => {
  try {
    const baseCurrencySelect = document.getElementById('base-currency');
    const baseCurrency = baseCurrencySelect.value;

    const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${api_key}&base_currency=${baseCurrency}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Ошибка при получении данных о курсах: ${response.status} - ${response.statusText}`);
    }

    const ratesContainer = document.getElementById('exchange-rates');
    ratesContainer.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'table table-striped';

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    table.appendChild(thead);
    table.appendChild(tbody);

    ratesContainer.appendChild(table);

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th>Валюта</th>
      <th>Курс</th>
    `;
    thead.appendChild(headerRow);

    for (const [currency, rate] of Object.entries(data.data)) {
      if (currency !== baseCurrency) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${currency}</td>
          <td>${rate.value.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

const showPage = (pageName) => {
  const converterPage = document.getElementById('converter');
  const ratesPage = document.getElementById('rates');

  if (pageName === 'converter') {
    converterPage.style.display = 'block';
    ratesPage.style.display = 'none';
  } else if (pageName === 'rates') {
    converterPage.style.display = 'none';
    ratesPage.style.display = 'block';
    fetchExchangeRates();
  }
};

const baseCurrencySelect = document.getElementById('base-currency');
baseCurrencySelect.addEventListener('change', fetchExchangeRates);
