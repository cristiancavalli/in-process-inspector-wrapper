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
const ScriptSourceGetsQueue = require('../../../lib/InspectorClient/debugger/ScriptSourceGetsQueue');
const GetScriptSourceCommand = require('../../../lib/InspectorClient/debugger/commands/GetScriptSourceCommand');
const InvalidTypeGivenForCommand = require('../../../lib/InspectorClient/errors/InvalidTypeGivenForCommand');

describe('ScriptSourceGetsQueue', function () {
  const id = 0;
  const scriptId = 'test';
  var inst;
  beforeEach(() => inst = new ScriptSourceGetsQueue(id));
  after(() => ScriptSourceGetsQueue.data().reset());
  describe('Generating new commands', function () {
    it('Should generate instances of GetScriptSourceCommand',
      () => assert(inst.newCommand(id, scriptId) instanceof GetScriptSourceCommand));
  });
  describe('Adding commands', function () {
    describe('Valid behaviour', function () {
      it('Should allow the adding of valid commands', function () {
        const id = 0;
        const payload = inst.newCommand(id, scriptId);
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
});
