"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@actions/core/lib/utils.js
var require_utils = __commonJS({
  "node_modules/@actions/core/lib/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function toCommandValue(input) {
      if (input === null || input === void 0) {
        return "";
      } else if (typeof input === "string" || input instanceof String) {
        return input;
      }
      return JSON.stringify(input);
    }
    exports.toCommandValue = toCommandValue;
  }
});

// node_modules/@actions/core/lib/command.js
var require_command = __commonJS({
  "node_modules/@actions/core/lib/command.js"(exports) {
    "use strict";
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (Object.hasOwnProperty.call(mod, k))
            result[k] = mod[k];
      }
      result["default"] = mod;
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var os = __importStar(require("os"));
    var utils_1 = require_utils();
    function issueCommand(command, properties, message) {
      const cmd = new Command(command, properties, message);
      process.stdout.write(cmd.toString() + os.EOL);
    }
    exports.issueCommand = issueCommand;
    function issue(name, message = "") {
      issueCommand(name, {}, message);
    }
    exports.issue = issue;
    var CMD_STRING = "::";
    var Command = class {
      constructor(command, properties, message) {
        if (!command) {
          command = "missing.command";
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
      }
      toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
          cmdStr += " ";
          let first = true;
          for (const key in this.properties) {
            if (this.properties.hasOwnProperty(key)) {
              const val = this.properties[key];
              if (val) {
                if (first) {
                  first = false;
                } else {
                  cmdStr += ",";
                }
                cmdStr += `${key}=${escapeProperty(val)}`;
              }
            }
          }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
      }
    };
    function escapeData(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
    }
    function escapeProperty(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
    }
  }
});

// node_modules/@actions/core/lib/file-command.js
var require_file_command = __commonJS({
  "node_modules/@actions/core/lib/file-command.js"(exports) {
    "use strict";
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (Object.hasOwnProperty.call(mod, k))
            result[k] = mod[k];
      }
      result["default"] = mod;
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var fs = __importStar(require("fs"));
    var os = __importStar(require("os"));
    var utils_1 = require_utils();
    function issueCommand(command, message) {
      const filePath = process.env[`GITHUB_${command}`];
      if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
      }
      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
      }
      fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: "utf8"
      });
    }
    exports.issueCommand = issueCommand;
  }
});

// node_modules/@actions/core/lib/core.js
var require_core = __commonJS({
  "node_modules/@actions/core/lib/core.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (Object.hasOwnProperty.call(mod, k))
            result[k] = mod[k];
      }
      result["default"] = mod;
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var command_1 = require_command();
    var file_command_1 = require_file_command();
    var utils_1 = require_utils();
    var os = __importStar(require("os"));
    var path2 = __importStar(require("path"));
    var ExitCode;
    (function(ExitCode2) {
      ExitCode2[ExitCode2["Success"] = 0] = "Success";
      ExitCode2[ExitCode2["Failure"] = 1] = "Failure";
    })(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
    function exportVariable(name, val) {
      const convertedVal = utils_1.toCommandValue(val);
      process.env[name] = convertedVal;
      const filePath = process.env["GITHUB_ENV"] || "";
      if (filePath) {
        const delimiter = "_GitHubActionsFileCommandDelimeter_";
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand("ENV", commandValue);
      } else {
        command_1.issueCommand("set-env", { name }, convertedVal);
      }
    }
    exports.exportVariable = exportVariable;
    function setSecret(secret) {
      command_1.issueCommand("add-mask", {}, secret);
    }
    exports.setSecret = setSecret;
    function addPath(inputPath) {
      const filePath = process.env["GITHUB_PATH"] || "";
      if (filePath) {
        file_command_1.issueCommand("PATH", inputPath);
      } else {
        command_1.issueCommand("add-path", {}, inputPath);
      }
      process.env["PATH"] = `${inputPath}${path2.delimiter}${process.env["PATH"]}`;
    }
    exports.addPath = addPath;
    function getInput(name, options) {
      const val = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
      if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
      }
      return val.trim();
    }
    exports.getInput = getInput;
    function setOutput(name, value) {
      command_1.issueCommand("set-output", { name }, value);
    }
    exports.setOutput = setOutput;
    function setCommandEcho(enabled) {
      command_1.issue("echo", enabled ? "on" : "off");
    }
    exports.setCommandEcho = setCommandEcho;
    function setFailed(message) {
      process.exitCode = ExitCode.Failure;
      error(message);
    }
    exports.setFailed = setFailed;
    function isDebug() {
      return process.env["RUNNER_DEBUG"] === "1";
    }
    exports.isDebug = isDebug;
    function debug(message) {
      command_1.issueCommand("debug", {}, message);
    }
    exports.debug = debug;
    function error(message) {
      command_1.issue("error", message instanceof Error ? message.toString() : message);
    }
    exports.error = error;
    function warning(message) {
      command_1.issue("warning", message instanceof Error ? message.toString() : message);
    }
    exports.warning = warning;
    function info(message) {
      process.stdout.write(message + os.EOL);
    }
    exports.info = info;
    function startGroup(name) {
      command_1.issue("group", name);
    }
    exports.startGroup = startGroup;
    function endGroup() {
      command_1.issue("endgroup");
    }
    exports.endGroup = endGroup;
    function group(name, fn) {
      return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
          result = yield fn();
        } finally {
          endGroup();
        }
        return result;
      });
    }
    exports.group = group;
    function saveState(name, value) {
      command_1.issueCommand("save-state", { name }, value);
    }
    exports.saveState = saveState;
    function getState(name) {
      return process.env[`STATE_${name}`] || "";
    }
    exports.getState = getState;
  }
});

