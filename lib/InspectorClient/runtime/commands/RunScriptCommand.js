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

class RunScriptCommand extends RPCCommand {
  static method () {
    return 'Runtime.runScript';
  }
  static populateRequestParams (scriptId, executionContextId, objectGroup, silent,
    includeCommandLineAPI, returnByValue, generatePreview, awaitPromise) {
    if (!isString(scriptId)) {
      throw new TypeError('scriptId must be a string');
    }
    var params = {scriptId: scriptId};
    if (isString(executionContextId)) {
      params.executionContextId = executionContextId;
    }
    if (isString(objectGroup)) {
      params.objectGroup = objectGroup;
    }
    if (isBoolean(silent)) {
      params.silent = silent;
    }
    if (isBoolean(includeCommandLineAPI)) {
      params.includeCommandLineAPI = includeCommandLineAPI;
    }
    if (isBoolean(returnByValue)) {
      params.returnByValue = returnByValue;
    }
    if (isBoolean(generatePreview)) {
      params.generatePreview = generatePreview;
    }
    if (isBoolean(awaitPromise)) {
      params.awaitPromise = awaitPromise;
    }
    return params;
  }
  constructor (messageId, scriptId, executionContextId, objectGroup, silent,
    includeCommandLineAPI, returnByValue, generatePreview, awaitPromise) {
    super(messageId, RunScriptCommand.method());
    super.setRequestParams(RunScriptCommand.populateRequestParams(scriptId,
      executionContextId, objectGroup, silent, includeCommandLineAPI,
      returnByValue, generatePreview, awaitPromise));
  }
}

module.exports = RunScriptCommand;
