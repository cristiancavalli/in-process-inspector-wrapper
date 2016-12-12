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
const mt = require('../../../lib/InspectorClient/core/MessageTableSingleton');

describe('MessageTableSingleton', function () {
  afterEach(() => mt.reset());
  describe('Initialization', function () {
    it('Should init with an empty table', 
      () => assert.deepEqual(mt.getTable(), {}));
  });
  describe('Writing, reading and deleting', function () {
    describe('Valid behaviour', function () {
      const id = 0;
      const payload = {test: true};
      it('Should have an interface to write and read entries', function () {
        assert.doesNotThrow(() => mt.setRecord(id, payload),
          'Does not throw on writing valid entry');
        assert.strictEqual(mt.getRecord(id), payload,
          'Getting the written record should return the correct payload');
        assert.deepEqual(mt.getTable(), {[id]: payload},
          'The table should only have one entry; keyed by the given key');
        assert.doesNotThrow(() => mt.deleteRecord(id),
          'Should not throw when deleting valid entry');
      });
    });
    describe('Error behaviour', function () {
      it('Should throw if getting a record which does not exist',
        () => assert.throws(() => mt.getRecord(0)));
      it('Should throw if deleting a record which does not exist',
        () => assert.throws(() => mt.deleteRecord(0)));
      it('Should throw if setting a record with a preexisting id',
        function () {
          mt.setRecord(0, true);
          assert.throws(() => mt.setRecord(0, false));
        });
    });
  });
  describe('Reset behaviour', function () {
    it('Should empty table content on reset', function () {
      const payloads = [
        {id: 0, ct: {test: true}},
        {id: 1, ct: {test: false}}
      ];
      mt.setRecord(payloads[0].id, payloads[0].ct);
      mt.setRecord(payloads[1].id, payloads[1].ct);
      assert.strictEqual(mt.getRecord(payloads[0].id), payloads[0].ct,
        'Entry should exist in instance once written');
      assert.strictEqual(mt.getRecord(payloads[1].id), payloads[1].ct,
        'Entry should exist in instance once written');
      mt.reset();
      assert.deepEqual(mt.checkByMessageId(payloads[0].id), false);
      assert.deepEqual(mt.getTable(), {});
    });
  });
});
