function buildMetadata(sample) {
  
  // @TODO: Complete the following function that builds the metadata panel
  
  // Use `d3.json` to fetch the metadata for a sample
  endpoint = "/metadata/".concat(sample)
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(endpoint).then(data => {
    panelBody  = d3.select("#sample-metadata")
    panelBody.html("")
    Object.entries(data).forEach(([key, value]) => {
      panelBody
      .append("p")
      .text(`${key}: ${value}`)
    })
  buildGauge(data.WFREQ);
  })
  
  // BONUS: Build the Gauge Chart
}

function buildCharts(sample) {
  // create endpoint url
  endpoint = "/samples/".concat(sample)
  // create promise
  d3.json(endpoint).then(data => {
    // zip the response arrays into a single object to sort/filter on
    var sample_data = data.otu_ids.map(function(id, index){
      return {"id": id,
      "otu_labels":data.otu_labels[index],
      "sample_values": data.sample_values[index]}
    })
    // sort entities in sample based off of value, take 10
    var sorted_data = sample_data
    .sort((a, b) => b.sample_values - a.sample_values)
    
    var sliced_data = sorted_data.slice(0,10)
    
    // construct trace using sorted data object
    var pietrace = {
      values: sliced_data.map(x => x.sample_values),
      labels: sliced_data.map(x => x.id),
      hovertext: sliced_data.map(x => x.otu_labels),
      type: "pie"
    }
    
    var scattertrace = {
      x: sorted_data.map(x => x.id),
      y: sorted_data.map(x => x.sample_values),
      text: sorted_data.map(x => x.otu_labels),
      mode: "markers",
      marker: {
        size: sorted_data.map(x => x.sample_values),
        color:sorted_data.map(x => x.id),
        colorscale: 'Earth'
      },
      type: "scatter"
    }
    
    var scatter_layout = {
      title: "All OTUs represented in sample",
      xaxis: {title: "OTU id"
    },
    yaxis: {title: "Number present"}
  }
  // newplot
  Plotly.newPlot("pie", [pietrace]);
  Plotly.newPlot("bubble", [scattertrace], scatter_layout);
  
})

// @TODO: Build a Bubble Chart using the sample data


}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
      .append("option")
      .text(sample)
      .property("value", sample);
    });
    
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


/**
* 
* @param {number} newSample 
*/
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
console.log("js file connected")
