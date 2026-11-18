'use strict';
(() => {
  const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRule = /^\+?[1-9]\d{6,14}$/;
  const passwordRule = /^(?=.{8,64}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S+$/;
  const byId = id => document.getElementById(id);
  function error(input, message) {
    let label = byId(input.id + 'Error');
    if (!label) {
      label = document.createElement('p'); label.id = input.id + 'Error';
      label.className = 'field-error'; label.setAttribute('aria-live', 'polite');
      input.after(label); input.setAttribute('aria-describedby', label.id);
    }
    label.textContent = message; input.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }
  function email(input) {
    const value = input.value.trim();
    return error(input, !value ? 'Please enter your email address.' : value.length > 254 || !emailRule.test(value) ? 'Enter a valid email, such as you@example.com.' : '');
  }
  function phone(input) {
    const raw = input.value.trim();
    const value = raw.replace(/[\s()-]/g, '');
    return error(input, !raw ? 'Please enter your phone number.' : !phoneRule.test(value) ? 'Use 7-15 digits, optionally starting with +, e.g. +7 701 234 5678.' : '');
  }
  function name(input) {
    const value = input.value.trim();
    return error(input, value.length < 2 || value.length > 100 ? 'Enter a name between 2 and 100 characters.' : '');
  }
  function password(input) {
    return error(input, !passwordRule.test(input.value) ? 'Use 8-64 characters with uppercase, lowercase, a number and a symbol; no spaces.' : '');
  }
  function focusError(form) { form.querySelector('[aria-invalid="true"]')?.focus(); }
  function clearErrors(form) {
    form.addEventListener('input', event => {
      if (event.target.matches('input,textarea')) error(event.target, '');
      const status = form.querySelector('[role="status"]'); if (status) status.textContent = '';
    });
  }
  const signup = byId('signupForm');
  if (signup) {
    clearErrors(signup);
    signup.addEventListener('submit', event => {
      event.preventDefault(); byId('accountStatus').textContent = '';
      const pass = byId('accountPassword'), confirm = byId('confirmPassword');
      const checks = [name(byId('fullName')), email(byId('accountEmail')), phone(byId('accountPhone')), password(pass), error(confirm, confirm.value && confirm.value === pass.value ? '' : 'Passwords must match.')];
      if (checks.includes(false)) { focusError(signup); return; }
      const address = byId('accountEmail').value.trim().toLowerCase();
      const users = Qala.users();
      if (users.some(user => user.email === address)) { error(byId('accountEmail'), 'This email already has an account. Please log in.'); focusError(signup); return; }
      const user = { name: byId('fullName').value.trim(), email: address, phone: byId('accountPhone').value.trim(), password: pass.value };
      // Password storage follows the assignment simulation; never use this for real authentication.
      if (!Qala.write('qalaUsers', [...users, user])) { byId('accountStatus').textContent = 'Your browser could not save the account. Allow site storage and try again.'; return; }
      location.assign('login.html?registered=1');
    });
  }
  const login = byId('loginForm');
  if (login) {
    clearErrors(login);
    if (new URLSearchParams(location.search).has('registered')) byId('accountStatus').textContent = 'Account created. Log in with your new details.';
    login.addEventListener('submit', event => {
      event.preventDefault(); byId('accountStatus').textContent = '';
      const checks = [email(byId('accountEmail')), password(byId('accountPassword'))];
      if (checks.includes(false)) { focusError(login); return; }
      const address = byId('accountEmail').value.trim().toLowerCase();
      const user = Qala.users().find(item => item.email === address && item.password === byId('accountPassword').value);
      if (!user) { byId('accountStatus').textContent = 'Email or password is incorrect. Please try again.'; return; }
      if (!Qala.write('qalaSession', user.email)) { byId('accountStatus').textContent = 'Your browser could not save the session. Allow site storage and retry.'; return; }
      location.assign('profile.html');
    });
  }
  const user = Qala.currentUser();
  document.querySelectorAll('[data-account-link]').forEach(link => {
    link.href = user ? 'profile.html' : 'login.html'; link.textContent = user ? 'My profile' : 'Log in';
    if (location.pathname.endsWith(user ? 'profile.html' : 'login.html')) link.setAttribute('aria-current', 'page');
  });
  if (byId('profileMember') && user) {
    byId('profileGuest').hidden = true; byId('profileMember').hidden = false;
    byId('profileName').textContent = user.name; byId('profileEmail').textContent = user.email; byId('profilePhone').textContent = user.phone;
    const favorites = Qala.favorites();
    (favorites.length ? favorites : ['No favorites yet. Explore Discover to save a coffee.']).forEach(text => {
      const item = document.createElement('li'); item.textContent = text; byId('profileFavorites').append(item);
    });
    byId('logoutButton').addEventListener('click', () => {
      if (Qala.write('qalaSession', null)) location.assign('login.html');
      else byId('accountStatus').textContent = 'Unable to clear the session. Check browser storage permissions.';
    });
  }
  // Refresh if another tab logs out, so stale profile details are not kept on screen.
  window.addEventListener('storage', event => { if (['qalaSession', 'qalaUsers'].includes(event.key) || event.key === null) location.reload(); });
  const contact = byId('contact-form');
  if (contact) {
    clearErrors(contact);
    const coffee = new URLSearchParams(location.search).get('coffee');
    if ([...contact.elements.coffee.options].some(option => option.value === coffee)) contact.elements.coffee.value = coffee;
    contact.addEventListener('submit', event => {
      event.preventDefault(); const result = byId('formResult'); result.hidden = true;
      const message = byId('message').value.trim();
      const checks = [name(byId('name')), email(byId('email')), phone(byId('phone')), error(byId('message'), message.length < 5 || message.length > 2000 ? 'Enter a message between 5 and 2000 characters.' : ''), error(byId('demoConsent'), byId('demoConsent').checked ? '' : 'Please acknowledge the demo before continuing.')];
      if (checks.includes(false)) { focusError(contact); return; }
      result.textContent = `Thanks, ${byId('name').value.trim()}. Your preview: “${message}”${byId('coffee').value ? ' · Favorite: ' + byId('coffee').value : ''}. No message was sent or order placed.`;
      result.hidden = false;
    });
    contact.addEventListener('reset', () => { contact.querySelectorAll('.field-error').forEach(node => node.textContent = ''); contact.querySelectorAll('[aria-invalid]').forEach(node => node.removeAttribute('aria-invalid')); byId('formResult').hidden = true; });
  }
})();
