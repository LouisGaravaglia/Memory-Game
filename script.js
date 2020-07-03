const cardContainer = document.querySelector(".card-container");
let pair = [];
let firstCard;
let secondCard;
let firstKey;
let secondKey;
let count = 0;
let numFliped = 0;

/**
 * Why?
 * ... Write some documentation ...
 * @param {Array} pair
 * @param {string} dataNick
 * @param {HTMLElement} target
 */
function onPairLength(pair, dataNick, target) {
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
 * No params are being passed b/c of all the globals.
 * google "js polluting global scope".
 */
function onMatchKey() {
  let timer = setInterval(function () {
    firstCard.classList.toggle("flip");
    secondCard.classList.toggle("flip");
    clearInterval(timer);
  }, 1000);
  pair = [];
}

/**
 * Why?
 * ... Write some documentation ...
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
  }, 1000);
}

/**
 * Why?
 * Write why choices were made.
 * Don't write what or how. Reading the code will tell us that.
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
  ///////////////////////////////////////////////////////////////////////////////////////////HOW DOES THIS WORK?????
  ///////////////////////////////////////////////////////////////////////////////////////////HOW DO you compare an array of statements above?

  if (noMatch.every((item) => item)) {
    onNoMatch(children);
  } else if (matchKey.every((item) => item)) {
    onMatchKey();
  } else if (match.every((item) => item)) {
    pair = [];
  }


}

/**
 * Separates the conditional checks to see if there is an unwanted situation
 * for the click event, and if so, return.
 * 
 * @param {string} name 
 * @param {string} dataNick 
 */

// function returnConditionals(name, dataNick) {
//   if (name === "container" && dataNick === undefined) {
//     return;
//   } else if (name === "box" && dataNick === undefined) {
//     return;
//   }
// }

/**
 * Why?
 * Because we need to take action when the user clicks.
 * Take what actions?
 * ... Write some documentation ...
 * @param {s} e
 */
function onClick(e) {
  const card = e.target;
  const dataNick = card.dataset.nick;
  const name = card.dataset.name;
  const parent = card.parentElement.parentElement;

  // returnConditionals(name, dataNick);
  if (name === "container" && dataNick === undefined) {
    return;
  } else if (name === "box" && dataNick === undefined) {
    return;
  }

  if (numFliped >= 2) {
    return;
  }

  card.parentElement.setAttribute("data-fliped", "true");

  onPairLength(pair, dataNick, card);

  runMatchLogic(parent.children, pair[0], pair[1]);
}

cardContainer.addEventListener("click", onClick);

const difficutlyBtns = document.querySelectorAll(".difficulty");

/**
 * This function adds the losing video and clears the cards off the screen,
 * and then removes the video after 1.7 seconds.
 * 
 * @param {string} body 
 */
function losingVideo(body, diff1, diff2, diff3, clockBtn){
  const loser = document.createElement("div");
  loser.innerHTML =
    "<video src='images/loser.mp4' autoplay poster='posterimage.jpg'></video>";
  loser.classList.add("loser");
  body.prepend(loser);
  cardContainer.innerHTML = "";
  diff1.style.pointerEvents = "auto";
  diff2.style.pointerEvents = "auto";
  diff3.style.pointerEvents = "auto";
  clockBtn.classList.remove("danger");
  clockBtn.classList.remove("starting");
  setTimeout(() => {
      loser.remove();  
  }, 1700);
}

/**
 * Function that adds the winning video and removes it after 1.7 seconds,
 * as well as resets the clock and click ability for certain buttons.
 * 
 * @param {string} body 
 * @param {string} diff1 
 * @param {stinrg} diff2 
 * @param {stinrg} diff3 
 * @param {stinrg} clockBtn 
 * @param {stinrg} clock 
 */
function winningVideo(body, diff1, diff2, diff3, clockBtn, clock) {
  const winner = document.createElement("div");
  winner.innerHTML =
  "<video src='images/winner.mp4' autoplay poster='posterimage.jpg'></video>";
  winner.classList.add("loser");
  body.prepend(winner);
  cardContainer.innerHTML = "";
  clockBtn.classList.remove("danger");
  diff1.style.pointerEvents = "auto";
  diff2.style.pointerEvents = "auto";
  diff3.style.pointerEvents = "auto";
  clockBtn.classList.add("btn-outline-light");
  clockBtn.classList.remove("btn-outline-danger");
  clock.innerText = "00:00";
    setTimeout(() => {
    winner.remove();
  }, 1700);
}



difficutlyBtns.forEach((item) => {
  item.addEventListener("click", (e) => {
    let easyScore = sessionStorage.getItem("easyScore");
    let mediumScore = sessionStorage.getItem("mediumScore");
    let hardScore = sessionStorage.getItem("hardScore");
    let topTime = document.querySelector(".top-time");
    let diffClass = e.target.classList;

    if (diffClass.contains("easy")) {
      if (easyScore === null) {
        topTime.innerText = `TOP TIME:        `;
      } else {
        topTime.innerText = `TOP TIME: ${easyScore}sec`;
      }
    }
    if (diffClass.contains("medium")) {
      if (mediumScore === null) {
        topTime.innerText = `TOP TIME:        `;
      } else {
        topTime.innerText = `TOP TIME: ${mediumScore}sec`;
      }
    }
    if (diffClass.contains("hard")) {
      if (hardScore === null) {
        topTime.innerText = `TOP TIME:        `;
      } else {
        topTime.innerText = `TOP TIME: ${hardScore}sec`;
      }
    }
    const diff1 = document.querySelector(".diff1");
    const diff2 = document.querySelector(".diff2");
    const diff3 = document.querySelector(".diff3");

    diff1.style.pointerEvents = "none";
    diff2.style.pointerEvents = "none";
    diff3.style.pointerEvents = "none";
    const clock = document.getElementById("timer-label");
    const clockBtn = document.querySelector(".timer-btn");
    let TIME_LIMIT;
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;

    // TIME WERE SET TO 25, 50, 75
    if (diffClass.contains("easy")) {
      TIME_LIMIT = 1;
      clock.innerText = "00:25";
    } else if (diffClass.contains("medium")) {
      TIME_LIMIT = 60; 
      clock.innerText = "00:50";
    } else if (diffClass.contains("hard")) {
      TIME_LIMIT = 1;
      clock.innerText = "01:15";
    }
    clockBtn.classList.add("starting");


    function clockTicking(diff1, diff2, diff3, ){
      // The amount of time passed increments by one
      timePassed = timePassed += 1;
      timeLeft = TIME_LIMIT - timePassed;
      const body = document.querySelector("body");
      const cards = document.querySelectorAll(".card-box");
      let flipCount = 0;

      setInterval(() => {
        clock.innerText = `00:${timeLeft}`;
     
 
       for (var card of cards) {
         if (card.classList.contains("flip")) flipCount++;
       }
       if (flipCount === cards.length) {
        
         winningVideo(body, diff1, diff2, diff3, clockBtn, clock);
         clearInterval(timer);
         let time = timePassed;
 
         if (diffClass.contains("easy")) {
           if (easyScore === null || time < easyScore) {
             sessionStorage.setItem("easyScore", `${time}`);
             topTime.innerText = `TOP TIME: ${time}sec`;
           }
         }
         if (diffClass.contains("medium")) {
           if (mediumScore === null || time < mediumScore) {
             sessionStorage.setItem("mediumScore", `${time}`);
             topTime.innerText = `TOP TIME: ${time}sec`;
           }
         }
         if (diffClass.contains("hard")) {
           if (hardScore === null || time < hardScore) {
             sessionStorage.setItem("hardScore", `${time}`);
             topTime.innerText = `TOP TIME: ${time}sec`;
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
         timePassed = 0;
         timeLeft = TIME_LIMIT;
       }
 
 
     }, 1000);

    }

    // const timer = setInterval(() => {
    //   // The amount of time passed increments by one
    //   timePassed = timePassed += 1;
    //   timeLeft = TIME_LIMIT - timePassed;
    //   // The time left span is updated
    //   clock.innerText = `00:${timeLeft}`;

    //   const body = document.querySelector("body");
     
    //   const cards = document.querySelectorAll(".card-box");

    //   let flipCount = 0;
    

    //   for (var card of cards) {
    //     if (card.classList.contains("flip")) flipCount++;
    //   }
    //   if (flipCount === cards.length) {
       
    //     winningVideo(body, diff1, diff2, diff3, clockBtn, clock);
    //     clearInterval(timer);
    //     let time = timePassed;

    //     if (diffClass.contains("easy")) {
    //       if (easyScore === null || time < easyScore) {
    //         sessionStorage.setItem("easyScore", `${time}`);
    //         topTime.innerText = `TOP TIME: ${time}sec`;
    //       }
    //     }
    //     if (diffClass.contains("medium")) {
    //       if (mediumScore === null || time < mediumScore) {
    //         sessionStorage.setItem("mediumScore", `${time}`);
    //         topTime.innerText = `TOP TIME: ${time}sec`;
    //       }
    //     }
    //     if (diffClass.contains("hard")) {
    //       if (hardScore === null || time < hardScore) {
    //         sessionStorage.setItem("hardScore", `${time}`);
    //         topTime.innerText = `TOP TIME: ${time}sec`;
    //       }
    //     }

    //   }

    //   if (timeLeft < 10) {
    //     clock.innerText = `00:0${timeLeft}`;
    //     clockBtn.classList.remove("starting");
    //     clockBtn.classList.add("danger");
    //   }



    //   if (timeLeft === 0) {
    //     clearInterval(timer);
    //     losingVideo(body, diff1, diff2, diff3, clockBtn);
    //     timePassed = 0;
    //     timeLeft = TIME_LIMIT;
    //   }


    // }, 1000);
  });
});

const cardLoader = function (e) {
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
};

const easyBtn = document.querySelector(".easy");
easyBtn.addEventListener("click", cardLoader);
const mediumBtn = document.querySelector(".medium");
mediumBtn.addEventListener("click", cardLoader);
const hardBtn = document.querySelector(".hard");
hardBtn.addEventListener("click", cardLoader);
