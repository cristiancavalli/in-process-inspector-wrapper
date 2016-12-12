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
const omitBy = require('lodash.omitby');
const isNull = require('lodash.isnull');

class FunctionCallBuilder {
  constructor (objectId, functionDeclaration) {

    if (!isString(objectId)) {
      throw new TypeError('objectId must be a string');
    } else if (!isString(functionDeclaration)) {
      throw new TypeError('functionDeclaration must be a string');
    }

    this.objectId = objectId;
    this.functionDeclaration = functionDeclaration;
    this.arguments = null;
    this.silent = null;
    this.returnByValue = null;
    this.generatePreview = null;
    this.userGesture = null;
    this.awaitPromise = null;
  }
  setArguments (args) {
    if (!Array.isArray(args)) {
      throw new TypeError('arguments must be an array');
    }
    this.arguments = args;
    return this;
  }
  setSilent (silent) {
    if (!isBoolean(silent)) {
      throw new TypeError('silent must be a boolean');
    }
    this.silent = silent;
    return this;
  }
  setReturnByValue (returnByValue) {
    if (!isBoolean(returnByValue)) {
      throw new TypeError('returnByValue must be a boolean');
    }
    this.returnByValue = returnByValue;
    return this;
  }
  setGeneratePreview (generatePreview) {
    if (!isBoolean(generatePreview)) {
      throw new TypeError('generatePreview must be a boolean');
    }
    this.generatePreview = generatePreview;
    return this;
  }
  setUserGesture (userGesture) {
    if (!isBoolean(userGesture)) {
      throw new TypeError('userGesture must be a boolean');
    }
    this.userGesture = userGesture;
    return this;
  }
  setAwaitPromise (awaitPromise) {
    if (!isBoolean(awaitPromise)) {
      throw new TypeError('awaitPromise must be a boolean');
    }
    this.awaitPromise = awaitPromise;
    return this;
  }
  payload () {
    return omitBy(this, isNull);
  }
}

class CallFunctionOnCommand extends RPCCommand {
  static method () {
    return 'Debugger.callFunctionOn';
  }
  static newFunctionCallBuilder (objectId, functionDeclaration) {
    return new FunctionCallBuilder(objectId, functionDeclaration);
  }

  constructor (messageId, functionCallBuilder) {
    super(messageId, CallFunctionOnCommand.method());

    if (!(functionCallBuilder instanceof FunctionCallBuilder)) {
      throw new TypeError('function call information must be given as an '+
        'instance of FunctionCallBuilder');
    }
    super.setRequestParams(functionCallBuilder.payload());
  }
}

module.exports = CallFunctionOnCommand;
