import React from "react";

import Card from "components/Card.jsx";
import "./Carddeck.css";

export default class Carddeck extends React.Component {
  constructor(props) {
    super(props);

    this.cardpool = this.makeCardPool();
    this.hand = ["none", "none", "none", "none"];
    this.hand = this.makeAHand();
    this.checkHand();
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
  testHand() {
    for (let i = 0; i < 10; i++) {
      console.log(i);
      let cardpool = this.makeCardPool();
      let hand = this.makeAHand(cardpool);
      this.checkHand(hand);
    }
  }
  checkHand() {
    // console.log(this.hand);

    // Check Suit
    let sumOfSuit = 0;
    let suits = 0;
    for (let card of this.hand) {
      sumOfSuit += card.suit;
    }
    // console.log(sumOfSuit);
    if (Math.floor(sumOfSuit / 1000) > 1) suits++;
    sumOfSuit %= 1000;
    if (Math.floor(sumOfSuit / 100) > 1) suits++;
    sumOfSuit %= 100;
    if (Math.floor(sumOfSuit / 10) > 1) suits++;
    sumOfSuit %= 10;
    if (Math.floor(sumOfSuit / 1) > 1) suits++;
    // console.log(suits);

    // 1. Big card and A high broadway wrap
    // 4 cards T and higher, or 4 cards 9 and higher with an ace.
    // KQJT AQJ9
    //
    // 2. Straight hand
    // 4 connected cards with at most two gaps in them
    // 5678 678T QJ78 9874
    //
    // 3. Suited Ace Hands
    // Suited ace with a rundown, a pair, or two Broadway cards
    // A986 ATT3 AKQ2
    //
    // 4. Pair-plus Hands
    // Pairs with suited and connected side cards, or a pair with another pair.
    // JJT9 KK88
    //
    // 5. Aces
    // AAxx. These hands vary in strength from speculative ("dry" AAxx with worthless side cards)
    // to ultra premium (doubly suited AAxx with good side cards).
    let numOfAce = 0;

    for (let card in this.hand) {
      if (this.hand[card].Point == "A") {
        numOfAce++;
      }
    }
    if (numOfAce == 2) {
      console.log("AAXX");
      // Magnum
      // Double-suited to both aces, and with a high pair, a connector, or 2 Broadway cards. For example:
      // AAJJ AA76 AAKQ
      if (suits == 2) {
        console.log(this.hand);
      }
    }
    // 6. Marginal Hands
    // A wide category made up of various weak "one-way" hands with only one significant strength component:
    // - 3 Broadway cards + a dangler
    // - High pairs with worthless side cards
    // - Weak suited aces that don't fall under the previous "Suited Ace Hands" category
    // - Offsuit rundowns
    // KQJ4 KK72 AJ76 JT97
    //
  }
}
