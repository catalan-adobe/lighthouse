/**
 * @license
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** @type {LH.Config} */
const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: [
      'best-practices',
    ],
    onlyAudits: [
      'is-on-https',
      'viewport',
      'user-timings',
      'critical-request-chains',
      'render-blocking-resources',
      'installable-manifest',
      'splash-screen',
      'themed-omnibox',
      'aria-valid-attr',
      'aria-allowed-attr',
      'color-contrast',
      'image-alt',
      'label',
      'tabindex',
      'content-width',
    ],
  },
};

/**
 * @type {Smokehouse.ExpectedRunnerResult}
 * Expected Lighthouse results from testing the a local test page with a broken service worker.
 */
const expectations = {
  lhr: {
    requestedUrl: 'http://localhost:10503/offline-ready.html?broken',
    // This page's SW has a `fetch` handler that doesn't provide a 200 response.
    finalDisplayedUrl: 'http://localhost:10503/offline-ready.html?broken',
    audits: {
      'installable-manifest': {
        score: 0,
        details: {items: {length: 1}},
        // TODO: 'warn-not-offline-capable' was disabled in m91. Turn back on once
        // issues are addressed and check is re-enabled: https://crbug.com/1187668#c22
        // warnings: {length: 1},
      },
    },
  },
  artifacts: {
    InstallabilityErrors: {
      errors: [
        // Icon errors were consolidated in M118
        // https://bugs.chromium.org/p/chromium/issues/detail?id=1476999
        {
          _minChromiumVersion: '118',
          errorId: 'no-acceptable-icon',
        },
        {
          _maxChromiumVersion: '117',
          errorId: 'no-icon-available',
        },
      ],
    },
  },
};

export default {
  id: 'offline-sw-broken',
  expectations,
  config,
  runSerially: true,
};
