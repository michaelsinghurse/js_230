"use strict";

class DatesList {
  constructor() {
    this.XHR_ERROR_MSG = "An error occurred. Please try again.";

    this.getResource("http://localhost:3000/api/bookings", "json")
    .then(response => this.renderDatesListElement(response)) 
    .catch(error => alert(this.XHR_ERROR_MSG));
  }

  getResource(url, type) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.addEventListener("load", () => resolve(xhr.response));
      xhr.addEventListener("error", () => reject());

      xhr.open("GET", url);
      xhr.responseType = type;
      xhr.send();
    });
  }

  handleDatesListClick(event) {
    if (!event.target.classList.contains("datesListItem")) return;
    
    let targetElement = event.target;
    
    if (targetElement.children.length > 0) {
      this.toggleDatesListDisplay(targetElement);
    } else { 
      let date = targetElement.textContent.trim();
      
      this.getResource(`http://localhost:3000/api/bookings/${date}`, "json")
      .then(response => this.renderBookingsForDate(targetElement, response))
      .catch(error => alert(this.XHR_ERROR_MESSAGE));
    }
  }

  renderBookingsForDate(parentElement, bookings) {
    let ul = document.createElement("ul");

    bookings.forEach(booking => {
      let li = document.createElement("li");
      li.textContent = booking.join(" | ");
      ul.appendChild(li);
    });

    parentElement.appendChild(ul);
  }

  renderDatesListElement(dates) {
    let datesList = document.createElement("ul");
    datesList.setAttribute("id", "datesList");
    datesList.style.cursor = "pointer";
    datesList.addEventListener("click", this.handleDatesListClick.bind(this));
    
    dates.forEach(date => {
      let li = document.createElement("li");
      li.setAttribute("class", "datesListItem");
      li.textContent = date;

      datesList.appendChild(li);
    });
    
    document.querySelector("#datesContainer").appendChild(datesList);  
  }
  
  toggleDatesListDisplay(parentElement) {
    let innerUl = parentElement.querySelector("ul");

    if (innerUl.style.display !== "none") { 
      innerUl.style.display = "none";
    } else {
      innerUl.style.display = "block";
    }
  }
}

document.addEventListener("DOMContentLoaded", _event => {
  let datesList = new DatesList();
});


