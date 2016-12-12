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
const GetPropertiesQueue = require('../../../lib/InspectorClient/runtime/GetPropertiesQueue');
const GetPropertiesCommand = require('../../../lib/InspectorClient/runtime/commands/GetPropertiesCommand');
const InvalidTypeGivenForCommand = require('../../../lib/InspectorClient/errors/InvalidTypeGivenForCommand');

describe('GetPropertiesQueue', function () {
  const id = 0;
  const objectId = 'test';
  const cmd = new GetPropertiesQueue().newCommand(id, objectId);
  var inst;
  beforeEach(() => inst = new GetPropertiesQueue());
  after(() => GetPropertiesQueue.data().reset());
  describe('Generating new commands', function () {
    it('Should generate instances of GetPropertiesCommand',
      () => assert(inst.newCommand(id, objectId) instanceof GetPropertiesCommand));
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
