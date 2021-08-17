import React, { useEffect, useState } from "react";
import "./Dashboard.css";

import { CSVReader, readString } from "react-papaparse";

import region006Data from "../../assets/Region006.csv";
import region022Data from "../../assets/Region022.csv";
import region071Data from "../../assets/Region071.csv";
import region081Data from "../../assets/Region081.csv";
import region096Data from "../../assets/Region096.csv";
import region102Data from "../../assets/Region102.csv";
import region153Data from "../../assets/Region153.csv";
import region352Data from "../../assets/Region352.csv";
import region374Data from "../../assets/Region374.csv";
import region378Data from "../../assets/Region378.csv";
import region500Data from "../../assets/Region500.csv";

import Graph from "../Graph/Graph";
import Histogram from "../Histogram/Histogram";
import Table from "../Table/Table";

import RangeSlider from "../Slider/Slider";

export default function Dashboard() {
  // Hooks
  const [verRegions, setVerRegions] = useState([]);
  const [activeVerRegion, setActiveVerRegion] = useState({
    region: null,
    array: [],
  });
  const [rawData, setRawData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [nonRegionData, setNonRegionData] = useState([]);

  const [originalData, setOriginalData] = useState([]);
  const [ungatedRegionData, setUngatedRegionData] = useState([]);
  const [filteredOriginalData, setFilteredOriginalData] = useState([]);

  const [rssRange, setRssRange] = useState([7000, 17000]);
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  // Get VER Region map data
  useEffect(() => {
    setName("John");
  }, [name]);

  useEffect(() => {
    let csvFilePath = [
      region006Data,
      region022Data,
      region071Data,
      region081Data,
      region096Data,
      region102Data,
      region153Data,
      region352Data,
      region374Data,
      region378Data,
      region500Data,
    ];
    let regions = [];
    let names = [
      "6",
      "22",
      "71",
      "81",
      "96",
      "102",
      "153",
      "352",
      "374",
      "378",
      "500",
    ];

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

  //Slider Functions
  const handleSliderChange = (event, newValue) => {
    setRssRange(newValue);

    getFilteredDataThenSetState(newValue[0], newValue[1]);
  };
  const handleLowerInputChange = (event) => {
    const copy = rssRange.slice();
    copy[0] = Number(event.target.value);

    if (copy[0] >= copy[1] - 499) {
      copy[0] = 0;
    }
    setRssRange(copy);

    getFilteredDataThenSetState(copy[0], copy[1]);
  };
  const handleUpperInputChange = (event) => {
    let numberEvent = Number(event.target.value);
    if (numberEvent > 40000) {
      numberEvent = 40000;
    }
    const copy = rssRange.slice();

    copy[1] = Number(numberEvent);

    if (copy[1] <= copy[0]) {
      setRssRange(rssRange);
    }

    setRssRange(copy);

    getFilteredDataThenSetState(copy[0], copy[1]);
  };

  const resetRSS = (low, high) => {
    setRssRange([low, high]);

    getFilteredDataThenSetState(low, high);
  };
  // auxillary function

  const getFilteredDataThenSetState = (lower, upper) => {
    const filteredRawData = rawData.filter((object) => {
      return (
        (object["Region ID"] === activeVerRegion.region) &
        (Number(object["RSS"]) > lower) &
        (Number(object["RSS"]) < upper)
      );
    });
    setRegionData(filteredRawData);

    const filteredOriginalData = originalData.filter((object) => {
      return (
        (object["Region ID"] === activeVerRegion.region) &
        (Number(object["RSS"]) > lower) &
        (Number(object["RSS"]) < upper)
      );
    });
    setFilteredOriginalData(filteredOriginalData);
  };

  // File Functions
  const handleOnDrop = (data, meta) => {
    const ogData = data.map((obj) => obj.data);
    const convertedData = data
      .map((object) => object.data)
      .map((obj) => {
        return {
          ...obj,
          CL1: mfiToRegion(obj["CL1"]),
          CL2: mfiToRegion(obj["CL2"]),
          CL3: mfiToRegion(obj["CL3"]),
        };
      });
    setOriginalData(ogData);
    setRawData(convertedData);
    setFileName(meta.name.replace(".csv", ""));
  };
  const handleOnError = (err, file, inputElem, reason) => {
    console.error(err);
  };
  const handleOnRemoveFile = (data) => {
    setActiveVerRegion({
      region: null,
      array: [],
    });
    setRawData([]);
    setRegionData([]);
    setNonRegionData([]);
    setOriginalData([]);
    setUngatedRegionData([]);
    setFilteredOriginalData([]);
    setRssRange([7000, 17000]);
    setFileName("");
  };
  //Button Functions
  const selectVerRegion = (item) => {
    setActiveVerRegion(item);
    const filteredRawData = rawData.filter((object) => {
      return (
        (object["Region ID"] === item.region) &
        (Number(object["RSS"]) > rssRange[0]) &
        (Number(object["RSS"]) < rssRange[1])
      );
    });
    setRegionData(filteredRawData);
    console.log(filteredRawData);
    setUngatedRegionData(
      originalData.filter((object) => {
        return (
          (object["Region ID"] === item.region) &
          (Number(object["RSS"]) > rssRange[0]) &
          (Number(object["RSS"]) < rssRange[1])
        );
      })
    );
    setFilteredOriginalData(
      originalData.filter((object) => {
        return (
          (object["Region ID"] === item.region) &
          (Number(object["RSS"]) > rssRange[0]) &
          (Number(object["RSS"]) < rssRange[1])
        );
      })
    );

    setNonRegionData(
      filteredRawData.filter((object) => {
        return object["Region ID"] === "0";
      })
    );
  };

  return (
    <div className="dashboard">
      <nav className="navbar">Luminex IFX VER region visualizer</nav>
      <section className="selection">
        <div class="holder">
          <CSVReader
            onDrop={handleOnDrop}
            onError={handleOnError}
            config={{ header: true, encoding: "UTF-8" }}
            addRemoveButton
            onRemoveFile={handleOnRemoveFile}
          >
            <span className="instructions">
              Drop VER data here or Click to upload
            </span>
          </CSVReader>
        </div>

        {/* Region Buttons */}
        <div className="buttons">
          {rawData.length > 0 &&
            verRegions
              .sort((a, b) => a.region - b.region)
              .map((item, index) => {
                return (
                  <button
                    key={item.region}
                    onClick={() => selectVerRegion(item)}
                    className={
                      activeVerRegion.region === item.region ? "active" : ""
                    }
                  >
                    {item.region}
                  </button>
                );
              })}
        </div>
      </section>
      {/* 3D Graph */}
      <div>
        {regionData.length > 2 ? (
          <section>
            <Graph
              data={activeVerRegion.array}
              nonRegionData={nonRegionData}
              raw={regionData}
              title={activeVerRegion.region}
            />
            <Histogram raw={regionData} />
          </section>
        ) : activeVerRegion.length > 10 ? (
          <div></div>
        ) : originalData.length > 10 ? (
          <h3>No data Points, select new region or change RSS range </h3>
        ) : (
          <div></div>
        )}
        {originalData.length > 10 && (
          <RangeSlider
            value={rssRange}
            handleChange={handleSliderChange}
            sliderRange={rssRange}
            handleLowerInputChange={handleLowerInputChange}
            handleUpperInputChange={handleUpperInputChange}
            resetRSS={resetRSS}
          />
        )}
      </div>
      {originalData.length > 10 && (
        <section className="selection">
          <h1>Statistics</h1>

          {filteredOriginalData.length > 10 ? (
            <Table
              region={activeVerRegion.region}
              file={fileName}
              CL1median={calcMedian(filteredOriginalData, "CL1")}
              CL2median={calcMedian(filteredOriginalData, "CL2")}
              CL3median={calcMedian(filteredOriginalData, "CL3")}
              CL1cv={calcCoefficientVariation(
                filteredOriginalData,
                "CL1",
                0.05
              )}
              CL2cv={calcCoefficientVariation(
                filteredOriginalData,
                "CL2",
                0.05
              )}
              CL3cv={calcCoefficientVariation(
                filteredOriginalData,
                "CL3",
                0.05
              )}
              uCL1cv={calcCoefficientVariation(filteredOriginalData, "CL1", 0)}
              uCL2cv={calcCoefficientVariation(filteredOriginalData, "CL2", 0)}
              uCL3cv={calcCoefficientVariation(filteredOriginalData, "CL3", 0)}
            />
          ) : ungatedRegionData.length > 10 ? (
            <Table
              region={activeVerRegion.region}
              file={fileName}
              CL1median={calcMedian(ungatedRegionData, "CL1")}
              CL2median={calcMedian(ungatedRegionData, "CL2")}
              CL3median={calcMedian(ungatedRegionData, "CL3")}
              CL1cv={calcCoefficientVariation(ungatedRegionData, "CL1", 0.05)}
              CL2cv={calcCoefficientVariation(ungatedRegionData, "CL2", 0.05)}
              CL3cv={calcCoefficientVariation(ungatedRegionData, "CL3", 0.05)}
              uCL1cv={calcCoefficientVariation(ungatedRegionData, "CL1", 0)}
              uCL2cv={calcCoefficientVariation(ungatedRegionData, "CL2", 0)}
              uCL3cv={calcCoefficientVariation(ungatedRegionData, "CL3", 0)}
            />
          ) : (
            <div></div>
          )}
          <button
            onClick={() => {
              download_table_as_csv("statistics");
            }}
          >
            Download
          </button>
        </section>
      )}
    </div>
  );
}

const calcMedian = (numbers, parameter) => {
  const sorted = numbers
    .slice()
    .map((obj) => Number(obj[parameter]))
    .sort((a, b) => a - b);

  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return ((sorted[middle - 1] + sorted[middle]) / 2).toFixed(2);
  }
  return sorted[middle].toFixed(2);
};

const calcCoefficientVariation = (numbers, parameter, trim) => {
  const data = numbers
    .slice()
    .map((obj) => Number(obj[parameter]))
    .sort((a, b) => a - b);
  const trimValue = Math.round(data.length * trim);
  const firstTrim = data.slice(trimValue);
  const values = firstTrim.slice(0, firstTrim.length - trimValue);
  const arrayLength = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / arrayLength;
  const standarDeviation = Math.sqrt(
    values.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) /
      arrayLength
  );
  const coefficientVariation = ((standarDeviation / mean) * 100).toFixed(2);
  return coefficientVariation;
};

const mfiToRegion = (value) => {
  const valueNum = Number(value);
  return (Math.log10(valueNum + 1) / Math.log10(32767)) * 511;
};

const download_table_as_csv = (table_id, separator = ",") => {
  // Select rows from table_id
  var rows = document.querySelectorAll("table#" + table_id + " tr");
  // Construct csv
  var csv = [];
  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td, th");
    for (var j = 0; j < cols.length; j++) {
      // Clean innertext to remove multiple spaces and jumpline (break csv)
      var data = cols[j].innerText
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(/(\s\s)/gm, " ");
      // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
      data = data.replace(/"/g, '""');
      // Push escaped string
      row.push('"' + data + '"');
    }
    csv.push(row.join(separator));
  }
  var csv_string = csv.join("\n");
  // Download it
  var filename =
    "export_" + table_id + "_" + new Date().toLocaleDateString() + ".csv";
  var link = document.createElement("a");
  link.style.display = "none";
  link.setAttribute("target", "_blank");
  link.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURIComponent(csv_string)
  );
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
