// 🔑 CONFIGURACIÓN
const ADMIN_PASSWORD = 'm4r1nl3ym4r$$$';
const SUPABASE_URL = 'https://htpeqjdlzzygczrvhcll.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cGVxamRsenp5Z2N6cnZoY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MzQ1NTMsImV4cCI6MjA3NDUxMDU1M30.dForPgwzfR5eusItwPYL-e3zj97Od6p4tWXc_CFmRtA';

// 🛑 CORRECCIÓN CLAVE: Inicializa Supabase usando la función createClient disponible globalmente.
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Login simple
function login() {
  const pass = document.getElementById('password-input').value;
  if (pass === ADMIN_PASSWORD) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadProducts();
    loadReviews();
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}

// Cerrar sesión
function logout() {
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('login-section').style.display = 'flex';
  document.getElementById('password-input').value = '';
  document.getElementById('login-error').style.display = 'none';
}

// ===== PRODUCTOS =====
async function loadProducts() {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return; }
  const list = document.getElementById('products-list');
  if (!list) return;

  list.innerHTML = data.map(p => `
    <div>
      <strong>${p.name}</strong><br>
      Juego: ${p.game} | Categoría: ${p.category || '—'} | Precio: $${p.price}
      <div style="margin-top:8px;">
        <button onclick="editProduct('${p.id}', \`${p.name}\`, \`${p.game}\`, \`${p.category || ''}\`, ${p.price}, ${p.active})">Editar</button>
        <button onclick="deleteProduct('${p.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

function editProduct(id, name, game, category, price, active) {
  document.getElementById('product-id').value = id;
  document.getElementById('product-name').value = name;
  document.getElementById('product-game').value = game;
  document.getElementById('product-category').value = category;
  document.getElementById('product-price').value = price;
  document.getElementById('product-active').checked = active;
}

async function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto?')) return;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) { alert('Error al eliminar'); console.error(error); }
  else loadProducts();
}

document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('product-id').value;
  const name = document.getElementById('product-name').value;
  const game = document.getElementById('product-game').value;
  const category = document.getElementById('product-category').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const active = document.getElementById('product-active').checked;

  if (!category) {
    alert('Por favor, selecciona una categoría.');
    return;
  }

  if (id) {
    const { error } = await supabase
      .from('products')
      .update({ name, game, category, price, active })
      .eq('id', id);
    if (error) { alert('Error al actualizar'); console.error(error); }
  } else {
    const { error } = await supabase
      .from('products')
      .insert({ name, game, category, price, active });
    if (error) { alert('Error al crear'); console.error(error); }
  }
  clearProductForm();
  loadProducts();
});

function clearProductForm() {
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
}

// ===== RESEÑAS =====
async function loadReviews() {
  const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return; }
  const list = document.getElementById('reviews-list');
  if (!list) return;

  list.innerHTML = data.map(r => `
    <div>
      <strong>${r.name}</strong>: ${r.message}
      <div style="margin-top:8px;">
        <button onclick="editReview('${r.id}', \`${r.name}\`, \`${r.message}\`, '${r.image_url || ''}')">Editar</button>
        <button onclick="deleteReview('${r.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

function editReview(id, name, message, imageUrl) {
  document.getElementById('review-id').value = id;
  document.getElementById('review-name').value = name;
  document.getElementById('review-message').value = message;
  document.getElementById('review-image').value = imageUrl;
}

async function deleteReview(id) {
  if (!confirm('¿Eliminar esta reseña?')) return;
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) { alert('Error al eliminar'); console.error(error); }
  else loadReviews();
}

document.getElementById('review-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('review-id').value;
  const name = document.getElementById('review-name').value;
  const message = document.getElementById('review-message').value;
  const image_url = document.getElementById('review-image').value || null;

  if (id) {
    const { error } = await supabase
      .from('reviews')
      .update({ name, message, image_url })
      .eq('id', id);
    if (error) { alert('Error al actualizar'); console.error(error); }
  } else {
    const { error } = await supabase
      .from('reviews')
      .insert({ name, message, image_url });
    if (error) { alert('Error al crear'); console.error(error); }
  }
  clearReviewForm();
  loadReviews();
});

function clearReviewForm() {
  document.getElementById('review-form').reset();
  document.getElementById('review-id').value = '';
}