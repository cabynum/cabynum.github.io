(function() {
  'use strict';

  const STORAGE_KEY = 'jackson-summer-2026-guide';

  function loadGuide() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  }

  function saveGuide() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guideState));
  }

  let guideState = loadGuide();

  const allFields = document.querySelectorAll('[data-field]');
  const totalFields = allFields.length;

  function restoreFields() {
    allFields.forEach(el => {
      const key = el.dataset.field;
      if (guideState[key]) {
        el.value = guideState[key];
        el.classList.add('has-value');
      }
    });
  }

  function countFilled() {
    let filled = 0;
    allFields.forEach(el => {
      if (el.value.trim()) filled++;
    });
    return filled;
  }

  function renderProgress() {
    const filled = countFilled();
    const pct = Math.round((filled / totalFields) * 100);
    const el = document.getElementById('guide-progress');
    el.innerHTML = `
      <div class="progress-bar"><div class="progress-fill books-fill" style="width:${pct}%"></div></div>
      <span class="guide-progress-text">${filled}/${totalFields} fields · ${pct}%</span>
    `;
  }

  allFields.forEach(el => {
    el.addEventListener('input', () => {
      const key = el.dataset.field;
      guideState[key] = el.value;
      saveGuide();

      if (el.value.trim()) {
        el.classList.add('has-value');
      } else {
        el.classList.remove('has-value');
      }

      renderProgress();
    });
  });

  restoreFields();
  renderProgress();
})();
