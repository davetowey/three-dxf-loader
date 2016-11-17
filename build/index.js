'use strict';

/**
 * DxfArrayScanner
 *
 * Based off the AutoCad 2012 DXF Reference
 * http://images.autodesk.com/adsk/files/autocad_2012_pdf_dxf-reference_enu.pdf
 *
 * Reads through an array representing lines of a dxf file. Takes an array and
 * provides an easy interface to extract group code and value pairs.
 * @param data - an array where each element represents a line in the dxf file
 * @constructor
 */
function DxfArrayScanner$1(data) {
	this._pointer = 0;
	this._data = data;
	this._eof = false;
}

/**
 * Gets the next group (code, value) from the array. A group is two consecutive elements
 * in the array. The first is the code, the second is the value.
 * @returns {{code: Number}|*}
 */
DxfArrayScanner$1.prototype.next = function() {
	var group;
	if(!this.hasNext()) {
		if(!this._eof)
			throw new Error('Unexpected end of input: EOF group not read before end of file. Ended on code ' + this._data[this._pointer]);
		else
			throw new Error('Cannot call \'next\' after EOF group has been read');
	}

	group = {
		code: parseInt(this._data[this._pointer])
	};

	this._pointer++;

	group.value = parseGroupValue(group.code, this._data[this._pointer].trim());
	
	this._pointer++;

	if(group.code === 0 && group.value === 'EOF') this._eof = true;

	return group;
};

/**
 * Returns true if there is another code/value pair (2 elements in the array).
 * @returns {boolean}
 */
DxfArrayScanner$1.prototype.hasNext = function() {
	// Check if we have read EOF group code
	if(this._eof) {
		return false;
	}
	
	// We need to be sure there are two lines available
	if(this._pointer > this._data.length - 2) {
		return false;
	}
	return true;
};

/**
 * Returns true if the scanner is at the end of the array
 * @returns {boolean}
 */
DxfArrayScanner$1.prototype.isEOF = function() {
	return this._eof;
};

/**
 * Parse a value to its proper type.
 * See pages 3 - 10 of the AutoCad DXF 2012 reference given at the top of this file
 *
 * @param code
 * @param value
 * @returns {*}
 */
function parseGroupValue(code, value) {
	if(code <= 9) return value;
	if(code >= 10 && code <= 59) return parseFloat(value);
	if(code >= 60 && code <= 99) return parseInt(value);
	if(code >= 100 && code <= 109) return value;
	if(code >= 110 && code <= 149) return parseFloat(value);
	if(code >= 160 && code <= 179) return parseInt(value);
	if(code >= 210 && code <= 239) return parseFloat(value);
	if(code >= 270 && code <= 289) return parseInt(value);
	if(code >= 290 && code <= 299) return parseBoolean(value);
	if(code >= 300 && code <= 369) return value;
	if(code >= 370 && code <= 389) return parseInt(value);
	if(code >= 390 && code <= 399) return value;
	if(code >= 400 && code <= 409) return parseInt(value);
	if(code >= 410 && code <= 419) return value;
	if(code >= 420 && code <= 429) return parseInt(value);
	if(code >= 430 && code <= 439) return value;
	if(code >= 440 && code <= 459) return parseInt(value);
	if(code >= 460 && code <= 469) return parseFloat(value);
	if(code >= 470 && code <= 481) return value;
	if(code === 999) return value;
	if(code >= 1000 && code <= 1009) return value;
	if(code >= 1010 && code <= 1059) return parseFloat(value);
	if(code >= 1060 && code <= 1071) return parseInt(value);

	console.log('WARNING: Group code does not have a defined type: %j', { code: code, value: value });
	return value;
}

/**
 * Parse a boolean according to a 1 or 0 value
 * @param str
 * @returns {boolean}
 */
function parseBoolean(str) {
	if(str === '0') return false;
	if(str === '1') return true;
	throw TypeError('String \'' + str + '\' cannot be cast to Boolean type');
}

var DxfArrayScanner_1 = DxfArrayScanner$1;

/**
 * AutoCad files sometimes use an indexed color value between 1 and 255 inclusive.
 * Each value corresponds to a color. index 1 is red, that is 16711680 or 0xFF0000.
 * index 0 and 256, while included in this array, are actually reserved for inheritance
 * values in AutoCad so they should not be used for index color lookups.
 */

var AutoCadColorIndex = [
 0,
 16711680,
 16776960,
 65280,
 65535,
 255,
 16711935,
 16777215,
 8421504,
 12632256,
 16711680,
 16744319,
 13369344,
 13395558,
 10027008,
 10046540,
 8323072,
 8339263,
 4980736,
 4990502,
 16727808,
 16752511,
 13382400,
 13401958,
 10036736,
 10051404,
 8331008,
 8343359,
 4985600,
 4992806,
 16744192,
 16760703,
 13395456,
 13408614,
 10046464,
 10056268,
 8339200,
 8347455,
 4990464,
 4995366,
 16760576,
 16768895,
 13408512,
 13415014,
 10056192,
 10061132,
 8347392,
 8351551,
 4995328,
 4997670,
 16776960,
 16777087,
 13421568,
 13421670,
 10000384,
 10000460,
 8355584,
 8355647,
 5000192,
 5000230,
 12582656,
 14679935,
 10079232,
 11717734,
 7510016,
 8755276,
 6258432,
 7307071,
 3755008,
 4344870,
 8388352,
 12582783,
 6736896,
 10079334,
 5019648,
 7510092,
 4161280,
 6258495,
 2509824,
 3755046,
 4194048,
 10485631,
 3394560,
 8375398,
 2529280,
 6264908,
 2064128,
 5209919,
 1264640,
 3099686,
 65280,
 8388479,
 52224,
 6736998,
 38912,
 5019724,
 32512,
 4161343,
 19456,
 2509862,
 65343,
 8388511,
 52275,
 6737023,
 38950,
 5019743,
 32543,
 4161359,
 19475,
 2509871,
 65407,
 8388543,
 52326,
 6737049,
 38988,
 5019762,
 32575,
 4161375,
 19494,
 2509881,
 65471,
 8388575,
 52377,
 6737074,
 39026,
 5019781,
 32607,
 4161391,
 19513,
 2509890,
 65535,
 8388607,
 52428,
 6737100,
 39064,
 5019800,
 32639,
 4161407,
 19532,
 2509900,
 49151,
 8380415,
 39372,
 6730444,
 29336,
 5014936,
 24447,
 4157311,
 14668,
 2507340,
 32767,
 8372223,
 26316,
 6724044,
 19608,
 5010072,
 16255,
 4153215,
 9804,
 2505036,
 16383,
 8364031,
 13260,
 6717388,
 9880,
 5005208,
 8063,
 4149119,
 4940,
 2502476,
 255,
 8355839,
 204,
 6710988,
 152,
 5000344,
 127,
 4145023,
 76,
 2500172,
 4129023,
 10452991,
 3342540,
 8349388,
 2490520,
 6245528,
 2031743,
 5193599,
 1245260,
 3089996,
 8323327,
 12550143,
 6684876,
 10053324,
 4980888,
 7490712,
 4128895,
 6242175,
 2490444,
 3745356,
 12517631,
 14647295,
 10027212,
 11691724,
 7471256,
 8735896,
 6226047,
 7290751,
 3735628,
 4335180,
 16711935,
 16744447,
 13369548,
 13395660,
 9961624,
 9981080,
 8323199,
 8339327,
 4980812,
 4990540,
 16711871,
 16744415,
 13369497,
 13395634,
 9961586,
 9981061,
 8323167,
 8339311,
 4980793,
 4990530,
 16711807,
 16744383,
 13369446,
 13395609,
 9961548,
 9981042,
 8323135,
 8339295,
 4980774,
 4990521,
 16711743,
 16744351,
 13369395,
 13395583,
 9961510,
 9981023,
 8323103,
 8339279,
 4980755,
 4990511,
 3355443,
 5987163,
 8684676,
 11382189,
 14079702,
 16777215
];

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var loglevel = createCommonjsModule(function (module) {
/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(definition);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
}(commonjsGlobal, function () {
    "use strict";
    var noop = function() {};
    var undefinedType = "undefined";

    function realMethod(methodName) {
        if (typeof console === undefinedType) {
            return false; // We can't build a real method without a console to log to
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // these private functions always need `this` to be set properly

    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }
    }

    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      var storageKey = "loglevel";
      if (name) {
        storageKey += ":" + name;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public API
       *
       */

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Package-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    return defaultLogger;
}));
});

