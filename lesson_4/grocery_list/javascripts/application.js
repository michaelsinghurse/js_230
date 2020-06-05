$(function() {
  let $item = $("#item");
  let $quantity = $("#quantity");

  $item.focus();

  $("form").submit(function(event) {
    event.preventDefault();

    let li = document.createElement("li");
    li.textContent = `${$quantity.val() || "1"} ${$item.val()}`;
    
    $("ul").append(li); 

    this.reset();
    $item.focus();
  });
});
