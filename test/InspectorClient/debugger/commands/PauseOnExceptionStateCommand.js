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
const PauseOnExceptionStateCommand = require('../../../../lib/InspectorClient/debugger/commands/PauseOnExceptionStateCommand');

describe('PauseOnExceptionStateCommand', function () {
  const id = 0;
  const state = PauseOnExceptionStateCommand.getPossibleStates().uncaught;
  const template = PauseOnExceptionStateCommand;
  describe('Initialization', function () {
    describe('Error behaviour', function () {
      it('Should throw if not given state as a string',
        () => assert.throws(() => new template(id), TypeError));
      it('Should throw if not given a correct state',
        () => assert.throws(() => new template(id, 'not-a-state'), TypeError));
    });
    describe('Request parameter population', function () {
      it('Should populate state param',
        () => assert.deepEqual(
          new template(id, state).requestPayload().params,
          {state: state}
        )
      );
    });
  });
});
