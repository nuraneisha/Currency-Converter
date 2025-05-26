//Array with object
const currencyList = [
  { code: 'USD', country: 'United States Dollar', flag: 'us' },
  { code: 'MYR', country: 'Malaysian Ringgit', flag: 'my' },
  { code: 'EUR', country: 'Euro', flag: 'eu' },
  { code: 'GBP', country: 'British Pound Sterling', flag: 'gb' },
  { code: 'JPY', country: 'Japanese Yen', flag: 'jp' },
  { code: 'AUD', country: 'Australian Dollar', flag: 'au' },
  { code: 'SGD', country: 'Singapore Dollar', flag: 'sg' },
];

//Fetch data with API
async function fetchData() 
{
  const response = await fetch(
    'https://api.currencyfreaks.com/latest?apikey=a479479f08c848489f70c845254a5938'
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Couldn't fetch data");
  }
}

//populate dropdown from the api
async function populateDropdown(dropdownId, flagId, codeId, nameId) 
{
  const data = await fetchData();
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = '';

  currencyList.forEach(({ code, country, flag }) => {
    // check exchnge rate data contains the currency
    if (data.rates[code]) {
      //create a new li tag to the dropdown menu
      const li = document.createElement('li');
      // showing each item in the dropdown list
      li.innerHTML = `  
        <a href="#" class="dropdown-item d-flex align-items-center" onclick="selectCurrency('${flagId}', '${codeId}', '${nameId}', '${flag}', '${code}', '${country}')">
          <img src='https://flagcdn.com/24x18/${flag}.png' class='me-2'>
          <strong class='me-2'>${code}</strong>
          <span>${country}</span>
        </a>
      `;
      dropdown.appendChild(li);
    }
  });
}

//after clicking on 1 item it updates the selected currency display
function selectCurrency(flagId, codeId, nameId, flag, code, name) 
{
  //flagId is reuseable (from-flag/to-flag)
  document.getElementById(
    flagId
  ).src = `https://flagcdn.com/24x18/${flag}.png`;
  document.getElementById(codeId).textContent = code;
  document.getElementById(nameId).textContent = name;
}

// window will load everything such as images only then it will populate dropdown
window.onload = () => {
  populateDropdown('from-dropdown', 'from-flag', 'from-code', 'from-name');
  populateDropdown('to-dropdown', 'to-flag', 'to-code', 'to-name');
};

async function convertCurrency() 
{
  //grab the first user input
  const amount = parseFloat(document.querySelector('input').value);
  const fromCode = document.getElementById('from-code').textContent;
  const toCode = document.getElementById('to-code').textContent;

  if (!amount || !fromCode || !toCode) {
    alert('Please select both currencies and enter a valid amount.');
    return;
  }

  try {
    const data = await fetchData();
    const fromRate = parseFloat(data.rates[fromCode]);
    const toRate = parseFloat(data.rates[toCode]);

    if (isNaN(fromRate) || isNaN(toRate)) {
      alert('Invalid exchange rate data.');
      return;
    }

    const converted = (amount / fromRate) * toRate;
    document.getElementById('converted-value').value = converted.toFixed(2);
  } catch (error) {
    alert('Conversion failed. Try again later.');
    console.error(error);
  }
}

function resetForm() 
{
  //reset the form
  document.querySelector('form').reset();

  //reset the flag,code,name to default
  const flag = (document.getElementById('from-flag').src = '');
  const code = (document.getElementById('from-code').innerText =
    'Choose a Currency');
  const name = (document.getElementById('from-name').innerText = '');

  const flags = (document.getElementById('to-flag').src = '');
  const codes = (document.getElementById('to-code').innerText =
    'Choose a Currency');
  const names = (document.getElementById('to-name').innerText = '');

  document.getElementById('converted-value').value = 'Result here : ';

  //reset the dropdown and get the changes in the api
  populateDropdown('from-dropdown', 'from-flag', 'from-code', 'from-name');
  populateDropdown('to-dropdown', 'to-flag', 'to-code', 'to-name');
}

const now = new Date();
const shortDate = now.toLocaleDateString('en-US', { dateStyle: 'short' });
document.getElementById(
  'current-dates'
).innerHTML = `<strong>Daily exchange rate as : ${shortDate}</strong>`;
