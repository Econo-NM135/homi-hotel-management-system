const roomDefaults = [
  { id: 1, room: '101', floor: 1, cleaner: 'Ava', status: 'dirty', priority: 'High' },
  { id: 2, room: '102', floor: 1, cleaner: 'Noah', status: 'in-progress', priority: 'Medium' },
  { id: 3, room: '205', floor: 2, cleaner: 'Mia', status: 'needs-inspection', priority: 'Medium' },
  { id: 4, room: '214', floor: 2, cleaner: 'Liam', status: 'dirty', priority: 'High' },
  { id: 5, room: '318', floor: 3, cleaner: 'Emma', status: 'in-progress', priority: 'Medium' },
  { id: 6, room: '407', floor: 4, cleaner: 'Olivia', status: 'clean', priority: 'Low' }
];

const rooms = loadRecords('homi-housekeeping-rooms', roomDefaults);
const inspectionRecords = loadRecords('homi-room-inspections', []);
const dailyRoomReports = loadRecords('homi-daily-room-reports', []);
const consumableItems = [
  { id: 'shampoo', label: 'Shampoo' },
  { id: 'conditioner', label: 'Conditioner' },
  { id: 'bodyWash', label: 'Body wash' },
  { id: 'barSoap', label: 'Bar soap' },
  { id: 'toiletPaper', label: 'Toilet paper rolls', par: 2 },
  { id: 'tissue', label: 'Kleenex boxes', par: 1 },
  { id: 'coffee', label: 'Coffee' },
  { id: 'decaf', label: 'Decaf coffee' },
  { id: 'condiments', label: 'Coffee condiments' }
];
const linenItems = [
  { id: 'bathTowels', label: 'Bath towels' },
  { id: 'handTowels', label: 'Hand towels' },
  { id: 'washcloths', label: 'Washcloths' },
  { id: 'bathMats', label: 'Bath mats' },
  { id: 'sheets', label: 'Sheets' },
  { id: 'pillowcases', label: 'Pillowcases' }
];
const reportableRoomItems = [
  ...consumableItems.map((item) => ({ label: item.label, par: item.par })),
  { label: 'Coffee pot', par: 1 },
  { label: 'Notepad', par: 1 },
  { label: 'Pen', par: 1 },
  { label: 'Phone', par: 1 },
  { label: 'Television remote', par: 1 },
  ...linenItems.map((item) => ({ label: item.label }))
];
const inspectionItems = [
  'Correct room and entry area inspected',
  'Bed made neatly with clean, unwrinkled linens',
  'Bathroom fixtures and surfaces are clean and sanitized',
  'Towels and guest amenities are replenished',
  'Floors, carpets, and corners are clean',
  'Furniture and visible surfaces are dust-free',
  'Trash bins are empty and liners are replaced',
  'High-touch points are clean and disinfected',
  'Lights, climate controls, and appliances work',
  'Room is odor-free and guest-ready'
];


function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateString(date);
}

function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadRecords(key, defaults) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaults;
}

let maintenanceRequests = loadRecords('homi-maintenance-requests', [
  {
    id: 1,
    title: 'Bathroom faucet is leaking',
    area: 'Room 214',
    details: 'Slow drip under the sink; check the supply connection.',
    priority: 'High',
    assignee: 'Marco',
    status: 'open',
    reportedAt: dateOffset(0),
    source: 'Maintenance'
  },
  {
    id: 2,
    title: 'Replace hallway light',
    area: '2nd floor hallway',
    details: 'Light is flickering near the elevator.',
    priority: 'Medium',
    assignee: 'Sam',
    status: 'in-progress',
    reportedAt: dateOffset(-1),
    source: 'Maintenance'
  },
  {
    id: 3,
    title: 'Re-secure closet handle',
    area: 'Room 108',
    details: '',
    priority: 'Low',
    assignee: 'Marco',
    status: 'completed',
    reportedAt: dateOffset(-3),
    source: 'Maintenance'
  }
]);

let preventiveTasks = loadRecords('homi-preventive-tasks', [
  { id: 1, title: 'Inspect HVAC filters', area: 'Rooftop HVAC', frequency: 'Monthly', nextDue: dateOffset(-1), assignee: 'Sam', lastCompleted: dateOffset(-31) },
  { id: 2, title: 'Test emergency lighting', area: 'All floors', frequency: 'Quarterly', nextDue: dateOffset(0), assignee: 'Marco', lastCompleted: dateOffset(-90) },
  { id: 3, title: 'Flush water heater', area: 'Utility room', frequency: 'Annual', nextDue: dateOffset(14), assignee: 'Unassigned', lastCompleted: dateOffset(-351) }
]);

const viewNames = {
  housekeeping: { eyebrow: 'Operations', title: 'Housekeeping dashboard', action: 'Add room' },
  'daily-reports': { eyebrow: 'Housekeeping', title: 'Daily room reports', action: 'Add daily report' },
  inspections: { eyebrow: 'Quality assurance', title: 'Room inspections', action: null },
  maintenance: { eyebrow: 'Facilities', title: 'Maintenance tracker', action: 'Log request' },
  preventive: { eyebrow: 'Facilities', title: 'Preventive maintenance', action: 'Add schedule' }
};

