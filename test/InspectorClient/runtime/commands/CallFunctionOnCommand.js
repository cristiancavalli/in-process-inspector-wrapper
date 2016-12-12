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
const CallFunctionOnCommand = require('../../../../lib/InspectorClient/runtime/commands/CallFunctionOnCommand');

describe('CallFunctionOnCommand', function () {
  describe('FunctionCallBuilder', function () {
    var inst;
    const objectId = '1';
    const functionDeclaration = 'test';
    const args = [{value: '1', unserializableValue: 'NaN', objectId: 'id'}];
    const silent = false;
    const returnByValue = true;
    const generatePreview = false;
    const userGesture = true;
    const awaitPromise = false;
    beforeEach(() => inst = CallFunctionOnCommand
      .newFunctionCallBuilder(objectId, functionDeclaration));
    describe('Initialization', function () {
      it('Should throw if given type other than string for object id',
        () => assert.throws(() => CallFunctionOnCommand.newFunctionCallBuilder(null)));
      it('Should throw if given type other than string for function declaration',
        () => assert.throws(() => CallFunctionOnCommand.newFunctionCallBuilder(objectId, null)));
      it('Should have a object id and function declaration reflecting the arguments to construction',
        () => assert.deepEqual(inst.payload(),
          {objectId: objectId, functionDeclaration: functionDeclaration}));
    });
    describe('Writing data to instance', function () {
      describe('arguments', function () {
        it('Should allow setting of property with correct argument type',
          function () {
            inst.setArguments(args);
            assert.deepEqual(inst.payload(), {objectId: objectId,
              functionDeclaration: functionDeclaration, arguments: args});
          }
        );
        it('Should throw given an invalid arugment type',
          () => assert.throws(() => inst.setArguments(null), TypeError));
      });
      describe('silent', function () {
        it('Should allow setting of property with correct argument type',
          function () {
            inst.setSilent(silent);
            assert.deepEqual(inst.payload(), {objectId: objectId,
              functionDeclaration: functionDeclaration, silent: silent});
          }
        );
        it('Should throw given an invalid arugment type',
          () => assert.throws(() => inst.setSilent(null), TypeError));
      });
      describe('returnByValue', function () {
        it('Should allow setting of property with correct argument type',
          function () {
            inst.setReturnByValue(returnByValue);
            assert.deepEqual(inst.payload(), {objectId: objectId,
              functionDeclaration: functionDeclaration, returnByValue: returnByValue});
          }
        );
        it('Should throw given an invalid arugment type',
          () => assert.throws(() => inst.setReturnByValue(null), TypeError));
      });
      describe('generatePreview', function () {
        it('Should allow setting of property with correct argument type',
          function () {
            inst.setGeneratePreview(generatePreview);
            assert.deepEqual(inst.payload(), {objectId: objectId,
              functionDeclaration: functionDeclaration, generatePreview: generatePreview});
          }
        );
        it('Should throw given an invalid arugment type',
          () => assert.throws(() => inst.setGeneratePreview(null), TypeError));
      });
      describe('userGesture', function () {
        it('Should allow setting of property with correct argument type',
          function () {
            inst.setUserGesture(userGesture);
            assert.deepEqual(inst.payload(), {objectId: objectId,
              functionDeclaration: functionDeclaration, userGesture: userGesture});
          }
        );
        it('Should throw given an invalid arugment type',
          () => assert.throws(() => inst.setUserGesture(null), TypeError));
      });
      describe('awaitPromise', function () {
        it('Should allow setting of property with correct argument type',
          function () {
            inst.setAwaitPromise(awaitPromise);
            assert.deepEqual(inst.payload(), {objectId: objectId,
              functionDeclaration: functionDeclaration, awaitPromise: awaitPromise});
          }
        );
        it('Should throw given an invalid arugment type',
          () => assert.throws(() => inst.setAwaitPromise(null), TypeError));
      });
    });
  });
  describe('CallFunctionOnCommand -- instance', function () {
    var inst;
    const id = 1;
    const objectId = '1';
    const functionDeclaration = 'test';
    const fnCallBuilder = CallFunctionOnCommand
      .newFunctionCallBuilder(objectId, functionDeclaration);
    beforeEach(() => inst = new CallFunctionOnCommand(id, fnCallBuilder));
    describe('Initialization', function () {
      it('Should throw if not given an instance of FunctionCallBuilder',
        () => assert.throws(() => new CallFunctionOnCommand(id, {objectId: objectId})));
      it('Should have a function call property reflecting argument construction',
        () => assert.deepEqual(inst.requestPayload().params,
          {objectId: objectId, functionDeclaration: functionDeclaration}));
    })
  });
});