var DxfArrayScanner = DxfArrayScanner_1;
var AUTO_CAD_COLOR_INDEX = AutoCadColorIndex;

var log = loglevel;

//log.setLevel('trace');
//log.setLevel('debug');
//log.setLevel('info');
//log.setLevel('warn');
log.setLevel('error');
//log.setLevel('silent');


function DxfParser$1(stream) {}

DxfParser$1.prototype.parse = function(source, done) {
	throw new Error("read() not implemented. Use readSync()");
};

DxfParser$1.prototype.parseSync = function(source) {
	if(typeof(source) === 'string') {
		return this._parse(source);
	}else {
		console.error('Cannot read dxf source of type `' + typeof(source));
		return null;
	}
};

DxfParser$1.prototype.parseStream = function(stream, done) {

	var dxfString = "";
	var self = this;

	stream.on('data', onData);
	stream.on('end', onEnd);
	stream.on('error', onError);

	function onData(chunk) {
		dxfString += chunk;
	}

	function onEnd() {
		try {
			var dxf = self._parse(dxfString);
		}catch(err) {
			return done(err);
		}
		done(null, dxf);
	}

	function onError(err) {
		done(err);
	}
};

DxfParser$1.prototype._parse = function(dxfString) {
	var scanner, curr, dxf = {}, lastHandle = 0;
	var dxfLinesArray = dxfString.split(/\r\n|\r|\n/g);

	scanner = new DxfArrayScanner(dxfLinesArray);
	if(!scanner.hasNext()) throw Error('Empty file');

	var parseAll = function() {
		curr = scanner.next();
		while(!scanner.isEOF()) {
			if(curr.code === 0 && curr.value === 'SECTION') {
				curr = scanner.next();

				// Be sure we are reading a section code
				if (curr.code !== 2) {
					console.error('Unexpected code %s after 0:SECTION', debugCode(curr));
					curr = scanner.next();
					continue;
				}

				if (curr.value === 'HEADER') {
					log.debug('> HEADER');
					dxf.header = parseHeader();
					log.debug('<');
				} else if (curr.value === 'BLOCKS') {
					log.debug('> BLOCKS');
					dxf.blocks = parseBlocks();
					log.debug('<');
				} else if(curr.value === 'ENTITIES') {
					log.debug('> ENTITIES');
					dxf.entities = parseEntities(false);
					log.debug('<');
				} else if(curr.value === 'TABLES') {
					log.debug('> TABLES');
					dxf.tables = parseTables();
					log.debug('<');
				} else if(curr.value === 'EOF') {
					log.debug('EOF');
				} else {
					log.warn('Skipping section \'%s\'', curr.value);
				}
			} else {
				curr = scanner.next();
			}
			// If is a new section
		}
	};

	var groupIs = function(code, value) {
		return curr.code === code && curr.value === value;
	};

	/**
	 *
	 * @return {object} header
	 */
	var parseHeader = function() {
		// interesting variables:
		//  $ACADVER, $VIEWDIR, $VIEWSIZE, $VIEWCTR, $TDCREATE, $TDUPDATE
		// http://www.autodesk.com/techpubs/autocad/acadr14/dxf/header_section_al_u05_c.htm
		// Also see VPORT table entries
		var currVarName = null, currVarValue = null;
		var header = {};
		// loop through header variables
		curr = scanner.next();

		while(true) {
			if(groupIs(0, 'ENDSEC')) {
				if(currVarName) header[currVarName] = currVarValue;
				break;
			} else if(curr.code === 9) {
				if(currVarName) header[currVarName] = currVarValue;
				currVarName = curr.value;
				// Filter here for particular variables we are interested in
			} else {
				if(curr.code === 10) {
					currVarValue = { x: curr.value };
				} else if(curr.code === 20) {
					currVarValue.y = curr.value;
				} else if(curr.code === 30) {
					currVarValue.z = curr.value;
				} else {
					currVarValue = curr.value;
				}
			}
			curr = scanner.next();
		}
		// console.log(util.inspect(header, { colors: true, depth: null }));
		curr = scanner.next(); // swallow up ENDSEC
		return header;
	};


	/**
	 *
	 */
	var parseBlocks = function() {
		var blocks = {}, block;
		
        curr = scanner.next();
		
		while(curr.value !== 'EOF') {
			if(groupIs(0, 'ENDSEC')) {
				break;
			}

			if(groupIs(0, 'BLOCK')) {
				log.debug('block {');
				block = parseBlock();
				log.debug('}');
				ensureHandle(block);
                if(!block.name)
                    log.error('block with handle "' + block.handle + '" is missing a name.');
				else
                    blocks[block.name] = block;
			} else {
				logUnhandledGroup(curr);
				curr = scanner.next();
			}
		}
		return blocks;
	};

	var parseBlock = function() {
		var block = {};
		curr = scanner.next();

		while(curr.value !== 'EOF') {
			switch(curr.code) {
				case 1:
					block.xrefPath = curr.value;
					curr = scanner.next();
					break;
				case 2:
					block.name = curr.value;
					curr = scanner.next();
					break;
				case 3:
					block.name2 = curr.value;
					curr = scanner.next();
					break;
				case 5:
					block.handle = curr.value;
					curr = scanner.next();
					break;
				case 8:
					block.layer = curr.value;
					curr = scanner.next();
					break;
				case 10:
					block.position = parsePoint();
					break;
				case 67:
					block.paperSpace = (curr.value && curr.value == 1) ? true : false;
					curr = scanner.next();
					break;
				case 70:
					if (curr.value != 0) {
						//if(curr.value & BLOCK_ANONYMOUS_FLAG) console.log('  Anonymous block');
						//if(curr.value & BLOCK_NON_CONSTANT_FLAG) console.log('  Non-constant attributes');
						//if(curr.value & BLOCK_XREF_FLAG) console.log('  Is xref');
						//if(curr.value & BLOCK_XREF_OVERLAY_FLAG) console.log('  Is xref overlay');
						//if(curr.value & BLOCK_EXTERNALLY_DEPENDENT_FLAG) console.log('  Is externally dependent');
						//if(curr.value & BLOCK_RESOLVED_OR_DEPENDENT_FLAG) console.log('  Is resolved xref or dependent of an xref');
						//if(curr.value & BLOCK_REFERENCED_XREF) console.log('  This definition is a referenced xref');
						block.type = curr.value;
					}
					curr = scanner.next();
					break;
				case 100:
					// ignore class markers
					curr = scanner.next();
					break;
				case 330:
					block.ownerHandle = curr.value;
					curr = scanner.next();
					break;
				case 0:
					if(curr.value == 'ENDBLK')
						break;
					block.entities = parseEntities(true);
					break;
				default:
					logUnhandledGroup(curr);
					curr = scanner.next();
			}
			
			if(groupIs(0, 'ENDBLK')) {
				curr = scanner.next();
				break;
			}
		}
		return block;
	};

	/**
	 * parseTables
	 * @return {Object} Object representing tables
	 */
	var parseTables = function() {
		var tables = {};
		curr = scanner.next();
		while(curr.value !== 'EOF') {
			if(groupIs(0, 'ENDSEC'))
				break;

			if(groupIs(0, 'TABLE')) {
				curr = scanner.next();

				var tableDefinition = tableDefinitions[curr.value];
				if(tableDefinition) {
					log.debug(curr.value + ' Table {');
					tables[tableDefinitions[curr.value].tableName] = parseTable();
					log.debug('}');
				} else {
					log.debug('Unhandled Table ' + curr.value);
				}
			} else {
				// else ignored
				curr = scanner.next();
			}
		}

		curr = scanner.next();
		return tables;
	};

	const END_OF_TABLE_VALUE = 'ENDTAB';

	var parseTable = function() {
		var tableDefinition = tableDefinitions[curr.value],
			table = {},
			expectedCount = 0,
			actualCount;

		curr = scanner.next();
		while(!groupIs(0, END_OF_TABLE_VALUE)) {

			switch(curr.code) {
				case 5:
					table.handle = curr.value;
					curr = scanner.next();
					break;
				case 330:
					table.ownerHandle = curr.value;
					curr = scanner.next();
					break;
				case 100:
					if(curr.value === 'AcDbSymbolTable') {
						// ignore
						curr = scanner.next();
					}else{
						logUnhandledGroup(curr);
						curr = scanner.next();
					}
					break;
				case 70:
					expectedCount = curr.value;
					curr = scanner.next();
					break;
				case 0:
					if(curr.value === tableDefinition.dxfSymbolName) {
						table[tableDefinition.tableRecordsProperty] = tableDefinition.parseTableRecords();
					} else {
						logUnhandledGroup(curr);
						curr = scanner.next();
					}
					break;
				default:
					logUnhandledGroup(curr);
					curr = scanner.next();
			}
		}
		var tableRecords = table[tableDefinition.tableRecordsProperty];
		if(tableRecords) {
			if(tableRecords.constructor === Array){
				actualCount = tableRecords.length;
			} else if(typeof(tableRecords) === 'object') {
				actualCount = Object.keys(tableRecords).length;
			}
			if(expectedCount !== actualCount) log.warn('Parsed ' + actualCount + ' ' + tableDefinition.dxfSymbolName + '\'s but expected ' + expectedCount);
		}
		curr = scanner.next();
		return table;
	};

	var parseViewPortRecords = function() {
		var viewPorts = [], // Multiple table entries may have the same name indicating a multiple viewport configuration
			viewPort = {};

		log.debug('ViewPort {');
		curr = scanner.next();
		while(!groupIs(0, END_OF_TABLE_VALUE)) {

			switch(curr.code) {
				case 2: // layer name
					viewPort.name = curr.value;
					curr = scanner.next();
					break;
				case 10:
					viewPort.lowerLeftCorner = parsePoint();
					break;
				case 11:
					viewPort.upperRightCorner = parsePoint();
					break;
				case 12:
					viewPort.center = parsePoint();
					break;
				case 13:
					viewPort.snapBasePoint = parsePoint();
					break;
				case 14:
					viewPort.snapSpacing = parsePoint();
					break;
				case 15:
					viewPort.gridSpacing = parsePoint();
					break;
				case 16:
					viewPort.viewDirectionFromTarget = parsePoint();
					break;
				case 17:
					viewPort.viewTarget = parsePoint();
					break;
				case 42:
					viewPort.lensLength = curr.value;
					curr = scanner.next();
					break;
				case 43:
					viewPort.frontClippingPlane = curr.value;
					curr = scanner.next();
					break;
				case 44:
					viewPort.backClippingPlane = curr.value;
					curr = scanner.next();
					break;
				case 45:
					viewPort.viewHeight = curr.value;
					curr = scanner.next();
					break;
				case 50:
					viewPort.snapRotationAngle = curr.value;
					curr = scanner.next();
					break;
				case 51:
					viewPort.viewTwistAngle = curr.value;
					curr = scanner.next();
					break;
                case 79:
                    viewPort.orthographicType = curr.value;
                    curr = scanner.next();
                    break;
				case 110:
					viewPort.ucsOrigin = parsePoint();
					break;
				case 111:
					viewPort.ucsXAxis = parsePoint();
					break;
				case 112:
					viewPort.ucsYAxis = parsePoint();
					break;
				case 110:
					viewPort.ucsOrigin = parsePoint();
					break;
				case 281:
					viewPort.renderMode = curr.value;
					curr = scanner.next();
					break;
				case 281:
					// 0 is one distant light, 1 is two distant lights
					viewPort.defaultLightingType = curr.value;
					curr = scanner.next();
					break;
				case 292:
					viewPort.defaultLightingOn = curr.value;
					curr = scanner.next();
					break;
				case 330:
					viewPort.ownerHandle = curr.value;
					curr = scanner.next();
					break;
				case 63:
				case 421:
				case 431:
					viewPort.ambientColor = curr.value;
					curr = scanner.next();
					break;
				case 0:
					// New ViewPort
					if(curr.value === 'VPORT') {
						log.debug('}');
						viewPorts.push(viewPort);
						log.debug('ViewPort {');
						viewPort = {};
						curr = scanner.next();
					}
					break;
				default:
					logUnhandledGroup(curr);
					curr = scanner.next();
					break;
			}
		}
		// Note: do not call scanner.next() here,
		//  parseTable() needs the current group
		log.debug('}');
		viewPorts.push(viewPort);

		return viewPorts;
	};

	var parseLineTypes = function() {
		var ltypes = {},
			ltypeName,
			ltype = {},
			length;

		log.debug('LType {');
		curr = scanner.next();
		while(!groupIs(0, 'ENDTAB')) {

			switch(curr.code) {
				case 2:
					ltype.name = curr.value;
					ltypeName = curr.value;
					curr = scanner.next();
					break;
				case 3:
					ltype.description = curr.value;
					curr = scanner.next();
					break;
				case 73: // Number of elements for this line type (dots, dashes, spaces);
					length = curr.value;
					if(length > 0) ltype.pattern = [];
					curr = scanner.next();
					break;
				case 40: // total pattern length
					ltype.patternLength = curr.value;
					curr = scanner.next();
					break;
				case 49:
					ltype.pattern.push(curr.value);
					curr = scanner.next();
					break;
				case 0:
					log.debug('}');
					if(length > 0 && length !== ltype.pattern.length) log.warn('lengths do not match on LTYPE pattern');
					ltypes[ltypeName] = ltype;
					ltype = {};
					log.debug('LType {');
					curr = scanner.next();
					break;
				default:
					curr = scanner.next();
			}
		}

		log.debug('}');
		ltypes[ltypeName] = ltype;
		return ltypes;
	};

	var parseLayers = function() {
		var layers = {},
			layerName,
			layer = {};

		log.debug('Layer {');
		curr = scanner.next();
		while(!groupIs(0, 'ENDTAB')) {

			switch(curr.code) {
				case 2: // layer name
					layer.name = curr.value;
					layerName = curr.value;
					curr = scanner.next();
					break;
				case 62: // color, visibility
					layer.visible = curr.value <= 0;
					// TODO 0 and 256 are BYBLOCK and BYLAYER respectively. Need to handle these values for layers?.
					layer.color = getAcadColor(Math.abs(curr.value));
					curr = scanner.next();
					break;
				case 0:
					// New Layer
					if(curr.value === 'LAYER') {
						log.debug('}');
						layers[layerName] = layer;
						log.debug('Layer {');
						layer = {};
						layerName = undefined;
						curr = scanner.next();
					}
					break;
				default:
					logUnhandledGroup(curr);
					curr = scanner.next();
					break;
			}
		}
		// Note: do not call scanner.next() here,
		//  parseLayerTable() needs the current group
		log.debug('}');
		layers[layerName] = layer;

		return layers;
	};

	var tableDefinitions = {
		VPORT: {
			tableRecordsProperty: 'viewPorts',
			tableName: 'viewPort',
			dxfSymbolName: 'VPORT',
			parseTableRecords: parseViewPortRecords
		},
		LTYPE: {
			tableRecordsProperty: 'lineTypes',
			tableName: 'lineType',
			dxfSymbolName: 'LTYPE',
			parseTableRecords: parseLineTypes
		},
		LAYER: {
			tableRecordsProperty: 'layers',
			tableName: 'layer',
			dxfSymbolName: 'LAYER',
			parseTableRecords: parseLayers
		}
	};

	/**
	 * Is called after the parser first reads the 0:ENTITIES group. The scanner
	 * should be on the start of the first entity already.
	 * @return {Array} the resulting entities
	 */
	var parseEntities = function(forBlock) {
		var entities = [];

		var endingOnValue = forBlock ? 'ENDBLK' : 'ENDSEC';

		if (!forBlock) {
			curr = scanner.next();
		}
		while(true) {

			if(curr.code === 0) {
				if(curr.value === endingOnValue) {
					break;
				}
				
				var entity;
				// Supported entities here
				if(curr.value === 'LWPOLYLINE') {
					log.debug('LWPOLYLINE {');
					entity = parseLWPOLYLINE();
					log.debug('}');
				} else if(curr.value === 'POLYLINE') {
					log.debug('POLYLINE {');
					entity = parsePOLYLINE();
					log.debug('}');
				} else if(curr.value === 'LINE') {
					log.debug('LINE {');
					entity = parseLINE();
					log.debug('}');
				} else if(curr.value === 'CIRCLE') {
					log.debug('CIRCLE {');
					entity = parseCIRCLE();
					log.debug('}');
				} else if(curr.value === 'ARC') {
					log.debug('ARC {');
					// similar properties to circle?
					entity = parseCIRCLE();
					log.debug('}');
				} else if(curr.value === 'TEXT') {
					log.debug('TEXT {');
					entity = parseTEXT();
					log.debug('}');
				} else if(curr.value === 'DIMENSION') {
					log.debug('DIMENSION {');
					entity = parseDIMENSION();
					log.debug('}');
				} else if(curr.value === 'SOLID') {
					log.debug('SOLID {');
					entity = parseSOLID();
					log.debug('}');
				} else if(curr.value === 'POINT') {
					log.debug('POINT {');
					entity = parsePOINT();
					log.debug('}');
				} else if(curr.value === 'MTEXT') {
					log.debug('MTEXT {');
					entity = parseMTEXT();
					log.debug('}');
				} else if(curr.value === 'ATTDEF') {
					log.debug('ATTDEF {');
					entity = parseATTDEF();
					log.debug('}');
				} else if(curr.value === 'INSERT') {
					log.debug('INSERT {');
					entity = parseINSERT();
					log.debug('}');
				} else {
					log.warn('Unhandled entity ' + curr.value);
					curr = scanner.next();
					continue;
				}
				ensureHandle(entity);
				entities.push(entity);
			} else {
				// ignored lines from unsupported entity
				curr = scanner.next();
			}
		}
		// console.log(util.inspect(entities, { colors: true, depth: null }));
		if(endingOnValue == 'ENDSEC') curr = scanner.next(); // swallow up ENDSEC, but not ENDBLK
		return entities;
	};

	/**
	 *
	 * @param entity
	 */
	var checkCommonEntityProperties = function(entity) {
		switch(curr.code) {
			case 0:
				entity.type = curr.value;
				curr = scanner.next();
				break;
			case 5:
				entity.handle = curr.value;
				curr = scanner.next();
				break;
			case 6:
				entity.lineType = curr.value;
				curr = scanner.next();
				break;
			case 8: // Layer name
				entity.layer = curr.value;
				curr = scanner.next();
				break;
			case 48:
				entity.lineTypeScale = curr.value;
				curr = scanner.next();
				break;
			case 60:
				entity.visible = curr.value === 0;
				curr = scanner.next();
				break;
			case 62: // Acad Index Color. 0 inherits ByBlock. 256 inherits ByLayer. Default is bylayer
				entity.colorIndex = curr.value;
				entity.color = getAcadColor(Math.abs(curr.value));
				curr = scanner.next();
				break;
			case 67:
				entity.inPaperSpace = curr.value !== 0;
				curr = scanner.next();
				break;
			case 330:
				entity.ownerHandle = curr.value;
				curr = scanner.next();
				break;
			case 347:
				entity.materialObjectHandle = curr.value;
				curr = scanner.next();
				break;
			case 370:
				// This is technically an enum. Not sure where -2 comes from.
				//From https://www.woutware.com/Forum/Topic/955/lineweight?returnUrl=%2FForum%2FUserPosts%3FuserId%3D478262319
				// An integer representing 100th of mm, must be one of the following values:
				// 0, 5, 9, 13, 15, 18, 20, 25, 30, 35, 40, 50, 53, 60, 70, 80, 90, 100, 106, 120, 140, 158, 200, 211.
				entity.lineweight = curr.value;
				curr = scanner.next();
				break;
			case 420: // TrueColor Color
				entity.color = curr.value;
				curr = scanner.next();
				break;
			case 100:
                //ignore
                curr = scanner.next();
                break;
			default:
				logUnhandledGroup(curr);
				curr = scanner.next();
				break;
		}
	};


	var parseVertex = function() {
		var entity = { type: curr.value };
		curr = scanner.next();
		while(curr !== 'EOF') {
			if(curr.code === 0) break;

			switch(curr.code) {
				case 10:	// X
					entity.x = curr.value;
					curr = scanner.next();
					break;
				case 20: // Y
					entity.y = curr.value;
					curr = scanner.next();
					break;
				case 30: // Z
					entity.z = curr.value;
					curr = scanner.next();
					break;
				case 40: // start width
				case 41: // end width
				case 42: // bulge
					curr = scanner.next();
					break;
				case 70: // flags
					entity.curveFittingVertex = (curr.value & 1) !== 0;
					entity.curveFitTangent = (curr.value & 2) !== 0;
					entity.splineVertex = (curr.value & 8) !== 0;
					entity.splineControlPoint = (curr.value & 16) !== 0;
					entity.threeDPolylineVertex = (curr.value & 32) !== 0;
					entity.threeDPolylineMesh = (curr.value & 64) !== 0;
					entity.polyfaceMeshVertex = (curr.value & 128) !== 0;
					curr = scanner.next();
					break;
				case 50: // curve fit tangent direction
				case 71: // polyface mesh vertex index
				case 72: // polyface mesh vertex index
				case 73: // polyface mesh vertex index
				case 74: // polyface mesh vertex index
					curr = scanner.next();
					break;
				default:
					checkCommonEntityProperties(entity);
					break;
			}
		}
		return entity;
	};

	var parseSeqEnd = function() {
        var entity = { type: curr.value };
        curr = scanner.next();
        while(curr != 'EOF') {
            if (curr.code == 0) break;
            checkCommonEntityProperties(entity);
        }

		return entity;
	};

	/**
	 * Parses a 2D or 3D point, returning it as an object with x, y, and
	 * (sometimes) z property if it is 3D. It is assumed the current group
	 * is x of the point being read in, and scanner.next() will return the
	 * y. The parser will determine if there is a z point automatically.
	 * @return {Object} The 2D or 3D point as an object with x, y[, z]
	 */
	var parsePoint = function() {
		var point = {},
			code = curr.code;

		point.x = curr.value;

		code += 10;
		curr = scanner.next();
		if(curr.code != code)
			throw new Error('Expected code for point value to be ' + code +
			' but got ' + curr.code + '.');
		point.y = curr.value;

		code += 10;
		curr = scanner.next();
		if(curr.code != code)
			return point;
		point.z = curr.value;

		curr = scanner.next(); // advance the scanner before returning
		return point;
	};

	var parseLWPolylineVertices = function(n) {
		if(!n || n <= 0) throw Error('n must be greater than 0 verticies');
		var vertices = [], i;
		var vertexIsStarted = false;
		var vertexIsFinished = false;

		for(i = 0; i < n; i++) {
			var vertex = {};
			while(curr !== 'EOF') {
				if(curr.code === 0 || vertexIsFinished) break;
	
				switch(curr.code) {
					case 10: // X
						if(vertexIsStarted) {
							vertexIsFinished = true;
							continue;
						}
						vertex.x = curr.value;
						vertexIsStarted = true;
						break;
					case 20: // Y
						vertex.y = curr.value;
						break;
					case 30: // Z
						vertex.z = curr.value;
						break;
					case 40: // start width
						vertex.startWidth = curr.value;
						break;
					case 41: // end width
						vertex.endWidth = curr.value;
						break;
					case 42: // bulge
						if(curr.value != 0) vertex.bulge = curr.value;
						break;
					default:
						//todo: mark unhandled somehow?
						curr = scanner.next();
						continue;
				}
				curr = scanner.next();
			}
			// See https://groups.google.com/forum/#!topic/comp.cad.autocad/9gn8s5O_w6E
			vertices.push(vertex);
			vertexIsStarted = false;
			vertexIsFinished = false;
		}
		return vertices;
	};

	var parsePolylineVertices = function() {
		var vertices = [];
		while (curr !== 'EOF') {
			if (curr.code === 0) {
				if (curr.value === 'VERTEX') {
					vertices.push(parseVertex());
				} else if (curr.value === 'SEQEND') {
					parseSeqEnd();
					break;
				}
			}
		}
		return vertices;
	};

	var parseMTEXT = function() {
		var entity = { type: curr.value };
		curr = scanner.next();
		while(curr !== 'EOF') {
			if(curr.code === 0) break;

			switch(curr.code) {
                case 1:
                    entity.text = curr.value;
                    curr = scanner.next();
                    break;
                case 3:
                    entity.text += curr.value;
                    curr = scanner.next();
                    break;
                case 10:
                    entity.position = parsePoint();
                    break;
                case 40:
                    entity.height = curr.value;
                    curr = scanner.next();
                    break;
                case 41:
                    entity.width = curr.value;
                    curr = scanner.next();
                    break;
                case 71:
                    entity.attachmentPoint = curr.value;
                    curr = scanner.next();
                    break;
                case 72:
                    entity.drawingDirection = curr.value;
                    curr = scanner.next();
                    break;
				default:
					checkCommonEntityProperties(entity);
					break;
			}
		}
		return entity;
	};

	var parseATTDEF = function() {
		var entity = {
			type: curr.value,
			scale: 1,
			textStyle: 'STANDARD'
		 };
		curr = scanner.next();
		while (curr !== 'EOF') {
			if (curr.code === 0) {
				break;
			}
			switch(curr.code) {
				case 1:
					entity.text = curr.value;
					curr = scanner.next();
					break;
				case 2:
					entity.tag = curr.value;
					curr = scanner.next();
					break;
				case 3:
					entity.prompt = curr.value;
					curr = scanner.next();
					break;
				case 7:
					entity.textStyle = curr.value;
					curr = scanner.next();
					break;
				case 10:
					entity.x = curr.value;
					curr = scanner.next();
					break;
				case 20:
					entity.y = curr.value;
					curr = scanner.next();
					break;
				case 30:
					entity.z = curr.value;
					curr = scanner.next();
					break;
				case 39:
					entity.thickness = curr.value;
					curr = scanner.next();
					break;
				case 40:
					entity.textHeight = curr.value;
					curr = scanner.next();
					break;
				case 41:
					entity.scale = curr.value;
					curr = scanner.next();
					break;
				case 50:
					entity.rotation = curr.value;
					curr = scanner.next();
					break;
				case 51:
					entity.obliqueAngle = curr.value;
					curr = scanner.next();
					break;
				case 70:
					entity.invisible = !!(curr.value & 0x01);
					entity.constant = !!(curr.value & 0x02);
					entity.verificationRequired = !!(curr.value & 0x04);
					entity.preset = !!(curr.value & 0x08);
					curr = scanner.next();
					break;
				case 71:
					entity.backwards = !!(curr.value & 0x02);
					entity.mirrored = !!(curr.value & 0x04);
					curr = scanner.next();
					break;
				case 72:
					// TODO: enum values?
					entity.horizontalJustification = curr.value;
					curr = scanner.next();
					break;
				case 73:
					entity.fieldLength = curr.value;
					curr = scanner.next();
					break;
				case 74:
					// TODO: enum values?
					entity.verticalJustification = curr.value;
					curr = scanner.next();
					break;
				case 100:
					// subclass
					curr = scanner.next();
					break;
				case 210:
					entity.extrusionDirectionX = curr.value;
					curr = scanner.next();
					break;
				case 220:
					entity.extrusionDirectionY = curr.value;
					curr = scanner.next();
					break;
				case 230:
					entity.extrusionDirectionZ = curr.value;
					curr = scanner.next();
					break;
				default:
					checkCommonEntityProperties(entity);
					break;
			}
		}

		return entity;
	};

	/**
	 * Called when the parser reads the beginning of a new entity,
	 * 0:LWPOLYLINE. Scanner.next() will return the first attribute of the
	 * entity.
	 * @return {Object} the entity parsed
	 */
	var parseLWPOLYLINE = function() {
		var entity = { type: curr.value, vertices: [] },
			numberOfVertices = 0;
		curr = scanner.next();
		while(curr !== 'EOF') {
			if(curr.code === 0) break;

			switch(curr.code) {
				case 38:
					entity.elevation = curr.value;
					curr = scanner.next();
					break;
				case 39:
					entity.depth = curr.value;
					curr = scanner.next();
					break;
				case 70: // 1 = Closed shape, 128 = plinegen?, 0 = default
					entity.shape = (curr.value === 1);
					curr = scanner.next();
					break;
				case 90:
					numberOfVertices = curr.value;
					curr = scanner.next();
					break;
				case 10: // X coordinate of point
					entity.vertices = parseLWPolylineVertices(numberOfVertices);
					break;
				case 43:
					if(curr.value !== 0) entity.width = curr.value;
					curr = scanner.next();
					break;
				default:
					checkCommonEntityProperties(entity);
					break;
			}
		}
		return entity;
	};

	/**
	 * Called when the parser reads the beginning of a new entity,
	 * 0:POLYLINE. Scanner.next() will return the first attribute of the
	 * entity.
	 * @return {Object} the entity parsed
	 */
	var parsePOLYLINE = function() {
		var entity = { type: curr.value, vertices: [] };
		curr = scanner.next();
		while(curr !== 'EOF') {
			if(curr.code === 0) break;

			switch(curr.code) {
				case 10: // always 0
				case 20: // always 0
				case 30: // elevation
				case 39: // thickness
                    entity.thickness = curr.value;
					curr = scanner.next();
					break;
				case 40: // start width
				case 41: // end width
					curr = scanner.next();
					break;
				case 70:
					entity.shape = (curr.value & 1) !== 0;
                    entity.includesCurveFitVertices = (curr.value & 2) !== 0;
                    entity.includesSplineFitVertices = (curr.value & 4) !== 0;
                    entity.is3dPolyline = (curr.value & 8) !== 0;
                    entity.is3dPolygonMesh = (curr.value & 16) !== 0;
                    entity.is3dPolygonMeshClosed = (curr.value & 32) !== 0; // 32 = The polygon mesh is closed in the N direction
                    entity.isPolyfaceMesh = (curr.value & 64) !== 0;
                    entity.hasContinuousLinetypePattern = (curr.value & 128) !== 0;
					curr = scanner.next();
					break;
				case 71: // Polygon mesh M vertex count
				case 72: // Polygon mesh N vertex count
				case 73: // Smooth surface M density
				case 74: // Smooth surface N density
				case 75: // Curves and smooth surface type
					curr = scanner.next();
					break;
				case 210:
                    extrusionDirection = parsePoint();
					break;
				default:
					checkCommonEntityProperties(entity);
					break;
			}
		}

		entity.vertices = parsePolylineVertices();

		return entity;
	};


	/**
	 * Called when the parser reads the beginning of a new entity,
	 * 0:LINE. Scanner.next() will return the first attribute of the
	 * entity.
	 * @return {Object} the entity parsed
	 */
	var parseLINE = function() {
		var entity = { type: curr.value, vertices: [] };
		curr = scanner.next();
		while(curr !== 'EOF') {
			if(curr.code === 0) break;

			switch(curr.code) {
				case 10: // X coordinate of point
					entity.vertices.unshift(parsePoint());
					break;
				case 11:
					entity.vertices.push(parsePoint());
					break;
				case 210:
					entity.extrusionDirection = parsePoint();
					break;
				case 100:
					if(curr.value == 'AcDbLine') {
						curr = scanner.next();
						break;
					}
				default:
					checkCommonEntityProperties(entity);
					break;
			}
		}
		return entity;
	};

	/**
	 * Used to parse a circle or arc entity.
	 * @return {Object} the entity parsed
	 */
	var parseCIRCLE = function() {
		var entity, endAngle;
		entity = { type: curr.value };
		curr = scanner.next();
		while(curr !== 'EOF') {
			if(curr.code === 0) break;

			switch(curr.code) {
				case 10: // X coordinate of point
					entity.center = parsePoint();
					break;
				case 40: // radius
					entity.radius = curr.value;
					curr = scanner.next();
					break;
				case 50: // start angle
					entity.startAngle = Math.PI / 180 * curr.value;
					curr = scanner.next();
					break;
				case 51: // end angle
					endAngle = Math.PI / 180 * curr.value;
					if(endAngle < entity.startAngle)
						entity.angleLength = endAngle + 2 * Math.PI - entity.startAngle;
					else
						entity.angleLength = endAngle - entity.startAngle;
					entity.endAngle = endAngle;
					curr = scanner.next();
					break;
				default: // ignored attribute
					checkCommonEntityProperties(entity);
					break;
			}
		}
		return entity;
	};

	var parseTEXT = function() {
		var entity;
		entity = { type: curr.value };
		curr = scanner.next();
		while(curr !== 'EOF') {
			if(curr.code === 0) break;
			switch(curr.code) {
				case 10: // X coordinate of 'first alignment point'
					entity.startPoint = parsePoint();
					break;
				case 11: // X coordinate of 'second alignment point'
					entity.endPoint = parsePoint();
					break;
				case 40: // Text height
					entity.textHeight = curr.value;
					curr = scanner.next();
					break;
				case 41:
					entity.xScale = curr.value;
					curr = scanner.next();
					break;
				case 1: // Text
					entity.text = curr.value;
					curr = scanner.next();
					break;
				// NOTE: 72 and 73 are meaningless without 11 (second alignment point)
				case 72: // Horizontal alignment
					entity.halign = curr.value;
					curr = scanner.next();
					break;
				case 73: // Vertical alignment
					entity.valign = curr.value;
					curr = scanner.next();
					break;
				default: // check common entity attributes
					checkCommonEntityProperties(entity);
					break;
			}
		}
		return entity;
	};

	var parseDIMENSION = function() {
		var entity;
		entity = { type: curr.value };
		curr = scanner.next();
		while(curr !== 'EOF') {
			if(curr.code === 0) break;

			switch(curr.code) {
				case 2: // Referenced block name
					entity.block = curr.value;
					curr = scanner.next();
					break;
				case 10: // X coordinate of 'first alignment point'
					entity.anchorPoint = parsePoint();
					break;
				case 11:
					entity.middleOfText = parsePoint();
					break;
				case 71: // 5 = Middle center
					entity.attachmentPoint = curr.value;
					curr = scanner.next();
					break;
				case 42: // Actual measurement
					entity.actualMeasurement = curr.value;
					curr = scanner.next();
					break;
				case 1: // Text entered by user explicitly
					entity.text = curr.value;
					curr = scanner.next();
					break;
				case 50: // Angle of rotated, horizontal, or vertical dimensions
					entity.angle = curr.value;
					curr = scanner.next();
					break;
				default: // check common entity attributes
					checkCommonEntityProperties(entity);
					break;
			}
		}

		return entity;
	};

	var parseSOLID = function() {
		var entity;
		entity = { type: curr.value };
		entity.points = [];
		curr = scanner.next();
		while(curr !== 'EOF') {
			if(curr.code === 0) break;

			switch(curr.code) {
				case 10:
					entity.points[0] = parsePoint();
					break;
				case 11:
					entity.points[1] = parsePoint();
					break;
				case 12:
					entity.points[2] = parsePoint();
					break;
				case 13:
					entity.points[3] = parsePoint();
					break;
				case 210:
					entity.extrusionDirection = parsePoint();
					curr = scanner.next();
					break;
				default: // check common entity attributes
					checkCommonEntityProperties(entity);
					break;
			}
		}

		return entity;
	};

	var parseINSERT = function() {
		var entity;
		entity = { type: curr.value };
		curr = scanner.next();
		while(curr !== 'EOF') {
			if(curr.code === 0) break;

			switch(curr.code) {
				case 2:
					entity.name = curr.value;
					curr = scanner.next();
					break;
				case 41:
					entity.xScale = curr.value;
					curr = scanner.next();
					break;
				case 42:
					entity.yScale = curr.value;
					curr = scanner.next();
					break;
				case 43:
					entity.zScale = curr.value;
					curr = scanner.next();
					break;
				case 10:
					entity.position = parsePoint();
					break;
				case 50:
					entity.rotation = curr.value;
					curr = scanner.next();
					break;
				case 70:
					entity.columnCount = curr.value;
					curr = scanner.next();
					break;
				case 71:
					entity.rowCount = curr.value;
					curr = scanner.next();
					break;
				case 44:
					entity.columnSpacing = curr.value;
					curr = scanner.next();
					break;
				case 45:
					entity.rowSpacing = curr.value;
					curr = scanner.next();
					break;
				case 210:
					entity.extrusionDirection = parsePoint();
					break;
				default: // check common entity attributes
					checkCommonEntityProperties(entity);
					break;
			}
		}

		return entity;
	};

	var parsePOINT = function() {
		var entity;
		entity = { type: curr.value };
		curr = scanner.next();
		while(curr !== 'EOF') {
			if(curr.code === 0) break;

			switch(curr.code) {
				case 10:
					entity.position = parsePoint();
					break;
				case 39:
					entity.thickness = curr.value;
					curr = scanner.next();
					break;
				case 210:
					entity.extrusionDirection = parsePoint();
					break;
				case 100:
					if(curr.value == 'AcDbPoint') {
						curr = scanner.next();
						break;
					}
				default: // check common entity attributes
					checkCommonEntityProperties(entity);
					break;
			}
		}

		return entity;
	};
	
	var ensureHandle = function(entity) {
		if(!entity) throw new TypeError('entity cannot be undefined or null');
		
		if(!entity.handle) entity.handle = lastHandle++; 
	};

	parseAll();
	return dxf;
};

