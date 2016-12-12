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

const AwaitPromimseQueue = require('./AwaitPromiseQueue');
const CallFunctionOnQueue = require('./CallFunctionOnQueue');
const CompileScriptQueue = require('./CompileScriptQueue');
const GetPropertiesQueue = require('./GetPropertiesQueue');
const ReleaseObjectQueue = require('./ReleaseObjectQueue');
const RunIfWaitingForDebuggerQueue = require('./RunIfWaitingForDebuggerQueue');
const RunScriptQueue = require('./RunScriptQueue');
const SetCustomObjectFormatterEnabledQueue = require('./SetCustomObjectFormatterEnabledQueue');
const EnableQueue = require('./EnableQueue');

const interfaceSingleton = {
  promise: new AwaitPromimseQueue(),
  functionCall: new CallFunctionOnQueue(),
  compileScript: new CompileScriptQueue(),
  runScript: new RunScriptQueue(),
  getProperties: new GetPropertiesQueue(),
  releaseObject: new ReleaseObjectQueue(),
  waitingForDebuggerQueue: new RunIfWaitingForDebuggerQueue(),
  customObjectFormatter: new SetCustomObjectFormatterEnabledQueue(),
  enableQueue: new EnableQueue()
};

class RuntimeMessageInterface {
  static promise () {
    return interfaceSingleton.promise;
  }
  static functionCall() {
    return interfaceSingleton.functionCall;
  }
  static compileScript () {
    return interfaceSingleton.compileScript;
  }
  static runScript () {
    return interfaceSingleton.runScript;
  }
  static getProperties () {
    return interfaceSingleton.getProperties;
  }
  static releaseObject () {
    return interfaceSingleton.releaseObject;
  }
  static waitingForDebuggerQueue () {
    return interfaceSingleton.waitingForDebuggerQueue;
  }
  static customObjectFormatter () {
    return interfaceSingleton.customObjectFormatter;
  }
  static enableQueue () {
    return interfaceSingleton.enableQueue;
  }
  static commandMethodIntercepts () {
    return {};
  }
}

module.exports = RuntimeMessageInterface;
