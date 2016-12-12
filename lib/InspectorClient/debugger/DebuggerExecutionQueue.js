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
const ResumeCommand = require('./commands/DebuggerResumeCommand');
const PauseCommand = require('./commands/DebuggerPauseCommand')
const InvalidTypeGivenForCommand = require('../errors/InvalidTypeGivenForCommand');

class DebuggerExecutionQueue extends RPCCommandCollection {
  constructor () {
    super();
  }
  newPauseCommand (messageId) {
    return new PauseCommand(messageId);
  }
  newResumeCommand (messageId) {
    return new ResumeCommand(messageId);
  }
  addCommand (messageId, entry) {
    if (entry instanceof ResumeCommand || entry instanceof PauseCommand) {
      super.addCommand(messageId, entry);
      return this;
    }
    throw new InvalidTypeGivenForCommand(DebuggerExecutionQueue.name);
  }
}

module.exports = DebuggerExecutionQueue;
