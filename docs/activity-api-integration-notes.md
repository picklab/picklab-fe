# Activity API Integration Notes

## Connected

- `GET /v1/activities` is connected through `/api/activities` in `useActivities`.
- `GET /v1/activities/popular` is connected through `/api/activities/popular` in `useActivities` when an access token is present.
- `GET /v1/activities/recommendations` is connected through `/api/activities/recommendations`.
- `GET /v1/activities/recently-viewed` is connected through `/api/activities/recently-viewed`.
- `POST /v1/activities/{activityId}/view` is connected from the activity detail page to record recently viewed activities.
- The list response fields `view_count`, `recruitment_end_type`, and `dday` are mapped for home cards/lists.
- `recruitment_end_type` display mapping:
  - `FIXED` with `dday`: `D-Day`, `D-01`, `D-02`, ...
  - `ALWAYS_OPEN`: `상시모집`
  - `CLOSE_ON_HIRE`: `모집 시 마감`

## Needs Real Data Verification

- `GET /v1/activity-groups`

Direct checks with an access token show:

- `GET /v1/activities/popular`: `200`, returns real items.
- `GET /v1/activities/recommendations`: `200`, returns an empty `items` array.
- `GET /v1/activities/recently-viewed`: `200`, returns an empty `items` array.
- `GET /v1/activity-groups`: not connected in the current home list flow.

The frontend keeps the existing local-data fallback when the API response is unauthorized, empty, or unavailable, except for explicitly empty user-specific sections such as recently viewed activities.

## API Shape Differences To Keep In Mind

- Backend category enum for contests is `COMPETITION`.
- Existing frontend local type uses `CONTEST_HACKATHON`.
- `/v1/activities` requires `category`, `sort`, `size`, and `page`.
- `page` is 1-based.
- Supported sort values observed:
  - `LATEST`
  - `DEADLINE_ASC`
  - `DEADLINE_DESC`
