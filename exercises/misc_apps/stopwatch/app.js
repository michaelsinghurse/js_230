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
    console.log("reset button clicked!");
  },

  handleStartStopClick(event) {
    if (event.target.className ==="start") {
      console.log("start clicked!");
      event.target.className = "stop";
    } else {
      console.log("stop clicked!");
      event.target.className = "start";
    }
  },

  init() {
    this.time = 0;
    this.intervalId = null;
    this.bindEventListeners();
    this.renderTime();
  },

  renderTime() {
    document.getElementById("clock").textContent = "01:23:45:67";
  }
};

document.addEventListener("DOMContentLoaded", _unusedEvent => {
  stopwatch.init();
});
