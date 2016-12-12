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
const EvaluateCommand = require('./commands/EvaluateCommand');
const InvalidTypeGivenForCommand = require('../errors/InvalidTypeGivenForCommand');

class EvaluateQueue extends RPCCommandCollection {
  constructor () {
    super();
  }
  newExpression (expression) {
    return EvaluateCommand.newExpression(expression);
  }
  newCommand (messageId, expression) {
    return new EvaluateCommand(messageId, expression);
  }
  addCommand (messageId, entry) {
    if (entry instanceof EvaluateCommand) {
      super.addCommand(messageId, entry);
      return this;
    }
    throw new InvalidTypeGivenForCommand(EvaluateCommand.name);
  }
}

module.exports = EvaluateQueue;