// node_modules/filesize/lib/filesize.js
var require_filesize = __commonJS({
  "node_modules/filesize/lib/filesize.js"(exports, module2) {
    "use strict";
    (function(global2) {
      var b = /^(b|B)$/, symbol = {
        iec: {
          bits: ["b", "Kib", "Mib", "Gib", "Tib", "Pib", "Eib", "Zib", "Yib"],
          bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
        },
        jedec: {
          bits: ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"],
          bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        }
      }, fullform = {
        iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
        jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"]
      };
      function filesize(arg) {
        var descriptor = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var result = [], val = 0, e = void 0, base = void 0, bits = void 0, ceil = void 0, full = void 0, fullforms = void 0, locale = void 0, localeOptions = void 0, neg = void 0, num = void 0, output = void 0, round = void 0, unix = void 0, separator = void 0, spacer = void 0, standard = void 0, symbols = void 0;
        if (isNaN(arg)) {
          throw new TypeError("Invalid number");
        }
        bits = descriptor.bits === true;
        unix = descriptor.unix === true;
        base = descriptor.base || 2;
        round = descriptor.round !== void 0 ? descriptor.round : unix ? 1 : 2;
        locale = descriptor.locale !== void 0 ? descriptor.locale : "";
        localeOptions = descriptor.localeOptions || {};
        separator = descriptor.separator !== void 0 ? descriptor.separator : "";
        spacer = descriptor.spacer !== void 0 ? descriptor.spacer : unix ? "" : " ";
        symbols = descriptor.symbols || {};
        standard = base === 2 ? descriptor.standard || "jedec" : "jedec";
        output = descriptor.output || "string";
        full = descriptor.fullform === true;
        fullforms = descriptor.fullforms instanceof Array ? descriptor.fullforms : [];
        e = descriptor.exponent !== void 0 ? descriptor.exponent : -1;
        num = Number(arg);
        neg = num < 0;
        ceil = base > 2 ? 1e3 : 1024;
        if (neg) {
          num = -num;
        }
        if (e === -1 || isNaN(e)) {
          e = Math.floor(Math.log(num) / Math.log(ceil));
          if (e < 0) {
            e = 0;
          }
        }
        if (e > 8) {
          e = 8;
        }
        if (output === "exponent") {
          return e;
        }
        if (num === 0) {
          result[0] = 0;
          result[1] = unix ? "" : symbol[standard][bits ? "bits" : "bytes"][e];
        } else {
          val = num / (base === 2 ? Math.pow(2, e * 10) : Math.pow(1e3, e));
          if (bits) {
            val = val * 8;
            if (val >= ceil && e < 8) {
              val = val / ceil;
              e++;
            }
          }
          result[0] = Number(val.toFixed(e > 0 ? round : 0));
          if (result[0] === ceil && e < 8 && descriptor.exponent === void 0) {
            result[0] = 1;
            e++;
          }
          result[1] = base === 10 && e === 1 ? bits ? "kb" : "kB" : symbol[standard][bits ? "bits" : "bytes"][e];
          if (unix) {
            result[1] = standard === "jedec" ? result[1].charAt(0) : e > 0 ? result[1].replace(/B$/, "") : result[1];
            if (b.test(result[1])) {
              result[0] = Math.floor(result[0]);
              result[1] = "";
            }
          }
        }
        if (neg) {
          result[0] = -result[0];
        }
        result[1] = symbols[result[1]] || result[1];
        if (locale === true) {
          result[0] = result[0].toLocaleString();
        } else if (locale.length > 0) {
          result[0] = result[0].toLocaleString(locale, localeOptions);
        } else if (separator.length > 0) {
          result[0] = result[0].toString().replace(".", separator);
        }
        if (output === "array") {
          return result;
        }
        if (full) {
          result[1] = fullforms[e] ? fullforms[e] : fullform[standard][e] + (bits ? "bit" : "byte") + (result[0] === 1 ? "" : "s");
        }
        if (output === "object") {
          return {
            value: result[0],
            symbol: result[1],
            exponent: e
          };
        }
        return result.join(spacer);
      }
      filesize.partial = function(opt) {
        return function(arg) {
          return filesize(arg, opt);
        };
      };
      if (typeof exports !== "undefined") {
        module2.exports = filesize;
      } else if (typeof define === "function" && define.amd !== void 0) {
        define(function() {
          return filesize;
        });
      } else {
        global2.filesize = filesize;
      }
    })(typeof window !== "undefined" ? window : global);
  }
});

