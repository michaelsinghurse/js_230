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

  compileQuestionsTemplate() {
    Handlebars.registerPartial("question", $("#questionPartial").html());        
    Handlebars.registerHelper("questionNumber", index => index + 1);
    return Handlebars.compile($("#questionsCollection").html());
  },
  
  gradeQuizAnswers(formData) {
    let results = [];

    for (let key of formData.keys()) {
      let id = key.replace("answer", "");
      let correctAnswer = this.answers[id];
      let isCorrect = formData.get(key) === correctAnswer;
      let message = isCorrect
        ? "Correct Answer"
        : "Sorry the answer is: " + correctAnswer;
    
      results.push({
        id,
        isCorrect,
        message,
      });
    }

    return results;
  },

  handleFormReset(_unusedEvent) {
    this.$form.get(0).reset();
    // enable submit button
    this.$submit.removeAttr("disabled");
    // set text within each p#result to empty string

  },

  handleFormSubmit(event) {
    event.preventDefault();
    // disable form submit button
    this.$submit.attr("disabled", "true");

    // display results message beneath each radio button set
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
    console.log(results);
  },
};

$(Quiz.init.bind(Quiz));
