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
const StatefulCommandCollection = require('../../../lib/InspectorClient/core/StatefulCommandCollection');
const RPCCommand = require('../../../lib/InspectorClient/core/RPCCommand');

describe('StatefulCommandCollection', function () {
  describe('Eventing - State update lifecycle', function () {
    const id = 0, idB = 1, payload = {test: true}, method = 'test';
    var scc, cmd;
    beforeEach(function () {
      scc = new StatefulCommandCollection();
      cmd = new RPCCommand(id, method);
    });
    afterEach(function () {
      scc.decompose();
      StatefulCommandCollection.data().reset();
      cmd.decompose();
    });
    describe('State update branching', function () {
      it('Should allow for listening to the update event', function (done) {
        assert.strictEqual(scc.getState(), null, 'Initial state should be null');
        scc.addUpdateListener(function (state) {
          assert.strictEqual(
            state,
            payload,
            'The state of the collection invoked with the callback should be the payload'
          );
          assert.strictEqual(
            scc.getState(),
            payload,
            'The getState function should return the reference to the payload'
          );
          done();
        }).addCommand(id, cmd).resolveCommand(id, payload).decompose();
      });
      it('Should not call the update event if the same value is supplied', function (done) {
        scc.addUpdateListener(function (state) {
          scc.decompose().addUpdateListener(function (state) {
            assert(false,
              'The update event should not be called twice for the same value on command resolution');
            done();
          }).addCommand(idB, cmd).resolveCommand(idB, payload).decompose();
        }).addCommand(id, cmd).resolveCommand(id, payload);
        setImmediate(done);
      });
    });
    describe('Listener attachment order', function () {
      it('Should not call the update event if decompose is called beforehand', function (done) {
        scc.addUpdateListener(function (state) {
          assert(false, 'The update listener should not be called');
          done();
        }).addCommand(id, cmd).decompose().resolveCommand(id, payload);
        setImmediate(done);
      });
    });
    describe('Resolution error behaviour for nonexistent commands', function () {
      it(
        'Should throw if resolving a command which has not been registered',
        function () { assert.throws(() => scc.resolveCommand(id), Error); }
      );
    });
  });
});
