/**
 * Robust YouTube ID utilities
 * - URL API 우선 파싱, 정규식 보조
 * - 더 많은 경로 포맷 지원 (shorts, live, v)
 * - m.youtube, music.youtube 등 서브도메인 허용
 * - nocookie 도메인 허용
 */

const YT_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

// 허용 도메인 (서브도메인 포함)과 별도 도메인
const YT_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "gaming.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com"]);

function safeURL(input: string): URL | null {
  try {
    // 스킴이 없으면 임시로 https:// 붙여 시도
    if (!/^[a-zA-Z]+:\/\//.test(input)) {
      return new URL(`https://${input}`);
    }
    return new URL(input);
  } catch {
    return null;
  }
}

function extractFromPathSegments(segments: string[]): string | null {
  // /embed/{id}, /v/{id}, /live/{id}, /shorts/{id}
  if (segments.length >= 2) {
    const [a, b] = segments;
    if (["embed", "v", "live", "shorts"].includes(a) && YT_ID_RE.test(b)) {
      return b;
    }
  }
  return null;
}

export function extractYouTubeVideoId(input: string): string | null {
  if (typeof input !== "string") return null;
  const s = input.trim();
  if (!s) return null;

  // 이미 ID인지 검사
  if (YT_ID_RE.test(s)) return s;

  // URL로 파싱 시도
  const url = safeURL(s);
  if (url && YT_HOSTS.has(url.hostname)) {
    // 1) youtu.be/{id}
    if (url.hostname.endsWith("youtu.be")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      if (id && YT_ID_RE.test(id)) return id;
    }

    // 2) watch?v={id}
    const v = url.searchParams.get("v");
    if (v && YT_ID_RE.test(v)) {
      return v;
    }

    // 3) /embed|/v|/live|/shorts/{id}
    const segments = url.pathname.split("/").filter(Boolean);
    const id2 = extractFromPathSegments(segments);
    if (id2) return id2;
  }

  // ...?v=VIDEO_ID
  const vMatch = s.match(/[?&#]v=([a-zA-Z0-9_-]{11})/);
  if (vMatch) return vMatch[1];

  // youtu.be/VIDEO_ID (뒤에 파라미터가 섞여도 첫 세그먼트만 잡음)
  const shortMatch = s.match(/(?:^|https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // (no)cookie embed
  const embedMatch = s.match(/youtube(?:-nocookie)?\.com\/(?:embed|v|live|shorts)\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  return null;
}

export function validateYouTubeVideoId(videoId: string): boolean {
  return typeof videoId === "string" && YT_ID_RE.test(videoId);
}

export function parseYouTubeInput(input: string): string | null {
  const id = extractYouTubeVideoId(input);
  return id && validateYouTubeVideoId(id) ? id : null;
}
