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
const PauseOnExceptionState = require('../../../lib/InspectorClient/debugger/PauseOnExceptionState');
const PauseOnExceptionStateCommand = require('../../../lib/InspectorClient/debugger/commands/PauseOnExceptionStateCommand');
const InvalidTypeGivenForCommand = require('../../../lib/InspectorClient/errors/InvalidTypeGivenForCommand');

describe('PauseOnExceptionState', function () {
  const id = 0;
  var inst;
  beforeEach(() => inst = new PauseOnExceptionState(id));
  after(() => PauseOnExceptionState.data().reset());
  describe('Initialization', function () {
    it('Should have an initial state of "none"', 
      () => assert.deepEqual(inst.getState(), 'none'));
  });
  describe('Generating new commands', function () {
    it('Should generate instances of PauseOnExceptionStateCommand',
      () => assert(inst.newCommand(0, 'all') instanceof PauseOnExceptionStateCommand));
  });
  describe('Adding commands', function () {
    describe('Valid behaviour', function () {
      it('Should allow the adding of valid commands', function () {
        const id = 0;
        const payload = inst.newCommand(id, 'uncaught');
        assert.doesNotThrow(() => inst.addCommand(id, payload));
      });
    });
    describe('Error behaviour', function () {
      it('Should throw when attempting to add a command with an invalid value',
        function () {
          const id = 0;
          const payload = {};
          assert.throws(() => inst.addCommand(id, payload),
            InvalidTypeGivenForCommand);
        });
    });
  });
  describe('Helper functions', function () {
    it('Should have a function for accessing a key/value dictionary of states',
      () => assert.strictEqual(typeof inst.possibleStates(), 'object'));
  });
});
