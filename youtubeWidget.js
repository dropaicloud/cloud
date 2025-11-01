let player;
let playerReady = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytPlayerContainer', {
    height: '0', // скрыто
    width: '0',  // скрыто
    videoId: localStorage.getItem('ytVideoId') || '',
    playerVars: { autoplay: 0, controls: 0 },
    events: {
      onReady: () => {
        playerReady = true;
        if(localStorage.getItem('ytVolume')) {
          player.setVolume(localStorage.getItem('ytVolume'));
          document.getElementById('ytVolume').value = localStorage.getItem('ytVolume');
        }
      }
    }
  });
}

// Elements
const toggleBtn = document.getElementById('ytWidgetToggle');
const ytWidget = document.getElementById('ytWidget');
const linkInput = document.getElementById('ytLinkInput');
const playPauseBtn = document.getElementById('ytPlayPauseBtn');
const volumeSlider = document.getElementById('ytVolume');
const progressSlider = document.getElementById('ytProgress');

// Toggle widget
toggleBtn.addEventListener('click', () => {
  ytWidget.style.display = ytWidget.style.display === 'none' ? 'flex' : 'none';
});

// Extract video ID
function extractVideoId(url){
  let videoId = '';
  if(url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
  else if(url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
  return videoId;
}

// Load video
linkInput.addEventListener('change', () => {
  let videoId = extractVideoId(linkInput.value);
  if(!videoId || !playerReady) return;
  player.loadVideoById(videoId);
  player.playVideo();
  playPauseBtn.textContent = 'Pause';
  localStorage.setItem('ytVideoId', videoId);
});

// Play/Pause
playPauseBtn.addEventListener('click', () => {
  if(!playerReady) return;
  if(player.getPlayerState() === YT.PlayerState.PLAYING){
    player.pauseVideo();
    playPauseBtn.textContent = 'Play';
  } else {
    player.playVideo();
    playPauseBtn.textContent = 'Pause';
  }
});

// Volume
volumeSlider.addEventListener('input', () => {
  if(playerReady) player.setVolume(volumeSlider.value);
  localStorage.setItem('ytVolume', volumeSlider.value);
});

// Progress Slider
progressSlider.addEventListener('input', () => {
  if(playerReady && player.getDuration()){
    let newTime = (progressSlider.value / 100) * player.getDuration();
    player.seekTo(newTime, true);
  }
});

// Update progress continuously
setInterval(() => {
  if(playerReady && player.getDuration() && player.getPlayerState() === YT.PlayerState.PLAYING){
    progressSlider.value = (player.getCurrentTime() / player.getDuration()) * 100;
  }
}, 500);