// index.ts
var import_core2 = __toESM(require_core());
var import_filesize = __toESM(require_filesize());

// checkPaths.ts
var import_node_path = __toESM(require("node:path"));

// getInputs.ts
var import_core = __toESM(require_core());
var getInputs = () => ({
  basePath: import_core.default.getInput("base_path"),
  prPath: import_core.default.getInput("pr_path"),
  excludedAssets: import_core.default.getInput("excluded_assets")
});

// checkPaths.ts
async function importReferenceReport(base) {
  const report = await import(base);
  return report;
}
async function importPrReport(pr) {
  const report = await import(pr);
  return report;
}
async function checkPaths() {
  const { basePath, prPath, excludedAssets } = getInputs();
  const reference = import_node_path.default.resolve(process.cwd(), basePath);
  const pr = import_node_path.default.resolve(process.cwd(), prPath);
  let baserReport = await importReferenceReport(reference);
  if (!baserReport) {
    throw new Error(`Base path is not correct. Current input: ${reference}`);
  }
  let prReport = await importPrReport(pr);
  if (!prReport) {
    throw new Error(`Pr path is not correct. Current input: ${pr}`);
  }
  if (excludedAssets) {
    const regex = new RegExp(excludedAssets);
    baserReport = baserReport.filter((asset) => !asset.name.match(regex));
    prReport = prReport.filter((asset) => !asset.name.match(regex));
  }
  return {
    base: baserReport,
    pr: prReport
  };
}

// getErrorMessage.ts
function getErrorMessage(error) {
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return "Unknown error";
}

// getStatsDiff.ts
function getStatsDiff(base, pr) {
  const oldSize = base.reduce((acc, a) => acc + a.size, 0);
  const newSize = pr.reduce((acc, a) => acc + a.size, 0);
  const diff = newSize - oldSize;
  const diffPercentage = diff / (oldSize / 100);
  return {
    total: {
      oldSize,
      newSize,
      diff,
      diffPercentage
    }
  };
}

// index.ts
function generateData(assets) {
  const stats = getStatsDiff(assets.base, assets.pr);
  if (!stats || !stats.total) {
    throw new Error(`Something went wrong with stats conversion, probably files are corrupted.`);
  }
  import_core2.default.setOutput("base_file_size", stats.total.oldSize);
  import_core2.default.setOutput("base_file_string", (0, import_filesize.default)(stats.total.oldSize));
  import_core2.default.setOutput("pr_file_size", stats.total.newSize);
  import_core2.default.setOutput("pr_file_string", (0, import_filesize.default)(stats.total.newSize));
  import_core2.default.setOutput("diff_file_size", stats.total.diff);
  import_core2.default.setOutput("diff_file_string", (0, import_filesize.default)(stats.total.diff));
  import_core2.default.setOutput("percent", stats.total.diffPercentage.toFixed(2));
  import_core2.default.setOutput("success", "true");
}
async function run() {
  try {
    const assets = await checkPaths();
    generateData(assets);
  } catch (error) {
    import_core2.default.setOutput("success", "false");
    const errorMessage = getErrorMessage(error);
    import_core2.default.setFailed(errorMessage);
  }
}
run();
/*! Bundled license information:

filesize/lib/filesize.js:
  (**
   * filesize
   *
   * @copyright 2020 Jason Mulligan <jason.mulligan@avoidwork.com>
   * @license BSD-3-Clause
   * @version 6.1.0
   *)
*/
