const API_KEY =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const h = 500;
const w = 800;
const padding = 50;
const barWidth = 800 / 275;
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

  const times = dataset.data.map((item) => {
    let reverse = item[0].split("-").reverse().join("-");
    return reverse;
  });
  const GDP = dataset.data.map((item) => item[1]);

  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataset.data, (d) => {
        // console.log(d[1]);
        return d[1];
      }),
    ])
    .range([h, 0]);
  const xScale = d3
    .scaleTime()
    .domain(
      //d3.extent() tra ve 1 mang min max tu dl
      d3.extent(dataset.data, (d) => {
        // console.log(new Date(d[0]));
        return new Date(d[0]); //new de tao dt ngay UTC tu ISO string
      })
    )
    .range([0, w]);

  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    
    ;

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w + 2 * padding)
    .attr("height", h + padding)
    .style("position", "relative");

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(${padding},${h + padding / 2})`)
    .call(xAxis);
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},${padding / 2})`)
    .call(yAxis);

  svg
    .selectAll("rect")
    .data(dataset.data)
    .enter()
    .append("rect")
    .attr("index", (d, i) => i)
    .on("mouseover", function (d) {
      const i = this.getAttribute("index");
      // console.log(GDP)
      // console.log(times)
      tooltip
        .html(`${GDP[i]} USD<br>in ${times[i]}`)
        .attr("data-date", dataset.data[i][0])
        .style("top", h - padding + "px")
        .style("left", i * barWidth + 2 * barWidth + padding + 1 + "px")
        .transition()
        .duration(0)
        .style("opacity", 1);
    })
    .on("mouseout", function () {
      tooltip.transition().duration(200).style("opacity", 0);
    })
    .attr("x", (d, i) => i * barWidth + padding + 1)
    .attr("y", (d, i) => yScale(d[1]) + padding / 2 - 1)
    .attr("width", barWidth)
    .transition()
    .duration(2000)
    .attr("height", (d) => h - yScale(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("fill", "aqua")
    .attr("class", "bar");
}
init();
