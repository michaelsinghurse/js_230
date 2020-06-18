let todo_items = [
  { id: 1, title: 'Homework' },
  { id: 2, title: 'Shopping' },
  { id: 3, title: 'Calling Mom' },
  { id: 4, title: 'Coffee with John '}
];

let todoApp = {
  addOverlay() {
    let $overlay = $("<div id=overlay></div>");

    $overlay.on("click", this.handleOverlayClick.bind(this));

    $("body").append($overlay);
  },

  bindTodoEvents() {
    this.$todoList.on("contextmenu", "li", this.handleTodoClick.bind(this));
  },

  handleContextMenuClick(event) {

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

  handleTodoClick(event) {
    event.preventDefault();
    let id = $(event.target).closest("li").attr("data-id");
    let position = {
      top: event.clientY,
      left: event.clientX,
    };
    this.renderContextMenu(id, position);
  },

  init() {
    this.todos = todo_items;
    this.$todoList = $("ul");
    this.renderTodos();
    this.bindTodoEvents();
  },

  removeOverlay() {
    $("#overlay").remove();
  },

  renderContextMenu(id, position) {
    let $menu = $(`<div data-id=${id} id=contextMenu></div>`);
    $menu.css(position);
    $menu.append($("<div data-menu-action=details>Show Details</div>"));
    $menu.append($("<div data-menu-action=edit>Edit Todo</div>"));
    $menu.append($("<div data-menu-action=delete>Delete Todo</div>"));
    
    $menu.on("click", this.handleContextMenuClick.bind(this));

    $("body").append($menu);
  },

  renderDeleteConfirmation(id) {
    let $div = $(`<div data-id=${id} id=deleteConfirm></div>`);
    $div.append($("<h3>").text("Confirmation"));
    $div.append($("<p>").text(`Are you sure you want to delete this todo?`));
    $div.append($("<button>").attr("type", "button").text("Yes"));
    $div.append($("<button>").attr("type", "button").text("No"));

    $("main").append($div);
    $div.on("click", "button", this.handleDeleteConfirmClick.bind(this));  

    this.addOverlay();
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
