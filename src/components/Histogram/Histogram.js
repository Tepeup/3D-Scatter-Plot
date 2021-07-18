import React from "react";

import createPlotlyComponent from "react-plotly.js/factory";
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

export default function Histogram(props) {
  return (
    <div className="container">
      <Plot
        data={[
          {
            x: props.raw.map((object) => Number(object.RSS)),
            xbins: { size: 50 },
            type: "histogram",
            marker: { color: "#2200cc" },
          },
        ]}
        layout={{
          xaxis: {
            range: [0, 40000],
          },
          margin: {
            l: 16,
            r: 16,
            b: 20,
            t: 20,
            pad: 0,
          },
          width: 500,
          height: 100,
          plot_bgcolor: "hsl(0, 0%, 100%)",
          paper_bgcolor: "hsl(0, 0%, 98%)",
          showlegend: false,
        }}
      />
    </div>
  );
}
