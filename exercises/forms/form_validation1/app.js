let form = {
  addInputErrorDisplay(input) {
    let $span = $(input).next("span");

    if (input.validity.patternMismatch) {
      $span.text(this.errorMessages[input.name]); 
    } else if (input.validity.valueMissing) {
      $span.text("Value is required.");
    } else {
      $span.text(input.validationMessage); 
    }

    input.classList.add("error");
  },

  bindEvents() {
    this.$inputs.on("focus", this.handleInputFocus.bind(this));
    this.$inputs.on("blur", this.handleInputBlur.bind(this));
    this.$form.on("submit", this.handleFormSubmit.bind(this));
  },
  
  getErrorMessages() {
    return {
      first_name: "Name must be at least one letter long.",
      last_name: "Name must be at least one letter long.",
      phone: "Phone must be in format 999-999-9999.",
      email: "Email must be in form name@domain.",
      password: "Password must contain at least 10 characters.",
    };
  },

  handleFormSubmit(event) {
    event.preventDefault();
    let areAllInputsValid = true;

    this.$inputs.each((_, input) => {
      if(this.isInputValid(input)) {
        this.removeInputErrorDisplay(input);
      } else {
        this.addInputErrorDisplay(input);
        areAllInputsValid = false;
      }
    });

    if (areAllInputsValid) {
      this.toggleFormErrorMessage(false); 
      this.$form.get(0).reset();
    } else {
      this.toggleFormErrorMessage(true);
    }
  },

  handleInputFocus(event) {
    this.removeInputErrorDisplay(event.target); 
  },

  handleInputBlur(event) {
    let input = event.target;

    if (!this.isInputValid(input)) {
      this.addInputErrorDisplay(input);
    }
  },

  init() {
    this.$form = $("form");
    this.$inputs = $("input[type!='submit']");
    this.errorMessages = this.getErrorMessages();
    this.bindEvents();
  },
  
  isInputValid(input) {
    return input.validity.valid;
  },

  removeInputErrorDisplay(input) {
    input.classList.remove("error");
    $(input).next("span").text("");
  },

  toggleFormErrorMessage(display) {
    let $errorMsg = $("p.error");
    
    if (display && $errorMsg.length === 0) {
      let p = document.createElement("p");
      p.textContent = "Please correct errors before submitting form.";
      p.classList.add("error");
      $("main").prepend(p); 
    } else if (!display && $errorMsg.length === 1) {
      $errorMsg.remove();
    }
  },
};

$(form.init.bind(form));


