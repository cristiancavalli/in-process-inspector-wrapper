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

const every = require('lodash.every');
const isString = require('lodash.isstring');
const RPCCommand = require('../../core/RPCCommand');

class SetBlackboxPatternsCommand extends RPCCommand {
  static method () {
    return 'Debugger.setBlackboxPatterns';
  }
  static populateRequestParams (patterns) {
    if(!Array.isArray(patterns) || patterns.length < 1 ||
      !every(patterns, isString)) {
      throw new TypeError('patterns must be an array of strings with at least one entry');
    }
    return {patterns: patterns};
  }
  constructor (messageId, patterns) {
    super(messageId, SetBlackboxPatternsCommand.method());
    super.setRequestParams(SetBlackboxPatternsCommand
      .populateRequestParams(patterns));
  }
}

module.exports = SetBlackboxPatternsCommand;
