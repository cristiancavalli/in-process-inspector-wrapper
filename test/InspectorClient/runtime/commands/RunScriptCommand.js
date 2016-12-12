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
const template = require('../../../../lib/InspectorClient/runtime/commands/RunScriptCommand');

describe('RunScriptCommand', function () {
  const id = 0;
  const scriptId = 'x';
  const executionContextId = 'y';
  const objectGroup = 'z';
  const silent = true;
  const includeCommandLineAPI = true;
  const returnByValue = true;
  const generatePreview = true;
  const awaitPromise = true;
  describe('Initialization', function () {
    describe('Error behaviour', function () {
      it('Should throw if not given scriptId as a string',
        () => assert.throws(() => new template(id), TypeError));
    });
    describe('Request parameter population', function () {
      it('Should populate params to construction with only required args',
        () => assert.deepEqual(
          new template(id, scriptId).requestPayload().params,
          { scriptId: scriptId }
        )
      );
      it('Should populate params to construction with optional args',
        () => assert.deepEqual(
          new template(id, scriptId, executionContextId, objectGroup, silent,
            includeCommandLineAPI, returnByValue, generatePreview, awaitPromise)
            .requestPayload().params,
          {
            scriptId: scriptId, executionContextId: executionContextId,
            objectGroup: objectGroup, silent: silent,
            includeCommandLineAPI: includeCommandLineAPI,
            returnByValue: returnByValue, generatePreview: generatePreview,
            awaitPromise: awaitPromise
          }
        )
      );
    });
  });
});
