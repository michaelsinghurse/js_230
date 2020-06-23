let Editor = {
  bindEvents() {
    $("#menu").on("click", "button", this.handleButtonClick.bind(this)); 
  },
  
  defaultButtonStates() {
    $("[data-command='justifyLeft']").addClass("enabled");
  },

  formatText(commandName) {
    let showDefaultUI = false;
    let valueArgument = null;
    
    if (commandName === "createLink") {
      valueArgument = prompt("Please enter a url:", "http://example.com");
      $("[data-command='createLink']").removeClass("enabled");
    }

    document.execCommand(commandName, showDefaultUI, valueArgument);
  },

  handleButtonClick(event) {
    let $button = $(event.target.closest("button"));
    $button.toggleClass("enabled");

    let command = $button.attr("data-command");
    if (command.includes("justify")) {
      this.toggleJustifyButtons(command);
    }

    this.formatText(command);     
    $("#content").trigger("focus");
  },
  
  init() {
    this.defaultButtonStates();
    this.bindEvents();
  },

  toggleJustifyButtons(command) {
    let $buttons = $("[data-command^='justify']");
    $buttons.each((_, element) => {
      let $button = $(element);
      if ($button.attr("data-command") !== command) {
        $button.removeClass("enabled");
      }
    });
  },

};

$(Editor.init.bind(Editor));
