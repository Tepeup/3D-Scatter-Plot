import React, { useEffect, useState } from "react";
import "./Dashboard.css";

import { CSVReader, readString } from "react-papaparse";

import region102Data from "../../assets/Region102.csv";
import region153Data from "../../assets/Region153.csv";
import region352Data from "../../assets/Region352.csv";
import region374Data from "../../assets/Region374.csv";
import region378Data from "../../assets/Region378.csv";
import region500Data from "../../assets/Region500.csv";

import Graph from "../Graph/Graph";

export default function Dashboard() {
  const [verRegions, setVerRegions] = useState([]);
  const [activeVerRegion, setActiveVerRegion] = useState({
    region: null,
    array: [],
  });
  const [rawData, setRawData] = useState([]);
  const [regionData, setRegionData] = useState([]);

  useEffect(() => {
    let csvFilePath = [
      region102Data,
      region153Data,
      region352Data,
      region374Data,
      region378Data,
      region500Data,
    ];
    let regions = [];
    let names = ["102", "153", "352", "374", "378", "500"];

    csvFilePath.forEach((element, index) => {
      fetch(element)
        .then((rs) => {
          return rs.text();
        })
        .then((text) => {
          const jsonFromText = readString(text, { header: true });
          const arrayFromJson = jsonFromText.data;
          const arrayFromJsonNoBlanks = arrayFromJson.filter(
            (obj) => obj.x !== ""
          );

          regions.push({ region: names[index], array: arrayFromJsonNoBlanks });
          if (regions.length === 6) {
            setVerRegions(regions);
          }
        });
    });
  }, []);

  const handleOnDrop = (data) => {
    console.log(activeVerRegion.region);
    const filteredData = data
      .filter((object) => {
        return (
          // (object.data["Region ID"] === activeVerRegion.region) &
          (Number(object.data["RSS"]) > 7000) &
          (Number(object.data["RSS"]) < 17000)
        );
      })
      .map((object) => object.data);

    setRawData(filteredData);
  };
  const handleOnError = (err, file, inputElem, reason) => {
    console.error(err);
  };

  const handleOnRemoveFile = (data) => {
    setRawData([]);
    setActiveVerRegion({
      region: null,
      array: [],
    });
  };

  const mfiToRegion = (value) => {
    const valueNum = Number(value);
    return (Math.log10(valueNum + 1) / Math.log10(32767)) * 511;
  };

  const selectVerRegion = (item) => {
    setActiveVerRegion(item);
    const regionData = rawData
      .filter((object) => {
        return object["Region ID"] === item.region;
      })
      .map((obj) => {
        return {
          ...obj,
          oldCL1: obj["CL1"],
          CL1: mfiToRegion(obj["CL1"]),
          CL2: mfiToRegion(obj["CL2"]),
          CL3: mfiToRegion(obj["CL3"]),
        };
      });
    setRegionData(regionData);
  };

  return (
    <div className="dashboard">
      <nav className="navbar">Luminex IFX VER region visualizer</nav>
      <section className="selection">
        <CSVReader
          onDrop={handleOnDrop}
          onError={handleOnError}
          config={{ header: true }}
          addRemoveButton
          onRemoveFile={handleOnRemoveFile}
        >
          <span className="instructions">
            Drop VER data here or Click to upload
          </span>
        </CSVReader>
        {console.log(rawData.data)}
        {/* Region Buttons */}
        <div className="buttons">
          {rawData.length > 0 &&
            verRegions.map((item, index) => {
              return (
                <button
                  key={item.region}
                  onClick={() => selectVerRegion(item)}
                  className={
                    activeVerRegion.region === item.region ? "active" : ""
                  }
                >
                  Region {item.region}
                </button>
              );
            })}
        </div>
      </section>
      {/* 3D Graph */}
      {(activeVerRegion.array.length > 2) & (regionData.length > 2) ? (
        <Graph
          data={activeVerRegion.array}
          raw={regionData}
          title={activeVerRegion.region}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}
