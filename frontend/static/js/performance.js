const xValuesWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
const xValuesMonth = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
const yValues = [3,4,8,3.5,4];
const xValues = xValuesWeek;

const filterWeek = document.getElementById("week-performance");
const filterMonth = document.getElementById("month-performance");
const filterYear = document.getElementById("year-performance");

(async function() {
const data = {
  labels: xValues,
  datasets: [{
    data: yValues,
    label: 'Your points',
    fill: false,
    borderColor: '#162f65',
    pointRadius: 4,
    pointBackgroundColor: "#e8c766",
    tension: 0
  }]
};

  new Chart(
    document.getElementById('user-performance'),
    {
      type: 'line',
      data: data,
      options: {
        plugins: {
          legend: { display: false }
        },
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

filterMonth.addEventListener("click", () => {
  const xValues = xValuesMonth;

});
 