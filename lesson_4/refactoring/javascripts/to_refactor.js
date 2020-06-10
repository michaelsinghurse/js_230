$(function() {
  $("nav a").on("mouseenter", function() {
    $(this).next("ul").addClass("visible");
  });

  $("nav").on("mouseleave", function() {
    $(this).find("ul ul").removeClass("visible");
  });

  $(".button, button").on("click", function(e) {
    e.preventDefault();

    $(this).addClass("clicked");
  });

  $(".toggle").on("click", function(e) {
    e.preventDefault();
    $(this).next(".accordion").toggleClass("opened");
  });
  
  function sumOfEvenAndOddDigits(cc_number) {
    let odd_total = 0;
    let even_total = 0;

    cc_number = cc_number.split("").reverse();
    for (var i = 0, len = cc_number.length; i < len; i++) {
      if (i % 2 == 1) {
        cc_number[i] = (+cc_number[i] * 2) + "";
        if (cc_number[i].length > 1) {
          cc_number[i] = +cc_number[i][0] + +cc_number[i][1];
        }
        else {
          cc_number[i] = +cc_number[i];
        }
        odd_total += cc_number[i];
      }
      else {
        even_total += +cc_number[i];
      }
    }

    return { odd_total, even_total };
  }
  

  $("form").on("submit", function(e) {
    e.preventDefault();

    let cc_number = $(this).find("[type=text]").val();
    let isValidNum;

    if (cc_number === "" || Number.isNaN(Number(cc_number))) {
      isValidNum = false;
    } else {
      let { odd_total, even_total } = sumOfEvenAndOddDigits(cc_number);
      
      isValidNum = (odd_total + even_total) % 10 === 0;
    }

    $(this).find(".success").toggle(isValidNum);
    $(this).find(".error").toggle(!isValidNum);
  });

  $("ul a").on("click", function(e) {
    e.preventDefault();

    let month = $(this).text();
    let $stone = $("#birthstone");
  
    const MONTH_TO_STONE = { 
      January: "garnet",
      February: "amethyst",
      March: "bloodstone",
      April: "diamond",
      May: "emerald",
      June: "pearl, moonstone, or alexandrite",
      July: "ruby",
      August: "peridot",
      September: "sapphire",
      October: "opal or tourmaline",
      November: "topaz or citrine",
      December: "turquoise, zircon, or tanzanite",
    };

    $stone.text(`Your birthstone is ${MONTH_TO_STONE[month]}`);
  });
});
