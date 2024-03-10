const oracledb=require('oracledb');
oracledb.outFormat=oracledb.OUT_FORMAT_OBJECT;

const axios=require('axios');

const express=require('express');
const app=express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//for sending messages
const accountSid = 'ACc049dd0ffec98542974fa9d90639ed5d';
const authToken = '79085a199250000a9e94f8cf065de5e7';
const client = require('twilio')(accountSid, authToken);
const multer = require('multer');
const path = require('path');
//multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
    }
});

const upload = multer({ storage: storage });

//app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000);
let userNames=[];

async function run(query) {
    const connection = await oracledb.getConnection({
        user: 'HOTEL',
        password: 'hotel',
        connectString: 'localhost:1521/orclpdb',
    });
    /* import data from randomuser.me
    const response=await axios.get('https://randomuser.me/api/?results=50');
    for(const person of response.data.results){
        const username=person.login.username;
        const name=person.name.title+' '+person.name.first+' '+person.name.last;
        const university='BUET';
        
        console.log(username,name,university);
        await connection.commit();
        await connection.execute(
            `INSERT INTO "TESTPROJECT"."testUsers" VALUES('${username}','${name}','${university}')`
        );
    }
    
    const data=await connection.execute('SELECT * FROM "TESTPROJECT"."testUsers"');
    console.log(data.rows);
    //console.log(response.data.results);
    //Query Part1)const username='boss';
    //QP2)const result = await connection.execute(`SELECT * FROM "TESTPROJECT"."testUsers" WHERE "username"='${username}' `);
    //QP3)console.log('Result is:', result.rows);
    */
   const data=await connection.execute(query);
   await connection.commit();
   await connection.close();
   return data;
}
app.get('/user/:username',async (req,res)=>{
    console.log('SomeOne COnnected!');
    /*
    res.send(
        '<html><head><title>HEYYY</title></head><body><b>EEE CDI</b></body></html>'
    );
    */
   const username=req.params.username;
   const data=await run(`SELECT * FROM "HOTEL"."CUSTOMER" WHERE "customerName"='${username}' `);
    res.send(data.rows);
    

});

