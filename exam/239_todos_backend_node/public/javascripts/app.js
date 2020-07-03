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
          reject("Server could not handle the post request.");
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
          reject("Server could not handle the delete request.");
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
          reject("Server could not handle the put request.");
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
          reject("Server could not handle the get request.");
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

  function sortTodosByDate(todos) {
    // sort order: no due date before due date, year ascending, month 
    // ascending, title ASCIIbetical.
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
        let due_date = todo.due_date;
        object[due_date] = object[due_date] || [];
        object[due_date].push(makeCopy(todo));
        return object;
      }, {});
    },

    getDoneTodos() {
      return makeCopy(todos.filter(todo => todo.completed));
    },

    getDoneTodosByDate() {
      return this.getDoneTodos().reduce((object, todo) => {
        let due_date = todo.due_date;
        object[due_date] = object[due_date] || [];
        object[due_date].push(makeCopy(todo));
        return object;
      }, {});
    },
      
    getTodo(id) {
      return makeCopy(todos.find(todo => todo.id === Number(id)));
    },

    getTodosByCompletionAndDate(done, due_date) {
      let todos;

      if (!done && !due_date) {
        todos = this.getAllTodos();
      } else if (!done && due_date) {
        todos = this.getAllTodosByDate()[due_date] || [];
      } else if (done && !due_date) {
        todos = this.getDoneTodos();
      } else {
        todos = this.getDoneTodosByDate()[due_date] || [];
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
    let due_date  = todoGroup.due_date;
    let $element;

    if (!done) {
      if (!due_date) {
        $element = $("#all_header");
      } else {
        $element = $(`#all_lists dl[data-title='${due_date}']`);
      }
    } else {
      if (!due_date) {
        $element = $("#all_done_header"); 
      } else {
        $element = $(`#completed_lists dl[data-title='${due_date}']`);
      }
    }
    
    $element.addClass("active");
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
  
  displayModalLayer() {
    $("#modal_layer").toggle(true);
  },
  
  formatFormValuesInPlace(object) {
    Object.keys(object).forEach(key => {
      let newKey;

      switch(key) {
        case "title":
        case "description":
          object[key] = object[key].trim();
          break;
        case "due_day":
        case "due_month":
          newKey = key.replace("due_", "");
          object[newKey] = /^\d{2}$/.test(object[key])
            ? object[key]
            : "";
          delete object[key];
          break;
        case "due_year":
          newKey = key.replace("due_", "");
          object[newKey] = /^\d{4}$/.test(object[key])
            ? object[key]
            : "";
          delete object[key];
          break;
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
      todoGroup.due_date = "";
    } else if (title === "Completed") {
      todoGroup.done = true;
      todoGroup.due_date = "";
    } else {
      let id = $element.closest("article").attr("id");
      todoGroup.done = id === "completed_lists"; 
      todoGroup.due_date = title;
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

    let todoGroup;

    if ($form.attr("data-action") === "add") {
      todoGroup = { done: false, due_date: "" };

      Todos.addTodo(values)
      .then(() => {
        this.renderPage(todoGroup);
      })
      .catch(error => {
        console.log(error);
      });
    } else if ($form.attr("data-action") === "edit") {
      todoGroup = this.getCurrentTodoGroup();

      values.id = $form.attr("data-id");

      Todos.editTodo(values)
      .then(() => {
        this.renderPage(todoGroup);
      })
      .catch(error => {
        console.log(error);
      });
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

    $("#form_modal").toggle(true);
    let $form = $("#form_modal").find("form");

    $form.attr("data-action", "edit");
    $form.attr("data-id", id);

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

  hideModalLayerAndForm(_event) {
    $("#modal_layer").toggle(false);
    $("#form_modal").toggle(false);
    let $form = $("#form_modal").find("form");
    $form.attr("data-action", "");
    $form.get(0).reset();
  },
  
  init() {
    this.compileHtmlTemplates();
    
    let todoGroup = { done: false, due_date: "" };

    Todos.init()
    .then(() => {
      this.renderPage(todoGroup);
    })
    .catch(error => {
      console.log(error);
    });
  },
  
  insertHtml(todoGroup) {
    let done                = todoGroup.done;
    let due_date            = todoGroup.due_date;
    let todos               = Todos.getAllTodos();
    let done_todos          = Todos.getDoneTodos();
    let todos_by_date       = Todos.getAllTodosByDate();
    let done_todos_by_date  = Todos.getDoneTodosByDate();
    let selected            = Todos.getTodosByCompletionAndDate(done, due_date);
    
    let current_section = {};
    if (done) {
      current_section.title = due_date ? due_date : "Completed";
    } else {
      current_section.title = due_date ? due_date : "All Todos";
    }
    current_section.data = selected.length;

    $("body").html(this.templates.main_template({ 
      todos,
      done: done_todos,
      todos_by_date,
      done_todos_by_date,
      selected, 
      current_section,
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


