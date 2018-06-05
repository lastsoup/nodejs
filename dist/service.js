/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "c4d1562a8b52116a9b30"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 1;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(12)(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nwindow.configure = {\n    \"pages\": [\"page/hot.html\", \"page/community.html\", \"page/discover.html\", \"page/profile.html\"],\n    //全局的iscroll\n    \"scroll\": {\n        \"listScroll\": null,\n        \"hotScroll\": null,\n        \"profileScroll\": null\n    },\n    \"window\": {\n        \"Header\": false,\n        \"mode\": \"\",\n        \"tabBar\": true\n    },\n    \"tabBar\": {\n        \"height\": \"52px\",\n        \"css\": \"mybar\", //设置底部菜单普通和选中样式\n        \"default\": \"hot\",\n        \"list\": {\n            \"hot\": {\n                \"pagePath\": \"public/page/hot.html\",\n                \"Icon\": \"public/1.png\",\n                \"selectedIcon\": \"public/2.png\",\n                \"pageInit\": function pageInit() {\n                    as(\"#js-tabs2\").TabBox();\n                    var swiper = new Swiper('#slidepreview', {\n                        pagination: '.swiper-pagination',\n                        paginationClickable: true,\n                        centeredSlides: true,\n                        nested: true,\n                        autoplay: 2500,\n                        autoplayDisableOnInteraction: false\n                    });\n                    as(\"#search\").SearchBox();\n                    as('#hot_wrapper').InitIscroll(\"hotScroll\");\n                }\n            },\n            \"community\": {\n                \"pagePath\": \"public/page/community.html\",\n                \"Icon\": \"icon-tab-2\",\n                \"selectedIcon\": \"icon-tab-2-selected\",\n                \"pageInit\": function pageInit() {\n                    as(\"#js-tabs\").TabBox();\n                }\n            },\n            \"discover\": {\n                \"pagePath\": \"public/page/discover.html\",\n                \"Icon\": \"icon-tab-3\",\n                \"selectedIcon\": \"icon-tab-3-selected\",\n                \"refresh\": function refresh() {\n                    new ListScroll(\"discover\", {\n                        url: \"http://app.mis.hy-nj.com/Message/GetMessageList?rp=15&sortname=SendTime&sortorder=desc&query=syj\"\n                    });\n                },\n                \"pageInit\": function pageInit() {\n                    new ListScroll(\"discover\", {\n                        url: \"http://app.mis.hy-nj.com/Message/GetMessageList?rp=15&sortname=SendTime&sortorder=desc&query=syj\",\n                        CreateDetail: function CreateDetail(item) {\n                            var ww = as().formatThousands(12323);\n                            var li = \"a1231\";\n                            return li;\n                        }\n                    });\n                }\n            },\n            \"profile\": {\n                \"pagePath\": \"public/page/profile.html\",\n                \"Icon\": \"icon-tab-4\",\n                \"selectedIcon\": \"icon-tab-4-selected\",\n                \"pageInit\": function pageInit() {\n                    as('#profile_wrapper').InitIscroll(\"profileScroll\");\n                }\n            }\n        }\n    },\n    \"networkTimeout\": {\n        \"request\": 10000\n    }\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXBwLmpzPzA5OGMiXSwibmFtZXMiOlsid2luZG93IiwiY29uZmlndXJlIiwiYXMiLCJUYWJCb3giLCJzd2lwZXIiLCJTd2lwZXIiLCJwYWdpbmF0aW9uIiwicGFnaW5hdGlvbkNsaWNrYWJsZSIsImNlbnRlcmVkU2xpZGVzIiwibmVzdGVkIiwiYXV0b3BsYXkiLCJhdXRvcGxheURpc2FibGVPbkludGVyYWN0aW9uIiwiU2VhcmNoQm94IiwiSW5pdElzY3JvbGwiLCJMaXN0U2Nyb2xsIiwidXJsIiwiQ3JlYXRlRGV0YWlsIiwiaXRlbSIsInd3IiwiZm9ybWF0VGhvdXNhbmRzIiwibGkiXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU9DLFNBQVAsR0FBaUI7QUFDYixhQUFTLENBQ0wsZUFESyxFQUVMLHFCQUZLLEVBR0wsb0JBSEssRUFJTCxtQkFKSyxDQURJO0FBT2I7QUFDQSxjQUFTO0FBQ0wsc0JBQWMsSUFEVDtBQUVMLHFCQUFhLElBRlI7QUFHTCx5QkFBaUI7QUFIWixLQVJJO0FBYWIsY0FBUztBQUNMLGtCQUFTLEtBREo7QUFFTCxnQkFBTyxFQUZGO0FBR0wsa0JBQVM7QUFISixLQWJJO0FBa0JiLGNBQVM7QUFDTCxrQkFBUyxNQURKO0FBRUwsZUFBTSxPQUZELEVBRVM7QUFDZCxtQkFBVSxLQUhMO0FBSUwsZ0JBQVE7QUFDSixtQkFBTTtBQUNGLDRCQUFZLHNCQURWO0FBRUYsd0JBQU8sY0FGTDtBQUdGLGdDQUFlLGNBSGI7QUFJRiw0QkFBVyxvQkFBVTtBQUNqQkMsdUJBQUcsV0FBSCxFQUFnQkMsTUFBaEI7QUFDQSx3QkFBSUMsU0FBUyxJQUFJQyxNQUFKLENBQVcsZUFBWCxFQUE0QjtBQUNyQ0Msb0NBQVksb0JBRHlCO0FBRXJDQyw2Q0FBcUIsSUFGZ0I7QUFHckNDLHdDQUFnQixJQUhxQjtBQUlyQ0MsZ0NBQU8sSUFKOEI7QUFLckNDLGtDQUFVLElBTDJCO0FBTXJDQyxzREFBOEI7QUFOTyxxQkFBNUIsQ0FBYjtBQVFBVCx1QkFBRyxTQUFILEVBQWNVLFNBQWQ7QUFDQVYsdUJBQUcsY0FBSCxFQUFtQlcsV0FBbkIsQ0FBK0IsV0FBL0I7QUFDSDtBQWhCQyxhQURGO0FBbUJKLHlCQUFZO0FBQ1IsNEJBQVksNEJBREo7QUFFUix3QkFBTyxZQUZDO0FBR1IsZ0NBQWUscUJBSFA7QUFJUiw0QkFBVyxvQkFBVTtBQUNqQlgsdUJBQUcsVUFBSCxFQUFlQyxNQUFmO0FBQ0g7QUFOTyxhQW5CUjtBQTJCSix3QkFBVztBQUNQLDRCQUFZLDJCQURMO0FBRVAsd0JBQU8sWUFGQTtBQUdQLGdDQUFlLHFCQUhSO0FBSVAsMkJBQVUsbUJBQVU7QUFDaEIsd0JBQUlXLFVBQUosQ0FBZSxVQUFmLEVBQTBCO0FBQ3RCQyw2QkFBSTtBQURrQixxQkFBMUI7QUFHSCxpQkFSTTtBQVNQLDRCQUFXLG9CQUFVO0FBQ2pCLHdCQUFJRCxVQUFKLENBQWUsVUFBZixFQUEwQjtBQUN0QkMsNkJBQUksa0dBRGtCO0FBRXRCQyxzQ0FBYSxzQkFBU0MsSUFBVCxFQUNiO0FBQ0ksZ0NBQUlDLEtBQUdoQixLQUFLaUIsZUFBTCxDQUFxQixLQUFyQixDQUFQO0FBQ0EsZ0NBQUlDLEtBQUcsT0FBUDtBQUNBLG1DQUFPQSxFQUFQO0FBQ0g7QUFQcUIscUJBQTFCO0FBU0g7QUFuQk0sYUEzQlA7QUFnREosdUJBQVU7QUFDTiw0QkFBWSwwQkFETjtBQUVOLHdCQUFPLFlBRkQ7QUFHTixnQ0FBZSxxQkFIVDtBQUlOLDRCQUFXLG9CQUFVO0FBQ2pCbEIsdUJBQUcsa0JBQUgsRUFBdUJXLFdBQXZCLENBQW1DLGVBQW5DO0FBQ0g7QUFOSztBQWhETjtBQUpILEtBbEJJO0FBZ0ZiLHNCQUFrQjtBQUNkLG1CQUFXO0FBREc7QUFoRkwsQ0FBakIiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIndpbmRvdy5jb25maWd1cmU9e1xyXG4gICAgXCJwYWdlc1wiOiBbXHJcbiAgICAgICAgXCJwYWdlL2hvdC5odG1sXCIsXHJcbiAgICAgICAgXCJwYWdlL2NvbW11bml0eS5odG1sXCIsXHJcbiAgICAgICAgXCJwYWdlL2Rpc2NvdmVyLmh0bWxcIixcclxuICAgICAgICBcInBhZ2UvcHJvZmlsZS5odG1sXCJcclxuICAgIF0sXHJcbiAgICAvL+WFqOWxgOeahGlzY3JvbGxcclxuICAgIFwic2Nyb2xsXCI6e1xyXG4gICAgICAgIFwibGlzdFNjcm9sbFwiOiBudWxsLFxyXG4gICAgICAgIFwiaG90U2Nyb2xsXCI6IG51bGwsXHJcbiAgICAgICAgXCJwcm9maWxlU2Nyb2xsXCI6IG51bGxcclxuICAgIH0sXHJcbiAgICBcIndpbmRvd1wiOntcclxuICAgICAgICBcIkhlYWRlclwiOmZhbHNlLFxyXG4gICAgICAgIFwibW9kZVwiOlwiXCIsXHJcbiAgICAgICAgXCJ0YWJCYXJcIjp0cnVlXHJcbiAgICB9LFxyXG4gICAgXCJ0YWJCYXJcIjp7XHJcbiAgICAgICAgXCJoZWlnaHRcIjpcIjUycHhcIixcclxuICAgICAgICBcImNzc1wiOlwibXliYXJcIiwvL+iuvue9ruW6lemDqOiPnOWNleaZrumAmuWSjOmAieS4reagt+W8j1xyXG4gICAgICAgIFwiZGVmYXVsdFwiOlwiaG90XCIsXHJcbiAgICAgICAgXCJsaXN0XCI6IHtcclxuICAgICAgICAgICAgXCJob3RcIjp7XHJcbiAgICAgICAgICAgICAgICBcInBhZ2VQYXRoXCI6IFwicHVibGljL3BhZ2UvaG90Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIFwiSWNvblwiOlwicHVibGljLzEucG5nXCIsXHJcbiAgICAgICAgICAgICAgICBcInNlbGVjdGVkSWNvblwiOlwicHVibGljLzIucG5nXCIsXHJcbiAgICAgICAgICAgICAgICBcInBhZ2VJbml0XCI6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBhcyhcIiNqcy10YWJzMlwiKS5UYWJCb3goKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3dpcGVyID0gbmV3IFN3aXBlcignI3NsaWRlcHJldmlldycsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvbjogJy5zd2lwZXItcGFnaW5hdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25DbGlja2FibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlcmVkU2xpZGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXN0ZWQ6dHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0b3BsYXk6IDI1MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9wbGF5RGlzYWJsZU9uSW50ZXJhY3Rpb246IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXMoXCIjc2VhcmNoXCIpLlNlYXJjaEJveCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFzKCcjaG90X3dyYXBwZXInKS5Jbml0SXNjcm9sbChcImhvdFNjcm9sbFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJjb21tdW5pdHlcIjp7XHJcbiAgICAgICAgICAgICAgICBcInBhZ2VQYXRoXCI6IFwicHVibGljL3BhZ2UvY29tbXVuaXR5Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIFwiSWNvblwiOlwiaWNvbi10YWItMlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzZWxlY3RlZEljb25cIjpcImljb24tdGFiLTItc2VsZWN0ZWRcIixcclxuICAgICAgICAgICAgICAgIFwicGFnZUluaXRcIjpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIGFzKFwiI2pzLXRhYnNcIikuVGFiQm94KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiZGlzY292ZXJcIjp7XHJcbiAgICAgICAgICAgICAgICBcInBhZ2VQYXRoXCI6IFwicHVibGljL3BhZ2UvZGlzY292ZXIuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgXCJJY29uXCI6XCJpY29uLXRhYi0zXCIsXHJcbiAgICAgICAgICAgICAgICBcInNlbGVjdGVkSWNvblwiOlwiaWNvbi10YWItMy1zZWxlY3RlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJyZWZyZXNoXCI6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgTGlzdFNjcm9sbChcImRpc2NvdmVyXCIse1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6XCJodHRwOi8vYXBwLm1pcy5oeS1uai5jb20vTWVzc2FnZS9HZXRNZXNzYWdlTGlzdD9ycD0xNSZzb3J0bmFtZT1TZW5kVGltZSZzb3J0b3JkZXI9ZGVzYyZxdWVyeT1zeWpcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwicGFnZUluaXRcIjpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBMaXN0U2Nyb2xsKFwiZGlzY292ZXJcIix7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDpcImh0dHA6Ly9hcHAubWlzLmh5LW5qLmNvbS9NZXNzYWdlL0dldE1lc3NhZ2VMaXN0P3JwPTE1JnNvcnRuYW1lPVNlbmRUaW1lJnNvcnRvcmRlcj1kZXNjJnF1ZXJ5PXN5alwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVEZXRhaWw6ZnVuY3Rpb24oaXRlbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHd3PWFzKCkuZm9ybWF0VGhvdXNhbmRzKDEyMzIzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaT1cImExMjMxXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6e1xyXG4gICAgICAgICAgICAgICAgXCJwYWdlUGF0aFwiOiBcInB1YmxpYy9wYWdlL3Byb2ZpbGUuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgXCJJY29uXCI6XCJpY29uLXRhYi00XCIsXHJcbiAgICAgICAgICAgICAgICBcInNlbGVjdGVkSWNvblwiOlwiaWNvbi10YWItNC1zZWxlY3RlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJwYWdlSW5pdFwiOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYXMoJyNwcm9maWxlX3dyYXBwZXInKS5Jbml0SXNjcm9sbChcInByb2ZpbGVTY3JvbGxcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJuZXR3b3JrVGltZW91dFwiOiB7XHJcbiAgICAgICAgXCJyZXF1ZXN0XCI6IDEwMDAwXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvYXBwLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///0\n");

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/*----------------------------------------\r\n* Copyright (c) 2014 菠萝工作室\r\n* 网站：http://www.0non0.com\r\n* Date: 2014-11-28\r\n* Creater:Cqy\r\n----------------------------------------*/\n\n/*------通用的方法库 by:cqy 2015-2-28------*/\n\n(function () {\n    /*------ananas.调用方法和属性-----------*/\n    var ananas = {};\n    ananas.VAR = {};\n    ananas.CONST = {\n        domains: { host: \"\" }\n    };\n    /*---ajax封装-------\r\n    例：ananas.ajaxHandler(\"file/GetImageLists\", { type: \"TxImage\" }).done(function (data) {}).fail(function (res) { });\r\n    ---------------*/\n    ananas.ajaxHandler = function (url, param) {\n        var _host = ananas.host();\n        return $.post(_host + url + \"?time=\" + new Date().getTime(), param).then(function (data) {\n            if (data.IsSuccess) {\n                return data.BaseData;\n            } else {\n                return $.Deferred().reject(data);\n            }\n        }, function (err) {\n            // 失败回调\n            console.log(err.status); // 打印状态码\n        });\n    };\n\n    /*------as()调用方法和属性-----------*/\n    /*------使用as()调用方法，处理传递参数比较少的控件*/\n    window.as = function (q) {\n        return new _ananas(q);\n    };\n\n    //_ananas对象\n    var _ananas = function _ananas(q) {\n        /* var firstWord= q.substr(0, 1);\r\n         var nq= q.substring(1);\r\n         switch(firstWord)\r\n         {\r\n             case \"#\":\r\n             this.el = document.getElementById(nq);\r\n                 break;\r\n             case \".\":\r\n             this.el=document.getElementsByClassName(nq);\r\n                 break;\r\n             default:\r\n                 this.el = document.getElementById(q);\r\n         }*/\n        this.el = x$(q);\n    };\n\n    /*---封装start-------*/\n    _ananas.prototype.FastTap = function (onTap) {\n        for (var i = 0; i < this.el.length; i++) {\n            var element = this.el[i];\n            element.index = i;\n            Hammer(element).on(\"tap\", onTap);\n        }\n    };\n\n    _ananas.prototype.Click = function (onTap) {\n        for (var i = 0; i < this.el.length; i++) {\n            var element = this.el[i];\n            element.index = i;\n            element.addEventListener('click', onTap, false);\n        }\n    };\n\n    _ananas.prototype.SearchBox = function () {\n        for (var i = 0; i < this.el.length; i++) {\n            var element = this.el[i];\n            element.addEventListener('click', function () {\n                this.parentElement.parentElement.className = \"searchbar searchbar-active\";\n            }, false);\n            element.addEventListener('focus', function () {\n                this.parentElement.parentElement.className = \"searchbar searchbar-active\";\n            }, false);\n            element.addEventListener('blur', function () {\n                this.parentElement.parentElement.className = \"searchbar\";\n            }, false);\n        }\n    };\n\n    _ananas.prototype.TabBox = function () {\n        for (var i = 0; i < this.el.length; i++) {\n            var element = this.el[i];\n            var tabel = x$(element).find(\".swiper-tabs\");\n            var tablink = x$(element).find(\".widget-tab-link\");\n            var tabsSwiper = new Swiper(tabel, {\n                centeredSlides: true,\n                onSlideChangeStart: function onSlideChangeStart() {\n                    tablink.removeClass('active');\n                    x$(tablink[tabsSwiper.activeIndex]).addClass('active');\n                }\n            });\n            as(tablink).FastTap(function () {\n                tablink.removeClass('active');\n                x$(this).addClass('active');\n                tabsSwiper.slideTo(this.index, 0);\n            });\n        }\n    };\n\n    _ananas.prototype.InitIscroll = function (iscroll) {\n        var wrapper = this.el[0];\n        if (typeof configure.scroll[iscroll] == \"undefined\") return;\n        if (configure.scroll[iscroll] != null) {\n            configure.scroll[iscroll].destroy();\n            configure.scroll[iscroll] = new iScroll(wrapper);\n        } else {\n            configure.scroll[iscroll] = new iScroll(wrapper);\n        }\n    };\n\n    _ananas.prototype.showAlert = function (alertinfo, alertok, isSystem, title) {\n        alertinfo = alertinfo == null ? \"数据不存在\" : alertinfo.toString();\n        title = typeof title == \"undefined\" ? '提示' : title;\n        if (typeof isSystem != \"undefined\" && isSystem) {\n            if (isPhoneApp) {\n                navigator.notification.alert(alertinfo.toString(), // 显示信息\n                null, // 警告被忽视的回调函数\n                title, // 标题\n                '确定' // 按钮名称\n                );\n            } else {\n                alert(alertinfo);\n            }\n            return;\n        }\n\n        if (typeof alertok == \"undefined\") {\n            setTimeout(function () {\n                x$().closeDiv();\n            }, 1000);\n        } else {\n            setTimeout(function () {\n                x$().closeDiv();alertok();\n            }, 1000);\n        }\n        x$().showDiv(\"divAlert\", { background: \"rgba(0,0,0,0.5)\" });\n        x$(\"#divDialog\").find(\"[name=alertText]\").html(alertinfo);\n    };\n\n    //随机生成GUID\n    _ananas.prototype.guidGenerator = function () {\n        var S4 = function S4() {\n            return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);\n        };\n        return S4() + S4() + \"-\" + S4() + \"-\" + S4() + \"-\" + S4() + \"-\" + S4() + S4() + S4();\n    };\n\n    //字符串时间格式转化处理\n    _ananas.prototype.formatDateString = function (value, flag, showtime) {\n        if (typeof value == \"undefined\") return \"\";\n        value = value.replace(/-/g, '/').replace('T', ' ');\n        var index = value.lastIndexOf('.');\n        if (index > -1) {\n            value = value.substring(0, index);\n        }\n        var mydate = new Date(value);\n        if (!isNaN(mydate.getTime())) var newDate = as().formatDate(mydate, flag, showtime);\n        return newDate;\n    };\n\n    //时间格式转化处理\n    _ananas.prototype.formatDate = function (mydate, flag, showtime) {\n        var year = mydate.getFullYear();\n        var month = mydate.getMonth() + 1 < 10 ? \"0\" + (mydate.getMonth() + 1) : mydate.getMonth() + 1;\n        var day = mydate.getDate() < 10 ? \"0\" + mydate.getDate() : mydate.getDate();\n        var time = \"\";\n        if (typeof showtime != \"undefined\" && showtime == true) {\n            var hours = mydate.getHours() < 10 ? \"0\" + mydate.getHours() : mydate.getHours();\n            var minutes = mydate.getMinutes() < 10 ? \"0\" + mydate.getMinutes() : mydate.getMinutes();\n            var seconds = mydate.getSeconds() < 10 ? \"0\" + mydate.getSeconds() : mydate.getSeconds();\n            time = \"  \" + hours + \":\" + minutes + \":\" + seconds;\n        }\n        value = year + flag + month + flag + day + time;\n        return value;\n    };\n\n    //千分位处理\n    _ananas.prototype.formatThousands = function (val) {\n        val = Number(val).toFixed(2);\n        return (val + \"\").replace(/(\\d{1,3})(?=(\\d{3})+(?:$|\\D))/g, \"$1,\");\n    };\n\n    //获取文件大小\n    _ananas.prototype.GetFileSize = function (filesize) {\n        if (filesize < 1000) {\n            filesize = filesize + \"字节\";\n        } else {\n            filesize = filesize / 1024;\n            if (filesize < 1000) {\n                filesize = filesize.toFixed(0) + \"K\";\n            } else if (filesize < 1000000) {\n                filesize = (filesize / 1024).toFixed(2) + \"M\";\n            } else {\n                filesize = (filesize / 1048576).toFixed(2) + \"G\";\n            }\n        }\n        return filesize;\n    };\n\n    /*------ListScroll的实现-----------*/\n    window.ListScroll = function (id, options) {\n        this.el = x$(id);\n        this.id = id;\n        this.listName = \"listScroll\";\n        this.options = options;\n        this.url = options.url;\n        this.data = options.data;\n        this.dataextend = typeof options.dataextend == \"undefined\" ? \"\" : options.dataextend;\n        this.ajax = options.ajax;\n        this.skin = options.skin;\n        this.CreateDetail = options.CreateDetail;\n        this.pageCount = 15;\n        this._init();\n    };\n\n    _ananas.prototype.iscroll = {\n        _iscroll_RefreshTip: function _iscroll_RefreshTip(tip) {\n            this.wrapper.find(\".scroller\").css({ \"-webkit-transform\": \"translate(0px, 0px) scale(1) translateZ(0px)\" });\n            var pullDownEl = this.wrapper.find(\".pullDown\")[0];\n            pullDownEl.setAttribute(\"name\", '');\n            pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';\n            pullDownEl.childNodes[0].className = \"pullDownIcon_xia\";\n            as().showAlert(tip);\n        },\n        _iscroll_MoreTip: function _iscroll_MoreTip(tip) {\n            var pullUpEl = this.wrapper.find(\".pullUp\")[0];\n            pullUpEl.setAttribute(\"name\", '');\n            pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载';\n            pullUpEl.childNodes[0].className = \"iconfont pullUpIcon_shang\";\n            as().showAlert(tip);\n        },\n        _iscroll_jsoncallback: function _iscroll_jsoncallback(rows, total) {\n            this.container.html('');\n            //没有数据\n            if (total == 0 || rows.length == 0) {\n                x$(this.container[0].parentNode).find(\".listmask\").remove();\n                x$(this.container[0].parentNode).bottom('<div class=\"listmask\" style=\"height:' + (window.document.body.clientHeight - 47) + 'px\"> <i class=\"iconfont icon-zanwushuju1\"></i></div>');\n            } else {\n                x$(this.container[0].parentNode).find(\".listmask\").remove();\n                this.lscroll._createListData(rows);\n            }\n            configure.scroll[this.lscroll.listName].refresh();\n        },\n        _iscroll_jsoncallbackMore: function _iscroll_jsoncallbackMore(rows, total) {\n            if (total == 0 || rows.length == 0) {\n                this.container.html('');\n                x$(this.container[0].parentNode).find(\".listmask\").remove();\n                x$(this.container[0].parentNode).bottom('<div class=\"listmask\" style=\"height:' + (window.document.body.clientHeight - 47) + 'px\"> <i class=\"iconfont icon-zanwushuju1\"></i></div>');\n            } else {\n                x$(this.container[0].parentNode).find(\".listmask\").remove();\n                //加载数据\n                var childcount = this.container.find(\"li\").length;\n                var lastcount = childcount % this.lscroll.pageCount;\n                if (childcount > 0 && lastcount == rows.length) {\n                    as().showAlert(\"已经是最后一页\");\n                }\n                this.lscroll._createListData(rows);\n            }\n            configure.scroll[this.lscroll.listName].refresh();\n        },\n        _getPage: function _getPage() {\n            var pageCount = this.lscroll.pageCount;\n            var count = this.container.find(\"li\").length;\n            var page = Math.floor(count / pageCount);\n            return page;\n        },\n        _iscroll_pullDownAction: function _iscroll_pullDownAction(myScroll) {\n            //刷新数据\n            var owner = this;\n            configure.scroll[owner.lscroll.listName] = myScroll;\n            var url = owner.lscroll.url;\n            if (owner.lscroll.ajax) {\n                $.ajax({\n                    type: \"post\",\n                    async: false,\n                    url: url,\n                    data: owner.lscroll.data,\n                    success: function success(data) {\n                        if (data.success) {\n                            owner._iscroll_jsoncallback(data.obj.rows, data.obj.total);\n                        } else {\n                            as().showAlert(data.msg);\n                        }\n                    },\n                    timeout: function timeout() {\n                        owner._iscroll_RefreshTip(\"连接超时，请重试！\");\n                    },\n                    error: function error() {\n                        owner._iscroll_RefreshTip(\"连接无法获取,请检查网络后重试！\");\n                    }\n                });\n            } else {\n                //加载数据\n                x$().xhrjsonp(url + \"&page=1\", { callback: function callback(data) {\n                        data.State = 0;\n                        if (data.State != 0) {\n                            as().showAlert(data.Message);\n                            return;\n                        }\n                        owner._iscroll_jsoncallback(data.BizObject.rows, data.BizObject.total);\n                    }, timeout: function timeout() {\n                        owner._iscroll_RefreshTip(\"连接超时，请重试！\");\n                    }, error: function error() {\n                        owner._iscroll_RefreshTip(\"连接无法获取,请检查网络后重试！\");\n                    }\n                });\n            }\n        },\n        _iscroll_pullUpAction: function _iscroll_pullUpAction(myScroll, wrapper, container) {\n            //加载更多\n            var owner = this;\n            configure.scroll[owner.lscroll.listName] = myScroll;\n            var url = owner.lscroll.url;\n            //加载数据\n            {\n                //地址处理\n                var pageCount = owner.lscroll.pageCount;\n                var count = owner.container.find(\"li\").length;\n                var page = Math.floor(count / pageCount) + 1;\n            }\n            if (owner.lscroll.ajax) {\n                $.ajax({\n                    type: \"post\",\n                    async: false,\n                    url: url,\n                    data: { \"PageRequestData\": '{\"Token\":\"123456789\",' + owner.lscroll.dataextend + 'Page:\"' + (owner._getPage() + 1) + '\",Rows:\"15\",IsValid:\"1\",Obj:\"\"}' },\n                    success: function success(data) {\n                        if (data.success) owner._iscroll_jsoncallbackMore(data.obj.rows, data.obj.total);else as().showAlert(data.msg);\n                    },\n                    timeout: function timeout() {\n                        owner._iscroll_RefreshTip(\"连接超时，请重试！\");\n                    },\n                    error: function error() {\n                        owner._iscroll_RefreshTip(\"连接无法获取,请检查网络后重试！\");\n                    }\n                });\n            } else {\n                url = url + \"&page=\" + owner._getPage() + 1;\n                x$().xhrjsonp(url, { callback: function callback(data) {\n                        if (data.State != 0) {\n                            as().showAlert(data.Message);\n                            return;\n                        }\n                        owner._iscroll_jsoncallbackMore(data.BizObject.rows, data.BizObject.total);\n                    }, timeout: function timeout() {\n                        owner._iscroll_MoreTip(\"连接超时，请重试！\");\n                    }, error: function error() {\n                        owner._iscroll_MoreTip(\"连接无法获取,请检查网络后重试！\");\n                    }\n                });\n            }\n        },\n        lscroll: null,\n        wrapper: null,\n        container: null,\n        init: function init(obj) {\n            this.lscroll = obj;\n            var owner = this;\n            x$(\"#\" + obj.id + \"_wrapper\").iscroll({\n                pullDownAction: function pullDownAction(myScroll, wrapper, container) {\n                    owner.wrapper = wrapper;\n                    owner.container = container;\n                    owner._iscroll_pullDownAction(myScroll);\n                },\n                pullUpAction: function pullUpAction(myScroll, wrapper, container) {\n                    owner.wrapper = wrapper;\n                    owner.container = container;\n                    owner._iscroll_pullUpAction(myScroll);\n                }\n            });\n        }\n    };\n\n    ListScroll.prototype = {\n        wrapper: null,\n        container: null,\n        _init: function _init() {\n            var lscroll = this;\n            x$(\"#\" + this.id + \"_wrapper\").html(\"\");\n            x$(\"#\" + this.id + \"_wrapper\").list({\n                skin: lscroll.skin,\n                beforePullAction: function beforePullAction(wrapper, container) {\n                    lscroll.wrapper = wrapper;\n                    lscroll.container = container;\n                    lscroll._ibeforePullAction();\n                }\n            });\n        },\n        _ibeforePullAction: function _ibeforePullAction() {\n            var lscroll = this;\n            if (this.ajax) {\n                $.ajax({\n                    type: \"post\",\n                    async: false,\n                    url: this.url,\n                    data: this.data,\n                    success: function success(data) {\n                        if (data.success) {\n                            lscroll._jsonpCallback(data.obj.rows, data.obj.total);\n                        } else {\n                            as().showAlert(data.msg);\n                        }\n                    },\n                    timeout: function timeout() {\n                        lscroll._itimeout();\n                    },\n                    error: function error() {\n                        lscroll._ierror();\n                    }\n                });\n            } else {\n                x$().xhrjsonp(this.url + \"&page=1\", { callback: function callback(data) {\n                        lscroll._jsonpCallback(data.BizObject.rows, data.BizObject.total);\n                    }, error: function error() {\n                        lscroll._ierror();\n                    }, timeout: function timeout() {\n                        lscroll._itimeout();\n                    }\n                });\n            }\n        },\n        _shownodata: function _shownodata() {\n            var nodataicon = '<i class=\"iconfont icon-zanwushuju2\"></i>';\n            x$(this.container[0].parentNode).bottom('<div class=\"listmask\">' + nodataicon + '</div>');\n        },\n        _createListData: function _createListData(rows) {\n            var lastcount = this.container.find(\"li\").length % this.pageCount;\n            this._ListDetail(lastcount, rows);\n        },\n        _ListDetail: function _ListDetail(lastcount, objectdata) {\n            for (var i = lastcount; i < objectdata.length; i++) {\n                //var guid = as().guidGenerator();\n                if (typeof this.CreateDetail != \"undefined\") {\n                    var rowdata = this.CreateDetail(objectdata[i]);\n                    this.container.bottom(rowdata);\n                } else {\n                    var li = '<li class=\"hr\">' + '<a href=\"/project/detail\"  class=\"item-content\">' + '<div class=\"item-inner\">' + '<div class=\"progress-radial progress-29\"><b></b></div>' + '<div class=\"content-right\"><div class=\"list-content\"><span class=\"code\">[200312323]</span>&nbsp;<span class=\"name\">南京地铁项目</span></div>' + '<div class=\"list-info\"><span>陈清元</span><span class=\"date\">2016-6-1</span></div>' + '<i class=\"iconfont icon-arrow\"></i>' + '</div></div></a></li>';\n                    this.container.bottom(li);\n                }\n                //x$(\"#\" + guid).data(\"row\", row);\n            }\n        },\n        _jsonpCallback: function _jsonpCallback(rows, total) {\n            try {\n                if (total == 0 || rows.length == 0) {\n                    this._shownodata();\n                } else {\n                    this._createListData(rows);\n                }\n                //结束进度条\n                x$().hideloading();\n                as().iscroll.init(this);\n                //this._iscroll(this);\n            } catch (e) {}\n        },\n        _ierror: function _ierror() {\n            as().showAlert(\"连接无法获取,请检查网络后重试！\");\n        },\n        _itimeout: function _itimeout() {\n            as().showAlert(\"连接超时，请重试！\");\n        }\n    };\n})();\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvcGx1Z2luLm1ldGhvZC5qcz9lY2Q4Il0sIm5hbWVzIjpbImFuYW5hcyIsIlZBUiIsIkNPTlNUIiwiZG9tYWlucyIsImhvc3QiLCJhamF4SGFuZGxlciIsInVybCIsInBhcmFtIiwiX2hvc3QiLCIkIiwicG9zdCIsIkRhdGUiLCJnZXRUaW1lIiwidGhlbiIsImRhdGEiLCJJc1N1Y2Nlc3MiLCJCYXNlRGF0YSIsIkRlZmVycmVkIiwicmVqZWN0IiwiZXJyIiwiY29uc29sZSIsImxvZyIsInN0YXR1cyIsIndpbmRvdyIsImFzIiwicSIsIl9hbmFuYXMiLCJlbCIsIngkIiwicHJvdG90eXBlIiwiRmFzdFRhcCIsIm9uVGFwIiwiaSIsImxlbmd0aCIsImVsZW1lbnQiLCJpbmRleCIsIkhhbW1lciIsIm9uIiwiQ2xpY2siLCJhZGRFdmVudExpc3RlbmVyIiwiU2VhcmNoQm94IiwicGFyZW50RWxlbWVudCIsImNsYXNzTmFtZSIsIlRhYkJveCIsInRhYmVsIiwiZmluZCIsInRhYmxpbmsiLCJ0YWJzU3dpcGVyIiwiU3dpcGVyIiwiY2VudGVyZWRTbGlkZXMiLCJvblNsaWRlQ2hhbmdlU3RhcnQiLCJyZW1vdmVDbGFzcyIsImFjdGl2ZUluZGV4IiwiYWRkQ2xhc3MiLCJzbGlkZVRvIiwiSW5pdElzY3JvbGwiLCJpc2Nyb2xsIiwid3JhcHBlciIsImNvbmZpZ3VyZSIsInNjcm9sbCIsImRlc3Ryb3kiLCJpU2Nyb2xsIiwic2hvd0FsZXJ0IiwiYWxlcnRpbmZvIiwiYWxlcnRvayIsImlzU3lzdGVtIiwidGl0bGUiLCJ0b1N0cmluZyIsImlzUGhvbmVBcHAiLCJuYXZpZ2F0b3IiLCJub3RpZmljYXRpb24iLCJhbGVydCIsInNldFRpbWVvdXQiLCJjbG9zZURpdiIsInNob3dEaXYiLCJiYWNrZ3JvdW5kIiwiaHRtbCIsImd1aWRHZW5lcmF0b3IiLCJTNCIsIk1hdGgiLCJyYW5kb20iLCJzdWJzdHJpbmciLCJmb3JtYXREYXRlU3RyaW5nIiwidmFsdWUiLCJmbGFnIiwic2hvd3RpbWUiLCJyZXBsYWNlIiwibGFzdEluZGV4T2YiLCJteWRhdGUiLCJpc05hTiIsIm5ld0RhdGUiLCJmb3JtYXREYXRlIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRheSIsImdldERhdGUiLCJ0aW1lIiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwic2Vjb25kcyIsImdldFNlY29uZHMiLCJmb3JtYXRUaG91c2FuZHMiLCJ2YWwiLCJOdW1iZXIiLCJ0b0ZpeGVkIiwiR2V0RmlsZVNpemUiLCJmaWxlc2l6ZSIsIkxpc3RTY3JvbGwiLCJpZCIsIm9wdGlvbnMiLCJsaXN0TmFtZSIsImRhdGFleHRlbmQiLCJhamF4Iiwic2tpbiIsIkNyZWF0ZURldGFpbCIsInBhZ2VDb3VudCIsIl9pbml0IiwiX2lzY3JvbGxfUmVmcmVzaFRpcCIsInRpcCIsImNzcyIsInB1bGxEb3duRWwiLCJzZXRBdHRyaWJ1dGUiLCJxdWVyeVNlbGVjdG9yIiwiaW5uZXJIVE1MIiwiY2hpbGROb2RlcyIsIl9pc2Nyb2xsX01vcmVUaXAiLCJwdWxsVXBFbCIsIl9pc2Nyb2xsX2pzb25jYWxsYmFjayIsInJvd3MiLCJ0b3RhbCIsImNvbnRhaW5lciIsInBhcmVudE5vZGUiLCJyZW1vdmUiLCJib3R0b20iLCJkb2N1bWVudCIsImJvZHkiLCJjbGllbnRIZWlnaHQiLCJsc2Nyb2xsIiwiX2NyZWF0ZUxpc3REYXRhIiwicmVmcmVzaCIsIl9pc2Nyb2xsX2pzb25jYWxsYmFja01vcmUiLCJjaGlsZGNvdW50IiwibGFzdGNvdW50IiwiX2dldFBhZ2UiLCJjb3VudCIsInBhZ2UiLCJmbG9vciIsIl9pc2Nyb2xsX3B1bGxEb3duQWN0aW9uIiwibXlTY3JvbGwiLCJvd25lciIsInR5cGUiLCJhc3luYyIsInN1Y2Nlc3MiLCJvYmoiLCJtc2ciLCJ0aW1lb3V0IiwiZXJyb3IiLCJ4aHJqc29ucCIsImNhbGxiYWNrIiwiU3RhdGUiLCJNZXNzYWdlIiwiQml6T2JqZWN0IiwiX2lzY3JvbGxfcHVsbFVwQWN0aW9uIiwiaW5pdCIsInB1bGxEb3duQWN0aW9uIiwicHVsbFVwQWN0aW9uIiwibGlzdCIsImJlZm9yZVB1bGxBY3Rpb24iLCJfaWJlZm9yZVB1bGxBY3Rpb24iLCJfanNvbnBDYWxsYmFjayIsIl9pdGltZW91dCIsIl9pZXJyb3IiLCJfc2hvd25vZGF0YSIsIm5vZGF0YWljb24iLCJfTGlzdERldGFpbCIsIm9iamVjdGRhdGEiLCJyb3dkYXRhIiwibGkiLCJoaWRlbG9hZGluZyIsImUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFPQTs7QUFFQyxhQUFZO0FBQ1Q7QUFDQSxRQUFJQSxTQUFTLEVBQWI7QUFDQUEsV0FBT0MsR0FBUCxHQUFhLEVBQWI7QUFDQUQsV0FBT0UsS0FBUCxHQUFlO0FBQ1hDLGlCQUFTLEVBQUVDLE1BQU0sRUFBUjtBQURFLEtBQWY7QUFHQTs7O0FBR0FKLFdBQU9LLFdBQVAsR0FBcUIsVUFBVUMsR0FBVixFQUFlQyxLQUFmLEVBQXNCO0FBQ3ZDLFlBQUlDLFFBQVFSLE9BQU9JLElBQVAsRUFBWjtBQUNBLGVBQU9LLEVBQUVDLElBQUYsQ0FBT0YsUUFBUUYsR0FBUixHQUFjLFFBQWQsR0FBMEIsSUFBSUssSUFBSixFQUFELENBQWFDLE9BQWIsRUFBaEMsRUFBd0RMLEtBQXhELEVBQStETSxJQUEvRCxDQUFvRSxVQUFVQyxJQUFWLEVBQWdCO0FBQ3ZGLGdCQUFJQSxLQUFLQyxTQUFULEVBQW9CO0FBQ2hCLHVCQUFPRCxLQUFLRSxRQUFaO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsdUJBQU9QLEVBQUVRLFFBQUYsR0FBYUMsTUFBYixDQUFvQkosSUFBcEIsQ0FBUDtBQUNIO0FBQ0osU0FOTSxFQU1KLFVBQVVLLEdBQVYsRUFBZTtBQUNkO0FBQ0FDLG9CQUFRQyxHQUFSLENBQVlGLElBQUlHLE1BQWhCLEVBRmMsQ0FFVztBQUM1QixTQVRNLENBQVA7QUFVSCxLQVpEOztBQWNBO0FBQ0E7QUFDQUMsV0FBT0MsRUFBUCxH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TUFHTTtBQUNGLHdCQUFJQyxLQUFLLG9CQUNILGtEQURHLEdBRUgsMEJBRkcsR0FHSCx3REFIRyxHQUlILHdJQUpHLEdBS0gsaUZBTEcsR0FNSCxxQ0FORyxHQU9ILHVCQVBOO0FBUUEseUJBQUsvQyxTQUFMLENBQWVHLE1BQWYsQ0FBc0I0QyxFQUF0QjtBQUNIO0FBQ0Q7QUFDSDtBQUNKLFNBaEZrQjtBQWlGbkJSLHdCQUFlLHdCQUFTekMsSUFBVCxFQUFjQyxLQUFkLEVBQW9CO0FBQy9CLGdCQUFJO0FBQ0Esb0JBQUlBLFNBQVMsQ0FBVCxJQUFZRCxLQUFLbkcsTUFBTCxJQUFhLENBQTdCLEVBQWdDO0FBQzVCLHlCQUFLK0ksV0FBTDtBQUNILGlCQUZELE1BRU07QUFDRix5QkFBS2xDLGVBQUwsQ0FBcUJWLElBQXJCO0FBQ0g7QUFDRDtBQUNBeEcscUJBQUswSixXQUFMO0FBQ0E5SixxQkFBS2dDLE9BQUwsQ0FBYStHLElBQWIsQ0FBa0IsSUFBbEI7QUFDQTtBQUNILGFBVkQsQ0FXQSxPQUFPZ0IsQ0FBUCxFQUFVLENBRVQ7QUFDSixTQWhHa0I7QUFpR25CUixpQkFBUSxtQkFDUjtBQUNJdkosaUJBQUtzQyxTQUFMLENBQWUsa0JBQWY7QUFFSCxTQXJHa0I7QUFzR25CZ0gsbUJBQVUscUJBQ1Y7QUFDSXRKLGlCQUFLc0MsU0FBTCxDQUFlLFdBQWY7QUFDSDtBQXpHa0IsS0FBdkI7QUE0R0gsQ0E5ZUEsR0FBRCIsImZpbGUiOiIxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiogQ29weXJpZ2h0IChjKSAyMDE0IOiPoOiQneW3peS9nOWupFxyXG4qIOe9keerme+8mmh0dHA6Ly93d3cuMG5vbjAuY29tXHJcbiogRGF0ZTogMjAxNC0xMS0yOFxyXG4qIENyZWF0ZXI6Q3F5XHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuLyotLS0tLS3pgJrnlKjnmoTmlrnms5XlupMgYnk6Y3F5IDIwMTUtMi0yOC0tLS0tLSovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgLyotLS0tLS1hbmFuYXMu6LCD55So5pa55rOV5ZKM5bGe5oCnLS0tLS0tLS0tLS0qL1xyXG4gICAgdmFyIGFuYW5hcyA9IHt9O1xyXG4gICAgYW5hbmFzLlZBUiA9IHt9O1xyXG4gICAgYW5hbmFzLkNPTlNUID0ge1xyXG4gICAgICAgIGRvbWFpbnM6IHsgaG9zdDogXCJcIiB9XHJcbiAgICB9O1xyXG4gICAgLyotLS1hamF45bCB6KOFLS0tLS0tLVxyXG4gICAg5L6L77yaYW5hbmFzLmFqYXhIYW5kbGVyKFwiZmlsZS9HZXRJbWFnZUxpc3RzXCIsIHsgdHlwZTogXCJUeEltYWdlXCIgfSkuZG9uZShmdW5jdGlvbiAoZGF0YSkge30pLmZhaWwoZnVuY3Rpb24gKHJlcykgeyB9KTtcclxuICAgIC0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICBhbmFuYXMuYWpheEhhbmRsZXIgPSBmdW5jdGlvbiAodXJsLCBwYXJhbSkge1xyXG4gICAgICAgIHZhciBfaG9zdCA9IGFuYW5hcy5ob3N0KCk7XHJcbiAgICAgICAgcmV0dXJuICQucG9zdChfaG9zdCArIHVybCArIFwiP3RpbWU9XCIgKyAobmV3IERhdGUoKSkuZ2V0VGltZSgpLCBwYXJhbSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5Jc1N1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLkJhc2VEYXRhO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQuRGVmZXJyZWQoKS5yZWplY3QoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgIC8vIOWksei0peWbnuiwg1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIuc3RhdHVzKTsgLy8g5omT5Y2w54q25oCB56CBXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qLS0tLS0tYXMoKeiwg+eUqOaWueazleWSjOWxnuaApy0tLS0tLS0tLS0tKi9cclxuICAgIC8qLS0tLS0t5L2/55SoYXMoKeiwg+eUqOaWueazle+8jOWkhOeQhuS8oOmAkuWPguaVsOavlOi+g+WwkeeahOaOp+S7tiovXHJcbiAgICB3aW5kb3cuYXMgPSBmdW5jdGlvbiAocSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgX2FuYW5hcyhxKTtcclxuICAgIH07XHJcblxyXG4gICAgLy9fYW5hbmFz5a+56LGhXHJcbiAgICB2YXIgX2FuYW5hcyA9IGZ1bmN0aW9uIChxKSB7XHJcbiAgICAgICAvKiB2YXIgZmlyc3RXb3JkPSBxLnN1YnN0cigwLCAxKTtcclxuICAgICAgICB2YXIgbnE9IHEuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIHN3aXRjaChmaXJzdFdvcmQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIFwiI1wiOlxyXG4gICAgICAgICAgICB0aGlzLmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobnEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCIuXCI6XHJcbiAgICAgICAgICAgIHRoaXMuZWw9ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShucSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChxKTtcclxuICAgICAgICB9Ki9cclxuICAgICAgICB0aGlzLmVsPXgkKHEpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKi0tLeWwgeijhXN0YXJ0LS0tLS0tLSovXHJcbiAgICBfYW5hbmFzLnByb3RvdHlwZS5GYXN0VGFwPSBmdW5jdGlvbiAob25UYXApIHtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuZWwubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuZWxbaV07XHJcbiAgICAgICAgICAgIGVsZW1lbnQuaW5kZXg9aTtcclxuICAgICAgICAgICAgSGFtbWVyKGVsZW1lbnQpLm9uKFwidGFwXCIsIG9uVGFwKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9hbmFuYXMucHJvdG90eXBlLkNsaWNrPSBmdW5jdGlvbiAob25UYXApIHtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuZWwubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuZWxbaV07XHJcbiAgICAgICAgICAgIGVsZW1lbnQuaW5kZXg9aTtcclxuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsb25UYXAsZmFsc2UpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9hbmFuYXMucHJvdG90eXBlLlNlYXJjaEJveD0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5lbC5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5lbFtpXTtcclxuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSA9IFwic2VhcmNoYmFyIHNlYXJjaGJhci1hY3RpdmVcIjtcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lID0gXCJzZWFyY2hiYXIgc2VhcmNoYmFyLWFjdGl2ZVwiO1xyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSA9IFwic2VhcmNoYmFyXCI7XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9hbmFuYXMucHJvdG90eXBlLlRhYkJveD0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5lbC5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5lbFtpXTtcclxuICAgICAgICAgICAgdmFyIHRhYmVsPXgkKGVsZW1lbnQpLmZpbmQoXCIuc3dpcGVyLXRhYnNcIik7XHJcbiAgICAgICAgICAgIHZhciB0YWJsaW5rPXgkKGVsZW1lbnQpLmZpbmQoXCIud2lkZ2V0LXRhYi1saW5rXCIpO1xyXG4gICAgICAgICAgICB2YXIgdGFic1N3aXBlciA9IG5ldyBTd2lwZXIodGFiZWwsIHtcclxuICAgICAgICAgICAgICAgIGNlbnRlcmVkU2xpZGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgb25TbGlkZUNoYW5nZVN0YXJ0IDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGluay5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgeCQodGFibGlua1t0YWJzU3dpcGVyLmFjdGl2ZUluZGV4XSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYXModGFibGluaykuRmFzdFRhcChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0YWJsaW5rLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIHgkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIHRhYnNTd2lwZXIuc2xpZGVUbyh0aGlzLmluZGV4LDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9hbmFuYXMucHJvdG90eXBlLkluaXRJc2Nyb2xsPSBmdW5jdGlvbiAoaXNjcm9sbCkge1xyXG4gICAgICAgIHZhciB3cmFwcGVyPXRoaXMuZWxbMF07XHJcbiAgICAgICAgaWYodHlwZW9mKGNvbmZpZ3VyZS5zY3JvbGxbaXNjcm9sbF0pPT1cInVuZGVmaW5lZFwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKGNvbmZpZ3VyZS5zY3JvbGxbaXNjcm9sbF0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25maWd1cmUuc2Nyb2xsW2lzY3JvbGxdLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgY29uZmlndXJlLnNjcm9sbFtpc2Nyb2xsXSA9ICBuZXcgaVNjcm9sbCh3cmFwcGVyKTtcclxuICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgIGNvbmZpZ3VyZS5zY3JvbGxbaXNjcm9sbF0gPSAgbmV3IGlTY3JvbGwod3JhcHBlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBfYW5hbmFzLnByb3RvdHlwZS5zaG93QWxlcnQ9IGZ1bmN0aW9uIChhbGVydGluZm8sIGFsZXJ0b2ssIGlzU3lzdGVtLCB0aXRsZSkge1xyXG4gICAgICAgIGFsZXJ0aW5mbyA9IGFsZXJ0aW5mbyA9PSBudWxsID8gXCLmlbDmja7kuI3lrZjlnKhcIiA6IGFsZXJ0aW5mby50b1N0cmluZygpO1xyXG4gICAgICAgIHRpdGxlID0gdHlwZW9mICh0aXRsZSkgPT0gXCJ1bmRlZmluZWRcIiA/ICfmj5DnpLonIDogdGl0bGU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiAoaXNTeXN0ZW0pICE9IFwidW5kZWZpbmVkXCIgJiYgaXNTeXN0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKGlzUGhvbmVBcHApIHtcclxuICAgICAgICAgICAgICAgIG5hdmlnYXRvci5ub3RpZmljYXRpb24uYWxlcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnRpbmZvLnRvU3RyaW5nKCksICAvLyDmmL7npLrkv6Hmga9cclxuICAgICAgICAgICAgICAgICAgICBudWxsLC8vIOitpuWRiuiiq+W/veinhueahOWbnuiwg+WHveaVsFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlLC8vIOagh+mimFxyXG4gICAgICAgICAgICAgICAgICAgICfnoa7lrponLy8g5oyJ6ZKu5ZCN56ewXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoYWxlcnRpbmZvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIChhbGVydG9rKSA9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB4JCgpLmNsb3NlRGl2KCk7IH0sIDEwMDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB4JCgpLmNsb3NlRGl2KCk7IGFsZXJ0b2soKTsgfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHgkKCkuc2hvd0RpdihcImRpdkFsZXJ0XCIsIHsgYmFja2dyb3VuZDogXCJyZ2JhKDAsMCwwLDAuNSlcIiB9KTtcclxuICAgICAgICB4JChcIiNkaXZEaWFsb2dcIikuZmluZChcIltuYW1lPWFsZXJ0VGV4dF1cIikuaHRtbChhbGVydGluZm8pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvL+maj+acuueUn+aIkEdVSURcclxuICAgIF9hbmFuYXMucHJvdG90eXBlLmd1aWRHZW5lcmF0b3I9ZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgUzQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwKSB8IDApLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gKFM0KCkgKyBTNCgpICsgXCItXCIgKyBTNCgpICsgXCItXCIgKyBTNCgpICsgXCItXCIgKyBTNCgpICsgXCItXCIgKyBTNCgpICsgUzQoKSArIFM0KCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvL+Wtl+espuS4suaXtumXtOagvOW8j+i9rOWMluWkhOeQhlxyXG4gICAgX2FuYW5hcy5wcm90b3R5cGUuZm9ybWF0RGF0ZVN0cmluZz1mdW5jdGlvbih2YWx1ZSxmbGFnLCBzaG93dGltZSkge1xyXG4gICAgICAgIGlmKHR5cGVvZiAodmFsdWUpPT1cInVuZGVmaW5lZFwiKVxyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB2YWx1ZT12YWx1ZS5yZXBsYWNlKC8tL2csICcvJykucmVwbGFjZSgnVCcsICcgJyk7XHJcbiAgICAgICAgdmFyIGluZGV4PXZhbHVlLmxhc3RJbmRleE9mKCcuJylcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnN1YnN0cmluZygwLGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG15ZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICAgICAgICBpZiAoIWlzTmFOKG15ZGF0ZS5nZXRUaW1lKCkpKVxyXG4gICAgICAgICAgICB2YXIgbmV3RGF0ZSA9IGFzKCkuZm9ybWF0RGF0ZShteWRhdGUsIGZsYWcsIHNob3d0aW1lKTtcclxuICAgICAgICByZXR1cm4gbmV3RGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvL+aXtumXtOagvOW8j+i9rOWMluWkhOeQhlxyXG4gICAgX2FuYW5hcy5wcm90b3R5cGUuZm9ybWF0RGF0ZT1mdW5jdGlvbihteWRhdGUsIGZsYWcsIHNob3d0aW1lKSB7XHJcbiAgICAgICAgdmFyIHllYXIgPSBteWRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB2YXIgbW9udGggPSAobXlkYXRlLmdldE1vbnRoKCkgKyAxKSA8IDEwID8gKFwiMFwiICsgKG15ZGF0ZS5nZXRNb250aCgpICsgMSkpIDogKG15ZGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICAgICAgdmFyIGRheSA9IG15ZGF0ZS5nZXREYXRlKCkgPCAxMCA/IChcIjBcIiArIG15ZGF0ZS5nZXREYXRlKCkpIDogbXlkYXRlLmdldERhdGUoKTtcclxuICAgICAgICB2YXIgdGltZSA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiAoc2hvd3RpbWUpICE9IFwidW5kZWZpbmVkXCIgJiYgc2hvd3RpbWUgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB2YXIgaG91cnMgPSBteWRhdGUuZ2V0SG91cnMoKSA8IDEwID8gXCIwXCIgKyBteWRhdGUuZ2V0SG91cnMoKSA6IG15ZGF0ZS5nZXRIb3VycygpO1xyXG4gICAgICAgICAgICB2YXIgbWludXRlcyA9IG15ZGF0ZS5nZXRNaW51dGVzKCkgPCAxMCA/IFwiMFwiICsgbXlkYXRlLmdldE1pbnV0ZXMoKSA6IG15ZGF0ZS5nZXRNaW51dGVzKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWNvbmRzID0gbXlkYXRlLmdldFNlY29uZHMoKSA8IDEwID8gXCIwXCIgKyBteWRhdGUuZ2V0U2Vjb25kcygpIDogbXlkYXRlLmdldFNlY29uZHMoKTtcclxuICAgICAgICAgICAgdGltZSA9IFwiICBcIiArIGhvdXJzICsgXCI6XCIgKyBtaW51dGVzICsgXCI6XCIgKyBzZWNvbmRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YWx1ZSA9IHllYXIgKyBmbGFnICsgbW9udGggKyBmbGFnICsgZGF5K3RpbWU7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvL+WNg+WIhuS9jeWkhOeQhlxyXG4gICAgX2FuYW5hcy5wcm90b3R5cGUuZm9ybWF0VGhvdXNhbmRzPWZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICAgIHZhbCA9IE51bWJlcih2YWwpLnRvRml4ZWQoMik7XHJcbiAgICAgICAgcmV0dXJuICh2YWwgKyBcIlwiKS5yZXBsYWNlKC8oXFxkezEsM30pKD89KFxcZHszfSkrKD86JHxcXEQpKS9nLCBcIiQxLFwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvL+iOt+WPluaWh+S7tuWkp+Wwj1xyXG4gICAgX2FuYW5hcy5wcm90b3R5cGUuR2V0RmlsZVNpemU9ZnVuY3Rpb24oZmlsZXNpemUpIHtcclxuICAgICAgICBpZiAoZmlsZXNpemUgPCAxMDAwKSB7XHJcbiAgICAgICAgICAgIGZpbGVzaXplID0gZmlsZXNpemUgKyBcIuWtl+iKglwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZmlsZXNpemUgPSBmaWxlc2l6ZSAvIDEwMjQ7XHJcbiAgICAgICAgICAgIGlmIChmaWxlc2l6ZSA8IDEwMDApIHtcclxuICAgICAgICAgICAgICAgIGZpbGVzaXplID0gZmlsZXNpemUudG9GaXhlZCgwKSArIFwiS1wiO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGVzaXplIDwgMTAwMDAwMCkge1xyXG4gICAgICAgICAgICAgICAgZmlsZXNpemUgPSAoZmlsZXNpemUgLyAxMDI0KS50b0ZpeGVkKDIpICsgXCJNXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlc2l6ZSA9IChmaWxlc2l6ZSAvIDEwNDg1NzYpLnRvRml4ZWQoMikgKyBcIkdcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmlsZXNpemU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qLS0tLS0tTGlzdFNjcm9sbOeahOWunueOsC0tLS0tLS0tLS0tKi9cclxuICAgIHdpbmRvdy5MaXN0U2Nyb2xsPWZ1bmN0aW9uKGlkLG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLmVsPXgkKGlkKTtcclxuICAgICAgICB0aGlzLmlkPWlkO1xyXG4gICAgICAgIHRoaXMubGlzdE5hbWU9XCJsaXN0U2Nyb2xsXCI7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zPW9wdGlvbnM7XHJcbiAgICAgICAgdGhpcy51cmw9b3B0aW9ucy51cmw7XHJcbiAgICAgICAgdGhpcy5kYXRhPW9wdGlvbnMuZGF0YTtcclxuICAgICAgICB0aGlzLmRhdGFleHRlbmQ9dHlwZW9mKG9wdGlvbnMuZGF0YWV4dGVuZCk9PVwidW5kZWZpbmVkXCI/XCJcIjpvcHRpb25zLmRhdGFleHRlbmQ7XHJcbiAgICAgICAgdGhpcy5hamF4PW9wdGlvbnMuYWpheDtcclxuICAgICAgICB0aGlzLnNraW49b3B0aW9ucy5za2luO1xyXG4gICAgICAgIHRoaXMuQ3JlYXRlRGV0YWlsPW9wdGlvbnMuQ3JlYXRlRGV0YWlsO1xyXG4gICAgICAgIHRoaXMucGFnZUNvdW50PTE1O1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBfYW5hbmFzLnByb3RvdHlwZS5pc2Nyb2xsPXtcclxuICAgICAgICBfaXNjcm9sbF9SZWZyZXNoVGlwOmZ1bmN0aW9uKHRpcCl7XHJcbiAgICAgICAgICAgIHRoaXMud3JhcHBlci5maW5kKFwiLnNjcm9sbGVyXCIpLmNzcyh7IFwiLXdlYmtpdC10cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoMHB4LCAwcHgpIHNjYWxlKDEpIHRyYW5zbGF0ZVooMHB4KVwiIH0pO1xyXG4gICAgICAgICAgICB2YXIgcHVsbERvd25FbCA9IHRoaXMud3JhcHBlci5maW5kKFwiLnB1bGxEb3duXCIpWzBdO1xyXG4gICAgICAgICAgICBwdWxsRG93bkVsLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgJycpO1xyXG4gICAgICAgICAgICBwdWxsRG93bkVsLnF1ZXJ5U2VsZWN0b3IoJy5wdWxsRG93bkxhYmVsJykuaW5uZXJIVE1MID0gJ+S4i+aLieWIt+aWsCc7XHJcbiAgICAgICAgICAgIHB1bGxEb3duRWwuY2hpbGROb2Rlc1swXS5jbGFzc05hbWUgPSBcInB1bGxEb3duSWNvbl94aWFcIjtcclxuICAgICAgICAgICAgYXMoKS5zaG93QWxlcnQodGlwKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIF9pc2Nyb2xsX01vcmVUaXA6ZnVuY3Rpb24odGlwKXtcclxuICAgICAgICAgICAgdmFyIHB1bGxVcEVsID0gdGhpcy53cmFwcGVyLmZpbmQoXCIucHVsbFVwXCIpWzBdO1xyXG4gICAgICAgICAgICBwdWxsVXBFbC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsICcnKTtcclxuICAgICAgICAgICAgcHVsbFVwRWwucXVlcnlTZWxlY3RvcignLnB1bGxVcExhYmVsJykuaW5uZXJIVE1MID0gJ+S4iuaLieWKoOi9vSc7XHJcbiAgICAgICAgICAgIHB1bGxVcEVsLmNoaWxkTm9kZXNbMF0uY2xhc3NOYW1lID0gXCJpY29uZm9udCBwdWxsVXBJY29uX3NoYW5nXCI7XHJcbiAgICAgICAgICAgIGFzKCkuc2hvd0FsZXJ0KHRpcCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBfaXNjcm9sbF9qc29uY2FsbGJhY2s6ZnVuY3Rpb24ocm93cyx0b3RhbCl7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAvL+ayoeacieaVsOaNrlxyXG4gICAgICAgICAgICBpZiAodG90YWwgPT0gMHx8cm93cy5sZW5ndGg9PTApIHtcclxuICAgICAgICAgICAgICAgIHgkKCB0aGlzLmNvbnRhaW5lclswXS5wYXJlbnROb2RlKS5maW5kKFwiLmxpc3RtYXNrXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgeCQoIHRoaXMuY29udGFpbmVyWzBdLnBhcmVudE5vZGUpLmJvdHRvbSgnPGRpdiBjbGFzcz1cImxpc3RtYXNrXCIgc3R5bGU9XCJoZWlnaHQ6JyArICh3aW5kb3cuZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLSA0NykgKyAncHhcIj4gPGkgY2xhc3M9XCJpY29uZm9udCBpY29uLXphbnd1c2h1anUxXCI+PC9pPjwvZGl2PicpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgeCQoIHRoaXMuY29udGFpbmVyWzBdLnBhcmVudE5vZGUpLmZpbmQoXCIubGlzdG1hc2tcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxzY3JvbGwuX2NyZWF0ZUxpc3REYXRhKHJvd3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbmZpZ3VyZS5zY3JvbGxbdGhpcy5sc2Nyb2xsLmxpc3ROYW1lXS5yZWZyZXNoKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBfaXNjcm9sbF9qc29uY2FsbGJhY2tNb3JlOmZ1bmN0aW9uKHJvd3MsdG90YWwpe1xyXG4gICAgICAgICAgICBpZiAodG90YWwgPT0gMHx8cm93cy5sZW5ndGg9PTApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgeCQoIHRoaXMuY29udGFpbmVyWzBdLnBhcmVudE5vZGUpLmZpbmQoXCIubGlzdG1hc2tcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB4JCggdGhpcy5jb250YWluZXJbMF0ucGFyZW50Tm9kZSkuYm90dG9tKCc8ZGl2IGNsYXNzPVwibGlzdG1hc2tcIiBzdHlsZT1cImhlaWdodDonICsgKHdpbmRvdy5kb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCAtIDQ3KSArICdweFwiPiA8aSBjbGFzcz1cImljb25mb250IGljb24temFud3VzaHVqdTFcIj48L2k+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB4JCggdGhpcy5jb250YWluZXJbMF0ucGFyZW50Tm9kZSkuZmluZChcIi5saXN0bWFza1wiKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIC8v5Yqg6L295pWw5o2uXHJcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRjb3VudD10aGlzLmNvbnRhaW5lci5maW5kKFwibGlcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhc3Rjb3VudCA9IGNoaWxkY291bnQgJSB0aGlzLmxzY3JvbGwucGFnZUNvdW50O1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkY291bnQgPiAwICYmIGxhc3Rjb3VudCA9PSByb3dzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFzKCkuc2hvd0FsZXJ0KFwi5bey57uP5piv5pyA5ZCO5LiA6aG1XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5sc2Nyb2xsLl9jcmVhdGVMaXN0RGF0YShyb3dzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25maWd1cmUuc2Nyb2xsW3RoaXMubHNjcm9sbC5saXN0TmFtZV0ucmVmcmVzaCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX2dldFBhZ2U6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyIHBhZ2VDb3VudCA9IHRoaXMubHNjcm9sbC5wYWdlQ291bnQ7XHJcbiAgICAgICAgICAgIHZhciBjb3VudCA9IHRoaXMuY29udGFpbmVyLmZpbmQoXCJsaVwiKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gTWF0aC5mbG9vcihjb3VudCAvIHBhZ2VDb3VudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwYWdlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX2lzY3JvbGxfcHVsbERvd25BY3Rpb246ZnVuY3Rpb24obXlTY3JvbGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL+WIt+aWsOaVsOaNrlxyXG4gICAgICAgICAgICB2YXIgb3duZXI9dGhpcztcclxuICAgICAgICAgICAgY29uZmlndXJlLnNjcm9sbFtvd25lci5sc2Nyb2xsLmxpc3ROYW1lXSA9IG15U2Nyb2xsXHJcbiAgICAgICAgICAgIHZhciB1cmw9b3duZXIubHNjcm9sbC51cmw7XHJcbiAgICAgICAgICAgIGlmKG93bmVyLmxzY3JvbGwuYWpheCkge1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlIDogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6ZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsIDogdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG93bmVyLmxzY3JvbGwuZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duZXIuX2lzY3JvbGxfanNvbmNhbGxiYWNrKGRhdGEub2JqLnJvd3MsZGF0YS5vYmoudG90YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcygpLnNob3dBbGVydChkYXRhLm1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXIuX2lzY3JvbGxfUmVmcmVzaFRpcChcIui/nuaOpei2heaXtu+8jOivt+mHjeivle+8gVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyLl9pc2Nyb2xsX1JlZnJlc2hUaXAoXCLov57mjqXml6Dms5Xojrflj5Ys6K+35qOA5p+l572R57uc5ZCO6YeN6K+V77yBXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL+WKoOi9veaVsOaNrlxyXG4gICAgICAgICAgICAgICAgeCQoKS54aHJqc29ucCh1cmwgKyBcIiZwYWdlPTFcIiwgeyBjYWxsYmFjazogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLlN0YXRlID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5TdGF0ZSAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzKCkuc2hvd0FsZXJ0KGRhdGEuTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIuX2lzY3JvbGxfanNvbmNhbGxiYWNrKGRhdGEuQml6T2JqZWN0LnJvd3MsIGRhdGEuQml6T2JqZWN0LnRvdGFsKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCB0aW1lb3V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIuX2lzY3JvbGxfUmVmcmVzaFRpcChcIui/nuaOpei2heaXtu+8jOivt+mHjeivle+8gVwiKTtcclxuICAgICAgICAgICAgICAgIH0sIGVycm9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIuX2lzY3JvbGxfUmVmcmVzaFRpcChcIui/nuaOpeaXoOazleiOt+WPlizor7fmo4Dmn6XnvZHnu5zlkI7ph43or5XvvIFcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX2lzY3JvbGxfcHVsbFVwQWN0aW9uOmZ1bmN0aW9uKG15U2Nyb2xsLCB3cmFwcGVyLGNvbnRhaW5lcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8v5Yqg6L295pu05aSaXHJcbiAgICAgICAgICAgIHZhciBvd25lcj10aGlzO1xyXG4gICAgICAgICAgICBjb25maWd1cmUuc2Nyb2xsW293bmVyLmxzY3JvbGwubGlzdE5hbWVdID0gbXlTY3JvbGxcclxuICAgICAgICAgICAgdmFyIHVybD1vd25lci5sc2Nyb2xsLnVybDtcclxuICAgICAgICAgICAgLy/liqDovb3mlbDmja5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy/lnLDlnYDlpITnkIZcclxuICAgICAgICAgICAgICAgIHZhciBwYWdlQ291bnQgPSBvd25lci5sc2Nyb2xsLnBhZ2VDb3VudDtcclxuICAgICAgICAgICAgICAgIHZhciBjb3VudCA9IG93bmVyLmNvbnRhaW5lci5maW5kKFwibGlcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSBNYXRoLmZsb29yKGNvdW50IC8gcGFnZUNvdW50KSArIDE7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKG93bmVyLmxzY3JvbGwuYWpheCkge1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlIDogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6ZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsIDogdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcIlBhZ2VSZXF1ZXN0RGF0YVwiOid7XCJUb2tlblwiOlwiMTIzNDU2Nzg5XCIsJytvd25lci5sc2Nyb2xsLmRhdGFleHRlbmQrJ1BhZ2U6XCInKyhvd25lci5fZ2V0UGFnZSgpKzEpKydcIixSb3dzOlwiMTVcIixJc1ZhbGlkOlwiMVwiLE9iajpcIlwifSd9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5zdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duZXIuX2lzY3JvbGxfanNvbmNhbGxiYWNrTW9yZShkYXRhLm9iai5yb3dzLGRhdGEub2JqLnRvdGFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXMoKS5zaG93QWxlcnQoZGF0YS5tc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dDpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lci5faXNjcm9sbF9SZWZyZXNoVGlwKFwi6L+e5o6l6LaF5pe277yM6K+36YeN6K+V77yBXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXIuX2lzY3JvbGxfUmVmcmVzaFRpcChcIui/nuaOpeaXoOazleiOt+WPlizor7fmo4Dmn6XnvZHnu5zlkI7ph43or5XvvIFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IHVybCArIFwiJnBhZ2U9XCIgKyBvd25lci5fZ2V0UGFnZSgpKzE7XHJcbiAgICAgICAgICAgICAgICB4JCgpLnhocmpzb25wKHVybCwgeyBjYWxsYmFjazogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5TdGF0ZSAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzKCkuc2hvd0FsZXJ0KGRhdGEuTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIuX2lzY3JvbGxfanNvbmNhbGxiYWNrTW9yZShkYXRhLkJpek9iamVjdC5yb3dzLCBkYXRhLkJpek9iamVjdC50b3RhbCk7XHJcbiAgICAgICAgICAgICAgICB9LCB0aW1lb3V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIuX2lzY3JvbGxfTW9yZVRpcChcIui/nuaOpei2heaXtu+8jOivt+mHjeivle+8gVwiKTtcclxuICAgICAgICAgICAgICAgIH0sIGVycm9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIuX2lzY3JvbGxfTW9yZVRpcChcIui/nuaOpeaXoOazleiOt+WPlizor7fmo4Dmn6XnvZHnu5zlkI7ph43or5XvvIFcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbHNjcm9sbDpudWxsLFxyXG4gICAgICAgIHdyYXBwZXI6bnVsbCxcclxuICAgICAgICBjb250YWluZXI6bnVsbCxcclxuICAgICAgICBpbml0OmZ1bmN0aW9uKG9iail7XHJcbiAgICAgICAgICAgIHRoaXMubHNjcm9sbD1vYmo7XHJcbiAgICAgICAgICAgIHZhciBvd25lcj10aGlzO1xyXG4gICAgICAgICAgICB4JChcIiNcIiArIG9iai5pZCArIFwiX3dyYXBwZXJcIikuaXNjcm9sbCh7XHJcbiAgICAgICAgICAgICAgICBwdWxsRG93bkFjdGlvbjogZnVuY3Rpb24gKG15U2Nyb2xsLCB3cmFwcGVyLGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyLndyYXBwZXI9d3JhcHBlcjtcclxuICAgICAgICAgICAgICAgICAgICBvd25lci5jb250YWluZXI9Y29udGFpbmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyLl9pc2Nyb2xsX3B1bGxEb3duQWN0aW9uKG15U2Nyb2xsKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwdWxsVXBBY3Rpb246IGZ1bmN0aW9uIChteVNjcm9sbCwgd3JhcHBlcixjb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvd25lci53cmFwcGVyPXdyYXBwZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIuY29udGFpbmVyPWNvbnRhaW5lcjtcclxuICAgICAgICAgICAgICAgICAgICBvd25lci5faXNjcm9sbF9wdWxsVXBBY3Rpb24obXlTY3JvbGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgTGlzdFNjcm9sbC5wcm90b3R5cGUgPSB7XHJcbiAgICAgICAgd3JhcHBlcjpudWxsLFxyXG4gICAgICAgIGNvbnRhaW5lcjpudWxsLFxyXG4gICAgICAgIF9pbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBsc2Nyb2xsPXRoaXM7XHJcbiAgICAgICAgICAgIHgkKFwiI1wiICsgdGhpcy5pZCArIFwiX3dyYXBwZXJcIikuaHRtbChcIlwiKTtcclxuICAgICAgICAgICAgeCQoXCIjXCIgKyB0aGlzLmlkICsgXCJfd3JhcHBlclwiKS5saXN0KHtcclxuICAgICAgICAgICAgICAgIHNraW46bHNjcm9sbC5za2luLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlUHVsbEFjdGlvbjogZnVuY3Rpb24gKHdyYXBwZXIsY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbHNjcm9sbC53cmFwcGVyPXdyYXBwZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgbHNjcm9sbC5jb250YWluZXI9Y29udGFpbmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGxzY3JvbGwuX2liZWZvcmVQdWxsQWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX2liZWZvcmVQdWxsQWN0aW9uOmZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsc2Nyb2xsPXRoaXM7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYWpheCkge1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlIDogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6ZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsIDogdGhpcy51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogdGhpcy5kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsc2Nyb2xsLl9qc29ucENhbGxiYWNrKGRhdGEub2JqLnJvd3MsZGF0YS5vYmoudG90YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcygpLnNob3dBbGVydChkYXRhLm1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbHNjcm9sbC5faXRpbWVvdXQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxzY3JvbGwuX2llcnJvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeCQoKS54aHJqc29ucCh0aGlzLnVybCArIFwiJnBhZ2U9MVwiLCB7IGNhbGxiYWNrOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxzY3JvbGwuX2pzb25wQ2FsbGJhY2soZGF0YS5CaXpPYmplY3Qucm93cyxkYXRhLkJpek9iamVjdC50b3RhbCk7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxzY3JvbGwuX2llcnJvcigpXHJcbiAgICAgICAgICAgICAgICB9LCB0aW1lb3V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbHNjcm9sbC5faXRpbWVvdXQoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIF9zaG93bm9kYXRhOmZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBub2RhdGFpY29uPSc8aSBjbGFzcz1cImljb25mb250IGljb24temFud3VzaHVqdTJcIj48L2k+JztcclxuICAgICAgICAgICAgeCQodGhpcy5jb250YWluZXJbMF0ucGFyZW50Tm9kZSkuYm90dG9tKCc8ZGl2IGNsYXNzPVwibGlzdG1hc2tcIj4nK25vZGF0YWljb24rJzwvZGl2PicpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX2NyZWF0ZUxpc3REYXRhOmZ1bmN0aW9uKHJvd3Mpe1xyXG4gICAgICAgICAgICB2YXIgbGFzdGNvdW50ID0gKHRoaXMuY29udGFpbmVyLmZpbmQoXCJsaVwiKS5sZW5ndGgpICUgdGhpcy5wYWdlQ291bnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX0xpc3REZXRhaWwobGFzdGNvdW50LHJvd3MpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX0xpc3REZXRhaWw6ZnVuY3Rpb24obGFzdGNvdW50LCBvYmplY3RkYXRhKXtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGxhc3Rjb3VudDsgaSA8IG9iamVjdGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIC8vdmFyIGd1aWQgPSBhcygpLmd1aWRHZW5lcmF0b3IoKTtcclxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiAodGhpcy5DcmVhdGVEZXRhaWwpIT1cInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvd2RhdGE9dGhpcy5DcmVhdGVEZXRhaWwob2JqZWN0ZGF0YVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYm90dG9tKHJvd2RhdGEpXHJcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpID0gJzxsaSBjbGFzcz1cImhyXCI+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICc8YSBocmVmPVwiL3Byb2plY3QvZGV0YWlsXCIgIGNsYXNzPVwiaXRlbS1jb250ZW50XCI+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICc8ZGl2IGNsYXNzPVwiaXRlbS1pbm5lclwiPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnPGRpdiBjbGFzcz1cInByb2dyZXNzLXJhZGlhbCBwcm9ncmVzcy0yOVwiPjxiPjwvYj48L2Rpdj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzxkaXYgY2xhc3M9XCJjb250ZW50LXJpZ2h0XCI+PGRpdiBjbGFzcz1cImxpc3QtY29udGVudFwiPjxzcGFuIGNsYXNzPVwiY29kZVwiPlsyMDAzMTIzMjNdPC9zcGFuPiZuYnNwOzxzcGFuIGNsYXNzPVwibmFtZVwiPuWNl+S6rOWcsOmTgemhueebrjwvc3Bhbj48L2Rpdj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzxkaXYgY2xhc3M9XCJsaXN0LWluZm9cIj48c3Bhbj7pmYjmuIXlhYM8L3NwYW4+PHNwYW4gY2xhc3M9XCJkYXRlXCI+MjAxNi02LTE8L3NwYW4+PC9kaXY+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICc8aSBjbGFzcz1cImljb25mb250IGljb24tYXJyb3dcIj48L2k+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICc8L2Rpdj48L2Rpdj48L2E+PC9saT4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmJvdHRvbShsaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL3gkKFwiI1wiICsgZ3VpZCkuZGF0YShcInJvd1wiLCByb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBfanNvbnBDYWxsYmFjazpmdW5jdGlvbihyb3dzLHRvdGFsKXtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmICh0b3RhbCA9PSAwfHxyb3dzLmxlbmd0aD09MCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Nob3dub2RhdGEoKTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVMaXN0RGF0YShyb3dzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8v57uT5p2f6L+b5bqm5p2hXHJcbiAgICAgICAgICAgICAgICB4JCgpLmhpZGVsb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBhcygpLmlzY3JvbGwuaW5pdCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5faXNjcm9sbCh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX2llcnJvcjpmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhcygpLnNob3dBbGVydChcIui/nuaOpeaXoOazleiOt+WPlizor7fmo4Dmn6XnvZHnu5zlkI7ph43or5XvvIFcIik7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX2l0aW1lb3V0OmZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFzKCkuc2hvd0FsZXJ0KFwi6L+e5o6l6LaF5pe277yM6K+36YeN6K+V77yBXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0gKCkpO1xyXG5cclxuXHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2pzL3BsdWdpbi5tZXRob2QuanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///1\n");

/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(1);\n\n__webpack_require__(0);\n\n__webpack_require__(7);\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wdWJsaWMvaW5kZXgyLmpzP2JhOTciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFDQTs7QUFDQSIsImZpbGUiOiIxMi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9qcy9wbHVnaW4ubWV0aG9kLmpzJ1xuaW1wb3J0ICcuL2FwcC5qcydcbmltcG9ydCAnLi9qcy9zZXJ2aWNlLmpzJ1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1YmxpYy9pbmRleDIuanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///12\n");

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n(function () {\n    //初始化页面布局\n    //动态添加页面\n    var Main = function Main(id) {\n        this.el = x$(id);\n        this.tabBar = x$(\"#js-tabbar\");\n        this.main = x$(\"#main\");\n        this.mode = configure.window.mode;\n        this._init();\n    };\n\n    Main.prototype = {\n        _init: function _init() {\n            //先动态添加tab样式\n            this._addTab();\n            //设置页面的模式是动态还是静态的\n            this._initPage();\n            //添加切换tab的事件\n            this._initEvent();\n        },\n        _initEvent: function _initEvent() {\n            var m = this;\n            if (this.mode == \"link\") {\n                as(\".tab-item\").Click(function () {\n                    var tabid = this.getAttribute(\"tab-id\");\n                    window.location.href = \"index.html?tab=\" + tabid;\n                });\n            } else {\n                as(\".tab-item\").Click(function () {\n                    var tabid = this.getAttribute(\"tab-id\");\n                    var selectedid = x$(\".tab-selected\").attr(\"tab-id\");\n                    var tab = configure.tabBar.list[tabid];\n                    if (tabid != selectedid) {\n                        m._setSelectTab(tabid);\n                        m.main.next('#' + tabid, { html: tab.pagePath, callback: tab.pageInit });\n                    } else {\n                        //重新加载当前页面\n                        if (typeof tab.refresh == 'function') {\n                            tab.refresh();\n                        }\n                    }\n                });\n            }\n        },\n        _setLinkPage: function _setLinkPage() {\n            var tabid = x$().GetQueryString(\"tab\");\n            tabid = tabid ? tabid : configure.tabBar.default;\n            this._setSelectTab(tabid);\n            var tab = configure.tabBar.list[tabid];\n            this.main.next('#' + tabid, { html: tab.pagePath, callback: tab.pageInit });\n        },\n        _setOnePage: function _setOnePage() {\n            var tabid = configure.tabBar.default;\n            var els = x$(\".tab-item\");\n            for (var i = 0; i < els.length; i++) {\n                var el = els[i];\n                var id = x$(el).attr(\"tab-id\");\n                var tab = configure.tabBar.list[id];\n                this.main.storenext('#' + id, { html: tab.pagePath, callback: function callback() {} });\n                if (id == tabid) {\n                    this._setSelectTab(id);\n                    this.main.next('#' + id, { html: tab.pagePath, callback: tab.pageInit });\n                }\n            }\n        },\n        _initPage: function _initPage() {\n            if (this.mode == \"link\") this._setLinkPage();else this._setOnePage();\n        },\n        _setSelectTab: function _setSelectTab(id) {\n            //删除选中的样式\n            var selectedtag = x$(\".tab-selected .icon\")[0].tagName.toLowerCase();\n            var selectedid = x$(\".tab-selected\").attr(\"tab-id\");\n            var currenttag = x$(\"#js-btn-tab-\" + id + \" .icon\")[0].tagName.toLowerCase();\n            var oldicon = configure.tabBar.list[selectedid].Icon;\n            var currentIcon = configure.tabBar.list[id].selectedIcon;\n            if (selectedtag == \"svg\") x$(\".tab-selected use\").attr(\"xlink:href\", \"#\" + oldicon);\n            if (currenttag == \"svg\") x$(\"#js-btn-tab-\" + id + \" use\").attr(\"xlink:href\", \"#\" + currentIcon);\n            if (selectedtag == \"img\") x$(\".tab-selected img\").attr(\"src\", oldicon);\n            if (currenttag == \"img\") x$(\"#js-btn-tab-\" + id + \" img\").attr(\"src\", currentIcon);\n            x$(\".tab-selected\").removeClass(\"tab-selected\");\n            x$(\"#js-btn-tab-\" + id).addClass(\"tab-selected\");\n        },\n        _addTab: function _addTab() {\n            if (!configure.window.tabBar) {\n                this.main.css({ bottom: \"0\" });\n                this.tabBar.html('remove');\n                return;\n            }\n            //设置底部菜单的高度\n            this.main.css({ bottom: configure.tabBar.height });\n            this.tabBar.css({ height: configure.tabBar.height });\n            //设置底部菜单的模式\n            this.tabBar.addClass(configure.tabBar.css);\n        }\n    };\n\n    var Header = function Header(id) {\n        this.el = x$(id);\n    };\n    Header.prototype = {};\n\n    function init() {\n        new Main(\"#main\");\n    }\n\n    init();\n})();\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvc2VydmljZS5qcz9jYTRjIl0sIm5hbWVzIjpbIk1haW4iLCJpZCIsImVsIiwieCQiLCJ0YWJCYXIiLCJtYWluIiwibW9kZSIsImNvbmZpZ3VyZSIsIndpbmRvdyIsIl9pbml0IiwicHJvdG90eXBlIiwiX2FkZFRhYiIsIl9pbml0UGFnZSIsIl9pbml0RXZlbnQiLCJtIiwiYXMiLCJDbGljayIsInRhYmlkIiwiZ2V0QXR0cmlidXRlIiwibG9jYXRpb24iLCJocmVmIiwic2VsZWN0ZWRpZCIsImF0dHIiLCJ0YWIiLCJsaXN0IiwiX3NldFNlbGVjdFRhYiIsIm5leHQiLCJodG1sIiwicGFnZVBhdGgiLCJjYWxsYmFjayIsInBhZ2VJbml0IiwicmVmcmVzaCIsIl9zZXRMaW5rUGFnZSIsIkdldFF1ZXJ5U3RyaW5nIiwiZGVmYXVsdCIsIl9zZXRPbmVQYWdlIiwiZWxzIiwiaSIsImxlbmd0aCIsInN0b3JlbmV4dCIsInNlbGVjdGVkdGFnIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwiY3VycmVudHRhZyIsIm9sZGljb24iLCJJY29uIiwiY3VycmVudEljb24iLCJzZWxlY3RlZEljb24iLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiY3NzIiwiYm90dG9tIiwiaGVpZ2h0IiwiSGVhZGVyIiwiaW5pdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxDQUFDLFlBQVk7QUFDVDtBQUNBO0FBQ0EsUUFBSUEsT0FBSyxTQUFMQSxJQUFLLENBQVNDLEVBQVQsRUFBYTtBQUNsQixhQUFLQyxFQUFMLEdBQVFDLEdBQUdGLEVBQUgsQ0FBUjtBQUNBLGFBQUtHLE1BQUwsR0FBWUQsR0FBRyxZQUFILENBQVo7QUFDQSxhQUFLRSxJQUFMLEdBQVVGLEdBQUcsT0FBSCxDQUFWO0FBQ0EsYUFBS0csSUFBTCxHQUFVQyxVQUFVQyxNQUFWLENBQWlCRixJQUEzQjtBQUNBLGFBQUtHLEtBQUw7QUFDSCxLQU5EOztBQVFBVCxTQUFLVSxTQUFMLEdBQWlC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NkMsV0FBcEIsQ0FBZ0MsY0FBaEM7QUFDQTdDLGVBQUcsaUJBQWVGLEVBQWxCLEVBQXNCZ0QsUUFBdEIsQ0FBK0IsY0FBL0I7QUFDRixTQWhGYztBQWlGZnRDLGlCQUFRLG1CQUFVO0FBQ2YsZ0JBQUcsQ0FBQ0osVUFBVUMsTUFBVixDQUFpQkosTUFBckIsRUFDQTtBQUNJLHFCQUFLQyxJQUFMLENBQVU2QyxHQUFWLENBQWMsRUFBQ0MsUUFBTyxHQUFSLEVBQWQ7QUFDQSxxQkFBSy9DLE1BQUwsQ0FBWXVCLElBQVosQ0FBaUIsUUFBakI7QUFDQTtBQUNIO0FBQ0Q7QUFDQSxpQkFBS3RCLElBQUwsQ0FBVTZDLEdBQVYsQ0FBYyxFQUFDQyxRQUFPNUMsVUFBVUgsTUFBVixDQUFpQmdELE1BQXpCLEVBQWQ7QUFDQSxpQkFBS2hELE1BQUwsQ0FBWThDLEdBQVosQ0FBZ0IsRUFBQ0UsUUFBTzdDLFVBQVVILE1BQVYsQ0FBaUJnRCxNQUF6QixFQUFoQjtBQUNBO0FBQ0EsaUJBQUtoRCxNQUFMLENBQVk2QyxRQUFaLENBQXFCMUMsVUFBVUgsTUFBVixDQUFpQjhDLEdBQXRDO0FBQ0Y7QUE3RmMsS0FBakI7O0FBZ0dBLFFBQUlHLFNBQU8sU0FBUEEsTUFBTyxDQUFTcEQsRUFBVCxFQUFhO0FBQUMsYUFBS0MsRUFBTCxHQUFRQyxHQUFHRixFQUFILENBQVI7QUFBZ0IsS0FBekM7QUFDQW9ELFdBQU8zQyxTQUFQLEdBQW1CLEVBQW5COztBQUVBLGFBQVM0QyxJQUFULEdBQ0E7QUFDSSxZQUFJdEQsSUFBSixDQUFTLE9BQVQ7QUFDSDs7QUFFRHNEO0FBRUgsQ0FySEQiLCJmaWxlIjoiNy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XHJcbiAgICAvL+WIneWni+WMlumhtemdouW4g+WxgFxyXG4gICAgLy/liqjmgIHmt7vliqDpobXpnaJcclxuICAgIHZhciBNYWluPWZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgdGhpcy5lbD14JChpZCk7XHJcbiAgICAgICAgdGhpcy50YWJCYXI9eCQoXCIjanMtdGFiYmFyXCIpO1xyXG4gICAgICAgIHRoaXMubWFpbj14JChcIiNtYWluXCIpO1xyXG4gICAgICAgIHRoaXMubW9kZT1jb25maWd1cmUud2luZG93Lm1vZGU7XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIE1haW4ucHJvdG90eXBlID0ge1xyXG4gICAgICBfaW5pdDpmdW5jdGlvbigpe1xyXG4gICAgICAgIC8v5YWI5Yqo5oCB5re75YqgdGFi5qC35byPXHJcbiAgICAgICAgdGhpcy5fYWRkVGFiKCk7XHJcbiAgICAgICAgLy/orr7nva7pobXpnaLnmoTmqKHlvI/mmK/liqjmgIHov5jmmK/pnZnmgIHnmoRcclxuICAgICAgICB0aGlzLl9pbml0UGFnZSgpO1xyXG4gICAgICAgIC8v5re75Yqg5YiH5o2idGFi55qE5LqL5Lu2XHJcbiAgICAgICAgdGhpcy5faW5pdEV2ZW50KCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIF9pbml0RXZlbnQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgIHZhciBtPXRoaXM7XHJcbiAgICAgICAgICBpZih0aGlzLm1vZGU9PVwibGlua1wiKSB7XHJcbiAgICAgICAgICAgICAgYXMoXCIudGFiLWl0ZW1cIikuQ2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdGFiaWQgPSB0aGlzLmdldEF0dHJpYnV0ZShcInRhYi1pZFwiKTtcclxuICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcImluZGV4Lmh0bWw/dGFiPVwiICsgdGFiaWQ7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGFzKFwiLnRhYi1pdGVtXCIpLkNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHRhYmlkID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ0YWItaWRcIik7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZGlkPXgkKFwiLnRhYi1zZWxlY3RlZFwiKS5hdHRyKFwidGFiLWlkXCIpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdGFiID0gY29uZmlndXJlLnRhYkJhci5saXN0W3RhYmlkXTtcclxuICAgICAgICAgICAgICAgICAgaWYodGFiaWQhPXNlbGVjdGVkaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG0uX3NldFNlbGVjdFRhYih0YWJpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBtLm1haW4ubmV4dCgnIycgKyB0YWJpZCwgeyBodG1sOiB0YWIucGFnZVBhdGgsIGNhbGxiYWNrOiB0YWIucGFnZUluaXR9KTtcclxuICAgICAgICAgICAgICAgICAgfWVsc2VcclxuICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgLy/ph43mlrDliqDovb3lvZPliY3pobXpnaJcclxuICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHRhYi5yZWZyZXNoKSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGFiLnJlZnJlc2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIF9zZXRMaW5rUGFnZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgdmFyIHRhYmlkPXgkKCkuR2V0UXVlcnlTdHJpbmcoXCJ0YWJcIik7XHJcbiAgICAgICAgICB0YWJpZD10YWJpZD90YWJpZDpjb25maWd1cmUudGFiQmFyLmRlZmF1bHQ7XHJcbiAgICAgICAgICB0aGlzLl9zZXRTZWxlY3RUYWIodGFiaWQpO1xyXG4gICAgICAgICAgdmFyIHRhYj1jb25maWd1cmUudGFiQmFyLmxpc3RbdGFiaWRdO1xyXG4gICAgICAgICAgdGhpcy5tYWluLm5leHQoJyMnK3RhYmlkLCB7IGh0bWw6IHRhYi5wYWdlUGF0aCxjYWxsYmFjazogdGFiLnBhZ2VJbml0fSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIF9zZXRPbmVQYWdlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICB2YXIgdGFiaWQ9Y29uZmlndXJlLnRhYkJhci5kZWZhdWx0O1xyXG4gICAgICAgICAgdmFyIGVscz14JChcIi50YWItaXRlbVwiKTtcclxuICAgICAgICAgIGZvcih2YXIgaT0wO2k8ZWxzLmxlbmd0aDtpKyspXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdmFyIGVsID0gZWxzW2ldO1xyXG4gICAgICAgICAgICAgIHZhciBpZD14JChlbCkuYXR0cihcInRhYi1pZFwiKTtcclxuICAgICAgICAgICAgICB2YXIgdGFiPWNvbmZpZ3VyZS50YWJCYXIubGlzdFtpZF07XHJcbiAgICAgICAgICAgICAgdGhpcy5tYWluLnN0b3JlbmV4dCgnIycraWQsIHsgaHRtbDp0YWIucGFnZVBhdGgsIGNhbGxiYWNrOiBmdW5jdGlvbiAoKSB7fSB9KTtcclxuICAgICAgICAgICAgICBpZihpZD09dGFiaWQpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0U2VsZWN0VGFiKGlkKTtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5tYWluLm5leHQoJyMnICsgaWQsIHsgaHRtbDogdGFiLnBhZ2VQYXRoLCBjYWxsYmFjazogdGFiLnBhZ2VJbml0fSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBfaW5pdFBhZ2U6ZnVuY3Rpb24oKXtcclxuICAgICAgICBpZih0aGlzLm1vZGU9PVwibGlua1wiKVxyXG4gICAgICAgICB0aGlzLl9zZXRMaW5rUGFnZSgpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgdGhpcy5fc2V0T25lUGFnZSgpO1xyXG4gICAgICB9LFxyXG4gICAgICBfc2V0U2VsZWN0VGFiOmZ1bmN0aW9uKGlkKXtcclxuICAgICAgICAgLy/liKDpmaTpgInkuK3nmoTmoLflvI9cclxuICAgICAgICAgdmFyIHNlbGVjdGVkdGFnPXgkKFwiLnRhYi1zZWxlY3RlZCAuaWNvblwiKVswXS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgIHZhciBzZWxlY3RlZGlkPXgkKFwiLnRhYi1zZWxlY3RlZFwiKS5hdHRyKFwidGFiLWlkXCIpO1xyXG4gICAgICAgICB2YXIgY3VycmVudHRhZz0geCQoXCIjanMtYnRuLXRhYi1cIitpZCtcIiAuaWNvblwiKVswXS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgIHZhciBvbGRpY29uPWNvbmZpZ3VyZS50YWJCYXIubGlzdFtzZWxlY3RlZGlkXS5JY29uO1xyXG4gICAgICAgICB2YXIgY3VycmVudEljb249Y29uZmlndXJlLnRhYkJhci5saXN0W2lkXS5zZWxlY3RlZEljb247XHJcbiAgICAgICAgIGlmKHNlbGVjdGVkdGFnPT1cInN2Z1wiKVxyXG4gICAgICAgICAgICB4JChcIi50YWItc2VsZWN0ZWQgdXNlXCIpLmF0dHIoXCJ4bGluazpocmVmXCIsIFwiI1wiK29sZGljb24pO1xyXG4gICAgICAgICBpZihjdXJyZW50dGFnPT1cInN2Z1wiKVxyXG4gICAgICAgICAgICB4JChcIiNqcy1idG4tdGFiLVwiK2lkK1wiIHVzZVwiKS5hdHRyKFwieGxpbms6aHJlZlwiLCBcIiNcIitjdXJyZW50SWNvbik7XHJcbiAgICAgICAgICBpZihzZWxlY3RlZHRhZz09XCJpbWdcIilcclxuICAgICAgICAgICAgICB4JChcIi50YWItc2VsZWN0ZWQgaW1nXCIpLmF0dHIoXCJzcmNcIiwgb2xkaWNvbik7XHJcbiAgICAgICAgICBpZihjdXJyZW50dGFnPT1cImltZ1wiKVxyXG4gICAgICAgICAgICAgIHgkKFwiI2pzLWJ0bi10YWItXCIraWQrXCIgaW1nXCIpLmF0dHIoXCJzcmNcIixjdXJyZW50SWNvbik7XHJcbiAgICAgICAgIHgkKFwiLnRhYi1zZWxlY3RlZFwiKS5yZW1vdmVDbGFzcyhcInRhYi1zZWxlY3RlZFwiKTtcclxuICAgICAgICAgeCQoXCIjanMtYnRuLXRhYi1cIitpZCkuYWRkQ2xhc3MoXCJ0YWItc2VsZWN0ZWRcIik7XHJcbiAgICAgIH0sXHJcbiAgICAgIF9hZGRUYWI6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgaWYoIWNvbmZpZ3VyZS53aW5kb3cudGFiQmFyKVxyXG4gICAgICAgICB7XHJcbiAgICAgICAgICAgICB0aGlzLm1haW4uY3NzKHtib3R0b206XCIwXCJ9KTtcclxuICAgICAgICAgICAgIHRoaXMudGFiQmFyLmh0bWwoJ3JlbW92ZScpO1xyXG4gICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgIC8v6K6+572u5bqV6YOo6I+c5Y2V55qE6auY5bqmXHJcbiAgICAgICAgIHRoaXMubWFpbi5jc3Moe2JvdHRvbTpjb25maWd1cmUudGFiQmFyLmhlaWdodH0pO1xyXG4gICAgICAgICB0aGlzLnRhYkJhci5jc3Moe2hlaWdodDpjb25maWd1cmUudGFiQmFyLmhlaWdodH0pO1xyXG4gICAgICAgICAvL+iuvue9ruW6lemDqOiPnOWNleeahOaooeW8j1xyXG4gICAgICAgICB0aGlzLnRhYkJhci5hZGRDbGFzcyhjb25maWd1cmUudGFiQmFyLmNzcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgSGVhZGVyPWZ1bmN0aW9uKGlkKSB7dGhpcy5lbD14JChpZCk7fVxyXG4gICAgSGVhZGVyLnByb3RvdHlwZSA9IHt9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpXHJcbiAgICB7XHJcbiAgICAgICAgbmV3IE1haW4oXCIjbWFpblwiKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCk7XHJcblxyXG59KSgpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvanMvc2VydmljZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///7\n");

/***/ })

/******/ });