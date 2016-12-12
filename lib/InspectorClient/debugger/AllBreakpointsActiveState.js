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

const StatefulCommandCollection = require('../core/StatefulCommandCollection');
const AllBreakpointsActiveCommand = require('./commands/AllBreakpointsActiveCommand');
const InvalidTypeGivenForCommand = require('../errors/InvalidTypeGivenForCommand');

class DebuggerBreakpointsState extends StatefulCommandCollection {
  constructor () {
    super();
    super._setState(false);
  }
  newCommand (messageId, active) {
    return new AllBreakpointsActiveCommand(messageId, active);
  }
  addCommand (messageId, entry) {
    if (entry instanceof AllBreakpointsActiveCommand) {
      super.addCommand(messageId, entry);
      return this;
    }
    throw new InvalidTypeGivenForCommand(this.constructor.name);
  }
}

module.exports = DebuggerBreakpointsState;
