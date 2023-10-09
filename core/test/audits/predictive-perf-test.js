/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import PredictivePerf from '../../audits/predictive-perf.js';
import {getURLArtifactFromDevtoolsLog, readJson} from '../test-utils.js';

const acceptableTrace = readJson('../fixtures/traces/lcp-m78.json', import.meta);
const acceptableDevToolsLog = readJson('../fixtures/traces/lcp-m78.devtools.log.json', import.meta);

describe('Performance: predictive performance audit', () => {
  it('should compute the predicted values', async () => {
    const artifacts = {
      URL: getURLArtifactFromDevtoolsLog(acceptableDevToolsLog),
      GatherContext: {gatherMode: 'navigation'},
      traces: {
        [PredictivePerf.DEFAULT_PASS]: acceptableTrace,
      },
      devtoolsLogs: {
        [PredictivePerf.DEFAULT_PASS]: acceptableDevToolsLog,
      },
    };
    const context = {computedCache: new Map(), settings: {locale: 'en'}};

    const output = await PredictivePerf.audit(artifacts, context);
    expect(output.displayValue).toBeDisplayString('4,460 ms');
    const metrics = output.details.items[0];
    for (const [key, value] of Object.entries(metrics)) {
      metrics[key] = value === undefined ? value : Math.round(value);
    }
    expect(metrics).toMatchSnapshot();
  });
});
