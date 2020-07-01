let Client = {
  addTodo(todo) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/todos");
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.addEventListener("load", _event => {
        if (xhr.status === 201) {
          resolve(xhr.response);
        } else {
          reject("Error posting todo to server.");
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
          reject("Error getting todos from server.");
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
      todo["due_date"] = todo.month + "/" + todo.year;
    } else {
      todo["due_date"] = "No Due Date";
    }
  }

  function makeCopy(object) {
    return JSON.parse(JSON.stringify(object));
  }
  
  return {
    addTodo(todo) {
      return new Promise((resolve, reject) => {
        Client.addTodo(todo)
        .then(newTodo => {
          addDueDate(newTodo);
          todos.push(newTodo);
          resolve();
        })
        .catch(error => reject(error));
      });
    },

    init() {
      return new Promise((resolve, reject) => {
        Client.getAllTodos()
        .then(todosArr => {
          todosArr.forEach(todo => addDueDate(todo));
          todos = todosArr;
          resolve();
        })
        .catch(error => reject(error));
      });
    },
  };
})();

let App = {
  templates: {},
  
  bindListeners() {
    $("label[for='new_item']").on("click", this.handleAddTodoClick.bind(this));
    $("#modal_layer").on("click", this.hideModalLayerAndForm.bind(this));
    $("#form_modal form").on("submit", this.handleFormModalSubmit.bind(this));
    $("#form_modal button[name='complete']").on(
      "click",
      this.handleFormModalComplete.bind(this));
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
      if (key === "title" || key === "description") {
        object[key] = object[key].trim();
      } else if (key.startsWith("due_")) {
        object[key] = /^(\d{2}|\d{4})$/.test(object[key]) 
          ? object[key]
          : "";
      }
    });
  },

  handleAddTodoClick(_event) {
    this.displayModalLayer(); 
    
    $("#form_modal").toggle(true);
    $("#form_modal").find("form").attr("id", "add"); 
  },
  
  handleFormModalComplete(event) {
    event.preventDefault();
  },

  handleFormModalSubmit(event) {
    event.preventDefault();
    let $form = $(event.target);
    let values = this.serializeArrayToObject($form.serializeArray());
    this.formatFormValuesInPlace(values); 
    
    if (values.title.length <= 3) {
      alert("The title of the todo must be at least 3 characters long.");
      return;
    }
    
    this.hideModalLayerAndForm();

    Todos.addTodo(values)
    .then(() => {
      this.renderPage();
      this.bindListeners();
    })
    .catch(error => {
      console.log(error);
    });
  },

  hideModalLayerAndForm(_event) {
    $("#modal_layer").toggle(false);
    $("#form_modal").toggle(false).find("form").attr("id", "");
  },

  init() {
    this.compileHtmlTemplates();

    Todos.init()
    .then(() => {
      this.renderPage();
      this.bindListeners();
    })
    .catch(error => {
      console.log(error);
    });
  },

  renderPage(selection = { done: false, due_date: "" }) {
    let todos              = Todos.getAllTodos();
    let done               = Todos.getDoneTodos();
    let todos_by_date      = Todos.getAllTodosByDate();
    let done_todos_by_date = Todos.getDoneTodosByDate();
    let selected           = Todos.getTodosByCompletionAndDate(selection);
    
    let current_section;
    if (selection.done) {
      current_section.title = due_date ? due_date : "Completed";
    } else {
      current_section.title = due_date ? due_date : "All Todos";
    }
    current_section.data = selected.length;

    $("body").html(this.templates.main_template({ 
      todos,
      done,
      todos_by_date,
      done_todos_by_date,
      selected, 
      current_section,
    }));
  },

  xrenderPage(todos, selection) {
    // selection = { completed: boolean, due_date: string }
    // selection controls what goes in current_section and selected
    
    console.log(todos);
    let todos_by_date = { "No Due Date": [{}], "02/15": [{}] };
    let done = todos.filter(todo => todo.completed);
    let done_todos_by_date = { "03/15": [{}], "04/15": [{},{}] };
    let selected = [
      { id: 1, completed: true, title: "Foo", due_date: "No Due Date", },
      { id: 2, completed: false, title: "Bar", due_date: "03/16", },
      { id: 3, completed: false, title: "Biz", due_date: "No Due Date", },
      { id: 4, completed: true, title: "Bang", due_date: "No Due Date", },
    ];
    let current_section = { title: "Some Title", data: 4 };

    $("body").html(this.templates.main_template({ 
      todos,
      todos_by_date,
      done,
      done_todos_by_date,
      selected, 
      current_section,
    }));
  },

  serializeArrayToObject(array) {
    return array.reduce((object, pair) => {
      object[pair.name] = pair.value;
      return object;
    }, {});
  },
};

$(App.init.bind(App));











