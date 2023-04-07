// const xValues = [50,60,70,80,90,100,110,120,130,140,150];
// const yValues = [7,8,8,9,9,9,10,11,14,14,15];

// new Chart("user-performance", {
//   type: "line",
//   data: {
//     labels: xValues,
//     datasets: [{
//       fill: false,
//       lineTension: 0,
//       backgroundColor: "rgba(0,0,255,1.0)",
//       borderColor: "rgba(0,0,255,0.1)",
//       data: yValues
//     }]
//   },
//   options: {
//     legend: {display: false},
//     scales: {
//       yAxes: [{ticks: {min: 6, max:16}}],
//     }
//   }
// });

//import Chart from 'chart.js' 

const xValues = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
const yValues = [7,8,2,9,15];

(async function() {
const data = {
  labels: xValues,
  datasets: [{
    label: 'Your points',
    data: yValues,
    fill: false,
    borderColor: '#162f65',
    tension: 0.1
    
  }]
};

  new Chart(
    document.getElementById('user-performance'),
    {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Points"
            }
          },
          x: {
            title: {
              display: true,
              text: "Time"
            }
          }      
        }
      }
    }
  );
})();
 