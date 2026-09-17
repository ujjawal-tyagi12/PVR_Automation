import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface TTAEntry {
  title: string;
  file: string;
  status: TestResult['status'];
  duration: number;
  retries: number;
  error?: string;
}

export default class CustomTTAReporter implements Reporter {
  private results: TTAEntry[] = [];
  private outputDir = 'tta-report';

  onBegin(_config: FullConfig, suite: Suite): void {
    this.results = [];
    const total = suite.allTests().length;
    console.warn(`[tta-report] starting run of ${total} tests`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.results.push({
      title: test.titlePath().join(' > '),
      file: test.location.file,
      status: result.status,
      duration: result.duration,
      retries: result.retry,
      error: result.error?.message,
    });
  }

  onEnd(result: FullResult): void {
    fs.mkdirSync(this.outputDir, { recursive: true });
    const summary = {
      status: result.status,
      total: this.results.length,
      passed: this.results.filter((r) => r.status === 'passed').length,
      failed: this.results.filter((r) => r.status === 'failed').length,
      skipped: this.results.filter((r) => r.status === 'skipped').length,
      generatedAt: new Date().toISOString(),
      tests: this.results,
    };
    fs.writeFileSync(path.join(this.outputDir, 'summary.json'), JSON.stringify(summary, null, 2));
    fs.writeFileSync(path.join(this.outputDir, 'index.html'), this.renderHtml(summary));
    console.warn(`[tta-report] written to ${this.outputDir}/index.html`);
  }

  private renderHtml(summary: {
    status: string;
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    tests: TTAEntry[];
  }): string {
    const rows = summary.tests
      .map(
        (t) =>
          `<tr><td>${t.title}</td><td>${t.status}</td><td>${t.duration}ms</td><td>${t.error ?? ''}</td></tr>`,
      )
      .join('\n');
    return `<!doctype html>
<html>
<head><meta charset="utf-8"><title>TTA Report</title>
<style>
body{font-family:system-ui,sans-serif;margin:2rem;}
table{border-collapse:collapse;width:100%;}
td,th{border:1px solid #ddd;padding:8px;text-align:left;font-size:14px;}
th{background:#f4f4f4;}
</style></head>
<body>
<h1>TTA Report</h1>
<p>Status: ${summary.status} | Total: ${summary.total} | Passed: ${summary.passed} | Failed: ${summary.failed} | Skipped: ${summary.skipped}</p>
<table><thead><tr><th>Test</th><th>Status</th><th>Duration</th><th>Error</th></tr></thead>
<tbody>${rows}</tbody></table>
</body>
</html>`;
  }
}
