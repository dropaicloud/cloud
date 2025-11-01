let youtubeWidget = document.getElementById('youtubeWidget');
let playerContainer = document.getElementById('youtubePlayerContainer');
let linkInput = document.getElementById('youtubeLinkInput');
let playPauseBtn = document.getElementById('ytPlayPauseBtn');
let volumeSlider = document.getElementById('ytVolume');
let minimizeBtn = document.getElementById('ytMinimizeBtn');
let player;

// Load YouTube IFrame API
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

// Toggle widget visibility
youtubeWidget.addEventListener('click', () => {
  playerContainer.style.display = playerContainer.style.display === 'flex' ? 'none' : 'flex';
});

// Minimize/maximize button
minimizeBtn.addEventListener('click', () => {
  playerContainer.style.height = playerContainer.style.height === '40px' ? '200px' : '40px';
});

// Drag functionality
let isDragging = false;
let offsetX, offsetY;
playerContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - playerContainer.getBoundingClientRect().left;
  offsetY = e.clientY - playerContainer.getBoundingClientRect().top;
});
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    playerContainer.style.left = `${e.clientX - offsetX}px`;
    playerContainer.style.top = `${e.clientY - offsetY}px`;
  }
});
document.addEventListener('mouseup', () => { isDragging = false; });

// Initialize YouTube player
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtubePlayer', {
    height: '150',
    width: '320',
    videoId: localStorage.getItem('ytVideoId') || '',
    events: { 'onReady': onPlayerReady }
  });
}

function onPlayerReady(event) {
  let volume = localStorage.getItem('ytVolume') || 50;
  event.target.setVolume(volume);
  if (localStorage.getItem('ytVideoId')) {
    event.target.playVideo();
    playPauseBtn.textContent = 'Pause';
  }
}

// Play/Pause button
playPauseBtn.addEventListener('click', () => {
  if (!player) return;
  let state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
    playPauseBtn.textContent = 'Play';
  } else {
    player.playVideo();
    playPauseBtn.textContent = 'Pause';
  }
});

// Volume control
volumeSlider.addEventListener('input', () => {
  if (player) player.setVolume(volumeSlider.value);
  localStorage.setItem('ytVolume', volumeSlider.value);
});

// Load video from link
linkInput.addEventListener('change', () => {
  let url = linkInput.value;
  let videoId = url.split('v=')[1];
  if (!videoId) return;
  videoId = videoId.split('&')[0];
  if (player) {
    player.loadVideoById(videoId);
    player.playVideo();
    playPauseBtn.textContent = 'Pause';
    localStorage.setItem('ytVideoId', videoId);
  }
});

// Mobile friendly resize
function resizePlayer() {
  if(window.innerWidth < 400){
    playerContainer.style.width = '90%';
    playerContainer.style.right = '5%';
    playerContainer.style.height = '180px';
  } else {
    playerContainer.style.width = '320px';
    playerContainer.style.height = '200px';
  }
}
window.addEventListener('resize', resizePlayer);
resizePlayer();
