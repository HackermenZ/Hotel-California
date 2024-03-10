const usernameInput =document.getElementById('username-input');
const allUsernamesDiv = document.getElementById('all-usernames');
const greetingDiv=document.getElementById('greeting-text');
async function processInput(){
    const username=usernameInput.value;
    const response=await fetch(`/user/${username}`);
    const data=await response.json();
    console.log(data);
    console.log(username);
    greetingDiv.textContent=`name: ${data[0].customerName}, Room No.: ${data[0].roomNo}, E-mail: ${data[0].customerEmail} , mobile: ${data[0].customerMobile}`;
}
async function showAllUsernames() {
    const response = await fetch('/allUsers');
    const allUsernames = await response.json();
    console.log(allUsernames);
    const usernamesText = allUsernames.map(user => `Username: ${user.username}`).join('\n');
    allUsernamesDiv.textContent = usernamesText;
}

/*
document.addEventListener('DOMContentLoaded', () => {
    const fetchDataButton = document.getElementById('fetchDataButton');
    fetchDataButton.addEventListener('click', fetchData);
});
*/

async function fetchData() {
    try {
        const response = await fetch('/api/customers');
        const customers = await response.json();
        populateTable(customers);
    } catch (error) {
        console.error(error);
        alert('Error fetching data');
    }
}

function populateTable(customers) {
    const tableBody = document.getElementById('customerTableBody');
    // Clear existing rows
    tableBody.innerHTML = '';

    customers.forEach(customer => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = customer.customerName;
        row.insertCell(1).textContent = customer.customerID;
        row.insertCell(2).textContent = customer.customerMobile;
        row.insertCell(3).textContent = customer.customerEmail;
    });
}




function submitForm() {
    // Redirect to the login page
    window.location.href = 'login.html';
}


//



async function fetchDataRoom() {
    try {
        const response = await fetch('/api/rooms');
        const rooms = await response.json();
        populateTableRoom(rooms);
    } catch (error) {
        console.error(error);
        alert('Error fetching data');
    }
}



/*RoomTable
function populateTableRoom(rooms) {
    const tableBody = document.getElementById('roomTableBody');
    // Clear existing rows
    tableBody.innerHTML = '';

    rooms.forEach(room => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = room.roomNo;
        row.insertCell(1).textContent = room.roomType;
        row.insertCell(2).textContent = room.employeeID;
        row.insertCell(3).textContent = room.price;
        row.insertCell(4).textContent = room.availability;
        


        const bookButtonCell = row.insertCell(5);
        const bookButton = document.createElement('button');
        bookButton.textContent = 'Book';
        bookButton.addEventListener('click', () =>{ bookRoom(room);
        });
        bookButtonCell.appendChild(bookButton);
       


    });
}
*/



function populateTableRoom(rooms) {
    const tableBody = document.getElementById('roomTableBody');
    // Clear existing rows
    tableBody.innerHTML = '';

    rooms.forEach(room => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = room.roomNo;
        row.insertCell(1).textContent = room.roomType;
        row.insertCell(2).textContent = room.employeeID;
        row.insertCell(3).textContent = room.price;
        row.insertCell(4).textContent = room.availability;

        // New cell for room image
        const roomImageCell = row.insertCell(5);
        const roomImage = document.createElement('img');
        roomImage.src = `${room.roomImage}`; // Adjust the path based on your setup
        roomImage.style.width = '300px'; // Adjust the width as needed
        roomImage.style.height = '150px'; // Adjust the height as needed
        roomImageCell.appendChild(roomImage);

        // Existing cells for 'Book' button
        const bookButtonCell = row.insertCell(6);
        const bookButton = document.createElement('button');
        bookButton.textContent = 'Book';
        bookButton.addEventListener('click', () => { bookRoom(room); });
        bookButtonCell.appendChild(bookButton);
    });
}



/*
function bookRoom(room) {
    const cartList = document.getElementById('cartList');
    const listItem = document.createElement('li');
    listItem.textContent = `Room No: ${room.roomNo}, Type: ${room.roomType}, Price: ${room.price}`;
    cartList.appendChild(listItem);
}
*/



function bookRoom(room) {
    const cartList = document.getElementById('cartList');
    const listItem = document.createElement('li');
    if(room.availability==='NO'){
        alert('Room not available');
        return;
    }
    const roomImage2=document.createElement('img');
    roomImage2.src = `${room.roomLink}`; // Adjust the path based on your setup
    roomImage2.style.width = '150px'; // Adjust the width as needed
    roomImage2.style.height = '75px'; // Adjust the height as needed
    listItem.textContent = `Room No: ${room.roomNo}, Type: ${room.roomType}, Price: ${room.price}, Image:`;
    listItem.appendChild(roomImage2);
    cartList.appendChild(listItem);

    // Call the server to update the database
    
    bookRoomOnServer(room.roomNo);
}


/*
function bookRoom(room) {
    const cartList = document.getElementById('cartList');
    const listItem = document.createElement('li');
    listItem.textContent = `Room No: ${room.roomNo}, Type: ${room.roomType}, Price: ${room.price}`;
    cartList.appendChild(listItem);

    // Update the room's availability in the HTML table
    const table = document.getElementById('roomTable');
    const rows = table.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length > 0 && cells[0].textContent === room.roomNo) {
            // Assuming availability is in the 5th column (index 4)
            cells[4].textContent = 'no';
            break;
        }
    }

    // Call the server to update the database
    bookRoomOnServer(room.roomNo);
}
*/



//
async function bookRoomOnServer(roomNo) {
    try {
        const response = await fetch(`/api/bookRoom/${roomNo}`, {
            method: 'GET',
        });

        if (response.ok) {
            console.log('Room booked successfully on the server');
        } else {
            console.error('Failed to book the room on the server');
        }
    } catch (error) {
        console.error('Error while booking the room:', error);
    }
}


//
// Add this function to enable the image slider
function startImageSlider() {
    const slider = document.querySelector('.slider');
    let counter = 0;

    function updateSlider() {
        slider.style.transform = `translateX(${-counter * 100}%)`;
    }

    // Change slide every 3 seconds (adjust the interval as needed)
    setInterval(() => {
        counter = (counter + 1) % 4; // Assuming you have 4 images
        updateSlider();
    }, 3000); // 3000 milliseconds (3 seconds)
}

// Add this line at the end of your existing script.js file
startImageSlider();

