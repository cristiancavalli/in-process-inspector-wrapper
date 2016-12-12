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
const isNumber = require('lodash.isnumber');
const isBoolean = require('lodash.isboolean');
const isNull = require('lodash.isnull');
const omitBy = require('lodash.omitby');

class ExpressionBuilder {
  
  constructor (expression) {
    if (!isString(expression)) {
      throw new TypeError('expression must be a string');
    }

    this.expression = expression;
    this.objectGroup = null;
    this.includeCommandLineAPI = null;
    this.silent = null;
    this.contextId = null;
    this.returnByValue = null;
    this.generatePreview = null;
    this.userGesture = null;
    this.awaitPromise = null;
  }

  setObjectGroup (objGrp) {
    if (!isString(objGrp)) {
      throw new TypeError('objectGroup must be a string');
    }
    this.objectGroup = objGrp;
    return this;
  }
  
  setIncludeCommandLineAPI (shouldInclude) {
    if (!isBoolean(shouldInclude)) {
      throw new TypeError('includeCommandLineAPI must be a boolean');
    }
    this.includeCommandLineAPI = shouldInclude;
    return this;
  }

  setSilent (isSilent) {
    if (!isBoolean(isSilent)) {
      throw new TypeError('silent must be a boolean');
    }
    this.silent = isSilent;
    return this;
  }

  setContextId (contextId) {
    if (!isNumber(contextId)) {
      throw new TypeError('contextId must be a number');
    }
    this.contextId = contextId;
    return this;
  }

  setReturnByValue (byValue) {
    if (!isBoolean(byValue)) {
      throw new TypeError('returnByValue must be a boolean');
    }
    this.returnByValue = byValue;
    return this;
  }

  setGeneratePreview (shouldGenerate) {
    if (!isBoolean(shouldGenerate)) {
      throw new TypeError('generatePreview must be a boolean');
    }
    this.generatePreview = shouldGenerate;
    return this;
  }

  setUserGesture (isGesture) {
    if (!isBoolean(isGesture)) {
      throw new TypeError('userGesture must be a boolean');
    }
    this.userGesture = isGesture;
    return this;
  }

  setAwaitPromise (shouldAwait) {
    if (!isBoolean(shouldAwait)) {
      throw new TypeError('awaitPromise must be a boolean');
    }
    this.awaitPromise = shouldAwait;
    return this;
  }

  payload () {
    return omitBy(this, isNull);
  }
}

class EvaluateCommand extends RPCCommand {
  static method () {
    return 'Runtime.evaluate';
  }
  static newExpression (expression) {
    return new ExpressionBuilder(expression);
  }

  constructor (messageId, expression) {
    super(messageId, EvaluateCommand.method());

    if (!(expression instanceof ExpressionBuilder)) {
      throw new TypeError(
        'Expression must be an instance of the ExpressionBuilder');
    }
    super.setRequestParams(expression.payload());
  }
}

module.exports = EvaluateCommand;
