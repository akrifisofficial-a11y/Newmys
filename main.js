document.addEventListener('DOMContentLoaded', loadAnime);
async function loadAnime() {
  const { data } = await supabase.from('anime').select('*').order('created_at', { ascending: false });
  document.getElementById('anime-grid').innerHTML = data.map(a => `
    <a href="anime.html?id=${a.id}" class="card">
      <img src="${a.cover}" alt="${a.title}">
      <div class="card-body"><div class="card-title">${a.title}</div></div>
    </a>
  `).join('');
}
