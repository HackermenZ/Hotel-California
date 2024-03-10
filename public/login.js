// login.js
/*
function submitForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const phoneNumber = document.getElementById('phoneNumber').value;

    // Validate the form data if needed

    // Send the data to the server
    saveUserInfo(username, password, phoneNumber);
}

async function saveUserInfo(username, password, phoneNumber) {
    try {
        const response = await fetch('/api/saveUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                phoneNumber: phoneNumber,
            }),
        });

        if (response.ok) {
            // Redirect to the next page (pub2/index.html)
            window.location.href = '/pub2/index.html';
        } else {
            console.error('Failed to save user info');
            // Handle the error if needed
        }
    } catch (error) {
        console.error('Error while saving user info:', error);
        // Handle the error if needed
    }
}
*/


// login.js

function submitForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const phoneNumber = document.getElementById('phoneNumber').value;

    // Create a JSON object with user information
    const userInfo = {
        username: username,
        password: password,
        phoneNumber: phoneNumber
    };

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
            window.location.href = 'public/blank.html';
        } else {
            console.error('Failed to save user info');
        }
    })
    .catch(error => {
        console.error('Error saving user info:', error);
    });
}


// login.js2
/*
function submitForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const phoneNumber = document.getElementById('phoneNumber').value;

    // Parse phoneNumber as a float
    const parsedPhoneNumber = parseFloat(phoneNumber);

    // Check if parsing is successful and it's a valid number
    if (!isNaN(parsedPhoneNumber)) {
        // Create a JSON object with user information
        const userInfo = {
            username: username,
            password: password,
            phoneNumber: parsedPhoneNumber
        };

        console.log('userInfo:', userInfo);

        // Make a POST request to save user info
        fetch('/saveUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        })
        .then(response => {
            // ... (rest of the code)
        })
        .catch(error => {
            console.error('Error saving user info:', error);
        });
    } else {
        console.error('Invalid phone number format');
        // Handle the error or inform the user about the invalid format
    }
}
*/
