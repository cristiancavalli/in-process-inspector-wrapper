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
const isObject = require('lodash.isobject');
const every = require('lodash.every');

class SetBlackboxedRangesCommand extends RPCCommand {
  static method () {
    return 'Debugger.setBlackboxedRanges';
  }
  static populateRequestParams (scriptId, positions) {
    if (!isString(scriptId)) {
      throw new TypeError('scriptId must be a string');
    } else if (!Array.isArray(positions) || positions.length < 1 ||
      !every(positions, isObject)) {
        throw new TypeError('positions must be an array of objects with at least one entry');
    }
    return {scriptId: scriptId, positions: positions};
  }
  static newScriptPosition (lineNumber=null, columnNumber=null) {
    return {
      lineNumber: lineNumber,
      columnNumber: columnNumber
    };
  }

  constructor (messageId, scriptId, positions) {
    super(messageId, SetBlackboxedRangesCommand.method());
    super.setRequestParams(SetBlackboxedRangesCommand.
      populateRequestParams(scriptId, positions));
  }
}

module.exports = SetBlackboxedRangesCommand;
