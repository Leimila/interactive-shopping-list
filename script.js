const BASE_URL = 'https://yourserver.com/api/shopping-list';

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
                updateItemOnServer(index, newText); // Update item on server
                shoppingList[index] = newText; // Update the array with new text
                li.textContent = newText; // Update the displayed text
                console.log(`Item edited: ${newText}`); // Log edited item
            }
        }
    });

    return li;
}

// Function to add an item to the shopping list
async function addItem() {
    const itemText = itemInput.value.trim();
    if (itemText === "") {
        alert("Please enter an item.");
        return;
    }

    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: itemText }) // Sending item as JSON
    });

    if (response.ok) {
        const newItem = await response.json(); // Get the newly added item from response
        shoppingList.push(newItem.name); // Store the item in the array
        console.log("Current shopping list after adding:", shoppingList);

        const li = createListItem(newItem.name); // Create list item using the new function
        shoppingListContainer.appendChild(li);
        console.log("Updated DOM: Added item to shopping list container."); // Log DOM update
        itemInput.value = ""; // Clear input field

    } else {
        console.error("Failed to add item:", response.statusText);
    }
}

// Function to mark an item as purchased
async function markPurchased() {
    const selectedItem = document.querySelector('.selected'); // Select the currently highlighted item
    if (selectedItem) {
        selectedItem.classList.toggle('purchased'); // Toggle the 'purchased' class for strikethrough effect
        console.log(`Marked as purchased: ${selectedItem.textContent}`); // Log purchased item
        
        const index = shoppingList.indexOf(selectedItem.textContent);
        
        if (index > -1) {
            await deleteItemFromServer(index); // Call function to delete from server
            shoppingList.splice(index, 1); // Remove from local array
            selectedItem.remove(); // Remove from DOM
            console.log(`Removed ${selectedItem.textContent} from shopping list.`);
            saveToLocalStorage(); // Save changes to local storage after marking as purchased
        }
        
    } else {
        alert("Please select an item to mark as purchased."); // Alert if no item is selected
        console.log("No item selected for marking as purchased."); // Log alert condition
    }
}

// Function to clear the list and delete all items from server
async function clearList() {
    for (const item of shoppingList) {
        await deleteItemFromServer(item); // Call function to delete each item from server
    }
    
    shoppingListContainer.innerHTML = ""; // Clear all items from the list display
    shoppingList.length = 0; // Clear the array as well
    console.log("Shopping list cleared."); // Log clearing action

    localStorage.removeItem('shoppingList'); // Clear local storage as well
}

// Function to save items to local storage
function saveToLocalStorage() {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

// Load items from local storage when page loads and fetch from server if needed
window.onload = async function() {
    const storedItems = JSON.parse(localStorage.getItem('shoppingList'));
    
    if (storedItems) {
        for (const item of storedItems) {
            shoppingList.push(item); // Add each stored item to the array
            
            const li = createListItem(item); // Use createListItem for loading items
            shoppingListContainer.appendChild(li);
            console.log(`Loaded from local storage: ${item}`); // Log loading action
            
            await fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: item }) }); 
            console.log(`Added ${item} back to server.`);
        }
        
        console.log("Loaded all items from local storage into DOM."); // Log completion of loading items
        
    } else {
        console.log("No items found in local storage."); // Log if no items are found
        
        const response = await fetch(BASE_URL);
        
        if (response.ok) {
            const data = await response.json();
            data.forEach(item => {
                shoppingList.push(item.name);
                const li = createListItem(item.name);
                shoppingListContainer.appendChild(li);
                console.log(`Loaded from server: ${item.name}`);
            });
            
            console.log("Loaded all items from server into DOM.");
            
        } else {
            console.error("Failed to load items from server:", response.statusText);
        }
    }
};

// Function to update an existing item's name on the server
async function updateItemOnServer(index, newName) {
    const response = await fetch(`${BASE_URL}/${index}`, {  // Assuming index corresponds to a unique identifier on your backend.
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
    });

    if (!response.ok) {
        console.error("Failed to update item on server:", response.statusText);
    }
}

// Function to delete an item from the server based on its index or identifier.
async function deleteItemFromServer(index) {
    const response = await fetch(`${BASE_URL}/${index}`, { 
        method: 'DELETE'
    });

    if (!response.ok) {
        console.error("Failed to delete item from server:", response.statusText);
    }
}

// Add event listeners for buttons 
addButton.addEventListener('click', addItem);
markPurchasedButton.addEventListener('click', markPurchased);
clearButton.addEventListener('click', clearList);