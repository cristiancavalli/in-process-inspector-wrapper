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
const template = require('../../../../lib/InspectorClient/runtime/commands/AwaitPromiseCommand');

describe('AwaitPromiseCommand', function () {
  const id = 0;
  const promiseObjectId = 'test';
  const returnByValue = true;
  const generatePreview = true;
  describe('Initialization', function () {
    describe('Error behaviour', function () {
      it('Should throw if not given promiseObjectId as a string',
        () => assert.throws(() => new template(id), TypeError));
    });
    describe('Request parameter population', function () {
      it('Should populate params to construction',
        () => assert.deepEqual(
          new template(id, promiseObjectId, returnByValue).requestPayload().params,
          {promiseObjectId: promiseObjectId, returnByValue: returnByValue}
        )
      );
      it('Should populate params to construction',
        () => assert.deepEqual(
          new template(id, promiseObjectId, null, generatePreview).requestPayload().params,
          {promiseObjectId: promiseObjectId, generatePreview: generatePreview}
        )
      );
    });
  });
});
