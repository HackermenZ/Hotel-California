// //signUp.js
// let usName;
// let usPass;
// let usPhone;
// function submitForm() {
//     numberOfCustomerF=Math.random();
//     const customerID=Math.floor(numberOfCustomerF*1000000);
//     const username = document.getElementById('username').value;
//     usName = username;
//     const password = document.getElementById('password').value;
//     usPass = password;
//     const phoneNumber = document.getElementById('phoneNumber').value;
//     usPhone = phoneNumber;

//     // Create a JSON object with user information
//     const userInfo = {
//         customerID: customerID,
//         username: username,
//         password: password,
//         phoneNumber: phoneNumber
//     };
//         // Save user info to localStorage
//         localStorage.setItem('customerID2', customerID);
//         localStorage.setItem('userName2', username);
//         localStorage.setItem('password2', password);
//         localStorage.setItem('phoneNumber2', phoneNumber);

//     // Make a POST request to save user info
//     fetch('/saveUserInfo', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(userInfo)
//     })
//     .then(response => {
//         if (response.ok) {
//             console.log('User info saved successfully');
//             // Redirect to the next page
//             window.location.href = 'blank.html';
//         } else {
//             console.error('Failed to save user info');
//         }
//     })
//     .catch(error => {
//         console.error('Error saving user info:', error);
//     });
// }


// ///Next Page

// // blank.js
// const userInfoDiv = document.getElementById('userInfo');

// document.addEventListener('DOMContentLoaded', () => {
    

//     // Fetch room data when the page loads
//     fetchRoomData();

//     // Add event listener for room dropdown change
//     const roomDropdown = document.getElementById('roomDropdown');
//     roomDropdown.addEventListener('change', fetchRoomData);
//     userInfoDiv.textContent = `Welcome: ${localStorage.getItem('userName2')},CustomerID: ${localStorage.getItem('customerID2')} Password: ${localStorage.getItem('password2')}, Phone Number: ${localStorage.getItem('phoneNumber2')}`;
    
// });

// async function fetchRoomData() {
//     const roomDropdown = document.getElementById('roomDropdown');
//     const selectedOption = roomDropdown.value;

//     try {
//         let endpoint = '/api/rooms';  // Default endpoint to show all rooms

//         // Adjust the endpoint based on the selected option
//         switch (selectedOption) {
//             case 'number':
//                 const roomNumber = prompt('Enter Room Number:');
//                 if (!roomNumber) {
//                     return;  // User canceled the prompt
//                 }
//                 endpoint = `/api/rooms/${roomNumber}`;
//                 break;
//             case 'price':
//                  // Implement the logic to prompt and fetch rooms based on price range
//                  const minpriceNum = prompt('Enter Minimum Price:');
//                  const maxpriceNum = prompt('Enter Maximum Price:');
//                  console.log(minpriceNum, maxpriceNum);
//                  if (!minpriceNum || !maxpriceNum) {
//                      return;  // User canceled the prompt
//                  }
//                  endpoint = `/api/rooms/price/${minpriceNum}/${maxpriceNum}`;
//                  break;
//             case 'type':
//                  // Implement the logic to prompt and fetch rooms based on room type
//                  const roomType = prompt('Enter Room Type:');
//                  /*
//                  if (!roomType) {
//                      return;  // User canceled the prompt
//                  }
//                  */
//                  endpoint = `/api/rooms/type/${roomType}`;
//                  break;
//             default:
//                 // Default case for 'all' or any unrecognized option
//                 break;
//         }

//         const response = await fetch(endpoint);
//         const rooms = await response.json();
//         populateRoomTable(rooms);
//     } catch (error) {
//         console.error(error);
//         alert('Error fetching room data');
//     }
// }

// function populateRoomTable(rooms) {
//     const tableBody = document.getElementById('roomTableBody');
//     // Clear existing rows
//     tableBody.innerHTML = '';

//     rooms.forEach(room => {
//         const row = tableBody.insertRow();
//         row.insertCell(0).textContent = room.roomNo;
//         row.insertCell(1).textContent = room.roomType;
//         row.insertCell(2).textContent = room.employeeID;
//         row.insertCell(3).textContent = room.price;
//         row.insertCell(4).textContent = room.availability;

//         // New cell for room image
//         const roomImageCell = row.insertCell(5);
//         const roomImage = document.createElement('img');
//         roomImage.src = `${room.roomImage}`; // Adjust the path based on your setup
//         roomImage.style.width = '150px'; // Adjust the width as needed
//         roomImage.style.height = '75px'; // Adjust the height as needed
//         roomImageCell.appendChild(roomImage);
//           // Existing cells for 'Book' button
//         const bookButtonCell = row.insertCell(6);
//         const bookButton = document.createElement('button');
//         bookButton.textContent = 'Book';
//         bookButton.addEventListener('click', () => { bookRoom(room); });
//         bookButtonCell.appendChild(bookButton);
//     });
// }
// function bookRoom(room) {
//     const cartList = document.getElementById('cartList');
//     const listItem = document.createElement('li');
//     if(room.availability==='NO'){
//         alert('Room not available');
//         return;
//     }
//     const roomImage2=document.createElement('img');
//     roomImage2.src = `${room.roomImage}`; // Adjust the path based on your setup
//     roomImage2.style.width = '150px'; // Adjust the width as needed
//     roomImage2.style.height = '75px'; // Adjust the height as needed
//     listItem.textContent = `Room No: ${room.roomNo}, Type: ${room.roomType}, Price: ${room.price}, Image:`;
//     listItem.appendChild(roomImage2);
//     cartList.appendChild(listItem);

