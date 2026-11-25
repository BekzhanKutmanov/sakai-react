// Разбор ссылок YouTube (обычные видео + Shorts)

export interface YoutubeVideoInfo {
    id: string;
    isShorts: boolean;
    embedUrl: string;
    thumbnail: string;
}

const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'];
const VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export const parseYoutubeUrl = (value: string | null | undefined): YoutubeVideoInfo | null => {
    if (!value) return null;

    let url: URL;
    try {
        url = new URL(value.trim());
    } catch {
        return null;
    }

    const host = url.hostname.toLowerCase();
    // путь без пустых сегментов: "/shorts/abc/" -> ['shorts', 'abc']
    const segments = url.pathname.split('/').filter(Boolean);
    let videoId: string | null = null;
    let isShorts = false;

    if (host === 'youtu.be' || host === 'www.youtu.be') {
        // короткая ссылка, видео ID — в пути
        videoId = segments[0] || null;
    } else if (YOUTUBE_HOSTS.includes(host)) {
        if (segments[0] === 'shorts') {
            // https://www.youtube.com/shorts/{id}
            videoId = segments[1] || null;
            isShorts = true;
        } else if (['embed', 'live', 'v'].includes(segments[0])) {
            // https://www.youtube.com/embed/{id}, /live/{id}
            videoId = segments[1] || null;
        } else {
            // стандартная ссылка, видео ID в параметре v
            videoId = url.searchParams.get('v');
        }
    }

    if (!videoId || !VIDEO_ID_REGEX.test(videoId)) return null;

    return {
        id: videoId,
        isShorts,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
};
