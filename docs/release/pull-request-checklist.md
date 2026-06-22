# Pull Request Checklist

Use this before requesting review or merging.

## Required checks

- [ ] Backend tests pass locally: `cd backend` then `.venv\Scripts\python.exe manage.py test`
- [ ] Frontend tests pass locally: `cd frontend` then `npm test`
- [ ] Frontend lint passes locally: `cd frontend` then `npm run lint`
- [ ] Frontend build passes locally: `cd frontend` then `npm run build`

## Change review

- [ ] The change matches the current phase plan or intentionally documents any deviation
- [ ] New logic, permissions, or workflows include tests or a clear reason they do not
- [ ] No unrelated refactor or cleanup was bundled into the same change
- [ ] Docs were updated if behavior, setup, or workflow changed

## Failure handling

- [ ] If CI failed, the PR description or follow-up comment states which job failed and the root cause
- [ ] Fix the first failing check before treating later failures as actionable

## Merge rule

- [ ] Do not merge while any required CI check is failing
