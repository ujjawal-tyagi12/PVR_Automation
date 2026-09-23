import type { Locator } from '@playwright/test';

/**
 * Minimal WCAG 2.1 contrast-ratio check computed in-page (no axe-core dependency added to
 * the project). Reads the element's resolved text color against its nearest opaque
 * background and computes the standard relative-luminance contrast ratio.
 *
 * The evaluate callback runs in the browser, so DOM globals are referenced via `globalThis`
 * casts rather than TS DOM lib types — this project's tsconfig targets ES2020 without "dom".
 */
export async function getContrastRatio(locator: Locator): Promise<number> {
  return locator.evaluate((el) => {
    const win = globalThis as unknown as { getComputedStyle: (e: unknown) => { backgroundColor: string; color: string } };

    function parseRgb(value: string): [number, number, number, number] {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (!match) return [255, 255, 255, 1];
      const parts = match[1].split(',').map((p) => parseFloat(p.trim()));
      return [parts[0] ?? 255, parts[1] ?? 255, parts[2] ?? 255, parts[3] ?? 1];
    }

    function relativeLuminance([r, g, b]: [number, number, number]): number {
      const channel = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    }

    let node = el as unknown as { parentElement: unknown } | null;
    let bg: [number, number, number, number] = [255, 255, 255, 1];
    while (node) {
      const style = win.getComputedStyle(node);
      const [r, g, b, a] = parseRgb(style.backgroundColor);
      if (a > 0) {
        bg = [r, g, b, a];
        break;
      }
      node = node.parentElement as typeof node;
    }

    const fgStyle = win.getComputedStyle(el);
    const [fr, fg, fb] = parseRgb(fgStyle.color);

    const lFg = relativeLuminance([fr, fg, fb]);
    const lBg = relativeLuminance([bg[0], bg[1], bg[2]]);
    const lighter = Math.max(lFg, lBg);
    const darker = Math.min(lFg, lBg);
    return (lighter + 0.05) / (darker + 0.05);
  });
}
