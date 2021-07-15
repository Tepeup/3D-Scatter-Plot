import React from "react";
import createPlotlyComponent from "react-plotly.js/factory";
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

export default function Graph(props) {
  return (
    <div className="container">
      <Plot
        data={[
          {
            x: props.raw.map((object) => Number(object.CL1)),
            y: props.raw.map((object) => Number(object.CL2)),
            z: props.raw.map((object) => Number(object.CL3)),
            type: "scatter3d",
            mode: "markers",
            marker: { color: "darkblue", size: 2, opacity: 0.4 },
          },
          {
            x: props.data.map((object) => object.x),
            y: props.data.map((object) => object.y),
            z: props.data.map((object) => object.z),
            type: "scatter3d",
            mode: "markers",
            marker: { color: "red", size: 3, opacity: 0.04 },
          },
        ]}
        layout={{
          title: {
            text: "REGION " + props.title,
            font: {
              size: 36,
              color: "#ba0c2f",
            },
          },
          margin: {
            l: 10,
            r: 10,
            b: 10,
            t: 100,
            pad: 0,
          },
          width: 500,
          height: 500,
          scene: {
            xaxis: { title: "CL1", tickwidth: 2 },
            yaxis: { title: "CL2", tickwidth: 2 },
            zaxis: {
              title: "CL3",
              tickwidth: 2,
            },
          },
          plot_bgcolor: "hsl(0, 0%, 100%)",
          paper_bgcolor: "hsl(0, 0%, 98%)",
          showlegend: false,
        }}
      />
    </div>
  );
}
