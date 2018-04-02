import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Main from "components/Main.jsx";

window.onload = function() {
  ReactDOM.render(
    <Main />,

    document.getElementById("root")
  );

  console.groupCollapsed("請勿點開");
  console.log("你還真的給我點下去");
  console.groupEnd("請勿點開");
};
