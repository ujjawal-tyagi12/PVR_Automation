# Test design heuristics (generic)

Use these packs for **any** product/module. Apply only types the user selected in intake.

## Positive pack

| Pattern | What to cover | Expected result style |
|---------|---------------|------------------------|
| Happy path | Valid credentials/data + primary CTA | Success UI state, correct destination |
| Defaults | State right after navigation | Default filters, empty form, placeholder copy |
| Persistence | Save/submit then reload or re-open | Values still correct |
| Multi-step | Wizard / OTP / confirm | Each step advances; final success |

## Negative pack

| Pattern | What to cover | Expected result style |
|---------|---------------|------------------------|
| Empty required | Submit with blank required fields | Inline/field errors; no success nav |
| Invalid format | Bad email, phone, ID, etc. | Validation message; request not sent or 4xx handled |
| Wrong credentials / data | Known-invalid combination | Error toast/banner; stay on page |
| Unauthorized | Role without permission | Redirect, 403 page, or hidden nav entry |
| Cancel / abandon | Close modal, Back, Cancel | No side effects; prior state intact |
| Double submit | Rapid double-click primary CTA | Single create/update; no duplicate rows |

## API parity pack

Pair each meaningful UI action with the API that backs it.

| Pattern | UI side | API side | Assert both |
|---------|---------|----------|-------------|
| Create/Update success | Success toast + new/updated row | `2xx` + body fields | UI shows same id/name/status as response |
| Create/Update failure | Error message in UI | `4xx/5xx` + error payload | UI message matches API error (or mapped copy) |
| List / search / filter | Visible row set | Query params + response array | Count and key fields match |
| Empty | Empty-state component | `[]` or null collection | Empty state visible; no ghost rows |
| Delete | Row removed / confirm | `2xx` delete | Row gone after refresh; API GET confirms |

If the user did not provide endpoints, either obtain them or mark API parity **Out of scope** with reason `API contract not provided`.

## Edge / boundary pack

- Min and max field lengths
- Pagination: first page, last page, page size change
- Zero results vs one result vs many
- Special characters in search (keep assertions about escaping/display, not security exploits)
- Timezones / date boundaries only when the module is date-driven

## Access control / RBAC pack

- Allowed role: can open module via provided navigation
- Denied role: cannot open (nav hidden, route blocked, or read-only — match product rules from seed)
- Do not invent roles; use only roles named in stories/scenarios or user answers

## Depth guide

| Depth | Positive | Negative | API parity | Notes |
|-------|----------|----------|------------|-------|
| Smoke | 1–2 critical | 0–1 auth/validation | 0–1 if API known | `@Smoke` `@P0` |
| Standard | All ACs happy path | Main validation + 1 unauthorized | Key list/mutate endpoints | Mix `@P0`–`@P2` |
| Complete | All ACs + defaults/persist | Full negative matrix feasible | All known endpoints for module | Exclude only with reason |

## Priority hints

| Tag | When |
|-----|------|
| `@P0` | Access, core create/submit, blockers |
| `@P1` | Primary filters, main validations, main API parity |
| `@P2` | Secondary UI, edge cases, nice-to-have parity |
| `@Smoke` | Critical path subset |
| `@Regression` | Durable suite (default for Standard/Complete) |

## Writing good scenario lines

```text
- [ ] **PREFIX-00N** — {short title} `[Positive|Negative|API parity|Edge|RBAC]` | Steps: {3–6 short steps} | Expected: {observable outcome}
```

Avoid: “works correctly”, “as expected”, “no issues”.  
Prefer: “table shows only rows with Role=Admin”, “status code 403 and Access denied banner”.
