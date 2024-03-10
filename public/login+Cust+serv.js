//loginCustomer.js
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'home2.html';
        } else {
            errorMessage.textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessage.textContent = 'An error occurred. Please try again later.';
    });
});



//home2.js

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


// JavaScript code for Google Maps
function initMap() {
    // Replace the latitude and longitude with your desired location
    var location = {lat: 34.0522, lng: -118.2437}; // Example: Los Angeles, CA
    
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: location
    });
    
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}


//roomCustomer.js
document.addEventListener('DOMContentLoaded', () => {
    const roomTable = document.getElementById('roomTable');
    const roomTableBody = document.getElementById('roomTableBody');
    const roomDetailsModal = document.getElementById('roomDetailsModal');
    const bookingFormModal = document.getElementById('bookingFormModal');
    const roomDetailsContent = document.getElementById('roomDetails');
    const bookingForm = document.getElementById('bookingForm');
    let selectedRoom;

    // Fetch and display room list when the page loads
    fetchRoomList();

    // Function to fetch and display room list
    async function fetchRoomList() {
        try {
            const response = await fetch('/api/rooms/all'); // Replace with your API endpoint
            const rooms = await response.json();
            populateRoomTable(rooms);
        } catch (error) {
            console.error(error);
            alert('Error fetching room data');
        }
    }

    // Function to populate the room table with data
    function populateRoomTable(rooms) {
        roomTableBody.innerHTML = '';

        rooms.forEach(room => {
            const row = roomTableBody.insertRow();
            row.insertCell(0).textContent = room.roomNo;
            row.insertCell(1).textContent = room.roomType;
            row.insertCell(2).textContent = room.employeeID;
            row.insertCell(3).textContent = room.price;
            row.insertCell(4).textContent = room.availability;

            // Add room image
            const roomImageCell = row.insertCell(5);
            const roomImage = document.createElement('img');
            roomImage.src = `${room.roomImage}`; // Adjust the path based on your setup
            roomImage.style.width = '100px'; // Adjust the width as needed
            roomImage.style.height = '75px'; // Adjust the height as needed
            roomImageCell.appendChild(roomImage);

            // Add show info button
            const showInfoButtonCell = row.insertCell(6);
            const showInfoButton = document.createElement('button');
            showInfoButton.textContent = 'Show Info';
            showInfoButton.addEventListener('click', () => showRoomDetails(room));
            showInfoButtonCell.appendChild(showInfoButton);
        });
    }

    // Function to show room details
    function showRoomDetails(room) {
        selectedRoom = room;
        const roomDetails = document.getElementById('roomDetails');
        roomDetails.innerHTML = `
            <p><strong>Room No:</strong> ${room.roomNo}</p>
            <p><strong>Room Type:</strong> ${room.roomType}</p>
            <p><strong>Assigned Employee ID:</strong> ${room.employeeID}</p>
            <p><strong>Price:</strong> ${room.price}</p>
            <p><strong>Availability:</strong> ${room.availability}</p>
            <p><strong>Room Image:</strong></p>
            <img src="${room.roomImage}" width="200" height="150">
        `;
        roomDetailsModal.style.display = 'block';
    }

    // Function to open booking form
    window.openBookingForm = () => {
        bookingFormModal.style.display = 'block';
    };

    // Function to close modals
    window.closeModal = () => {
        roomDetailsModal.style.display = 'none';
        bookingFormModal.style.display = 'none';
    };

    // Function to book a room
    window.bookRoom = () => {
        const checkInDate = document.getElementById('checkInDate').value;
        const checkOutDate = document.getElementById('checkOutDate').value;
        console.log('Booking room:', selectedRoom, 'Check-in:', checkInDate, 'Check-out:', checkOutDate);
        const name=localStorage.getItem('username');
        const pass=localStorage.getItem('password');

        // Call your backend API to book the room
        fetch('/api/bookRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomId: selectedRoom.roomNo,
                checkInDate,
                checkOutDate,
                name,
                pass
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Booking response:', data);
            // You can handle the response as needed
            // For example, display a success message or redirect to another page
            showSuccessMessage('Room booked successfully!');
            // Close the booking form modal
            closeModal();
        })
        .catch(error => {
            console.error('Error booking room:', error);
            // Display an error message if booking fails
            showErrorMessage('Error booking room. Please try again.');
        });
    };

    // Function to show success message
    function showSuccessMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message', 'success');
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);

        setTimeout(() => {
            messageContainer.remove();
        }, 5000); // Hide the message after 5 seconds
    }

    // Function to show error message
    function showErrorMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message', 'error');
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);

        setTimeout(() => {
            messageContainer.remove();
        }, 5000); // Hide the message after 5 seconds
    }
});