let activeView = 'housekeeping';
let currentRole = localStorage.getItem('homi-current-role') || 'housekeeper';
let roomFilter = 'all';
let maintenanceFilter = 'all';
let preventiveFilter = 'all';
let inspectingRoomId = null;

const navItems = document.querySelectorAll('.nav-item[data-view]');
const viewPanels = document.querySelectorAll('.app-view[data-view-panel]');
const viewTitle = document.getElementById('view-title');
const viewEyebrow = document.getElementById('view-eyebrow');
const addActionButton = document.getElementById('add-action-btn');
const roleSelect = document.getElementById('current-role');
const inspectionNav = document.getElementById('inspection-nav');
const roomForm = document.getElementById('room-form');
const maintenanceForm = document.getElementById('maintenance-form');
const preventiveForm = document.getElementById('preventive-form');
const housekeepingWorkOrderForm = document.getElementById('housekeeping-work-order-form');
const inspectionForm = document.getElementById('inspection-form');
const dailyReportForm = document.getElementById('daily-report-form');
const dailyReportRoomSelect = document.getElementById('daily-report-room');
const exceptionList = document.getElementById('exception-list');
const roomGrid = document.getElementById('room-grid');
const maintenanceList = document.getElementById('maintenance-list');
const preventiveList = document.getElementById('preventive-list');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function saveRecords() {
  localStorage.setItem('homi-housekeeping-rooms', JSON.stringify(rooms));
  localStorage.setItem('homi-room-inspections', JSON.stringify(inspectionRecords));
  localStorage.setItem('homi-daily-room-reports', JSON.stringify(dailyRoomReports));
  localStorage.setItem('homi-maintenance-requests', JSON.stringify(maintenanceRequests));
  localStorage.setItem('homi-preventive-tasks', JSON.stringify(preventiveTasks));
}

function isSupervisorOrHigher() {
  return currentRole === 'supervisor' || currentRole === 'manager';
}

function setView(view) {
  if (view === 'inspections' && !isSupervisorOrHigher()) view = 'housekeeping';
  activeView = view;
  const content = viewNames[view];
  viewTitle.textContent = content.title;
  viewEyebrow.textContent = content.eyebrow;
  addActionButton.textContent = content.action;
  addActionButton.classList.toggle('hidden', !content.action);

  inspectionNav.classList.toggle('hidden', !isSupervisorOrHigher());
  navItems.forEach((item) => item.classList.toggle('active', item.dataset.view === view));
  viewPanels.forEach((panel) => panel.classList.toggle('hidden', panel.dataset.viewPanel !== view));
  [roomForm, maintenanceForm, preventiveForm, housekeepingWorkOrderForm, inspectionForm, dailyReportForm].forEach((form) => form.classList.add('hidden'));
  if (view === 'inspections') renderInspectionQueue();
}

