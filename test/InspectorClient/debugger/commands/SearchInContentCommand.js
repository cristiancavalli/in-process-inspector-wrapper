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
const SearchInContentCommand = require('../../../../lib/InspectorClient/debugger/commands/SearchInContentCommand');

describe('SearchInContentCommand', function () {
  const id = 0;
  const scriptId = 'x';
  const query = 'y';
  const caseSensitive = true;
  const isRegex = true;
  const template = SearchInContentCommand;
  describe('Initialization', function () {
    describe('Error behaviour', function () {
      it('Should throw if not given scriptId as a string',
        () => assert.throws(() => new template(id), TypeError));
      it('Should throw if not given query as a string',
        () => assert.throws(() => new template(id, scriptId), TypeError));
    });
    describe('Request parameter population', function () {
      it('Should populate scriptId and query params',
        () => assert.deepEqual(
          new template(id, scriptId, query).requestPayload().params,
          {scriptId: scriptId, query: query}
        )
      );
      it('Should populate caseSensitive param',
        () => assert.deepEqual(
          new template(id, scriptId, query, caseSensitive).requestPayload().params,
          {scriptId: scriptId, query: query, caseSensitive: caseSensitive}
        )
      );
      it('Should populate isRegex param',
        () => assert.deepEqual(
          new template(id, scriptId, query, null, isRegex).requestPayload().params,
          {scriptId: scriptId, query: query, isRegex: isRegex}
        )
      );
    });
  });
});
