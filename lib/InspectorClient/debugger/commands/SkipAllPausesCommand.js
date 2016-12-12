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
const isBoolean = require('lodash.isboolean');

class SkipAllPausesCommand extends RPCCommand {
  static method () {
    return 'Debugger.setSkipAllPauses';
  }
  static populateRequestParams (skip) {
    if (!isBoolean(skip)) {
      throw new TypeError('skip must be a boolean');
    }
    return {skip: skip};
  }
  constructor (messageId, skip) {
    super(messageId, SkipAllPausesCommand.method());
    super.setRequestParams(SkipAllPausesCommand.populateRequestParams(skip));
  }
}

module.exports = SkipAllPausesCommand;
