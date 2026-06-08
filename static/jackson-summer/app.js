(function() {
  'use strict';

  // ─── DATA ─────────────────────────────────────────────────────────────────
  const SCHEDULE_START = new Date(2026, 5, 8); // June 8, 2026
  const SCHEDULE_END = new Date(2026, 7, 1);   // August 1, 2026
  const SCHOOL_START = new Date(2026, 7, 9);   // August 9, 2026

  const AR_DATES = [
    { date: new Date(2026, 5, 10), time: '9:30 AM – 12:00 PM' },
    { date: new Date(2026, 5, 24), time: '9:30 AM – 12:00 PM' },
    { date: new Date(2026, 6, 8),  time: '1:00 – 4:00 PM' },
    { date: new Date(2026, 6, 22), time: '1:00 – 4:00 PM' },
    { date: new Date(2026, 6, 28), time: '9:30 AM – 12:00 PM' },
    { date: new Date(2026, 7, 7),  time: '2:30 – 7:00 PM' },
  ];

  const BOOKS = [
    {
      id: 'book1',
      number: 'Book 1',
      title: 'Reader\'s Choice',
      details: 'Pick one book from the Reader\'s Choice list you haven\'t read before.',
      ar: true,
      dueLabel: 'AR test by Aug 14',
      coverEmoji: '📖',
    },
    {
      id: 'book2',
      number: 'Book 2',
      title: 'The Outsiders',
      author: 'S.E. Hinton',
      details: 'Required for all 8th graders. Complete the Need to Read Fiction guide while reading (daily, not after).',
      ar: true,
      dueLabel: 'AR test by Aug 14',
      coverEmoji: '📕',
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9780142407332-M.jpg',
    },
    {
      id: 'book3',
      number: 'Book 3',
      title: 'Choose One',
      options: ['House Arrest by K.A. Holt', 'Martin Luther King Jr. by Amy Pastan'],
      details: 'Pick one of these two books.',
      ar: true,
      dueLabel: 'AR test by Aug 14',
      coverEmoji: '📗',
    },
    {
      id: 'book4',
      number: 'Book 4',
      title: 'Biography',
      details: 'Choose 1 of the 10 biography options. Complete the written project (due first day of school).',
      ar: false,
      dueLabel: 'Written project due first day',
      coverEmoji: '📘',
    },
  ];

  const MATH_LEVELS = {
    prealgebra: { label: 'Pre-Algebra', problems: 60 },
    algebra1: { label: 'Algebra 1', problems: 60 },
    geometry: { label: 'Honors Geometry', problems: 50 },
  };

  // ─── STATE ────────────────────────────────────────────────────────────────
  function loadState() {
    const saved = localStorage.getItem('jackson-summer-state');
    return saved ? JSON.parse(saved) : {
      books: {
        book1: { status: 'not-started', choice: '' },
        book2: { status: 'not-started' },
        book3: { status: 'not-started', choice: '' },
        book4: { status: 'not-started', choice: '' },
      },
      math: { level: null, completed: [] },
      todayTasks: {},
      needToRead: { started: false },
    };
  }

  function saveState() {
    localStorage.setItem('jackson-summer-state', JSON.stringify(state));
  }

  let state = loadState();

  // ─── NAVIGATION ───────────────────────────────────────────────────────────
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const view = link.dataset.view;
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.getElementById('view-' + view).classList.add('active');
      if (view === 'today') renderToday();
      if (view === 'reading') renderReading();
      if (view === 'math') renderMath();
      if (view === 'schedule') renderSchedule();
    });
  });

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  function today() {
    return new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  }

  function formatDate(d) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  function formatShort(d) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  function dayKey(d) {
    return d.toISOString().slice(0, 10);
  }

  function getNextARDate() {
    const now = today();
    return AR_DATES.find(a => a.date >= now);
  }

  function getOverallProgress() {
    let total = 0, done = 0;
    // Books: 4 items
    total += 4;
    Object.values(state.books).forEach(b => {
      if (b.status === 'complete') done += 1;
      else if (b.status === 'in-progress') done += 0.3;
    });
    // Math
    if (state.math.level) {
      const level = MATH_LEVELS[state.math.level];
      total += level.problems;
      done += state.math.completed.length;
    } else {
      total += 60;
    }
    // Need to read
    total += 1;
    if (state.needToRead.started) done += 0.5;
    return Math.round((done / total) * 100);
  }

  // ─── TODAY VIEW ───────────────────────────────────────────────────────────
  function renderToday() {
    const now = today();
    const greeting = document.querySelector('.today-greeting');
    const dateEl = document.querySelector('.today-date');
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    greeting.textContent = `${timeGreeting}, Jackson`;
    dateEl.textContent = formatDate(now);

    // Progress ring
    const pct = getOverallProgress();
    const ring = document.getElementById('overall-ring');
    const circumference = 2 * Math.PI * 54;
    ring.style.strokeDashoffset = circumference - (pct / 100) * circumference;
    document.getElementById('overall-pct').textContent = pct + '%';

    // Today's tasks
    const tasksEl = document.getElementById('today-tasks');
    const tasks = generateTodayTasks(now);
    tasksEl.innerHTML = tasks.map(task => {
      const doneKey = dayKey(now) + '-' + task.id;
      const isDone = state.todayTasks[doneKey];
      return `
        <div class="task-card ${task.type} ${isDone ? 'done' : ''}" data-task-key="${doneKey}">
          <div class="task-check"></div>
          <div class="task-content">
            <div class="task-title">${task.title}</div>
            <div class="task-meta">${task.meta}</div>
          </div>
        </div>
      `;
    }).join('');

    tasksEl.querySelectorAll('.task-card').forEach(card => {
      card.addEventListener('click', () => {
        const key = card.dataset.taskKey;
        state.todayTasks[key] = !state.todayTasks[key];
        saveState();
        renderToday();
      });
    });

    // AR reminder
    const arEl = document.getElementById('ar-reminder');
    const nextAR = getNextARDate();
    if (nextAR) {
      const daysUntil = Math.ceil((nextAR.date - now) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 7) {
        arEl.innerHTML = `
          <div class="ar-reminder-card">
            <h4>📅 AR Test Coming Up</h4>
            <p>${formatDate(nextAR.date)} · ${nextAR.time} — ${daysUntil === 0 ? 'Today!' : daysUntil + ' days away'}</p>
          </div>
        `;
      } else {
        arEl.innerHTML = `
          <div class="ar-reminder-card">
            <h4>📅 Next AR Test Date</h4>
            <p>${formatDate(nextAR.date)} · ${nextAR.time}</p>
          </div>
        `;
      }
    } else {
      arEl.innerHTML = '';
    }
  }

  function generateTodayTasks(now) {
    const tasks = [];
    const weekdays = getWeekdays(SCHEDULE_START, SCHEDULE_END);
    const todayIdx = weekdays.findIndex(d => dayKey(d) === dayKey(now));

    if (todayIdx < 0 || !isWeekday(now)) {
      tasks.push({ id: 'rest', type: 'reading', title: 'Rest day!', meta: 'Enjoy your weekend. Back at it Monday.' });
      return tasks;
    }

    if (now < SCHEDULE_START) {
      tasks.push({ id: 'notyet', type: 'reading', title: 'Not started yet', meta: 'Your summer plan begins June 8.' });
      return tasks;
    }

    if (now > SCHEDULE_END) {
      tasks.push({ id: 'done', type: 'reading', title: 'Summer work complete!', meta: 'Nice job. Get ready for school.' });
      return tasks;
    }

    // Determine which book phase we're in based on schedule position
    const totalDays = weekdays.length;
    const readingDays = Math.floor(totalDays * 0.7);
    const phase = Math.floor((todayIdx / readingDays) * 4);

    const bookOrder = ['book2', 'book1', 'book3', 'book4'];
    const currentBook = bookOrder[Math.min(phase, 3)];
    const bookData = BOOKS.find(b => b.id === currentBook);
    const bookStatus = state.books[currentBook].status;

    if (bookStatus !== 'complete') {
      const pagesPerDay = '~30-40 pages';
      tasks.push({
        id: 'read-' + currentBook,
        type: 'reading',
        title: `Read: ${bookData.title}`,
        meta: bookStatus === 'not-started' ? 'Time to start this one!' : pagesPerDay,
      });

      if (currentBook === 'book2') {
        tasks.push({
          id: 'needtoread',
          type: 'reading',
          title: 'Fill in Need to Read guide',
          meta: 'A few questions about today\'s reading',
        });
      }
    }

    // Math daily
    if (state.math.level) {
      const level = MATH_LEVELS[state.math.level];
      const problemsPerDay = Math.ceil(level.problems / totalDays);
      const startProblem = todayIdx * problemsPerDay + 1;
      const endProblem = Math.min(startProblem + problemsPerDay - 1, level.problems);
      if (startProblem <= level.problems) {
        tasks.push({
          id: 'math',
          type: 'math',
          title: `Math: Problems ${startProblem}-${endProblem}`,
          meta: `${level.label} packet`,
        });
      }
    } else {
      tasks.push({
        id: 'math-pick',
        type: 'math',
        title: 'Pick your math level',
        meta: 'Go to Math tab to select your packet',
      });
    }

    // Writing project (last 2 weeks)
    if (todayIdx > totalDays - 10 && state.books.book4.status !== 'complete') {
      tasks.push({
        id: 'writing',
        type: 'writing',
        title: 'Work on biography project',
        meta: 'Written project due first day of school',
      });
    }

    return tasks;
  }

  // ─── READING VIEW ─────────────────────────────────────────────────────────
  function renderReading() {
    const grid = document.getElementById('books-grid');
    grid.innerHTML = BOOKS.map(book => {
      const bookState = state.books[book.id];
      const statusClass = bookState.status;
      const statusLabel = bookState.status === 'not-started' ? 'Not Started' :
                          bookState.status === 'in-progress' ? 'In Progress' : 'Complete';
      const coverHtml = book.coverUrl
        ? `<img src="${book.coverUrl}" alt="${book.title}">`
        : book.coverEmoji;

      return `
        <div class="book-card">
          <div class="book-cover">${coverHtml}</div>
          <div class="book-info">
            <div class="book-number">${book.number}</div>
            <div class="book-title">${book.title}${book.author ? ' — ' + book.author : ''}</div>
            <div class="book-details">${book.details}</div>
            <div class="book-status">
              <span class="status-badge ${statusClass}">${statusLabel}</span>
              <span class="task-meta">${book.dueLabel}</span>
            </div>
            <div class="book-actions">
              ${bookState.status === 'not-started' ? `<button class="btn-small" data-book="${book.id}" data-action="start">Start Reading</button>` : ''}
              ${bookState.status === 'in-progress' ? `<button class="btn-small" data-book="${book.id}" data-action="finish">Mark Complete</button>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.btn-small').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.dataset.book;
        const action = btn.dataset.action;
        if (action === 'start') state.books[bookId].status = 'in-progress';
        if (action === 'finish') state.books[bookId].status = 'complete';
        saveState();
        renderReading();
      });
    });

    // AR dates
    const arDatesEl = document.getElementById('ar-dates');
    const now = today();
    arDatesEl.innerHTML = AR_DATES.map(a => {
      const past = a.date < now;
      const next = !past && a.date === getNextARDate()?.date;
      const cls = past ? 'past' : next ? 'next' : '';
      return `<div class="ar-date-item ${cls}">${formatShort(a.date)} · ${a.time}</div>`;
    }).join('');
  }

  // ─── MATH VIEW ────────────────────────────────────────────────────────────
  function renderMath() {
    const selector = document.getElementById('math-selector');
    const tracker = document.getElementById('math-tracker');

    if (!state.math.level) {
      selector.classList.remove('hidden');
      tracker.classList.add('hidden');
    } else {
      selector.classList.add('hidden');
      tracker.classList.remove('hidden');
      renderMathTracker();
    }
  }

  function renderMathTracker() {
    const level = MATH_LEVELS[state.math.level];
    document.getElementById('math-level-title').textContent = level.label + ' Packet';

    const completed = state.math.completed.length;
    const pct = Math.round((completed / level.problems) * 100);
    document.getElementById('math-progress-fill').style.width = pct + '%';
    document.getElementById('math-progress-text').textContent = `${completed} / ${level.problems} problems`;

    // Show today's problems
    const weekdays = getWeekdays(SCHEDULE_START, SCHEDULE_END);
    const todayIdx = weekdays.findIndex(d => dayKey(d) === dayKey(today()));
    const problemsPerDay = Math.ceil(level.problems / weekdays.length);
    const start = Math.max(0, todayIdx) * problemsPerDay;
    const end = Math.min(start + problemsPerDay, level.problems);

    const dailyEl = document.getElementById('math-daily');
    if (todayIdx >= 0 && start < level.problems) {
      const problems = [];
      for (let i = start; i < end; i++) {
        const done = state.math.completed.includes(i);
        problems.push(`
          <div class="math-problem">
            <input type="checkbox" id="prob-${i}" ${done ? 'checked' : ''} data-problem="${i}">
            <label for="prob-${i}">Problem ${i + 1}</label>
          </div>
        `);
      }
      dailyEl.innerHTML = `<h4>Today's Problems</h4><div class="math-problems">${problems.join('')}</div>`;

      dailyEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
          const idx = parseInt(cb.dataset.problem);
          if (cb.checked) {
            if (!state.math.completed.includes(idx)) state.math.completed.push(idx);
          } else {
            state.math.completed = state.math.completed.filter(p => p !== idx);
          }
          saveState();
          renderMathTracker();
        });
      });
    } else {
      dailyEl.innerHTML = '<p class="task-meta">No math problems scheduled for today.</p>';
    }
  }

  document.querySelectorAll('.math-option').forEach(btn => {
    btn.addEventListener('click', () => {
      state.math.level = btn.dataset.level;
      state.math.completed = [];
      saveState();
      renderMath();
    });
  });

  document.getElementById('math-change').addEventListener('click', () => {
    if (confirm('Change your math level? This will reset your progress.')) {
      state.math.level = null;
      state.math.completed = [];
      saveState();
      renderMath();
    }
  });

  // ─── SCHEDULE VIEW ────────────────────────────────────────────────────────
  function renderSchedule() {
    const weeksEl = document.getElementById('schedule-weeks');
    const weekdays = getWeekdays(SCHEDULE_START, SCHEDULE_END);
    const now = today();

    // Group by week
    const weeks = [];
    let currentWeek = null;

    weekdays.forEach(d => {
      const weekStart = new Date(d);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
      const weekKey = dayKey(weekStart);

      if (!currentWeek || currentWeek.key !== weekKey) {
        currentWeek = { key: weekKey, start: weekStart, days: [] };
        weeks.push(currentWeek);
      }
      currentWeek.days.push(d);
    });

    const totalDays = weekdays.length;
    const bookPhases = [
      { book: 'The Outsiders + Need to Read', end: Math.floor(totalDays * 0.25) },
      { book: 'Reader\'s Choice', end: Math.floor(totalDays * 0.45) },
      { book: 'Book 3 Choice', end: Math.floor(totalDays * 0.65) },
      { book: 'Biography + Written Project', end: totalDays },
    ];

    weeksEl.innerHTML = weeks.map((week, wi) => {
      const weekEnd = new Date(week.start);
      weekEnd.setDate(weekEnd.getDate() + 4);
      const isCurrent = now >= week.start && now <= weekEnd;
      const weekLabel = `Week ${wi + 1} — ${formatShort(week.start)} to ${formatShort(weekEnd)}`;

      const daysHtml = week.days.map(d => {
        const idx = weekdays.findIndex(wd => dayKey(wd) === dayKey(d));
        const isToday = dayKey(d) === dayKey(now);
        const isPast = d < now;
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

        // Determine tasks for this day
        const tags = [];
        const phase = bookPhases.findIndex(p => idx < p.end);
        if (phase >= 0) {
          tags.push(`<span class="day-tag reading">${bookPhases[phase].book}</span>`);
        }
        tags.push('<span class="day-tag math">Math</span>');

        // Writing in last ~8 days
        if (idx > totalDays - 10) {
          tags.push('<span class="day-tag writing">Writing</span>');
        }

        // AR test dates
        const arOnDay = AR_DATES.find(a => dayKey(a.date) === dayKey(d));
        if (arOnDay) {
          tags.push('<span class="day-tag ar">AR Test Available</span>');
        }

        return `
          <div class="schedule-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}">
            <span class="day-label">${dayName}</span>
            <div class="day-tasks">${tags.join('')}</div>
          </div>
        `;
      }).join('');

      return `
        <div class="schedule-week">
          <div class="week-header ${isCurrent ? 'current' : ''}">${weekLabel}</div>
          <div class="week-days">${daysHtml}</div>
        </div>
      `;
    }).join('');
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  renderToday();
})();
