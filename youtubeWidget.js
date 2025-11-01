let player;
let playerReady = false;

// Создание YouTube плеера
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytPlayerContainer', {
    height: '120',
    width: '320',
    videoId: localStorage.getItem('ytVideoId') || '',
    playerVars: { autoplay: 0, controls: 0 },
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

// Элементы виджета
const toggleBtn = document.getElementById('ytWidgetToggle');
const ytWidget = document.getElementById('ytWidget');
const linkInput = document.getElementById('ytLinkInput');
const playPauseBtn = document.getElementById('ytPlayPauseBtn');
const volumeSlider = document.getElementById('ytVolume');
const timerContainer = document.querySelector('.timer-container');

// Получение видео ID из ссылки
function extractVideoId(url){
  let videoId = '';
  if(url.includes('v=')){
    videoId = url.split('v=')[1].split('&')[0];
  } else if(url.includes('youtu.be/')){
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }
  return videoId;
}

// Умное позиционирование виджета
function updateWidgetPosition(){
  const rect = timerContainer.getBoundingClientRect();
  let top = rect.top - ytWidget.offsetHeight - 10; // над таймером
  if(top < 10) top = rect.bottom + 10; // если мало места сверху, разместить снизу
  let left = rect.right - ytWidget.offsetWidth;
  if(left < 10) left = 10;
  ytWidget.style.top = top + 'px';
  ytWidget.style.left = left + 'px';
}

// Показ/скрытие виджета
toggleBtn.addEventListener('click', () => {
  if(ytWidget.style.display === 'none'){
    updateWidgetPosition();
    ytWidget.style.display = 'block';
    toggleBtn.style.transform = 'rotate(20deg)';
  } else {
    ytWidget.style.display = 'none';
    toggleBtn.style.transform = 'rotate(0deg)';
  }
});

// Обновление позиции при изменении окна
window.addEventListener('resize', updateWidgetPosition);

// Вставка видео
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

// Громкость
volumeSlider.addEventListener('input', () => {
  if(playerReady) player.setVolume(volumeSlider.value);
  localStorage.setItem('ytVolume', volumeSlider.value);
});

// Следим за таймером и подстраиваем виджет
const observer = new MutationObserver(updateWidgetPosition);
observer.observe(timerContainer, { attributes: true, childList: true, subtree: true });

// Делаем виджет перетаскиваемым
ytWidget.onmousedown = function(e) {
  let shiftX = e.clientX - ytWidget.getBoundingClientRect().left;
  let shiftY = e.clientY - ytWidget.getBoundingClientRect().top;

  function moveAt(pageX, pageY) {
    ytWidget.style.left = pageX - shiftX + 'px';
    ytWidget.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(e) {
    moveAt(e.pageX, e.pageY);
  }

  document.addEventListener('mousemove', onMouseMove);

  ytWidget.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    ytWidget.onmouseup = null;
  };
};

ytWidget.ondragstart = function() {
  return false;
};
