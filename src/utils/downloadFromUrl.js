/**
 * LICENSE MIT
 * Copyright (c) 2024 rn0x
 * github: https://github.com/rn0x
 * telegram: https://t.me/F93ii
 * repository: https://github.com/rn0x/fetchdl-telegram
 */ 

// downloadFromUrl.js
import Downlib from 'downlib';

// Initialize Downlib with optional configurations
const downlib = new Downlib({
    deleteAfterDownload: true,
});

/**
 * Downloads media from a given URL based on its type.
 * @param {string} url - The URL to download media from.
 * @param {Object} [options] - Optional configuration options.
 * @param {boolean} [options.audioOnly] - If true, downloads only the audio for YouTube videos.
 * @returns {Promise<{result?: any, error?: string}>} - A promise that resolves with the downloaded media information,
 * or rejects with an error message if the URL type is unsupported or if an error occurs during download.
 */
export default async function downloadFromUrl(url, options) {
    const urlType = downlib.checkUrlType(url);
    // Define a list of extensions that are considered images
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    // Define a list of extensions that are considered videos
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv'];
    try {
        switch (urlType) {
            case 'YouTube':
                const youtubeSaveDir = './downloads';
                const downloadOptions = { audioOnly: options?.audioOnly }
                const downloadFromYouTube = await downlib.downloadFromYouTube(url, youtubeSaveDir, downloadOptions);
                if (downloadFromYouTube.videos && downloadFromYouTube.videos.length > 0) {
                    const videos = downloadFromYouTube.videos;
                    let extractedInfo = [];
                    for (const iterator of videos) {
                        const FileExtension = getFileExtension(iterator._filename);
                        const Info = {
                            link: iterator.webpage_url,
                            title: iterator.title,
                            description: iterator.description,
                            thumbnail: iterator.thumbnail,
                            id: iterator.id,
                            view_count: iterator.view_count,
                            tags: iterator.tags,
                            like_count: iterator.like_count,
                            channel: iterator.channel,
                            channel_url: iterator.channel_url,
                            duration_string: iterator.duration_string,
                            ext: iterator.ext,
                            type: FileExtension === "mp3" ? "audio" : iterator._type,
                            buffer: iterator.buffer,
                        };
                        extractedInfo.push(Info)
                    }
                    return { result: extractedInfo, urlType };
                } else {
                    return { error: downloadFromYouTube?.error ? downloadFromYouTube.error : 'No video information found' };
                }
            case 'Instagram':
                const instagramSaveDir = './downloads';
                const downloadFromInstagram = await downlib.downloadFromInstagram(url, instagramSaveDir);
                if (downloadFromInstagram?.results) {
                    const extractedInfo = downloadFromInstagram.results.map(item => ({
                        link: item.link,
                        ext: item.extension,
                        filename: item.filename,
                        type: imageExtensions.includes(item.extension) ? 'image' : (videoExtensions.includes(item.extension) ? 'video' : 'Unknown'),
                        buffer: item.buffer
                    }));
                    return { result: extractedInfo, urlType };
                } else {
                    return { error: downloadFromInstagram?.error ? downloadFromInstagram.error : 'No media information found' };
                }

            case 'TikTok':
                const tiktokSaveDir = './downloads';
                const downloadFromTikTok = await downlib.downloadFromTikTok(url, tiktokSaveDir);
                if (downloadFromTikTok) {
                    const extractedInfo = [];
                    for (const iterator of downloadFromTikTok.media) {
                        const Info = {
                            id: downloadFromTikTok.id,
                            link: downloadFromTikTok.url,
                            username: downloadFromTikTok.username,
                            mediaLink: iterator.url,
                            fileName: iterator.fileName,
                            type: iterator.type,
                            buffer: iterator.buffer,
                        }
                        extractedInfo.push(Info)
                    }
                    return { result: extractedInfo, urlType };
                } else {
                    return { error: downloadFromTikTok?.error ? downloadFromTikTok.error : `No media information found: ${downloadFromTikTok}` };
                }
            case 'Facebook':
                const facebookSaveDir = './downloads';
                const downloadFromFacebook = await downlib.downloadFromFacebook(url, facebookSaveDir);
                if (downloadFromFacebook.buffer) {
                    const extractedInfo = {
                        link: downloadFromFacebook.webpage_url,
                        title: downloadFromFacebook.title,
                        description: downloadFromFacebook.description,
                        thumbnail: downloadFromFacebook.thumbnail,
                        id: downloadFromFacebook.id,
                        view_count: downloadFromFacebook.view_count,
                        duration_string: downloadFromFacebook.duration_string,
                        ext: downloadFromFacebook.ext,
                        type: downloadFromFacebook._type,
                        buffer: downloadFromFacebook.buffer,
                    };
                    return { result: extractedInfo, urlType };
                } else {
                    return { error: downloadFromFacebook?.error ? downloadFromFacebook.error : 'No media information found' };
                }
            case 'Twitter':
                const twitterSaveDir = './downloads';
                const downloadFromTwitter = await downlib.downloadFromTwitter(url, twitterSaveDir);
                if (downloadFromTwitter.buffer) {
                    const extractedInfo = {
                        link: downloadFromTwitter.webpage_url,
                        title: downloadFromTwitter.title,
                        description: downloadFromTwitter.description,
                        thumbnail: downloadFromTwitter.thumbnail,
                        id: downloadFromTwitter.id,
                        duration_string: downloadFromTwitter.duration_string,
                        ext: downloadFromTwitter.ext,
                        type: downloadFromTwitter._type,
                        buffer: downloadFromTwitter.buffer,
                    };
                    return { result: extractedInfo, urlType };
                } else {
                    return { error: downloadFromTwitter?.error ? downloadFromTwitter.error : 'No media information found' };
                }
            case 'Reddit':
                const redditSaveDir = './downloads';
                const downloadFromReddit = await downlib.downloadFromReddit(url, redditSaveDir);
                if (downloadFromReddit.buffer) {
                    const extractedInfo = {
                        link: downloadFromReddit.webpage_url,
                        title: downloadFromReddit.title,
                        thumbnail: downloadFromReddit.thumbnail,
                        id: downloadFromReddit.id,
                        duration_string: downloadFromReddit.duration_string,
                        ext: downloadFromReddit.ext,
                        type: downloadFromReddit._type,
                        buffer: downloadFromReddit.buffer,
                    };
                    return { result: extractedInfo, urlType };
                } else {
                    return { error: downloadFromReddit?.error ? downloadFromReddit.error : 'No media information found' };
                }
            case 'SoundCloud':
                const soundcloudSaveDir = './downloads';
                const downloadFromSoundCloud = await downlib.downloadFromSoundCloud(url, soundcloudSaveDir);
                const FileExtension = getFileExtension(downloadFromSoundCloud._filename);
                if (downloadFromSoundCloud.buffer) {
                    const extractedInfo = {
                        link: downloadFromSoundCloud.webpage_url,
                        title: downloadFromSoundCloud.title,
                        description: downloadFromSoundCloud.description,
                        thumbnail: downloadFromSoundCloud.thumbnail,
                        id: downloadFromSoundCloud.id,
                        view_count: downloadFromSoundCloud.view_count,
                        duration_string: downloadFromSoundCloud.duration_string,
                        ext: downloadFromSoundCloud.ext,
                        type: FileExtension === "mp3" ? "audio" : downloadFromSoundCloud._type,
                        buffer: downloadFromSoundCloud.buffer,
                    };
                    return { result: extractedInfo, urlType };
                } else {
                    return { error: downloadFromSoundCloud?.error ? downloadFromSoundCloud.error : 'No media information found' };
                }
            case 'Dailymotion':
                const dailymotionSaveDir = './downloads';
                const downloadFromDailymotion = await downlib.downloadFromDailymotion(url, dailymotionSaveDir);
                if (downloadFromDailymotion.buffer) {
                    const extractedInfo = {
                        link: downloadFromDailymotion.webpage_url,
                        title: downloadFromDailymotion.title,
                        description: downloadFromDailymotion.description,
                        thumbnail: downloadFromDailymotion.thumbnail,
                        id: downloadFromDailymotion.id,
                        view_count: downloadFromDailymotion.view_count,
                        duration_string: downloadFromDailymotion.duration_string,
                        ext: downloadFromDailymotion.ext,
                        type: downloadFromDailymotion._type,
                        buffer: downloadFromDailymotion.buffer,
                    };
                    return { result: extractedInfo, urlType };
                } else {
                    return { error: downloadFromDailymotion?.error ? downloadFromDailymotion.error : 'No media information found' };
                }
            case 'Twitch':
                const twitchSaveDir = './downloads';
                const downloadFromTwitch = await downlib.downloadFromTwitch(url, twitchSaveDir);
                if (downloadFromTwitch.buffer) {
                    const extractedInfo = {
                        link: downloadFromTwitch.webpage_url,
                        title: downloadFromTwitch.title,
                        description: downloadFromTwitch.description,
                        thumbnail: downloadFromTwitch.thumbnail,
                        id: downloadFromTwitch.id,
                        view_count: downloadFromTwitch.view_count,
                        duration_string: downloadFromTwitch.duration_string,
                        ext: downloadFromTwitch.ext,
                        type: downloadFromTwitch._type,
                        buffer: downloadFromTwitch.buffer,
                    };
                    return { result: extractedInfo, urlType };
                } else {
                    return { error: downloadFromTwitch?.error ? downloadFromTwitch.error : 'No media information found' };
                }
            default:
                return { error: `Unsupported URL type: ${urlType}` };
        }
    } catch (error) {
        return { error: error?.error ? error?.error : JSON.stringify(error) };
    }
}


/**
 * Extracts the file extension from a given filename.
 * @param {string} filename - The name of the file.
 * @returns {string} - The file extension, or an error message if invalid.
 */
function getFileExtension(filename) {
    try {
        // Regular expression to match the file extension
        const extensionPattern = /\.([0-9a-zA-Z]+)$/i;
        const match = filename.match(extensionPattern);

        if (match && match[1]) {
            return match[1];
        } else {
            throw new Error('Invalid filename format');
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}