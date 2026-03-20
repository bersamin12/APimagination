const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "travelmap.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('city', 'country')),
      country_name TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      external_id TEXT NOT NULL UNIQUE,
      image_url TEXT,
      image_alt TEXT,
      attachment_name TEXT,
      attachment_url TEXT,
      comment_log TEXT,
      visit_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.all(`PRAGMA table_info(places)`, [], (err, columns) => {
    if (err) {
      console.error("Failed to inspect places table:", err.message);
      return;
    }

    const columnNames = columns.map((col) => col.name);

    const addColumnIfMissing = (name, type) => {
      if (!columnNames.includes(name)) {
        db.run(`ALTER TABLE places ADD COLUMN ${name} ${type}`, (alterErr) => {
          if (alterErr) {
            console.error(`Failed adding ${name} column:`, alterErr.message);
          }
        });
      }
    };

    addColumnIfMissing("image_url", "TEXT");
    addColumnIfMissing("image_alt", "TEXT");
    addColumnIfMissing("attachment_name", "TEXT");
    addColumnIfMissing("attachment_url", "TEXT");
    addColumnIfMissing("comment_log", "TEXT");
    addColumnIfMissing("visit_date", "TEXT");
  });
});

module.exports = db;