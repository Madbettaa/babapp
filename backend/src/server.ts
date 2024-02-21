import express, { Request, Response } from "express";
import cors from "cors";
import jwt from 'jsonwebtoken';
import mysql from "mysql";

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "babapp"
});

app.get("/", (req: Request, res: Response) => {
    const q = "SELECT * FROM persons";
    db.query(q, (err, data) => {
        if (err) {
            return res.json("err");
        }
        console.log(data);
        return res.json(data);
    });
});

app.post("/add", (req: Request, res: Response) => {
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

app.put("/edit/:id", (req: Request, res: Response) => {
    let q = "UPDATE persons SET";
    const v: any[] = [];

    if (req.body.name) {
        q += " `name` = ?,";
        v.push(req.body.name as string);
    }

    if (req.body.cin) {
        q += " `cin` = ?,";
        v.push(req.body.cin as string);
    }

    if (req.body.terrain) {
        q += " `terrain` = ?,";
        v.push(req.body.terrain as string);
    }

    if (req.body.phone) {
        q += " `phone` = ?,";
        v.push(req.body.phone as string);
    }

    if (req.body.tprice) {
        q += " `tprice` = ?,";
        v.push(req.body.tprice as number);
    }

    if (req.body.lotC) {
        q += " `lotC` = ?,";
        v.push(req.body.lotC as string);
    }

    q = q.slice(0, -1);

    q += " WHERE id = ?";
    v.push(req.params.id as string);

    db.query(q, v, (err, data) => {
        if (err) return res.json("err");
        return res.json(data);
    });
});

app.post("/contributions/add/:personId", (req: Request, res: Response) => {
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

app.get("/contributions/:personId", (req: Request, res: Response) => {
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

app.put("/contribution/edit/:id", (req: Request, res: Response) => {
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

app.delete("/d/:id", (req: Request, res: Response) => {
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

app.post('/login', async (req: Request, res: Response) => {
    try {
        const { password } = req.body;

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

app.post('/verifyToken', (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        console.log(token)
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        jwt.verify(token, 'your_secret_key', (err:any, decoded:any) => {
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

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
