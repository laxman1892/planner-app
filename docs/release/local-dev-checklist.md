# Local Development Checklist

## Before you push

Run these from a clean working tree when possible.

### Backend

```bash
cd backend
.venv\Scripts\python.exe manage.py test
```

### Frontend

```bash
cd frontend
npm test
npm run lint
npm run build
```

## Expected rule

- Do not push if backend tests fail.
- Do not push if frontend tests fail.
- Do not push if frontend lint fails.
- Do not push if frontend build fails.

## When to add more checks

- Add a new check when a new workflow introduces real logic, permissions, or cross-user behavior.
