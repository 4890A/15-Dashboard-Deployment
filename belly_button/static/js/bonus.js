function buildGauge(WFREQ){
let trace = {
    domain: {x: [0, 1], y: [0, 1]},
    value: WFREQ,
    type: "indicator",
    title: {text: "Wash Frequency"},
    mode: "gauge+number",
    gauge: {axis: {range:[null, 9]}},

}
Plotly.newPlot("gauge", [trace])
}
