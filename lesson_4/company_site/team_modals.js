$(function() {
  let $modals = $(".modal");
  let $overlays = $(".overlay");
  let FADE_DURATION = 600;

  $("#team li > a").click(function(event) {
    event.preventDefault();

    let $overlay = $(event.target).closest("a").siblings(".overlay");
    $overlay.fadeToggle(FADE_DURATION); 
    
    let $modal = $overlay.children(".modal");
    $modal.fadeToggle(FADE_DURATION); 
  });
  
  $overlays.click(function(event) {
    $(this).fadeToggle(FADE_DURATION);
    $(this).children(".modal").fadeToggle(FADE_DURATION);
  });

  $modals.click(function(event) {
    event.stopPropagation();
    let $modal = $(this);
    if (event.target === $modal.children("a").get(0)) {
      event.preventDefault();
      $modal.fadeToggle(FADE_DURATION);
      $modal.parent(".overlay").fadeToggle(FADE_DURATION);
    }
  });

  document.addEventListener("keyup", function(event) {
    if (event.key === "Escape") {
      let $overlay = $overlays.filter((_, element) => {
        return $(element).css("display") !== "none"; 
      });
      $overlay.trigger("click");
    }
  });
});
