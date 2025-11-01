let player;
let playerReady = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytPlayerContainer', {
    height: '180',
    width: '320',
    videoId: localStorage.getItem('ytVideoId') || '',
    playerVars: { autoplay: 0, controls: 1 },
    events: {
      onReady: () => {
        playerReady = true;
        if(localStorage.getItem('ytVolume')){
          player.setVolume(localStorage.getItem('ytVolume'));
          document.getElementById('ytVolume').value = localStorage.getItem('ytVolume');
        }
      }
    }
  });
}

const toggleBtn = document.getElementById('ytWidgetToggle');
const ytWidget = document.getElementById('ytWidget');
const linkInput = document.getElementById('ytLinkInput');
const playPauseBtn = document.getElementById('ytPlayPauseBtn');
const volumeSlider = document.getElementById('ytVolume');

// Toggle widget
toggleBtn.addEventListener('click', () => {
  ytWidget.style.display = ytWidget.style.display === 'none' ? 'block' : 'none';
});

// Extract video ID
function extractVideoId(url){
  let videoId = '';
  if(url.includes('v=')){
    videoId = url.split('v=')[1].split('&')[0];
  } else if(url.includes('youtu.be/')){
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }
  return videoId;
}

// Insert video
linkInput.addEventListener('change', () => {
  let videoId = extractVideoId(linkInput.value);
  if(!videoId || !playerReady) return;
  player.loadVideoById(videoId);
  player.playVideo();
  playPauseBtn.textContent = 'Pause';
  localStorage.setItem('ytVideoId', videoId);
});

// Play/pause button
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
