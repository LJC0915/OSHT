//
// Type
//   Premium / Speculative / Marginal / Trash
//
// Category
//   Structure of hand
//

function HandType(handType, handCategory) {
  return { handType, handCategory };
}

function checkSuit(hand) {
  let sumOfSuit = 0;
  let suits = 0;
  let suitedAce = false;

  for (let card of hand) {
    sumOfSuit += card.suit;
  }

  for (let card of hand) {
    if (card.point == 1 && Math.floor(sumOfSuit / card.suit) % 10 >= 2)
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

  return [...new Set(pairArray)];
}

function checkBroadway(hand) {
  let broadways = 4;

  for (let card of hand) {
    if (card.Point <= 9) broadways--;
  }

  return broadways;
}
// Premiun / Speculative / Marginal / Connector / Suited A + rundown / Connector Side
// P       / S           / M        / C         / A                  / CS
function checkConnector(hand) {
  let pointArray = [];
  let category = "";

  for (let card of hand) {
    if (card.point != 1) pointArray.push(card.point);
  }

  pointArray.sort((a, b) => {
    return a - b;
  });

  let _pointArray = pointArray.slice(); // save include duplicates array
  pointArray = [...new Set(pointArray)];

  if (pointArray[3] - pointArray[0] < 6) {
    if (pointArray[3] - pointArray[0] == 3) {
      // - Rundowns with no gaps (JT98)

      category = "P";
    } else if (
      pointArray[3] - pointArray[0] == 4 &&
      pointArray[3] - pointArray[2] == 1
    ) {
      // - Rundowns with a single gap at the bottom (JT97)
      // - Rundowns with a single gap in the middle (JT87)

      category = "P";
    } else if (
      pointArray[3] - pointArray[0] == 5 &&
      pointArray[3] - pointArray[2] == 1
    ) {
      // - Rundowns with a double gap at the bottom (JT96)
      // - Rundowns with two single gaps at the bottom (JT86)
      // - Rundowns with a double gap in the middle (JT76)

      category = "S";
    } else {
      // Marginal

      category = "M";
    }
  } else if (pointArray.length <= 3) {
    if (pointArray[2] == pointArray[0] + 2) {
      if (_pointArray.length == 3) category = "A";
      else if (_pointArray[1] != _pointArray[2]) category = "CS";
    } else if (
      pointArray[0] + 1 == pointArray[1] ||
      pointArray[1] + 1 == pointArray[2]
    )
      category = "C";
  }

  return { category };
}

function checkHand(hand) {
  let suits = checkSuit(hand); // { suits: 1, suitedAce: false }
  let pairs = checkPair(hand); // [], [1], [1,2]
  let AcePair = pairs.filter(pair => pair == 1).length > 0 ? true : false;
  let broadways = checkBroadway(hand);
  let connector = checkConnector(hand);

  // Premium
  // Magnum & Premium AAXX
  if (AcePair && suits.suits == 2) {
    let highpair = pairs.filter(pair => pair > 10).length > 0 ? true : false;
    if (highpair) HandType("Premium", "Magnum AAXX/ds + high pair");
    else if (broadways == 4) HandType("Premium", "Magnum AAXX/ds + broadways");
    else if (connector.category == "C")
      HandType("Premium", "Magnum AAXX/ds + connectors");
    else HandType("Premium", "Premium AAXX/ds ");
    return;
  }
  if (AcePair && suits.suits == 1) {
    if (pairs.length == 2) {
      HandType("Premium", "Premium AAXX/ss + pair");
    } else if (broadways == 4)
      HandType("Premium", "Premium AAXX/ss + broadways");
    else if (connector.category == "C")
      HandType("Premium", "Premium AAXX/ss + connectors");
    else HandType("Speculative", "Speculative AAXX/ss");
    return;
  }
  // High double pairs
  if (pairs.length == 2) {
    if (pairs.filter(pair => pair > 10 || pair == 1).length == 2)
      HandType("Premium", "High double pairs");
    return;
  }
  // Big Cards at least single-suited
  if (broadways == 4 && suits.suits) {
    HandType("Premium", "Big Cards , at least single-suited");
    return;
  }
  // Premium rundowns, at least single-suited
  if (connector.category == "P" && suits.suits) {
    HandType("Premium", "Premium rundown, at least single-suited");
    return;
  }
  // Hihg pairs with suited and connected side cards
  if (pairs.length == 1 && suits.suits && connector.category == "CS") {
    if (pairs[0] > 10 || pairs[0] == 1) {
      return;
      HandType("Premium", "Hihg pair with suited and connected side cards");
      return;
    }
    if (pairs[0] > 6) {
      return;
      HandType(
        "Speculative",
        "Medium pair with suited and connected side cards"
      );
      return;
    }
  }

  // Speculative
  // Speculative rundowns, at least single-suited

  if (connector.category == "S" && suits.suits) {
    HandType("Speculative", "Speculative rundown, at least single-suited");
    return;
  }
  // Suited ace with a rundown
  // Suited ace with a pair
  // Suited ace with 2 Broadway cards
  if (connector.category == "A" && suits.suitedAce) {
    HandType("Speculative", "Suited ace with a rundown");
    return;
  }
  if (suits.suitedAce && pairs.length) {
    HandType("Speculative", "Suited Ace with pair");
    return;
  }

  if (suits.suitedAce && broadways == 3) {
    HandType("Speculative", "Suited Ace with broadways");
    return;
  }

  // Marginal
  // - 3 Broadway cards + a dangler, at least single-suited
  if (broadways == 3 && suits.suits) {
    HandType(
      "Marginal",
      "3 Broadway cards + a dangler, at least single-suited"
    );
    return;
  }
  // - High pairs with worthless side cards
  if (pairs.length == 1 && pairs[0] > 10) {
    HandType("Marginal", "High pairs with worthless side cards");
    return;
  }
  // - Weak suited aces that don't fall under the previous "Suited Ace Hands" category
  if (suits.suitedAce) {
    HandType("Marginal", "Weak suited ace");
    return;
  }
  // - Offsuit rundowns
  if (connector.category == "P" || connector.category == "S") {
    HandType("Marginal", "Offsuit rundowns");
    return;
  }
  HandType("Trash", "Trash");
}
