import { assertDataValid } from './validate';

try {
  assertDataValid();
  console.log('[data-validate] OK ✓');
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
