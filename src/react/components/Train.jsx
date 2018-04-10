import React from "react";

import Carddeck from "components/Carddeck.jsx";
import Traindeck from "components/Traindeck.jsx";
import "./Train.css";

export default class Train extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="train text-center">
        <h2 className="p-4">
          How About This Hand <br />?
        </h2>
        <Carddeck />
        <Traindeck />
      </div>
    );
  }
}