function renderHousekeeping() {
  const counts = {
    dirty: rooms.filter((room) => room.status === 'dirty').length,
    inProgress: rooms.filter((room) => room.status === 'in-progress').length,
    clean: rooms.filter((room) => room.status === 'clean').length,
    inspections: rooms.filter((room) => room.status === 'needs-inspection').length,
    reclean: rooms.filter((room) => room.status === 're-clean').length
  };
  const cards = [
    { label: 'Dirty rooms', value: counts.dirty, detail: 'Needs attention' },
    { label: 'In progress', value: counts.inProgress, detail: 'Currently cleaning' },
    { label: 'Ready', value: counts.clean, detail: 'Available today' },
    { label: 'Needs inspection', value: counts.inspections, detail: 'Waiting for review' },
    { label: 'Re-clean', value: counts.reclean, detail: 'Failed quality inspection' }
  ];

  document.getElementById('stats-grid').innerHTML = cards.map((card) => `
    <article class="stat-card"><small>${card.label}</small><strong>${card.value}</strong><span>${card.detail}</span></article>
  `).join('');

  const visibleRooms = roomFilter === 'all' ? rooms : rooms.filter((room) => room.status === roomFilter);
  roomGrid.innerHTML = visibleRooms.map((room) => {
    const action = {
      dirty: { label: 'Start cleaning', nextStatus: 'in-progress' },
      'in-progress': { label: 'Request inspection', nextStatus: 'needs-inspection' },
      're-clean': { label: 'Start re-clean', nextStatus: 'in-progress' }
    }[room.status];
    const latestInspection = inspectionRecords.find((record) => record.roomId === room.id);
    const failedItems = room.status === 're-clean' && latestInspection ? latestInspection.failedItems : [];

    return `
      <article class="room-card ${room.status}">
        <div class="room-card-header">
          <h4>Room ${escapeHtml(room.room)}</h4>
          <span class="status-pill ${room.status}">${escapeHtml(room.status === 're-clean' ? 're-clean' : room.status.replace(/-/g, ' '))}</span>
        </div>
        <div class="room-meta"><span>Floor ${room.floor}</span><span>${escapeHtml(room.priority)}</span></div>
        <p>Assigned to ${escapeHtml(room.cleaner)}</p>
        ${room.status === 're-clean' && latestInspection ? `<div class="reclean-notice"><strong>Inspection score: ${latestInspection.score}%</strong><span>Fix these items:</span><ul>${failedItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>` : ''}
        <div class="action-row">
          ${action ? `<button class="action-btn primary" data-housekeeping-status="${action.nextStatus}" data-id="${room.id}">${action.label}</button>` : ''}
          <button class="action-btn" data-assign-room="${room.id}">Assign</button>
          <button class="action-btn" data-create-work-order="${room.id}">Report issue</button>
        </div>
      </article>
    `;
  }).join('');

  document.getElementById('task-list').innerHTML = [
    { title: 'Strip and remake beds', time: '08:30', room: '101' },
    { title: 'Bathroom deep clean', time: '09:00', room: '214' },
    { title: 'Restock amenities', time: '10:15', room: '318' },
    { title: 'Final inspection', time: '12:00', room: '205' }
  ].map((task) => `
    <div class="task-item"><div><strong>${escapeHtml(task.title)}</strong><small>Room ${escapeHtml(task.room)}</small></div><div><span class="dot"></span><small>${task.time}</small></div></div>
  `).join('');
  document.getElementById('task-count').textContent = [
    { title: 'Strip and remake beds', time: '08:30', room: '101' },
    { title: 'Bathroom deep clean', time: '09:00', room: '214' },
    { title: 'Restock amenities', time: '10:15', room: '318' },
    { title: 'Final inspection', time: '12:00', room: '205' }
  ].length;
}

function renderDailyReportFormOptions() {
  dailyReportRoomSelect.innerHTML = rooms
    .map((room) => `<option value="${room.id}">Room ${escapeHtml(room.room)}</option>`)
    .join('');

  document.getElementById('consumable-fields').innerHTML = consumableItems.map((item) => `
    <label class="quantity-field">
      <span>${escapeHtml(item.label)}${item.par ? `<small>Par: ${item.par}</small>` : ''}</span>
      <input type="number" min="0" step="1" value="0" data-consumable="${item.id}" aria-label="${escapeHtml(item.label)} used" />
    </label>
  `).join('');
  document.getElementById('linen-fields').innerHTML = linenItems.map((item) => `
    <label class="quantity-field">
      <span>${escapeHtml(item.label)}</span>
      <input type="number" min="0" step="1" value="0" data-linen="${item.id}" aria-label="${escapeHtml(item.label)} collected" />
    </label>
  `).join('');
}

function addExceptionRow(item = '', condition = 'missing', quantity = 1) {
  const row = document.createElement('div');
  row.className = 'exception-row';
  const options = reportableRoomItems.map((entry) => {
    const label = entry.par ? `${entry.label} (standard stock: ${entry.par})` : entry.label;
    return `
      <option value="${escapeHtml(entry.label)}" ${entry.label === item ? 'selected' : ''}>${escapeHtml(label)}</option>
    `;
  }).join('');
  row.innerHTML = `
    <label>Item<select name="exceptionItem" required><option value="" disabled ${item ? '' : 'selected'}>Choose item</option>${options}</select></label>
    <label>Issue<select name="exceptionCondition"><option value="missing" ${condition === 'missing' ? 'selected' : ''}>Missing</option><option value="damaged" ${condition === 'damaged' ? 'selected' : ''}>Damaged</option></select></label>
    <label>Quantity<input name="exceptionQuantity" type="number" min="1" step="1" value="${quantity}" required /></label>
    <button type="button" class="remove-exception" aria-label="Remove item">Remove</button>
  `;
  exceptionList.appendChild(row);
}

function renderDailyReportHistory() {
  const today = toDateString(new Date());
  const todayReports = dailyRoomReports.filter((report) => report.date === today).length;
  const todayLinen = dailyRoomReports
    .filter((report) => report.date === today)
    .reduce((total, report) => total + Object.values(report.linenCollected || {}).reduce((sum, quantity) => sum + quantity, 0), 0);
  const todayExceptions = dailyRoomReports
    .filter((report) => report.date === today)
    .reduce((total, report) => total + (report.exceptions || []).length, 0);
  const statCards = [
    { label: 'Reports today', value: todayReports, detail: 'Room services recorded' },
    { label: 'Linen collected', value: todayLinen, detail: 'Total pieces logged today' },
    { label: 'Missing / damaged', value: todayExceptions, detail: 'Room item exceptions logged' },
    { label: 'All room reports', value: dailyRoomReports.length, detail: 'Saved report history' }
  ];
  document.getElementById('daily-report-stats').innerHTML = statCards.map((card) => `
    <article class="stat-card"><small>${card.label}</small><strong>${card.value}</strong><span>${card.detail}</span></article>
  `).join('');

  const history = document.getElementById('daily-report-history');
  const sortedReports = [...dailyRoomReports].sort((first, second) =>
    `${second.date}${second.createdAt}`.localeCompare(`${first.date}${first.createdAt}`)
  );
  history.innerHTML = sortedReports.length ? sortedReports.map((report) => {
    const consumables = Object.entries(report.consumablesUsed || {})
      .filter(([, quantity]) => quantity > 0)
      .map(([id, quantity]) => {
        const item = consumableItems.find((entry) => entry.id === id);
        return item ? `${item.label}: ${quantity}` : '';
      })
      .filter(Boolean);
    const linen = Object.entries(report.linenCollected || {})
      .filter(([, quantity]) => quantity > 0)
      .map(([id, quantity]) => {
        const item = linenItems.find((entry) => entry.id === id);
        return item ? `${item.label}: ${quantity}` : '';
      })
      .filter(Boolean);
    const exceptions = (report.exceptions || []).map((exception) =>
      `${exception.quantity} × ${exception.item} (${exception.condition})`
    );

    return `
      <article class="record-card daily-report-card">
        <div class="record-heading"><span class="frequency-tag">Room ${escapeHtml(report.room)}</span><small>${formatDate(report.date)}</small></div>
        <h4>${escapeHtml(report.housekeeper)}</h4>
        ${renderReportList('Consumables used', consumables)}
        ${renderReportList('Linen collected', linen)}
        ${renderReportList('Missing or damaged', exceptions)}
        ${report.notes ? `<p class="record-details">${escapeHtml(report.notes)}</p>` : ''}
      </article>
    `;
  }).join('') : '<p class="empty-state">No daily room reports yet. Add a report after servicing a room.</p>';
}

function renderReportList(title, entries) {
  if (!entries.length) return '';
  return `<div class="daily-report-section"><strong>${title}</strong><ul>${entries.map((entry) => `<li>${escapeHtml(entry)}</li>`).join('')}</ul></div>`;
}

function renderInspectionQueue() {
  const waiting = rooms.filter((room) => room.status === 'needs-inspection');
  const cards = [
    { label: 'Awaiting inspection', value: waiting.length, detail: 'Cleanings ready for review' },
    { label: 'Re-clean required', value: rooms.filter((room) => room.status === 're-clean').length, detail: 'Below 95% quality score' },
    { label: 'Inspections completed', value: inspectionRecords.length, detail: 'Saved inspection records' },
    { label: 'Latest score', value: inspectionRecords.length ? `${inspectionRecords[0].score}%` : '—', detail: 'Most recent inspection' }
  ];
  document.getElementById('inspection-stats').innerHTML = cards.map((card) => `
    <article class="stat-card"><small>${card.label}</small><strong>${card.value}</strong><span>${card.detail}</span></article>
  `).join('');

  document.getElementById('inspection-queue').innerHTML = waiting.length ? waiting.map((room) => `
    <article class="record-card">
      <div class="record-heading"><span class="status-pill needs-inspection">Needs inspection</span><span>Floor ${room.floor}</span></div>
      <h4>Room ${escapeHtml(room.room)}</h4>
      <p class="record-area">Housekeeper: ${escapeHtml(room.cleaner)}</p>
      <div class="record-footer"><span>Ready for quality review</span><button type="button" class="action-btn primary" data-inspect-room="${room.id}">Inspect room</button></div>
    </article>
  `).join('') : '<p class="empty-state">No rooms are waiting for inspection.</p>';
}

function renderInspectionChecklist() {
  document.getElementById('inspection-checklist').innerHTML = inspectionItems.map((item, index) => `
    <fieldset class="inspection-item">
      <legend><span class="check-number">${index + 1}</span>${escapeHtml(item)}</legend>
      <label><input type="radio" name="quality-${index}" value="pass" required /> Pass</label>
      <label><input type="radio" name="quality-${index}" value="fail" /> Fail</label>
    </fieldset>
  `).join('');
  updateInspectionScore();
}

function updateInspectionScore() {
  const values = inspectionItems.map((_, index) =>
    inspectionForm.querySelector(`input[name="quality-${index}"]:checked`)?.value
  );
  const reviewed = values.filter(Boolean).length;
  const passed = values.filter((value) => value === 'pass').length;
  const score = document.getElementById('inspection-score');
  score.textContent = reviewed < inspectionItems.length
    ? `${passed * 10} / 100 · ${inspectionItems.length - reviewed} checks remaining`
    : `Score: ${passed * 10} / 100${passed * 10 < 95 ? ' · Re-clean required' : ' · Pass'}`;
  score.classList.toggle('failing-score', reviewed === inspectionItems.length && passed * 10 < 95);
}

function renderMaintenance() {
  const open = maintenanceRequests.filter((request) => request.status === 'open').length;
  const inProgress = maintenanceRequests.filter((request) => request.status === 'in-progress').length;
  const urgent = maintenanceRequests.filter((request) => request.priority === 'Urgent' && request.status !== 'completed').length;
  const completed = maintenanceRequests.filter((request) => request.status === 'completed').length;
  const cards = [
    { label: 'Open requests', value: open, detail: 'Awaiting a technician' },
    { label: 'In progress', value: inProgress, detail: 'Work underway' },
    { label: 'Urgent', value: urgent, detail: 'Needs immediate attention' },
    { label: 'Resolved', value: completed, detail: 'Completed requests' }
  ];
  document.getElementById('maintenance-stats').innerHTML = cards.map((card) => `
    <article class="stat-card"><small>${card.label}</small><strong>${card.value}</strong><span>${card.detail}</span></article>
  `).join('');

  const visibleRequests = maintenanceRequests
    .filter((request) => maintenanceFilter === 'all' || request.status === maintenanceFilter)
    .sort((first, second) => {
      const order = { open: 0, 'in-progress': 1, completed: 2 };
      return order[first.status] - order[second.status];
    });

  maintenanceList.innerHTML = visibleRequests.length ? visibleRequests.map((request) => `
    <article class="record-card ${request.status}">
      <div class="record-heading">
        <div><span class="priority-tag ${request.priority.toLowerCase()}">${escapeHtml(request.priority)} priority</span><span class="status-pill ${request.status}">${escapeHtml(request.status.replace(/-/g, ' '))}</span></div>
        <small>Work order ${escapeHtml(request.workOrderNumber || `WO-${request.id}`)} · ${escapeHtml(request.source || 'Maintenance')} · ${formatDate(request.reportedAt)}</small>
      </div>
      <h4>${escapeHtml(request.title)}</h4>
      <p class="record-area">${escapeHtml(request.area)}</p>
      ${request.details ? `<p class="record-details">${escapeHtml(request.details)}</p>` : ''}
      ${request.reportedBy ? `<p class="record-details">Requested by ${escapeHtml(request.reportedBy)} from housekeeping</p>` : ''}
      ${renderJobPlan(request)}
      <div class="record-footer"><span>Assigned to ${escapeHtml(request.assignee || 'Unassigned')}</span>
        ${request.status === 'open' ? `<button class="action-btn primary" data-maintenance-status="in-progress" data-id="${request.id}">Start work</button>` : ''}
        ${request.status === 'in-progress' ? `<button class="action-btn primary" data-maintenance-status="completed" data-id="${request.id}">Mark resolved</button>` : ''}
        <button class="action-btn" data-edit-job-plan="${request.id}">Edit job plan</button>
      </div>
      <form class="job-plan-form hidden" data-job-plan-form="${request.id}">
        <label>Items needed<textarea name="itemsNeeded" rows="3" placeholder="Enter one item per line">${escapeHtml(request.itemsNeeded || '')}</textarea></label>
        <label>Estimated duration (minutes)<input name="estimatedMinutes" type="number" min="1" step="1" value="${escapeHtml(request.estimatedMinutes || '')}" placeholder="e.g. 45" /></label>
        <div class="field-row actions">
          <button type="button" class="secondary-btn" data-cancel-job-plan>Cancel</button>
          <button type="submit" class="primary-btn">Save job plan</button>
        </div>
      </form>
    </article>
  `).join('') : '<p class="empty-state">No requests in this view.</p>';
}

function renderJobPlan(request) {
  const items = String(request.itemsNeeded || '')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const estimate = Number(request.estimatedMinutes);

  if (items.length === 0 && !(estimate > 0)) return '';

  return `
    <div class="job-plan">
      ${estimate > 0 ? `<p><strong>Estimated duration:</strong> ${estimate} min</p>` : ''}
      ${items.length > 0 ? `<p><strong>Items needed:</strong></p><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
    </div>
  `;
}

function daysUntil(dateString) {
  const due = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}

function formatDate(dateString) {
  if (!dateString) return 'Never';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(`${dateString}T00:00:00`));
}

function getDueState(task) {
  const remainingDays = daysUntil(task.nextDue);
  if (remainingDays < 0) return { label: `${Math.abs(remainingDays)} day${remainingDays === -1 ? '' : 's'} overdue`, category: 'overdue' };
  if (remainingDays === 0) return { label: 'Due today', category: 'due' };
  if (remainingDays <= 7) return { label: `Due in ${remainingDays} day${remainingDays === 1 ? '' : 's'}`, category: 'due' };
  return { label: `Due in ${remainingDays} days`, category: 'upcoming' };
}

function renderPreventive() {
  const dueCount = preventiveTasks.filter((task) => {
    const days = daysUntil(task.nextDue);
    return days >= 0 && days <= 7;
  }).length;
  const cards = [
    { label: 'Scheduled tasks', value: preventiveTasks.length, detail: 'Recurring maintenance plans' },
    { label: 'Due this week', value: dueCount, detail: 'Due now or within 7 days' },
    { label: 'Overdue', value: preventiveTasks.filter((task) => daysUntil(task.nextDue) < 0).length, detail: 'Past their due date' },
    { label: 'Assigned', value: preventiveTasks.filter((task) => task.assignee && task.assignee !== 'Unassigned').length, detail: 'Have a technician assigned' }
  ];
  document.getElementById('preventive-stats').innerHTML = cards.map((card) => `
    <article class="stat-card"><small>${card.label}</small><strong>${card.value}</strong><span>${card.detail}</span></article>
  `).join('');

  const visibleTasks = preventiveTasks
    .map((task) => ({ ...task, dueState: getDueState(task) }))
    .filter((task) => preventiveFilter === 'all'
      || (preventiveFilter === 'due' && task.dueState.category !== 'upcoming')
      || task.dueState.category === preventiveFilter)
    .sort((first, second) => first.nextDue.localeCompare(second.nextDue));

  preventiveList.innerHTML = visibleTasks.length ? visibleTasks.map((task) => `
    <article class="record-card preventive-card ${task.dueState.category}">
      <div class="record-heading">
        <span class="due-tag ${task.dueState.category}">${escapeHtml(task.dueState.label)}</span>
        <span class="frequency-tag">${escapeHtml(task.frequency)}</span>
      </div>
      <h4>${escapeHtml(task.title)}</h4>
      <p class="record-area">${escapeHtml(task.area)}</p>
      <div class="record-meta"><span>Next due ${formatDate(task.nextDue)}</span><span>Last done ${formatDate(task.lastCompleted)}</span></div>
      <div class="record-footer"><span>Assigned to ${escapeHtml(task.assignee || 'Unassigned')}</span>
        <button class="action-btn primary" data-complete-preventive="${task.id}">Complete &amp; reschedule</button>
      </div>
    </article>
  `).join('') : '<p class="empty-state">No tasks in this view.</p>';
}

function renderAll() {
  renderHousekeeping();
  renderDailyReportFormOptions();
  renderDailyReportHistory();
  renderMaintenance();
  renderPreventive();
  renderInspectionQueue();
}

function addMonths(date, months) {
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, lastDay));
  return date;
}

function nextDueDate(task) {
  let next = new Date(`${task.nextDue}T00:00:00`);
  const intervals = { Weekly: [0, 7], Monthly: [1, 0], Quarterly: [3, 0], Semiannual: [6, 0], Annual: [12, 0] };
  const [months, days] = intervals[task.frequency] || [1, 0];

  do {
    if (months) next = addMonths(next, months);
    else next.setDate(next.getDate() + days);
  } while (toDateString(next) <= toDateString(new Date()));

  return toDateString(next);
}

navItems.forEach((item) => item.addEventListener('click', () => setView(item.dataset.view)));

document.getElementById('filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  roomFilter = button.dataset.filter;
  document.querySelectorAll('#filters .filter-chip').forEach((chip) => chip.classList.toggle('active', chip === button));
  renderHousekeeping();
});

document.getElementById('maintenance-filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  maintenanceFilter = button.dataset.filter;
  document.querySelectorAll('#maintenance-filters .filter-chip').forEach((chip) => chip.classList.toggle('active', chip === button));
  renderMaintenance();
});

document.getElementById('preventive-filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  preventiveFilter = button.dataset.filter;
  document.querySelectorAll('#preventive-filters .filter-chip').forEach((chip) => chip.classList.toggle('active', chip === button));
  renderPreventive();
});

roomGrid.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.housekeepingStatus) {
    const room = rooms.find((entry) => entry.id === Number(button.dataset.id));
    if (!room) return;
    room.status = button.dataset.housekeepingStatus;
    if (room.status === 'clean') room.priority = 'Low';
    saveRecords();
    renderHousekeeping();
  } else if (button.dataset.assignRoom) {
    const room = rooms.find((entry) => entry.id === Number(button.dataset.assignRoom));
    if (!room) return;
    const staff = ['Ava', 'Noah', 'Mia', 'Liam', 'Emma', 'Olivia', 'Sophia'];
    const currentIndex = staff.indexOf(room.cleaner);
    room.cleaner = staff[(currentIndex + 1) % staff.length];
    saveRecords();
    renderHousekeeping();
  } else if (button.dataset.createWorkOrder) {
    const room = rooms.find((entry) => entry.id === Number(button.dataset.createWorkOrder));
    if (!room) return;
    document.getElementById('work-order-area').value = `Room ${room.room}`;
    document.getElementById('work-order-reporter').value = room.cleaner;
    document.getElementById('work-order-title').value = '';
    document.getElementById('work-order-details').value = '';
    document.getElementById('work-order-priority').value = 'Medium';
    housekeepingWorkOrderForm.classList.remove('hidden');
    housekeepingWorkOrderForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    document.getElementById('work-order-title').focus();
  }
});

document.getElementById('inspection-queue').addEventListener('click', (event) => {
  if (!(event.target instanceof Element) || !isSupervisorOrHigher()) return;
  const button = event.target.closest('[data-inspect-room]');
  if (!button) return;

  const room = rooms.find((entry) => entry.id === Number(button.dataset.inspectRoom));
  if (!room || room.status !== 'needs-inspection') return;
  inspectingRoomId = room.id;
  document.getElementById('inspection-room-title').textContent = `Inspect room ${room.room}`;
  document.getElementById('inspector-name').value = '';
  renderInspectionChecklist();
  inspectionForm.classList.remove('hidden');
  inspectionForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

document.getElementById('inspection-checklist').addEventListener('change', updateInspectionScore);
document.getElementById('cancel-inspection').addEventListener('click', () => {
  inspectionForm.reset();
  inspectionForm.classList.add('hidden');
  inspectingRoomId = null;
});

inspectionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!isSupervisorOrHigher() || inspectingRoomId === null) return;
  const room = rooms.find((entry) => entry.id === inspectingRoomId);
  if (!room || room.status !== 'needs-inspection') return;

  const failedItems = inspectionItems.filter((_, index) =>
    inspectionForm.querySelector(`input[name="quality-${index}"]:checked`)?.value === 'fail'
  );
  const score = (inspectionItems.length - failedItems.length) * 10;
  inspectionRecords.unshift({
    id: Date.now(),
    roomId: room.id,
    room: room.room,
    score,
    inspector: document.getElementById('inspector-name').value.trim(),
    inspectedAt: new Date().toISOString(),
    failedItems
  });
  room.status = score < 95 ? 're-clean' : 'clean';
  if (room.status === 'clean') room.priority = 'Low';
  saveRecords();
  inspectionForm.reset();
  inspectionForm.classList.add('hidden');
  inspectingRoomId = null;
  renderHousekeeping();
  renderInspectionQueue();
});

dailyReportRoomSelect.addEventListener('change', () => {
  const room = rooms.find((entry) => entry.id === Number(dailyReportRoomSelect.value));
  if (room) document.getElementById('daily-report-housekeeper').value = room.cleaner;
});

document.getElementById('add-exception').addEventListener('click', () => addExceptionRow());

exceptionList.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const removeButton = event.target.closest('.remove-exception');
  if (removeButton) removeButton.closest('.exception-row').remove();
});

dailyReportForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const room = rooms.find((entry) => entry.id === Number(dailyReportRoomSelect.value));
  if (!room) return;

  const consumablesUsed = Object.fromEntries(
    [...dailyReportForm.querySelectorAll('[data-consumable]')]
      .map((input) => [input.dataset.consumable, Number(input.value) || 0])
  );
  const linenCollected = Object.fromEntries(
    [...dailyReportForm.querySelectorAll('[data-linen]')]
      .map((input) => [input.dataset.linen, Number(input.value) || 0])
  );
  const exceptions = [...exceptionList.querySelectorAll('.exception-row')].map((row) => ({
    item: row.querySelector('[name="exceptionItem"]').value,
    condition: row.querySelector('[name="exceptionCondition"]').value,
    quantity: Number(row.querySelector('[name="exceptionQuantity"]').value)
  }));

  dailyRoomReports.unshift({
    id: Date.now(),
    roomId: room.id,
    room: room.room,
    date: document.getElementById('daily-report-date').value,
    housekeeper: document.getElementById('daily-report-housekeeper').value.trim(),
    consumablesUsed,
    linenCollected,
    exceptions,
    notes: document.getElementById('daily-report-notes').value.trim(),
    createdAt: new Date().toISOString()
  });
  saveRecords();
  dailyReportForm.reset();
  dailyReportForm.classList.add('hidden');
  exceptionList.replaceChildren();
  renderDailyReportHistory();
  renderDailyReportFormOptions();
});

maintenanceList.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.maintenanceStatus) {
    const request = maintenanceRequests.find((entry) => entry.id === Number(button.dataset.id));
    if (!request) return;
    request.status = button.dataset.maintenanceStatus;
    saveRecords();
    renderMaintenance();
  } else if (button.dataset.editJobPlan) {
    const form = maintenanceList.querySelector(`[data-job-plan-form="${button.dataset.editJobPlan}"]`);
    if (form) form.classList.toggle('hidden');
  } else if (button.hasAttribute('data-cancel-job-plan')) {
    button.closest('form').classList.add('hidden');
  }
});

maintenanceList.addEventListener('submit', (event) => {
  if (!(event.target instanceof HTMLFormElement) || !event.target.matches('[data-job-plan-form]')) return;
  event.preventDefault();

  const requestId = Number(event.target.dataset.jobPlanForm);
  const request = maintenanceRequests.find((entry) => entry.id === requestId);
  if (!request) return;

  const formData = new FormData(event.target);
  request.itemsNeeded = String(formData.get('itemsNeeded') || '').trim();
  const estimate = String(formData.get('estimatedMinutes') || '').trim();
  request.estimatedMinutes = estimate ? Number(estimate) : null;
  saveRecords();
  renderMaintenance();
});

preventiveList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-complete-preventive]');
  if (!button) return;
  const task = preventiveTasks.find((entry) => entry.id === Number(button.dataset.completePreventive));
  if (!task) return;
  task.lastCompleted = toDateString(new Date());
  task.nextDue = nextDueDate(task);
  saveRecords();
  renderPreventive();
});

addActionButton.addEventListener('click', () => {
  const forms = { housekeeping: roomForm, 'daily-reports': dailyReportForm, maintenance: maintenanceForm, preventive: preventiveForm };
  const form = forms[activeView];
  const opening = form.classList.contains('hidden');
  [roomForm, dailyReportForm, maintenanceForm, preventiveForm, housekeepingWorkOrderForm, inspectionForm].forEach((entry) => entry.classList.add('hidden'));
  form.classList.toggle('hidden', !opening);
  if (opening && activeView === 'preventive') {
    document.getElementById('preventive-due').value = dateOffset(7);
  }
  if (opening && activeView === 'daily-reports') {
    renderDailyReportFormOptions();
    dailyReportForm.reset();
    document.getElementById('daily-report-date').value = toDateString(new Date());
    const room = rooms.find((entry) => entry.id === Number(dailyReportRoomSelect.value));
    document.getElementById('daily-report-housekeeper').value = room?.cleaner || '';
    exceptionList.replaceChildren();
  }
});

roleSelect.value = ['housekeeper', 'supervisor', 'manager'].includes(currentRole) ? currentRole : 'housekeeper';
currentRole = roleSelect.value;
roleSelect.addEventListener('change', () => {
  currentRole = roleSelect.value;
  localStorage.setItem('homi-current-role', currentRole);
  if (!isSupervisorOrHigher() && activeView === 'inspections') setView('housekeeping');
  else setView(activeView);
});

document.querySelectorAll('[data-cancel-form]').forEach((button) => {
  button.addEventListener('click', () => button.closest('form').classList.add('hidden'));
});

document.getElementById('cancel-work-order').addEventListener('click', () => {
  housekeepingWorkOrderForm.classList.add('hidden');
});

housekeepingWorkOrderForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const id = Date.now();
  maintenanceRequests.unshift({
    id,
    workOrderNumber: `WO-${id}`,
    title: document.getElementById('work-order-title').value.trim(),
    area: document.getElementById('work-order-area').value,
    details: document.getElementById('work-order-details').value.trim(),
    priority: document.getElementById('work-order-priority').value,
    assignee: 'Unassigned',
    status: 'open',
    reportedAt: toDateString(new Date()),
    source: 'Housekeeping',
    reportedBy: document.getElementById('work-order-reporter').value
  });

  saveRecords();
  housekeepingWorkOrderForm.reset();
  housekeepingWorkOrderForm.classList.add('hidden');
  maintenanceFilter = 'all';
  document.querySelectorAll('#maintenance-filters .filter-chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.filter === 'all');
  });
  setView('maintenance');
  renderMaintenance();
});

roomForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const roomNumber = document.getElementById('room-number').value.trim();
  if (!roomNumber) return;
  rooms.unshift({
    id: Date.now(),
    room: roomNumber,
    floor: Number(document.getElementById('room-floor').value),
    cleaner: document.getElementById('room-cleaner').value.trim() || 'Unassigned',
    status: 'dirty',
    priority: 'High'
  });
  saveRecords();
  roomForm.reset();
  roomForm.classList.add('hidden');
  renderHousekeeping();
});

maintenanceForm.addEventListener('submit', (event) => {
  event.preventDefault();
  maintenanceRequests.unshift({
    id: Date.now(),
    title: document.getElementById('maintenance-title').value.trim(),
    area: document.getElementById('maintenance-area').value.trim(),
    details: document.getElementById('maintenance-details').value.trim(),
    priority: document.getElementById('maintenance-priority').value,
    assignee: document.getElementById('maintenance-assignee').value.trim() || 'Unassigned',
    status: 'open',
    reportedAt: toDateString(new Date()),
    source: 'Maintenance',
    itemsNeeded: document.getElementById('maintenance-items').value.trim(),
    estimatedMinutes: Number(document.getElementById('maintenance-estimate').value) || null
  });
  saveRecords();
  maintenanceForm.reset();
  maintenanceForm.classList.add('hidden');
  maintenanceFilter = 'all';
  document.querySelectorAll('#maintenance-filters .filter-chip').forEach((chip) => chip.classList.toggle('active', chip.dataset.filter === 'all'));
  renderMaintenance();
});

preventiveForm.addEventListener('submit', (event) => {
  event.preventDefault();
  preventiveTasks.push({
    id: Date.now(),
    title: document.getElementById('preventive-title').value.trim(),
    area: document.getElementById('preventive-area').value.trim(),
    frequency: document.getElementById('preventive-frequency').value,
    nextDue: document.getElementById('preventive-due').value,
    assignee: document.getElementById('preventive-assignee').value.trim() || 'Unassigned',
    lastCompleted: null
  });
  saveRecords();
  preventiveForm.reset();
  preventiveForm.classList.add('hidden');
  preventiveFilter = 'all';
  document.querySelectorAll('#preventive-filters .filter-chip').forEach((chip) => chip.classList.toggle('active', chip.dataset.filter === 'all'));
  renderPreventive();
});

renderAll();
