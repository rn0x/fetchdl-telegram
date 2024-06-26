/**
 * LICENSE MIT
 * Copyright (c) 2024 rn0x
 * github: https://github.com/rn0x
 * telegram: https://t.me/F93ii
 * repository: https://github.com/rn0x/fetchdl-telegram
 */

// database.js
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { generateUniqueId } from './Utils.js';

// Resolve the current directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to your SQLite database file
const dbPath = path.join(__dirname, '../../', 'database', 'database.db');

const db = new Database(dbPath);

// Create table requests if not exists
db.prepare(`
    CREATE TABLE IF NOT EXISTS requests (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        message_id INTEGER NOT NULL,
        url TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`).run();

/**
 * Inserts a new request into the database.
 * @param {string} user_id - The ID of the user making the request.
 * @param {string} url - The URL associated with the request.
 * @param {string} message_id - The ID of the message associated with the request.
 */
export function insertRequest(user_id, url, message_id) {
    user_id = user_id || null;
    url = url || null;
    message_id = message_id || null;

    const requestId = generateUniqueId(20);

    const stmt = db.prepare(`
        INSERT INTO requests (id, user_id, url, message_id)
        VALUES (?, ?, ?, ?)
    `);
    stmt.run(requestId, user_id, url, message_id);
}

/**
 * Retrieves all pending requests from the database.
 * @returns {Array<Object>} An array of objects representing pending requests.
 */
export function getPendingRequests() {
    const stmt = db.prepare(`
        SELECT id, user_id, url, message_id
        FROM requests
        ORDER BY timestamp ASC
    `);
    return stmt.all();
}

/**
 * Deletes a request from the database by its ID.
 * @param {string} requestId - The ID of the request to delete.
 */
export function deleteRequestById(requestId) {
    const stmt = db.prepare(`
        DELETE FROM requests
        WHERE id = ?
    `);
    stmt.run(requestId);
}


// Create users table if not exists
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username TEXT,
        first_name TEXT,
        is_bot INTEGER,
        chat_type TEXT,
        language_code TEXT
    );
`).run();

/**
 * Inserts or updates a user in the database.
 * @param {number} user_id - The ID of the user in Telegram.
 * @param {string} username - The username of the user.
 * @param {string} first_name - The first name of the user.
 * @param {boolean} is_bot - Whether the user is a bot or not.
 * @param {string} chat_type - The type of chat (e.g., private, group).
 * @param {string} language_code - The preferred language code of the user.
 */
export function insertUser(user_id, username, first_name, is_bot, chat_type, language_code) {
    // Convert is_bot to 0 or 1
    is_bot = is_bot ? 1 : 0;

    // Ensure all parameters are defined and convert undefined to null
    username = username || null;
    first_name = first_name || null;
    chat_type = chat_type || null;
    language_code = language_code || null;

    const stmt = db.prepare(`
        INSERT OR REPLACE INTO users (user_id, username, first_name, is_bot, chat_type, language_code)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(user_id, username, first_name, is_bot, chat_type, language_code);
}

/**
 * Retrieves all users from the database.
 * @returns {Array<Object>} An array of objects representing all users.
 */
export function getAllUsers() {
    const stmt = db.prepare(`
        SELECT *
        FROM users
    `);
    return stmt.all();
}


/**
 * Stores a URL object in the database.
 * @param {Object} obj - The URL object to store.
 * @returns {string} The unique ID associated with the stored URL.
 */
export function storeUrlInDatabase(obj) {
    const uniqueId = generateUniqueId(20);

    const stmt = db.prepare(`
        INSERT INTO urls (id, url, user_id, urlType)
        VALUES (?, ?, ?, ?)
    `);
    stmt.run(uniqueId, obj.url, obj.user_id, obj.urlType);

    return uniqueId;
}

// Create table urls if not exists
db.prepare(`
    CREATE TABLE IF NOT EXISTS urls (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        user_id TEXT,
        urlType TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`).run();

/**
 * Retrieves a URL object from the database using its unique ID.
 * @param {string} uniqueId - The unique ID of the URL to retrieve.
 * @returns {Object | undefined} The URL object if found, otherwise undefined.
 */
export function getUrlFromDatabase(uniqueId) {
    const stmt = db.prepare(`
        SELECT url, user_id, urlType
        FROM urls
        WHERE id = ?
    `);
    const result = stmt.get(uniqueId);

    return result ? { url: result.url, user_id: result.user_id, urlType: result.urlType } : undefined;
}