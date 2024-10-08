const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require('jsonwebtoken');
const mysql = require("mysql");
// const XLSX = require('xlsx');


app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "mysql-db:3306",
    user: "user",
    password: "password",
    database: "babapp-db"
});

app.get("/", (req, res) => {
    const q = "SELECT * FROM persons";
    db.query(q, (err, data) => {
        if (err) {
            return res.json("err");
        }
        console.log(data);
        return res.json(data);
    });
});

app.post("/add", (req, res) => {
    const q = "INSERT INTO persons (CIN, name, terrain, phone, tprice, lotC) VALUES (?,?,?,?,?,?)";
    const v = [
        req.body.cin,
        req.body.name,
        req.body.terrain,
        req.body.phone,
        req.body.tprice,
        req.body.lotC
    ];

    db.query(q, v, (err, data) => {
        if (err) {
            console.error(err);
            return res.json("err");
        }
        return res.json(data);
    });
});

app.put("/edit/:id", (req, res) => {
    let q = "UPDATE persons SET";
    const v = [];

    if (req.body.name) {
        q += " `name` = ?,";
        v.push(req.body.name);
    }

    if (req.body.cin) {
        q += " `cin` = ?,";
        v.push(req.body.cin);
    }

    if (req.body.terrain) {
        q += " `terrain` = ?,";
        v.push(req.body.terrain);
    }

    if (req.body.phone) {
        q += " `phone` = ?,";
        v.push(req.body.phone);
    }

    if (req.body.tprice) {
        q += " `tprice` = ?,";
        v.push(req.body.tprice);
    }

    if (req.body.lotC) {
        q += " `lotC` = ?,";
        v.push(req.body.lotC);
    }

    q = q.slice(0, -1);

    q += " WHERE id = ?";
    v.push(req.params.id);

    db.query(q, v, (err, data) => {
        if (err) return res.json("err");
        return res.json(data);
    });
});


app.post("/contributions/add/:personId", (req, res) => {
    const personId = req.params.personId; 

    const q = "INSERT INTO contributions (person_id, contribution_date, contribution_amount) VALUES (?,?,?)";
    const v = [
        personId, 
        req.body.contribution_date,
        req.body.contribution_amount
    ];

    db.query(q, v, (err, data) => {
        if (err) {
            console.error(err);
            return res.json("err");
        }
        return res.json(data);
    });
});

app.get("/contributions/:personId", (req, res) => {
    const personId = req.params.personId;
    const q = "SELECT * FROM contributions WHERE person_id = ?";
    db.query(q, [personId], (err, data) => {
        if (err) {
            console.error(err);
            return res.json("err");
        }
        return res.json(data);
    });
});

app.put("/contribution/edit/:id", (req, res) => {
    const q = "UPDATE contributions SET `person_id` = ?, `contribution_date` = ?, `contribution_amount` = ? WHERE id = ?";
    const v = [
        req.body.person_id,
        req.body.contribution_date,
        req.body.contribution_amount,
        req.params.id
    ];

    db.query(q, v, (err, data) => {
        if (err) {
            console.error(err);
            return res.json("err");
        }
        return res.json(data);
    });
});

app.delete("/d/:id", (req, res) => {
    const personId = req.params.id;

    const deleteContributionsQuery = "DELETE FROM contributions WHERE person_id = ?";
    db.query(deleteContributionsQuery, [personId], (err, contributionResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error deleting contributions" });
        }

        const deletePersonQuery = "DELETE FROM persons WHERE id = ?";
        db.query(deletePersonQuery, [personId], (err, personResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error deleting person" });
            }

            if (personResult.affectedRows === 0) {
                return res.status(404).json({ message: "No person found for deletion" });
            }

            return res.status(200).json({ message: "Person and associated contributions deleted successfully" });
        });
    });
});


app.post('/login', async (req, res) => {
    try {
        const { password } = req.body;
        console.log("PASSWORD: ", password);
        const query = 'SELECT password FROM users WHERE password = ?';
        db.query(query, [password], async (error, results) => {
            if (error) {
                console.error('Error querying database:', error);
                return res.status(500).json({ message: 'Server error' });
            }

            if (results.length > 0) {
                const token = jwt.sign({ password }, 'your_secret_key', { expiresIn: '300s' });
                return res.status(200).json({ token });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/verifyToken', (req, res) => {
    try {
        const { token } = req.body;
        console.log(token)
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        jwt.verify(token, 'your_secret_key', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            } else {
                return res.status(200).json({ message: 'Token is valid' });
            }
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// app.post('/upload', upload.single('file'), (req, res) => {
//     try {
//         const workbook = XLSX.read(req.file.buffer);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const data = XLSX.utils.sheet_to_json(worksheet);

//         data.forEach((row) => {
//             const { CIN, name, terrain, phone, tprice, lotC } = row;
//             const query = 'INSERT INTO persons (CIN, name, terrain, phone, tprice, lotC) VALUES (?, ?, ?, ?, ?, ?)';
//             const values = [CIN, name, terrain, phone, tprice, lotC];
            
//             db.query(query, values, (err, result) => {
//                 if (err) {
//                     console.error('Error inserting data into database:', err);
//                 } else {
//                     console.log('Data inserted successfully:', result);
//                 }
//             });
//         });
        
//         res.status(200).send('File uploaded successfully.');
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         res.status(500).send('Internal server error.');
//     }
// });
  
app.listen(3366, () => {
    console.log("Server is running on port 5000");
});    
