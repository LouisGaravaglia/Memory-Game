const cardContainer = document.querySelector(".card-container");
let pair = [];
let firstCard;
let secondCard;
let firstKey;
let secondKey;
let numFliped = 0;


/**
 * onPairLength will build the pair array by pushing the data-nick attribute each time
 * the card is clicked. Once there are two items in the array the pair array will 
 * eventually be reset in order to start the process over again. This array is key 
 * in order to holding two values needed in order to compare if they are the same or not.
 * 
 * @param {Array} pair
 * @param {string} dataNick
 * @param {HTMLElement} target
 */
function onPairLength(dataNick, target) {
  if (pair.length === 0) {
    pair.push(dataNick);
    firstCard = target.parentElement;
    firstCard.classList.toggle("flip");
    firstKey = target.dataset.key;
  } else if (pair.length === 1) {
    pair.push(dataNick);
    secondCard = target.parentElement;
    secondCard.classList.toggle("flip");
    secondKey = target.dataset.key;
  }
}


/**
 *onMatchKey will toggle the class "flip" in order to hide the cards again, since if
 this function runs it means that the user clicked on the same card twice, which
 we know since each card has a unique key.
 */
function onMatchKey() {
  let timer = setInterval(function () {
    firstCard.classList.toggle("flip");
    secondCard.classList.toggle("flip");
    clearInterval(timer);
  }, 700);
  pair = [];
}


/**
 * function onNoMatch will reduce the pair array back to an empty array, as well 
 * reset data-fliped attribute back to false in order to keep track of which cards
 * have been fliped. Only matching cards should keep a data-fliped attribute of true.
 * 
 * @param {HTMLCollection} children
 */
function onNoMatch(children) {
  numFliped = 2;
  let timer = setInterval(function () {
    firstCard.classList.toggle("flip");
    secondCard.classList.toggle("flip");
    for (var child of children) {
      child.setAttribute("data-fliped", "false");
    }
    pair = [];
    numFliped = 0;
    clearInterval(timer);
  }, 700);
}


/**
 * runMatchLogig function will loop over the below arrays of conditionals,
 * so that if all are true, it will then run further functions. Creating the conditional
 * log into arrays will condense the conditional statments needed to check to see if
 * the two clicked cards are unique, and either match or dont match.
 * 
 * @param {HTMLCollection} children
 * @param {string} pair0
 * @param {string} pair1
 */
function runMatchLogic(children, pair0, pair1) {
  const noMatch = [
    pair.length === 2,
    pair0 !== pair1,
    pair0 !== "undefined",
    pair1 !== "undefined",
  ];

  const matchKey = [
    pair0 === pair1,
    pair0 !== "undefined",
    pair1 !== "undefined",
    firstKey === secondKey,
  ];

  const match = [pair0 === pair1, pair0 !== "undefined", pair1 !== "undefined"];

  if (noMatch.every((item) => item)) {
    onNoMatch(children);
  } else if (matchKey.every((item) => item)) {
    onMatchKey();
  } else if (match.every((item) => item)) {
    pair = [];
  }
}


/**
 * Function that will get a hold of the DOM element that was clicked,
 * in order to know if it was something that we don't care about, in that case return,
 * otherwise we will start to assign data-attributes to keep track of the cards flipped.
 * 
 * @param {HTMLElement} e
 */
function onClick(e) {
  const card = e.target;
  const dataNick = card.dataset.nick;
  const name = card.dataset.name;
  const parent = card.parentElement.parentElement;

  if (name === "container" && dataNick === undefined) {
    return;
  } else if (name === "box" && dataNick === undefined) {
    return;
  }

  if (numFliped >= 2) {
    return;
  }

  card.parentElement.setAttribute("data-fliped", "true");

  onPairLength(dataNick, card);

  runMatchLogic(parent.children, pair[0], pair[1]);
}

cardContainer.addEventListener("click", onClick);

const difficutlyBtns = document.querySelectorAll(".difficulty");


/**
 *   This function adds the losing video and clears the cards off the screen,
 * and then removes the video after 1.7 seconds.
 * 
 * @param {HTMLElement} body 
 * @param {HTMLElement} diff1 
 * @param {HTMLElement} diff2 
 * @param {HTMLElement} diff3 
 * @param {HTMLElement} clockBtn 
 */
