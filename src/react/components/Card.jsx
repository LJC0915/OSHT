import React from "react";

import "./Card.css";

export default class Card extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // console.log(this.props.card);
    // let point = this.props.card.Point;
    // let suit = this.props.card.Suit;
    // console.log("Card:", this.props.card);
    // if (this.props.card) {
    var png;
    if (this.props.card == "none") {
      png = "/static/card/card-back.png";
    } else {
      png =
        "/static/card/" + this.props.card.Point + this.props.card.Suit + ".png";
    }

    return (
      <div className="">
        <img
          className={this.props.card}
          src={png}
          alt=""
          height="160"
          width="160"
        />
      </div>
    );
  }
}
