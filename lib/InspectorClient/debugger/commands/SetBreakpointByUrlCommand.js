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
const isNumber = require('lodash.isnumber');

class SetBreakpointByUrlCommand extends RPCCommand {
  static method () {
    return 'Debugger.setBreakpointByUrl';
  }
  static populateParams (lineNumber, url, urlRegex, columnNumber, condition) {
    if (!isString(lineNumber)) {
      throw new TypeError('lineNumber must be a string');
    }
    var params = {
      lineNumber: lineNumber
    };
    if (isString(url)) {
      params.url = url;
    }
    if (isString(urlRegex)) {
      params.urlRegex = urlRegex;
    }
    if (isNumber(columnNumber)) {
      params.columnNumber = columnNumber;
    }
    if (isString(condition)) {
      params.condition = condition;
    }
    return params;
  }

  constructor (messageId, lineNumber, url=null, urlRegex=null, columnNumber=null,
    condition=null) {
    super(messageId, SetBreakpointByUrlCommand.method());

    super.setRequestParams(SetBreakpointByUrlCommand.populateParams(lineNumber,
      url, urlRegex, columnNumber, condition));
  }
}

module.exports = SetBreakpointByUrlCommand;
