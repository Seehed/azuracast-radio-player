document.addEventListener('DOMContentLoaded', () => {
  const audio = document.querySelector('#stream');
  const playPauseButton = document.querySelector('[name="play-pause"]');
  const playPauseButtonIcon = playPauseButton.querySelector('i.fas');
  const volumeControl = document.querySelector('[name="volume"]');
  const volumeButton = document.querySelector('[name="mute"]');
  const volumeButtonIcon = volumeButton.querySelector('i.fas');
  const albumArt = document.getElementById('album-art');
  const songTitle = document.getElementById('song-title');
  const artist = document.getElementById('artist');
  const djName = document.getElementById('dj-name');
  const requestLink = document.getElementById('request-link');
  const messageBox = document.getElementById('message-box');
  const historyList = document.getElementById('history-list');
  const nextSongTitle = document.getElementById('next-song-title');
  const nextSongArtist = document.getElementById('next-song-artist');
  const nextSongArt = document.getElementById('next-song-art');

  let isPlaying = false;
  let fetchInterval = null;
  let currentVolume = 0.2;

  audio.volume = currentVolume;

  const fetchCurrentlyPlaying = () => {
    fetch('enter-azuracast-api --- http://example.com/api/station-id')
      .then(response => response.json())
      .then(data => {
        const nowPlaying = data.now_playing.song;
        const nextPlaying = data.playing_next.song;
        //  U can delete the lines 32 - 49 if you do not have a request function!!
        // Assuming data is your JSON response
        const isLive = data.live.is_live;
        const streamerName = data.live.streamer_name;

        if (!isLive || !streamerName) {
          requestLink.href = '#';
          requestLink.addEventListener('click', (e) => {
            e.preventDefault();
            showMessage("Oops, Requests cannot be made while AutoDJ is active, please try again when a DJ is active", 5000);
          });
          djName.innerText = 'AutoDJ';
        } else {
          requestLink.href = 'request-song-url';
          requestLink.removeEventListener('click', (e) => {
            e.preventDefault();
            showMessage("Oops, Requests cannot be made while AutoDJ is active, please try again when a DJ is active", 5000);
          });

          if (data.live.art) {
            djName.innerHTML = `DJ: ${streamerName}<br><img src="${data.live.art}" alt="DJ Art" width="64" height="64">`;
          } else {
            djName.innerText = `DJ: ${streamerName}`;
          }

         
        }

        // Check if elements exist before setting innerText
        if (nowPlaying) {
          songTitle.innerText = nowPlaying.title;
          artist.innerText = nowPlaying.artist;
          albumArt.src = nowPlaying.art;
          albumArt.style.width = '64px';
          albumArt.style.height = '64px';

          // Update media session metadata for currently playing song
          if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: nowPlaying.title,
              artist: nowPlaying.artist,
              album: nowPlaying.album, // Add album information if available
              artwork: [{ src: nowPlaying.art, sizes: '64x64', type: 'image/png' }],
            });
          }

          albumArt.style.display = 'block';
        } else {
          // Handle the case when there is no currently playing song
          songTitle.innerText = 'default-not-playing-text';
          artist.innerText = 'default-not-playing-text';
          albumArt.style.display = 'none';

          // Clear media session metadata for currently playing song
          if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = null;
          }
        }

        // Check if nextPlaying exists before setting innerText
        if (nextPlaying) {
          nextSongTitle.innerText = nextPlaying.title;
          nextSongArtist.innerText = nextPlaying.artist;
          nextSongArt.src = nextPlaying.art;
          nextSongArt.style.width = '64px';
          nextSongArt.style.height = '64px';
        } else {
          nextSongTitle.innerText = 'No upcoming song';
          nextSongArtist.innerText = '';
          nextSongArt.src = ''; // Clear next playing song artwork
        }

        // Update history list
        const history = data.song_history.slice(0, 10);
        historyList.innerHTML = ''; // Clear previous history
        history.forEach(historyItem => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <span class="history-song-title">${historyItem.song.title}</span>
            <span class="history-artist">${historyItem.song.artist}</span>
            <img src="${historyItem.song.art}" alt="Album Art" class="recent-song-art" width="50" height="50">
          `;
          historyList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Error fetching currently playing song:', error);
      });
  };

  // Function to display a message for a specified duration
  const showMessage = (message, duration) => {
    messageBox.innerText = message;
    messageBox.style.display = 'block';
    setTimeout(() => {
      messageBox.style.display = 'none';
    }, duration);
  };

  // Function to adjust volume icon
  const adjustVolumeIcon = volume => {
    const volumeIcon = volumeControl.parentElement.querySelector('i.fas');
    
    if (volume === 0) {
      volumeIcon.classList.remove('fa-volume-down', 'fa-volume-up');
      volumeIcon.classList.add('fa-volume-off');
    } else if (volume < 0.5) {
      volumeIcon.classList.remove('fa-volume-off', 'fa-volume-up');
      volumeIcon.classList.add('fa-volume-down');
    } else {
      volumeIcon.classList.remove('fa-volume-off', 'fa-volume-down');
      volumeIcon.classList.add('fa-volume-up');
    }
  };

  volumeControl.addEventListener('input', () => {
    const volume = parseFloat(volumeControl.value);
    audio.volume = currentVolume = volume;
    adjustVolumeIcon(volume);
  });

  volumeButton.addEventListener('click', () => {
    if (audio.volume > 0) {
      audio.volume = 0;
      volumeControl.value = 0;
    } else {
      audio.volume = currentVolume;
      volumeControl.value = currentVolume;
    }
    adjustVolumeIcon(audio.volume);
  });

  playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playPauseButtonIcon.classList.remove('fa-pause');
      playPauseButtonIcon.classList.add('fa-play');
      clearInterval(fetchInterval);
      songTitle.innerText = 'Listen to radio-name;
      artist.innerText = '';
      albumArt.style.display = 'none';
      djName.innerText = '';
    } else {
      audio.play();
      playPauseButtonIcon.classList.remove('fa-play');
      playPauseButtonIcon.classList.add('fa-pause');
      fetchCurrentlyPlaying();
      fetchInterval = setInterval(fetchCurrentlyPlaying, 3000);
    }
    isPlaying = !isPlaying;
  });

  // Fetch initially and start updating
  fetchCurrentlyPlaying();
  fetchInterval = setInterval(fetchCurrentlyPlaying, 3000);
});

