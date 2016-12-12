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

class AwaitPromiseCommand extends RPCCommand {
  static method () {
    return 'Runtime.awaitPromise';
  }
  static populateRequestParams (promiseObjectId, returnByValue, generatePreview) {
    if (!isString(promiseObjectId)) {
      throw new TypeError('promiseObjectId must be a string');
    }
    var params = {promiseObjectId: promiseObjectId};
    if (isBoolean(returnByValue)) {
      params.returnByValue = returnByValue;
    }
    if (isBoolean(generatePreview)) {
      params.generatePreview = generatePreview;
    }
    return params;
  }
  constructor (messageId, promiseObjectId, returnByValue, generatePreview) {
    super(messageId, AwaitPromiseCommand.method());
    super.setRequestParams(AwaitPromiseCommand.populateRequestParams(
      promiseObjectId, returnByValue, generatePreview));
  }
}

module.exports = AwaitPromiseCommand;
