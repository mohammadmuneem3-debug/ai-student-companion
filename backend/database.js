
const Database = require("better-sqlite3");

// Create or open database
const db = new Database("student_companion.db");

// Enable WAL mode
db.pragma("journal_mode = WAL");


// =========================
// USERS TABLE
// =========================

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`).run();


// =========================
// TASKS TABLE
// =========================

db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        task TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`).run();


// =========================
// STUDY PLANS TABLE
// =========================

db.prepare(`
    CREATE TABLE IF NOT EXISTS study_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        subject TEXT NOT NULL,
        topic TEXT NOT NULL,
        study_time TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`).run();


// =========================
// NOTES TABLE
// =========================

db.prepare(`
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        note TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`).run();


// =========================
// DATABASE MESSAGES
// =========================

console.log("✅ Database connected!");
console.log("✅ Users table ready!");
console.log("✅ Tasks table ready!");
console.log("✅ Study Plans table ready!");
console.log("✅ Notes table ready!");


module.exports = db;

