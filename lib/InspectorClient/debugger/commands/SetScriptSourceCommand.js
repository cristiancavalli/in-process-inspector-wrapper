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

class SetScriptSourceCommand extends RPCCommand {
  static method () {
    return 'Debugger.setScriptSource';
  }
  static populateRequestParams (scriptId, scriptSource, dryRun) {
    if (!isString(scriptId)) {
      throw new TypeError('scriptId must be a string');
    } else if (!isString(scriptSource)) {
      throw new TypeError('scriptSource must be a string');
    }
    var params = {scriptId: scriptId, scriptSource: scriptSource};
    if (isBoolean(dryRun)) {
      params.dryRun = dryRun;
    }
    return params;
  }
  constructor (messageId, scriptId, scriptSource, dryRun) {
    super(messageId, SetScriptSourceCommand.method());
    super.setRequestParams(SetScriptSourceCommand
      .populateRequestParams(scriptId, scriptSource, dryRun));
  }
}

module.exports = SetScriptSourceCommand;
