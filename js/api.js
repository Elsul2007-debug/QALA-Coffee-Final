'use strict';
(() => {
  const panel = document.getElementById('weatherContent');
  if (!panel) return;
  const status = document.getElementById('weatherStatus');
  const details = document.getElementById('weatherDetails');
  const retry = document.getElementById('weatherRetry');
  const endpoint = 'https://api.open-meteo.com/v1/forecast?latitude=51.1694&longitude=71.4491&current=temperature_2m,apparent_temperature,precipitation,weather_code&timezone=Asia%2FAlmaty';
  function conditions(code) {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy / overcast';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rain or drizzle';
    if (code <= 77) return 'Snow';
    if (code <= 82) return 'Rain showers';
    if (code <= 86) return 'Snow showers';
    return 'Thunderstorms';
  }
  async function loadWeather() {
    panel.setAttribute('aria-busy', 'true'); details.hidden = true; retry.disabled = true;
    status.textContent = 'Loading weather for Astana…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(endpoint, { signal: controller.signal });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json(); const current = data.current;
      if (!current || !Number.isFinite(current.temperature_2m) || !Number.isFinite(current.weather_code) || typeof current.time !== 'string') throw new Error('Invalid weather data');
      document.getElementById('weatherTemperature').textContent = `${Math.round(current.temperature_2m)} °C`;
      document.getElementById('weatherDescription').textContent = `${conditions(current.weather_code)} · Feels like ${current.apparent_temperature} °C`;
      document.getElementById('weatherRecommendation').textContent = current.temperature_2m < 10 ? 'A warm latte and a comfortable indoor seat sound just right.' : current.temperature_2m >= 25 ? 'Take a relaxed break with a light tea and a slice of cake.' : 'A cappuccino makes a lovely companion for your city walk.';
      document.getElementById('weatherTime').textContent = `Model update: ${current.time.replace('T', ' ')} (Astana, UTC+5). Coffee suggestion by QALA.`;
      details.hidden = false; status.textContent = 'Current weather loaded.';
    } catch (_) {
      status.textContent = 'Weather is unavailable right now. Check your connection and try again. Our menu is still available.';
    } finally {
      clearTimeout(timer); retry.disabled = false; panel.setAttribute('aria-busy', 'false');
    }
  }
  retry.addEventListener('click', loadWeather);
  loadWeather();
})();
