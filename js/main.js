// js/main.js — Conexión automática con Supabase vía Netlify Functions
function loadProductsByCategory(targetCategory) {
  const container = document.getElementById('products-container');
  if (!container) return;

  // Usa la función de Netlify para evitar bloqueos de CSP
  fetch('/.netlify/functions/get-products')
    .then(response => response.json())
    .then(products => {
      if (!Array.isArray(products)) {
        console.error('Formato de productos inválido:', products);
        container.innerHTML = '<p>Error al cargar los productos.</p>';
        return;
      }

      const filtered = products.filter(p => 
        p.active && 
        p.category && 
        p.category.trim().toLowerCase() === targetCategory.trim().toLowerCase()
      );

      if (filtered.length === 0) {
        container.innerHTML = `<p>No hay productos disponibles para "${targetCategory}".</p>`;
        return;
      }

      container.innerHTML = filtered.map(p => `
        <div class="product-card">
          <h3>${p.name}</h3>
          <p>${p.game}</p>
          <div class="price">$${p.price}</div>
          <button onclick="window.open('https://wa.me/+584127442672', '_blank')">Comprar</button>
        </div>
      `).join('');
    })
    .catch(err => {
      console.error('Error al cargar productos:', err);
      container.innerHTML = '<p>No se pudieron cargar los productos. Inténtalo más tarde.</p>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
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