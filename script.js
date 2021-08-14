let allFilters = document.querySelectorAll(".filter"); //get all 4 color wale spans
let container = document.querySelector(".ticket-container");
let addBtn = document.querySelector(".add span");
let TC = document.querySelector(".ticket-container");
let deleteBtn = document.querySelector(".delete");
let title = document.querySelector(".title-bar");
let refresh = document.querySelector(".refresh");
let hoverRefresh = document.querySelector(".hover-refresh");
let editHover = document.querySelector(".edit-hover");
let editBtn = document.querySelector(".edit");

let modalVisible = false;
let selectedPriority = "pink";
let selectedTicketsColor = undefined;
let allTaskData = localStorage.getItem("allTasks");
let id = uid();

if (allTaskData != null) {
  let data = JSON.parse(allTaskData);
  for (let i = 0; i < data.length; i++) {
    let ticket = document.createElement("div");
    ticket.classList.add("ticket");
    ticket.innerHTML = `<div class="ticket-color ticket-color-${data[i].selectedPriority}"></div>
                      <div class="ticket-id">${data[i].TaskId}</div>
                       <div class="task">
                      ${data[i].task}
                      </div>`;

    ticket.addEventListener("click", function (e) {
      if (e.currentTarget.classList.contains("active-ticket")) {
        e.currentTarget.classList.remove("active-ticket");
      } else {
        e.currentTarget.classList.add("active-ticket");
      }
    });
    TC.appendChild(ticket);
  }
}

for (let i = 0; i < allFilters.length; i++) {
  allFilters[i].addEventListener("click", filterHandler); //add event on all spans
}

function filterHandler(e) {
  //let span=e.currentTarget.children[0];//gets the span clicked
  //let color=getComputedStyle(span).backgroundColor;//gets background-color ki value from css
  //container.style.backgroundColor=color;//set background color

  if (e.currentTarget.classList.contains("active-filter")) {
    e.currentTarget.classList.remove("active-filter");
    container.style.backgroundColor = "";
  } else {
    e.currentTarget.classList.add("active-filter");
  }
}

addBtn.addEventListener("click", showModal);
function showModal(e) {
  addBtn.classList.add("btn-active");
  if (!modalVisible) {
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `<div class="task-to-be-added" spellcheck="false" data-type="false" contenteditable="true">
         <div class="placeholder">Enter your text here</div>
        </div>

        <div class="priority-list">
            <div class="pink-modal-filter modal-filter active"></div>
            <div class="blue-modal-filter modal-filter"></div>
            <div class="green-modal-filter modal-filter"></div>
            <div class="yellow-modal-filter modal-filter" ></div>
        </div>`;

    TC.appendChild(modal);
    selectedPriority = "pink"; //default hmesha pink
    let taskTyper = document.querySelector(".task-to-be-added");
    taskTyper.addEventListener("click", function (e) {
      //to remove placeholder
      if (e.currentTarget.getAttribute("data-type") == "false") {
        //to prevent other data from being deleted
        e.currentTarget.innerHTML = "";
        e.currentTarget.setAttribute("data-type", "true");
      }
    });
    taskTyper.addEventListener("keypress", addTicket.bind(this, taskTyper)); //enter pe ticket create
    modalVisible = true;

    let modalFilters = document.querySelectorAll(".modal-filter");
    for (let i = 0; i < modalFilters.length; i++) {
      modalFilters[i].addEventListener("click", selectPriority);
    }
  }
}

function selectPriority(e) {
  let activeFilter = document.querySelector(".modal-filter.active");
  activeFilter.classList.remove("active");
  selectedPriority = e.currentTarget.classList[0].split("-")[0];
  e.currentTarget.classList.add("active");
}

