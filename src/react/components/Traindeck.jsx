import React from "react";
import { Button } from "reactstrap";

import "./Traindeck.css";

export default class Train extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="traindeck">
        <div className="buttonGroup d-flex justify-content-around">
          <Button className="p-2 BunttonColor">超 強</Button>{" "}
          <Button className="p-2 BunttonColor">不 錯</Button>{" "}
          <Button className="p-2 BunttonColor">邊 緣</Button>{" "}
          <Button className="p-2 BunttonColor">垃 圾</Button>{" "}
        </div>
        <div>
          <div className="p-2 startTrainHand">
            <p className="newHandButton" />
          </div>{" "}
        </div>
      </div>
    );
  }
}
