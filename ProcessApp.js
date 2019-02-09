/**
 * GitHub  https://github.com/tanaikech/ProcessApp<br>
 * Retrieve total execution time of time-driven trigger.<br>
 * @param {Object} object Object
 * @return {Object} Total execution time of time-driven trigger
 */
function getExecutionTimeOfTrigger(object) {
    return new ProcessApp(1).GetExecutionTimeOfTrigger(object);
}

/**
 * Retrieve endpoint of dev mode for Web Apps.<br>
 * @param {String} projectId Project ID
 * @return {String} URL of dev mode
 */
function getDevUrl(projectId) {
    return new ProcessApp(2).GetDevUrl(projectId);
}

/**
 * Retrieve functions which are running.<br>
 * @return {String} URL of dev mode
 */
function getRunningFunctions() {
    return new ProcessApp(1).GetRunningFunctions();
}
;
(function(r) {
  var ProcessApp;
  ProcessApp = (function() {
    var addQuery, defaultStartEndTime, parseData;

    ProcessApp.name = "ProcessApp";

    function ProcessApp(method_) {
      switch (method_) {
        case 1:
          this.url = "https://script.googleapis.com/v1/processes";
          break;
        case 2:
          this.url = "https://script.googleapis.com/v1/projects/{projectId}/deployments?fields=deployments";
      }
      this.at = ScriptApp.getOAuthToken();
    }

    ProcessApp.prototype.GetExecutionTimeOfTrigger = function(p_) {
      var data, e, endTime, endpoint, nextPageToken, params, q, ref, startTime;
      try {
        if (p_ == null) {
          p_ = {};
        }
        params = {
          headers: {
            Authorization: 'Bearer ' + this.at
          }
        };
        ref = defaultStartEndTime.call(this, p_), startTime = ref[0], endTime = ref[1];
        data = [];
        nextPageToken = "";
        while (true) {
          q = {
            pageToken: nextPageToken,
            fields: "*",
            "userProcessFilter.functionName": p_.functionName || "",
            "userProcessFilter.scriptId": p_.projectId || "",
            "userProcessFilter.startTime": startTime,
            "userProcessFilter.endTime": endTime,
            "userProcessFilter.types": "TIME_DRIVEN"
          };
          endpoint = addQuery.call(this, this.url, q);
          r = UrlFetchApp.fetch(endpoint, params);
          r = JSON.parse(r.getContentText());
          Array.prototype.push.apply(data, r.processes);
          nextPageToken = r.nextPageToken || "";
          if (!nextPageToken) {
            break;
          }
        }
        return parseData.call(this, data);
      } catch (error) {
        e = error;
        throw new Error(e);
      }
    };

    ProcessApp.prototype.GetDevUrl = function(p_) {
      var e, params, projectId;
      if (p_ == null) {
        throw new Error("Please set projectId.");
      }
      try {
        projectId = typeof p_ === "object" ? p_.projectId : p_;
        this.url = this.url.replace("{projectId}", projectId);
        params = {
          headers: {
            Authorization: 'Bearer ' + this.at
          }
        };
        r = UrlFetchApp.fetch(this.url, params);
        r = JSON.parse(r.getContentText());
        return "https://script.google.com/macros/s/" + r.deployments[0].deploymentId + "/dev";
      } catch (error) {
        e = error;
        throw new Error(e);
      }
    };

    ProcessApp.prototype.GetRunningFunctions = function() {
      var e, endpoint, params, q;
      try {
        params = {
          headers: {
            Authorization: 'Bearer ' + this.at
          }
        };
        q = {
          fields: "*",
          "userProcessFilter.statuses": "RUNNING"
        };
        endpoint = addQuery.call(this, this.url, q);
        r = UrlFetchApp.fetch(endpoint, params);
        r = JSON.parse(r.getContentText());
        return r.processes || [];
      } catch (error) {
        e = error;
        throw new Error(e);
      }
    };

    defaultStartEndTime = function(p_) {
      var endTime, startTime, t;
      startTime = "";
      endTime = "";
      if (p_.startTime && p_.endTime) {
        startTime = p_.startTime;
        endTime = p_.endTime;
      } else {
        t = new Date();
        endTime = t.toISOString();
        t.setDate(t.getDate() - 1);
        startTime = t.toISOString();
      }
      return [startTime, endTime];
    };

    parseData = function(data) {
      var r1, r2, statistics;
      r1 = data.reduce(function(obj, e) {
        obj[e.functionName] = obj[e.functionName] ? obj[e.functionName] + Number(e.duration.replace("s", "")) : Number(e.duration.replace("s", ""));
        return obj;
      }, {});
      r2 = Object.keys(r1).map(function(e) {
        return {
          functionName: e,
          totalExecutionTimeSec: Math.round(r1[e] * 100) / 100,
          totalExecutionTimeMin: Math.round((r1[e] / 60) * 100) / 100
        };
      });
      statistics = r2.reduce(function(obj, e) {
        obj.allFunctions = obj.allFunctions ? obj.allFunctions.concat(e.functionName) : [e.functionName];
        obj.totalExecutionTimeSec = obj.totalExecutionTimeSec ? obj.totalExecutionTimeSec + e.totalExecutionTimeSec : e.totalExecutionTimeSec;
        obj.totalExecutionTimeMin = obj.totalExecutionTimeMin ? obj.totalExecutionTimeMin + e.totalExecutionTimeMin : e.totalExecutionTimeMin;
        return obj;
      }, {});
      statistics.totalExecutionTimeSec = Math.round(statistics.totalExecutionTimeSec * 100) / 100;
      statistics.totalExecutionTimeMin = Math.round(statistics.totalExecutionTimeMin * 100) / 100;
      return {
        statistics: statistics,
        eachFunction: r2
      };
    };

    addQuery = function(url_, obj_) {
      return url_ + Object.keys(obj_).reduce(function(p, e, i) {
        return p + (i === 0 ? "?" : "&") + e + "=" + encodeURIComponent(obj_[e]);
      }, "");
    };

    return ProcessApp;

  })();
  return r.ProcessApp = ProcessApp;
})(this);
