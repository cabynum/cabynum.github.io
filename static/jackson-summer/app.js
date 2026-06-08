(function() {
  'use strict';

  const SCHEDULE_START = new Date(2026, 5, 8);
  const SCHEDULE_END = new Date(2026, 7, 1);

  const AR_DATES = [
    { date: new Date(2026, 5, 10), time: '9:30 AM – 12:00 PM' },
    { date: new Date(2026, 5, 24), time: '9:30 AM – 12:00 PM' },
    { date: new Date(2026, 6, 8),  time: '1:00 – 4:00 PM' },
    { date: new Date(2026, 6, 22), time: '1:00 – 4:00 PM' },
    { date: new Date(2026, 6, 28), time: '9:30 AM – 12:00 PM' },
    { date: new Date(2026, 7, 7),  time: '2:30 – 7:00 PM' },
  ];

  const MATH_LEVELS = {
    prealgebra: { label: 'Pre-Algebra', problems: 60 },
    algebra1: { label: 'Algebra 1', problems: 60 },
    geometry: { label: 'Honors Geometry', problems: 50 },
  };

  // ─── THE OUTSIDERS: Chapter Plan + Quiz ────────────────────────────────────
  const OUTSIDERS_PLAN = [
    {
      day: 0,
      chapters: 'Chapters 1–2',
      pages: '~30 pages',
      summary: 'Meet Ponyboy, the Greasers, and the Socs. Pony gets jumped walking home.',
      quiz: [
        { q: 'What are the two rival groups in the story?', a: 'The Greasers and the Socs' },
        { q: 'Who is the narrator?', a: 'Ponyboy Curtis' },
        { q: 'What happens to Ponyboy on his walk home from the movies?', a: 'He gets jumped/attacked by Socs' },
      ]
    },
    {
      day: 1,
      chapters: 'Chapter 3',
      pages: '~18 pages',
      summary: 'Ponyboy and Johnny meet Cherry and Marcia at the drive-in. Two-Bit joins them.',
      quiz: [
        { q: 'Who does Ponyboy talk to at the drive-in?', a: 'Cherry Valance' },
        { q: 'What does Cherry say is the difference between Socs and Greasers?', a: 'Socs are emotionally detached/cold; Greasers feel things too much' },
        { q: 'Why does Ponyboy get in trouble when he gets home late?', a: 'Darry hits him / they get in a fight' },
      ]
    },
    {
      day: 2,
      chapters: 'Chapter 4',
      pages: '~15 pages',
      summary: 'Ponyboy runs away. He and Johnny are attacked in the park. Johnny kills Bob.',
      quiz: [
        { q: 'Why do the Socs attack Johnny and Ponyboy in the park?', a: 'They\'re angry about their girlfriends talking to Greasers / they\'re drunk' },
        { q: 'Who does Johnny kill?', a: 'Bob Sheldon' },
        { q: 'Who do they go to for help?', a: 'Dally (Dallas Winston)' },
      ]
    },
    {
      day: 3,
      chapters: 'Chapter 5',
      pages: '~20 pages',
      summary: 'Hiding in the abandoned church. They disguise themselves. Johnny brings Gone with the Wind.',
      quiz: [
        { q: 'Where do Ponyboy and Johnny hide?', a: 'An abandoned church in Windrixville' },
        { q: 'How do they disguise themselves?', a: 'They cut and bleach/dye their hair' },
        { q: 'What poem does Ponyboy recite to Johnny?', a: '"Nothing Gold Can Stay" by Robert Frost' },
      ]
    },
    {
      day: 4,
      chapters: 'Chapter 6',
      pages: '~18 pages',
      summary: 'Dally visits. They decide to turn themselves in. The church catches fire. Johnny is badly hurt.',
      quiz: [
        { q: 'What happens to the church while they\'re gone?', a: 'It catches fire' },
        { q: 'Why do Ponyboy and Johnny run into the burning church?', a: 'To save the kids trapped inside' },
        { q: 'What injuries does Johnny suffer?', a: 'A broken back / severe burns' },
      ]
    },
    {
      day: 5,
      chapters: 'Chapters 7–8',
      pages: '~28 pages',
      summary: 'The boys are in the newspaper. Johnny is dying. The rumble is planned.',
      quiz: [
        { q: 'How does the town react to Ponyboy and Johnny?', a: 'They\'re called heroes in the newspaper' },
        { q: 'What does Johnny say when Ponyboy visits him in the hospital?', a: 'He says he doesn\'t want to die / "Stay gold"' },
        { q: 'What is the rumble?', a: 'A big fight between the Greasers and the Socs' },
      ]
    },
    {
      day: 6,
      chapters: 'Chapter 9',
      pages: '~18 pages',
      summary: 'The rumble. The Greasers win. Pony and Dally rush to the hospital.',
      quiz: [
        { q: 'Who wins the rumble?', a: 'The Greasers' },
        { q: 'What does Ponyboy realize about fighting during the rumble?', a: 'That fighting doesn\'t solve anything / he doesn\'t enjoy it' },
        { q: 'Why do Dally and Pony rush to the hospital after?', a: 'Johnny is dying' },
      ]
    },
    {
      day: 7,
      chapters: 'Chapters 10–11',
      pages: '~22 pages',
      summary: 'Johnny and Dally die. Ponyboy is in shock, drifts through days in bed.',
      quiz: [
        { q: 'What are Johnny\'s last words?', a: '"Stay gold, Ponyboy. Stay gold."' },
        { q: 'What does Dally do after Johnny dies?', a: 'He robs a store and gets shot by police (dies)' },
        { q: 'How does Ponyboy cope with the deaths?', a: 'He\'s in denial / gets sick / stays in bed' },
      ]
    },
    {
      day: 8,
      chapters: 'Chapter 12',
      pages: '~16 pages',
      summary: 'The court hearing. Ponyboy finds Johnny\'s letter. He starts writing his theme.',
      quiz: [
        { q: 'What is the verdict at Ponyboy\'s hearing?', a: 'He\'s acquitted / found not guilty' },
        { q: 'What does Johnny\'s letter tell Pony?', a: 'That saving the kids was worth it, and to "stay gold"' },
        { q: 'What does Ponyboy decide to write his English theme about?', a: 'His own story (which becomes the book itself)' },
      ]
    },
  ];

  // ─── STATE ────────────────────────────────────────────────────────────────
  function loadState() {
    const saved = localStorage.getItem('jackson-summer-2026');
    return saved ? JSON.parse(saved) : {
      books: { book1: false, book2: false, book3: false, book4: false },
      bookPicks: { book1: '', book3: '', book4: '' },
      math: { level: null, completed: [] },
      todayDone: {},
      quizAnswers: {},
    };
  }

  function saveState() {
    localStorage.setItem('jackson-summer-2026', JSON.stringify(state));
  }

  let state = loadState();
  if (!state.quizAnswers) state.quizAnswers = {};
  if (!state.bookPicks) state.bookPicks = { book1: '', book3: '', book4: '' };

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  function today() {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function dayKey(d) {
    return d.toISOString().slice(0, 10);
  }

  function isWeekday(d) {
    const day = d.getDay();
    return day !== 0 && day !== 6;
  }

  function getWeekdays(start, end) {
    const days = [];
    const d = new Date(start);
    while (d <= end) {
      if (isWeekday(d)) days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return days;
  }

  function formatDate(d) {
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function formatWeekday(d) {
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }

  function getNextARDate() {
    const now = today();
    return AR_DATES.find(a => a.date >= now);
  }

  function getNextWeekday(fromDate) {
    const d = new Date(fromDate);
    do {
      d.setDate(d.getDate() + 1);
    } while (!isWeekday(d));
    return d;
  }

  // ─── GREETING ─────────────────────────────────────────────────────────────
  function renderGreeting() {
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Morning, Jackson' : hour < 17 ? 'Hey Jackson' : 'Evening, Jackson';
    document.getElementById('greeting').textContent = greet;

    const now = today();
    if (now < SCHEDULE_START) {
      document.getElementById('hero-sub').textContent = 'Summer work starts June 8. You\'re ahead of the game.';
    } else if (now > SCHEDULE_END) {
      document.getElementById('hero-sub').textContent = 'Summer work is done. Nice job. 🎉';
    } else if (!isWeekday(now)) {
      document.getElementById('hero-sub').textContent = 'It\'s the weekend. Rest up — back at it Monday.';
    } else {
      document.getElementById('hero-sub').textContent = 'Here\'s what\'s on deck today.';
    }
  }

  // ─── TODAY ────────────────────────────────────────────────────────────────
  function renderToday() {
    const now = today();
    const metaEl = document.getElementById('today-meta');
    const tasksEl = document.getElementById('today-tasks');

    metaEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    const weekdays = getWeekdays(SCHEDULE_START, SCHEDULE_END);
    const todayIdx = weekdays.findIndex(d => dayKey(d) === dayKey(now));

    if (!isWeekday(now) || todayIdx < 0) {
      // Show what's coming next instead of "nothing to do"
      const nextWeekday = getNextWeekday(now);
      const nextIdx = weekdays.findIndex(d => dayKey(d) === dayKey(nextWeekday));

      if (now > SCHEDULE_END) {
        tasksEl.innerHTML = '<div class="today-task"><div class="task-body"><div class="task-name">All done for the summer!</div><div class="task-desc">Make sure all AR tests are taken and your written project is ready.</div></div></div>';
      } else {
        const previewTasks = nextIdx >= 0 ? buildTodayTasks(nextIdx, weekdays.length) : buildTodayTasks(0, weekdays.length);
        const dayLabel = nextWeekday.toLocaleDateString('en-US', { weekday: 'long' });
        tasksEl.innerHTML = `<div class="today-task"><div class="task-body"><div class="task-name" style="color:var(--text-muted);font-size:0.82rem;font-weight:500;margin-bottom:0.5rem">COMING UP ${dayLabel.toUpperCase()}</div></div></div>` +
          previewTasks.map(t => `
            <div class="today-task" style="opacity:0.7">
              <div class="task-dot ${t.type}"></div>
              <div class="task-body">
                <div class="task-name">${t.name}</div>
                <div class="task-desc">${t.desc}</div>
              </div>
            </div>
          `).join('');
      }
      return;
    }

    const tasks = buildTodayTasks(todayIdx, weekdays.length);
    tasksEl.innerHTML = tasks.map(t => {
      const key = dayKey(now) + '-' + t.id;
      const done = state.todayDone[key];
      return `
        <div class="today-task ${done ? 'done' : ''}" data-key="${key}">
          <div class="task-dot ${t.type}"></div>
          <div class="task-body">
            <div class="task-name">${t.name}</div>
            <div class="task-desc">${t.desc}</div>
          </div>
          <div class="task-check-box"></div>
        </div>
      `;
    }).join('');

    tasksEl.querySelectorAll('.today-task[data-key]').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.dataset.key;
        state.todayDone[key] = !state.todayDone[key];
        saveState();
        renderToday();
        renderProgress();
      });
    });
  }

  function buildTodayTasks(dayIdx, totalDays) {
    const tasks = [];
    const outsidersDays = OUTSIDERS_PLAN.length; // 9 days for The Outsiders

    // Determine reading phase
    if (dayIdx < outsidersDays) {
      const plan = OUTSIDERS_PLAN[dayIdx];
      tasks.push({
        id: 'read-outsiders-' + dayIdx,
        type: 'reading',
        name: `The Outsiders — ${plan.chapters}`,
        desc: `${plan.pages} — ${plan.summary}`,
      });
      tasks.push({
        id: 'needtoread-' + dayIdx,
        type: 'reading',
        name: '<a href="outsiders-guide.html" style="color:inherit;text-decoration:underline">Fill in Need to Read guide</a>',
        desc: 'The Outsiders — answer the daily questions for today\'s chapters',
      });
      tasks.push({
        id: 'quiz-' + dayIdx,
        type: 'reading',
        name: 'Quick quiz (3 questions)',
        desc: 'Check what you remember from today\'s Outsiders reading',
      });
    } else if (dayIdx < Math.floor(totalDays * 0.45)) {
      const pick = state.bookPicks.book1;
      const title = pick || 'Reader\'s Choice book';
      const desc = pick ? '~30-40 pages' : '~30-40 pages · Pick your book in the Reading section below';
      tasks.push({ id: 'read-choice', type: 'reading', name: `Read: ${title}`, desc });
    } else if (dayIdx < Math.floor(totalDays * 0.65)) {
      const pick = state.bookPicks.book3;
      const title = pick || 'House Arrest or MLK Jr.';
      const desc = pick ? '~30-40 pages' : '~30-40 pages · Pick your book in the Reading section below';
      tasks.push({ id: 'read-book3', type: 'reading', name: `Read: ${title}`, desc });
    } else {
      const pick = state.bookPicks.book4;
      const title = pick || 'your biography';
      const desc = pick ? 'Read + take notes for your written project' : 'Pick your biography in the Reading section below';
      tasks.push({ id: 'read-bio', type: 'reading', name: `Read: ${title}`, desc });
    }

    // Math
    if (state.math.level) {
      const level = MATH_LEVELS[state.math.level];
      const perDay = Math.ceil(level.problems / totalDays);
      const start = dayIdx * perDay + 1;
      const end = Math.min(start + perDay - 1, level.problems);
      if (start <= level.problems) {
        tasks.push({ id: 'math', type: 'math', name: `Math: problems ${start}–${end}`, desc: level.label + ' packet' });
      }
    } else {
      tasks.push({ id: 'math-pick', type: 'math', name: 'Pick your math packet', desc: 'Scroll down to the Math section' });
    }

    // Writing project in final stretch
    if (dayIdx > totalDays - 10) {
      tasks.push({ id: 'writing', type: 'writing', name: 'Work on biography written project', desc: 'Draft, revise, or finalize' });
    }

    return tasks;
  }

  // ─── PROGRESS ─────────────────────────────────────────────────────────────
  function renderProgress() {
    const booksComplete = Object.values(state.books).filter(Boolean).length;
    document.getElementById('books-fill').style.width = (booksComplete / 4 * 100) + '%';
    document.getElementById('books-count').textContent = booksComplete + ' / 4';

    if (state.math.level) {
      const total = MATH_LEVELS[state.math.level].problems;
      const done = state.math.completed.length;
      const pct = Math.round((done / total) * 100);
      document.getElementById('math-fill').style.width = pct + '%';
      document.getElementById('math-count').textContent = pct + '%';
    }
  }

  // ─── BOOKS ────────────────────────────────────────────────────────────────
  function renderBooks() {
    document.querySelectorAll('.check-btn').forEach(btn => {
      const bookId = btn.dataset.book;
      if (state.books[bookId]) {
        btn.classList.add('completed');
        btn.querySelector('.check-text').textContent = 'Done!';
      } else {
        btn.classList.remove('completed');
        btn.querySelector('.check-text').textContent = 'Mark Complete';
      }
    });

    // Restore book picks
    document.querySelectorAll('.book-pick-input').forEach(input => {
      const key = input.dataset.pick;
      if (state.bookPicks[key]) {
        input.value = state.bookPicks[key];
        input.closest('.book-pick').classList.add('picked');
      }
    });
    document.querySelectorAll('.book-pick-select').forEach(select => {
      const key = select.dataset.pick;
      if (state.bookPicks[key]) {
        select.value = state.bookPicks[key];
        select.closest('.book-pick').classList.add('picked');
      }
    });
  }

  document.querySelectorAll('.check-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookId = btn.dataset.book;
      state.books[bookId] = !state.books[bookId];
      saveState();
      renderBooks();
      renderProgress();
    });
  });

  // Book pick handlers
  document.querySelectorAll('.book-pick-input').forEach(input => {
    input.addEventListener('change', () => {
      const key = input.dataset.pick;
      state.bookPicks[key] = input.value.trim();
      saveState();
      if (input.value.trim()) {
        input.closest('.book-pick').classList.add('picked');
      } else {
        input.closest('.book-pick').classList.remove('picked');
      }
    });
  });
  document.querySelectorAll('.book-pick-select').forEach(select => {
    select.addEventListener('change', () => {
      const key = select.dataset.pick;
      state.bookPicks[key] = select.value;
      saveState();
      if (select.value) {
        select.closest('.book-pick').classList.add('picked');
      } else {
        select.closest('.book-pick').classList.remove('picked');
      }
    });
  });

  // ─── AR SCHEDULE ──────────────────────────────────────────────────────────
  function renderAR() {
    const container = document.getElementById('ar-schedule');
    const now = today();
    const next = getNextARDate();

    container.innerHTML = AR_DATES.map(a => {
      const past = a.date < now;
      const isNext = next && dayKey(a.date) === dayKey(next.date);
      const cls = past ? 'past' : isNext ? 'next' : '';
      const label = a.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' + a.time;
      return `<div class="ar-date ${cls}"><span class="ar-dot"></span>${label}</div>`;
    }).join('');
  }

  // ─── MATH ─────────────────────────────────────────────────────────────────
  function renderMath() {
    const selector = document.getElementById('math-selector');
    const tracker = document.getElementById('math-tracker');

    if (!state.math.level) {
      selector.classList.remove('hidden');
      tracker.classList.add('hidden');
    } else {
      selector.classList.add('hidden');
      tracker.classList.remove('hidden');

      const data = MATH_DATA[state.math.level];
      const allProblems = data.sections.flatMap((s, si) => s.problems.map((p, pi) => ({ ...p, key: si + '-' + pi })));
      const total = allProblems.length;

      document.getElementById('math-title').textContent = data.label;

      const done = state.math.completed.length;
      const pct = Math.round((done / total) * 100);
      document.getElementById('math-detail-fill').style.width = pct + '%';
      document.getElementById('math-detail-text').textContent = `${done} of ${total} problems done`;

      // Show today's section
      const weekdays = getWeekdays(SCHEDULE_START, SCHEDULE_END);
      const todayIdx = Math.max(0, weekdays.findIndex(d => dayKey(d) === dayKey(today())));
      const sectionsPerDay = Math.ceil(data.sections.length / weekdays.length) || 1;
      const sectionIdx = Math.min(Math.floor(todayIdx * sectionsPerDay), data.sections.length - 1);
      const currentSection = data.sections[sectionIdx] || data.sections[0];

      const mathToday = document.getElementById('math-today');
      if (currentSection && currentSection.problems[0].a !== '') {
        const problemsHtml = currentSection.problems.map((p, i) => {
          const key = sectionIdx + '-' + i;
          const isCorrect = state.math.completed.includes(key);
          return `
            <div class="worksheet-problem ${isCorrect ? 'correct' : ''}">
              <span class="wp-number">${i + 1}.</span>
              <span class="wp-question">${p.q}</span>
              <input class="wp-input" type="text" placeholder="?" data-key="${key}" data-answer="${p.a}" ${isCorrect ? 'disabled value="✓ ' + p.a + '"' : ''}>
              <button class="wp-check" data-key="${key}" data-answer="${p.a}" ${isCorrect ? 'disabled' : ''}>Check</button>
            </div>
          `;
        }).join('');

        mathToday.innerHTML = `
          <h4>${currentSection.title}</h4>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem">Type your answer and hit Check. Show your work on paper.</p>
          <div class="worksheet-problems">${problemsHtml}</div>
          <div class="worksheet-nav">
            <button class="link-btn" id="math-prev" ${sectionIdx === 0 ? 'disabled' : ''}>← Previous section</button>
            <span style="font-size:0.78rem;color:var(--text-muted)">Section ${sectionIdx + 1} of ${data.sections.length}</span>
            <button class="link-btn" id="math-next" ${sectionIdx >= data.sections.length - 1 ? 'disabled' : ''}>Next section →</button>
          </div>
        `;

        // Check answer handlers
        mathToday.querySelectorAll('.wp-check').forEach(btn => {
          btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            const answer = btn.dataset.answer.toLowerCase().trim();
            const input = mathToday.querySelector(`input[data-key="${key}"]`);
            const userAnswer = input.value.toLowerCase().trim();

            if (userAnswer === answer) {
              if (!state.math.completed.includes(key)) {
                state.math.completed.push(key);
                saveState();
              }
              input.disabled = true;
              input.value = '✓ ' + btn.dataset.answer;
              btn.disabled = true;
              input.closest('.worksheet-problem').classList.add('correct');
              renderProgress();
              // Update the count
              const newDone = state.math.completed.length;
              const newPct = Math.round((newDone / total) * 100);
              document.getElementById('math-detail-fill').style.width = newPct + '%';
              document.getElementById('math-detail-text').textContent = `${newDone} of ${total} problems done`;
            } else {
              input.closest('.worksheet-problem').classList.add('wrong');
              setTimeout(() => input.closest('.worksheet-problem').classList.remove('wrong'), 800);
            }
          });
        });

        // Enter key submits
        mathToday.querySelectorAll('.wp-input').forEach(input => {
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              const btn = input.parentElement.querySelector('.wp-check');
              if (btn && !btn.disabled) btn.click();
            }
          });
        });

        // Nav handlers
        const prevBtn = document.getElementById('math-prev');
        const nextBtn = document.getElementById('math-next');
        if (prevBtn) prevBtn.addEventListener('click', () => { state.math.viewSection = sectionIdx - 1; renderMathSection(sectionIdx - 1); });
        if (nextBtn) nextBtn.addEventListener('click', () => { state.math.viewSection = sectionIdx + 1; renderMathSection(sectionIdx + 1); });
      } else {
        mathToday.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem">This packet is being loaded. Download the PDF in the meantime.</p>';
      }
    }
  }

  function renderMathSection(idx) {
    // Re-render with a specific section index
    const data = MATH_DATA[state.math.level];
    if (idx < 0 || idx >= data.sections.length) return;

    const allProblems = data.sections.flatMap((s, si) => s.problems.map((p, pi) => ({ ...p, key: si + '-' + pi })));
    const total = allProblems.length;
    const currentSection = data.sections[idx];
    const mathToday = document.getElementById('math-today');

    const problemsHtml = currentSection.problems.map((p, i) => {
      const key = idx + '-' + i;
      const isCorrect = state.math.completed.includes(key);
      return `
        <div class="worksheet-problem ${isCorrect ? 'correct' : ''}">
          <span class="wp-number">${i + 1}.</span>
          <span class="wp-question">${p.q}</span>
          <input class="wp-input" type="text" placeholder="?" data-key="${key}" data-answer="${p.a}" ${isCorrect ? 'disabled value="✓ ' + p.a + '"' : ''}>
          <button class="wp-check" data-key="${key}" data-answer="${p.a}" ${isCorrect ? 'disabled' : ''}>Check</button>
        </div>
      `;
    }).join('');

    mathToday.innerHTML = `
      <h4>${currentSection.title}</h4>
      <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem">Type your answer and hit Check. Show your work on paper.</p>
      <div class="worksheet-problems">${problemsHtml}</div>
      <div class="worksheet-nav">
        <button class="link-btn" id="math-prev" ${idx === 0 ? 'disabled' : ''}>← Previous section</button>
        <span style="font-size:0.78rem;color:var(--text-muted)">Section ${idx + 1} of ${data.sections.length}</span>
        <button class="link-btn" id="math-next" ${idx >= data.sections.length - 1 ? 'disabled' : ''}>Next section →</button>
      </div>
    `;

    mathToday.querySelectorAll('.wp-check').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const answer = btn.dataset.answer.toLowerCase().trim();
        const input = mathToday.querySelector(`input[data-key="${key}"]`);
        const userAnswer = input.value.toLowerCase().trim();
        if (userAnswer === answer) {
          if (!state.math.completed.includes(key)) { state.math.completed.push(key); saveState(); }
          input.disabled = true; input.value = '✓ ' + btn.dataset.answer; btn.disabled = true;
          input.closest('.worksheet-problem').classList.add('correct');
          renderProgress();
          const newDone = state.math.completed.length;
          document.getElementById('math-detail-fill').style.width = Math.round((newDone / total) * 100) + '%';
          document.getElementById('math-detail-text').textContent = `${newDone} of ${total} problems done`;
        } else {
          input.closest('.worksheet-problem').classList.add('wrong');
          setTimeout(() => input.closest('.worksheet-problem').classList.remove('wrong'), 800);
        }
      });
    });

    mathToday.querySelectorAll('.wp-input').forEach(input => {
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const btn = input.parentElement.querySelector('.wp-check'); if (btn && !btn.disabled) btn.click(); } });
    });

    const prevBtn = document.getElementById('math-prev');
    const nextBtn = document.getElementById('math-next');
    if (prevBtn) prevBtn.addEventListener('click', () => renderMathSection(idx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => renderMathSection(idx + 1));
  }

  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.math.level = btn.dataset.level;
      state.math.completed = [];
      saveState();
      renderMath();
      renderProgress();
      renderToday();
    });
  });

  document.getElementById('math-reset').addEventListener('click', () => {
    if (confirm('Change your math level? This resets progress.')) {
      state.math.level = null;
      state.math.completed = [];
      saveState();
      renderMath();
      renderProgress();
    }
  });

  // ─── SCHEDULE TIMELINE ────────────────────────────────────────────────────
  let scheduleWeekIdx = null; // null = auto (current week)

  function renderSchedule() {
    const container = document.getElementById('schedule-timeline');
    const weekdays = getWeekdays(SCHEDULE_START, SCHEDULE_END);
    const now = today();
    const totalDays = weekdays.length;

    const bookPhases = [
      { label: 'The Outsiders', end: OUTSIDERS_PLAN.length },
      { label: 'Reader\'s Choice', end: Math.floor(totalDays * 0.45) },
      { label: 'Book 3', end: Math.floor(totalDays * 0.65) },
      { label: 'Biography + Writing', end: totalDays },
    ];

    // Group into weeks
    const weeks = [];
    let current = null;
    weekdays.forEach((d, i) => {
      const monday = new Date(d);
      monday.setDate(monday.getDate() - (monday.getDay() - 1));
      const key = dayKey(monday);
      if (!current || current.key !== key) {
        current = { key, monday, days: [], startIdx: i };
        weeks.push(current);
      }
      current.days.push({ date: d, idx: i });
    });

    // Find current week
    const currentWeekIdx = weeks.findIndex(w => {
      const friday = new Date(w.monday);
      friday.setDate(friday.getDate() + 6);
      return now >= w.monday && now <= friday;
    });
    const activeIdx = scheduleWeekIdx !== null ? scheduleWeekIdx : Math.max(0, currentWeekIdx);
    const week = weeks[activeIdx];
    if (!week) return;

    const friday = new Date(week.monday);
    friday.setDate(friday.getDate() + 4);
    const weekNum = activeIdx + 1;
    const totalWeeks = weeks.length;
    const isCurrent = activeIdx === currentWeekIdx;

    const bars = week.days.map(({ date, idx }) => {
      const isToday = dayKey(date) === dayKey(now);
      const isPast = date < now;
      let cls = '';
      if (isToday) cls = 'today';
      else if (isPast) cls = 'past';
      return `<div class="day-block ${cls}" data-day-idx="${idx}" title="Click for details">${formatWeekday(date).slice(0,2)}</div>`;
    }).join('');

    const phase = bookPhases.find(p => week.startIdx < p.end);
    const tags = [`<span class="tag reading">${phase ? phase.label : 'Reading'}</span>`, `<span class="tag math">Math</span>`];
    if (week.startIdx > totalDays - 10) tags.push(`<span class="tag writing">Writing</span>`);

    container.innerHTML = `
      <div class="schedule-nav">
        <button class="schedule-nav-btn" id="sched-prev" ${activeIdx === 0 ? 'disabled' : ''}>←</button>
        <div class="schedule-nav-label">
          <span class="schedule-week-title ${isCurrent ? 'current' : ''}">Week ${weekNum} of ${totalWeeks}</span>
          <span class="schedule-week-dates">${formatDate(week.monday).slice(5)} – ${formatDate(friday).slice(5)}</span>
        </div>
        <button class="schedule-nav-btn" id="sched-next" ${activeIdx >= totalWeeks - 1 ? 'disabled' : ''}>→</button>
      </div>
      <div class="week-block">
        <div class="week-bar">${bars}</div>
        <div class="week-focus">${tags.join(' ')}</div>
        <div class="day-detail hidden"></div>
      </div>
      ${!isCurrent && currentWeekIdx >= 0 ? '<button class="schedule-today-btn" id="sched-today">Back to this week</button>' : ''}
    `;

    // Nav handlers
    document.getElementById('sched-prev').addEventListener('click', () => {
      scheduleWeekIdx = activeIdx - 1;
      renderSchedule();
    });
    document.getElementById('sched-next').addEventListener('click', () => {
      scheduleWeekIdx = activeIdx + 1;
      renderSchedule();
    });
    const todayBtn = document.getElementById('sched-today');
    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        scheduleWeekIdx = null;
        renderSchedule();
      });
    }

    // Day click handlers
    container.querySelectorAll('.day-block[data-day-idx]').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.dayIdx);
        const detailEl = container.querySelector('.day-detail');
        const tasks = buildTodayTasks(idx, totalDays);
        const dayDate = weekdays[idx];
        const dateLabel = dayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

        if (!detailEl.classList.contains('hidden') && detailEl.dataset.showIdx === String(idx)) {
          detailEl.classList.add('hidden');
          return;
        }

        detailEl.dataset.showIdx = String(idx);
        detailEl.classList.remove('hidden');
        detailEl.innerHTML = `
          <div class="day-detail-header">${dateLabel}</div>
          ${tasks.map(t => `<div class="day-detail-task"><span class="task-dot ${t.type}"></span>${t.name}</div>`).join('')}
        `;
      });
    });
  }

  // ─── QUIZ ──────────────────────────────────────────────────────────────────
  function renderQuiz() {
    const quizCard = document.getElementById('quiz-card');
    const quizContainer = document.getElementById('quiz-questions');
    const now = today();
    const weekdays = getWeekdays(SCHEDULE_START, SCHEDULE_END);
    const todayIdx = weekdays.findIndex(d => dayKey(d) === dayKey(now));

    // Only show quiz during Outsiders phase on weekdays
    if (todayIdx < 0 || todayIdx >= OUTSIDERS_PLAN.length || !isWeekday(now)) {
      quizCard.classList.add('hidden');
      return;
    }

    quizCard.classList.remove('hidden');
    const plan = OUTSIDERS_PLAN[todayIdx];
    const quizKey = 'quiz-day-' + todayIdx;

    quizContainer.innerHTML = plan.quiz.map((item, i) => {
      const answerKey = quizKey + '-' + i;
      const revealed = state.quizAnswers[answerKey];
      return `
        <div class="quiz-item">
          <div class="q-text">${i + 1}. ${item.q}</div>
          <input class="q-input" type="text" placeholder="Type your answer..." data-qi="${answerKey}">
          <div class="q-reveal">
            ${revealed
              ? `<div class="q-answer">✓ ${item.a}</div>`
              : `<button data-reveal="${answerKey}" data-answer="${item.a}">Show answer</button>`
            }
          </div>
        </div>
      `;
    }).join('');

    quizContainer.querySelectorAll('button[data-reveal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.reveal;
        state.quizAnswers[key] = true;
        saveState();
        renderQuiz();
      });
    });
  }

  // ─── MASTER CHECKLIST ───────────────────────────────────────────────────
  function renderChecklist() {
    if (!state.checklist) state.checklist = {};
    const items = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    let done = 0;
    const required = [];

    items.forEach(input => {
      const key = input.dataset.check;
      if (state.checklist[key]) {
        input.checked = true;
      }
      // Count required items (not in optional card)
      if (!input.closest('.checklist-optional')) {
        required.push(key);
        if (state.checklist[key]) done++;
      }
    });

    const progressEl = document.getElementById('checklist-progress');
    if (progressEl) {
      const total = required.length;
      if (done === total) {
        progressEl.textContent = '🎉 All done! You\'re ready for school.';
        progressEl.style.color = 'var(--success)';
      } else {
        progressEl.textContent = `${done} of ${total} required items complete`;
        progressEl.style.color = '';
      }
    }
  }

  document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => {
      if (!state.checklist) state.checklist = {};
      state.checklist[input.dataset.check] = input.checked;
      saveState();
      renderChecklist();
    });
  });

  // ─── INIT ─────────────────────────────────────────────────────────────────
  renderGreeting();
  renderToday();
  renderProgress();
  renderBooks();
  renderAR();
  renderMath();
  renderSchedule();
  renderQuiz();
  renderChecklist();
})();
