try { document.documentElement.dataset.theme = localStorage.getItem('qalaTheme') === 'night' ? 'night' : 'day'; } catch (_) { document.documentElement.dataset.theme = 'day'; }
