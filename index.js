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
