$(function() {
  const FADE_DURATION = 300;
  const SELECTED = "selected";
  let $photos = $("figure img");
  let $thumbnails = $("ul img"); 
  let $arrows = $("#left_arrow, #right_arrow");

  function currentlySelectedThumbnail() {
    let $selected = $thumbnails.filter(`[class~='${SELECTED}']`); 
    return $thumbnails.index($selected);
  }

  function changeSelectedThumbnail(oldIndex, newIndex) {
    $thumbnails.eq(oldIndex).removeClass(SELECTED);
    $thumbnails.eq(newIndex).addClass(SELECTED);
  }

  function changeDisplayedPhoto(oldIndex, newIndex) {
    $photos.eq(oldIndex).fadeOut(FADE_DURATION, () => {
      $photos.eq(newIndex).fadeIn(FADE_DURATION);
    });
  }

  function handleNewThumbnailSelected(index) {
    let currentIndex = currentlySelectedThumbnail();
    changeSelectedThumbnail(currentIndex, index);
    changeDisplayedPhoto(currentIndex, index);
  }

  function debounce(func, delay) {
    let timeout;
    return function() {
      let args = arguments;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(null, args);
      }, delay);
    };
  }

  let throttleHNTS = debounce(handleNewThumbnailSelected, FADE_DURATION);
  
  $thumbnails.on("click", function(event) {
    throttleHNTS($(this).parent().index());
  });

  $arrows.on("click", function(event) {
    let increment = this.id.includes("right") ? 1 : -1;
    let newIndex = currentlySelectedThumbnail() + increment;

    if (newIndex < 0) {
      newIndex = $thumbnails.length - 1;
    } else if (newIndex > $thumbnails.length - 1) {
      newIndex = 0;
    }

    throttleHNTS(newIndex);
  });
});
