// not allowed enter html tag into input
export const forbiddenHtmlRegex = /[<>]/;

// 2. Regex not allowed links (xws li http://, https://, www.)
// not allowed link http, https, or file script into input
export const forbiddenLinkRegex = /(http:\/\/|https:\/\/|www\.)\S+/i;