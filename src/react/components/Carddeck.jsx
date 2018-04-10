import React from "react";

import Card from "components/Card.jsx";
import "./Carddeck.css";

export default class Carddeck extends React.Component {
  constructor(props) {
    super(props);

    this.cardpool = this.makeCardPool();
    this.hand = ["none", "none", "none", "none"];
    // this.hand = this.makeAHand();
    // this.checkHand();
  }
  render() {
    return (
      <div className="Carddeck d-flex justify-content-around">
        <Card card={this.hand[0]} />
        <Card card={this.hand[1]} />
        <Card card={this.hand[2]} />
        <Card card={this.hand[3]} />
      </div>
    );
  }
  makeCardPool() {
    // i : 1~13 =  A ~ K
    // j : 1~4  = spade, heart, club, diamond
    let point = ["A", 2, 3, 4, 5, 6, 7, 8, 9, "T", "J", "Q", "K"];
    let suit = ["s", "h", "c", "d"];
    let cardpool = [];
    for (var i = 0; i < 13; i++) {
      for (let j = 0; j < 4; j++) {
        cardpool.push({
          Point: point[i],
          Suit: suit[j],
          point: i + 1,
          suit: Math.pow(10, j)
        });
      }
    }
    return cardpool;
  }
  makeAHand() {
    let hand = [];
    for (let i = 0; i < 4; i++) {
      let card = Math.floor(Math.random() * (52 - i) + 1);
      card = this.cardpool.splice(card, 1);
      hand.push(card[0]);
    }
    return hand;
  }
}
