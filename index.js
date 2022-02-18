// columns 
const listColumns = document.querySelectorAll('.drag-item-list');
const todoList = document.querySelector('#todo-list');
const progressList = document.querySelector('#progress-list');
const doneList = document.querySelector('#done-list');

// buttons 
const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveBtns = document.querySelectorAll('.solid');
// Add container
const addItemContainers = document.querySelectorAll('.add-container');
//Add div
const addItem = document.querySelectorAll('.add-item');


let updatedOnLoad = false;

let todoListArray = [];
let progressListArray = [];
let doneListArray = [];
let listArrays = [];


let draggeditem;
let dragging = false;
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




// Filter Arrays to remove empty items

function filterArray(array){
    // console.log(array);

    const filteredArray = array.filter(item => item !== null);
    return filteredArray;
}


// // create li 

function createEl(columnEl, column , item, index){
    
    // Creating new element
    let newEl = document.createElement('li');
    newEl.classList.add('drag-item');
    newEl.id = index;
    newEl.draggable = true;
    newEl.contentEditable = true;
    // Each item has index
    newEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
    newEl.setAttribute('ondragstart', 'drag(event)');
    newEl.innerHTML = `${item} <div class="icons">
    <i class="las la-pen" style="font-size: 24px;"></i> 
    <i class="las la-minus-circle" style="font-size: 24px;"></i>
    </div>`;

    
    //Append
    columnEl.appendChild(newEl);

}




function updateDom(){
    // check localstorage once
    if(!updatedOnLoad){
        getSavedItems()
    }
    
    todoList.textContent = '';
    todoListArray.forEach((todoEl, index) => {
        createEl(todoList, 0 , todoEl , index);
    });

    todoListArray = filterArray(todoListArray);
    
    progressList.textContent = '';
    progressListArray.forEach((progressEl, index) => {
        createEl(progressList, 1, progressEl , index);
    });
    progressListArray = filterArray(progressListArray)

    doneList.textContent = '';
    doneListArray.forEach((doneEl, index) => {
        createEl(doneList, 2, doneEl , index)
    })
    progressListArray = filterArray(progressListArray);

    // Run SavedItems only once
    updatedOnLoad = true; 
    updateSavedItems()
}





// update item if null remove

function updateItem(id, column) {
    const selectedArray = listArrays[column];
    const selectedColumnEl = listColumns[column].children;

    if(!dragging){
        if(selectedColumnEl[id].textContent == "") {
            delete selectedArray[id]
             updateDom()
        } else {
            selectedArray[id] = selectedColumnEl[id].textContent;
            updateDom()
            
        }
    }
}  

// // add text to column 
function addToColumn(column){

    if(addItem[column].textContent !== ""){
        listArrays[column].push(addItem[column].textContent);
        addItem[column].textContent = null;
        updateDom(column);
    }
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
    dragging = true;
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

    // completed dragging 
    dragging = false;
    rebuildArrays()
}

updateDom()


// const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
// const saveItemBtns = document.querySelectorAll('.solid');
// const addItemContainers = document.querySelectorAll('.add-container');
// const addItems = document.querySelectorAll('.add-item');
// // Item Lists
// const listColumns = document.querySelectorAll('.drag-item-list');
// const backlogListEl = document.getElementById('backlog-list');
// const progressListEl = document.getElementById('progress-list');
// const completeListEl = document.getElementById('complete-list');
// const onHoldListEl = document.getElementById('on-hold-list');

// // Items
// let updatedOnLoad = false;

// // Initialize Arrays
// let backlogListArray = [];
// let progressListArray = [];
// let completeListArray = [];
// let onHoldListArray = [];
// let listArrays = [];

// // Drag Functionality
// let draggedItem;
// let dragging = false;
// let currentColumn;

// // Get Arrays from localStorage if available, set default values if not
// function getSavedColumns() {
//   if (localStorage.getItem('backlogItems')) {
//     backlogListArray = JSON.parse(localStorage.backlogItems);
//     progressListArray = JSON.parse(localStorage.progressItems);
//     completeListArray = JSON.parse(localStorage.completeItems);
//     onHoldListArray = JSON.parse(localStorage.onHoldItems);
//   } else {
//     backlogListArray = ['Release the course', 'Sit back and relax'];
//     progressListArray = ['Work on projects', 'Listen to music'];
//     completeListArray = ['Being cool', 'Getting stuff done'];
//     onHoldListArray = ['Being uncool'];
//   }
// }

// // Set localStorage Arrays
// function updateSavedColumns() {
//   listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
//   const arrayNames = ['backlog', 'progress','complete', 'onHold'];
//   arrayNames.forEach((arrayName, index) => {
//     localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
//   });
// }

