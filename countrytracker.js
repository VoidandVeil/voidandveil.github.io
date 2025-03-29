const SHEETDB_URL = 'https://sheetdb.io/api/v1/0ffevxyaac6ek';
const FLAG_CONTAINER_ID = "flag-tracker";

// Only log one visit per visitor per day
const today = new Date().toISOString().split('T')[0];
const hasLoggedToday = localStorage.getItem('flag-logged') === today;

if (!hasLoggedToday) {
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(location => {
      const code = location.country_code;

      // Save that we logged today
      localStorage.setItem('flag-logged', today);

      // Check if the country already exists in the sheet
      fetch(`${SHEETDB_URL}/search?country=${code}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            const currentCount = parseInt(data[0].count || 0);
            // Update the count
            fetch(SHEETDB_URL, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                data: [{ country: code, count: currentCount + 1 }]
              })
            }).catch(err => console.error("PATCH error:", err));
          } else {
            // Create a new country entry
            fetch(SHEETDB_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: [{ country: code, count: 1 }] })
            }).catch(err => console.error("POST error:", err));
          }
        })
        .catch(err => console.error("Search error:", err));
    })
    .catch(err => console.error("Geo lookup error:", err));
}

// Display flags
function loadFlags() {
  const container = document.getElementById(FLAG_CONTAINER_ID);
  if (!container) return;

  fetch(SHEETDB_URL)
    .then(res => res.json())
    .then(countries => {
      container.innerHTML = `<h3>🌍 Visitors by Country</h3>`;
      countries.sort((a, b) => parseInt(b.count) - parseInt(a.count));

      countries.forEach(entry => {
        const flagURL = `https://flagcdn.com/24x18/${entry.country.toLowerCase()}.png`;
        const el = document.createElement('div');
        el.style.marginBottom = '0.4rem';
        el.innerHTML = `
          <img src="${flagURL}" alt="${entry.country}" style="margin-right: 8px; vertical-align: middle;">
          ${entry.country} – ${entry.count}
        `;
        container.appendChild(el);
      });
    })
    .catch(err => console.error("Failed to load flag data:", err));
}

// Load flags after delay
setTimeout(loadFlags, 3000);
