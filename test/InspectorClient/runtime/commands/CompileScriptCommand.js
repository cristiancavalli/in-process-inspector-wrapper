/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const assert = require('assert');
const template = require('../../../../lib/InspectorClient/runtime/commands/CompileScriptCommand');

describe('CompileScriptCommand', function () {
  const id = 0;
  const expression = 'd';
  const sourceURL = 'x';
  const persistScript = true;
  const executionContextId = 'df';
  const enabled = true;
  describe('Initialization', function () {
    describe('Error behaviour', function () {
      it('Should throw if not given expression as a string',
        () => assert.throws(() => new template(id), TypeError));
      it('Should throw if not given sourceURL as a string',
        () => assert.throws(() => new template(id, expression), TypeError));
      it('Should throw if not given persistScript as a boolean',
        () => assert.throws(() => new template(id, expression, sourceURL), TypeError));
    });
    describe('Request parameter population', function () {
      it('Should populate params to construction with only required arguments',
        () => assert.deepEqual(
          new template(id, expression, sourceURL, persistScript).requestPayload().params,
          {expression: expression, sourceURL: sourceURL, persistScript: persistScript}
        )
      );
      it('Should populate params to construction with optional arguments',
        () => assert.deepEqual(
          new template(id, expression, sourceURL, persistScript, executionContextId).requestPayload().params,
          {expression: expression, sourceURL: sourceURL, persistScript: persistScript, executionContextId: executionContextId}
        )
      );
    });
  });
});
