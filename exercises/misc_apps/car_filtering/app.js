const cars = [
  { make: 'Honda', image: 'images/honda-accord-2005.jpg', model: 'Accord', year: 2005, price: 7000 },
  { make: 'Honda', image: 'images/honda-accord-2008.jpg', model: 'Accord', year: 2008, price: 11000 },
  { make: 'Toyota', image: 'images/toyota-camry-2009.jpg', model: 'Camry', year: 2009, price: 12500 },
  { make: 'Toyota', image: 'images/toyota-corrolla-2016.jpg', model: 'Corolla', year: 2016, price: 15000 },
  { make: 'Suzuki', image: 'images/suzuki-swift-2014.jpg', model: 'Swift', year: 2014, price: 9000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 25000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 26000 },
];

let carDisplay = {
  bindListeners() {
    this.$form.on("submit", this.handleFormSubmit.bind(this));
    this.$form.find("[name='make']").on(
      "change",
      this.handleMakeSelectionChange.bind(this));
  },

  compileHtmlTemplates() {
    let template = {};

    let $optionsTemplate = $("#selectOptionsTemplate");
    $optionsTemplate.remove();
    template.selectOptions = Handlebars.compile($optionsTemplate.html());

    let $listTemplate = $("#carsListTemplate");
    $listTemplate.remove();
    template.cars = Handlebars.compile($listTemplate.html());

    Handlebars.registerPartial("carTemplate", $("#carTemplate").html());
    $("#carTemplate").remove();

    return template;
  },

  handleFormSubmit(event) {
    event.preventDefault();

    let selections = this.$form
      .serializeArray()
      .filter(selection => selection.value !== "");

    let cars = this.cars.slice();

    if (selections.length > 0) {
      cars = cars.filter(car => {
        return selections.every(selection => {
          if (selection.name === "year" || selection.name === "price") {
            selection.value = Number.parseInt(selection.value, 10);
          }
          return car[selection.name] === selection.value;
        });
      });
    }

    this.renderCars(cars);
  },

  handleMakeSelectionChange(event) {
    let make = event.target.value;

    let cars = this.cars.slice();

    if (make) {
      cars = cars.filter(car => car.make === make);
    }

    this.populateFormFilters(cars, false);
  },

  init() {
    this.cars = cars;
    this.$carList = $("ul");
    this.$form = $("form");
    this.htmlTemplates = this.compileHtmlTemplates();

    this.populateFormFilters(this.cars);
    this.renderCars(this.cars);
    this.bindListeners();
  },

  populateFormFilters(cars, includeMake = true) {
    let $selects = $("form select");

    $selects.each((_, element) => {
      let $select = $(element);
      let name = $select.attr("name");

      if (name === "make" && !includeMake) return;

      $select.children().remove();

      let values = cars.reduce((array, car) => {
        let value = car[name];
        if (!array.includes(value)) {
          array.push(value);
        }
        return array;
      }, []);

      values = this.sortArray(values);

      $select.html(this.htmlTemplates.selectOptions({ options: values }));
    });
  },

  renderCars(cars) {
    this.$carList.html(this.htmlTemplates.cars({ cars }));
  },

  sortArray(array) {
    if (typeof array[0] === "string") {
      return array.sort();
    } else {
      return array.sort((a, b) => a - b);
    }
  },
};

$(carDisplay.init.bind(carDisplay));
