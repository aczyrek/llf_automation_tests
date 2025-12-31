const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const jsonReportPath = path.join(__dirname, '../test-results.json');
const excelReportPath = path.join(__dirname, '../test-report.xlsx');

async function generateExcelReport() {
  if (!fs.existsSync(jsonReportPath)) {
    console.error('JSON report not found. Please run tests first.');
    return;
  }

  const rawData = fs.readFileSync(jsonReportPath);
  const jsonReport = JSON.parse(rawData);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Test Results');

  worksheet.columns = [
    { header: 'Test Suite', key: 'suite', width: 30 },
    { header: 'Test Case', key: 'title', width: 40 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Duration (ms)', key: 'duration', width: 15 },
    { header: 'Error', key: 'error', width: 50 }
  ];

  // Helper function to process suites recursively
  function processSuite(suite, parentTitle = '') {
    const currentTitle = parentTitle ? `${parentTitle} > ${suite.title}` : suite.title;

    // Process specs (test cases)
    if (suite.specs) {
      suite.specs.forEach(spec => {
        const testTitle = spec.title;
        // Each spec can have multiple tests (e.g., retries, different projects)
        spec.tests.forEach(test => {
          // Check results
          const result = test.results[0]; // Assuming taking the last result or first
          const status = result ? result.status : 'unknown';
          const duration = result ? result.duration : 0;
          const error = result && result.error ? result.error.message : '';

          worksheet.addRow({
            suite: currentTitle,
            title: testTitle,
            status: status,
            duration: duration,
            error: error
          });

          // Conditional formatting for Status
          const row = worksheet.lastRow;
          const statusCell = row.getCell('status');
          if (status === 'passed') {
            statusCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFC6EFCE' } // Green
            };
          } else if (status === 'failed') {
            statusCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFC7CE' } // Red
            };
          } else if (status === 'skipped') {
            statusCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFFFCC' } // Yellow
            };
          }
        });
      });
    }

    // Process nested suites
    if (suite.suites) {
      suite.suites.forEach(childSuite => {
        processSuite(childSuite, currentTitle);
      });
    }
  }

  // Start processing from root suites
  if (jsonReport.suites) {
    jsonReport.suites.forEach(suite => processSuite(suite));
  }

  await workbook.xlsx.writeFile(excelReportPath);
  console.log(`Excel report generated at: ${excelReportPath}`);
}

generateExcelReport().catch(console.error);
