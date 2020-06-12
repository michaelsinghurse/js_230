class Game {
  constructor() {
    this.words = [ 
      "GENEROUS", 
      "ELEGANT", 
      "COMPASSIONATE", 
      "INTELLIGENT",
      "ARTISTIC", 
      "POSITIVE", 
    ];
    this.currentWord = this._getNewWord();
    this.MAX_GUESSES = 6;
    this.wrongGuesses = 0;
    this.guesses = [];
  }

  _getNewWord() {
    let randIndex = Math.floor(Math.random() * this.words.length);
    return this.words.splice(randIndex, 1)[0];
  }
  
  canPlayAgain() {
    return this.words.length > 0;
  }

  didPlayerLose() {
    return this.wrongGuesses >= this.MAX_GUESSES;
  }

  didPlayerWin() {
    return this.currentWord
      .split("")
      .every(letter => this.guesses.includes(letter));
  }

  getCurrentWord() {
    return this.currentWord;
  }

  getGuesses() {
    return this.guesses;
  }

  guess(letter) {
    if (!this.currentWord.includes(letter)) {
      this.wrongGuesses += 1; 
    }

    this.guesses.push(letter);
  }

  isGameOver() {
    return this.didPlayerLose() || this.didPlayerWin();
  }
  
  numWrongGuesses() {
    return this.wrongGuesses;
  }

  playAgain() {
    this.currentWord = this._getNewWord();
    this.wrongGuesses = 0;
    this.guesses = [];
  }
}

$(function() {
  const APPLE_DURATION = 1000;
  const $button = $("button");
  const $results = $("#results");
  const $repeat = $("#repeat");

  function renderGameResults() {
    if (game.didPlayerWin()) {
      $results.text("You won!");
    } else {
      $results.text("Sorry you lost.");
    }

    if (game.canPlayAgain()) {
      $repeat.text("Play again?");
      $button.toggle(true);
    } else {
      $repeat.text("Sorry there are no words remaining.");
    }
  }
  
  function positionApples() {
    const $apples = $(".apple");
    let numWrong = game.numWrongGuesses();

    $apples.slice(0, numWrong).css({
      top: 477,     // remove magic number
    });
    
    $apples.slice(numWrong).css({
      top: "",
    });
  }

  function positionApples2() {
    // animate falling apple if necessary
    // - count the number of apples with "data-fallen" is "true" 
    // - get the number of wrong guesses
    // - if number of wrong is greater than count of fallen
    //   - get teh first apple with "data-fallen" is "false"
    //   - set "data-fallen" to "true"
    //   - animate to top = 477 in 1000 duration
  }
  
  function renderWordLetters() {
    let $container = $("#word");
    $container.children().slice(1).remove();
    
    let guesses = game.getGuesses();

    game.getCurrentWord().split("").forEach(letter => {
      let div = document.createElement("div");
      div.classList.add("letter");
      if (guesses.includes(letter)) {
        div.textContent = letter;
      }
      $container.append(div);
    });
  }

  function renderGuessLetters() {
    let $container = $("#guesses");
    $container.children().slice(1).remove();

    game.getGuesses().forEach(letter => {
      let div = document.createElement("div");
      div.setAttribute("class", "letter");
      div.textContent = letter;
      $container.append(div);
    });
  }

  function renderGameStatus() {
    positionApples();
    renderWordLetters();
    renderGuessLetters();

    if (game.isGameOver()) {
      renderGameResults();
    }
  }

  document.addEventListener("keyup", function(event) {
    if (event.key.length !== 1 || !/[a-zA-Z]/.test(event.key)) return;

    game.guess(event.key.toUpperCase());
    renderGameStatus();
  });

  $button.on("click", function(event) {
    game.playAgain();
    
    $button.toggle(false); 
    $results.text("");
    $repeat.text("");

    renderGameStatus();
  });

  let game = new Game();
  renderGameStatus();
});


