/* istanbul ignore file */

import { RetryLink } from '@apollo/link-retry';

/**
 * This strategy retry the operation at least 5 times only in case of error
 * and set also a strategy for the number of milliseconds to delay by. This
 * is a random number inside an inscreasing interval. This has been made to
 * avoid thundering herd.
 * e.g.
 * 1st time: [0, 0]
 * 1nd time: [0, 1000]
 * 3rd time: [0, 2000]
 * 4th time: [0, 3000]
 * 5th time: [0, 4000]
 */
export default function retryLink() {
  return new RetryLink({
    delay: count => count * 1000 * Math.random(),
    attempts: (count, operation, error) => !!error && count < 4,
  });
}
