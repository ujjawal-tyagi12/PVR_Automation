import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

interface TtaEntry {
  title: string;
  file: string;
  status: TestResult['status'];
  durationMs: number;
  tags: string[];
}

class CustomTTAReporter implements Reporter {
  private entries: TtaEntry[] = [];
  private outDir = 'tta-report';

  onBegin(_config: FullConfig, _suite: Suite): void {
    this.entries = [];
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.entries.push({
      title: test.titlePath().slice(1).join(' > '),
      file: path.relative(process.cwd(), test.location.file),
      status: result.status,
      durationMs: result.duration,
      tags: (test.title.match(/@\w+/g) || []) as string[],
    });
  }

  onEnd(result: FullResult): void {
    fs.mkdirSync(this.outDir, { recursive: true });

    const summary = {
      status: result.status,
      total: this.entries.length,
      passed: this.entries.filter((e) => e.status === 'passed').length,
      failed: this.entries.filter((e) => e.status === 'failed' || e.status === 'timedOut').length,
      skipped: this.entries.filter((e) => e.status === 'skipped').length,
      generatedAt: new Date().toISOString(),
      tests: this.entries,
    };

    fs.writeFileSync(path.join(this.outDir, 'summary.json'), JSON.stringify(summary, null, 2));

    const rows = this.entries
      .map(
        (e) =>
          `<tr><td>${e.title}</td><td>${e.file}</td><td>${e.status}</td><td>${e.durationMs}ms</td><td>${e.tags.join(' ')}</td></tr>`,
      )
      .join('\n');

    const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>TTA Report</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 24px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
  th { background: #f5f5f5; }
</style></head>
<body>
  <h1>TTA Report</h1>
  <p>${summary.passed} passed, ${summary.failed} failed, ${summary.skipped} skipped (${summary.total} total)</p>
  <table>
    <thead><tr><th>Test</th><th>File</th><th>Status</th><th>Duration</th><th>Tags</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body></html>`;

    fs.writeFileSync(path.join(this.outDir, 'index.html'), html);
  }
}

export default CustomTTAReporter;
