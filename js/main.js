// 🔑 CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = 'https://htpeqjdlzzygczrvhcll.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cGVxamRsenp5Z2N6cnZoY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MzQ1NTMsImV4cCI6MjA3NDUxMDU1M30.dForPgwzfR5eusItwPYL-e3zj97Od6p4tWXc_CFlRtA';

// Usar versión global (sin módulos)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Cargar productos por categoría (solo en páginas como fc-mobile.html)
function loadProductsByCategory(category) {
  const container = document.getElementById('products-container');
  if (!container) return; // Si no hay contenedor, no hacer nada

  supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        container.innerHTML = '<p>Error al cargar productos.</p>';
        console.error(error);
        return;
      }

      if (data.length === 0) {
        container.innerHTML = '<p>No hay productos disponibles para esta categoría.</p>';
        return;
      }

      container.innerHTML = data.map(p => `
        <div class="product-card">
          <h3>${p.name}</h3>
          <p>${p.game}</p>
          <div class="price">$${p.price}</div>
          <button onclick="contactSeller()">Comprar</button>
        </div>
      `).join('');
    });
}

// Cargar reseñas (solo en index.html)
function loadReviews() {
  const slider = document.getElementById('reviews-slider');
  if (!slider) return;

  supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error || data.length === 0) return;

      slider.innerHTML = data.map(r => `
        <div class="swiper-slide">
          <img src="${r.image_url || 'https://via.placeholder.com/60'}" alt="${r.name}">
          <p>"${r.message}"</p>
          <strong>– ${r.name}</strong>
        </div>
      `).join('');

      // Iniciar Swiper
      if (typeof Swiper !== 'undefined') {
        new Swiper('.swiper', {
          pagination: { el: '.swiper-pagination' },
          loop: true,
          autoplay: { delay: 4000 },
          slidesPerView: 1,
          spaceBetween: 20,
          breakpoints: {
            768: { slidesPerView: 2 }
          }
        });
      }
    });
}

// Contacto por WhatsApp
function contactSeller() {
  window.open('https://wa.me/+584127442672', '_blank');
}

// Iniciar funciones según la página
document.addEventListener('DOMContentLoaded', () => {
  // Si es index.html, cargar reseñas
  if (document.getElementById('reviews-slider')) {
    loadReviews();
  }

  // Si es una página de categoría, cargar productos
  const path = window.location.pathname;
  if (path.includes('fc-mobile.html')) {
    loadProductsByCategory('FC Mobile');
  } else if (path.includes('roblox.html')) {
    loadProductsByCategory('Roblox');
  } else if (path.includes('free-fire.html')) {
    loadProductsByCategory('Free Fire');
  } else if (path.includes('call-of-duty.html')) {
    loadProductsByCategory('Call of Duty');
  }
});