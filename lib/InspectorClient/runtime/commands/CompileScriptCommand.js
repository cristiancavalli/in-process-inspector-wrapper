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

const lodash = require('lodash');
const RPCCommand = require('../../core/RPCCommand');
const isString = require('lodash.isstring');
const isBoolean = require('lodash.isboolean');

class CompileScriptCommand extends RPCCommand {
  static method () {
    return 'Runtime.compileScript';
  }
  static populateRequestParams (expression, sourceURL, persistScript,
    executionContextId) {
    if (!isString(expression)) {
      throw new TypeError('expression must be a string');
    } else if (!isString(sourceURL)) {
      throw new TypeError('sourceURL must be a string');
    } else if (!isBoolean(persistScript)) {
      throw new TypeError('persistScript must be a boolean');
    }
    var params = {expression: expression, sourceURL: sourceURL,
      persistScript: persistScript};
    if (isString(executionContextId)) {
      params.executionContextId = executionContextId;
    }
    return params;
  }
  constructor (messageId, expression, sourceURL, persistScript,
    executionContextId) {
    super(messageId, CompileScriptCommand.method());
    super.setRequestParams(CompileScriptCommand.populateRequestParams(
      expression, sourceURL, persistScript, executionContextId));
  }
}

module.exports = CompileScriptCommand;
