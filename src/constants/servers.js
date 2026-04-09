export const servers = [
  { name: "Vidsrc CC", url: (id, type, s, e) => `https://vidsrc.cc/v2/embed/${type}/${id}${type === 'tv' ? `/${s}/${e}` : ''}` },
  { name: "VidSrc Pro", url: (id, type, s, e) => `https://vidsrc.me/embed/${type}/${id}${type === 'tv' ? `/${s}/${e}` : ''}` },
  { name: "VidFast", url: (id, type, s, e) => `https://vidfast.pro/${type}/${id}${type === 'tv' ? `?s=${s}&e=${e}` : ''}` },
  { name: "VidLink", url: (id, type, s, e) => `https://vidlink.pro/${type}/${id}${type === 'tv' ? `/${s}/${e}` : ''}` },
  { name: "VidKing", url: (id, type, s, e) => `https://www.vidking.net/embed/${type}/${id}${type === 'tv' ? `/${s}/${e}` : ''}?color=9146ff` },
  { name: "SuperEmbed", url: (id, type, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1${type === 'tv' ? `&s=${s}&e=${e}` : ''}` },
];