//run();
app.get('/api/customers', async (req, res) => {
    try {
        const result = await run('SELECT * FROM "HOTEL"."CUSTOMER"');
        res.json(result.rows);
        for(const row of result.rows){
            console.log(row);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal one piece Error');
    }
});




app.get('/api/rooms', async (req, res) => {
    try {
        const result = await run('SELECT * FROM "HOTEL"."ROOM"');
        res.json(result.rows);
        for(const row of result.rows){
            console.log(row);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal one piece Error');
    }
});

//


app.get('/api/bookRoom/:roomNo', async (req, res) => {
    try {
        const roomNo = req.params.roomNo;
        const updateResult = await run(`UPDATE "HOTEL"."ROOM" SET "availability"='NO' WHERE "roomNo"='${roomNo}'`);
        console.log(roomNo);
        const roomImg=await run(`SELECT "roomLink" FROM "HOTEL"."ROOM" WHERE "roomNo"='${roomNo}'`);
        console.log(roomImg.rows[0].roomLink);
        const roomPrice=await run(`SELECT "price" FROM "HOTEL"."ROOM" WHERE "roomNo"='${roomNo}'`);
        //console.log(run(`SELECT * FROM "HOTEL"."ROOM" WHERE "roomNo"='${roomNo}'`));
        client.messages
                .create({
                    body: `🌟 Congratulations! 🌴

                    Dear Guest,
                    Your room has been booked successfully. We are delighted to extend our heartfelt greetings and welcome you to Hotel California, where comfort meets sophistication and every moment is designed to be a lasting memory. Your room number is ${roomNo}.Please pay ${roomPrice.rows[0].price} taka to the receptionist. Thank you for choosing us!`,
               
                mediaUrl: [roomImg.rows[0].roomLink],
                //mediaUrl:['https://www.youtube.com/watch?v=xxttjs3Md2Q&list=RDxxttjs3Md2Q&start_radio=1'],
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+8801914035818',
   })
  .then(message => console.log(message.sid));

        
        if (updateResult.rowsAffected === 0) {
            res.status(404).send('Room not found');
        } else {
            res.send('Room booked successfully');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
   
});





// Add this route to your existing Express app in index.js
// app.post('/saveUserInfo', async (req, res) => {
//     try {
//         const { customerID,username, password, phoneNumber } = req.body;
//         console.log(customerID,username, password, phoneNumber);

//         // Perform any necessary validation
//         let numberOfCustomer=await run(`SELECT COUNT(*) FROM "HOTEL"."CUSTOMER"`);
//         const numberOfCustomerF=Math.random();
//         //const customerID2=Math.floor(numberOfCustomerF*1000000);
       

//         // Save the user info to the database
//         //const comit=await run(`SET AUTOCOMMIT ON`);
        
//         const insertResult = await run(`
//             INSERT INTO "HOTEL"."CUSTOMER" ("customerID","customerName", "customerPassword","customerMobile")
//             VALUES (${customerID},'${username}', '${password}','${phoneNumber}')

//         `
        
//         );
//         /*
//         const insertResult = await run(`
//         INSERT INTO "HOTEL"."CUSTOMER" 
//         SET 
//           "customerID" = ${numberOfCustomer},
//           "customerName" = '${username}',
//           "customerPassword" = '${password}',
//           "customerMobile" = '${phoneNumber}';
        
//         `
//         );*/
//         console.log(username, password, phoneNumber,numberOfCustomer);
//         userNames.push(username);
//         userNames.push(numberOfCustomer);
//         userNames.push(phoneNumber);
//         //
//         console.log(`+88${phoneNumber}`);
       
//         client.messages.create({
//             body: `🌟 Welcome to Hotel California! 🌴

//                    Dear ${username},
//                    We are delighted to extend our heartfelt greetings and welcome you to Hotel California, where comfort meets sophistication and every moment is designed to be a lasting memory.Your customer ID is ${customerID} and your password is ${password}.Please Dont share your password with others.`,
//             from: 'whatsapp:+14155238886',
//             //to: `whatsapp:+88${phoneNumber}`
//             to: 'whatsapp:+8801914035818'
//         }).then(message => console.log(message.sid));
//         // client.messages.create({
//         //     body: `🌟 Welcome to Hotel California! 🌴

//         //            Dear ${username},
//         //            We are delighted to extend our heartfelt greetings and welcome you to Hotel California, where comfort meets sophistication and every moment is designed to be a lasting memory.Your customer ID is ${numberOfCustomer} and your password is ${password}.Please Dont share your password with others.`,
//         // from: '+16592773824',
//         // to: '+88001914035818'
//         // }).then(message => console.log(message.sid));
        

//         if (insertResult.rowsAffected > 0) {
//             res.status(200).send('User info saved successfully');
//             //res.redirect('blank.html');
//             res.sendFile(path.join(__dirname + '/public/blank.html'));

//         } else {
//             res.status(500).send('Failed to save user info');
//         }
//     } catch (error) {
//         console.error('Error while saving user info:', error);
//         res.status(500).send('Internal Server Error');
//         const { username, password,phoneNumber } = req.body;
//         //let noC=run(`SELECT COUNT(*) FROM "HOTEL"."CUSTOMER"`);
//         //noC=noC+1;
//         console.log(username, password, phoneNumber);
//         //console.log(noC.rows.values);
//     }
// });

app.post('/saveUserInfo', async (req, res) => {
    try {
        const { customerID,username, password, phoneNumber } = req.body;

        // Perform any necessary validation
        //let numberOfCustomer=await run(`SELECT COUNT(*) FROM "HOTEL"."CUSTOMER"`);
        numberOfCustomerF=Math.random();
        numberOfCustomer=Math.floor(numberOfCustomerF*1000000);
       

        // Save the user info to the database
        //const comit=await run(`SET AUTOCOMMIT ON`);
        
        const insertResult = await run(`
            INSERT INTO "HOTEL"."CUSTOMER" ("customerID","customerName", "customerPassword","customerMobile")
            VALUES (${customerID},'${username}', '${password}','${phoneNumber}')

        `
        
        );
        /*
        const insertResult = await run(`
        INSERT INTO "HOTEL"."CUSTOMER" 
        SET 
          "customerID" = ${numberOfCustomer},
          "customerName" = '${username}',
          "customerPassword" = '${password}',
          "customerMobile" = '${phoneNumber}';
        
        `
        );*/
        console.log(username, password, phoneNumber,numberOfCustomer);
        userNames.push(username);
        userNames.push(numberOfCustomer);
        userNames.push(phoneNumber);
        //
        console.log(`+88${phoneNumber}`);
       
        client.messages.create({
            body: `🌟 Welcome to Hotel California! 🌴

                   Dear ${username},
                   We are delighted to extend our heartfelt greetings and welcome you to Hotel California, where comfort meets sophistication and every moment is designed to be a lasting memory.Your customer ID is ${numberOfCustomer} and your password is ${password}.Please Dont share your password with others.`,
            from: 'whatsapp:+14155238886',
            //to: `whatsapp:+88${phoneNumber}`
            to: 'whatsapp:+8801914035818'
        }).then(message => console.log(message.sid));
        // client.messages.create({
        //     body: `🌟 Welcome to Hotel California! 🌴

        //            Dear ${username},
        //            We are delighted to extend our heartfelt greetings and welcome you to Hotel California, where comfort meets sophistication and every moment is designed to be a lasting memory.Your customer ID is ${numberOfCustomer} and your password is ${password}.Please Dont share your password with others.`,
        // from: '+16592773824',
        // to: '+88001914035818'
        // }).then(message => console.log(message.sid));
        

        if (insertResult.rowsAffected > 0) {
            res.status(200).send('User info saved successfully');
            //res.redirect('blank.html');
            res.sendFile(path.join(__dirname + '/public/blank.html'));

        } else {
            res.status(500).send('Failed to save user info');
        }
    } catch (error) {
        console.error('Error while saving user info:', error);
        res.status(500).send('Internal Server Error');
        const { username, password,phoneNumber } = req.body;
        let noC=run(`SELECT COUNT(*) FROM "HOTEL"."CUSTOMER"`);
        //noC=noC+1;
        console.log(username, password, phoneNumber);
        console.log(noC.rows.values);
    }
});



// Add this route to your existing Express app in index.js

app.get('/api/rooms/all', async (req, res) => {
    try {
        const result = await run('SELECT * FROM "HOTEL"."ROOM" JOIN "HOTEL"."EMPLOYEE" ON "HOTEL"."ROOM"."employeeID"="HOTEL"."EMPLOYEE"."employeeID"');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/rooms/:roomNo', async (req, res) => {
    try {
        const roomNo = req.params.roomNo;
        const result = await run(`SELECT * FROM "HOTEL"."ROOM" WHERE "roomNo"='${roomNo}'`);
        console.log(roomNo);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
/*
app.get('/api/rooms/price/:min/:max', async (req, res) => {
    try {
        const minPrice = req.params.min;
        const maxPrice = req.params.max;
        console.log(minPrice, maxPrice);
        const result = await run(`SELECT * FROM "HOTEL"."ROOM" WHERE "price" BETWEEN ${minPrice} AND ${maxPrice}`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
*/
app.get('/api/rooms/price/:min/:max', async (req, res) => {
    try {
        const minPrice = req.params.min;
        const maxPrice = req.params.max;
        console.log(minPrice, maxPrice);
        const result = await run(`SELECT * FROM "HOTEL"."ROOM" WHERE "price" BETWEEN ${minPrice} AND ${maxPrice}`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/rooms/type/:roomType', async (req, res) => {
    try {
        const roomType = req.params.roomType;
        const result = await run(`SELECT * FROM "HOTEL"."ROOM" WHERE "roomType"='${roomType}'`);
        console.log(roomType);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/api/services/all', async (req, res) => {
    try {
        const result = await run('SELECT * FROM "HOTEL"."SERVICES"');
        //const result = await run(`SELECT s."serviceID",s."description",s."price",s."availability",s2."customerID",TO_CHAR(s2."orderTime",'YYYY-MM-DD') as tc FROM SERVICES S full outer join SERVICE_BILL S2 on (s."serviceID"=s2."serviceID")`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/api/services/all2', async (req, res) => {
    try {
        //const result = await run('SELECT * FROM "HOTEL"."SERVICES"');
         const result = await run(`SELECT s."serviceID",s."description",s."price",s."availability",s2."customerID",TO_CHAR(s2."orderTime",'YYYY-MM-DD') as tc,s."photo" FROM SERVICES S full outer join SERVICE_BILL S2 on (s."serviceID"=s2."serviceID")`);

        res.json(result.rows[0].TC);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/api/services/price/:min/:max', async (req, res) => {
    try {
        const minPrice = req.params.min;
        const maxPrice = req.params.max;
        const result = await run(`SELECT * FROM "HOTEL"."SERVICES" WHERE "price" BETWEEN ${minPrice} AND ${maxPrice}`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/services/name/:serviceName', async (req, res) => {
    try {
        const serviceName = req.params.serviceName;
        const result = await run(`SELECT * FROM "HOTEL"."SERVICES" WHERE "description"='${serviceName}'`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/api/employees',async (req,res)=>{
    try {
        const result = await run(`SELECT * FROM "HOTEL"."EMPLOYEE" NATURAL JOIN "HOTEL"."EMPLOYEE_SHIFT" NATURAL JOIN "HOTEL"."SHIFTS"`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

});


//employee

app.post('/saveEmployeeInfo', async (req, res) => {
    try {
        console.log(req.body);
        const { firstName, lastName, position, salary, roomNo, managerID, employeeShift } = req.body;
        let shiftID;
        if (employeeShift == 'Morning') {
            shiftID = 1;
        }
        if (employeeShift == 'Afternoon') {
            shiftID = 2;
        }
        console.log(shiftID);

        // Use parameterized queries to prevent SQL injection
        const numberOfCustomerF = Math.random();
        const employeeID = Math.floor(numberOfCustomerF * 1000000);
        console.log(firstName, lastName, position, salary, roomNo, managerID, employeeID, employeeShift);

        // Save the user info to the database using parameterized queries
        const insertResult = await run(`
            INSERT INTO "HOTEL"."EMPLOYEE" ("firstName", "lastName", "position", "salary", "roomNo", "managerID", "employeeID")
            VALUES ('${firstName}','${lastName}','${position}',${salary},${roomNo},${managerID}, ${employeeID})`
        );

        //const insertResultShifts = await run(`INSERT INTO "HOTEL"."SHIFTS" ("shiftID", "shiftName") VALUES (${shiftID}, '${employeeShift}')`);
        const insertResultES = await run(`INSERT INTO "HOTEL"."EMPLOYEE_SHIFT" ("employeeID", "shiftID") VALUES (${employeeID}, ${shiftID})`);
        if (insertResult.rowsAffected > 0 && insertResultES.rowsAffected > 0) {
            res.status(200).json({ success: true, message: 'User info saved successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to save user info' });
        }
    } catch (error) {
        console.error('Error while saving user info:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


//Room Part
// Function to save room data on the server
// app.post('/saveRoomData', async (req, res) => {
//     try {
//         const { roomNo, assignedEmployeeId, roomType, price, availability, roomImage } = req.body;
//         console.log(roomNo, assignedEmployeeId, roomType, price, availability, roomImage);

//         // Save the room data to the database
//         const insertResult = await run(`
//             INSERT INTO "HOTEL"."ROOM" ("roomNo", "employeeID", "roomType", "price", "availability", "roomImage")
//             VALUES ('${roomNo}', '${assignedEmployeeId}', '${roomType}', ${price}, '${availability}', '${roomImage}')
//         `);

//         if (insertResult.rowsAffected > 0) {
//             res.status(200).json({ success: true, message: 'Room data saved successfully' });
//         } else {
//             res.status(500).json({ success: false, message: 'Failed to save room data' });
//         }
//     } catch (error) {
//         console.error('Error while saving room data:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });

// Function to save room data on the server
app.post('/saveRoomData', upload.single('roomImage'), async (req, res) => {
    try {
        const { roomNo, assignedEmployeeId, roomType, price, availability } = req.body;
        const roomImage = req.file ? req.file.path : ''; // Get the uploaded file path, or set an empty string if no file was uploaded
        console.log(roomNo, assignedEmployeeId, roomType, price, availability, roomImage);
        console.log(req.file);
        console.log(roomImage);

        // Save the room data to the database
        const insertResult = await run(`
            INSERT INTO "HOTEL"."ROOM" ("roomNo", "employeeID", "roomType", "price", "availability", "roomImage")
            VALUES ('${roomNo}', '${assignedEmployeeId}', '${roomType}', ${price}, '${availability}', '${roomImage}')
        `);

        if (insertResult.rowsAffected > 0) {
            res.status(200).json({ success: true, message: 'Room data saved successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to save room data' });
        }
    } catch (error) {
        console.error('Error while saving room data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
//login api

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username and password match in the CUSTOMER table
        const result = await run(`
            SELECT *
            FROM "HOTEL"."CUSTOMER"
            WHERE "customerName" = '${username}'
            AND "customerPassword" = '${password}'
        `);

    

        if (result.rows.length > 0) {
            // Authentication successful
            res.status(200).json({ success: true });
            client.messages
            .create({
            body: `🌟 Welcome to Hotel California! 🌴
        
               Dear ${username},
               We are delighted to extend our heartfelt greetings and welcome you to Hotel California, where comfort meets sophistication and every moment is designed to be a lasting memory.Your customer ID is ${result.rows[0].customerID} and your password is ${password}.Please Dont share your password with others.`,
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+8801914035818'
    })
    .then(message => console.log(message.sid));
        } else {
            // Authentication failed
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
});


// Function to book a room

app.post('/api/bookRoom', async (req, res) => {
    const { roomId, checkInDate, checkOutDate,name,pass } = req.body;
    console.log(roomId, checkInDate, checkOutDate);
    console.log(name,pass);
    const numberOfCustomerF = Math.random();
    const reservationID = Math.floor(numberOfCustomerF * 1000000);
    console.log(reservationID);
    const numberOfBillF = Math.random();
    const billID = Math.floor(numberOfCustomerF * 1000000);

    //PL?SQL here
    
    // Logic to handle room booking (replace with your actual implementation)
    const updateRoom = await run(`UPDATE "HOTEL"."ROOM" SET "availability"='NO' WHERE "roomNo"=${roomId}`);
    const custID= await run(`SELECT "customerID" FROM "HOTEL"."CUSTOMER" WHERE "customerName"='${name}' AND "customerPassword"='${pass}'`);
    console.log(custID.rows[0].customerID);

    const roomPrice=await run(`SELECT "price" FROM "HOTEL"."ROOM" WHERE "roomNo"=${roomId}`);
    console.log(roomPrice.rows[0].price);

    //
    const roomBill=await run(`CREATE OR REPLACE TRIGGER room_after_insert_trigger
    AFTER INSERT ON "HOTEL"."RESERVATION" 
    FOR EACH ROW
    DECLARE
    BEGIN
    INSERT INTO "HOTEL"."BILL"("billID","customerID", "totalCost") 
    VALUES (${billID},${custID.rows[0].customerID},${roomPrice.rows[0].price});
    END;`)

    //
    const reserve=await run(`INSERT INTO "HOTEL"."RESERVATION" ("roomNo", "checkInDate", "checkOutDate", "customerID", "reservationID")
    VALUES (105, TO_DATE('${checkInDate}', 'YYYY-MM-DD'), TO_DATE('${checkOutDate}', 'YYYY-MM-DD'),${custID.rows[0].customerID}, ${reservationID})`);
    // For now, just send a success response
    const customm=await run(`UPDATE "HOTEL"."CUSTOMER" SET "reservationID"=${reservationID},"roomNo"=${roomId} WHERE "customerName"='${name}' AND "customerPassword"='${pass}'`);
    if(updateRoom.rowsAffected>0 && reserve.rowsAffected>0 && customm.rowsAffected>0){
        res.json({ success: true, message: 'Room booked successfully!' });
    }
    /*
    const updateRoomPLSQL = await run(`CREATE OR REPLACE PROCEDURE book_room(
        p_room_id IN NUMBER,
        p_check_in_date IN DATE,
        p_check_out_date IN DATE,
        p_name IN VARCHAR2,
        p_pass IN VARCHAR2
    )
    AS
        v_number_of_customer_f NUMBER;
        v_reservation_id NUMBER;
        v_cust_id NUMBER;
    BEGIN
        -- Generate a random reservation ID
        v_number_of_customer_f := DBMS_RANDOM.VALUE;
        v_reservation_id := FLOOR(v_number_of_customer_f * 1000000);
    
        -- Logic to handle room booking
        UPDATE "HOTEL"."ROOM" SET "availability" = 'NO' WHERE "roomNo" = p_room_id;
    
        -- Retrieve customer ID based on name and password
        SELECT "customerID" INTO v_cust_id
        FROM "HOTEL"."CUSTOMER"
        WHERE "customerName" = p_name AND "customerPassword" = p_pass;
    
        -- Insert reservation record
        INSERT INTO "HOTEL"."RESERVATION" ("roomNo", "checkInDate", "checkOutDate", "customerID", "reservationID")
        VALUES (p_room_id, p_check_in_date, p_check_out_date, v_cust_id, v_reservation_id);
    
        -- Update customer record with reservation ID and room number
        UPDATE "HOTEL"."CUSTOMER"
        SET "reservationID" = v_reservation_id, "roomNo" = p_room_id
        WHERE "customerName" = p_name AND "customerPassword" = p_pass;
    
        -- Commit the changes
    
        -- Output success message
        DBMS_OUTPUT.PUT_LINE('Room booked successfully!');
    EXCEPTION
        WHEN OTHERS THEN
            -- Handle exceptions
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
            ROLLBACK; -- Rollback changes in case of an error
    END book_room;
    `);
    const callProcedure = await run(`BEGIN book_room(${roomId}, TO_DATE('${checkInDate}', 'YYYY-MM-DD'), TO_DATE('${checkOutDate}', 'YYYY-MM-DD'), '${name}', '${pass}');
    END;
`);
    if(updateRoomPLSQL.rowsAffected>0){
        console,log(updateRoomPLSQL.rowsAffected);
        console.log('Room booked successfully!');
        res.json({ success: true, message: 'Room booked successfully!' });
    }
    */
});


//
// app.get('/api/services/all', async (req, res) => {
//     try {
//         const result = await run('SELECT * FROM "HOTEL"."SERVICES"');
//         res.json(result.rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });


// Function to Search services

app.get('/api/search/service', async (req, res) => {
    try {
        const { searchAttribute, searchValue } = req.query;

        // Perform the search based on the chosen attribute and value
        console.log(searchAttribute, searchValue);
        const result = await run(`
            SELECT *
            FROM "HOTEL"."SERVICES"
            WHERE UPPER("${searchAttribute}") LIKE UPPER('%${searchValue}%')
        `);

        res.json(result.rows);
        console.log(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        console.log(searchAttribute, searchValue);
        console.log('error');
    }
});

//serv POST
app.post('/api/services/post', async (req, res) => {
    try {
        const { description, price, availability } = req.body;
        const numberOfCustomerF = Math.random();
        const serviceID = Math.floor(numberOfCustomerF * 1000000);
        console.log(description, price, availability, serviceID);

        // Save the service data to the database
        const insertResult = await run(`
            INSERT INTO "HOTEL"."SERVICES" ("description", "price", "availability", "serviceID")
            VALUES ('${description}', ${price}, '${availability}', ${serviceID})
        `);

        if (insertResult.rowsAffected > 0) {
            // Fetch the updated list of services
            //const updatedServices = await run('SELECT * FROM "HOTEL"."SERVICES"');
            //res.status(200).json(updatedServices);
            res.json({ success: true, message: 'Services added successfully!' });
        } else {
            res.status(500).json({ error: 'Failed to save service data' });
        }
    } catch (error) {
        console.error('Error while saving service data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//Functions for equipments
// ...

// PL/SQL for inserting new equipment
// const insertEquipmentProcedure =`
// CREATE OR REPLACE PROCEDURE insert_equipment (
//   p_equipment_id IN NUMBER,
//   p_description IN VARCHAR2,
//   p_price IN NUMBER,
//   p_availability IN VARCHAR2
// )
// IS
//   v_equipment_id NUMBER;
// BEGIN
//   SELECT COALESCE(MAX(equipmentID), 0) + 1 INTO v_equipment_id FROM "HOTEL"."EQUIPMENT";

//   INSERT INTO "HOTEL"."EQUIPMENT" (equipmentID, description, price, availability)
//   VALUES (p_equipment_id, p_description, p_price, p_availability);

//   COMMIT;
// EXCEPTION
//   WHEN OTHERS THEN
//     ROLLBACK;
//     DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
// END;
// `;

// Run the PL/SQL procedure
//run(insertEquipmentProcedure);

// ...

// Retrieve all equipment data
app.get('/api/equipment', async (req, res) => {
  try {
    const result = await run('SELECT * FROM "HOTEL"."EQUIPMENT"');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Search equipment by attribute and value
app.get('/api/search/equipment', async (req, res) => {
  try {
    const { searchAttribute, searchValue } = req.query;
    console.log(searchAttribute, searchValue);
    const result = await run(`
      SELECT *
      FROM "HOTEL"."EQUIPMENT"
      WHERE UPPER("${searchAttribute}") LIKE UPPER('%${searchValue}%')
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Retrieve equipment details by equipmentID
app.get('/api/equipment/:equipmentID', async (req, res) => {
  try {
    const equipmentID = req.params.equipmentID;
    const result = await run(`
      SELECT *
      FROM "HOTEL"."EQUIPMENT"
      WHERE "equipmentID" = ${equipmentID}
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//PL/SQL for inserting new equipment
const insertEquipmentProcedure =`
CREATE OR REPLACE PROCEDURE insert_equipment (
  p_equipment_id IN NUMBER,
  p_description IN VARCHAR2,
  p_price IN NUMBER,
  p_availability IN VARCHAR2
)
IS
  v_equipment_id NUMBER;
BEGIN
  SELECT COALESCE(MAX(equipmentID), 0) + 1 INTO v_equipment_id FROM "HOTEL"."EQUIPMENT";

  INSERT INTO "HOTEL"."EQUIPMENT" (equipmentID, description, price, availability)
  VALUES (p_equipment_id, p_description, p_price, p_availability);

  COMMIT;
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
`;


// Add new equipment
app.post('/api/equipment/post', async (req, res) => {
  try {
    const { description, price, availability } = req.body;
    console.log(description, price, availability);
    const numberOfCustomerF = Math.random();
    const equipmentID = Math.floor(numberOfCustomerF * 1000000);
    console.log(equipmentID);

    // Call the PL/SQL procedure to insert new equipment
    const insertResult = await run(`
      INSERT INTO "HOTEL"."EQUIPMENT" ("equipmentID", "description", "price", "availability") VALUES (${equipmentID}, '${description}', ${price}, '${availability}')
    `);
    console.log(insertResult.rowsAffected);

    if (insertResult.rowsAffected > 0) {
      res.json({ message: 'Equipment added successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to add equipment' });
    }
  } catch (error) {
    console.error('Error while adding equipment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ...

//services_bill part
// ...
// app.get('/api/services/all', async (req, res) => {
//     try {
//         const result = await run('SELECT * FROM "HOTEL"."SERVICES"');
//         res.json(result.rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });


// Generate a random service bill ID
function generateServiceBillId() {
    const numberF = Math.random();
    return Math.floor(numberF * 1000000);
  }
  
  // Route for placing a service order
  app.post('/api/service-order', async (req, res) => {
    try {
      const { serviceId, customerName,pass, orderTime } = req.body;
      const serviceBillId = generateServiceBillId();
      console.log(serviceBillId);
      const billID = generateServiceBillId();

      // Retrieve the customer ID based on the customer name and password
        const customerResult = await run(`SELECT "customerID" FROM "HOTEL"."CUSTOMER" WHERE "customerName"='${customerName}' AND "customerPassword"='${pass}'`);
        console.log(serviceBillId, serviceId, customerResult.rows[0].customerID, orderTime);

        // retreve
        const servID=await run(`SELECT * FROM "HOTEL"."SERVICES" WHERE "description"='${serviceId}'`);
        const custoID=customerResult.rows[0].customerID;
      // Save the service order details to the SERVICE_BILL table

    //TRIGGER
    console.log(servID.rows[0].price);

    const serviceBillTrigger=await run(`CREATE OR REPLACE TRIGGER service_after_insert_trigger
    AFTER INSERT ON "HOTEL"."SERVICE_BILL" 
    FOR EACH ROW
    DECLARE
    BEGIN
      INSERT INTO "HOTEL"."BILL"("billID","customerID", "totalCost") 
      VALUES (${billID},${custoID},${servID.rows[0].price});
    END;
    `);
    console.log(servID.rows[0].price);
      console.log(serviceBillId, servID.rows[0].serviceID, custoID, orderTime);
      const insertResult = await run(`
        INSERT INTO "HOTEL"."SERVICE_BILL" ("serviceBillID", "serviceID", "customerID", "orderTime")
        VALUES (${serviceBillId}, ${servID.rows[0].serviceID}, ${custoID}, TO_DATE(SYSDATE,  'YYYY-MM-DD'))
      `);

  
      if (insertResult.rowsAffected > 0) {
        res.json({ success: true, message: 'Service order placed successfully' });
      } else {
        res.status(500).json({ error: 'Failed to place service order' });
      }
    } catch (error) {
      console.error('Error while placing service order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.get('/api/services/all/:serviceID', async (req, res) => {
    try {
      const serviceID = req.params.serviceID;
      console.log(serviceID);
      const result = await run(`
        SELECT *
        FROM "HOTEL"."SERVICES"
        WHERE "serviceID" = ${serviceID}
      `);
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/api/equipments/all/:equipmentID', async (req, res) => {
    try {
      const equipmentID = req.params.equipmentID;
      const result = await run(`
        SELECT *
        FROM "HOTEL"."EQUIPMENT"
        WHERE "equipmentID" = ${equipmentID}
      `);
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});


  
app.get('/api/services/all/:serviceId', async (req, res) => {
    try {
        const serviceId = req.params.serviceId;
        const result = await run(`SELECT * FROM "HOTEL"."SERVICES" WHERE "serviceID"=${serviceId}`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
  
  
  // ...

// Function to Search equipment
/*
app.get('/api/equipments/all', async (req, res) => {
    try {
        const result = await run('SELECT * FROM "HOTEL"."EQUIPMENT"');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
*/

//
/*
app.get('/api/equipments/all/:equipmentID', async (req, res) => {
    try {
      const equipmentID = req.params.equipmentID;
      console.log(serviceID);
      const result = await run(`
        SELECT *
        FROM "HOTEL"."EQUIPMENT"
        WHERE "equipmentID" = ${equipmentID}
      `);
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  */


  // Function to Search equipment
  // Generate a random equipment order ID
function generateEquipmentOrderId() {
    const numberF = Math.random();
    return Math.floor(numberF * 1000000);
  }
  
  // Route for placing an equipment order
  app.post('/api/equipment-order', async (req, res) => {
    try {
      const { equipmentId, customerName, pass, orderTime } = req.body;
      const equipmentOrderId = generateEquipmentOrderId();
      console.log(equipmentOrderId, equipmentId, customerName, pass, orderTime);
  
      // Retrieve the customer ID based on the customer name and password
      const customerResult = await run(`SELECT "customerID" FROM "HOTEL"."CUSTOMER" WHERE "customerName"='${customerName}' AND "customerPassword"='${pass}'`);
  
      // Retrieve the equipment details
      const equipmentResult = await run(`SELECT * FROM "HOTEL"."EQUIPMENT" WHERE "description"='${equipmentId}'`);
  
      const customerId = customerResult.rows[0].customerID;
      const equipmentPrice = equipmentResult.rows[0].price;
      console.log(equipmentOrderId, equipmentResult.rows[0].equipmentID, customerId, orderTime, equipmentPrice);
  
      // Save the equipment order details to the EQUIPMENT_ORDER table
      const insertResult = await run(
        `INSERT INTO "HOTEL"."EQUIPMENT_BILL" ("equipmentBillD", "equipmentID", "customerID", "orderTime")
        VALUES (${equipmentOrderId},${equipmentResult.rows[0].equipmentID},${customerId}, TO_DATE(SYSDATE, 'YYYY-MM-DD'))
      `);
  
      if (insertResult.rowsAffected > 0) {
        res.json({ success: true, message: 'Equipment order placed successfully' });
      } else {
        res.status(500).json({ error: 'Failed to place equipment order' });
      }
    } catch (error) {
      console.error('Error while placing equipment order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //COST
  app.get('/api/cost/:customerName', async (req, res) => {
    // Assume the cost is retrieved from the database or some other source  
    //const customerName=localStorage.getItem('username');
    const customerName=req.params.customerName;
    const result = await run(`SELECT "customerID" FROM "HOTEL"."CUSTOMER" WHERE "customerName"='${customerName}'`);
    const custID=result.rows[0].customerID;
    const result1 = await run(`SELECT SUM("totalCost") AS TOT FROM "HOTEL"."BILL" WHERE "customerID"=${custID}`);
    console.log(result1.rows[0]);


    const cost = result1.rows[0].TOT; // Replace with your logic to get the cost
    console.log(cost);

    res.json({ cost });
});
