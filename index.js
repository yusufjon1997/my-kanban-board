// columns 
const listColumns = document.querySelectorAll('.drag-item-list');
const todoList = document.querySelector('#todo-list');
const progressList = document.querySelector('#progress-list');
const doneList = document.querySelector('#done-list');

// buttons 
const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItem = document.querySelectorAll('.add-item');


let updatedOnLoad = false;

let todoListArray = [];
let progressListArray = [];
let doneListArray = [];
let listArrays = [];


let draggeditem;
let currentColumn;

function getSavedItems(){
    if(localStorage.getItem('todoItems')){
        todoListArray = JSON.parse(localStorage.todoItems);
        progressListArray = JSON.parse(localStorage.progressItems);
        doneListArray = JSON.parse(localStorage.doneItems);
    } else {
        todoListArray = ['Work hard', 'Work smart'];
        progressListArray = ['working less', 'lying on the bed'];
        doneListArray = ['nothing', 'nothing', 'Nothing']
    }
}

/// save array elements to localstorage

function updateSavedItems(){
    
    listArrays = [todoListArray, progressListArray, doneListArray];
    
    const arrayNames = ['todo', 'progress', 'done'];
    arrayNames.forEach((arrayName , index) => {
        localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
    })
}


// show input box
function showAddContainer(column){
    addBtns[column].style.visibility = 'hidden';
    saveBtns[column].style.display = 'flex'
    addItemContainers[column].style.display = 'flex'
}

// // hide input box 
function hideAddContainer(column) {
    addBtns[column].style.visibility = 'visible';
    saveBtns[column].style.display = 'none';
    addItemContainers[column].style.display = 'none';
    addToColumn(column);
}

// // add text to column 
function addToColumn(column){

    if(addItem[column].textContent !== ""){
        listArrays[column].push(addItem[column].textContent);
        addItem[column].textContent = null;
        updateDom(column);
    }
}


// // create li 

function createEl(column , item){
    let newEl = document.createElement('li');
    newEl.classList.add('drag-item');
    newEl.textContent = item;
    newEl.draggable = true;
    newEl.contentEditable = true;
    newEl.setAttribute('ondragstart', 'drag(event)')
    column.appendChild(newEl);
}


function updateDom(){
    // check localstorage once
    if(!updatedOnLoad){
        getSavedItems()
    }
    
    todoList.textContent = '';
    todoListArray.forEach(todoEl => {
        createEl(todoList, todoEl);
    });
    
    progressList.textContent = '';
    progressListArray.forEach(progressEl => {
        createEl(progressList, progressEl);
    });

    doneList.textContent = '';
    doneListArray.forEach(doneEl => {
        createEl(doneList, doneEl)
    })

    // Run SavedItems only once
    updatedOnLoad = true; 
    updateSavedItems()
}



/// update arrays with new values in each column

function rebuildArrays(){
    
    todoListArray = [];
    for(let i=0; i < todoList.children.length; i++){
        todoListArray.push(todoList.children[i].textContent);
    }

    progressListArray = [];
    for(let i=0; i < progressList.children.length; i++){
        progressListArray.push(progressList.children[i].textContent);
    }

    doneListArray = [];
    for(let i=0; i < doneList.children.length; i++){
        doneListArray.push(doneList.children[i].textContent);
    }
    updateDom();
}


/// When items start dragging 
function drag(e) {
    draggeditem = e.target;
    console.log(draggeditem)
}


// when item enters column area
function dragEnter(column){
    listColumns[column].classList.add('over');
    //assign current column 
    currentColumn = column;
}


// columns allow to receive
function allowDrop(e){
    e.preventDefault();
}


// dropping element to column
function drop(e){
    e.preventDefault();
    // Remove background color and padding
    listColumns.forEach(column => {
        column.classList.remove('over');
    })

    // Add item to column 
    const parent = listColumns[currentColumn];
    parent.appendChild(draggeditem);
    rebuildArrays()
}



updateDom()