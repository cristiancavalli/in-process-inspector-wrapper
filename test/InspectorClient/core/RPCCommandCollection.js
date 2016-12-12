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
const RPCCommandCollection = require('../../../lib/InspectorClient/core/RPCCommandCollection');
const RPCCommand = require('../../../lib/InspectorClient/core/RPCCommand');

describe('RPCCommandCollection', function () {
  const msgId = 1;
  const method = 'test';
  describe('Reading and Writing', function () {
      var ctn, cmd;
      beforeEach(function () {
        ctn = new RPCCommandCollection();
        cmd = new RPCCommand(msgId, method);
      });
      afterEach(function () {
        cmd.decompose();
        RPCCommandCollection.data().reset();
        ctn.decompose();
      });
      it(
        'Should have a way to set and get commands',
        function () {
          assert.strictEqual(ctn.getCommand(msgId), null,
            'Should return null if id has not been registered');
          ctn.addCommand(msgId, cmd);
          assert(ctn.checkForCommand(msgId),
            'Entry should exist in check by id function');
          assert(ctn.getCommand(msgId) === cmd,
            'Getting entry by id should return original reference for object');
          assert.throws(() => ctn.addCommand(msgId, cmd),
            'Should throw if message id is already set');
        }
      );
    });
    describe('Eventing', function () {
      var ctn, cmd;
      beforeEach(function () {
        ctn = new RPCCommandCollection();
        cmd = new RPCCommand(msgId, method);
      });
      afterEach(function () {
        cmd.decompose();
        RPCCommandCollection.data().reset();
        ctn.decompose();
      });
      it(
        'Should emit an event when adding a command',
        function (done) {
          ctn.addNewCommandListener(function (entry) {
            done();
          });
          ctn.addCommand(msgId, cmd);
        }
      );
      it(
        'Should emit an event when resolving a command',
        function (done) {
          const payload = {test: true};
          ctn.addCommandResolutionListener(function (entry) {
            assert.strictEqual(entry.responsePayload(), payload,
              'The payload given to resolve the param should be the same in '+
              'the resolved entry'
            );
            done();
          });
          assert.throws(() => ctn.resolveCommand(msgId),
            'Should throw if message id is not present');
          ctn.addCommand(msgId, cmd).resolveCommand(msgId, payload);
        }
      );
      it(
        'Should emit an event when rejecting a command',
        function (done) {
          const payload = {test: false};
          ctn.addCommandRejectionListener(function (entry) {
            assert.strictEqual(entry.responsePayload(), payload,
              'The payload given to resolve the param should be the same in '+
              'the resolved entry'
            );
            done();
          });
          assert.throws(() => ctn.rejectCommand(msgId),
            'Should throw if message id is not present');
          ctn.addCommand(msgId, cmd).rejectCommand(msgId, payload);
        }
      );
    })
});
