/**
 * LICENSE MIT
 * Copyright (c) 2024 rn0x
 * github: https://github.com/rn0x
 * telegram: https://t.me/F93ii
 * repository: https://github.com/rn0x/fetchdl-telegram
 */

// Utils.js

/**
 * Maximum length allowed for a Telegram message.
 * @type {number}
 */
export const MAX_MESSAGE_LENGTH = 4096;

/**
 * Creates a caption based on the type of URL.
 * @param {Object} item - The item containing information about the URL.
 * @param {string} urlType - The type of URL (e.g., YouTube, Instagram).
 * @returns {string} The generated caption.
 */
export function createCaption(item, urlType) {
    let caption = '';

    switch (urlType) {
        case 'YouTube':
            caption = `<b>🎥 Title:</b> ${item.title}\n<b>📝 Description:</b> ${item.description}\n<b>👁‍🗨 Views:</b> ${item.view_count}\n<b>👍 Likes:</b> ${item.like_count}\n<b>📺 Channel:</b> <a href="${item.channel_url}">${item.channel}</a>\n<b>⏱ Duration:</b> ${item.duration_string}\n`;
            break;
        case 'Instagram':
            caption = `<b>📸 Link:</b> <a href="${item.link}">Instagram Post</a>`;
            break;
        case 'TikTok':
            caption = `<b>🎵 Username:</b> ${item.username}\n<b>📹 Link:</b> <a href="${item.link}">TikTok Post</a>`;
            break;
        case 'Facebook':
            caption = `<b>📘 Title:</b> ${item.title}\n<b>📝 Description:</b> ${item.description}\n<b>🔗 Link:</b> <a href="${item.link}">Facebook Post</a>`;
            break;
        case 'Twitter':
            caption = `<b>🐦 Title:</b> ${item.title}\n<b>📝 Description:</b> ${item.description}\n<b>🔗 Link:</b> <a href="${item.link}">Twitter Post</a>`;
            break;
        case 'Reddit':
            caption = `<b>👾 Title:</b> ${item.title}\n<b>🔗 Link:</b> <a href="${item.link}">Reddit Post</a>`;
            break;
        case 'SoundCloud':
            caption = `<b>🔊 Title:</b> ${item.title}\n<b>📝 Description:</b> ${item.description}\n<b>🔗 Link:</b> <a href="${item.link}">SoundCloud Track</a>`;
            break;
        case 'Dailymotion':
            caption = `<b>📺 Title:</b> ${item.title}\n<b>📝 Description:</b> ${item.description}\n<b>🔗 Link:</b> <a href="${item.link}">Dailymotion Video</a>`;
            break;
        case 'Twitch':
            caption = `<b>🎮 Title:</b> ${item.title}\n<b>📝 Description:</b> ${item.description}\n<b>🔗 Link:</b> <a href="${item.link}">Twitch Stream</a>`;
            break;
        default:
            caption = ``;
            break;
    }

    // Add bot credits
    caption += `\n\n©️ @F93ii | @w7ii7`;

    // Truncate the caption to a maximum length
    return truncateText(caption);
}

/**
 * Truncates the given text if it exceeds the maximum message length.
 * @param {string} text - The text to truncate.
 * @returns {string} The truncated text, if necessary.
 */
export function truncateText(text) {
    if (text.length > MAX_MESSAGE_LENGTH) {
        const truncated = '... (truncated)';
        return text.substring(0, MAX_MESSAGE_LENGTH - truncated.length) + truncated;
    } else {
        return text;
    }
}


/**
 * Generates a unique ID string.
 * @param {number} length - Length of the unique ID string.
 * @returns {string} A unique ID string.
 * @private
 */
export function generateUniqueId(length = 20) {
    return Math.random().toString(36).substr(2, length);
}
