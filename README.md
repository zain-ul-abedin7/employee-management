# Employee Management System

A simple, client-side Employee Management System built with plain HTML, CSS, and JavaScript. It lets you add, edit, delete, and search employees, with all data saved locally in your browser.

## Features

- **Add employees** with name, email, department, and mobile number.
- **Edit / update employees** — click "Edit" on any row to load that employee into the form, make changes, and save them without creating a duplicate.
- **Delete employees** with a confirmation prompt to prevent accidental deletion.
- **Search** across name, email, department, and mobile number at the same time.
- **Live, field-level validation** — each field (name, email, department, mobile number) is validated as you type/leave the field, with a specific error message shown right under that field, plus a red border on invalid inputs.
- **Duplicate prevention** — email and mobile number must be unique across employees (except when editing that same employee).
- **Empty states** — a friendly message is shown when there are no employees yet, and a different message when a search returns no matches.
- **Employee statistics** — live counters for total employees and total unique departments.
- **Persistent storage** — all employee data is saved in the browser's `localStorage`, so it survives page reloads.

## How to Run

1. Download or clone this repository.
2. Open `index.html` directly in any modern web browser (double-click the file, or right-click → "Open with" your browser).
3. No build step, server, or installation is required — everything runs client-side.

## Technologies Used

- **HTML5** — page structure and form markup.
- **CSS3** — layout and styling (flexbox, custom validation/empty-state styles).
- **JavaScript (Vanilla, ES6+)** — all application logic: form handling, validation, rendering, search, and storage. No frameworks or libraries are used.

## How Data Is Stored

Employee records are stored in the browser's `localStorage` under the key `employees`, as a JSON array of objects:

```json
{
  "id": 1717000000000,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "department": "IT",
  "number": "03001234567"
}
```

- Data is loaded from `localStorage` when the page first loads.
- Every add, update, or delete operation saves the full updated list back to `localStorage` immediately.
- Because `localStorage` is per-browser, data does not sync across devices or browsers and will persist until it is cleared (e.g. via browser settings or clearing site data).

## Validation Rules

| Field      | Rule                                                              |
|------------|---------------------------------------------------------------------|
| Name       | Required; letters and spaces only, 2-50 characters                  |
| Email      | Required; must be a valid email format; must be unique              |
| Department | Required; letters, numbers, `&` and `-` allowed, 2-50 characters    |
| Mobile     | Required; must start with `03` followed by 9 digits; must be unique |
