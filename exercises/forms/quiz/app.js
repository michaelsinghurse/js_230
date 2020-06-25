const QUESTIONS = [
  {
    id: "1",
    question: "Which of these states is best for us?",
    options: ["Connecticut", "Indiana", "Utah", "Wisconsin"],
  },
  {
    id: "2",
    question: "Which of the following architectural styles do we like best?",
    options: ["Craftsman", "Mediterranean", "Modern", "Victorian"],
  },
  {
    id: "3",
    question: "About what price would our ideal home cost in Green Bay?",
    options: ["$200,000", "$500,000", "$800,000", "$1,000,000" ],
  },
  {
    id: "4",
    question: "Which feature of the interior is most important?",
    options: ["Natural light", "Basement", "Wood floors", "Open floorplan"],
  },
];

let ANSWERS = {
  1: "Wisconsin",
  2: "Modern",
  3: "$500,000",
  4: "Natural light",
};

let Quiz = {
  answers: ANSWERS,
  questions: QUESTIONS,
  
  bindEvents() {
    this.$form.on("submit", this.handleFormSubmit.bind(this));
    this.$reset.on("click", this.handleFormReset.bind(this));
  },
  
  clearResults() {
    $("p[id^='result']").each((_, element) => {
      let $element = $(element);
      $element.text("");
      $element.removeClass("right wrong missing");
    });
  },

  compileQuestionsTemplate() {
    Handlebars.registerPartial("question", $("#questionPartial").html());        
    Handlebars.registerHelper("questionNumber", index => index + 1);
    return Handlebars.compile($("#questionsCollection").html());
  },
  
  gradeQuizAnswers(formData) {
    return this.questions.map(question => {
      let id = question.id;
      let answer = this.answers[id];
      let choice = formData.get("answer" + id) || "";
      
      let isCorrect = answer === choice;
      let isMissing = choice === "";
      let message;

      if (isCorrect) {
        message = "Correct Answer";
      } else if (isMissing) {
        message = "No response? The answer is: " + answer;
      } else {
        message = "Incorrect. The answer is: " + answer;
      }

      return {
        id,
        isCorrect,
        isMissing,
        message,
      }
    });
  },

  handleFormReset(_unusedEvent) {
    this.$form.get(0).reset();
    this.$submit.removeAttr("disabled");
    this.clearResults();
  },

  handleFormSubmit(event) {
    event.preventDefault();

    this.$submit.attr("disabled", "true");
    
    let results = this.gradeQuizAnswers(new FormData(this.$form.get(0)));
    this.renderResults(results);
  },

  init() {
    this.$form = $("form");
    this.$submit = $("input[type='submit']");
    this.$reset = $("input[type='button']");

    this.bindEvents();
    this.questionsTemplate = this.compileQuestionsTemplate();
    this.renderQuestions();
  },

  renderQuestions() {
    this.$form.prepend(this.questionsTemplate({ questions: this.questions }));
  },

  renderResults(results) {
    results.forEach(result => {
      let $msg = $(`#result${result.id}`);
      $msg.text(result.message);
      
      let resultClass;

      if (result.isCorrect) {
        resultClass = "right";
      } else if (result.isMissing) {
        resultClass = "missing";
      } else {
        resultClass = "wrong";
      }

      $msg.addClass(resultClass);
    });
  },
};

$(Quiz.init.bind(Quiz));


