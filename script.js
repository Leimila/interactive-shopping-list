// Initialize an empty array to store shopping list items
const shoppingList = [];

// Get reference to the DOM elements
const itemInput = document.getElementById('itemInput');
const addButton = document.getElementById('addButton');
const shoppingListContainer = document.getElementById('shoppingList');
const clearButton = document.getElementById('clearButton');
const markPurchasedButton = document.getElementById('markPurchasedButton');

// Function to create a list item
function createListItem(text) {
    const li = document.createElement('li');
    li.textContent = text; // Set its text content

    // Add click event listener for selecting and editing
    li.addEventListener('click', function() {
        li.classList.toggle('selected'); // Toggle selection on click
        console.log(`Item selected: ${li.textContent}`); // Log selected item

        // Edit functionality
        const newText = prompt("Edit your item:", li.textContent);
        if (newText !== null && newText.trim() !== "") {
            const index = shoppingList.indexOf(li.textContent);
            if (index > -1) {
                shoppingList[index] = newText; // Update the array with new text
                li.textContent = newText; // Update the displayed text
                console.log(`Item edited: ${newText}`); // Log edited item
                saveToLocalStorage(); // Save changes to local storage
            }
        }
    });

    return li;
}

// Function to add an item to the shopping list
function addItem() {
    const itemText = itemInput.value.trim();
    if (itemText === "") {
        alert("Please enter an item.");
        return;
    }
    
    shoppingList.push(itemText); // Store the item in the array
    console.log("Current shopping list after adding:", shoppingList);

    const li = createListItem(itemText); // Create list item using the new function
    shoppingListContainer.appendChild(li);
    console.log("Updated DOM: Added item to shopping list container."); // Log DOM update
    itemInput.value = ""; // Clear input field

    saveToLocalStorage(); // Save changes to local storage
}

// Function to mark an item as purchased
function markPurchased() {
    const selectedItem = document.querySelector('.selected'); // Select the currently highlighted item
    if (selectedItem) {
        selectedItem.classList.toggle('purchased'); // Toggle the 'purchased' class for strikethrough effect
        console.log(`Marked as purchased: ${selectedItem.textContent}`); // Log purchased item
        selectedItem.classList.remove('selected'); // Remove selection after marking
        
        saveToLocalStorage(); // Save changes to local storage after marking as purchased
    } else {
        alert("Please select an item to mark as purchased."); // Alert if no item is selected
        console.log("No item selected for marking as purchased."); // Log alert condition
    }
}

// Function to clear the list
function clearList() {
    shoppingListContainer.innerHTML = ""; // Clear all items from the list
    shoppingList.length = 0; // Clear the array as well
    console.log("Shopping list cleared."); // Log clearing action

    localStorage.removeItem('shoppingList'); // Clear local storage as well
}

// Function to save items to local storage
function saveToLocalStorage() {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

// Load items from local storage when page loads
window.onload = function() {
    const storedItems = JSON.parse(localStorage.getItem('shoppingList'));
    if (storedItems) {
        storedItems.forEach(item => {
            shoppingList.push(item); // Add each stored item to the array
            const li = createListItem(item); // Use createListItem for loading items
            shoppingListContainer.appendChild(li);
            console.log(`Loaded from local storage: ${item}`); // Log loading action
        });
        console.log("Loaded all items from local storage into DOM."); // Log completion of loading items
    } else {
        console.log("No items found in local storage."); // Log if no items are found
    }
};

// Add event listeners for  buttons 
addButton.addEventListener('click', addItem);
markPurchasedButton.addEventListener('click', markPurchased);
clearButton.addEventListener('click', clearList);