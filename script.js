let addBtn = document.querySelector(".add-btn");
let modalCont = document.querySelector(".modal-cont");
let taskArea = document.querySelector(".textarea-cont");
let mainCont = document.querySelector(".main-cont");
let allPriorityColor = document.querySelectorAll(".priority-color");
let removeBtn = document.querySelector(".remove-btn");
let removeFlag = false;
let addModal = true;
let colors = ["lightpink", "blue", "green", "black"];
let modalPriorityColor = colors[colors.length - 1];
var uid = new ShortUniqueId();
let toolBoxColors = document.querySelectorAll(".color");

let ticketArr = [];
// working on local storage of browser

if (localStorage.getItem("tickets")) {
  let str = localStorage.getItem("tickets");
  let arr = JSON.parse(str);
  ticketArr = arr;
  for (let i = 0; i < arr.length; i++) {
    let ticketObj = arr[i];
    createTicket(ticketObj.color, ticketObj.task, ticketObj.id);
  }
}
// ---------------

// -----------------------------------

// Display only similar color of tickets

for (let i = 0; i < toolBoxColors.length; i++) {
  toolBoxColors[i].addEventListener("click", function () {
    let currentColor = toolBoxColors[i].classList[1];
    let filteredArr = [];
    for (let i = 0; i < ticketArr.length; i++) {
      if (ticketArr[i].color == currentColor) {
        filteredArr.push(ticketArr[i]);
      }
    }
    console.log(filteredArr);
    //  remove all tickets before u dislay the one u want
    let allTickets = document.querySelectorAll(".ticket-cont");
    for (let j = 0; j < allTickets.length; j++) {
      allTickets[j].remove();
    }

    //  diplay only tickets u want
    for (let i = 0; i < filteredArr.length; i++) {
      let ticket = filteredArr[i];
      let color = ticket.color;
      let task = ticket.task;
      let id = ticket.id;
      createTicket(color, task, id);
    }
  });

  toolBoxColors[i].addEventListener("dblclick", function () {
    let allTickets = document.querySelectorAll(".ticket-cont");
    for (let j = 0; j < allTickets.length; j++) {
      allTickets[j].remove();
    }
    for (let i = 0; i < ticketArr.length; i++) {
      let ticket = ticketArr[i];
      let color = ticket.color;
      let task = ticket.task;
      let id = ticket.id;
      createTicket(color, task, id);
    }
  });
}
// ------------------Display modal Container
addBtn.addEventListener("click", function () {
  if (addModal) {
    //  show modal
    modalCont.style.display = "flex";
  } else {
    // hide modal
    modalCont.style.display = "none";
  }
  // console.log("hello");
  addModal = !addModal;
});

// ----------for textArea
modalCont.addEventListener("keydown", function (e) {
  let key = e.key;
  // console.log(key);
  if (key == "Enter") {
    createTicket(modalPriorityColor, taskArea.value);
    taskArea.value = "";
    modalCont.style.display = "none";
    addModal = !addModal;
  }
});

// changing color of delete button
removeBtn.addEventListener("click", function () {
  if (removeFlag) {
    removeBtn.style.color = "black";
  } else {
    removeBtn.style.color = "red";
  }
  removeFlag = !removeFlag;
});

//  selecting the color of ticket
for (let i = 0; i < allPriorityColor.length; i++) {
  let priorityDivOneColor = allPriorityColor[i];
  allPriorityColor[i].addEventListener("click", function (e) {
    for (let j = 0; j < allPriorityColor.length; j++) {
      allPriorityColor[j].classList.remove("active");
    }
    priorityDivOneColor.classList.add("active");
    modalPriorityColor = priorityDivOneColor.classList[0];
  });
}

// this function display how to create div container
function createTicket(ticketColor, task, ticketId) {
  let id;
  if (ticketId == undefined) {
    id = uid();
  } else {
    id = ticketId;
  }

  // <div class="ticket-cont">
  //       <div class="ticket-color green"></div>
  //       <div class="ticket-id">#jbnfgd</div>
  //       <div class="task-area">some tasks</div>
  //     </div>

  // creating ticket
  console.log("Ticket will be created");
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
                      <div class="ticket-id ">#${id}</div>
                      <div class="task-area ">${task}</div>
                      <div class="lock-unlock"><i class="fa fa-lock"></i></div>`;
  mainCont.appendChild(ticketCont);

  //  toggle lock-unlockBtn
  let lockUnlockBtn = ticketCont.querySelector(".lock-unlock i");
  let ticketTaskArea = ticketCont.querySelector(".task-area");
  lockUnlockBtn.addEventListener("click", function () {
    if (lockUnlockBtn.classList.contains("fa-lock")) {
      lockUnlockBtn.classList.remove("fa-lock");
      lockUnlockBtn.classList.add("fa-unlock");
      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      lockUnlockBtn.classList.remove("fa-unlock");
      lockUnlockBtn.classList.add("fa-lock");
      ticketTaskArea.setAttribute("contenteditable", "false");
    }
    // update task Area content
    let ticketIdx = getTicketId(id);
    ticketArr[ticketIdx].task = ticketTaskArea.textContent;
    updateLocalStorage();
  });
  //  handling delete ticket container
  ticketCont.addEventListener("click", function () {
    if (removeFlag) {
      // Delete from UI
      ticketCont.remove();
      // Delete from TicketArray
      let ticketId = getTicketId(id);
      ticketArr.splice(ticketId, 1); // remove a ticket
       updateLocalStorage();
    }
  });

  // handle color of colorBand

  let ticketColorBand = ticketCont.querySelector(".ticket-color");
  ticketColorBand.addEventListener("click", function () {
    // update UI
    let currentTicketColor = ticketColorBand.classList[1];
    let currentTicketColorIdx = -1;
    for (let i = 0; i < colors.length; i++) {
      if (currentTicketColor == colors[i]) {
        currentTicketColorIdx = i;
        break;
      }
    }

    let nextColorIdx = (currentTicketColorIdx + 1) % colors.length;
    let nextColor = colors[nextColorIdx];
    ticketColorBand.classList.remove(currentTicketColor);
    ticketColorBand.classList.add(nextColor);
    // update ticketArray as well
    let ticketIdx = getTicketId(id);
    ticketArr[ticketIdx].color = nextColor;
    updateLocalStorage();
  });

  //
  if (ticketId == undefined) {
    ticketArr.push({ color: ticketColor, task: task, id: id });
    updateLocalStorage();
  }

  console.log(ticketArr);
}

//
function getTicketId(id) {
  for (let i = 0; i < ticketArr.length; i++) {
    if (ticketArr[i].id == id) {
      return i;
    }
  }
}

function updateLocalStorage() {
  let stringifyArr = JSON.stringify(ticketArr);
  localStorage.setItem("tickets", stringifyArr);
}
