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
    // Define a list of extensions that are considered audio files
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.opus'];

    const downloadOptions = { audioOnly: options?.audioOnly };
    const SaveDir = './downloads';

    try {
        switch (urlType) {
            case 'YouTube':
                try {
                    const downloadFromYouTube = await downlib.downloadFromYouTube(url, SaveDir, downloadOptions);
                    if (downloadFromYouTube?.success) {
                        const iterator = downloadFromYouTube?.json || {};
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
                            type: audioExtensions.includes(iterator.ext) ? "audio" : iterator._type,
                            buffer: downloadFromYouTube.buffer,
                        };
                        return { success: true, result: Info, urlType };
                    } else {
                        return { success: false, error: downloadFromYouTube?.error ? downloadFromYouTube.error : 'No video information found' };
                    }
                } catch (error) {
                    console.error('Error in downloadFromYouTube:', error);
                    return { success: false, error: `Error in downloadFromYouTube: ${error}` };
                }
            case 'Instagram':
                try {
                    const downloadFromInstagram = await downlib.downloadFromInstagram(url, SaveDir);
                    if (downloadFromInstagram?.results) {
                        const extractedInfo = downloadFromInstagram.results.map(item => ({
                            link: item.link,
                            ext: item.extension,
                            filename: item.filename,
                            type: imageExtensions.includes(item.extension) ? 'image' : (videoExtensions.includes(item.extension) ? 'video' : 'Unknown'),
                            buffer: item.buffer
                        }));
                        return { success: true, result: extractedInfo, urlType };
                    } else {
                        return { success: false, error: downloadFromInstagram?.error ? downloadFromInstagram.error : 'No media information found' };
                    }
                } catch (error) {
                    console.error('Error in downloadFromInstagram:', error);
                    return { success: false, error: `Error in downloadFromInstagram: ${error}` };
                }
            case 'TikTok':
                try {
                    const downloadFromTikTok = await downlib.downloadFromTikTok(url, SaveDir);
                    if (downloadFromTikTok?.result) {
                        const extractedInfo = [];
                        for (const iterator of downloadFromTikTok.result.media) {
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
                        return { success: true, result: extractedInfo, urlType };
                    } else {
                        return { success: false, error: downloadFromTikTok?.error ? downloadFromTikTok.error : `No media information found: ${downloadFromTikTok}` };
                    }
                } catch (error) {
                    console.error('Error in downloadFromTikTok:', error);
                    return { success: false, error: `Error in downloadFromTikTok: ${error}` };
                }
            case 'Facebook':
                try {
                    const downloadFromFacebook = await downlib.downloadFromFacebook(url, SaveDir, downloadOptions);
                    if (downloadFromFacebook?.success) {
                        const iterator = downloadFromFacebook?.json || {};
                        const extractedInfo = {
                            link: iterator.webpage_url,
                            title: iterator.title,
                            description: iterator.description,
                            thumbnail: iterator.thumbnail,
                            id: iterator.id,
                            view_count: iterator.view_count,
                            duration_string: iterator.duration_string,
                            type: iterator._type,
                            buffer: downloadFromFacebook.buffer,
                        };
                        return { success: true, result: extractedInfo, urlType };
                    } else {
                        return { success: false, error: downloadFromFacebook?.error ? downloadFromFacebook.error : 'No media information found' };
                    }
                } catch (error) {
                    console.error('Error in downloadFromFacebook:', error);
                    return { success: false, error: `Error in downloadFromFacebook: ${error}` };
                }
            case 'Twitter':
                try {
                    const downloadFromTwitter = await downlib.downloadFromTwitter(url, SaveDir, downloadOptions);
                    if (downloadFromTwitter?.success) {
                        const iterator = downloadFromTwitter?.json || {};
                        const extractedInfo = {
                            link: iterator.webpage_url,
                            title: iterator.title,
                            description: iterator.description,
                            thumbnail: iterator.thumbnail,
                            id: iterator.id,
                            duration_string: iterator.duration_string,
                            ext: iterator.ext,
                            type: iterator._type,
                            buffer: downloadFromTwitter.buffer,
                        };
                        return { success: true, result: extractedInfo, urlType };
                    } else {
                        return { success: false, error: downloadFromTwitter?.error ? downloadFromTwitter.error : 'No media information found' };
                    }
                } catch (error) {
                    console.error('Error in downloadFromTwitter:', error);
                    return { success: false, error: `Error in downloadFromTwitter: ${error}` };
                }
            case 'Reddit':
                try {
                    const downloadFromReddit = await downlib.downloadFromReddit(url, SaveDir, downloadOptions);
                    if (downloadFromReddit?.success) {
                        const iterator = downloadFromReddit?.json || {};
                        const extractedInfo = {
                            link: iterator.webpage_url,
                            title: iterator.title,
                            thumbnail: iterator.thumbnail,
                            id: iterator.id,
                            duration_string: iterator.duration_string,
                            ext: iterator.ext,
                            type: iterator._type,
                            buffer: downloadFromReddit.buffer,
                        };
                        return { success: true, result: extractedInfo, urlType };
                    } else {
                        return { success: false, error: downloadFromReddit?.error ? downloadFromReddit.error : 'No media information found' };
                    }
                } catch (error) {
                    console.error('Error in downloadFromReddit:', error);
                    return { success: false, error: `Error in downloadFromReddit: ${error}` };
                }
            case 'SoundCloud':
                try {
                    const downloadFromSoundCloud = await downlib.downloadFromSoundCloud(url, SaveDir, downloadOptions);
                    if (downloadFromSoundCloud?.success) {
                        const iterator = downloadFromSoundCloud?.json || {};
                        const extractedInfo = {
                            link: iterator.webpage_url,
                            title: iterator.title,
                            description: iterator.description,
                            thumbnail: iterator.thumbnail,
                            id: iterator.id,
                            view_count: iterator.view_count,
                            duration_string: iterator.duration_string,
                            ext: iterator.jsonext,
                            type: audioExtensions.includes(iterator.ext) ? "audio" : iterator._type,
                            buffer: downloadFromSoundCloud.buffer,
                        };
                        return { success: true, result: extractedInfo, urlType };
                    } else {
                        return { success: false, error: downloadFromSoundCloud?.error ? downloadFromSoundCloud.error : 'No media information found' };
                    }
                } catch (error) {
                    console.error('Error in downloadFromSoundCloud:', error);
                    return { success: false, error: `Error in downloadFromSoundCloud: ${error}` };
                }
            case 'Dailymotion':
                try {
                    const downloadFromDailymotion = await downlib.downloadFromDailymotion(url, SaveDir, downloadOptions);
                    if (downloadFromDailymotion?.success) {
                        const iterator = downloadFromDailymotion?.json || {};
                        const extractedInfo = {
                            link: iterator.webpage_url,
                            title: iterator.title,
                            description: iterator.description,
                            thumbnail: iterator.thumbnail,
                            id: iterator.id,
                            view_count: iterator.view_count,
                            duration_string: iterator.duration_string,
                            ext: iterator.ext,
                            type: iterator._type,
                            buffer: downloadFromDailymotion.buffer,
                        };
                        return { success: true, result: extractedInfo, urlType };
                    } else {
                        return { success: false, error: downloadFromDailymotion?.error ? downloadFromDailymotion.error : 'No media information found' };
                    }
                } catch (error) {
                    console.error('Error in downloadFromDailymotion:', error);
                    return { success: false, error: `Error in downloadFromDailymotion: ${error}` };
                }
            case 'Twitch':
                try {
                    const downloadFromTwitch = await downlib.downloadFromTwitch(url, SaveDir, downloadOptions);
                    if (downloadFromTwitch?.success) {
                        const iterator = downloadFromTwitch?.json || {};
                        const extractedInfo = {
                            link: iterator.webpage_url,
                            title: iterator.title,
                            description: iterator.description,
                            thumbnail: iterator.thumbnail,
                            id: iterator.id,
                            view_count: iterator.view_count,
                            duration_string: iterator.duration_string,
                            ext: iterator.ext,
                            type: iterator._type,
                            buffer: downloadFromTwitch.buffer,
                        };
                        return { success: true, result: extractedInfo, urlType };
                    } else {
                        true
                        return { success: false, error: downloadFromTwitch?.error ? downloadFromTwitch.error : 'No media information found' };
                    }
                } catch (error) {
                    console.error('Error in downloadFromTwitch:', error);
                    return { success: false, error: `success: false, Error in downloadFromTwitch: ${error}` };
                }
            default:
                return { success: false, error: `Unsupported URL type: ${urlType}` };
        }

    } catch (error) {
        return { success: false, error: error?.error ? error?.error : JSON.stringify(error) };
    }
}