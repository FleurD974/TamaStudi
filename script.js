/* 
Possible states of the Tamastudi :
- 🥚 : beginning
- 🐣 : birth
Adult with different needs :
- 😢 : sad 0/5
- 🙁 : so-so 1/5
- 🙂 : normal 2/5
- 😄 : happy 3/5
- 🤗 : more happy 4/5
- 🥰 : really happy 5/5
- 👻 : dead 0/5
Its needs :
- 😋 : eat
- 🥱 : play
- 💩 : toilet
*/

const myTama = {
  name: "",
  alive: false,
  fed: 0,
  playfull: 0,
  cleaned: 0,
  lifeDuration: 0,
  desire: "",
};

/* PHASE 0 : activate the tama */
const start = () => {
  const buttonCenter = document.querySelector(
    '.js-button[data-direction="center"]'
  );
  // Need 5 clicks to activate the Tama
  let count = 0;
  buttonCenter.addEventListener('click', () => {
    count++;
    if (count === 5) {
      birth();
    }
  });
}

/* Phase 1 : tama's birth */

const birth = () => {
  myTama.name = prompt("Saisir le nom du Tamastudi :");
  showInScreen("🐣");
  const explanation = document.querySelector(".js-explanation");
  explanation.classList.add("hidden");
  const vitals = document.querySelector(".js-vitals");
  vitals.classList.remove("hidden");
  const nameDisplay = document.querySelector(".js-tamaName");
  nameDisplay.textContent = myTama.name;
  // To begin : all needs are fully satisfied
  const defaultScore = 5;
  myTama.fed = defaultScore;
  myTama.playfull = defaultScore;
  myTama.cleaned = defaultScore;
  updateVitals();
  const actions = document.querySelector('.js-actions');
  actions.classList.remove("hidden");
  // Becoming an adult
  evolve();
  // Life duration
  myTama.alive = true;
  calclifeDuration();
};

/* PHASE 2 : Tama's evolving and becoming adult */
const evolve = () => {
  //To be an adult it needs to have its first need
  const functionToExecute = () => {
    mood();
    cycleOfAdultLife()
  };
  wantsTo(functionToExecute);
};

/* Controling the needs */

const wantsTo = (callback) => {
  const needs = ['😋', '🥱', '💩'];
  // min = 1sec max = 3sec
  const minDuration = 1000;
  const maxDuration = 3000;
  const duration = getRandomInt({
    min: minDuration,
    max: maxDuration,
  });
  setTimeout(() => {
    const randomIndexNeeds = getRandomInt ({
      max: needs.length,
    });
    const desire = needs[randomIndexNeeds];
    if (callback) {
      callback(desire);
    } else {
      showInScreen(desire, true);
    }
  }, duration);
};

/* Global mood : average of 3 vitals : hunger, boredom and cleanliness */
const mood = () => {
  //Part 1 : digital display
  const sum = myTama.fed + myTama.playfull + myTama.cleaned;
  const average = sum / 3;
  const rounded = Math.round(average);
  const displayMood = document.querySelector(".js-mood");
  displayMood.textContent = rounded;
  //Part 2 : visual display
  const listOfEmojis = ["😢", "🙁", "🙂", "😄", "🤗", "🥰"];
  showInScreen(listOfEmojis[rounded]);
  //Death
  if (rounded === 0) {
    myTama.alive = false
  }
};

/* Life duration : 
Update every minute the tama's life duration
*/
const calclifeDuration = () => {
  const duration = 60_000; //60 secondes
  const displayLideDuration = document.querySelector(".js-life-duration");
  setInterval(() => {
    myTama.lifeDuration ++;
    displayLideDuration.textContent = myTama.lifeDuration;
  }, duration);
};

/* Managing adult's life
The tama's needs must be satisfied either way its mood decrease
If the mood drop to 0 the tama die
*/
const cycleOfAdultLife = () => {
  if (myTama.alive) {
    const functionToExecute = (desire) => {
      showInScreen(desire, true)
      myTama.desire = desire
      waitForAction()
    };
    wantsTo(functionToExecute);
  } else {
    showInScreen("👻");
    alert("Oh non, votre tama est mort!")
  }
};

// Use with cleartimeout to be sure that the vitals does not still decrease
let timeoutWaitForAction = null;
const waitForAction = () => {
  timeoutWaitForAction = setTimeout(() => {
    manageIndicators(myTama.desire, false)
    showInScreen("", true)
    cycleOfAdultLife()
  }, 5000)
};

const buttonsAction = document.querySelectorAll('.js-button-action');
buttonsAction.forEach(button => {
  button.addEventListener('click', () => {
    const associateDesire = button.getAttribute('data-desire');
    const tamaDesireString = translateEmoji(myTama.desire);
    const isGoodButton = tamaDesireString === associateDesire
    if (isGoodButton) {
      clearTimeout(timeoutWaitForAction)
      manageIndicators(myTama.desire, isGoodButton)
      cycleOfAdultLife()
    }
  })
});

const translateEmoji = (emoji) => {
  let word = ''
  if (emoji === '😋') word = 'eat'
  else if (emoji === '🥱') word = 'play'
  else if (emoji === '💩') word = 'clean'
  return word
};

const manageIndicators = (desire, hasSucceeded) => {
  //Needs management
  const numberToAdd = hasSucceeded ? 1 : -1;
  const calculName = hasSucceeded ? 'addition' : 'substraction';
  if (desire === '😋' && verifyIndicatorBeforeCalcul(myTama.fed, calculName)) {
    myTama.fed += numberToAdd
  } else if (desire === '🥱' && verifyIndicatorBeforeCalcul(myTama.playfull, calculName)) {
    myTama.playfull += numberToAdd
  } else if (desire === '💩' && verifyIndicatorBeforeCalcul(myTama.cleaned, calculName)) {
    myTama.cleaned += numberToAdd
  }
  updateVitals();
  mood();
  if (hasSucceeded) {
    showInScreen("", true)
  }
};

const verifyIndicatorBeforeCalcul = (value, calcul) => {
  if (calcul === 'addition') {
    return value < 5
  } else {
    return value > 0
  }
}

const updateVitals = () => {
  const displayIndicatorEat = document.querySelector(".js-score--eat");
  displayIndicatorEat.textContent = myTama.fed;
  const displayIndicatorPlay = document.querySelector(".js-score--play");
  displayIndicatorPlay.textContent = myTama.playfull;
  const displayIndicatorClean = document.querySelector(".js-score--clean");
  displayIndicatorClean.textContent = myTama.cleaned;

}

/* To get a random number */
const getRandomInt = (props) => {
  const max = props.max;
  const min = props.min ? props.min : 0;
  return Math.floor(Math.random() * (max - min) + min);
};

/* To display the emoji*/
const character = document.querySelector(".js-character");
const desire = document.querySelector(".js-desire");
const showInScreen = (display, isDesire) => {
  if (isDesire) {
    desire.textContent = display;
  } else {
    character.textContent = display;
  }
};

//To start
start();
