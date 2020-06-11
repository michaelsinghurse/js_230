$(function() {
  let $blinds = $("[id^='blind']");

  function runAnimation() {
    const DELAY = 1500;
    const SPEED = 250;

    $blinds.each((index, element) => {
      let $blind = $(element);
      let delay = index * (DELAY + SPEED);

      $blind.delay(delay).animate({
        height: 0,
        top: "+=" + $blind.height(), 
      }, SPEED);
    });
  }

  $("button").on("click", function(_unusedEvent) {
    $blinds.finish();
    $blinds.removeAttr("style");

    runAnimation(); 
  });

  runAnimation();
});
