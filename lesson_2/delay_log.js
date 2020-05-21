// delay_log.js

function delayLog() {
  function logAfterOneSecond(item) {
    if (item > 10) return;
    setTimeout(() => {
      console.log(item);
      item += 1;
      logAfterOneSecond(item);
    }, 1000);
  }

  logAfterOneSecond(1);
}

delayLog();
