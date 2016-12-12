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

const merge = require('lodash').merge;
const StatefulCommandCollection = require('../core/StatefulCommandCollection');
const PauseOnExceptionStateCommand = require('./commands/PauseOnExceptionStateCommand');
const InvalidTypeGivenForCommand = require('../errors/InvalidTypeGivenForCommand');

class PauseOnExceptionState extends StatefulCommandCollection {
  constructor () {
    super();

    super._setState(PauseOnExceptionStateCommand.getPossibleStates().none);
  }
  newCommand (messageId, toState) {
    return new PauseOnExceptionStateCommand(messageId, toState);
  }
  addCommand (messageId, entry) {
    if (entry instanceof PauseOnExceptionStateCommand) {
      super.addCommand(messageId, entry);
      return this;
    }
    throw new InvalidTypeGivenForCommand(PauseOnExceptionStateCommand.name);
  }
  possibleStates() {
    return PauseOnExceptionStateCommand.getPossibleStates();
  }
}

module.exports = PauseOnExceptionState;
