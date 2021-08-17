import React from "react";
import createPlotlyComponent from "react-plotly.js/factory";
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

export default function RegionGraph(props) {
  const palette = [
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#f032e6",
    "#bcf60c",
    "#fabebe",
    "#008080",
    "#e6beff",
    "#9a6324",
    "#fffac8",
    "#800000",
    "#aaffc3",
    "#808000",
    "#ffd8b1",
    "#000075",
    "#808080",
    "#ffffff",
    "#000000",
  ];
  const unique = [...new Set(props.raw.map((item) => item["Region ID"]))]; // [ 'A', 'B']
  const overHundred = props.raw.filter((obj) => Number(obj.CL1) > 100);
  const filtered = unique.map((value) =>
    overHundred.filter((obj) => obj["Region ID"] === value)
  );
  const unEmpty = filtered.filter((array) => array.length > 0);

  const test = unEmpty.map((req, index) => {
    return {
      x: req.map((val) => val.CL1),
      y: req.map((val) => val.CL2),
      z: req.map((val) => val.CL3),
      type: "scatter3d",
      mode: "markers",
      marker: { color: palette[index], size: 2, opacity: 0.2 },
      name: `Reg ${req[0]["Region ID"]}`,
    };
  });

  return (
    <div className="container">
      <Plot
        data={test}
        config={{ responsive: true }}
        layout={{
          title: {
            text: "REGION " + props.title,
            font: {
              size: 32,
              fontWeight: "600",
            },
          },
          margin: {
            l: 10,
            r: 10,
            b: 10,
            t: 80,
            pad: 0,
          },
          width: 800,
          height: 500,
          scene: {
            xaxis: { title: "CL1", tickwidth: 2, gridwidth: 2 },
            yaxis: { title: "CL2", tickwidth: 2, gridwidth: 2 },
            zaxis: {
              title: "CL3",
              tickwidth: 2,
              gridwidth: 2,
            },
          },
          plot_bgcolor: "hsl(0, 0%, 99%)",
          paper_bgcolor: "hsl(0, 0%, 99%)",
          showlegend: true,
          legend: { orientation: "h" },
        }}
      />
    </div>
  );
}
