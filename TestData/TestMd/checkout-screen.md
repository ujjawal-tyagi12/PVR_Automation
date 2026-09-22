# Playwright: Checkout Screen (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Checkout Screen", the 19 rows tagged
`App/Web/Msite` (`APP-117`–`APP-135`).

## Acceptance criteria

Checkout loads with booking/bill/payment sections; countdown timer and bill math are accurate;
promocodes, F&B, upsells, paymodes, donation, and cancellation info behave correctly; Proceed to
Pay redirects to the real payment gateway.

## Navigation

Real chain, grounded via direct probe (2026-09-22): seat selection → Continue → an optional
format-specific "HEADS UP!" T&C dialog → Skip & Proceed past Offers For You → Continue past the
Food menu → a real login gate (checkout requires authentication) → Continue again → real
Checkout at `/select-food?checkoutType=movie&cinemaId={id}`.

**Payment safety (explicit user agreement):** every test in this module stops at or before
"Select Payment Method" — none ever proceeds into the real Razorpay gateway or completes a live
transaction.

## Test coverage

- **Scope:** Partial — 11 of 19 cases are real and fully groundable on this booking; 8 need
  either UI not present on this specific booking (no Superticket card), a booking type/deep-link
  format not reachable within budget, or are the final payment-gateway step this session
  explicitly never completes.
- **Sheet rows included:** 19 (`APP-117`–`APP-135`).

## Scenarios

- **Suggested journey:** `src/tests/checkout-screen.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-117** — Real checkout loads with Booking/Bill/Payment sections
- [ ] **APP-118** — Real countdown timer is shown (session-expiry itself isn't waited out —
  that would take the full configured duration)
- [ ] **APP-119** — Real bill math: Ticket Total + Taxes + Donation = Total Amount, verified
  programmatically
- [ ] **APP-120** — Adapted: no distinct Superticket "Add to Cart" card exists on this booking's
  checkout
- [ ] **APP-121** — Adapted: same constraint as APP-120
- [ ] **APP-122** — Real valid-offer apply: clicking a real pre-listed offer's "Apply" changes
  the total (a real, live promocode-equivalent, more reliable than guessing a code)
- [ ] **APP-123** — Real invalid-promocode entry leaves the total unchanged (no explicit
  rejection-message element was found within budget; the unchanged total is the groundable
  signal)
- [ ] **APP-124** — Real "Add Food" CTA is reachable from Checkout
- [ ] **APP-125** — Adapted: needs a food item already in cart plus its repeat-customization
  popup, beyond this budget
- [ ] **APP-126** — Adapted: needs a specific upsell-eligible cart item, beyond this budget
- [ ] **APP-127** — Real PVR Exclusive Paymodes section displays (Gift Card, M-Coupon,
  Privilege Plus, Star Pass)
- [ ] **APP-128** — Adapted: no confirmed returning-payer state (prior completed real payment)
  exists on TEST_PHONE to verify pre-selection against
- [ ] **APP-129** — Real "Select Payment Method" placeholder confirms no default is
  pre-selected
- [ ] **APP-130** — Real donation (₹2/ticket) is on by default; Remove updates the total
- [ ] **APP-131** — Real cancellation policy: exact refund slabs (75%/50%/100% F&B/No Refund)
  with their time windows
- [ ] **APP-132** — Adapted: no non-cancellable booking type was reachable within budget
- [ ] **APP-133** — Adapted: no documented payment deep-link URL format to construct one
- [ ] **APP-134** — Real back/forward navigation returns to Checkout with the timer still
  present (not reset to the full duration or lost)
- [ ] **APP-135** — Adapted per explicit payment-safety agreement: confirms "Select Payment
  Method" is reachable with the correct total, but never proceeds into the real gateway
