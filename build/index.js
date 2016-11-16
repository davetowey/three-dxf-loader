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

/* Notes */
// Code 6 of an entity indicates inheritance of properties (eg. color).
//   BYBLOCK means inherits from block
//   BYLAYER (default) mean inherits from layer

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

                var dxfParser = new DxfParser();

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
                scene.add(point);
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
