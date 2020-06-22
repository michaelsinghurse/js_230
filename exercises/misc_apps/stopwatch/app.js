let stopwatch = {
  bindEventListeners() {
    document.getElementById("startStop").addEventListener(
      "click",
      this.handleStartStopClick.bind(this));
    
    document.getElementById("reset").addEventListener(
      "click",
      this.handleResetClick.bind(this));
  },
  
  handleResetClick(event) {
    this.time = 0;
    this.renderTime();
  },

  handleStartStopClick(event) {
    if (event.target.className ==="start") {
      event.target.className = "stop";
      event.target.textContent = "Stop";
      this.startTimer();
    } else {
      event.target.className = "start";
      event.target.textContent = "Start";
      this.stopTimer();
    }
  },
  
  incrementTime() {
    this.time += 1;
  },

  init(initialTime = 0) {
    this.time = initialTime;
    this.intervalId = null;
    this.bindEventListeners();
    this.renderTime();
  },
  
  pad(num) {
    let numString = String(num);
    return numString.length === 1 ? "0" + numString : numString;
  },

  renderTime() {
    let hrs = Math.floor(this.time / 360000);
    let remainder = this.time % 360000;
    let min = Math.floor(remainder / 6000);
    remainder = remainder % 6000;
    let sec = Math.floor(remainder / 100);
    let cs = remainder % 100;
    
    let time;

    if (hrs > 0) {
      time = this.pad(hrs) + ":" + this.pad(min) + ":" + this.pad(sec);
    } else {
      time = this.pad(min) + ":" + this.pad(sec) + ":" + this.pad(cs);
    }

    document.getElementById("clock").textContent = time;
  },

  startTimer() {
    this.intervalId = setInterval(() => {
      this.incrementTime();
      this.renderTime();
    }, 10);
  },

  stopTimer() {
    clearInterval(this.intervalId);
  },
};

document.addEventListener("DOMContentLoaded", _unusedEvent => {
  stopwatch.init(359000);
});
