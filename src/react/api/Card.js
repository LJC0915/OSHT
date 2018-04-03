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
  console.log("========  " + "ShowCard" + "  ========");
  console.log("======  " + type + "  ======");
  hand.forEach(card => {
    console.log(card.Point + card.Suit);
  });
}

function checkSuit(hand) {
  // Check Suit
  let sumOfSuit = 0;
  let suits = 0;
  for (let card of hand) {
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
  return suits;
}

// 5. Aces
// AAxx. These hands vary in strength from speculative ("dry" AAxx with worthless side cards)
// to ultra premium (doubly suited AAxx with good side cards).
function checkAces(hand) {
  let suits = checkSuit(hand);
  let numOfAce = 0;

  for (let card in hand) {
    if (hand[card].Point == "A") {
      numOfAce++;
    }
  }
  if (numOfAce == 2) {
    // console.log("AAXX");
    // Magnum
    // Double-suited to both aces, and with a high pair, a connector, or 2 Broadway cards. For example:
    // AAJJ AA76 AAKQ
    if (suits == 2) {
      //  high pair
      let hightcard = 0;
      let hightpair = false;
      for (let card of hand) {
        if (card.point >= 10) {
          if (!hightcard) {
            hightcard = card.point;
          } else {
            if (hightcard == card.point) {
              hightpair = true;
            }
          }
        }
      }
      if (hightpair) showHand(hand, "Magnum  Aces with high pair");
      // connector
      let connectcard = 0;
      let connector = false;
      for (let card of hand) {
        if (card.point != 1) {
          if (!connectcard) {
            connectcard = card.point;
          } else {
            if (
              connectcard + 1 == card.point ||
              connectcard - 1 == card.point
            ) {
              connector = true;
            }
          }
        }
      }
      if (connector) showHand(hand, "Magnum  Aces with connector");
      //   two broadway
      let broadwaycard = 0;
      let braodway = false;
      for (let card of hand) {
        if (card.point >= 10) {
          broadwaycard++;
        }
        if (broadwaycard > 1) braodway = true;
      }

      if (braodway) showHand(hand, "Magnum  Aces with broadway");
    }
  }
}

// 3. Suited Ace Hands
// Suited ace with a rundown, a pair, or two Broadway cards
function checksutiedAce(hand) {
  let suit = false;
  let suitedAce = false;
  for (let card of hand) {
    if (card.Point == "A") {
      suit = card.Suit;
      suitedAce = true;
      break;
    }
  }
  if (suitedAce) {
    suitedAce = false;
    for (let card of hand) {
      if (card.Suit == suit && card.Point != "A") {
        suitedAce = true;
        break;
      }
    }

    if (suitedAce) {
      // pair
      let pair = false;
      for (let card of hand) {
        for (let walkcard of hand) {
          if (
            card.Point != "A" &&
            card.Point == walkcard.Point &&
            card.Suit != walkcard.Suit
          ) {
            pair = true;
            break;
          }
        }
      }
      if (pair) showHand(hand, "Suited Ace with pair");
      // two Broadway
      let broadwaycard = 0;
      let braodway = false;
      for (let card of hand) {
        if (card.point >= 10) {
          broadwaycard++;
        }
        if (broadwaycard > 1) braodway = true;
      }

      if (braodway) showHand(hand, "Suited Ace with broadway");

      // rundown
      let rundown = false;
      let downtown = [];
      for (let card of hand) {
        if (card.Point != "A") {
          downtown.push(card.point);
        }
      }
      if (downtown.length == 3) {
        downtown.sort((a, b) => {
          return a - b;
        });
        if (
          downtown[2] - downtown[0] < 4 &&
          downtown[1] != downtown[0] &&
          downtown[2] != downtown[1]
        ) {
          rundown = true;
        }
      }
      if (rundown) showHand(hand, "Suited Ace with rundown");
    }
  }
}
// 1. Big card and A high broadway wrap
// 4 cards T and higher, or 4 cards 9 and higher with an ace.
// KQJT AQJ9
function checkBigCard(hand) {
  let bigCard = true;
  let needAce = false;
  for (let card of hand) {
    if (card.Point < 9) {
      // besides all letters ATJQK
      bigCard = false;
      break;
    }
    if (card.Point == 9) {
      needAce = true;
      bigCard = false;
    }
    if (needAce) {
      for (let card of hand) {
        if (card.Point == "A") bigCard = true;
      }
    }
  }
  if (bigCard) showHand(hand, "Big card");
}

function checkStraight(hand) {
  let pointArray = [];
  for (let card of hand) {
    pointArray.push(card.point);
  }
  pointArray.sort((a, b) => {
    return a - b;
  });
  if (pointArray[3] - pointArray[0] > 5) return;
  else {
    let checkDuplicate = new Set(pointArray);
    if (checkDuplicate.size < pointArray.length) return;
  }
  showHand(hand, "Straight card");
}
// 4. Pair-plus Hands
// Pairs with suited and connected side cards, or a pair with another pair.
// JJT9 KK88
function checkPairPlus(hand) {
  let pointArray = [];
  for (let card of hand) {
    pointArray.push(card.point);
  }
  pointArray.sort((a, b) => {
    return a - b;
  });
  let checkPair = new Set(pointArray);
  if (checkPair.size > 3) return;
  if (pointArray[1] != pointArray[2] && checkPair.size == 2) {
    // showHand(hand, "Pair with pair card");
    return;
  }

  if (
    (pointArray[2] - pointArray[1] == 1 &&
      pointArray[1] - pointArray[0] == 1) ||
    (pointArray[3] - pointArray[2] == 1 && pointArray[2] - pointArray[1] == 1)
  ) {
    if (checkSuit(hand) > 0)
      showHand(hand, "Pairs with suited and connected side cards");
  }
}
function checkHand(hand) {
  // console.log(suits);
  // 1. Big card and A high broadway wrap
  // 4 cards T and higher, or 4 cards 9 and higher with an ace.
  // KQJT AQJ9
  //
  // checkBigCard(hand);
  //
  // 2. Straight hand
  // 4 connected cards with at most two gaps in them
  // 5678 678T QJ78 9874
  //
  // checkStraight(hand);
  //
  // 3. Suited Ace Hands
  // Suited ace with a rundown, a pair, or two Broadway cards
  // A986 ATT3 AKQ2
  //
  // checksutiedAce(hand);
  //
  // 4. Pair-plus Hands
  // Pairs with suited and connected side cards, or a pair with another pair.
  // JJT9 KK88
  //
  // checkPairPlus(hand);
  //
  // 5. Aces
  // AAxx. These hands vary in strength from speculative ("dry" AAxx with worthless side cards)
  // to ultra premium (doubly suited AAxx with good side cards).
  // AAxx. These hands vary in strength from speculative ("dry" AAxx with worthless side cards)
  // to ultra premium (doubly suited AAxx with good side cards).
  //
  //   checkAces(hand);
  //
  // 6. Marginal Hands
  // A wide category made up of various weak "one-way" hands with only one significant strength component:
  // - 3 Broadway cards + a dangler
  // - High pairs with worthless side cards
  // - Weak suited aces that don't fall under the previous "Suited Ace Hands" category
  // - Offsuit rundowns
  // KQJ4 KK72 AJ76 JT97
  //
}
main();