function losingVideo(body, diff1, diff2, diff3, clockBtn) {
  const loser = document.createElement("div");
  loser.innerHTML =
    "<video src='images/loser.mp4' autoplay poster='posterimage.jpg'></video>";
  loser.classList.add("loser");
  body.prepend(loser);
  cardContainer.innerHTML = "";
  diff1.style.pointerEvents = "auto";
  diff2.style.pointerEvents = "auto";
  diff3.style.pointerEvents = "auto";
  clockBtn.classList.toggle("danger");
  // clockBtn.classList.add("starting");
  setTimeout(() => {
    loser.remove();
  }, 1700);
}


/**
 * Function that adds the winning video and removes it after 1.7 seconds,
 * as well as resets the clock and click ability for certain buttons.
 * 
 * @param {HTMLElement} body 
 * @param {HTMLElement} diff1 
 * @param {HTMLElement} diff2 
 * @param {HTMLElement} diff3 
 * @param {HTMLElement} clockBtn 
 * @param {HTMLElement} clock 
 */
function winningVideo(body, diff1, diff2, diff3, clockBtn, clock) {
  const winner = document.createElement("div");
  winner.innerHTML =
    "<video src='images/winner.mp4' autoplay poster='posterimage.jpg'></video>";
  winner.classList.add("loser");
  body.prepend(winner);
  cardContainer.innerHTML = "";
  diff1.style.pointerEvents = "auto";
  diff2.style.pointerEvents = "auto";
  diff3.style.pointerEvents = "auto";
  clockBtn.classList.remove("danger");
  clockBtn.classList.add("starting");
  clock.innerText = "00:00";
  setTimeout(() => {
    winner.remove();
  }, 1700);
}


/**
 * This function uses setInterval to creating a ticking clock by updating the DOM
 * clock element every second, as well as checking to see if user won or lossed.
 * 
 * @param {HTMLElement} diffClass 
 * @param {HTMLElement} clock 
 * @param {HTMLElement} topTime 
 * @param {sessionStorage} easyScore 
 * @param {sessionStorage} mediumScore 
 * @param {sessionStorage} hardScore 
 * @param {number} TIME_LIMIT 
 */
function clockTicking(diffClass, clock, topTime, easyScore, mediumScore, hardScore, TIME_LIMIT) {
  const body = document.querySelector("body");
  const cards = document.querySelectorAll(".card-box");
  let timePassed = 0;
  const diff1 = document.querySelector(".diff1");
  const diff2 = document.querySelector(".diff2");
  const diff3 = document.querySelector(".diff3");
  const clockBtn = document.querySelector(".timer-btn");

  diff1.style.pointerEvents = "none";
  diff2.style.pointerEvents = "none";
  diff3.style.pointerEvents = "none";
  clockBtn.classList.add("starting");

  let timer = setInterval(() => {
    let flipCount = 0;
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;

    clock.innerText = `00:${timeLeft}`;

    for (var card of cards) {
      if (card.classList.contains("flip")) flipCount++;
    }

    if (flipCount === cards.length) {
      timeLeft = 0;
      winningVideo(body, diff1, diff2, diff3, clockBtn, clock);
      clearInterval(timer);
      if (diffClass.contains("easy")) {
        if (easyScore === null || timePassed < easyScore) {
          sessionStorage.setItem("easyScore", `${timePassed}`);
          topTime.innerText = `TOP TIME: ${timePassed}sec`;
        }
      }
      if (diffClass.contains("medium")) {
        if (mediumScore === null || timePassed < mediumScore) {
          sessionStorage.setItem("mediumScore", `${timePassed}`);
          topTime.innerText = `TOP TIME: ${timePassed}sec`;
        }
      }
      if (diffClass.contains("hard")) {
        if (hardScore === null || timePassed < hardScore) {
          sessionStorage.setItem("hardScore", `${timePassed}`);
          topTime.innerText = `TOP TIME: ${timePassed}sec`;
        }
      }
    }

    if (timeLeft < 10) {
      clock.innerText = `00:0${timeLeft}`;
      clockBtn.classList.remove("starting");
      clockBtn.classList.add("danger");

    }

    if (timeLeft === 0) {
      clearInterval(timer);
      losingVideo(body, diff1, diff2, diff3, clockBtn);

    }

  }, 1000);

}


