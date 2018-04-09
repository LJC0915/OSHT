function makeCardPool() {
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
function makeAHand(cardpool) {
  let hand = [];
  for (let i = 0; i < 4; i++) {
    let card = Math.floor(Math.random() * (51 - i) + 1);

    card = cardpool.splice(card, 1);
    hand.push(card[0]);
  }
  return hand;
}
function main() {
  let cardpool = makeCardPool();
  let test = 100;
  console.log(" Test :", test);
  for (let i = 0; i < test; i++) {
    let cp = cardpool.slice();
    let hand = makeAHand(cp);
    checkHand(hand);
  }
}

function showHand(hand, type) {
  // console.log("========  " + "ShowCard" + "  ========");
  // console.log("======  " + type + "  ======");
  // hand.forEach(card => {
  //   console.log(card.Point + card.Suit);
  // });
}

function checkSuit(hand) {
  // Check Suit
  let sumOfSuit = 0;
  let suits = 0;
  let suitOfAce = 0;
  let suitedAce = false;
  for (let card of hand) {
    sumOfSuit += card.suit;
  }
  for (let card of hand) {
    if (card.point == 1 && Math.floor((sumOfSuit / card.suit) % 10 == 2))
      suitedAce = true;
  }
  if (Math.floor(sumOfSuit / 1000) > 1) suits++;
  sumOfSuit %= 1000;
  if (Math.floor(sumOfSuit / 100) > 1) suits++;
  sumOfSuit %= 100;
  if (Math.floor(sumOfSuit / 10) > 1) suits++;
  sumOfSuit %= 10;
  if (Math.floor(sumOfSuit / 1) > 1) suits++;

  return { suits, suitedAce };
}

function checkPair(hand) {
  let pointArray = [];
  let pairArray = [];
  for (let card of hand) {
    pointArray.push(card.point);
  }
  pointArray.sort((a, b) => {
    return a - b;
  });
  for (let i = 0; i < pointArray.length - 1; i++) {
    if (pointArray[i] == pointArray[i + 1]) pairArray.push(pointArray[i]);
  }

  let checkPair = [...new Set(pairArray)];
  return checkPair;
}

function checkBroadway(hand) {
  let broadways = 4;
  for (let card of hand) {
    if (card.Point <= 9) broadways--;
  }
  return broadways;
}

function checkConnector(hand) {
  let pointArray = [];
  let connectorArray = [];
  for (let card of hand) {
    pointArray.push(card.point);
  }
  pointArray.sort((a, b) => {
    return a - b;
  });
  for (let i = 0; i < pointArray.length - 1; i++) {
    if (pointArray[i] + 1 == pointArray[i + 1])
      connectorArray.push([pointArray[i], pointArray[i + 1]]);
  }
  return connectorArray;
}

function checkHand(hand) {
  // hand = [
  //   { Point: "Q", Suit: "c", point: 12, suit: 100 },
  //   { Point: "A", Suit: "c", point: 1, suit: 100 },
  //   { Point: "Q", Suit: "h", point: 12, suit: 10 },
  //   { Point: "A", Suit: "h", point: 1, suit: 10 }
  // ];

  let suits = checkSuit(hand); // { suits: 1, suitedAce: false }
  let pairs = checkPair(hand); // [], [1], [1,2]
  let AcePair = pairs.filter(pair => pair == 1).length > 0 ? true : false;
  let broadways = checkBroadway(hand);
  let connector = checkConnector(hand);

  // AAXX (Magnum: +ds (+high pair / + broadway ) / Premium: +ds)
  if (AcePair && suits.suits == 2) {
    let highpair = pairs.filter(pair => pair > 9).length > 0 ? true : false;
    if (highpair) showHand(hand, "M: AAXX/ds + high pair");
    else if (broadways == 4) showHand(hand, "M: AAXX/ds + broadway");
    else showHand(hand, "P: AAXX/ds + nothing but (C)");
    return;
  }
  // AAXX (Premium: +ss + pair)
  if (AcePair && suits.suits == 1) {
    if (pairs.length == 2) {
      showHand(hand, "P: AAXX/ss + pair but (C)");
    } else if (broadways == 4) showHand(hand, "P: AAXX/ss + broadway");
    return;
  }

  // Two pairs
  if (pairs.length == 2) {
    showHand(hand, "P/S: Two pairs");
    return;
  }

  // Suited A + pair
  if (suits.suitedAce && pairs.length) {
    showHand(hand, "S: Suited Ace with pair");
    return;
  }

  // Suited A + broadway
  if (suits.suitedAce && broadways == 3) {
    showHand(hand, "S: Suited Ace with broadway");
    return;
  }

  // Big Card no duplicate
  // if (broadways == 4) {
  //   if (suits.suits > 0) showHand(hand, "P: Big Cards with suit(s)");
  // }
}
main();
