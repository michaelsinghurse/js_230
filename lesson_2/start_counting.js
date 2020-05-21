// start_counting.js

function startCounting() {
  let count = 1;
  return setInterval(() => {
    console.log(count);
    count += 1;
  }, 1 * 1000);
}

function stopCounting(id) {
  clearInterval(id);
}

let id = startCounting();
setTimeout(() => stopCounting(id), 8 * 1000);
