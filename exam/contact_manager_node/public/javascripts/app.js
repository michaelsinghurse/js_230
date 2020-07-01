let Server = {
  addContact(contact) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/contacts");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.responseType = "json";

      xhr.addEventListener("load", _event => {
        if (xhr.status === 201) {
          resolve(xhr.response);
        } else {
          reject("Error with request!");
        }
      });

      xhr.send(JSON.stringify(contact));
    });
  },

  deleteContact(id) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", "/api/contacts/" + id);

      xhr.addEventListener("load", _event => {
        if (xhr.status === 204) {
          resolve();
        } else {
          reject("Error with request!");
        }
      });

      xhr.send();
    });
  },

  editContact(contact) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("PUT", "/api/contacts/" + contact.id);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.responseType = "json";

      xhr.addEventListener("load", _event => {
        if (xhr.status === 201) {
          resolve(xhr.response);
        } else {
          reject("Error with request!");
        }
      });

      xhr.send(JSON.stringify(contact));
    });
  },

  getContacts() {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "/api/contacts");
      xhr.responseType = "json";

      xhr.addEventListener("load", _event => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject("Error with request!");
        }
      });

      xhr.send();
    });
  },
};

let Contacts = (function() {
  let contacts;

  function makeCopy(object) {
    return JSON.parse(JSON.stringify(object));
  }

  function removeContact(id) {
    let index = contacts.findIndex(contact => contact.id === Number(id));
    if (index === -1) {
      return false;
    } else {
      contacts.splice(index, 1);
      return true;
    }
  }

  function replaceContact(newContact) {
    let index = contacts.findIndex(contact => contact.id === newContact.id);
    if (index === -1) {
      return false;
    } else {
      contacts.splice(index, 1, newContact);
      return true;
    }
  }

  return {
    addContact(contact) {
      return new Promise((resolve, reject) => {
        Server.addContact(contact)
          .then(response => {
            contacts.push(response);
            resolve(makeCopy(response));
          })
          .catch(error => reject(error));
      });
    },

    deleteContact(id) {
      return new Promise((resolve, reject) => {
        Server.deleteContact(id)
          .then(() => {
            removeContact(id);
            resolve();
          })
          .catch(error => reject(error));
      });
    },

    editContact(contact) {
      return new Promise((resolve, reject) => {
        Server.editContact(contact)
          .then(response => {
            replaceContact(response);
            resolve(makeCopy(response));
          })
          .catch(error => reject(error));
      });
    },

    getAllContacts() {
      return new Promise((resolve, reject) => {
        if (contacts) {
          resolve(contacts.slice());
          return;
        }

        Server.getContacts()
          .then(response => {
            contacts = response;
            resolve(makeCopy(contacts));
          })
          .catch(error => reject(error));
      });
    },

    getAllUniqueTags() {
      if (!contacts) return [];

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

    getContactById(id) {
      let contact = contacts.find(contact => contact.id === Number(id));
      return makeCopy(contact);
    },

    getContactsThatStartWith(text) {
      let regex = new RegExp(`^${text}`, "gi");

      let matches = contacts.filter(contact => {
        let names = contact.full_name.split(" ");
        return names.some(name => regex.test(name));
      });

      return makeCopy(matches);
    },

    getContactsWithTags(pTags) {
      if (pTags.length) {
        let matches = contacts.filter(contact => {
          let tags = contact.tags || "";
          let tagsArr = tags.split(",");
          return tagsArr.some(tag => pTags.includes(tag));
        });

        return makeCopy(matches);
      } else {
        return makeCopy(contacts);
      }
    },
  };
})();

let App = {
  addContactTemplate: null,
  contactsTemplate: null,
  deleteContactTemplate: null,
  editContactTemplate: null,
  tagsTemplate: null,

  bindListeners() {
    $("#search_box").on("input", this.handleSearchBoxInput.bind(this));
    $("#tags").on("input", "[name='tag']", this.handleTagClick.bind(this));
    $("#add_contact").on("click", this.handleAddContactButton.bind(this));
    $("#contacts_container").on(
      "click",
      "button[data-action='edit']",
      this.handleEditContactButtonClick.bind(this));
    $("#contacts_container").on(
      "click",
      "button[data-action='delete']",
      this.handleDeleteContactButtonClick.bind(this));
    $("#modal").on("click", this.removeModalAndForm.bind(this));
  },

  compileHtmlTemplates() {
    this.addContactTemplate = Handlebars.compile($("#addContactTemplate").html());
    this.contactsTemplate = Handlebars.compile($("#contactsTemplate").html());
    this.deleteContactTemplate = Handlebars.compile($("#deleteContactTemplate").html());
    this.editContactTemplate = Handlebars.compile($("#editContactTemplate").html());
    this.tagsTemplate = Handlebars.compile($("#tagsTemplate").html());

    Handlebars.registerHelper("valueOrFiller", value => {
      return value || "---";
    });
  },

  displayModal() {
    $("#modal").toggle(true);
  },

  handleAddContactButton(event) {
    event.preventDefault();

    this.displayModal();

    $("#modal_forms").toggle(true).html(this.addContactTemplate());
    $("#addContact").on("submit", this.handleAddContactSubmit.bind(this));
    $("#addContact").on("click", "input[type='button']", this.removeModalAndForm.bind(this));
  },

  handleAddContactSubmit(event) {
    event.preventDefault();

    let contact = {};

    $(event.target).serializeArray().forEach(input => {
      contact[input.name] = input.value;
    });

    Contacts.addContact(contact)
      .then(_ => {
        return Contacts.getAllContacts();
      })
      .then(contacts => {
        this.removeModalAndForm();
        this.renderPage(contacts);
      })
      .catch(error => console.log(error));
  },

  handleDeleteContactButtonClick(event) {
    let id = $(event.target).closest("li").attr("data-id");
    let contact = Contacts.getContactById(id);

    this.displayModal();

    $("#modal_forms").toggle(true).html(this.deleteContactTemplate(contact));
    $("#deleteContact").on("submit", this.handleDeleteContactSubmit.bind(this));
    $("#deleteContact").on("click", "[type='button']", this.removeModalAndForm.bind(this));
  },

  handleDeleteContactSubmit(event) {
    event.preventDefault();
    let id = $(event.target).find("[name='id']").val();

    Contacts.deleteContact(id)
      .then(() => Contacts.getAllContacts())
      .then(contacts => {
        this.removeModalAndForm();
        this.renderPage(contacts);
      })
      .catch(error => console.log(error));
  },

  handleEditContactButtonClick(event) {
    let id = $(event.target).closest("li").attr("data-id");
    let contact = Contacts.getContactById(id);

    this.displayModal();

    $("#modal_forms").toggle(true).html(this.editContactTemplate(contact));
    $("#editContact").on("submit", this.handleEditContactSubmit.bind(this));
    $("#editContact").on("click", "input[type='button']", this.removeModalAndForm.bind(this));
  },

  handleEditContactSubmit(event) {
    event.preventDefault();

    let contact = {};

    $(event.target).serializeArray().forEach(input => {
      contact[input.name] = input.value;
    });

    Contacts.editContact(contact)
      .then(_ => Contacts.getAllContacts())
      .then(contacts => {
        this.removeModalAndForm();
        this.renderPage(contacts);
      })
      .catch(error => console.log(error));
  },

  handleSearchBoxInput(event) {
    let text = event.target.value;
    let contacts = Contacts.getContactsThatStartWith(text);
    this.renderPage(contacts);
  },

  handleTagClick(_event) {
    $("#search_box").val("");

    let tags = [];
    $("#tags").find("input:checked").each((_, element) => {
      tags.push(element.value);
    });

    let contacts = Contacts.getContactsWithTags(tags);
    this.renderPage(contacts, false);
  },

  hideModal() {
    $("#modal").toggle(false);
  },

  init() {
    this.compileHtmlTemplates();

    Contacts.getAllContacts()
      .then(contacts => {
        this.renderPage(contacts);
      });

    this.bindListeners();
  },

  removeModalAndForm() {
    this.hideModal();
    $("#modal_forms").toggle(false).html("");
  },

  renderPage(contacts, resetTags = true) {
    if (resetTags) {
      this.renderTagsFilter(Contacts.getAllUniqueTags());
    }
    this.renderContacts(contacts);
  },

  renderContacts(contacts) {
    $("#contacts_container").html(this.contactsTemplate({ contacts }));
  },

  renderTagsFilter(tags) {
    $("#tags").html(this.tagsTemplate({ tags }));
  },
};

App.init();
