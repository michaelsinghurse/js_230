$(function() { 
  let templates = {};

  $("script[type='text/x-handlebars']").each((_, element) => {
    let $template = $(element);
    $template.remove();
    templates[$template.attr("id")] = Handlebars.compile($template.html());
  });
  
  function renderPhotoSlides(photos) {
    $("#slides").append(templates["photos"]({ photos }));
  }

  function renderPhotoInformation(photo) {
    $("section > header").append(templates["photo_information"](photo));
  }

  $.ajax({
    url: "/photos",
    method: "GET",
    dataType: "json",
  })
    .done(function(data) {
      renderPhotoSlides(data);
      renderPhotoInformation(data[0]);
    })
    .fail(function() {
      console.log("Fail!");
    });
});
