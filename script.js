
const API_URL = 'https://api.rootnet.in/covid19-in/stats/latest';

let totalCount = document.getElementById('total');
let recoveredCount = document.getElementById('recovered');
let deathCount = document.getElementById('deaths');
let stateTable = document.querySelector('#myTable tbody');
let stateSelect = document.getElementById('stateSelect');
let selectedStateBox = document.getElementById('selectedStateData');

let stateName = document.getElementById('stateName');
let sTotal = document.getElementById('sTotal');
let sRecovered = document.getElementById('sRecovered');
let sDeaths = document.getElementById('sDeaths');

let covidData = {};

function animateCounter(element, endValue = 7000) {
  let start = 0;
  const increment = Math.ceil(endValue / 50);

  const counter = setInterval(() => {
    start += increment;
    if (start >= endValue) {
      start = endValue;
      clearInterval(counter);
    }
    element.textContent = start.toLocaleString();
  }, 50);
}


const coronaData = async () => {
  try {
    let res = await fetch(API_URL);
    let data = await res.json();
    covidData = data.data;

    viewData();
    displayStateData();
    populateStateOptions();
  } catch (error) {
    console.log(error.message);
  }
};

const viewData = () => {
  try {
    let total = covidData.summary.total;
    let recovered = covidData.summary.discharged;
    let deaths = covidData.summary.deaths;

    animateCounter(totalCount, total);
    animateCounter(recoveredCount, recovered);
    animateCounter(deathCount, deaths);
  } catch (error) {
    console.log(error.message);
  }
};


const displayStateData = () => {
  try {
    let stateList = covidData.regional;
    stateTable.innerHTML = "";

    stateList.forEach((state) => {

      let row = document.createElement('tr');
      row.innerHTML = `
        <td>${state.loc}</td>
        <td>${state.totalConfirmed.toLocaleString()}</td>
        <td>${state.discharged.toLocaleString()}</td>
        <td>${state.deaths.toLocaleString()}</td>
      `;
      stateTable.appendChild(row);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const populateStateOptions = () => {
  covidData.regional.forEach((state) => {
    const option = document.createElement('option');
    option.value = state.loc;
    option.textContent = state.loc;
    stateSelect.appendChild(option);
  });
};

stateSelect.addEventListener('change', () => {
  const selected = stateSelect.value;
  stateTable.innerHTML = "";

  if (!selected) {
    selectedStateBox.classList.add('d-none');
    displayStateData();
    return;
  }

  const stateData = covidData.regional.find(state => state.loc === selected);

  if (stateData) {

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${stateData.loc}</td>
      <td>${stateData.totalConfirmed.toLocaleString()}</td>
      <td>${stateData.discharged.toLocaleString()}</td>
      <td>${stateData.deaths.toLocaleString()}</td>
    `;
    stateTable.appendChild(row);
  }
});

coronaData();