let ContactsManager = {
  contacts: null,
  $modal: $("#modal"),

  addContact(contact) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/contacts");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.responseType = "json";

      xhr.addEventListener("load", event => {
        if (xhr.status === 201) {
          resolve(xhr.response);
        } else {
          reject("Error with request!");
        }
      });

      xhr.send(JSON.stringify(contact));
    });
  },

  bindListeners() {
    $("#add_contact").on("click", this.handleAddContactButton.bind(this));
    $("#modal").on("click", this.handleModalClick.bind(this));
  },
  
  displayModal() {
    this.$modal.toggle(true);
  },

  getContacts() {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.responseType = "json";

      xhr.addEventListener("load", event => {
        if (xhr.status === 200) { 
          resolve(xhr.response);
        } else {
          reject("Error with request!");
        }
      });

      xhr.open("GET", "/api/contacts");
      xhr.send();
    });
  },
  
  getUniqueTags(contacts) {
    return contacts.reduce((tags, contact) => {
      if (contact.tags) {
        contact.tags.split(",").forEach(tag => {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      }
      return tags;
    }, []);
  },

  handleAddContactButton(event) {
    event.preventDefault();

    this.displayModal(); 
    
    let addContactTemplate = Handlebars.compile($("#addContactTemplate").html());
    $("#contacts_forms").html(addContactTemplate());
    $("#addContact").on("submit", this.handleAddContactSubmit.bind(this));
    $("#addContact").on("click", "input[type='button']", this.handleContactFormCancel.bind(this));
  },
  
  handleAddContactSubmit(event) {
    event.preventDefault();

    let contact = {};

    $(event.target).serializeArray().forEach(input => {
      contact[input.name] = input.value;
    });
  
    this.addContact(contact)
    .then(newContact => {
      this.contacts.push(newContact);
      this.renderContacts(this.contacts);
    })
    .catch(error => console.log(error));
  },

  handleContactFormCancel(event) {
    this.hideModal();
    $("#contacts_forms").html("");
  },

  handleModalClick(event) {
    this.hideModal();
    $("#contacts_forms").html(""); 
  },

  hideModal() {
    this.$modal.toggle(false);
  },

  init() {
    this.getContacts()
    .then(response => {
      this.contacts = response;
      this.renderTagsFilter(this.getUniqueTags(this.contacts));
      this.renderContacts(this.contacts);
    });

    this.bindListeners();
  },

  renderContacts(contacts) {
    let contactsTemplate = Handlebars.compile($("#contactsTemplate").html());
    $("#contacts_container").html(contactsTemplate({ contacts }));
  },

  renderTagsFilter(tags) {
    let tagsTemplate = Handlebars.compile($("#tagsTemplate").html());
    $("#tags").html(tagsTemplate({ tags }));
  },
};

ContactsManager.init();
