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
const zipObject = require('lodash').zipObject;
const SetBreakpointByUrlCommand = require('../../../../lib/InspectorClient/debugger/commands/SetBreakpointByUrlCommand');

describe('SetBreakpointByUrlCommand', function () {
  const id = 0;
  const lineNumber = '2';
  const url = 'test';
  const urlRegex = '/test/';
  const columnNumber = 2;
  const condition = 'a == 3';
  const template = SetBreakpointByUrlCommand;
  describe('Initialization', function () {
    describe('Error behaviour', function () {
      it('Should throw if not given lineNumber as a string',
        () => assert.throws(() => new template(id), TypeError));
    })
    describe('Request parameter population', function () {
      it('Should populate lineNumber param',
        () => assert.deepEqual(
          new template(id, lineNumber).requestPayload().params,
          {lineNumber: lineNumber}
        )
      );
      it('Should populate url param',
        () => assert.deepEqual(
          new template(id, lineNumber, url).requestPayload().params,
          {lineNumber: lineNumber, url: url}
        )
      );
       it('Should populate urlRegex param',
        () => assert.deepEqual(
          new template(id, lineNumber, null, urlRegex).requestPayload().params,
          {lineNumber: lineNumber, urlRegex: urlRegex}
        )
      );
      it('Should populate columnNumber param',
        () => assert.deepEqual(
          new template(id, lineNumber, null, null, columnNumber).requestPayload().params,
          {lineNumber: lineNumber, columnNumber: columnNumber}
        )
      );
      it('Should populate condition param',
        () => assert.deepEqual(
          new template(id, lineNumber, null, null, null, condition).requestPayload().params,
          {lineNumber: lineNumber, condition: condition}
        )
      );
    });
  });
});
