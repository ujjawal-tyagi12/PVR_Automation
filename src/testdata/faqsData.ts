/** Real, live-grounded FAQ content on UAT (2026-09-08) — see `FaqsPage.ts`'s doc comment for the
 * full grounding trail. Shared between `FaqsPage.ts` (locators) and `faqs*.spec.ts` (assertions)
 * so neither hardcodes a duplicate copy of this content. */
export const FAQS_QUESTIONS = {
  cancellation: 'Can tickets be cancelled immediately?',
  refund: 'When will the refund be processed?',
  howToBuy: '5 Simple Steps to Buy Tickets Online.',
} as const;

export const FAQS_ANSWERS = {
  cancellation: 'Tickets can be cancelled 10 mins after booking confirmation.',
  refund: 'Refund will be processed within 7 working days.',
  howToBuySnippet: 'Step 1. Go to FREE REGISTRATION',
} as const;
