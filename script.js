// Initialize an empty array to store shopping list items
const shoppingList = [];
//get reference to the DOM  elements
const itemInput = document.getElementById('itemInput')
const addButton = document.getElementById('addButton')
const shoppingListContainer = document.getElementById('shoppingList')
const clearButton = document.getElementById('clearButton')
const markPurchasedButton = document.getElementById('markPurchasedButton');
//Function to add an item to the shopping list
function addItem() {
    const itemText = itemInput.value.trim();
    if (itemText === "") {
        alert("Please enter an item.");
        return;
    }
    shoppingList.push(itemText); // Store the item in the array
    const li =document.createElement('li');
    li.textContent = itemText; // Set its text content
    shoppingListContainer.appendChild(li);
    itemInput.value = ""; // Clear input field
    
}
// Function to mark an item as purchased
function markPurchased() {
    const selectedItem = document.querySelector('.selected'); // Select the currently highlighted item
    if (selectedItem) {
        selectedItem.classList.toggle('purchased'); // Toggle the 'purchased' class
        selectedItem.classList.remove('selected'); // Remove selection after marking
        } else {
            alert("Please select an item to mark as purchased."); // Alert if no item is selected
    }

 }
 function clearList() {
    shoppingListContainer.innerHTML = ""; // Clear all items from the list
    shoppingList.length = 0; // Clear the array as well
}
//add event listeners for your buttons 
addButton.addEventListener('click', addItem);
markPurchasedButton.addEventListener('click', markPurchased);
clearButton.addEventListener('click', clearList);





