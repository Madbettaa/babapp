const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // Use PostgreSQL client

app.use(express.json());
app.use(cors());

const pool = new Pool({   // PostgreSQL user
    host: "postgres-db",    // PostgreSQL password
    port: 5432,         // Database host
    database: "babapp",
    user: "postgres",         // Your PostgreSQL database name
    password: "postgres",                    // Default PostgreSQL port
});

app.get("/", (req, res) => {
    const q = "SELECT * FROM persons";
    pool.query(q, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Error occurred while fetching persons.");
        }
        return res.json(result.rows);
    });
});

app.post("/add", (req, res) => {
    const q = "INSERT INTO persons (CIN, name, terrain, phone, tprice, lotC) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const v = [
        req.body.cin,
        req.body.name,
        req.body.terrain,
        req.body.phone,
        req.body.tprice,
        req.body.lotC
    ];

    pool.query(q, v, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Error occurred while adding person.");
        }
        return res.json(result.rows[0]);
    });
});

app.put("/edit/:id", (req, res) => {
    let q = "UPDATE persons SET";
    const v = [];

    if (req.body.name) {
        q += " name = $1,";
        v.push(req.body.name);
    }

    if (req.body.cin) {
        q += " cin = $2,";
        v.push(req.body.cin);
    }

    if (req.body.terrain) {
        q += " terrain = $3,";
        v.push(req.body.terrain);
    }

    if (req.body.phone) {
        q += " phone = $4,";
        v.push(req.body.phone);
    }

    if (req.body.tprice) {
        q += " tprice = $5,";
        v.push(req.body.tprice);
    }

    if (req.body.lotC) {
        q += " lotC = $6,";
        v.push(req.body.lotC);
    }

    q = q.slice(0, -1); // Remove last comma
    q += " WHERE id = $7 RETURNING *";
    v.push(req.params.id);

    pool.query(q, v, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Error occurred while updating person.");
        }
        return res.json(result.rows[0]);
    });
});

app.post("/contributions/add/:personId", (req, res) => {
    const personId = req.params.personId;
    const q = "INSERT INTO contributions (person_id, contribution_date, contribution_amount) VALUES ($1, $2, $3) RETURNING *";
    const v = [
        personId,
        req.body.contribution_date,
        req.body.contribution_amount
    ];

    pool.query(q, v, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Error occurred while adding contribution.");
        }
        return res.json(result.rows[0]);
    });
});

app.get("/contributions/:personId", (req, res) => {
    const personId = req.params.personId;
    const q = "SELECT * FROM contributions WHERE person_id = $1";
    pool.query(q, [personId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Error occurred while fetching contributions.");
        }
        return res.json(result.rows);
    });
});

app.put("/contribution/edit/:id", (req, res) => {
    const q = "UPDATE contributions SET person_id = $1, contribution_date = $2, contribution_amount = $3 WHERE id = $4 RETURNING *";
    const v = [
        req.body.person_id,
        req.body.contribution_date,
        req.body.contribution_amount,
        req.params.id
    ];

    pool.query(q, v, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Error occurred while updating contribution.");
        }
        return res.json(result.rows[0]);
    });
});

app.delete("/d/:id", (req, res) => {
    const personId = req.params.id;

    const deleteContributionsQuery = "DELETE FROM contributions WHERE person_id = $1";
    pool.query(deleteContributionsQuery, [personId], (err, contributionResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error deleting contributions" });
        }

        const deletePersonQuery = "DELETE FROM persons WHERE id = $1 RETURNING *";
        pool.query(deletePersonQuery, [personId], (err, personResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error deleting person" });
            }

            if (personResult.rowCount === 0) {
                return res.status(404).json({ message: "No person found for deletion" });
            }

            return res.status(200).json({ message: "Person and associated contributions deleted successfully" });
        });
    });
});

app.post('/login', async (req, res) => {
    try {
        const { password } = req.body;
        const query = 'SELECT password FROM users WHERE password = $1';
        pool.query(query, [password], (error, result) => {
            if (error) {
                console.error('Error querying database:', error);
                return res.status(500).json({ message: 'Server error' });
            }

            if (result.rows.length > 0) {
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

app.listen(3366, () => {
    console.log("Server is running on port 3366");
});
