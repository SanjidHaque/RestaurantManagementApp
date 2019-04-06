(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/zone.js/dist/zone.js":
/*!*******************************************!*\
  !*** ./node_modules/zone.js/dist/zone.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
(function (global, factory) {
	 true ? factory() :
	undefined;
}(this, (function () { 'use strict';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var Zone$1 = (function (global) {
    var FUNCTION = 'function';
    var performance = global['performance'];
    function mark(name) {
        performance && performance['mark'] && performance['mark'](name);
    }
    function performanceMeasure(name, label) {
        performance && performance['measure'] && performance['measure'](name, label);
    }
    mark('Zone');
    if (global['Zone']) {
        throw new Error('Zone already loaded.');
    }
    var Zone = (function () {
        function Zone(parent, zoneSpec) {
            this._properties = null;
            this._parent = parent;
            this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
            this._properties = zoneSpec && zoneSpec.properties || {};
            this._zoneDelegate =
                new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
        }
        Zone.assertZonePatched = function () {
            if (global['Promise'] !== patches['ZoneAwarePromise']) {
                throw new Error('Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' +
                    'has been overwritten.\n' +
                    'Most likely cause is that a Promise polyfill has been loaded ' +
                    'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' +
                    'If you must load one, do so before loading zone.js.)');
            }
        };
        Object.defineProperty(Zone, "root", {
            get: function () {
                var zone = Zone.current;
                while (zone.parent) {
                    zone = zone.parent;
                }
                return zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "current", {
            get: function () {
                return _currentZoneFrame.zone;
            },
            enumerable: true,
            configurable: true
        });
        
        Object.defineProperty(Zone, "currentTask", {
            get: function () {
                return _currentTask;
            },
            enumerable: true,
            configurable: true
        });
        
        Zone.__load_patch = function (name, fn) {
            if (patches.hasOwnProperty(name)) {
                throw Error('Already loaded patch: ' + name);
            }
            else if (!global['__Zone_disable_' + name]) {
                var perfName = 'Zone:' + name;
                mark(perfName);
                patches[name] = fn(global, Zone, _api);
                performanceMeasure(perfName, perfName);
            }
        };
        Object.defineProperty(Zone.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        
        Object.defineProperty(Zone.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        
        Zone.prototype.get = function (key) {
            var zone = this.getZoneWith(key);
            if (zone)
                return zone._properties[key];
        };
        Zone.prototype.getZoneWith = function (key) {
            var current = this;
            while (current) {
                if (current._properties.hasOwnProperty(key)) {
                    return current;
                }
                current = current._parent;
            }
            return null;
        };
        Zone.prototype.fork = function (zoneSpec) {
            if (!zoneSpec)
                throw new Error('ZoneSpec required!');
            return this._zoneDelegate.fork(this, zoneSpec);
        };
        Zone.prototype.wrap = function (callback, source) {
            if (typeof callback !== FUNCTION) {
                throw new Error('Expecting function got: ' + callback);
            }
            var _callback = this._zoneDelegate.intercept(this, callback, source);
            var zone = this;
            return function () {
                return zone.runGuarded(_callback, this, arguments, source);
            };
        };
        Zone.prototype.run = function (callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) { applyThis = undefined; }
            if (applyArgs === void 0) { applyArgs = null; }
            if (source === void 0) { source = null; }
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runGuarded = function (callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) { applyThis = null; }
            if (applyArgs === void 0) { applyArgs = null; }
            if (source === void 0) { source = null; }
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                try {
                    return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runTask = function (task, applyThis, applyArgs) {
            if (task.zone != this) {
                throw new Error('A task can only be run in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            }
            // https://github.com/angular/zone.js/issues/778, sometimes eventTask
            // will run in notScheduled(canceled) state, we should not try to
            // run such kind of task but just return
            // we have to define an variable here, if not
            // typescript compiler will complain below
            var isNotScheduled = task.state === notScheduled;
            if (isNotScheduled && task.type === eventTask) {
                return;
            }
            var reEntryGuard = task.state != running;
            reEntryGuard && task._transitionTo(running, scheduled);
            task.runCount++;
            var previousTask = _currentTask;
            _currentTask = task;
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                if (task.type == macroTask && task.data && !task.data.isPeriodic) {
                    task.cancelFn = null;
                }
                try {
                    return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                // if the task's state is notScheduled or unknown, then it has already been cancelled
                // we should not reset the state to scheduled
                if (task.state !== notScheduled && task.state !== unknown) {
                    if (task.type == eventTask || (task.data && task.data.isPeriodic)) {
                        reEntryGuard && task._transitionTo(scheduled, running);
                    }
                    else {
                        task.runCount = 0;
                        this._updateTaskCount(task, -1);
                        reEntryGuard &&
                            task._transitionTo(notScheduled, running, notScheduled);
                    }
                }
                _currentZoneFrame = _currentZoneFrame.parent;
                _currentTask = previousTask;
            }
        };
        Zone.prototype.scheduleTask = function (task) {
            if (task.zone && task.zone !== this) {
                // check if the task was rescheduled, the newZone
                // should not be the children of the original zone
                var newZone = this;
                while (newZone) {
                    if (newZone === task.zone) {
                        throw Error("can not reschedule task to " + this
                            .name + " which is descendants of the original zone " + task.zone.name);
                    }
                    newZone = newZone.parent;
                }
            }
            task._transitionTo(scheduling, notScheduled);
            var zoneDelegates = [];
            task._zoneDelegates = zoneDelegates;
            task._zone = this;
            try {
                task = this._zoneDelegate.scheduleTask(this, task);
            }
            catch (err) {
                // should set task's state to unknown when scheduleTask throw error
                // because the err may from reschedule, so the fromState maybe notScheduled
                task._transitionTo(unknown, scheduling, notScheduled);
                // TODO: @JiaLiPassion, should we check the result from handleError?
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            if (task._zoneDelegates === zoneDelegates) {
                // we have to check because internally the delegate can reschedule the task.
                this._updateTaskCount(task, 1);
            }
            if (task.state == scheduling) {
                task._transitionTo(scheduled, scheduling);
            }
            return task;
        };
        Zone.prototype.scheduleMicroTask = function (source, callback, data, customSchedule) {
            return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, null));
        };
        Zone.prototype.scheduleMacroTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.scheduleEventTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.cancelTask = function (task) {
            if (task.zone != this)
                throw new Error('A task can only be cancelled in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            task._transitionTo(canceling, scheduled, running);
            try {
                this._zoneDelegate.cancelTask(this, task);
            }
            catch (err) {
                // if error occurs when cancelTask, transit the state to unknown
                task._transitionTo(unknown, canceling);
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            this._updateTaskCount(task, -1);
            task._transitionTo(notScheduled, canceling);
            task.runCount = 0;
            return task;
        };
        Zone.prototype._updateTaskCount = function (task, count) {
            var zoneDelegates = task._zoneDelegates;
            if (count == -1) {
                task._zoneDelegates = null;
            }
            for (var i = 0; i < zoneDelegates.length; i++) {
                zoneDelegates[i]._updateTaskCount(task.type, count);
            }
        };
        return Zone;
    }());
    Zone.__symbol__ = __symbol__;
    var DELEGATE_ZS = {
        name: '',
        onHasTask: function (delegate, _, target, hasTaskState) {
            return delegate.hasTask(target, hasTaskState);
        },
        onScheduleTask: function (delegate, _, target, task) {
            return delegate.scheduleTask(target, task);
        },
        onInvokeTask: function (delegate, _, target, task, applyThis, applyArgs) { return delegate.invokeTask(target, task, applyThis, applyArgs); },
        onCancelTask: function (delegate, _, target, task) {
            return delegate.cancelTask(target, task);
        }
    };
    var ZoneDelegate = (function () {
        function ZoneDelegate(zone, parentDelegate, zoneSpec) {
            this._taskCounts = { 'microTask': 0, 'macroTask': 0, 'eventTask': 0 };
            this.zone = zone;
            this._parentDelegate = parentDelegate;
            this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
            this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
            this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate.zone);
            this._interceptZS =
                zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
            this._interceptDlgt =
                zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
            this._interceptCurrZone =
                zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate.zone);
            this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
            this._invokeDlgt =
                zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
            this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate.zone);
            this._handleErrorZS =
                zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
            this._handleErrorDlgt =
                zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
            this._handleErrorCurrZone =
                zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate.zone);
            this._scheduleTaskZS =
                zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
            this._scheduleTaskDlgt =
                zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
            this._scheduleTaskCurrZone =
                zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate.zone);
            this._invokeTaskZS =
                zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
            this._invokeTaskDlgt =
                zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
            this._invokeTaskCurrZone =
                zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate.zone);
            this._cancelTaskZS =
                zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
            this._cancelTaskDlgt =
                zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
            this._cancelTaskCurrZone =
                zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate.zone);
            this._hasTaskZS = null;
            this._hasTaskDlgt = null;
            this._hasTaskDlgtOwner = null;
            this._hasTaskCurrZone = null;
            var zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
            var parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
            if (zoneSpecHasTask || parentHasTask) {
                // If we need to report hasTask, than this ZS needs to do ref counting on tasks. In such
                // a case all task related interceptors must go through this ZD. We can't short circuit it.
                this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
                this._hasTaskDlgt = parentDelegate;
                this._hasTaskDlgtOwner = this;
                this._hasTaskCurrZone = zone;
                if (!zoneSpec.onScheduleTask) {
                    this._scheduleTaskZS = DELEGATE_ZS;
                    this._scheduleTaskDlgt = parentDelegate;
                    this._scheduleTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onInvokeTask) {
                    this._invokeTaskZS = DELEGATE_ZS;
                    this._invokeTaskDlgt = parentDelegate;
                    this._invokeTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onCancelTask) {
                    this._cancelTaskZS = DELEGATE_ZS;
                    this._cancelTaskDlgt = parentDelegate;
                    this._cancelTaskCurrZone = this.zone;
                }
            }
        }
        ZoneDelegate.prototype.fork = function (targetZone, zoneSpec) {
            return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) :
                new Zone(targetZone, zoneSpec);
        };
        ZoneDelegate.prototype.intercept = function (targetZone, callback, source) {
            return this._interceptZS ?
                this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) :
                callback;
        };
        ZoneDelegate.prototype.invoke = function (targetZone, callback, applyThis, applyArgs, source) {
            return this._invokeZS ?
                this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) :
                callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.handleError = function (targetZone, error) {
            return this._handleErrorZS ?
                this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) :
                true;
        };
        ZoneDelegate.prototype.scheduleTask = function (targetZone, task) {
            var returnTask = task;
            if (this._scheduleTaskZS) {
                if (this._hasTaskZS) {
                    returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
                }
                returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
                if (!returnTask)
                    returnTask = task;
            }
            else {
                if (task.scheduleFn) {
                    task.scheduleFn(task);
                }
                else if (task.type == microTask) {
                    scheduleMicroTask(task);
                }
                else {
                    throw new Error('Task is missing scheduleFn.');
                }
            }
            return returnTask;
        };
        ZoneDelegate.prototype.invokeTask = function (targetZone, task, applyThis, applyArgs) {
            return this._invokeTaskZS ?
                this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) :
                task.callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.cancelTask = function (targetZone, task) {
            var value;
            if (this._cancelTaskZS) {
                value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
            }
            else {
                if (!task.cancelFn) {
                    throw Error('Task is not cancelable');
                }
                value = task.cancelFn(task);
            }
            return value;
        };
        ZoneDelegate.prototype.hasTask = function (targetZone, isEmpty) {
            // hasTask should not throw error so other ZoneDelegate
            // can still trigger hasTask callback
            try {
                return this._hasTaskZS &&
                    this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
            }
            catch (err) {
                this.handleError(targetZone, err);
            }
        };
        ZoneDelegate.prototype._updateTaskCount = function (type, count) {
            var counts = this._taskCounts;
            var prev = counts[type];
            var next = counts[type] = prev + count;
            if (next < 0) {
                throw new Error('More tasks executed then were scheduled.');
            }
            if (prev == 0 || next == 0) {
                var isEmpty = {
                    microTask: counts['microTask'] > 0,
                    macroTask: counts['macroTask'] > 0,
                    eventTask: counts['eventTask'] > 0,
                    change: type
                };
                this.hasTask(this.zone, isEmpty);
            }
        };
        return ZoneDelegate;
    }());
    var ZoneTask = (function () {
        function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
            this._zone = null;
            this.runCount = 0;
            this._zoneDelegates = null;
            this._state = 'notScheduled';
            this.type = type;
            this.source = source;
            this.data = options;
            this.scheduleFn = scheduleFn;
            this.cancelFn = cancelFn;
            this.callback = callback;
            var self = this;
            if (type === eventTask && options && options.isUsingGlobalCallback) {
                this.invoke = ZoneTask.invokeTask;
            }
            else {
                this.invoke = function () {
                    return ZoneTask.invokeTask.apply(global, [self, this, arguments]);
                };
            }
        }
        ZoneTask.invokeTask = function (task, target, args) {
            if (!task) {
                task = this;
            }
            _numberOfNestedTaskFrames++;
            try {
                task.runCount++;
                return task.zone.runTask(task, target, args);
            }
            finally {
                if (_numberOfNestedTaskFrames == 1) {
                    drainMicroTaskQueue();
                }
                _numberOfNestedTaskFrames--;
            }
        };
        Object.defineProperty(ZoneTask.prototype, "zone", {
            get: function () {
                return this._zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ZoneTask.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        ZoneTask.prototype.cancelScheduleRequest = function () {
            this._transitionTo(notScheduled, scheduling);
        };
        ZoneTask.prototype._transitionTo = function (toState, fromState1, fromState2) {
            if (this._state === fromState1 || this._state === fromState2) {
                this._state = toState;
                if (toState == notScheduled) {
                    this._zoneDelegates = null;
                }
            }
            else {
                throw new Error(this.type + " '" + this.source + "': can not transition to '" + toState + "', expecting state '" + fromState1 + "'" + (fromState2 ?
                    ' or \'' + fromState2 + '\'' :
                    '') + ", was '" + this._state + "'.");
            }
        };
        ZoneTask.prototype.toString = function () {
            if (this.data && typeof this.data.handleId !== 'undefined') {
                return this.data.handleId;
            }
            else {
                return Object.prototype.toString.call(this);
            }
        };
        // add toJSON method to prevent cyclic error when
        // call JSON.stringify(zoneTask)
        ZoneTask.prototype.toJSON = function () {
            return {
                type: this.type,
                state: this.state,
                source: this.source,
                zone: this.zone.name,
                invoke: this.invoke,
                scheduleFn: this.scheduleFn,
                cancelFn: this.cancelFn,
                runCount: this.runCount,
                callback: this.callback
            };
        };
        return ZoneTask;
    }());
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  MICROTASK QUEUE
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var symbolSetTimeout = __symbol__('setTimeout');
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var _microTaskQueue = [];
    var _isDrainingMicrotaskQueue = false;
    var nativeMicroTaskQueuePromise;
    function scheduleMicroTask(task) {
        // if we are not running in any task, and there has not been anything scheduled
        // we must bootstrap the initial task creation by manually scheduling the drain
        if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
            // We are not running in Task, so we need to kickstart the microtask queue.
            if (!nativeMicroTaskQueuePromise) {
                if (global[symbolPromise]) {
                    nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
                }
            }
            if (nativeMicroTaskQueuePromise) {
                nativeMicroTaskQueuePromise[symbolThen](drainMicroTaskQueue);
            }
            else {
                global[symbolSetTimeout](drainMicroTaskQueue, 0);
            }
        }
        task && _microTaskQueue.push(task);
    }
    function drainMicroTaskQueue() {
        if (!_isDrainingMicrotaskQueue) {
            _isDrainingMicrotaskQueue = true;
            while (_microTaskQueue.length) {
                var queue = _microTaskQueue;
                _microTaskQueue = [];
                for (var i = 0; i < queue.length; i++) {
                    var task = queue[i];
                    try {
                        task.zone.runTask(task, null, null);
                    }
                    catch (error) {
                        _api.onUnhandledError(error);
                    }
                }
            }
            var showError = !Zone[__symbol__('ignoreConsoleErrorUncaughtError')];
            _api.microtaskDrainDone();
            _isDrainingMicrotaskQueue = false;
        }
    }
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  BOOTSTRAP
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var NO_ZONE = { name: 'NO ZONE' };
    var notScheduled = 'notScheduled', scheduling = 'scheduling', scheduled = 'scheduled', running = 'running', canceling = 'canceling', unknown = 'unknown';
    var microTask = 'microTask', macroTask = 'macroTask', eventTask = 'eventTask';
    var patches = {};
    var _api = {
        symbol: __symbol__,
        currentZoneFrame: function () { return _currentZoneFrame; },
        onUnhandledError: noop,
        microtaskDrainDone: noop,
        scheduleMicroTask: scheduleMicroTask,
        showUncaughtError: function () { return !Zone[__symbol__('ignoreConsoleErrorUncaughtError')]; },
        patchEventTarget: function () { return []; },
        patchOnProperties: noop,
        patchMethod: function () { return noop; },
        setNativePromise: function (NativePromise) {
            nativeMicroTaskQueuePromise = NativePromise.resolve(0);
        },
    };
    var _currentZoneFrame = { parent: null, zone: new Zone(null, null) };
    var _currentTask = null;
    var _numberOfNestedTaskFrames = 0;
    function noop() { }
    function __symbol__(name) {
        return '__zone_symbol__' + name;
    }
    performanceMeasure('Zone', 'Zone');
    return global['Zone'] = Zone;
})(typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global);

var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('ZoneAwarePromise', function (global, Zone, api) {
    var __symbol__ = api.symbol;
    var _uncaughtPromiseErrors = [];
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    api.onUnhandledError = function (e) {
        if (api.showUncaughtError()) {
            var rejection = e && e.rejection;
            if (rejection) {
                console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
            }
            else {
                console.error(e);
            }
        }
    };
    api.microtaskDrainDone = function () {
        while (_uncaughtPromiseErrors.length) {
            var _loop_1 = function () {
                var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
                try {
                    uncaughtPromiseError.zone.runGuarded(function () {
                        throw uncaughtPromiseError;
                    });
                }
                catch (error) {
                    handleUnhandledRejection(error);
                }
            };
            while (_uncaughtPromiseErrors.length) {
                _loop_1();
            }
        }
    };
    var UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__('unhandledPromiseRejectionHandler');
    function handleUnhandledRejection(e) {
        api.onUnhandledError(e);
        try {
            var handler = Zone[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
            if (handler && typeof handler === 'function') {
                handler.apply(this, [e]);
            }
        }
        catch (err) {
        }
    }
    function isThenable(value) {
        return value && value.then;
    }
    function forwardResolution(value) {
        return value;
    }
    function forwardRejection(rejection) {
        return ZoneAwarePromise.reject(rejection);
    }
    var symbolState = __symbol__('state');
    var symbolValue = __symbol__('value');
    var source = 'Promise.then';
    var UNRESOLVED = null;
    var RESOLVED = true;
    var REJECTED = false;
    var REJECTED_NO_CATCH = 0;
    function makeResolver(promise, state) {
        return function (v) {
            try {
                resolvePromise(promise, state, v);
            }
            catch (err) {
                resolvePromise(promise, false, err);
            }
            // Do not return value or you will break the Promise spec.
        };
    }
    var once = function () {
        var wasCalled = false;
        return function wrapper(wrappedFunction) {
            return function () {
                if (wasCalled) {
                    return;
                }
                wasCalled = true;
                wrappedFunction.apply(null, arguments);
            };
        };
    };
    var TYPE_ERROR = 'Promise resolved with itself';
    var OBJECT = 'object';
    var FUNCTION = 'function';
    var CURRENT_TASK_SYMBOL = __symbol__('currentTask');
    // Promise Resolution
    function resolvePromise(promise, state, value) {
        var onceWrapper = once();
        if (promise === value) {
            throw new TypeError(TYPE_ERROR);
        }
        if (promise[symbolState] === UNRESOLVED) {
            // should only get value.then once based on promise spec.
            var then = null;
            try {
                if (typeof value === OBJECT || typeof value === FUNCTION) {
                    then = value && value.then;
                }
            }
            catch (err) {
                onceWrapper(function () {
                    resolvePromise(promise, false, err);
                })();
                return promise;
            }
            // if (value instanceof ZoneAwarePromise) {
            if (state !== REJECTED && value instanceof ZoneAwarePromise &&
                value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) &&
                value[symbolState] !== UNRESOLVED) {
                clearRejectedNoCatch(value);
                resolvePromise(promise, value[symbolState], value[symbolValue]);
            }
            else if (state !== REJECTED && typeof then === FUNCTION) {
                try {
                    then.apply(value, [
                        onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false))
                    ]);
                }
                catch (err) {
                    onceWrapper(function () {
                        resolvePromise(promise, false, err);
                    })();
                }
            }
            else {
                promise[symbolState] = state;
                var queue = promise[symbolValue];
                promise[symbolValue] = value;
                // record task information in value when error occurs, so we can
                // do some additional work such as render longStackTrace
                if (state === REJECTED && value instanceof Error) {
                    value[CURRENT_TASK_SYMBOL] = Zone.currentTask;
                }
                for (var i = 0; i < queue.length;) {
                    scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
                }
                if (queue.length == 0 && state == REJECTED) {
                    promise[symbolState] = REJECTED_NO_CATCH;
                    try {
                        throw new Error('Uncaught (in promise): ' + value +
                            (value && value.stack ? '\n' + value.stack : ''));
                    }
                    catch (err) {
                        var error_1 = err;
                        error_1.rejection = value;
                        error_1.promise = promise;
                        error_1.zone = Zone.current;
                        error_1.task = Zone.currentTask;
                        _uncaughtPromiseErrors.push(error_1);
                        api.scheduleMicroTask(); // to make sure that it is running
                    }
                }
            }
        }
        // Resolving an already resolved promise is a noop.
        return promise;
    }
    var REJECTION_HANDLED_HANDLER = __symbol__('rejectionHandledHandler');
    function clearRejectedNoCatch(promise) {
        if (promise[symbolState] === REJECTED_NO_CATCH) {
            // if the promise is rejected no catch status
            // and queue.length > 0, means there is a error handler
            // here to handle the rejected promise, we should trigger
            // windows.rejectionhandled eventHandler or nodejs rejectionHandled
            // eventHandler
            try {
                var handler = Zone[REJECTION_HANDLED_HANDLER];
                if (handler && typeof handler === FUNCTION) {
                    handler.apply(this, [{ rejection: promise[symbolValue], promise: promise }]);
                }
            }
            catch (err) {
            }
            promise[symbolState] = REJECTED;
            for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
                if (promise === _uncaughtPromiseErrors[i].promise) {
                    _uncaughtPromiseErrors.splice(i, 1);
                }
            }
        }
    }
    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
        clearRejectedNoCatch(promise);
        var delegate = promise[symbolState] ?
            (typeof onFulfilled === FUNCTION) ? onFulfilled : forwardResolution :
            (typeof onRejected === FUNCTION) ? onRejected : forwardRejection;
        zone.scheduleMicroTask(source, function () {
            try {
                resolvePromise(chainPromise, true, zone.run(delegate, undefined, [promise[symbolValue]]));
            }
            catch (error) {
                resolvePromise(chainPromise, false, error);
            }
        });
    }
    var ZONE_AWARE_PROMISE_TO_STRING = 'function ZoneAwarePromise() { [native code] }';
    var ZoneAwarePromise = (function () {
        function ZoneAwarePromise(executor) {
            var promise = this;
            if (!(promise instanceof ZoneAwarePromise)) {
                throw new Error('Must be an instanceof Promise.');
            }
            promise[symbolState] = UNRESOLVED;
            promise[symbolValue] = []; // queue;
            try {
                executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
            }
            catch (error) {
                resolvePromise(promise, false, error);
            }
        }
        ZoneAwarePromise.toString = function () {
            return ZONE_AWARE_PROMISE_TO_STRING;
        };
        ZoneAwarePromise.resolve = function (value) {
            return resolvePromise(new this(null), RESOLVED, value);
        };
        ZoneAwarePromise.reject = function (error) {
            return resolvePromise(new this(null), REJECTED, error);
        };
        ZoneAwarePromise.race = function (values) {
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                _a = __read([res, rej], 2), resolve = _a[0], reject = _a[1];
                var _a;
            });
            function onResolve(value) {
                promise && (promise =  false || resolve(value));
            }
            function onReject(error) {
                promise && (promise =  false || reject(error));
            }
            try {
                for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                    var value = values_1_1.value;
                    if (!isThenable(value)) {
                        value = this.resolve(value);
                    }
                    value.then(onResolve, onReject);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return promise;
            var e_1, _a;
        };
        ZoneAwarePromise.all = function (values) {
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            var count = 0;
            var resolvedValues = [];
            try {
                for (var values_2 = __values(values), values_2_1 = values_2.next(); !values_2_1.done; values_2_1 = values_2.next()) {
                    var value = values_2_1.value;
                    if (!isThenable(value)) {
                        value = this.resolve(value);
                    }
                    value.then((function (index) { return function (value) {
                        resolvedValues[index] = value;
                        count--;
                        if (!count) {
                            resolve(resolvedValues);
                        }
                    }; })(count), reject);
                    count++;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (values_2_1 && !values_2_1.done && (_a = values_2.return)) _a.call(values_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (!count)
                resolve(resolvedValues);
            return promise;
            var e_2, _a;
        };
        ZoneAwarePromise.prototype.then = function (onFulfilled, onRejected) {
            var chainPromise = new this.constructor(null);
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
            }
            return chainPromise;
        };
        ZoneAwarePromise.prototype.catch = function (onRejected) {
            return this.then(null, onRejected);
        };
        return ZoneAwarePromise;
    }());
    // Protect against aggressive optimizers dropping seemingly unused properties.
    // E.g. Closure Compiler in advanced mode.
    ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
    ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
    ZoneAwarePromise['race'] = ZoneAwarePromise.race;
    ZoneAwarePromise['all'] = ZoneAwarePromise.all;
    var NativePromise = global[symbolPromise] = global['Promise'];
    var ZONE_AWARE_PROMISE = Zone.__symbol__('ZoneAwarePromise');
    var desc = Object.getOwnPropertyDescriptor(global, 'Promise');
    if (!desc || desc.configurable) {
        desc && delete desc.writable;
        desc && delete desc.value;
        if (!desc) {
            desc = { configurable: true, enumerable: true };
        }
        desc.get = function () {
            // if we already set ZoneAwarePromise, use patched one
            // otherwise return native one.
            return global[ZONE_AWARE_PROMISE] ? global[ZONE_AWARE_PROMISE] : global[symbolPromise];
        };
        desc.set = function (NewNativePromise) {
            if (NewNativePromise === ZoneAwarePromise) {
                // if the NewNativePromise is ZoneAwarePromise
                // save to global
                global[ZONE_AWARE_PROMISE] = NewNativePromise;
            }
            else {
                // if the NewNativePromise is not ZoneAwarePromise
                // for example: after load zone.js, some library just
                // set es6-promise to global, if we set it to global
                // directly, assertZonePatched will fail and angular
                // will not loaded, so we just set the NewNativePromise
                // to global[symbolPromise], so the result is just like
                // we load ES6 Promise before zone.js
                global[symbolPromise] = NewNativePromise;
                if (!NewNativePromise.prototype[symbolThen]) {
                    patchThen(NewNativePromise);
                }
                api.setNativePromise(NewNativePromise);
            }
        };
        Object.defineProperty(global, 'Promise', desc);
    }
    global['Promise'] = ZoneAwarePromise;
    var symbolThenPatched = __symbol__('thenPatched');
    function patchThen(Ctor) {
        var proto = Ctor.prototype;
        var originalThen = proto.then;
        // Keep a reference to the original method.
        proto[symbolThen] = originalThen;
        // check Ctor.prototype.then propertyDescritor is writable or not
        // in meteor env, writable is false, we have to make it to be true.
        var prop = Object.getOwnPropertyDescriptor(Ctor.prototype, 'then');
        if (prop && prop.writable === false && prop.configurable) {
            Object.defineProperty(Ctor.prototype, 'then', { writable: true });
        }
        Ctor.prototype.then = function (onResolve, onReject) {
            var _this = this;
            var wrapped = new ZoneAwarePromise(function (resolve, reject) {
                originalThen.call(_this, resolve, reject);
            });
            return wrapped.then(onResolve, onReject);
        };
        Ctor[symbolThenPatched] = true;
    }
    function zoneify(fn) {
        return function () {
            var resultPromise = fn.apply(this, arguments);
            if (resultPromise instanceof ZoneAwarePromise) {
                return resultPromise;
            }
            var ctor = resultPromise.constructor;
            if (!ctor[symbolThenPatched]) {
                patchThen(ctor);
            }
            return resultPromise;
        };
    }
    if (NativePromise) {
        patchThen(NativePromise);
        var fetch_1 = global['fetch'];
        if (typeof fetch_1 == FUNCTION) {
            global['fetch'] = zoneify(fetch_1);
        }
    }
    // This is not part of public API, but it is useful for tests, so we expose it.
    Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
    return ZoneAwarePromise;
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Suppress closure compiler errors about unknown 'Zone' variable
 * @fileoverview
 * @suppress {undefinedVars,globalThis,missingRequire}
 */
var zoneSymbol = Zone.__symbol__;
var _global = typeof window === 'object' && window || typeof self === 'object' && self || global;
var FUNCTION = 'function';
var UNDEFINED = 'undefined';
var REMOVE_ATTRIBUTE = 'removeAttribute';
function bindArguments(args, source) {
    for (var i = args.length - 1; i >= 0; i--) {
        if (typeof args[i] === FUNCTION) {
            args[i] = Zone.current.wrap(args[i], source + '_' + i);
        }
    }
    return args;
}
function patchPrototype(prototype, fnNames) {
    var source = prototype.constructor['name'];
    var _loop_1 = function (i) {
        var name_1 = fnNames[i];
        var delegate = prototype[name_1];
        if (delegate) {
            var prototypeDesc = Object.getOwnPropertyDescriptor(prototype, name_1);
            if (!isPropertyWritable(prototypeDesc)) {
                return "continue";
            }
            prototype[name_1] = (function (delegate) {
                var patched = function () {
                    return delegate.apply(this, bindArguments(arguments, source + '.' + name_1));
                };
                attachOriginToPatched(patched, delegate);
                return patched;
            })(delegate);
        }
    };
    for (var i = 0; i < fnNames.length; i++) {
        _loop_1(i);
    }
}
function isPropertyWritable(propertyDesc) {
    if (!propertyDesc) {
        return true;
    }
    if (propertyDesc.writable === false) {
        return false;
    }
    if (typeof propertyDesc.get === FUNCTION && typeof propertyDesc.set === UNDEFINED) {
        return false;
    }
    return true;
}
var isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
// Make sure to access `process` through `_global` so that WebPack does not accidently browserify
// this code.
var isNode = (!('nw' in _global) && typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]');
var isBrowser = !isNode && !isWebWorker && !!(typeof window !== 'undefined' && window['HTMLElement']);
// we are in electron of nw, so we are both browser and nodejs
// Make sure to access `process` through `_global` so that WebPack does not accidently browserify
// this code.
var isMix = typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]' && !isWebWorker &&
    !!(typeof window !== 'undefined' && window['HTMLElement']);
var zoneSymbolEventNames = {};
var wrapFn = function (event) {
    // https://github.com/angular/zone.js/issues/911, in IE, sometimes
    // event will be undefined, so we need to use window.event
    event = event || _global.event;
    if (!event) {
        return;
    }
    var eventNameSymbol = zoneSymbolEventNames[event.type];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[event.type] = zoneSymbol('ON_PROPERTY' + event.type);
    }
    var target = this || event.target || _global;
    var listener = target[eventNameSymbol];
    var result = listener && listener.apply(this, arguments);
    if (result != undefined && !result) {
        event.preventDefault();
    }
    return result;
};
function patchProperty(obj, prop, prototype) {
    var desc = Object.getOwnPropertyDescriptor(obj, prop);
    if (!desc && prototype) {
        // when patch window object, use prototype to check prop exist or not
        var prototypeDesc = Object.getOwnPropertyDescriptor(prototype, prop);
        if (prototypeDesc) {
            desc = { enumerable: true, configurable: true };
        }
    }
    // if the descriptor not exists or is not configurable
    // just return
    if (!desc || !desc.configurable) {
        return;
    }
    // A property descriptor cannot have getter/setter and be writable
    // deleting the writable and value properties avoids this error:
    //
    // TypeError: property descriptors must not specify a value or be writable when a
    // getter or setter has been specified
    delete desc.writable;
    delete desc.value;
    var originalDescGet = desc.get;
    // substr(2) cuz 'onclick' -> 'click', etc
    var eventName = prop.substr(2);
    var eventNameSymbol = zoneSymbolEventNames[eventName];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[eventName] = zoneSymbol('ON_PROPERTY' + eventName);
    }
    desc.set = function (newValue) {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return;
        }
        var previousValue = target[eventNameSymbol];
        if (previousValue) {
            target.removeEventListener(eventName, wrapFn);
        }
        if (typeof newValue === 'function') {
            target[eventNameSymbol] = newValue;
            target.addEventListener(eventName, wrapFn, false);
        }
        else {
            target[eventNameSymbol] = null;
        }
    };
    // The getter would return undefined for unassigned properties but the default value of an
    // unassigned property is null
    desc.get = function () {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return null;
        }
        var listener = target[eventNameSymbol];
        if (listener) {
            return listener;
        }
        else if (originalDescGet) {
            // result will be null when use inline event attribute,
            // such as <button onclick="func();">OK</button>
            // because the onclick function is internal raw uncompiled handler
            // the onclick will be evaluated when first time event was triggered or
            // the property is accessed, https://github.com/angular/zone.js/issues/525
            // so we should use original native get to retrieve the handler
            var value = originalDescGet && originalDescGet.apply(this);
            if (value) {
                desc.set.apply(this, [value]);
                if (typeof target[REMOVE_ATTRIBUTE] === FUNCTION) {
                    target.removeAttribute(prop);
                }
                return value;
            }
        }
        return null;
    };
    Object.defineProperty(obj, prop, desc);
}
function patchOnProperties(obj, properties, prototype) {
    if (properties) {
        for (var i = 0; i < properties.length; i++) {
            patchProperty(obj, 'on' + properties[i], prototype);
        }
    }
    else {
        var onProperties = [];
        for (var prop in obj) {
            if (prop.substr(0, 2) == 'on') {
                onProperties.push(prop);
            }
        }
        for (var j = 0; j < onProperties.length; j++) {
            patchProperty(obj, onProperties[j], prototype);
        }
    }
}
var originalInstanceKey = zoneSymbol('originalInstance');
// wrap some native API on `window`
function patchClass(className) {
    var OriginalClass = _global[className];
    if (!OriginalClass)
        return;
    // keep original class in global
    _global[zoneSymbol(className)] = OriginalClass;
    _global[className] = function () {
        var a = bindArguments(arguments, className);
        switch (a.length) {
            case 0:
                this[originalInstanceKey] = new OriginalClass();
                break;
            case 1:
                this[originalInstanceKey] = new OriginalClass(a[0]);
                break;
            case 2:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
                break;
            case 3:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
                break;
            case 4:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
                break;
            default:
                throw new Error('Arg list too long.');
        }
    };
    // attach original delegate to patched function
    attachOriginToPatched(_global[className], OriginalClass);
    var instance = new OriginalClass(function () { });
    var prop;
    for (prop in instance) {
        // https://bugs.webkit.org/show_bug.cgi?id=44721
        if (className === 'XMLHttpRequest' && prop === 'responseBlob')
            continue;
        (function (prop) {
            if (typeof instance[prop] === 'function') {
                _global[className].prototype[prop] = function () {
                    return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
                };
            }
            else {
                Object.defineProperty(_global[className].prototype, prop, {
                    set: function (fn) {
                        if (typeof fn === 'function') {
                            this[originalInstanceKey][prop] = Zone.current.wrap(fn, className + '.' + prop);
                            // keep callback in wrapped function so we can
                            // use it in Function.prototype.toString to return
                            // the native one.
                            attachOriginToPatched(this[originalInstanceKey][prop], fn);
                        }
                        else {
                            this[originalInstanceKey][prop] = fn;
                        }
                    },
                    get: function () {
                        return this[originalInstanceKey][prop];
                    }
                });
            }
        }(prop));
    }
    for (prop in OriginalClass) {
        if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
            _global[className][prop] = OriginalClass[prop];
        }
    }
}
function patchMethod(target, name, patchFn) {
    var proto = target;
    while (proto && !proto.hasOwnProperty(name)) {
        proto = Object.getPrototypeOf(proto);
    }
    if (!proto && target[name]) {
        // somehow we did not find it, but we can see it. This happens on IE for Window properties.
        proto = target;
    }
    var delegateName = zoneSymbol(name);
    var delegate;
    if (proto && !(delegate = proto[delegateName])) {
        delegate = proto[delegateName] = proto[name];
        // check whether proto[name] is writable
        // some property is readonly in safari, such as HtmlCanvasElement.prototype.toBlob
        var desc = proto && Object.getOwnPropertyDescriptor(proto, name);
        if (isPropertyWritable(desc)) {
            var patchDelegate_1 = patchFn(delegate, delegateName, name);
            proto[name] = function () {
                return patchDelegate_1(this, arguments);
            };
            attachOriginToPatched(proto[name], delegate);
        }
    }
    return delegate;
}
// TODO: @JiaLiPassion, support cancel task later if necessary
function patchMacroTask(obj, funcName, metaCreator) {
    var setNative = null;
    function scheduleTask(task) {
        var data = task.data;
        data.args[data.callbackIndex] = function () {
            task.invoke.apply(this, arguments);
        };
        setNative.apply(data.target, data.args);
        return task;
    }
    setNative = patchMethod(obj, funcName, function (delegate) { return function (self, args) {
        var meta = metaCreator(self, args);
        if (meta.callbackIndex >= 0 && typeof args[meta.callbackIndex] === 'function') {
            var task = Zone.current.scheduleMacroTask(meta.name, args[meta.callbackIndex], meta, scheduleTask, null);
            return task;
        }
        else {
            // cause an error by calling it directly.
            return delegate.apply(self, args);
        }
    }; });
}

function attachOriginToPatched(patched, original) {
    patched[zoneSymbol('OriginalDelegate')] = original;
}
var isDetectedIEOrEdge = false;
var ieOrEdge = false;
function isIEOrEdge() {
    if (isDetectedIEOrEdge) {
        return ieOrEdge;
    }
    isDetectedIEOrEdge = true;
    try {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1 || ua.indexOf('Edge/') !== -1) {
            ieOrEdge = true;
        }
        return ieOrEdge;
    }
    catch (error) {
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// override Function.prototype.toString to make zone.js patched function
// look like native function
Zone.__load_patch('toString', function (global, Zone, api) {
    // patch Func.prototype.toString to let them look like native
    var originalFunctionToString = Zone['__zone_symbol__originalToString'] =
        Function.prototype.toString;
    var FUNCTION = 'function';
    var ORIGINAL_DELEGATE_SYMBOL = zoneSymbol('OriginalDelegate');
    var PROMISE_SYMBOL = zoneSymbol('Promise');
    var ERROR_SYMBOL = zoneSymbol('Error');
    Function.prototype.toString = function () {
        if (typeof this === FUNCTION) {
            var originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
            if (originalDelegate) {
                if (typeof originalDelegate === FUNCTION) {
                    return originalFunctionToString.apply(this[ORIGINAL_DELEGATE_SYMBOL], arguments);
                }
                else {
                    return Object.prototype.toString.call(originalDelegate);
                }
            }
            if (this === Promise) {
                var nativePromise = global[PROMISE_SYMBOL];
                if (nativePromise) {
                    return originalFunctionToString.apply(nativePromise, arguments);
                }
            }
            if (this === Error) {
                var nativeError = global[ERROR_SYMBOL];
                if (nativeError) {
                    return originalFunctionToString.apply(nativeError, arguments);
                }
            }
        }
        return originalFunctionToString.apply(this, arguments);
    };
    // patch Object.prototype.toString to let them look like native
    var originalObjectToString = Object.prototype.toString;
    var PROMISE_OBJECT_TO_STRING = '[object Promise]';
    Object.prototype.toString = function () {
        if (this instanceof Promise) {
            return PROMISE_OBJECT_TO_STRING;
        }
        return originalObjectToString.apply(this, arguments);
    };
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
var __read$1 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$1(arguments[i]));
    return ar;
};
var TRUE_STR = 'true';
var FALSE_STR = 'false';
// an identifier to tell ZoneTask do not create a new invoke closure
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
    isUsingGlobalCallback: true
};
var zoneSymbolEventNames$1 = {};
var globalSources = {};
var CONSTRUCTOR_NAME = 'name';
var FUNCTION_TYPE = 'function';
var OBJECT_TYPE = 'object';
var ZONE_SYMBOL_PREFIX = '__zone_symbol__';
var EVENT_NAME_SYMBOL_REGX = /^__zone_symbol__(\w+)(true|false)$/;
var IMMEDIATE_PROPAGATION_SYMBOL = ('__zone_symbol__propagationStopped');
function patchEventTarget(_global, apis, patchOptions) {
    var ADD_EVENT_LISTENER = (patchOptions && patchOptions.addEventListenerFnName) || 'addEventListener';
    var REMOVE_EVENT_LISTENER = (patchOptions && patchOptions.removeEventListenerFnName) || 'removeEventListener';
    var LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.listenersFnName) || 'eventListeners';
    var REMOVE_ALL_LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.removeAllFnName) || 'removeAllListeners';
    var zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
    var ADD_EVENT_LISTENER_SOURCE = '.' + ADD_EVENT_LISTENER + ':';
    var PREPEND_EVENT_LISTENER = 'prependListener';
    var PREPEND_EVENT_LISTENER_SOURCE = '.' + PREPEND_EVENT_LISTENER + ':';
    var invokeTask = function (task, target, event) {
        // for better performance, check isRemoved which is set
        // by removeEventListener
        if (task.isRemoved) {
            return;
        }
        var delegate = task.callback;
        if (typeof delegate === OBJECT_TYPE && delegate.handleEvent) {
            // create the bind version of handleEvent when invoke
            task.callback = function (event) { return delegate.handleEvent(event); };
            task.originalDelegate = delegate;
        }
        // invoke static task.invoke
        task.invoke(task, target, [event]);
        var options = task.options;
        if (options && typeof options === 'object' && options.once) {
            // if options.once is true, after invoke once remove listener here
            // only browser need to do this, nodejs eventEmitter will cal removeListener
            // inside EventEmitter.once
            var delegate_1 = task.originalDelegate ? task.originalDelegate : task.callback;
            target[REMOVE_EVENT_LISTENER].apply(target, [event.type, delegate_1, options]);
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = false
    var globalZoneAwareCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samusung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][FALSE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = true
    var globalZoneAwareCaptureCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samusung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][TRUE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    function patchEventTargetMethods(obj, patchOptions) {
        if (!obj) {
            return false;
        }
        var useGlobalCallback = true;
        if (patchOptions && patchOptions.useGlobalCallback !== undefined) {
            useGlobalCallback = patchOptions.useGlobalCallback;
        }
        var validateHandler = patchOptions && patchOptions.validateHandler;
        var checkDuplicate = true;
        if (patchOptions && patchOptions.checkDuplicate !== undefined) {
            checkDuplicate = patchOptions.checkDuplicate;
        }
        var returnTarget = false;
        if (patchOptions && patchOptions.returnTarget !== undefined) {
            returnTarget = patchOptions.returnTarget;
        }
        var proto = obj;
        while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
            proto = Object.getPrototypeOf(proto);
        }
        if (!proto && obj[ADD_EVENT_LISTENER]) {
            // somehow we did not find it, but we can see it. This happens on IE for Window properties.
            proto = obj;
        }
        if (!proto) {
            return false;
        }
        if (proto[zoneSymbolAddEventListener]) {
            return false;
        }
        // a shared global taskData to pass data for scheduleEventTask
        // so we do not need to create a new object just for pass some data
        var taskData = {};
        var nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
        var nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] =
            proto[REMOVE_EVENT_LISTENER];
        var nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] =
            proto[LISTENERS_EVENT_LISTENER];
        var nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] =
            proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
        var nativePrependEventListener;
        if (patchOptions && patchOptions.prependEventListenerFnName) {
            nativePrependEventListener = proto[zoneSymbol(patchOptions.prependEventListenerFnName)] =
                proto[patchOptions.prependEventListenerFnName];
        }
        var customScheduleGlobal = function (task) {
            // if there is already a task for the eventName + capture,
            // just return, because we use the shared globalZoneAwareCallback here.
            if (taskData.isExisting) {
                return;
            }
            return nativeAddEventListener.apply(taskData.target, [
                taskData.eventName,
                taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback,
                taskData.options
            ]);
        };
        var customCancelGlobal = function (task) {
            // if task is not marked as isRemoved, this call is directly
            // from Zone.prototype.cancelTask, we should remove the task
            // from tasksList of target first
            if (!task.isRemoved) {
                var symbolEventNames = zoneSymbolEventNames$1[task.eventName];
                var symbolEventName = void 0;
                if (symbolEventNames) {
                    symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = symbolEventName && task.target[symbolEventName];
                if (existingTasks) {
                    for (var i = 0; i < existingTasks.length; i++) {
                        var existingTask = existingTasks[i];
                        if (existingTask === task) {
                            existingTasks.splice(i, 1);
                            // set isRemoved to data for faster invokeTask check
                            task.isRemoved = true;
                            if (existingTasks.length === 0) {
                                // all tasks for the eventName + capture have gone,
                                // remove globalZoneAwareCallback and remove the task cache from target
                                task.allRemoved = true;
                                task.target[symbolEventName] = null;
                            }
                            break;
                        }
                    }
                }
            }
            // if all tasks for the eventName + capture have gone,
            // we will really remove the global event callback,
            // if not, return
            if (!task.allRemoved) {
                return;
            }
            return nativeRemoveEventListener.apply(task.target, [
                task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback,
                task.options
            ]);
        };
        var customScheduleNonGlobal = function (task) {
            return nativeAddEventListener.apply(taskData.target, [taskData.eventName, task.invoke, taskData.options]);
        };
        var customSchedulePrepend = function (task) {
            return nativePrependEventListener.apply(taskData.target, [taskData.eventName, task.invoke, taskData.options]);
        };
        var customCancelNonGlobal = function (task) {
            return nativeRemoveEventListener.apply(task.target, [task.eventName, task.invoke, task.options]);
        };
        var customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
        var customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
        var compareTaskCallbackVsDelegate = function (task, delegate) {
            var typeOfDelegate = typeof delegate;
            if ((typeOfDelegate === FUNCTION_TYPE && task.callback === delegate) ||
                (typeOfDelegate === OBJECT_TYPE && task.originalDelegate === delegate)) {
                // same callback, same capture, same event name, just return
                return true;
            }
            return false;
        };
        var compare = (patchOptions && patchOptions.compareTaskCallbackVsDelegate) ?
            patchOptions.compareTaskCallbackVsDelegate :
            compareTaskCallbackVsDelegate;
        var makeAddListener = function (nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget, prepend) {
            if (returnTarget === void 0) { returnTarget = false; }
            if (prepend === void 0) { prepend = false; }
            return function () {
                var target = this || _global;
                var targetZone = Zone.current;
                var delegate = arguments[1];
                if (!delegate) {
                    return nativeListener.apply(this, arguments);
                }
                // don't create the bind delegate function for handleEvent
                // case here to improve addEventListener performance
                // we will create the bind delegate when invoke
                var isHandleEvent = false;
                if (typeof delegate !== FUNCTION_TYPE) {
                    if (!delegate.handleEvent) {
                        return nativeListener.apply(this, arguments);
                    }
                    isHandleEvent = true;
                }
                if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
                    return;
                }
                var eventName = arguments[0];
                var options = arguments[2];
                var capture;
                var once = false;
                if (options === undefined) {
                    capture = false;
                }
                else if (options === true) {
                    capture = true;
                }
                else if (options === false) {
                    capture = false;
                }
                else {
                    capture = options ? !!options.capture : false;
                    once = options ? !!options.once : false;
                }
                var zone = Zone.current;
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                var symbolEventName;
                if (!symbolEventNames) {
                    // the code is duplicate, but I just want to get some better performance
                    var falseEventName = eventName + FALSE_STR;
                    var trueEventName = eventName + TRUE_STR;
                    var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
                    var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
                    zoneSymbolEventNames$1[eventName] = {};
                    zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
                    zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
                    symbolEventName = capture ? symbolCapture : symbol;
                }
                else {
                    symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = target[symbolEventName];
                var isExisting = false;
                if (existingTasks) {
                    // already have task registered
                    isExisting = true;
                    if (checkDuplicate) {
                        for (var i = 0; i < existingTasks.length; i++) {
                            if (compare(existingTasks[i], delegate)) {
                                // same callback, same capture, same event name, just return
                                return;
                            }
                        }
                    }
                }
                else {
                    existingTasks = target[symbolEventName] = [];
                }
                var source;
                var constructorName = target.constructor[CONSTRUCTOR_NAME];
                var targetSource = globalSources[constructorName];
                if (targetSource) {
                    source = targetSource[eventName];
                }
                if (!source) {
                    source = constructorName + addSource + eventName;
                }
                // do not create a new object as task.data to pass those things
                // just use the global shared one
                taskData.options = options;
                if (once) {
                    // if addEventListener with once options, we don't pass it to
                    // native addEventListener, instead we keep the once setting
                    // and handle ourselves.
                    taskData.options.once = false;
                }
                taskData.target = target;
                taskData.capture = capture;
                taskData.eventName = eventName;
                taskData.isExisting = isExisting;
                var data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : null;
                var task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
                // have to save those information to task in case
                // application may call task.zone.cancelTask() directly
                if (once) {
                    options.once = true;
                }
                task.options = options;
                task.target = target;
                task.capture = capture;
                task.eventName = eventName;
                if (isHandleEvent) {
                    // save original delegate for compare to check duplicate
                    task.originalDelegate = delegate;
                }
                if (!prepend) {
                    existingTasks.push(task);
                }
                else {
                    existingTasks.unshift(task);
                }
                if (returnTarget) {
                    return target;
                }
            };
        };
        proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
        if (nativePrependEventListener) {
            proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
        }
        proto[REMOVE_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var options = arguments[2];
            var capture;
            if (options === undefined) {
                capture = false;
            }
            else if (options === true) {
                capture = true;
            }
            else if (options === false) {
                capture = false;
            }
            else {
                capture = options ? !!options.capture : false;
            }
            var delegate = arguments[1];
            if (!delegate) {
                return nativeRemoveEventListener.apply(this, arguments);
            }
            if (validateHandler &&
                !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
                return;
            }
            var symbolEventNames = zoneSymbolEventNames$1[eventName];
            var symbolEventName;
            if (symbolEventNames) {
                symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
            }
            var existingTasks = symbolEventName && target[symbolEventName];
            if (existingTasks) {
                for (var i = 0; i < existingTasks.length; i++) {
                    var existingTask = existingTasks[i];
                    var typeOfDelegate = typeof delegate;
                    if (compare(existingTask, delegate)) {
                        existingTasks.splice(i, 1);
                        // set isRemoved to data for faster invokeTask check
                        existingTask.isRemoved = true;
                        if (existingTasks.length === 0) {
                            // all tasks for the eventName + capture have gone,
                            // remove globalZoneAwareCallback and remove the task cache from target
                            existingTask.allRemoved = true;
                            target[symbolEventName] = null;
                        }
                        existingTask.zone.cancelTask(existingTask);
                        return;
                    }
                }
            }
        };
        proto[LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var listeners = [];
            var tasks = findEventTasks(target, eventName);
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                listeners.push(delegate);
            }
            return listeners;
        };
        proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            if (!eventName) {
                var keys = Object.keys(target);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
                    var evtName = match && match[1];
                    // in nodejs EventEmitter, removeListener event is
                    // used for monitoring the removeListener call,
                    // so just keep removeListener eventListener until
                    // all other eventListeners are removed
                    if (evtName && evtName !== 'removeListener') {
                        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].apply(this, [evtName]);
                    }
                }
                // remove removeListener listener finally
                this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].apply(this, ['removeListener']);
            }
            else {
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                if (symbolEventNames) {
                    var symbolEventName = symbolEventNames[FALSE_STR];
                    var symbolCaptureEventName = symbolEventNames[TRUE_STR];
                    var tasks = target[symbolEventName];
                    var captureTasks = target[symbolCaptureEventName];
                    if (tasks) {
                        var removeTasks = __spread(tasks);
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].apply(this, [eventName, delegate, task.options]);
                        }
                    }
                    if (captureTasks) {
                        var removeTasks = __spread(captureTasks);
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].apply(this, [eventName, delegate, task.options]);
                        }
                    }
                }
            }
        };
        // for native toString patch
        attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
        attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
        if (nativeRemoveAllListeners) {
            attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
        }
        if (nativeListeners) {
            attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
        }
        return true;
    }
    var results = [];
    for (var i = 0; i < apis.length; i++) {
        results[i] = patchEventTargetMethods(apis[i], patchOptions);
    }
    return results;
}
function findEventTasks(target, eventName) {
    var foundTasks = [];
    for (var prop in target) {
        var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
        var evtName = match && match[1];
        if (evtName && (!eventName || evtName === eventName)) {
            var tasks = target[prop];
            if (tasks) {
                for (var i = 0; i < tasks.length; i++) {
                    foundTasks.push(tasks[i]);
                }
            }
        }
    }
    return foundTasks;
}
function patchEventPrototype(global, api) {
    var Event = global['Event'];
    if (Event && Event.prototype) {
        api.patchMethod(Event.prototype, 'stopImmediatePropagation', function (delegate) { return function (self, args) {
            self[IMMEDIATE_PROPAGATION_SYMBOL] = true;
        }; });
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
var taskSymbol = zoneSymbol('zoneTask');
function patchTimer(window, setName, cancelName, nameSuffix) {
    var setNative = null;
    var clearNative = null;
    setName += nameSuffix;
    cancelName += nameSuffix;
    var tasksByHandleId = {};
    var NUMBER = 'number';
    var STRING = 'string';
    var FUNCTION = 'function';
    var INTERVAL = 'Interval';
    var TIMEOUT = 'Timeout';
    var NOT_SCHEDULED = 'notScheduled';
    function scheduleTask(task) {
        var data = task.data;
        function timer() {
            try {
                task.invoke.apply(this, arguments);
            }
            finally {
                if (typeof data.handleId === NUMBER) {
                    // in non-nodejs env, we remove timerId
                    // from local cache
                    delete tasksByHandleId[data.handleId];
                }
                else if (data.handleId) {
                    // Node returns complex objects as handleIds
                    // we remove task reference from timer object
                    data.handleId[taskSymbol] = null;
                }
            }
        }
        data.args[0] = timer;
        data.handleId = setNative.apply(window, data.args);
        return task;
    }
    function clearTask(task) {
        return clearNative(task.data.handleId);
    }
    setNative =
        patchMethod(window, setName, function (delegate) { return function (self, args) {
            if (typeof args[0] === FUNCTION) {
                var zone = Zone.current;
                var options = {
                    handleId: null,
                    isPeriodic: nameSuffix === INTERVAL,
                    delay: (nameSuffix === TIMEOUT || nameSuffix === INTERVAL) ? args[1] || 0 : null,
                    args: args
                };
                var task = zone.scheduleMacroTask(setName, args[0], options, scheduleTask, clearTask);
                if (!task) {
                    return task;
                }
                // Node.js must additionally support the ref and unref functions.
                var handle = task.data.handleId;
                if (typeof handle === NUMBER) {
                    // for non nodejs env, we save handleId: task
                    // mapping in local cache for clearTimeout
                    tasksByHandleId[handle] = task;
                }
                else if (handle) {
                    // for nodejs env, we save task
                    // reference in timerId Object for clearTimeout
                    handle[taskSymbol] = task;
                }
                // check whether handle is null, because some polyfill or browser
                // may return undefined from setTimeout/setInterval/setImmediate/requestAnimationFrame
                if (handle && handle.ref && handle.unref && typeof handle.ref === FUNCTION &&
                    typeof handle.unref === FUNCTION) {
                    task.ref = handle.ref.bind(handle);
                    task.unref = handle.unref.bind(handle);
                }
                if (typeof handle === NUMBER || handle) {
                    return handle;
                }
                return task;
            }
            else {
                // cause an error by calling it directly.
                return delegate.apply(window, args);
            }
        }; });
    clearNative =
        patchMethod(window, cancelName, function (delegate) { return function (self, args) {
            var id = args[0];
            var task;
            if (typeof id === NUMBER) {
                // non nodejs env.
                task = tasksByHandleId[id];
            }
            else {
                // nodejs env.
                task = id && id[taskSymbol];
                // other environments.
                if (!task) {
                    task = id;
                }
            }
            if (task && typeof task.type === STRING) {
                if (task.state !== NOT_SCHEDULED &&
                    (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
                    if (typeof id === NUMBER) {
                        delete tasksByHandleId[id];
                    }
                    else if (id) {
                        id[taskSymbol] = null;
                    }
                    // Do not cancel already canceled functions
                    task.zone.cancelTask(task);
                }
            }
            else {
                // cause an error by calling it directly.
                delegate.apply(window, args);
            }
        }; });
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/*
 * This is necessary for Chrome and Chrome mobile, to enable
 * things like redefining `createdCallback` on an element.
 */
var _defineProperty = Object[zoneSymbol('defineProperty')] = Object.defineProperty;
var _getOwnPropertyDescriptor = Object[zoneSymbol('getOwnPropertyDescriptor')] =
    Object.getOwnPropertyDescriptor;
var _create = Object.create;
var unconfigurablesKey = zoneSymbol('unconfigurables');
var PROTOTYPE = 'prototype';
var OBJECT = 'object';
var UNDEFINED$1 = 'undefined';
function propertyPatch() {
    Object.defineProperty = function (obj, prop, desc) {
        if (isUnconfigurable(obj, prop)) {
            throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
        }
        var originalConfigurableFlag = desc.configurable;
        if (prop !== PROTOTYPE) {
            desc = rewriteDescriptor(obj, prop, desc);
        }
        return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
    };
    Object.defineProperties = function (obj, props) {
        Object.keys(props).forEach(function (prop) {
            Object.defineProperty(obj, prop, props[prop]);
        });
        return obj;
    };
    Object.create = function (obj, proto) {
        if (typeof proto === OBJECT && !Object.isFrozen(proto)) {
            Object.keys(proto).forEach(function (prop) {
                proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
            });
        }
        return _create(obj, proto);
    };
    Object.getOwnPropertyDescriptor = function (obj, prop) {
        var desc = _getOwnPropertyDescriptor(obj, prop);
        if (isUnconfigurable(obj, prop)) {
            desc.configurable = false;
        }
        return desc;
    };
}
function _redefineProperty(obj, prop, desc) {
    var originalConfigurableFlag = desc.configurable;
    desc = rewriteDescriptor(obj, prop, desc);
    return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
}
function isUnconfigurable(obj, prop) {
    return obj && obj[unconfigurablesKey] && obj[unconfigurablesKey][prop];
}
function rewriteDescriptor(obj, prop, desc) {
    desc.configurable = true;
    if (!desc.configurable) {
        if (!obj[unconfigurablesKey]) {
            _defineProperty(obj, unconfigurablesKey, { writable: true, value: {} });
        }
        obj[unconfigurablesKey][prop] = true;
    }
    return desc;
}
function _tryDefineProperty(obj, prop, desc, originalConfigurableFlag) {
    try {
        return _defineProperty(obj, prop, desc);
    }
    catch (error) {
        if (desc.configurable) {
            // In case of errors, when the configurable flag was likely set by rewriteDescriptor(), let's
            // retry with the original flag value
            if (typeof originalConfigurableFlag == UNDEFINED$1) {
                delete desc.configurable;
            }
            else {
                desc.configurable = originalConfigurableFlag;
            }
            try {
                return _defineProperty(obj, prop, desc);
            }
            catch (error) {
                var descJson = null;
                try {
                    descJson = JSON.stringify(desc);
                }
                catch (error) {
                    descJson = descJson.toString();
                }
                console.log("Attempting to configure '" + prop + "' with descriptor '" + descJson + "' on object '" + obj + "' and got error, giving up: " + error);
            }
        }
        else {
            throw error;
        }
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// we have to patch the instance since the proto is non-configurable
function apply(api, _global) {
    var WS = _global.WebSocket;
    // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
    // On older Chrome, no need since EventTarget was already patched
    if (!_global.EventTarget) {
        patchEventTarget(_global, [WS.prototype]);
    }
    _global.WebSocket = function (a, b) {
        var socket = arguments.length > 1 ? new WS(a, b) : new WS(a);
        var proxySocket;
        var proxySocketProto;
        // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
        var onmessageDesc = Object.getOwnPropertyDescriptor(socket, 'onmessage');
        if (onmessageDesc && onmessageDesc.configurable === false) {
            proxySocket = Object.create(socket);
            // socket have own property descriptor 'onopen', 'onmessage', 'onclose', 'onerror'
            // but proxySocket not, so we will keep socket as prototype and pass it to
            // patchOnProperties method
            proxySocketProto = socket;
            ['addEventListener', 'removeEventListener', 'send', 'close'].forEach(function (propName) {
                proxySocket[propName] = function () {
                    var args = Array.prototype.slice.call(arguments);
                    if (propName === 'addEventListener' || propName === 'removeEventListener') {
                        var eventName = args.length > 0 ? args[0] : undefined;
                        if (eventName) {
                            var propertySymbol = Zone.__symbol__('ON_PROPERTY' + eventName);
                            socket[propertySymbol] = proxySocket[propertySymbol];
                        }
                    }
                    return socket[propName].apply(socket, args);
                };
            });
        }
        else {
            // we can patch the real socket
            proxySocket = socket;
        }
        patchOnProperties(proxySocket, ['close', 'error', 'message', 'open'], proxySocketProto);
        return proxySocket;
    };
    var globalWebSocket = _global['WebSocket'];
    for (var prop in WS) {
        globalWebSocket[prop] = WS[prop];
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {globalThis}
 */
var globalEventHandlersEventNames = [
    'abort',
    'animationcancel',
    'animationend',
    'animationiteration',
    'auxclick',
    'beforeinput',
    'blur',
    'cancel',
    'canplay',
    'canplaythrough',
    'change',
    'compositionstart',
    'compositionupdate',
    'compositionend',
    'cuechange',
    'click',
    'close',
    'contextmenu',
    'curechange',
    'dblclick',
    'drag',
    'dragend',
    'dragenter',
    'dragexit',
    'dragleave',
    'dragover',
    'drop',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'focus',
    'focusin',
    'focusout',
    'gotpointercapture',
    'input',
    'invalid',
    'keydown',
    'keypress',
    'keyup',
    'load',
    'loadstart',
    'loadeddata',
    'loadedmetadata',
    'lostpointercapture',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'mousewheel',
    'orientationchange',
    'pause',
    'play',
    'playing',
    'pointercancel',
    'pointerdown',
    'pointerenter',
    'pointerleave',
    'pointerlockchange',
    'mozpointerlockchange',
    'webkitpointerlockerchange',
    'pointerlockerror',
    'mozpointerlockerror',
    'webkitpointerlockerror',
    'pointermove',
    'pointout',
    'pointerover',
    'pointerup',
    'progress',
    'ratechange',
    'reset',
    'resize',
    'scroll',
    'seeked',
    'seeking',
    'select',
    'selectionchange',
    'selectstart',
    'show',
    'sort',
    'stalled',
    'submit',
    'suspend',
    'timeupdate',
    'volumechange',
    'touchcancel',
    'touchmove',
    'touchstart',
    'touchend',
    'transitioncancel',
    'transitionend',
    'waiting',
    'wheel'
];
var documentEventNames = [
    'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'fullscreenchange',
    'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
    'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
    'visibilitychange'
];
var windowEventNames = [
    'absolutedeviceorientation',
    'afterinput',
    'afterprint',
    'appinstalled',
    'beforeinstallprompt',
    'beforeprint',
    'beforeunload',
    'devicelight',
    'devicemotion',
    'deviceorientation',
    'deviceorientationabsolute',
    'deviceproximity',
    'hashchange',
    'languagechange',
    'message',
    'mozbeforepaint',
    'offline',
    'online',
    'paint',
    'pageshow',
    'pagehide',
    'popstate',
    'rejectionhandled',
    'storage',
    'unhandledrejection',
    'unload',
    'userproximity',
    'vrdisplyconnected',
    'vrdisplaydisconnected',
    'vrdisplaypresentchange'
];
var htmlElementEventNames = [
    'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
    'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
    'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
];
var mediaElementEventNames = ['encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'];
var ieElementEventNames = [
    'activate',
    'afterupdate',
    'ariarequest',
    'beforeactivate',
    'beforedeactivate',
    'beforeeditfocus',
    'beforeupdate',
    'cellchange',
    'controlselect',
    'dataavailable',
    'datasetchanged',
    'datasetcomplete',
    'errorupdate',
    'filterchange',
    'layoutcomplete',
    'losecapture',
    'move',
    'moveend',
    'movestart',
    'propertychange',
    'resizeend',
    'resizestart',
    'rowenter',
    'rowexit',
    'rowsdelete',
    'rowsinserted',
    'command',
    'compassneedscalibration',
    'deactivate',
    'help',
    'mscontentzoom',
    'msmanipulationstatechanged',
    'msgesturechange',
    'msgesturedoubletap',
    'msgestureend',
    'msgesturehold',
    'msgesturestart',
    'msgesturetap',
    'msgotpointercapture',
    'msinertiastart',
    'mslostpointercapture',
    'mspointercancel',
    'mspointerdown',
    'mspointerenter',
    'mspointerhover',
    'mspointerleave',
    'mspointermove',
    'mspointerout',
    'mspointerover',
    'mspointerup',
    'pointerout',
    'mssitemodejumplistitemremoved',
    'msthumbnailclick',
    'stop',
    'storagecommit'
];
var webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
var formEventNames = ['autocomplete', 'autocompleteerror'];
var detailEventNames = ['toggle'];
var frameEventNames = ['load'];
var frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
var marqueeEventNames = ['bounce', 'finish', 'start'];
var XMLHttpRequestEventNames = [
    'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
    'readystatechange'
];
var IDBIndexEventNames = ['upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'];
var websocketEventNames = ['close', 'error', 'open', 'message'];
var workerEventNames = ['error', 'message'];
var eventNames = globalEventHandlersEventNames.concat(webglEventNames, formEventNames, detailEventNames, documentEventNames, windowEventNames, htmlElementEventNames, ieElementEventNames);
function filterProperties(target, onProperties, ignoreProperties) {
    if (!ignoreProperties) {
        return onProperties;
    }
    var tip = ignoreProperties.filter(function (ip) { return ip.target === target; });
    if (!tip || tip.length === 0) {
        return onProperties;
    }
    var targetIgnoreProperties = tip[0].ignoreProperties;
    return onProperties.filter(function (op) { return targetIgnoreProperties.indexOf(op) === -1; });
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
    var filteredProperties = filterProperties(target, onProperties, ignoreProperties);
    patchOnProperties(target, filteredProperties, prototype);
}
function propertyDescriptorPatch(api, _global) {
    if (isNode && !isMix) {
        return;
    }
    var supportsWebSocket = typeof WebSocket !== 'undefined';
    if (canPatchViaPropertyDescriptor()) {
        var ignoreProperties = _global.__Zone_ignore_on_properties;
        // for browsers that we can patch the descriptor:  Chrome & Firefox
        if (isBrowser) {
            // in IE/Edge, onProp not exist in window object, but in WindowPrototype
            // so we need to pass WindowPrototype to check onProp exist or not
            patchFilteredProperties(window, eventNames.concat(['messageerror']), ignoreProperties, Object.getPrototypeOf(window));
            patchFilteredProperties(Document.prototype, eventNames, ignoreProperties);
            if (typeof window['SVGElement'] !== 'undefined') {
                patchFilteredProperties(window['SVGElement'].prototype, eventNames, ignoreProperties);
            }
            patchFilteredProperties(Element.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLElement.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLMediaElement.prototype, mediaElementEventNames, ignoreProperties);
            patchFilteredProperties(HTMLFrameSetElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLBodyElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLFrameElement.prototype, frameEventNames, ignoreProperties);
            patchFilteredProperties(HTMLIFrameElement.prototype, frameEventNames, ignoreProperties);
            var HTMLMarqueeElement_1 = window['HTMLMarqueeElement'];
            if (HTMLMarqueeElement_1) {
                patchFilteredProperties(HTMLMarqueeElement_1.prototype, marqueeEventNames, ignoreProperties);
            }
            var Worker_1 = window['Worker'];
            if (Worker_1) {
                patchFilteredProperties(Worker_1.prototype, workerEventNames, ignoreProperties);
            }
        }
        patchFilteredProperties(XMLHttpRequest.prototype, XMLHttpRequestEventNames, ignoreProperties);
        var XMLHttpRequestEventTarget = _global['XMLHttpRequestEventTarget'];
        if (XMLHttpRequestEventTarget) {
            patchFilteredProperties(XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype, XMLHttpRequestEventNames, ignoreProperties);
        }
        if (typeof IDBIndex !== 'undefined') {
            patchFilteredProperties(IDBIndex.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBOpenDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBDatabase.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBTransaction.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBCursor.prototype, IDBIndexEventNames, ignoreProperties);
        }
        if (supportsWebSocket) {
            patchFilteredProperties(WebSocket.prototype, websocketEventNames, ignoreProperties);
        }
    }
    else {
        // Safari, Android browsers (Jelly Bean)
        patchViaCapturingAllTheEvents();
        patchClass('XMLHttpRequest');
        if (supportsWebSocket) {
            apply(api, _global);
        }
    }
}
function canPatchViaPropertyDescriptor() {
    if ((isBrowser || isMix) && !Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') &&
        typeof Element !== 'undefined') {
        // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
        // IDL interface attributes are not configurable
        var desc = Object.getOwnPropertyDescriptor(Element.prototype, 'onclick');
        if (desc && !desc.configurable)
            return false;
    }
    var xhrDesc = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'onreadystatechange');
    // add enumerable and configurable here because in opera
    // by default XMLHttpRequest.prototype.onreadystatechange is undefined
    // without adding enumerable and configurable will cause onreadystatechange
    // non-configurable
    // and if XMLHttpRequest.prototype.onreadystatechange is undefined,
    // we should set a real desc instead a fake one
    if (xhrDesc) {
        Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {
            enumerable: true,
            configurable: true,
            get: function () {
                return true;
            }
        });
        var req = new XMLHttpRequest();
        var result = !!req.onreadystatechange;
        // restore original desc
        Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', xhrDesc || {});
        return result;
    }
    else {
        var SYMBOL_FAKE_ONREADYSTATECHANGE_1 = zoneSymbol('fakeonreadystatechange');
        Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {
            enumerable: true,
            configurable: true,
            get: function () {
                return this[SYMBOL_FAKE_ONREADYSTATECHANGE_1];
            },
            set: function (value) {
                this[SYMBOL_FAKE_ONREADYSTATECHANGE_1] = value;
            }
        });
        var req = new XMLHttpRequest();
        var detectFunc = function () { };
        req.onreadystatechange = detectFunc;
        var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
        req.onreadystatechange = null;
        return result;
    }
}

var unboundKey = zoneSymbol('unbound');
// Whenever any eventListener fires, we check the eventListener target and all parents
// for `onwhatever` properties and replace them with zone-bound functions
// - Chrome (for now)
function patchViaCapturingAllTheEvents() {
    var _loop_1 = function (i) {
        var property = eventNames[i];
        var onproperty = 'on' + property;
        self.addEventListener(property, function (event) {
            var elt = event.target, bound, source;
            if (elt) {
                source = elt.constructor['name'] + '.' + onproperty;
            }
            else {
                source = 'unknown.' + onproperty;
            }
            while (elt) {
                if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                    bound = Zone.current.wrap(elt[onproperty], source);
                    bound[unboundKey] = elt[onproperty];
                    elt[onproperty] = bound;
                }
                elt = elt.parentElement;
            }
        }, true);
    };
    for (var i = 0; i < eventNames.length; i++) {
        _loop_1(i);
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function eventTargetPatch(_global, api) {
    var WTF_ISSUE_555 = 'Anchor,Area,Audio,BR,Base,BaseFont,Body,Button,Canvas,Content,DList,Directory,Div,Embed,FieldSet,Font,Form,Frame,FrameSet,HR,Head,Heading,Html,IFrame,Image,Input,Keygen,LI,Label,Legend,Link,Map,Marquee,Media,Menu,Meta,Meter,Mod,OList,Object,OptGroup,Option,Output,Paragraph,Pre,Progress,Quote,Script,Select,Source,Span,Style,TableCaption,TableCell,TableCol,Table,TableRow,TableSection,TextArea,Title,Track,UList,Unknown,Video';
    var NO_EVENT_TARGET = 'ApplicationCache,EventSource,FileReader,InputMethodContext,MediaController,MessagePort,Node,Performance,SVGElementInstance,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebKitNamedFlow,Window,Worker,WorkerGlobalScope,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload,IDBRequest,IDBOpenDBRequest,IDBDatabase,IDBTransaction,IDBCursor,DBIndex,WebSocket'
        .split(',');
    var EVENT_TARGET = 'EventTarget';
    var apis = [];
    var isWtf = _global['wtf'];
    var WTF_ISSUE_555_ARRAY = WTF_ISSUE_555.split(',');
    if (isWtf) {
        // Workaround for: https://github.com/google/tracing-framework/issues/555
        apis = WTF_ISSUE_555_ARRAY.map(function (v) { return 'HTML' + v + 'Element'; }).concat(NO_EVENT_TARGET);
    }
    else if (_global[EVENT_TARGET]) {
        apis.push(EVENT_TARGET);
    }
    else {
        // Note: EventTarget is not available in all browsers,
        // if it's not available, we instead patch the APIs in the IDL that inherit from EventTarget
        apis = NO_EVENT_TARGET;
    }
    var isDisableIECheck = _global['__Zone_disable_IE_check'] || false;
    var isEnableCrossContextCheck = _global['__Zone_enable_cross_context_check'] || false;
    var ieOrEdge = isIEOrEdge();
    var ADD_EVENT_LISTENER_SOURCE = '.addEventListener:';
    var FUNCTION_WRAPPER = '[object FunctionWrapper]';
    var BROWSER_TOOLS = 'function __BROWSERTOOLS_CONSOLE_SAFEFUNC() { [native code] }';
    //  predefine all __zone_symbol__ + eventName + true/false string
    for (var i = 0; i < eventNames.length; i++) {
        var eventName = eventNames[i];
        var falseEventName = eventName + FALSE_STR;
        var trueEventName = eventName + TRUE_STR;
        var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
        var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
        zoneSymbolEventNames$1[eventName] = {};
        zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
        zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
    }
    //  predefine all task.source string
    for (var i = 0; i < WTF_ISSUE_555.length; i++) {
        var target = WTF_ISSUE_555_ARRAY[i];
        var targets = globalSources[target] = {};
        for (var j = 0; j < eventNames.length; j++) {
            var eventName = eventNames[j];
            targets[eventName] = target + ADD_EVENT_LISTENER_SOURCE + eventName;
        }
    }
    var checkIEAndCrossContext = function (nativeDelegate, delegate, target, args) {
        if (!isDisableIECheck && ieOrEdge) {
            if (isEnableCrossContextCheck) {
                try {
                    var testString = delegate.toString();
                    if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                        nativeDelegate.apply(target, args);
                        return false;
                    }
                }
                catch (error) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
            else {
                var testString = delegate.toString();
                if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
        }
        else if (isEnableCrossContextCheck) {
            try {
                delegate.toString();
            }
            catch (error) {
                nativeDelegate.apply(target, args);
                return false;
            }
        }
        return true;
    };
    var apiTypes = [];
    for (var i = 0; i < apis.length; i++) {
        var type = _global[apis[i]];
        apiTypes.push(type && type.prototype);
    }
    patchEventTarget(_global, apiTypes, { validateHandler: checkIEAndCrossContext });
    api.patchEventTarget = patchEventTarget;
    return true;
}
function patchEvent(global, api) {
    patchEventPrototype(global, api);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function registerElementPatch(_global) {
    if ((!isBrowser && !isMix) || !('registerElement' in _global.document)) {
        return;
    }
    var _registerElement = document.registerElement;
    var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
    document.registerElement = function (name, opts) {
        if (opts && opts.prototype) {
            callbacks.forEach(function (callback) {
                var source = 'Document.registerElement::' + callback;
                if (opts.prototype.hasOwnProperty(callback)) {
                    var descriptor = Object.getOwnPropertyDescriptor(opts.prototype, callback);
                    if (descriptor && descriptor.value) {
                        descriptor.value = Zone.current.wrap(descriptor.value, source);
                        _redefineProperty(opts.prototype, callback, descriptor);
                    }
                    else {
                        opts.prototype[callback] = Zone.current.wrap(opts.prototype[callback], source);
                    }
                }
                else if (opts.prototype[callback]) {
                    opts.prototype[callback] = Zone.current.wrap(opts.prototype[callback], source);
                }
            });
        }
        return _registerElement.apply(document, [name, opts]);
    };
    attachOriginToPatched(document.registerElement, _registerElement);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
Zone.__load_patch('util', function (global, Zone, api) {
    api.patchOnProperties = patchOnProperties;
    api.patchMethod = patchMethod;
});
Zone.__load_patch('timers', function (global, Zone, api) {
    var set = 'set';
    var clear = 'clear';
    patchTimer(global, set, clear, 'Timeout');
    patchTimer(global, set, clear, 'Interval');
    patchTimer(global, set, clear, 'Immediate');
});
Zone.__load_patch('requestAnimationFrame', function (global, Zone, api) {
    patchTimer(global, 'request', 'cancel', 'AnimationFrame');
    patchTimer(global, 'mozRequest', 'mozCancel', 'AnimationFrame');
    patchTimer(global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
});
Zone.__load_patch('blocking', function (global, Zone, api) {
    var blockingMethods = ['alert', 'prompt', 'confirm'];
    for (var i = 0; i < blockingMethods.length; i++) {
        var name_1 = blockingMethods[i];
        patchMethod(global, name_1, function (delegate, symbol, name) {
            return function (s, args) {
                return Zone.current.run(delegate, global, args, name);
            };
        });
    }
});
Zone.__load_patch('EventTarget', function (global, Zone, api) {
    patchEvent(global, api);
    eventTargetPatch(global, api);
    // patch XMLHttpRequestEventTarget's addEventListener/removeEventListener
    var XMLHttpRequestEventTarget = global['XMLHttpRequestEventTarget'];
    if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
        api.patchEventTarget(global, [XMLHttpRequestEventTarget.prototype]);
    }
    patchClass('MutationObserver');
    patchClass('WebKitMutationObserver');
    patchClass('IntersectionObserver');
    patchClass('FileReader');
});
Zone.__load_patch('on_property', function (global, Zone, api) {
    propertyDescriptorPatch(api, global);
    propertyPatch();
    registerElementPatch(global);
});
Zone.__load_patch('canvas', function (global, Zone, api) {
    var HTMLCanvasElement = global['HTMLCanvasElement'];
    if (typeof HTMLCanvasElement !== 'undefined' && HTMLCanvasElement.prototype &&
        HTMLCanvasElement.prototype.toBlob) {
        patchMacroTask(HTMLCanvasElement.prototype, 'toBlob', function (self, args) {
            return { name: 'HTMLCanvasElement.toBlob', target: self, callbackIndex: 0, args: args };
        });
    }
});
Zone.__load_patch('XHR', function (global, Zone, api) {
    // Treat XMLHTTPRequest as a macrotask.
    patchXHR(global);
    var XHR_TASK = zoneSymbol('xhrTask');
    var XHR_SYNC = zoneSymbol('xhrSync');
    var XHR_LISTENER = zoneSymbol('xhrListener');
    var XHR_SCHEDULED = zoneSymbol('xhrScheduled');
    var XHR_URL = zoneSymbol('xhrURL');
    function patchXHR(window) {
        function findPendingTask(target) {
            var pendingTask = target[XHR_TASK];
            return pendingTask;
        }
        var SYMBOL_ADDEVENTLISTENER = zoneSymbol('addEventListener');
        var SYMBOL_REMOVEEVENTLISTENER = zoneSymbol('removeEventListener');
        var oriAddListener = XMLHttpRequest.prototype[SYMBOL_ADDEVENTLISTENER];
        var oriRemoveListener = XMLHttpRequest.prototype[SYMBOL_REMOVEEVENTLISTENER];
        if (!oriAddListener) {
            var XMLHttpRequestEventTarget = window['XMLHttpRequestEventTarget'];
            if (XMLHttpRequestEventTarget) {
                oriAddListener = XMLHttpRequestEventTarget.prototype[SYMBOL_ADDEVENTLISTENER];
                oriRemoveListener = XMLHttpRequestEventTarget.prototype[SYMBOL_REMOVEEVENTLISTENER];
            }
        }
        var READY_STATE_CHANGE = 'readystatechange';
        var SCHEDULED = 'scheduled';
        function scheduleTask(task) {
            XMLHttpRequest[XHR_SCHEDULED] = false;
            var data = task.data;
            var target = data.target;
            // remove existing event listener
            var listener = target[XHR_LISTENER];
            if (!oriAddListener) {
                oriAddListener = target[SYMBOL_ADDEVENTLISTENER];
                oriRemoveListener = target[SYMBOL_REMOVEEVENTLISTENER];
            }
            if (listener) {
                oriRemoveListener.apply(target, [READY_STATE_CHANGE, listener]);
            }
            var newListener = target[XHR_LISTENER] = function () {
                if (target.readyState === target.DONE) {
                    // sometimes on some browsers XMLHttpRequest will fire onreadystatechange with
                    // readyState=4 multiple times, so we need to check task state here
                    if (!data.aborted && XMLHttpRequest[XHR_SCHEDULED] && task.state === SCHEDULED) {
                        task.invoke();
                    }
                }
            };
            oriAddListener.apply(target, [READY_STATE_CHANGE, newListener]);
            var storedTask = target[XHR_TASK];
            if (!storedTask) {
                target[XHR_TASK] = task;
            }
            sendNative.apply(target, data.args);
            XMLHttpRequest[XHR_SCHEDULED] = true;
            return task;
        }
        function placeholderCallback() { }
        function clearTask(task) {
            var data = task.data;
            // Note - ideally, we would call data.target.removeEventListener here, but it's too late
            // to prevent it from firing. So instead, we store info for the event listener.
            data.aborted = true;
            return abortNative.apply(data.target, data.args);
        }
        var openNative = patchMethod(window.XMLHttpRequest.prototype, 'open', function () { return function (self, args) {
            self[XHR_SYNC] = args[2] == false;
            self[XHR_URL] = args[1];
            return openNative.apply(self, args);
        }; });
        var XMLHTTPREQUEST_SOURCE = 'XMLHttpRequest.send';
        var sendNative = patchMethod(window.XMLHttpRequest.prototype, 'send', function () { return function (self, args) {
            var zone = Zone.current;
            if (self[XHR_SYNC]) {
                // if the XHR is sync there is no task to schedule, just execute the code.
                return sendNative.apply(self, args);
            }
            else {
                var options = {
                    target: self,
                    url: self[XHR_URL],
                    isPeriodic: false,
                    delay: null,
                    args: args,
                    aborted: false
                };
                return zone.scheduleMacroTask(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
            }
        }; });
        var STRING_TYPE = 'string';
        var abortNative = patchMethod(window.XMLHttpRequest.prototype, 'abort', function (delegate) { return function (self, args) {
            var task = findPendingTask(self);
            if (task && typeof task.type == STRING_TYPE) {
                // If the XHR has already completed, do nothing.
                // If the XHR has already been aborted, do nothing.
                // Fix #569, call abort multiple times before done will cause
                // macroTask task count be negative number
                if (task.cancelFn == null || (task.data && task.data.aborted)) {
                    return;
                }
                task.zone.cancelTask(task);
            }
            // Otherwise, we are trying to abort an XHR which has not yet been sent, so there is no
            // task
            // to cancel. Do nothing.
        }; });
    }
});
Zone.__load_patch('geolocation', function (global, Zone, api) {
    /// GEO_LOCATION
    if (global['navigator'] && global['navigator'].geolocation) {
        patchPrototype(global['navigator'].geolocation, ['getCurrentPosition', 'watchPosition']);
    }
});
Zone.__load_patch('PromiseRejectionEvent', function (global, Zone, api) {
    // handle unhandled promise rejection
    function findPromiseRejectionHandler(evtName) {
        return function (e) {
            var eventTasks = findEventTasks(global, evtName);
            eventTasks.forEach(function (eventTask) {
                // windows has added unhandledrejection event listener
                // trigger the event listener
                var PromiseRejectionEvent = global['PromiseRejectionEvent'];
                if (PromiseRejectionEvent) {
                    var evt = new PromiseRejectionEvent(evtName, { promise: e.promise, reason: e.rejection });
                    eventTask.invoke(evt);
                }
            });
        };
    }
    if (global['PromiseRejectionEvent']) {
        Zone[zoneSymbol('unhandledPromiseRejectionHandler')] =
            findPromiseRejectionHandler('unhandledrejection');
        Zone[zoneSymbol('rejectionHandledHandler')] =
            findPromiseRejectionHandler('rejectionhandled');
    }
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

})));


/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n<ng-progress></ng-progress>\r\n\r\n\r\n\r\n<div\r\n  class=\"container-fluid\"\r\n  *ngIf=\"\r\n  router.url !== '/login' &&\r\n  router.url !== '/new-password' &&\r\n  router.url !== '/reset-password'\" >\r\n  <app-header></app-header>\r\n</div>\r\n\r\n\r\n\r\n\r\n<div class=\"container-fluid body-content\">\r\n  <div class=\"row \">\r\n    <div class=\"col-md-12\">\r\n      <router-outlet></router-outlet>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".body-content {\n  padding-left: 15px;\n  padding-right: 15px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvRDpcXFdlYiBEZXZlbG9wbWVudFxcUHJvamVjdHNcXFJlc3RhdXJhbnRNYW5hZ2VtZW50QXBwXFxSZXN0YXVyYW50TWFuYWdlbWVudEFwcC9zcmNcXGFwcFxcYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLG1CQUFtQixFQUFBIiwiZmlsZSI6InNyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmJvZHktY29udGVudCB7XHJcbiAgcGFkZGluZy1sZWZ0OiAxNXB4O1xyXG4gIHBhZGRpbmctcmlnaHQ6IDE1cHg7XHJcbn1cclxuXHJcblxyXG4iXX0= */"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");



var AppComponent = /** @class */ (function () {
    function AppComponent(router) {
        this.router = router;
    }
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _modules_app_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/app-routing.module */ "./src/app/modules/app-routing.module.ts");
/* harmony import */ var _services_shared_point_of_sale_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/shared/point-of-sale.service */ "./src/app/services/shared/point-of-sale.service.ts");
/* harmony import */ var _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./services/data-storage/table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _pipes_filter_pipe__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pipes/filter.pipe */ "./src/app/pipes/filter.pipe.ts");
/* harmony import */ var _pipes_order_pipe__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./pipes/order.pipe */ "./src/app/pipes/order.pipe.ts");
/* harmony import */ var _route_resolvers_table_resolver_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./route-resolvers/table-resolver.service */ "./src/app/route-resolvers/table-resolver.service.ts");
/* harmony import */ var _route_resolvers_order_resolver_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./route-resolvers/order-resolver.service */ "./src/app/route-resolvers/order-resolver.service.ts");
/* harmony import */ var _route_resolvers_inventory_resolver_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./route-resolvers/inventory-resolver.service */ "./src/app/route-resolvers/inventory-resolver.service.ts");
/* harmony import */ var _route_resolvers_food_item_resolver_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./route-resolvers/food-item-resolver.service */ "./src/app/route-resolvers/food-item-resolver.service.ts");
/* harmony import */ var _services_shared_auth_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./services/shared/auth.service */ "./src/app/services/shared/auth.service.ts");
/* harmony import */ var _auth_auth_guard__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./auth/auth.guard */ "./src/app/auth/auth.guard.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _auth_auth_interceptor__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./auth/auth.interceptor */ "./src/app/auth/auth.interceptor.ts");
/* harmony import */ var _route_resolvers_role_resolver__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./route-resolvers/role-resolver */ "./src/app/route-resolvers/role-resolver.ts");
/* harmony import */ var _route_resolvers_modified_user_resolver_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./route-resolvers/modified-user-resolver.service */ "./src/app/route-resolvers/modified-user-resolver.service.ts");
/* harmony import */ var _pipes_user_filter_pipe__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./pipes/user-filter.pipe */ "./src/app/pipes/user-filter.pipe.ts");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/progress-bar */ "./node_modules/@angular/material/esm5/progress-bar.es5.js");
/* harmony import */ var _ngx_progressbar_http__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @ngx-progressbar/http */ "./node_modules/@ngx-progressbar/http/fesm5/ngx-progressbar-http.js");
/* harmony import */ var _ngx_progressbar_core__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @ngx-progressbar/core */ "./node_modules/@ngx-progressbar/core/fesm5/ngx-progressbar-core.js");
/* harmony import */ var _ngx_progressbar_router__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @ngx-progressbar/router */ "./node_modules/@ngx-progressbar/router/fesm5/ngx-progressbar-router.js");
/* harmony import */ var _modules_app_ui_module__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./modules/app-ui.module */ "./src/app/modules/app-ui.module.ts");
/* harmony import */ var _components_point_of_sale_point_of_sale_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./components/point-of-sale/point-of-sale.component */ "./src/app/components/point-of-sale/point-of-sale.component.ts");
/* harmony import */ var _components_admin_admin_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./components/admin/admin.component */ "./src/app/components/admin/admin.component.ts");
/* harmony import */ var _components_admin_users_users_component__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./components/admin/users/users.component */ "./src/app/components/admin/users/users.component.ts");
/* harmony import */ var _components_login_login_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./components/login/login.component */ "./src/app/components/login/login.component.ts");
/* harmony import */ var _components_point_of_sale_payment_payment_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./components/point-of-sale/payment/payment.component */ "./src/app/components/point-of-sale/payment/payment.component.ts");
/* harmony import */ var _components_point_of_sale_receipt_receipt_component__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./components/point-of-sale/receipt/receipt.component */ "./src/app/components/point-of-sale/receipt/receipt.component.ts");
/* harmony import */ var _components_admin_tables_tables_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./components/admin/tables/tables.component */ "./src/app/components/admin/tables/tables.component.ts");
/* harmony import */ var _components_admin_tables_add_new_table_add_new_table_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./components/admin/tables/add-new-table/add-new-table.component */ "./src/app/components/admin/tables/add-new-table/add-new-table.component.ts");
/* harmony import */ var _components_admin_orders_orders_component__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./components/admin/orders/orders.component */ "./src/app/components/admin/orders/orders.component.ts");
/* harmony import */ var _components_admin_tables_edit_table_edit_table_component__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./components/admin/tables/edit-table/edit-table.component */ "./src/app/components/admin/tables/edit-table/edit-table.component.ts");
/* harmony import */ var _components_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./components/page-not-found/page-not-found.component */ "./src/app/components/page-not-found/page-not-found.component.ts");
/* harmony import */ var _components_new_password_new_password_component__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./components/new-password/new-password.component */ "./src/app/components/new-password/new-password.component.ts");
/* harmony import */ var _components_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./components/reset-password/reset-password.component */ "./src/app/components/reset-password/reset-password.component.ts");
/* harmony import */ var _components_forbidden_forbidden_component__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./components/forbidden/forbidden.component */ "./src/app/components/forbidden/forbidden.component.ts");
/* harmony import */ var _components_header_header_component__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./components/header/header.component */ "./src/app/components/header/header.component.ts");
/* harmony import */ var _components_admin_inventories_inventories_component__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./components/admin/inventories/inventories.component */ "./src/app/components/admin/inventories/inventories.component.ts");
/* harmony import */ var _components_admin_food_items_edit_food_item_edit_food_item_component__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./components/admin/food-items/edit-food-item/edit-food-item.component */ "./src/app/components/admin/food-items/edit-food-item/edit-food-item.component.ts");
/* harmony import */ var _components_admin_inventories_edit_inventory_item_edit_inventory_item_component__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ./components/admin/inventories/edit-inventory-item/edit-inventory-item.component */ "./src/app/components/admin/inventories/edit-inventory-item/edit-inventory-item.component.ts");
/* harmony import */ var _components_admin_food_items_add_new_food_item_add_new_food_item_component__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! ./components/admin/food-items/add-new-food-item/add-new-food-item.component */ "./src/app/components/admin/food-items/add-new-food-item/add-new-food-item.component.ts");
/* harmony import */ var _components_point_of_sale_menu_menu_component__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! ./components/point-of-sale/menu/menu.component */ "./src/app/components/point-of-sale/menu/menu.component.ts");
/* harmony import */ var _components_point_of_sale_select_table_select_table_component__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! ./components/point-of-sale/select-table/select-table.component */ "./src/app/components/point-of-sale/select-table/select-table.component.ts");
/* harmony import */ var _components_admin_tables_table_list_table_list_component__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(/*! ./components/admin/tables/table-list/table-list.component */ "./src/app/components/admin/tables/table-list/table-list.component.ts");
/* harmony import */ var _components_admin_tables_table_details_table_details_component__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(/*! ./components/admin/tables/table-details/table-details.component */ "./src/app/components/admin/tables/table-details/table-details.component.ts");
/* harmony import */ var _components_admin_orders_order_list_order_list_component__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(/*! ./components/admin/orders/order-list/order-list.component */ "./src/app/components/admin/orders/order-list/order-list.component.ts");
/* harmony import */ var _components_admin_inventories_inventory_list_inventory_list_component__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(/*! ./components/admin/inventories/inventory-list/inventory-list.component */ "./src/app/components/admin/inventories/inventory-list/inventory-list.component.ts");
/* harmony import */ var _components_admin_inventories_inventory_details_inventory_details_component__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(/*! ./components/admin/inventories/inventory-details/inventory-details.component */ "./src/app/components/admin/inventories/inventory-details/inventory-details.component.ts");
/* harmony import */ var _components_admin_inventories_update_inventory_item_update_inventory_item_component__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(/*! ./components/admin/inventories/update-inventory-item/update-inventory-item.component */ "./src/app/components/admin/inventories/update-inventory-item/update-inventory-item.component.ts");
/* harmony import */ var _components_admin_orders_order_details_order_details_component__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(/*! ./components/admin/orders/order-details/order-details.component */ "./src/app/components/admin/orders/order-details/order-details.component.ts");
/* harmony import */ var _components_admin_food_items_food_item_details_food_item_details_component__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(/*! ./components/admin/food-items/food-item-details/food-item-details.component */ "./src/app/components/admin/food-items/food-item-details/food-item-details.component.ts");
/* harmony import */ var _components_admin_food_items_food_item_list_food_item_list_component__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(/*! ./components/admin/food-items/food-item-list/food-item-list.component */ "./src/app/components/admin/food-items/food-item-list/food-item-list.component.ts");
/* harmony import */ var _components_admin_inventories_add_new_inventory_item_add_new_inventory_item_component__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(/*! ./components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component */ "./src/app/components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component.ts");
/* harmony import */ var _components_point_of_sale_session_session_component__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(/*! ./components/point-of-sale/session/session.component */ "./src/app/components/point-of-sale/session/session.component.ts");
/* harmony import */ var _components_admin_food_items_food_items_component__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(/*! ./components/admin/food-items/food-items.component */ "./src/app/components/admin/food-items/food-items.component.ts");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
/* harmony import */ var _services_shared_admin_service__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(/*! ./services/shared/admin.service */ "./src/app/services/shared/admin.service.ts");
/* harmony import */ var _http_error_interceptor_http_error_interceptor__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(/*! ./http-error-interceptor/http-error.interceptor */ "./src/app/http-error-interceptor/http-error.interceptor.ts");
/* harmony import */ var _services_data_storage_inventory_data_storage_service__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__(/*! ./services/data-storage/inventory-data-storage.service */ "./src/app/services/data-storage/inventory-data-storage.service.ts");
/* harmony import */ var ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__(/*! ng6-toastr-notifications */ "./node_modules/ng6-toastr-notifications/fesm5/ng6-toastr-notifications.js");
/* harmony import */ var _services_data_storage_food_item_data_storage_service__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__(/*! ./services/data-storage/food-item-data-storage.service */ "./src/app/services/data-storage/food-item-data-storage.service.ts");
/* harmony import */ var _services_data_storage_order_data_storage_service__WEBPACK_IMPORTED_MODULE_67__ = __webpack_require__(/*! ./services/data-storage/order-data-storage.service */ "./src/app/services/data-storage/order-data-storage.service.ts");
/* harmony import */ var _services_data_storage_account_data_storage_service__WEBPACK_IMPORTED_MODULE_68__ = __webpack_require__(/*! ./services/data-storage/account-data-storage.service */ "./src/app/services/data-storage/account-data-storage.service.ts");
/* harmony import */ var _components_admin_users_add_new_user_add_new_user_component__WEBPACK_IMPORTED_MODULE_69__ = __webpack_require__(/*! ./components/admin/users/add-new-user/add-new-user.component */ "./src/app/components/admin/users/add-new-user/add-new-user.component.ts");
/* harmony import */ var _components_admin_users_user_details_user_details_component__WEBPACK_IMPORTED_MODULE_70__ = __webpack_require__(/*! ./components/admin/users/user-details/user-details.component */ "./src/app/components/admin/users/user-details/user-details.component.ts");
/* harmony import */ var _components_admin_users_user_list_user_list_component__WEBPACK_IMPORTED_MODULE_71__ = __webpack_require__(/*! ./components/admin/users/user-list/user-list.component */ "./src/app/components/admin/users/user-list/user-list.component.ts");
/* harmony import */ var _components_admin_users_edit_user_edit_user_component__WEBPACK_IMPORTED_MODULE_72__ = __webpack_require__(/*! ./components/admin/users/edit-user/edit-user.component */ "./src/app/components/admin/users/edit-user/edit-user.component.ts");









































































var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                _components_point_of_sale_point_of_sale_component__WEBPACK_IMPORTED_MODULE_28__["PointOfSaleComponent"],
                _components_login_login_component__WEBPACK_IMPORTED_MODULE_31__["LoginComponent"],
                _components_admin_users_users_component__WEBPACK_IMPORTED_MODULE_30__["UsersComponent"],
                _components_admin_admin_component__WEBPACK_IMPORTED_MODULE_29__["AdminComponent"],
                _components_admin_inventories_inventories_component__WEBPACK_IMPORTED_MODULE_43__["InventoriesComponent"],
                _components_point_of_sale_menu_menu_component__WEBPACK_IMPORTED_MODULE_47__["MenuComponent"],
                _components_point_of_sale_menu_menu_component__WEBPACK_IMPORTED_MODULE_47__["MenuComponent"],
                _components_admin_food_items_add_new_food_item_add_new_food_item_component__WEBPACK_IMPORTED_MODULE_46__["AddNewFoodItemComponent"],
                _components_admin_food_items_edit_food_item_edit_food_item_component__WEBPACK_IMPORTED_MODULE_44__["EditFoodItemComponent"],
                _components_admin_inventories_edit_inventory_item_edit_inventory_item_component__WEBPACK_IMPORTED_MODULE_45__["EditInventoryItemComponent"],
                _pipes_filter_pipe__WEBPACK_IMPORTED_MODULE_9__["FilterPipe"],
                _components_point_of_sale_payment_payment_component__WEBPACK_IMPORTED_MODULE_32__["PaymentComponent"],
                _components_point_of_sale_receipt_receipt_component__WEBPACK_IMPORTED_MODULE_33__["ReceiptComponent"],
                _components_admin_tables_tables_component__WEBPACK_IMPORTED_MODULE_34__["TablesComponent"],
                _components_admin_tables_add_new_table_add_new_table_component__WEBPACK_IMPORTED_MODULE_35__["AddNewTableComponent"],
                _components_admin_inventories_add_new_inventory_item_add_new_inventory_item_component__WEBPACK_IMPORTED_MODULE_58__["AddNewInventoryItemComponent"],
                _components_admin_orders_orders_component__WEBPACK_IMPORTED_MODULE_36__["OrdersComponent"],
                _components_admin_orders_order_list_order_list_component__WEBPACK_IMPORTED_MODULE_51__["OrderListComponent"],
                _components_admin_orders_order_details_order_details_component__WEBPACK_IMPORTED_MODULE_55__["OrderDetailsComponent"],
                _pipes_order_pipe__WEBPACK_IMPORTED_MODULE_10__["OrderPipe"],
                _components_admin_food_items_food_items_component__WEBPACK_IMPORTED_MODULE_60__["FoodItemsComponent"],
                _components_admin_food_items_food_item_list_food_item_list_component__WEBPACK_IMPORTED_MODULE_57__["FoodItemListComponent"],
                _components_admin_food_items_food_item_details_food_item_details_component__WEBPACK_IMPORTED_MODULE_56__["FoodItemDetailsComponent"],
                _components_admin_inventories_inventory_list_inventory_list_component__WEBPACK_IMPORTED_MODULE_52__["InventoryListComponent"],
                _components_admin_inventories_inventory_details_inventory_details_component__WEBPACK_IMPORTED_MODULE_53__["InventoryDetailsComponent"],
                _components_admin_inventories_update_inventory_item_update_inventory_item_component__WEBPACK_IMPORTED_MODULE_54__["UpdateInventoryItemComponent"],
                _components_admin_tables_edit_table_edit_table_component__WEBPACK_IMPORTED_MODULE_37__["EditTableComponent"],
                _components_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_38__["PageNotFoundComponent"],
                _components_forbidden_forbidden_component__WEBPACK_IMPORTED_MODULE_41__["ForbiddenComponent"],
                _components_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_40__["ResetPasswordComponent"],
                _components_new_password_new_password_component__WEBPACK_IMPORTED_MODULE_39__["NewPasswordComponent"],
                _pipes_user_filter_pipe__WEBPACK_IMPORTED_MODULE_21__["UserFilterPipe"],
                _components_header_header_component__WEBPACK_IMPORTED_MODULE_42__["HeaderComponent"],
                _components_point_of_sale_select_table_select_table_component__WEBPACK_IMPORTED_MODULE_48__["SelectTableComponent"],
                _components_admin_tables_table_list_table_list_component__WEBPACK_IMPORTED_MODULE_49__["TableListComponent"],
                _components_admin_tables_table_details_table_details_component__WEBPACK_IMPORTED_MODULE_50__["TableDetailsComponent"],
                _components_point_of_sale_session_session_component__WEBPACK_IMPORTED_MODULE_59__["SessionComponent"],
                _components_admin_users_add_new_user_add_new_user_component__WEBPACK_IMPORTED_MODULE_69__["AddNewUserComponent"],
                _components_admin_users_user_details_user_details_component__WEBPACK_IMPORTED_MODULE_70__["UserDetailsComponent"],
                _components_admin_users_user_list_user_list_component__WEBPACK_IMPORTED_MODULE_71__["UserListComponent"],
                _components_admin_users_edit_user_edit_user_component__WEBPACK_IMPORTED_MODULE_72__["EditUserComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _modules_app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_61__["NgbModule"],
                _modules_app_ui_module__WEBPACK_IMPORTED_MODULE_27__["AppUiModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_17__["HttpClientModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_7__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormsModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_22__["BrowserAnimationsModule"],
                _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_23__["MatProgressBarModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_17__["HttpClientModule"],
                _ngx_progressbar_http__WEBPACK_IMPORTED_MODULE_24__["NgProgressHttpModule"],
                _ngx_progressbar_router__WEBPACK_IMPORTED_MODULE_26__["NgProgressRouterModule"],
                _ngx_progressbar_core__WEBPACK_IMPORTED_MODULE_25__["NgProgressModule"].withConfig({
                    color: '#6a7ce6',
                    min: 20,
                    spinner: false,
                    meteor: false
                }),
                ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_65__["ToastrModule"].forRoot()
            ],
            providers: [
                _services_shared_point_of_sale_service__WEBPACK_IMPORTED_MODULE_5__["PointOfSaleService"],
                _services_shared_admin_service__WEBPACK_IMPORTED_MODULE_62__["AdminService"],
                _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_6__["TableDataStorageService"],
                _services_data_storage_inventory_data_storage_service__WEBPACK_IMPORTED_MODULE_64__["InventoryDataStorageService"],
                _services_data_storage_food_item_data_storage_service__WEBPACK_IMPORTED_MODULE_66__["FoodItemDataStorageService"],
                _services_data_storage_order_data_storage_service__WEBPACK_IMPORTED_MODULE_67__["OrderDataStorageService"],
                _services_data_storage_account_data_storage_service__WEBPACK_IMPORTED_MODULE_68__["AccountDataStorageService"],
                _route_resolvers_table_resolver_service__WEBPACK_IMPORTED_MODULE_11__["TableResolverService"],
                _route_resolvers_order_resolver_service__WEBPACK_IMPORTED_MODULE_12__["OrderResolverService"],
                _route_resolvers_inventory_resolver_service__WEBPACK_IMPORTED_MODULE_13__["InventoryResolverService"],
                _route_resolvers_food_item_resolver_service__WEBPACK_IMPORTED_MODULE_14__["FoodItemResolverService"],
                _route_resolvers_role_resolver__WEBPACK_IMPORTED_MODULE_19__["RoleResolverService"],
                _route_resolvers_modified_user_resolver_service__WEBPACK_IMPORTED_MODULE_20__["ModifiedUserResolverService"],
                _services_shared_auth_service__WEBPACK_IMPORTED_MODULE_15__["AuthService"],
                _auth_auth_guard__WEBPACK_IMPORTED_MODULE_16__["AuthGuard"],
                {
                    provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_17__["HTTP_INTERCEPTORS"],
                    useClass: _auth_auth_interceptor__WEBPACK_IMPORTED_MODULE_18__["AuthInterceptor"],
                    multi: true
                },
                {
                    provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_17__["HTTP_INTERCEPTORS"],
                    useClass: _http_error_interceptor_http_error_interceptor__WEBPACK_IMPORTED_MODULE_63__["HttpErrorInterceptor"],
                    multi: true
                }
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/auth/auth.guard.ts":
/*!************************************!*\
  !*** ./src/app/auth/auth.guard.ts ***!
  \************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_shared_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/shared/auth.service */ "./src/app/services/shared/auth.service.ts");




var AuthGuard = /** @class */ (function () {
    function AuthGuard(router, userService) {
        this.router = router;
        this.userService = userService;
    }
    AuthGuard.prototype.canActivate = function (next, state) {
        if (localStorage.getItem('userToken') != null) {
            var roles = next.data['roles'];
            if (roles) {
                var match = this.userService.roleMatch(roles);
                if (match) {
                    return true;
                }
                else {
                    this.router.navigate(['/forbidden']);
                    return false;
                }
            }
            else {
                return true;
            }
        }
        this.router.navigate(['/login']);
        return false;
    };
    AuthGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services_shared_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"]])
    ], AuthGuard);
    return AuthGuard;
}());



/***/ }),

/***/ "./src/app/auth/auth.interceptor.ts":
/*!******************************************!*\
  !*** ./src/app/auth/auth.interceptor.ts ***!
  \******************************************/
/*! exports provided: AuthInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthInterceptor", function() { return AuthInterceptor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");




var AuthInterceptor = /** @class */ (function () {
    function AuthInterceptor(router) {
        this.router = router;
    }
    AuthInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        if (req.headers.get('No-Auth') === 'True') {
            return next.handle(req.clone());
        }
        if (localStorage.getItem('userToken') != null) {
            var clonedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' +
                    localStorage.getItem('userToken'))
            });
            return next.handle(clonedReq).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["tap"])(function (succ) { }, function (err) {
                if (err.status === 401) {
                    _this.router.navigateByUrl('/login');
                }
                if (err.status === 403) {
                    _this.router.navigateByUrl('/forbidden');
                }
            }));
        }
        else {
            this.router.navigateByUrl('/login');
        }
    };
    AuthInterceptor = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], AuthInterceptor);
    return AuthInterceptor;
}());



/***/ }),

/***/ "./src/app/components/admin/admin.component.html":
/*!*******************************************************!*\
  !*** ./src/app/components/admin/admin.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n<div class=\"row\">\r\n\r\n  <div class=\"col-xl-2\">\r\n\r\n    <div class=\"row\"\r\n         style=\"\r\n         padding-top: 5px;\r\n         padding-bottom: 5px;\">\r\n      <div class=\"col-xl-12\">\r\n        <a\r\n          style=\"\r\n          text-decoration: none;\r\n          font-size: 18px; color: black;\"\r\n          routerLink=\"inventories\"\r\n          routerLinkActive=\"active\">Inventories</a>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\"\r\n         style=\"\r\n         padding-top: 5px;\r\n         padding-bottom: 5px;\">\r\n      <div class=\"col-xl-12\">\r\n        <a\r\n          style=\"\r\n          text-decoration: none;\r\n          font-size: 18px; color: black;\"\r\n          routerLink=\"food-items\"\r\n          routerLinkActive=\"active\">Food Items</a>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\"\r\n         style=\"\r\n         padding-top: 5px;\r\n         padding-bottom: 5px;\">\r\n      <div class=\"col-xl-12\">\r\n        <a\r\n          style=\"\r\n          text-decoration: none;\r\n          font-size: 18px; color: black;\"\r\n          routerLink=\"orders\"\r\n          routerLinkActive=\"active\">Orders</a>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\"\r\n         style=\"\r\n         padding-top: 5px;\r\n         padding-bottom: 5px;\">\r\n      <div class=\"col-xl-12\">\r\n        <a\r\n          style=\"\r\n          text-decoration: none;\r\n          font-size: 18px; color: black;\"\r\n          routerLink=\"tables\"\r\n          routerLinkActive=\"active\">Tables</a>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\"\r\n         style=\"\r\n         padding-top: 5px;\r\n         padding-bottom: 5px;\">\r\n      <div class=\"col-xl-12\">\r\n        <a\r\n          style=\"\r\n          text-decoration: none;\r\n          font-size: 18px; color: black;\"\r\n          routerLink=\"users\"\r\n          routerLinkActive=\"active\">Users</a>\r\n      </div>\r\n    </div>\r\n\r\n\r\n  </div>\r\n  <div class=\"col-xl-10\">\r\n    <router-outlet></router-outlet>\r\n  </div>\r\n</div>\r\n<br><br>\r\n\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/components/admin/admin.component.scss":
/*!*******************************************************!*\
  !*** ./src/app/components/admin/admin.component.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vYWRtaW4uY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/components/admin/admin.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/components/admin/admin.component.ts ***!
  \*****************************************************/
/*! exports provided: AdminComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminComponent", function() { return AdminComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var AdminComponent = /** @class */ (function () {
    function AdminComponent() {
    }
    AdminComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-admin',
            template: __webpack_require__(/*! ./admin.component.html */ "./src/app/components/admin/admin.component.html"),
            styles: [__webpack_require__(/*! ./admin.component.scss */ "./src/app/components/admin/admin.component.scss")]
        })
    ], AdminComponent);
    return AdminComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/food-items/add-new-food-item/add-new-food-item.component.html":
/*!************************************************************************************************!*\
  !*** ./src/app/components/admin/food-items/add-new-food-item/add-new-food-item.component.html ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\" style=\"font-weight: 500;\">\r\n  <div class=\"col-xl-12\">\r\n    Add New Food Item\r\n  </div>\r\n</div>\r\n\r\n<br>\r\n\r\n<form (ngSubmit) = \"addNewFoodItem(newFoodItem)\" #newFoodItem = \"ngForm\">\r\n\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-1\">\r\n      <img [src]=\"imageUrl\"\r\n           style=\"width: 150px;\r\n            height: 150px;\">\r\n    </div>\r\n  </div>\r\n  <br>\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-1\">\r\n      <input type=\"file\"\r\n             #Image\r\n             accept=\"image/*\"\r\n             (change)=\"handleFileInput($event.target.files)\">\r\n    </div>\r\n  </div>\r\n\r\n  <br>\r\n\r\n<div class=\"row form-group\">\r\n  <div class=\"col-xl-6\">\r\n\r\n    <label>Food Item's Name</label>\r\n    <input\r\n      type=\"text\"\r\n      id=\"itemName\"\r\n      class=\"form-control\"\r\n      ngModel\r\n      name=\"itemName\"\r\n      #itemName=\"ngModel\"\r\n      required>\r\n    <p\r\n      style=\"color: red; margin-bottom: 0;\"\r\n      *ngIf=\"itemName.invalid && (itemName.dirty || itemName.touched)\">\r\n      Food item name is required!\r\n    </p>\r\n\r\n  </div>\r\n\r\n\r\n</div>\r\n\r\n\r\n<div class=\"row form-group\">\r\n  <div class=\"col-xl-3\">\r\n\r\n    <label>Selling Price</label>\r\n      <input\r\n        type=\"number\"\r\n        min=\"1\"\r\n        class=\"form-control\"\r\n        [(ngModel)] = \"sellingPrice\"\r\n        name=\"sellingPrice\"\r\n        #price=\"ngModel\"\r\n        required>\r\n    <p\r\n      style=\"color: red; margin-bottom: 0;\"\r\n      *ngIf=\"price.invalid && (price.dirty || price.touched)\">\r\n       Selling price is required!\r\n    </p>\r\n\r\n  </div>\r\n\r\n  <div class=\"col-xl-3\">\r\n    <label>Serial Number</label>\r\n    <input\r\n      type=\"text\"\r\n      id=\"serialNumber\"\r\n      class=\"form-control\"\r\n      ngModel\r\n      name=\"serialNumber\"\r\n      #serialNumber=\"ngModel\"\r\n      required>\r\n    <p\r\n      style=\"color: red; margin-bottom: 0;\"\r\n      *ngIf=\"serialNumber.invalid && (serialNumber.dirty || serialNumber.touched)\">\r\n      Serial number is required!\r\n    </p>\r\n\r\n  </div>\r\n</div>\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-xl-3\" style=\"font-weight: 500;\">\r\n    Inventory Cost: {{ inventoryCost.toFixed(3) }} BDT\r\n  </div>\r\n\r\n    <div class=\"col-md-3\"\r\n         style=\"font-weight: 500; color: #008000\"\r\n         *ngIf=\"sellingPrice-inventoryCost >= 0; else loss\">\r\n       Profit {{ (sellingPrice-inventoryCost).toFixed(3) }} BDT\r\n    </div>\r\n\r\n    <ng-template #loss>\r\n      <div class=\"col-md-3\" style=\"color: #e30000; font-weight: 500;\">\r\n        Loss {{ (inventoryCost-sellingPrice).toFixed(3) }} BDT\r\n      </div>\r\n    </ng-template>\r\n\r\n</div>\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-xl-6\">\r\n    <hr>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"row\"\r\n     style=\"font-weight: 500;\"\r\n     *ngIf=\"inventories.length === 0; else checkIfInventoryIsEmpty\">\r\n  <div class=\"col-xl-6\">\r\n    Your inventory is empty! Add items in your inventory first.\r\n  </div>\r\n</div>\r\n\r\n<br>\r\n\r\n\r\n<ng-template #checkIfInventoryIsEmpty>\r\n\r\n  <div class=\"row\" style=\"font-weight: 500;\">\r\n    <div class=\"col-xl-6\">\r\n      Build Your Recipe From Below\r\n    </div>\r\n  </div>\r\n\r\n  <form (ngSubmit) = \"addIngredients(addNewIngredients)\" #addNewIngredients = \"ngForm\">\r\n\r\n  <div class=\"row form-group\">\r\n      <div class=\"col-xl-4\">\r\n\r\n          <select\r\n            style=\"cursor: pointer;\"\r\n            id=\"inventoryId\"\r\n            class=\"form-control\"\r\n            ngModel\r\n            required\r\n            name=\"inventoryId\">\r\n            <option value=\"\" selected disabled hidden>Select Ingredients</option>\r\n            <option\r\n              style=\"cursor: pointer;\"\r\n              *ngFor=\"let inventory of inventories\"\r\n              [value]=\"inventory.Id\">\r\n              {{ inventory.Name }}\r\n            </option>\r\n          </select>\r\n\r\n      </div>\r\n\r\n      <div class=\"col-xl-2\">\r\n          <input\r\n            type=\"number\"\r\n            min=\"1\"\r\n            id=\"quantity\"\r\n            class=\"form-control\"\r\n            ngModel\r\n            name=\"quantity\"\r\n            required\r\n            placeholder=\"Quantity\">\r\n      </div>\r\n  </div>\r\n\r\n    <div class=\"row text-xl-right\">\r\n      <div class=\"col-xl-6\">\r\n        <button\r\n          [disabled]=\"addNewIngredients.invalid\"\r\n          type=\"submit\"\r\n          (click)=\"addOrRemoveCheck('Add')\"\r\n          class=\"btn btn-success\">\r\n          Add</button> &nbsp;\r\n\r\n        <button\r\n          [disabled]=\"addNewIngredients.invalid\"\r\n          type=\"submit\"\r\n          (click)=\"addOrRemoveCheck('Remove')\"\r\n          class=\"btn btn-danger\">Remove</button>\r\n      </div>\r\n    </div>\r\n\r\n    <div *ngIf=\"ingredients.length !== 0\">\r\n\r\n      <div class=\"row\" style=\"font-weight: 500;\">\r\n        <div class=\"col-xl-6\">\r\n          Ingredients List\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-xl-10\">\r\n\r\n\r\n\r\n          <table border=1 cellpadding=10 width=\"100%\">\r\n            <tr style=\"font-weight: 500;\">\r\n              <td>Product's Name</td>\r\n              <td>Product's Quantity</td>\r\n              <td>Per Unit Price</td>\r\n              <td>Sub Total</td>\r\n            </tr>\r\n\r\n            <tr\r\n              *ngFor=\"let ingredient of ingredients; let i = index\">\r\n              <td>\r\n                {{ getIngredientInfo(ingredient.InventoryId, 'Name') }}\r\n              </td>\r\n              <td>\r\n                {{ ingredient.Quantity }}\r\n                {{ getIngredientInfo(ingredient.InventoryId, 'Unit') }}\r\n              </td>\r\n              <td>\r\n                {{ getIngredientInfo(ingredient.InventoryId, 'Price') }}\r\n              </td>\r\n              <td>\r\n                <div class=\"row\">\r\n                  <div class=\"col-xl-6\">\r\n                    {{ ingredient.SubTotal.toFixed(3) }}\r\n                  </div>\r\n                  <div class=\"col-xl-6 text-xl-right\">\r\n                    <i\r\n                      style=\"cursor: pointer;\"\r\n                      title=\"Remove this ingredient\"\r\n                      (click)=\"deleteIngredient(i)\"\r\n                      class=\"fas fa-times\"></i>\r\n                  </div>\r\n                </div>\r\n\r\n\r\n              </td>\r\n\r\n\r\n            </tr>\r\n          </table>\r\n\r\n\r\n        </div>\r\n      </div>\r\n\r\n    </div>\r\n\r\n\r\n  </form>\r\n</ng-template>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-10\">\r\n      <hr>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row text-xl-right\">\r\n    <div class=\"col-xl-10\">\r\n      <button\r\n        [disabled]=\"newFoodItem.invalid || isDisabled\"\r\n        class=\"btn btn-success\" type=\"submit\">Save</button>&nbsp;\r\n      <button\r\n        routerLink=\"/admin/food-items\"\r\n        class=\"btn btn-danger\" type=\"button\">Discard</button>\r\n    </div>\r\n  </div>\r\n\r\n</form>\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/components/admin/food-items/add-new-food-item/add-new-food-item.component.scss":
/*!************************************************************************************************!*\
  !*** ./src/app/components/admin/food-items/add-new-food-item/add-new-food-item.component.scss ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vZm9vZC1pdGVtcy9hZGQtbmV3LWZvb2QtaXRlbS9hZGQtbmV3LWZvb2QtaXRlbS5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/food-items/add-new-food-item/add-new-food-item.component.ts":
/*!**********************************************************************************************!*\
  !*** ./src/app/components/admin/food-items/add-new-food-item/add-new-food-item.component.ts ***!
  \**********************************************************************************************/
/*! exports provided: AddNewFoodItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddNewFoodItemComponent", function() { return AddNewFoodItemComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ng6-toastr-notifications */ "./node_modules/ng6-toastr-notifications/fesm5/ng6-toastr-notifications.js");
/* harmony import */ var _models_food_item_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../models/food-item.model */ "./src/app/models/food-item.model.ts");
/* harmony import */ var _models_ingredient_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../models/ingredient.model */ "./src/app/models/ingredient.model.ts");
/* harmony import */ var _services_data_storage_food_item_data_storage_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../services/data-storage/food-item-data-storage.service */ "./src/app/services/data-storage/food-item-data-storage.service.ts");







var AddNewFoodItemComponent = /** @class */ (function () {
    function AddNewFoodItemComponent(route, toastr, router, foodItemDataStorageService) {
        this.route = route;
        this.toastr = toastr;
        this.router = router;
        this.foodItemDataStorageService = foodItemDataStorageService;
        this.isDisabled = false;
        this.inventories = [];
        this.ingredients = [];
        this.foodItems = [];
        this.sellingPrice = 0;
        this.inventoryCost = 0;
        this.fileToUpload = null;
        this.imageUrl = 'assets/noImage.png';
    }
    AddNewFoodItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data.
            subscribe(function (data) {
            _this.foodItems = data['foodItems'];
            _this.inventories = data['inventories'];
        });
    };
    AddNewFoodItemComponent.prototype.addOrRemoveCheck = function (specifier) {
        if (specifier === 'Add') {
            this.isAddToIngredientList = true;
        }
        else {
            this.isAddToIngredientList = false;
        }
    };
    AddNewFoodItemComponent.prototype.checkIfIngredientsExist = function (inventoryId) {
        for (var i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].InventoryId === inventoryId) {
                return i;
            }
        }
        return -1;
    };
    AddNewFoodItemComponent.prototype.getIngredientInfo = function (inventoryId, specifier) {
        var inventory = this.inventories.find(function (x) { return x.Id === inventoryId; });
        if (inventory !== undefined || inventory !== null) {
            if (specifier === 'Name') {
                return inventory.Name;
            }
            if (specifier === 'Unit') {
                return inventory.Unit;
            }
            if (specifier === 'Price') {
                return inventory.AveragePrice;
            }
        }
        return '';
    };
    AddNewFoodItemComponent.prototype.addIngredients = function (form) {
        var ingredientId = null;
        var inventoryId = +form.value.inventoryId;
        var quantity = form.value.quantity;
        var averagePrice = this.inventories.find(function (x) { return x.Id === inventoryId; }).AveragePrice;
        var subTotal = quantity * averagePrice;
        var ingredientIndex = this.checkIfIngredientsExist(inventoryId);
        if (this.isAddToIngredientList) {
            if (ingredientIndex !== -1) {
                this.ingredients[ingredientIndex].Quantity += quantity;
                this.ingredients[ingredientIndex].SubTotal += subTotal;
            }
            else {
                var ingredient = new _models_ingredient_model__WEBPACK_IMPORTED_MODULE_5__["Ingredient"](ingredientId, quantity, inventoryId, subTotal, null);
                this.ingredients.push(ingredient);
            }
            this.inventoryCost += subTotal;
        }
        else {
            if (ingredientIndex !== -1) {
                if (quantity < this.ingredients[ingredientIndex].Quantity) {
                    this.ingredients[ingredientIndex].Quantity -= quantity;
                    this.ingredients[ingredientIndex].SubTotal -= subTotal;
                    this.inventoryCost -= subTotal;
                }
                else if (quantity === this.ingredients[ingredientIndex].Quantity) {
                    this.inventoryCost -= subTotal;
                    this.deleteIngredient(ingredientIndex);
                    if (this.inventoryCost < 0) {
                        this.inventoryCost = 0;
                    }
                }
                else {
                    this.toastr.errorToastr('Quantity is too large', 'Error', {
                        newestOnTop: true,
                        showCloseButton: true
                    });
                }
            }
            else {
                this.toastr.errorToastr('This item does not exist. Add to ingredient list first', 'Error', {
                    newestOnTop: true,
                    showCloseButton: true
                });
            }
        }
        form.controls['quantity'].reset();
    };
    AddNewFoodItemComponent.prototype.handleFileInput = function (file) {
        var _this = this;
        var fileExtension = file.item(0).name.split('.').pop();
        if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
            this.fileToUpload = file.item(0);
            var reader = new FileReader();
            reader.onload = function (event) {
                _this.imageUrl = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        }
        else {
            this.imageUrl = 'assets/noImage.png';
            this.toastr.errorToastr('Unsupported file format', 'Error', {
                toastLife: 10000,
                newestOnTop: true,
                showCloseButton: true
            });
        }
    };
    AddNewFoodItemComponent.prototype.deleteIngredient = function (index) {
        this.inventoryCost -= this.ingredients[index].SubTotal;
        this.ingredients.splice(index, 1);
    };
    AddNewFoodItemComponent.prototype.addNewFoodItem = function (form) {
        var _this = this;
        var serialNumber = form.value.serialNumber;
        if (this.foodItems.filter(function (e) { return e.SerialNumber === serialNumber; }).length > 0) {
            this.toastr.errorToastr('Duplicate serial number', 'Error', {
                toastTimeout: 10000,
                newestOnTop: true,
                showCloseButton: true
            });
            return;
        }
        this.isDisabled = true;
        var name = form.value.itemName;
        var sellingPrice = form.value.sellingPrice;
        var profit = sellingPrice - this.inventoryCost;
        var foodItem = new _models_food_item_model__WEBPACK_IMPORTED_MODULE_4__["FoodItem"](null, serialNumber, name, sellingPrice, this.inventoryCost, profit, 0, null, this.ingredients);
        this.foodItemDataStorageService.addNewFoodItem(foodItem)
            .subscribe(function (foodItemId) {
            if (_this.imageUrl !== 'assets/noImage.png') {
                _this.foodItemDataStorageService.uploadFoodItemImage(foodItemId, _this.fileToUpload)
                    .subscribe(function (data) {
                    _this.imageUrl = '/assets/noImage.png';
                    form.reset();
                    _this.toastr.successToastr('Added to shop', 'Success', {
                        toastTimeout: 10000,
                        newestOnTop: true,
                        showCloseButton: true
                    });
                    _this.router.navigate(['admin/food-items/', foodItemId]);
                });
            }
            else {
                form.reset();
                _this.toastr.successToastr('Added to shop', 'Success', {
                    toastTimeout: 10000,
                    newestOnTop: true,
                    showCloseButton: true
                });
                _this.router.navigate(['admin/food-items/', foodItemId]);
            }
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('Image'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], AddNewFoodItemComponent.prototype, "Image", void 0);
    AddNewFoodItemComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-add-new-food-item',
            template: __webpack_require__(/*! ./add-new-food-item.component.html */ "./src/app/components/admin/food-items/add-new-food-item/add-new-food-item.component.html"),
            styles: [__webpack_require__(/*! ./add-new-food-item.component.scss */ "./src/app/components/admin/food-items/add-new-food-item/add-new-food-item.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_3__["ToastrManager"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services_data_storage_food_item_data_storage_service__WEBPACK_IMPORTED_MODULE_6__["FoodItemDataStorageService"]])
    ], AddNewFoodItemComponent);
    return AddNewFoodItemComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/food-items/edit-food-item/edit-food-item.component.html":
/*!******************************************************************************************!*\
  !*** ./src/app/components/admin/food-items/edit-food-item/edit-food-item.component.html ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\" style=\"font-weight: 500;\">\r\n  <div class=\"col-xl-12\">\r\n    Edit Information of {{ foodItem.Name }}\r\n  </div>\r\n</div>\r\n\r\n<br>\r\n\r\n<form (ngSubmit) = \"editFoodItem(newFoodItem)\" #newFoodItem = \"ngForm\">\r\n\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-1\">\r\n      <img [src]=\"imageUrl\"\r\n           style=\"width: 150px;\r\n            height: 150px;\">\r\n    </div>\r\n  </div>\r\n  <br>\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-1\">\r\n      <input type=\"file\"\r\n             #Image\r\n             accept=\"image/*\"\r\n             (change)=\"handleFileInput($event.target.files)\">\r\n    </div>\r\n  </div>\r\n\r\n  <br>\r\n\r\n  <div class=\"row form-group\">\r\n    <div class=\"col-xl-6\">\r\n\r\n      <label>Food Item's Name</label>\r\n      <input\r\n        type=\"text\"\r\n        id=\"itemName\"\r\n        class=\"form-control\"\r\n        [ngModel]=\"foodItem.Name\"\r\n        name=\"itemName\"\r\n        #itemName=\"ngModel\"\r\n        required>\r\n      <p\r\n        style=\"color: red; margin-bottom: 0;\"\r\n        *ngIf=\"itemName.invalid && (itemName.dirty || itemName.touched)\">\r\n        Food item name is required!\r\n      </p>\r\n\r\n    </div>\r\n\r\n\r\n  </div>\r\n\r\n\r\n  <div class=\"row form-group\">\r\n    <div class=\"col-xl-3\">\r\n\r\n      <label>Selling Price</label>\r\n      <input\r\n        type=\"number\"\r\n        min=\"1\"\r\n        class=\"form-control\"\r\n        [(ngModel)] = \"sellingPrice\"\r\n        name=\"sellingPrice\"\r\n        #price=\"ngModel\"\r\n        required>\r\n      <p\r\n        style=\"color: red; margin-bottom: 0;\"\r\n        *ngIf=\"price.invalid && (price.dirty || price.touched)\">\r\n        Selling price is required!\r\n      </p>\r\n\r\n    </div>\r\n\r\n    <div class=\"col-xl-3\">\r\n      <label>Serial Number</label>\r\n      <input\r\n        type=\"text\"\r\n        id=\"serialNumber\"\r\n        class=\"form-control\"\r\n        [ngModel]=\"foodItem.SerialNumber\"\r\n        name=\"serialNumber\"\r\n        #serialNumber=\"ngModel\"\r\n        required>\r\n      <p\r\n        style=\"color: red; margin-bottom: 0;\"\r\n        *ngIf=\"serialNumber.invalid && (serialNumber.dirty || serialNumber.touched)\">\r\n        Serial number is required!\r\n      </p>\r\n\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-3\" style=\"font-weight: 500;\">\r\n      Inventory Cost: {{ inventoryCost.toFixed(3) }} BDT\r\n    </div>\r\n\r\n    <div class=\"col-md-3\"\r\n         style=\"font-weight: 500; color: #008000\"\r\n         *ngIf=\"sellingPrice-inventoryCost >= 0; else loss\">\r\n      Profit {{ (sellingPrice-inventoryCost).toFixed(3) }} BDT\r\n    </div>\r\n\r\n    <ng-template #loss>\r\n      <div class=\"col-md-3\" style=\"color: #e30000; font-weight: 500;\">\r\n        Loss {{ (inventoryCost-sellingPrice).toFixed(3) }} BDT\r\n      </div>\r\n    </ng-template>\r\n\r\n  </div>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-6\">\r\n      <hr>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row\"\r\n       style=\"font-weight: 500;\"\r\n       *ngIf=\"inventories.length === 0; else checkIfInventoryIsEmpty\">\r\n    <div class=\"col-xl-6\">\r\n      Your inventory is empty! Add items in your inventory first.\r\n    </div>\r\n  </div>\r\n\r\n  <br>\r\n\r\n\r\n  <ng-template #checkIfInventoryIsEmpty>\r\n\r\n    <div class=\"row\" style=\"font-weight: 500;\">\r\n      <div class=\"col-xl-6\">\r\n        Build Your Recipe From Below\r\n      </div>\r\n    </div>\r\n\r\n    <form (ngSubmit) = \"editIngredients(addNewIngredients)\" #addNewIngredients = \"ngForm\">\r\n\r\n      <div class=\"row form-group\">\r\n        <div class=\"col-xl-4\">\r\n\r\n          <select\r\n            style=\"cursor: pointer;\"\r\n            id=\"inventoryId\"\r\n            class=\"form-control\"\r\n            ngModel\r\n            required\r\n            name=\"inventoryId\">\r\n            <option value=\"\" selected disabled hidden>Select Ingredients</option>\r\n            <option\r\n              style=\"cursor: pointer;\"\r\n              *ngFor=\"let inventory of inventories\"\r\n              [value]=\"inventory.Id\">\r\n              {{ inventory.Name }}\r\n            </option>\r\n          </select>\r\n\r\n        </div>\r\n\r\n        <div class=\"col-xl-2\">\r\n          <input\r\n            type=\"number\"\r\n            min=\"1\"\r\n            id=\"quantity\"\r\n            class=\"form-control\"\r\n            ngModel\r\n            name=\"quantity\"\r\n            required\r\n            placeholder=\"Quantity\">\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"row text-xl-right\">\r\n        <div class=\"col-xl-6\">\r\n          <button\r\n            [disabled]=\"addNewIngredients.invalid\"\r\n            type=\"submit\"\r\n            (click)=\"addOrRemoveCheck('Add')\"\r\n            class=\"btn btn-success\">\r\n            Add</button> &nbsp;\r\n\r\n          <button\r\n            [disabled]=\"addNewIngredients.invalid\"\r\n            type=\"submit\"\r\n            (click)=\"addOrRemoveCheck('Remove')\"\r\n            class=\"btn btn-danger\">Remove</button>\r\n        </div>\r\n      </div>\r\n\r\n      <div *ngIf=\"foodItem.Ingredients.length !== 0\">\r\n\r\n        <div class=\"row\" style=\"font-weight: 500;\">\r\n          <div class=\"col-xl-6\">\r\n            Ingredients List\r\n          </div>\r\n        </div>\r\n        <div class=\"row\">\r\n          <div class=\"col-xl-10\">\r\n\r\n\r\n\r\n            <table border=1 cellpadding=10 width=\"100%\">\r\n              <tr style=\"font-weight: 500;\">\r\n                <td>Product's Name</td>\r\n                <td>Product's Quantity</td>\r\n                <td>Per Unit Price</td>\r\n                <td>Sub Total</td>\r\n              </tr>\r\n\r\n              <tr\r\n                *ngFor=\"let ingredient of foodItem.Ingredients; let i = index\">\r\n                <td>\r\n                  {{ getIngredientInfo(ingredient.InventoryId, 'Name') }}\r\n                </td>\r\n                <td>\r\n                  {{ ingredient.Quantity }}\r\n                  {{ getIngredientInfo(ingredient.InventoryId, 'Unit') }}\r\n                </td>\r\n                <td>\r\n                  {{ getIngredientInfo(ingredient.InventoryId, 'Price') }}\r\n                </td>\r\n                <td>\r\n                  <div class=\"row\">\r\n                    <div class=\"col-xl-6\">\r\n                      {{ ingredient.SubTotal.toFixed(3) }}\r\n                    </div>\r\n                    <div class=\"col-xl-6 text-xl-right\">\r\n                      <i\r\n                        style=\"cursor: pointer;\"\r\n                        title=\"Remove this ingredient\"\r\n                        (click)=\"deleteIngredient(i)\"\r\n                        class=\"fas fa-times\"></i>\r\n                    </div>\r\n                  </div>\r\n\r\n\r\n                </td>\r\n\r\n\r\n              </tr>\r\n            </table>\r\n\r\n\r\n          </div>\r\n        </div>\r\n\r\n      </div>\r\n\r\n\r\n    </form>\r\n  </ng-template>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-10\">\r\n      <hr>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row text-xl-right\">\r\n    <div class=\"col-xl-10\">\r\n      <button\r\n        [disabled]=\"newFoodItem.invalid || isDisabled\"\r\n        class=\"btn btn-success\" type=\"submit\">Save</button>&nbsp;\r\n      <button\r\n        routerLink=\"/admin/food-items/{{foodItemId}}\"\r\n        class=\"btn btn-danger\" type=\"button\">Discard</button>\r\n    </div>\r\n  </div>\r\n\r\n</form>\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/components/admin/food-items/edit-food-item/edit-food-item.component.scss":
/*!******************************************************************************************!*\
  !*** ./src/app/components/admin/food-items/edit-food-item/edit-food-item.component.scss ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vZm9vZC1pdGVtcy9lZGl0LWZvb2QtaXRlbS9lZGl0LWZvb2QtaXRlbS5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/food-items/edit-food-item/edit-food-item.component.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/components/admin/food-items/edit-food-item/edit-food-item.component.ts ***!
  \****************************************************************************************/
/*! exports provided: EditFoodItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditFoodItemComponent", function() { return EditFoodItemComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _models_food_item_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../models/food-item.model */ "./src/app/models/food-item.model.ts");
/* harmony import */ var _models_ingredient_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../models/ingredient.model */ "./src/app/models/ingredient.model.ts");
/* harmony import */ var _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/data-storage/table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");
/* harmony import */ var _services_data_storage_food_item_data_storage_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../services/data-storage/food-item-data-storage.service */ "./src/app/services/data-storage/food-item-data-storage.service.ts");
/* harmony import */ var ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ng6-toastr-notifications */ "./node_modules/ng6-toastr-notifications/fesm5/ng6-toastr-notifications.js");








var EditFoodItemComponent = /** @class */ (function () {
    function EditFoodItemComponent(route, router, toastr, tableDataStorageService, foodItemDataStorageService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.toastr = toastr;
        this.tableDataStorageService = tableDataStorageService;
        this.foodItemDataStorageService = foodItemDataStorageService;
        this.isDisabled = false;
        this.inventories = [];
        this.foodItems = [];
        this.sellingPrice = 0;
        this.inventoryCost = 0;
        this.rootUrl = '';
        this.fileToUpload = null;
        this.imageUrl = '';
        this.route.params
            .subscribe(function (params) {
            _this.foodItemId = +params['foodItemId'];
        });
    }
    EditFoodItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rootUrl = this.tableDataStorageService.rootUrl + '/Content/FoodItemImages/';
        this.route.data.
            subscribe(function (data) {
            _this.foodItems = data['foodItems'];
            _this.inventories = data['inventories'];
            _this.setFoodItemImage();
        });
        this.foodItem = this.foodItems.find(function (x) { return x.Id === _this.foodItemId; });
        if (this.foodItem === undefined || this.foodItem === null) {
            this.toastr.errorToastr('Item is not found', 'Error', {
                toastLife: 10000,
                newestOnTop: true,
                showCloseButton: true
            });
            this.router.navigate(['admin/inventories']);
        }
        else {
            this.sellingPrice = this.foodItem.Price;
            this.inventoryCost = this.foodItem.InventoryCost;
        }
    };
    EditFoodItemComponent.prototype.setFoodItemImage = function () {
        for (var i = 0; i < this.foodItems.length; i++) {
            if (this.foodItems[i].Id === this.foodItemId) {
                this.foodItem = this.foodItems[i];
                if (this.foodItem.FoodItemImageName === null || this.foodItem.FoodItemImageName === '') {
                    this.imageUrl = 'assets/noImage.png';
                }
                else {
                    this.imageUrl = this.rootUrl + this.foodItem.FoodItemImageName;
                }
            }
        }
    };
    EditFoodItemComponent.prototype.addOrRemoveCheck = function (specifier) {
        if (specifier === 'Add') {
            this.isAddToIngredientList = true;
        }
        else {
            this.isAddToIngredientList = false;
        }
    };
    EditFoodItemComponent.prototype.checkIfIngredientsExist = function (inventoryId) {
        for (var i = 0; i < this.foodItem.Ingredients.length; i++) {
            if (this.foodItem.Ingredients[i].InventoryId === inventoryId) {
                return i;
            }
        }
        return -1;
    };
    EditFoodItemComponent.prototype.getIngredientInfo = function (inventoryId, specifier) {
        var inventory = this.inventories.find(function (x) { return x.Id === inventoryId; });
        if (inventory !== undefined || inventory !== null) {
            if (specifier === 'Name') {
                return inventory.Name;
            }
            if (specifier === 'Unit') {
                return inventory.Unit;
            }
            if (specifier === 'Price') {
                return inventory.AveragePrice;
            }
        }
        return '';
    };
    EditFoodItemComponent.prototype.handleFileInput = function (file) {
        var _this = this;
        var fileExtension = file.item(0).name.split('.').pop();
        if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
            this.fileToUpload = file.item(0);
            var reader = new FileReader();
            reader.onload = function (event) {
                _this.imageUrl = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        }
        else {
            this.imageUrl = 'assets/noImage.png';
            this.toastr.errorToastr('Unsupported file format', 'Error', {
                toastLife: 10000,
                newestOnTop: true,
                showCloseButton: true
            });
        }
    };
    EditFoodItemComponent.prototype.deleteIngredient = function (index) {
        this.inventoryCost -= this.foodItem.Ingredients[index].SubTotal;
        this.foodItem.Ingredients.splice(index, 1);
    };
    EditFoodItemComponent.prototype.editIngredients = function (form) {
        var ingredientId = null;
        var inventoryId = +form.value.inventoryId;
        var quantity = form.value.quantity;
        var averagePrice = this.inventories.find(function (x) { return x.Id === inventoryId; }).AveragePrice;
        var subTotal = quantity * averagePrice;
        var ingredientIndex = this.checkIfIngredientsExist(inventoryId);
        if (this.isAddToIngredientList) {
            if (ingredientIndex !== -1) {
                this.foodItem.Ingredients[ingredientIndex].Quantity += quantity;
                this.foodItem.Ingredients[ingredientIndex].SubTotal += subTotal;
            }
            else {
                var ingredient = new _models_ingredient_model__WEBPACK_IMPORTED_MODULE_4__["Ingredient"](ingredientId, quantity, inventoryId, subTotal, null);
                this.foodItem.Ingredients.push(ingredient);
            }
            this.inventoryCost += subTotal;
        }
        else {
            if (ingredientIndex !== -1) {
                if (quantity < this.foodItem.Ingredients[ingredientIndex].Quantity) {
                    this.foodItem.Ingredients[ingredientIndex].Quantity -= quantity;
                    this.foodItem.Ingredients[ingredientIndex].SubTotal -= subTotal;
                    this.inventoryCost -= subTotal;
                }
                else if (quantity === this.foodItem.Ingredients[ingredientIndex].Quantity) {
                    this.inventoryCost -= subTotal;
                    this.deleteIngredient(ingredientIndex);
                    if (this.inventoryCost < 0) {
                        this.inventoryCost = 0;
                    }
                }
                else {
                    this.toastr.errorToastr('Quantity is too large', 'Error', {
                        newestOnTop: true,
                        showCloseButton: true
                    });
                }
            }
            else {
                this.toastr.errorToastr('This item does not exist. Add to ingredient list first', 'Error', {
                    newestOnTop: true,
                    showCloseButton: true
                });
            }
        }
        form.controls['quantity'].reset();
    };
    EditFoodItemComponent.prototype.editFoodItem = function (form) {
        var _this = this;
        var serialNumber = form.value.serialNumber;
        for (var _i = 0, _a = this.foodItems; _i < _a.length; _i++) {
            var value = _a[_i];
            if (value.SerialNumber === serialNumber && value.Id !== this.foodItemId) {
                this.toastr.errorToastr('Duplicate serial number', 'Error', {
                    toastTimeout: 10000,
                    newestOnTop: true,
                    showCloseButton: true
                });
                return;
            }
        }
        this.isDisabled = true;
        var name = form.value.itemName;
        var sellingPrice = form.value.sellingPrice;
        var profit = sellingPrice - this.inventoryCost;
        for (var _b = 0, _c = this.foodItem.Ingredients; _b < _c.length; _b++) {
            var value = _c[_b];
            value.Id = null;
            value.FoodItemId = this.foodItemId;
        }
        var foodItem = new _models_food_item_model__WEBPACK_IMPORTED_MODULE_3__["FoodItem"](this.foodItemId, serialNumber, name, sellingPrice, this.inventoryCost, profit, 0, null, this.foodItem.Ingredients);
        this.foodItemDataStorageService.editFoodItem(foodItem)
            .subscribe(function (data) {
            if (_this.imageUrl !== 'assets/noImage.png' && _this.fileToUpload !== null) {
                _this.foodItemDataStorageService.
                    uploadFoodItemImage(_this.foodItemId.toString(), _this.fileToUpload)
                    .subscribe(function (response) {
                    _this.imageUrl = '/assets/noImage.png';
                    form.reset();
                    _this.toastr.successToastr('Information is updated', 'Success', {
                        toastTimeout: 10000,
                        newestOnTop: true,
                        showCloseButton: true
                    });
                    _this.router.navigate(['admin/food-items/', _this.foodItemId]);
                });
            }
            else {
                form.reset();
                _this.toastr.successToastr('Information is updated', 'Success', {
                    toastTimeout: 10000,
                    newestOnTop: true,
                    showCloseButton: true
                });
                _this.router.navigate(['admin/food-items/', _this.foodItemId]);
            }
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('Image'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], EditFoodItemComponent.prototype, "Image", void 0);
    EditFoodItemComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-edit-food-item',
            template: __webpack_require__(/*! ./edit-food-item.component.html */ "./src/app/components/admin/food-items/edit-food-item/edit-food-item.component.html"),
            styles: [__webpack_require__(/*! ./edit-food-item.component.scss */ "./src/app/components/admin/food-items/edit-food-item/edit-food-item.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_7__["ToastrManager"],
            _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_5__["TableDataStorageService"],
            _services_data_storage_food_item_data_storage_service__WEBPACK_IMPORTED_MODULE_6__["FoodItemDataStorageService"]])
    ], EditFoodItemComponent);
    return EditFoodItemComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/food-items/food-item-details/food-item-details.component.html":
/*!************************************************************************************************!*\
  !*** ./src/app/components/admin/food-items/food-item-details/food-item-details.component.html ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-xl-12\">\r\n    <h6>General Information</h6>\r\n  </div>\r\n</div>\r\n\r\n<hr>\r\n<div class=\"row\"style=\"font-weight: 500; font-size: 20px;\">\r\n  <div class=\"col-xl-12\">\r\n    Serial Number: {{ foodItem.SerialNumber }}\r\n  </div>\r\n</div>\r\n<br>\r\n\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-xl-1\">\r\n    <img [src]=\"foodItem.FoodItemImageName\"\r\n         style=\"width: 150px;height: 150px;\">\r\n  </div>\r\n</div>\r\n\r\n<br>\r\n\r\n<div class=\"row\" style=\"font-weight: 500; font-size: 17px;\">\r\n  <div class=\"col-xl-12\">\r\n    Food Item's Name: {{ foodItem.Name }}\r\n  </div>\r\n</div>\r\n\r\n\r\n\r\n<div class=\"row\"style=\"font-weight: 500; font-size: 17px;\">\r\n  <div class=\"col-xl-12\">\r\n    Selling Price: {{ foodItem.Price }} BDT\r\n  </div>\r\n</div>\r\n\r\n<br>\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-xl-12\">\r\n    Inventory Cost: {{ foodItem.InventoryCost }} BDT\r\n  </div>\r\n</div>\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-xl-12\">\r\n    Profit: {{ foodItem.Profit }} BDT\r\n  </div>\r\n</div>\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-xl-12\">\r\n    Total Sale: {{ foodItem.TotalSale }}(s)\r\n  </div>\r\n</div>\r\n\r\n\r\n\r\n\r\n\r\n<br>\r\n\r\n<div class=\"row\" *ngIf=\"foodItem.Ingredients.length === 0; else ingredientsExist\">\r\n  <div class=\"col-xl-12\" style=\"font-weight: 500;\">\r\n\r\n    No ingredients available.\r\n\r\n  </div>\r\n</div>\r\n\r\n\r\n<ng-template #ingredientsExist>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-12\">\r\n      <h6>Ingredients List</h6>\r\n    </div>\r\n  </div>\r\n\r\n\r\n\r\n\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-10\">\r\n\r\n\r\n\r\n      <table border=1 cellpadding=10 width=\"100%\">\r\n        <tr style=\"font-weight: 500;\">\r\n          <td>Product's Name</td>\r\n          <td>Product's Quantity</td>\r\n          <td>Per Unit Price</td>\r\n          <td>Sub Total</td>\r\n        </tr>\r\n\r\n        <tr\r\n          *ngFor=\"let ingredient of foodItem.Ingredients; let i = index\">\r\n          <td>\r\n            {{ getIngredientInfo(ingredient.InventoryId, 'Name') }}\r\n          </td>\r\n          <td>\r\n            {{ ingredient.Quantity }}\r\n            {{ getIngredientInfo(ingredient.InventoryId, 'Unit') }}\r\n          </td>\r\n          <td>\r\n            {{ getIngredientInfo(ingredient.InventoryId, 'Price') }}\r\n          </td>\r\n          <td>\r\n            <div class=\"row\">\r\n              <div class=\"col-xl-6\">\r\n                {{ ingredient.SubTotal.toFixed(3) }}\r\n              </div>\r\n            </div>\r\n\r\n\r\n          </td>\r\n\r\n\r\n        </tr>\r\n      </table>\r\n\r\n\r\n    </div>\r\n  </div>\r\n\r\n\r\n</ng-template>\r\n\r\n\r\n<br>\r\n\r\n<div class=\"row text-xl-left\">\r\n  <div class=\"col-xl-10\">\r\n\r\n    <button\r\n      routerLink=\"/admin/food-items/{{foodItemId}}/edit-food-item\"\r\n      class=\"btn btn-warning\">Edit</button> &nbsp;\r\n\r\n    <button\r\n      (click)=\"deleteFoodItem()\"\r\n      class=\"btn btn-danger\">Delete</button>\r\n\r\n  </div>\r\n</div>\r\n\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/components/admin/food-items/food-item-details/food-item-details.component.scss":
/*!************************************************************************************************!*\
  !*** ./src/app/components/admin/food-items/food-item-details/food-item-details.component.scss ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vZm9vZC1pdGVtcy9mb29kLWl0ZW0tZGV0YWlscy9mb29kLWl0ZW0tZGV0YWlscy5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/food-items/food-item-details/food-item-details.component.ts":
/*!**********************************************************************************************!*\
  !*** ./src/app/components/admin/food-items/food-item-details/food-item-details.component.ts ***!
  \**********************************************************************************************/
/*! exports provided: FoodItemDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FoodItemDetailsComponent", function() { return FoodItemDetailsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/data-storage/table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");
/* harmony import */ var _services_data_storage_food_item_data_storage_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/data-storage/food-item-data-storage.service */ "./src/app/services/data-storage/food-item-data-storage.service.ts");
/* harmony import */ var ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ng6-toastr-notifications */ "./node_modules/ng6-toastr-notifications/fesm5/ng6-toastr-notifications.js");






var FoodItemDetailsComponent = /** @class */ (function () {
    function FoodItemDetailsComponent(route, router, toastr, tableDataStorageService, foodItemDataStorageService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.toastr = toastr;
        this.tableDataStorageService = tableDataStorageService;
        this.foodItemDataStorageService = foodItemDataStorageService;
        this.rootUrl = '';
        this.imageUrl = 'assets/noImage.png';
        this.foodItems = [];
        this.inventories = [];
        this.route.params
            .subscribe(function (params) {
            _this.foodItemId = +params['foodItemId'];
        });
    }
    FoodItemDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rootUrl = this.tableDataStorageService.rootUrl + '/Content/FoodItemImages/';
        this.route.data.
            subscribe(function (data) {
            _this.foodItems = data['foodItems'];
            _this.inventories = data['inventories'];
            _this.setFoodItemImage();
        });
    };
    FoodItemDetailsComponent.prototype.setFoodItemImage = function () {
        for (var i = 0; i < this.foodItems.length; i++) {
            if (this.foodItems[i].Id === this.foodItemId) {
                this.foodItem = this.foodItems[i];
                if (this.foodItem.FoodItemImageName === null || this.foodItem.FoodItemImageName === '') {
                    this.foodItem.FoodItemImageName = this.imageUrl;
                }
                else {
                    this.foodItem.FoodItemImageName = this.rootUrl + this.foodItem.FoodItemImageName;
                }
            }
        }
    };
    FoodItemDetailsComponent.prototype.getIngredientInfo = function (inventoryId, specifier) {
        var inventory = this.inventories.find(function (x) { return x.Id === inventoryId; });
        if (inventory !== undefined || inventory !== null) {
            if (specifier === 'Name') {
                return inventory.Name;
            }
            if (specifier === 'Unit') {
                return inventory.Unit;
            }
            if (specifier === 'Price') {
                return inventory.AveragePrice;
            }
        }
        return '';
    };
    FoodItemDetailsComponent.prototype.confirmEvent = function () {
        var _this = this;
        this.foodItemDataStorageService.deleteFoodItem(this.foodItemId).subscribe(function (data) {
            _this.toastr.successToastr('Removed from shop', 'Success', {
                toastTimeout: 10000,
                newestOnTop: true,
                showCloseButton: true
            });
            _this.router.navigate(['admin/food-items']);
        });
    };
    FoodItemDetailsComponent.prototype.deleteFoodItem = function () {
        var dialog = confirm('Delete this item?\n' +
            'You will lose any kind of data associated with the current item!');
        if (dialog === true) {
            this.confirmEvent();
        }
    };
    FoodItemDetailsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-list-details',
            template: __webpack_require__(/*! ./food-item-details.component.html */ "./src/app/components/admin/food-items/food-item-details/food-item-details.component.html"),
            styles: [__webpack_require__(/*! ./food-item-details.component.scss */ "./src/app/components/admin/food-items/food-item-details/food-item-details.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_5__["ToastrManager"],
            _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__["TableDataStorageService"],
            _services_data_storage_food_item_data_storage_service__WEBPACK_IMPORTED_MODULE_4__["FoodItemDataStorageService"]])
    ], FoodItemDetailsComponent);
    return FoodItemDetailsComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/food-items/food-item-list/food-item-list.component.html":
/*!******************************************************************************************!*\
  !*** ./src/app/components/admin/food-items/food-item-list/food-item-list.component.html ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n\r\n\r\n<div class=\"row\" *ngIf=\"foodItems.length === 0; else notEmpty\">\r\n  <div class=\"col-md-12\">\r\n    No item is available. Click \"Add New Food\" to populate.\r\n  </div>\r\n</div>\r\n\r\n<ng-template #notEmpty>\r\n\r\n\r\n  <mat-form-field>\r\n      <input\r\n        matInput\r\n        (keyup)=\"applyFilter($event.target.value)\"\r\n        placeholder=\"Search...\">\r\n  </mat-form-field>\r\n\r\n  <div class=\"mat-elevation-z8\" style=\"box-shadow: none!important;\">\r\n    <table  mat-table [dataSource]=\"dataSource\" matSort>\r\n\r\n      <ng-container matColumnDef=\"SerialNumber\">\r\n        <th\r\n          style=\"font-size: 14px;  font-weight: 500; color: #000;\"\r\n          mat-header-cell *matHeaderCellDef mat-sort-header> SN </th>\r\n        <td\r\n          style=\"width: 5%\"\r\n          mat-cell *matCellDef=\"let row\"> {{row.SerialNumber}} </td>\r\n      </ng-container>\r\n\r\n\r\n      <ng-container matColumnDef=\"Name\">\r\n        <th\r\n          style=\"font-size: 14px; font-weight: 500; color: #000;\"\r\n          mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>\r\n        <td style=\"width: 25%\" mat-cell *matCellDef = \"let row\"> {{row.Name}} </td>\r\n      </ng-container>\r\n\r\n      <ng-container matColumnDef=\"Price\">\r\n        <th\r\n          style=\"font-size: 14px; font-weight: 500; color: #000;\"\r\n          mat-header-cell *matHeaderCellDef mat-sort-header> Price </th>\r\n        <td\r\n          style=\"width: 15%\"\r\n          mat-cell *matCellDef=\"let row\"> {{row.Price}} BDT </td>\r\n      </ng-container>\r\n\r\n      <ng-container matColumnDef=\"InventoryCost\">\r\n        <th\r\n          style=\"font-size: 14px; font-weight: 500; color: #000;\"\r\n          mat-header-cell *matHeaderCellDef mat-sort-header> Inventory Cost </th>\r\n        <td\r\n          style=\"width: 15%\"\r\n          mat-cell *matCellDef=\"let row\" > {{row.InventoryCost}} BDT </td>\r\n      </ng-container>\r\n\r\n      <ng-container matColumnDef=\"Profit\">\r\n        <th\r\n          style=\"font-size: 14px; font-weight: 500; color: #000;\"\r\n          mat-header-cell *matHeaderCellDef mat-sort-header> Profit </th>\r\n        <td\r\n          style=\"width: 15%\"\r\n          mat-cell *matCellDef=\"let row\" > {{row.Profit}} BDT</td>\r\n      </ng-container>\r\n\r\n      <ng-container matColumnDef=\"TotalSale\">\r\n        <th\r\n          style=\"font-size: 14px; font-weight: 500; color: #000;\"\r\n          mat-header-cell *matHeaderCellDef mat-sort-header> Total Sale </th>\r\n        <td\r\n          style=\"width: 10%\"\r\n          mat-cell *matCellDef=\"let row\" > {{row.TotalSale}}(s)</td>\r\n      </ng-container>\r\n\r\n      <tr mat-header-row *matHeaderRowDef=\"displayedColumns\"></tr>\r\n      <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"\r\n          style=\"cursor: pointer;\"\r\n          title=\"See details\"\r\n          routerLink=\"/admin/food-items/{{ row.Id }}\">\r\n      </tr>\r\n    </table>\r\n\r\n    <mat-paginator\r\n      [pageSizeOptions]=\"[5, 10, 25, 50]\" showFirstLastButtons></mat-paginator>\r\n  </div>\r\n\r\n</ng-template>\r\n"

/***/ }),

/***/ "./src/app/components/admin/food-items/food-item-list/food-item-list.component.scss":
/*!******************************************************************************************!*\
  !*** ./src/app/components/admin/food-items/food-item-list/food-item-list.component.scss ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "table {\n  width: 100%; }\n\n.mat-form-field {\n  font-size: 14px;\n  width: 100%; }\n\n.mat-cell {\n  border: 1px solid #ab9090;\n  text-align: center; }\n\n.mat-header-cell {\n  border: 1px solid #ab9090; }\n\n:host ::ng-deep .mat-sort-header-container {\n  display: flex;\n  justify-content: center; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9hZG1pbi9mb29kLWl0ZW1zL2Zvb2QtaXRlbS1saXN0L0Q6XFxXZWIgRGV2ZWxvcG1lbnRcXFByb2plY3RzXFxSZXN0YXVyYW50TWFuYWdlbWVudEFwcFxcUmVzdGF1cmFudE1hbmFnZW1lbnRBcHAvc3JjXFxhcHBcXGNvbXBvbmVudHNcXGFkbWluXFxmb29kLWl0ZW1zXFxmb29kLWl0ZW0tbGlzdFxcZm9vZC1pdGVtLWxpc3QuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxXQUFXLEVBQUE7O0FBR2I7RUFDRSxlQUFlO0VBQ2YsV0FBVyxFQUFBOztBQUdiO0VBQ0UseUJBQXlCO0VBQ3pCLGtCQUFrQixFQUFBOztBQUdwQjtFQUNFLHlCQUF5QixFQUFBOztBQUczQjtFQUNFLGFBQWE7RUFDYix1QkFBdUIsRUFBQSIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vZm9vZC1pdGVtcy9mb29kLWl0ZW0tbGlzdC9mb29kLWl0ZW0tbGlzdC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbInRhYmxlIHtcclxuICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuLm1hdC1mb3JtLWZpZWxkIHtcclxuICBmb250LXNpemU6IDE0cHg7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi5tYXQtY2VsbCB7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgI2FiOTA5MDtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5tYXQtaGVhZGVyLWNlbGwge1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNhYjkwOTA7XHJcbn1cclxuXHJcbjpob3N0IDo6bmctZGVlcCAubWF0LXNvcnQtaGVhZGVyLWNvbnRhaW5lciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxufVxyXG4iXX0= */"

/***/ }),

/***/ "./src/app/components/admin/food-items/food-item-list/food-item-list.component.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/components/admin/food-items/food-item-list/food-item-list.component.ts ***!
  \****************************************************************************************/
/*! exports provided: FoodItemListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FoodItemListComponent", function() { return FoodItemListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");




var FoodItemListComponent = /** @class */ (function () {
    function FoodItemListComponent(route) {
        this.route = route;
        this.foodItems = [];
        this.displayedColumns = [
            'SerialNumber',
            'Name',
            'Price',
            'InventoryCost',
            'Profit',
            'TotalSale'
        ];
    }
    FoodItemListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data.
            subscribe(function (data) {
            _this.foodItems = data['foodItems'];
            _this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatTableDataSource"](_this.foodItems);
        });
    };
    FoodItemListComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    };
    FoodItemListComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"])
    ], FoodItemListComponent.prototype, "paginator", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSort"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSort"])
    ], FoodItemListComponent.prototype, "sort", void 0);
    FoodItemListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-food-item-list',
            template: __webpack_require__(/*! ./food-item-list.component.html */ "./src/app/components/admin/food-items/food-item-list/food-item-list.component.html"),
            styles: [__webpack_require__(/*! ./food-item-list.component.scss */ "./src/app/components/admin/food-items/food-item-list/food-item-list.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"]])
    ], FoodItemListComponent);
    return FoodItemListComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/food-items/food-items.component.html":
/*!***********************************************************************!*\
  !*** ./src/app/components/admin/food-items/food-items.component.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<br>\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-xl-6\">\r\n    <h5>Manage Your Food Items</h5>\r\n  </div>\r\n  <div class=\"col-xl-6 text-xl-right\">\r\n    <button\r\n      routerLink=\"/admin/food-items/add-new-food-item\"\r\n      class=\"btn btn-success\">Add New Food</button>\r\n  </div>\r\n</div>\r\n\r\n<hr>\r\n\r\n<router-outlet></router-outlet>\r\n"

/***/ }),

/***/ "./src/app/components/admin/food-items/food-items.component.scss":
/*!***********************************************************************!*\
  !*** ./src/app/components/admin/food-items/food-items.component.scss ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@import url(\"https://fonts.googleapis.com/css?family=Acme|Aladin|Berkshire+Swash|Cabin+Sketch|Chewy|Fredoka+One|Kanit|Lobster|Londrina+Solid|Righteous|Rock+Salt\");\n.name, .price {\n  margin-top: 24px;\n  color: #ae0000;\n  font-family: \"Berlin Sans FB\";\n  font-size: 20px; }\n.whole {\n  /*margin-top: 20px;*/ }\n.sum-of-inv-body {\n  /*padding-right: 0;\r\n  padding-left: 155px;*/ }\n.f-name {\n  padding-top: 20px;\n  color: #ae0000;\n  font-family: \"Times New Roman\";\n  font-size: 15px;\n  font-weight: bold;\n  /*-webkit-box-shadow: 0px 10px 25px 0px rgba(161, 18, 18, 0.2);\r\n  -moz-box-shadow: 0px 10px 25px 0px rgba(161, 18, 18, 0.2);\r\n  box-shadow: 0px 10px 25px 0px rgba(161, 18, 18, 0.2);*/ }\n.all-categories-button {\n  width: 100%;\n  height: 100%;\n  font-family: \"Arial Narrow\";\n  color: #d32039;\n  background-color: #ffffdf;\n  border: 1.2px solid #ae0000;\n  border-radius: 5px;\n  font-size: 16px;\n  padding-top: 5px;\n  padding-bottom: 5px;\n  font-weight: bold; }\n.all-categories-button:hover {\n  background-color: #d32039;\n  color: #ffffdf;\n  font-family: \"Arial Narrow\";\n  font-weight: bold;\n  border: 1.2px solid #ffffdf;\n  border-radius: 5px; }\n.all-categories-button:focus {\n  outline: 0; }\n.header {\n  color: #770000;\n  font-size: 21px;\n  font-family: \"Berlin Sans FB\";\n  text-align: left;\n  margin-top: 10px;\n  border: 1px;\n  border-radius: 5px;\n  padding-top: 5px;\n  padding-bottom: 5px; }\n.main-row {\n  border-bottom: 2px double #dfdfdf; }\n.body {\n  height: 350px;\n  overflow-y: scroll;\n  border: 1px solid #cbc6cb;\n  border-radius: 5px; }\n::-webkit-scrollbar {\n  width: 4px; }\n::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);\n  border-radius: 10px; }\n::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  background-color: rgba(0, 0, 0, 0.61);\n  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); }\n.hodoo {\n  font-family: 'Berkshire Swash', cursive;\n  font-size: 40px;\n  text-align: right;\n  color: #7e0000; }\n.hodoo:focus {\n  outline: 0; }\n.dashboard {\n  width: 20%;\n  height: 100%;\n  font-family: \"Arial Narrow\";\n  color: #aa0909;\n  background-color: ghostwhite;\n  /*border: 1.2px solid #ae0000;\r\n  border-radius: 5px;*/\n  font-size: 16px;\n  padding-top: 5px;\n  padding-bottom: 5px;\n  font-weight: bold;\n  text-align: center;\n  margin-top: 15px; }\n.dashboard:hover {\n  color: #6a0d0e;\n  background-color: ghostwhite;\n  font-family: \"Arial Narrow\";\n  font-weight: bold;\n  /* border: 1.2px solid #ffffdf;\r\n   border-radius: 5px;*/ }\n.icons {\n  /*text-align: center;*/\n  font-size: 23px;\n  color: #bcb4b6;\n  margin-top: 10px; }\n.icons:hover {\n  /*text-align: center;*/\n  font-size: 23px;\n  color: #690e0f;\n  margin-top: 10px; }\n.list, grid {\n  text-align: right;\n  padding-left: 0;\n  padding-right: 0; }\n.grid {\n  text-align: left; }\n.icon-active {\n  color: #690e0f; }\na {\n  color: #ada5a7; }\n.add-new {\n  font-family: \"Times New Roman\";\n  width: 13%;\n  font-size: 13px;\n  color: #b50909;\n  margin-top: 10px;\n  background-color: #ffffdf;\n  border: 1px solid #6a0d0e;\n  border-radius: 5px;\n  text-align: center;\n  font-weight: bold;\n  padding-top: 4px;\n  padding-bottom: 4px;\n  margin-top: 10px; }\n.add-new:hover {\n  width: 13%;\n  font-size: 13px;\n  font-family: \"Times New Roman\";\n  color: #ffffdf;\n  margin-top: 10px;\n  background-color: #b50909;\n  border: 1px solid #ffffdf;\n  border-radius: 5px;\n  text-align: center;\n  font-weight: bold; }\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9hZG1pbi9mb29kLWl0ZW1zL0Q6XFxXZWIgRGV2ZWxvcG1lbnRcXFByb2plY3RzXFxSZXN0YXVyYW50TWFuYWdlbWVudEFwcFxcUmVzdGF1cmFudE1hbmFnZW1lbnRBcHAvc3JjXFxhcHBcXGNvbXBvbmVudHNcXGFkbWluXFxmb29kLWl0ZW1zXFxmb29kLWl0ZW1zLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9jb21wb25lbnRzL2FkbWluL2Zvb2QtaXRlbXMvZm9vZC1pdGVtcy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUE4RkEsa0tBQVk7QUE5Rlo7RUFDRSxnQkFBZ0I7RUFDaEIsY0FBYztFQUNkLDZCQUE0QjtFQUM1QixlQUFlLEVBQUE7QUFFakI7RUFDRSxvQkFBQSxFQUFxQjtBQUV2QjtFQUNFO3VCQ0VxQixFRERDO0FBRXhCO0VBQ0UsaUJBQWlCO0VBQ2pCLGNBQWM7RUFDZCw4QkFBOEI7RUFDOUIsZUFBZTtFQUNmLGlCQUFpQjtFQUNqQjs7d0RDR3NELEVEREM7QUFHekQ7RUFDRSxXQUFVO0VBQ1YsWUFBVztFQUNYLDJCQUEwQjtFQUMxQixjQUFjO0VBQ2QseUJBQXlCO0VBQ3pCLDJCQUEyQjtFQUMzQixrQkFBa0I7RUFDbEIsZUFBYztFQUNkLGdCQUFnQjtFQUNoQixtQkFBbUI7RUFDbkIsaUJBQWlCLEVBQUE7QUFJbkI7RUFDRSx5QkFBeUI7RUFDekIsY0FBYztFQUNkLDJCQUEwQjtFQUMxQixpQkFBZ0I7RUFDaEIsMkJBQTJCO0VBQzNCLGtCQUFrQixFQUFBO0FBR3BCO0VBQ0UsVUFBUyxFQUFBO0FBT1g7RUFDRSxjQUFjO0VBQ2QsZUFBZTtFQUNmLDZCQUE2QjtFQUM3QixnQkFBZ0I7RUFDaEIsZ0JBQWdCO0VBQ2hCLFdBQVU7RUFDVixrQkFBa0I7RUFDbEIsZ0JBQWdCO0VBQ2hCLG1CQUFtQixFQUFBO0FBRXJCO0VBQ0UsaUNBQWlDLEVBQUE7QUFHbkM7RUFDRSxhQUFhO0VBQ2Isa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixrQkFBa0IsRUFBQTtBQUlwQjtFQUNFLFVBQVUsRUFBQTtBQUdaO0VBQ0Usb0RBQWlEO0VBQ2pELG1CQUFtQixFQUFBO0FBR3JCO0VBQ0UsbUJBQW1CO0VBQ25CLHFDQUFxQztFQUNyQyxvREFBaUQsRUFBQTtBQUluRDtFQUNFLHVDQUF1QztFQUN2QyxlQUFjO0VBRWQsaUJBQWlCO0VBQ2pCLGNBQWMsRUFBQTtBQUdoQjtFQUNFLFVBQVUsRUFBQTtBQUdaO0VBQ0UsVUFBUztFQUNULFlBQVc7RUFDWCwyQkFBMEI7RUFDMUIsY0FBYztFQUNkLDRCQUE0QjtFQUM1QjtzQkNqQm9CO0VEbUJwQixlQUFjO0VBQ2QsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtFQUNuQixpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLGdCQUFnQixFQUFBO0FBS2xCO0VBQ0UsY0FBYztFQUNkLDRCQUE0QjtFQUM1QiwyQkFBMEI7RUFDMUIsaUJBQWdCO0VBQ2hCO3VCQ3BCcUIsRURxQkM7QUFJeEI7RUFDRSxzQkFBQTtFQUNBLGVBQWU7RUFDZixjQUFjO0VBQ2QsZ0JBQWdCLEVBQUE7QUFHbEI7RUFDRSxzQkFBQTtFQUNBLGVBQWU7RUFDZixjQUFjO0VBQ2QsZ0JBQWdCLEVBQUE7QUFHbEI7RUFDRSxpQkFBaUI7RUFDakIsZUFBZTtFQUNmLGdCQUFnQixFQUFBO0FBRWxCO0VBQ0UsZ0JBQWdCLEVBQUE7QUFHbEI7RUFDRSxjQUFjLEVBQUE7QUFFaEI7RUFDRSxjQUFjLEVBQUE7QUFFaEI7RUFDRSw4QkFBOEI7RUFDOUIsVUFBVTtFQUNWLGVBQWU7RUFDZixjQUFjO0VBQ2QsZ0JBQWdCO0VBQ2hCLHlCQUF5QjtFQUN6Qix5QkFBeUI7RUFDekIsa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixpQkFBaUI7RUFDakIsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtFQUNuQixnQkFBZ0IsRUFBQTtBQUVsQjtFQUNFLFVBQVU7RUFDVixlQUFlO0VBQ2YsOEJBQThCO0VBQzlCLGNBQWM7RUFDZCxnQkFBZ0I7RUFDaEIseUJBQXlCO0VBQ3pCLHlCQUF5QjtFQUN6QixrQkFBa0I7RUFDbEIsa0JBQWtCO0VBQ2xCLGlCQUFpQixFQUFBIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9hZG1pbi9mb29kLWl0ZW1zL2Zvb2QtaXRlbXMuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubmFtZSAsIC5wcmljZXtcclxuICBtYXJnaW4tdG9wOiAyNHB4O1xyXG4gIGNvbG9yOiAjYWUwMDAwO1xyXG4gIGZvbnQtZmFtaWx5OlwiQmVybGluIFNhbnMgRkJcIjtcclxuICBmb250LXNpemU6IDIwcHg7XHJcbn1cclxuLndob2xle1xyXG4gIC8qbWFyZ2luLXRvcDogMjBweDsqL1xyXG59XHJcbi5zdW0tb2YtaW52LWJvZHl7XHJcbiAgLypwYWRkaW5nLXJpZ2h0OiAwO1xyXG4gIHBhZGRpbmctbGVmdDogMTU1cHg7Ki9cclxufVxyXG4uZi1uYW1lIHtcclxuICBwYWRkaW5nLXRvcDogMjBweDtcclxuICBjb2xvcjogI2FlMDAwMDtcclxuICBmb250LWZhbWlseTogXCJUaW1lcyBOZXcgUm9tYW5cIjtcclxuICBmb250LXNpemU6IDE1cHg7XHJcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgLyotd2Via2l0LWJveC1zaGFkb3c6IDBweCAxMHB4IDI1cHggMHB4IHJnYmEoMTYxLCAxOCwgMTgsIDAuMik7XHJcbiAgLW1vei1ib3gtc2hhZG93OiAwcHggMTBweCAyNXB4IDBweCByZ2JhKDE2MSwgMTgsIDE4LCAwLjIpO1xyXG4gIGJveC1zaGFkb3c6IDBweCAxMHB4IDI1cHggMHB4IHJnYmEoMTYxLCAxOCwgMTgsIDAuMik7Ki9cclxufVxyXG5cclxuLmFsbC1jYXRlZ29yaWVzLWJ1dHRvbiB7XHJcbiAgd2lkdGg6MTAwJTtcclxuICBoZWlnaHQ6MTAwJTtcclxuICBmb250LWZhbWlseTpcIkFyaWFsIE5hcnJvd1wiO1xyXG4gIGNvbG9yOiAjZDMyMDM5O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZGY7XHJcbiAgYm9yZGVyOiAxLjJweCBzb2xpZCAjYWUwMDAwO1xyXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICBmb250LXNpemU6MTZweDtcclxuICBwYWRkaW5nLXRvcDogNXB4O1xyXG4gIHBhZGRpbmctYm90dG9tOiA1cHg7XHJcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbn1cclxuXHJcblxyXG4uYWxsLWNhdGVnb3JpZXMtYnV0dG9uOmhvdmVye1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNkMzIwMzk7XHJcbiAgY29sb3I6ICNmZmZmZGY7XHJcbiAgZm9udC1mYW1pbHk6XCJBcmlhbCBOYXJyb3dcIjtcclxuICBmb250LXdlaWdodDpib2xkO1xyXG4gIGJvcmRlcjogMS4ycHggc29saWQgI2ZmZmZkZjtcclxuICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbn1cclxuXHJcbi5hbGwtY2F0ZWdvcmllcy1idXR0b246Zm9jdXN7XHJcbiAgb3V0bGluZTowO1xyXG59XHJcblxyXG4uaS1jb3N0LCAuaS1wcmljZXtcclxuXHJcbn1cclxuXHJcbi5oZWFkZXJ7XHJcbiAgY29sb3I6ICM3NzAwMDA7XHJcbiAgZm9udC1zaXplOiAyMXB4O1xyXG4gIGZvbnQtZmFtaWx5OiBcIkJlcmxpbiBTYW5zIEZCXCI7XHJcbiAgdGV4dC1hbGlnbjogbGVmdDtcclxuICBtYXJnaW4tdG9wOiAxMHB4O1xyXG4gIGJvcmRlcjoxcHg7XHJcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gIHBhZGRpbmctdG9wOiA1cHg7XHJcbiAgcGFkZGluZy1ib3R0b206IDVweDtcclxufVxyXG4ubWFpbi1yb3d7XHJcbiAgYm9yZGVyLWJvdHRvbTogMnB4IGRvdWJsZSAjZGZkZmRmO1xyXG59XHJcblxyXG4uYm9keXtcclxuICBoZWlnaHQ6IDM1MHB4O1xyXG4gIG92ZXJmbG93LXk6IHNjcm9sbDtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjY2JjNmNiO1xyXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcclxufVxyXG5cclxuXHJcbjo6LXdlYmtpdC1zY3JvbGxiYXIge1xyXG4gIHdpZHRoOiA0cHg7XHJcbn1cclxuXHJcbjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xyXG4gIC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAwIDZweCByZ2JhKDAsMCwwLDAuMyk7XHJcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcclxufVxyXG5cclxuOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XHJcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNjEpO1xyXG4gIC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAwIDZweCByZ2JhKDAsMCwwLDAuNSk7XHJcbn1cclxuXHJcbkBpbXBvcnQgdXJsKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9QWNtZXxBbGFkaW58QmVya3NoaXJlK1N3YXNofENhYmluK1NrZXRjaHxDaGV3eXxGcmVkb2thK09uZXxLYW5pdHxMb2JzdGVyfExvbmRyaW5hK1NvbGlkfFJpZ2h0ZW91c3xSb2NrK1NhbHQnKTtcclxuLmhvZG9vIHtcclxuICBmb250LWZhbWlseTogJ0JlcmtzaGlyZSBTd2FzaCcsIGN1cnNpdmU7XHJcbiAgZm9udC1zaXplOjQwcHg7XHJcbiAgLy8gcGFkZGluZy1sZWZ0OiAzOHB4O1xyXG4gIHRleHQtYWxpZ246IHJpZ2h0O1xyXG4gIGNvbG9yOiAjN2UwMDAwO1xyXG59XHJcblxyXG4uaG9kb286Zm9jdXMge1xyXG4gIG91dGxpbmU6IDA7XHJcbn1cclxuXHJcbi5kYXNoYm9hcmR7XHJcbiAgd2lkdGg6MjAlO1xyXG4gIGhlaWdodDoxMDAlO1xyXG4gIGZvbnQtZmFtaWx5OlwiQXJpYWwgTmFycm93XCI7XHJcbiAgY29sb3I6ICNhYTA5MDk7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogZ2hvc3R3aGl0ZTtcclxuICAvKmJvcmRlcjogMS4ycHggc29saWQgI2FlMDAwMDtcclxuICBib3JkZXItcmFkaXVzOiA1cHg7Ki9cclxuICBmb250LXNpemU6MTZweDtcclxuICBwYWRkaW5nLXRvcDogNXB4O1xyXG4gIHBhZGRpbmctYm90dG9tOiA1cHg7XHJcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIG1hcmdpbi10b3A6IDE1cHg7XHJcbn1cclxuXHJcblxyXG5cclxuLmRhc2hib2FyZDpob3ZlcntcclxuICBjb2xvcjogIzZhMGQwZTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiBnaG9zdHdoaXRlO1xyXG4gIGZvbnQtZmFtaWx5OlwiQXJpYWwgTmFycm93XCI7XHJcbiAgZm9udC13ZWlnaHQ6Ym9sZDtcclxuICAvKiBib3JkZXI6IDEuMnB4IHNvbGlkICNmZmZmZGY7XHJcbiAgIGJvcmRlci1yYWRpdXM6IDVweDsqL1xyXG59XHJcblxyXG5cclxuLmljb25ze1xyXG4gIC8qdGV4dC1hbGlnbjogY2VudGVyOyovXHJcbiAgZm9udC1zaXplOiAyM3B4O1xyXG4gIGNvbG9yOiAjYmNiNGI2O1xyXG4gIG1hcmdpbi10b3A6IDEwcHg7XHJcbn1cclxuXHJcbi5pY29uczpob3ZlcntcclxuICAvKnRleHQtYWxpZ246IGNlbnRlcjsqL1xyXG4gIGZvbnQtc2l6ZTogMjNweDtcclxuICBjb2xvcjogIzY5MGUwZjtcclxuICBtYXJnaW4tdG9wOiAxMHB4O1xyXG59XHJcblxyXG4ubGlzdCwgZ3JpZHtcclxuICB0ZXh0LWFsaWduOiByaWdodDtcclxuICBwYWRkaW5nLWxlZnQ6IDA7XHJcbiAgcGFkZGluZy1yaWdodDogMDtcclxufVxyXG4uZ3JpZHtcclxuICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG59XHJcblxyXG4uaWNvbi1hY3RpdmV7XHJcbiAgY29sb3I6ICM2OTBlMGY7XHJcbn1cclxuYXtcclxuICBjb2xvcjogI2FkYTVhNztcclxufVxyXG4uYWRkLW5ld3tcclxuICBmb250LWZhbWlseTogXCJUaW1lcyBOZXcgUm9tYW5cIjtcclxuICB3aWR0aDogMTMlO1xyXG4gIGZvbnQtc2l6ZTogMTNweDtcclxuICBjb2xvcjogI2I1MDkwOTtcclxuICBtYXJnaW4tdG9wOiAxMHB4O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZGY7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgIzZhMGQwZTtcclxuICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gIHBhZGRpbmctdG9wOiA0cHg7XHJcbiAgcGFkZGluZy1ib3R0b206IDRweDtcclxuICBtYXJnaW4tdG9wOiAxMHB4O1xyXG59XHJcbi5hZGQtbmV3OmhvdmVye1xyXG4gIHdpZHRoOiAxMyU7XHJcbiAgZm9udC1zaXplOiAxM3B4O1xyXG4gIGZvbnQtZmFtaWx5OiBcIlRpbWVzIE5ldyBSb21hblwiO1xyXG4gIGNvbG9yOiAjZmZmZmRmO1xyXG4gIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2I1MDkwOTtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjZmZmZmRmO1xyXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbn1cclxuIiwiQGltcG9ydCB1cmwoXCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9QWNtZXxBbGFkaW58QmVya3NoaXJlK1N3YXNofENhYmluK1NrZXRjaHxDaGV3eXxGcmVkb2thK09uZXxLYW5pdHxMb2JzdGVyfExvbmRyaW5hK1NvbGlkfFJpZ2h0ZW91c3xSb2NrK1NhbHRcIik7XG4ubmFtZSwgLnByaWNlIHtcbiAgbWFyZ2luLXRvcDogMjRweDtcbiAgY29sb3I6ICNhZTAwMDA7XG4gIGZvbnQtZmFtaWx5OiBcIkJlcmxpbiBTYW5zIEZCXCI7XG4gIGZvbnQtc2l6ZTogMjBweDsgfVxuXG4ud2hvbGUge1xuICAvKm1hcmdpbi10b3A6IDIwcHg7Ki8gfVxuXG4uc3VtLW9mLWludi1ib2R5IHtcbiAgLypwYWRkaW5nLXJpZ2h0OiAwO1xyXG4gIHBhZGRpbmctbGVmdDogMTU1cHg7Ki8gfVxuXG4uZi1uYW1lIHtcbiAgcGFkZGluZy10b3A6IDIwcHg7XG4gIGNvbG9yOiAjYWUwMDAwO1xuICBmb250LWZhbWlseTogXCJUaW1lcyBOZXcgUm9tYW5cIjtcbiAgZm9udC1zaXplOiAxNXB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgLyotd2Via2l0LWJveC1zaGFkb3c6IDBweCAxMHB4IDI1cHggMHB4IHJnYmEoMTYxLCAxOCwgMTgsIDAuMik7XHJcbiAgLW1vei1ib3gtc2hhZG93OiAwcHggMTBweCAyNXB4IDBweCByZ2JhKDE2MSwgMTgsIDE4LCAwLjIpO1xyXG4gIGJveC1zaGFkb3c6IDBweCAxMHB4IDI1cHggMHB4IHJnYmEoMTYxLCAxOCwgMTgsIDAuMik7Ki8gfVxuXG4uYWxsLWNhdGVnb3JpZXMtYnV0dG9uIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgZm9udC1mYW1pbHk6IFwiQXJpYWwgTmFycm93XCI7XG4gIGNvbG9yOiAjZDMyMDM5O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmRmO1xuICBib3JkZXI6IDEuMnB4IHNvbGlkICNhZTAwMDA7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBwYWRkaW5nLXRvcDogNXB4O1xuICBwYWRkaW5nLWJvdHRvbTogNXB4O1xuICBmb250LXdlaWdodDogYm9sZDsgfVxuXG4uYWxsLWNhdGVnb3JpZXMtYnV0dG9uOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2QzMjAzOTtcbiAgY29sb3I6ICNmZmZmZGY7XG4gIGZvbnQtZmFtaWx5OiBcIkFyaWFsIE5hcnJvd1wiO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgYm9yZGVyOiAxLjJweCBzb2xpZCAjZmZmZmRmO1xuICBib3JkZXItcmFkaXVzOiA1cHg7IH1cblxuLmFsbC1jYXRlZ29yaWVzLWJ1dHRvbjpmb2N1cyB7XG4gIG91dGxpbmU6IDA7IH1cblxuLmhlYWRlciB7XG4gIGNvbG9yOiAjNzcwMDAwO1xuICBmb250LXNpemU6IDIxcHg7XG4gIGZvbnQtZmFtaWx5OiBcIkJlcmxpbiBTYW5zIEZCXCI7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIG1hcmdpbi10b3A6IDEwcHg7XG4gIGJvcmRlcjogMXB4O1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIHBhZGRpbmctdG9wOiA1cHg7XG4gIHBhZGRpbmctYm90dG9tOiA1cHg7IH1cblxuLm1haW4tcm93IHtcbiAgYm9yZGVyLWJvdHRvbTogMnB4IGRvdWJsZSAjZGZkZmRmOyB9XG5cbi5ib2R5IHtcbiAgaGVpZ2h0OiAzNTBweDtcbiAgb3ZlcmZsb3cteTogc2Nyb2xsO1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2JjNmNiO1xuICBib3JkZXItcmFkaXVzOiA1cHg7IH1cblxuOjotd2Via2l0LXNjcm9sbGJhciB7XG4gIHdpZHRoOiA0cHg7IH1cblxuOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gIC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAwIDZweCByZ2JhKDAsIDAsIDAsIDAuMyk7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7IH1cblxuOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC42MSk7XG4gIC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAwIDZweCByZ2JhKDAsIDAsIDAsIDAuNSk7IH1cblxuLmhvZG9vIHtcbiAgZm9udC1mYW1pbHk6ICdCZXJrc2hpcmUgU3dhc2gnLCBjdXJzaXZlO1xuICBmb250LXNpemU6IDQwcHg7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xuICBjb2xvcjogIzdlMDAwMDsgfVxuXG4uaG9kb286Zm9jdXMge1xuICBvdXRsaW5lOiAwOyB9XG5cbi5kYXNoYm9hcmQge1xuICB3aWR0aDogMjAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGZvbnQtZmFtaWx5OiBcIkFyaWFsIE5hcnJvd1wiO1xuICBjb2xvcjogI2FhMDkwOTtcbiAgYmFja2dyb3VuZC1jb2xvcjogZ2hvc3R3aGl0ZTtcbiAgLypib3JkZXI6IDEuMnB4IHNvbGlkICNhZTAwMDA7XHJcbiAgYm9yZGVyLXJhZGl1czogNXB4OyovXG4gIGZvbnQtc2l6ZTogMTZweDtcbiAgcGFkZGluZy10b3A6IDVweDtcbiAgcGFkZGluZy1ib3R0b206IDVweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbWFyZ2luLXRvcDogMTVweDsgfVxuXG4uZGFzaGJvYXJkOmhvdmVyIHtcbiAgY29sb3I6ICM2YTBkMGU7XG4gIGJhY2tncm91bmQtY29sb3I6IGdob3N0d2hpdGU7XG4gIGZvbnQtZmFtaWx5OiBcIkFyaWFsIE5hcnJvd1wiO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgLyogYm9yZGVyOiAxLjJweCBzb2xpZCAjZmZmZmRmO1xyXG4gICBib3JkZXItcmFkaXVzOiA1cHg7Ki8gfVxuXG4uaWNvbnMge1xuICAvKnRleHQtYWxpZ246IGNlbnRlcjsqL1xuICBmb250LXNpemU6IDIzcHg7XG4gIGNvbG9yOiAjYmNiNGI2O1xuICBtYXJnaW4tdG9wOiAxMHB4OyB9XG5cbi5pY29uczpob3ZlciB7XG4gIC8qdGV4dC1hbGlnbjogY2VudGVyOyovXG4gIGZvbnQtc2l6ZTogMjNweDtcbiAgY29sb3I6ICM2OTBlMGY7XG4gIG1hcmdpbi10b3A6IDEwcHg7IH1cblxuLmxpc3QsIGdyaWQge1xuICB0ZXh0LWFsaWduOiByaWdodDtcbiAgcGFkZGluZy1sZWZ0OiAwO1xuICBwYWRkaW5nLXJpZ2h0OiAwOyB9XG5cbi5ncmlkIHtcbiAgdGV4dC1hbGlnbjogbGVmdDsgfVxuXG4uaWNvbi1hY3RpdmUge1xuICBjb2xvcjogIzY5MGUwZjsgfVxuXG5hIHtcbiAgY29sb3I6ICNhZGE1YTc7IH1cblxuLmFkZC1uZXcge1xuICBmb250LWZhbWlseTogXCJUaW1lcyBOZXcgUm9tYW5cIjtcbiAgd2lkdGg6IDEzJTtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBjb2xvcjogI2I1MDkwOTtcbiAgbWFyZ2luLXRvcDogMTBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZkZjtcbiAgYm9yZGVyOiAxcHggc29saWQgIzZhMGQwZTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBwYWRkaW5nLXRvcDogNHB4O1xuICBwYWRkaW5nLWJvdHRvbTogNHB4O1xuICBtYXJnaW4tdG9wOiAxMHB4OyB9XG5cbi5hZGQtbmV3OmhvdmVyIHtcbiAgd2lkdGg6IDEzJTtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBmb250LWZhbWlseTogXCJUaW1lcyBOZXcgUm9tYW5cIjtcbiAgY29sb3I6ICNmZmZmZGY7XG4gIG1hcmdpbi10b3A6IDEwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNiNTA5MDk7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNmZmZmZGY7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LXdlaWdodDogYm9sZDsgfVxuIl19 */"

/***/ }),

/***/ "./src/app/components/admin/food-items/food-items.component.ts":
/*!*********************************************************************!*\
  !*** ./src/app/components/admin/food-items/food-items.component.ts ***!
  \*********************************************************************/
/*! exports provided: FoodItemsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FoodItemsComponent", function() { return FoodItemsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var FoodItemsComponent = /** @class */ (function () {
    function FoodItemsComponent() {
    }
    FoodItemsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-food-item',
            template: __webpack_require__(/*! ./food-items.component.html */ "./src/app/components/admin/food-items/food-items.component.html"),
            styles: [__webpack_require__(/*! ./food-items.component.scss */ "./src/app/components/admin/food-items/food-items.component.scss")]
        })
    ], FoodItemsComponent);
    return FoodItemsComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component.html":
/*!***********************************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component.html ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\" style=\"font-weight: 500;\">\r\n  <div class=\"col-xl-12\">\r\n    Add New Inventory Item\r\n  </div>\r\n</div>\r\n\r\n<br>\r\n\r\n\r\n<form (ngSubmit) = \"addNewInventoryItem(newInventoryItem)\" #newInventoryItem= \"ngForm\">\r\n\r\n  <div class=\"row form-group\">\r\n    <div class=\"col-xl-6\">\r\n\r\n      <label for=\"name\">Item's Name</label>\r\n      <input\r\n        type=\"text\"\r\n        id=\"name\"\r\n        class=\"form-control\"\r\n        ngModel\r\n        name=\"name\"\r\n        #name=\"ngModel\"\r\n        required>\r\n\r\n      <p\r\n        style=\"color: red; margin-bottom: 0;\"\r\n        *ngIf=\"name.invalid && (name.dirty || name.touched)\">\r\n        Item's name is required!\r\n      </p>\r\n\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row form-group\">\r\n    <div class=\"col-xl-6\">\r\n\r\n      <label for=\"unit\">Unit</label>\r\n      <input\r\n        type=\"text\"\r\n        id=\"unit\"\r\n        class=\"form-control\"\r\n        ngModel\r\n        name=\"unit\"\r\n        #unit=\"ngModel\"\r\n        required>\r\n      <p\r\n        style=\"color: red; margin-bottom: 0;\"\r\n        *ngIf=\"unit.invalid && (unit.dirty || unit.touched)\">\r\n        Unit is required!\r\n      </p>\r\n    </div>\r\n  </div>\r\n\r\n\r\n  <div class=\"row form-group\">\r\n    <div class=\"col-xl-6\">\r\n\r\n      <label for=\"quantity\">Initial Quantity</label>\r\n      <input\r\n        type=\"number\"\r\n        min=\"1\"\r\n        id=\"quantity\"\r\n        class=\"form-control\"\r\n        ngModel\r\n        name=\"quantity\"\r\n        #quantity=\"ngModel\"\r\n        required>\r\n      <p\r\n        style=\"color: red; margin-bottom: 0;\"\r\n        *ngIf=\"quantity.invalid && (quantity.dirty || quantity.touched)\">\r\n        Initial quantity is required!\r\n      </p>\r\n    </div>\r\n  </div>\r\n\r\n\r\n  <div class=\"row form-group\">\r\n    <div class=\"col-xl-6\">\r\n\r\n      <label for=\"price\">Buying Price Per Unit</label>\r\n      <input\r\n        type=\"number\"\r\n        min=\"1\"\r\n        id=\"price\"\r\n        class=\"form-control\"\r\n        ngModel\r\n        name=\"price\"\r\n        #price=\"ngModel\"\r\n        required>\r\n      <p\r\n        style=\"color: red; margin-bottom: 0;\"\r\n        *ngIf=\"price.invalid && (price.dirty || price.touched)\">\r\n        Buying price per unit  is required!\r\n      </p>\r\n\r\n    </div>\r\n  </div>\r\n\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-6\">\r\n      <hr>\r\n    </div>\r\n  </div>\r\n\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-xl-6 text-xl-right\">\r\n    <button\r\n      [disabled]=\"newInventoryItem.invalid || isDisabled\"\r\n      type=\"submit\"\r\n      class=\"btn btn-success\">Save</button>\r\n    &nbsp;\r\n    <button\r\n      type=\"button\"\r\n      routerLink=\"/admin/inventories\"\r\n      class=\"btn btn-danger\">Discard</button>\r\n  </div>\r\n</div>\r\n\r\n\r\n</form>\r\n"

/***/ }),

/***/ "./src/app/components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component.scss":
/*!***********************************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component.scss ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vaW52ZW50b3JpZXMvYWRkLW5ldy1pbnZlbnRvcnktaXRlbS9hZGQtbmV3LWludmVudG9yeS1pdGVtLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component.ts":
/*!*********************************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component.ts ***!
  \*********************************************************************************************************/
/*! exports provided: AddNewInventoryItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddNewInventoryItemComponent", function() { return AddNewInventoryItemComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ng6-toastr-notifications */ "./node_modules/ng6-toastr-notifications/fesm5/ng6-toastr-notifications.js");
/* harmony import */ var _models_inventory_history_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../models/inventory-history.model */ "./src/app/models/inventory-history.model.ts");
/* harmony import */ var _models_inventory_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../models/inventory.model */ "./src/app/models/inventory.model.ts");
/* harmony import */ var _services_shared_admin_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../services/shared/admin.service */ "./src/app/services/shared/admin.service.ts");
/* harmony import */ var _services_data_storage_inventory_data_storage_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../services/data-storage/inventory-data-storage.service */ "./src/app/services/data-storage/inventory-data-storage.service.ts");








var AddNewInventoryItemComponent = /** @class */ (function () {
    function AddNewInventoryItemComponent(router, adminService, toastr, inventoryDataStorageService) {
        this.router = router;
        this.adminService = adminService;
        this.toastr = toastr;
        this.inventoryDataStorageService = inventoryDataStorageService;
        this.isDisabled = false;
    }
    AddNewInventoryItemComponent.prototype.ngOnInit = function () {
    };
    AddNewInventoryItemComponent.prototype.addNewInventoryItem = function (form) {
        var _this = this;
        this.isDisabled = true;
        var inventoryId = null;
        var updateHistoryId = null;
        var inventoryItemName = form.value.name;
        var buyingQuantity = form.value.quantity;
        var buyingPrice = form.value.price;
        var unit = form.value.unit;
        var buyingTime = new Date().toLocaleString();
        var inventoryHistories = [new _models_inventory_history_model__WEBPACK_IMPORTED_MODULE_4__["InventoryHistory"](updateHistoryId, inventoryId, buyingQuantity, buyingTime, buyingPrice)];
        var inventory = new _models_inventory_model__WEBPACK_IMPORTED_MODULE_5__["Inventory"](inventoryId, inventoryItemName, 0, buyingQuantity, unit, buyingPrice, inventoryHistories, buyingTime);
        this.inventoryDataStorageService.addNewInventoryItem(inventory).
            subscribe(function (data) {
            _this.toastr.successToastr('Added to inventory!', 'Success', {
                toastLife: 10000,
                newestOnTop: true,
                showCloseButton: true
            });
            form.reset();
            _this.router.navigate(['admin/inventories']);
        });
    };
    AddNewInventoryItemComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-add-new-inventory',
            template: __webpack_require__(/*! ./add-new-inventory-item.component.html */ "./src/app/components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component.html"),
            styles: [__webpack_require__(/*! ./add-new-inventory-item.component.scss */ "./src/app/components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services_shared_admin_service__WEBPACK_IMPORTED_MODULE_6__["AdminService"],
            ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_3__["ToastrManager"],
            _services_data_storage_inventory_data_storage_service__WEBPACK_IMPORTED_MODULE_7__["InventoryDataStorageService"]])
    ], AddNewInventoryItemComponent);
    return AddNewInventoryItemComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/inventories/edit-inventory-item/edit-inventory-item.component.html":
/*!*****************************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/edit-inventory-item/edit-inventory-item.component.html ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<div class=\"row\" style=\"font-weight: 500;\">\r\n  <div class=\"col-xl-12\">\r\n    Edit Information of {{ inventory.Name }}\r\n  </div>\r\n</div>\r\n\r\n<br>\r\n\r\n\r\n<form (ngSubmit) = \"onEditInventoryItem(editInventoryItem)\" #editInventoryItem= \"ngForm\">\r\n\r\n  <div class=\"row form-group\">\r\n    <div class=\"col-xl-6\">\r\n\r\n      <label for=\"name\">Item's Name</label>\r\n      <input\r\n        type=\"text\"\r\n        id=\"name\"\r\n        class=\"form-control\"\r\n        [ngModel]=\"inventory.Name\"\r\n        name=\"name\"\r\n        #name=\"ngModel\"\r\n        required>\r\n\r\n      <p\r\n        style=\"color: red; margin-bottom: 0;\"\r\n        *ngIf=\"name.invalid && (name.dirty || name.touched)\">\r\n        Item's name is required!\r\n      </p>\r\n\r\n    </div>\r\n  </div>\r\n\r\n\r\n\r\n\r\n\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-6 text-xl-right\">\r\n      <button\r\n        [disabled]=\"editInventoryItem.invalid || isDisabled\"\r\n        type=\"submit\"\r\n        class=\"btn btn-success\">Save</button>\r\n      &nbsp;\r\n      <button\r\n        type=\"button\"\r\n        routerLink=\"/admin/inventories/{{inventoryId}}\"\r\n        class=\"btn btn-danger\">Discard</button>\r\n    </div>\r\n  </div>\r\n\r\n\r\n</form>\r\n"

/***/ }),

/***/ "./src/app/components/admin/inventories/edit-inventory-item/edit-inventory-item.component.scss":
/*!*****************************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/edit-inventory-item/edit-inventory-item.component.scss ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vaW52ZW50b3JpZXMvZWRpdC1pbnZlbnRvcnktaXRlbS9lZGl0LWludmVudG9yeS1pdGVtLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/components/admin/inventories/edit-inventory-item/edit-inventory-item.component.ts":
/*!***************************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/edit-inventory-item/edit-inventory-item.component.ts ***!
  \***************************************************************************************************/
/*! exports provided: EditInventoryItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditInventoryItemComponent", function() { return EditInventoryItemComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _models_inventory_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../models/inventory.model */ "./src/app/models/inventory.model.ts");
/* harmony import */ var _services_data_storage_inventory_data_storage_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/data-storage/inventory-data-storage.service */ "./src/app/services/data-storage/inventory-data-storage.service.ts");
/* harmony import */ var ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ng6-toastr-notifications */ "./node_modules/ng6-toastr-notifications/fesm5/ng6-toastr-notifications.js");






var EditInventoryItemComponent = /** @class */ (function () {
    function EditInventoryItemComponent(route, router, toastr, inventoryDataStorageService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.toastr = toastr;
        this.inventoryDataStorageService = inventoryDataStorageService;
        this.isDisabled = false;
        this.inventories = [];
        this.route.params
            .subscribe(function (params) {
            _this.inventoryId = +params['inventoryId'];
        });
    }
    EditInventoryItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data.
            subscribe(function (data) {
            _this.inventories = data['inventories'];
            _this.inventory = _this.inventories.find(function (x) { return x.Id === _this.inventoryId; });
            if (_this.inventory === undefined || _this.inventory === null) {
                window.alert('Item not found!');
                _this.router.navigate(['admin/inventories']);
            }
        });
    };
    EditInventoryItemComponent.prototype.onEditInventoryItem = function (form) {
        var _this = this;
        this.isDisabled = true;
        var editedInventoryItemName = form.value.name;
        if (editedInventoryItemName !== this.inventory.Name) {
            var editedInventoryItem = new _models_inventory_model__WEBPACK_IMPORTED_MODULE_3__["Inventory"](this.inventoryId, editedInventoryItemName, 0, 0, '', 0, [], '');
            this.inventoryDataStorageService.editInventoryItem(editedInventoryItem).
                subscribe(function (data) {
                _this.toastr.successToastr('Information updated!', 'Success', {
                    toastLife: 10000,
                    newestOnTop: true,
                    showCloseButton: true
                });
                form.reset();
                _this.router.navigate(['admin/inventories', _this.inventoryId]);
            });
        }
        else {
            this.toastr.successToastr('Information updated!', 'Success', {
                toastLife: 10000,
                newestOnTop: true,
                showCloseButton: true
            });
            this.router.navigate(['admin/inventories', this.inventoryId]);
        }
    };
    EditInventoryItemComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-edit-inventory-item',
            template: __webpack_require__(/*! ./edit-inventory-item.component.html */ "./src/app/components/admin/inventories/edit-inventory-item/edit-inventory-item.component.html"),
            styles: [__webpack_require__(/*! ./edit-inventory-item.component.scss */ "./src/app/components/admin/inventories/edit-inventory-item/edit-inventory-item.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_5__["ToastrManager"],
            _services_data_storage_inventory_data_storage_service__WEBPACK_IMPORTED_MODULE_4__["InventoryDataStorageService"]])
    ], EditInventoryItemComponent);
    return EditInventoryItemComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/inventories/inventories.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/components/admin/inventories/inventories.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<br>\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-xl-6\">\r\n    <h5>Manage Your Inventories</h5>\r\n  </div>\r\n  <div class=\"col-xl-6 text-xl-right\">\r\n    <button\r\n      routerLink=\"/admin/inventories/add-new-inventory-item\"\r\n      class=\"btn btn-success\">Add New Item</button>\r\n  </div>\r\n</div>\r\n\r\n<hr>\r\n\r\n<router-outlet></router-outlet>\r\n"

/***/ }),

/***/ "./src/app/components/admin/inventories/inventories.component.scss":
/*!*************************************************************************!*\
  !*** ./src/app/components/admin/inventories/inventories.component.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vaW52ZW50b3JpZXMvaW52ZW50b3JpZXMuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/components/admin/inventories/inventories.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/components/admin/inventories/inventories.component.ts ***!
  \***********************************************************************/
/*! exports provided: InventoriesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoriesComponent", function() { return InventoriesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var InventoriesComponent = /** @class */ (function () {
    function InventoriesComponent() {
    }
    InventoriesComponent.prototype.ngOnInit = function () {
    };
    InventoriesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-inventory',
            template: __webpack_require__(/*! ./inventories.component.html */ "./src/app/components/admin/inventories/inventories.component.html"),
            styles: [__webpack_require__(/*! ./inventories.component.scss */ "./src/app/components/admin/inventories/inventories.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], InventoriesComponent);
    return InventoriesComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/inventories/inventory-details/inventory-details.component.html":
/*!*************************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/inventory-details/inventory-details.component.html ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<div class=\"row\">\r\n  <div class=\"col-xl-12\">\r\n    <h6>General Information</h6>\r\n  </div>\r\n</div>\r\n\r\n<hr>\r\n\r\n<div class=\"row\" style=\"font-weight: 500; font-size: 20px;\">\r\n  <div class=\"col-xl-12\">\r\n    Product's Name: {{ inventory.Name }}\r\n  </div>\r\n</div>\r\n\r\n<div class=\"row\"style=\"font-weight: 500; font-size: 17px;\">\r\n  <div class=\"col-xl-12\">\r\n    Average Price: {{ inventory.AveragePrice }} BDT\r\n  </div>\r\n</div>\r\n<br>\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-md-12\">\r\n    Available Quantity: {{ inventory.RemainingQuantity }} {{ inventory.Unit }} (s)\r\n  </div>\r\n</div>\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-md-12\">\r\n    Used Quantity: {{ inventory.UsedQuantity }} {{ inventory.Unit }} (s)\r\n  </div>\r\n</div>\r\n\r\n<br>\r\n\r\n<div class=\"row text-xl-left\">\r\n  <div class=\"col-xl-10\">\r\n\r\n    <button\r\n      routerLink=\"/admin/inventories/{{inventoryId}}/update-inventory-item\"\r\n      class=\"btn btn-info\">Update</button> &nbsp;\r\n\r\n    <button\r\n      routerLink=\"/admin/inventories/{{inventoryId}}/edit-inventory-item\"\r\n      class=\"btn btn-warning\">Edit</button> &nbsp;\r\n\r\n    <button\r\n      (click)=\"deleteInventoryItem()\"\r\n      class=\"btn btn-danger\">Delete</button>\r\n\r\n  </div>\r\n</div>\r\n\r\n<br>\r\n<div class=\"row\">\r\n  <div class=\"col-xl-12\">\r\n    <h6>Update Histories</h6>\r\n  </div>\r\n</div>\r\n\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-xl-10\">\r\n\r\n    <table border=1 cellpadding=10 width=\"100%\">\r\n      <tr style=\"font-weight: 500;\">\r\n        <td>Product's Quantity</td>\r\n        <td>Product's Unit</td>\r\n        <td>Buying Price</td>\r\n        <td>Buying Date</td>\r\n      </tr>\r\n\r\n      <tr\r\n        *ngFor=\"let inventoryHistory of inventory.InventoryHistory\r\n         | paginate: { itemsPerPage: 3, currentPage: pageNumber }\">\r\n        <td>\r\n          {{ inventoryHistory.BuyingQuantity }}\r\n        </td>\r\n        <td >\r\n          {{ inventory.Unit }}\r\n        </td>\r\n        <td>\r\n          {{ inventoryHistory.BuyingPrice }}\r\n        </td>\r\n        <td>\r\n          {{ inventoryHistory.BuyingTime }}\r\n        </td>\r\n      </tr>\r\n    </table>\r\n\r\n\r\n\r\n  </div>\r\n</div>\r\n\r\n<br>\r\n\r\n<div class=\"row text-xl-right\">\r\n  <div class=\"col-xl-10\">\r\n    <pagination-controls\r\n      class=\"my-pagination\"\r\n      [autoHide]=\"true\"\r\n      (pageChange)=\"pageNumber = $event\"></pagination-controls>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/admin/inventories/inventory-details/inventory-details.component.scss":
/*!*************************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/inventory-details/inventory-details.component.scss ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".my-pagination /deep/ .ngx-pagination a, .ngx-pagination button {\n  text-decoration: none;\n  outline: 0; }\n\n.my-pagination /deep/ .ngx-pagination {\n  padding-left: 0; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9hZG1pbi9pbnZlbnRvcmllcy9pbnZlbnRvcnktZGV0YWlscy9EOlxcV2ViIERldmVsb3BtZW50XFxQcm9qZWN0c1xcUmVzdGF1cmFudE1hbmFnZW1lbnRBcHBcXFJlc3RhdXJhbnRNYW5hZ2VtZW50QXBwL3NyY1xcYXBwXFxjb21wb25lbnRzXFxhZG1pblxcaW52ZW50b3JpZXNcXGludmVudG9yeS1kZXRhaWxzXFxpbnZlbnRvcnktZGV0YWlscy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHFCQUFxQjtFQUNyQixVQUFVLEVBQUE7O0FBR1o7RUFDRSxlQUFlLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9jb21wb25lbnRzL2FkbWluL2ludmVudG9yaWVzL2ludmVudG9yeS1kZXRhaWxzL2ludmVudG9yeS1kZXRhaWxzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLm15LXBhZ2luYXRpb24gL2RlZXAvIC5uZ3gtcGFnaW5hdGlvbiBhLCAubmd4LXBhZ2luYXRpb24gYnV0dG9ue1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICBvdXRsaW5lOiAwO1xyXG59XHJcblxyXG4ubXktcGFnaW5hdGlvbiAvZGVlcC8ubmd4LXBhZ2luYXRpb257XHJcbiAgcGFkZGluZy1sZWZ0OiAwO1xyXG59XHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/components/admin/inventories/inventory-details/inventory-details.component.ts":
/*!***********************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/inventory-details/inventory-details.component.ts ***!
  \***********************************************************************************************/
/*! exports provided: InventoryDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryDetailsComponent", function() { return InventoryDetailsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ng6-toastr-notifications */ "./node_modules/ng6-toastr-notifications/fesm5/ng6-toastr-notifications.js");
/* harmony import */ var _services_data_storage_inventory_data_storage_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/data-storage/inventory-data-storage.service */ "./src/app/services/data-storage/inventory-data-storage.service.ts");





var InventoryDetailsComponent = /** @class */ (function () {
    function InventoryDetailsComponent(router, route, toastr, inventoryDataStorageService) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.toastr = toastr;
        this.inventoryDataStorageService = inventoryDataStorageService;
        this.inventories = [];
        this.pageNumber = 1;
        this.route.params
            .subscribe(function (params) {
            _this.inventoryId = +params['inventoryId'];
        });
    }
    InventoryDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data.
            subscribe(function (data) {
            _this.inventories = data['inventories'];
            _this.inventory = _this.inventories.find(function (x) { return x.Id === _this.inventoryId; });
            if (_this.inventory === undefined) {
                window.alert('Item not found!');
                _this.router.navigate(['admin/inventories']);
            }
        });
    };
    InventoryDetailsComponent.prototype.deleteInventoryItem = function () {
        var dialog = confirm('Delete this item?\n' +
            'You will lose any kind of data associated with the current item!');
        if (dialog) {
            this.confirmEvent();
        }
    };
    InventoryDetailsComponent.prototype.confirmEvent = function () {
        var _this = this;
        this.inventoryDataStorageService.deleteInventoryItem(this.inventoryId).
            subscribe(function (data) {
            _this.toastr.successToastr('Removed from shop', 'Success!', {
                toastTimeout: 10000,
                newestOnTop: true,
                showCloseButton: true
            });
            _this.router.navigate(['admin/inventories']);
        });
    };
    InventoryDetailsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-inventory-details',
            template: __webpack_require__(/*! ./inventory-details.component.html */ "./src/app/components/admin/inventories/inventory-details/inventory-details.component.html"),
            styles: [__webpack_require__(/*! ./inventory-details.component.scss */ "./src/app/components/admin/inventories/inventory-details/inventory-details.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_3__["ToastrManager"],
            _services_data_storage_inventory_data_storage_service__WEBPACK_IMPORTED_MODULE_4__["InventoryDataStorageService"]])
    ], InventoryDetailsComponent);
    return InventoryDetailsComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/inventories/inventory-list/inventory-list.component.html":
/*!*******************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/inventory-list/inventory-list.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n\r\n<div class=\"row\" *ngIf=\"inventories.length === 0; else notEmpty\">\r\n  <div class=\"col-md-12\">\r\n    No item is available. Click \"Add New Item\" to populate.\r\n  </div>\r\n</div>\r\n\r\n<ng-template #notEmpty>\r\n\r\n\r\n  <mat-form-field>\r\n    <input\r\n      style=\"width: 100%;\"\r\n      matInput\r\n      (keyup)=\"applyFilter($event.target.value)\"\r\n      placeholder=\"Search...\">\r\n  </mat-form-field>\r\n\r\n  <div class=\"mat-elevation-z8\" style=\"box-shadow: none!important;\">\r\n    <table  mat-table [dataSource]=\"dataSource\" matSort>\r\n\r\n      <ng-container matColumnDef=\"Name\">\r\n        <th\r\n          style=\"font-size: 14px; font-weight: 500; color: #000;\"\r\n          mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>\r\n        <td\r\n          style=\"width: 25%\"\r\n          mat-cell *matCellDef=\"let row\"> {{row.Name}} </td>\r\n      </ng-container>\r\n\r\n\r\n      <ng-container matColumnDef=\"AveragePrice\">\r\n        <th\r\n          style=\"font-size: 14px; font-weight: 500; color: #000;\"\r\n          mat-header-cell *matHeaderCellDef mat-sort-header> Price </th>\r\n        <td style=\"width: 20%\" mat-cell *matCellDef = \"let row\"> {{row.AveragePrice}} BDT </td>\r\n      </ng-container>\r\n\r\n      <ng-container matColumnDef=\"Unit\">\r\n        <th\r\n          style=\"font-size: 14px; font-weight: 500; color: #000;\"\r\n          mat-header-cell *matHeaderCellDef mat-sort-header> Unit </th>\r\n        <td\r\n          style=\"width: 20%\"\r\n          mat-cell *matCellDef=\"let row\"> {{row.Unit}} </td>\r\n      </ng-container>\r\n\r\n      <ng-container matColumnDef=\"RemainingQuantity\">\r\n        <th\r\n          style=\"font-size: 14px; font-weight: 500; color: #000;\"\r\n          mat-header-cell *matHeaderCellDef mat-sort-header> Remaining </th>\r\n        <td\r\n          style=\"width: 20%\"\r\n          mat-cell *matCellDef=\"let row\" > {{row.RemainingQuantity}} </td>\r\n      </ng-container>\r\n\r\n      <ng-container matColumnDef=\"UsedQuantity\">\r\n        <th\r\n          style=\"font-size: 14px; font-weight: 500; color: #000;\"\r\n          mat-header-cell *matHeaderCellDef mat-sort-header> Used </th>\r\n        <td\r\n          style=\"width: 20%\"\r\n          mat-cell *matCellDef=\"let row\" > {{row.UsedQuantity}} </td>\r\n      </ng-container>\r\n\r\n      <tr mat-header-row *matHeaderRowDef=\"displayedColumns\"></tr>\r\n      <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"\r\n          style=\"cursor: pointer;\"\r\n          title=\"See details\"\r\n          routerLink=\"/admin/inventories/{{ row.Id }}\">\r\n      </tr>\r\n    </table>\r\n\r\n    <mat-paginator\r\n      [pageSizeOptions]=\"[5, 10, 25, 50]\" showFirstLastButtons></mat-paginator>\r\n  </div>\r\n\r\n</ng-template>\r\n"

/***/ }),

/***/ "./src/app/components/admin/inventories/inventory-list/inventory-list.component.scss":
/*!*******************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/inventory-list/inventory-list.component.scss ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "table {\n  width: 100%; }\n\n.mat-form-field {\n  font-size: 14px;\n  width: 100%; }\n\n.mat-cell {\n  border: 1px solid #ab9090;\n  text-align: center; }\n\n.mat-header-cell {\n  border: 1px solid #ab9090; }\n\n:host ::ng-deep .mat-sort-header-container {\n  display: flex;\n  justify-content: center; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9hZG1pbi9pbnZlbnRvcmllcy9pbnZlbnRvcnktbGlzdC9EOlxcV2ViIERldmVsb3BtZW50XFxQcm9qZWN0c1xcUmVzdGF1cmFudE1hbmFnZW1lbnRBcHBcXFJlc3RhdXJhbnRNYW5hZ2VtZW50QXBwL3NyY1xcYXBwXFxjb21wb25lbnRzXFxhZG1pblxcaW52ZW50b3JpZXNcXGludmVudG9yeS1saXN0XFxpbnZlbnRvcnktbGlzdC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFdBQVcsRUFBQTs7QUFHYjtFQUNFLGVBQWU7RUFDZixXQUFXLEVBQUE7O0FBR2I7RUFDRSx5QkFBeUI7RUFDekIsa0JBQWtCLEVBQUE7O0FBR3BCO0VBQ0UseUJBQXlCLEVBQUE7O0FBRzNCO0VBQ0UsYUFBYTtFQUNiLHVCQUF1QixFQUFBIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9hZG1pbi9pbnZlbnRvcmllcy9pbnZlbnRvcnktbGlzdC9pbnZlbnRvcnktbGlzdC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbInRhYmxlIHtcclxuICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuLm1hdC1mb3JtLWZpZWxkIHtcclxuICBmb250LXNpemU6IDE0cHg7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi5tYXQtY2VsbCB7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgI2FiOTA5MDtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5tYXQtaGVhZGVyLWNlbGwge1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNhYjkwOTA7XHJcbn1cclxuXHJcbjpob3N0IDo6bmctZGVlcCAubWF0LXNvcnQtaGVhZGVyLWNvbnRhaW5lciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxufVxyXG4iXX0= */"

/***/ }),

/***/ "./src/app/components/admin/inventories/inventory-list/inventory-list.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/inventory-list/inventory-list.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: InventoryListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryListComponent", function() { return InventoryListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");






var InventoryListComponent = /** @class */ (function () {
    function InventoryListComponent(route) {
        this.route = route;
        this.inventories = [];
        this.displayedColumns = [
            'Name',
            'AveragePrice',
            'Unit',
            'RemainingQuantity',
            'UsedQuantity'
        ];
    }
    InventoryListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data
            .subscribe(function (data) {
            _this.inventories = data['inventories'];
            _this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatTableDataSource"](_this.inventories);
        });
    };
    InventoryListComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    };
    InventoryListComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"])
    ], InventoryListComponent.prototype, "paginator", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSort"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSort"])
    ], InventoryListComponent.prototype, "sort", void 0);
    InventoryListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-inventory-list',
            template: __webpack_require__(/*! ./inventory-list.component.html */ "./src/app/components/admin/inventories/inventory-list/inventory-list.component.html"),
            styles: [__webpack_require__(/*! ./inventory-list.component.scss */ "./src/app/components/admin/inventories/inventory-list/inventory-list.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]])
    ], InventoryListComponent);
    return InventoryListComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/inventories/update-inventory-item/update-inventory-item.component.html":
/*!*********************************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/update-inventory-item/update-inventory-item.component.html ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n<div class=\"row\" style=\"font-weight: 500;\">\r\n  <div class=\"col-xl-12\">\r\n    Add new quantity for {{ inventory.Name }}\r\n  </div>\r\n</div>\r\n\r\n<br>\r\n\r\n\r\n<form (ngSubmit) = \"onUpdateInventoryItem(updateInventoryItem)\" #updateInventoryItem = \"ngForm\">\r\n\r\n  <div class=\"row form-group\">\r\n    <div class=\"col-xl-6\">\r\n\r\n        <label for=\"quantity\">Buying Quantity</label>\r\n        <input\r\n          min=\"1\"\r\n          type=\"number\"\r\n          id=\"quantity\"\r\n          class=\"form-control\"\r\n          ngModel\r\n          name=\"quantity\"\r\n          #quantity=\"ngModel\"\r\n          required>\r\n      <p\r\n        style=\"color: red; margin-bottom: 0;\"\r\n        *ngIf=\"quantity.invalid && (quantity.dirty || quantity.touched)\">\r\n        Buying quantity is required!\r\n      </p>\r\n\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row form-group\">\r\n    <div class=\"col-xl-6\">\r\n\r\n        <label  for=\"price\">Buying Price Per Unit</label>\r\n        <input\r\n          min=\"1\"\r\n          type=\"number\"\r\n          id=\"price\"\r\n          class=\"form-control\"\r\n          ngModel\r\n          name=\"price\"\r\n          #price=\"ngModel\"\r\n          required>\r\n      <p\r\n        style=\"color: red; margin-bottom: 0;\"\r\n        *ngIf=\"price.invalid && (price.dirty || price.touched)\">\r\n        Buying price per unit is required!\r\n      </p>\r\n\r\n      </div>\r\n    </div>\r\n\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-6 text-xl-right\">\r\n      <button\r\n        [disabled]=\"updateInventoryItem.invalid || isDisabled\"\r\n        type=\"submit\"\r\n        class=\"btn btn-success\">Save</button>\r\n      &nbsp;\r\n      <button\r\n        type=\"button\"\r\n        routerLink=\"/admin/inventories/{{inventoryId}}\"\r\n        class=\"btn btn-danger\">Discard</button>\r\n    </div>\r\n  </div>\r\n\r\n</form>\r\n"

/***/ }),

/***/ "./src/app/components/admin/inventories/update-inventory-item/update-inventory-item.component.scss":
/*!*********************************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/update-inventory-item/update-inventory-item.component.scss ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vaW52ZW50b3JpZXMvdXBkYXRlLWludmVudG9yeS1pdGVtL3VwZGF0ZS1pbnZlbnRvcnktaXRlbS5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/inventories/update-inventory-item/update-inventory-item.component.ts":
/*!*******************************************************************************************************!*\
  !*** ./src/app/components/admin/inventories/update-inventory-item/update-inventory-item.component.ts ***!
  \*******************************************************************************************************/
/*! exports provided: UpdateInventoryItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateInventoryItemComponent", function() { return UpdateInventoryItemComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _models_inventory_history_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../models/inventory-history.model */ "./src/app/models/inventory-history.model.ts");
/* harmony import */ var _services_data_storage_inventory_data_storage_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/data-storage/inventory-data-storage.service */ "./src/app/services/data-storage/inventory-data-storage.service.ts");
/* harmony import */ var ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ng6-toastr-notifications */ "./node_modules/ng6-toastr-notifications/fesm5/ng6-toastr-notifications.js");






var UpdateInventoryItemComponent = /** @class */ (function () {
    function UpdateInventoryItemComponent(route, router, toastr, inventoryDataStorageService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.toastr = toastr;
        this.inventoryDataStorageService = inventoryDataStorageService;
        this.isDisabled = false;
        this.inventories = [];
        this.route.params
            .subscribe(function (params) {
            _this.inventoryId = +params['inventoryId'];
        });
    }
    UpdateInventoryItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data.
            subscribe(function (data) {
            _this.inventories = data['inventories'];
            _this.inventory = _this.inventories.find(function (x) { return x.Id === _this.inventoryId; });
            if (_this.inventory === undefined) {
                window.alert('Item not found!');
                _this.router.navigate(['admin/inventories']);
            }
        });
    };
    UpdateInventoryItemComponent.prototype.onUpdateInventoryItem = function (form) {
        var _this = this;
        this.isDisabled = true;
        var inventoryId = this.inventoryId;
        var inventoryHistoryId = null;
        var buyingQuantity = form.value.quantity;
        var buyingPrice = form.value.price;
        var buyingTime = new Date().toLocaleString();
        var updateHistory = new _models_inventory_history_model__WEBPACK_IMPORTED_MODULE_3__["InventoryHistory"](inventoryHistoryId, inventoryId, buyingQuantity, buyingTime, buyingPrice);
        this.inventoryDataStorageService.updateInventoryHistory(updateHistory).
            subscribe(function (data) {
            _this.toastr.successToastr('Information is updated', 'Success', {
                toastTimeout: 10000,
                newestOnTop: true,
                showCloseButton: true
            });
            form.reset();
            _this.router.navigate(['admin/inventories/', _this.inventoryId]);
        });
    };
    UpdateInventoryItemComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-update-inventory-item',
            template: __webpack_require__(/*! ./update-inventory-item.component.html */ "./src/app/components/admin/inventories/update-inventory-item/update-inventory-item.component.html"),
            styles: [__webpack_require__(/*! ./update-inventory-item.component.scss */ "./src/app/components/admin/inventories/update-inventory-item/update-inventory-item.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_5__["ToastrManager"],
            _services_data_storage_inventory_data_storage_service__WEBPACK_IMPORTED_MODULE_4__["InventoryDataStorageService"]])
    ], UpdateInventoryItemComponent);
    return UpdateInventoryItemComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/orders/order-details/order-details.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/components/admin/orders/order-details/order-details.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n  <div class=\"col-md-offset-1 col-md-9 order-detail\">\r\n    <div class=\"row buttons\">\r\n      <div class=\"col-md-2 back\">\r\n        <button class=\"back-button\" (click)=\"goBack()\"><i class=\"fa fa-arrow-circle-o-left\" aria-hidden=\"true\"></i>\r\n          Back</button>\r\n      </div>\r\n      <div class=\"col-md-offset-8 col-md-2 delete\">\r\n        <button class=\"back-button\" (click)=\"deleteOrder()\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i>\r\n          Delete</button>\r\n      </div>\r\n    </div>\r\n\r\n\r\n    <div class=\"row upper-div\">\r\n      <div class=\"col-md-7 order-header\">\r\n        <div class=\"row\">\r\n          <div class=\"col-md-3 order-ref\">\r\n            Order Ref\r\n          </div>\r\n          <div class=\"col-md-9 id\">\r\n            {{ order.Id }}\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-md-5\">\r\n        <div class=\"row\">\r\n          <div class=\"col-md-5 order-date\">\r\n            Order Date\r\n          </div>\r\n          <div class=\"col-md-7 date\">\r\n            {{ order.DateTime }}\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n\r\n    <div class=\"row prod\">\r\n      <div class=\"col-md-12\">\r\n        Products\r\n      </div>\r\n    </div>\r\n    <div class=\"row units \">\r\n      <div class=\"col-md-3\">\r\n        Product\r\n      </div>\r\n      <div class=\"col-md-3 \">\r\n        Quantity\r\n      </div>\r\n      <div class=\"col-md-3 \">\r\n        Unit Price\r\n      </div>\r\n      <div class=\"col-md-3 \">\r\n        Sub Total\r\n      </div>\r\n    </div>\r\n\r\n\r\n<div *ngIf=\"order.OrderedItem.length !== 0; else orderedItemsDeleted\" class=\"scrollable-div\" >\r\n    <div class=\"row table-bordered units-details\" *ngFor=\"let products of order.OrderedItem\">\r\n      <div class=\"col-md-3\" >\r\n        {{ products.FoodItemName }}\r\n      </div>\r\n      <div class=\"col-md-3\">\r\n        {{ products.FoodItemQuantity }}\r\n      </div>\r\n      <div class=\"col-md-3\">\r\n        {{ products.Price}}\r\n      </div>\r\n      <div class=\"col-md-3\">\r\n        {{ products.FoodItemSubTotal }}\r\n      </div>\r\n    </div>\r\n</div>\r\n\r\n    <ng-template #orderedItemsDeleted>\r\n\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\"\r\n             style=\"font-family: sans-serif;\r\n             padding-top: 15px;\r\n             opacity: .8;\r\n             font-size: 13px;\r\n             font-weight: bold;\r\n             color: #aa0909;\">\r\n\r\n          Related records are deleted.\r\n\r\n        </div>\r\n      </div>\r\n\r\n    </ng-template>\r\n\r\n    <div class=\"row \">\r\n      <div class=\"col-md-offset-8 col-md-1 total\">\r\n        Total:\r\n      </div>\r\n      <div class=\"col-md-2 bdt\">\r\n        {{ order.TotalPrice }} BDT\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12 prod\">\r\n        Payments and Additional Informations\r\n      </div>\r\n    </div>\r\n    <div class=\"row units\">\r\n      <div class=\"col-md-2\">\r\n        Total\r\n      </div>\r\n      <div class=\"col-md-2\">\r\n        Tendered\r\n      </div>\r\n      <div class=\"col-md-2\">\r\n        Change\r\n      </div>\r\n      <div class=\"col-md-2\">\r\n        Inventory Cost\r\n      </div>\r\n      <div class=\"col-md-2\">\r\n        Profit\r\n      </div>\r\n      <div class=\"col-md-2\">\r\n        Table\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row units-details\">\r\n      <div class=\"col-md-2\">\r\n        {{ order.TotalPrice }}\r\n      </div>\r\n      <div class=\"col-md-2\">\r\n        {{ order.Tendered }}\r\n      </div>\r\n      <div class=\"col-md-2\">\r\n        {{ order.Change }}\r\n      </div>\r\n      <div class=\"col-md-2\">\r\n        {{ order.InventoryCost }}\r\n      </div>\r\n      <div class=\"col-md-2\">\r\n        {{ order.Profit }}\r\n      </div>\r\n      <div class=\"col-md-2\">\r\n        {{ order.TableNumber }}\r\n      </div>\r\n    </div>\r\n    </div>\r\n</div>\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/components/admin/orders/order-details/order-details.component.scss":
/*!************************************************************************************!*\
  !*** ./src/app/components/admin/orders/order-details/order-details.component.scss ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vb3JkZXJzL29yZGVyLWRldGFpbHMvb3JkZXItZGV0YWlscy5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/orders/order-details/order-details.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/components/admin/orders/order-details/order-details.component.ts ***!
  \**********************************************************************************/
/*! exports provided: OrderDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrderDetailsComponent", function() { return OrderDetailsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_data_storage_order_data_storage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/data-storage/order-data-storage.service */ "./src/app/services/data-storage/order-data-storage.service.ts");




var OrderDetailsComponent = /** @class */ (function () {
    function OrderDetailsComponent(route, router, orderDataStorageService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.orderDataStorageService = orderDataStorageService;
        this.orders = [];
        this.route.params
            .subscribe(function (params) {
            _this.orderId = +params['orderId'];
        });
    }
    OrderDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data.
            subscribe(function (data) {
            _this.orders = data['order'];
            _this.order = _this.orders.find(function (x) { return x.Id === _this.orderId; });
        });
    };
    OrderDetailsComponent.prototype.confirmEvent = function () {
        var _this = this;
        this.orderDataStorageService.deleteOrder(this.orderId).
            subscribe(function (data) {
            _this.router.navigate(['admin/orders']);
        });
    };
    OrderDetailsComponent.prototype.deleteOrder = function () {
        var dialog = confirm('Delete this item?\n' +
            'You will lose any kind of data associated with the current item!');
        if (dialog) {
            this.confirmEvent();
        }
    };
    OrderDetailsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-order-details',
            template: __webpack_require__(/*! ./order-details.component.html */ "./src/app/components/admin/orders/order-details/order-details.component.html"),
            styles: [__webpack_require__(/*! ./order-details.component.scss */ "./src/app/components/admin/orders/order-details/order-details.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services_data_storage_order_data_storage_service__WEBPACK_IMPORTED_MODULE_3__["OrderDataStorageService"]])
    ], OrderDetailsComponent);
    return OrderDetailsComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/orders/order-list/order-list.component.html":
/*!******************************************************************************!*\
  !*** ./src/app/components/admin/orders/order-list/order-list.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row empty\" *ngIf=\"totalOrder === 0; else notEmpty\">\r\n  <div class=\"col-md-12\">\r\n    No order has arrived yet.\r\n  </div>\r\n</div>\r\n\r\n\r\n<ng-template #notEmpty>\r\n\r\n<div class=\"sum-of-inv-body\">\r\n<div class=\"row\">\r\n  <div class=\"col-md-4 search-bar\">\r\n    <span class=\"fa fa-search\"></span>\r\n    <input class=\"box\" type=\"text\" [(ngModel)]=\"term\" placeholder=\"Search by Receipt Ref...\">\r\n  </div>\r\n</div>\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <div class=\"col-md-2 receipt\">\r\n        Receipt Ref\r\n      </div>\r\n      <div class=\"col-md-2 name\">\r\n        Order Date\r\n      </div>\r\n      <div class=\"col-md-2 name\">\r\n        Table No\r\n      </div>\r\n      <div class=\"col-md-2 price\">\r\n        Selling Price\r\n      </div>\r\n      <div class=\"col-md-2 price\">\r\n        Inventory Cost\r\n      </div>\r\n      <div class=\"col-md-2 price\">\r\n        Profit in Order\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12 body\">\r\n      <div class=\"row\" *ngFor=\"let orderList of orders | order:term; let i = index\">\r\n        <a title=\"View This Order's Details\"\r\n          style=\"cursor: pointer\" (click)=\"viewDetails(orderList)\">\r\n        <div class=\"col-md-12 f-name table-bordered\">\r\n          <div class=\"col-md-2 column-receipt\">\r\n          {{ orderList.Id }}\r\n          </div>\r\n          <div class=\"col-md-2 column\">\r\n            {{ orderList.DateTime }}\r\n          </div>\r\n          <div class=\"col-md-2 column\">\r\n            {{orderList.TableNumber }}\r\n          </div>\r\n\r\n          <div class=\"col-md-2 column\">\r\n            {{ orderList.totalPrice }} BDT\r\n          </div>\r\n\r\n          <div class=\"col-md-2 column\">\r\n            {{ orderList.InventoryCost }} BDT\r\n          </div>\r\n\r\n          <div class=\"col-md-2 column\">\r\n            {{ orderList.Profit }} BDT\r\n          </div>\r\n        </div>\r\n        </a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-md-12 Summary\">\r\n    Summary\r\n  </div>\r\n</div>\r\n<div class=\"row\">\r\n  <div class=\"col-md-12 detail\">\r\n    Total Order: {{ totalOrder }} (s)\r\n  </div>\r\n</div>\r\n<div class=\"row\">\r\n  <div class=\"col-md-12 detail\">\r\n    Total Sale: {{ grossSale }} BDT\r\n  </div>\r\n</div>\r\n<div class=\"row\">\r\n  <div class=\"col-md-12 detail\">\r\n    Total Inventory Cost: {{ grossCost }} BDT\r\n  </div>\r\n</div>\r\n<div class=\"row\">\r\n  <div class=\"col-md-12 detail\">\r\n    Total Profit: {{ grossProfit }} BDT\r\n  </div>\r\n</div>\r\n</ng-template>\r\n"

/***/ }),

/***/ "./src/app/components/admin/orders/order-list/order-list.component.scss":
/*!******************************************************************************!*\
  !*** ./src/app/components/admin/orders/order-list/order-list.component.scss ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vb3JkZXJzL29yZGVyLWxpc3Qvb3JkZXItbGlzdC5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/orders/order-list/order-list.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/components/admin/orders/order-list/order-list.component.ts ***!
  \****************************************************************************/
/*! exports provided: OrderListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrderListComponent", function() { return OrderListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_shared_point_of_sale_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/shared/point-of-sale.service */ "./src/app/services/shared/point-of-sale.service.ts");




var OrderListComponent = /** @class */ (function () {
    function OrderListComponent(route, router, pointOfSaleService) {
        this.route = route;
        this.router = router;
        this.pointOfSaleService = pointOfSaleService;
        this.orders = [];
        this.grossSale = 0;
        this.grossCost = 0;
        this.grossProfit = 0;
        this.totalOrder = 0;
    }
    OrderListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data.
            subscribe(function (data) {
            _this.pointOfSaleService.order = data['order'];
        });
        this.orders = this.pointOfSaleService.orders;
        this.pointOfSaleService.ordersChanged
            .subscribe(function (order) {
            _this.orders = order;
        });
        for (var i = 0; i < this.orders.length; i++) {
            this.grossSale = this.grossSale
                + Number.parseInt(this.orders[i].TotalPrice.toString());
            this.grossCost = this.grossCost
                + Number.parseInt(this.orders[i].InventoryCost.toString());
            this.grossProfit = this.grossProfit
                + Number.parseInt(this.orders[i].Profit.toString());
        }
        this.totalOrder = this.pointOfSaleService.orders.length;
    };
    OrderListComponent.prototype.viewDetails = function (orderList) {
        var orderId = orderList.Id;
        this.router.navigate(['admin/order/food-item-details', orderId]);
    };
    OrderListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-order-list',
            template: __webpack_require__(/*! ./order-list.component.html */ "./src/app/components/admin/orders/order-list/order-list.component.html"),
            styles: [__webpack_require__(/*! ./order-list.component.scss */ "./src/app/components/admin/orders/order-list/order-list.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services_shared_point_of_sale_service__WEBPACK_IMPORTED_MODULE_3__["PointOfSaleService"]])
    ], OrderListComponent);
    return OrderListComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/orders/orders.component.html":
/*!***************************************************************!*\
  !*** ./src/app/components/admin/orders/orders.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n  <div class=\"row main-row\">\r\n    <div class=\"col-md-8 header\">\r\n      Order History\r\n    </div>\r\n    <a routerLink=\"/control-panel\">\r\n      <div class=\"col-md-offset-1 col-md-2 dashboard\">\r\n        Back to Dashboard\r\n      </div>\r\n    </a>\r\n  </div>\r\n\r\n\r\n\r\n\r\n\r\n  <div class=\"row\">\r\n  <div class=\"col-md-offset-11 col-md-1\">\r\n    <div class=\"row icons\">\r\n      <a title=\"List View\" routerLink=\"/admin/orders/list-view\" routerLinkActive=\"icon-active\">\r\n      <div class=\"col-md-6 list\">\r\n        <i class=\"fa fa-bars\" aria-hidden=\"true\"></i>\r\n      </div>\r\n      </a>\r\n      <a title=\"Grid View\" routerLink=\"/admin/orders/grid-view\" routerLinkActive=\"icon-active\">\r\n      <div class=\"col-md-6 grid\">\r\n        <i class=\"fa fa-th-large\" aria-hidden=\"true\"></i>\r\n      </div>\r\n      </a>\r\n    </div>\r\n  </div>\r\n</div>\r\n  <router-outlet></router-outlet>\r\n"

/***/ }),

/***/ "./src/app/components/admin/orders/orders.component.scss":
/*!***************************************************************!*\
  !*** ./src/app/components/admin/orders/orders.component.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vb3JkZXJzL29yZGVycy5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/orders/orders.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/components/admin/orders/orders.component.ts ***!
  \*************************************************************/
/*! exports provided: OrdersComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrdersComponent", function() { return OrdersComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var OrdersComponent = /** @class */ (function () {
    function OrdersComponent() {
    }
    OrdersComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-orders',
            template: __webpack_require__(/*! ./orders.component.html */ "./src/app/components/admin/orders/orders.component.html"),
            styles: [__webpack_require__(/*! ./orders.component.scss */ "./src/app/components/admin/orders/orders.component.scss")]
        })
    ], OrdersComponent);
    return OrdersComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/tables/add-new-table/add-new-table.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/components/admin/tables/add-new-table/add-new-table.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\r\n<div class=\"col-md-12 name\">\r\n\r\n  <form (ngSubmit) = \"addNewTable(newTable)\" #newTable = \"ngForm\">\r\n    <div id=\"user-data\">\r\n      <div class=\"form-group\">\r\n        <label for=\"name\">Table's Name:</label>\r\n        <input\r\n          type=\"text\"\r\n          id=\"name\"\r\n          class=\"form-control\"\r\n          ngModel\r\n          name=\"name\"\r\n          required\r\n        >\r\n      </div>\r\n\r\n      <div class=\"form-group\">\r\n\r\n        <div class=\"action\">\r\n          <button class=\"all-categories-button\"\r\n                  type=\"submit\"\r\n                  [disabled]=\"!newTable.valid || isDisabled\">\r\n            <i class=\"fa fa-bookmark\" aria-hidden=\"true\"></i> Save</button>\r\n        </div>\r\n        <div class=\"action\">\r\n          <button\r\n            class=\"all-categories-button\"\r\n            routerLink=\"admin/tables\"\r\n            type=\"button\">\r\n            <i class=\"fa fa-times-circle-o\" aria-hidden=\"true\"></i> Cancel</button>\r\n        </div>\r\n\r\n      </div>\r\n    </div>\r\n  </form>\r\n\r\n</div>\r\n-->\r\n\r\n\r\n<div class=\"row\" style=\"font-weight: 500;\">\r\n  <div class=\"col-xl-12\">\r\n    Add New Table\r\n  </div>\r\n</div>\r\n\r\n<br>\r\n\r\n<form (ngSubmit) = \"addNewTable(newTable)\" #newTable = \"ngForm\">\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-xl-6\">\r\n          <label for=\"name\">Table's Name</label>\r\n          <input\r\n            type=\"text\"\r\n            id=\"name\"\r\n            class=\"form-control\"\r\n            ngModel\r\n            name=\"name\"\r\n            #name=\"ngModel\"\r\n            required>\r\n    <p\r\n      style=\"color: red; margin-bottom: 0;\"\r\n      *ngIf=\"name.invalid && (name.dirty || name.touched)\">\r\n      Table name is required!\r\n    </p>\r\n\r\n  </div>\r\n</div>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-6\">\r\n      <hr>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-6 text-xl-right\">\r\n      <button\r\n        [disabled]=\"newTable.invalid || isDisabled\"\r\n        type=\"submit\"\r\n        class=\"btn btn-success\">Save</button>\r\n      &nbsp;\r\n      <button\r\n        type=\"button\"\r\n        routerLink=\"/admin/tables\"\r\n        class=\"btn btn-danger\">Discard</button>\r\n    </div>\r\n  </div>\r\n\r\n\r\n</form>\r\n"

/***/ }),

/***/ "./src/app/components/admin/tables/add-new-table/add-new-table.component.scss":
/*!************************************************************************************!*\
  !*** ./src/app/components/admin/tables/add-new-table/add-new-table.component.scss ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vdGFibGVzL2FkZC1uZXctdGFibGUvYWRkLW5ldy10YWJsZS5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/tables/add-new-table/add-new-table.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/components/admin/tables/add-new-table/add-new-table.component.ts ***!
  \**********************************************************************************/
/*! exports provided: AddNewTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddNewTableComponent", function() { return AddNewTableComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _models_table_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../models/table.model */ "./src/app/models/table.model.ts");
/* harmony import */ var _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/data-storage/table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");
/* harmony import */ var ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ng6-toastr-notifications */ "./node_modules/ng6-toastr-notifications/fesm5/ng6-toastr-notifications.js");






var AddNewTableComponent = /** @class */ (function () {
    function AddNewTableComponent(router, toastr, tableDataStorageService) {
        this.router = router;
        this.toastr = toastr;
        this.tableDataStorageService = tableDataStorageService;
        this.isDisabled = false;
    }
    AddNewTableComponent.prototype.addNewTable = function (form) {
        var _this = this;
        this.isDisabled = true;
        var id = null;
        var tableName = form.value.name;
        this.tableDataStorageService.addNewTable(new _models_table_model__WEBPACK_IMPORTED_MODULE_3__["Table"](id, tableName))
            .subscribe(function (data) {
            _this.toastr.successToastr('Added to shop', 'Success', {
                toastTimeout: 10000,
                newestOnTop: true,
                showCloseButton: true
            });
            form.reset();
            _this.router.navigate(['admin/tables']);
        });
    };
    AddNewTableComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-add-new-table',
            template: __webpack_require__(/*! ./add-new-table.component.html */ "./src/app/components/admin/tables/add-new-table/add-new-table.component.html"),
            styles: [__webpack_require__(/*! ./add-new-table.component.scss */ "./src/app/components/admin/tables/add-new-table/add-new-table.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_5__["ToastrManager"],
            _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_4__["TableDataStorageService"]])
    ], AddNewTableComponent);
    return AddNewTableComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/tables/edit-table/edit-table.component.html":
/*!******************************************************************************!*\
  !*** ./src/app/components/admin/tables/edit-table/edit-table.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n<div class=\"row\" style=\"font-weight: 500;\">\r\n  <div class=\"col-xl-12\">\r\n    Edit Information of {{ table.Name }}\r\n  </div>\r\n</div>\r\n\r\n<br>\r\n\r\n\r\n<form (ngSubmit) = \"editTable(editedTable)\" #editedTable= \"ngForm\">\r\n\r\n  <div class=\"row form-group\">\r\n    <div class=\"col-xl-6\">\r\n\r\n      <label for=\"name\">Table's Name</label>\r\n      <input\r\n        type=\"text\"\r\n        id=\"name\"\r\n        class=\"form-control\"\r\n        [ngModel]=\"table.Name\"\r\n        name=\"name\"\r\n        #name=\"ngModel\"\r\n        required>\r\n\r\n      <p\r\n        style=\"color: red; margin-bottom: 0;\"\r\n        *ngIf=\"name.invalid && (name.dirty || name.touched)\">\r\n        Table's name is required!\r\n      </p>\r\n\r\n    </div>\r\n  </div>\r\n\r\n\r\n\r\n\r\n\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xl-6 text-xl-right\">\r\n      <button\r\n        [disabled]=\"editedTable.invalid || isDisabled\"\r\n        type=\"submit\"\r\n        class=\"btn btn-success\">Save</button>\r\n      &nbsp;\r\n      <button\r\n        type=\"button\"\r\n        routerLink=\"/admin/tables/{{tableId}}\"\r\n        class=\"btn btn-danger\">Discard</button>\r\n    </div>\r\n  </div>\r\n\r\n\r\n</form>\r\n\r\n"

/***/ }),

/***/ "./src/app/components/admin/tables/edit-table/edit-table.component.scss":
/*!******************************************************************************!*\
  !*** ./src/app/components/admin/tables/edit-table/edit-table.component.scss ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vdGFibGVzL2VkaXQtdGFibGUvZWRpdC10YWJsZS5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/tables/edit-table/edit-table.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/components/admin/tables/edit-table/edit-table.component.ts ***!
  \****************************************************************************/
/*! exports provided: EditTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditTableComponent", function() { return EditTableComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ng6-toastr-notifications */ "./node_modules/ng6-toastr-notifications/fesm5/ng6-toastr-notifications.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _models_table_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../models/table.model */ "./src/app/models/table.model.ts");
/* harmony import */ var _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/data-storage/table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");






var EditTableComponent = /** @class */ (function () {
    function EditTableComponent(route, router, toastr, tableDataStorageService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.toastr = toastr;
        this.tableDataStorageService = tableDataStorageService;
        this.isDisabled = false;
        this.route.params
            .subscribe(function (params) {
            _this.tableId = +params['tableId'];
        });
    }
    EditTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data.subscribe(function (data) {
            _this.tables = data['tables'];
            _this.table = _this.tables.find(function (x) { return x.Id === _this.tableId; });
            if (_this.table === undefined) {
                _this.toastr.errorToastr('Table is not found', 'Error', {
                    toastTimeout: 10000,
                    newestOnTop: true,
                    showCloseButton: true
                });
                _this.router.navigate(['admin/tables']);
            }
        });
    };
    EditTableComponent.prototype.editTable = function (form) {
        var _this = this;
        this.isDisabled = true;
        var tableName = form.value.name;
        if (tableName !== this.table.Name) {
            this.tableDataStorageService.editTable(new _models_table_model__WEBPACK_IMPORTED_MODULE_4__["Table"](this.tableId, tableName))
                .subscribe(function (data) {
                _this.toastr.successToastr('Information is updated', 'Success', {
                    toastTimeout: 10000,
                    newestOnTop: true,
                    showCloseButton: true
                });
                form.reset();
                _this.router.navigate(['admin/tables']);
            });
        }
        else {
            this.toastr.successToastr('Information is updated', 'Success', {
                toastTimeout: 10000,
                newestOnTop: true,
                showCloseButton: true
            });
            form.reset();
            this.router.navigate(['admin/tables']);
        }
    };
    EditTableComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-edit-table',
            template: __webpack_require__(/*! ./edit-table.component.html */ "./src/app/components/admin/tables/edit-table/edit-table.component.html"),
            styles: [__webpack_require__(/*! ./edit-table.component.scss */ "./src/app/components/admin/tables/edit-table/edit-table.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_2__["ToastrManager"],
            _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_5__["TableDataStorageService"]])
    ], EditTableComponent);
    return EditTableComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/tables/table-details/table-details.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/components/admin/tables/table-details/table-details.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<div class=\"row\">\n  <div class=\"col-xl-12\">\n    <h6>General Information</h6>\n  </div>\n</div>\n\n<hr>\n\n<div class=\"row\" style=\"font-weight: 500; font-size: 20px;\">\n  <div class=\"col-xl-12\">\n    Product's Name: {{ table.Name }}\n  </div>\n</div>\n\n<br>\n\n<div class=\"row text-xl-left\">\n  <div class=\"col-xl-10\">\n\n    <button\n      routerLink=\"/admin/tables/{{tableId}}/edit-table\"\n      class=\"btn btn-warning\">Edit</button> &nbsp;\n\n    <button\n      (click)=\"deleteTable()\"\n      class=\"btn btn-danger\">Delete</button>\n\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/components/admin/tables/table-details/table-details.component.scss":
/*!************************************************************************************!*\
  !*** ./src/app/components/admin/tables/table-details/table-details.component.scss ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vdGFibGVzL3RhYmxlLWRldGFpbHMvdGFibGUtZGV0YWlscy5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/tables/table-details/table-details.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/components/admin/tables/table-details/table-details.component.ts ***!
  \**********************************************************************************/
/*! exports provided: TableDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableDetailsComponent", function() { return TableDetailsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ng6-toastr-notifications */ "./node_modules/ng6-toastr-notifications/fesm5/ng6-toastr-notifications.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/data-storage/table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");





var TableDetailsComponent = /** @class */ (function () {
    function TableDetailsComponent(router, route, toastr, tableDataStorageService) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.toastr = toastr;
        this.tableDataStorageService = tableDataStorageService;
        this.tables = [];
        this.route.params
            .subscribe(function (params) {
            _this.tableId = +params['tableId'];
        });
    }
    TableDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data.subscribe(function (data) {
            _this.tables = data['tables'];
            _this.table = _this.tables.find(function (x) { return x.Id === _this.tableId; });
            if (_this.table === undefined) {
                _this.toastr.errorToastr('Table is not found', 'Error', {
                    toastTimeout: 10000,
                    newestOnTop: true,
                    showCloseButton: true
                });
                _this.router.navigate(['admin/tables']);
            }
        });
    };
    TableDetailsComponent.prototype.deleteTable = function () {
        var dialog = confirm('Delete this table?\n' +
            'You will lose any kind of data associated with the current table!');
        if (dialog === true) {
            this.confirmEvent();
        }
    };
    TableDetailsComponent.prototype.confirmEvent = function () {
        var _this = this;
        this.tableDataStorageService.deleteTable(this.tableId).
            subscribe(function (data) {
            _this.toastr.successToastr('Removed from shop', 'Success', {
                toastTimeout: 10000,
                newestOnTop: true,
                showCloseButton: true
            });
            _this.router.navigate(['admin/tables']);
        });
    };
    TableDetailsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-table-details',
            template: __webpack_require__(/*! ./table-details.component.html */ "./src/app/components/admin/tables/table-details/table-details.component.html"),
            styles: [__webpack_require__(/*! ./table-details.component.scss */ "./src/app/components/admin/tables/table-details/table-details.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
            ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_2__["ToastrManager"],
            _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_4__["TableDataStorageService"]])
    ], TableDetailsComponent);
    return TableDetailsComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/tables/table-list/table-list.component.html":
/*!******************************************************************************!*\
  !*** ./src/app/components/admin/tables/table-list/table-list.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n\r\n<div class=\"row\" *ngIf=\"tables.length === 0; else notEmpty\">\r\n  <div class=\"col-md-12\">\r\n    No table is available. Click \"Add New Table\" to populate.\r\n  </div>\r\n</div>\r\n\r\n<ng-template #notEmpty>\r\n\r\n\r\n  <mat-form-field>\r\n    <input\r\n      style=\"width: 100%;\"\r\n      matInput\r\n      (keyup)=\"applyFilter($event.target.value)\"\r\n      placeholder=\"Search...\">\r\n  </mat-form-field>\r\n\r\n  <div class=\"mat-elevation-z8\" style=\"box-shadow: none!important;\">\r\n    <table  mat-table [dataSource]=\"dataSource\" matSort>\r\n\r\n      <ng-container matColumnDef=\"Name\">\r\n        <th\r\n          style=\"font-size: 14px; font-weight: 500; color: #000;\"\r\n          mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>\r\n        <td\r\n          style=\"width: 25%\"\r\n          mat-cell *matCellDef=\"let row\"> {{row.Name}} </td>\r\n      </ng-container>\r\n\r\n      <tr mat-header-row *matHeaderRowDef=\"displayedColumns\"></tr>\r\n      <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"\r\n          style=\"cursor: pointer;\"\r\n          title=\"See details\"\r\n          routerLink=\"/admin/tables/{{ row.Id }}\">\r\n      </tr>\r\n    </table>\r\n\r\n    <mat-paginator\r\n      [pageSizeOptions]=\"[5, 10, 25, 50]\" showFirstLastButtons></mat-paginator>\r\n  </div>\r\n\r\n</ng-template>\r\n"

/***/ }),

/***/ "./src/app/components/admin/tables/table-list/table-list.component.scss":
/*!******************************************************************************!*\
  !*** ./src/app/components/admin/tables/table-list/table-list.component.scss ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "table {\n  width: 100%; }\n\n.mat-form-field {\n  font-size: 14px;\n  width: 100%; }\n\n.mat-cell {\n  border: 1px solid #ab9090;\n  text-align: left; }\n\n.mat-header-cell {\n  border: 1px solid #ab9090; }\n\n:host ::ng-deep .mat-sort-header-container {\n  display: flex;\n  justify-content: left; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9hZG1pbi90YWJsZXMvdGFibGUtbGlzdC9EOlxcV2ViIERldmVsb3BtZW50XFxQcm9qZWN0c1xcUmVzdGF1cmFudE1hbmFnZW1lbnRBcHBcXFJlc3RhdXJhbnRNYW5hZ2VtZW50QXBwL3NyY1xcYXBwXFxjb21wb25lbnRzXFxhZG1pblxcdGFibGVzXFx0YWJsZS1saXN0XFx0YWJsZS1saXN0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsV0FBVyxFQUFBOztBQUdiO0VBQ0UsZUFBZTtFQUNmLFdBQVcsRUFBQTs7QUFHYjtFQUNFLHlCQUF5QjtFQUN6QixnQkFBZ0IsRUFBQTs7QUFHbEI7RUFDRSx5QkFBeUIsRUFBQTs7QUFHM0I7RUFDRSxhQUFhO0VBQ2IscUJBQXFCLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9jb21wb25lbnRzL2FkbWluL3RhYmxlcy90YWJsZS1saXN0L3RhYmxlLWxpc3QuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJ0YWJsZSB7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi5tYXQtZm9ybS1maWVsZCB7XHJcbiAgZm9udC1zaXplOiAxNHB4O1xyXG4gIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4ubWF0LWNlbGwge1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNhYjkwOTA7XHJcbiAgdGV4dC1hbGlnbjogbGVmdDtcclxufVxyXG5cclxuLm1hdC1oZWFkZXItY2VsbCB7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgI2FiOTA5MDtcclxufVxyXG5cclxuOmhvc3QgOjpuZy1kZWVwIC5tYXQtc29ydC1oZWFkZXItY29udGFpbmVyIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGp1c3RpZnktY29udGVudDogbGVmdDtcclxufVxyXG4iXX0= */"

/***/ }),

/***/ "./src/app/components/admin/tables/table-list/table-list.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/components/admin/tables/table-list/table-list.component.ts ***!
  \****************************************************************************/
/*! exports provided: TableListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableListComponent", function() { return TableListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");




var TableListComponent = /** @class */ (function () {
    function TableListComponent(route) {
        this.route = route;
        this.tables = [];
        this.displayedColumns = [
            'Name'
        ];
    }
    TableListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data
            .subscribe(function (data) {
            _this.tables = data['tables'];
            _this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatTableDataSource"](_this.tables);
        });
    };
    TableListComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    };
    TableListComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"])
    ], TableListComponent.prototype, "paginator", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSort"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSort"])
    ], TableListComponent.prototype, "sort", void 0);
    TableListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-table-list',
            template: __webpack_require__(/*! ./table-list.component.html */ "./src/app/components/admin/tables/table-list/table-list.component.html"),
            styles: [__webpack_require__(/*! ./table-list.component.scss */ "./src/app/components/admin/tables/table-list/table-list.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]])
    ], TableListComponent);
    return TableListComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/tables/tables.component.html":
/*!***************************************************************!*\
  !*** ./src/app/components/admin/tables/tables.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<br>\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-xl-6\">\r\n    <h5>Manage Your Tables</h5>\r\n  </div>\r\n  <div class=\"col-xl-6 text-xl-right\">\r\n    <button\r\n      routerLink=\"/admin/tables/add-new-table\"\r\n      class=\"btn btn-success\">Add New Table</button>\r\n  </div>\r\n</div>\r\n\r\n<hr>\r\n\r\n<router-outlet></router-outlet>\r\n"

/***/ }),

/***/ "./src/app/components/admin/tables/tables.component.scss":
/*!***************************************************************!*\
  !*** ./src/app/components/admin/tables/tables.component.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vdGFibGVzL3RhYmxlcy5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/tables/tables.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/components/admin/tables/tables.component.ts ***!
  \*************************************************************/
/*! exports provided: TablesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TablesComponent", function() { return TablesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../services/data-storage/table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");




var TablesComponent = /** @class */ (function () {
    function TablesComponent(route, router, dataStorageService) {
        this.route = route;
        this.router = router;
        this.dataStorageService = dataStorageService;
        this.totalTable = 0;
    }
    // ngOnInit() {
    //   this.route.data.
    //   subscribe(
    //     ( data: Table[]) => {
    //       this.pointOfSaleService.tables = data['tables'];
    //     }
    //   );
    //   this.tables = this.pointOfSaleService.tables;
    //   this.subscription = this.pointOfSaleService.tablesChanged
    //     .subscribe(
    //       (tables: Table[]) => {
    //         this.tables = tables;
    //       }
    //     );
    //   this.totalTable = this.tables.length;
    // }
    //
    TablesComponent.prototype.addNewTable = function () {
        this.router.navigate(['admin/tables/add-new-tables']);
    };
    TablesComponent.prototype.editTable = function (table) {
        this.router.navigate(['admin/tables/edit-tables', table.Id]);
    };
    TablesComponent.prototype.deleteTable = function (table, index) {
        var dialog = confirm('Delete this tables?\n' +
            'You will lose any kind of data associated with the current tables!');
        if (dialog === true) {
            this.confirmEvent(table, index);
        }
    };
    TablesComponent.prototype.confirmEvent = function (table, index) {
        var _this = this;
        this.dataStorageService.deleteTable(1).
            subscribe(function (data) {
            _this.tables.splice(index, 1);
        });
    };
    TablesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-tables',
            template: __webpack_require__(/*! ./tables.component.html */ "./src/app/components/admin/tables/tables.component.html"),
            styles: [__webpack_require__(/*! ./tables.component.scss */ "./src/app/components/admin/tables/tables.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__["TableDataStorageService"]])
    ], TablesComponent);
    return TablesComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/users/add-new-user/add-new-user.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/components/admin/users/add-new-user/add-new-user.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  add-new-user works!\n</p>\n"

/***/ }),

/***/ "./src/app/components/admin/users/add-new-user/add-new-user.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/components/admin/users/add-new-user/add-new-user.component.scss ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vdXNlcnMvYWRkLW5ldy11c2VyL2FkZC1uZXctdXNlci5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/users/add-new-user/add-new-user.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/components/admin/users/add-new-user/add-new-user.component.ts ***!
  \*******************************************************************************/
/*! exports provided: AddNewUserComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddNewUserComponent", function() { return AddNewUserComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var AddNewUserComponent = /** @class */ (function () {
    function AddNewUserComponent() {
    }
    AddNewUserComponent.prototype.ngOnInit = function () {
    };
    AddNewUserComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-add-new-user',
            template: __webpack_require__(/*! ./add-new-user.component.html */ "./src/app/components/admin/users/add-new-user/add-new-user.component.html"),
            styles: [__webpack_require__(/*! ./add-new-user.component.scss */ "./src/app/components/admin/users/add-new-user/add-new-user.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], AddNewUserComponent);
    return AddNewUserComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/users/edit-user/edit-user.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/components/admin/users/edit-user/edit-user.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  edit-user works!\n</p>\n"

/***/ }),

/***/ "./src/app/components/admin/users/edit-user/edit-user.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/components/admin/users/edit-user/edit-user.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vdXNlcnMvZWRpdC11c2VyL2VkaXQtdXNlci5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/users/edit-user/edit-user.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/components/admin/users/edit-user/edit-user.component.ts ***!
  \*************************************************************************/
/*! exports provided: EditUserComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditUserComponent", function() { return EditUserComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var EditUserComponent = /** @class */ (function () {
    function EditUserComponent() {
    }
    EditUserComponent.prototype.ngOnInit = function () {
    };
    EditUserComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-edit-user',
            template: __webpack_require__(/*! ./edit-user.component.html */ "./src/app/components/admin/users/edit-user/edit-user.component.html"),
            styles: [__webpack_require__(/*! ./edit-user.component.scss */ "./src/app/components/admin/users/edit-user/edit-user.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], EditUserComponent);
    return EditUserComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/users/user-details/user-details.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/components/admin/users/user-details/user-details.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  user-details works!\n</p>\n"

/***/ }),

/***/ "./src/app/components/admin/users/user-details/user-details.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/components/admin/users/user-details/user-details.component.scss ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vdXNlcnMvdXNlci1kZXRhaWxzL3VzZXItZGV0YWlscy5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/users/user-details/user-details.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/components/admin/users/user-details/user-details.component.ts ***!
  \*******************************************************************************/
/*! exports provided: UserDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserDetailsComponent", function() { return UserDetailsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var UserDetailsComponent = /** @class */ (function () {
    function UserDetailsComponent() {
    }
    UserDetailsComponent.prototype.ngOnInit = function () {
    };
    UserDetailsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-user-details',
            template: __webpack_require__(/*! ./user-details.component.html */ "./src/app/components/admin/users/user-details/user-details.component.html"),
            styles: [__webpack_require__(/*! ./user-details.component.scss */ "./src/app/components/admin/users/user-details/user-details.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], UserDetailsComponent);
    return UserDetailsComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/users/user-list/user-list.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/components/admin/users/user-list/user-list.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  user-list works!\n</p>\n"

/***/ }),

/***/ "./src/app/components/admin/users/user-list/user-list.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/components/admin/users/user-list/user-list.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vdXNlcnMvdXNlci1saXN0L3VzZXItbGlzdC5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/admin/users/user-list/user-list.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/components/admin/users/user-list/user-list.component.ts ***!
  \*************************************************************************/
/*! exports provided: UserListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserListComponent", function() { return UserListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var UserListComponent = /** @class */ (function () {
    function UserListComponent() {
    }
    UserListComponent.prototype.ngOnInit = function () {
    };
    UserListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-user-list',
            template: __webpack_require__(/*! ./user-list.component.html */ "./src/app/components/admin/users/user-list/user-list.component.html"),
            styles: [__webpack_require__(/*! ./user-list.component.scss */ "./src/app/components/admin/users/user-list/user-list.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], UserListComponent);
    return UserListComponent;
}());



/***/ }),

/***/ "./src/app/components/admin/users/users.component.html":
/*!*************************************************************!*\
  !*** ./src/app/components/admin/users/users.component.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n<div class=\"row main-row\">\r\n    <div class=\"col-md-8 header\">\r\n      UserModel Registration\r\n    </div>\r\n    <a routerLink=\"/control-panel\">\r\n      <div class=\"col-md-offset-1 col-md-2 dashboard\">\r\n        Back to Dashboard\r\n      </div>\r\n    </a>\r\n</div>\r\n\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-md-offset-1 col-md-5\">\r\n    <form #userRegistrationForm=\"ngForm\" (ngSubmit)=\"OnSubmit(userRegistrationForm)\">\r\n\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12 new-user\">\r\n          Create a new user\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12 form-group\">\r\n          <div class=\"col-md-12\">\r\n            <label\r\n            >UserModel Name</label>\r\n          </div>\r\n          <div class=\"col-md-12\">\r\n          <input class=\"validate form-control\"\r\n                 type=\"text\"\r\n                 name=\"UserName\"\r\n                 #UserName=\"ngModel\"\r\n                 [(ngModel)]=\"user.UserName\"\r\n                 placeholder=\"Should be unique and cannot contain any space\"\r\n                 required>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12 form-group\">\r\n          <div class=\"col-md-12\">\r\n            <label\r\n              [attr.data-error]=\"Password.errors!=null?(Password.errors.required?\r\n            'Required field!':'Minimum 3 characters needed'):''\">Password</label>\r\n          </div>\r\n          <div class=\"col-md-12\">\r\n          <input\r\n            class=\"validate form-control\"\r\n            type=\"password\"\r\n            name=\"Password\"\r\n            #Password=\"ngModel\"\r\n            [(ngModel)]=\"user.Password\"\r\n            placeholder=\"At least 3 characters long\"\r\n            required\r\n            minlength=\"3\">\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12 form-group\">\r\n          <div class=\"col-md-12\">\r\n            <label\r\n            >Email\r\n            </label>\r\n          </div>\r\n          <div class=\"col-md-12\">\r\n          <input class=\"validate form-control\"\r\n                 type=\"text\"\r\n                 name=\"Email\"\r\n                 #Email=\"ngModel\"\r\n                 [(ngModel)]=\"user.Email\"\r\n                 [pattern]=\"emailPattern\"\r\n                 required>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-md-12 form-group\">\r\n        <label>Choose a role from here</label>\r\n        <select\r\n          style=\"cursor: pointer;\"\r\n          id=\"roleName\"\r\n          name=\"roleName\"\r\n          class=\"form-control\"\r\n          ngModel\r\n          required\r\n          >\r\n          <option  *ngFor=\"let item of roles\" [value] =\"item.Name\"  > {{ item.Name }} </option>\r\n        </select>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12 button\">\r\n          <button [disabled]=\"!userRegistrationForm.valid || isDisabled\"\r\n                  class=\"btn btn-primary\"\r\n                  type=\"submit\">\r\n            Submit</button>\r\n\r\n        </div>\r\n      </div>\r\n    </form>\r\n  </div>\r\n\r\n  <div class=\"col-md-5\">\r\n    <div class=\"row users\">\r\n      <div class=\"col-md-4\">\r\n        Users\r\n      </div>\r\n      <div class=\"col-md-6\">\r\n        <i class=\"fa fa-search\" aria-hidden=\"true\"></i>\r\n        <input class=\"box\"\r\n               type=\"text\"\r\n               [(ngModel)]=\"term\"\r\n               placeholder=\"Search by UserModel Name...\">\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row body\">\r\n      <div class=\"col-md-12 table-bordered\" *ngFor=\"let user of modifiedUser | userFilter:term; let i= index\">\r\n        <div class=\"row\">\r\n          <div class=\"col-md-12 content\">\r\n            {{ i+1 }}. {{ user.UserName }}\r\n          </div>\r\n        </div>\r\n        <div class=\"row\">\r\n          <div class=\"col-md-12 content\">\r\n           Role assigned: {{ user.Role }}\r\n          </div>\r\n        </div>\r\n        <div class=\"row\">\r\n          <div class=\"col-md-12 content\">\r\n            Email: {{ user.Email }}\r\n          </div>\r\n        </div>\r\n        <div class=\"row\">\r\n          <div class=\"col-md-10 content\">\r\n            Added on: {{ user.DateTime }}\r\n          </div>\r\n          <div class=\"col-md-2\" *ngIf=\"user.UserName !== 'Admin'\r\n          && user.UserName !== 'Cashier'\">\r\n            <i\r\n              title=\"Remove this user\"\r\n              style=\"cursor: pointer\"\r\n              (click)=\"deleteUser(user, i)\"\r\n              class=\"fa fa-times-circle-o remove-order\"\r\n              aria-hidden=\"true\"></i>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col-md-12 total\">\r\n        Total {{ modifiedUser.length }} (s)\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/admin/users/users.component.scss":
/*!*************************************************************!*\
  !*** ./src/app/components/admin/users/users.component.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYWRtaW4vdXNlcnMvdXNlcnMuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/components/admin/users/users.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/components/admin/users/users.component.ts ***!
  \***********************************************************/
/*! exports provided: UsersComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UsersComponent", function() { return UsersComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _models_modified_user_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../models/modified-user.model */ "./src/app/models/modified-user.model.ts");
/* harmony import */ var _services_shared_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../services/shared/auth.service */ "./src/app/services/shared/auth.service.ts");





var UsersComponent = /** @class */ (function () {
    function UsersComponent(authService, route) {
        this.authService = authService;
        this.route = route;
        this.isDisabled = false;
        this.term = '';
        this.modifiedUser = [];
        this.emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
        this.roles = [];
    }
    UsersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.resetForm();
        this.route.data.
            subscribe(function (data) {
            _this.roles = data['roles'];
            _this.modifiedUser = data['users'];
        });
    };
    UsersComponent.prototype.resetForm = function (form) {
        if (form != null) {
            form.reset();
        }
        this.user = {
            UserName: '',
            Password: '',
            Email: ''
        };
    };
    UsersComponent.prototype.OnSubmit = function (form) {
        var _this = this;
        this.isDisabled = true;
        var dateTime = new Date().toLocaleString();
        this.authService.registerUser(form.value.UserName, form.value.Password, form.value.Email, form.value.roleName, dateTime)
            .subscribe(function (data) {
            if (data.Succeeded === true) {
                _this.isDisabled = false;
                var newUser = new _models_modified_user_model__WEBPACK_IMPORTED_MODULE_3__["ModifiedUserModel"](form.value.UserName, form.value.Email, form.value.roleName, dateTime);
                _this.authService.getUsers()
                    .subscribe(function (users) {
                    _this.modifiedUser = users;
                    alert('Registration Successful!');
                    _this.resetForm(form);
                });
            }
            else {
                _this.isDisabled = false;
                alert(data.Errors[0]);
            }
        });
    };
    UsersComponent.prototype.deleteUser = function (user, index) {
        var _this = this;
        var dialog = confirm('Delete this user?\n' +
            'You will lose any kind of data associated with the current user!');
        if (dialog === true) {
            this.authService.deleteUser(user).subscribe(function (data) {
                _this.authService.getUsers()
                    .subscribe(function (users) {
                    _this.modifiedUser = users;
                });
            });
        }
    };
    UsersComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-users',
            template: __webpack_require__(/*! ./users.component.html */ "./src/app/components/admin/users/users.component.html"),
            styles: [__webpack_require__(/*! ./users.component.scss */ "./src/app/components/admin/users/users.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_shared_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]])
    ], UsersComponent);
    return UsersComponent;
}());



/***/ }),

/***/ "./src/app/components/forbidden/forbidden.component.html":
/*!***************************************************************!*\
  !*** ./src/app/components/forbidden/forbidden.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\"\r\n     style=\"\r\n     padding-top: 200px;\r\n     text-align: center;\r\n     font-size: 40px;\">\r\n  <div class=\"\r\n  col-lg-12\r\n  col-md-12\r\n  col-sm-12\r\n  col-xs-12\">\r\n    You have no permission to view this page!\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/forbidden/forbidden.component.scss":
/*!***************************************************************!*\
  !*** ./src/app/components/forbidden/forbidden.component.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvZm9yYmlkZGVuL2ZvcmJpZGRlbi5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/forbidden/forbidden.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/components/forbidden/forbidden.component.ts ***!
  \*************************************************************/
/*! exports provided: ForbiddenComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ForbiddenComponent", function() { return ForbiddenComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var ForbiddenComponent = /** @class */ (function () {
    function ForbiddenComponent() {
    }
    ForbiddenComponent.prototype.ngOnInit = function () {
    };
    ForbiddenComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-forbidden',
            template: __webpack_require__(/*! ./forbidden.component.html */ "./src/app/components/forbidden/forbidden.component.html"),
            styles: [__webpack_require__(/*! ./forbidden.component.scss */ "./src/app/components/forbidden/forbidden.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ForbiddenComponent);
    return ForbiddenComponent;
}());



/***/ }),

/***/ "./src/app/components/header/header.component.html":
/*!*********************************************************!*\
  !*** ./src/app/components/header/header.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n\n  <div class=\"col-xl-1\"\n       style=\"font-size: 45px;\n       font-family: 'Times New Roman', sans-serif;\">\n    <span\n      style=\"outline: 0; cursor: pointer;\"\n      routerLink=\"/pos\">hodoo</span>\n  </div>\n\n  <div class=\"col-xl-2 text-xl-right\" style=\"padding-top: 15px;\">\n    <a\n      style=\"text-decoration: none; font-size: 19px; color: black;\"\n      routerLink=\"/pos\"\n      routerLinkActive=\"active\">Point of Sale</a>\n  </div>\n\n  <div class=\"col-xl-2\" style=\"padding-top: 15px;\">\n    <a\n      style=\"text-decoration: none; font-size: 19px; color: black;\"\n      routerLink=\"/admin\"\n      routerLinkActive=\"active\">Administration</a>\n  </div>\n\n  <div class=\"col-xl-6 text-xl-right\" style=\"padding-top: 20px; font-weight: bold;\">\n    <i style=\"font-weight: bold;\" class=\"fa fa-user-o\"></i> {{ userName }}\n  </div>\n\n  <div class=\"col-xl-1\" style=\"padding-top: 15px;\">\n    <button class=\"btn btn-primary\" (click)=\"logOut()\">Logout</button>\n  </div>\n\n</div>\n\n<hr>\n"

/***/ }),

/***/ "./src/app/components/header/header.component.scss":
/*!*********************************************************!*\
  !*** ./src/app/components/header/header.component.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2hlYWRlci5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/header/header.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/components/header/header.component.ts ***!
  \*******************************************************/
/*! exports provided: HeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderComponent", function() { return HeaderComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");



var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(router) {
        this.router = router;
    }
    HeaderComponent.prototype.ngOnInit = function () {
        this.userName = JSON.parse(JSON.stringify(localStorage.getItem('userName')));
    };
    HeaderComponent.prototype.logOut = function () {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        this.router.navigate(['/login']);
    };
    HeaderComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-header',
            template: __webpack_require__(/*! ./header.component.html */ "./src/app/components/header/header.component.html"),
            styles: [__webpack_require__(/*! ./header.component.scss */ "./src/app/components/header/header.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], HeaderComponent);
    return HeaderComponent;
}());



/***/ }),

/***/ "./src/app/components/login/login.component.html":
/*!*******************************************************!*\
  !*** ./src/app/components/login/login.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n\r\n\r\n<div class=\"row\"\r\n     style=\"\r\n     font-family: 'Times New Roman', sans-serif;\r\n     font-size: 100px;\r\n     text-align: center;\r\n     padding-top: 35px;\"\r\n>\r\n  <div class=\"\r\n  col-xl-12\">\r\n    hodoo\r\n  </div>\r\n</div>\r\n\r\n\r\n<div class=\"row\"\r\n     style=\"\r\n     text-align: center;\r\n     font-size: 25px;\">\r\n  <div class=\"\r\n  col-xl-12\r\n  \">\r\n    UserModel Login\r\n  </div>\r\n</div>\r\n\r\n\r\n<br>\r\n\r\n<form\r\n  autocomplete=\"off\"\r\n  #userLoginForm=\"ngForm\"\r\n  (ngSubmit)=\"OnSubmit()\">\r\n\r\n\r\n  <div class=\"row form-group\">\r\n    <div class=\"offset-xl-4 col-xl-4\">\r\n      <label style=\"font-weight: 300;\">UserModel Name</label>\r\n      <input class=\"form-control\"\r\n             type=\"text\"\r\n             name=\"userName\"\r\n             ngModel\r\n             #userName=\"ngModel\"\r\n             required>\r\n      <p\r\n        style=\"color: red; margin-bottom: 0;\"\r\n        *ngIf=\"userName.invalid && (userName.dirty || userName.touched)\">\r\n        UserModel name is required!\r\n      </p>\r\n    </div>\r\n  </div>\r\n\r\n\r\n\r\n  <div class=\"row form-group\">\r\n    <div class=\"offset-xl-4 col-xl-4\">\r\n      <label style=\"font-weight: 300;\">Password</label>\r\n      <input\r\n        class=\"form-control\"\r\n        type=\"password\"\r\n        name=\"password\"\r\n        ngModel\r\n        #password=\"ngModel\"\r\n        required>\r\n      <p\r\n        style=\"color: red; margin-bottom: 0;\"\r\n        *ngIf=\"password.invalid && (password.dirty || password.touched)\">\r\n        Password is required!\r\n      </p>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row\"\r\n       style=\"text-align: center;\">\r\n    <div class=\"\r\n        col-xl-12\r\n        \">\r\n      <button\r\n        [disabled]=\"isDisabled || userLoginForm.invalid\"\r\n        class=\"btn btn-primary\"\r\n        type=\"submit\">\r\n        Login</button>\r\n\r\n    </div>\r\n  </div>\r\n\r\n  <br>\r\n  <div class=\"row\"\r\n       style=\"text-align: center;\">\r\n    <div class=\"\r\n        col-xl-12\r\n       \">\r\n      <a\r\n        style=\"text-decoration: none;\"\r\n        routerLink=\"/reset-password\">Forgot your password?</a>\r\n    </div>\r\n  </div>\r\n\r\n</form>\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/components/login/login.component.scss":
/*!*******************************************************!*\
  !*** ./src/app/components/login/login.component.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvbG9naW4vbG9naW4uY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/components/login/login.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/components/login/login.component.ts ***!
  \*****************************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_shared_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/shared/auth.service */ "./src/app/services/shared/auth.service.ts");





var LoginComponent = /** @class */ (function () {
    function LoginComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.isLoginError = false;
        this.isDisabled = false;
    }
    LoginComponent.prototype.ngOnInit = function () { };
    LoginComponent.prototype.OnSubmit = function () {
        var _this = this;
        if (this.form.value.userName === '' || this.form.value.password === '') {
            return;
        }
        this.isDisabled = true;
        this.authService.
            userAuthentication(this.form.value.userName, this.form.value.password)
            .subscribe(function (data) {
            localStorage.setItem('userToken', data.access_token);
            localStorage.setItem('userRoles', data.role);
            localStorage.setItem('userName', _this.form.value.userName);
            if (_this.authService.roleMatch(['Cashier'])) {
                _this.router.navigate(['/pos']);
            }
            else {
                _this.router.navigate(['/pos']);
            }
        }, function (err) {
            _this.isLoginError = true;
            if (_this.isLoginError === true) {
                alert('User name or password is incorrect!');
                _this.isDisabled = false;
            }
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('userLoginForm'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgForm"])
    ], LoginComponent.prototype, "form", void 0);
    LoginComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/components/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.scss */ "./src/app/components/login/login.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_shared_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/components/new-password/new-password.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/components/new-password/new-password.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<div class=\"row\"\r\n     style=\"\r\n     font-family: 'Times New Roman', sans-serif;\r\n     font-size: 100px;\r\n     text-align: center;\r\n     padding-top: 35px;\">\r\n  <div\r\n    class=\"\r\n    col-xl-12\">\r\n    hodoo\r\n  </div>\r\n</div>\r\n\r\n\r\n<form\r\n  #newPassword=\"ngForm\"\r\n  (ngSubmit)=\"resetPassword(newPassword)\">\r\n\r\n<div class=\"row form-group\">\r\n  <div class=\r\n         \"offset-xl-4 col-xl-4\">\r\n          <label style=\"font-weight: 300;\">Enter reset code</label>\r\n          <input class=\"form-control\"\r\n                 type=\"text\"\r\n                 name=\"code\"\r\n                 ngModel\r\n                 required>\r\n        </div>\r\n</div>\r\n\r\n      <div class=\"row form-group\">\r\n        <div\r\n          class=\"\r\n          offset-xl-4 col-xl-4\r\n          \">\r\n          <label style=\"font-weight: 300;\">New password</label>\r\n          <input class=\"form-control\"\r\n                 type=\"password\"\r\n                 name=\"password\"\r\n                 ngModel\r\n                 required>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"row form-group\">\r\n        <div\r\n          class=\"offset-xl-4 col-xl-4\r\n         \">\r\n          <label style=\"font-weight: 300;\">Confirm new password</label>\r\n          <input class=\"form-control\"\r\n                 type=\"password\"\r\n                 name=\"confirmPassword\"\r\n                 ngModel\r\n                 required>\r\n        </div>\r\n      </div>\r\n\r\n      <br>\r\n\r\n      <div class=\"row\"\r\n        style=\"text-align: center;\">\r\n        <div\r\n          class=\"\r\n          col-xl-12\r\n          \">\r\n          <button\r\n            class=\"btn btn-primary \"\r\n            type=\"submit\"\r\n            [disabled]=\"!newPassword.valid || isDisabled\"\r\n          >Reset Password</button>\r\n        </div>\r\n      </div>\r\n\r\n\r\n\r\n</form>\r\n"

/***/ }),

/***/ "./src/app/components/new-password/new-password.component.scss":
/*!*********************************************************************!*\
  !*** ./src/app/components/new-password/new-password.component.scss ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvbmV3LXBhc3N3b3JkL25ldy1wYXNzd29yZC5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/new-password/new-password.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/components/new-password/new-password.component.ts ***!
  \*******************************************************************/
/*! exports provided: NewPasswordComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewPasswordComponent", function() { return NewPasswordComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_shared_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/shared/auth.service */ "./src/app/services/shared/auth.service.ts");




var NewPasswordComponent = /** @class */ (function () {
    function NewPasswordComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.isDisabled = false;
    }
    NewPasswordComponent.prototype.ngOnInit = function () {
    };
    NewPasswordComponent.prototype.resetPassword = function (form) {
        var _this = this;
        this.isDisabled = true;
        if (form.value.password !== form.value.confirmPassword) {
            this.isDisabled = false;
            alert('Your password did not match!');
            form.controls['password'].reset();
            form.controls['confirmPassword'].reset();
        }
        else {
            this.authService.newPassword(form.value.password, form.value.code)
                .subscribe(function (data) {
                if (data === 'Successful') {
                    alert('password changed successfully! You can login now.');
                    _this.router.navigate(['/login']);
                }
                else {
                    alert('Incorrect reset code! Try again.');
                }
            });
        }
    };
    NewPasswordComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-new-password',
            template: __webpack_require__(/*! ./new-password.component.html */ "./src/app/components/new-password/new-password.component.html"),
            styles: [__webpack_require__(/*! ./new-password.component.scss */ "./src/app/components/new-password/new-password.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_shared_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], NewPasswordComponent);
    return NewPasswordComponent;
}());



/***/ }),

/***/ "./src/app/components/page-not-found/page-not-found.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/components/page-not-found/page-not-found.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<div class=\"row\"\r\n     style=\"\r\n     padding-top: 200px;\r\n     text-align: center;\r\n     font-size: 40px;\"\r\n>\r\n  <div class=\"\r\n  col-lg-12\r\n  col-md-12\r\n  col-sm-12\r\n  col-xs-12\">\r\n    This page is not found!\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/page-not-found/page-not-found.component.scss":
/*!*************************************************************************!*\
  !*** ./src/app/components/page-not-found/page-not-found.component.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvcGFnZS1ub3QtZm91bmQvcGFnZS1ub3QtZm91bmQuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/components/page-not-found/page-not-found.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/components/page-not-found/page-not-found.component.ts ***!
  \***********************************************************************/
/*! exports provided: PageNotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageNotFoundComponent", function() { return PageNotFoundComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var PageNotFoundComponent = /** @class */ (function () {
    function PageNotFoundComponent() {
    }
    PageNotFoundComponent.prototype.ngOnInit = function () {
    };
    PageNotFoundComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-page-not-found',
            template: __webpack_require__(/*! ./page-not-found.component.html */ "./src/app/components/page-not-found/page-not-found.component.html"),
            styles: [__webpack_require__(/*! ./page-not-found.component.scss */ "./src/app/components/page-not-found/page-not-found.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], PageNotFoundComponent);
    return PageNotFoundComponent;
}());



/***/ }),

/***/ "./src/app/components/point-of-sale/menu/menu.component.html":
/*!*******************************************************************!*\
  !*** ./src/app/components/point-of-sale/menu/menu.component.html ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row empty\" *ngIf=\"total === 0; else notEmpty\">\r\n  <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12\">\r\n  No item is available\r\n  </div>\r\n</div>\r\n\r\n<ng-template #notEmpty>\r\n\r\n<div class=\"row\">\r\n  <div class=\"col-lg-3 col-md-3 food-body\">\r\n      <i class=\"fa fa-search\"></i>\r\n      <input class=\"box\" type=\"text\" [(ngModel)]=\"term\" placeholder=\"Search Products...\">\r\n  </div>\r\n</div>\r\n\r\n\r\n\r\n\r\n<div class=\"row left\">\r\n    <div class=\"col-lg-4 col-md-4\"\r\n         *ngFor=\"let foodItems of foodItems | filter:term\r\n        ; let i = index\">\r\n      <div class=\"row\">\r\n        <div class=\"col-lg-8 col-md-8 name\">\r\n       SN-{{ foodItems.SerialNo }}.   {{ foodItems.Name }}\r\n        </div>\r\n        <div class=\"col-lg-4 col-md-4 price\">\r\n          {{ foodItems.Price }} BDT\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-lg-12 col-md-12 \">\r\n          <img [src]=\"foodItems.FoodItemImageName\"\r\n               class=\"image\"\r\n          >\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-lg-4 col-md-4\">\r\n          <button\r\n            class=\"all-categories-button\"\r\n            (click)=\"UpdateCart(foodItems.Id, foodItems.Price,\r\n            foodItems.Name, foodItems.SerialNo, foodItems.InventoryCost, true, i)\">\r\n            Add\r\n          </button>\r\n        </div>\r\n        <div class=\"col-lg-4 col-md-4 input-box\">\r\n          <input type=\"number\"\r\n                 min=\"1\"\r\n                 id=\"amount\"\r\n                 class=\"form-control\"\r\n                 [(ngModel)]=\"selectedQuantity[i]\"\r\n                 #amountInput\r\n          >\r\n        </div>\r\n        <div class=\"col-lg-4 col-md-4\">\r\n          <button\r\n            class=\"all-categories-button\"\r\n            (click)=\"UpdateCart(foodItems.Id, foodItems.Price,foodItems.Name,\r\n             foodItems.InventoryCost, false, i)\">\r\n            Remove\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n</div>\r\n</ng-template>\r\n"

/***/ }),

/***/ "./src/app/components/point-of-sale/menu/menu.component.scss":
/*!*******************************************************************!*\
  !*** ./src/app/components/point-of-sale/menu/menu.component.scss ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".all-categories-button {\n  width: 100%;\n  height: 100%;\n  font-family: \"Arial Narrow\";\n  color: #d32039;\n  background-color: #ffffdf;\n  border: 1.2px solid #ae0000;\n  border-radius: 5px;\n  font-size: 1vw;\n  padding-top: 1vh;\n  padding-bottom: 1vh;\n  font-weight: bold; }\n\n.all-categories-button:hover {\n  background-color: #d32039;\n  color: #ffffdf;\n  font-family: \"Arial Narrow\";\n  font-weight: bold;\n  border: 1.2px solid #ffffdf;\n  border-radius: 5px; }\n\n.all-categories-button:focus {\n  outline: 0; }\n\n.name {\n  color: #8e0017;\n  font-family: \"Times New Roman\";\n  text-align: left;\n  font-size: 1vw;\n  padding-top: 1vh;\n  font-weight: bold; }\n\n.price {\n  color: #8e0017;\n  font-family: \"Times New Roman\";\n  text-align: right;\n  font-size: 1vw;\n  padding-top: 1vh;\n  font-weight: bold; }\n\n.image {\n  border: 1px solid ghostwhite;\n  border-radius: 10px;\n  height: 36vh;\n  width: 100%; }\n\n.food-body {\n  position: fixed;\n  z-index: 999;\n  background-color: ghostwhite;\n  padding-top: 10px;\n  padding-bottom: 10px;\n  margin-top: -2px; }\n\n.left {\n  height: 70vh;\n  box-sizing: border-box;\n  overflow: auto;\n  margin-top: 50px; }\n\n.fa-search {\n  position: absolute;\n  padding-top: 1.4vh;\n  padding-left: .9vw;\n  font-size: 1vw; }\n\n.box {\n  width: 20vw;\n  height: 4.5vh;\n  background: #fcfcfc;\n  border: .15vw solid #9c0000;\n  border-radius: 9vw;\n  text-indent: 2.1vw;\n  color: #9c0000;\n  font-size: .9vw;\n  font-family: \"Lato\",\"Lucida Grande\", \"Helvetica\", \"Verdana\", \"Arial\"; }\n\n.box:focus {\n  outline: 0; }\n\n::-webkit-scrollbar {\n  width: 4px; }\n\n::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);\n  border-radius: 10px; }\n\n::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  background-color: rgba(0, 0, 0, 0.61);\n  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); }\n\n.empty {\n  font-family: \"Times New Roman\";\n  color: #630606;\n  font-size: 1.5vw;\n  font-weight: bold;\n  padding-top: 3vh;\n  text-align: center; }\n\ninput {\n  height: 4.8vh;\n  font-size: 1vw; }\n\n.input-box {\n  padding-right: 0;\n  padding-left: 0; }\n\ninput::-webkit-outer-spin-button,\ninput::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n  margin: 0; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9wb2ludC1vZi1zYWxlL21lbnUvRDpcXFdlYiBEZXZlbG9wbWVudFxcUHJvamVjdHNcXFJlc3RhdXJhbnRNYW5hZ2VtZW50QXBwXFxSZXN0YXVyYW50TWFuYWdlbWVudEFwcC9zcmNcXGFwcFxcY29tcG9uZW50c1xccG9pbnQtb2Ytc2FsZVxcbWVudVxcbWVudS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNFLFdBQVU7RUFDVixZQUFXO0VBQ1gsMkJBQTBCO0VBQzFCLGNBQWM7RUFDZCx5QkFBeUI7RUFDekIsMkJBQTJCO0VBQzNCLGtCQUFrQjtFQUNsQixjQUFjO0VBQ2QsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtFQUNuQixpQkFBaUIsRUFBQTs7QUFJbkI7RUFDRSx5QkFBeUI7RUFDekIsY0FBYztFQUNkLDJCQUEwQjtFQUMxQixpQkFBZ0I7RUFDaEIsMkJBQTJCO0VBQzNCLGtCQUFrQixFQUFBOztBQUdwQjtFQUNFLFVBQVMsRUFBQTs7QUFHWDtFQUNFLGNBQWM7RUFDZCw4QkFBNkI7RUFDN0IsZ0JBQWdCO0VBQ2hCLGNBQWM7RUFDZCxnQkFBZ0I7RUFDaEIsaUJBQWlCLEVBQUE7O0FBRW5CO0VBQ0UsY0FBYztFQUNkLDhCQUE2QjtFQUM3QixpQkFBaUI7RUFDakIsY0FBYztFQUNkLGdCQUFnQjtFQUNoQixpQkFBaUIsRUFBQTs7QUFHbkI7RUFDRSw0QkFBNEI7RUFDNUIsbUJBQW1CO0VBQ25CLFlBQVk7RUFDWixXQUFXLEVBQUE7O0FBTWI7RUFDRSxlQUFlO0VBQ2YsWUFBWTtFQUNaLDRCQUE0QjtFQUM1QixpQkFBaUI7RUFDakIsb0JBQW9CO0VBQ3BCLGdCQUFnQixFQUFBOztBQUdsQjtFQUNFLFlBQVk7RUFDWixzQkFBc0I7RUFDdEIsY0FBYztFQUNkLGdCQUFnQixFQUFBOztBQUdsQjtFQUNFLGtCQUFrQjtFQUNsQixrQkFBa0I7RUFDbEIsa0JBQWtCO0VBQ2xCLGNBQWMsRUFBQTs7QUFHaEI7RUFDRSxXQUFXO0VBQ1gsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQiwyQkFBMkI7RUFDM0Isa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixjQUFjO0VBQ2QsZUFBZTtFQUNmLG9FQUFvRSxFQUFBOztBQUd0RTtFQUNFLFVBQVUsRUFBQTs7QUFHWjtFQUNFLFVBQVUsRUFBQTs7QUFHWjtFQUNFLG9EQUFpRDtFQUNqRCxtQkFBbUIsRUFBQTs7QUFHckI7RUFDRSxtQkFBbUI7RUFDbkIscUNBQXFDO0VBQ3JDLG9EQUFpRCxFQUFBOztBQUduRDtFQUNFLDhCQUE2QjtFQUM3QixjQUFjO0VBQ2QsZ0JBQWdCO0VBQ2hCLGlCQUFpQjtFQUNqQixnQkFBZ0I7RUFDaEIsa0JBQWtCLEVBQUE7O0FBR3BCO0VBQ0UsYUFBYTtFQUNiLGNBQWMsRUFBQTs7QUFHaEI7RUFDRSxnQkFBZ0I7RUFDaEIsZUFBZSxFQUFBOztBQUlqQjs7RUFFRSx3QkFBd0I7RUFDeEIsU0FBUyxFQUFBIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9wb2ludC1vZi1zYWxlL21lbnUvbWVudS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4uYWxsLWNhdGVnb3JpZXMtYnV0dG9uIHtcclxuICB3aWR0aDoxMDAlO1xyXG4gIGhlaWdodDoxMDAlO1xyXG4gIGZvbnQtZmFtaWx5OlwiQXJpYWwgTmFycm93XCI7XHJcbiAgY29sb3I6ICNkMzIwMzk7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZkZjtcclxuICBib3JkZXI6IDEuMnB4IHNvbGlkICNhZTAwMDA7XHJcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gIGZvbnQtc2l6ZTogMXZ3O1xyXG4gIHBhZGRpbmctdG9wOiAxdmg7XHJcbiAgcGFkZGluZy1ib3R0b206IDF2aDtcclxuICBmb250LXdlaWdodDogYm9sZDtcclxufVxyXG5cclxuXHJcbi5hbGwtY2F0ZWdvcmllcy1idXR0b246aG92ZXJ7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2QzMjAzOTtcclxuICBjb2xvcjogI2ZmZmZkZjtcclxuICBmb250LWZhbWlseTpcIkFyaWFsIE5hcnJvd1wiO1xyXG4gIGZvbnQtd2VpZ2h0OmJvbGQ7XHJcbiAgYm9yZGVyOiAxLjJweCBzb2xpZCAjZmZmZmRmO1xyXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcclxufVxyXG5cclxuLmFsbC1jYXRlZ29yaWVzLWJ1dHRvbjpmb2N1c3tcclxuICBvdXRsaW5lOjA7XHJcbn1cclxuXHJcbi5uYW1le1xyXG4gIGNvbG9yOiAjOGUwMDE3O1xyXG4gIGZvbnQtZmFtaWx5OlwiVGltZXMgTmV3IFJvbWFuXCI7XHJcbiAgdGV4dC1hbGlnbjogbGVmdDtcclxuICBmb250LXNpemU6IDF2dztcclxuICBwYWRkaW5nLXRvcDogMXZoO1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG59XHJcbi5wcmljZXtcclxuICBjb2xvcjogIzhlMDAxNztcclxuICBmb250LWZhbWlseTpcIlRpbWVzIE5ldyBSb21hblwiO1xyXG4gIHRleHQtYWxpZ246IHJpZ2h0O1xyXG4gIGZvbnQtc2l6ZTogMXZ3O1xyXG4gIHBhZGRpbmctdG9wOiAxdmg7XHJcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbn1cclxuXHJcbi5pbWFnZXtcclxuICBib3JkZXI6IDFweCBzb2xpZCBnaG9zdHdoaXRlO1xyXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgaGVpZ2h0OiAzNnZoO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4uZm9vZC1ib2R5e1xyXG4gIHBvc2l0aW9uOiBmaXhlZDtcclxuICB6LWluZGV4OiA5OTk7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogZ2hvc3R3aGl0ZTtcclxuICBwYWRkaW5nLXRvcDogMTBweDtcclxuICBwYWRkaW5nLWJvdHRvbTogMTBweDtcclxuICBtYXJnaW4tdG9wOiAtMnB4O1xyXG59XHJcblxyXG4ubGVmdHtcclxuICBoZWlnaHQ6IDcwdmg7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICBvdmVyZmxvdzogYXV0bztcclxuICBtYXJnaW4tdG9wOiA1MHB4O1xyXG59XHJcblxyXG4uZmEtc2VhcmNoIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgcGFkZGluZy10b3A6IDEuNHZoO1xyXG4gIHBhZGRpbmctbGVmdDogLjl2dztcclxuICBmb250LXNpemU6IDF2dztcclxufVxyXG5cclxuLmJveHtcclxuICB3aWR0aDogMjB2dztcclxuICBoZWlnaHQ6IDQuNXZoO1xyXG4gIGJhY2tncm91bmQ6ICNmY2ZjZmM7XHJcbiAgYm9yZGVyOiAuMTV2dyBzb2xpZCAjOWMwMDAwO1xyXG4gIGJvcmRlci1yYWRpdXM6IDl2dztcclxuICB0ZXh0LWluZGVudDogMi4xdnc7XHJcbiAgY29sb3I6ICM5YzAwMDA7XHJcbiAgZm9udC1zaXplOiAuOXZ3O1xyXG4gIGZvbnQtZmFtaWx5OiBcIkxhdG9cIixcIkx1Y2lkYSBHcmFuZGVcIiwgXCJIZWx2ZXRpY2FcIiwgXCJWZXJkYW5hXCIsIFwiQXJpYWxcIjtcclxufVxyXG5cclxuLmJveDpmb2N1c3tcclxuICBvdXRsaW5lOiAwO1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICB3aWR0aDogNHB4O1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcclxuICAtd2Via2l0LWJveC1zaGFkb3c6IGluc2V0IDAgMCA2cHggcmdiYSgwLDAsMCwwLjMpO1xyXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbn1cclxuXHJcbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xyXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjYxKTtcclxuICAtd2Via2l0LWJveC1zaGFkb3c6IGluc2V0IDAgMCA2cHggcmdiYSgwLDAsMCwwLjUpO1xyXG59XHJcblxyXG4uZW1wdHl7XHJcbiAgZm9udC1mYW1pbHk6XCJUaW1lcyBOZXcgUm9tYW5cIjtcclxuICBjb2xvcjogIzYzMDYwNjtcclxuICBmb250LXNpemU6IDEuNXZ3O1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gIHBhZGRpbmctdG9wOiAzdmg7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59XHJcblxyXG5pbnB1dHtcclxuICBoZWlnaHQ6IDQuOHZoO1xyXG4gIGZvbnQtc2l6ZTogMXZ3O1xyXG59XHJcblxyXG4uaW5wdXQtYm94e1xyXG4gIHBhZGRpbmctcmlnaHQ6IDA7XHJcbiAgcGFkZGluZy1sZWZ0OiAwO1xyXG59XHJcblxyXG5cclxuaW5wdXQ6Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24sXHJcbmlucHV0Ojotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uIHtcclxuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgbWFyZ2luOiAwO1xyXG59XHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/components/point-of-sale/menu/menu.component.ts":
/*!*****************************************************************!*\
  !*** ./src/app/components/point-of-sale/menu/menu.component.ts ***!
  \*****************************************************************/
/*! exports provided: MenuComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MenuComponent", function() { return MenuComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var angular2_uuid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! angular2-uuid */ "./node_modules/angular2-uuid/index.js");
/* harmony import */ var angular2_uuid__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(angular2_uuid__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../services/data-storage/table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");
/* harmony import */ var _services_shared_point_of_sale_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../services/shared/point-of-sale.service */ "./src/app/services/shared/point-of-sale.service.ts");
/* harmony import */ var _models_ordered_item_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../models/ordered-item.model */ "./src/app/models/ordered-item.model.ts");






var MenuComponent = /** @class */ (function () {
    function MenuComponent(pointOfSaleService, dataStorageService) {
        this.pointOfSaleService = pointOfSaleService;
        this.dataStorageService = dataStorageService;
        this.foodItems = [];
        this.inventories = [];
        this.selectedQuantity = [];
        this.condition = false;
        this.uuidCodeOne = '';
        this.uuidCodeTwo = '';
        this.uuidCodeThree = '';
        this.imageUrl = 'assets/noImage.png';
        this.rootUrl = '';
        this.uuidCodeOne = angular2_uuid__WEBPACK_IMPORTED_MODULE_2__["UUID"].UUID();
        this.uuidCodeTwo = angular2_uuid__WEBPACK_IMPORTED_MODULE_2__["UUID"].UUID();
        this.uuidCodeThree = angular2_uuid__WEBPACK_IMPORTED_MODULE_2__["UUID"].UUID();
    }
    MenuComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rootUrl = this.dataStorageService.rootUrl + '/Content/';
        this.foodItems = this.pointOfSaleService.foodItems;
        this.pointOfSaleService.foodItemsChanged
            .subscribe(function (foodItem) {
            _this.foodItems = foodItem;
        });
        this.inventories = this.pointOfSaleService.inventories;
        this.subscription = this.pointOfSaleService.inventoriesChanged
            .subscribe(function (inventories) {
            _this.inventories = inventories;
        });
        this.total = this.foodItems.length;
        for (var i = 0; i < this.foodItems.length; i++) {
            if (this.foodItems[i].FoodItemImageName === null || this.foodItems[i].FoodItemImageName === '') {
                this.foodItems[i].FoodItemImageName = this.imageUrl;
            }
            else {
                this.foodItems[i].FoodItemImageName = this.rootUrl + this.foodItems[i].FoodItemImageName;
            }
        }
    };
    MenuComponent.prototype.UpdateCart = function (id, price, name, serialNo, makingCost, isAdd, index) {
        this.quantity = this.selectedQuantity[index];
        if (this.quantity > 0) {
            var foodItemId = id;
            var foodItemName = name;
            var Price = price;
            var orderId = null;
            if (this.pointOfSaleService.checkIfOrderedItemExist(id, orderId) === null) {
                var orderItemId = null;
                if (isAdd === true) {
                    this.AddToCart(orderItemId, orderId, this.quantity, foodItemId, foodItemName, serialNo, Price, makingCost);
                }
                else {
                    this.RemoveFromCart(orderItemId, orderId, this.quantity, foodItemId, foodItemName, Price, makingCost);
                }
            }
            else {
                var orderItemId = this.pointOfSaleService.checkIfOrderedItemExist(id, orderId);
                if (isAdd === true) {
                    this.AddToCart(orderItemId, orderId, this.quantity, foodItemId, foodItemName, serialNo, Price, makingCost);
                }
                else {
                    this.RemoveFromCart(orderItemId, orderId, this.quantity, foodItemId, foodItemName, Price, makingCost);
                }
            }
        }
    };
    MenuComponent.prototype.AddToCart = function (orderItemId, orderId, quantity, foodItemId, foodItemName, serialNo, price, makingCost) {
        for (var j = 0; j < this.foodItems.length; j++) {
            if (this.foodItems[j].Id === foodItemId) {
                var check = 0;
                for (var k = 0; k < this.foodItems[j].Ingredients.length; k++) {
                    var inventoryQuantity = this.foodItems[j].Ingredients[k].Quantity;
                    var totalQuantity = inventoryQuantity * quantity;
                    var inventoryId = this.foodItems[j].Ingredients[k].InventoryId;
                    for (var l = 0; l < this.inventories.length; l++) {
                        if (this.pointOfSaleService.inventories[l].Id === inventoryId) {
                            if (this.pointOfSaleService.inventories[l].RemainingQuantity > totalQuantity) {
                                check++;
                                if (check === this.foodItems[j].Ingredients.length) {
                                    this.pointOfSaleService.inventories[l].RemainingQuantity -= totalQuantity;
                                    var subTotal = this.pointOfSaleService.FoodItemSubTotalPrice(price, quantity);
                                    this.pointOfSaleService.grandTotalPrice(subTotal);
                                    this.condition = this.pointOfSaleService.checkExistingFoodItem(foodItemId);
                                    if (this.condition) {
                                        this.pointOfSaleService.increaseOnExistingFoodItem(foodItemId, quantity, subTotal);
                                    }
                                    else {
                                        var purchasedFood = new _models_ordered_item_model__WEBPACK_IMPORTED_MODULE_5__["OrderedItem"](orderItemId, null, foodItemId, quantity, price, subTotal);
                                        this.pointOfSaleService.addToOrderedItemsList(purchasedFood);
                                    }
                                    this.pointOfSaleService.totalQuantity
                                        = Number.parseInt(this.pointOfSaleService.totalQuantity.toString())
                                            + Number.parseInt(quantity.toString());
                                }
                            }
                        }
                    }
                }
                if (check < this.foodItems[j].Ingredients.length) {
                    alert('Insufficient inventories, please update your inventories first');
                }
                break;
            }
        }
    };
    MenuComponent.prototype.RemoveFromCart = function (orderItemId, orderId, quantity, foodItemId, foodItemName, price, makingCost) {
        var subTotal = this.pointOfSaleService.FoodItemSubTotalPrice(price, quantity);
        this.pointOfSaleService.removeFromFoodItemCart(foodItemId, quantity, subTotal);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('amountInput'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], MenuComponent.prototype, "amountInputRef", void 0);
    MenuComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-food-items',
            template: __webpack_require__(/*! ./menu.component.html */ "./src/app/components/point-of-sale/menu/menu.component.html"),
            styles: [__webpack_require__(/*! ./menu.component.scss */ "./src/app/components/point-of-sale/menu/menu.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_shared_point_of_sale_service__WEBPACK_IMPORTED_MODULE_4__["PointOfSaleService"],
            _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__["TableDataStorageService"]])
    ], MenuComponent);
    return MenuComponent;
}());



/***/ }),

/***/ "./src/app/components/point-of-sale/payment/payment.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/components/point-of-sale/payment/payment.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n<div class=\"row main-row\">\r\n<div class=\"col-lg-offset-9 col-md-offset-9 col-lg-3 col-md-3 col-sm-12 col-xs-12\">\r\n  <a style=\"cursor: pointer\"\r\n     (click)=\"discardOrder()\"\r\n     title=\"Destroy Current Order\">\r\n    <div class=\"col-lg-1 col-md-1 col-sm-6 col-xs-6 dashboard\">\r\n      <i class=\"fa fa-times-circle-o\" aria-hidden=\"true\"></i>\r\n    </div>\r\n  </a>\r\n</div>\r\n</div>\r\n\r\n\r\n\r\n<div class=\"row\">\r\n  <div class=\"\r\n  col-lg-offset-2\r\n   col-md-offset-2\r\n   col-sm-offset-2\r\n   col-lg-2 col-md-2 col-sm-2 col-xs-4\">\r\n    <button\r\n      class=\"back\"\r\n      (click)=\"back()\">\r\n      <i class=\"fa fa-angle-double-left\"></i>\r\n       Back</button>\r\n  </div>\r\n  <div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-4 payment\">\r\n    Payment\r\n  </div>\r\n  <div class=\"col-lg-2 col-md-2 col-sm-2 col-xs-4\">\r\n    <button\r\n      class=\"back \"\r\n      [ngClass]=\"[!checkCertainAmount() ? 'back' : 'un-back']\"\r\n      [disabled] = \"!checkCertainAmount()\"\r\n      (click)=\"validate()\">\r\n      Validate\r\n      <i class=\"fa fa-angle-double-right\"></i></button>\r\n  </div>\r\n</div>\r\n\r\n\r\n\r\n<div class=\"row\">\r\n  <div class=\"\r\n  col-lg-offset-3\r\n  col-md-offset-3\r\n  col-sm-offset-3\r\n  col-xs-offset-3\r\n  col-lg-6\r\n  col-md-6\r\n  col-sm-6\r\n  col-xs-6\r\n  grand-total\">\r\n    {{ grandTotal }} BDT\r\n  </div>\r\n</div>\r\n\r\n<div class=\"bar\">\r\n\r\n<div class=\"row title-row\">\r\n  <div class=\"col-lg-offset-2 col-md-offset-2 col-lg-8 col-md-8 col-sm-12 col-xs-12\">\r\n    <div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3 due\">\r\n      Due\r\n    </div>\r\n    <div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3 change\">\r\n      Remaining\r\n    </div>\r\n    <div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3 tendered\">\r\n      Tendered\r\n    </div>\r\n    <div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3 change\">\r\n      Change\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"row content-row\">\r\n  <div class=\"col-lg-offset-2 col-md-offset-2 col-lg-8 col-md-8 col-sm-12 col-xs-12 content\">\r\n    <div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3 due-box\">\r\n      {{ grandTotal }}\r\n    </div>\r\n    <div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3 due-box\" *ngIf=\"!checkCertainChange(); else showZero\">\r\n      {{ grandTotal - tendered }}\r\n    </div>\r\n      <ng-template #showZero>\r\n        <div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3 due-box\">\r\n          0\r\n        </div>\r\n      </ng-template>\r\n    <div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3\">\r\n      <input type=\"number\"\r\n             min=\"0\"\r\n             id=\"amount\"\r\n             class=\"form-control\"\r\n             [(ngModel)]=\"tendered\"\r\n      >\r\n    </div>\r\n    <div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3 change-box\" *ngIf=\"checkCertainAmount()\">\r\n      {{ tendered - grandTotal }}\r\n    </div>\r\n  </div>\r\n</div>\r\n</div>\r\n\r\n<div class=\"row table\">\r\n    <div class=\"col-lg-offset-2 col-md-offset-2 col-lg-8 col-md-8 col-sm-12 col-xs-12\">\r\n      <select\r\n        (change)=\"selectChangeHandler($event)\">\r\n        <option value=\"\">Select a Table</option>\r\n        <option *ngFor=\"let table of tables\" value=\"{{ table.Name }}\"\r\n                > {{ table.Name }} </option>\r\n      </select>\r\n    </div>\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/components/point-of-sale/payment/payment.component.scss":
/*!*************************************************************************!*\
  !*** ./src/app/components/point-of-sale/payment/payment.component.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".back {\n  width: 100%;\n  height: 100%;\n  font-family: \"Arial Narrow\";\n  color: #d32039;\n  background-color: #ffffdf;\n  border: 1.2px solid #ae0000;\n  border-radius: .4vw;\n  font-size: 2vw;\n  padding-top: 1vh;\n  padding-bottom: 1vh;\n  margin-top: 3vh;\n  font-weight: bold;\n  display: inline-block; }\n\n.back:hover {\n  background-color: white;\n  color: #7e0000;\n  font-family: \"Arial Narrow\";\n  font-weight: bold;\n  border: 1.2px solid #7e0000;\n  border-radius: .4vw; }\n\n.back:focus {\n  outline: 0; }\n\n.un-back {\n  width: 100%;\n  height: 100%;\n  font-family: \"Arial Narrow\";\n  color: #ffffdf;\n  background-color: #d32039;\n  border: 1.2px solid #ae0000;\n  border-radius: .4vw;\n  font-size: 2vw;\n  padding-top: 1vh;\n  padding-bottom: 1vh;\n  margin-top: 3vh;\n  font-weight: bold; }\n\n.un-back:hover {\n  background-color: #d32039;\n  color: #ffffdf;\n  font-family: \"Arial Narrow\";\n  font-weight: bold;\n  border: 1.2px solid #ae0000;\n  border-radius: .4vw; }\n\n.un-back:focus {\n  outline: 0; }\n\n.payment {\n  font-family: \"Arial Narrow\";\n  color: #7e0000;\n  font-weight: bold;\n  font-size: 2.5vw;\n  text-align: center;\n  padding-top: 5vh; }\n\n.bar {\n  margin-top: 40px; }\n\n.grand-total {\n  font-family: \"Arial Narrow\";\n  color: #7e0000;\n  font-size: 7vw;\n  text-align: center;\n  padding-top: 2vh; }\n\n.content {\n  border: .17vw solid #7e0000;\n  border-radius: .8vw;\n  background-color: #ffffdf; }\n\n.due, .tendered, .change {\n  font-family: \"Arial Narrow\";\n  color: #7e0000;\n  font-size: 3vw; }\n\n.due-box {\n  font-family: \"Arial Narrow\";\n  color: #7e0000;\n  font-size: 3vw; }\n\n.change-box {\n  font-family: \"Arial Narrow\";\n  color: #7e0000;\n  font-size: 3vw; }\n\ninput {\n  font-size: 3vw;\n  color: #7e0000;\n  font-family: \"Arial Narrow\";\n  border: .2vw solid #d32039;\n  width: 11.6vw;\n  height: auto;\n  padding-top: 0;\n  padding-left: .9vw; }\n\ninput:focus {\n  border: .2vw solid #7e0000; }\n\ninput::-webkit-outer-spin-button,\ninput::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n  margin: 0; }\n\n.table {\n  text-align: center;\n  margin-top: 1vh; }\n\n.drop-down {\n  text-align: center; }\n\nselect {\n  background-color: #ffffdf;\n  color: #7e0000;\n  font-family: \"align-self: ;\";\n  font-size: 2vw;\n  text-align: center;\n  border: 1px solid #7e0000;\n  border-radius: .5vw;\n  outline: none;\n  text-align: left;\n  cursor: pointer;\n  padding-right: 4vw;\n  padding-left: 4vw;\n  padding-top: .5vw;\n  padding-bottom: .5vw;\n  font-weight: bold; }\n\noption {\n  color: #7e0000;\n  text-align: left;\n  cursor: pointer;\n  font-weight: bold; }\n\n.dashboard {\n  width: 20%;\n  height: 100%;\n  font-family: \"Arial Narrow\";\n  color: #aa0909;\n  background-color: ghostwhite;\n  font-size: 2.8vw;\n  font-weight: bold;\n  text-align: center;\n  margin-top: 1vh; }\n\n.dashboard:hover {\n  color: #6a0d0e;\n  background-color: ghostwhite;\n  font-family: \"Arial Narrow\";\n  font-weight: bold; }\n\n.pop-up {\n  color: #7e0000;\n  font-size: 16px;\n  font-family: \"Berlin Sans FB\";\n  text-align: center; }\n\n.main-row {\n  border-bottom: 2px double #dfdfdf; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9wb2ludC1vZi1zYWxlL3BheW1lbnQvRDpcXFdlYiBEZXZlbG9wbWVudFxcUHJvamVjdHNcXFJlc3RhdXJhbnRNYW5hZ2VtZW50QXBwXFxSZXN0YXVyYW50TWFuYWdlbWVudEFwcC9zcmNcXGFwcFxcY29tcG9uZW50c1xccG9pbnQtb2Ytc2FsZVxccGF5bWVudFxccGF5bWVudC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFRTtFQUNFLFdBQVU7RUFDVixZQUFXO0VBQ1gsMkJBQTBCO0VBQzFCLGNBQWM7RUFDZCx5QkFBeUI7RUFDekIsMkJBQTJCO0VBQzNCLG1CQUFtQjtFQUNuQixjQUFjO0VBQ2QsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtFQUNuQixlQUFlO0VBQ2YsaUJBQWlCO0VBQ2pCLHFCQUFxQixFQUFBOztBQUd2QjtFQUNFLHVCQUF1QjtFQUN2QixjQUFjO0VBQ2QsMkJBQTBCO0VBQzFCLGlCQUFnQjtFQUNoQiwyQkFBMkI7RUFDM0IsbUJBQW1CLEVBQUE7O0FBR3JCO0VBQ0UsVUFBVSxFQUFBOztBQUlaO0VBQ0UsV0FBVTtFQUNWLFlBQVc7RUFDWCwyQkFBMEI7RUFDMUIsY0FBYztFQUNkLHlCQUF5QjtFQUN6QiwyQkFBMkI7RUFDM0IsbUJBQW1CO0VBQ25CLGNBQWM7RUFDZCxnQkFBZ0I7RUFDaEIsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZixpQkFBaUIsRUFBQTs7QUFJbkI7RUFDRSx5QkFBeUI7RUFDekIsY0FBYztFQUNkLDJCQUEwQjtFQUMxQixpQkFBZ0I7RUFDaEIsMkJBQTJCO0VBQzNCLG1CQUFtQixFQUFBOztBQUdyQjtFQUNFLFVBQVUsRUFBQTs7QUFHWjtFQUNFLDJCQUEwQjtFQUMxQixjQUFjO0VBQ2QsaUJBQWlCO0VBQ2pCLGdCQUFnQjtFQUNoQixrQkFBa0I7RUFDbEIsZ0JBQWdCLEVBQUE7O0FBRWxCO0VBQ0UsZ0JBQWdCLEVBQUE7O0FBSWxCO0VBQ0UsMkJBQTBCO0VBQzFCLGNBQWM7RUFDZCxjQUFjO0VBQ2Qsa0JBQWtCO0VBQ2xCLGdCQUFnQixFQUFBOztBQUlsQjtFQUNFLDJCQUEyQjtFQUMzQixtQkFBbUI7RUFDbkIseUJBQXlCLEVBQUE7O0FBRzNCO0VBQ0UsMkJBQTBCO0VBQzFCLGNBQWM7RUFDZCxjQUFjLEVBQUE7O0FBSWhCO0VBQ0UsMkJBQTBCO0VBQzFCLGNBQWM7RUFDZCxjQUFjLEVBQUE7O0FBR2hCO0VBQ0UsMkJBQTBCO0VBQzFCLGNBQWM7RUFDZCxjQUFjLEVBQUE7O0FBS2hCO0VBQ0UsY0FBYztFQUNkLGNBQWM7RUFDZCwyQkFBMkI7RUFDM0IsMEJBQTBCO0VBQzFCLGFBQWE7RUFDYixZQUFZO0VBQ1osY0FBYztFQUNkLGtCQUFrQixFQUFBOztBQUdwQjtFQUNFLDBCQUEwQixFQUFBOztBQUU1Qjs7RUFFRSx3QkFBd0I7RUFDeEIsU0FBUyxFQUFBOztBQUdYO0VBQ0Usa0JBQWtCO0VBQ2xCLGVBQWUsRUFBQTs7QUFJakI7RUFDRSxrQkFBa0IsRUFBQTs7QUFFcEI7RUFDRSx5QkFBeUI7RUFDekIsY0FBYztFQUNkLDRCQUEyQjtFQUMzQixjQUFjO0VBQ2Qsa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixtQkFBbUI7RUFDbkIsYUFBWTtFQUNaLGdCQUFnQjtFQUNoQixlQUFjO0VBQ2Qsa0JBQWtCO0VBQ2xCLGlCQUFpQjtFQUNqQixpQkFBaUI7RUFDakIsb0JBQW9CO0VBQ3BCLGlCQUFpQixFQUFBOztBQUduQjtFQUNFLGNBQWM7RUFDZCxnQkFBZ0I7RUFDaEIsZUFBYztFQUNkLGlCQUFpQixFQUFBOztBQUluQjtFQUNFLFVBQVM7RUFDVCxZQUFXO0VBQ1gsMkJBQTBCO0VBQzFCLGNBQWM7RUFDZCw0QkFBNEI7RUFDNUIsZ0JBQWU7RUFDZixpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLGVBQWUsRUFBQTs7QUFLakI7RUFDRSxjQUFjO0VBQ2QsNEJBQTRCO0VBQzVCLDJCQUEwQjtFQUMxQixpQkFBZ0IsRUFBQTs7QUFHbEI7RUFDRSxjQUFjO0VBQ2QsZUFBZTtFQUNmLDZCQUE2QjtFQUM3QixrQkFBa0IsRUFBQTs7QUFHcEI7RUFDRSxpQ0FBaUMsRUFBQSIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvcG9pbnQtb2Ytc2FsZS9wYXltZW50L3BheW1lbnQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbiAgLmJhY2t7XHJcbiAgICB3aWR0aDoxMDAlO1xyXG4gICAgaGVpZ2h0OjEwMCU7XHJcbiAgICBmb250LWZhbWlseTpcIkFyaWFsIE5hcnJvd1wiO1xyXG4gICAgY29sb3I6ICNkMzIwMzk7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmRmO1xyXG4gICAgYm9yZGVyOiAxLjJweCBzb2xpZCAjYWUwMDAwO1xyXG4gICAgYm9yZGVyLXJhZGl1czogLjR2dztcclxuICAgIGZvbnQtc2l6ZTogMnZ3O1xyXG4gICAgcGFkZGluZy10b3A6IDF2aDtcclxuICAgIHBhZGRpbmctYm90dG9tOiAxdmg7XHJcbiAgICBtYXJnaW4tdG9wOiAzdmg7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICB9XHJcblxyXG4gIC5iYWNrOmhvdmVye1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgICBjb2xvcjogIzdlMDAwMDtcclxuICAgIGZvbnQtZmFtaWx5OlwiQXJpYWwgTmFycm93XCI7XHJcbiAgICBmb250LXdlaWdodDpib2xkO1xyXG4gICAgYm9yZGVyOiAxLjJweCBzb2xpZCAjN2UwMDAwO1xyXG4gICAgYm9yZGVyLXJhZGl1czogLjR2dztcclxuICB9XHJcblxyXG4gIC5iYWNrOmZvY3Vze1xyXG4gICAgb3V0bGluZTogMDtcclxuICB9XHJcblxyXG5cclxuICAudW4tYmFja3tcclxuICAgIHdpZHRoOjEwMCU7XHJcbiAgICBoZWlnaHQ6MTAwJTtcclxuICAgIGZvbnQtZmFtaWx5OlwiQXJpYWwgTmFycm93XCI7XHJcbiAgICBjb2xvcjogI2ZmZmZkZjtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNkMzIwMzk7XHJcbiAgICBib3JkZXI6IDEuMnB4IHNvbGlkICNhZTAwMDA7XHJcbiAgICBib3JkZXItcmFkaXVzOiAuNHZ3O1xyXG4gICAgZm9udC1zaXplOiAydnc7XHJcbiAgICBwYWRkaW5nLXRvcDogMXZoO1xyXG4gICAgcGFkZGluZy1ib3R0b206IDF2aDtcclxuICAgIG1hcmdpbi10b3A6IDN2aDtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gIH1cclxuXHJcblxyXG4gIC51bi1iYWNrOmhvdmVye1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2QzMjAzOTtcclxuICAgIGNvbG9yOiAjZmZmZmRmO1xyXG4gICAgZm9udC1mYW1pbHk6XCJBcmlhbCBOYXJyb3dcIjtcclxuICAgIGZvbnQtd2VpZ2h0OmJvbGQ7XHJcbiAgICBib3JkZXI6IDEuMnB4IHNvbGlkICNhZTAwMDA7XHJcbiAgICBib3JkZXItcmFkaXVzOiAuNHZ3O1xyXG4gIH1cclxuXHJcbiAgLnVuLWJhY2s6Zm9jdXN7XHJcbiAgICBvdXRsaW5lOiAwO1xyXG4gIH1cclxuXHJcbiAgLnBheW1lbnR7XHJcbiAgICBmb250LWZhbWlseTpcIkFyaWFsIE5hcnJvd1wiO1xyXG4gICAgY29sb3I6ICM3ZTAwMDA7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGZvbnQtc2l6ZTogMi41dnc7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBwYWRkaW5nLXRvcDogNXZoO1xyXG4gIH1cclxuICAuYmFye1xyXG4gICAgbWFyZ2luLXRvcDogNDBweDtcclxuICB9XHJcblxyXG5cclxuICAuZ3JhbmQtdG90YWx7XHJcbiAgICBmb250LWZhbWlseTpcIkFyaWFsIE5hcnJvd1wiO1xyXG4gICAgY29sb3I6ICM3ZTAwMDA7XHJcbiAgICBmb250LXNpemU6IDd2dztcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIHBhZGRpbmctdG9wOiAydmg7XHJcblxyXG4gIH1cclxuXHJcbiAgLmNvbnRlbnR7XHJcbiAgICBib3JkZXI6IC4xN3Z3IHNvbGlkICM3ZTAwMDA7XHJcbiAgICBib3JkZXItcmFkaXVzOiAuOHZ3O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZkZjtcclxuICB9XHJcblxyXG4gIC5kdWUsIC50ZW5kZXJlZCwgLmNoYW5nZXtcclxuICAgIGZvbnQtZmFtaWx5OlwiQXJpYWwgTmFycm93XCI7XHJcbiAgICBjb2xvcjogIzdlMDAwMDtcclxuICAgIGZvbnQtc2l6ZTogM3Z3O1xyXG4gIH1cclxuXHJcblxyXG4gIC5kdWUtYm94e1xyXG4gICAgZm9udC1mYW1pbHk6XCJBcmlhbCBOYXJyb3dcIjtcclxuICAgIGNvbG9yOiAjN2UwMDAwO1xyXG4gICAgZm9udC1zaXplOiAzdnc7XHJcbiAgfVxyXG5cclxuICAuY2hhbmdlLWJveHtcclxuICAgIGZvbnQtZmFtaWx5OlwiQXJpYWwgTmFycm93XCI7XHJcbiAgICBjb2xvcjogIzdlMDAwMDtcclxuICAgIGZvbnQtc2l6ZTogM3Z3O1xyXG4gIH1cclxuXHJcblxyXG5cclxuICBpbnB1dHtcclxuICAgIGZvbnQtc2l6ZTogM3Z3O1xyXG4gICAgY29sb3I6ICM3ZTAwMDA7XHJcbiAgICBmb250LWZhbWlseTogXCJBcmlhbCBOYXJyb3dcIjtcclxuICAgIGJvcmRlcjogLjJ2dyBzb2xpZCAjZDMyMDM5O1xyXG4gICAgd2lkdGg6IDExLjZ2dztcclxuICAgIGhlaWdodDogYXV0bztcclxuICAgIHBhZGRpbmctdG9wOiAwO1xyXG4gICAgcGFkZGluZy1sZWZ0OiAuOXZ3O1xyXG4gIH1cclxuXHJcbiAgaW5wdXQ6Zm9jdXN7XHJcbiAgICBib3JkZXI6IC4ydncgc29saWQgIzdlMDAwMDtcclxuICB9XHJcbiAgaW5wdXQ6Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24sXHJcbiAgaW5wdXQ6Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24ge1xyXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gIH1cclxuXHJcbiAgLnRhYmxle1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgbWFyZ2luLXRvcDogMXZoO1xyXG4gIH1cclxuXHJcblxyXG4gIC5kcm9wLWRvd257XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgfVxyXG4gIHNlbGVjdHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZGY7XHJcbiAgICBjb2xvcjogIzdlMDAwMDtcclxuICAgIGZvbnQtZmFtaWx5OlwiYWxpZ24tc2VsZjogO1wiO1xyXG4gICAgZm9udC1zaXplOiAydnc7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjN2UwMDAwO1xyXG4gICAgYm9yZGVyLXJhZGl1czogLjV2dztcclxuICAgIG91dGxpbmU6bm9uZTtcclxuICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgICBjdXJzb3I6cG9pbnRlcjtcclxuICAgIHBhZGRpbmctcmlnaHQ6IDR2dztcclxuICAgIHBhZGRpbmctbGVmdDogNHZ3O1xyXG4gICAgcGFkZGluZy10b3A6IC41dnc7XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogLjV2dztcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gIH1cclxuXHJcbiAgb3B0aW9ue1xyXG4gICAgY29sb3I6ICM3ZTAwMDA7XHJcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gICAgY3Vyc29yOnBvaW50ZXI7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICB9XHJcblxyXG5cclxuICAuZGFzaGJvYXJke1xyXG4gICAgd2lkdGg6MjAlO1xyXG4gICAgaGVpZ2h0OjEwMCU7XHJcbiAgICBmb250LWZhbWlseTpcIkFyaWFsIE5hcnJvd1wiO1xyXG4gICAgY29sb3I6ICNhYTA5MDk7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBnaG9zdHdoaXRlO1xyXG4gICAgZm9udC1zaXplOjIuOHZ3O1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBtYXJnaW4tdG9wOiAxdmg7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIC5kYXNoYm9hcmQ6aG92ZXJ7XHJcbiAgICBjb2xvcjogIzZhMGQwZTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGdob3N0d2hpdGU7XHJcbiAgICBmb250LWZhbWlseTpcIkFyaWFsIE5hcnJvd1wiO1xyXG4gICAgZm9udC13ZWlnaHQ6Ym9sZDtcclxuICB9XHJcblxyXG4gIC5wb3AtdXB7XHJcbiAgICBjb2xvcjogIzdlMDAwMDtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIGZvbnQtZmFtaWx5OiBcIkJlcmxpbiBTYW5zIEZCXCI7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgfVxyXG5cclxuICAubWFpbi1yb3d7XHJcbiAgICBib3JkZXItYm90dG9tOiAycHggZG91YmxlICNkZmRmZGY7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuIl19 */"

/***/ }),

/***/ "./src/app/components/point-of-sale/payment/payment.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/components/point-of-sale/payment/payment.component.ts ***!
  \***********************************************************************/
/*! exports provided: PaymentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaymentComponent", function() { return PaymentComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _models_order_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../models/order.model */ "./src/app/models/order.model.ts");
/* harmony import */ var _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../services/data-storage/table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");
/* harmony import */ var _services_shared_point_of_sale_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../services/shared/point-of-sale.service */ "./src/app/services/shared/point-of-sale.service.ts");






var PaymentComponent = /** @class */ (function () {
    function PaymentComponent(pointOfSaleService, _dataStorageService, router, _route) {
        this.pointOfSaleService = pointOfSaleService;
        this._dataStorageService = _dataStorageService;
        this.router = router;
        this._route = _route;
        this.orderedItems = [];
        this.onCheck = 0;
        this.change = 0;
        this.selectedTable = '';
        this.inventoryCost = 0;
        this.orderProfit = 0;
        this.inventories = [];
        this.tables = [];
        this.tendered = 0;
    }
    PaymentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.grandTotal = this.pointOfSaleService.totalPrice;
        this._route.data.
            subscribe(function (data) {
            _this.pointOfSaleService.tables = data['tables'];
        });
        this.tables = this.pointOfSaleService.tables;
        this.subscription = this.pointOfSaleService.tablesChanged
            .subscribe(function (tables) {
            _this.tables = tables;
        });
    };
    PaymentComponent.prototype.discardOrder = function () {
        var dialog = confirm('Delete this order?\n' +
            'You will lose any kind of data associated with the current order!');
        if (dialog === true) {
            this.confirmEvent();
        }
    };
    PaymentComponent.prototype.confirmEvent = function () {
        this.pointOfSaleService.clearOrders();
        this.pointOfSaleService.totalPrice = 0;
        this.pointOfSaleService.totalQuantity = 0;
        this.router.navigate(['our-offers/regulars']);
    };
    PaymentComponent.prototype.back = function () {
        this.router.navigate(['our-offers']);
    };
    PaymentComponent.prototype.checkCertainAmount = function () {
        if (this.tendered < this.grandTotal || this.grandTotal === 0) {
            return false;
        }
        else {
            return true;
        }
    };
    PaymentComponent.prototype.selectChangeHandler = function (event) {
        this.selectedTable = event.target.value;
    };
    PaymentComponent.prototype.checkCertainChange = function () {
        if (this.tendered < this.grandTotal || this.tendered === 0) {
            return false;
        }
        else {
            return true;
        }
    };
    PaymentComponent.prototype.validate = function () {
        var orderId = null;
        this.onCheck = 1;
        this.orderedItems = this.pointOfSaleService.orderedItems;
        for (var i = 0; i < this.pointOfSaleService.orderedItems.length; i++) {
            this.pointOfSaleService.orderedItems[i].OrderId = orderId;
        }
        var totalPrice = this.pointOfSaleService.totalPrice;
        if (this.selectedTable === '' || this.selectedTable === 'Select a Table') {
            this.table = 'No Table';
        }
        else {
            this.table = this.selectedTable;
        }
        for (var i = 0; i < this.orderedItems.length; i++) {
            this.inventoryCost = Number.parseInt(this.inventoryCost.toString()) +
                (Number.parseInt(this.orderedItems[i].FoodItemQuantity.toString()) *
                    Number.parseInt(this.orderedItems[i].TotalPrice.toString()));
        }
        this.orderProfit = totalPrice - this.inventoryCost;
        this.change = Number.parseInt(this.tendered.toString())
            - Number.parseInt(totalPrice.toString());
        var dateTime = new Date().toLocaleString();
        this.order = new _models_order_model__WEBPACK_IMPORTED_MODULE_3__["Order"](orderId, this.pointOfSaleService.orderedItems, totalPrice, this.tendered, this.change, dateTime, this.table, this.inventoryCost, this.orderProfit);
        this.pointOfSaleService.addToOrderedList(this.order);
        //  this._dataStorageService.addNewOrder(this.order).subscribe();
        this.router.navigate(['receipt']);
    };
    PaymentComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-payment',
            template: __webpack_require__(/*! ./payment.component.html */ "./src/app/components/point-of-sale/payment/payment.component.html"),
            styles: [__webpack_require__(/*! ./payment.component.scss */ "./src/app/components/point-of-sale/payment/payment.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_shared_point_of_sale_service__WEBPACK_IMPORTED_MODULE_5__["PointOfSaleService"],
            _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_4__["TableDataStorageService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]])
    ], PaymentComponent);
    return PaymentComponent;
}());



/***/ }),

/***/ "./src/app/components/point-of-sale/point-of-sale.component.html":
/*!***********************************************************************!*\
  !*** ./src/app/components/point-of-sale/point-of-sale.component.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n\r\n<!--<div class=\"row\">\r\n  <div class=\"col-lg-9 col-md-9\">\r\n    <app-food-items></app-food-items>\r\n  </div>\r\n\r\n\r\n\r\n  <div class=\"col-lg-3 col-md-3\">\r\n    <div class=\"row dashboard\" *ngIf=\"checkOut === true\">\r\n      <div class=\"col-lg-12 col-md-12\"\r\n           (click)=\"goToDashboard()\" >\r\n        Back to Dashboard\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col-lg-12 col-md-12 note\">\r\n        Add or Remove Here Quickly\r\n      </div>\r\n    </div>\r\n    <div class=\"row other-adding-option\">\r\n      <div class=\"col-lg-6 col-md-6 serial\">\r\n        <input\r\n          type=\"text\"\r\n          inventoryId=\"serial\"\r\n          class=\"form-control\"\r\n          name=\"serial\"\r\n          required\r\n          placeholder=\"Enter serial no\"\r\n          #serial\r\n        >\r\n      </div>\r\n      <div class=\"col-lg-6 col-md-6 quantity\">\r\n        <input\r\n          type=\"number\"\r\n          min=\"1\"\r\n          inventoryId=\"quantity\"\r\n          name=\"quantity\"\r\n          class=\"form-control\"\r\n          required\r\n          placeholder=\"Enter quantity\"\r\n          #quantity\r\n        >\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col-lg-6 col-md-6 add\">\r\n        <button\r\n\r\n          class=\"add-remove-button\"\r\n          (click)=\"add()\"><i class=\"fa fa-plus-circle\" aria-hidden=\"true\"></i>\r\n           Add</button>\r\n      </div>\r\n      <div class=\"col-lg-6 col-md-6 remove\">\r\n        <button\r\n          class=\"add-remove-button\"\r\n          (click)=\"remove()\"><i class=\"fa fa-minus-circle\" aria-hidden=\"true\"></i>\r\n        Remove </button>\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12 col-md-12 cart-empty\" *ngIf=\"grandTotal==0; else itemIsSold\">\r\n          <div class=\"col-lg-12 col-md-12 icon\">\r\n            <i class=\"fa fa-shopping-cart\"></i>\r\n          </div>\r\n          <div class=\"col-lg-12 col-md-12 text\">\r\n            Your food cart is empty!\r\n          </div>\r\n        </div>\r\n    </div>\r\n\r\n\r\n      <ng-template #itemIsSold>\r\n        <div class=\"whole\" >\r\n        <div class=\"row\">\r\n          <div class=\"col-lg-12 col-md-12 your-purchased-Foods\">\r\n            Your purchased foods:\r\n          </div>\r\n        </div>\r\n          <div class=\"cash-memo\" >\r\n       <div class=\"row\">\r\n         <div *ngIf=\"checkFoodItemCount()!=0\">\r\n        <div class=\"row list-detail\" *ngFor=\"let order of orderedItems; let i = index\">\r\n              <div *ngIf=\"order.FoodItemQuantity !== 0\">\r\n                <div class=\"row\">\r\n                  <div class=\"col-lg-offset-1 col-md-offset-1 col-lg-7 col-md-7 name\">\r\n                   {{ i+1 }}. {{ order.FoodItemName }}  (SN-{{ order.FoodItemSerialNo }})\r\n                  </div>\r\n                  <div class=\"col-lg-3 col-md-3 sub-total\">\r\n                    {{ order.FoodItemSubTotal }} BDT\r\n                  </div>\r\n                </div>\r\n                <div class=\"row\">\r\n                  <div class=\"col-lg-offset-1 col-lg-8 col-md-offset-1 col-md-8 quantity\">\r\n                    {{ order.FoodItemQuantity }} Unit(s) at {{ order.Price }} BDT/Unit(s)\r\n                  </div>\r\n                  <div class=\"col-lg-1 col-md-1\">\r\n                    <i\r\n                      title=\"Remove this ordered item\"\r\n                      style=\"cursor: pointer\"\r\n                      (click)=\"removeFromCart(i)\"\r\n                      class=\"fa fa-times-circle-o remove-order\"\r\n                      aria-hidden=\"true\"></i>\r\n                  </div>\r\n                </div>\r\n              <hr class=\"content\">\r\n              </div>\r\n            </div>\r\n          </div>\r\n\r\n          </div>\r\n          </div>\r\n         <div class=\"row\">\r\n           <div class=\"col-lg-12 col-md-12 grand-total\">\r\n             Total Price: {{ grandTotal }} BDT\r\n           </div>\r\n         </div>\r\n\r\n\r\n         <div class=\"row cash-memo-buttons\">\r\n           <div class=\"col-lg-6 col-md-6 confirm-div\">\r\n             <button class=\"confirm-purchase\" (click)=\"AddToOrderedList()\">Payment</button>\r\n           </div>\r\n           <div class=\"col-lg-6 col-md-6 discard-div\">\r\n             <button class=\"confirm-purchase\" (click)=\"discardOrder()\">Discard</button>\r\n           </div>\r\n         </div>\r\n\r\n        </div>\r\n      </ng-template>\r\n    </div>\r\n  </div>-->\r\n\r\n<router-outlet></router-outlet>\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/components/point-of-sale/point-of-sale.component.scss":
/*!***********************************************************************!*\
  !*** ./src/app/components/point-of-sale/point-of-sale.component.scss ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".buttons {\n  padding-right: 0px;\n  padding-left: 0px;\n  padding-top: 10px; }\n\n.add-remove-button {\n  width: 100%;\n  height: 100%;\n  font-family: \"Arial Narrow\";\n  color: #a50f10;\n  background-color: #ffffdf;\n  border: 1.2px solid #a50f10;\n  border-radius: 5px;\n  font-size: 1vw;\n  padding-top: 1vh;\n  padding-bottom: 1vh;\n  margin-top: 5px;\n  font-weight: bold;\n  text-align: center; }\n\n.add-remove-button:hover {\n  background-color: #a50f10;\n  color: #ffffdf;\n  font-family: \"Arial Narrow\";\n  font-weight: bold;\n  border: 1.2px solid #ffffdf;\n  border-radius: 5px; }\n\n.add-remove-button:focus {\n  outline: 0; }\n\n.text {\n  color: #7e0000;\n  font-size: 1.4vw;\n  text-align: center;\n  font-family: \"Times New Roman\";\n  font-weight: bold;\n  opacity: 0.3; }\n\n.icon {\n  font-size: 5vw;\n  text-align: center; }\n\n.fa-shopping-cart {\n  color: #7e0000;\n  opacity: 0.3; }\n\n.your-purchased-Foods {\n  padding-top: 1px;\n  color: #7e0000;\n  font-size: 1.1vw;\n  font-family: \"Times New Roman\";\n  font-weight: bold;\n  padding-bottom: 10px;\n  text-align: center; }\n\n.list-detail {\n  padding-top: 1px;\n  color: #7e0000;\n  font-size: .9vw;\n  font-family: \"Times New Roman\";\n  font-weight: bold; }\n\nhr {\n  padding-top: 0px;\n  padding-bottom: 0px; }\n\n.grand-total {\n  padding-top: 20px;\n  color: #7e0000;\n  font-size: 1.2vw;\n  font-family: \"Times New Roman\";\n  font-weight: bold;\n  text-align: center; }\n\n.confirm-purchase {\n  width: 100%;\n  height: 100%;\n  font-family: \"Arial Narrow\";\n  color: #d32039;\n  background-color: #ffffdf;\n  border: 1px solid #ae0000;\n  border-radius: 3px;\n  font-size: 1vw;\n  padding-top: 1vh;\n  padding-bottom: 1vh;\n  margin-left: 0px;\n  margin-top: 0px;\n  font-weight: bold; }\n\n.confirm-purchase:hover {\n  background-color: #d32039;\n  color: #ffffdf;\n  font-family: \"Arial Narrow\";\n  font-weight: bold;\n  border: 1px solid #ffffdf;\n  border-radius: 3px; }\n\n.confirm-div {\n  padding-left: 20px;\n  padding-right: 2px; }\n\n.discard-div {\n  padding-left: 2px;\n  padding-right: 20px; }\n\n.confirm-purchase:focus {\n  outline: 0; }\n\n.cart-empty {\n  border: 2px solid rgba(201, 191, 197, 0.87);\n  border-radius: 6px;\n  margin-top: 40px;\n  margin-left: 2px;\n  padding-top: 15vh;\n  padding-bottom: 15vh; }\n\n.whole {\n  border: 2px solid rgba(201, 191, 197, 0.87);\n  border-radius: 6px;\n  padding-top: 20px;\n  margin-top: 8px;\n  margin-left: 2px; }\n\n.name {\n  padding-left: 26px;\n  font-size: 1.1vw; }\n\n.sub-total {\n  font-size: 1.1vw;\n  padding-left: 0px; }\n\n.quantity {\n  padding-left: 0px; }\n\n.cash-memo-buttons {\n  padding-bottom: 15px;\n  padding-top: 10px; }\n\n::-webkit-scrollbar {\n  width: 4px; }\n\n::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);\n  border-radius: 10px; }\n\n::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  background-color: rgba(0, 0, 0, 0.61);\n  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); }\n\n.cash-memo {\n  height: 35vh;\n  overflow-y: scroll;\n  overflow-x: hidden; }\n\n.dashboard {\n  text-align: center;\n  font-family: \"Arial Narrow\";\n  font-weight: bold;\n  font-size: 1.2vw;\n  padding-top: 2vh; }\n\na {\n  color: #970000;\n  text-decoration: none; }\n\na:hover {\n  color: #650d0e;\n  text-decoration: none; }\n\n.dashboard:hover {\n  color: #6a0d0e;\n  background-color: ghostwhite;\n  font-family: \"Arial Narrow\";\n  font-weight: bold;\n  cursor: pointer; }\n\n.pop-up {\n  color: #7e0000;\n  font-size: 19px;\n  font-family: \"Berlin Sans FB\";\n  text-align: center; }\n\n.quantity, .serial {\n  text-align: center;\n  padding-left: 5px;\n  padding-right: 5px; }\n\n.add, .remove {\n  text-align: center;\n  padding-left: 5px;\n  padding-right: 5px; }\n\n.other-adding-option {\n  padding-top: 5px; }\n\n.note {\n  font-size: 1.1vw;\n  font-family: \"Times New Roman\";\n  color: #6a0d0e;\n  font-weight: bold;\n  text-align: center;\n  padding-top: 20px; }\n\n.remove-order {\n  font-size: 1.2vw; }\n\ninput {\n  font-size: 1vw;\n  padding-right: 0;\n  height: 4.8vh; }\n\ninput::-webkit-outer-spin-button,\ninput::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n  margin: 0; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9wb2ludC1vZi1zYWxlL0Q6XFxXZWIgRGV2ZWxvcG1lbnRcXFByb2plY3RzXFxSZXN0YXVyYW50TWFuYWdlbWVudEFwcFxcUmVzdGF1cmFudE1hbmFnZW1lbnRBcHAvc3JjXFxhcHBcXGNvbXBvbmVudHNcXHBvaW50LW9mLXNhbGVcXHBvaW50LW9mLXNhbGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxrQkFBa0I7RUFDbEIsaUJBQWdCO0VBQ2hCLGlCQUFpQixFQUFBOztBQUtuQjtFQUNFLFdBQVU7RUFDVixZQUFXO0VBQ1gsMkJBQTBCO0VBQzFCLGNBQWM7RUFDZCx5QkFBeUI7RUFDekIsMkJBQTJCO0VBQzNCLGtCQUFrQjtFQUNsQixjQUFjO0VBQ2QsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtFQUNuQixlQUFlO0VBQ2YsaUJBQWlCO0VBQ2pCLGtCQUFrQixFQUFBOztBQUVwQjtFQUNFLHlCQUF5QjtFQUN6QixjQUFjO0VBQ2QsMkJBQTBCO0VBQzFCLGlCQUFnQjtFQUNoQiwyQkFBMkI7RUFDM0Isa0JBQWtCLEVBQUE7O0FBR3BCO0VBQ0UsVUFBVSxFQUFBOztBQUdaO0VBQ0UsY0FBYztFQUNkLGdCQUFnQjtFQUNoQixrQkFBa0I7RUFDbEIsOEJBQTZCO0VBQzdCLGlCQUFpQjtFQUNqQixZQUFZLEVBQUE7O0FBR2Q7RUFDRSxjQUFjO0VBQ2Qsa0JBQWtCLEVBQUE7O0FBR3BCO0VBQ0UsY0FBYztFQUNkLFlBQVksRUFBQTs7QUFJZDtFQUNFLGdCQUFnQjtFQUNoQixjQUFjO0VBQ2QsZ0JBQWU7RUFDZiw4QkFBNkI7RUFDN0IsaUJBQWlCO0VBQ2pCLG9CQUFvQjtFQUNwQixrQkFBa0IsRUFBQTs7QUFHcEI7RUFDRSxnQkFBZ0I7RUFDaEIsY0FBYztFQUNkLGVBQWU7RUFDZiw4QkFBNkI7RUFDN0IsaUJBQWlCLEVBQUE7O0FBR25CO0VBQ0UsZ0JBQWU7RUFDZixtQkFBbUIsRUFBQTs7QUFHckI7RUFDRSxpQkFBaUI7RUFDakIsY0FBYztFQUNkLGdCQUFlO0VBQ2YsOEJBQTZCO0VBQzdCLGlCQUFpQjtFQUNqQixrQkFBa0IsRUFBQTs7QUFHcEI7RUFDRSxXQUFVO0VBQ1YsWUFBVztFQUNYLDJCQUEwQjtFQUMxQixjQUFjO0VBQ2QseUJBQXlCO0VBQ3pCLHlCQUF5QjtFQUN6QixrQkFBa0I7RUFDbEIsY0FBYztFQUNkLGdCQUFnQjtFQUNoQixtQkFBbUI7RUFDbkIsZ0JBQWdCO0VBQ2hCLGVBQWU7RUFDZixpQkFBaUIsRUFBQTs7QUFHbkI7RUFDRSx5QkFBeUI7RUFDekIsY0FBYztFQUNkLDJCQUEwQjtFQUMxQixpQkFBZ0I7RUFDaEIseUJBQXlCO0VBQ3pCLGtCQUFrQixFQUFBOztBQUlwQjtFQUNFLGtCQUFpQjtFQUNqQixrQkFBaUIsRUFBQTs7QUFHbkI7RUFDRSxpQkFBZ0I7RUFDaEIsbUJBQWtCLEVBQUE7O0FBR3BCO0VBQ0UsVUFBUyxFQUFBOztBQUtYO0VBQ0UsMkNBQTJDO0VBQzNDLGtCQUFrQjtFQUNsQixnQkFBaUI7RUFDakIsZ0JBQWdCO0VBQ2hCLGlCQUFnQjtFQUNoQixvQkFBbUIsRUFBQTs7QUFHckI7RUFDRSwyQ0FBMkM7RUFDM0Msa0JBQWtCO0VBQ2xCLGlCQUFpQjtFQUNqQixlQUFnQjtFQUNoQixnQkFBZ0IsRUFBQTs7QUFJbEI7RUFDRSxrQkFBa0I7RUFDbEIsZ0JBQWdCLEVBQUE7O0FBR2xCO0VBQ0UsZ0JBQWdCO0VBQ2hCLGlCQUFpQixFQUFBOztBQUduQjtFQUNFLGlCQUFpQixFQUFBOztBQUtuQjtFQUNFLG9CQUFtQjtFQUNuQixpQkFBaUIsRUFBQTs7QUFLbkI7RUFDRSxVQUFVLEVBQUE7O0FBR1o7RUFDRSxvREFBaUQ7RUFDakQsbUJBQW1CLEVBQUE7O0FBR3JCO0VBQ0UsbUJBQW1CO0VBQ25CLHFDQUFxQztFQUNyQyxvREFBaUQsRUFBQTs7QUFHbkQ7RUFDRSxZQUFZO0VBQ1osa0JBQWtCO0VBQ2xCLGtCQUFrQixFQUFBOztBQU9wQjtFQUNFLGtCQUFrQjtFQUNsQiwyQkFBMEI7RUFDMUIsaUJBQWdCO0VBQ2hCLGdCQUFnQjtFQUNoQixnQkFBZ0IsRUFBQTs7QUFHbEI7RUFDRSxjQUFjO0VBQ2QscUJBQXFCLEVBQUE7O0FBR3ZCO0VBQ0UsY0FBYztFQUNkLHFCQUFxQixFQUFBOztBQUl2QjtFQUNFLGNBQWM7RUFDZCw0QkFBNEI7RUFDNUIsMkJBQTBCO0VBQzFCLGlCQUFnQjtFQUNoQixlQUFlLEVBQUE7O0FBSWpCO0VBQ0UsY0FBYztFQUNkLGVBQWU7RUFDZiw2QkFBNkI7RUFDN0Isa0JBQWtCLEVBQUE7O0FBSXBCO0VBQ0Usa0JBQWtCO0VBQ2xCLGlCQUFpQjtFQUNqQixrQkFBa0IsRUFBQTs7QUFHcEI7RUFDRSxrQkFBa0I7RUFDbEIsaUJBQWlCO0VBQ2pCLGtCQUFrQixFQUFBOztBQUdwQjtFQUNFLGdCQUFnQixFQUFBOztBQUlsQjtFQUNFLGdCQUFnQjtFQUNoQiw4QkFBNkI7RUFDN0IsY0FBYztFQUNkLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsaUJBQWlCLEVBQUE7O0FBSW5CO0VBQ0UsZ0JBQWdCLEVBQUE7O0FBS2xCO0VBQ0UsY0FBYztFQUNkLGdCQUFnQjtFQUNoQixhQUFhLEVBQUE7O0FBS2Y7O0VBRUUsd0JBQXdCO0VBQ3hCLFNBQVMsRUFBQSIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvcG9pbnQtb2Ytc2FsZS9wb2ludC1vZi1zYWxlLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmJ1dHRvbnN7XHJcbiAgcGFkZGluZy1yaWdodDogMHB4O1xyXG4gIHBhZGRpbmctbGVmdDowcHg7XHJcbiAgcGFkZGluZy10b3A6IDEwcHg7XHJcbn1cclxuXHJcblxyXG5cclxuLmFkZC1yZW1vdmUtYnV0dG9ue1xyXG4gIHdpZHRoOjEwMCU7XHJcbiAgaGVpZ2h0OjEwMCU7XHJcbiAgZm9udC1mYW1pbHk6XCJBcmlhbCBOYXJyb3dcIjtcclxuICBjb2xvcjogI2E1MGYxMDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmRmO1xyXG4gIGJvcmRlcjogMS4ycHggc29saWQgI2E1MGYxMDtcclxuICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgZm9udC1zaXplOiAxdnc7XHJcbiAgcGFkZGluZy10b3A6IDF2aDtcclxuICBwYWRkaW5nLWJvdHRvbTogMXZoO1xyXG4gIG1hcmdpbi10b3A6IDVweDtcclxuICBmb250LXdlaWdodDogYm9sZDtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbn1cclxuLmFkZC1yZW1vdmUtYnV0dG9uOmhvdmVye1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNhNTBmMTA7XHJcbiAgY29sb3I6ICNmZmZmZGY7XHJcbiAgZm9udC1mYW1pbHk6XCJBcmlhbCBOYXJyb3dcIjtcclxuICBmb250LXdlaWdodDpib2xkO1xyXG4gIGJvcmRlcjogMS4ycHggc29saWQgI2ZmZmZkZjtcclxuICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbn1cclxuXHJcbi5hZGQtcmVtb3ZlLWJ1dHRvbjpmb2N1c3tcclxuICBvdXRsaW5lOiAwO1xyXG59XHJcblxyXG4udGV4dHtcclxuICBjb2xvcjogIzdlMDAwMDtcclxuICBmb250LXNpemU6IDEuNHZ3O1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBmb250LWZhbWlseTpcIlRpbWVzIE5ldyBSb21hblwiO1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gIG9wYWNpdHk6IDAuMztcclxufVxyXG5cclxuLmljb257XHJcbiAgZm9udC1zaXplOiA1dnc7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59XHJcblxyXG4uZmEtc2hvcHBpbmctY2FydHtcclxuICBjb2xvcjogIzdlMDAwMDtcclxuICBvcGFjaXR5OiAwLjM7XHJcbn1cclxuXHJcblxyXG4ueW91ci1wdXJjaGFzZWQtRm9vZHN7XHJcbiAgcGFkZGluZy10b3A6IDFweDtcclxuICBjb2xvcjogIzdlMDAwMDtcclxuICBmb250LXNpemU6MS4xdnc7XHJcbiAgZm9udC1mYW1pbHk6XCJUaW1lcyBOZXcgUm9tYW5cIjtcclxuICBmb250LXdlaWdodDogYm9sZDtcclxuICBwYWRkaW5nLWJvdHRvbTogMTBweDtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5saXN0LWRldGFpbHtcclxuICBwYWRkaW5nLXRvcDogMXB4O1xyXG4gIGNvbG9yOiAjN2UwMDAwO1xyXG4gIGZvbnQtc2l6ZTogLjl2dztcclxuICBmb250LWZhbWlseTpcIlRpbWVzIE5ldyBSb21hblwiO1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG59XHJcblxyXG5ocntcclxuICBwYWRkaW5nLXRvcDowcHg7XHJcbiAgcGFkZGluZy1ib3R0b206IDBweDtcclxufVxyXG5cclxuLmdyYW5kLXRvdGFse1xyXG4gIHBhZGRpbmctdG9wOiAyMHB4O1xyXG4gIGNvbG9yOiAjN2UwMDAwO1xyXG4gIGZvbnQtc2l6ZToxLjJ2dztcclxuICBmb250LWZhbWlseTpcIlRpbWVzIE5ldyBSb21hblwiO1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5cclxuLmNvbmZpcm0tcHVyY2hhc2V7XHJcbiAgd2lkdGg6MTAwJTtcclxuICBoZWlnaHQ6MTAwJTtcclxuICBmb250LWZhbWlseTpcIkFyaWFsIE5hcnJvd1wiO1xyXG4gIGNvbG9yOiAjZDMyMDM5O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZGY7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgI2FlMDAwMDtcclxuICBib3JkZXItcmFkaXVzOiAzcHg7XHJcbiAgZm9udC1zaXplOiAxdnc7XHJcbiAgcGFkZGluZy10b3A6IDF2aDtcclxuICBwYWRkaW5nLWJvdHRvbTogMXZoO1xyXG4gIG1hcmdpbi1sZWZ0OiAwcHg7XHJcbiAgbWFyZ2luLXRvcDogMHB4O1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG59XHJcblxyXG4uY29uZmlybS1wdXJjaGFzZTpob3ZlcntcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZDMyMDM5O1xyXG4gIGNvbG9yOiAjZmZmZmRmO1xyXG4gIGZvbnQtZmFtaWx5OlwiQXJpYWwgTmFycm93XCI7XHJcbiAgZm9udC13ZWlnaHQ6Ym9sZDtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjZmZmZmRmO1xyXG4gIGJvcmRlci1yYWRpdXM6IDNweDtcclxufVxyXG5cclxuXHJcbi5jb25maXJtLWRpdntcclxuICBwYWRkaW5nLWxlZnQ6MjBweDtcclxuICBwYWRkaW5nLXJpZ2h0OjJweDtcclxufVxyXG5cclxuLmRpc2NhcmQtZGl2e1xyXG4gIHBhZGRpbmctbGVmdDoycHg7XHJcbiAgcGFkZGluZy1yaWdodDoyMHB4O1xyXG59XHJcblxyXG4uY29uZmlybS1wdXJjaGFzZTpmb2N1c3tcclxuICBvdXRsaW5lOjA7XHJcbn1cclxuXHJcblxyXG5cclxuLmNhcnQtZW1wdHl7XHJcbiAgYm9yZGVyOiAycHggc29saWQgcmdiYSgyMDEsIDE5MSwgMTk3LCAwLjg3KTtcclxuICBib3JkZXItcmFkaXVzOiA2cHg7XHJcbiAgbWFyZ2luLXRvcDogIDQwcHg7XHJcbiAgbWFyZ2luLWxlZnQ6IDJweDtcclxuICBwYWRkaW5nLXRvcDoxNXZoO1xyXG4gIHBhZGRpbmctYm90dG9tOjE1dmg7XHJcbn1cclxuXHJcbi53aG9sZXtcclxuICBib3JkZXI6IDJweCBzb2xpZCByZ2JhKDIwMSwgMTkxLCAxOTcsIDAuODcpO1xyXG4gIGJvcmRlci1yYWRpdXM6IDZweDtcclxuICBwYWRkaW5nLXRvcDogMjBweDtcclxuICBtYXJnaW4tdG9wOiAgOHB4O1xyXG4gIG1hcmdpbi1sZWZ0OiAycHg7XHJcbn1cclxuXHJcblxyXG4ubmFtZXtcclxuICBwYWRkaW5nLWxlZnQ6IDI2cHg7XHJcbiAgZm9udC1zaXplOiAxLjF2dztcclxufVxyXG5cclxuLnN1Yi10b3RhbHtcclxuICBmb250LXNpemU6IDEuMXZ3O1xyXG4gIHBhZGRpbmctbGVmdDogMHB4O1xyXG59XHJcblxyXG4ucXVhbnRpdHl7XHJcbiAgcGFkZGluZy1sZWZ0OiAwcHg7XHJcblxyXG59XHJcblxyXG5cclxuLmNhc2gtbWVtby1idXR0b25ze1xyXG4gIHBhZGRpbmctYm90dG9tOjE1cHg7XHJcbiAgcGFkZGluZy10b3A6IDEwcHg7XHJcbn1cclxuXHJcblxyXG5cclxuOjotd2Via2l0LXNjcm9sbGJhciB7XHJcbiAgd2lkdGg6IDRweDtcclxufVxyXG5cclxuOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XHJcbiAgLXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIDAgNnB4IHJnYmEoMCwwLDAsMC4zKTtcclxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcclxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC42MSk7XHJcbiAgLXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIDAgNnB4IHJnYmEoMCwwLDAsMC41KTtcclxufVxyXG5cclxuLmNhc2gtbWVtb3tcclxuICBoZWlnaHQ6IDM1dmg7XHJcbiAgb3ZlcmZsb3cteTogc2Nyb2xsO1xyXG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi5kYXNoYm9hcmR7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIGZvbnQtZmFtaWx5OlwiQXJpYWwgTmFycm93XCI7XHJcbiAgZm9udC13ZWlnaHQ6Ym9sZDtcclxuICBmb250LXNpemU6IDEuMnZ3O1xyXG4gIHBhZGRpbmctdG9wOiAydmg7XHJcbn1cclxuXHJcbmF7XHJcbiAgY29sb3I6ICM5NzAwMDA7XHJcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG59XHJcblxyXG5hOmhvdmVye1xyXG4gIGNvbG9yOiAjNjUwZDBlO1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxufVxyXG5cclxuXHJcbi5kYXNoYm9hcmQ6aG92ZXJ7XHJcbiAgY29sb3I6ICM2YTBkMGU7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogZ2hvc3R3aGl0ZTtcclxuICBmb250LWZhbWlseTpcIkFyaWFsIE5hcnJvd1wiO1xyXG4gIGZvbnQtd2VpZ2h0OmJvbGQ7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG5cclxuLnBvcC11cHtcclxuICBjb2xvcjogIzdlMDAwMDtcclxuICBmb250LXNpemU6IDE5cHg7XHJcbiAgZm9udC1mYW1pbHk6IFwiQmVybGluIFNhbnMgRkJcIjtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbn1cclxuXHJcblxyXG4ucXVhbnRpdHksIC5zZXJpYWx7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIHBhZGRpbmctbGVmdDogNXB4O1xyXG4gIHBhZGRpbmctcmlnaHQ6IDVweDtcclxufVxyXG5cclxuLmFkZCwgLnJlbW92ZXtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgcGFkZGluZy1sZWZ0OiA1cHg7XHJcbiAgcGFkZGluZy1yaWdodDogNXB4O1xyXG59XHJcblxyXG4ub3RoZXItYWRkaW5nLW9wdGlvbntcclxuICBwYWRkaW5nLXRvcDogNXB4O1xyXG59XHJcblxyXG5cclxuLm5vdGV7XHJcbiAgZm9udC1zaXplOiAxLjF2dztcclxuICBmb250LWZhbWlseTpcIlRpbWVzIE5ldyBSb21hblwiO1xyXG4gIGNvbG9yOiAjNmEwZDBlO1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBwYWRkaW5nLXRvcDogMjBweDtcclxufVxyXG5cclxuXHJcbi5yZW1vdmUtb3JkZXJ7XHJcbiAgZm9udC1zaXplOiAxLjJ2dztcclxufVxyXG5cclxuXHJcblxyXG5pbnB1dHtcclxuICBmb250LXNpemU6IDF2dztcclxuICBwYWRkaW5nLXJpZ2h0OiAwO1xyXG4gIGhlaWdodDogNC44dmg7XHJcbn1cclxuXHJcblxyXG5cclxuaW5wdXQ6Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24sXHJcbmlucHV0Ojotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uIHtcclxuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgbWFyZ2luOiAwO1xyXG59XHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/components/point-of-sale/point-of-sale.component.ts":
/*!*********************************************************************!*\
  !*** ./src/app/components/point-of-sale/point-of-sale.component.ts ***!
  \*********************************************************************/
/*! exports provided: PointOfSaleComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PointOfSaleComponent", function() { return PointOfSaleComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _models_ordered_item_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/ordered-item.model */ "./src/app/models/ordered-item.model.ts");
/* harmony import */ var _services_shared_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/shared/auth.service */ "./src/app/services/shared/auth.service.ts");
/* harmony import */ var _services_shared_point_of_sale_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/shared/point-of-sale.service */ "./src/app/services/shared/point-of-sale.service.ts");






var PointOfSaleComponent = /** @class */ (function () {
    function PointOfSaleComponent(pointOfSaleService, router, route, userService) {
        this.pointOfSaleService = pointOfSaleService;
        this.router = router;
        this.route = route;
        this.userService = userService;
        this.checkOut = false;
        this.quantity = 0;
        this.foodItems = [];
        this.condition = false;
        this.uuidCodeOne = '';
        this.uuidCodeTwo = '';
        this.uuidCodeThree = '';
        this.orderedItems = [];
        this.foodItemCount = 0;
        this.inventories = [];
    }
    PointOfSaleComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.orderedItems = this.pointOfSaleService.getOrderedItemsList();
        if (this.userService.roleMatch(['Admin'])) {
            this.checkOut = true;
        }
        this.route.data.
            subscribe(function (data) {
            _this.pointOfSaleService.foodItems = data['foodItems'];
        });
        this.foodItems = this.pointOfSaleService.foodItems;
        // this.ourOffersService.foodItemsChanged
        //   .subscribe(
        //     (foodItem: foodItem[]) => {
        //       this.foodItem = foodItem;
        //     }
        //   );
        this.route.data.
            subscribe(function (data) {
            _this.pointOfSaleService.inventories = data['inventories'];
        });
        this.inventories = this.pointOfSaleService.inventories;
        this.subscription = this.pointOfSaleService.inventoriesChanged
            .subscribe(function (inventories) {
            _this.inventories = inventories;
        });
    };
    PointOfSaleComponent.prototype.ngDoCheck = function () {
        this.orderedItems = this.pointOfSaleService.getOrderedItemsList();
        this.grandTotal = this.pointOfSaleService.totalPrice;
    };
    PointOfSaleComponent.prototype.removeFromCart = function (index) {
        this.pointOfSaleService.totalPrice =
            Number.parseInt(this.pointOfSaleService.totalPrice.toString(), 2)
                - Number.parseInt(this.orderedItems[index].TotalPrice.toString(), 2);
        this.orderedItems.splice(index, 1);
        this.pointOfSaleService.orderedItems.splice(index, 1);
    };
    PointOfSaleComponent.prototype.checkFoodItemCount = function () {
        for (var i = 0; i < this.orderedItems.length; i++) {
            if (this.orderedItems[i].FoodItemId != null) {
                this.foodItemCount += 1;
            }
        }
        return this.foodItemCount;
    };
    PointOfSaleComponent.prototype.AddToOrderedList = function () {
        this.router.navigate(['payment']);
    };
    PointOfSaleComponent.prototype.add = function () {
        var serialNumber = this.serialNo.nativeElement.value;
        var quantity = this.quantityOfItem.nativeElement.value;
        if (serialNumber !== '' && quantity !== '') {
            for (var i = 0; i < this.foodItems.length; i++) {
                if (this.foodItems[i].SerialNumber === serialNumber) {
                    this.UpdateCart(this.foodItems[i].Id, this.foodItems[i].Price, this.foodItems[i].Name, this.foodItems[i].SerialNumber, this.foodItems[i].InventoryCost, true, quantity);
                }
            }
        }
        document.getElementById('quantity').value = '';
        document.getElementById('serial').value = '';
    };
    PointOfSaleComponent.prototype.remove = function () {
        var serialNumber = this.serialNo.nativeElement.value;
        var quantity = this.quantityOfItem.nativeElement.value;
        if (serialNumber !== '' && quantity !== '') {
            for (var i = 0; i < this.foodItems.length; i++) {
                if (this.foodItems[i].SerialNumber === serialNumber) {
                    this.UpdateCart(this.foodItems[i].Id, this.foodItems[i].Price, this.foodItems[i].Name, this.foodItems[i].SerialNumber, this.foodItems[i].InventoryCost, false, quantity);
                }
            }
        }
        document.getElementById('quantity').value = '';
        document.getElementById('serial').value = '';
    };
    PointOfSaleComponent.prototype.UpdateCart = function (id, price, name, serialNo, makingCost, isAdd, quantity) {
        if (quantity > 0) {
            var foodItemId = id;
            var foodItemName = name;
            var Price = price;
            var orderId = null;
            if (this.pointOfSaleService.checkIfOrderedItemExist(id, orderId) === null) {
                var orderItemId = null;
                if (isAdd === true) {
                    this.AddToCart(orderItemId, orderId, quantity, foodItemId, foodItemName, serialNo, Price, makingCost);
                }
                else {
                    this.RemoveFromCart(orderItemId, orderId, quantity, foodItemId, foodItemName, Price, makingCost);
                }
            }
            else {
                var orderItemId = this.pointOfSaleService.checkIfOrderedItemExist(id, orderId);
                if (isAdd === true) {
                    this.AddToCart(orderItemId, orderId, quantity, foodItemId, foodItemName, serialNo, Price, makingCost);
                }
                else {
                    this.RemoveFromCart(orderItemId, orderId, quantity, foodItemId, foodItemName, Price, makingCost);
                }
            }
        }
    };
    PointOfSaleComponent.prototype.AddToCart = function (orderItemId, orderId, quantity, foodItemId, foodItemName, serialNo, price, makingCost) {
        for (var j = 0; j < this.foodItems.length; j++) {
            if (this.foodItems[j].Id === foodItemId) {
                var check = 0;
                for (var k = 0; k < this.foodItems[j].Ingredients.length; k++) {
                    var inventoryQuantity = this.foodItems[j].Ingredients[k].Quantity;
                    var totalQuantity = inventoryQuantity * quantity;
                    var inventoryId = this.foodItems[j].Ingredients[k].InventoryId;
                    for (var l = 0; l < this.inventories.length; l++) {
                        if (this.pointOfSaleService.inventories[l].Id === inventoryId) {
                            if (this.pointOfSaleService.inventories[l].RemainingQuantity > totalQuantity) {
                                check++;
                                if (check === this.foodItems[j].Ingredients.length) {
                                    this.pointOfSaleService.inventories[l].RemainingQuantity -= totalQuantity;
                                    var subTotal = this.pointOfSaleService.FoodItemSubTotalPrice(price, quantity);
                                    this.pointOfSaleService.grandTotalPrice(subTotal);
                                    this.condition = this.pointOfSaleService.checkExistingFoodItem(foodItemId);
                                    if (this.condition) {
                                        this.pointOfSaleService.increaseOnExistingFoodItem(foodItemId, quantity, subTotal);
                                    }
                                    else {
                                        var purchasedFood = new _models_ordered_item_model__WEBPACK_IMPORTED_MODULE_3__["OrderedItem"](orderItemId, '0', foodItemId, quantity, price, subTotal);
                                        this.pointOfSaleService.addToOrderedItemsList(purchasedFood);
                                    }
                                    this.pointOfSaleService.totalQuantity
                                        = Number.parseInt(this.pointOfSaleService.totalQuantity.toString())
                                            + Number.parseInt(quantity.toString());
                                }
                            }
                        }
                    }
                }
                if (check < this.foodItems[j].Ingredients.length) {
                    alert('Insufficient inventories, please update your inventories first');
                }
                break;
            }
        }
    };
    PointOfSaleComponent.prototype.RemoveFromCart = function (orderItemId, orderId, quantity, foodItemId, foodItemName, price, makingCost) {
        var subTotal = this.pointOfSaleService.FoodItemSubTotalPrice(price, quantity);
        this.pointOfSaleService.removeFromFoodItemCart(foodItemId, quantity, subTotal);
    };
    PointOfSaleComponent.prototype.discardOrder = function () {
        var dialog = confirm('Delete this order?\n' +
            'You will lose any kind of data associated with the current order!');
        if (dialog === true) {
            this.confirmEvent();
        }
    };
    PointOfSaleComponent.prototype.goToDashboard = function () {
        if (this.orderedItems.length !== 0) {
            var dialog = confirm('Go Back to Dashboard?\n' +
                'You will lose any kind of data associated with the current order!');
            if (dialog) {
                this.confirmEvent();
                this.router.navigate(['/control-panel']);
            }
        }
        else {
            this.router.navigate(['/control-panel']);
        }
    };
    PointOfSaleComponent.prototype.confirmEvent = function () {
        this.pointOfSaleService.clearOrders();
        this.pointOfSaleService.totalPrice = 0;
        this.pointOfSaleService.totalQuantity = 0;
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('serial'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], PointOfSaleComponent.prototype, "serialNo", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('quantity'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], PointOfSaleComponent.prototype, "quantityOfItem", void 0);
    PointOfSaleComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-point-of-sale',
            template: __webpack_require__(/*! ./point-of-sale.component.html */ "./src/app/components/point-of-sale/point-of-sale.component.html"),
            styles: [__webpack_require__(/*! ./point-of-sale.component.scss */ "./src/app/components/point-of-sale/point-of-sale.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_shared_point_of_sale_service__WEBPACK_IMPORTED_MODULE_5__["PointOfSaleService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _services_shared_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"]])
    ], PointOfSaleComponent);
    return PointOfSaleComponent;
}());



/***/ }),

/***/ "./src/app/components/point-of-sale/receipt/receipt.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/components/point-of-sale/receipt/receipt.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n\r\n<div *ngIf=\"order\">\r\n  <div class=\"row main-row\">\r\n    <div class=\"col-md-offset-9 col-md-3\">\r\n      <a style=\"cursor: pointer\"\r\n         (click)=\"discardOrder()\"\r\n         title=\"Destroy Current Order\">\r\n        <div class=\"col-md-1 dashboard\">\r\n          <i class=\"fa fa-times-circle-o\" aria-hidden=\"true\"></i>\r\n        </div>\r\n      </a>\r\n    </div>\r\n  </div>\r\n\r\n\r\n  <div class=\"row upper-div\" >\r\n    <div class=\"col-md-offset-3 col-md-6 change\">\r\n      Change: {{ order.Change }} BDT\r\n    </div>\r\n    <div class=\"col-md-3 next-order-div\">\r\n      <button\r\n        (click)=\"nextOrder()\"\r\n        class=\"back\">\r\n        Next Order\r\n        <i class=\"fa fa-angle-double-right\"></i></button>\r\n    </div>\r\n  </div>\r\n\r\n\r\n  <div class=\"row\" >\r\n    <div class=\"col-md-offset-2 col-md-8 receipt\">\r\n      <button (click)=\"print()\" class=\"back\"><i class=\"fa fa-print\"></i> Print Receipt</button>\r\n    </div>\r\n  </div>\r\n\r\n\r\n  <div class=\"row print-row\">\r\n    <div class=\"col-md-offset-4 col-md-4\" id=\"print-section\">\r\n\r\n      <div class=\"intro\">\r\n\r\n        <div class=\"row date-time\" >\r\n          <div class=\"col-md-12\">\r\n            {{ order.DateTime }}\r\n          </div>\r\n        </div>\r\n        <div class=\"row id \">\r\n          <div class=\"cl-md-12\">\r\n            {{ order.Id }}\r\n          </div>\r\n        </div>\r\n\r\n      </div>\r\n\r\n\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12 table-no\">\r\n          Table: {{ order.TableNumber }}\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"col-md-12 hodoo\">\r\n        Hodoo\r\n      </div>\r\n\r\n\r\n      <div class=\"col-md-12 main\" *ngFor=\"let orders of order.OrderedItem\">\r\n        <div class=\"col-md-4 name\">{{ orders.FoodItemName }}</div>\r\n        <div class=\"col-md-2 price\">{{ orders.Price }}</div>\r\n        <div class=\"col-md-1 mul\">x</div>\r\n        <div class=\"col-md-2 quantity\">{{ orders.FoodItemQuantity }}</div>\r\n        <div class=\"col-md-1 equal\">=</div>\r\n        <div class=\"col-md-2 sub-total\">{{ orders.FoodItemSubTotal }}</div>\r\n      </div>\r\n      <div class=\"col-md-12 total-div\">\r\n        <div class=\"col-md-6 total\">Total:</div>\r\n        <div class=\"col-md-6 total-bdt\">{{ order.TotalPrice }} BDT</div>\r\n      </div>\r\n\r\n      <div class=\"col-md-12 tendered-div\">\r\n        <div class=\"col-md-6 tendered\">Tendered:</div>\r\n        <div class=\"col-md-6 tendered-bdt\">{{ order.Tendered }} BDT</div>\r\n      </div>\r\n\r\n      <div class=\"col-md-12 change-div\">\r\n        <div class=\"col-md-6 change-cash\">Change:</div>\r\n        <div class=\"col-md-6 change-bdt\">{{ order.Change }} BDT</div>\r\n      </div>\r\n\r\n      <div class=\"col-md-12 choosing-hodoo\">\r\n        Thank you for choosing Hodoo!\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n\r\n<div class=\"row\" *ngIf=\"!order\">\r\n  <div class=\"col-md-12 no-receipt\">\r\n    You have no receipt to print\r\n  </div>\r\n  <div class=\"col-md-12 go-back-to-pos\">\r\n    <a routerLink=\"/our-offers/regulars\">Go Back to Point of Sale</a>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/components/point-of-sale/receipt/receipt.component.scss":
/*!*************************************************************************!*\
  !*** ./src/app/components/point-of-sale/receipt/receipt.component.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@import url(\"https://fonts.googleapis.com/css?family=Acme|Aladin|Berkshire+Swash|Cabin+Sketch|Chewy|Fredoka+One|Kanit|Lobster|Londrina+Solid|Righteous|Rock+Salt\");\n@media screen {\n  .change {\n    margin-top: 37px;\n    font-size: 25px;\n    color: #7e0000;\n    font-family: \"Arial Narrow\";\n    text-align: center;\n    font-weight: bold; }\n  #print-section {\n    background-color: white;\n    border: 1px solid #cbc6cb;\n    margin-top: 10px;\n    height: 50vh;\n    overflow-y: scroll;\n    overflow-x: hidden; }\n  .table-no {\n    text-align: center;\n    font-family: \"Inconsolata\";\n    font-size: 11px; }\n  .print-row {\n    padding-left: 90px;\n    padding-right: 90px; }\n  hr {\n    border-top: 1px solid #cbc6cb;\n    margin: 1em 0;\n    padding: 0; }\n  .receipt {\n    text-align: center; }\n  .back {\n    width: 50%;\n    height: 100%;\n    font-family: \"Arial Narrow\";\n    color: #d32039;\n    background-color: #ffffdf;\n    border: 1.2px solid #ae0000;\n    border-radius: 5px;\n    font-size: 20px;\n    padding-top: 5px;\n    padding-bottom: 5px;\n    margin-left: 5px;\n    margin-top: 22px;\n    font-weight: bold; }\n  .back:hover {\n    background-color: #d32039;\n    color: #ffffdf;\n    font-family: \"Arial Narrow\";\n    font-weight: bold;\n    border: 1.2px solid #ffffdf;\n    border-radius: 5px; }\n  .back:focus {\n    outline: 0; }\n  .next-order-div {\n    margin-top: 10px; }\n  .intro {\n    text-align: center;\n    margin-top: 15px; }\n  .date-time {\n    padding-right: 0px;\n    padding-left: 0px;\n    font-family: \"Inconsolata\";\n    font-size: 11px;\n    text-align: center;\n    padding-top: 5px;\n    padding-bottom: 5px; }\n  .id {\n    padding-right: 0px;\n    padding-left: 0px;\n    font-family: \"Inconsolata\";\n    font-size: 11px;\n    padding-top: 5px;\n    padding-bottom: 5px; }\n  .name, .price, .quantity, .equal, .sub-total, .mul {\n    padding-right: 0px;\n    padding-left: 0px;\n    font-family: \"Inconsolata\";\n    font-size: 11px;\n    padding-top: 2px;\n    padding-bottom: 2px; }\n  .price {\n    text-align: right; }\n  .quantity {\n    padding-left: 20px; }\n  .mul {\n    padding-left: 20px; }\n  .main {\n    padding-left: 0px;\n    padding-right: 0px;\n    padding-top: 2px;\n    padding-bottom: 4px; }\n  .hodoo {\n    font-family: \"Inconsolata\";\n    font-size: 13px;\n    text-align: center;\n    padding-top: 5px;\n    padding-bottom: 8px; }\n  .choosing-hodoo {\n    font-family: \"Inconsolata\";\n    font-size: 11px;\n    text-align: center;\n    padding-top: 15px;\n    padding-bottom: 20px; }\n  .change-bdt {\n    font-family: \"Inconsolata\";\n    font-size: 11px;\n    text-align: right; }\n  .change-cash {\n    font-family: \"Inconsolata\";\n    font-size: 11px;\n    text-align: left; }\n  .tendered {\n    font-family: \"Inconsolata\";\n    font-size: 11px;\n    text-align: left; }\n  .intro {\n    padding-top: 5px;\n    padding-bottom: 5px; }\n  .tendered-bdt {\n    font-family: \"Inconsolata\";\n    font-size: 11px;\n    text-align: right; }\n  .total-div {\n    padding-bottom: 5px;\n    padding-top: 5px;\n    text-align: center; }\n  .total {\n    font-family: \"Inconsolata\";\n    font-size: 16px;\n    text-align: left; }\n  .total-bdt {\n    font-family: \"Inconsolata\";\n    font-size: 16px;\n    text-align: right; }\n  .change-div {\n    padding-top: 4px;\n    padding-bottom: 4px;\n    text-align: center; }\n  .tendered-div {\n    padding-top: 4px;\n    padding-bottom: 4px;\n    text-align: center; }\n  .fa {\n    display: inline-block;\n    font: normal normal normal 14px/1 FontAwesome;\n    font-size: inherit;\n    text-rendering: auto;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale; }\n  .table-no {\n    text-align: center;\n    font-family: \"Inconsolata\";\n    font-size: 11px; }\n  .hodoo-logo {\n    font-family: 'Berkshire Swash', \"Times New Roman\", \"Berlin Sans FB\";\n    font-size: 40px;\n    text-align: right;\n    color: #7e0000;\n    padding-top: 5px; }\n  .hodoo:focus {\n    outline: 0; }\n  .dashboard {\n    width: 20%;\n    height: 100%;\n    font-family: \"Arial Narrow\";\n    color: #aa0909;\n    background-color: ghostwhite;\n    font-size: 33px;\n    font-weight: bold;\n    text-align: center;\n    margin-top: 12px; }\n  .dashboard:hover {\n    color: #6a0d0e;\n    background-color: ghostwhite;\n    font-family: \"Arial Narrow\";\n    font-weight: bold; }\n  .pop-up {\n    color: #7e0000;\n    font-size: 19px;\n    font-family: \"Berlin Sans FB\";\n    text-align: center; }\n  .main-row {\n    border-bottom: 2px double #dfdfdf; }\n  ::-webkit-scrollbar {\n    width: 1px; }\n  ::-webkit-scrollbar-track {\n    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);\n    border-radius: 10px; }\n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background-color: rgba(0, 0, 0, 0.61);\n    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); }\n  .go-back-to-pos {\n    text-align: center;\n    font-size: 1vw;\n    padding-top: 13px; }\n  a {\n    color: #a30000;\n    text-decoration: none; }\n  a:hover {\n    color: #550d0e;\n    text-decoration: none; }\n  .no-receipt {\n    padding-top: 15vh;\n    font-size: 2vw;\n    color: #7e0000;\n    font-weight: bold;\n    font-family: \"Times New Roman\";\n    text-align: center;\n    opacity: .9; } }\n@media print {\n  header nav, footer {\n    display: none; }\n  @page {\n    margin: 0.5cm; } }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9wb2ludC1vZi1zYWxlL3JlY2VpcHQvRDpcXFdlYiBEZXZlbG9wbWVudFxcUHJvamVjdHNcXFJlc3RhdXJhbnRNYW5hZ2VtZW50QXBwXFxSZXN0YXVyYW50TWFuYWdlbWVudEFwcC9zcmNcXGFwcFxcY29tcG9uZW50c1xccG9pbnQtb2Ytc2FsZVxccmVjZWlwdFxccmVjZWlwdC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFtTkUsa0tBQVk7QUFuTmQ7RUFDRTtJQUNFLGdCQUFnQjtJQUNoQixlQUFlO0lBQ2YsY0FBYztJQUNkLDJCQUEwQjtJQUMxQixrQkFBa0I7SUFDbEIsaUJBQWlCLEVBQUE7RUFLbkI7SUFDRSx1QkFBdUI7SUFDdkIseUJBQXlCO0lBQ3pCLGdCQUFnQjtJQUNoQixZQUFZO0lBQ1osa0JBQWtCO0lBQ2xCLGtCQUFrQixFQUFBO0VBRXRCO0lBQ0Usa0JBQWtCO0lBQ2xCLDBCQUF5QjtJQUN6QixlQUFlLEVBQUE7RUFHZjtJQUNFLGtCQUFrQjtJQUNsQixtQkFBbUIsRUFBQTtFQUdyQjtJQUNFLDZCQUE2QjtJQUM3QixhQUFhO0lBQ2IsVUFBVSxFQUFBO0VBRVo7SUFDRSxrQkFBa0IsRUFBQTtFQUVwQjtJQUNFLFVBQVU7SUFDVixZQUFXO0lBQ1gsMkJBQTBCO0lBQzFCLGNBQWM7SUFDZCx5QkFBeUI7SUFDekIsMkJBQTJCO0lBQzNCLGtCQUFrQjtJQUNsQixlQUFjO0lBQ2QsZ0JBQWdCO0lBQ2hCLG1CQUFtQjtJQUNuQixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLGlCQUFpQixFQUFBO0VBR25CO0lBQ0UseUJBQXlCO0lBQ3pCLGNBQWM7SUFDZCwyQkFBMEI7SUFDMUIsaUJBQWdCO0lBQ2hCLDJCQUEyQjtJQUMzQixrQkFBa0IsRUFBQTtFQUdwQjtJQUNFLFVBQVUsRUFBQTtFQUdaO0lBQ0UsZ0JBQWdCLEVBQUE7RUFHbEI7SUFDRSxrQkFBa0I7SUFDbEIsZ0JBQWdCLEVBQUE7RUFHbEI7SUFDRSxrQkFBaUI7SUFDakIsaUJBQWlCO0lBQ2pCLDBCQUF5QjtJQUN6QixlQUFlO0lBQ2Ysa0JBQWtCO0lBQ2xCLGdCQUFnQjtJQUNoQixtQkFBbUIsRUFBQTtFQUdyQjtJQUNFLGtCQUFpQjtJQUNqQixpQkFBaUI7SUFDakIsMEJBQXlCO0lBQ3pCLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsbUJBQW1CLEVBQUE7RUFHckI7SUFDRSxrQkFBaUI7SUFDakIsaUJBQWlCO0lBQ2pCLDBCQUF5QjtJQUN6QixlQUFlO0lBQ2YsZ0JBQWdCO0lBQ2hCLG1CQUFtQixFQUFBO0VBR3JCO0lBQ0UsaUJBQWlCLEVBQUE7RUFHbkI7SUFDRSxrQkFBa0IsRUFBQTtFQUVwQjtJQUNFLGtCQUFrQixFQUFBO0VBR3BCO0lBQ0UsaUJBQWdCO0lBQ2hCLGtCQUFrQjtJQUNsQixnQkFBZ0I7SUFDaEIsbUJBQW1CLEVBQUE7RUFFckI7SUFDRSwwQkFBeUI7SUFDekIsZUFBZTtJQUNmLGtCQUFrQjtJQUNsQixnQkFBZ0I7SUFDaEIsbUJBQW1CLEVBQUE7RUFHckI7SUFDRSwwQkFBeUI7SUFDekIsZUFBZTtJQUNmLGtCQUFrQjtJQUNsQixpQkFBaUI7SUFDakIsb0JBQW9CLEVBQUE7RUFHdEI7SUFDRSwwQkFBeUI7SUFDekIsZUFBZTtJQUNmLGlCQUFpQixFQUFBO0VBR25CO0lBQ0UsMEJBQXlCO0lBQ3pCLGVBQWU7SUFDZixnQkFBZ0IsRUFBQTtFQUdsQjtJQUNFLDBCQUF5QjtJQUN6QixlQUFlO0lBQ2YsZ0JBQWdCLEVBQUE7RUFHbEI7SUFDRSxnQkFBZ0I7SUFDaEIsbUJBQW1CLEVBQUE7RUFHckI7SUFDRSwwQkFBeUI7SUFDekIsZUFBZTtJQUNmLGlCQUFpQixFQUFBO0VBR25CO0lBQ0UsbUJBQW1CO0lBQ25CLGdCQUFnQjtJQUNoQixrQkFBa0IsRUFBQTtFQUdwQjtJQUNFLDBCQUF5QjtJQUN6QixlQUFlO0lBQ2YsZ0JBQWdCLEVBQUE7RUFFbEI7SUFDRSwwQkFBeUI7SUFDekIsZUFBZTtJQUNmLGlCQUFpQixFQUFBO0VBR25CO0lBQ0UsZ0JBQWdCO0lBQ2hCLG1CQUFtQjtJQUNuQixrQkFBa0IsRUFBQTtFQUdwQjtJQUNFLGdCQUFnQjtJQUNoQixtQkFBbUI7SUFDbkIsa0JBQWtCLEVBQUE7RUFHcEI7SUFDRSxxQkFBcUI7SUFDckIsNkNBQTZDO0lBQzdDLGtCQUFrQjtJQUNsQixvQkFBb0I7SUFDcEIsbUNBQW1DO0lBQ25DLGtDQUFrQyxFQUFBO0VBRXBDO0lBQ0Usa0JBQWtCO0lBQ2xCLDBCQUF5QjtJQUN6QixlQUFlLEVBQUE7RUFLakI7SUFDRSxtRUFBbUU7SUFDbkUsZUFBYztJQUNkLGlCQUFpQjtJQUNqQixjQUFjO0lBQ2QsZ0JBQWdCLEVBQUE7RUFHbEI7SUFDRSxVQUFVLEVBQUE7RUFHWjtJQUNFLFVBQVM7SUFDVCxZQUFXO0lBQ1gsMkJBQTBCO0lBQzFCLGNBQWM7SUFDZCw0QkFBNEI7SUFDNUIsZUFBYztJQUNkLGlCQUFpQjtJQUNqQixrQkFBa0I7SUFDbEIsZ0JBQWdCLEVBQUE7RUFLbEI7SUFDRSxjQUFjO0lBQ2QsNEJBQTRCO0lBQzVCLDJCQUEwQjtJQUMxQixpQkFBZ0IsRUFBQTtFQUlsQjtJQUNFLGNBQWM7SUFDZCxlQUFlO0lBQ2YsNkJBQTZCO0lBQzdCLGtCQUFrQixFQUFBO0VBR3BCO0lBQ0UsaUNBQWlDLEVBQUE7RUFJbkM7SUFDRSxVQUFVLEVBQUE7RUFHWjtJQUNFLG9EQUFpRDtJQUNqRCxtQkFBbUIsRUFBQTtFQUdyQjtJQUNFLG1CQUFtQjtJQUNuQixxQ0FBcUM7SUFDckMsb0RBQWlELEVBQUE7RUFHbkQ7SUFDRSxrQkFBa0I7SUFDbEIsY0FBYztJQUNkLGlCQUFpQixFQUFBO0VBRW5CO0lBQ0UsY0FBYztJQUNkLHFCQUFxQixFQUFBO0VBR3ZCO0lBQ0UsY0FBYztJQUNkLHFCQUFxQixFQUFBO0VBSXZCO0lBQ0UsaUJBQWdCO0lBQ2hCLGNBQWM7SUFDZCxjQUFjO0lBQ2QsaUJBQWlCO0lBQ2pCLDhCQUE2QjtJQUM3QixrQkFBa0I7SUFDbEIsV0FBVyxFQUFBLEVBQ1o7QUFRSDtFQUVFO0lBQ0UsYUFBYSxFQUFBO0VBRWY7SUFDRSxhQUFhLEVBQUEsRUFBQSIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvcG9pbnQtb2Ytc2FsZS9yZWNlaXB0L3JlY2VpcHQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAbWVkaWEgc2NyZWVue1xyXG4gIC5jaGFuZ2V7XHJcbiAgICBtYXJnaW4tdG9wOiAzN3B4O1xyXG4gICAgZm9udC1zaXplOiAyNXB4O1xyXG4gICAgY29sb3I6ICM3ZTAwMDA7XHJcbiAgICBmb250LWZhbWlseTpcIkFyaWFsIE5hcnJvd1wiO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gICNwcmludC1zZWN0aW9ue1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjY2JjNmNiO1xyXG4gICAgbWFyZ2luLXRvcDogMTBweDtcclxuICAgIGhlaWdodDogNTB2aDtcclxuICAgIG92ZXJmbG93LXk6IHNjcm9sbDtcclxuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcclxuICB9XHJcbi50YWJsZS1ub3tcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgZm9udC1mYW1pbHk6XCJJbmNvbnNvbGF0YVwiO1xyXG4gIGZvbnQtc2l6ZTogMTFweDtcclxuXHJcbn1cclxuICAucHJpbnQtcm93e1xyXG4gICAgcGFkZGluZy1sZWZ0OiA5MHB4O1xyXG4gICAgcGFkZGluZy1yaWdodDogOTBweDtcclxuICB9XHJcblxyXG4gIGhye1xyXG4gICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNjYmM2Y2I7XHJcbiAgICBtYXJnaW46IDFlbSAwO1xyXG4gICAgcGFkZGluZzogMDtcclxuICB9XHJcbiAgLnJlY2VpcHR7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgfVxyXG4gIC5iYWNre1xyXG4gICAgd2lkdGg6IDUwJTtcclxuICAgIGhlaWdodDoxMDAlO1xyXG4gICAgZm9udC1mYW1pbHk6XCJBcmlhbCBOYXJyb3dcIjtcclxuICAgIGNvbG9yOiAjZDMyMDM5O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZkZjtcclxuICAgIGJvcmRlcjogMS4ycHggc29saWQgI2FlMDAwMDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgIGZvbnQtc2l6ZToyMHB4O1xyXG4gICAgcGFkZGluZy10b3A6IDVweDtcclxuICAgIHBhZGRpbmctYm90dG9tOiA1cHg7XHJcbiAgICBtYXJnaW4tbGVmdDogNXB4O1xyXG4gICAgbWFyZ2luLXRvcDogMjJweDtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gIH1cclxuXHJcbiAgLmJhY2s6aG92ZXJ7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZDMyMDM5O1xyXG4gICAgY29sb3I6ICNmZmZmZGY7XHJcbiAgICBmb250LWZhbWlseTpcIkFyaWFsIE5hcnJvd1wiO1xyXG4gICAgZm9udC13ZWlnaHQ6Ym9sZDtcclxuICAgIGJvcmRlcjogMS4ycHggc29saWQgI2ZmZmZkZjtcclxuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICB9XHJcblxyXG4gIC5iYWNrOmZvY3Vze1xyXG4gICAgb3V0bGluZTogMDtcclxuICB9XHJcblxyXG4gIC5uZXh0LW9yZGVyLWRpdntcclxuICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgfVxyXG5cclxuICAuaW50cm97XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBtYXJnaW4tdG9wOiAxNXB4O1xyXG4gIH1cclxuXHJcbiAgLmRhdGUtdGltZXtcclxuICAgIHBhZGRpbmctcmlnaHQ6MHB4O1xyXG4gICAgcGFkZGluZy1sZWZ0OiAwcHg7XHJcbiAgICBmb250LWZhbWlseTpcIkluY29uc29sYXRhXCI7XHJcbiAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBwYWRkaW5nLXRvcDogNXB4O1xyXG4gICAgcGFkZGluZy1ib3R0b206IDVweDtcclxuICB9XHJcblxyXG4gIC5pZHtcclxuICAgIHBhZGRpbmctcmlnaHQ6MHB4O1xyXG4gICAgcGFkZGluZy1sZWZ0OiAwcHg7XHJcbiAgICBmb250LWZhbWlseTpcIkluY29uc29sYXRhXCI7XHJcbiAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICBwYWRkaW5nLXRvcDogNXB4O1xyXG4gICAgcGFkZGluZy1ib3R0b206IDVweDtcclxuICB9XHJcblxyXG4gIC5uYW1lLCAucHJpY2UsIC5xdWFudGl0eSwgLmVxdWFsLCAuc3ViLXRvdGFsLCAubXVse1xyXG4gICAgcGFkZGluZy1yaWdodDowcHg7XHJcbiAgICBwYWRkaW5nLWxlZnQ6IDBweDtcclxuICAgIGZvbnQtZmFtaWx5OlwiSW5jb25zb2xhdGFcIjtcclxuICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgIHBhZGRpbmctdG9wOiAycHg7XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogMnB4O1xyXG4gIH1cclxuXHJcbiAgLnByaWNle1xyXG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XHJcbiAgfVxyXG5cclxuICAucXVhbnRpdHl7XHJcbiAgICBwYWRkaW5nLWxlZnQ6IDIwcHg7XHJcbiAgfVxyXG4gIC5tdWx7XHJcbiAgICBwYWRkaW5nLWxlZnQ6IDIwcHg7XHJcbiAgfVxyXG5cclxuICAubWFpbntcclxuICAgIHBhZGRpbmctbGVmdDowcHg7XHJcbiAgICBwYWRkaW5nLXJpZ2h0OiAwcHg7XHJcbiAgICBwYWRkaW5nLXRvcDogMnB4O1xyXG4gICAgcGFkZGluZy1ib3R0b206IDRweDtcclxuICB9XHJcbiAgLmhvZG9ve1xyXG4gICAgZm9udC1mYW1pbHk6XCJJbmNvbnNvbGF0YVwiO1xyXG4gICAgZm9udC1zaXplOiAxM3B4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgcGFkZGluZy10b3A6IDVweDtcclxuICAgIHBhZGRpbmctYm90dG9tOiA4cHg7XHJcbiAgfVxyXG5cclxuICAuY2hvb3NpbmctaG9kb297XHJcbiAgICBmb250LWZhbWlseTpcIkluY29uc29sYXRhXCI7XHJcbiAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBwYWRkaW5nLXRvcDogMTVweDtcclxuICAgIHBhZGRpbmctYm90dG9tOiAyMHB4O1xyXG4gIH1cclxuXHJcbiAgLmNoYW5nZS1iZHR7XHJcbiAgICBmb250LWZhbWlseTpcIkluY29uc29sYXRhXCI7XHJcbiAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICB0ZXh0LWFsaWduOiByaWdodDtcclxuXHJcbiAgfVxyXG4gIC5jaGFuZ2UtY2FzaHtcclxuICAgIGZvbnQtZmFtaWx5OlwiSW5jb25zb2xhdGFcIjtcclxuICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcblxyXG4gIH1cclxuICAudGVuZGVyZWR7XHJcbiAgICBmb250LWZhbWlseTpcIkluY29uc29sYXRhXCI7XHJcbiAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gIH1cclxuXHJcbiAgLmludHJve1xyXG4gICAgcGFkZGluZy10b3A6IDVweDtcclxuICAgIHBhZGRpbmctYm90dG9tOiA1cHg7XHJcbiAgfVxyXG5cclxuICAudGVuZGVyZWQtYmR0e1xyXG4gICAgZm9udC1mYW1pbHk6XCJJbmNvbnNvbGF0YVwiO1xyXG4gICAgZm9udC1zaXplOiAxMXB4O1xyXG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XHJcbiAgfVxyXG5cclxuICAudG90YWwtZGl2e1xyXG4gICAgcGFkZGluZy1ib3R0b206IDVweDtcclxuICAgIHBhZGRpbmctdG9wOiA1cHg7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgfVxyXG5cclxuICAudG90YWx7XHJcbiAgICBmb250LWZhbWlseTpcIkluY29uc29sYXRhXCI7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gIH1cclxuICAudG90YWwtYmR0e1xyXG4gICAgZm9udC1mYW1pbHk6XCJJbmNvbnNvbGF0YVwiO1xyXG4gICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XHJcbiAgfVxyXG5cclxuICAuY2hhbmdlLWRpdntcclxuICAgIHBhZGRpbmctdG9wOiA0cHg7XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogNHB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIH1cclxuXHJcbiAgLnRlbmRlcmVkLWRpdntcclxuICAgIHBhZGRpbmctdG9wOiA0cHg7XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogNHB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIH1cclxuXHJcbiAgLmZhe1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgZm9udDogbm9ybWFsIG5vcm1hbCBub3JtYWwgMTRweC8xIEZvbnRBd2Vzb21lO1xyXG4gICAgZm9udC1zaXplOiBpbmhlcml0O1xyXG4gICAgdGV4dC1yZW5kZXJpbmc6IGF1dG87XHJcbiAgICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcclxuICAgIC1tb3otb3N4LWZvbnQtc21vb3RoaW5nOiBncmF5c2NhbGU7XHJcbiAgfVxyXG4gIC50YWJsZS1ub3tcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGZvbnQtZmFtaWx5OlwiSW5jb25zb2xhdGFcIjtcclxuICAgIGZvbnQtc2l6ZTogMTFweDtcclxuXHJcbiAgfVxyXG5cclxuICBAaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PUFjbWV8QWxhZGlufEJlcmtzaGlyZStTd2FzaHxDYWJpbitTa2V0Y2h8Q2hld3l8RnJlZG9rYStPbmV8S2FuaXR8TG9ic3RlcnxMb25kcmluYStTb2xpZHxSaWdodGVvdXN8Um9jaytTYWx0Jyk7XHJcbiAgLmhvZG9vLWxvZ28ge1xyXG4gICAgZm9udC1mYW1pbHk6ICdCZXJrc2hpcmUgU3dhc2gnLCBcIlRpbWVzIE5ldyBSb21hblwiLCBcIkJlcmxpbiBTYW5zIEZCXCI7XHJcbiAgICBmb250LXNpemU6NDBweDtcclxuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xyXG4gICAgY29sb3I6ICM3ZTAwMDA7XHJcbiAgICBwYWRkaW5nLXRvcDogNXB4O1xyXG4gIH1cclxuXHJcbiAgLmhvZG9vOmZvY3VzIHtcclxuICAgIG91dGxpbmU6IDA7XHJcbiAgfVxyXG5cclxuICAuZGFzaGJvYXJke1xyXG4gICAgd2lkdGg6MjAlO1xyXG4gICAgaGVpZ2h0OjEwMCU7XHJcbiAgICBmb250LWZhbWlseTpcIkFyaWFsIE5hcnJvd1wiO1xyXG4gICAgY29sb3I6ICNhYTA5MDk7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBnaG9zdHdoaXRlO1xyXG4gICAgZm9udC1zaXplOjMzcHg7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIG1hcmdpbi10b3A6IDEycHg7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIC5kYXNoYm9hcmQ6aG92ZXJ7XHJcbiAgICBjb2xvcjogIzZhMGQwZTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGdob3N0d2hpdGU7XHJcbiAgICBmb250LWZhbWlseTpcIkFyaWFsIE5hcnJvd1wiO1xyXG4gICAgZm9udC13ZWlnaHQ6Ym9sZDtcclxuICB9XHJcblxyXG5cclxuICAucG9wLXVwe1xyXG4gICAgY29sb3I6ICM3ZTAwMDA7XHJcbiAgICBmb250LXNpemU6IDE5cHg7XHJcbiAgICBmb250LWZhbWlseTogXCJCZXJsaW4gU2FucyBGQlwiO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIH1cclxuXHJcbiAgLm1haW4tcm93e1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMnB4IGRvdWJsZSAjZGZkZmRmO1xyXG4gIH1cclxuXHJcblxyXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXIge1xyXG4gICAgd2lkdGg6IDFweDtcclxuICB9XHJcblxyXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xyXG4gICAgLXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIDAgNnB4IHJnYmEoMCwwLDAsMC4zKTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgfVxyXG5cclxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcclxuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNjEpO1xyXG4gICAgLXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIDAgNnB4IHJnYmEoMCwwLDAsMC41KTtcclxuICB9XHJcblxyXG4gIC5nby1iYWNrLXRvLXBvc3tcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIGZvbnQtc2l6ZTogMXZ3O1xyXG4gICAgcGFkZGluZy10b3A6IDEzcHg7XHJcbiAgfVxyXG4gIGF7XHJcbiAgICBjb2xvcjogI2EzMDAwMDtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICB9XHJcblxyXG4gIGE6aG92ZXJ7XHJcbiAgICBjb2xvcjogIzU1MGQwZTtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICB9XHJcblxyXG5cclxuICAubm8tcmVjZWlwdHtcclxuICAgIHBhZGRpbmctdG9wOjE1dmg7XHJcbiAgICBmb250LXNpemU6IDJ2dztcclxuICAgIGNvbG9yOiAjN2UwMDAwO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICBmb250LWZhbWlseTpcIlRpbWVzIE5ldyBSb21hblwiO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgb3BhY2l0eTogLjk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxufVxyXG5cclxuXHJcbkBtZWRpYSBwcmludCB7XHJcblxyXG4gIGhlYWRlciBuYXYsIGZvb3RlciB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG4gIH1cclxuICBAcGFnZSB7XHJcbiAgICBtYXJnaW46IDAuNWNtO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/components/point-of-sale/receipt/receipt.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/components/point-of-sale/receipt/receipt.component.ts ***!
  \***********************************************************************/
/*! exports provided: ReceiptComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReceiptComponent", function() { return ReceiptComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_shared_point_of_sale_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../services/shared/point-of-sale.service */ "./src/app/services/shared/point-of-sale.service.ts");
/* harmony import */ var _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../services/data-storage/table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");





var ReceiptComponent = /** @class */ (function () {
    function ReceiptComponent(pointOfSaleService, dataStorageService, router) {
        this.pointOfSaleService = pointOfSaleService;
        this.dataStorageService = dataStorageService;
        this.router = router;
    }
    ReceiptComponent.prototype.ngOnInit = function () {
        this.order = this.pointOfSaleService.order;
    };
    ReceiptComponent.prototype.discardOrder = function () {
        var dialog = confirm('Delete this order?\n' +
            'You will lose any kind of data associated with the current order!');
        if (dialog === true) {
            this.confirmEvent();
        }
    };
    ReceiptComponent.prototype.confirmEvent = function () {
        this.pointOfSaleService.clearOrders();
        this.pointOfSaleService.totalPrice = 0;
        this.pointOfSaleService.totalQuantity = 0;
        this.router.navigate(['our-offers/regulars']);
        this.pointOfSaleService.deleteOrder(this.order);
        // this.dataStorageService.deleteOrder(1).subscribe();
    };
    ReceiptComponent.prototype.print = function () {
        var printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('document.URL,', '_blank');
        popupWin.document.open();
        popupWin.document.write("\n      <html>\n        <head>\n          <title></title>\n        <style>\n @media print\n {\n  header nav, footer {\n      display: none;\n  }\n  @page {\n      margin: 0.5cm;\n  }\n  .intro{\n  text-align: center;\n  }\n  .hodoo{\n    font-family:\"Inconsolata\";\n    font-size: 4vw;\n    text-align: center;\n    padding-top: 10px;\n  }\n  .date-time{\n   font-family:\"Inconsolata\";\n   font-size: 4vw;\n   display: inline-block;\n   text-align:center;\n  }\n.id{\n   font-family:\"Inconsolata\";\n   font-size: 4vw;\n   display: inline;\n   text-align: center;\n}\n.name, .price, .quantity, .equal, .sub-total, .mul{\n    font-family:\"Inconsolata\";\n    font-size: 3vw;\n    padding-top: 2px;\n    padding-bottom: 2px;\n    display: inline;\n    text-align:left;\n  }\n  .main{\n  padding-top: 10px;\n  padding-bottom: 10px;\n  text-align: center;\n  }\n  .name{\n  text-align:left;\n  }\n.intro{\n    margin-top: 15px;\n  }\n\n\n.sub-total{\ntext-align: right;\n}\n\n  .choosing-hodoo{\n    font-family:\"Inconsolata\",cursive;\n    font-size: 3vw;\n    padding-top: 15px;\n    padding-bottom: 20px;\n    text-align: center;\n  }\n  .total-div{\n    padding-bottom: 8px;\n    padding-top: 8px;\n    text-align:center;\n  }\n  .total{\n    font-family:\"Inconsolata\";\n    font-size: 4vw;\n     display: inline-block;\n  }\n  .total-bdt{\n    font-family:\"Inconsolata\";\n    font-size: 4vw;\n     display: inline-block;\n  }\n   .change-div{\n    padding-top: 8px;\n    padding-bottom: 8px;\n    text-align: center;\n  }\n  .change-bdt{\n    font-family:\"Inconsolata\";\n    font-size: 4vw;\n     display: inline-block;\n  }\n  .change-cash{\n    font-family:\"Inconsolata\";\n    font-size: 4vw;\n    display: inline-block;\n  }\n.tendered-div{\n    padding-top: 8px;\n    padding-bottom: 8px;\n    text-align: center;\n  }\n  .tendered{\n    font-family:\"Inconsolata\";\n    font-size: 4vw;\n    display: inline-block;\n  }\n  .tendered-bdt{\n    font-family:\"Inconsolata\";\n    font-size: 4vw;\n    display: inline-block;\n  }\n  .table-no{\n    text-align: center;\n    font-family:\"Inconsolata\";\n    font-size: 4vw;\n  }\n }\n</style>\n        </head>\n     <body onload=\"window.print();window.close()\">" + printContents + "</body>\n      </html>");
        popupWin.document.close();
    };
    ReceiptComponent.prototype.nextOrder = function () {
        this.pointOfSaleService.clearOrders();
        this.pointOfSaleService.totalPrice = 0;
        this.pointOfSaleService.totalQuantity = 0;
        this.router.navigate(['our-offers']);
    };
    ReceiptComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-receipt',
            template: __webpack_require__(/*! ./receipt.component.html */ "./src/app/components/point-of-sale/receipt/receipt.component.html"),
            styles: [__webpack_require__(/*! ./receipt.component.scss */ "./src/app/components/point-of-sale/receipt/receipt.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_shared_point_of_sale_service__WEBPACK_IMPORTED_MODULE_3__["PointOfSaleService"],
            _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_4__["TableDataStorageService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], ReceiptComponent);
    return ReceiptComponent;
}());



/***/ }),

/***/ "./src/app/components/point-of-sale/select-table/select-table.component.html":
/*!***********************************************************************************!*\
  !*** ./src/app/components/point-of-sale/select-table/select-table.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  select-table works!\n</p>\n"

/***/ }),

/***/ "./src/app/components/point-of-sale/select-table/select-table.component.scss":
/*!***********************************************************************************!*\
  !*** ./src/app/components/point-of-sale/select-table/select-table.component.scss ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvcG9pbnQtb2Ytc2FsZS9zZWxlY3QtdGFibGUvc2VsZWN0LXRhYmxlLmNvbXBvbmVudC5zY3NzIn0= */"

/***/ }),

/***/ "./src/app/components/point-of-sale/select-table/select-table.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/components/point-of-sale/select-table/select-table.component.ts ***!
  \*********************************************************************************/
/*! exports provided: SelectTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectTableComponent", function() { return SelectTableComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var SelectTableComponent = /** @class */ (function () {
    function SelectTableComponent() {
    }
    SelectTableComponent.prototype.ngOnInit = function () {
    };
    SelectTableComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-select-table',
            template: __webpack_require__(/*! ./select-table.component.html */ "./src/app/components/point-of-sale/select-table/select-table.component.html"),
            styles: [__webpack_require__(/*! ./select-table.component.scss */ "./src/app/components/point-of-sale/select-table/select-table.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], SelectTableComponent);
    return SelectTableComponent;
}());



/***/ }),

/***/ "./src/app/components/point-of-sale/session/session.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/components/point-of-sale/session/session.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/components/point-of-sale/session/session.component.scss":
/*!*************************************************************************!*\
  !*** ./src/app/components/point-of-sale/session/session.component.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@import url(\"https://fonts.googleapis.com/css?family=Acme|Aladin|Berkshire+Swash|Cabin+Sketch|Chewy|Fredoka+One|Kanit|Lobster|Londrina+Solid|Righteous|Rock+Salt\");\n.hodoo {\n  font-family: 'Berkshire Swash', cursive;\n  font-size: 100px;\n  padding-left: 38px;\n  text-align: center;\n  color: #7e0000;\n  padding-top: 40px; }\n.hodoo:focus {\n  outline: 0; }\n.pos, .admin {\n  font-family: \"Berlin Sans FB\";\n  font-size: 4vmax;\n  text-align: center;\n  color: #aa0909; }\n.pos:hover, .admin:hover {\n  color: #6a0d0e; }\n.log-out {\n  text-align: right;\n  padding-top: 20px; }\n.btn-primary {\n  background-color: #9c0000;\n  color: white; }\n.btn-primary:hover {\n  background-color: #7f0000;\n  color: white; }\n.btn-primary:focus {\n  outline: 0; }\n.dashboard {\n  padding-top: 120px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9wb2ludC1vZi1zYWxlL3Nlc3Npb24vRDpcXFdlYiBEZXZlbG9wbWVudFxcUHJvamVjdHNcXFJlc3RhdXJhbnRNYW5hZ2VtZW50QXBwXFxSZXN0YXVyYW50TWFuYWdlbWVudEFwcC9zcmNcXGFwcFxcY29tcG9uZW50c1xccG9pbnQtb2Ytc2FsZVxcc2Vzc2lvblxcc2Vzc2lvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxrS0FBWTtBQUlaO0VBQ0UsdUNBQXVDO0VBQ3ZDLGdCQUFnQjtFQUNoQixrQkFBa0I7RUFDbEIsa0JBQWtCO0VBQ2xCLGNBQWM7RUFDZCxpQkFBaUIsRUFBQTtBQUduQjtFQUNFLFVBQVUsRUFBQTtBQUdaO0VBQ0UsNkJBQTZCO0VBQzdCLGdCQUFnQjtFQUNoQixrQkFBa0I7RUFDbEIsY0FBYyxFQUFBO0FBSWhCO0VBQ0UsY0FBYyxFQUFBO0FBRWhCO0VBQ0UsaUJBQWlCO0VBQ2pCLGlCQUFpQixFQUFBO0FBRW5CO0VBQ0UseUJBQXlCO0VBQ3pCLFlBQVksRUFBQTtBQUVkO0VBQ0UseUJBQXlCO0VBQ3pCLFlBQVksRUFBQTtBQUdkO0VBQ0UsVUFBUyxFQUFBO0FBR1g7RUFDRSxrQkFBa0IsRUFBQSIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvcG9pbnQtb2Ytc2FsZS9zZXNzaW9uL3Nlc3Npb24uY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PUFjbWV8QWxhZGlufEJlcmtzaGlyZStTd2FzaHxDYWJpbitTa2V0Y2h8Q2hld3l8RnJlZG9rYStPbmV8S2FuaXR8TG9ic3RlcnxMb25kcmluYStTb2xpZHxSaWdodGVvdXN8Um9jaytTYWx0Jyk7XHJcblxyXG5cclxuXHJcbi5ob2RvbyB7XHJcbiAgZm9udC1mYW1pbHk6ICdCZXJrc2hpcmUgU3dhc2gnLCBjdXJzaXZlO1xyXG4gIGZvbnQtc2l6ZTogMTAwcHg7XHJcbiAgcGFkZGluZy1sZWZ0OiAzOHB4O1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBjb2xvcjogIzdlMDAwMDtcclxuICBwYWRkaW5nLXRvcDogNDBweDtcclxufVxyXG5cclxuLmhvZG9vOmZvY3VzIHtcclxuICBvdXRsaW5lOiAwO1xyXG59XHJcblxyXG4ucG9zLCAuYWRtaW57XHJcbiAgZm9udC1mYW1pbHk6IFwiQmVybGluIFNhbnMgRkJcIjtcclxuICBmb250LXNpemU6IDR2bWF4O1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBjb2xvcjogI2FhMDkwOTtcclxufVxyXG5cclxuXHJcbi5wb3M6aG92ZXIsIC5hZG1pbjpob3ZlcntcclxuICBjb2xvcjogIzZhMGQwZTtcclxufVxyXG4ubG9nLW91dHtcclxuICB0ZXh0LWFsaWduOiByaWdodDtcclxuICBwYWRkaW5nLXRvcDogMjBweDtcclxufVxyXG4uYnRuLXByaW1hcnl7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzljMDAwMDtcclxuICBjb2xvcjogd2hpdGU7XHJcbn1cclxuLmJ0bi1wcmltYXJ5OmhvdmVye1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICM3ZjAwMDA7XHJcbiAgY29sb3I6IHdoaXRlO1xyXG59XHJcblxyXG4uYnRuLXByaW1hcnk6Zm9jdXN7XHJcbiAgb3V0bGluZTowO1xyXG59XHJcblxyXG4uZGFzaGJvYXJke1xyXG4gIHBhZGRpbmctdG9wOiAxMjBweDtcclxufVxyXG4iXX0= */"

/***/ }),

/***/ "./src/app/components/point-of-sale/session/session.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/components/point-of-sale/session/session.component.ts ***!
  \***********************************************************************/
/*! exports provided: SessionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SessionComponent", function() { return SessionComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var SessionComponent = /** @class */ (function () {
    function SessionComponent() {
    }
    SessionComponent.prototype.ngOnInit = function () { };
    SessionComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-control-panel',
            template: __webpack_require__(/*! ./session.component.html */ "./src/app/components/point-of-sale/session/session.component.html"),
            styles: [__webpack_require__(/*! ./session.component.scss */ "./src/app/components/point-of-sale/session/session.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], SessionComponent);
    return SessionComponent;
}());



/***/ }),

/***/ "./src/app/components/reset-password/reset-password.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/components/reset-password/reset-password.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<div class=\"row\">\r\n  <div class=\"col-xl-12\"\r\n       style=\"\r\n       font-family: 'Times New Roman', sans-serif;\r\n       font-size: 100px;\r\n       text-align: center;\r\n       padding-top: 35px;\">\r\n    hodoo\r\n  </div>\r\n</div>\r\n\r\n\r\n<form\r\n  #resetForm=\"ngForm\"\r\n  (ngSubmit)=\"getResetCode(resetForm)\">\r\n\r\n\r\n<div class=\"row\">\r\n  <div class=\"offset-xl-4 col-xl-4\">\r\n\r\n        <label style=\"font-weight: 300;\">Enter your user name</label>\r\n        <input class=\"form-control\"\r\n               type=\"text\"\r\n               name=\"username\"\r\n               ngModel\r\n               required>\r\n  </div>\r\n</div>\r\n\r\n  <br>\r\n\r\n  <div class=\"row\" style=\"text-align: center;\">\r\n        <div class=\"col-xl-12\">\r\n          <button\r\n            class=\"btn btn-primary \"\r\n            type=\"submit\"\r\n            [disabled]=\"!resetForm.valid || isDisabled\"\r\n          >Send Reset Code</button>\r\n        </div>\r\n      </div>\r\n</form>\r\n\r\n"

/***/ }),

/***/ "./src/app/components/reset-password/reset-password.component.scss":
/*!*************************************************************************!*\
  !*** ./src/app/components/reset-password/reset-password.component.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvcmVzZXQtcGFzc3dvcmQvcmVzZXQtcGFzc3dvcmQuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/components/reset-password/reset-password.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/components/reset-password/reset-password.component.ts ***!
  \***********************************************************************/
/*! exports provided: ResetPasswordComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResetPasswordComponent", function() { return ResetPasswordComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_shared_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/shared/auth.service */ "./src/app/services/shared/auth.service.ts");




var ResetPasswordComponent = /** @class */ (function () {
    function ResetPasswordComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.isDisabled = false;
    }
    ResetPasswordComponent.prototype.ngOnInit = function () {
    };
    ResetPasswordComponent.prototype.getResetCode = function (form) {
        var _this = this;
        this.isDisabled = true;
        this.authService.resetPassword(form.value.UserName).subscribe(function (data) {
            if (data === 'User Name Found') {
                _this.isDisabled = false;
                form.reset();
                alert('A password recovery code has sent to your email');
                _this.router.navigate(['/new-password']);
            }
            else {
                _this.isDisabled = false;
                alert('Incorrect user name!');
            }
        });
    };
    ResetPasswordComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-reset-password',
            template: __webpack_require__(/*! ./reset-password.component.html */ "./src/app/components/reset-password/reset-password.component.html"),
            styles: [__webpack_require__(/*! ./reset-password.component.scss */ "./src/app/components/reset-password/reset-password.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_shared_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], ResetPasswordComponent);
    return ResetPasswordComponent;
}());



/***/ }),

/***/ "./src/app/http-error-interceptor/http-error.interceptor.ts":
/*!******************************************************************!*\
  !*** ./src/app/http-error-interceptor/http-error.interceptor.ts ***!
  \******************************************************************/
/*! exports provided: HttpErrorInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpErrorInterceptor", function() { return HttpErrorInterceptor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ng6-toastr-notifications */ "./node_modules/ng6-toastr-notifications/fesm5/ng6-toastr-notifications.js");





var HttpErrorInterceptor = /** @class */ (function () {
    function HttpErrorInterceptor(toastr) {
        this.toastr = toastr;
    }
    HttpErrorInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        return next.handle(request)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) {
            var errorMessage = '';
            if (error.error instanceof ErrorEvent) {
                errorMessage = "Error: " + error.error.message;
            }
            else {
                errorMessage = "Error Code: " + error.status + "\nMessage: " + error.message;
            }
            _this.toastr.errorToastr(errorMessage, 'Error', {
                toastTimeout: 20000,
                newestOnTop: true,
                showCloseButton: true
            });
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["throwError"])(errorMessage);
        }));
    };
    HttpErrorInterceptor = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ng6_toastr_notifications__WEBPACK_IMPORTED_MODULE_4__["ToastrManager"]])
    ], HttpErrorInterceptor);
    return HttpErrorInterceptor;
}());



/***/ }),

/***/ "./src/app/models/food-item.model.ts":
/*!*******************************************!*\
  !*** ./src/app/models/food-item.model.ts ***!
  \*******************************************/
/*! exports provided: FoodItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FoodItem", function() { return FoodItem; });
var FoodItem = /** @class */ (function () {
    function FoodItem(id, serialNumber, name, price, inventoryCost, profit, totalSale, foodItemImageName, ingredients) {
        this.Id = id;
        this.SerialNumber = serialNumber;
        this.Name = name;
        this.Price = price;
        this.InventoryCost = inventoryCost;
        this.Profit = profit;
        this.TotalSale = totalSale;
        this.Ingredients = ingredients;
        this.FoodItemImageName = foodItemImageName;
    }
    return FoodItem;
}());



/***/ }),

/***/ "./src/app/models/ingredient.model.ts":
/*!********************************************!*\
  !*** ./src/app/models/ingredient.model.ts ***!
  \********************************************/
/*! exports provided: Ingredient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ingredient", function() { return Ingredient; });
var Ingredient = /** @class */ (function () {
    function Ingredient(id, quantity, inventoryId, subTotal, foodItemId) {
        this.Id = id;
        this.Quantity = quantity;
        this.InventoryId = inventoryId;
        this.SubTotal = subTotal;
        this.FoodItemId = foodItemId;
    }
    return Ingredient;
}());



/***/ }),

/***/ "./src/app/models/inventory-history.model.ts":
/*!***************************************************!*\
  !*** ./src/app/models/inventory-history.model.ts ***!
  \***************************************************/
/*! exports provided: InventoryHistory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryHistory", function() { return InventoryHistory; });
var InventoryHistory = /** @class */ (function () {
    function InventoryHistory(id, inventoryId, buyingQuantity, buyingTime, buyingPrice) {
        this.Id = id;
        this.InventoryId = inventoryId;
        this.BuyingQuantity = buyingQuantity;
        this.BuyingTime = buyingTime;
        this.BuyingPrice = buyingPrice;
    }
    return InventoryHistory;
}());



/***/ }),

/***/ "./src/app/models/inventory.model.ts":
/*!*******************************************!*\
  !*** ./src/app/models/inventory.model.ts ***!
  \*******************************************/
/*! exports provided: Inventory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Inventory", function() { return Inventory; });
var Inventory = /** @class */ (function () {
    function Inventory(id, name, usedQuantity, remainingQuantity, unit, averagePrice, inventoryHistory, buyingTime) {
        if (inventoryHistory === void 0) { inventoryHistory = []; }
        this.Id = id;
        this.Name = name;
        this.UsedQuantity = usedQuantity;
        this.RemainingQuantity = remainingQuantity;
        this.Unit = unit;
        this.AveragePrice = averagePrice;
        this.InventoryHistory = inventoryHistory;
        this.BuyingTime = buyingTime;
    }
    return Inventory;
}());



/***/ }),

/***/ "./src/app/models/modified-user.model.ts":
/*!***********************************************!*\
  !*** ./src/app/models/modified-user.model.ts ***!
  \***********************************************/
/*! exports provided: ModifiedUserModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModifiedUserModel", function() { return ModifiedUserModel; });
var ModifiedUserModel = /** @class */ (function () {
    function ModifiedUserModel(userName, email, role, dateTime) {
        this.UserName = userName;
        this.Email = email;
        this.Role = role;
        this.DateTime = dateTime;
    }
    return ModifiedUserModel;
}());



/***/ }),

/***/ "./src/app/models/order.model.ts":
/*!***************************************!*\
  !*** ./src/app/models/order.model.ts ***!
  \***************************************/
/*! exports provided: Order */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Order", function() { return Order; });
var Order = /** @class */ (function () {
    function Order(id, orderedItem, totalPrice, tendered, change, dateTime, tableNumber, inventoryCost, profit) {
        this.Id = id;
        this.OrderedItem = orderedItem;
        this.TotalPrice = totalPrice;
        this.Tendered = tendered;
        this.Change = change;
        this.DateTime = dateTime;
        this.TableNumber = tableNumber;
        this.InventoryCost = inventoryCost;
        this.Profit = profit;
    }
    return Order;
}());



/***/ }),

/***/ "./src/app/models/ordered-item.model.ts":
/*!**********************************************!*\
  !*** ./src/app/models/ordered-item.model.ts ***!
  \**********************************************/
/*! exports provided: OrderedItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrderedItem", function() { return OrderedItem; });
var OrderedItem = /** @class */ (function () {
    function OrderedItem(id, receiptNumber, orderId, foodItemId, foodItemQuantity, totalPrice) {
        this.Id = id;
        this.ReceiptNumber = receiptNumber;
        this.OrderId = orderId;
        this.FoodItemId = foodItemId;
        this.FoodItemQuantity = foodItemQuantity;
        this.TotalPrice = totalPrice;
    }
    return OrderedItem;
}());



/***/ }),

/***/ "./src/app/models/table.model.ts":
/*!***************************************!*\
  !*** ./src/app/models/table.model.ts ***!
  \***************************************/
/*! exports provided: Table */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Table", function() { return Table; });
var Table = /** @class */ (function () {
    function Table(id, name) {
        this.Id = id;
        this.Name = name;
    }
    return Table;
}());



/***/ }),

/***/ "./src/app/modules/app-routing.module.ts":
/*!***********************************************!*\
  !*** ./src/app/modules/app-routing.module.ts ***!
  \***********************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _auth_auth_guard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../auth/auth.guard */ "./src/app/auth/auth.guard.ts");
/* harmony import */ var _components_point_of_sale_payment_payment_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/point-of-sale/payment/payment.component */ "./src/app/components/point-of-sale/payment/payment.component.ts");
/* harmony import */ var _route_resolvers_inventory_resolver_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../route-resolvers/inventory-resolver.service */ "./src/app/route-resolvers/inventory-resolver.service.ts");
/* harmony import */ var _route_resolvers_table_resolver_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../route-resolvers/table-resolver.service */ "./src/app/route-resolvers/table-resolver.service.ts");
/* harmony import */ var _route_resolvers_food_item_resolver_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../route-resolvers/food-item-resolver.service */ "./src/app/route-resolvers/food-item-resolver.service.ts");
/* harmony import */ var _components_forbidden_forbidden_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/forbidden/forbidden.component */ "./src/app/components/forbidden/forbidden.component.ts");
/* harmony import */ var _components_point_of_sale_point_of_sale_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/point-of-sale/point-of-sale.component */ "./src/app/components/point-of-sale/point-of-sale.component.ts");
/* harmony import */ var _components_point_of_sale_menu_menu_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../components/point-of-sale/menu/menu.component */ "./src/app/components/point-of-sale/menu/menu.component.ts");
/* harmony import */ var _components_login_login_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/login/login.component */ "./src/app/components/login/login.component.ts");
/* harmony import */ var _components_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../components/reset-password/reset-password.component */ "./src/app/components/reset-password/reset-password.component.ts");
/* harmony import */ var _components_admin_admin_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../components/admin/admin.component */ "./src/app/components/admin/admin.component.ts");
/* harmony import */ var _components_new_password_new_password_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../components/new-password/new-password.component */ "./src/app/components/new-password/new-password.component.ts");
/* harmony import */ var _components_admin_orders_orders_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../components/admin/orders/orders.component */ "./src/app/components/admin/orders/orders.component.ts");
/* harmony import */ var _components_admin_users_users_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../components/admin/users/users.component */ "./src/app/components/admin/users/users.component.ts");
/* harmony import */ var _route_resolvers_order_resolver_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../route-resolvers/order-resolver.service */ "./src/app/route-resolvers/order-resolver.service.ts");
/* harmony import */ var _components_admin_tables_tables_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../components/admin/tables/tables.component */ "./src/app/components/admin/tables/tables.component.ts");
/* harmony import */ var _components_admin_tables_add_new_table_add_new_table_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../components/admin/tables/add-new-table/add-new-table.component */ "./src/app/components/admin/tables/add-new-table/add-new-table.component.ts");
/* harmony import */ var _components_admin_tables_edit_table_edit_table_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../components/admin/tables/edit-table/edit-table.component */ "./src/app/components/admin/tables/edit-table/edit-table.component.ts");
/* harmony import */ var _components_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../components/page-not-found/page-not-found.component */ "./src/app/components/page-not-found/page-not-found.component.ts");
/* harmony import */ var _components_point_of_sale_session_session_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../components/point-of-sale/session/session.component */ "./src/app/components/point-of-sale/session/session.component.ts");
/* harmony import */ var _components_point_of_sale_select_table_select_table_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../components/point-of-sale/select-table/select-table.component */ "./src/app/components/point-of-sale/select-table/select-table.component.ts");
/* harmony import */ var _components_admin_food_items_food_items_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../components/admin/food-items/food-items.component */ "./src/app/components/admin/food-items/food-items.component.ts");
/* harmony import */ var _components_admin_orders_order_list_order_list_component__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../components/admin/orders/order-list/order-list.component */ "./src/app/components/admin/orders/order-list/order-list.component.ts");
/* harmony import */ var _components_admin_inventories_inventories_component__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../components/admin/inventories/inventories.component */ "./src/app/components/admin/inventories/inventories.component.ts");
/* harmony import */ var _components_admin_inventories_inventory_list_inventory_list_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../components/admin/inventories/inventory-list/inventory-list.component */ "./src/app/components/admin/inventories/inventory-list/inventory-list.component.ts");
/* harmony import */ var _components_admin_inventories_inventory_details_inventory_details_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../components/admin/inventories/inventory-details/inventory-details.component */ "./src/app/components/admin/inventories/inventory-details/inventory-details.component.ts");
/* harmony import */ var _components_admin_orders_order_details_order_details_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../components/admin/orders/order-details/order-details.component */ "./src/app/components/admin/orders/order-details/order-details.component.ts");
/* harmony import */ var _components_admin_tables_table_list_table_list_component__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../components/admin/tables/table-list/table-list.component */ "./src/app/components/admin/tables/table-list/table-list.component.ts");
/* harmony import */ var _components_admin_food_items_food_item_details_food_item_details_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ../components/admin/food-items/food-item-details/food-item-details.component */ "./src/app/components/admin/food-items/food-item-details/food-item-details.component.ts");
/* harmony import */ var _components_admin_food_items_food_item_list_food_item_list_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ../components/admin/food-items/food-item-list/food-item-list.component */ "./src/app/components/admin/food-items/food-item-list/food-item-list.component.ts");
/* harmony import */ var _components_admin_food_items_edit_food_item_edit_food_item_component__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ../components/admin/food-items/edit-food-item/edit-food-item.component */ "./src/app/components/admin/food-items/edit-food-item/edit-food-item.component.ts");
/* harmony import */ var _components_admin_food_items_add_new_food_item_add_new_food_item_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ../components/admin/food-items/add-new-food-item/add-new-food-item.component */ "./src/app/components/admin/food-items/add-new-food-item/add-new-food-item.component.ts");
/* harmony import */ var _components_admin_inventories_edit_inventory_item_edit_inventory_item_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ../components/admin/inventories/edit-inventory-item/edit-inventory-item.component */ "./src/app/components/admin/inventories/edit-inventory-item/edit-inventory-item.component.ts");
/* harmony import */ var _components_admin_inventories_add_new_inventory_item_add_new_inventory_item_component__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ../components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component */ "./src/app/components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component.ts");
/* harmony import */ var _components_admin_tables_table_details_table_details_component__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ../components/admin/tables/table-details/table-details.component */ "./src/app/components/admin/tables/table-details/table-details.component.ts");
/* harmony import */ var _components_admin_inventories_update_inventory_item_update_inventory_item_component__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ../components/admin/inventories/update-inventory-item/update-inventory-item.component */ "./src/app/components/admin/inventories/update-inventory-item/update-inventory-item.component.ts");







































var appRoutes = [
    {
        path: 'pos',
        component: _components_point_of_sale_point_of_sale_component__WEBPACK_IMPORTED_MODULE_9__["PointOfSaleComponent"],
        canActivate: [_auth_auth_guard__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]],
        resolve: {
            inventories: _route_resolvers_inventory_resolver_service__WEBPACK_IMPORTED_MODULE_5__["InventoryResolverService"],
            tables: _route_resolvers_table_resolver_service__WEBPACK_IMPORTED_MODULE_6__["TableResolverService"],
            foodItems: _route_resolvers_food_item_resolver_service__WEBPACK_IMPORTED_MODULE_7__["FoodItemResolverService"]
        },
        children: [
            {
                path: '',
                redirectTo: 'session',
                pathMatch: 'full'
            },
            {
                path: 'session',
                component: _components_point_of_sale_session_session_component__WEBPACK_IMPORTED_MODULE_22__["SessionComponent"],
            },
            {
                path: 'select-table',
                component: _components_point_of_sale_select_table_select_table_component__WEBPACK_IMPORTED_MODULE_23__["SelectTableComponent"]
            },
            {
                path: 'menu',
                component: _components_point_of_sale_menu_menu_component__WEBPACK_IMPORTED_MODULE_10__["MenuComponent"]
            },
            {
                path: 'payment',
                component: _components_point_of_sale_payment_payment_component__WEBPACK_IMPORTED_MODULE_4__["PaymentComponent"]
            },
        ]
    },
    {
        path: 'admin',
        component: _components_admin_admin_component__WEBPACK_IMPORTED_MODULE_13__["AdminComponent"],
        canActivate: [_auth_auth_guard__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]],
        data: {
            roles: ['Admin']
        },
        children: [
            {
                path: '',
                redirectTo: 'inventories',
                pathMatch: 'full'
            },
            {
                path: 'food-items',
                component: _components_admin_food_items_food_items_component__WEBPACK_IMPORTED_MODULE_24__["FoodItemsComponent"],
                children: [
                    {
                        path: '',
                        redirectTo: 'food-item-list',
                        pathMatch: 'full'
                    },
                    {
                        path: 'food-item-list',
                        component: _components_admin_food_items_food_item_list_food_item_list_component__WEBPACK_IMPORTED_MODULE_32__["FoodItemListComponent"],
                        resolve: {
                            foodItems: _route_resolvers_food_item_resolver_service__WEBPACK_IMPORTED_MODULE_7__["FoodItemResolverService"]
                        }
                    },
                    {
                        path: 'add-new-food-item',
                        component: _components_admin_food_items_add_new_food_item_add_new_food_item_component__WEBPACK_IMPORTED_MODULE_34__["AddNewFoodItemComponent"],
                        resolve: {
                            foodItems: _route_resolvers_food_item_resolver_service__WEBPACK_IMPORTED_MODULE_7__["FoodItemResolverService"],
                            inventories: _route_resolvers_inventory_resolver_service__WEBPACK_IMPORTED_MODULE_5__["InventoryResolverService"]
                        }
                    },
                    {
                        path: ':foodItemId',
                        component: _components_admin_food_items_food_item_details_food_item_details_component__WEBPACK_IMPORTED_MODULE_31__["FoodItemDetailsComponent"],
                        resolve: {
                            foodItems: _route_resolvers_food_item_resolver_service__WEBPACK_IMPORTED_MODULE_7__["FoodItemResolverService"],
                            inventories: _route_resolvers_inventory_resolver_service__WEBPACK_IMPORTED_MODULE_5__["InventoryResolverService"]
                        }
                    },
                    {
                        path: ':foodItemId/edit-food-item',
                        component: _components_admin_food_items_edit_food_item_edit_food_item_component__WEBPACK_IMPORTED_MODULE_33__["EditFoodItemComponent"],
                        resolve: {
                            foodItems: _route_resolvers_food_item_resolver_service__WEBPACK_IMPORTED_MODULE_7__["FoodItemResolverService"],
                            inventories: _route_resolvers_inventory_resolver_service__WEBPACK_IMPORTED_MODULE_5__["InventoryResolverService"]
                        }
                    }
                ]
            },
            {
                path: 'inventories',
                component: _components_admin_inventories_inventories_component__WEBPACK_IMPORTED_MODULE_26__["InventoriesComponent"],
                children: [
                    {
                        path: '',
                        redirectTo: 'inventory-list',
                        pathMatch: 'full'
                    },
                    {
                        path: 'inventory-list',
                        component: _components_admin_inventories_inventory_list_inventory_list_component__WEBPACK_IMPORTED_MODULE_27__["InventoryListComponent"],
                        resolve: {
                            inventories: _route_resolvers_inventory_resolver_service__WEBPACK_IMPORTED_MODULE_5__["InventoryResolverService"]
                        }
                    },
                    {
                        path: 'add-new-inventory-item',
                        component: _components_admin_inventories_add_new_inventory_item_add_new_inventory_item_component__WEBPACK_IMPORTED_MODULE_36__["AddNewInventoryItemComponent"]
                    },
                    {
                        path: ':inventoryId',
                        component: _components_admin_inventories_inventory_details_inventory_details_component__WEBPACK_IMPORTED_MODULE_28__["InventoryDetailsComponent"],
                        resolve: {
                            inventories: _route_resolvers_inventory_resolver_service__WEBPACK_IMPORTED_MODULE_5__["InventoryResolverService"]
                        }
                    },
                    {
                        path: ':inventoryId/edit-inventory-item',
                        component: _components_admin_inventories_edit_inventory_item_edit_inventory_item_component__WEBPACK_IMPORTED_MODULE_35__["EditInventoryItemComponent"],
                        resolve: {
                            inventories: _route_resolvers_inventory_resolver_service__WEBPACK_IMPORTED_MODULE_5__["InventoryResolverService"]
                        }
                    },
                    {
                        path: ':inventoryId/update-inventory-item',
                        component: _components_admin_inventories_update_inventory_item_update_inventory_item_component__WEBPACK_IMPORTED_MODULE_38__["UpdateInventoryItemComponent"],
                        resolve: {
                            inventories: _route_resolvers_inventory_resolver_service__WEBPACK_IMPORTED_MODULE_5__["InventoryResolverService"]
                        }
                    }
                ]
            },
            {
                path: 'orders',
                component: _components_admin_orders_orders_component__WEBPACK_IMPORTED_MODULE_15__["OrdersComponent"],
                children: [
                    {
                        path: '',
                        redirectTo: 'order-list',
                        pathMatch: 'full'
                    },
                    {
                        path: 'order-list',
                        component: _components_admin_orders_order_list_order_list_component__WEBPACK_IMPORTED_MODULE_25__["OrderListComponent"],
                        resolve: {
                            orders: _route_resolvers_order_resolver_service__WEBPACK_IMPORTED_MODULE_17__["OrderResolverService"]
                        }
                    },
                    {
                        path: ':id',
                        component: _components_admin_orders_order_details_order_details_component__WEBPACK_IMPORTED_MODULE_29__["OrderDetailsComponent"],
                        resolve: {
                            orders: _route_resolvers_order_resolver_service__WEBPACK_IMPORTED_MODULE_17__["OrderResolverService"]
                        }
                    }
                ]
            },
            {
                path: 'tables',
                component: _components_admin_tables_tables_component__WEBPACK_IMPORTED_MODULE_18__["TablesComponent"],
                children: [
                    {
                        path: '',
                        redirectTo: 'table-list',
                        pathMatch: 'full'
                    },
                    {
                        path: 'table-list',
                        component: _components_admin_tables_table_list_table_list_component__WEBPACK_IMPORTED_MODULE_30__["TableListComponent"],
                        resolve: {
                            tables: _route_resolvers_table_resolver_service__WEBPACK_IMPORTED_MODULE_6__["TableResolverService"]
                        }
                    },
                    {
                        path: 'add-new-table',
                        component: _components_admin_tables_add_new_table_add_new_table_component__WEBPACK_IMPORTED_MODULE_19__["AddNewTableComponent"]
                    },
                    {
                        path: ':tableId',
                        component: _components_admin_tables_table_details_table_details_component__WEBPACK_IMPORTED_MODULE_37__["TableDetailsComponent"],
                        resolve: {
                            tables: _route_resolvers_table_resolver_service__WEBPACK_IMPORTED_MODULE_6__["TableResolverService"]
                        }
                    },
                    {
                        path: ':tableId/edit-table',
                        component: _components_admin_tables_edit_table_edit_table_component__WEBPACK_IMPORTED_MODULE_20__["EditTableComponent"],
                        resolve: {
                            tables: _route_resolvers_table_resolver_service__WEBPACK_IMPORTED_MODULE_6__["TableResolverService"]
                        }
                    }
                ]
            },
            {
                path: 'users',
                component: _components_admin_users_users_component__WEBPACK_IMPORTED_MODULE_16__["UsersComponent"],
            }
        ]
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: _components_login_login_component__WEBPACK_IMPORTED_MODULE_11__["LoginComponent"]
    },
    {
        path: 'forbidden',
        component: _components_forbidden_forbidden_component__WEBPACK_IMPORTED_MODULE_8__["ForbiddenComponent"],
        canActivate: [_auth_auth_guard__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]]
    },
    {
        path: 'reset-password',
        component: _components_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_12__["ResetPasswordComponent"]
    },
    {
        path: 'new-password',
        component: _components_new_password_new_password_component__WEBPACK_IMPORTED_MODULE_14__["NewPasswordComponent"]
    },
    {
        path: 'not-found',
        component: _components_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_21__["PageNotFoundComponent"],
        canActivate: [_auth_auth_guard__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]]
    },
    {
        path: '**',
        redirectTo: '/not-found'
    }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(appRoutes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/modules/app-ui.module.ts":
/*!******************************************!*\
  !*** ./src/app/modules/app-ui.module.ts ***!
  \******************************************/
/*! exports provided: AppUiModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppUiModule", function() { return AppUiModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/table */ "./node_modules/@angular/material/esm5/table.es5.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/esm5/form-field.es5.js");
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/paginator */ "./node_modules/@angular/material/esm5/paginator.es5.js");
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/sort */ "./node_modules/@angular/material/esm5/sort.es5.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var ngx_pagination__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-pagination */ "./node_modules/ngx-pagination/dist/ngx-pagination.js");









var AppUiModule = /** @class */ (function () {
    function AppUiModule() {
    }
    AppUiModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_material_table__WEBPACK_IMPORTED_MODULE_3__["MatTableModule"],
                _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__["MatFormFieldModule"],
                _angular_material_paginator__WEBPACK_IMPORTED_MODULE_5__["MatPaginatorModule"],
                _angular_material_sort__WEBPACK_IMPORTED_MODULE_6__["MatSortModule"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_7__["MatInputModule"],
                ngx_pagination__WEBPACK_IMPORTED_MODULE_8__["NgxPaginationModule"]
            ],
            exports: [
                _angular_material_table__WEBPACK_IMPORTED_MODULE_3__["MatTableModule"],
                _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__["MatFormFieldModule"],
                _angular_material_paginator__WEBPACK_IMPORTED_MODULE_5__["MatPaginatorModule"],
                _angular_material_sort__WEBPACK_IMPORTED_MODULE_6__["MatSortModule"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_7__["MatInputModule"],
                ngx_pagination__WEBPACK_IMPORTED_MODULE_8__["NgxPaginationModule"]
            ]
        })
    ], AppUiModule);
    return AppUiModule;
}());



/***/ }),

/***/ "./src/app/pipes/filter.pipe.ts":
/*!**************************************!*\
  !*** ./src/app/pipes/filter.pipe.ts ***!
  \**************************************/
/*! exports provided: FilterPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FilterPipe", function() { return FilterPipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var FilterPipe = /** @class */ (function () {
    function FilterPipe() {
    }
    FilterPipe.prototype.transform = function (foodItems, term) {
        if (term === undefined) {
            return foodItems;
        }
        return foodItems.filter(function (foodItem) {
            return foodItem.Name.toLowerCase()
                .includes(term.toLowerCase());
        });
    };
    FilterPipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({
            name: 'filter'
        })
    ], FilterPipe);
    return FilterPipe;
}());



/***/ }),

/***/ "./src/app/pipes/order.pipe.ts":
/*!*************************************!*\
  !*** ./src/app/pipes/order.pipe.ts ***!
  \*************************************/
/*! exports provided: OrderPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrderPipe", function() { return OrderPipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var OrderPipe = /** @class */ (function () {
    function OrderPipe() {
    }
    OrderPipe.prototype.transform = function (orderLists, term) {
        if (term === undefined) {
            return orderLists;
        }
        return orderLists.filter(function (orderList) {
            return orderList.Id.toLowerCase()
                .includes(term.toLowerCase());
        });
    };
    OrderPipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({
            name: 'order'
        })
    ], OrderPipe);
    return OrderPipe;
}());



/***/ }),

/***/ "./src/app/pipes/user-filter.pipe.ts":
/*!*******************************************!*\
  !*** ./src/app/pipes/user-filter.pipe.ts ***!
  \*******************************************/
/*! exports provided: UserFilterPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserFilterPipe", function() { return UserFilterPipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var UserFilterPipe = /** @class */ (function () {
    function UserFilterPipe() {
    }
    UserFilterPipe.prototype.transform = function (users, term) {
        if (term === undefined) {
            return users;
        }
        return users.filter(function (user) {
            return user.UserName.toLowerCase()
                .includes(term.toLowerCase());
        });
    };
    UserFilterPipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({
            name: 'userFilter'
        })
    ], UserFilterPipe);
    return UserFilterPipe;
}());



/***/ }),

/***/ "./src/app/route-resolvers/food-item-resolver.service.ts":
/*!***************************************************************!*\
  !*** ./src/app/route-resolvers/food-item-resolver.service.ts ***!
  \***************************************************************/
/*! exports provided: FoodItemResolverService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FoodItemResolverService", function() { return FoodItemResolverService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_data_storage_food_item_data_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/data-storage/food-item-data-storage.service */ "./src/app/services/data-storage/food-item-data-storage.service.ts");



var FoodItemResolverService = /** @class */ (function () {
    function FoodItemResolverService(foodItemDataStorageService) {
        this.foodItemDataStorageService = foodItemDataStorageService;
    }
    FoodItemResolverService.prototype.resolve = function (route, state) {
        return this.foodItemDataStorageService.getAllFoodItem();
    };
    FoodItemResolverService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_data_storage_food_item_data_storage_service__WEBPACK_IMPORTED_MODULE_2__["FoodItemDataStorageService"]])
    ], FoodItemResolverService);
    return FoodItemResolverService;
}());



/***/ }),

/***/ "./src/app/route-resolvers/inventory-resolver.service.ts":
/*!***************************************************************!*\
  !*** ./src/app/route-resolvers/inventory-resolver.service.ts ***!
  \***************************************************************/
/*! exports provided: InventoryResolverService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryResolverService", function() { return InventoryResolverService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_data_storage_inventory_data_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/data-storage/inventory-data-storage.service */ "./src/app/services/data-storage/inventory-data-storage.service.ts");



var InventoryResolverService = /** @class */ (function () {
    function InventoryResolverService(inventoryDataStorageService) {
        this.inventoryDataStorageService = inventoryDataStorageService;
    }
    InventoryResolverService.prototype.resolve = function (route, state) {
        return this.inventoryDataStorageService.getAllInventoryItem();
    };
    InventoryResolverService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_data_storage_inventory_data_storage_service__WEBPACK_IMPORTED_MODULE_2__["InventoryDataStorageService"]])
    ], InventoryResolverService);
    return InventoryResolverService;
}());



/***/ }),

/***/ "./src/app/route-resolvers/modified-user-resolver.service.ts":
/*!*******************************************************************!*\
  !*** ./src/app/route-resolvers/modified-user-resolver.service.ts ***!
  \*******************************************************************/
/*! exports provided: ModifiedUserResolverService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModifiedUserResolverService", function() { return ModifiedUserResolverService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _services_shared_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/shared/auth.service */ "./src/app/services/shared/auth.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");



var ModifiedUserResolverService = /** @class */ (function () {
    function ModifiedUserResolverService(userService) {
        this.userService = userService;
    }
    ModifiedUserResolverService.prototype.resolve = function (route, state) {
        return this.userService.getUsers();
    };
    ModifiedUserResolverService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_shared_auth_service__WEBPACK_IMPORTED_MODULE_1__["AuthService"]])
    ], ModifiedUserResolverService);
    return ModifiedUserResolverService;
}());



/***/ }),

/***/ "./src/app/route-resolvers/order-resolver.service.ts":
/*!***********************************************************!*\
  !*** ./src/app/route-resolvers/order-resolver.service.ts ***!
  \***********************************************************/
/*! exports provided: OrderResolverService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrderResolverService", function() { return OrderResolverService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_data_storage_order_data_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/data-storage/order-data-storage.service */ "./src/app/services/data-storage/order-data-storage.service.ts");



var OrderResolverService = /** @class */ (function () {
    function OrderResolverService(orderDataStorageService) {
        this.orderDataStorageService = orderDataStorageService;
    }
    OrderResolverService.prototype.resolve = function (route, state) {
        return this.orderDataStorageService.getAllOrder();
    };
    OrderResolverService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_data_storage_order_data_storage_service__WEBPACK_IMPORTED_MODULE_2__["OrderDataStorageService"]])
    ], OrderResolverService);
    return OrderResolverService;
}());



/***/ }),

/***/ "./src/app/route-resolvers/role-resolver.ts":
/*!**************************************************!*\
  !*** ./src/app/route-resolvers/role-resolver.ts ***!
  \**************************************************/
/*! exports provided: RoleResolverService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoleResolverService", function() { return RoleResolverService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _services_shared_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/shared/auth.service */ "./src/app/services/shared/auth.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");



var RoleResolverService = /** @class */ (function () {
    function RoleResolverService(userService) {
        this.userService = userService;
    }
    RoleResolverService.prototype.resolve = function (route, state) {
        return this.userService.getAllRoles();
    };
    RoleResolverService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_shared_auth_service__WEBPACK_IMPORTED_MODULE_1__["AuthService"]])
    ], RoleResolverService);
    return RoleResolverService;
}());



/***/ }),

/***/ "./src/app/route-resolvers/table-resolver.service.ts":
/*!***********************************************************!*\
  !*** ./src/app/route-resolvers/table-resolver.service.ts ***!
  \***********************************************************/
/*! exports provided: TableResolverService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableResolverService", function() { return TableResolverService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/data-storage/table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");



var TableResolverService = /** @class */ (function () {
    function TableResolverService(tableDataStorageService) {
        this.tableDataStorageService = tableDataStorageService;
    }
    TableResolverService.prototype.resolve = function (route, state) {
        return this.tableDataStorageService.getAllTable();
    };
    TableResolverService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_2__["TableDataStorageService"]])
    ], TableResolverService);
    return TableResolverService;
}());



/***/ }),

/***/ "./src/app/services/data-storage/account-data-storage.service.ts":
/*!***********************************************************************!*\
  !*** ./src/app/services/data-storage/account-data-storage.service.ts ***!
  \***********************************************************************/
/*! exports provided: AccountDataStorageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountDataStorageService", function() { return AccountDataStorageService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");




var AccountDataStorageService = /** @class */ (function () {
    function AccountDataStorageService(http, tableDataStorageService) {
        this.http = http;
        this.tableDataStorageService = tableDataStorageService;
        this.rootUrl = '';
        this.rootUrl = tableDataStorageService.rootUrl;
    }
    AccountDataStorageService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"],
            _table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__["TableDataStorageService"]])
    ], AccountDataStorageService);
    return AccountDataStorageService;
}());



/***/ }),

/***/ "./src/app/services/data-storage/food-item-data-storage.service.ts":
/*!*************************************************************************!*\
  !*** ./src/app/services/data-storage/food-item-data-storage.service.ts ***!
  \*************************************************************************/
/*! exports provided: FoodItemDataStorageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FoodItemDataStorageService", function() { return FoodItemDataStorageService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _table_data_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");




var FoodItemDataStorageService = /** @class */ (function () {
    function FoodItemDataStorageService(http, tableDataStorageService) {
        this.http = http;
        this.tableDataStorageService = tableDataStorageService;
        this.rootUrl = '';
        this.rootUrl = tableDataStorageService.rootUrl;
    }
    FoodItemDataStorageService.prototype.getAllFoodItem = function () {
        return this.http.get(this.rootUrl + '/api/GetAllFoodItem');
    };
    FoodItemDataStorageService.prototype.addNewFoodItem = function (foodItem) {
        return this.http.post(this.rootUrl + '/api/AddNewFoodItem', foodItem);
    };
    FoodItemDataStorageService.prototype.editFoodItem = function (foodItem) {
        return this.http.put(this.rootUrl + '/api/EditFoodItem', foodItem);
    };
    FoodItemDataStorageService.prototype.deleteFoodItem = function (foodItemId) {
        return this.http.delete(this.rootUrl + '/api/DeleteFoodItem' + "/" + foodItemId);
    };
    FoodItemDataStorageService.prototype.uploadFoodItemImage = function (foodItemId, fileToUpload) {
        if (fileToUpload.name !== null || fileToUpload.name !== '') {
            var formData = new FormData();
            formData.append('FoodItemImage', fileToUpload);
            formData.append('FoodItemId', foodItemId);
            return this.http.post(this.rootUrl + '/api/UploadFoodItemImage', formData);
        }
    };
    FoodItemDataStorageService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"],
            _table_data_storage_service__WEBPACK_IMPORTED_MODULE_2__["TableDataStorageService"]])
    ], FoodItemDataStorageService);
    return FoodItemDataStorageService;
}());



/***/ }),

/***/ "./src/app/services/data-storage/inventory-data-storage.service.ts":
/*!*************************************************************************!*\
  !*** ./src/app/services/data-storage/inventory-data-storage.service.ts ***!
  \*************************************************************************/
/*! exports provided: InventoryDataStorageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InventoryDataStorageService", function() { return InventoryDataStorageService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");




var InventoryDataStorageService = /** @class */ (function () {
    function InventoryDataStorageService(http, tableDataStorageService) {
        this.http = http;
        this.tableDataStorageService = tableDataStorageService;
        this.rootUrl = '';
        this.rootUrl = tableDataStorageService.rootUrl;
    }
    InventoryDataStorageService.prototype.getAllInventoryItem = function () {
        return this.http.get(this.rootUrl + '/api/GetAllInventoryItem');
    };
    InventoryDataStorageService.prototype.addNewInventoryItem = function (inventory) {
        return this.http.post(this.rootUrl + '/api/AddNewInventoryItem', inventory);
    };
    InventoryDataStorageService.prototype.editInventoryItem = function (inventory) {
        return this.http.put(this.rootUrl + '/api/EditInventoryItem', inventory);
    };
    InventoryDataStorageService.prototype.updateInventoryHistory = function (updateHistory) {
        return this.http.post(this.rootUrl + '/api/UpdateInventoryHistory', updateHistory);
    };
    InventoryDataStorageService.prototype.deleteInventoryItem = function (inventoryId) {
        return this.http.delete(this.rootUrl + '/api/DeleteInventoryItem' + "/" + inventoryId);
    };
    InventoryDataStorageService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"],
            _table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__["TableDataStorageService"]])
    ], InventoryDataStorageService);
    return InventoryDataStorageService;
}());



/***/ }),

/***/ "./src/app/services/data-storage/order-data-storage.service.ts":
/*!*********************************************************************!*\
  !*** ./src/app/services/data-storage/order-data-storage.service.ts ***!
  \*********************************************************************/
/*! exports provided: OrderDataStorageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrderDataStorageService", function() { return OrderDataStorageService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");




var OrderDataStorageService = /** @class */ (function () {
    function OrderDataStorageService(http, tableDataStorageService) {
        this.http = http;
        this.tableDataStorageService = tableDataStorageService;
        this.rootUrl = '';
        this.rootUrl = tableDataStorageService.rootUrl;
    }
    OrderDataStorageService.prototype.getAllOrder = function () {
        return this.http.get(this.rootUrl + '/api/GetAllOrder');
    };
    OrderDataStorageService.prototype.addNewOrder = function (order) {
        return this.http.post(this.rootUrl + '/api/AddNewOrder', order);
    };
    OrderDataStorageService.prototype.deleteOrder = function (orderId) {
        return this.http.delete(this.rootUrl + '/api/DeleteOrder' + "/" + orderId);
    };
    OrderDataStorageService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"],
            _table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__["TableDataStorageService"]])
    ], OrderDataStorageService);
    return OrderDataStorageService;
}());



/***/ }),

/***/ "./src/app/services/data-storage/table-data-storage.service.ts":
/*!*********************************************************************!*\
  !*** ./src/app/services/data-storage/table-data-storage.service.ts ***!
  \*********************************************************************/
/*! exports provided: TableDataStorageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableDataStorageService", function() { return TableDataStorageService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var TableDataStorageService = /** @class */ (function () {
    // rootUrl = 'https://hodoo-backend.azurewebsites.net';
    function TableDataStorageService(http) {
        this.http = http;
        this.backEndPort = '1548';
        this.rootUrl = 'http://localhost:' + this.backEndPort;
    }
    TableDataStorageService.prototype.getAllTable = function () {
        return this.http.get(this.rootUrl + '/api/GetAllTable');
    };
    TableDataStorageService.prototype.addNewTable = function (table) {
        return this.http.post(this.rootUrl + '/api/AddNewTable', table);
    };
    TableDataStorageService.prototype.editTable = function (table) {
        return this.http.put(this.rootUrl + '/api/EditTable', table);
    };
    TableDataStorageService.prototype.deleteTable = function (tableId) {
        return this.http.delete(this.rootUrl + '/api/DeleteTable' + "/" + tableId);
    };
    TableDataStorageService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], TableDataStorageService);
    return TableDataStorageService;
}());



/***/ }),

/***/ "./src/app/services/shared/admin.service.ts":
/*!**************************************************!*\
  !*** ./src/app/services/shared/admin.service.ts ***!
  \**************************************************/
/*! exports provided: AdminService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminService", function() { return AdminService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var AdminService = /** @class */ (function () {
    function AdminService() {
        this.inventories = [];
        this.foodItems = [];
        this.orders = [];
        this.tables = [];
    }
    AdminService.prototype.getAllInventoryItem = function () {
        return this.inventories.slice();
    };
    AdminService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], AdminService);
    return AdminService;
}());



/***/ }),

/***/ "./src/app/services/shared/auth.service.ts":
/*!*************************************************!*\
  !*** ./src/app/services/shared/auth.service.ts ***!
  \*************************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../data-storage/table-data-storage.service */ "./src/app/services/data-storage/table-data-storage.service.ts");




var AuthService = /** @class */ (function () {
    function AuthService(http, dataStorageService) {
        this.http = http;
        this.dataStorageService = dataStorageService;
        this.rootUrl = '';
        this.rootUrl = this.dataStorageService.rootUrl;
    }
    AuthService.prototype.registerUser = function (name, password, email, role, dateTime) {
        var body = {
            UserName: name,
            Password: password,
            Email: email,
            Role: role,
            DateTime: dateTime
        };
        var reqHeader = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({ 'No-Auth': 'True' });
        return this.http.post(this.rootUrl + '/api/User/Register', body);
    };
    AuthService.prototype.userAuthentication = function (userName, password) {
        var data = 'username=' + userName + '&password=' + password + '&grant_type=password';
        var reqHeader = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({ 'Content-Type': 'application/x-www-urlencoded',
            'No-Auth': 'True' });
        return this.http.post(this.rootUrl + '/token', data, { headers: reqHeader });
    };
    AuthService.prototype.getAllRoles = function () {
        return this.http.get('/assets/role.json');
    };
    AuthService.prototype.resetPassword = function (userName) {
        var body = {
            UserName: userName,
            Id: '',
            NewPassword: ''
        };
        var reqHeader = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({ 'No-Auth': 'True' });
        return this.http.post(this.rootUrl + '/api/ResetPassword', body, { headers: reqHeader });
    };
    AuthService.prototype.newPassword = function (password, code) {
        var body = {
            UserName: '',
            Id: code,
            NewPassword: password
        };
        var reqHeader = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({ 'No-Auth': 'True' });
        return this.http.post(this.rootUrl + '/api/NewPassword', body, { headers: reqHeader });
    };
    AuthService.prototype.roleMatch = function (allowedRoles) {
        var isMatch = false;
        var userRole = JSON.parse(JSON.stringify(localStorage.getItem('userRoles')));
        allowedRoles.forEach(function (element) {
            if (userRole.indexOf(element) > -1) {
                isMatch = true;
                return false;
            }
        });
        return isMatch;
    };
    AuthService.prototype.deleteUser = function (user) {
        return this.http.post(this.rootUrl + '/api/DeleteUser', user);
    };
    AuthService.prototype.getUsers = function () {
        return this.http.get(this.rootUrl + '/api/GetUsersList');
    };
    AuthService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"],
            _data_storage_table_data_storage_service__WEBPACK_IMPORTED_MODULE_3__["TableDataStorageService"]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/services/shared/point-of-sale.service.ts":
/*!**********************************************************!*\
  !*** ./src/app/services/shared/point-of-sale.service.ts ***!
  \**********************************************************/
/*! exports provided: PointOfSaleService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PointOfSaleService", function() { return PointOfSaleService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var angular2_uuid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! angular2-uuid */ "./node_modules/angular2-uuid/index.js");
/* harmony import */ var angular2_uuid__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(angular2_uuid__WEBPACK_IMPORTED_MODULE_3__);




var PointOfSaleService = /** @class */ (function () {
    function PointOfSaleService() {
        this.uuidCodeOne = '';
        this.totalPrice = 0;
        this.totalQuantity = 0;
        this.orderedItems = [];
        this.orderedItemsChanged = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.orderChanged = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.orders = [];
        this.ordersChanged = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.foodItemSubTotal = 0;
        this.foodItems = [];
        this.foodItemsChanged = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.inventories = [];
        this.inventoriesChanged = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.tables = [];
        this.tablesChanged = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.uuidCodeOne = angular2_uuid__WEBPACK_IMPORTED_MODULE_3__["UUID"].UUID();
    }
    PointOfSaleService.prototype.clearOrders = function () {
        this.orderedItems = [];
    };
    PointOfSaleService.prototype.removeFromFoodItemCart = function (foodItemId, quantity, subTotal) {
        for (var i = 0; i < this.orderedItems.length; i++) {
            if (this.orderedItems[i].FoodItemId === foodItemId) {
                if (this.orderedItems[i].FoodItemQuantity >= quantity) {
                    this.orderedItems[i].FoodItemQuantity =
                        this.orderedItems[i].FoodItemQuantity
                            - quantity;
                    this.orderedItems[i].TotalPrice =
                        this.orderedItems[i].TotalPrice
                            - subTotal;
                    this.totalPrice -= Number.parseInt(subTotal.toString(), 2);
                    this.totalQuantity -= Number.parseInt(quantity.toString(), 2);
                    if (this.orderedItems[i].FoodItemQuantity === 0) {
                        this.orderedItems.splice(i, 1);
                    }
                }
            }
        }
    };
    PointOfSaleService.prototype.checkIfOrderedItemExist = function (foodItemId, orderId) {
        for (var i = 0; i < this.orderedItems.length; i++) {
            if (this.orderedItems[i].FoodItemId === foodItemId
                && this.orderedItems[i].OrderId === orderId) {
                return this.orderedItems[i].Id;
            }
        }
        return null;
    };
    PointOfSaleService.prototype.getOrderedItemsList = function () {
        return this.orderedItems.slice();
    };
    PointOfSaleService.prototype.deleteOrder = function (order) {
        for (var i = 0; i < this.orders.length; i++) {
            if (this.orders[i].Id === order.Id) {
                this.orders.splice(i, 1);
            }
        }
    };
    PointOfSaleService.prototype.addToOrderedItemsList = function (orderedItems) {
        this.orderedItems.push(orderedItems);
        this.orderedItemsChanged.next(this.orderedItems.slice());
    };
    PointOfSaleService.prototype.addToOrderedList = function (order) {
        this.order = order;
        this.orderChanged.next(order);
        this.orders.push(order);
        this.ordersChanged.next(this.orders.slice());
    };
    PointOfSaleService.prototype.grandTotalPrice = function (price) {
        this.totalPrice = Number.parseInt(price.toString(), 2)
            + Number.parseInt(this.totalPrice.toString(), 2);
        return this.totalPrice;
    };
    PointOfSaleService.prototype.FoodItemSubTotalPrice = function (price, quantity) {
        this.foodItemSubTotal = price * quantity;
        return this.foodItemSubTotal;
    };
    PointOfSaleService.prototype.checkExistingFoodItem = function (foodItemId) {
        for (var i = 0; i < this.orderedItems.length; i++) {
            if (this.orderedItems[i].FoodItemId === foodItemId) {
                return true;
            }
        }
    };
    PointOfSaleService.prototype.increaseOnExistingFoodItem = function (foodItemId, quantity, subTotal) {
        for (var i = 0; i < this.orderedItems.length; i++) {
            if (this.orderedItems[i].FoodItemId === foodItemId) {
                this.orderedItems[i].FoodItemQuantity =
                    Number.parseInt(this.orderedItems[i].FoodItemQuantity.toString(), 2)
                        + Number.parseInt(quantity.toString(), 2);
                this.orderedItems[i].TotalPrice =
                    Number.parseInt(this.orderedItems[i].TotalPrice.toString(), 2)
                        + Number.parseInt(subTotal.toString(), 2);
            }
        }
    };
    PointOfSaleService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], PointOfSaleService);
    return PointOfSaleService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var zone_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! zone.js */ "./node_modules/zone.js/dist/zone.js");
/* harmony import */ var zone_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(zone_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var reflect_metadata__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! reflect-metadata */ "./node_modules/reflect-metadata/Reflect.js");
/* harmony import */ var reflect_metadata__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(reflect_metadata__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var polyfills__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! polyfills */ "./src/polyfills.ts");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_7__);








if (_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_5__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ "./src/polyfills.ts":
/*!**************************!*\
  !*** ./src/polyfills.ts ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zone.js/dist/zone */ "./node_modules/zone.js/dist/zone.js");
/* harmony import */ var zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Required to support Web Animations `@angular/platform-browser/animations`.
 * Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
 **/
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.
/***************************************************************************************************
 * Zone JS is required by Angular itself.
 */
 // Included with Angular CLI.
/***************************************************************************************************
 * APPLICATION IMPORTS
 */
/**
 * Date, currency, decimal and percent pipes.
 * Needed for: All but Chrome, Firefox, Edge, IE11 and Safari 10
 */
// import 'intl';  // Run `npm install --save intl`.
/**
 * Need to import at least one locale-data with intl.
 */
// import 'intl/locale-data/jsonp/en';


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\Web Development\Projects\RestaurantManagementApp\RestaurantManagementApp\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map