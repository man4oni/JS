const STORAGE = "sessionStorage";
const TODOS_STORAGE_KEYS = "todos";
const TODOS_REMOTE_KEY = "remoteTodos"

const addToDoBtn = document.getElementById("add-to-do-btn");
const remoteToDoBtn = document.getElementById("remoteToDo");
const toDoContainerDone = document.querySelector("#to-do-container-done");
const toDoContainerInProgress = document.querySelector(
  "#to-do-container-in-progress"
);
const toDoInput = document.getElementsByTagName("input")[0];

let toDos = [];
let toDosRem =[];

async function getApi(){

fetch('https://jsonplaceholder.typicode.com/todos')
.then((response) => response.json())
  .then((data) => {
    toDosRem = data.filter((el,ids)=>ids<10);
    renderRemToDos();
    console.log(toDosRem);
  })
  
}

function saveToDos() {
  window[STORAGE].setItem(TODOS_STORAGE_KEYS, JSON.stringify(toDos));
  window[STORAGE].setItem(TODOS_REMOTE_KEY, JSON.stringify(toDosRem));
}

function loadToDos() {
  const storedToDos = JSON.parse(window[STORAGE].getItem(TODOS_STORAGE_KEYS));
  const storedRemToDos = JSON.parse(window[STORAGE].getItem(TODOS_REMOTE_KEY));
  if (storedToDos) {
    toDos = storedToDos;
  }else  if (storedRemToDos) {
    toDosRem = storedRemToDos;
  }
}

function createToDoElement(todo) {
  const divElement = document.createElement("div");
  divElement.classList.add("to-do-instance");

  const pElement = document.createElement("p");
  pElement.textContent = todo.content;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.addEventListener("click", () => {
    deleteToDo(todo.content);
  });

  const divDate = document.createElement("div");
  divDate.classList.add("to-do-date");
  divDate.textContent = todo.date;

  const checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  checkBox.checked = todo.completed;
  checkBox.addEventListener("click", () => toggleDone(todo));

  divElement.appendChild(divDate);
  divElement.appendChild(checkBox);
  divElement.appendChild(pElement);
  divElement.appendChild(deleteBtn);

  return divElement;
}
function createRemToDoElement(todo) {
  const divEl = document.createElement("div");
  divEl.classList.add("to-do-instance");

  const pElement = document.createElement("p");
  pElement.textContent = todo.title;
  
  const hElement = document.createElement("h2");
  hElement.textContent = todo.id;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.addEventListener("click", () => {
    deleteToDo(todo.title);
  });

  const divDate = document.createElement("div");
  divDate.classList.add("to-do-date");
  divDate.textContent = todo.date;

  const checkBoxRem = document.createElement("input");
  checkBoxRem.setAttribute("type", "checkbox");
  checkBoxRem.checked = todo.completed;
  checkBoxRem.addEventListener("click", () => {
    todo.completed = !todo.completed
    renderRemToDos()});

  divEl.appendChild(divDate);
  divEl.appendChild(checkBoxRem);
  divEl.appendChild(hElement);
  divEl.appendChild(pElement);
  divEl.appendChild(deleteBtn);

  return divEl;
}

function renderRemToDos(){
  toDoContainerDone.innerHTML = "";
  toDoContainerInProgress.innerHTML = "";
    toDosRem.forEach((el)=>{
      const newRemToDoElement = createRemToDoElement(el); 
      if (el.completed) {
        toDoContainerDone.appendChild(newRemToDoElement);
      } else {
        toDoContainerInProgress.appendChild(newRemToDoElement);
      }
    });
  }

function renderToDos() {
  toDoContainerDone.innerHTML = "";
  toDoContainerInProgress.innerHTML = "";

  toDos.forEach((todo) => {
    const newToDoElement = createToDoElement(todo);
    if (todo.completed) {
      toDoContainerDone.appendChild(newToDoElement);
    } else {
      toDoContainerInProgress.appendChild(newToDoElement);
    }
  });
}

function addToDo() {
  const validText = toDoInput.value.trim();
  if (!validText){ alert("Not good");}

  const toDoObj = {
    content: validText,
    date: new Date(Date.now()).toLocaleDateString(),
    completed: false,
  };

  toDos.push(toDoObj);
  toDoInput.value = "";
  saveToDos();
  renderToDos();
}

function deleteToDo(todo) {
  toDos = toDos.filter((el) => el.content !== todo);
  toDosRem = toDosRem.filter((el) => el.title !== todo);

  saveToDos();
  loadToDos();
  renderToDos();
  renderRemToDos();
}

function toggleDone(todo) {
  todo.completed = !todo.completed;
  renderToDos();
}

loadToDos();
renderToDos();
renderRemToDos();


addToDoBtn.addEventListener("click", addToDo);
remoteToDoBtn.addEventListener('click',() => {    
  getApi();
});  
toDoInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    addToDo();
  }
});