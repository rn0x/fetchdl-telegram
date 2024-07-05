/**
 * LICENSE MIT
 * Copyright (c) 2024 rn0x
 * github: https://github.com/rn0x
 * telegram: https://t.me/F93ii
 * repository: https://github.com/rn0x/fetchdl-telegram
 */

// processPendingRequests.js
import { getPendingRequests, deleteRequestById, storeUrlInDatabase } from './database.js';
import sendMedia from './sendMedia.js';
import downloadFromUrl from './downloadFromUrl.js';


/**
 * Function to sleep for a given amount of milliseconds.
 * @param {number} ms - Milliseconds to sleep.
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Processes pending download requests for media, handling errors and storing URLs.
 * @param {TelegrafContext} client - The Telegraf client instance.
 * @returns {Promise<void>} Promise that resolves when all pending requests are processed.
 */
export default async function processPendingRequests(client) {
    try {
        // Get current pending requests from database
        const pendingRequests = getPendingRequests();

        if (pendingRequests.length > 0) {
            // Iterate through each pending request
            for (const request of pendingRequests) {
                const { id, user_id, url, message_id } = request;
                try {
                    // Race the download promise against the timeout promise
                    const response = await downloadFromUrl(url);
                    if (response?.error) {
                        await client.telegram.sendMessage(user_id, `❌ Error downloadFromUrl: ${response.error}`, {
                            reply_to_message_id: message_id
                        });
                    } else {
                        // Store original URL in database
                        const uniqueId = storeUrlInDatabase({
                            url: url,
                            user_id: user_id,
                            urlType: response.urlType
                        });
                        // Process response based on its structure
                        if (Array.isArray(response.result)) {
                            for (const item of response.result) {
                                await sendMedia(client, user_id, item, message_id, uniqueId, response.urlType);
                            }
                        } else if (typeof response.result === 'object') {
                            await sendMedia(client, user_id, response.result, message_id, uniqueId, response.urlType);
                        } else {
                            console.log('Unexpected response format:', response);
                            await client.telegram.sendMessage(user_id, `❌ Unexpected response format from download service.`, {
                                reply_to_message_id: message_id
                            });
                        }
                    }
                } catch (error) {
                    console.error('❌ Error downloading media:', error);
                }

                // Delete request from database after successful processing
                deleteRequestById(id);
            }
        }

        // Sleep for 5 seconds before checking for new requests
        await sleep(5000);

        // Call processPendingRequests again to check for new requests
        processPendingRequests(client);
    } catch (error) {
        console.log(error);
    }
}
