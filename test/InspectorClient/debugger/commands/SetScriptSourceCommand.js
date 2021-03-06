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
const SetScriptSourceCommand = require('../../../../lib/InspectorClient/debugger/commands/SetScriptSourceCommand');

describe('SetScriptSourceCommand', function () {
  const id = 0;
  const scriptId = 's';
  const scriptSource = 'x';
  const dryRun = true;
  const template = SetScriptSourceCommand;
  describe('Initialization', function () {
    describe('Error behaviour', function () {
      it('Should throw if not given scriptId as a string',
        () => assert.throws(() => new template(id), TypeError));
      it('Should throw if not given scriptSource as a string',
        () => assert.throws(() => new template(id, scriptId), TypeError));
    });
    describe('Request parameter population', function () {
      it('Should populate scriptId and scriptSource params',
        () => assert.deepEqual(
          new template(id, scriptId, scriptSource).requestPayload().params,
          {scriptId: scriptId, scriptSource: scriptSource}
        )
      );
      it('Should populate dryRun param',
        () => assert.deepEqual(
          new template(id, scriptId, scriptSource, dryRun).requestPayload().params,
          {scriptId: scriptId, scriptSource: scriptSource, dryRun: dryRun}
        )
      );
    });
  });
});