// // Filter Array to remove empty values
// function filterArray(array) {
//   const filteredArray = array.filter(item => item !== null);
//   return filteredArray;
// }

// // Create DOM Elements for each list item
// function createItemEl(columnEl, column, item, index) {
//   // List Item
//   const listEl = document.createElement('li');
//   listEl.textContent = item;
//   listEl.id = index;
//   listEl.classList.add('drag-item');
//   listEl.draggable = true;
//   listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
//   listEl.setAttribute('ondragstart', 'drag(event)');
//   listEl.contentEditable = true;
//   // Append
//   columnEl.appendChild(listEl);
// }

// // Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
// function updateDOM() {
//   // Check localStorage once
//   if (!updatedOnLoad) {
//     getSavedColumns();
//   }
//   // Backlog Column
//   backlogListEl.textContent = '';
//   backlogListArray.forEach((backlogItem, index) => {
//     createItemEl(backlogListEl, 0, backlogItem, index);
//   });
//   backlogListArray = filterArray(backlogListArray);
//   // Progress Column
//   progressListEl.textContent = '';
//   progressListArray.forEach((progressItem, index) => {
//     createItemEl(progressListEl, 1, progressItem, index);
//   });
//   progressListArray = filterArray(progressListArray);
//   // Complete Column
//   completeListEl.textContent = '';
//   completeListArray.forEach((completeItem, index) => {
//     createItemEl(completeListEl, 2, completeItem, index);
//   });
//   completeListArray = filterArray(completeListArray);
//   // On Hold Column
//   onHoldListEl.textContent = '';
//   onHoldListArray.forEach((onHoldItem, index) => {
//     createItemEl(onHoldListEl, 3, onHoldItem, index);
//   });
//   onHoldListArray = filterArray(onHoldListArray);
//   // Don't run more than once, Update Local Storage
//   updatedOnLoad = true;
//   updateSavedColumns();
// }

// // Update Item - Delete if necessary, or update Array value
// function updateItem(id, column) {
//   const selectedArray = listArrays[column];
//   const selectedColumn = listColumns[column].children;
//   if (!dragging) {
//     if (!selectedColumn[id].textContent) {
//       delete selectedArray[id];
//     } else {
//       selectedArray[id] = selectedColumn[id].textContent;
//     }
//     updateDOM();
//   }
// }

// // Add to Column List, Reset Textbox
// function addToColumn(column) {
//   const itemText = addItems[column].textContent;
//   const selectedArray = listArrays[column];
//   selectedArray.push(itemText);
//   addItems[column].textContent = '';
//   updateDOM(column);
// }

// // Show Add Item Input Box
// function showInputBox(column) {
//   addBtns[column].style.visibility = 'hidden';
//   saveItemBtns[column].style.display = 'flex';
//   addItemContainers[column].style.display = 'flex';
// }

// // Hide Item Input Box
// function hideInputBox(column) {
//   addBtns[column].style.visibility = 'visible';
//   saveItemBtns[column].style.display = 'none';
//   addItemContainers[column].style.display = 'none';
//   addToColumn(column);
// }

// // Allows arrays to reflect Drag and Drop items
// function rebuildArrays() {
//   backlogListArray = [];
//   for (let i = 0; i < backlogListEl.children.length; i++) {
//     backlogListArray.push(backlogListEl.children[i].textContent);
//   }
//   progressListArray = [];
//   for (let i = 0; i < progressListEl.children.length; i++) {
//     progressListArray.push(progressListEl.children[i].textContent);
//   }
//   completeListArray = [];
//   for (let i = 0; i < completeListEl.children.length; i++) {
//     completeListArray.push(completeListEl.children[i].textContent);
//   }
//   onHoldListArray = [];
//   for (let i = 0; i < onHoldListEl.children.length; i++) {
//     onHoldListArray.push(onHoldListEl.children[i].textContent);
//   }
//   updateDOM();
// }

// // When Item Starts Dragging
// function drag(e) {
//   draggedItem = e.target;
//   dragging = true;
// }

// // Column Allows for Item to Drop
// function allowDrop(e) {
//   e.preventDefault();
// }

// // When Item Enters Column Area
// function dragEnter(column) {
//   listColumns[column].classList.add('over');
//   currentColumn = column;
// }

// // Dropping Item in Column
// function drop(e) {
//   e.preventDefault();
//   const parent = listColumns[currentColumn];
//   // Remove Background Color/Padding
//   listColumns.forEach((column) => {
//     column.classList.remove('over');
//   });
//   // Add item to Column
//   parent.appendChild(draggedItem);
//   // Dragging complete
//   dragging = false;
//   rebuildArrays();
// }

// // On Load
// updateDOM();
