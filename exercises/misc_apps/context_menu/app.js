let todo_items = [
  { id: 1, title: 'Homework' },
  { id: 2, title: 'Shopping' },
  { id: 3, title: 'Calling Mom' },
  { id: 4, title: 'Coffee with John '}
];

let todoApp = {
  bindListeners() {
    this.$todoList.on("contextmenu", "li", this.handleContextMenuClick.bind(this));
    $("body").on("click", this.handleBodyClick.bind(this));
  },
  
  handleBodyClick(event) {
    this.removeContextMenu();
  },

  handleContextMenuClick(event) {
    event.preventDefault();
    
    this.removeContextMenu();

    let id = $(event.target).closest("li").attr("data-id");
    let position = {
      top: event.clientY,
      left: event.clientX,
    };
    this.renderContextMenu(id, position);
  },

  handleContextMenuSelection(event) {
    event.preventDefault();
    
    let $menuItem = $(event.target);
    let id = $menuItem.parents("#contextMenu").attr("data-id");
    let action = $menuItem.attr("data-menu-action");
    
    switch (action) {
      case "details":
        break;
      case "edit":
        break;
      case "delete":
        this.renderDeleteConfirmation(id);
        break;
    }
  },

  handleDeleteConfirmClick(event) {
    event.preventDefault();
    event.stopPropagation();

    let $confirmBox = $(event.target).closest("div");
    let id = $confirmBox.attr("data-id");

    if ($(event.target).text() === "Yes") {
      $(`li[data-id=${id}]`).remove();
    }

    $confirmBox.remove();
    this.removeOverlay();
  },

  handleOverlayClick(event) {
    let $overlay = $("#overlay");
    let $confirmBox = $("#deleteConfirm");

    if (!$.contains($confirmBox.get(0), event.target)) {
      $overlay.remove();
      $confirmBox.remove();
    }
  },

  init() {
    this.todos = todo_items;
    this.$todoList = $("ul");
    this.$contextMenu = null;
    this.renderTodos();
    this.bindListeners();
  },
  
  removeContextMenu() {
    if (this.$contextMenu) {
      this.$contextMenu.remove();
      this.$contextMenu = null;
    }
  },

  removeOverlay() {
    $("#overlay").remove();
  },

  renderContextMenu(id, position) {
    this.$contextMenu = $(`<div data-id=${id} id=contextMenu></div>`);
    this.$contextMenu.css(position);
    this.$contextMenu.append($("<div data-menu-action=details>Show Details</div>"));
    this.$contextMenu.append($("<div data-menu-action=edit>Edit Todo</div>"));
    this.$contextMenu.append($("<div data-menu-action=delete>Delete Todo</div>"));
    
    this.$contextMenu.on("click", this.handleContextMenuSelection.bind(this));

    $("body").append(this.$contextMenu);
  },

  renderDeleteConfirmation(id) {
    let $div = $(`<div data-id=${id} id=deleteConfirm></div>`);
    $div.append($("<h3>").text("Confirmation"));
    $div.append($("<p>").text(`Are you sure you want to delete this todo?`));
    $div.append($("<button>").attr("type", "button").text("Yes"));
    $div.append($("<button>").attr("type", "button").text("No"));

    $("main").append($div);
    $div.on("click", "button", this.handleDeleteConfirmClick.bind(this));  

    this.renderOverlay();
  },

  renderOverlay() {
    let $overlay = $("<div id=overlay></div>");

    $overlay.on("click", this.handleOverlayClick.bind(this));

    $("body").append($overlay);
  },

  renderTodos() {
    this.todos.forEach(todo => {
      let $li = $(`<li data-id=${todo.id}></li>`);
      $li.append($("<h2>").text(todo.title));

      this.$todoList.append($li);
    });
  },
};

$(todoApp.init.bind(todoApp));
