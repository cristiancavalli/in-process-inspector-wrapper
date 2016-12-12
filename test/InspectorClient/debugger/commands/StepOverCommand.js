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
const StepOverCommand = require('../../../../lib/InspectorClient/debugger/commands/StepOverCommand');

describe('StepOverCommand', function () {
  const id = 0;
  var inst;
  beforeEach(() => inst = new StepOverCommand(id));
  describe('Commands', function () {
    describe('Resolution', function () {
      it('Should set the successful flag to true',
        () => assert(inst.resolve().isCompleted()));
      it('Should set the completed flag to true',
        () => assert(inst.resolve().isSuccessful()));
    });
    describe('Rejection', function () {
      it('Should set the successful flag to false',
        () => assert(!inst.reject().isSuccessful()));
      it('Should set the completed flag to true',
        () => assert(inst.reject().isCompleted()));
    });
  });
});
