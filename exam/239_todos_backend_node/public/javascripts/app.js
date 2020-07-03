let Client = {
  addTodo(todo) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/todos");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.responseType = "json";

      xhr.addEventListener("load", _event => {
        if (xhr.status === 201) {
          resolve(xhr.response);
        } else {
          reject(new Error("Server could not handle the post request."));
        }
      });

      xhr.send(JSON.stringify(todo));
    });
  },

  deleteTodo(id) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", "api/todos/" + id);

      xhr.addEventListener("load", _event => {
        if (xhr.status === 204) {
          resolve();
        } else {
          reject(new Error("Server could not handle the delete request."));
        }
      });

      xhr.send();
    });
  },

  editTodo(todo) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("PUT", "/api/todos/" + todo.id);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.responseType = "json";

      xhr.addEventListener("load", _event => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error("Server could not handle the put request."));
        }
      });

      xhr.send(JSON.stringify(todo));
    });
  },

  getAllTodos() {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "/api/todos");
      xhr.responseType = "json";

      xhr.addEventListener("load", _event => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error("Server could not handle the get request."));
        }
      });

      xhr.send();
    });
  },
};

let Todos = (function() {
  let todos;

  function addDueDate(todo) {
    if (todo.month && todo.year) {
      todo["due_date"] = todo.month + "/" + todo.year.slice(2);
    } else {
      todo["due_date"] = "No Due Date";
    }
  }

  function addTodo(todo) {
    todos.push(todo);
    todos = sortTodosByDate(todos);
  }

  function makeCopy(object) {
    return JSON.parse(JSON.stringify(object));
  }

  function removeTodo(id) {
    let index = todos.findIndex(todo => todo.id === Number(id));
    todos.splice(index, 1);
  }

  function replaceTodo(updatedTodo) {
    let index = todos.findIndex(todo => todo.id === updatedTodo.id);
    todos.splice(index, 1, updatedTodo);
    todos = sortTodosByDate(todos);
  }

  function sortTodosByCompletion(todos) {
    return todos.sort((todo1, todo2) => {
      if (!todo1.completed && todo2.completed) {
        return -1;
      } else if (todo1.completed && !todo2.completed) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  // Sort order: no due date before due date, year ascending, month
  // ascending, title ASCIIbetical.
  function sortTodosByDate(todos) {
    return todos.sort((todo1, todo2) => {
      if ((!todo1.month && !todo1.year) && (todo2.month && todo2.year)) {
        return -1;
      } else if ((todo1.month && todo1.year) && (!todo2.month && !todo2.year)) {
        return 1;
      } else if (Number(todo1.year) < Number(todo2.year)) {
        return -1;
      } else if (Number(todo1.year) > Number(todo2.year)) {
        return 1;
      } else if (Number(todo1.month) < Number(todo2.month)) {
        return -1;
      } else if (Number(todo1.month) > Number(todo2.month)) {
        return 1;
      } else if (todo1.title < todo2.title) {
        return -1;
      } else if (todo1.title > todo2.title) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  return {
    addTodo(todo) {
      return new Promise((resolve, reject) => {
        Client.addTodo(todo)
          .then(newTodo => {
            addDueDate(newTodo);
            addTodo(newTodo);
            resolve();
          })
          .catch(error => reject(error));
      });
    },

    deleteTodo(id) {
      return new Promise((resolve, reject) => {
        Client.deleteTodo(id)
          .then(() => {
            removeTodo(id);
            resolve();
          })
          .catch(error => reject(error));
      });
    },

    editTodo(todo) {
      return new Promise((resolve, reject) => {
        Client.editTodo(todo)
          .then(updatedTodo => {
            addDueDate(updatedTodo);
            replaceTodo(updatedTodo);
            resolve();
          })
          .catch(error => reject(error));
      });
    },

    getAllTodos() {
      return makeCopy(todos);
    },

    getAllTodosByDate() {
      return  this.getAllTodos().reduce((object, todo) => {
        let dueDate = todo.due_date;
        object[dueDate] = object[dueDate] || [];
        object[dueDate].push(makeCopy(todo));
        return object;
      }, {});
    },

    getDoneTodos() {
      return makeCopy(todos.filter(todo => todo.completed));
    },

    getDoneTodosByDate() {
      return this.getDoneTodos().reduce((object, todo) => {
        let dueDate = todo.due_date;
        object[dueDate] = object[dueDate] || [];
        object[dueDate].push(makeCopy(todo));
        return object;
      }, {});
    },

    getTodo(id) {
      return makeCopy(todos.find(todo => todo.id === Number(id)));
    },

    getTodosByCompletionAndDate(done, dueDate) {
      let todos;

      if (!done && !dueDate) {
        todos = this.getAllTodos();
      } else if (!done && dueDate) {
        todos = this.getAllTodosByDate()[dueDate] || [];
      } else if (done && !dueDate) {
        todos = this.getDoneTodos();
      } else {
        todos = this.getDoneTodosByDate()[dueDate] || [];
      }

      return sortTodosByCompletion(todos);
    },

    init() {
      return new Promise((resolve, reject) => {
        Client.getAllTodos()
          .then(todosArr => {
            todosArr.forEach(todo => addDueDate(todo));
            todos = sortTodosByDate(todosArr);
            resolve();
          })
          .catch(error => reject(error));
      });
    },

    markDone(id) {
      return new Promise((resolve, reject) => {
        let todo = { id, completed: true };
        this.editTodo(todo)
          .then(() => resolve())
          .catch(error => reject(error));
      });
    },

    toggleDone(id) {
      return new Promise((resolve, reject) => {
        let isDone = todos.find(todo => todo.id === Number(id)).completed;
        let todo = { id, completed: !isDone };
        this.editTodo(todo)
          .then(() => resolve())
          .catch(error => reject(error));
      });
    },
  };
})();

let App = {
  templates: {},

  addActiveClass(todoGroup) {
    let done      = todoGroup.done;
    let dueDate   = todoGroup.dueDate;
    let $element;

    if (!done) {
      if (!dueDate) {
        $element = $("#all_header");
      } else {
        $element = $(`#all_lists dl[data-title='${dueDate}']`);
      }
    } else if (!dueDate) {
      $element = $("#all_done_header");
    } else {
      $element = $(`#completed_lists dl[data-title='${dueDate}']`);
    }

    $element.addClass("active");
  },

  addTodo(values) {
    let todoGroup = { done: false, dueDate: "" };

    Todos.addTodo(values)
      .then(() => {
        this.renderPage(todoGroup);
      })
      .catch(error => {
        console.log(error);
      });
  },

  bindListeners() {
    $("#all_todos, #completed_todos").on("click", this.handleSidebarClick.bind(this));
    $("#sidebar article dl").on("click", this.handleSidebarClick.bind(this));
    $("label[for='new_item']").on("click", this.handleAddTodoClick.bind(this));
    $("#modal_layer").on("click", this.hideModalLayerAndForm.bind(this));
    $("#form_modal form").on("submit", this.handleFormModalSubmit.bind(this));
    $("#form_modal button[name='complete']").on(
      "click",
      this.handleFormModalCompleteButton.bind(this));
    $("#items table td label").on("click", this.handleTodoLabelClick.bind(this));
    $("#items td.delete").on("click", this.handleDeleteTodoClick.bind(this));
    $("#items td.list_item").on("click", this.handleTodoClick.bind(this));
  },

  compileHtmlTemplates() {
    let $templates = $("[type='text/x-handlebars']");

    $templates.each((_, element) => {
      let $template = $(element);
      let id = $template.attr("id");

      if ($template.attr("data-type") === "partial") {
        Handlebars.registerPartial(id, $template.html());
      } else {
        this.templates[id] = Handlebars.compile($template.html());
      }
    });
  },

  displayEditForm(todo) {
    $("#form_modal").toggle(true);
    let $form = $("#form_modal").find("form");

    $form.attr("data-action", "edit").attr("data-id", todo.id);

    $form.find("[name='title']").val(todo.title);
    $form.find("[name='description']").val(todo.description);

    if (todo.day) {
      let $options = $form.find("[name='due_day']").children();
      let value = $options.eq(Number(todo.day)).val();
      $form.find("[name='due_day']").val(value);
    }

    if (todo.month) {
      let $options = $form.find("[name='due_month']").children();
      let value = $options.eq(Number(todo.month)).val();
      $form.find("[name='due_month']").val(value);
    }

    if (todo.year) {
      $form.find("[name='due_year']").val(todo.year);
    }
  },

  displayModalLayer() {
    $("#modal_layer").toggle(true);
  },

  editTodo(values) {
    let todoGroup = this.getCurrentTodoGroup();

    Todos.editTodo(values)
      .then(() => {
        this.renderPage(todoGroup);
      })
      .catch(error => {
        console.log(error);
      });
  },

  formatFormValuesInPlace(object) {
    Object.keys(object).forEach(key => {
      let newKey;

      if (key === "title" || key === "description") {
        object[key] = object[key].trim();
      } else if (key === "due_day" || key === "due_month") {
        newKey = key.replace("due_", "");
        object[newKey] = /^\d{2}$/.test(object[key]) ? object[key] : "";
        delete object[key];
      } else if (key === "due_year") {
        newKey = key.replace("due_", "");
        object[newKey] = /^\d{4}$/.test(object[key]) ? object[key] : "";
        delete object[key];
      }
    });
  },

  getCurrentTodoGroup() {
    let $active = $("#sidebar .active");
    return this.getTodoGroup($active.get(0));
  },

  getTodoGroup(element) {
    let todoGroup = {};
    let $element = $(element);
    let title = $element.attr("data-title");

    if (title === "All Todos") {
      todoGroup.done = false;
      todoGroup.dueDate = "";
    } else if (title === "Completed") {
      todoGroup.done = true;
      todoGroup.dueDate = "";
    } else {
      let id = $element.closest("article").attr("id");
      todoGroup.done = id === "completed_lists";
      todoGroup.dueDate = title;
    }

    return todoGroup;
  },

  handleAddTodoClick(_event) {
    this.displayModalLayer();

    $("#form_modal").toggle(true);
    $("#form_modal").find("form").attr("data-action", "add");
  },

  handleDeleteTodoClick(event) {
    event.stopPropagation();

    let id = $(event.target).closest("tr").attr("data-id");
    let todoGroup = this.getCurrentTodoGroup();

    Todos.deleteTodo(id)
      .then(() => {
        this.renderPage(todoGroup);
      })
      .catch(error => {
        console.log(error);
      });
  },

  handleFormModalCompleteButton(event) {
    event.preventDefault(); // submits the form by default
    let $form = $(event.target).closest("form");

    if ($form.attr("data-action") === "add") {
      alert("You must first save the todo before marking it complete.");
      return;
    }

    let id = $form.attr("data-id");
    let todoGroup = this.getCurrentTodoGroup();

    Todos.markDone(id)
      .then(() => {
        this.renderPage(todoGroup);
      })
      .catch(error => {
        console.log(error);
      });
  },

  handleFormModalSubmit(event) {
    event.preventDefault();
    let $form = $(event.target);
    let values = this.serializeArrayToObject($form.serializeArray());
    this.formatFormValuesInPlace(values);

    if (values.title.length < 3) {
      alert("The title of the todo must be at least 3 characters long.");
      return;
    }

    if ($form.attr("data-action") === "add") {
      this.addTodo(values);
    } else if ($form.attr("data-action") === "edit") {
      values.id = $form.attr("data-id");
      this.editTodo(values);
    }
  },

  handleSidebarClick(event) {
    let cTarget = event.currentTarget;
    let element;

    if (cTarget.id === "all_todos" || cTarget.id === "completed_todos") {
      element = cTarget.querySelector("header");
    } else {
      element = cTarget;
    }

    let todoGroup = this.getTodoGroup(element);
    this.renderPage(todoGroup);
  },

  handleTodoClick(event) {
    let id = $(event.target).closest("tr").attr("data-id");
    let todoGroup = this.getCurrentTodoGroup();

    Todos.toggleDone(id)
      .then(() => {
        this.renderPage(todoGroup);
      })
      .catch(error => {
        console.log(error);
      });
  },

  handleTodoLabelClick(event) {
    event.preventDefault(); // otherwise the todo is given a strikethrough
    event.stopPropagation(); // otherwise triggers td.list_item click

    let id = $(event.target).closest("tr").attr("data-id");
    let todo = Todos.getTodo(id);

    this.displayModalLayer();
    this.displayEditForm(todo);
  },

  hideModalLayerAndForm(_event) {
    $("#modal_layer").toggle(false);
    $("#form_modal").toggle(false);
    let $form = $("#form_modal").find("form");
    $form.attr("data-action", "");
    $form.get(0).reset();
  },

  init() {
    this.compileHtmlTemplates();

    let todoGroup = { done: false, dueDate: "" };

    Todos.init()
      .then(() => {
        this.renderPage(todoGroup);
      })
      .catch(error => {
        console.log(error);
      });
  },

  insertHtml(todoGroup) {
    let done            = todoGroup.done;
    let dueDate         = todoGroup.dueDate;
    let todos           = Todos.getAllTodos();
    let doneTodos       = Todos.getDoneTodos();
    let todosByDate     = Todos.getAllTodosByDate();
    let doneTodosByDate = Todos.getDoneTodosByDate();
    let selected        = Todos.getTodosByCompletionAndDate(done, dueDate);

    let currentSection = {};
    if (done) {
      currentSection.title = dueDate ? dueDate : "Completed";
    } else {
      currentSection.title = dueDate ? dueDate : "All Todos";
    }
    currentSection.data = selected.length;

    $("body").html(this.templates.main_template({
      todos,
      done: doneTodos,
      todos_by_date: todosByDate,
      done_todos_by_date: doneTodosByDate,
      selected,
      current_section: currentSection,
    }));
  },

  makeActiveClass(element) {
    let $currentActive = $("#sidebar .active");
    if ($currentActive.length) {
      $currentActive.removeClass("active");
    }

    $(element).addClass("active");
  },

  renderPage(todoGroup) {
    this.insertHtml(todoGroup);
    this.bindListeners();
    this.addActiveClass(todoGroup);
  },

  serializeArrayToObject(array) {
    return array.reduce((object, pair) => {
      object[pair.name] = pair.value;
      return object;
    }, {});
  },
};

$(App.init.bind(App));


