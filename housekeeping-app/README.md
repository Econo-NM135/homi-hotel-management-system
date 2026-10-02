# Homi Hotel Operations

A standalone hotel operations prototype built with plain HTML, CSS, and JavaScript.

## Features

- Employee sign-in, supervisor employee management, and role-based housekeeping access
- Housekeeping room status, supervisor room assignment and closure, and inspection workflow
- Daily room reports for consumables used, linen collected, and missing or damaged items, with room-by-room report history
- Tracks bathroom amenities, two rolls of toilet paper, a tissue box, coffee/decaf/condiments, coffee pot, and the notepad, pen, phone, and television remote
- Supervisor and manager room inspections with ten checks worth 10 points each; any failed check scores below 95%, returns the room to housekeeping as Re-clean, and lists the missed checks
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

The initial supervisor account is `supervisor@homi.test` with password `Homi123!`. The sample housekeeper accounts use their first name as the email prefix (for example, `ava@homi.test`) and password `Clean123!`.

Employee accounts and operations data are stored in this browser's local storage, and the signed-in session lasts for the browser tab. This is a standalone prototype only: passwords are not securely protected, accounts do not sync between devices, and access checks are not a substitute for server-side authentication and authorization.
