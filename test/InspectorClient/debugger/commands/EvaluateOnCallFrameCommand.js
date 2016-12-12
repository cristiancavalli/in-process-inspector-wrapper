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
const EvaluateOnCallFrameCommand = require('../../../../lib/InspectorClient/debugger/commands/EvaluateOnCallFrameCommand');

describe('EvaluateOnCallFrameCommand', function () {
  const id = 0;
  const callFrameId = 'x';
  const expression = '1+1';
  const objectGroup = 'w';
  const includeCommandLineAPI = true;
  const silent = true;
  const returnByValue = true;
  const generatePreview = true;
  const template = EvaluateOnCallFrameCommand;
  describe('Initialization', function () {
    describe('Error behaviour', function () {
      it('Should throw if not given callFrameId as a string',
        () => assert.throws(() => new template(id), TypeError));
      it('Should throw if not given expression as a string',
        () => assert.throws(() => new template(id, callFrameId), TypeError));
    })
    describe('Request parameter population', function () {
      it('Should populate callFrameId and expression params',
        () => assert.deepEqual(
          new template(id, callFrameId, expression).requestPayload().params,
          {callFrameId: callFrameId, expression: expression}
        )
      );
      it('Should populate the objectGroup param',
        () => assert.deepEqual(
          new template(id, callFrameId, expression, objectGroup).requestPayload().params,
          {callFrameId: callFrameId, expression: expression, objectGroup: objectGroup}
        )
      );
      it('Should populate the includeCommandLineAPI param',
        () => assert.deepEqual(
          new template(id, callFrameId, expression, null, includeCommandLineAPI).requestPayload().params,
          {callFrameId: callFrameId, expression: expression, includeCommandLineAPI: includeCommandLineAPI}
        )
      );
      it('Should populate the silent param',
        () => assert.deepEqual(
          new template(id, callFrameId, expression, null, null, silent).requestPayload().params,
          {callFrameId: callFrameId, expression: expression, silent: silent}
        )
      );
      it('Should populate the returnByValue param',
        () => assert.deepEqual(
          new template(id, callFrameId, expression, null, null, null, returnByValue).requestPayload().params,
          {callFrameId: callFrameId, expression: expression, returnByValue: returnByValue}
        )
      );
      it('Should populate the objectGroup param',
        () => assert.deepEqual(
          new template(id, callFrameId, expression, null, null, null, null, generatePreview).requestPayload().params,
          {callFrameId: callFrameId, expression: expression, generatePreview: generatePreview}
        )
      );
    });
  });
});
