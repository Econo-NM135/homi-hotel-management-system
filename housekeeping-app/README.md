# Homi Hotel Operations

A standalone hotel operations prototype built with plain HTML, CSS, and JavaScript.

## Features

- Housekeeping room status, cleaner assignment, and inspection workflow
- Daily room reports for consumables used, linen collected, and missing or damaged items, with room-by-room report history
- Tracks bathroom amenities, two rolls of toilet paper, a tissue box, coffee/decaf/condiments, coffee pot, and the notepad, pen, phone, and television remote
- Supervisor and manager room inspections with ten checks worth 10 points each; any failed check scores below 95%, returns the room to housekeeping as Re-clean, and lists the missed checks
- Demo role selector to test housekeeper versus supervisor/manager access
- Housekeepers can report a room issue directly from its room card; it creates an open, traceable work order in the maintenance tracker, prefilled with the room and assigned housekeeper
- Maintenance work orders with priority, technician, status, required items, and estimated duration
- Employees can add or update the job plan on an existing work order
- Preventive maintenance schedules with weekly, monthly, quarterly, semiannual, or annual recurrence
- Due and overdue indicators, with one-click completion and next-date rescheduling
- Browser-local persistence for maintenance requests and preventive maintenance plans

## Run locally

Open `index.html` directly, or serve the project folder with a local static web server:

```bash
cd housekeeping-app
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000/
```

Maintenance data, room statuses, inspection records, daily room reports, and the selected demo role are stored in this browser's local storage. This prototype does not yet sync data between users or devices. The demo role selector is for prototyping only and does not provide authentication or secure authorization.