function logUnhandledGroup(curr) {
	log.debug('unhandled group ' + debugCode(curr));
}


function debugCode(curr) {
	return curr.code + ':' + curr.value;
}

/**
 * Returns the truecolor value of the given AutoCad color index value
 * @return {Number} truecolor value as a number
 */
function getAcadColor(index) {
	return AUTO_CAD_COLOR_INDEX[index];
}

var DxfParser_1 = DxfParser$1;


/* Notes */
// Code 6 of an entity indicates inheritance of properties (eg. color).
//   BYBLOCK means inherits from block
//   BYLAYER (default) mean inherits from layer

var index = DxfParser_1;

// A DXF Loader for three.js
// based heavily on three-dxf 0.1.2
// https://github.com/gdsestimating/three-dxf

// Depends on dxf-parser
// https://github.com/gdsestimating/dxf-parser

/**
 * Returns the angle in radians of the vector (p1,p2). In other words, imagine
 * putting the base of the vector at coordinates (0,0) and finding the angle
 * from vector (1,0) to (p1,p2).
 * @param  {Object} p1 start point of the vector
 * @param  {Object} p2 end point of the vector
 * @return {Number} the angle
 */

module.exports = function (THREE) {

    THREE.Math.angle2 = function (p1, p2) {
        var v1 = new THREE.Vector2(p1.x, p1.y);
        var v2 = new THREE.Vector2(p2.x, p2.y);
        v2.sub(v1); // sets v2 to be our chord
        v2.normalize();
        if (v2.y < 0) return -Math.acos(v2.x);
        return Math.acos(v2.x);
    };

    THREE.Math.polar = function (point, distance, angle) {
        var result = {};
        result.x = point.x + distance * Math.cos(angle);
        result.y = point.y + distance * Math.sin(angle);
        return result;
    };

    /**
     * Calculates points for a curve between two points
     * @param startPoint - the starting point of the curve
     * @param endPoint - the ending point of the curve
     * @param bulge - a value indicating how much to curve
     * @param segments - number of segments between the two given points
     */
    THREE.BulgeGeometry = function (startPoint, endPoint, bulge, segments) {

        var vertex, i, center, p0, p1, angle, radius, startAngle, thetaAngle;

        THREE.Geometry.call(this);

        this.startPoint = p0 = startPoint ? new THREE.Vector2(startPoint.x, startPoint.y) : new THREE.Vector2(0, 0);
        this.endPoint = p1 = endPoint ? new THREE.Vector2(endPoint.x, endPoint.y) : new THREE.Vector2(1, 0);
        this.bulge = bulge = bulge || 1;

        angle = 4 * Math.atan(bulge);
        radius = p0.distanceTo(p1) / 2 / Math.sin(angle / 2);
        center = THREE.Math.polar(startPoint, radius, THREE.Math.angle2(p0, p1) + (Math.PI / 2 - angle / 2));

        this.segments = segments = segments || Math.max(Math.abs(Math.ceil(angle / (Math.PI / 18))), 6); // By default want a segment roughly every 10 degrees
        startAngle = THREE.Math.angle2(center, p0);
        thetaAngle = angle / segments;

        this.vertices.push(new THREE.Vector3(p0.x, p0.y, 0));

        for (i = 1; i <= segments - 1; i++) {

            vertex = THREE.Math.polar(center, Math.abs(radius), startAngle + thetaAngle * i);

            this.vertices.push(new THREE.Vector3(vertex.x, vertex.y, 0));
        }
    };

    THREE.BulgeGeometry.prototype = Object.create(THREE.Geometry.prototype);

    THREE.DXFLoader = function (manager) {

        this.manager = manager !== undefined ? manager : THREE.DefaultLoadingManager;
    };

    THREE.DXFLoader.prototype = {

        constructor: THREE.DXFLoader,

        load: function load(url, onLoad, onProgress, onError) {

            var scope = this;

            var loader = new THREE.XHRLoader(scope.manager);
            loader.setPath(this.path);
            loader.load(url, function (text) {

                var dxfParser = new index();

                try {

                    var dxf = dxfParser.parseSync(text);
                    onLoad(scope.parse(dxf));
                } catch (err) {

                    return console.error(err.stack);
                }
            }, onProgress, onError);
        },

        parse: function parse(data) {

            var group = new THREE.Object3D();

            var i, entity, obj;

            for (i = 0; i < data.entities.length; i++) {
                entity = data.entities[i];

                if (entity.type === 'DIMENSION') {
                    if (entity.block) {
                        var block = data.blocks[entity.block];
                        if (!block) {
                            console.error('Missing referenced block "' + entity.block + '"');
                            continue;
                        }
                        for (var j = 0; j < block.entities.length; j++) {
                            obj = drawEntity(block.entities[j], data);
                        }
                    } else {
                        console.log('WARNING: No block for DIMENSION entity');
                    }
                } else {
                    obj = drawEntity(entity, data);
                }

                if (obj) {

                    obj.matrixAutoUpdate = false;
                    group.add(obj);
                }
                obj = null;
            }

            return group;

            function drawEntity(entity, data) {
                var mesh;
                if (entity.type === 'CIRCLE' || entity.type === 'ARC') {
                    mesh = drawCircle(entity, data);
                } else if (entity.type === 'LWPOLYLINE' || entity.type === 'LINE' || entity.type === 'POLYLINE') {
                    mesh = drawLine(entity, data);
                } else if (entity.type === 'TEXT') {
                    mesh = drawText(entity, data);
                } else if (entity.type === 'SOLID') {
                    mesh = drawSolid(entity, data);
                } else if (entity.type === 'POINT') {
                    mesh = drawPoint(entity, data);
                } else if (entity.type === 'INSERT') {
                    mesh = drawBlock(entity, data);
                }
                return mesh;
            }

            function drawLine(entity, data) {
                var geometry = new THREE.Geometry(),
                    color = getColor(entity, data),
                    material,
                    lineType,
                    vertex,
                    startPoint,
                    endPoint,
                    bulgeGeometry,
                    bulge,
                    i,
                    line;

                // create geometry
                for (i = 0; i < entity.vertices.length; i++) {

                    if (entity.vertices[i].bulge) {
                        bulge = entity.vertices[i].bulge;
                        startPoint = entity.vertices[i];
                        endPoint = i + 1 < entity.vertices.length ? entity.vertices[i + 1] : geometry.vertices[0];

                        bulgeGeometry = new THREE.BulgeGeometry(startPoint, endPoint, bulge);

                        geometry.vertices.push.apply(geometry.vertices, bulgeGeometry.vertices);
                    } else {
                        vertex = entity.vertices[i];
                        geometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
                    }
                }
                if (entity.shape) geometry.vertices.push(geometry.vertices[0]);

                // set material
                if (entity.lineType) {
                    lineType = data.tables.lineType.lineTypes[entity.lineType];
                }

                if (lineType && lineType.pattern && lineType.pattern.length !== 0) {
                    material = new THREE.LineDashedMaterial({ color: color, gapSize: 4, dashSize: 4 });
                } else {
                    material = new THREE.LineBasicMaterial({ linewidth: 1, color: color });
                }

                // if(lineType && lineType.pattern && lineType.pattern.length !== 0) {

                //           geometry.computeLineDistances();

                //           // Ugly hack to add diffuse to this. Maybe copy the uniforms object so we
                //           // don't add diffuse to a material.
                //           lineType.material.uniforms.diffuse = { type: 'c', value: new THREE.Color(color) };

                // 	material = new THREE.ShaderMaterial({
                // 		uniforms: lineType.material.uniforms,
                // 		vertexShader: lineType.material.vertexShader,
                // 		fragmentShader: lineType.material.fragmentShader
                // 	});
                // }else {
                // 	material = new THREE.LineBasicMaterial({ linewidth: 1, color: color });
                // }

                line = new THREE.Line(geometry, material);
                return line;
            }

            function drawCircle(entity, data) {
                var geometry, material, circle;

                geometry = new THREE.CircleGeometry(entity.radius, 32, entity.startAngle, entity.angleLength);
                geometry.vertices.shift();

                material = new THREE.LineBasicMaterial({ color: getColor(entity, data) });

                circle = new THREE.Line(geometry, material);
                circle.position.x = entity.center.x;
                circle.position.y = entity.center.y;
                circle.position.z = entity.center.z;

                return circle;
            }

            function drawSolid(entity, data) {

                var material,
                    mesh,
                    verts,
                    geometry = new THREE.Geometry();

                verts = geometry.vertices;
                verts.push(new THREE.Vector3(entity.points[0].x, entity.points[0].y, entity.points[0].z));
                verts.push(new THREE.Vector3(entity.points[1].x, entity.points[1].y, entity.points[1].z));
                verts.push(new THREE.Vector3(entity.points[2].x, entity.points[2].y, entity.points[2].z));
                verts.push(new THREE.Vector3(entity.points[3].x, entity.points[3].y, entity.points[3].z));

                // Calculate which direction the points are facing (clockwise or counter-clockwise)
                var vector1 = new THREE.Vector3();
                var vector2 = new THREE.Vector3();
                vector1.subVectors(verts[1], verts[0]);
                vector2.subVectors(verts[2], verts[0]);
                vector1.cross(vector2);

                // If z < 0 then we must draw these in reverse order
                if (vector1.z < 0) {
                    geometry.faces.push(new THREE.Face3(2, 1, 0));
                    geometry.faces.push(new THREE.Face3(2, 3, 0));
                } else {
                    geometry.faces.push(new THREE.Face3(0, 1, 2));
                    geometry.faces.push(new THREE.Face3(0, 3, 2));
                }

                material = new THREE.MeshBasicMaterial({ color: getColor(entity, data) });

                return new THREE.Mesh(geometry, material);
            }

            function drawText(entity, data) {
                var geometry, material, text;

                if (!font) return console.warn('Text is not supported without a Three.js font loaded with THREE.FontLoader! Load a font of your choice and pass this into the constructor. See the sample for this repository or Three.js examples at http://threejs.org/examples/?q=text#webgl_geometry_text for more details.');

                geometry = new THREE.TextGeometry(entity.text, { font: font, height: 0, size: entity.textHeight || 12 });

                material = new THREE.MeshBasicMaterial({ color: getColor(entity, data) });

                text = new THREE.Mesh(geometry, material);
                text.position.x = entity.startPoint.x;
                text.position.y = entity.startPoint.y;
                text.position.z = entity.startPoint.z;

                return text;
            }

            function drawPoint(entity, data) {
                var geometry, material, point;

                geometry = new THREE.Geometry();

                geometry.vertices.push(new THREE.Vector3(entity.position.x, entity.position.y, entity.position.z));

                // TODO: could be more efficient. PointCloud per layer?

                var numPoints = 1;

                var color = getColor(entity, data);
                var colors = new Float32Array(numPoints * 3);
                colors[0] = color.r;
                colors[1] = color.g;
                colors[2] = color.b;

                geometry.colors = colors;
                geometry.computeBoundingBox();

                material = new THREE.PointsMaterial({ size: 0.05, vertexColors: THREE.VertexColors });
                point = new THREE.Points(geometry, material);
                return point;
            }

            function drawBlock(entity, data) {
                var block = data.blocks[entity.name];

                var group = new THREE.Object3D();

                if (entity.xScale) group.scale.x = entity.xScale;
                if (entity.yScale) group.scale.y = entity.yScale;

                if (entity.rotation) {
                    group.rotation.z = entity.rotation * Math.PI / 180;
                }

                if (entity.position) {
                    group.position.x = entity.position.x;
                    group.position.y = entity.position.y;
                    group.position.z = entity.position.z;
                }

                for (var i = 0; i < block.entities.length; i++) {
                    var childEntity = drawEntity(block.entities[i], data, group);
                    if (childEntity) group.add(childEntity);
                }

                return group;
            }

            function getColor(entity, data) {
                var color = 0x000000; //default
                if (entity.color) color = entity.color;else if (data.tables && data.tables.layer && data.tables.layer.layers[entity.layer]) color = data.tables.layer.layers[entity.layer].color;

                if (color == null || color === 0xffffff) {
                    color = 0x000000;
                }
                return color;
            }

            function createLineTypeShaders(data) {
                var ltype, type;
                if (!data.tables || !data.tables.lineType) return;
                var ltypes = data.tables.lineType.lineTypes;

                for (type in ltypes) {
                    ltype = ltypes[type];
                    if (!ltype.pattern) continue;
                    ltype.material = createDashedLineShader(ltype.pattern);
                }
            }

            function createDashedLineShader(pattern) {
                var i,
                    dashedLineShader = {},
                    totalLength = 0.0;

                for (i = 0; i < pattern.length; i++) {
                    totalLength += Math.abs(pattern[i]);
                }

                dashedLineShader.uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib['common'], THREE.UniformsLib['fog'], {
                    'pattern': { type: 'fv1', value: pattern },
                    'patternLength': { type: 'f', value: totalLength }
                }]);

                dashedLineShader.vertexShader = ['attribute float lineDistance;', 'varying float vLineDistance;', THREE.ShaderChunk['color_pars_vertex'], 'void main() {', THREE.ShaderChunk['color_vertex'], 'vLineDistance = lineDistance;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );', '}'].join('\n');

                dashedLineShader.fragmentShader = ['uniform vec3 diffuse;', 'uniform float opacity;', 'uniform float pattern[' + pattern.length + '];', 'uniform float patternLength;', 'varying float vLineDistance;', THREE.ShaderChunk['color_pars_fragment'], THREE.ShaderChunk['fog_pars_fragment'], 'void main() {', 'float pos = mod(vLineDistance, patternLength);', 'for ( int i = 0; i < ' + pattern.length + '; i++ ) {', 'pos = pos - abs(pattern[i]);', 'if( pos < 0.0 ) {', 'if( pattern[i] > 0.0 ) {', 'gl_FragColor = vec4(1.0, 0.0, 0.0, opacity );', 'break;', '}', 'discard;', '}', '}', THREE.ShaderChunk['color_fragment'], THREE.ShaderChunk['fog_fragment'], '}'].join('\n');

                return dashedLineShader;
            }
        }

    };
};
