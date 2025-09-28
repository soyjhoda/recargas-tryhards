function loadProducts(game) {
  const container = document.getElementById('products-container');
  if (!container) return;

  fetch('/js/data.json')
    .then(res => res.json())
    .then(data => {
      const products = data[game] || [];
      const active = products.filter(p => p.active);

      if (active.length === 0) {
        container.innerHTML = '<p>No hay productos disponibles.</p>';
        return;
      }

      container.innerHTML = active.map(p => `
        <div class="product-card">
          <h3>${p.name}</h3>
          <p>${game}</p>
          <div class="price">$${p.price}</div>
          <button onclick="window.open('https://wa.me/+584127442672', '_blank')">Comprar</button>
        </div>
      `).join('');
    })
    .catch(() => {
      container.innerHTML = '<p>Error al cargar productos.</p>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  if (location.pathname.includes('fc-mobile.html')) loadProducts('FC Mobile');
  else if (location.pathname.includes('roblox.html')) loadProducts('Roblox');
  else if (location.pathname.includes('free-fire.html')) loadProducts('Free Fire');
  else if (location.pathname.includes('call-of-duty.html')) loadProducts('Call of Duty');
});