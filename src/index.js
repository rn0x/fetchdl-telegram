/**
 * LICENSE MIT
 * Copyright (c) 2024 rn0x
 * github: https://github.com/rn0x
 * telegram: https://t.me/F93ii
 * repository: https://github.com/rn0x/fetchdl-telegram
 */

import "dotenv/config";
import { Telegraf, Markup } from 'telegraf';
import downloadFromUrl from './utils/downloadFromUrl.js';
import { insertRequest, insertUser, getAllUsers, getUrlFromDatabase, deleteRequestById } from './utils/database.js';
import sendMedia from './utils/sendMedia.js';
import fs from 'fs';
import path from 'path';
import processPendingRequests from './utils/processPendingRequests.js';
import { fileURLToPath } from 'url';

// Resolve the current directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TIMEOUT = 50 * 60 * 1000;; // 50 minutes
// YOUR_TELEGRAM_BOT_TOKEN
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
// Load welcome messages from JSON file
const welcomeMessages = JSON.parse(fs.readFileSync(path.join(__dirname, '../database', 'welcomeMessages.json'), 'utf8') || {});


// Initialize Telegraf bot
const client = new Telegraf(TELEGRAM_TOKEN, {
    handlerTimeout: TIMEOUT
});

// Start command for the bot
client.start(async (ctx) => {
    const { first_name, username, language_code } = ctx.from;
    const messages = welcomeMessages[language_code] || welcomeMessages['en'];
    const welcomeMessage = messages.welcome
        .replace('{first_name}', first_name)
        .replace('{username}', username);
    await ctx.reply(welcomeMessage);
});

// Handle the command to fetch all users in batches
client.command('users', async (ctx) => {
    try {
        const Users = getAllUsers();
        const batchSize = 10;

        for (let i = 0; i < Users.length; i += batchSize) {
            const batch = Users.slice(i, i + batchSize);

            let message = `👥 Total number of users: ${Users.length}\n\n`;
            for (let j = 0; j < batch.length; j++) {
                const user = batch[j];
                message += `
${j + 1}️⃣ User ID: ${user.user_id}
👤 Username: @${user.username || '-'}
📛 First Name: ${user.first_name || '-'}
💬 Chat Type: ${user.chat_type || '-'}
🌐 Language Code: ${user.language_code || '-'}
\n`;
            }

            await ctx.reply(message);
        }
    } catch (error) {
        console.error('❌ Error fetching users:', error);
        await ctx.reply(`❌ Error fetching users: ${error.message}`);
    }
});

// Middleware to handle incoming messages
client.on('text', async (ctx) => {

    const { text, from, chat, message_id } = ctx.message;
    // Extract user data from the message context
    const user_id = chat?.id || from?.id;
    const username = from?.username;
    const firstName = from?.first_name;
    const isBot = from?.is_bot || false;
    const chatType = chat?.type;
    const language_code = from?.language_code;

    // Insert user data into the database
    insertUser(user_id, username, firstName, isBot, chatType, language_code);
    // Check if the message contains a valid URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    const url = urls?.[0];

    if (!url) {
        if (chatType === "private") {
            return ctx.reply('❌ Please provide a valid URL.', {
                reply_to_message_id: ctx.message.message_id
            });
        }
        return
    }

    // Insert the request into the database
    insertRequest(user_id, url, message_id);

    // Inform the user to wait while content is being downloaded and sent
    await ctx.reply('⏳ Please wait while the content is being downloaded and sent.', {
        reply_to_message_id: ctx.message.message_id
    });

});


// Handle callback queries for audio download
client.on('callback_query', async (ctx) => {
    const callbackData = ctx.callbackQuery.data;

    if (callbackData.startsWith('download_audio:')) {
        const uniqueId = callbackData.substring('download_audio:'.length);
        const getUr = getUrlFromDatabase(uniqueId);
        // Acknowledge the callback query
        await ctx.answerCbQuery();

        // Inform the user to wait while content is being downloaded
        const waitingMessage = await ctx.reply('⏳ Please wait while the audio is being downloaded and sent.');

        try {
            // Download audio only
            const response = await downloadFromUrl(getUr?.url, { audioOnly: true });

            if (response?.error) {
                await ctx.reply(`❌ Error downloading audio: ${response.error}`);
                return await ctx.deleteMessage(waitingMessage.message_id);
            }

            if (Array.isArray(response.result)) {
                for (const item of response.result) {
                    const itm = {
                        ...item,
                        type: "audio"
                    }
                    await sendMedia(client, getUr?.user_id, itm, ctx.callbackQuery.message.message_id, undefined, getUr?.urlType);
                }
            } else if (typeof response.result === 'object') {
                const itm = {
                    ...response.result,
                    type: "audio"
                }
                await sendMedia(client, getUr?.user_id, itm, ctx.callbackQuery.message.message_id, undefined, getUr?.urlType);
            }
        } catch (error) {
            console.error('Error downloading audio:', error);
            await ctx.reply(`❌ ${error.message}`);
        }
        // Delete the waiting message
        await ctx.deleteMessage(waitingMessage.message_id);
    }
});

async function startBot() {
    try {

        // Get pending requests from the database
        const Users = getAllUsers();

        // Calculate number of pending requests
        const numUsers = Users.length;
        const botInfo = await client.telegram.getMe();
        // startup message
        const startupMessage = `
🤖 **Bot Startup Information**
📅 Current Time: ${new Date().toLocaleString()}
🚀 Bot Status: Operational
👥 Users: ${numUsers}
🤖 Bot Username: @${botInfo.username}
📜 Bot Description: bot for downloading media from several popular websites.

🌟 Enjoy using the bot!
`;

        console.log(startupMessage);

        await processPendingRequests(client);

        // Start the bot
        client.launch().then(() => {
            console.log('🌟 Bot is running...');
        }).catch((err) => {
            console.error('❌ Error starting bot:', err);
        });
    } catch (error) {
        console.error('❌ Error in processPendingRequests:', error);
    }
}

// Start the bot
startBot();