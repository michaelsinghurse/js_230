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

  bindDeleteButtons() {
    this.$todoList.on("click", "button", this.handleDeleteButtonClick.bind(this));
  },

  handleDeleteButtonClick(event) {
    event.preventDefault();
    let id = $(event.target).closest("li").attr("data-id");
    this.renderDeleteConfirmation(id);
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
    this.renderTodos();
    this.bindDeleteButtons();
  },

  removeOverlay() {
    $("#overlay").remove();
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
      $li.append($("<button>").attr("type", "button").text("Delete"));

      this.$todoList.append($li);
    });
  },
};

$(todoApp.init.bind(todoApp));
