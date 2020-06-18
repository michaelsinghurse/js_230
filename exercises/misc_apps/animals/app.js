$(function() {
  const WAIT = 2 * 1000;
  let timeoutId;

  let $animals = $("#animals");
  
  function toggleTooltip(img, visible) {
    $(img).next().toggle(visible);
  }

  $animals.on("mouseover", "img", function(event) {
    timeoutId = setTimeout(() => toggleTooltip(this, true), WAIT);
  });

  $animals.on("mouseleave", "img", function(event) {
    clearTimeout(timeoutId);
    toggleTooltip(this, false);
  });
});
