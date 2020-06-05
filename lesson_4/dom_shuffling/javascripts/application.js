$(function() {
  $("body").prepend($("body").children("header")); 
  $("body").children("header").prepend($("main").children("h1"));
  let $figure1 = $("figure").get(0);
  let $figure2 = $("figure").get(1);
  let $image1 = $("img").get(0);
  let $image2 = $("img").get(1);

  $figure1.prepend($image2);
  $figure2.prepend($image1);

  $("article").append($figure1, $figure2);
});
