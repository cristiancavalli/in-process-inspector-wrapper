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

const RPCCommandCollection = require('../core/RPCCommandCollection');
const DebuggerDisableCommand = require('./commands/DebuggerDisableCommand');
const DebuggerEnableCommand = require('./commands/DebuggerEnableCommand');
const InvalidTypeGivenForCommand = require('../errors/InvalidTypeGivenForCommand');

class EnableQueue extends RPCCommandCollection {
  constructor () {
    super();
  }
  newEnableCommand (messageId) {
    return new DebuggerEnableCommand(messageId);
  }
  newDisableCommand (messageId) {
    return new DebuggerDisableCommand(messageId)
  }
  addCommand (messageId, entry) {
    if (entry instanceof DebuggerEnableCommand || entry instanceof DebuggerDisableCommand) {
      super.addCommand(messageId, entry);
      return this;
    }
    throw new InvalidTypeGivenForCommand(DebuggerEnableCommand.name);
  }
}

module.exports = EnableQueue;
