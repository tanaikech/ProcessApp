ProcessApp
=====
<a name="top"></a>

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENCE)

<a name="overview"></a>
# Overview
**This is a library for retrieving the process and information of Google Apps Script.**

<a name="methods"></a>
# Methods
1. [getExecutionTimeOfTrigger()](#getexecutiontimeoftrigger) : This method retrieves the total execution time of all functions executed by the time-driven trigger at owner's account. For example, you can know the total execution time of all functions executed by the time-driven trigger in 24 h.
1. [getDevUrl()](#getdevurl) : This method retrieves the endpoint of developer mode for Web Apps like ``https://script.google.com/macros/s/#####/dev``.
1. [getRunningFunctions()](#getrunningfunctions) : This method retrieves the functions which are running now.
1. [getExecutionTimeOfProcessType()](#getexecutiontimeofprocesstype) : This method retrieves the total execution time of all functions by filtering the process type. For example, the total execution time of Web Apps can be retrieved.

I would like to add more methods in the future.

# Library's project key
~~~
1y3BjeYyJUdI9U2JZ97POIXRTaYnjsbH6SUapd43s8S8vh2Io5pho6xZ6
~~~

# How to install
- Open Script Editor. And please operate follows by click.
- -> Resource
- -> Library
- -> Input Script ID to text box. Script ID is **``1y3BjeYyJUdI9U2JZ97POIXRTaYnjsbH6SUapd43s8S8vh2Io5pho6xZ6``**.
- -> Add library
- -> Please select latest version
- -> Developer mode ON (If you don't want to use latest version, please select others.)
- -> Identifier is "**``ProcessApp``**". This is set under the default.

[If you want to read about Libraries, please check this.](https://developers.google.com/apps-script/guide_libraries).

# Enable Apps Script API
This library uses [Apps Script API](https://developers.google.com/apps-script/api/reference/rest/). So please enable Apps Script API at API console as follows.

- On script editor
    - Resources -> Cloud Platform project
    - View API console
    - At Getting started, click "Explore and enable APIs".
    - At left side, click Library.
    - At Search for APIs & services, input "apps script". And click Apps Script API.
    - Click Enable button.
    - If this API has already been enabled, please don't turn off.

## About scopes
This library uses the following 3 scopes. These are installed in the library. So users are not required to do anything for this.

- ``https://www.googleapis.com/auth/script.external_request``
- ``https://www.googleapis.com/auth/script.processes``
- ``https://www.googleapis.com/auth/script.deployments.readonly``

# Methods
<a name="getexecutiontimeoftrigger"></a>
## 1. getExecutionTimeOfTrigger()
### Overview
This method retrieves the total execution time of all functions executed by the time-driven trigger at owner's account. For example, you can know the total execution time of all functions executed by the time-driven trigger in 24 h.

### Description
There are [quotas for "Triggers total runtime"](https://developers.google.com/apps-script/guides/services/quotas). For example, it's 90 min/day for the consumer account. So when users use the time-driven trigger, it is very important to know the current total execution time of all functions by the time-driven trigger. But there were no methods for directly retrieving the total execution time before. When Apps Script API was updated, the method of ["processes"](https://developers.google.com/apps-script/api/reference/rest/v1/processes) was also added. I thought that this might be able to be used for this situation, and I had experimented about this. As the result, it was found that this method can be used for directly retrieving the total execution time of all functions executed by the time-driven trigger. So I published this.

### Sample script
This method can be used simply like below. In this case, as the default setting, the total execution time from now to 24 h ago is retrieved.

~~~javascript
var res = ProcessApp.getExecutionTimeOfTrigger();
~~~

Of course, you can see the period for retrieving the total execution time can be set using as follows. In this sample script, the total execution time from ``2019-02-01T00:00:00.000Z`` to ``2019-02-02T00:00:00.000Z`` of a function of ``myFunction1`` in the project ID of ``#####`` is retrieved.

~~~javascript
var object = {
    projectId: "#####", // Project ID
    functionName: "myFunction1", // function name that you want to know the total execution time.
    startTime: "2019-02-01T00:00:00.000Z",
    endTime: "2019-02-02T00:00:00.000Z",
};
var res = ProcessApp.getExecutionTimeOfTrigger(object);
~~~

- About ``startTime`` and ``endTime``
    - A timestamp in RFC3339 UTC "Zulu" format, accurate to nanoseconds. Example: "2014-10-02T15:01:23.045123456Z". [Ref](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Timestamp)

#### Result
For example, when 2 functions of ``myFunction1()`` and ``myFunction2()`` are run by the time-driven trigger and the script is ``var res = ProcessApp.getExecutionTimeOfTrigger()``, this method returns the following result. From the result, it is found that the total execution time of both functions from now to 24 h ago is 1380 s. The breakdown of this is 1200 s and 180 s for ``myFunction1()`` and ``myFunction2()``, respectively.

~~~
{
  "statistics": {
    "allFunctions": [
      "myFunction1",
      "myFunction2"
    ],
    "totalExecutionTimeSec": 1380.00,
    "totalExecutionTimeMin": 23.00
  },
  "eachFunction": [
    {
      "functionName": "myFunction1",
      "totalExecutionTimeSec": 1200.00,
      "totalExecutionTimeMin": 20.00
    },
    {
      "functionName": "myFunction2",
      "totalExecutionTimeSec": 180.00,
      "totalExecutionTimeMin": 3.00
    }
  ]
}
~~~

[Also this method was posted to Stackoverflow as an answer.](https://stackoverflow.com/a/54604118)

<a name="getdevurl"></a>
## 2. getDevUrl()
### Overview
This method retrieves the endpoint of developer mode for Web Apps like ``https://script.google.com/macros/s/#####/dev``.

### Description
There is the method in Class ScriptApp for retrieving the endpoint of Web Apps. It's ``ScriptApp.getService().getUrl()``. This method returns the endpoint of the deployed Web Apps like ``https://script.google.com/macros/s/#####/exec``. It's not the endpoint of developer mode like ``https://script.google.com/macros/s/#####/dev``. So I created this method of ``getDevUrl()``.

### Sample script
~~~javascript
var projectId = "#####";
var res = ProcessApp.getDevUrl(projectId);
~~~

#### Result
~~~
https://script.google.com/macros/s/#####/dev
~~~

<a name="getrunningfunctions"></a>
## 3. getRunningFunctions()
### Overview
This method retrieves the functions which are running now.

### Description
For example, it supposes that there is a a function is run by the time-driven trigger and the execution time of function is long. At that time, I had a case that it is required to know whether the function is running now. So I created this method of ``getRunningFunctions()``. This method can be also used the event trigger and Web Apps.

### Sample script
~~~javascript
var res = ProcessApp.getRunningFunctions();
~~~

#### Result
The process information of the running function is returned.

~~~json
[
  {
    "projectName": "sample project",
    "functionName": "myFunction",
    "processType": "EDITOR",
    "processStatus": "RUNNING",
    "userAccessLevel": "OWNER",
    "startTime": "2000-01-01T00:00:00.000Z",
    "duration": "12.345s"
  }
]
~~~

<a name="getexecutiontimeofprocesstype"></a>
## 4. getExecutionTimeOfProcessType()
### Overview
This method retrieves the endpoint of developer mode for Web Apps like ``https://script.google.com/macros/s/#####/dev``.

### Description
There is the method in Class ScriptApp for retrieving the endpoint of Web Apps. It's ``ScriptApp.getService().getUrl()``. This method returns the endpoint of the deployed Web Apps like ``https://script.google.com/macros/s/#####/exec``. It's not the endpoint of developer mode like ``https://script.google.com/macros/s/#####/dev``. So I created this method of ``getDevUrl()``.

### Sample script
The basic usage is almost the same with [getExecutionTimeOfTrigger()](#getexecutiontimeoftrigger). In this method, the result is filtered by the process type. You can select the process type from [here](https://developers.google.com/apps-script/api/reference/rest/v1/processes#ProcessType)

| Process type | Description |
|:---|:---|
| PROCESS_TYPE_UNSPECIFIED | Unspecified type. |
| ADD_ON | The process was started from an add-on entry point. |
| EXECUTION_API | The process was started using the Apps Script API. |
| TIME_DRIVEN | The process was started from a time-based trigger. |
| TRIGGER | The process was started from an event-based trigger. |
| WEBAPP | The process was started from a web app entry point. |
| EDITOR | The process was started using the Apps Script IDE. |
| SIMPLE_TRIGGER | The process was started from a G Suite simple trigger. |
| MENU | The process was started from a G Suite menu item. |

This method can be used simply like below. In this case, as the default setting, the total execution time from now to 24 h ago is retrieved. And the process type of "EDITOR" is used. "EDITOR" means that the total execution time of functions executed by the script editor is retrieved.

~~~javascript
var res = ProcessApp.getExecutionTimeOfTrigger();
~~~

Of course, you can see the period for retrieving the total execution time can be set using as follows. In this sample script, the total execution time from ``2019-02-01T00:00:00.000Z`` to ``2019-02-02T00:00:00.000Z`` of a function of ``doGet`` executed by Web Apps in the project ID of ``#####`` is retrieved.

~~~javascript
var object = {
    projectId: "#####", // Project ID
    functionName: "doGet", // function name that you want to know the total execution time.
    processType: "WEBAPP",
    startTime: "2019-02-01T00:00:00.000Z",
    endTime: "2019-02-02T00:00:00.000Z",
};
var res = ProcessApp.getExecutionTimeOfTrigger(object);
~~~

#### Result

~~~
{
  "statistics": {
    "allFunctions": [
      "doGet",
    ],
    "totalExecutionTimeSec": 1200.00,
  },
  "eachFunction": [
    {
      "functionName": "doGet",
      "totalExecutionTimeSec": 1200.00,
      "totalExecutionTimeMin": 20.00
    }
  ]
}
~~~

-----

<a name="Licence"></a>
# Licence
[MIT](LICENCE)

<a name="Author"></a>
# Author
[Tanaike](https://tanaikech.github.io/about/)

If you have any questions and commissions for me, feel free to contact me.

<a name="Update_History"></a>
# Update History
* v1.0.0 (February 9, 2019)

    1. Initial release.

* v1.0.1 (February 10, 2019)

    1. New method of [getExecutionTimeOfProcessType()](#getexecutiontimeofprocesstype) was added.
        - This method retrieves the total execution time of all functions by filtering the process type. For example, the total execution time of Web Apps can be retrieved.


[TOP](#top)
