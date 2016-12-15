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

const AllBreakpointsActiveState = require('./AllBreakpointsActiveState');
const AsyncCallStackDepthState = require('./AsyncCallStackDepthState');
const BlackboxedRangesQueue = require('./BlackboxedRangesQueue');
const BlackboxPatternQueue = require('./BlackboxPatternQueue');
const BreakpointQueue = require('./BreakpointQueue');
const ContinueToLocationQueue = require('./ContinueToLocationQueue');
const DebuggerExecutionQueue = require('./DebuggerExecutionQueue');
const DebuggerStepOutQueue = require('./DebuggerStepOutQueue');
const EvaluateOnCallFrameQueue = require('./EvaluateOnCallFrameQueue');
const PauseOnExceptionState = require('./PauseOnExceptionState');
const ScriptSourceGetsQueue = require('./ScriptSourceGetsQueue');
const ScriptSourceSetsQueue = require('./ScriptSourceSetsQueue');
const SearchInContentQueue = require('./SearchInContentQueue');
const SkipAllPausesState = require('./SkipAllPausesState');
const StepIntoQueue = require('./StepIntoQueue');
const StepOverQueue = require('./StepOverQueue');
const VariableSetQueue = require('./VariableSetQueue');
const EnableQueue = require('./EnableQueue');
const ScriptParsedCache = require('./event-caches/ScriptParsed');

const interfaceSingleton = {
  activeBreakpoints: new AllBreakpointsActiveState(),
  asyncCallStackDepth: new AsyncCallStackDepthState(),
  blackboxedRanges: new BlackboxedRangesQueue(),
  blackboxPatterns: new BlackboxPatternQueue(),
  locationContinue: new ContinueToLocationQueue(),
  debuggerExecution: new DebuggerExecutionQueue(),
  stepOut: new DebuggerStepOutQueue(),
  evaluate: new EvaluateOnCallFrameQueue(),
  pauseOnException: new PauseOnExceptionState(),
  getScriptSource: new ScriptSourceGetsQueue(),
  setScriptSource: new ScriptSourceSetsQueue(),
  skipAllPauses: new SkipAllPausesState(),
  stepInto: new StepIntoQueue(),
  stepOver: new StepOverQueue(),
  setVariable: new VariableSetQueue(),
  enableQueue: new EnableQueue(),
  breakpointQueue: new BreakpointQueue(),
  scriptParsedCache: new ScriptParsedCache()
};

class DebuggerMessageInterface {
  static activeBreakpoints () {
    return interfaceSingleton.activeBreakpoints;
  }
  static asyncCallStackDepth () {
    return interfaceSingleton.asyncCallStackDepth;
  }
  static blackboxedRanges () {
    return interfaceSingleton.blackboxedRanges;
  }
  static blackboxPatterns () {
    return interfaceSingleton.blackboxPatterns;
  }
  static continue () {
    return interfaceSingleton.locationContinue;
  }
  static enableQueue () {
    return interfaceSingleton.enableQueue;
  }
  static execution () {
    return interfaceSingleton.debuggerExecution;
  }
  static stepOut () {
    return interfaceSingleton.stepOut;
  }
  static stepInto () {
    return interfaceSingleton.stepInto;
  }
  static stepOver () {
    return interfaceSingleton.stepOver;
  }
  static evaluate () {
    return interfaceSingleton.evaluate;
  }
  static pauseOnException () {
    return interfaceSingleton.pauseOnException;
  }
  static getScriptSource () {
    return interfaceSingleton.getScriptSource;
  }
  static setScriptSource () {
    return interfaceSingleton.setScriptSource;
  }
  static skipAllPauses () {
    return interfaceSingleton.skipAllPauses;
  }
  static setVariable () {
    return interfaceSingleton.setVariable;
  }
  static breakpoint () {
    return interfaceSingleton.breakpointQueue;
  }
  static parsedScriptCache () {
    return interfaceSingleton.scriptParsedCache;
  }
  static routeScriptParsedEvent (msg) {
    return DebuggerMessageInterface.parsedScriptCache().addEntry(msg);
  }
  static routeBreakpointUpdate (msg) {
    return DebuggerMessageInterface.breakpoint()
      .searchForMatchingBreakpoint(msg);
  }
  static commandMethodIntercepts () {
    return {
      [ScriptParsedCache.eventNames().parsed]: DebuggerMessageInterface.routeScriptParsedEvent,
      [ScriptParsedCache.eventNames().failedToParse]: DebuggerMessageInterface.routeScriptParsedEvent,
      [BreakpointQueue.eventNames().paused]: DebuggerMessageInterface.routeBreakpointUpdate
    }
  }
}

module.exports = DebuggerMessageInterface;
