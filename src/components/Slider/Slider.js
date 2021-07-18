import React from "react";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";

const RSSRangeSlider = withStyles({
  root: {
    color: "#2200cc",
    height: 3,
    padding: "16px 0",
  },
  thumb: {
    height: 16,
    width: 16,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
    marginTop: -6,
    marginLeft: -6,
  },
  active: {},
  track: {
    height: 3,
  },
  rail: {
    color: "#d8d8d8",
    opacity: 1,
    height: 3,
  },
})(Slider);

const useStyles = makeStyles({
  input: {
    width: 100,
    fontWeight: "bold",
    color: "#2200cc",
    padding: "0px 16px",
  },
});

export default function RangeSlider(props) {
  const classes = useStyles();
  return (
    <div className="slider">
      <RSSRangeSlider
        value={props.sliderRange}
        step={50}
        min={0}
        max={40000}
        onChangeCommitted={props.handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
      />
      <div className="inputs">
        <div>
          Lower:{" "}
          <Input
            className={classes.input}
            value={props.sliderRange[0]}
            margin="dense"
            onChange={props.handleLowerInputChange}
            inputProps={{
              step: 50,
              min: 0,
              max: 40000,
              type: "number",
              "aria-labelledby": "range-slider",
            }}
          />
        </div>
        <div>
          Upper:{" "}
          <Input
            className={classes.input}
            value={props.sliderRange[1]}
            margin="dense"
            onChange={props.handleUpperInputChange}
            inputProps={{
              step: 50,
              min: 0,
              max: 40000,
              type: "number",
              "aria-labelledby": "range-slider",
            }}
          />
        </div>
      </div>
      <button onClick={props.resetRSS} className="reset">
        Reset RSS
      </button>
    </div>
  );
}
