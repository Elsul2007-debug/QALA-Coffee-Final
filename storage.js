'use strict';
// All data is browser-local. This is intentionally a frontend authentication simulation.
window.Qala = {
  read(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
    catch (_) { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (_) { return false; }
  },
  users() {
    const list = this.read('qalaUsers', []);
    return Array.isArray(list) ? list.filter(user => user && typeof user.email === 'string' && typeof user.password === 'string') : [];
  },
  currentUser() {
    const session = this.read('qalaSession', null);
    return this.users().find(user => user.email === session) || null;
  },
  favoriteKey() { return 'qalaFavorites:' + (this.currentUser()?.email || 'guest'); },
  favorites() {
    const list = this.read(this.favoriteKey(), []);
    return Array.isArray(list) ? list.filter(item => typeof item === 'string') : [];
  }
};
