import { runAllTests } from './dashboard.test.js';

try {
    runAllTests();
    console.log('\nAll dashboard rendering tests passed.');
} catch (error) {
    console.error('\nDashboard rendering tests failed:');
    console.error(error);
    process.exit(1);
}
