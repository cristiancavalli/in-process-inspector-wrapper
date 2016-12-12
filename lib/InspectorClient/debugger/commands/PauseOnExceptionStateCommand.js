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

const isString = require('lodash.isstring');
const has = require('lodash.has');
const RPCCommand = require('../../core/RPCCommand');

class PauseOnExceptionStateCommand extends RPCCommand {
  static method () {
    return 'Debugger.setPauseOnExceptions';
  }
  static getPossibleStates () {
    return {
      none: 'none',
      uncaught: 'uncaught',
      all: 'all'
    };
  }
  static populateRequestParams (state) {
    const possibleStates = PauseOnExceptionStateCommand.getPossibleStates();
    if (!isString(state) || !has(possibleStates, state)) {
      throw new TypeError('Invalid state given for debugger');
    }
    return {state: state};
  }
  
  constructor (messageId, state) {
    super(messageId, PauseOnExceptionStateCommand.method());
    super.setRequestParams(PauseOnExceptionStateCommand
      .populateRequestParams(state));
  }
}

module.exports = PauseOnExceptionStateCommand;
