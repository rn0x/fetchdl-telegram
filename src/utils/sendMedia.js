/**
 * LICENSE MIT
 * Copyright (c) 2024 rn0x
 * github: https://github.com/rn0x
 * telegram: https://t.me/F93ii
 * repository: https://github.com/rn0x/fetchdl-telegram
 */

// sendMedia.js
import { Markup } from 'telegraf';
import { createCaption, generateUniqueId } from './Utils.js';


// Helper function to send media (photo or video) to Telegram
export default async function sendMedia(client, user_id, result, replyToMessageId, uniqueId, urlType = null) {
    try {
        let caption = createCaption(result, urlType);
        let button = null;

        if (urlType !== 'Instagram' && urlType !== 'TikTok' && urlType !== 'SoundCloud') {
            const but_1 = [Markup.button.callback('🔊 Audio Only', `download_audio:${uniqueId}`)];
            button = Markup.inlineKeyboard([but_1]);
        }

        if (result.type === 'video') {
            await client.telegram.sendVideo(user_id, { source: result.buffer, filename: `${generateUniqueId(20)}.mp4` }, {
                caption,
                parse_mode: 'HTML',
                thumb: result.thumbnail,
                reply_to_message_id: replyToMessageId,
                reply_markup: button?.reply_markup
            });
        } else if (result.type === 'image') {
            await client.telegram.sendPhoto(user_id, { source: result.buffer, filename: `${generateUniqueId(20)}.jpg` }, {
                caption,
                parse_mode: 'HTML',
                reply_to_message_id: replyToMessageId
            });
        } else if (result.type === 'audio') {
            await client.telegram.sendAudio(user_id, { source: result.buffer, filename: `${generateUniqueId(20)}.mp3` }, {
                caption,
                parse_mode: 'HTML',
                reply_to_message_id: replyToMessageId
            });
        } else {
            console.log('Unknown media type:', result.type);
        }
    } catch (error) {
        console.error('Error sending media:', error);
        await client.telegram.sendMessage(user_id, `❌ Please try again later : ${error.toString()}`, {
            reply_to_message_id: replyToMessageId
        });
    }
}
