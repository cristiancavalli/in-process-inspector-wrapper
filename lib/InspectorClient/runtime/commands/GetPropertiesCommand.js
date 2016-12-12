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

const lodash = require('lodash');
const RPCCommand = require('../../core/RPCCommand');
const isString = require('lodash.isstring');
const isBoolean = require('lodash.isboolean');

class GetPropertiesCommand extends RPCCommand {
  static method () {
    return 'Runtime.getProperties';
  }
  static populateRequestParams (objectId, ownProperties, accessorPropertiesOnly,
    generatePreview) {
    if (!isString(objectId)) {
      throw new TypeError('objectId must be a string');
    }
    var params = {objectId: objectId};
    if (isBoolean(ownProperties)) {
      params.ownProperties = ownProperties;
    }
    if (isBoolean(accessorPropertiesOnly)) {
      params.accessorPropertiesOnly = accessorPropertiesOnly;
    }
    if (isBoolean(generatePreview)) {
      params.generatePreview = generatePreview;
    }
    return params;
  }
  constructor (messageId, objectId, ownProperties, accessorPropertiesOnly,
    generatePreview) {
    super(messageId, GetPropertiesCommand.method());
    super.setRequestParams(GetPropertiesCommand.populateRequestParams(
      objectId, ownProperties, accessorPropertiesOnly, generatePreview));
  }
}

module.exports = GetPropertiesCommand;
