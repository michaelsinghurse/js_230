// randomizer.js

function callback1() {
  console.log('callback1');
}

function callback2() {
  console.log('callback2');
}

function callback3() {
  console.log('callback3');
}

function callback4() {
  console.log("callback4");
}

function callElementEverySecond(array) {
  let counter = 1;
  let max = array.length - 1;

  function callElement() {
    if (counter <= max) {
      setTimeout(() => {
        console.log(counter);
        if (array[counter] !== undefined) {
          array[counter]();
        }
        counter += 1;
        callElement();
      }, 1 * 1000);
    }
  }

  callElement();
}

function randomizer(...callbacks) {
  let array = [];
  array.length = callbacks.length * 2 + 1;
  
  while (callbacks.length) {
    let randomIndex = Math.ceil(Math.random() * callbacks.length * 2);
    if (!array[randomIndex]) {
      array[randomIndex] = callbacks.pop();
    }
  }

  callElementEverySecond(array);
}

randomizer(callback1, callback2, callback3, callback4);