function addTicket(taskTyper, e) {
  //.trim is necessary in nxt line to remove extra spaces vrna wo space ko text maan lega aur if true hojayega, so next line mei extra spaces htake check hoga if it is text or not
  if (
    e.key == "Enter" &&
    e.shiftKey == false &&
    taskTyper.innerText.trim() != ""
  ) {
    //kuch text h and fir bina shift k enter dabaya h
    let ticket = document.createElement("div");
    ticket.classList.add("ticket");
    let id = uid();
    let task = taskTyper.innerText;
    ticket.innerHTML = `<div class="ticket-color ticket-color-${selectedPriority}"></div>
                  <div class="ticket-id">${id}</div>
                 <div class="task">
                 ${task}
                 </div>`;

    document.querySelector(".modal").remove();
    modalVisible = false;
    ticket.addEventListener("click", function (e) {
      if (e.currentTarget.classList.contains("active-ticket")) {
        e.currentTarget.classList.remove("active-ticket");
      } else {
        e.currentTarget.classList.add("active-ticket");
      }
    });
    TC.appendChild(ticket);

    let allTaskData = localStorage.getItem("allTasks");
    if (allTaskData == null) {
      //if local storage has no data
      let data = [
        { TaskId: id, task: task, selectedPriority: selectedPriority },
      ]; //simply add data
      localStorage.setItem("allTasks", JSON.stringify(data));
    } else {
      let data = JSON.parse(allTaskData); //first get already stored data and then insert new data
      data.push({ TaskId: id, task: task, selectedPriority: selectedPriority });
      localStorage.setItem("allTasks", JSON.stringify(data));
    }

    addBtn.classList.remove("btn-active");
  } else if (e.key == "Enter" && e.shiftKey == false) {
    //kuch text nhi h aur enter dba dia
    e.preventDefault();
    alert("You have not added anything");
  }
}

//to delete a ticket
let deletedTicket = [];
deleteBtn.addEventListener("click", function (e) {
  let selectedTickets = document.querySelectorAll(".active-ticket");

  if (selectedTickets.length > 0) {
    deleteBtn.classList.add("btn-active");
    let allTaskData = localStorage.getItem("allTasks");
    let data = JSON.parse(allTaskData);

    for (let i = 0; i < selectedTickets.length; i++) {
      deletedTicket[i] = selectedTickets[i].innerText.split("\n")[0]; //store id of all selected tickets in an array
      selectedTickets[i].remove(); //remove them from ticket container
    }

    for (let item = 0; item < deletedTicket.length; item++) {
      //run loop on all selected ids
      let deleteItem = deletedTicket[item];
      data = data.filter((e) => {
        //remove the selected ids from data array using filter method
        return e.TaskId != deleteItem;
      });
      localStorage.setItem("allTasks", JSON.stringify(data)); //update localStorage
    }
    deleteBtn.classList.remove("btn-active");
  } else {
    alert("No Ticket selected");
  }
});

setInterval(function () {
  //for notes app title animation
  title.classList.add("title-animation");
}, 1000);

//hover 
refresh.addEventListener("mouseover", function () {
  //hover on refresh button
  hoverRefresh.classList.add("hover-refresh-active");
  hoverRefresh.innerText = "Clear";
  setTimeout(function () {
    hoverRefresh.classList.remove("hover-refresh-active");
    hoverRefresh.innerText = "";
  }, 1000);
});

refresh.addEventListener("click",function(){//click on referesh button
  container.innerText="";
  localStorage.clear();//clear local storage
})

editBtn.addEventListener("mouseover", function () {
  //hover on edit button
  editHover.classList.add("hover-refresh-active");
  editHover.innerText = "Edit";
  setTimeout(function () {
    editHover.classList.remove("hover-refresh-active");
    editHover.innerText = "";
  }, 1000);
});


//choose ticket using colour
for (let i of allFilters) {
  i.addEventListener("click", chooseTicket);
}
function chooseTicket(e) {
  container.innerText = "";
  let allTaskData = localStorage.getItem("allTasks");
  let data = JSON.parse(allTaskData);
  let targetColour = e.currentTarget.children[0].classList[0].split("-")[0];

  for (j in data) {
    if (data[j].selectedPriority == targetColour) {
      let ticket = document.createElement("div");
      ticket.classList.add("ticket");
      ticket.innerHTML = `<div class="ticket-color ticket-color-${data[j].selectedPriority}"></div>
                        <div class="ticket-id">${data[j].TaskId}</div>
                         <div class="task">
                        ${data[j].task}
                        </div>`;
      TC.appendChild(ticket);
    }
  }
}

//to edit tickets
editBtn.addEventListener("click", function () {
  let tasks = document.querySelectorAll(".ticket-container .ticket .task");

  for (let i of tasks) {
    let text = i.innerText; //store old data of ticket
    i.contentEditable = true;

    i.addEventListener("keypress", function (e) {
      if (e.key == "Enter" && e.shiftKey == false && i.innerText.trim() != "") {
        i.contentEditable = false;
        let allTaskData = localStorage.getItem("allTasks");
        let data = JSON.parse(allTaskData);
        for (let j = 0; j < data.length; j++) {
          if (data[j].task == text) {
            //data storage ka koi data jo ticket k purane data k same ho
            data[j].task = i.innerText; //uska data new data se update krdo
            localStorage.setItem("allTasks", JSON.stringify(data)); //update localStorage
          }
        }
      }
    });
  }
});
