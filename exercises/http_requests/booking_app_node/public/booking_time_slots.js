class ScheduleForm {
  constructor() {
    this.formsContainer = document.querySelector("#formsContainer");
    this.addScheduleForm = document.querySelector("#addScheduleForm");
    this.addScheduleForm.addEventListener(
      "submit", 
      this.handleScheduleSubmit.bind(this)
    );
    this.scheduleInput = document.querySelector("#scheduleSelect");
    this.emailInput = document.querySelector("#studentEmail");
    
    this.addStudentForm = null;
    this.staffMembers = null;
    this.staffSchedules = null;

    this.resetForms();
  }

  addStudentSubmit() {
    let data = new FormData(this.addStudentForm);

    this.postAddStudent(data)
    .then(results => {
      switch (results.status) {
        case 201:
          alert(results.text);
          this.scheduleSubmit();    
          break;
        default:
          alert("An error occurred. Please try again.");
          this.resetForms();
      }
    });
  }

  bookingSuccess() {
    alert("Booked!");
    this.resetForms();
  }

  getStaffMembers() {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();

      request.addEventListener("load", event => {
        this.staffMembers = request.response;
        resolve();
      });

      request.addEventListener("error", () => reject());

      request.open("GET", "http://localhost:3000/api/staff_members");
      request.responseType = "json";
      request.send();
    });
  }

  getStaffSchedules() {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();

      request.addEventListener("load", event => {
        this.staffSchedules = request.response;
        resolve()
      });

      request.addEventListener("error", () => reject());

      request.open("GET", "http://localhost:3000/api/schedules");
      request.responseType = "json";
      request.send();
    });
  }
  
  handleAddStudentSubmit(event) {
    event.preventDefault();
    this.addStudentSubmit()
  }

  handleScheduleSubmit(event) {
    event.preventDefault();
    this.scheduleSubmit();
  }
  
  lookupStaffNameById(staffId) {
    return this.staffMembers.find(obj => obj["id"] === staffId)["name"];
  }

  populateSelectOptions() {
    while (this.scheduleInput.firstElementChild) {
      this.scheduleInput.removeChild(this.scheduleInput.lastChild);
    }

    this.staffSchedules.forEach(schedule => {
      if (schedule.student_email) return;
      let scheduleData = [];
      scheduleData[0] = this.lookupStaffNameById(schedule["staff_id"]); 
      scheduleData[1] = schedule["date"];
      scheduleData[2] = schedule["time"];

      let option = document.createElement("option");
      option.setAttribute("value", schedule["id"]);
      option.setAttribute("label", scheduleData.join(" | "));

      this.scheduleInput.appendChild(option);
    });
  }
  
  postAddStudent(formData) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      
      request.addEventListener("load", event => {
        resolve({
          "status": request.status,
          "text": request.response,
        });
      });

      request.addEventListener("error", () => reject());

      request.open("POST", "http://localhost:3000/api/students");
      request.send(formData);
    });
  }

  postSchedule(scheduleId, studentEmail) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();

      request.addEventListener("load", event => {
        resolve({
          "status": request.status,
          "text": request.response
        });
      });

      request.addEventListener("error", () => reject());

      request.open("POST", "http://localhost:3000/api/bookings");
      request.setRequestHeader("Content-Type", "application/json");

      let data = { "id": scheduleId, "student_email": studentEmail };

      request.send(JSON.stringify(data));
    });
  }
 
  renderAddStudentForm(params) {
    if (this.addStudentForm) {
      this.addStudentForm.remove();
      this.addStudentForm = null;
    }

    this.addStudentForm = document.createElement("form");
    this.addStudentForm.addEventListener(
      "submit", 
      this.handleAddStudentSubmit.bind(this)
    );

    let fieldset = document.createElement("fieldset");

    let legend = document.createElement("legend");
    legend.textContent = "Please provide new student details.";
    fieldset.appendChild(legend);

    let dl = document.createElement("dl");

    let dtEmail = document.createElement("dt");
    let dtEmailLabel = document.createElement("label");
    dtEmailLabel.textContent = "Email:";
    dtEmailLabel.setAttribute("for", "new_student_email");
    dtEmail.appendChild(dtEmailLabel);
    dl.appendChild(dtEmail);

    let ddEmail = document.createElement("dd");
    let ddEmailInput = document.createElement("input");
    ddEmailInput.setAttribute("type", "email");
    ddEmailInput.setAttribute("id", "new_student_email");
    ddEmailInput.setAttribute("name", "email");
    ddEmailInput.setAttribute("required", true);
    ddEmailInput.setAttribute("value", params.studentEmail);
    ddEmail.appendChild(ddEmailInput);
    dl.appendChild(ddEmail);

    let dtName = document.createElement("dt");
    let dtNameLabel = document.createElement("label");
    dtNameLabel.textContent = "Name:";
    dtNameLabel.setAttribute("for", "new_student_name");
    dtName.appendChild(dtNameLabel);
    dl.appendChild(dtName);

    let ddName = document.createElement("dd");
    let ddNameInput = document.createElement("input");
    ddNameInput.setAttribute("type", "text");
    ddNameInput.setAttribute("id", "new_student_name");
    ddNameInput.setAttribute("name", "name");
    ddNameInput.setAttribute("required", true);
    ddName.appendChild(ddNameInput);
    dl.appendChild(ddName);

    let dtSequence = document.createElement("dt");
    let dtSequenceLabel = document.createElement("label");
    dtSequenceLabel.textContent = "Booking Sequence:";
    dtSequenceLabel.setAttribute("for", "booking_sequence");
    dtSequence.appendChild(dtSequenceLabel);
    dl.appendChild(dtSequence);

    let ddSequence = document.createElement("dd");
    let ddSequenceInput = document.createElement("input");
    ddSequenceInput.setAttribute("type", "text");
    ddSequenceInput.setAttribute("id", "booking_sequence");
    ddSequenceInput.setAttribute("name", "booking_sequence");
    ddSequenceInput.setAttribute("required", true);
    ddSequenceInput.setAttribute("value", params.sequenceId);
    ddSequence.appendChild(ddSequenceInput);
    dl.appendChild(ddSequence);

    fieldset.appendChild(dl);
    
    let buttonInput = document.createElement("input");
    buttonInput.setAttribute("type", "submit");
    buttonInput.setAttribute("value", "Submit");
    fieldset.appendChild(buttonInput);
    
    this.addStudentForm.appendChild(fieldset);
    this.formsContainer.appendChild(this.addStudentForm);        
  }

  resetAddScheduleForm() {
    this.addScheduleForm.reset();
    Promise.all([
      this.getStaffMembers(),
      this.getStaffSchedules()
    ])
    .then(() => {
      this.populateSelectOptions()
    })
    .catch(() => alert("An error occurred!"));
  }

  resetForms() {
    this.resetAddScheduleForm();
    if (this.addStudentForm) {
      this.addStudentForm.remove();
      this.addStudentForm = null;
    }
  }

  scheduleSubmit() {
    let scheduleId = this.scheduleInput.options[this.scheduleInput.selectedIndex].value;
    let email = this.emailInput.value;

    this.postSchedule(scheduleId, email)
    .then(results => {
      switch (results.status) {
        case 204:
          this.bookingSuccess();
          break;
        case 404:
          results["scheduleId"] = scheduleId;
          results["studentEmail"] = email;
          this.scheduleSubmitErrorResponse(results);
          break;
      }
    });
  }

  scheduleSubmitErrorResponse(results) {
    let sequenceToken = "booking_sequence: ";

    if (results.text.includes(sequenceToken)) {
      results["sequenceId"] = results.text.split(sequenceToken)[1]; 
      this.renderAddStudentForm(results);
    } else {
      alert(results.text);
      this.resetForms();
    }
  }
}

document.addEventListener("DOMContentLoaded", event => {
  let scheduleForm = new ScheduleForm();
});


