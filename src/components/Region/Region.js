import React, { useEffect, useState } from "react";

import { CSVReader, readString } from "react-papaparse";

import RegionGraph from "../RegionGraph/RegionGraph";
import Histogram from "../Histogram/Histogram";
import Table from "../Table/Table";

import RangeSlider from "../Slider/Slider";

export default function Region() {
  // Hooks

  const [activeVerRegion, setActiveVerRegion] = useState({
    region: null,
    array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 3],
  });
  const [rawData, setRawData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [nonRegionData, setNonRegionData] = useState([]);

  const [originalData, setOriginalData] = useState([]);
  const [ungatedRegionData, setUngatedRegionData] = useState([]);
  const [filteredOriginalData, setFilteredOriginalData] = useState([]);

  const [rssRange, setRssRange] = useState([7000, 17000]);
  const [fileName, setFileName] = useState("");

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

  const resetRSS = () => {
    setRssRange([7000, 17000]);

    getFilteredDataThenSetState(7000, 17000);
  };
  // auxillary function

  const getFilteredDataThenSetState = (lower, upper) => {
    const filteredRawData = rawData.filter((object) => {
      return (Number(object["RSS"]) > lower) & (Number(object["RSS"]) < upper);
    });
    setRegionData(filteredRawData);

    const filteredOriginalData = originalData.filter((object) => {
      return (Number(object["RSS"]) > lower) & (Number(object["RSS"]) < upper);
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
        // (object["Region ID"] === item.region) &
        (Number(object["RSS"]) > rssRange[0]) &
        (Number(object["RSS"]) < rssRange[1])
      );
    });

    setRegionData(filteredRawData);

    //What's the differece setUngate and setFiltered
    setUngatedRegionData(
      originalData.filter((object) => {
        return (
          //   (object["Region ID"] === item.region) &
          (Number(object["RSS"]) > rssRange[0]) &
          (Number(object["RSS"]) < rssRange[1])
        );
      })
    );
    setFilteredOriginalData(
      originalData.filter((object) => {
        return (
          //   (object["Region ID"] === item.region) &
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
      <section className="upload">
        <CSVReader
          onDrop={handleOnDrop}
          onError={handleOnError}
          config={{ header: true }}
          addRemoveButton
          onRemoveFile={handleOnRemoveFile}
        >
          <span className="instructions">Drop or Upload Region data here</span>
        </CSVReader>
      </section>
      <section className="selection">
        {/* Region Buttons */}
        <div className="buttons">
          <button
            onClick={() =>
              selectVerRegion({
                region: 31,
                array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 3],
              })
            }
          >
            Region X
          </button>
        </div>
      </section>
      {/* 3D Graph */}
      <div>
        {(activeVerRegion.array.length > 2) & (regionData.length > 2) ? (
          <section>
            <RegionGraph
              data={activeVerRegion.array}
              raw={regionData}
              title={activeVerRegion.region}
            />
            <Histogram raw={regionData} />
          </section>
        ) : activeVerRegion.length > 10 ? (
          <div></div>
        ) : originalData.length > 10 ? (
          <h3>No data Points, select new region or change RSS range</h3>
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
      {/* {originalData.length > 10 && (
        <section className="selection">
          <h1>Statistics</h1>

          {filteredOriginalData.length > 10 && (
            <Table
              region={activeVerRegion.region}
              file={fileName}
              CL1median={calcMedian(
                filteredOriginalData.filter((obj) => {
                  return obj["Region ID"] === "31";
                }),
                "CL1"
              )}
              CL2median={calcMedian(
                filteredOriginalData.filter((reg) => reg["Region ID"] === "31"),
                "CL2"
              )}
              CL3median={calcMedian(
                filteredOriginalData.filter((reg) => reg["Region ID"] === "31"),
                "CL3"
              )}
              CL1cv={calcCoefficientVariation(
                filteredOriginalData.filter((reg) => (reg["Region ID"] = "31")),
                "CL1",
                0.05
              )}
              CL2cv={calcCoefficientVariation(
                filteredOriginalData.filter((reg) => (reg["Region ID"] = "31")),
                "CL2",
                0.05
              )}
              CL3cv={calcCoefficientVariation(
                filteredOriginalData.filter((reg) => (reg["Region ID"] = "31")),
                "CL3",
                0.05
              )}
              uCL1cv={calcCoefficientVariation(
                filteredOriginalData.filter((reg) => (reg["Region ID"] = "31")),
                "CL1",
                0
              )}
              uCL2cv={calcCoefficientVariation(
                filteredOriginalData.filter((reg) => (reg["Region ID"] = "31")),
                "CL2",
                0
              )}
              uCL3cv={calcCoefficientVariation(
                filteredOriginalData.filter((reg) => (reg["Region ID"] = "31")),
                "CL3",
                0
              )}
            />
          )}
          <button
            onClick={() => {
              download_table_as_csv("statistics");
            }}
          >
            Download as CSV
          </button>
        </section>
      )} */}
    </div>
  );
}
// calculation fuctions

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
