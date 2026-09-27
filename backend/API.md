# API contract

Base URL: `/api`

## Auth

- `POST /auth/register` `{ name, emailOrPhone, password }`
- `POST /auth/login` `{ emailOrPhone, password }`

Returns `{ token, user }`.

## Templates

- `GET /templates?occasion=...`
- `GET /templates/:id`
- `POST /templates` admin
- `PATCH /templates/:id` admin
- `DELETE /templates/:id` admin

## Uploads

- `POST /upload` multipart form-data, field `photos`, max 3 images.

## Posters

- `POST /posters` auth: `{ templateId, formData, photoUrls }`
- `GET /posters/:id` auth
- `GET /posters/user/:userId` auth
- `POST /posters/:id/regenerate` auth
- `DELETE /posters/:id` auth

## Admin

- `GET /admin/posters` admin moderation queue
