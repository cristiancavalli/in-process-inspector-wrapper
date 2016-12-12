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
const DebuggerExecutionQueue = require('../../../lib/InspectorClient/debugger/DebuggerExecutionQueue');
const ResumeCommand = require('../../../lib/InspectorClient/debugger/commands/DebuggerResumeCommand');
const PauseCommand = require('../../../lib/InspectorClient/debugger/commands/DebuggerPauseCommand');
const InvalidTypeGivenForCommand = require('../../../lib/InspectorClient/errors/InvalidTypeGivenForCommand');

describe('DebuggerExecutionQueue', function () {
  const id = 0;
  var inst;
  beforeEach(() => inst = new DebuggerExecutionQueue(id));
  after(() => DebuggerExecutionQueue.data().reset());
  describe('Generating new commands', function () {
    it('Should generate instances of ResumeCommand',
      () => assert(inst.newResumeCommand(id) instanceof ResumeCommand));
    it('Should generate instances of PauseCommand',
      () => assert(inst.newPauseCommand(id) instanceof PauseCommand))
  });
  describe('Adding commands', function () {
    describe('Valid behaviour', function () {
      it('Should allow the adding of valid commands', function () {
        const id = 0;
        const payload = inst.newPauseCommand(id);
        assert.doesNotThrow(() => inst.addCommand(id, payload));
      });
    });
    describe('Error behaviour', function () {
      it('Should throw on the adding of invalid commands', function () {
        const id = 0;
        const payload = {};
        assert.throws(() => inst.addCommand(id, payload));
      });
    });
  });
});
