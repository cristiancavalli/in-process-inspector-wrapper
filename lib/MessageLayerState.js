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

const EnableState = require('./MessageLayerState/EnableState');
const PauseOnExceptionState = require('./MessageLayerState/PauseOnExceptionState');
const ProfilerSamplingIntervalState = require('./MessageLayerState/ProfilerSamplingIntervalState');
const BlackboxPatternState = require('./MessageLayerState/BlackboxPatternState');
const RunIfWaitingForDebuggerState = require('./MessageLayerState/RunIfWaitingForDebuggerState');
const ExecutionContextState = require('./MessageLayerState/ExecutionContextState');
const RuntimeExceptionState = require('./MessageLayerState/RuntimeExceptionState');
const RuntimeConsoleState = require('./MessageLayerState/RuntimeConsoleState');
const DebuggerAllBreakpointsActiveState = require('./MessageLayerState/DebuggerAllBreakpointsActiveState');
const DebuggerSkipAllPausesState = require('./MessageLayerState/DebuggerSkipAllPausesState');
const DebuggerBreakpointState = require('./MessageLayerState/DebuggerBreakpointState');
const DebuggerContinueToLocationState = require('./MessageLayerState/DebuggerContinueToLocationState');
const DebuggerStepOverState = require('./MessageLayerState/DebuggerStepOverState');
const DebuggerStepIntoState = require('./MessageLayerState/DebuggerStepIntoState');
const DebuggerStepOutState = require('./MessageLayerState/DebuggerStepOutState');
const DebuggerExecutionState = require('./MessageLayerState/DebuggerExecutionState');
const DebuggerSearchInContentState = require('./MessageLayerState/DebuggerSearchInContentState');
const DebuggerScriptSourceSetsState = require('./MessageLayerState/DebuggerScriptSourceSetsState');
const DebuggerScriptSourceGetsState = require('./MessageLayerState/DebuggerScriptSourceGetsState');
const DebuggerFrameRestartsState = require('./MessageLayerState/DebuggerFrameRestartsState');
const DebuggerBlackboxPatterns = require('./MessageLayerState/DebuggerBlackboxPatterns');
const DebuggerBlackboxedRanges = require('./MessageLayerState/DebuggerBlackboxedRanges');

class MessageLayerState {
  constructor () {

    this.log = {
      enable_state: new EnableState()
    };
    this.runtime = {
      enable_state: new EnableState(),
      wait_for_debugger_state: new RunIfWaitingForDebuggerState(),
      execution_context_state: new ExecutionContextState(),
      exception_state: new RuntimeExceptionState(),
      console_state: new RuntimeConsoleState()
    };
    this.debugger = {
      enable_state: new EnableState(),
      pause_on_exception_state: new PauseOnExceptionState(),
      async_call_stack_depth_state: new AsyncCallStackDepthState(),
      breakpoints_active: new DebuggerAllBreakpointsActiveState(),
      skip_all_pauses: new DebuggerSkipAllPausesState(),
      breakpoints: new DebuggerBreakpointState(),
      continue_to_location: new DebuggerContinueToLocationState(),
      step_over: new DebuggerStepOverState(),
      step_into: new DebuggerStepIntoState(),
      step_out: new DebuggerStepOutState(),
      execution_state: new DebuggerExecutionState(),
      content_searches: new DebuggerSearchInContentState(),
      script_sources_sets: new DebuggerScriptSourceSetsState(),
      script_sources_gets: new DebuggerScriptSourceGetsState(),
      frame_restarts: new DebuggerFrameRestartsState(),
      frame_evaluations: new DebuggerEvaluateOnCallFrameState(),
      variable_settings: new DebuggerVariableSettingsState(),
      blackbox_patterns: new DebuggerBlackboxPatterns(),
      blackboxed_ranges: new DebuggerBlackboxedRanges()
    };
    this.profiler = {
      enable_state: new EnableState(),
      sampling_interval: new ProfilerSamplingIntervalState(),
      blackbox_patterns: new BlackboxPatternState()
    }
  }
}

module.exports = new MessageLayerState();