difficutlyBtns.forEach((item) => {
  item.addEventListener("click", (e) => {
    const easyScore = sessionStorage.getItem("easyScore");
    const mediumScore = sessionStorage.getItem("mediumScore");
    const hardScore = sessionStorage.getItem("hardScore");
    const topTime = document.querySelector(".top-time");
    const diffClass = e.target.classList;
    const clock = document.getElementById("timer-label");
    let TIME_LIMIT;

    if (diffClass.contains("easy")) {
      TIME_LIMIT = 25;
      clock.innerText = "00:25";
      if (easyScore === null) {
        topTime.innerText = `TOP TIME:        `;
      } else {
        topTime.innerText = `TOP TIME: ${easyScore}sec`;
      }
    }
    if (diffClass.contains("medium")) {
      TIME_LIMIT = 40;
      clock.innerText = "00:40";
      if (mediumScore === null) {
        topTime.innerText = `TOP TIME:        `;
      } else {
        topTime.innerText = `TOP TIME: ${mediumScore}sec`;
      }
    }
    if (diffClass.contains("hard")) {
      TIME_LIMIT = 50;
      clock.innerText = "00:50";
      if (hardScore === null) {
        topTime.innerText = `TOP TIME:        `;
      } else {
        topTime.innerText = `TOP TIME: ${hardScore}sec`;
      }
    }

    clockTicking(diffClass, clock, topTime, easyScore, mediumScore, hardScore, TIME_LIMIT);

  });
});


/**
 * This function will randomize the array of cards (Nick Cage pics).
 * 
 * @param {Array} inputs 
 * @param {HTMLElement} cardContainer 
 */
function randomizeCards(inputs, cardContainer) {
  let m;
  let t;
  let j;

  for (var i = 0; i < inputs.length; i++) {
    m = inputs.length;
    m--;


    j = Math.floor(Math.random() * m);

    t = inputs[m];
    inputs[m] = inputs[j];
    inputs[j] = t;
  }

  for (var i = 0; i < inputs.length; i++) {
    let div = document.createElement("div");
    div.classList.add("card-box");
    div.setAttribute("data-name", "box");
    div.innerHTML = inputs[i].task;
    cardContainer.appendChild(div);
  }
}


/**
 * Function that, based on what button is clicked, will build an array of 8, 16, or 24 cards.
 * 
 * @param {HTMLElement} e 
 */
function cardLoader(e) {
  let testing;
  let inputs = [];

  if (e.target.classList.contains("easy")) {
    cardContainer.innerText = "";
    for (var i = 1; i < 5; i++) {
      inputs.push({
        task: `<div class='card-front' data-key='${i}' data-nick='nick-${i}'></div>
        <div class='card-back'>
          <img src='images/${i}.png' alt='Photo of Nicholas Cage' />
        </div>`,
      });
    }
    for (var i = 1; i < 5; i++) {
      inputs.push({
        task: `<div class='card-front' data-key='${
          i + 6
        }' data-nick='nick-${i}'></div>
        <div class='card-back'>
          <img src='images/${i}.png' alt='Photo of Nicholas Cage' />
        </div>`,
      });
    }
  } else if (e.target.classList.contains("medium")) {
    cardContainer.innerText = "";
    for (var i = 1; i < 9; i++) {
      inputs.push({
        task: `<div class='card-front' data-key='${i}' data-nick='nick-${i}'></div>
          <div class='card-back'>
            <img src='images/${i}.png' alt='Photo of Nicholas Cage' />
          </div>`,
      });
    }
    for (var i = 1; i < 9; i++) {
      inputs.push({
        task: `<div class='card-front' data-key='${
          i + 8
        }' data-nick='nick-${i}'></div>
          <div class='card-back'>
            <img src='images/${i}.png' alt='Photo of Nicholas Cage' />
          </div>`,
      });
    }
  } else if (e.target.classList.contains("hard")) {
    cardContainer.innerText = "";
    for (var i = 1; i < 13; i++) {
      inputs.push({
        task: `<div class='card-front' data-key='${i}' data-nick='nick-${i}'></div>
            <div class='card-back'>
              <img src='images/${i}.png' alt='Photo of Nicholas Cage' />
            </div>`,
      });
    }
    for (var i = 1; i < 13; i++) {
      inputs.push({
        task: `<div class='card-front' data-key='${
          i + 12
        }' data-nick='nick-${i}'></div>
            <div class='card-back'>
              <img src='images/${i}.png' alt='Photo of Nicholas Cage' />
            </div>`,
      });
    }
  }

  randomizeCards(inputs, cardContainer);

};

const easyBtn = document.querySelector(".easy");
easyBtn.addEventListener("click", cardLoader);

const mediumBtn = document.querySelector(".medium");
mediumBtn.addEventListener("click", cardLoader);
const hardBtn = document.querySelector(".hard");
hardBtn.addEventListener("click", cardLoader);