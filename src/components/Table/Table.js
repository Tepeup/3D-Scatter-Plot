import React from "react";
import "./Table.css";

export default function Table(props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>CL1 Median</td>
          <td>{props.CL1median}</td>
        </tr>
        <tr>
          <td>CL2 Median</td>
          <td>{props.CL2median}</td>
        </tr>
        <tr>
          <td>CL3 Median</td>
          <td>{props.CL3median}</td>
        </tr>
        <tr>
          <td>CL1 CV</td>
          <td>{props.CL1cv}%</td>
        </tr>
        <tr>
          <td>CL2 CV</td>
          <td>{props.CL2cv}%</td>
        </tr>
        <tr>
          <td>CL3 CV</td>
          <td>{props.CL3cv}%</td>
        </tr>
      </tbody>
    </table>
  );
}
