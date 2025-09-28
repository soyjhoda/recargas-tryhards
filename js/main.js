function loadProductsByCategory(targetCategory) {
  const container = document.getElementById('products-container');
  if (!container) return;

  fetch('/.netlify/functions/get-products')
    .then(res => res.json())
    .then(products => {
      const filtered = products.filter(p => 
        p.category.trim().toLowerCase() === targetCategory.trim().toLowerCase()
      );

      if (filtered.length === 0) {
        container.innerHTML = `<p>No hay productos para "${targetCategory}".</p>`;
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
      console.error('Error:', err);
      container.innerHTML = '<p>Error al cargar productos.</p>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  if (location.pathname.includes('fc-mobile.html')) loadProductsByCategory('FC Mobile');
  else if (location.pathname.includes('roblox.html')) loadProductsByCategory('Roblox');
  else if (location.pathname.includes('free-fire.html')) loadProductsByCategory('Free Fire');
  else if (location.pathname.includes('call-of-duty.html')) loadProductsByCategory('Call of Duty');
});