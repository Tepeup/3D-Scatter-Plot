import React from "react";
import "./Table.css";

export default function Table(props) {
  return (
    <table id="statistics">
      <thead>
        <tr>
          <th colSpan={4}>
            Region {props.region} - {props.file}
          </th>
        </tr>
        <tr>
          <th>Type</th>
          <th>Median</th>
          <th>CV</th>
          <th>Untrimmed CV</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>CL1</td>
          <td>{props.CL1median}</td>
          <td>{props.CL1cv}%</td>
          <td>{props.uCL1cv}%</td>
        </tr>
        <tr>
          <td>CL2</td>
          <td>{props.CL2median}</td>
          <td>{props.CL2cv}%</td>
          <td>{props.uCL2cv}%</td>
        </tr>
        <tr>
          <td>CL3</td>
          <td>{props.CL3median}</td>
          <td>{props.CL3cv}%</td>
          <td>{props.uCL3cv}%</td>
        </tr>
      </tbody>
    </table>
  );
}
