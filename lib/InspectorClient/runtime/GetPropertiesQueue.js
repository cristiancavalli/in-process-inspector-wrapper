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
const GetPropertiesCommand = require('./commands/GetPropertiesCommand');
const InvalidTypeGivenForCommand = require('../errors/InvalidTypeGivenForCommand');

class GetPropertiesQueue extends RPCCommandCollection {
  constructor () {
    super();
  }
  newCommand (messageId, objectId, ownProperties, accessorPropertiesOnly,
    generatePreview) {
    return new GetPropertiesCommand(messageId, objectId, ownProperties,
      accessorPropertiesOnly, generatePreview);
  }
  addCommand (messageId, entry) {
    if (entry instanceof GetPropertiesCommand) {
      super.addCommand(messageId, entry);
      return entry;
    }
    throw new InvalidTypeGivenForCommand(GetPropertiesCommand.name);
  }
}

module.exports = GetPropertiesQueue;
