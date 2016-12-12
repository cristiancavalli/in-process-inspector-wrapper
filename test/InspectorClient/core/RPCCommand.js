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
const RPCCommand = require('../../../lib/InspectorClient/core/RPCCommand');
const lodash = require('lodash');

describe('RPCCommand', function () {
  describe('Initial State', function () {
    it('Should have a basic set of read-only events', function () {
      const cmd = new RPCCommand(1, 'test');
      assert(lodash.every(['RESOLVED', 'REJECTED'], function (evtName) {
        return lodash.has(RPCCommand.events(), evtName);
      }));
    });
    it('Should assign the constructor argument of message id to the instance', function () {
      const msgId = 0;
      const method = 'test';
      const cmd = new RPCCommand(msgId, method);
      assert(cmd.messageId() === msgId);
      assert(cmd.method() === method);
    });
    it('Should have a set of class-level properties after initialization', function () {
      const cmd = new RPCCommand(1, 'test');
      assert(cmd.isCompleted() === false, '.isCompleted should return false');
      assert(cmd.isSuccessful() === false, '.isSuccessful should return false');
      assert(cmd.responsePayload() === null, '.payload should return null');
    });
    it('Should throw given an invalid argument for its constructor', function () {
      assert.throws(() => new RPCCommand(), TypeError);
      assert.throws(() => new RPCCommand('test'), TypeError);
      assert.throws(() => new RPCCommand(null), TypeError);
      assert.throws(() => new RPCCommand({test: true}), TypeError);
      assert.throws(() => new RPCCommand([1]), TypeError);
      assert.throws(() => new RPCCommand(3, null), TypeError);
    });
  });
  describe('Eventing', function () {
    const id = 0;
    const method = 'test';
    var cmd, resolutionPayload;
    beforeEach(function () {
      cmd = new RPCCommand(id, method);
      resolutionPayload = {test: lodash.random()};
    });
    describe('Adding request parameters', function () {
      it('should have id and method before parameters are added',
        () => assert.deepEqual(cmd.requestPayload(), {id: id, method: method}));
      it('should allow for the adding of parameters', function () {
        var params = {test: true};
        cmd.setRequestParams(params);
        assert.deepEqual(cmd.requestPayload(), {id: id, method: method,
          params: params})
      });
    });
    describe('The "RESOLVED" event lifecycle', function () {
      it('Should be able to complete a full lifecycle', function (done) {
        cmd.addRejectionListener((rawCommandResultPayload) => {
          assert(false, 'Should not call the rejection event');
          done();
        }).addResolutionListener((rawCommandResultPayload) => {
          assert(true, 'Resolution listener should be called');
          assert(rawCommandResultPayload === resolutionPayload,
            [
              'Resolution payload given as only argument to listener should be',
              'the same reference/value supplied as the parameter to resolution.'
            ].join(' ')
          );
          assert(cmd.responsePayload() === resolutionPayload, 
            'Resolution payload should be present on instance');
          assert(cmd.isCompleted() && cmd.isSuccessful(),
            'The instance should return true for both completion and success fields');
          done();
        }).resolve(resolutionPayload).decompose();
      });
    });
    describe('The "REJECTED" event lifecycle', function () {
      it('Should be able to complete a full lifecycle', function (done) {
        cmd.addResolutionListener((rawCommandResultPayload) => {
          assert(false, 'Should not call the resolution event');
          done();
        }).addRejectionListener((rawCommandResultPayload) => {
          assert(true, 'Rejection listener should be called');
          assert(rawCommandResultPayload === resolutionPayload);
           assert(rawCommandResultPayload === resolutionPayload,
            [
              'Rejection payload given as only argument to listener should be',
              'the same reference/value supplied as the parameter to rejection.'
            ].join(' ')
          );
          assert(cmd.responsePayload() === resolutionPayload, 
            'Rejection payload should be present on instance');
          assert(cmd.isCompleted() && !cmd.isSuccessful(),
            'The instance should return true for the completion field but not the success field');
          done();
        }).reject(resolutionPayload).decompose();
      });
    });
    describe('Detaching listeners', function () {
      it('Should not call either event if removeListeners has been invoked after listener attachment', function (done) {
         cmd.addResolutionListener(function (rawCommandResultPayload) {
            assert(false, 'Should not call the resolution event');
            done();
          }).addRejectionListener(function (rawCommandResultPayload) {
            assert(false, 'Should not call the rejection event');
            done();
          }).decompose().reject(true).resolve(false);
          setImmediate(function () {
            assert(true, 'Neither rejection or resolution events should be called');
            done();
          });
      });
    });
  });
});
