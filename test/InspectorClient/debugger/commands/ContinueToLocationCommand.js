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
const ContinueToLocationCommand = require('../../../../lib/InspectorClient/debugger/commands/ContinueToLocationCommand');

describe('ContinueToLocationCommand', function () {
  const id = 0;
  const location = {scriptId: 'stub', lineNumber: 0};
  const template = ContinueToLocationCommand;
  describe('Initialization', function () {
    describe('Error behaviour', function () {
      it('Should throw if not given location as a object',
        () => assert.throws(() => new template(id), TypeError));
    })
    describe('Request parameter population', function () {
      it('Should populate breakpointId param',
        () => assert.deepEqual(
          new template(id, location).requestPayload().params,
          {location: location}
        )
      );
    });
  });
});
