const API_KEY =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const h = 500;
const w = 1000;
const padding = 60;

async function call() {
  try {
    const response = await fetch(API_KEY, {
      method: "GET",
      credentials: "same-origin",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
async function init() {
  const dataset = await call();

  console.log(dataset);
  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataset.data, (d) => {
        console.log(d[1]);
        return d[1];
      }),
    ])
    .range([h - padding, padding]);
  const xScale = d3
    .scaleTime()
    .domain(
      //d3.extent() tra ve 1 mang min max tu dl
      d3.extent(dataset.data, (d) => {
        console.log(new Date(d[0]));
        return new Date(d[0]); //new de tao dt ngay UTC tu ISO string
      })
    )
    .range([padding, w - padding]);

  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale);

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${h - padding})`)
    .call(xAxis);
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},0)`)
    .call(yAxis);
}
init();
