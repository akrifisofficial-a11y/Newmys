let isAdmin = false;

function login() {
  const pass = document.getElementById('password').value;
  if(pass === ADMIN_PASSWORD) {
    isAdmin = true;
    localStorage.setItem('anivolume_admin', 'true');
    showPanel();
  } else {
    document.getElementById('login-error').textContent = 'Неверный пароль';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('anivolume_admin') === 'true') showPanel();
  loadAdminAnime();
});

function showPanel() {
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
}

async function addAnime() {
  const file = document.getElementById('cover').files[0];
  const fileName = `${Date.now()}_${file.name}`;
  await supabase.storage.from('covers').upload(fileName, file);
  const { data } = supabase.storage.from('covers').getPublicUrl(fileName);

  await supabase.from('anime').insert({
    title: document.getElementById('title').value,
    cover: data.publicUrl,
    description: document.getElementById('desc').value,
    kodik_id: document.getElementById('kodik_id').value,
    vk_url: document.getElementById('vk_url').value
  });
  alert('Добавлено');
  location.reload();
}

async function loadAdminAnime() {
  const { data } = await supabase.from('anime').select('*');
  document.getElementById('anime-list').innerHTML = data.map(a => `
    <div class="form">
      <h3>${a.title}</h3>
      <button class="btn btn-danger" onclick="deleteAnime(${a.id})">Удалить аниме</button>
    </div>
  `).join('');
}

async function deleteAnime(id) {
  if(confirm('Точно удалить?')) {
    await supabase.from('anime').delete().eq('id', id);
    location.reload();
  }
}
