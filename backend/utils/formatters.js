// helpers/formatters.js
function formatDuration(millis) {
  if (!millis) return '3:00';
  const totalSeconds = Math.floor(millis / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function cleanSongData(track) {
  return {
    id: track.trackId.toString(),
    title: track.trackName || 'Unknown',
    artist: track.artistName || 'Unknown Artist',
    album: track.collectionName || 'Unknown Album',
    thumbnail: (track.artworkUrl100 || track.artworkUrl60 || '')
      .replace('100x100', '600x600')
      .replace('60x60', '600x600'),
    duration: formatDuration(track.trackTimeMillis),
    previewUrl: track.previewUrl,
    genre: track.primaryGenreName || 'Music',
    releaseDate: track.releaseDate || '',
    price: track.trackPrice || 0
  };
}

function formatStreamResponse(track) {
  return {
    success: true,
    url: track.previewUrl,
    title: track.trackName,
    artist: track.artistName,
    duration: Math.floor((track.trackTimeMillis || 30000) / 1000),
    thumbnail: (track.artworkUrl100 || '').replace('100x100', '600x600')
  };
}

module.exports = {
  formatDuration,
  cleanSongData,
  formatStreamResponse
};