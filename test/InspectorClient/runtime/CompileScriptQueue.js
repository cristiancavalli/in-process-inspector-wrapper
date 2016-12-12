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
const CompileScriptQueue = require('../../../lib/InspectorClient/runtime/CompileScriptQueue');
const CompileScriptCommand = require('../../../lib/InspectorClient/runtime/commands/CompileScriptCommand');
const InvalidTypeGivenForCommand = require('../../../lib/InspectorClient/errors/InvalidTypeGivenForCommand');

describe('CompileScriptQueue', function () {
  const id = 0;
  const expression = 'a';
  const sourceURL = 'b';
  const persistScript = true;
  const cmd = new CompileScriptQueue().newCommand(id, expression, sourceURL,
    persistScript);
  var inst;
  beforeEach(() => inst = new CompileScriptQueue());
  after(() => CompileScriptQueue.data().reset());
  describe('Generating new commands', function () {
    it('Should generate instances of CompileScriptCommand',
      () => assert(inst.newCommand(id, expression, sourceURL, persistScript)
        instanceof CompileScriptCommand));
  });
  describe('Adding commands', function () {
    describe('Valid behaviour', function () {
      it('Should allow the adding of valid commands', function () {
        const id = 0;
        assert.doesNotThrow(() => inst.addCommand(id, cmd));
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
  })
});
