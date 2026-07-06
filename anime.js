const urlParams = new URLSearchParams(window.location.search);
const animeId = urlParams.get('id');
let currentPlayer = 'kodik';

document.addEventListener('DOMContentLoaded', loadAnimePage);

async function loadAnimePage() {
  const { data: anime } = await supabase.from('anime').select('*').eq('id', animeId).single();
  const { data: episodes } = await supabase.from('episodes').select('*').eq('anime_id', animeId).order('episode_number');

  document.getElementById('anime-page').innerHTML = `
    <h2 style="margin-top:20px;">${anime.title}</h2>
    <p style="color:var(--muted); margin:10px 0;">${anime.description}</p>

    <div style="display:flex; gap:10px; margin:20px 0;">
      <button class="btn" onclick="setPlayer('kodik')">Плеер Kodik</button>
      <button class="btn btn-outline" onclick="setPlayer('vk')">Плеер VK</button>
    </div>

    <div class="player-wrap" id="player"></div>

    <h3>Серии</h3>
    <div class="episode-list" id="ep-list"></div>
  `;

  renderEpisodes(episodes, anime);
  if(episodes.length > 0) playEpisode(episodes[0], anime);
}

function renderEpisodes(episodes, anime) {
  document.getElementById('ep-list').innerHTML = episodes.map(ep => `
    <div class="ep-btn" onclick='playEpisode(${JSON.stringify(ep)}, ${JSON.stringify(anime)})'>${ep.episode_number} серия</div>
  `).join('');
}

function playEpisode(ep, anime) {
  let playerHtml = '';
  if(currentPlayer === 'kodik' && (ep.kodik_id || anime.kodik_id)) {
    const id = ep.kodik_id || anime.kodik_id;
    playerHtml = `<iframe src="https://kodik.cc/find-player?title=${encodeURIComponent(anime.title)}&season=1&episode=${ep.episode_number}&type=anime" allowfullscreen></iframe>`;
  } else if(currentPlayer === 'vk' && (ep.vk_url || anime.vk_url)) {
    const url = ep.vk_url || anime.vk_url;
    playerHtml = `<iframe src="${url}" allowfullscreen></iframe>`;
  } else {
    playerHtml = '<div style="padding:40px; text-align:center;">Для этой серии нет плеера</div>';
  }
  document.getElementById('player').innerHTML = playerHtml;
}

function setPlayer(type) {
  currentPlayer = type;
  document.querySelectorAll('.btn').forEach(b => b.classList.remove('btn-outline'));
  event.target.classList.add('btn-outline');
      }