//     // Call the server to update the database
    
//     bookRoomOnServer(room.roomNo);
// }
// async function bookRoomOnServer(roomNo) {
//     try {
//         const response = await fetch(`/api/bookRoom/${roomNo}`, {
//             method: 'GET',
//         });

//         if (response.ok) {
//             console.log('Room booked successfully on the server');
//         } else {
//             console.error('Failed to book the room on the server');
//         }
//     } catch (error) {
//         console.error('Error while booking the room:', error);
//     }
// }



let usName;
let usPass;
let usPhone;
function submitForm() {
    const username = document.getElementById('username').value;
    //usereffect(()=>{localStorage.setItem('username',username);});
    //usName = username;
    const password = document.getElementById('password').value;
    //usereffect(()=>{localStorage.setItem('password',password);});
    //usPass = password;
    const phoneNumber = document.getElementById('phoneNumber').value;
    //usereffect(()=>{localStorage.setItem('phoneNumber',phoneNumber);});
    //usPhone = phoneNumber;

}

    // Create a JSON object with user information
    const userInfo = {
        username: username,
        password: password,
        phoneNumber: phoneNumber
    };
     // Save user info to localStorage
     localStorage.setItem('username', username);
     localStorage.setItem('password', password);
     localStorage.setItem('phoneNumber', phoneNumber);
 

    // Make a POST request to save user info
    fetch('/saveUserInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)
    })
    .then(response => {
        if (response.ok) {
            console.log('User info saved successfully');
            // Redirect to the next page
            window.location.href = 'blank.html';
        } else {
            console.error('Failed to save user info');
        }
    })
    .catch(error => {
        console.error('Error saving user info:', error);
    });



///Next Page

// blank.js
const userInfoDiv = document.getElementById('userInfo');

document.addEventListener('DOMContentLoaded', () => {
    

    // Fetch room data when the page loads
    fetchRoomData();

    // Add event listener for room dropdown change
    const roomDropdown = document.getElementById('roomDropdown');
    roomDropdown.addEventListener('change', fetchRoomData);
    //userInfoDiv.textContent = `Welcome: ${usName}, Password: ${usPass}, Phone Number: ${usPhone}`;
    userInfoDiv.textContent = `Welcome: ${localStorage.getItem('username')}, Password: ${localStorage.getItem('password')}, Phone Number: ${localStorage.getItem('phoneNumber')}`;
    
});

async function fetchRoomData() {
    const roomDropdown = document.getElementById('roomDropdown');
    const selectedOption = roomDropdown.value;

    try {
        let endpoint = '/api/rooms';  // Default endpoint to show all rooms

        // Adjust the endpoint based on the selected option
        switch (selectedOption) {
            case 'number':
                const roomNumber = prompt('Enter Room Number:');
                if (!roomNumber) {
                    return;  // User canceled the prompt
                }
                endpoint = `/api/rooms/${roomNumber}`;
                break;
            case 'price':
                 // Implement the logic to prompt and fetch rooms based on price range
                 const minpriceNum = prompt('Enter Minimum Price:');
                 const maxpriceNum = prompt('Enter Maximum Price:');
                 console.log(minpriceNum, maxpriceNum);
                 if (!minpriceNum || !maxpriceNum) {
                     return;  // User canceled the prompt
                 }
                 endpoint = `/api/rooms/price/${minpriceNum}/${maxpriceNum}`;
                 break;
            case 'type':
                 // Implement the logic to prompt and fetch rooms based on room type
                 const roomType = prompt('Enter Room Type:');
                 /*
                 if (!roomType) {
                     return;  // User canceled the prompt
                 }
                 */
                 endpoint = `/api/rooms/type/${roomType}`;
                 break;
            default:
                // Default case for 'all' or any unrecognized option
                break;
        }

        const response = await fetch(endpoint);
        const rooms = await response.json();
        populateRoomTable(rooms);
    } catch (error) {
        console.error(error);
        alert('Error fetching room data');
    }
}

function populateRoomTable(rooms) {
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
        roomImage.style.width = '150px'; // Adjust the width as needed
        roomImage.style.height = '75px'; // Adjust the height as needed
        roomImageCell.appendChild(roomImage);
          // Existing cells for 'Book' button
        const bookButtonCell = row.insertCell(6);
        const bookButton = document.createElement('button');
        bookButton.textContent = 'Book';
        bookButton.addEventListener('click', () => { bookRoom(room); });
        bookButtonCell.appendChild(bookButton);
    });
}
function bookRoom(room) {
    const cartList = document.getElementById('cartList');
    const listItem = document.createElement('li');
    if(room.availability==='NO'){
        alert('Room not available');
        return;
    }
    const roomImage2=document.createElement('img');
    roomImage2.src = `${room.roomImage}`; // Adjust the path based on your setup
    roomImage2.style.width = '150px'; // Adjust the width as needed
    roomImage2.style.height = '75px'; // Adjust the height as needed
    listItem.textContent = `Room No: ${room.roomNo}, Type: ${room.roomType}, Price: ${room.price}, Image:`;
    listItem.appendChild(roomImage2);
    cartList.appendChild(listItem);

    // Call the server to update the database
    
    bookRoomOnServer(room.roomNo);
}
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


