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
const GetScriptSourceCommand = require('../../../../lib/InspectorClient/debugger/commands/GetScriptSourceCommand');

describe('GetScriptSourceCommand', function () {
  const id = 0;
  const sId = 'test';
  const template = GetScriptSourceCommand;
  describe('Initialization', function () {
    describe('Error behaviour', function () {
      it('Should throw if not given callFrameId as a string',
        () => assert.throws(() => new template(id), TypeError));
    })
    describe('Request parameter population', function () {
      it('Should populate callFrameId param',
        () => assert.deepEqual(
          new template(id, sId).requestPayload().params,
          {scriptId: sId}
        )
      );
    });
  });
});
