'use strict';
// Menu filter: native buttons remain operable with keyboard and touch.
const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  let count = 0;
  document.querySelectorAll('[data-category]').forEach(item => {
    item.hidden = category !== 'all' && item.dataset.category !== category;
    if (!item.hidden) count++;
  });
  filters.forEach(other => {
    const active = other === button;
    other.setAttribute('aria-pressed', String(active));
    other.classList.toggle('btn-dark', active);
    other.classList.toggle('btn-outline-dark', !active);
  });
  document.getElementById('filterStatus').textContent = `${count} ${count === 1 ? 'favorite' : 'favorites'}, made for you.`;
}));
