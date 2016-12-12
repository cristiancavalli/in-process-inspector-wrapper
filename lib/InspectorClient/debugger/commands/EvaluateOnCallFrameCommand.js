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

const isObject = require('lodash.isobject');
const isString = require('lodash.isstring');
const isBoolean = require('lodash.isboolean');
const RPCCommand = require('../../core/RPCCommand');

class EvaluateOnCallFrameCommand extends RPCCommand {
  static method () {
    return 'Debugger.evaluateOnCallFrame';
  }
  static populateRequestParams (callFrameId, expression, objectGroup,
    includeCommandLineAPI, silent, returnByValue, generatePreview) {
    if (!isString(callFrameId)) {
      throw new TypeError('callFrameId must be a string');
    } else if (!isString(expression)) {
      throw new TypeError('expression must be a string');
    }
    var params = {callFrameId: callFrameId, expression: expression};
    
    if (isString(objectGroup)) {
      params.objectGroup = objectGroup;
    }
    if (isBoolean(includeCommandLineAPI)) {
      params.includeCommandLineAPI = includeCommandLineAPI;
    }
    if (isBoolean(silent)) {
      params.silent = silent;
    }
    if (isBoolean(returnByValue)) {
      params.returnByValue = returnByValue;
    }
    if (isBoolean(generatePreview)) {
      params.generatePreview = generatePreview;
    }
    return params;
  }
  constructor (messageId, callFrameId, expression, objectGroup=null,
    includeCommandLineAPI=null, silent=null, returnByValue=null,
    generatePreview=null) {
    super(messageId, EvaluateOnCallFrameCommand.method());
    super.setRequestParams(EvaluateOnCallFrameCommand.populateRequestParams(
      callFrameId, expression, objectGroup, includeCommandLineAPI, silent,
      returnByValue, generatePreview));
  }
}

module.exports = EvaluateOnCallFrameCommand;
