$(function() {
  const SHAPE_SIZE = 50;
  const MAX_Y = $("#canvas").height() - SHAPE_SIZE;
  const MAX_X = $("#canvas").width() - SHAPE_SIZE;
 
  function serializeArrayToObject(array) {
    return array.reduce((output, object) => {
      output[object.name] = object.value;
      return output;
    }, {});
  }

  function areValidSelections(selections) {
    let startX = Number(selections["start-x"]);
    let startY = Number(selections["start-y"]);
    let endX = Number(selections["end-x"]);
    let endY = Number(selections["end-y"]);
   
    const isInvalid = (number, max) => {
      return Number.isNaN(number) || number < 0 || number > max; 
    };

    if (
      isInvalid(startX, MAX_X)  ||
      isInvalid(startY, MAX_Y) ||
      isInvalid(endX, MAX_X)    ||
      isInvalid(endY, MAX_Y)
    ) {
      return false
    }

    return true;
  }

  $("form").on("submit", function(event) {
    event.preventDefault();
    
    let selections = serializeArrayToObject($(this).serializeArray());
   
    if (!areValidSelections(selections)) {
      alert(`The x value must be between 0 and ${MAX_X}, and ` + 
            `the y value must be between 0 and ${MAX_Y}.`);
      return;
    }

    let div = document.createElement("div");
    div.classList.add("shapes");
    div.classList.add(selections.shape);

    div.setAttribute("data-start-x", selections["start-x"]);
    div.setAttribute("data-start-y", selections["start-y"]);
    div.setAttribute("data-end-x",  selections["end-x"]);
    div.setAttribute("end-end-y", selections["end-y"]);
   
    div.style.top = `${selections["start-y"]}px`;
    div.style.left = `${selections["start-x"]}px`;

    $("#canvas").append(div);
    this.reset();
  });

  $("#start").on("click", function(event) {
    let $shapes = $(".shape");
    // stop all animations and cancel future animations
    // return each shape to it's start-x and start-y positions
    // start animations
    //  - animate to left = end-x and top = end-y
    //  - duration = 1000
  });

  $("#stop").on("click", function(event) {
    let $shapes = $(".shape");
    // stop all animations in their current location
  });
});
