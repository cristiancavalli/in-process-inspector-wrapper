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
const EvaluateCommand = require('../../../../lib/InspectorClient/runtime/commands/EvaluateCommand');

describe('EvaluateCommand', function () {
  describe('ExpressionBuilder', function() {
    var inst;
    const expr = 'test';
    beforeEach(() => inst = EvaluateCommand.newExpression(expr));
    describe('Initialization', function () {
      // Test the optionality of all other fields
      it('Should still produce a valid message with only the expression field set',
        () => assert.deepEqual(inst.payload(), {expression: expr}));
      it('Should throw if not given a string',
        () => assert.throws(() => EvaluateCommand.newExpression({test: '1'})));
    });
    describe('Writing data to instance', function () {
      describe('objectGroup', function () {
        it('Should allow setting of a objectGroup as a string', function () {
          const val = 'test';
          assert.deepEqual(inst.setObjectGroup(val).payload(),
            {expression: expr, objectGroup: val});
        });
        it('Should throw if not given a string', 
          () => assert.throws(() => inst.setObjectGroup(null), TypeError));
      });
      describe('includeCommandLineAPI', function () {
        it('Should allow setting of includeCommandLineAPI as a boolean', function () {
          const val = true;
          assert.deepEqual(inst.setIncludeCommandLineAPI(val).payload(),
            {expression: expr, includeCommandLineAPI: val});
        });
        it('Should throw if not given a boolean', 
          () => assert.throws(() => inst.setIncludeCommandLineAPI(null), 
            TypeError));
      });
      describe('silent', function () {
        it('Should allow setting of silent as a boolean', function () {
          const val = true;
          assert.deepEqual(inst.setSilent(val).payload(),
            {expression: expr, silent: val});
        });
        it('Should throw if not given a boolean', 
          () => assert.throws(() => inst.setSilent(null), 
            TypeError));
      });
      describe('contextId', function () {
        it('Should allow setting of contextId as a number', function () {
          const val = 10;
          assert.deepEqual(inst.setContextId(val).payload(),
            {expression: expr, contextId: val});
        });
        it('Should throw if not given a number', 
          () => assert.throws(() => inst.setContextId(null), 
            TypeError));
      });
      describe('returnByValue', function () {
        it('Should allow setting of returnByValue as a boolean', function () {
          const val = false;
          assert.deepEqual(inst.setReturnByValue(val).payload(),
            {expression: expr, returnByValue: val});
        });
        it('Should throw if not given a boolean', 
          () => assert.throws(() => inst.setReturnByValue(null), 
            TypeError));
      });
      describe('generatePreview', function () {
        it('Should allow setting of generatePreview as a boolean', function () {
          const val = false;
          assert.deepEqual(inst.setGeneratePreview(val).payload(),
            {expression: expr, generatePreview: val});
        });
        it('Should throw if not given a boolean', 
          () => assert.throws(() => inst.setGeneratePreview(null), 
            TypeError));
      });
      describe('userGesture', function () {
        it('Should allow setting of userGesture as a boolean', function () {
          const val = false;
          assert.deepEqual(inst.setUserGesture(val).payload(),
            {expression: expr, userGesture: val});
        });
        it('Should throw if not given a boolean', 
          () => assert.throws(() => inst.setUserGesture(null), 
            TypeError));
      });
      describe('awaitPromise', function () {
        it('Should allow setting of awaitPromise as a boolean', function () {
          const val = false;
          assert.deepEqual(inst.setAwaitPromise(val).payload(),
            {expression: expr, awaitPromise: val});
        });
        it('Should throw if not given a boolean', 
          () => assert.throws(() => inst.setAwaitPromise(null), 
            TypeError));
      });
    });
  });
  describe('EvaluateCommand -- instance', function () {
    var inst;
    const id = 1;
    const expr = 'test';
    const exprBuilder = EvaluateCommand.newExpression(expr);
    beforeEach(() => inst = new EvaluateCommand(id, exprBuilder));
    describe('Initialization', function () {
      it('Should have an expression property which reflects the argument to construction',
        () => assert.deepEqual(inst.requestPayload().params, exprBuilder.payload()));
      it('Should throw if not given an instance of ExpressionBuilder for construction',
        () => assert.throws(() => new EvaluateCommand(id, {expression: expr})));
    });
  });
});
