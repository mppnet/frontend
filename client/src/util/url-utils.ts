export function getParameterByName(name: string, url: string = window.location.href): string | null {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function getRoomNameFromURL(): string {
  let channel_id = decodeURIComponent(window.location.pathname);
  if (channel_id.substr(0, 1) === '/') channel_id = channel_id.substr(1);
  if (!channel_id) channel_id = getParameterByName('c') || '';
  if (!channel_id) channel_id = 'lobby';
  return channel_id;
}
