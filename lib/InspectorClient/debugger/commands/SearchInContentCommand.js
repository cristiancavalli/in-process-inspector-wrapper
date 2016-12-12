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

const RPCCommand = require('../../core/RPCCommand');
const isString = require('lodash.isstring');
const isBoolean = require('lodash.isboolean');

class SearchInContentCommand extends RPCCommand {
  static method () {
    return 'Debugger.searchInContent';
  }
  static populateRequestParams (scriptId, query, caseSensitive, isRegex) {
    if (!isString(scriptId)) {
      throw new TypeError('scriptId must be a string');
    } else if (!isString(query)) {
      throw new TypeError('query must be a string');
    }
    var params = {scriptId: scriptId, query: query};
    if (isBoolean(caseSensitive)) {
      params.caseSensitive = caseSensitive;
    }
    if (isBoolean(isRegex)) {
      params.isRegex = isRegex;
    }
    return params;
  }

  constructor (messageId, scriptId, query, caseSensitive, isRegex) {
    super(messageId, SearchInContentCommand.method());
    super.setRequestParams(SearchInContentCommand.populateRequestParams(
      scriptId, query, caseSensitive, isRegex));
  }
}

module.exports = SearchInContentCommand;
