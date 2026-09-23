import type { Page } from '@playwright/test';
import { FAQS_QUESTIONS } from '@testdata/faqsData';

/**
 * Grounded 2026-09-08 against UAT (inox-uat-web.pvrinox.com, Mumbai geolocation granted) via
 * headless Playwright (Playwright MCP's browser fails in this sandbox — see the
 * `pvr-inox-grounding-technique` project memory). Real route: `/faq` (singular) — confirmed 200,
 * real title "FAQs | PVR INOX – Movie Tickets, Bookings, Offers & Support", real heading
 * "Frequently Asked Questions". `/faqs` (plural, the sheet's implied name) loads a blank shell.
 *
 * No FAQs entry point exists in the footer or the header "More" dropdown (the same 15-item menu
 * grounded for About Us). The real path is the **guest-accessible** Settings dialog — CORRECTED
 * 2026-09-08: an earlier pass wrongly assumed this needed a login, but it's confirmed live (2/2
 * runs, no auth) that clicking the header "User Icon" opens a real `role="dialog"` ("Account",
 * with "Login" / "Customer Experience" / "Settings" buttons); clicking "Settings" transitions the
 * *same* dialog in-place to a Content section listing "Privacy Policy" / "Terms & Conditions" /
 * "Terms of Use" / "FAQs" as real buttons; clicking "FAQs" closes the dialog and navigates to
 * `/faq` — see `FaqsModule.ts` and the `settings-panel-content-nav` project memory. Every content
 * scenario below still uses direct `/faq` navigation, matching this repo's established pattern —
 * only FAQ-001/002 exercise the dialog itself.
 *
 * UAT has exactly THREE real FAQs (confirmed live, full accordion trace):
 * - "Can tickets be cancelled immediately?" → "Tickets can be cancelled 10 mins after booking
 *   confirmation."
 * - "When will the refund be processed?" → "Refund will be processed within 7 working days."
 * - "5 Simple Steps to Buy Tickets Online." → a long multi-step booking guide (real long-answer
 *   content).
 *
 * No `aria-expanded`, `data-testid`, or any other accessible "open" signal exists on the question
 * buttons — expand/collapse must be asserted via the answer text's visibility, not ARIA state.
 * Confirmed live (full trace, not assumed): default state is all-collapsed; clicking a question
 * expands it; clicking a DIFFERENT question auto-collapses the previous one; clicking the SAME
 * (already-open) question toggles it closed. Keyboard `Tab` + `Enter` genuinely expands a
 * focused question (confirmed live).
 *
 * No real hyperlink or content-embedded image exists in any of the 3 answers (checked each
 * individually) — only generic header/widget chrome images render regardless of which FAQ is
 * open (same pattern as `LegalContentPage.ts`'s findings).
 */
export class FaqsPage {
  constructor(private page: Page) {}

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/faq`);
  }

  readonly pageHeading = () => this.page.getByRole('heading', { name: 'Frequently Asked Questions', exact: true });

  // Guest-accessible Account dialog → Settings → Content → FAQs (see class doc comment).
  // The "User Icon" button itself is `RegisterLoginPage.userIconButton()` — reused via
  // composition in `FaqsModule.ts` rather than duplicated here.
  readonly settingsButtonInAccountDialog = () => this.page.getByRole('button', { name: /^settings$/i });
  readonly faqsRowInSettingsDialog = () => this.page.getByRole('button', { name: 'FAQs', exact: true });

  readonly questionButton = (question: string) => this.page.getByRole('button', { name: question, exact: true });

  readonly cancellationQuestionButton = () => this.questionButton(FAQS_QUESTIONS.cancellation);
  readonly refundQuestionButton = () => this.questionButton(FAQS_QUESTIONS.refund);
  readonly howToBuyQuestionButton = () => this.questionButton(FAQS_QUESTIONS.howToBuy);
}
