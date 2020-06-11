$(function() {
  const GAMES = [
    {
      "title": "The Legend of Zelda: Majora's Mask 3D",
      "id": 1,
      "category": "Nintendo 3DS"
    }, {
      "title": "Super Smash Bros.",
      "id": 2,
      "category": "Nintendo 3DS"
    }, {
      "title": "Super Smash Bros.",
      "id": 3,
      "category": "Nintendo WiiU"
    }, {
      "title": "LEGO Batman 3: Beyond Gotham",
      "id": 4,
      "category": "Nintendo WiiU"
    }, {
      "title": "LEGO Batman 3: Beyond Gotham",
      "id": 5,
      "category": "Xbox One"
    }, {
      "title": "LEGO Batman 3: Beyond Gotham",
      "id": 6,
      "category": "PlayStation 4"
    }, {
      "title": "Far Cry 4",
      "id": 7,
      "category": "PlayStation 4"
    }, {
      "title": "Far Cry 4",
      "id": 8,
      "category": "Xbox One"
    }, {
      "title": "Call of Duty: Advanced Warfare",
      "id": 9,
      "category": "PlayStation 4"
    }, {
      "title": "Call of Duty: Advanced Warfare",
      "id": 10,
      "category": "Xbox One"
    }
  ];
  
  function renderForm() {
    let categories = GAMES.reduce((results, game) => {
      if (!results.includes(game["category"])) {
        results.push(game["category"]);
      }
      return results;
    }, []);

    let $categoryList = $("form ul");

    categories.forEach(category => {
      let li = document.createElement("li");

      let input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.setAttribute("id", category);
      input.setAttribute("name", category);
      input.setAttribute("checked", true);
      li.appendChild(input);

      let label = document.createElement("label");
      label.setAttribute("for", category);
      label.textContent = category;
      li.appendChild(label);
      
      $categoryList.append(li);
    });
  }
  
  function renderGamesList() {
    let $div = $("section div");
    let gamesList = document.createElement("ul");

    GAMES.forEach(game => {
      let li = document.createElement("li");
      li.setAttribute("data-id", game["id"]);
      li.textContent = `${game["title"]} for ${game["category"]}`;
      gamesList.appendChild(li);
    });

    $div.append(gamesList);
  }

  $("form").on("change", function(event) {
    let category = event.target.name;
    let checked = event.target.checked;

    let ids = GAMES
      .filter(game => game["category"] === category)
      .map(game => game.id);

    ids.forEach(id => $(`[data-id=${id}]`).toggle(checked));
  });

  renderForm();
  renderGamesList();
});


