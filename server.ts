import ViteExpress from 'vite-express';
import express from 'express';
import Database from 'better-sqlite3';

const app = express();
const PORT = 3000;

app.use(express.json());

const db = new Database("wadsongs.db");

// Search by artist
app.get('/artist/:artist', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM wadsongs WHERE artist=?');
        const results = stmt.all(req.params.artist);
        res.json(results);
    } catch(error) {
        res.status(500).json({error: error});
    }
});

// Search by title
app.get('/title/:title', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM wadsongs WHERE title=?');
        const results = stmt.all(req.params.title);
        res.json(results);
    } catch(error) {
        res.status(500).json({error: error});
    }
});

// Search by title and artist
app.get('/artist/:artist/title/:title', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM wadsongs WHERE title=? AND artist=?');
        const results = stmt.all(req.params.title, req.params.artist);
        res.json(results);
    } catch(error) {
        res.status(500).json({error: error});
    }
});

// Buy a song with a given ID
app.post('/song/:id/buy', (req, res) => {
    try {
        const stmt = db.prepare('UPDATE wadsongs SET quantity=quantity-1 WHERE id=?');
        const info = stmt.run(req.params.id);
        const didUpdate = info.changes == 1;
        res.status(didUpdate ? 200 : 404).json({success: didUpdate, id: req.params.id});
    } catch(error) {
        res.status(500).json({error: error});
    }
});

// Delete a song with a given ID
app.delete('/song/:id', (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM wadsongs WHERE id=?');
        const info = stmt.run(req.params.id);
        const didDelete = info.changes == 1;
        res.status(didDelete ? 200 : 404).json({success: didDelete});
    } catch(error) {
        res.status(500).json({error: error});
    }
});

// Add a song
app.post('/song/create', (req, res) => {
    try {
        const stmt = db.prepare('INSERT INTO wadsongs(title,artist,year,downloads,price,quantity) VALUES(?,?,?,0,?,?)');
        const info = stmt.run(req.body.title, req.body.artist, req.body.year, req.body.price, req.body.quantity);
        res.json({id: info.lastInsertRowid});
    } catch(error) {
        res.status(500).json({error: error});
    }
});

ViteExpress.listen(app, PORT, () => { 
    console.log(`Server running on port ${PORT}.`);
});