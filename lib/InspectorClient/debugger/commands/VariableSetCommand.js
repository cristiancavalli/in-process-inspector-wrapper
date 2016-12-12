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
const isObject = require('lodash.isObject');

class VariableSetCommand extends RPCCommand {
  static method () {
    return 'Debugger.setVariableValue';
  }
  static populateRequestParams (scopeNumber, variableName, newValue, callFrameId) {
    if (!isNumber(scopeNumber)) {
      throw new TypeError('scopeNumber must be a number');
    } else if (!isString(variableName)) {
      throw new TypeError('variableName must be a string');
    } else if (!isObject(newValue)) {
      throw new TypeError('newValue must be an object');
    } else if (!isString(callFrameId)) {
      throw new TypeError('callFrameId must be a string');
    }
    return {scopeNumber: scopeNumber, variableName: variableName, 
      newValue: newValue, callFrameId: callFrameId};
  }
  constructor (messageId, scopeNumber, variableName, newValue, callFrameId) {
    super(messageId, VariableSetCommand.method());
    super.setRequestParams(VariableSetCommand.populateRequestParams(scopeNumber,
      variableName, newValue, callFrameId));
  }
}

module.exports = VariableSetCommand;