const electron = require('electron');
const { ipcRenderer } = electron;

let options = '<option value="" disabled selected>Choose one of the following..</option>';
let currencies;
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let monthsLabels = [];
let currentElementId;
let inrHistory = [];
let usdHistory = [];
let eurHistory = [];
let chart;

$.ajax({
  type: "GET",
  url: "https://min-api.cryptocompare.com/data/all/coinlist",
  dataType: "json",
  success: function(result){
    const { Data } = result;
    currencies = Data;
    for (const key of Object.keys(Data)) {
      options += `<option value="${key}">${Data[key].FullName}</option>`;
    }
    $('#currenciesList').html(options);
  }
});

showInfo = (value) => {
  let inr, usd, eur;
  currentElementId = value;
  $.ajax({
    type: "GET",
    url: `https://min-api.cryptocompare.com/data/price?fsym=${currentElementId}&tsyms=USD,EUR,INR`,
    dataType: "json",
    success: function(result){
      inr = result.INR.toString();
      usd = result.USD.toString();
      eur = result.EUR.toString();
      inr = `1 ${currentElementId} = ${inr} INR`;
      usd = `1 ${currentElementId} = ${usd} USD`;
      eur = `1 ${currentElementId} = ${eur} EUR`;
      $('#currencyINR').html(inr);
      $('#currencyUSD').html(usd);
      $('#currencyEUR').html(eur);
    }
  });
  $('#first').fadeOut();
  setTimeout(() => $('#second').fadeIn(), 500);
  const imageURL = `<img class="img-responsive" src="https://www.cryptocompare.com${currencies[value].ImageUrl}">`;
  $('#currencyImage').html(imageURL);
  const name = `Name: ${currencies[value].FullName}`;
  const algo = `Algorithm: ${currencies[value].Algorithm}`;
  const abb = `Abbreviation: ${currentElementId}`;
  const supply = `Total Coin Supply: ${currencies[value].TotalCoinSupply}`;
  $('#currencyName').html(name);
  $('#currencyAlgorithm').html(algo);
  $('#currencyAbbreviation').html(abb);
  $('#currencyTotalCoinSupply').html(supply);
  buildDataset();
}

showGraph = (element) => {
  if(element.attributes.id.value === 'radio1'){
    plotINRGraph();
  }else if(element.attributes.id.value === 'radio2'){
    plotUSDGraph();
  }else if(element.attributes.id.value === 'radio3'){
    plotEURGraph();
  }else if(element.attributes.id.value === 'radio4'){
    plotGraph();
  }
}

buildDataset = () => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  let currentMonth = (new Date()).getMonth();
  monthsLabels[6] = months[currentMonth];
  let timestamps = [];
  inrHistory = [];
  usdHistory = [];
  eurHistory = [];
  for(let i = 1;i <= 6; i++){
    timestamps[i-1] = currentTimestamp - (i*2592000);
    if((currentMonth-i) === -1 ){
      currentMonth = 11 + i;
    }
    monthsLabels[6-i] = months[currentMonth-i];
  }
  $.ajax({
    type: "GET",
    url: `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${currentElementId}&tsyms=INR,USD,EUR&ts=${timestamps[5]}`,
    dataType: "json",
    success: function(result){
      inrHistory.push(result[currentElementId].INR);
      usdHistory.push(result[currentElementId].USD);
      eurHistory.push(result[currentElementId].EUR);
      $.ajax({
        type: "GET",
        url: `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${currentElementId}&tsyms=INR,USD,EUR&ts=${timestamps[4]}`,
        dataType: "json",
        success: function(result){
          inrHistory.push(result[currentElementId].INR);
          usdHistory.push(result[currentElementId].USD);
          eurHistory.push(result[currentElementId].EUR);
          $.ajax({
            type: "GET",
            url: `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${currentElementId}&tsyms=INR,USD,EUR&ts=${timestamps[3]}`,
            dataType: "json",
            success: function(result){
              inrHistory.push(result[currentElementId].INR);
              usdHistory.push(result[currentElementId].USD);
              eurHistory.push(result[currentElementId].EUR);
              $.ajax({
                type: "GET",
                url: `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${currentElementId}&tsyms=INR,USD,EUR&ts=${timestamps[2]}`,
                dataType: "json",
                success: function(result){
                  inrHistory.push(result[currentElementId].INR);
                  usdHistory.push(result[currentElementId].USD);
                  eurHistory.push(result[currentElementId].EUR);
                  $.ajax({
                    type: "GET",
                    url: `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${currentElementId}&tsyms=INR,USD,EUR&ts=${timestamps[1]}`,
                    dataType: "json",
                    success: function(result){
                      inrHistory.push(result[currentElementId].INR);
                      usdHistory.push(result[currentElementId].USD);
                      eurHistory.push(result[currentElementId].EUR);
                      $.ajax({
                        type: "GET",
                        url: `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${currentElementId}&tsyms=INR,USD,EUR&ts=${timestamps[0]}`,
                        dataType: "json",
                        success: function(result){
                          inrHistory.push(result[currentElementId].INR);
                          usdHistory.push(result[currentElementId].USD);
                          eurHistory.push(result[currentElementId].EUR);
                          $.ajax({
                            type: "GET",
                            url: `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${currentElementId}&tsyms=INR,USD,EUR&ts=${currentTimestamp}`,
                            dataType: "json",
                            success: function(result){
                              inrHistory.push(result[currentElementId].INR);
                              usdHistory.push(result[currentElementId].USD);
                              eurHistory.push(result[currentElementId].EUR);
                              plotGraph();
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

plotGraph = () => {
  if(chart !== undefined){
    chart.destroy();
  }
  chart = new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
      labels: monthsLabels,
      // datasets: [{
      //     data: inrHistory,
      //     label: "INR",
      //     borderColor: "#3e95cd",
      //     fill: false
      //   }, {
      datasets: [{
          data: usdHistory,
          label: "USD",
          borderColor: "#8e5ea2",
          fill: false
        }, {
          data: eurHistory,
          label: "EUR",
          borderColor: "#3cba9f",
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: `Value of ${currentElementId} in previous 6 months`
      }
    }
  });
}

plotINRGraph = () => {
  if(chart !== undefined){
    chart.destroy();
  }
  chart = new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
      labels: monthsLabels,
      datasets: [{
          data: inrHistory,
          label: "INR",
          borderColor: "#3e95cd",
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: `Value of ${currentElementId} in previous 6 months`
      }
    }
  });
}

plotUSDGraph = () => {
  if(chart !== undefined){
    chart.destroy();
  }
  chart = new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
      labels: monthsLabels,
      datasets: [{
          data: usdHistory,
          label: "USD",
          borderColor: "#3e95cd",
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: `Value of ${currentElementId} in previous 6 months`
      }
    }
  });
}

plotEURGraph = () => {
  if(chart !== undefined){
    chart.destroy();
  }
  chart = new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
      labels: monthsLabels,
      datasets: [{
          data: eurHistory,
          label: "EUR",
          borderColor: "#3e95cd",
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: `Value of ${currentElementId} in previous 6 months`
      }
    }
  });
}

goBack = () => {
  $('#second').fadeOut();
  setTimeout(() => $('#first').fadeIn(), 500);
  chart.destroy();
}
