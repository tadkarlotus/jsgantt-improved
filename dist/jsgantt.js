(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JSGantt = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSGantt = void 0;
var jsGantt = require("./src/jsgantt");
module.exports = jsGantt.JSGantt;
exports.JSGantt = jsGantt.JSGantt;

},{"./src/jsgantt":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GanttChart = void 0;
var lang = require("./lang");
var moment = require("jalali-moment");
var events_1 = require("./events");
var general_utils_1 = require("./utils/general_utils");
var task_1 = require("./task");
var xml_1 = require("./xml");
var draw_columns_1 = require("./draw_columns");
var draw_utils_1 = require("./utils/draw_utils");
var draw_dependencies_1 = require("./draw_dependencies");
var options_1 = require("./options");
var date_utils_1 = require("./utils/date_utils");
/**
 * function that loads the main gantt chart properties and functions
 * @param pDiv (required) this is a div object created in HTML
 * @param pFormat (required) - used to indicate whether chart should be drawn in "hour", "day", "week", "month", or "quarter" format
 */
exports.GanttChart = function (pDiv, pFormat) {
    this.vDiv = pDiv;
    this.vFormat = pFormat;
    this.vDivId = null;
    this.vUseFade = 1;
    this.vUseMove = 1;
    this.vUseRowHlt = 1;
    this.vUseToolTip = 1;
    this.vUseSort = 1;
    this.vUseSingleCell = 25000;
    this.vShowRes = 1;
    this.vShowDur = 1;
    this.vShowComp = 1;
    this.vShowStartDate = 1;
    this.vShowEndDate = 1;
    this.vShowPlanStartDate = 0;
    this.vShowPlanEndDate = 0;
    this.vShowCost = 0;
    this.vShowAddEntries = 0;
    this.vShowEndWeekDate = 1;
    this.vShowWeekends = 1;
    this.vShowTaskInfoRes = 1;
    this.vShowTaskInfoDur = 1;
    this.vShowTaskInfoComp = 1;
    this.vShowTaskInfoStartDate = 1;
    this.vShowTaskInfoEndDate = 1;
    this.vShowTaskInfoNotes = 1;
    this.vShowTaskInfoLink = 0;
    this.vShowDeps = 1;
    this.vTotalHeight = undefined;
    this.vWorkingDays = {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
    };
    this.vEventClickCollapse = null;
    this.vEventClickRow = null;
    this.vEvents = {
        taskname: null,
        res: null,
        dur: null,
        comp: null,
        startdate: null,
        enddate: null,
        planstartdate: null,
        planenddate: null,
        cost: null,
        beforeDraw: null,
        afterDraw: null,
        beforeLineDraw: null,
        afterLineDraw: null,
        onLineDraw: null,
        onLineContainerHover: null,
    };
    this.vEventsChange = {
        taskname: null,
        res: null,
        dur: null,
        comp: null,
        startdate: null,
        enddate: null,
        planstartdate: null,
        planenddate: null,
        cost: null,
        line: null,
    };
    this.vResources = null;
    this.vAdditionalHeaders = {};
    this.vColumnOrder = draw_columns_1.COLUMN_ORDER;
    this.vEditable = false;
    this.vDebug = false;
    this.vShowSelector = new Array("top");
    this.vDateInputFormat = "yyyy-mm-dd";
    this.vDateTaskTableDisplayFormat = date_utils_1.parseDateFormatStr("dd/mm/yyyy");
    this.vDateTaskDisplayFormat = date_utils_1.parseDateFormatStr("dd month yyyy");
    this.vHourMajorDateDisplayFormat = date_utils_1.parseDateFormatStr("day dd month yyyy");
    this.vHourMinorDateDisplayFormat = date_utils_1.parseDateFormatStr("HH");
    this.vDayMajorDateDisplayFormat = date_utils_1.parseDateFormatStr("dd/mm/yyyy");
    this.vDayMinorDateDisplayFormat = date_utils_1.parseDateFormatStr("dd");
    this.vWeekMajorDateDisplayFormat = date_utils_1.parseDateFormatStr("yyyy");
    this.vWeekMinorDateDisplayFormat = date_utils_1.parseDateFormatStr("dd/mm");
    this.vMonthMajorDateDisplayFormat = date_utils_1.parseDateFormatStr("yyyy");
    this.vMonthMinorDateDisplayFormat = date_utils_1.parseDateFormatStr("mon");
    this.vQuarterMajorDateDisplayFormat = date_utils_1.parseDateFormatStr("yyyy");
    this.vQuarterMinorDateDisplayFormat = date_utils_1.parseDateFormatStr("qq");
    this.vUseFullYear = date_utils_1.parseDateFormatStr("dd/mm/yyyy");
    this.vCaptionType;
    this.vDepId = 1;
    this.vTaskList = new Array();
    this.vFormatArr = new Array("hour", "day", "week", "month", "quarter");
    this.vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    this.vProcessNeeded = true;
    this.vMinGpLen = 8;
    this.vScrollTo = "";
    this.vHourColWidth = 18;
    this.vDayColWidth = 18;
    this.vWeekColWidth = 36;
    this.vMonthColWidth = 36;
    this.vQuarterColWidth = 18;
    this.vRowHeight = 20;
    this.vTodayPx = -1;
    this.vLangs = lang;
    this.vLang = navigator.language && navigator.language in lang ? navigator.language : "en";
    this.vChartBody = null;
    this.vChartHead = null;
    this.vListBody = null;
    this.vChartTable = null;
    this.vLines = null;
    this.vTimer = 20;
    this.vTooltipDelay = 1500;
    this.vTooltipTemplate = null;
    this.vMinDate = null;
    this.vMaxDate = null;
    this.includeGetSet = options_1.includeGetSet.bind(this);
    this.includeGetSet();
    this.mouseOver = events_1.mouseOver;
    this.mouseOut = events_1.mouseOut;
    this.addListener = events_1.addListener.bind(this);
    this.removeListener = events_1.removeListener.bind(this);
    this.createTaskInfo = task_1.createTaskInfo;
    this.AddTaskItem = task_1.AddTaskItem;
    this.AddTaskItemObject = task_1.AddTaskItemObject;
    this.RemoveTaskItem = task_1.RemoveTaskItem;
    this.ClearTasks = task_1.ClearTasks;
    this.getXMLProject = xml_1.getXMLProject;
    this.getXMLTask = xml_1.getXMLTask;
    this.CalcTaskXY = draw_utils_1.CalcTaskXY.bind(this);
    // sLine: Draw a straight line (colored one-pixel wide div)
    this.sLine = draw_utils_1.sLine.bind(this);
    this.drawDependency = draw_dependencies_1.drawDependency.bind(this);
    this.DrawDependencies = draw_dependencies_1.DrawDependencies.bind(this);
    this.getArrayLocationByID = draw_utils_1.getArrayLocationByID.bind(this);
    this.drawSelector = draw_utils_1.drawSelector.bind(this);
    this.printChart = general_utils_1.printChart.bind(this);
    //TODO: it should be moved to date_util.ts
    this.toStandardDate = function (date) {
        var mm = date.getMonth() + 1; // getMonth() is zero-based
        var dd = date.getDate();
        return [date.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
        ].join('-');
    };
    this.clearDependencies = function () {
        var parent = this.getLines();
        if (this.vEventsChange.line && typeof this.vEventsChange.line === "function") {
            this.removeListener("click", this.vEventsChange.line, parent);
            this.addListener("click", this.vEventsChange.line, parent);
        }
        while (parent.hasChildNodes())
            parent.removeChild(parent.firstChild);
        this.vDepId = 1;
    };
    this.drawListHead = function (vLeftHeader) {
        var _this = this;
        var vTmpDiv = draw_utils_1.newNode(vLeftHeader, "div", this.vDivId + "glisthead", "glistlbl gcontainercol");
        var gListLbl = vTmpDiv;
        this.setListBody(vTmpDiv);
        var vTmpTab = draw_utils_1.newNode(vTmpDiv, "table", null, "gtasktableh");
        var vTmpTBody = draw_utils_1.newNode(vTmpTab, "tbody");
        var vTmpRow = draw_utils_1.newNode(vTmpTBody, "tr");
        draw_utils_1.newNode(vTmpRow, "td", null, "gtasklist", "\u00A0");
        var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, "gspanning gtaskname", null, null, null, null, this.getColumnOrder().length + 1);
        vTmpCell.appendChild(this.drawSelector("top"));
        vTmpRow = draw_utils_1.newNode(vTmpTBody, "tr");
        draw_utils_1.newNode(vTmpRow, "td", null, "gtasklist", "\u00A0");
        draw_utils_1.newNode(vTmpRow, "td", null, "gtaskname", "\u00A0");
        this.getColumnOrder().forEach(function (column) {
            if (_this[column] == 1 || column === "vAdditionalHeaders") {
                draw_columns_1.draw_task_headings(column, vTmpRow, _this.vLangs, _this.vLang, _this.vAdditionalHeaders, _this.vEvents);
            }
        });
        return gListLbl;
    };
    this.drawListBody = function (vLeftHeader) {
        var _this = this;
        var vTmpContentTabOuterWrapper = draw_utils_1.newNode(vLeftHeader, "div", null, "gtasktableouterwrapper");
        var vTmpContentTabWrapper = draw_utils_1.newNode(vTmpContentTabOuterWrapper, "div", null, "gtasktablewrapper");
        vTmpContentTabWrapper.style.width = "calc(100% + " + general_utils_1.getScrollbarWidth() + "px)";
        var vTmpContentTab = draw_utils_1.newNode(vTmpContentTabWrapper, "table", null, "gtasktable");
        var vTmpContentTBody = draw_utils_1.newNode(vTmpContentTab, "tbody");
        var vNumRows = 0;
        var _loop_1 = function (i) {
            var vBGColor = void 0;
            if (this_1.vTaskList[i].getGroup() == 1)
                vBGColor = "ggroupitem";
            else
                vBGColor = "glineitem a";
            var vID = this_1.vTaskList[i].getID();
            var vTmpRow_1, vTmpCell_1 = void 0;
            if (!(this_1.vTaskList[i].getParItem() && this_1.vTaskList[i].getParItem().getGroup() == 2) || this_1.vTaskList[i].getGroup() == 2) {
                if (this_1.vTaskList[i].getVisible() == 0)
                    vTmpRow_1 = draw_utils_1.newNode(vTmpContentTBody, "tr", this_1.vDivId + "child_" + vID, "gname " + vBGColor, null, null, null, "none");
                else
                    vTmpRow_1 = draw_utils_1.newNode(vTmpContentTBody, "tr", this_1.vDivId + "child_" + vID, "gname " + vBGColor);
                this_1.vTaskList[i].setListChildRow(vTmpRow_1);
                draw_utils_1.newNode(vTmpRow_1, "td", null, "gtasklist", "\u00A0");
                var editableClass = this_1.vEditable ? "gtaskname gtaskeditable" : "gtaskname";
                vTmpCell_1 = draw_utils_1.newNode(vTmpRow_1, "td", null, editableClass);
                var vCellContents = "";
                for (var j = 1; j < this_1.vTaskList[i].getLevel(); j++) {
                    vCellContents += "\u00A0\u00A0\u00A0\u00A0";
                }
                var task_2 = this_1.vTaskList[i];
                var vEventClickRow_1 = this_1.vEventClickRow;
                var vEventClickCollapse_1 = this_1.vEventClickCollapse;
                events_1.addListener("click", function (e) {
                    if (e.target.classList.contains("gfoldercollapse") === false) {
                        if (vEventClickRow_1 && typeof vEventClickRow_1 === "function") {
                            vEventClickRow_1(task_2);
                        }
                    }
                    else {
                        if (vEventClickCollapse_1 && typeof vEventClickCollapse_1 === "function") {
                            vEventClickCollapse_1(task_2);
                        }
                    }
                }, vTmpRow_1);
                if (this_1.vTaskList[i].getGroup() == 1) {
                    var vTmpDiv = draw_utils_1.newNode(vTmpCell_1, "div", null, null, vCellContents);
                    var vTmpSpan = draw_utils_1.newNode(vTmpDiv, "span", this_1.vDivId + "group_" + vID, "gfoldercollapse", this_1.vTaskList[i].getOpen() == 1 ? "-" : "+");
                    this_1.vTaskList[i].setGroupSpan(vTmpSpan);
                    events_1.addFolderListeners(this_1, vTmpSpan, vID);
                    var divTask = document.createElement("span");
                    divTask.innerHTML = "\u00A0" + this_1.vTaskList[i].getName();
                    vTmpDiv.appendChild(divTask);
                    // const text = makeInput(this.vTaskList[i].getName(), this.vEditable, 'text');
                    // vTmpDiv.appendChild(document.createNode(text));
                    var callback = function (task, e) { return task.setName(e.target.value); };
                    events_1.addListenerInputCell(vTmpCell_1, this_1.vEventsChange, callback, this_1.vTaskList, i, "taskname", this_1.Draw.bind(this_1));
                    events_1.addListenerClickCell(vTmpDiv, this_1.vEvents, this_1.vTaskList[i], "taskname");
                }
                else {
                    vCellContents += "\u00A0\u00A0\u00A0\u00A0";
                    var text = draw_utils_1.makeInput(this_1.vTaskList[i].getName(), this_1.vEditable, "text");
                    var vTmpDiv = draw_utils_1.newNode(vTmpCell_1, "div", null, null, vCellContents + text);
                    var callback = function (task, e) { return task.setName(e.target.value); };
                    events_1.addListenerInputCell(vTmpCell_1, this_1.vEventsChange, callback, this_1.vTaskList, i, "taskname", this_1.Draw.bind(this_1));
                    events_1.addListenerClickCell(vTmpCell_1, this_1.vEvents, this_1.vTaskList[i], "taskname");
                }
                this_1.getColumnOrder().forEach(function (column) {
                    if (_this[column] == 1 || column === "vAdditionalHeaders") {
                        draw_columns_1.draw_header(column, i, vTmpRow_1, _this.vTaskList, _this.vEditable, _this.vEventsChange, _this.vEvents, _this.vDateTaskTableDisplayFormat, _this.vAdditionalHeaders, _this.vFormat, _this.vLangs, _this.vLang, _this.vResources, _this.Draw.bind(_this));
                    }
                });
                vNumRows++;
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.vTaskList.length; i++) {
            _loop_1(i);
        }
        // Render no daa in the chart
        if (this.vTaskList.length == 0) {
            var totalColumns = this.getColumnOrder().filter(function (column) { return _this[column] == 1 || column === "vAdditionalHeaders"; }).length;
            var vTmpRow_2 = draw_utils_1.newNode(vTmpContentTBody, "tr", this.vDivId + "child_", "gname ");
            // this.vTaskList[i].setListChildRow(vTmpRow);
            var vTmpCell_2 = draw_utils_1.newNode(vTmpRow_2, "td", null, "gtasknolist", "", null, null, null, totalColumns);
            var vOutput = document.createDocumentFragment();
            draw_utils_1.newNode(vOutput, "div", null, "gtasknolist-label", this.vLangs[this.vLang]["nodata"] + ".");
            vTmpCell_2.appendChild(vOutput);
        }
        // DRAW the date format selector at bottom left.
        var vTmpRow = draw_utils_1.newNode(vTmpContentTBody, "tr");
        draw_utils_1.newNode(vTmpRow, "td", null, "gtasklist", "\u00A0");
        var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, "gspanning gtaskname");
        vTmpCell.appendChild(this.drawSelector("bottom"));
        this.getColumnOrder().forEach(function (column) {
            if (_this[column] == 1 || column === "vAdditionalHeaders") {
                draw_columns_1.draw_bottom(column, vTmpRow, _this.vAdditionalHeaders);
            }
        });
        // Add some white space so the vertical scroll distance should always be greater
        // than for the right pane (keep to a minimum as it is seen in unconstrained height designs)
        // newNode(vTmpDiv2, 'br');
        // newNode(vTmpDiv2, 'br');
        return {
            vNumRows: vNumRows,
            vTmpContentTabWrapper: vTmpContentTabWrapper,
        };
    };
    /**
     *
     * DRAW CHAR HEAD
     *
     */
    this.drawChartHead = function (vMinDate, vMaxDate, vColWidth, vNumRows) {
        var vRightHeader = document.createDocumentFragment();
        var vTmpDiv = draw_utils_1.newNode(vRightHeader, "div", this.vDivId + "gcharthead", "gchartlbl gcontainercol");
        var gChartLbl = vTmpDiv;
        this.setChartHead(vTmpDiv);
        var vTmpTab = draw_utils_1.newNode(vTmpDiv, "table", this.vDivId + "chartTableh", "gcharttableh");
        var vTmpTBody = draw_utils_1.newNode(vTmpTab, "tbody");
        var vTmpRow = draw_utils_1.newNode(vTmpTBody, "tr");
        var vTmpDate = new Date();
        vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
        if (this.vFormat == "hour")
            vTmpDate.setHours(vMinDate.getHours());
        else
            vTmpDate.setHours(0);
        vTmpDate.setMinutes(0);
        vTmpDate.setSeconds(0);
        vTmpDate.setMilliseconds(0);
        // let startTime = vTmpDate.getTime();
        // let endTime = vMaxDate.getTime();
        // if(this.vFormat == "month") {
        moment.locale('fa');
        var vTmpDateAsString = vMinDate.getFullYear() + '-' + (vMinDate.getMonth() + 1) + '-' + vMinDate.getDate();
        var vMaxDateAsString = vMaxDate.getFullYear() + '-' + (vMaxDate.getMonth() + 1) + '-' + vMaxDate.getDate();
        var persianStartTime = moment.from(vTmpDateAsString, 'en', 'YYYY-MM-DD').locale('fa').format('YYYY-MM-DD');
        var persianEndTime = moment.from(vMaxDateAsString, 'en', 'YYYY-MM-DD').locale('fa').format('YYYY-MM-DD');
        var startTime = moment(persianStartTime, 'jYYYY/jMM/jDD');
        var endTime = moment(persianEndTime, 'jYYYY/jMM/jDD');
        var diff = endTime.diff(startTime);
        // }
        var vColSpan = 1;
        // Major Date Header
        // while (vTmpDate.getTime() <= vMaxDate.getTime()) {
        while (true) {
            if (this.vFormat != "month" && vTmpDate.getTime() <= vMaxDate.getTime())
                break;
            if (this.vFormat === "month" && endTime.diff(startTime) <= 0)
                break;
            var vHeaderCellClass = "gmajorheading";
            var vCellContents = "";
            if (this.vFormat == "day") {
                var colspan = 7;
                if (!this.vShowWeekends) {
                    vHeaderCellClass += " headweekends";
                    colspan = 5;
                }
                var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, vHeaderCellClass, null, null, null, null, colspan);
                vCellContents += date_utils_1.formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
                vTmpDate.setDate(vTmpDate.getDate() + 6);
                if (this.vShowEndWeekDate == 1)
                    vCellContents += " - " + date_utils_1.formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
                draw_utils_1.newNode(vTmpCell, "div", null, null, vCellContents, vColWidth * colspan);
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
            else if (this.vFormat == "week") {
                var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, vHeaderCellClass, null, vColWidth);
                draw_utils_1.newNode(vTmpCell, "div", null, null, date_utils_1.formatDateStr(vTmpDate, this.vWeekMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                vTmpDate.setDate(vTmpDate.getDate() + 7);
            }
            else if (this.vFormat == "month") {
                // vColSpan = 12 - vTmpDate.getMonth();
                vColSpan = 12 - (+startTime.month());
                // if (vTmpDate.getFullYear() == vMaxDate.getFullYear()) vColSpan -= 11 - vMaxDate.getMonth();
                if (startTime.year() == endTime.year())
                    vColSpan -= 11 - (endTime.month());
                var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, vHeaderCellClass, null, null, null, null, vColSpan);
                // newNode(vTmpCell, "div", null, null, formatDateStr(vTmpDate, this.vMonthMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                draw_utils_1.newNode(vTmpCell, "div", null, null, date_utils_1.formatDateStr(startTime.toDate(), this.vMonthMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
                startTime.add(1, 'year');
                startTime.month(0);
                startTime.date(1);
            }
            else if (this.vFormat == "quarter") {
                vColSpan = 4 - Math.floor(vTmpDate.getMonth() / 3);
                if (vTmpDate.getFullYear() == vMaxDate.getFullYear())
                    vColSpan -= 3 - Math.floor(vMaxDate.getMonth() / 3);
                var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, vHeaderCellClass, null, null, null, null, vColSpan);
                draw_utils_1.newNode(vTmpCell, "div", null, null, date_utils_1.formatDateStr(vTmpDate, this.vQuarterMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
            }
            else if (this.vFormat == "hour") {
                vColSpan = 24 - vTmpDate.getHours();
                if (vTmpDate.getFullYear() == vMaxDate.getFullYear() && vTmpDate.getMonth() == vMaxDate.getMonth() && vTmpDate.getDate() == vMaxDate.getDate())
                    vColSpan -= 23 - vMaxDate.getHours();
                var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, vHeaderCellClass, null, null, null, null, vColSpan);
                draw_utils_1.newNode(vTmpCell, "div", null, null, date_utils_1.formatDateStr(vTmpDate, this.vHourMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                vTmpDate.setHours(0);
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
        }
        vTmpRow = draw_utils_1.newNode(vTmpTBody, "tr", null, "footerdays");
        // Minor Date header and Cell Rows
        vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate()); // , vMinDate.getHours()
        startTime = moment(persianStartTime, 'jYYYY/jMM/jDD');
        if (this.vFormat == "hour")
            vTmpDate.setHours(vMinDate.getHours());
        var vNumCols = 0;
        // while (vTmpDate.getTime() <= vMaxDate.getTime()) {
        while (true) {
            if (this.vFormat != "month" && vTmpDate.getTime() <= vMaxDate.getTime())
                break;
            if (this.vFormat === "month" && endTime.diff(startTime) <= 0)
                break;
            var vMinorHeaderCellClass = "gminorheading";
            if (this.vFormat == "day") {
                if (vTmpDate.getDay() % 6 == 0) {
                    if (!this.vShowWeekends) {
                        vTmpDate.setDate(vTmpDate.getDate() + 1);
                        continue;
                    }
                    vMinorHeaderCellClass += "wkend";
                }
                if (vTmpDate <= vMaxDate) {
                    var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, vMinorHeaderCellClass);
                    draw_utils_1.newNode(vTmpCell, "div", null, null, date_utils_1.formatDateStr(vTmpDate, this.vDayMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
            else if (this.vFormat == "week") {
                if (vTmpDate <= vMaxDate) {
                    var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, vMinorHeaderCellClass);
                    draw_utils_1.newNode(vTmpCell, "div", null, null, date_utils_1.formatDateStr(vTmpDate, this.vWeekMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }
                vTmpDate.setDate(vTmpDate.getDate() + 7);
            }
            else if (this.vFormat == "month") {
                // if (vTmpDate <= vMaxDate) {
                //   const vTmpCell = newNode(vTmpRow, "td", null, vMinorHeaderCellClass);
                //   newNode(vTmpCell, "div", null, null, formatDateStr(vTmpDate, this.vMonthMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                //   vNumCols++;
                // }
                if (startTime <= endTime) {
                    var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, vMinorHeaderCellClass);
                    draw_utils_1.newNode(vTmpCell, "div", null, null, date_utils_1.formatDateStr(startTime.toDate(), this.vMonthMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }
                vTmpDate.setDate(vTmpDate.getDate() + 1);
                startTime.add(1, 'day');
                // while (vTmpDate.getDate() > 1) {
                //   vTmpDate.setDate(vTmpDate.getDate() + 1);
                // }
                while (startTime.date() > 1) {
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                    startTime.add(1, 'day');
                }
            }
            else if (this.vFormat == "quarter") {
                if (vTmpDate <= vMaxDate) {
                    var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, vMinorHeaderCellClass);
                    draw_utils_1.newNode(vTmpCell, "div", null, null, date_utils_1.formatDateStr(vTmpDate, this.vQuarterMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }
                vTmpDate.setDate(vTmpDate.getDate() + 81);
                while (vTmpDate.getDate() > 1)
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
            else if (this.vFormat == "hour") {
                for (var i = vTmpDate.getHours(); i < 24; i++) {
                    vTmpDate.setHours(i); //works around daylight savings but may look a little odd on days where the clock goes forward
                    if (vTmpDate <= vMaxDate) {
                        var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, vMinorHeaderCellClass);
                        draw_utils_1.newNode(vTmpCell, "div", null, null, date_utils_1.formatDateStr(vTmpDate, this.vHourMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                        vNumCols++;
                    }
                }
                vTmpDate.setHours(0);
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
        }
        var vDateRow = vTmpRow;
        // Calculate size of grids  : Plus 3 because 1 border left + 2 of paddings
        var vTaskLeftPx = vNumCols * (vColWidth + 3) + 1;
        // Fix a small space at the end for day
        if (this.vFormat === "day") {
            vTaskLeftPx += 2;
        }
        vTmpTab.style.width = vTaskLeftPx + "px"; // Ensure that the headings has exactly the same width as the chart grid
        // const vTaskPlanLeftPx = (vNumCols * (vColWidth + 3)) + 1;
        var vSingleCell = false;
        if (this.vUseSingleCell !== 0 && this.vUseSingleCell < vNumCols * vNumRows)
            vSingleCell = true;
        draw_utils_1.newNode(vTmpDiv, "div", null, "rhscrpad", null, null, vTaskLeftPx + 1);
        vTmpDiv = draw_utils_1.newNode(vRightHeader, "div", null, "glabelfooter");
        return { gChartLbl: gChartLbl, vTaskLeftPx: vTaskLeftPx, vSingleCell: vSingleCell, vDateRow: vDateRow, vRightHeader: vRightHeader, vNumCols: vNumCols };
    };
    /**
     *
     * DRAW CHART BODY
     *
     */
    this.drawCharBody = function (vTaskLeftPx, vTmpContentTabWrapper, gChartLbl, gListLbl, vMinDate, vMaxDate, vSingleCell, vNumCols, vColWidth, vDateRow) {
        var vRightTable = document.createDocumentFragment();
        var vTmpDiv = draw_utils_1.newNode(vRightTable, "div", this.vDivId + "gchartbody", "gchartgrid gcontainercol");
        this.setChartBody(vTmpDiv);
        var vTmpTab = draw_utils_1.newNode(vTmpDiv, "table", this.vDivId + "chartTable", "gcharttable", null, vTaskLeftPx);
        this.setChartTable(vTmpTab);
        draw_utils_1.newNode(vTmpDiv, "div", null, "rhscrpad", null, null, vTaskLeftPx + 1);
        var vTmpTBody = draw_utils_1.newNode(vTmpTab, "tbody");
        var vTmpTFoot = draw_utils_1.newNode(vTmpTab, "tfoot");
        events_1.syncScroll([vTmpContentTabWrapper, vTmpDiv], "scrollTop");
        events_1.syncScroll([gChartLbl, vTmpDiv], "scrollLeft");
        events_1.syncScroll([vTmpContentTabWrapper, gListLbl], "scrollLeft");
        // Draw each row
        var i = 0;
        var j = 0;
        var bd;
        if (this.vDebug) {
            bd = new Date();
            console.info("before tasks loop", bd);
        }
        for (i = 0; i < this.vTaskList.length; i++) {
            var curTaskStart = this.vTaskList[i].getStart() ? this.vTaskList[i].getStart() : this.vTaskList[i].getPlanStart();
            var curTaskEnd = this.vTaskList[i].getEnd() ? this.vTaskList[i].getEnd() : this.vTaskList[i].getPlanEnd();
            var vTaskLeftPx_1 = general_utils_1.getOffset(vMinDate, curTaskStart, vColWidth, this.vFormat, this.vShowWeekends);
            var vTaskRightPx = general_utils_1.getOffset(curTaskStart, curTaskEnd, vColWidth, this.vFormat, this.vShowWeekends);
            var curTaskPlanStart = void 0, curTaskPlanEnd = void 0;
            curTaskPlanStart = this.vTaskList[i].getPlanStart();
            curTaskPlanEnd = this.vTaskList[i].getPlanEnd();
            var vTaskPlanLeftPx = 0;
            var vTaskPlanRightPx = 0;
            if (curTaskPlanStart && curTaskPlanEnd) {
                vTaskPlanLeftPx = general_utils_1.getOffset(vMinDate, curTaskPlanStart, vColWidth, this.vFormat, this.vShowWeekends);
                vTaskPlanRightPx = general_utils_1.getOffset(curTaskPlanStart, curTaskPlanEnd, vColWidth, this.vFormat, this.vShowWeekends);
            }
            var vID = this.vTaskList[i].getID();
            var vComb = this.vTaskList[i].getParItem() && this.vTaskList[i].getParItem().getGroup() == 2;
            var vCellFormat = "";
            var vTmpDiv_1 = null;
            var vTmpItem = this.vTaskList[i];
            var vCaptClass = null;
            // set cell width only for first row because of table-layout:fixed
            var taskCellWidth = i === 0 ? vColWidth : null;
            if (this.vTaskList[i].getMile() && !vComb) {
                var vTmpRow = draw_utils_1.newNode(vTmpTBody, "tr", this.vDivId + "childrow_" + vID, "gmileitem gmile" + this.vFormat, null, null, null, this.vTaskList[i].getVisible() == 0 ? "none" : null);
                this.vTaskList[i].setChildRow(vTmpRow);
                events_1.addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow);
                var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, "gtaskcell gtaskcellmile", null, vColWidth, null, null, null);
                vTmpDiv_1 = draw_utils_1.newNode(vTmpCell, "div", null, "gtaskcelldiv", "\u00A0\u00A0");
                vTmpDiv_1 = draw_utils_1.newNode(vTmpDiv_1, "div", this.vDivId + "bardiv_" + vID, "gtaskbarcontainer", null, 12, vTaskLeftPx_1 + vTaskRightPx - 6);
                this.vTaskList[i].setBarDiv(vTmpDiv_1);
                var vTmpDiv2 = draw_utils_1.newNode(vTmpDiv_1, "div", this.vDivId + "taskbar_" + vID, this.vTaskList[i].getClass(), null, 12);
                this.vTaskList[i].setTaskDiv(vTmpDiv2);
                if (this.vTaskList[i].getCompVal() < 100)
                    vTmpDiv2.appendChild(document.createTextNode("\u25CA"));
                else {
                    vTmpDiv2 = draw_utils_1.newNode(vTmpDiv2, "div", null, "gmilediamond");
                    draw_utils_1.newNode(vTmpDiv2, "div", null, "gmdtop");
                    draw_utils_1.newNode(vTmpDiv2, "div", null, "gmdbottom");
                }
                vCaptClass = "gmilecaption";
                if (!vSingleCell && !vComb) {
                    this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
                }
            }
            else {
                var vTaskWidth = vTaskRightPx;
                // Draw Group Bar which has outer div with inner group div
                // and several small divs to left and right to create angled-end indicators
                if (this.vTaskList[i].getGroup()) {
                    vTaskWidth = vTaskWidth > this.vMinGpLen && vTaskWidth < this.vMinGpLen * 2 ? this.vMinGpLen * 2 : vTaskWidth; // Expand to show two end points
                    vTaskWidth = vTaskWidth < this.vMinGpLen ? this.vMinGpLen : vTaskWidth; // expand to show one end point
                    var vTmpRow = draw_utils_1.newNode(vTmpTBody, "tr", this.vDivId + "childrow_" + vID, (this.vTaskList[i].getGroup() == 2 ? "glineitem gitem" : "ggroupitem ggroup") + this.vFormat, null, null, null, this.vTaskList[i].getVisible() == 0 ? "none" : null);
                    this.vTaskList[i].setChildRow(vTmpRow);
                    events_1.addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow);
                    var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, "gtaskcell gtaskcellbar", null, vColWidth, null, null);
                    vTmpDiv_1 = draw_utils_1.newNode(vTmpCell, "div", null, "gtaskcelldiv", "\u00A0\u00A0");
                    this.vTaskList[i].setCellDiv(vTmpDiv_1);
                    if (this.vTaskList[i].getGroup() == 1) {
                        vTmpDiv_1 = draw_utils_1.newNode(vTmpDiv_1, "div", this.vDivId + "bardiv_" + vID, "gtaskbarcontainer", null, vTaskWidth, vTaskLeftPx_1);
                        this.vTaskList[i].setBarDiv(vTmpDiv_1);
                        var vTmpDiv2 = draw_utils_1.newNode(vTmpDiv_1, "div", this.vDivId + "taskbar_" + vID, this.vTaskList[i].getClass(), null, vTaskWidth);
                        this.vTaskList[i].setTaskDiv(vTmpDiv2);
                        draw_utils_1.newNode(vTmpDiv2, "div", this.vDivId + "complete_" + vID, this.vTaskList[i].getClass() + "complete", null, this.vTaskList[i].getCompStr());
                        draw_utils_1.newNode(vTmpDiv_1, "div", null, this.vTaskList[i].getClass() + "endpointleft");
                        if (vTaskWidth >= this.vMinGpLen * 2)
                            draw_utils_1.newNode(vTmpDiv_1, "div", null, this.vTaskList[i].getClass() + "endpointright");
                        vCaptClass = "ggroupcaption";
                    }
                    if (!vSingleCell && !vComb) {
                        this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
                    }
                }
                else {
                    vTaskWidth = vTaskWidth <= 0 ? 1 : vTaskWidth;
                    /**
                     * DRAW THE BOXES FOR GANTT
                     */
                    var vTmpDivCell = void 0, vTmpRow = void 0;
                    if (vComb) {
                        vTmpDivCell = vTmpDiv_1 = this.vTaskList[i].getParItem().getCellDiv();
                    }
                    else {
                        // Draw Task Bar which has colored bar div
                        var differentDatesHighlight = "";
                        if (this.vTaskList[i].getEnd() && this.vTaskList[i].getPlanEnd() && this.vTaskList[i].getStart() && this.vTaskList[i].getPlanStart())
                            if (Date.parse(this.vTaskList[i].getEnd()) !== Date.parse(this.vTaskList[i].getPlanEnd()) || Date.parse(this.vTaskList[i].getStart()) !== Date.parse(this.vTaskList[i].getPlanStart()))
                                differentDatesHighlight = "gitemdifferent ";
                        vTmpRow = draw_utils_1.newNode(vTmpTBody, "tr", this.vDivId + "childrow_" + vID, "glineitem " + differentDatesHighlight + "gitem" + this.vFormat, null, null, null, this.vTaskList[i].getVisible() == 0 ? "none" : null);
                        this.vTaskList[i].setChildRow(vTmpRow);
                        events_1.addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow);
                        var vTmpCell = draw_utils_1.newNode(vTmpRow, "td", null, "gtaskcell gtaskcellcolorbar", null, taskCellWidth, null, null);
                        vTmpDivCell = vTmpDiv_1 = draw_utils_1.newNode(vTmpCell, "div", null, "gtaskcelldiv", "\u00A0\u00A0");
                    }
                    // DRAW TASK BAR
                    vTmpDiv_1 = draw_utils_1.newNode(vTmpDiv_1, "div", this.vDivId + "bardiv_" + vID, "gtaskbarcontainer", null, vTaskWidth, vTaskLeftPx_1);
                    this.vTaskList[i].setBarDiv(vTmpDiv_1);
                    var vTmpDiv2 = void 0;
                    if (this.vTaskList[i].getStartVar()) {
                        // textbar
                        vTmpDiv2 = draw_utils_1.newNode(vTmpDiv_1, "div", this.vDivId + "taskbar_" + vID, this.vTaskList[i].getClass(), null, vTaskWidth);
                        if (this.vTaskList[i].getBarText()) {
                            draw_utils_1.newNode(vTmpDiv2, "span", this.vDivId + "tasktextbar_" + vID, "textbar", this.vTaskList[i].getBarText(), this.vTaskList[i].getCompRestStr());
                        }
                        this.vTaskList[i].setTaskDiv(vTmpDiv2);
                    }
                    // PLANNED
                    // If exist and one of them are different, show plan bar... show if there is no real vStart as well (just plan dates)
                    if (vTaskPlanLeftPx && (vTaskPlanLeftPx != vTaskLeftPx_1 || vTaskPlanRightPx != vTaskRightPx || !this.vTaskList[i].getStartVar())) {
                        var vTmpPlanDiv = draw_utils_1.newNode(vTmpDivCell, "div", this.vDivId + "bardiv_" + vID, "gtaskbarcontainer gplan", null, vTaskPlanRightPx, vTaskPlanLeftPx);
                        var vTmpPlanDiv2 = draw_utils_1.newNode(vTmpPlanDiv, "div", this.vDivId + "taskbar_" + vID, this.vTaskList[i].getPlanClass() + " gplan", null, vTaskPlanRightPx);
                        this.vTaskList[i].setPlanTaskDiv(vTmpPlanDiv2);
                    }
                    // and opaque completion div
                    if (vTmpDiv2) {
                        draw_utils_1.newNode(vTmpDiv2, "div", this.vDivId + "complete_" + vID, this.vTaskList[i].getClass() + "complete", null, this.vTaskList[i].getCompStr());
                    }
                    // caption
                    if (vComb)
                        vTmpItem = this.vTaskList[i].getParItem();
                    if (!vComb || (vComb && this.vTaskList[i].getParItem().getEnd() == this.vTaskList[i].getEnd()))
                        vCaptClass = "gcaption";
                    // Background cells
                    if (!vSingleCell && !vComb && vTmpRow) {
                        this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
                    }
                }
            }
            if (this.getCaptionType() && vCaptClass !== null) {
                var vCaptionStr = void 0;
                switch (this.getCaptionType()) {
                    case "Caption":
                        vCaptionStr = vTmpItem.getCaption();
                        break;
                    case "Resource":
                        vCaptionStr = vTmpItem.getResource();
                        break;
                    case "Duration":
                        vCaptionStr = vTmpItem.getDuration(this.vFormat, this.vLangs[this.vLang]);
                        break;
                    case "Complete":
                        vCaptionStr = vTmpItem.getCompStr();
                        break;
                }
                draw_utils_1.newNode(vTmpDiv_1, "div", null, vCaptClass, vCaptionStr, 120, vCaptClass == "gmilecaption" ? 12 : 0);
            }
            // Add Task Info div for tooltip
            if (this.vTaskList[i].getTaskDiv() && vTmpDiv_1) {
                var vTmpDiv2 = draw_utils_1.newNode(vTmpDiv_1, "div", this.vDivId + "tt" + vID, null, null, null, null, "none");
                var _a = this.createTaskInfo(this.vTaskList[i], this.vTooltipTemplate), component = _a.component, callback = _a.callback;
                vTmpDiv2.appendChild(component);
                events_1.addTooltipListeners(this, this.vTaskList[i].getTaskDiv(), vTmpDiv2, callback);
            }
            // Add Plan Task Info div for tooltip
            if (this.vTaskList[i].getPlanTaskDiv() && vTmpDiv_1) {
                var vTmpDiv2 = draw_utils_1.newNode(vTmpDiv_1, "div", this.vDivId + "tt" + vID, null, null, null, null, "none");
                var _b = this.createTaskInfo(this.vTaskList[i], this.vTooltipTemplate), component = _b.component, callback = _b.callback;
                vTmpDiv2.appendChild(component);
                events_1.addTooltipListeners(this, this.vTaskList[i].getPlanTaskDiv(), vTmpDiv2, callback);
            }
        }
        // Include the footer with the days/week/month...
        if (vSingleCell) {
            var vTmpTFootTRow = draw_utils_1.newNode(vTmpTFoot, "tr");
            var vTmpTFootTCell = draw_utils_1.newNode(vTmpTFootTRow, "td", null, null, null, "100%");
            var vTmpTFootTCellTable = draw_utils_1.newNode(vTmpTFootTCell, "table", null, "gcharttableh", null, "100%");
            var vTmpTFootTCellTableTBody = draw_utils_1.newNode(vTmpTFootTCellTable, "tbody");
            vTmpTFootTCellTableTBody.appendChild(vDateRow.cloneNode(true));
        }
        else {
            vTmpTFoot.appendChild(vDateRow.cloneNode(true));
        }
        return { vRightTable: vRightTable };
    };
    this.drawColsChart = function (vNumCols, vTmpRow, taskCellWidth, pStartDate, pEndDate) {
        if (pStartDate === void 0) { pStartDate = null; }
        if (pEndDate === void 0) { pEndDate = null; }
        var columnCurrentDay = null;
        // Find the Current day cell to put a different class
        if (this.vShowWeekends !== false && pStartDate && pEndDate && (this.vFormat == "day" || this.vFormat == "week")) {
            var curTaskStart = new Date(pStartDate.getTime());
            var curTaskEnd = new Date();
            var onePeriod = 3600000;
            if (this.vFormat == "day") {
                onePeriod *= 24;
            }
            else if (this.vFormat == "week") {
                onePeriod *= 24 * 7;
            }
            columnCurrentDay = Math.floor(general_utils_1.calculateCurrentDateOffset(curTaskStart, curTaskEnd) / onePeriod) - 1;
        }
        for (var j = 0; j < vNumCols - 1; j++) {
            var vCellFormat = "gtaskcell gtaskcellcols";
            if (this.vShowWeekends !== false && this.vFormat == "day" && (j % 7 == 4 || j % 7 == 5)) {
                vCellFormat = "gtaskcellwkend";
            }
            //When is the column is the current day/week,give a different class
            else if ((this.vFormat == "week" || this.vFormat == "day") && j === columnCurrentDay) {
                vCellFormat = "gtaskcellcurrent";
            }
            draw_utils_1.newNode(vTmpRow, "td", null, vCellFormat, "\u00A0\u00A0", taskCellWidth);
        }
    };
    /**
     *
     *
     * DRAWING PROCESS
     *
     *  vTaskRightPx,vTaskWidth,vTaskPlanLeftPx,vTaskPlanRightPx,vID
     */
    this.Draw = function () {
        var vMaxDate = new Date();
        var vMinDate = new Date();
        var vColWidth = 0;
        var bd;
        if (this.vEvents && this.vEvents.beforeDraw) {
            this.vEvents.beforeDraw();
        }
        if (this.vDebug) {
            bd = new Date();
            console.info("before draw", bd);
        }
        // Process all tasks, reset parent date and completion % if task list has altered
        if (this.vProcessNeeded)
            task_1.processRows(this.vTaskList, 0, -1, 1, 1, this.getUseSort(), this.vDebug);
        this.vProcessNeeded = false;
        // get overall min/max dates plus padding
        vMinDate = date_utils_1.getMinDate(this.vTaskList, this.vFormat, this.getMinDate() && date_utils_1.coerceDate(this.getMinDate()));
        vMaxDate = date_utils_1.getMaxDate(this.vTaskList, this.vFormat, this.getMaxDate() && date_utils_1.coerceDate(this.getMaxDate()));
        // Calculate chart width variables.
        if (this.vFormat == "day")
            vColWidth = this.vDayColWidth;
        else if (this.vFormat == "week")
            vColWidth = this.vWeekColWidth;
        else if (this.vFormat == "month")
            vColWidth = this.vMonthColWidth;
        else if (this.vFormat == "quarter")
            vColWidth = this.vQuarterColWidth;
        else if (this.vFormat == "hour")
            vColWidth = this.vHourColWidth;
        // DRAW the Left-side of the chart (names, resources, comp%)
        var vLeftHeader = document.createDocumentFragment();
        /**
         * LIST HEAD
         */
        var gListLbl = this.drawListHead(vLeftHeader);
        /**
         * LIST BODY
         */
        var _a = this.drawListBody(vLeftHeader), vNumRows = _a.vNumRows, vTmpContentTabWrapper = _a.vTmpContentTabWrapper;
        /**
         * CHART HEAD
         */
        var _b = this.drawChartHead(vMinDate, vMaxDate, vColWidth, vNumRows), gChartLbl = _b.gChartLbl, vTaskLeftPx = _b.vTaskLeftPx, vSingleCell = _b.vSingleCell, vRightHeader = _b.vRightHeader, vDateRow = _b.vDateRow, vNumCols = _b.vNumCols;
        /**
         * CHART GRID
         */
        var vRightTable = this.drawCharBody(vTaskLeftPx, vTmpContentTabWrapper, gChartLbl, gListLbl, vMinDate, vMaxDate, vSingleCell, vNumCols, vColWidth, vDateRow).vRightTable;
        if (this.vDebug) {
            var ad = new Date();
            console.info("after tasks loop", ad, ad.getTime() - bd.getTime());
        }
        // MAIN VIEW: Appending all generated components to main view
        while (this.vDiv.hasChildNodes())
            this.vDiv.removeChild(this.vDiv.firstChild);
        var vTmpDiv = draw_utils_1.newNode(this.vDiv, "div", null, "gchartcontainer");
        vTmpDiv.style.height = this.vTotalHeight;
        var leftvTmpDiv = draw_utils_1.newNode(vTmpDiv, "div", null, "gmain gmainleft");
        leftvTmpDiv.appendChild(vLeftHeader);
        // leftvTmpDiv.appendChild(vLeftTable);
        var rightvTmpDiv = draw_utils_1.newNode(vTmpDiv, "div", null, "gmain gmainright");
        rightvTmpDiv.appendChild(vRightHeader);
        rightvTmpDiv.appendChild(vRightTable);
        vTmpDiv.appendChild(leftvTmpDiv);
        vTmpDiv.appendChild(rightvTmpDiv);
        draw_utils_1.newNode(vTmpDiv, "div", null, "ggridfooter");
        var vTmpDiv2 = draw_utils_1.newNode(this.getChartBody(), "div", this.vDivId + "Lines", "glinediv");
        if (this.vEvents.onLineContainerHover && typeof this.vEvents.onLineContainerHover === "function") {
            events_1.addListener("mouseover", this.vEvents.onLineContainerHover, vTmpDiv2);
            events_1.addListener("mouseout", this.vEvents.onLineContainerHover, vTmpDiv2);
        }
        vTmpDiv2.style.visibility = "hidden";
        this.setLines(vTmpDiv2);
        /* Quick hack to show the generated HTML on older browsers
              let tmpGenSrc=document.createElement('textarea');
              tmpGenSrc.appendChild(document.createTextNode(vTmpDiv.innerHTML));
              vDiv.appendChild(tmpGenSrc);
        //*/
        // LISTENERS: Now all the content exists, register scroll listeners
        events_1.addScrollListeners(this);
        // SCROLL: now check if we are actually scrolling the pane
        if (this.vScrollTo != "") {
            var vScrollDate = new Date(vMinDate.getTime());
            var vScrollPx = 0;
            if (this.vScrollTo.substr && this.vScrollTo.substr(0, 2) == "px") {
                vScrollPx = parseInt(this.vScrollTo.substr(2));
            }
            else {
                if (this.vScrollTo === "today") {
                    vScrollDate = new Date();
                }
                else if (this.vScrollTo instanceof Date) {
                    vScrollDate = this.vScrollTo;
                }
                else {
                    vScrollDate = date_utils_1.parseDateStr(this.vScrollTo, this.getDateInputFormat());
                }
                if (this.vFormat == "hour")
                    vScrollDate.setMinutes(0, 0, 0);
                else
                    vScrollDate.setHours(0, 0, 0, 0);
                vScrollPx = general_utils_1.getOffset(vMinDate, vScrollDate, vColWidth, this.vFormat, this.vShowWeekends) - 30;
            }
            this.getChartBody().scrollLeft = vScrollPx;
        }
        if (vMinDate.getTime() <= new Date().getTime() && vMaxDate.getTime() >= new Date().getTime()) {
            this.vTodayPx = general_utils_1.getOffset(vMinDate, new Date(), vColWidth, this.vFormat, this.vShowWeekends);
        }
        else
            this.vTodayPx = -1;
        // DEPENDENCIES: Draw lines of Dependencies
        var bdd;
        if (this.vDebug) {
            bdd = new Date();
            console.info("before DrawDependencies", bdd);
        }
        if (this.vEvents && typeof this.vEvents.beforeLineDraw === "function") {
            this.vEvents.beforeLineDraw();
        }
        this.DrawDependencies(this.vDebug);
        events_1.addListenerDependencies(this.vLineOptions);
        // EVENTS
        if (this.vEvents && typeof this.vEvents.afterLineDraw === "function") {
            this.vEvents.afterLineDraw();
        }
        if (this.vDebug) {
            var ad = new Date();
            console.info("after DrawDependencies", ad, ad.getTime() - bdd.getTime());
        }
        this.drawComplete(vMinDate, vColWidth, bd);
    };
    /**
     * Actions after all the render process
     */
    this.drawComplete = function (vMinDate, vColWidth, bd) {
        if (this.vDebug) {
            var ad = new Date();
            console.info("after draw", ad, ad.getTime() - bd.getTime());
        }
        events_1.updateGridHeaderWidth(this);
        this.chartRowDateToX = function (date) {
            return general_utils_1.getOffset(vMinDate, date, vColWidth, this.vFormat, this.vShowWeekends);
        };
        if (this.vEvents && this.vEvents.afterDraw) {
            this.vEvents.afterDraw();
        }
    };
    if (this.vDiv && this.vDiv.nodeName && this.vDiv.nodeName.toLowerCase() == "div")
        this.vDivId = this.vDiv.id;
}; //GanttChart

},{"./draw_columns":3,"./draw_dependencies":4,"./events":5,"./lang":8,"./options":9,"./task":10,"./utils/date_utils":11,"./utils/draw_utils":12,"./utils/general_utils":13,"./xml":14,"jalali-moment":15}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.draw_task_headings = exports.draw_bottom = exports.draw_header = exports.COLUMN_ORDER = void 0;
var date_utils_1 = require("./utils/date_utils");
var task_1 = require("./task");
var events_1 = require("./events");
var draw_utils_1 = require("./utils/draw_utils");
exports.COLUMN_ORDER = [
    'vShowRes',
    'vShowDur',
    'vShowComp',
    'vShowStartDate',
    'vShowEndDate',
    'vShowPlanStartDate',
    'vShowPlanEndDate',
    'vShowCost',
    'vAdditionalHeaders',
    'vShowAddEntries'
];
var COLUMNS_TYPES = {
    'vShowRes': 'res',
    'vShowDur': 'dur',
    'vShowComp': 'comp',
    'vShowStartDate': 'startdate',
    'vShowEndDate': 'enddate',
    'vShowPlanStartDate': 'planstartdate',
    'vShowPlanEndDate': 'planenddate',
    'vShowCost': 'cost',
    'vShowAddEntries': 'addentries'
};
exports.draw_header = function (column, i, vTmpRow, vTaskList, vEditable, vEventsChange, vEvents, vDateTaskTableDisplayFormat, vAdditionalHeaders, vFormat, vLangs, vLang, vResources, Draw) {
    var vTmpCell, vTmpDiv;
    if ('vShowRes' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gres');
        var text = draw_utils_1.makeInput(vTaskList[i].getResource(), vEditable, 'resource', vTaskList[i].getResource(), vResources);
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setResource(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'res', Draw, 'change');
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'res');
    }
    if ('vShowDur' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gdur');
        var text = draw_utils_1.makeInput(vTaskList[i].getDuration(vFormat, vLangs[vLang]), vEditable, 'text', vTaskList[i].getDuration());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setDuration(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'dur', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'dur');
    }
    if ('vShowComp' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gcomp');
        var text = draw_utils_1.makeInput(vTaskList[i].getCompStr(), vEditable, 'percentage', vTaskList[i].getCompVal());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { task.setComp(e.target.value); task.setCompVal(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'comp', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'comp');
    }
    if ('vShowStartDate' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gstartdate');
        var v = date_utils_1.formatDateStr(vTaskList[i].getStartVar(), vDateTaskTableDisplayFormat, vLangs[vLang]);
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getStartVar());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setStart(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'start', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'start');
    }
    if ('vShowEndDate' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'genddate');
        var v = date_utils_1.formatDateStr(vTaskList[i].getEndVar(), vDateTaskTableDisplayFormat, vLangs[vLang]);
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getEndVar());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setEnd(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'end', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'end');
    }
    if ('vShowPlanStartDate' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gplanstartdate');
        var v = vTaskList[i].getPlanStart() ? date_utils_1.formatDateStr(vTaskList[i].getPlanStart(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getPlanStart());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setPlanStart(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'planstart', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'planstart');
    }
    if ('vShowPlanEndDate' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gplanenddate');
        var v = vTaskList[i].getPlanEnd() ? date_utils_1.formatDateStr(vTaskList[i].getPlanEnd(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getPlanEnd());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setPlanEnd(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'planend', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'planend');
    }
    if ('vShowCost' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gcost');
        var text = draw_utils_1.makeInput(vTaskList[i].getCost(), vEditable, 'cost');
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setCost(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'cost', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'cost');
    }
    if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
        for (var key in vAdditionalHeaders) {
            var header = vAdditionalHeaders[key];
            var css = header.class ? header.class : "gadditional-" + key;
            var data = vTaskList[i].getDataObject();
            vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, "gadditional " + css);
            vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, data ? data[key] : '');
            events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], "additional_" + key);
            // const callback = (task, e) => task.setCost(e.target.value);
            // addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'costdate');
        }
    }
    if ('vShowAddEntries' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gaddentries');
        var button = "<button>+</button>";
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, button);
        var callback = function (task, e) {
            task_1.AddTaskItemObject({
                vParent: task.getParent()
            });
        };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'addentries', Draw.bind(this));
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'addentries');
    }
};
exports.draw_bottom = function (column, vTmpRow, vAdditionalHeaders) {
    if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
        for (var key in vAdditionalHeaders) {
            var header = vAdditionalHeaders[key];
            var css = header.class ? header.class : "gadditional-" + key;
            draw_utils_1.newNode(vTmpRow, 'td', null, "gspanning gadditional " + css, '\u00A0');
        }
    }
    else {
        var type = COLUMNS_TYPES[column];
        draw_utils_1.newNode(vTmpRow, 'td', null, "gspanning g" + type, '\u00A0');
    }
};
// export const draw_list_headings = function (column, vTmpRow, vAdditionalHeaders, vEvents) {
//   let nodeCreated;
//   if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
//     for (const key in vAdditionalHeaders) {
//       const header = vAdditionalHeaders[key];
//       const css = header.class ? header.class : `gadditional-${key}`;
//       newNode(vTmpRow, 'td', null, `gspanning gadditional ${css}`, '\u00A0');
//     }
//   } else {
//     const type = COLUMNS_TYPES[column];
//     nodeCreated = newNode(vTmpRow, 'td', null, `gspanning g${type}`, '\u00A0');
//     addListenerClickCell(nodeCreated, vEvents, { hader: true, column }, type);
//   }
// }
exports.draw_task_headings = function (column, vTmpRow, vLangs, vLang, vAdditionalHeaders, vEvents) {
    var nodeCreated;
    if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
        for (var key in vAdditionalHeaders) {
            var header = vAdditionalHeaders[key];
            var text = header.translate ? vLangs[vLang][header.translate] : header.title;
            var css = header.class ? header.class : "gadditional-" + key;
            nodeCreated = draw_utils_1.newNode(vTmpRow, 'td', null, "gtaskheading gadditional " + css, text);
        }
    }
    else {
        var type = COLUMNS_TYPES[column];
        nodeCreated = draw_utils_1.newNode(vTmpRow, 'td', null, "gtaskheading g" + type, vLangs[vLang][type]);
        events_1.addListenerClickCell(nodeCreated, vEvents, { hader: true, column: column }, type);
    }
};

},{"./events":5,"./task":10,"./utils/date_utils":11,"./utils/draw_utils":12}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawDependencies = exports.drawDependency = void 0;
exports.drawDependency = function (x1, y1, x2, y2, pType, pClass) {
    var vDir = 1;
    var vBend = false;
    var vShort = 4;
    var vRow = Math.floor(this.getRowHeight() / 2);
    if (y2 < y1)
        vRow *= -1;
    switch (pType) {
        case 'SF':
            vShort *= -1;
            if (x1 - 10 <= x2 && y1 != y2)
                vBend = true;
            vDir = -1;
            break;
        case 'SS':
            if (x1 < x2)
                vShort *= -1;
            else
                vShort = x2 - x1 - (2 * vShort);
            break;
        case 'FF':
            if (x1 <= x2)
                vShort = x2 - x1 + (2 * vShort);
            vDir = -1;
            break;
        default:
            if (x1 + 10 >= x2 && y1 != y2)
                vBend = true;
            break;
    }
    if (vBend) {
        this.sLine(x1, y1, x1 + vShort, y1, pClass);
        this.sLine(x1 + vShort, y1, x1 + vShort, y2 - vRow, pClass);
        this.sLine(x1 + vShort, y2 - vRow, x2 - (vShort * 2), y2 - vRow, pClass);
        this.sLine(x2 - (vShort * 2), y2 - vRow, x2 - (vShort * 2), y2, pClass);
        this.sLine(x2 - (vShort * 2), y2, x2 - (1 * vDir), y2, pClass);
    }
    else if (y1 != y2) {
        this.sLine(x1, y1, x1 + vShort, y1, pClass);
        this.sLine(x1 + vShort, y1, x1 + vShort, y2, pClass);
        this.sLine(x1 + vShort, y2, x2 - (1 * vDir), y2, pClass);
    }
    else
        this.sLine(x1, y1, x2 - (1 * vDir), y2, pClass);
    var vTmpDiv = this.sLine(x2, y2, x2 - 3 - ((vDir < 0) ? 1 : 0), y2 - 3 - ((vDir < 0) ? 1 : 0), pClass + "Arw");
    vTmpDiv.style.width = '0px';
    vTmpDiv.style.height = '0px';
};
exports.DrawDependencies = function (vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    if (this.getShowDeps() == 1) {
        this.CalcTaskXY(); //First recalculate the x,y
        this.clearDependencies();
        var vList = this.getList();
        for (var i = 0; i < vList.length; i++) {
            var vDepend = vList[i].getDepend();
            var vDependType = vList[i].getDepType();
            var n = vDepend.length;
            if (n > 0 && vList[i].getVisible() == 1) {
                for (var k = 0; k < n; k++) {
                    var vTask = this.getArrayLocationByID(vDepend[k]);
                    if (vTask >= 0 && vList[vTask].getGroup() != 2) {
                        if (vList[vTask].getVisible() == 1) {
                            if (vDebug) {
                                console.info("init drawDependency ", vList[vTask].getID(), new Date());
                            }
                            var cssClass = 'gDepId' + vList[vTask].getID() +
                                ' ' + 'gDepNextId' + vList[i].getID();
                            var dependedData = vList[vTask].getDataObject();
                            var nextDependedData = vList[i].getDataObject();
                            if (dependedData && dependedData.pID && nextDependedData && nextDependedData.pID) {
                                cssClass += ' gDepDataId' + dependedData.pID + ' ' + 'gDepNextDataId' + nextDependedData.pID;
                            }
                            if (vDependType[k] == 'SS')
                                this.drawDependency(vList[vTask].getStartX() - 1, vList[vTask].getStartY(), vList[i].getStartX() - 1, vList[i].getStartY(), 'SS', cssClass + ' gDepSS');
                            else if (vDependType[k] == 'FF')
                                this.drawDependency(vList[vTask].getEndX(), vList[vTask].getEndY(), vList[i].getEndX(), vList[i].getEndY(), 'FF', cssClass + ' gDepFF');
                            else if (vDependType[k] == 'SF')
                                this.drawDependency(vList[vTask].getStartX() - 1, vList[vTask].getStartY(), vList[i].getEndX(), vList[i].getEndY(), 'SF', cssClass + ' gDepSF');
                            else if (vDependType[k] == 'FS')
                                this.drawDependency(vList[vTask].getEndX(), vList[vTask].getEndY(), vList[i].getStartX() - 1, vList[i].getStartY(), 'FS', cssClass + ' gDepFS');
                        }
                    }
                }
            }
        }
    }
    // draw the current date line
    if (this.vTodayPx >= 0) {
        this.sLine(this.vTodayPx, 0, this.vTodayPx, this.getChartTable().offsetHeight - 1, 'gCurDate');
    }
};

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addListenerDependencies = exports.addListenerInputCell = exports.addListenerClickCell = exports.addScrollListeners = exports.addFormatListeners = exports.addFolderListeners = exports.updateGridHeaderWidth = exports.addThisRowListeners = exports.addTooltipListeners = exports.syncScroll = exports.removeListener = exports.addListener = exports.showToolTip = exports.mouseOut = exports.mouseOver = exports.show = exports.hide = exports.folder = void 0;
var general_utils_1 = require("./utils/general_utils");
// Function to open/close and hide/show children of specified task
exports.folder = function (pID, ganttObj) {
    var vList = ganttObj.getList();
    ganttObj.clearDependencies(); // clear these first so slow rendering doesn't look odd
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getID() == pID) {
            if (vList[i].getOpen() == 1) {
                vList[i].setOpen(0);
                exports.hide(pID, ganttObj);
                if (general_utils_1.isIE())
                    vList[i].getGroupSpan().innerText = '+';
                else
                    vList[i].getGroupSpan().textContent = '+';
            }
            else {
                vList[i].setOpen(1);
                exports.show(pID, 1, ganttObj);
                if (general_utils_1.isIE())
                    vList[i].getGroupSpan().innerText = '-';
                else
                    vList[i].getGroupSpan().textContent = '-';
            }
        }
    }
    var bd;
    if (this.vDebug) {
        bd = new Date();
        console.info('after drawDependency', bd);
    }
    ganttObj.DrawDependencies(this.vDebug);
    if (this.vDebug) {
        var ad = new Date();
        console.info('after drawDependency', ad, (ad.getTime() - bd.getTime()));
    }
};
exports.hide = function (pID, ganttObj) {
    var vList = ganttObj.getList();
    var vID = 0;
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getParent() == pID) {
            vID = vList[i].getID();
            // it's unlikely but if the task list has been updated since
            // the chart was drawn some of the rows may not exist
            if (vList[i].getListChildRow())
                vList[i].getListChildRow().style.display = 'none';
            if (vList[i].getChildRow())
                vList[i].getChildRow().style.display = 'none';
            vList[i].setVisible(0);
            if (vList[i].getGroup())
                exports.hide(vID, ganttObj);
        }
    }
};
// Function to show children of specified task
exports.show = function (pID, pTop, ganttObj) {
    var vList = ganttObj.getList();
    var vID = 0;
    var vState = '';
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getParent() == pID) {
            if (!vList[i].getParItem()) {
                console.error("Cant find parent on who event (maybe problems with Task ID and Parent Id mixes?)");
            }
            if (vList[i].getParItem().getGroupSpan()) {
                if (general_utils_1.isIE())
                    vState = vList[i].getParItem().getGroupSpan().innerText;
                else
                    vState = vList[i].getParItem().getGroupSpan().textContent;
            }
            i = vList.length;
        }
    }
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getParent() == pID) {
            var vChgState = false;
            vID = vList[i].getID();
            if (pTop == 1 && vState == '+')
                vChgState = true;
            else if (vState == '-')
                vChgState = true;
            else if (vList[i].getParItem() && vList[i].getParItem().getGroup() == 2)
                vList[i].setVisible(1);
            if (vChgState) {
                if (vList[i].getListChildRow())
                    vList[i].getListChildRow().style.display = '';
                if (vList[i].getChildRow())
                    vList[i].getChildRow().style.display = '';
                vList[i].setVisible(1);
            }
            if (vList[i].getGroup())
                exports.show(vID, 0, ganttObj);
        }
    }
};
exports.mouseOver = function (pObj1, pObj2) {
    if (this.getUseRowHlt()) {
        pObj1.className += ' gitemhighlight';
        pObj2.className += ' gitemhighlight';
    }
};
exports.mouseOut = function (pObj1, pObj2) {
    if (this.getUseRowHlt()) {
        pObj1.className = pObj1.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
        pObj2.className = pObj2.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
    }
};
exports.showToolTip = function (pGanttChartObj, e, pContents, pWidth, pTimer) {
    var vTtDivId = pGanttChartObj.getDivId() + 'JSGanttToolTip';
    var vMaxW = 500;
    var vMaxAlpha = 100;
    var vShowing = pContents.id;
    if (pGanttChartObj.getUseToolTip()) {
        if (pGanttChartObj.vTool == null) {
            pGanttChartObj.vTool = document.createElement('div');
            pGanttChartObj.vTool.id = vTtDivId;
            pGanttChartObj.vTool.className = 'JSGanttToolTip';
            pGanttChartObj.vTool.vToolCont = document.createElement('div');
            pGanttChartObj.vTool.vToolCont.id = vTtDivId + 'cont';
            pGanttChartObj.vTool.vToolCont.className = 'JSGanttToolTipcont';
            pGanttChartObj.vTool.vToolCont.setAttribute('showing', '');
            pGanttChartObj.vTool.appendChild(pGanttChartObj.vTool.vToolCont);
            document.body.appendChild(pGanttChartObj.vTool);
            pGanttChartObj.vTool.style.opacity = 0;
            pGanttChartObj.vTool.setAttribute('currentOpacity', 0);
            pGanttChartObj.vTool.setAttribute('fadeIncrement', 10);
            pGanttChartObj.vTool.setAttribute('moveSpeed', 10);
            pGanttChartObj.vTool.style.filter = 'alpha(opacity=0)';
            pGanttChartObj.vTool.style.visibility = 'hidden';
            pGanttChartObj.vTool.style.left = Math.floor(((e) ? e.clientX : window.event.clientX) / 2) + 'px';
            pGanttChartObj.vTool.style.top = Math.floor(((e) ? e.clientY : window.event.clientY) / 2) + 'px';
            this.addListener('mouseover', function () { clearTimeout(pGanttChartObj.vTool.delayTimeout); }, pGanttChartObj.vTool);
            this.addListener('mouseout', function () { general_utils_1.delayedHide(pGanttChartObj, pGanttChartObj.vTool, pTimer); }, pGanttChartObj.vTool);
        }
        clearTimeout(pGanttChartObj.vTool.delayTimeout);
        var newHTML = pContents.innerHTML;
        if (pGanttChartObj.vTool.vToolCont.getAttribute("content") !== newHTML) {
            pGanttChartObj.vTool.vToolCont.innerHTML = pContents.innerHTML;
            // as we are allowing arbitrary HTML we should remove any tag ids to prevent duplication
            general_utils_1.stripIds(pGanttChartObj.vTool.vToolCont);
            pGanttChartObj.vTool.vToolCont.setAttribute("content", newHTML);
        }
        if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing || pGanttChartObj.vTool.style.visibility != 'visible') {
            if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing) {
                pGanttChartObj.vTool.vToolCont.setAttribute('showing', vShowing);
            }
            pGanttChartObj.vTool.style.visibility = 'visible';
            // Rather than follow the mouse just have it stay put
            general_utils_1.updateFlyingObj(e, pGanttChartObj, pTimer);
            pGanttChartObj.vTool.style.width = (pWidth) ? pWidth + 'px' : 'auto';
            if (!pWidth && general_utils_1.isIE()) {
                pGanttChartObj.vTool.style.width = pGanttChartObj.vTool.offsetWidth;
            }
            if (pGanttChartObj.vTool.offsetWidth > vMaxW) {
                pGanttChartObj.vTool.style.width = vMaxW + 'px';
            }
        }
        if (pGanttChartObj.getUseFade()) {
            clearInterval(pGanttChartObj.vTool.fadeInterval);
            pGanttChartObj.vTool.fadeInterval = setInterval(function () { general_utils_1.fadeToolTip(1, pGanttChartObj.vTool, vMaxAlpha); }, pTimer);
        }
        else {
            pGanttChartObj.vTool.style.opacity = vMaxAlpha * 0.01;
            pGanttChartObj.vTool.style.filter = 'alpha(opacity=' + vMaxAlpha + ')';
        }
    }
};
exports.addListener = function (eventName, handler, control) {
    // Check if control is a string
    if (control === String(control))
        control = general_utils_1.findObj(control);
    if (control.addEventListener) //Standard W3C
     {
        return control.addEventListener(eventName, handler, false);
    }
    else if (control.attachEvent) //IExplore
     {
        return control.attachEvent('on' + eventName, handler);
    }
    else {
        return false;
    }
};
exports.removeListener = function (eventName, handler, control) {
    // Check if control is a string
    if (control === String(control))
        control = general_utils_1.findObj(control);
    if (control.removeEventListener) {
        //Standard W3C
        return control.removeEventListener(eventName, handler, false);
    }
    else if (control.detachEvent) {
        //IExplore
        return control.attachEvent('on' + eventName, handler);
    }
    else {
        return false;
    }
};
exports.syncScroll = function (elements, attrName) {
    var syncFlags = new Map(elements.map(function (e) { return [e, false]; }));
    function scrollEvent(e) {
        if (!syncFlags.get(e.target)) {
            for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
                var el = elements_2[_i];
                if (el !== e.target) {
                    syncFlags.set(el, true);
                    el[attrName] = e.target[attrName];
                }
            }
        }
        syncFlags.set(e.target, false);
    }
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var el = elements_1[_i];
        el.addEventListener('scroll', scrollEvent);
    }
};
exports.addTooltipListeners = function (pGanttChart, pObj1, pObj2, callback) {
    var isShowingTooltip = false;
    exports.addListener('mouseover', function (e) {
        if (isShowingTooltip || !callback) {
            exports.showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
        }
        else if (callback) {
            isShowingTooltip = true;
            var promise = callback();
            exports.showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
            if (promise && promise.then) {
                promise.then(function () {
                    if (pGanttChart.vTool.vToolCont.getAttribute('showing') === pObj2.id &&
                        pGanttChart.vTool.style.visibility === 'visible') {
                        exports.showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
                    }
                });
            }
        }
    }, pObj1);
    exports.addListener('mouseout', function (e) {
        var outTo = e.relatedTarget;
        if (general_utils_1.isParentElementOrSelf(outTo, pObj1) || (pGanttChart.vTool && general_utils_1.isParentElementOrSelf(outTo, pGanttChart.vTool))) {
            // not actually out
        }
        else {
            isShowingTooltip = false;
        }
        general_utils_1.delayedHide(pGanttChart, pGanttChart.vTool, pGanttChart.getTimer());
    }, pObj1);
};
exports.addThisRowListeners = function (pGanttChart, pObj1, pObj2) {
    exports.addListener('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj1);
    exports.addListener('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj2);
    exports.addListener('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj1);
    exports.addListener('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj2);
};
exports.updateGridHeaderWidth = function (pGanttChart) {
    var head = pGanttChart.getChartHead();
    var body = pGanttChart.getChartBody();
    if (!head || !body)
        return;
    var isScrollVisible = body.scrollHeight > body.clientHeight;
    if (isScrollVisible) {
        head.style.width = "calc(100% - " + general_utils_1.getScrollbarWidth() + "px)";
    }
    else {
        head.style.width = '100%';
    }
};
exports.addFolderListeners = function (pGanttChart, pObj, pID) {
    exports.addListener('click', function () {
        exports.folder(pID, pGanttChart);
        exports.updateGridHeaderWidth(pGanttChart);
    }, pObj);
};
exports.addFormatListeners = function (pGanttChart, pFormat, pObj) {
    exports.addListener('click', function () { general_utils_1.changeFormat(pFormat, pGanttChart); }, pObj);
};
exports.addScrollListeners = function (pGanttChart) {
    exports.addListener('resize', function () { pGanttChart.getChartHead().scrollLeft = pGanttChart.getChartBody().scrollLeft; }, window);
    exports.addListener('resize', function () {
        pGanttChart.getListBody().scrollTop = pGanttChart.getChartBody().scrollTop;
    }, window);
};
exports.addListenerClickCell = function (vTmpCell, vEvents, task, column) {
    exports.addListener('click', function (e) {
        if (e.target.classList.contains('gfoldercollapse') === false &&
            vEvents[column] && typeof vEvents[column] === 'function') {
            vEvents[column](task, e, vTmpCell, column);
        }
    }, vTmpCell);
};
exports.addListenerInputCell = function (vTmpCell, vEventsChange, callback, tasks, index, column, draw, event) {
    if (draw === void 0) { draw = null; }
    if (event === void 0) { event = 'blur'; }
    var task = tasks[index];
    if (vTmpCell.children[0] && vTmpCell.children[0].children && vTmpCell.children[0].children[0]) {
        var tagName = vTmpCell.children[0].children[0].tagName;
        var selectInputOrButton = tagName === 'SELECT' || tagName === 'INPUT' || tagName === 'BUTTON';
        if (selectInputOrButton) {
            exports.addListener(event, function (e) {
                if (callback) {
                    callback(task, e);
                }
                if (vEventsChange[column] && typeof vEventsChange[column] === 'function') {
                    var q = vEventsChange[column](tasks, task, e, vTmpCell, vColumnsNames[column]);
                    if (q && q.then) {
                        q.then(function (e) { return draw(); });
                    }
                    else {
                        draw();
                    }
                }
                else {
                    draw();
                }
            }, vTmpCell.children[0].children[0]);
        }
    }
};
exports.addListenerDependencies = function (vLineOptions) {
    var elements = document.querySelectorAll('.gtaskbarcontainer');
    for (var i = 0; i < elements.length; i++) {
        var taskDiv = elements[i];
        taskDiv.addEventListener('mouseover', function (e) {
            toggleDependencies(e, vLineOptions);
        });
        taskDiv.addEventListener('mouseout', function (e) {
            toggleDependencies(e, vLineOptions);
        });
    }
};
var toggleDependencies = function (e, vLineOptions) {
    var target = e.currentTarget;
    var ids = target.getAttribute('id').split('_');
    var style = vLineOptions && vLineOptions.borderStyleHover !== undefined ? vLineOptions.hoverStyle : 'groove';
    if (e.type === 'mouseout') {
        style = '';
    }
    if (ids.length > 1) {
        var frameZones = Array.from(document.querySelectorAll(".gDepId" + ids[1]));
        frameZones.forEach(function (c) {
            c.style.borderStyle = style;
        });
        // document.querySelectorAll(`.gDepId${ids[1]}`).forEach((c: any) => {
        // c.style.borderStyle = style;
        // });
    }
};
var vColumnsNames = {
    taskname: 'pName',
    res: 'pRes',
    dur: '',
    comp: 'pComp',
    start: 'pStart',
    end: 'pEnd',
    planstart: 'pPlanStart',
    planend: 'pPlanEnd',
    link: 'pLink',
    cost: 'pCost',
    mile: 'pMile',
    group: 'pGroup',
    parent: 'pParent',
    open: 'pOpen',
    depend: 'pDepend',
    caption: 'pCaption',
    note: 'pNotes'
};

},{"./utils/general_utils":13}],6:[function(require,module,exports){
"use strict";
/*
    * Copyright (c) 2013-2018, Paul Geldart, Eduardo Rodrigues, Ricardo Cardoso and Mario Mol.
    *
    * Redistribution and use in source and binary forms, with or without
    * modification, are permitted provided that the following conditions are met:
    *     * Redistributions of source code must retain the above copyright
    *       notice, this list of conditions and the following disclaimer.
    *     * Redistributions in binary form must reproduce the above copyright
    *       notice, this list of conditions and the following disclaimer in the
    *       documentation and/or other materials provided with the distribution.
    *     * Neither the name of AUTHORS nor the names of its contributors
    *       may be used to endorse or promote products derived from this software
    *       without specific prior written permission.
    *
    * THIS SOFTWARE IS PROVIDED BY THE AUTHORS ''AS IS'' AND ANY EXPRESS OR
    * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
    * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
    * IN NO EVENT SHALL AUTHORS BE LIABLE FOR ANY DIRECT,
    * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

    This project is based on jsGantt 1.2, (which can be obtained from
    https://code.google.com/p/jsgantt/) and remains under the original BSD license.
    Copyright (c) 2009, Shlomy Gantz BlueBrick Inc.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSGantt = void 0;
var events_1 = require("./events");
var general_utils_1 = require("./utils/general_utils");
var xml_1 = require("./xml");
var task_1 = require("./task");
var draw_1 = require("./draw");
var json_1 = require("./json");
var date_utils_1 = require("./utils/date_utils");
if (!exports.JSGantt)
    exports.JSGantt = {};
exports.JSGantt.isIE = general_utils_1.isIE;
exports.JSGantt.TaskItem = task_1.TaskItem;
exports.JSGantt.GanttChart = draw_1.GanttChart;
exports.JSGantt.updateFlyingObj = general_utils_1.updateFlyingObj;
exports.JSGantt.showToolTip = events_1.showToolTip;
exports.JSGantt.stripIds = general_utils_1.stripIds;
exports.JSGantt.stripUnwanted = general_utils_1.stripUnwanted;
exports.JSGantt.delayedHide = general_utils_1.delayedHide;
exports.JSGantt.hideToolTip = general_utils_1.hideToolTip;
exports.JSGantt.fadeToolTip = general_utils_1.fadeToolTip;
exports.JSGantt.moveToolTip = general_utils_1.moveToolTip;
exports.JSGantt.getZoomFactor = general_utils_1.getZoomFactor;
exports.JSGantt.getOffset = general_utils_1.getOffset;
exports.JSGantt.getScrollPositions = general_utils_1.getScrollPositions;
exports.JSGantt.processRows = task_1.processRows;
exports.JSGantt.sortTasks = task_1.sortTasks;
// Used to determine the minimum date of all tasks and set lower bound based on format
exports.JSGantt.getMinDate = date_utils_1.getMinDate;
// Used to determine the maximum date of all tasks and set upper bound based on format
exports.JSGantt.getMaxDate = date_utils_1.getMaxDate;
// This function finds the document id of the specified object
exports.JSGantt.findObj = general_utils_1.findObj;
exports.JSGantt.changeFormat = general_utils_1.changeFormat;
// Tasks
exports.JSGantt.folder = events_1.folder;
exports.JSGantt.hide = events_1.hide;
exports.JSGantt.show = events_1.show;
exports.JSGantt.taskLink = task_1.taskLink;
exports.JSGantt.parseDateStr = date_utils_1.parseDateStr;
exports.JSGantt.formatDateStr = date_utils_1.formatDateStr;
exports.JSGantt.parseDateFormatStr = date_utils_1.parseDateFormatStr;
// XML 
exports.JSGantt.parseXML = xml_1.parseXML;
exports.JSGantt.parseXMLString = xml_1.parseXMLString;
exports.JSGantt.findXMLNode = xml_1.findXMLNode;
exports.JSGantt.getXMLNodeValue = xml_1.getXMLNodeValue;
exports.JSGantt.AddXMLTask = xml_1.AddXMLTask;
// JSON
exports.JSGantt.parseJSON = json_1.parseJSON;
exports.JSGantt.parseJSONString = json_1.parseJSONString;
exports.JSGantt.addJSONTask = json_1.addJSONTask;
exports.JSGantt.benchMark = general_utils_1.benchMark;
exports.JSGantt.getIsoWeek = date_utils_1.getIsoWeek;
exports.JSGantt.addListener = events_1.addListener;
exports.JSGantt.addTooltipListeners = events_1.addTooltipListeners;
exports.JSGantt.addThisRowListeners = events_1.addThisRowListeners;
exports.JSGantt.addFolderListeners = events_1.addFolderListeners;
exports.JSGantt.addFormatListeners = events_1.addFormatListeners;
exports.JSGantt.addScrollListeners = events_1.addScrollListeners;
exports.JSGantt.criticalPath = general_utils_1.criticalPath;

},{"./draw":2,"./events":5,"./json":7,"./task":10,"./utils/date_utils":11,"./utils/general_utils":13,"./xml":14}],7:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addJSONTask = exports.parseJSONString = exports.parseJSON = void 0;
var task_1 = require("./task");
var general_utils_1 = require("./utils/general_utils");
/**
 *
 * @param pFile
 * @param pGanttlet
 */
exports.parseJSON = function (pFile, pGanttVar, vDebug, redrawAfter) {
    if (vDebug === void 0) { vDebug = false; }
    if (redrawAfter === void 0) { redrawAfter = true; }
    return __awaiter(this, void 0, void 0, function () {
        var jsonObj, bd, ad;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, general_utils_1.makeRequest(pFile, true, true)];
                case 1:
                    jsonObj = _a.sent();
                    if (vDebug) {
                        bd = new Date();
                        console.info('before jsonparse', bd);
                    }
                    exports.addJSONTask(pGanttVar, jsonObj);
                    if (this.vDebug) {
                        ad = new Date();
                        console.info('after addJSONTask', ad, (ad.getTime() - bd.getTime()));
                    }
                    if (redrawAfter) {
                        pGanttVar.Draw();
                    }
                    return [2 /*return*/, jsonObj];
            }
        });
    });
};
exports.parseJSONString = function (pStr, pGanttVar) {
    exports.addJSONTask(pGanttVar, JSON.parse(pStr));
};
exports.addJSONTask = function (pGanttVar, pJsonObj) {
    for (var index = 0; index < pJsonObj.length; index++) {
        var id = void 0;
        var name_1 = void 0;
        var start = void 0;
        var end = void 0;
        var planstart = void 0;
        var planend = void 0;
        var itemClass = void 0;
        var planClass = void 0;
        var link = '';
        var milestone = 0;
        var resourceName = '';
        var completion = void 0;
        var group = 0;
        var parent_1 = void 0;
        var open_1 = void 0;
        var dependsOn = '';
        var caption = '';
        var notes = '';
        var cost = void 0;
        var duration = '';
        var bartext = '';
        var additionalObject = {};
        for (var prop in pJsonObj[index]) {
            var property = prop;
            var value = pJsonObj[index][property];
            switch (property.toLowerCase()) {
                case 'pid':
                case 'id':
                    id = value;
                    break;
                case 'pname':
                case 'name':
                    name_1 = value;
                    break;
                case 'pstart':
                case 'start':
                    start = value;
                    break;
                case 'pend':
                case 'end':
                    end = value;
                    break;
                case 'pplanstart':
                case 'planstart':
                    planstart = value;
                    break;
                case 'pplanend':
                case 'planend':
                    planend = value;
                    break;
                case 'pclass':
                case 'class':
                    itemClass = value;
                    break;
                case 'pplanclass':
                case 'planclass':
                    planClass = value;
                    break;
                case 'plink':
                case 'link':
                    link = value;
                    break;
                case 'pmile':
                case 'mile':
                    milestone = value;
                    break;
                case 'pres':
                case 'res':
                    resourceName = value;
                    break;
                case 'pcomp':
                case 'comp':
                    completion = value;
                    break;
                case 'pgroup':
                case 'group':
                    group = value;
                    break;
                case 'pparent':
                case 'parent':
                    parent_1 = value;
                    break;
                case 'popen':
                case 'open':
                    open_1 = value;
                    break;
                case 'pdepend':
                case 'depend':
                    dependsOn = value;
                    break;
                case 'pcaption':
                case 'caption':
                    caption = value;
                    break;
                case 'pnotes':
                case 'notes':
                    notes = value;
                    break;
                case 'pcost':
                case 'cost':
                    cost = value;
                    break;
                case 'duration':
                case 'pduration':
                    duration = value;
                    break;
                case 'bartext':
                case 'pbartext':
                    bartext = value;
                    break;
                default:
                    additionalObject[property.toLowerCase()] = value;
            }
        }
        //if (id != undefined && !isNaN(parseInt(id)) && isFinite(id) && name && start && end && itemClass && completion != undefined && !isNaN(parseFloat(completion)) && isFinite(completion) && !isNaN(parseInt(parent)) && isFinite(parent)) {
        pGanttVar.AddTaskItem(new task_1.TaskItem(id, name_1, start, end, itemClass, link, milestone, resourceName, completion, group, parent_1, open_1, dependsOn, caption, notes, pGanttVar, cost, planstart, planend, duration, bartext, additionalObject, planClass));
        //}
    }
};

},{"./task":10,"./utils/general_utils":13}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fa = exports.tr = exports.sv = exports.ru = exports.pt = exports.pl = exports.nl = exports.ko = exports.ja = exports.id = exports.hu = exports.it = exports.fr = exports.fi = exports.de = exports.es = exports.en = exports.cs = exports.cn = void 0;
var cn = {
    'january': '一月',
    'february': '二月',
    'march': '三月',
    'april': '四月',
    'maylong': '五月',
    'june': '六月',
    'july': '七月',
    'august': '八月',
    'september': '九月',
    'october': '十月',
    'november': '十一月',
    'december': '十二月',
    'jan': '一月',
    'feb': '二月',
    'mar': '三月',
    'apr': '四月',
    'may': '五月',
    'jun': '六月',
    'jul': '七月',
    'aug': '八月',
    'sep': '九月',
    'oct': '十月',
    'nov': '十一月',
    'dec': '十二月',
    'sunday': '星期日',
    'monday': '星期一',
    'tuesday': '星期二',
    'wednesday': '星期三',
    'thursday': '星期四',
    'friday': '星期五',
    'saturday': '星期六',
    'sun': '星期日',
    'mon': '星期一',
    'tue': '星期二',
    'wed': '星期三',
    'thu': '星期四',
    'fri': '星期五',
    'sat': '星期六',
    'res': '資源',
    'dur': '時程',
    'comp': '達成率',
    'completion': '達成',
    'startdate': '起始日期',
    'planstartdate': '計劃起始日期',
    'enddate': '截止日期',
    'planenddate': '計劃截止日期',
    'cost': '成本',
    'moreinfo': "更多資訊",
    'nodata': 'No tasks found',
    'notes': '備註',
    'format': '格式',
    'hour': '時',
    'day': '日',
    'week': '星期',
    'month': '月',
    'quarter': '季',
    'hours': '小時',
    'days': '天',
    'weeks': '週',
    'months': '月',
    'quarters': '季',
    'hr': '小時',
    'dy': '天',
    'wk': '週',
    'mth': '月',
    'qtr': '季',
    'hrs': '小時',
    'dys': '天',
    'wks': '週',
    'mths': '月',
    'qtrs': '季'
};
exports.cn = cn;
var cs = {
    'format': 'Zobrazení',
    'hour': 'Hodina',
    'day': 'Den',
    'week': 'Týden',
    'month': 'Měsíc',
    'quarter': 'Kvartál',
    'hours': 'Hodiny',
    'days': 'Dni',
    'weeks': 'Týdny',
    'months': 'Měsíce',
    'quarters': 'Kvartály',
    'hr': 'Ho',
    'dy': 'Den',
    'wk': 'Tyd',
    'mth': 'Měs',
    'qtr': 'Kvar',
    'hrs': 'Ho',
    'dys': 'Dni',
    'wks': 'Tyd',
    'mths': 'Měs',
    'qtrs': 'Kvar',
    'res': 'Přiřazeno',
    'dur': 'Trvání',
    'comp': '% Hotovo',
    'completion': 'Hotovo',
    'startdate': 'Start',
    'planstartdate': 'Plánovaný start',
    'enddate': 'Konec',
    'planenddate': 'Plánovaný konec',
    'cost': 'Náklady',
    'moreinfo': 'Více informací',
    'nodata': 'No tasks found',
    'notes': 'Poznámky',
    'january': 'Leden',
    'february': 'Únor',
    'march': 'Březen',
    'april': 'Duben',
    'maylong': 'Květen',
    'june': 'Červen',
    'july': 'Červenec',
    'august': 'Srpen',
    'september': 'Září',
    'october': 'Říjen',
    'november': 'Listopad',
    'december': 'Prosinec',
    'jan': 'Led',
    'feb': 'Úno',
    'mar': 'Bře',
    'apr': 'Dub',
    'may': 'Kvě',
    'jun': 'Čer',
    'jul': 'Čvc',
    'aug': 'Srp',
    'sep': 'Zář',
    'oct': 'Říj',
    'nov': 'Lis',
    'dec': 'Pro',
    'sunday': 'Neděle',
    'monday': 'Pondělí',
    'tuesday': 'Úterý',
    'wednesday': 'Středa',
    'thursday': 'Čtvrtek',
    'friday': 'Pátek',
    'saturday': 'Sobota',
    'sun': 'Ne',
    'mon': 'Po',
    'tue': 'Út',
    'wed': 'St',
    'thu': 'Čt',
    'fri': 'Pa',
    'sat': 'So',
    'tooltipLoading': 'Nahrávám...'
};
exports.cs = cs;
var de = {
    'format': 'Ansicht',
    'hour': 'Stunde',
    'day': 'Tag',
    'week': 'Woche',
    'month': 'Monat',
    'quarter': 'Quartal',
    'hours': 'Stunden',
    'days': 'Tage',
    'weeks': 'Wochen',
    'months': 'Monate',
    'quarters': 'Quartale',
    'hr': 'h',
    'dy': 'T',
    'wk': 'W',
    'mth': 'M',
    'qtr': 'Q',
    'hrs': 'Std',
    'dys': 'Tage',
    'wks': 'Wochen',
    'mths': 'Monate',
    'qtrs': 'Quartal',
    'res': 'Resource',
    'dur': 'Dauer',
    'comp': '%Fertig',
    'completion': 'Fertigstellung',
    'startdate': 'Erste Buchu',
    'planstartdate': 'Erste Buchu Plan',
    'enddate': 'Letzte Buchung',
    'planenddate': 'Plan Letzte Buchung',
    'cost': 'Cost',
    'moreinfo': 'Weitere Infos',
    'nodata': 'No tasks found',
    'notes': 'Anmerkung',
    'january': 'Jänner',
    'february': 'Februar',
    'march': 'März',
    'april': 'April',
    'maylong': 'Mai',
    'june': 'Juni',
    'july': 'Juli',
    'august': 'August',
    'september': 'September',
    'october': 'Oktober',
    'november': 'November',
    'december': 'Dezember',
    'jan': 'Jan',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Apr',
    'may': 'Mai',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Aug',
    'sep': 'Sep',
    'oct': 'Okt',
    'nov': 'Nov',
    'dec': 'Dez',
    'sunday': 'Sonntag',
    'monday': 'Montag',
    'tuesday': 'Dienstag',
    'wednesday': 'Mittwoch',
    'thursday': 'Donnerstag',
    'friday': 'Freitag',
    'saturday': 'Samstag',
    'sun': 'So',
    'mon': 'Mo', 'tue': 'Di', 'wed': 'Mi', 'thu': 'Do', 'fri': 'Fr', 'sat': 'Sa'
};
exports.de = de;
var es = {
    'january': 'Enero',
    'february': 'Febrero',
    'march': 'Marzo',
    'april': 'Abril',
    'maylong': 'Mayo',
    'june': 'Junio',
    'july': 'Julio',
    'august': 'Agosto',
    'september': 'Septiembre',
    'october': 'Octubre',
    'november': 'Noviembre',
    'december': 'Diciembre',
    'jan': 'Ene',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Abr',
    'may': 'May',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Ago',
    'sep': 'Sep',
    'oct': 'Oct',
    'nov': 'Nov',
    'dec': 'Dic',
    'sunday': 'Domingo',
    'monday': 'Lunes',
    'tuesday': 'Martes',
    'wednesday': 'Miércoles',
    'thursday': 'Jueves',
    'friday': 'Viernes',
    'saturday': 'Sábado',
    'sun': '	Dom',
    'mon': '	Lun',
    'tue': '	Mar',
    'wed': '	Mie',
    'thu': '	Jue',
    'fri': '	Vie',
    'sat': '	Sab',
    'res': 'Recurso',
    'dur': 'Duración',
    'comp': '% Compl.',
    'completion': 'Completado',
    'startdate': 'Inicio',
    'planstartdate': 'Inicio Planificado',
    'cost': 'Coste',
    'enddate': 'Fin',
    'planenddate': 'Fin Planificado',
    'moreinfo': 'Más Información',
    'nodata': 'No tasks found',
    'notes': 'Notas',
    'format': 'Formato',
    'hour': 'Hora',
    'day': 'Día',
    'week': 'Semana',
    'month': 'Mes',
    'quarter': 'Trimestre',
    'hours': 'Horas',
    'days': 'Días',
    'weeks': 'Semanas',
    'months': 'Meses',
    'quarters': 'Trimestres',
    'hr': 'h',
    'dy': 'Día',
    'wk': 'Sem.',
    'mth': 'Mes',
    'qtr': 'Trim.',
    'hrs': 'h',
    'dys': 'Días',
    'wks': 'Sem.',
    'mths': 'Meses',
    'qtrs': 'Trim.',
    'tooltipLoading': 'Cargando...'
};
exports.es = es;
var en = {
    'format': 'Format',
    'hour': 'Hour',
    'day': 'Day',
    'week': 'Week',
    'month': 'Month',
    'quarter': 'Quarter',
    'hours': 'Hours',
    'days': 'Days',
    'weeks': 'Weeks',
    'months': 'Months',
    'quarters': 'Quarters',
    'hr': 'Hr',
    'dy': 'Day',
    'wk': 'Wk',
    'mth': 'Mth',
    'qtr': 'Qtr',
    'hrs': 'Hrs',
    'dys': 'Days',
    'wks': 'Wks',
    'mths': 'Mths',
    'qtrs': 'Qtrs',
    'res': 'Resource',
    'dur': 'Duration',
    'comp': '% Comp.',
    'completion': 'Completion',
    'startdate': 'Start Date',
    'planstartdate': 'Plan Start Date',
    'enddate': 'End Date',
    'planenddate': 'Plan End Date',
    'cost': 'Cost',
    'moreinfo': 'More Information',
    'nodata': 'No tasks found',
    'notes': 'Notes',
    'january': 'January',
    'february': 'February',
    'march': 'March',
    'april': 'April',
    'maylong': 'May',
    'june': 'June',
    'july': 'July',
    'august': 'August',
    'september': 'September',
    'october': 'October',
    'november': 'November',
    'december': 'December',
    'jan': 'Jan',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Apr',
    'may': 'May',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Aug',
    'sep': 'Sep',
    'oct': 'Oct',
    'nov': 'Nov',
    'dec': 'Dec',
    'sunday': 'Sunday',
    'monday': 'Monday',
    'tuesday': 'Tuesday',
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sun': 'Sun',
    'mon': 'Mon',
    'tue': 'Tue',
    'wed': 'Wed',
    'thu': 'Thu',
    'fri': 'Fri',
    'sat': 'Sat',
    'tooltipLoading': 'Loading...'
};
exports.en = en;
var fi = {
    'format': 'Näkymä',
    'hour': 'Tunti',
    'day': 'Päivä',
    'week': 'Viikko',
    'month': 'Kuukausi',
    'quarter': 'Kvartaali',
    'hours': 'Tunnit',
    'days': 'Päivät',
    'weeks': 'Viikot',
    'months': 'Kuukaudet',
    'quarters': 'Kvartaalit',
    'hr': 't',
    'dy': 'pv',
    'wk': 'vk',
    'mth': 'kk',
    'qtr': 'Q',
    'hrs': 't:t',
    'dys': 'pv:t',
    'wks': 'vk:t',
    'mths': 'kk:t',
    'qtrs': 'Kvartaalit',
    'res': 'Henkilö',
    'dur': 'Kesto',
    'comp': '% Valm.',
    'completion': 'Valmius',
    'startdate': 'Alkupäivä',
    'planstartdate': 'Suunniteltu alkupäivä',
    'enddate': 'Päättymispäivä',
    'planenddate': 'Suunniteltu päättymispäivä',
    'cost': 'Kustannus',
    'moreinfo': 'Lisätieto',
    'nodata': 'Tehtäviä ei löydy',
    'notes': 'Muistiinpanot',
    'january': 'Tammikuu',
    'february': 'Helmikuu',
    'march': 'Maaliskuu',
    'april': 'Huhtikuu',
    'maylong': 'Toukokuu',
    'june': 'Kesäkuu',
    'july': 'Heinäkuu',
    'august': 'Elokuu',
    'september': 'Syyskuu',
    'october': 'Lokakuu',
    'november': 'Marraskuu',
    'december': 'Joulukuu',
    'jan': 'Tammi',
    'feb': 'Helmi',
    'mar': 'Maalis',
    'apr': 'Huhti',
    'may': 'Touko',
    'jun': 'Kesä',
    'jul': 'Heinä',
    'aug': 'Elo',
    'sep': 'Syys',
    'oct': 'Loka',
    'nov': 'Marras',
    'dec': 'Joulu',
    'sunday': 'Sunnuntai',
    'monday': 'Maanantai',
    'tuesday': 'Tiista',
    'wednesday': 'Keskiviikko',
    'thursday': 'Torstai',
    'friday': 'Perjantai',
    'saturday': 'Lauantai',
    'sun': 'Su',
    'mon': 'Ma',
    'tue': 'Ti',
    'wed': 'Ke',
    'thu': 'To',
    'fri': 'Pe',
    'sat': 'La',
    'tooltipLoading': 'Ladataan...'
};
exports.fi = fi;
/**
 * Mois : http://bdl.oqlf.gouv.qc.ca/bdl/gabarit_bdl.asp?id=3619
   Jours : http://bdl.oqlf.gouv.qc.ca/bdl/gabarit_bdl.asp?id=3617
 */
var fr = {
    'january': 'Janvier',
    'february': 'Février',
    'march': 'Mars',
    'april': 'Avril',
    'maylong': 'Mai',
    'june': 'Juin',
    'july': 'Juillet',
    'august': 'Août',
    'september': 'Septembre',
    'october': 'Octobre',
    'november': 'Novembre',
    'december': 'Décembre',
    'jan': 'Janv',
    'feb': 'Févr',
    'mar': 'Mars',
    'apr': 'Avr',
    'may': 'Mai',
    'jun': 'Juin',
    'jul': 'Juil',
    'aug': 'Août',
    'sep': 'Sept',
    'oct': 'Oct',
    'nov': 'Nov',
    'dec': 'Déc',
    'sunday': 'Dimanche',
    'monday': 'Lundi',
    'tuesday': 'Mardi',
    'wednesday': 'Mercredi',
    'thursday': 'Jeudi',
    'friday': 'Vendredi',
    'saturday': 'Samedi',
    'sun': 'Dim',
    'mon': 'Lun',
    'tue': 'Mar',
    'wed': 'Mer',
    'thu': 'Jeu',
    'fri': 'Ven',
    'sat': 'Sam',
    'res': 'Ressource',
    'dur': 'Durée',
    'comp': '% Term.',
    'completion': 'Terminé',
    'startdate': 'Début',
    'planstartdate': 'Plan Début',
    'enddate': 'Fin',
    'planenddate': 'Plan Fin',
    'cost': 'Cost',
    'moreinfo': "Plus d'informations",
    'nodata': 'No tasks found',
    'notes': 'Notes',
    'format': 'Format',
    'hour': 'Heure',
    'day': 'Jour',
    'week': 'Semaine',
    'month': 'Mois',
    'quarter': 'Trimestre',
    'hours': 'Heures',
    'days': 'Jours',
    'weeks': 'Semaines',
    'months': 'Mois',
    'quarters': 'Trimestres',
    'hr': 'h',
    'dy': 'j',
    'wk': 'sem',
    'mth': 'mois',
    'qtr': 'tri',
    'hrs': 'h',
    'dys': 'j',
    'wks': 'sem',
    'mths': 'mois',
    'qtrs': 'tri'
};
exports.fr = fr;
var it = {
    'format': 'Formato',
    'hour': 'Ora',
    'day': 'Giorno',
    'week': 'Settimana',
    'month': 'Mese',
    'quarter': 'Trimestre',
    'hours': 'Ore',
    'days': 'Giorni',
    'weeks': 'Mesi',
    'months': 'Settimane',
    'quarters': 'Trimestri',
    'hr': 'Ora',
    'dy': 'G',
    'wk': 'Sett.',
    'mth': 'Mese',
    'qtr': 'Trim.',
    'hrs': 'Ora',
    'dys': 'GG',
    'wks': 'Sett.',
    'mths': 'Mesi',
    'qtrs': 'Trim.',
    'res': 'Risorsa',
    'dur': 'Durata',
    'comp': '% Compl.',
    'completion': 'Completamento',
    'startdate': 'Data inizio',
    'planstartdate': 'Piano data inizio',
    'enddate': 'Data fine',
    'planenddate': 'Piano data fine',
    'cost': 'Costo',
    'moreinfo': 'Più informazioni',
    'nodata': 'Nessun task trovato',
    'notes': 'Note',
    'january': 'Gennaio',
    'february': 'Febbraio',
    'march': 'Marzo',
    'april': 'Aprile',
    'maylong': 'Maggio',
    'june': 'Giugno',
    'july': 'Luglio',
    'august': 'Agosto',
    'september': 'Settembre',
    'october': 'Ottobre',
    'november': 'Novembre',
    'december': 'Dicembre',
    'jan': 'Gen',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Apr',
    'may': 'Mag',
    'jun': 'Giu',
    'jul': 'Lug',
    'aug': 'Ago',
    'sep': 'Set',
    'oct': 'Ott',
    'nov': 'Nov',
    'dec': 'Dic',
    'sunday': 'Domenica',
    'monday': 'Lunedì',
    'tuesday': 'Martedì',
    'wednesday': 'Mercoledì',
    'thursday': 'Giovedì',
    'friday': 'Venerdì',
    'saturday': 'Sabato',
    'sun': 'Dom',
    'mon': 'Lun',
    'tue': 'Mar',
    'wed': 'Mer',
    'thu': 'Gio',
    'fri': 'Ven',
    'sat': 'Sab',
    'tooltipLoading': 'Caricamento...'
};
exports.it = it;
var hu = {
    'format': 'Formátum',
    'hour': 'Óra',
    'day': 'Nap',
    'week': 'Hét',
    'month': 'Hónap',
    'quarter': 'Negyedév ',
    'hours': 'Órák',
    'days': 'Nap',
    'weeks': 'Hét',
    'months': 'Hónap',
    'quarters': 'Negyedév',
    'hr': 'Ó',
    'dy': 'Nap',
    'wk': 'Hét',
    'mth': 'Hó',
    'qtr': 'NÉ',
    'hrs': 'Óra',
    'dys': 'Nap',
    'wks': 'Hét',
    'mths': 'Hó',
    'qtrs': 'NÉ',
    'res': 'Erőforrás',
    'dur': 'Időtartam',
    'comp': '% Kész',
    'completion': 'Elkészült',
    'startdate': 'Kezdés',
    'planstartdate': 'Tervezett kezdés',
    'enddate': 'Befejezés',
    'planenddate': 'Tervezett befejezés',
    'cost': 'Költség',
    'moreinfo': 'További információ',
    'nodata': 'No tasks found',
    'notes': 'Jegyzetek',
    'january': 'Január',
    'february': 'Február',
    'march': 'Március',
    'april': 'Április',
    'maylong': 'Május',
    'june': 'Június',
    'july': 'Július',
    'august': 'Augusztus',
    'september': 'Szeptember',
    'october': 'Október',
    'november': 'November',
    'december': 'December',
    'jan': 'Jan',
    'feb': 'Feb',
    'mar': 'Már',
    'apr': 'Ápr',
    'may': 'Máj',
    'jun': 'Jún',
    'jul': 'Júl',
    'aug': 'Aug',
    'sep': 'Szep',
    'oct': 'Okt',
    'nov': 'Nov',
    'dec': 'Dec',
    'sunday': 'Vasárnap',
    'monday': 'Hétfő',
    'tuesday': 'Kedd',
    'wednesday': 'Szerda',
    'thursday': 'Csütörtök',
    'friday': 'Péntek',
    'saturday': 'Szombat',
    'sun': 'Vas',
    'mon': 'Hé',
    'tue': 'Ke',
    'wed': 'Sze',
    'thu': 'Csü',
    'fri': 'Pén',
    'sat': 'Szo',
    'tooltipLoading': 'Belöltés...'
};
exports.hu = hu;
var id = {
    'format': 'Format',
    'hour': 'Jam',
    'day': 'Hari',
    'week': 'Minggu',
    'month': 'Bulan',
    'quarter': 'Kuartal',
    'hours': 'Jam',
    'days': 'Hari',
    'weeks': 'Minggu',
    'months': 'Bulan',
    'quarters': 'Kuartal',
    'hr': 'Jam',
    'dy': 'Hari',
    'wk': 'Min',
    'mth': 'Bln',
    'qtr': 'Krtl',
    'hrs': 'Jam',
    'dys': 'Hari',
    'wks': 'Min',
    'mths': 'Bln',
    'qtrs': 'Krtl',
    'res': 'Sumber Daya',
    'dur': 'Durasi',
    'comp': '% Penyelesaian',
    'completion': 'Penyelesaian',
    'startdate': 'Tanggal Mulai',
    'planstartdate': 'Perencanaan Tanggal Mulai',
    'enddate': 'Tanggal Akhir',
    'planenddate': 'Perencanaan Tanggal Akhir',
    'cost': 'Biaya',
    'moreinfo': 'Informasi Lebih Lanjut',
    'nodata': 'No tasks found',
    'notes': 'Catatan',
    'january': 'Januari',
    'february': 'Februari',
    'march': 'Maret',
    'april': 'April',
    'maylong': 'Mei',
    'june': 'Juni',
    'july': 'Juli',
    'august': 'Agustus',
    'september': 'September',
    'october': 'Oktober',
    'november': 'November',
    'december': 'Desember',
    'jan': 'Jan',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Apr',
    'may': 'Mei',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Agu',
    'sep': 'Sep',
    'oct': 'Okt',
    'nov': 'Nov',
    'dec': 'Des',
    'sunday': 'Minggu',
    'monday': 'Senin',
    'tuesday': 'Selasa',
    'wednesday': 'Rabu',
    'thursday': 'Kamis',
    'friday': 'Jumat',
    'saturday': 'Sabtu',
    'sun': 'Min',
    'mon': 'Sen',
    'tue': 'Sel',
    'wed': 'Rab',
    'thu': 'Kam',
    'fri': 'Jum',
    'sat': 'Sab'
};
exports.id = id;
var ja = {
    'format': 'タイムライン表示',
    'hour': '時',
    'day': '日',
    'week': '週',
    'month': '月',
    'quarter': '四半期',
    'hours': '時間',
    'days': '日間',
    'weeks': '週間',
    'months': '月間',
    'quarters': '四半期',
    'hr': '時',
    'dy': '日',
    'wk': '週',
    'mth': '月',
    'qtr': '四',
    'hrs': '時間',
    'dys': '日間',
    'wks': '週間',
    'mths': '月間',
    'qtrs': '四半期',
    'res': 'リソース',
    'dur': '期間',
    'comp': '進捗率',
    'completion': '進捗率',
    'startdate': '開始日',
    'planstartdate': '予定開始日',
    'enddate': '期日',
    'planenddate': '予定期日',
    'cost': 'コスト',
    'moreinfo': '詳細',
    'nodata': 'No tasks found',
    'notes': 'ノート',
    'january': '1月',
    'february': '2月',
    'march': '3月',
    'april': '4月',
    'maylong': '5月',
    'june': '6月',
    'july': '7月',
    'august': '8月',
    'september': '9月',
    'october': '10月',
    'november': '11月',
    'december': '12月',
    'jan': '1月',
    'feb': '2月',
    'mar': '3月',
    'apr': '4月',
    'may': '5月',
    'jun': '6月',
    'jul': '7月',
    'aug': '8月',
    'sep': '9月',
    'oct': '10月',
    'nov': '11月',
    'dec': '12月',
    'sunday': '日曜日',
    'monday': '月曜日',
    'tuesday': '火曜日',
    'wednesday': '水曜日',
    'thursday': '木曜日',
    'friday': '金曜日',
    'saturday': '土曜日',
    'sun': '日',
    'mon': '月',
    'tue': '火',
    'wed': '水',
    'thu': '木',
    'fri': '金',
    'sat': '土',
    'tooltipLoading': 'ローディング中...'
};
exports.ja = ja;
var ko = {
    'format': '구분',
    'hour': '시',
    'day': '일',
    'week': '주',
    'month': '월',
    'quarter': '분기',
    'hours': '시',
    'days': '일',
    'weeks': '주',
    'months': '월',
    'quarters': '분기',
    'hr': '시',
    'dy': '일',
    'wk': '주',
    'mth': '월',
    'qtr': '분기',
    'hrs': '시',
    'dys': '일',
    'wks': '주',
    'mths': '월',
    'qtrs': '분기',
    'res': '이름',
    'dur': '기간',
    'comp': '% ',
    'completion': '완료',
    'startdate': '시작일자',
    'planstartdate': '계획 시작일자',
    'enddate': '종료일자',
    'planenddate': '계획 종료일자',
    'cost': '비용',
    'moreinfo': '더 많은 정보',
    'nodata': 'No tasks found',
    'notes': '비고',
    'january': '1월',
    'february': '2월',
    'march': '3월',
    'april': '4월',
    'maylong': '5월',
    'june': '6월',
    'july': '7월',
    'august': '8월',
    'september': '9월',
    'october': '10월',
    'november': '11월',
    'december': '12월',
    'jan': '1',
    'feb': '2',
    'mar': '3',
    'apr': '4',
    'may': '5',
    'jun': '6',
    'jul': '7',
    'aug': '8',
    'sep': '9',
    'oct': '10',
    'nov': '11',
    'dec': '12',
    'sunday': '일요일',
    'monday': '월요일',
    'tuesday': '화요일',
    'wednesday': '수요일',
    'thursday': '목요일',
    'friday': '금요일',
    'saturday': '토요일',
    'sun': '일',
    'mon': '월',
    'tue': '화',
    'wed': '수',
    'thu': '목',
    'fri': '금',
    'sat': '토',
    'tooltipLoading': '로딩중...'
};
exports.ko = ko;
var nl = {
    'format': 'Format',
    'hour': 'Uur',
    'day': 'Dag',
    'week': 'Week',
    'month': 'Maand',
    'quarter': 'Kwartaal',
    'hours': 'Uren',
    'days': 'Dagen',
    'weeks': 'Weken',
    'months': 'Maanden',
    'quarters': 'Kwartalen',
    'hr': 'uur',
    'dy': 'dag',
    'wk': 'wk',
    'mth': 'mnd',
    'qtr': 'kw',
    'hrs': 'uren',
    'dys': 'dagen',
    'wks': 'weken',
    'mths': 'maanden',
    'qtrs': 'kwartalen',
    'res': 'Resource',
    'dur': 'Doorlooptijd',
    'comp': '% gereed',
    'completion': 'Gereed',
    'startdate': 'Startdatum',
    'planstartdate': 'Geplande startdatum',
    'enddate': 'Einddatum',
    'planenddate': 'Geplande einddatum',
    'cost': 'Kosten',
    'moreinfo': 'Meer informatie',
    'nodata': 'No tasks found',
    'notes': 'Notities',
    'january': 'januari',
    'february': 'februari',
    'march': 'maart',
    'april': 'april',
    'maylong': 'mei',
    'june': 'juni',
    'july': 'juli',
    'august': 'augustus',
    'september': 'september',
    'october': 'oktober',
    'november': 'november',
    'december': 'december',
    'jan': 'jan',
    'feb': 'feb',
    'mar': 'mrt',
    'apr': 'apr',
    'may': 'mei',
    'jun': 'jun',
    'jul': 'jul',
    'aug': 'aug',
    'sep': 'sep',
    'oct': 'okt',
    'nov': 'nov',
    'dec': 'dec',
    'sunday': 'zondag',
    'monday': 'maandag',
    'tuesday': 'dinsdag',
    'wednesday': 'woensdag',
    'thursday': 'donderdag',
    'friday': 'vrijdag',
    'saturday': 'zaterdag',
    'sun': 'zo',
    'mon': 'ma',
    'tue': 'di',
    'wed': 'wo',
    'thu': 'do',
    'fri': 'vr',
    'sat': 'za'
};
exports.nl = nl;
var pl = {
    'format': 'Format',
    'hour': 'Godzina',
    'day': 'Dzień',
    'week': 'Tydzień',
    'month': 'Miesiąc',
    'quarter': 'Kwartał',
    'hours': 'Godziny',
    'days': 'Dni',
    'weeks': 'Tygodni',
    'months': 'Miesięcy',
    'quarters': 'Kwartały',
    'hr': 'godz.',
    'dy': 'd.',
    'wk': 'tydz.',
    'mth': 'mies.',
    'qtr': 'kw.',
    'hrs': 'godz.',
    'dys': 'd.',
    'wks': 'tyg.',
    'mths': 'mies.',
    'qtrs': 'kw.',
    'res': 'Zasób',
    'dur': 'Czas trwania',
    'comp': '% Komp.',
    'completion': 'Ukończenie',
    'startdate': 'Data Startu',
    'planstartdate': 'Planowana Data Startu',
    'enddate': 'Data Zakończenia',
    'planenddate': 'Planowana Data Zakończenia',
    'cost': 'Koszt',
    'moreinfo': 'Więcej Inormacji',
    'nodata': 'Nie znaleziono zadań',
    'notes': 'Dodatkowe Informacje',
    'january': 'Styczeń',
    'february': 'Luty',
    'march': 'Marzec',
    'april': 'Kwiecień',
    'maylong': 'Maj',
    'june': 'Czerwiec',
    'july': 'Lipiec',
    'august': 'Sierpień',
    'september': 'Wrzesień',
    'october': 'Październik',
    'november': 'Listopad',
    'december': 'Grudzień',
    'jan': 'St',
    'feb': 'Lut',
    'mar': 'Mar',
    'apr': 'Kw',
    'may': 'Maj',
    'jun': 'Cz',
    'jul': 'Lip',
    'aug': 'Sier',
    'sep': 'Wrz',
    'oct': 'Paź',
    'nov': 'Lis',
    'dec': 'Gr',
    'sunday': 'Niedziela',
    'monday': 'Poniedziałek',
    'tuesday': 'Wtorek',
    'wednesday': 'Środa',
    'thursday': 'Czwartek',
    'friday': 'Piątek',
    'saturday': 'Sobota',
    'sun': 'Nd',
    'mon': 'Pon',
    'tue': 'Wt',
    'wed': 'Śr',
    'thu': 'Czw',
    'fri': 'Pt',
    'sat': 'So',
    'tooltipLoading': 'Ładowanie...'
};
exports.pl = pl;
var pt = {
    'hours': 'Horas',
    'days': 'Dias',
    'weeks': 'Weeks',
    'months': 'Months',
    'quarters': 'Quarters',
    'format': 'Formato',
    'hour': 'Hora',
    'day': 'Dia',
    'week': 'Semana',
    'month': 'Mês',
    'quarter': 'Trimestre',
    'hr': 'hr',
    'dy': 'dia',
    'wk': 'sem.',
    'mth': 'mês',
    'qtr': 'qtr',
    'hrs': 'hrs',
    'dys': 'dias',
    'wks': 'sem.',
    'mths': 'meses',
    'qtrs': 'qtrs',
    'completion': 'Terminado',
    'comp': '% Completado',
    'moreinfo': 'Mais informações',
    'nodata': 'Sem atividades',
    'notes': 'Notas',
    'res': 'Responsável',
    'dur': 'Duração',
    'startdate': 'Data inicial',
    'planstartdate': 'Plan Data inicial',
    'enddate': 'Data final',
    'planenddate': 'Plan Data final',
    'cost': 'Custo',
    'jan': 'Jan',
    'feb': 'Fev',
    'mar': 'Mar',
    'apr': 'Abr',
    'may': 'Mai',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Ago',
    'sep': 'Set',
    'oct': 'Out',
    'nov': 'Nov',
    'dec': 'Dez',
    'january': 'Janeiro',
    'february': 'Fevereiro',
    'march': 'Março',
    'april': 'Abril',
    'maylong': 'Maio',
    'june': 'Junho',
    'july': 'Julho',
    'august': 'Agosto',
    'september': 'Setembro',
    'october': 'Outubro',
    'november': 'Novembro',
    'december': 'Dezembro',
    'sun': 'Dom',
    'mon': 'Seg',
    'tue': 'Ter',
    'wed': 'Qua',
    'thu': 'Qui',
    'fri': 'Sex',
    'sat': 'Sab'
};
exports.pt = pt;
var ru = {
    'january': 'Январь',
    'february': 'Февраль',
    'march': 'Март',
    'april': 'Апрель',
    'maylong': 'Май',
    'june': 'Июнь',
    'july': 'Июль',
    'august': 'Август', 'september': 'Сентябрь',
    'october': 'Октябрь',
    'november': 'Ноябрь',
    'december': 'Декабрь',
    'jan': 'Янв',
    'feb': 'Фев',
    'mar': 'Мар',
    'apr': 'Апр',
    'may': 'Май',
    'jun': 'Июн',
    'jul': 'Июл',
    'aug': 'Авг',
    'sep': 'Сен',
    'oct': 'Окт',
    'nov': 'Ноя',
    'dec': 'Дек',
    'sunday': 'Воскресенье',
    'monday': 'Понедельник',
    'tuesday': 'Вторник',
    'wednesday': 'Среда',
    'thursday': 'Четверг',
    'friday': 'Пятница',
    'saturday': 'Суббота',
    'sun': '	Вс',
    'mon': '	Пн',
    'tue': '	Вт',
    'wed': '	Ср',
    'thu': '	Чт',
    'fri': '	Пт',
    'sat': '	Сб',
    'res': 'Ресурс',
    'dur': 'Длительность',
    'comp': '% выполнения',
    'completion': 'Выполнено',
    'startdate': 'Нач. дата',
    'planstartdate': 'Plan Нач. дата',
    'enddate': 'Кон. дата',
    'planenddate': 'Plan Кон. дата',
    'cost': 'Cost',
    'moreinfo': 'Детали',
    'nodata': 'No tasks found',
    'notes': 'Заметки',
    'format': 'Формат',
    'hour': 'Час',
    'day': 'День',
    'week': 'Неделя',
    'month': 'Месяц',
    'quarter': 'Кварт',
    'hours': 'Часов',
    'days': 'Дней',
    'weeks': 'Недель',
    'months': 'Месяцев',
    'quarters': 'Кварталов',
    'hr': 'ч.',
    'dy': 'дн.',
    'wk': 'нед.',
    'mth': 'мес.',
    'qtr': 'кв.',
    'hrs': 'ч.',
    'dys': 'дн.',
    'wks': 'нед.',
    'mths': 'мес.',
    'qtrs': 'кв.',
    'tooltipLoading': 'Загрузка...'
};
exports.ru = ru;
var sv = {
    'format': 'Filter',
    'hour': 'Timme',
    'day': 'Dag',
    'week': 'Vecka',
    'month': 'Månad',
    'quarter': 'Kvartal',
    'hours': 'Timmar',
    'days': 'Dagar',
    'weeks': 'Veckor',
    'months': 'Månader',
    'quarters': 'Kvartal',
    'hr': 'Timme',
    'dy': 'Dag',
    'wk': 'Vecka',
    'mth': 'Månad',
    'qtr': 'Q',
    'hrs': 'Timmar',
    'dys': 'Dagar',
    'wks': 'Veckor',
    'mths': 'Månader',
    'qtrs': 'Q',
    'res': 'Resurs',
    'dur': 'Tidsåtgång',
    'comp': '% klart',
    'completion': 'Klart',
    'startdate': 'Startdatum',
    'planstartdate': 'Planerad startdatum',
    'enddate': 'Slutdatum',
    'planenddate': 'Planerad slutdatum',
    'cost': 'Kostnad',
    'moreinfo': 'Mer Information',
    'nodata': 'No tasks found',
    'notes': 'Notes',
    'january': 'januari',
    'february': 'februari',
    'march': 'mars',
    'april': 'april',
    'maylong': 'maj',
    'june': 'juni',
    'july': 'juli',
    'august': 'augusti',
    'september': 'september',
    'october': 'oktober',
    'november': 'november',
    'december': 'december',
    'jan': 'jan',
    'feb': 'feb',
    'mar': 'mar',
    'apr': 'apr',
    'may': 'maj',
    'jun': 'jun',
    'jul': 'jul',
    'aug': 'aug',
    'sep': 'sep',
    'oct': 'okt',
    'nov': 'nov',
    'dec': 'dec',
    'sunday': 'söndag',
    'monday': 'måndag',
    'tuesday': 'tisdag',
    'wednesday': 'onsdag',
    'thursday': 'torsdag',
    'friday': 'fredag',
    'saturday': 'lördag',
    'sun': 'sön',
    'mon': 'mån',
    'tue': 'tis',
    'wed': 'ons',
    'thu': 'tor',
    'fri': 'fre',
    'sat': 'lör'
};
exports.sv = sv;
var tr = {
    'format': 'Biçim',
    'hour': 'Saat',
    'day': 'Gün',
    'week': 'Hafta',
    'month': 'Ay',
    'quarter': 'Çeyrek Yıl',
    'hours': 'Saat',
    'days': 'Gün',
    'weeks': 'Hafta',
    'months': 'Ay',
    'quarters': 'Çeyrek Yıl',
    'hr': 'Saat',
    'dy': 'Gün',
    'wk': 'Hft',
    'mth': 'Ay',
    'qtr': 'Çyrk',
    'hrs': 'Saat',
    'dys': 'Gün',
    'wks': 'Hft',
    'mths': 'Ay',
    'qtrs': 'Çyrk',
    'res': 'Kaynak',
    'dur': 'Süre',
    'comp': '% Tamamlanma.',
    'completion': 'Tamamlanma',
    'startdate': 'Başlangıç Tarihi',
    'planstartdate': 'Plan Başlama Tarihi',
    'enddate': 'Bitiş Tarihi',
    'planenddate': 'Plan Bitiş Tarihi',
    'cost': 'Tutar',
    'moreinfo': 'Daha Fazla Bilgi',
    'nodata': 'No tasks found',
    'notes': 'Notlar',
    'january': 'Ocak',
    'february': 'Şubat',
    'march': 'Mart',
    'april': 'Nisan',
    'maylong': 'Mayıs',
    'june': 'Haziran',
    'july': 'Temmuz',
    'august': 'Ağustos',
    'september': 'Eylül',
    'october': 'Ekim',
    'november': 'Kasım',
    'december': 'Aralık',
    'jan': 'Oca',
    'feb': 'Şub',
    'mar': 'Mar',
    'apr': 'Nis',
    'may': 'May',
    'jun': 'Haz',
    'jul': 'Tem',
    'aug': 'Ağu',
    'sep': 'Eyl',
    'oct': 'Eki',
    'nov': 'Kas',
    'dec': 'Ara',
    'sunday': 'Pazar',
    'monday': 'Pazartesi',
    'tuesday': 'Salı',
    'wednesday': 'Çarşamba',
    'thursday': 'Perşembe',
    'friday': 'Cuma',
    'saturday': 'Cumartesi',
    'sun': 'Paz',
    'mon': 'Pzt',
    'tue': 'Sal',
    'wed': 'Çrş',
    'thu': 'Prş',
    'fri': 'Cum',
    'sat': 'Cmt'
};
exports.tr = tr;
var fa = {
    'format': 'فرمت',
    'hour': 'ساعت',
    'day': 'روز',
    'week': 'هفته',
    'month': 'ماه',
    'quarter': 'فصل',
    'hours': 'ساعت',
    'days': 'روز',
    'weeks': 'هفته',
    'months': 'ماه',
    'quarters': 'فصل',
    'hr': 'ساعت',
    'dy': 'روز',
    'wk': 'هفته',
    'mth': 'ماه',
    'qtr': 'فصل',
    'hrs': 'ساعت',
    'dys': 'روز',
    'wks': 'هفته',
    'mths': 'ماه',
    'qtrs': 'فصل',
    'res': 'منبع',
    'dur': 'طول',
    'comp': '% مقایسه.',
    'completion': 'تکمیل',
    'startdate': 'تاریخ شروع',
    'planstartdate': 'تاریخ شروع برنامه',
    'enddate': 'اتمام تاریخ',
    'planenddate': 'اتمام تاریخ برنامه',
    'cost': 'هزینه',
    'moreinfo': 'اطلاعات بیشتر',
    'nodata': 'وظیفه ای پیدا نشد',
    'notes': 'یادداشت ها',
    'january': 'فروردین',
    'february': 'اردیبهشت',
    'march': 'خرداد',
    'april': 'تیر',
    'maylong': 'مرداد',
    'june': 'شهریور',
    'july': 'مهر',
    'august': 'آبان',
    'september': 'آذز',
    'october': 'دی',
    'november': 'بهمن',
    'december': 'اسفند',
    'jan': 'فروردین',
    'feb': 'اردیبهشت',
    'mar': 'خرداد',
    'apr': 'تیر',
    'may': 'مرداد',
    'jun': 'شهریور',
    'jul': 'مهر',
    'aug': 'آبان',
    'sep': 'آذر',
    'oct': 'دی',
    'nov': 'بهمن',
    'dec': 'اسفند',
    'sunday': 'یکشنبه',
    'monday': 'دوشنبه',
    'tuesday': 'سه شنبه',
    'wednesday': 'چهارشنبه',
    'thursday': 'پنجشنبه',
    'friday': 'جمعه',
    'saturday': 'شنبه',
    'sun': 'یکشنبه',
    'mon': 'دوشنبه',
    'tue': 'سه شنبه',
    'wed': 'چهارشنبه',
    'thu': 'پنجشنبه',
    'fri': 'جمعه',
    'sat': 'شنبه',
    'tooltipLoading': 'در حال بارگذاری...'
};
exports.fa = fa;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeGetSet = void 0;
var date_utils_1 = require("./utils/date_utils");
var draw_columns_1 = require("./draw_columns");
exports.includeGetSet = function () {
    /**
     * SETTERS
     */
    this.setOptions = function (options) {
        var keys = Object.keys(options);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var val = options[key];
            if (key === 'vResources' || key === 'vColumnOrder') {
                // ev = `this.set${key.substr(1)}(val)`;
                this['set' + key.substr(1)](val);
            }
            else if (val instanceof Array) {
                // ev = `this.set${key.substr(1)}(...val)`;
                this['set' + key.substr(1)].apply(this, val);
            }
            else {
                // ev = `this.set${key.substr(1)}(val)`;
                this['set' + key.substr(1)](val);
            }
        }
    };
    this.setUseFade = function (pVal) { this.vUseFade = pVal; };
    this.setUseMove = function (pVal) { this.vUseMove = pVal; };
    this.setUseRowHlt = function (pVal) { this.vUseRowHlt = pVal; };
    this.setUseToolTip = function (pVal) { this.vUseToolTip = pVal; };
    this.setUseSort = function (pVal) { this.vUseSort = pVal; };
    this.setUseSingleCell = function (pVal) { this.vUseSingleCell = pVal * 1; };
    this.setFormatArr = function () {
        var vValidFormats = 'hour day week month quarter';
        this.vFormatArr = new Array();
        for (var i = 0, j = 0; i < arguments.length; i++) {
            if (vValidFormats.indexOf(arguments[i].toLowerCase()) != -1 && arguments[i].length > 1) {
                this.vFormatArr[j++] = arguments[i].toLowerCase();
                var vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
                vValidFormats = vValidFormats.replace(vRegExp, '');
            }
        }
    };
    this.setShowRes = function (pVal) { this.vShowRes = pVal; };
    this.setShowDur = function (pVal) { this.vShowDur = pVal; };
    this.setShowComp = function (pVal) { this.vShowComp = pVal; };
    this.setShowStartDate = function (pVal) { this.vShowStartDate = pVal; };
    this.setShowEndDate = function (pVal) { this.vShowEndDate = pVal; };
    this.setShowPlanStartDate = function (pVal) { this.vShowPlanStartDate = pVal; };
    this.setShowPlanEndDate = function (pVal) { this.vShowPlanEndDate = pVal; };
    this.setShowCost = function (pVal) { this.vShowCost = pVal; };
    this.setShowAddEntries = function (pVal) { this.vShowAddEntries = pVal; };
    this.setShowTaskInfoRes = function (pVal) { this.vShowTaskInfoRes = pVal; };
    this.setShowTaskInfoDur = function (pVal) { this.vShowTaskInfoDur = pVal; };
    this.setShowTaskInfoComp = function (pVal) { this.vShowTaskInfoComp = pVal; };
    this.setShowTaskInfoStartDate = function (pVal) { this.vShowTaskInfoStartDate = pVal; };
    this.setShowTaskInfoEndDate = function (pVal) { this.vShowTaskInfoEndDate = pVal; };
    this.setShowTaskInfoNotes = function (pVal) { this.vShowTaskInfoNotes = pVal; };
    this.setShowTaskInfoLink = function (pVal) { this.vShowTaskInfoLink = pVal; };
    this.setShowEndWeekDate = function (pVal) { this.vShowEndWeekDate = pVal; };
    this.setShowWeekends = function (pVal) { this.vShowWeekends = pVal; };
    this.setShowSelector = function () {
        var vValidSelectors = 'top bottom';
        this.vShowSelector = new Array();
        for (var i = 0, j = 0; i < arguments.length; i++) {
            if (vValidSelectors.indexOf(arguments[i].toLowerCase()) != -1 && arguments[i].length > 1) {
                this.vShowSelector[j++] = arguments[i].toLowerCase();
                var vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
                vValidSelectors = vValidSelectors.replace(vRegExp, '');
            }
        }
    };
    this.setShowDeps = function (pVal) { this.vShowDeps = pVal; };
    this.setDateInputFormat = function (pVal) { this.vDateInputFormat = pVal; };
    this.setDateTaskTableDisplayFormat = function (pVal) { this.vDateTaskTableDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setDateTaskDisplayFormat = function (pVal) { this.vDateTaskDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setHourMajorDateDisplayFormat = function (pVal) { this.vHourMajorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setHourMinorDateDisplayFormat = function (pVal) { this.vHourMinorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setDayMajorDateDisplayFormat = function (pVal) { this.vDayMajorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setDayMinorDateDisplayFormat = function (pVal) { this.vDayMinorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setWeekMajorDateDisplayFormat = function (pVal) { this.vWeekMajorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setWeekMinorDateDisplayFormat = function (pVal) { this.vWeekMinorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setMonthMajorDateDisplayFormat = function (pVal) { this.vMonthMajorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setMonthMinorDateDisplayFormat = function (pVal) { this.vMonthMinorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setQuarterMajorDateDisplayFormat = function (pVal) { this.vQuarterMajorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setQuarterMinorDateDisplayFormat = function (pVal) { this.vQuarterMinorDateDisplayFormat = date_utils_1.parseDateFormatStr(pVal); };
    this.setCaptionType = function (pType) { this.vCaptionType = pType; };
    this.setFormat = function (pFormat) {
        this.vFormat = pFormat;
        this.Draw();
    };
    this.setWorkingDays = function (workingDays) { this.vWorkingDays = workingDays; };
    this.setMinGpLen = function (pMinGpLen) { this.vMinGpLen = pMinGpLen; };
    this.setScrollTo = function (pDate) { this.vScrollTo = pDate; };
    this.setHourColWidth = function (pWidth) { this.vHourColWidth = pWidth; };
    this.setDayColWidth = function (pWidth) { this.vDayColWidth = pWidth; };
    this.setWeekColWidth = function (pWidth) { this.vWeekColWidth = pWidth; };
    this.setMonthColWidth = function (pWidth) { this.vMonthColWidth = pWidth; };
    this.setQuarterColWidth = function (pWidth) { this.vQuarterColWidth = pWidth; };
    this.setRowHeight = function (pHeight) { this.vRowHeight = pHeight; };
    this.setLang = function (pLang) { if (this.vLangs[pLang])
        this.vLang = pLang; };
    this.setChartBody = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        this.vChartBody = pDiv; };
    this.setChartHead = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        this.vChartHead = pDiv; };
    this.setListBody = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        this.vListBody = pDiv; };
    this.setChartTable = function (pTable) { if (typeof HTMLTableElement !== 'function' || pTable instanceof HTMLTableElement)
        this.vChartTable = pTable; };
    this.setLines = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        this.vLines = pDiv; };
    this.setLineOptions = function (lineOptions) { this.vLineOptions = lineOptions; };
    this.setTimer = function (pVal) { this.vTimer = pVal * 1; };
    this.setTooltipDelay = function (pVal) { this.vTooltipDelay = pVal * 1; };
    this.setTooltipTemplate = function (pVal) { this.vTooltipTemplate = pVal; };
    this.setMinDate = function (pVal) { this.vMinDate = pVal; };
    this.setMaxDate = function (pVal) { this.vMaxDate = pVal; };
    this.addLang = function (pLang, pVals) {
        if (!this.vLangs[pLang]) {
            this.vLangs[pLang] = new Object();
            for (var vKey in this.vLangs['en'])
                this.vLangs[pLang][vKey] = (pVals[vKey]) ? document.createTextNode(pVals[vKey]).data : this.vLangs['en'][vKey];
        }
    };
    this.setTotalHeight = function (pVal) { this.vTotalHeight = pVal; };
    // EVENTS
    this.setEvents = function (pEvents) { this.vEvents = pEvents; };
    this.setEventsChange = function (pEventsChange) { this.vEventsChange = pEventsChange; };
    this.setEventClickRow = function (fn) { this.vEventClickRow = fn; };
    this.setEventClickCollapse = function (fn) { this.vEventClickCollapse = fn; };
    this.setResources = function (resources) { this.vResources = resources; };
    this.setAdditionalHeaders = function (headers) { this.vAdditionalHeaders = headers; };
    this.setColumnOrder = function (order) { this.vColumnOrder = order; };
    this.setEditable = function (editable) { this.vEditable = editable; };
    this.setDebug = function (debug) { this.vDebug = debug; };
    /**
     * GETTERS
     */
    this.getDivId = function () { return this.vDivId; };
    this.getUseFade = function () { return this.vUseFade; };
    this.getUseMove = function () { return this.vUseMove; };
    this.getUseRowHlt = function () { return this.vUseRowHlt; };
    this.getUseToolTip = function () { return this.vUseToolTip; };
    this.getUseSort = function () { return this.vUseSort; };
    this.getUseSingleCell = function () { return this.vUseSingleCell; };
    this.getFormatArr = function () { return this.vFormatArr; };
    this.getShowRes = function () { return this.vShowRes; };
    this.getShowDur = function () { return this.vShowDur; };
    this.getShowComp = function () { return this.vShowComp; };
    this.getShowStartDate = function () { return this.vShowStartDate; };
    this.getShowEndDate = function () { return this.vShowEndDate; };
    this.getShowPlanStartDate = function () { return this.vShowPlanStartDate; };
    this.getShowPlanEndDate = function () { return this.vShowPlanEndDate; };
    this.getShowCost = function () { return this.vShowCost; };
    this.getShowAddEntries = function () { return this.vShowAddEntries; };
    this.getShowTaskInfoRes = function () { return this.vShowTaskInfoRes; };
    this.getShowTaskInfoDur = function () { return this.vShowTaskInfoDur; };
    this.getShowTaskInfoComp = function () { return this.vShowTaskInfoComp; };
    this.getShowTaskInfoStartDate = function () { return this.vShowTaskInfoStartDate; };
    this.getShowTaskInfoEndDate = function () { return this.vShowTaskInfoEndDate; };
    this.getShowTaskInfoNotes = function () { return this.vShowTaskInfoNotes; };
    this.getShowTaskInfoLink = function () { return this.vShowTaskInfoLink; };
    this.getShowEndWeekDate = function () { return this.vShowEndWeekDate; };
    this.getShowWeekends = function () { return this.vShowWeekends; };
    this.getShowSelector = function () { return this.vShowSelector; };
    this.getShowDeps = function () { return this.vShowDeps; };
    this.getDateInputFormat = function () { return this.vDateInputFormat; };
    this.getDateTaskTableDisplayFormat = function () { return this.vDateTaskTableDisplayFormat; };
    this.getDateTaskDisplayFormat = function () { return this.vDateTaskDisplayFormat; };
    this.getHourMajorDateDisplayFormat = function () { return this.vHourMajorDateDisplayFormat; };
    this.getHourMinorDateDisplayFormat = function () { return this.vHourMinorDateDisplayFormat; };
    this.getDayMajorDateDisplayFormat = function () { return this.vDayMajorDateDisplayFormat; };
    this.getDayMinorDateDisplayFormat = function () { return this.vDayMinorDateDisplayFormat; };
    this.getWeekMajorDateDisplayFormat = function () { return this.vWeekMajorDateDisplayFormat; };
    this.getWeekMinorDateDisplayFormat = function () { return this.vWeekMinorDateDisplayFormat; };
    this.getMonthMajorDateDisplayFormat = function () { return this.vMonthMajorDateDisplayFormat; };
    this.getMonthMinorDateDisplayFormat = function () { return this.vMonthMinorDateDisplayFormat; };
    this.getQuarterMajorDateDisplayFormat = function () { return this.vQuarterMajorDateDisplayFormat; };
    this.getQuarterMinorDateDisplayFormat = function () { return this.vQuarterMinorDateDisplayFormat; };
    this.getCaptionType = function () { return this.vCaptionType; };
    this.getMinGpLen = function () { return this.vMinGpLen; };
    this.getScrollTo = function () { return this.vScrollTo; };
    this.getHourColWidth = function () { return this.vHourColWidth; };
    this.getDayColWidth = function () { return this.vDayColWidth; };
    this.getWeekColWidth = function () { return this.vWeekColWidth; };
    this.getMonthColWidth = function () { return this.vMonthColWidth; };
    this.getQuarterColWidth = function () { return this.vQuarterColWidth; };
    this.getRowHeight = function () { return this.vRowHeight; };
    this.getChartBody = function () { return this.vChartBody; };
    this.getChartHead = function () { return this.vChartHead; };
    this.getListBody = function () { return this.vListBody; };
    this.getChartTable = function () { return this.vChartTable; };
    this.getLines = function () { return this.vLines; };
    this.getTimer = function () { return this.vTimer; };
    this.getMinDate = function () { return this.vMinDate; };
    this.getMaxDate = function () { return this.vMaxDate; };
    this.getTooltipDelay = function () { return this.vTooltipDelay; };
    this.getList = function () { return this.vTaskList; };
    //EVENTS
    this.getEventsClickCell = function () { return this.vEvents; };
    this.getEventsChange = function () { return this.vEventsChange; };
    this.getEventClickRow = function () { return this.vEventClickRow; };
    this.getEventClickCollapse = function () { return this.vEventClickCollapse; };
    this.getResources = function () { return this.vResources; };
    this.getAdditionalHeaders = function () { return this.vAdditionalHeaders; };
    this.getColumnOrder = function () { return this.vColumnOrder || draw_columns_1.COLUMN_ORDER; };
};

},{"./draw_columns":3,"./utils/date_utils":11}],10:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRows = exports.ClearTasks = exports.RemoveTaskItem = exports.AddTaskItemObject = exports.AddTaskItem = exports.createTaskInfo = exports.TaskItem = exports.TaskItemObject = exports.sortTasks = exports.taskLink = void 0;
var general_utils_1 = require("./utils/general_utils");
var draw_utils_1 = require("./utils/draw_utils");
var date_utils_1 = require("./utils/date_utils");
// function to open window to display task link
exports.taskLink = function (pRef, pWidth, pHeight) {
    var vWidth, vHeight;
    if (pWidth)
        vWidth = pWidth;
    else
        vWidth = 400;
    if (pHeight)
        vHeight = pHeight;
    else
        vHeight = 400;
    window.open(pRef, 'newwin', 'height=' + vHeight + ',width=' + vWidth); // let OpenWindow = 
};
exports.sortTasks = function (pList, pID, pIdx) {
    if (pList.length < 2) {
        return pIdx;
    }
    var sortIdx = pIdx;
    var sortArr = new Array();
    for (var i = 0; i < pList.length; i++) {
        if (pList[i].getParent() == pID)
            sortArr.push(pList[i]);
    }
    if (sortArr.length > 0) {
        sortArr.sort(function (a, b) {
            var i = a.getStart().getTime() - b.getStart().getTime();
            if (i == 0)
                i = a.getEnd().getTime() - b.getEnd().getTime();
            if (i == 0)
                return a.getID() - b.getID();
            else
                return i;
        });
    }
    for (var j = 0; j < sortArr.length; j++) {
        for (var i = 0; i < pList.length; i++) {
            if (pList[i].getID() == sortArr[j].getID()) {
                pList[i].setSortIdx(sortIdx++);
                sortIdx = exports.sortTasks(pList, pList[i].getID(), sortIdx);
            }
        }
    }
    return sortIdx;
};
exports.TaskItemObject = function (object) {
    var pDataObject = __assign({}, object);
    general_utils_1.internalProperties.forEach(function (property) {
        delete pDataObject[property];
    });
    return new exports.TaskItem(object.pID, object.pName, object.pStart, object.pEnd, object.pClass, object.pLink, object.pMile, object.pRes, object.pComp, object.pGroup, object.pParent, object.pOpen, object.pDepend, object.pCaption, object.pNotes, object.pGantt, object.pCost, object.pPlanStart, object.pPlanEnd, object.pDuration, object.pBarText, object, object.pPlanClass);
};
exports.TaskItem = function (pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt, pCost, pPlanStart, pPlanEnd, pDuration, pBarText, pDataObject, pPlanClass) {
    if (pCost === void 0) { pCost = null; }
    if (pPlanStart === void 0) { pPlanStart = null; }
    if (pPlanEnd === void 0) { pPlanEnd = null; }
    if (pDuration === void 0) { pDuration = null; }
    if (pBarText === void 0) { pBarText = null; }
    if (pDataObject === void 0) { pDataObject = null; }
    if (pPlanClass === void 0) { pPlanClass = null; }
    var vGantt = pGantt ? pGantt : this;
    var _id = document.createTextNode(pID).data;
    var vID = general_utils_1.hashKey(document.createTextNode(pID).data);
    var vName = document.createTextNode(pName).data;
    var vStart = null;
    var vEnd = null;
    var vPlanStart = null;
    var vPlanEnd = null;
    var vGroupMinStart = null;
    var vGroupMinEnd = null;
    var vGroupMinPlanStart = null;
    var vGroupMinPlanEnd = null;
    var vClass = document.createTextNode(pClass).data;
    var vPlanClass = document.createTextNode(pPlanClass).data;
    var vLink = document.createTextNode(pLink).data;
    var vMile = parseInt(document.createTextNode(pMile).data);
    var vRes = document.createTextNode(pRes).data;
    var vComp = parseFloat(document.createTextNode(pComp).data);
    var vCost = parseInt(document.createTextNode(pCost).data);
    var vGroup = parseInt(document.createTextNode(pGroup).data);
    var vDataObject = pDataObject;
    var vCompVal;
    var parent = document.createTextNode(pParent).data;
    if (parent && parent !== '0') {
        parent = general_utils_1.hashKey(parent).toString();
    }
    var vParent = parent;
    var vOpen = (vGroup == 2) ? 1 : parseInt(document.createTextNode(pOpen).data);
    var vDepend = new Array();
    var vDependType = new Array();
    var vCaption = document.createTextNode(pCaption).data;
    var vDuration = pDuration || '';
    var vBarText = pBarText || '';
    var vLevel = 0;
    var vNumKid = 0;
    var vWeight = 0;
    var vVisible = 1;
    var vSortIdx = 0;
    var vToDelete = false;
    var x1, y1, x2, y2;
    var vNotes;
    var vParItem = null;
    var vCellDiv = null;
    var vBarDiv = null;
    var vTaskDiv = null;
    var vPlanTaskDiv = null;
    var vListChildRow = null;
    var vChildRow = null;
    var vGroupSpan = null;
    vNotes = document.createElement('span');
    vNotes.className = 'gTaskNotes';
    if (pNotes != null) {
        vNotes.innerHTML = pNotes;
        general_utils_1.stripUnwanted(vNotes);
    }
    if (pStart != null && pStart != '') {
        vStart = (pStart instanceof Date) ? pStart : date_utils_1.parseDateStr(document.createTextNode(pStart).data, vGantt.getDateInputFormat());
        vGroupMinStart = vStart;
    }
    if (pEnd != null && pEnd != '') {
        vEnd = (pEnd instanceof Date) ? pEnd : date_utils_1.parseDateStr(document.createTextNode(pEnd).data, vGantt.getDateInputFormat());
        vGroupMinEnd = vEnd;
    }
    if (pPlanStart != null && pPlanStart != '') {
        vPlanStart = (pPlanStart instanceof Date) ? pPlanStart : date_utils_1.parseDateStr(document.createTextNode(pPlanStart).data, vGantt.getDateInputFormat());
        vGroupMinPlanStart = vPlanStart;
    }
    if (pPlanEnd != null && pPlanEnd != '') {
        vPlanEnd = (pPlanEnd instanceof Date) ? pPlanEnd : date_utils_1.parseDateStr(document.createTextNode(pPlanEnd).data, vGantt.getDateInputFormat());
        vGroupMinPlanEnd = vPlanEnd;
    }
    if (pDepend != null) {
        var vDependStr = pDepend + '';
        var vDepList = vDependStr.split(',');
        var n = vDepList.length;
        for (var k = 0; k < n; k++) {
            if (vDepList[k].toUpperCase().endsWith('SS')) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                vDependType[k] = 'SS';
            }
            else if (vDepList[k].toUpperCase().endsWith('FF')) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                vDependType[k] = 'FF';
            }
            else if (vDepList[k].toUpperCase().endsWith('SF')) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                vDependType[k] = 'SF';
            }
            else if (vDepList[k].toUpperCase().endsWith('FS')) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                vDependType[k] = 'FS';
            }
            else {
                vDepend[k] = vDepList[k];
                vDependType[k] = 'FS';
            }
            if (vDepend[k]) {
                vDepend[k] = general_utils_1.hashKey(vDepend[k]).toString();
            }
        }
    }
    this.getID = function () { return vID; };
    this.getOriginalID = function () { return _id; };
    this.getGantt = function () { return vGantt; };
    this.getName = function () { return vName; };
    this.getStart = function () {
        if (vStart)
            return vStart;
        else if (vPlanStart)
            return vPlanStart;
        else
            return new Date();
    };
    this.getStartVar = function () {
        return vStart;
    };
    this.getEnd = function () {
        if (vEnd)
            return vEnd;
        else if (vPlanEnd)
            return vPlanEnd;
        else if (vStart && vDuration) {
            var date = new Date(vStart);
            var vUnits = vDuration.split(' ');
            var value = parseInt(vUnits[0]);
            switch (vUnits[1]) {
                case 'hour':
                    date.setMinutes(date.getMinutes() + (value * 60));
                    break;
                case 'day':
                    date.setMinutes(date.getMinutes() + (value * 60 * 24));
                    break;
                case 'week':
                    date.setMinutes(date.getMinutes() + (value * 60 * 24 * 7));
                    break;
                case 'month':
                    date.setMonth(date.getMonth() + (value));
                    break;
                case 'quarter':
                    date.setMonth(date.getMonth() + (value * 3));
                    break;
            }
            return date;
        }
        else
            return new Date();
    };
    this.getEndVar = function () {
        return vEnd;
    };
    this.getPlanStart = function () { return vPlanStart ? vPlanStart : vStart; };
    this.getPlanClass = function () { return vPlanClass && vPlanClass !== "null" ? vPlanClass : vClass; };
    this.getPlanEnd = function () { return vPlanEnd ? vPlanEnd : vEnd; };
    this.getCost = function () { return vCost; };
    this.getGroupMinStart = function () { return vGroupMinStart; };
    this.getGroupMinEnd = function () { return vGroupMinEnd; };
    this.getGroupMinPlanStart = function () { return vGroupMinPlanStart; };
    this.getGroupMinPlanEnd = function () { return vGroupMinPlanEnd; };
    this.getClass = function () { return vClass; };
    this.getLink = function () { return vLink; };
    this.getMile = function () { return vMile; };
    this.getDepend = function () {
        if (vDepend)
            return vDepend;
        else
            return null;
    };
    this.getDataObject = function () { return vDataObject; };
    this.getDepType = function () { if (vDependType)
        return vDependType;
    else
        return null; };
    this.getCaption = function () { if (vCaption)
        return vCaption;
    else
        return ''; };
    this.getResource = function () { if (vRes)
        return vRes;
    else
        return '\u00A0'; };
    this.getCompVal = function () { if (vComp)
        return vComp;
    else if (vCompVal)
        return vCompVal;
    else
        return 0; };
    this.getCompStr = function () { if (vComp)
        return vComp + '%';
    else if (vCompVal)
        return vCompVal + '%';
    else
        return ''; };
    this.getCompRestStr = function () { if (vComp)
        return (100 - vComp) + '%';
    else if (vCompVal)
        return (100 - vCompVal) + '%';
    else
        return ''; };
    this.getNotes = function () { return vNotes; };
    this.getSortIdx = function () { return vSortIdx; };
    this.getToDelete = function () { return vToDelete; };
    this.getDuration = function (pFormat, pLang) {
        if (vMile) {
            vDuration = '-';
        }
        else if (!vEnd && !vStart && vPlanStart && vPlanEnd) {
            return calculateVDuration(pFormat, pLang, this.getPlanStart(), this.getPlanEnd());
        }
        else if (!vEnd && vDuration) {
            return vDuration;
        }
        else {
            vDuration = calculateVDuration(pFormat, pLang, this.getStart(), this.getEnd());
        }
        return vDuration;
    };
    function calculateVDuration(pFormat, pLang, start, end) {
        var vDuration;
        var vUnits = null;
        switch (pFormat) {
            case 'week':
                vUnits = 'day';
                break;
            case 'month':
                vUnits = 'week';
                break;
            case 'quarter':
                vUnits = 'month';
                break;
            default:
                vUnits = pFormat;
                break;
        }
        // let vTaskEnd = new Date(this.getEnd().getTime());
        // if ((vTaskEnd.getTime() - (vTaskEnd.getTimezoneOffset() * 60000)) % (86400000) == 0) {
        //   vTaskEnd = new Date(vTaskEnd.getFullYear(), vTaskEnd.getMonth(), vTaskEnd.getDate() + 1, vTaskEnd.getHours(), vTaskEnd.getMinutes(), vTaskEnd.getSeconds());
        // }
        // let tmpPer = (getOffset(this.getStart(), vTaskEnd, 999, vUnits)) / 1000;
        var hours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
        var tmpPer;
        switch (vUnits) {
            case 'hour':
                tmpPer = Math.round(hours);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['hrs'] : pLang['hr']);
                break;
            case 'day':
                tmpPer = Math.round(hours / 24);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['dys'] : pLang['dy']);
                break;
            case 'week':
                tmpPer = Math.round(hours / 24 / 7);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['wks'] : pLang['wk']);
                break;
            case 'month':
                tmpPer = Math.round(hours / 24 / 7 / 4.35);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['mths'] : pLang['mth']);
                break;
            case 'quarter':
                tmpPer = Math.round(hours / 24 / 7 / 13);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['qtrs'] : pLang['qtr']);
                break;
        }
        return vDuration;
    }
    this.getBarText = function () { return vBarText; };
    this.getParent = function () { return vParent; };
    this.getGroup = function () { return vGroup; };
    this.getOpen = function () { return vOpen; };
    this.getLevel = function () { return vLevel; };
    this.getNumKids = function () { return vNumKid; };
    this.getWeight = function () { return vWeight; };
    this.getStartX = function () { return x1; };
    this.getStartY = function () { return y1; };
    this.getEndX = function () { return x2; };
    this.getEndY = function () { return y2; };
    this.getVisible = function () { return vVisible; };
    this.getParItem = function () { return vParItem; };
    this.getCellDiv = function () { return vCellDiv; };
    this.getBarDiv = function () { return vBarDiv; };
    this.getTaskDiv = function () { return vTaskDiv; };
    this.getPlanTaskDiv = function () { return vPlanTaskDiv; };
    this.getChildRow = function () { return vChildRow; };
    this.getListChildRow = function () { return vListChildRow; };
    this.getGroupSpan = function () { return vGroupSpan; };
    this.setName = function (pName) { vName = pName; };
    this.setNotes = function (pNotes) { vNotes = pNotes; };
    this.setClass = function (pClass) { vClass = pClass; };
    this.setPlanClass = function (pPlanClass) { vPlanClass = pPlanClass; };
    this.setCost = function (pCost) { vCost = pCost; };
    this.setResource = function (pRes) { vRes = pRes; };
    this.setDuration = function (pDuration) { vDuration = pDuration; };
    this.setDataObject = function (pDataObject) { vDataObject = pDataObject; };
    this.setStart = function (pStart) {
        if (pStart instanceof Date) {
            vStart = pStart;
        }
        else {
            var temp = new Date(pStart);
            if (temp instanceof Date && !isNaN(temp.valueOf())) {
                vStart = temp;
            }
        }
    };
    this.setEnd = function (pEnd) {
        if (pEnd instanceof Date) {
            vEnd = pEnd;
        }
        else {
            var temp = new Date(pEnd);
            if (temp instanceof Date && !isNaN(temp.valueOf())) {
                vEnd = temp;
            }
        }
    };
    this.setPlanStart = function (pPlanStart) {
        if (pPlanStart instanceof Date)
            vPlanStart = pPlanStart;
        else
            vPlanStart = new Date(pPlanStart);
    };
    this.setPlanEnd = function (pPlanEnd) {
        if (pPlanEnd instanceof Date)
            vPlanEnd = pPlanEnd;
        else
            vPlanEnd = new Date(pPlanEnd);
    };
    this.setGroupMinStart = function (pStart) { if (pStart instanceof Date)
        vGroupMinStart = pStart; };
    this.setGroupMinEnd = function (pEnd) { if (pEnd instanceof Date)
        vGroupMinEnd = pEnd; };
    this.setLevel = function (pLevel) { vLevel = parseInt(document.createTextNode(pLevel).data); };
    this.setNumKid = function (pNumKid) { vNumKid = parseInt(document.createTextNode(pNumKid).data); };
    this.setWeight = function (pWeight) { vWeight = parseInt(document.createTextNode(pWeight).data); };
    this.setCompVal = function (pCompVal) { vCompVal = parseFloat(document.createTextNode(pCompVal).data); };
    this.setComp = function (pComp) {
        vComp = parseInt(document.createTextNode(pComp).data);
    };
    this.setStartX = function (pX) { x1 = parseInt(document.createTextNode(pX).data); };
    this.setStartY = function (pY) { y1 = parseInt(document.createTextNode(pY).data); };
    this.setEndX = function (pX) { x2 = parseInt(document.createTextNode(pX).data); };
    this.setEndY = function (pY) { y2 = parseInt(document.createTextNode(pY).data); };
    this.setOpen = function (pOpen) { vOpen = parseInt(document.createTextNode(pOpen).data); };
    this.setVisible = function (pVisible) { vVisible = parseInt(document.createTextNode(pVisible).data); };
    this.setSortIdx = function (pSortIdx) { vSortIdx = parseInt(document.createTextNode(pSortIdx).data); };
    this.setToDelete = function (pToDelete) { if (pToDelete)
        vToDelete = true;
    else
        vToDelete = false; };
    this.setParItem = function (pParItem) { if (pParItem)
        vParItem = pParItem; };
    this.setCellDiv = function (pCellDiv) { if (typeof HTMLDivElement !== 'function' || pCellDiv instanceof HTMLDivElement)
        vCellDiv = pCellDiv; }; //"typeof HTMLDivElement !== 'function'" to play nice with ie6 and 7
    this.setGroup = function (pGroup) {
        if (pGroup === true || pGroup === 'true') {
            vGroup = 1;
        }
        else if (pGroup === false || pGroup === 'false') {
            vGroup = 0;
        }
        else {
            vGroup = parseInt(document.createTextNode(pGroup).data);
        }
    };
    this.setBarText = function (pBarText) { if (pBarText)
        vBarText = pBarText; };
    this.setBarDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        vBarDiv = pDiv; };
    this.setTaskDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        vTaskDiv = pDiv; };
    this.setPlanTaskDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        vPlanTaskDiv = pDiv; };
    this.setChildRow = function (pRow) { if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement)
        vChildRow = pRow; };
    this.setListChildRow = function (pRow) { if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement)
        vListChildRow = pRow; };
    this.setGroupSpan = function (pSpan) { if (typeof HTMLSpanElement !== 'function' || pSpan instanceof HTMLSpanElement)
        vGroupSpan = pSpan; };
    this.getAllData = function () {
        return {
            pID: vID,
            pName: vName,
            pStart: vStart,
            pEnd: vEnd,
            pPlanStart: vPlanStart,
            pPlanEnd: vPlanEnd,
            pGroupMinStart: vGroupMinStart,
            pGroupMinEnd: vGroupMinEnd,
            pClass: vClass,
            pLink: vLink,
            pMile: vMile,
            pRes: vRes,
            pComp: vComp,
            pCost: vCost,
            pGroup: vGroup,
            pDataObject: vDataObject,
            pPlanClass: vPlanClass
        };
    };
};
/**
 * @param pTask
 * @param templateStrOrFn template string or function(task). In any case parameters in template string are substituted.
 *        If string - just a static template.
 *        If function(task): string - per task template. Can return null|undefined to fallback to default template.
 *        If function(task): Promise<string>) - async per task template. Tooltip will show 'Loading...' if promise is not yet complete.
 *          Otherwise returned template will be handled in the same manner as in other cases.
 */
exports.createTaskInfo = function (pTask, templateStrOrFn) {
    var _this = this;
    if (templateStrOrFn === void 0) { templateStrOrFn = null; }
    var vTmpDiv;
    var vTaskInfoBox = document.createDocumentFragment();
    var vTaskInfo = draw_utils_1.newNode(vTaskInfoBox, 'div', null, 'gTaskInfo');
    var setupTemplate = function (template) {
        vTaskInfo.innerHTML = "";
        if (template) {
            var allData_1 = pTask.getAllData();
            general_utils_1.internalProperties.forEach(function (key) {
                var lang;
                if (general_utils_1.internalPropertiesLang[key]) {
                    lang = _this.vLangs[_this.vLang][general_utils_1.internalPropertiesLang[key]];
                }
                if (!lang) {
                    lang = key;
                }
                var val = allData_1[key];
                template = template.replace("{{" + key + "}}", val);
                if (lang) {
                    template = template.replace("{{Lang:" + key + "}}", lang);
                }
                else {
                    template = template.replace("{{Lang:" + key + "}}", key);
                }
            });
            draw_utils_1.newNode(vTaskInfo, 'span', null, 'gTtTemplate', template);
        }
        else {
            draw_utils_1.newNode(vTaskInfo, 'span', null, 'gTtTitle', pTask.getName());
            if (_this.vShowTaskInfoStartDate == 1) {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTIsd');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['startdate'] + ': ');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskText', date_utils_1.formatDateStr(pTask.getStart(), _this.vDateTaskDisplayFormat, _this.vLangs[_this.vLang]));
            }
            if (_this.vShowTaskInfoEndDate == 1) {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTIed');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['enddate'] + ': ');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskText', date_utils_1.formatDateStr(pTask.getEnd(), _this.vDateTaskDisplayFormat, _this.vLangs[_this.vLang]));
            }
            if (_this.vShowTaskInfoDur == 1 && !pTask.getMile()) {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTId');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['dur'] + ': ');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getDuration(_this.vFormat, _this.vLangs[_this.vLang]));
            }
            if (_this.vShowTaskInfoComp == 1) {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTIc');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['completion'] + ': ');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getCompStr());
            }
            if (_this.vShowTaskInfoRes == 1) {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTIr');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['res'] + ': ');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getResource());
            }
            if (_this.vShowTaskInfoLink == 1 && pTask.getLink() != '') {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTIl');
                var vTmpNode = draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel');
                vTmpNode = draw_utils_1.newNode(vTmpNode, 'a', null, 'gTaskText', _this.vLangs[_this.vLang]['moreinfo']);
                vTmpNode.setAttribute('href', pTask.getLink());
            }
            if (_this.vShowTaskInfoNotes == 1) {
                vTmpDiv = draw_utils_1.newNode(vTaskInfo, 'div', null, 'gTILine gTIn');
                draw_utils_1.newNode(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['notes'] + ': ');
                if (pTask.getNotes())
                    vTmpDiv.appendChild(pTask.getNotes());
            }
        }
    };
    var callback;
    if (typeof templateStrOrFn === 'function') {
        callback = function () {
            var strOrPromise = templateStrOrFn(pTask);
            if (!strOrPromise || typeof strOrPromise === 'string') {
                setupTemplate(strOrPromise);
            }
            else if (strOrPromise.then) {
                setupTemplate(_this.vLangs[_this.vLang]['tooltipLoading'] || _this.vLangs['en']['tooltipLoading']);
                return strOrPromise.then(setupTemplate);
            }
        };
    }
    else {
        setupTemplate(templateStrOrFn);
    }
    return { component: vTaskInfoBox, callback: callback };
};
exports.AddTaskItem = function (value) {
    var vExists = false;
    for (var i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].getID() == value.getID()) {
            i = this.vTaskList.length;
            vExists = true;
        }
    }
    if (!vExists) {
        this.vTaskList.push(value);
        this.vProcessNeeded = true;
    }
};
exports.AddTaskItemObject = function (object) {
    if (!object.pGantt) {
        object.pGantt = this;
    }
    return this.AddTaskItem(exports.TaskItemObject(object));
};
exports.RemoveTaskItem = function (pID) {
    // simply mark the task for removal at this point - actually remove it next time we re-draw the chart
    for (var i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].getID() == pID)
            this.vTaskList[i].setToDelete(true);
        else if (this.vTaskList[i].getParent() == pID)
            this.RemoveTaskItem(this.vTaskList[i].getID());
    }
    this.vProcessNeeded = true;
};
exports.ClearTasks = function () {
    var _this = this;
    this.vTaskList.map(function (task) { return _this.RemoveTaskItem(task.getID()); });
    this.vProcessNeeded = true;
};
// Recursively process task tree ... set min, max dates of parent tasks and identfy task level.
exports.processRows = function (pList, pID, pRow, pLevel, pOpen, pUseSort, vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    var vMinDate = null;
    var vMaxDate = null;
    var vMinPlanDate = null;
    var vMaxPlanDate = null;
    var vVisible = pOpen;
    var vCurItem = null;
    var vCompSum = 0;
    var vMinSet = 0;
    var vMaxSet = 0;
    var vMinPlanSet = 0;
    var vMaxPlanSet = 0;
    var vNumKid = 0;
    var vWeight = 0;
    var vLevel = pLevel;
    var vList = pList;
    var vComb = false;
    var i = 0;
    for (i = 0; i < pList.length; i++) {
        if (pList[i].getToDelete()) {
            pList.splice(i, 1);
            i--;
        }
        if (i >= 0 && pList[i].getID() == pID)
            vCurItem = pList[i];
    }
    for (i = 0; i < pList.length; i++) {
        if (pList[i].getParent() == pID) {
            vVisible = pOpen;
            pList[i].setParItem(vCurItem);
            pList[i].setVisible(vVisible);
            if (vVisible == 1 && pList[i].getOpen() == 0)
                vVisible = 0;
            if (pList[i].getMile() && pList[i].getParItem() && pList[i].getParItem().getGroup() == 2) { //remove milestones owned by combined groups
                pList.splice(i, 1);
                i--;
                continue;
            }
            pList[i].setLevel(vLevel);
            if (pList[i].getGroup()) {
                if (pList[i].getParItem() && pList[i].getParItem().getGroup() == 2)
                    pList[i].setGroup(2);
                exports.processRows(vList, pList[i].getID(), i, vLevel + 1, vVisible, 0);
            }
            if (pList[i].getStartVar() && (vMinSet == 0 || pList[i].getStartVar() < vMinDate)) {
                vMinDate = pList[i].getStartVar();
                vMinSet = 1;
            }
            if (pList[i].getEndVar() && (vMaxSet == 0 || pList[i].getEndVar() > vMaxDate)) {
                vMaxDate = pList[i].getEndVar();
                vMaxSet = 1;
            }
            if (vMinPlanSet == 0 || pList[i].getPlanStart() < vMinPlanDate) {
                vMinPlanDate = pList[i].getPlanStart();
                vMinPlanSet = 1;
            }
            if (vMaxPlanSet == 0 || pList[i].getPlanEnd() > vMaxPlanDate) {
                vMaxPlanDate = pList[i].getPlanEnd();
                vMaxPlanSet = 1;
            }
            vNumKid++;
            vWeight += pList[i].getEnd() - pList[i].getStart() + 1;
            vCompSum += pList[i].getCompVal() * (pList[i].getEnd() - pList[i].getStart() + 1);
            pList[i].setSortIdx(i * pList.length);
        }
    }
    if (pRow >= 0) {
        if (pList[pRow].getGroupMinStart() != null && pList[pRow].getGroupMinStart() < vMinDate) {
            vMinDate = pList[pRow].getGroupMinStart();
        }
        if (pList[pRow].getGroupMinEnd() != null && pList[pRow].getGroupMinEnd() > vMaxDate) {
            vMaxDate = pList[pRow].getGroupMinEnd();
        }
        if (vMinDate) {
            pList[pRow].setStart(vMinDate);
        }
        if (vMaxDate) {
            pList[pRow].setEnd(vMaxDate);
        }
        if (pList[pRow].getGroupMinPlanStart() != null && pList[pRow].getGroupMinPlanStart() < vMinPlanDate) {
            vMinPlanDate = pList[pRow].getGroupMinPlanStart();
        }
        if (pList[pRow].getGroupMinPlanEnd() != null && pList[pRow].getGroupMinPlanEnd() > vMaxPlanDate) {
            vMaxPlanDate = pList[pRow].getGroupMinPlanEnd();
        }
        if (vMinPlanDate) {
            pList[pRow].setPlanStart(vMinPlanDate);
        }
        if (vMaxPlanDate) {
            pList[pRow].setPlanEnd(vMaxPlanDate);
        }
        pList[pRow].setNumKid(vNumKid);
        pList[pRow].setWeight(vWeight);
        pList[pRow].setCompVal(Math.ceil(vCompSum / vWeight));
    }
    if (pID == 0 && pUseSort == 1) {
        var bd = void 0;
        if (vDebug) {
            bd = new Date();
            console.info('before afterTasks', bd);
        }
        exports.sortTasks(pList, 0, 0);
        if (vDebug) {
            var ad = new Date();
            console.info('after afterTasks', ad, (ad.getTime() - bd.getTime()));
        }
        pList.sort(function (a, b) { return a.getSortIdx() - b.getSortIdx(); });
    }
    if (pID == 0 && pUseSort != 1) // Need to sort combined tasks regardless
     {
        for (i = 0; i < pList.length; i++) {
            if (pList[i].getGroup() == 2) {
                vComb = true;
                var bd = void 0;
                if (vDebug) {
                    bd = new Date();
                    console.info('before sortTasks', bd);
                }
                exports.sortTasks(pList, pList[i].getID(), pList[i].getSortIdx() + 1);
                if (vDebug) {
                    var ad = new Date();
                    console.info('after sortTasks', ad, (ad.getTime() - bd.getTime()));
                }
            }
        }
        if (vComb == true)
            pList.sort(function (a, b) { return a.getSortIdx() - b.getSortIdx(); });
    }
};

},{"./utils/date_utils":11,"./utils/draw_utils":12,"./utils/general_utils":13}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsoWeek = exports.parseDateFormatStr = exports.formatDateStr = exports.parseDateStr = exports.coerceDate = exports.getMaxDate = exports.getMinDate = void 0;
var moment = require("jalali-moment");
/**
 * DATES
 */
exports.getMinDate = function (pList, pFormat, pMinDate) {
    var vDate = new Date();
    if (pList.length <= 0)
        return pMinDate || vDate;
    vDate.setTime((pMinDate && pMinDate.getTime()) || pList[0].getStart().getTime());
    // Parse all Task Start dates to find min
    for (var i = 0; i < pList.length; i++) {
        if (pList[i].getStart().getTime() < vDate.getTime())
            vDate.setTime(pList[i].getStart().getTime());
        if (pList[i].getPlanStart() && pList[i].getPlanStart().getTime() < vDate.getTime())
            vDate.setTime(pList[i].getPlanStart().getTime());
    }
    moment().locale('fa');
    var vPersianDate = moment(vDate);
    // Adjust min date to specific format boundaries (first of week or first of month)
    if (pFormat == 'day') {
        vDate.setDate(vDate.getDate() - 1);
        while (vDate.getDay() % 7 != 1)
            vDate.setDate(vDate.getDate() - 1);
    }
    else if (pFormat == 'week') {
        vDate.setDate(vDate.getDate() - 1);
        while (vDate.getDay() % 7 != 1)
            vDate.setDate(vDate.getDate() - 1);
    }
    else if (pFormat == 'month') {
        vDate.setDate(vDate.getDate() - 15);
        vPersianDate.date(vPersianDate.date() - 15);
        while (vDate.getDate() > 1)
            vDate.setDate(vDate.getDate() - 1);
        while (vPersianDate.date() > 1)
            vPersianDate.date(vPersianDate.date() - 1);
    }
    else if (pFormat == 'quarter') {
        vDate.setDate(vDate.getDate() - 31);
        if (vDate.getMonth() == 0 || vDate.getMonth() == 1 || vDate.getMonth() == 2)
            vDate.setFullYear(vDate.getFullYear(), 0, 1);
        else if (vDate.getMonth() == 3 || vDate.getMonth() == 4 || vDate.getMonth() == 5)
            vDate.setFullYear(vDate.getFullYear(), 3, 1);
        else if (vDate.getMonth() == 6 || vDate.getMonth() == 7 || vDate.getMonth() == 8)
            vDate.setFullYear(vDate.getFullYear(), 6, 1);
        else if (vDate.getMonth() == 9 || vDate.getMonth() == 10 || vDate.getMonth() == 11)
            vDate.setFullYear(vDate.getFullYear(), 9, 1);
    }
    else if (pFormat == 'hour') {
        vDate.setHours(vDate.getHours() - 1);
        while (vDate.getHours() % 6 != 0)
            vDate.setHours(vDate.getHours() - 1);
    }
    if (pFormat == 'hour')
        vDate.setMinutes(0, 0);
    else
        vDate.setHours(0, 0, 0);
    if (pFormat == 'month') {
        return vPersianDate.toDate();
    }
    else {
        return (vDate);
    }
};
exports.getMaxDate = function (pList, pFormat, pMaxDate) {
    var vDate = new Date();
    if (pList.length <= 0)
        return pMaxDate || vDate;
    vDate.setTime((pMaxDate && pMaxDate.getTime()) || pList[0].getEnd().getTime());
    // Parse all Task End dates to find max
    for (var i = 0; i < pList.length; i++) {
        if (pList[i].getEnd().getTime() > vDate.getTime())
            vDate.setTime(pList[i].getEnd().getTime());
        if (pList[i].getPlanEnd() && pList[i].getPlanEnd().getTime() > vDate.getTime())
            vDate.setTime(pList[i].getPlanEnd().getTime());
    }
    moment().locale('fa');
    var vPersianDate = moment(vDate);
    // Adjust max date to specific format boundaries (end of week or end of month)
    if (pFormat == 'day') {
        vDate.setDate(vDate.getDate() + 1);
        while (vDate.getDay() % 7 != 0)
            vDate.setDate(vDate.getDate() + 1);
    }
    else if (pFormat == 'week') {
        //For weeks, what is the last logical boundary?
        vDate.setDate(vDate.getDate() + 1);
        while (vDate.getDay() % 7 != 0)
            vDate.setDate(vDate.getDate() + 1);
    }
    else if (pFormat == 'month') {
        // Set to last day of current Month
        while (vDate.getDate() > 1)
            vDate.setDate(vDate.getDate() + 1);
        vDate.setDate(vDate.getDate() - 1);
        while (vPersianDate.date() > 1)
            vPersianDate.date(vPersianDate.date() + 1);
        vPersianDate.date(vPersianDate.date() - 1);
    }
    else if (pFormat == 'quarter') {
        // Set to last day of current Quarter
        if (vDate.getMonth() == 0 || vDate.getMonth() == 1 || vDate.getMonth() == 2)
            vDate.setFullYear(vDate.getFullYear(), 2, 31);
        else if (vDate.getMonth() == 3 || vDate.getMonth() == 4 || vDate.getMonth() == 5)
            vDate.setFullYear(vDate.getFullYear(), 5, 30);
        else if (vDate.getMonth() == 6 || vDate.getMonth() == 7 || vDate.getMonth() == 8)
            vDate.setFullYear(vDate.getFullYear(), 8, 30);
        else if (vDate.getMonth() == 9 || vDate.getMonth() == 10 || vDate.getMonth() == 11)
            vDate.setFullYear(vDate.getFullYear(), 11, 31);
    }
    else if (pFormat == 'hour') {
        if (vDate.getHours() == 0)
            vDate.setDate(vDate.getDate() + 1);
        vDate.setHours(vDate.getHours() + 1);
        while (vDate.getHours() % 6 != 5)
            vDate.setHours(vDate.getHours() + 1);
    }
    if (pFormat == 'month') {
        return vPersianDate.toDate();
    }
    else {
        return (vDate);
    }
};
exports.coerceDate = function (date) {
    if (date instanceof Date) {
        return date;
    }
    else {
        var temp = new Date(date);
        if (temp instanceof Date && !isNaN(temp.valueOf())) {
            return temp;
        }
    }
};
exports.parseDateStr = function (pDateStr, pFormatStr) {
    var vDate = new Date();
    var vDateParts = pDateStr.split(/[^0-9]/);
    if (pDateStr.length >= 10 && vDateParts.length >= 3) {
        while (vDateParts.length < 5)
            vDateParts.push(0);
        switch (pFormatStr) {
            case 'mm/dd/yyyy':
                vDate = new Date(vDateParts[2], vDateParts[0] - 1, vDateParts[1], vDateParts[3], vDateParts[4]);
                break;
            case 'dd/mm/yyyy':
                vDate = new Date(vDateParts[2], vDateParts[1] - 1, vDateParts[0], vDateParts[3], vDateParts[4]);
                break;
            case 'yyyy-mm-dd':
                vDate = new Date(vDateParts[0], vDateParts[1] - 1, vDateParts[2], vDateParts[3], vDateParts[4]);
                break;
            case 'yyyy-mm-dd HH:MI:SS':
                vDate = new Date(vDateParts[0], vDateParts[1] - 1, vDateParts[2], vDateParts[3], vDateParts[4], vDateParts[5]);
                break;
        }
    }
    return (vDate);
};
exports.formatDateStr = function (pDate, pDateFormatArr, pL) {
    // Fix on issue #303 - getXMLTask is passing null as pDates
    if (!pDate) {
        return;
    }
    var vDateStr = '';
    // let vYear2Str = pDate.getFullYear().toString().substring(2, 4);
    var vYear2Str = moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').year().toString().substring(2, 4);
    // let vMonthStr = (pDate.getMonth() + 1) + '';
    var vMonthStr = (moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').month() + 1) + '';
    var vMonthArr = new Array(pL['january'], pL['february'], pL['march'], pL['april'], pL['maylong'], pL['june'], pL['july'], pL['august'], pL['september'], pL['october'], pL['november'], pL['december']);
    // let vMonthArr = new Array(pL['april'], pL['maylong'], pL['june'], pL['july'], pL['august'], pL['september'], pL['october'], pL['november'], pL['december'], pL['january'], pL['february'], pL['march']);
    var vDayArr = new Array(pL['sunday'], pL['monday'], pL['tuesday'], pL['wednesday'], pL['thursday'], pL['friday'], pL['saturday']);
    // let vDayArr = new Array(pL['saturday'], pL['sunday'], pL['monday'], pL['tuesday'], pL['wednesday'], pL['thursday'], pL['friday']);
    var vMthArr = new Array(pL['jan'], pL['feb'], pL['mar'], pL['apr'], pL['may'], pL['jun'], pL['jul'], pL['aug'], pL['sep'], pL['oct'], pL['nov'], pL['dec']);
    // let vMthArr = new Array(pL['apr'], pL['may'], pL['jun'], pL['jul'], pL['aug'], pL['sep'], pL['oct'], pL['nov'], pL['dec'], pL['jan'], pL['feb'], pL['mar']);
    var vDyArr = new Array(pL['sun'], pL['mon'], pL['tue'], pL['wed'], pL['thu'], pL['fri'], pL['sat']);
    // let vDyArr = new Array(pL['sat'], pL['sun'], pL['mon'], pL['tue'], pL['wed'], pL['thu'], pL['fri']);
    for (var i = 0; i < pDateFormatArr.length; i++) {
        switch (pDateFormatArr[i]) {
            case 'dd':
                // if (pDate.getDate() < 10) vDateStr += '0'; // now fall through
                if (moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').date() < 10)
                    vDateStr += '0'; // now fall through
            case 'd':
                // vDateStr += pDate.getDate();
                vDateStr += moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').date();
                break;
            case 'day':
                // vDateStr += vDyArr[pDate.getDay()];
                vDateStr += vDyArr[moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').day()];
                break;
            case 'DAY':
                // vDateStr += vDayArr[pDate.getDay()];
                vDateStr += vDayArr[moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').day()];
                break;
            case 'mm':
                if (parseInt(vMonthStr, 10) < 10)
                    vDateStr += '0'; // now fall through
            case 'm':
                vDateStr += vMonthStr;
                break;
            case 'mon':
                // vDateStr += vMthArr[pDate.getMonth()];
                vDateStr += vMthArr[moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').month()];
                break;
            case 'month':
                // vDateStr += vMonthArr[pDate.getMonth()];
                vDateStr += vMonthArr[moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').month()];
                break;
            case 'yyyy':
                // vDateStr += pDate.getFullYear();
                vDateStr += moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').year();
                break;
            case 'yy':
                vDateStr += vYear2Str;
                break;
            case 'qq':
                vDateStr += pL['qtr']; // now fall through
            case 'q':
                // vDateStr += Math.floor(pDate.getMonth() / 3) + 1;
                vDateStr += Math.floor(moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').month() / 3) + 1;
                break;
            case 'hh':
                // if ((((pDate.getHours() % 12) == 0) ? 12 : pDate.getHours() % 12) < 10) vDateStr += '0'; // now fall through
                if ((((moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').hours() % 12) == 0) ? 12 : moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').hours() % 12) < 10)
                    vDateStr += '0'; // now fall through
            case 'h':
                // vDateStr += ((pDate.getHours() % 12) == 0) ? 12 : pDate.getHours() % 12;
                vDateStr += ((moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').hours() % 12) == 0) ? 12 : moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').hours() % 12;
                break;
            case 'HH':
                // if ((pDate.getHours()) < 10) vDateStr += '0'; // now fall through
                if ((moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').hours()) < 10)
                    vDateStr += '0'; // now fall through
            case 'H':
                // vDateStr += (pDate.getHours());
                vDateStr += (moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').hours());
                break;
            case 'MI':
                // if (pDate.getMinutes() < 10) vDateStr += '0'; // now fall through
                if (moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').minutes() < 10)
                    vDateStr += '0'; // now fall through
            case 'mi':
                // vDateStr += pDate.getMinutes();
                vDateStr += moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').hours();
                break;
            case 'SS':
                if (moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').seconds() < 10)
                    vDateStr += '0'; // now fall through
            case 'ss':
                // vDateStr += pDate.getSeconds();
                vDateStr += moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').seconds();
                break;
            case 'pm':
                // vDateStr += ((pDate.getHours()) < 12) ? 'am' : 'pm';
                vDateStr += ((moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').hours()) < 12) ? 'am' : 'pm';
                break;
            case 'PM':
                // vDateStr += ((pDate.getHours()) < 12) ? 'AM' : 'PM';
                vDateStr += ((moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').hours()) < 12) ? 'AM' : 'PM';
                break;
            case 'ww':
                if (exports.getIsoWeek(pDate) < 10)
                    vDateStr += '0'; // now fall through
            case 'w':
                vDateStr += exports.getIsoWeek(pDate);
                break;
            case 'week':
                var vWeekNum = exports.getIsoWeek(pDate);
                // let vYear = pDate.getFullYear();
                var vYear = moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').year();
                // let vDayOfWeek = (pDate.getDay() == 0) ? 7 : pDate.getDay();
                var vDayOfWeek = (moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').date() == 0) ? 7 : moment.from(pDate, 'en', 'YYYY-MM-DD').locale('fa').date();
                if (vWeekNum >= 52 && parseInt(vMonthStr, 10) === 1)
                    vYear--;
                if (vWeekNum == 1 && parseInt(vMonthStr, 10) === 12)
                    vYear++;
                if (vWeekNum < 10)
                    vWeekNum = parseInt('0' + vWeekNum, 10);
                vDateStr += vYear + '-W' + vWeekNum + '-' + vDayOfWeek;
                break;
            default:
                if (pL[pDateFormatArr[i].toLowerCase()])
                    vDateStr += pL[pDateFormatArr[i].toLowerCase()];
                else
                    vDateStr += pDateFormatArr[i];
                break;
        }
    }
    return vDateStr;
};
exports.parseDateFormatStr = function (pFormatStr) {
    var vComponantStr = '';
    var vCurrChar = '';
    var vSeparators = new RegExp('[\/\\ -.,\'":]');
    var vDateFormatArray = new Array();
    for (var i = 0; i < pFormatStr.length; i++) {
        vCurrChar = pFormatStr.charAt(i);
        if ((vCurrChar.match(vSeparators)) || (i + 1 == pFormatStr.length)) // separator or end of string
         {
            if ((i + 1 == pFormatStr.length) && (!(vCurrChar.match(vSeparators)))) // at end of string add any non-separator chars to the current component
             {
                vComponantStr += vCurrChar;
            }
            vDateFormatArray.push(vComponantStr);
            if (vCurrChar.match(vSeparators))
                vDateFormatArray.push(vCurrChar);
            vComponantStr = '';
        }
        else {
            vComponantStr += vCurrChar;
        }
    }
    return vDateFormatArray;
};
/**
 * We have to compare against the monday of the first week of the year containing 04 jan *not* 01/01
 * 60*60*24*1000=86400000
 * @param pDate
 */
exports.getIsoWeek = function (pDate) {
    var dayMiliseconds = 86400000;
    var keyDay = new Date(pDate.getFullYear(), 0, 4, 0, 0, 0);
    var keyDayOfWeek = (keyDay.getDay() == 0) ? 6 : keyDay.getDay() - 1; // define monday as 0
    var firstMondayYearTime = keyDay.getTime() - (keyDayOfWeek * dayMiliseconds);
    var thisDate = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate(), 0, 0, 0); // This at 00:00:00
    var thisTime = thisDate.getTime();
    var daysFromFirstMonday = Math.round(((thisTime - firstMondayYearTime) / dayMiliseconds));
    var lastWeek = 99;
    var thisWeek = 99;
    var firstMondayYear = new Date(firstMondayYearTime);
    thisWeek = Math.ceil((daysFromFirstMonday + 1) / 7);
    if (thisWeek <= 0)
        thisWeek = exports.getIsoWeek(new Date(pDate.getFullYear() - 1, 11, 31, 0, 0, 0));
    else if (thisWeek == 53 && (new Date(pDate.getFullYear(), 0, 1, 0, 0, 0)).getDay() != 4 && (new Date(pDate.getFullYear(), 11, 31, 0, 0, 0)).getDay() != 4)
        thisWeek = 1;
    return thisWeek;
};

},{"jalali-moment":15}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSelector = exports.sLine = exports.CalcTaskXY = exports.getArrayLocationByID = exports.newNode = exports.makeInput = void 0;
var events_1 = require("../events");
exports.makeInput = function (formattedValue, editable, type, value, choices) {
    if (type === void 0) { type = 'text'; }
    if (value === void 0) { value = null; }
    if (choices === void 0) { choices = null; }
    if (!value) {
        value = formattedValue;
    }
    if (editable) {
        switch (type) {
            case 'date':
                // Take timezone into account before converting to ISO String
                value = value ? new Date(value.getTime() - (value.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '';
                // TODO: Show a persian date component here:
                return "<input class=\"gantt-inputtable\" type=\"date\" value=\"" + value + "\">";
            case 'resource':
                if (choices) {
                    var found = choices.filter(function (c) { return c.id == value || c.name == value; });
                    if (found && found.length > 0) {
                        value = found[0].id;
                    }
                    else {
                        choices.push({ id: value, name: value });
                    }
                    return "<select>" + choices.map(function (c) { return "<option value=\"" + c.id + "\" " + (value == c.id ? 'selected' : '') + " >" + c.name + "</option>"; }).join('') + "</select>";
                }
                else {
                    return "<input class=\"gantt-inputtable\" type=\"text\" value=\"" + (value ? value : '') + "\">";
                }
            case 'cost':
                return "<input class=\"gantt-inputtable\" type=\"number\" max=\"100\" min=\"0\" value=\"" + (value ? value : '') + "\">";
            default:
                return "<input class=\"gantt-inputtable\" value=\"" + (value ? value : '') + "\">";
        }
    }
    else {
        return formattedValue;
    }
};
exports.newNode = function (pParent, pNodeType, pId, pClass, pText, pWidth, pLeft, pDisplay, pColspan, pAttribs) {
    if (pId === void 0) { pId = null; }
    if (pClass === void 0) { pClass = null; }
    if (pText === void 0) { pText = null; }
    if (pWidth === void 0) { pWidth = null; }
    if (pLeft === void 0) { pLeft = null; }
    if (pDisplay === void 0) { pDisplay = null; }
    if (pColspan === void 0) { pColspan = null; }
    if (pAttribs === void 0) { pAttribs = null; }
    var vNewNode = pParent.appendChild(document.createElement(pNodeType));
    if (pAttribs) {
        for (var i = 0; i + 1 < pAttribs.length; i += 2) {
            vNewNode.setAttribute(pAttribs[i], pAttribs[i + 1]);
        }
    }
    if (pId)
        vNewNode.id = pId; // I wish I could do this with setAttribute but older IEs don't play nice
    if (pClass)
        vNewNode.className = pClass;
    if (pWidth)
        vNewNode.style.width = (isNaN(pWidth * 1)) ? pWidth : pWidth + 'px';
    if (pLeft)
        vNewNode.style.left = (isNaN(pLeft * 1)) ? pLeft : pLeft + 'px';
    if (pText) {
        if (pText.indexOf && pText.indexOf('<') === -1) {
            vNewNode.appendChild(document.createTextNode(pText));
        }
        else {
            vNewNode.insertAdjacentHTML('beforeend', pText);
        }
    }
    if (pDisplay)
        vNewNode.style.display = pDisplay;
    if (pColspan)
        vNewNode.colSpan = pColspan;
    return vNewNode;
};
exports.getArrayLocationByID = function (pId) {
    var vList = this.getList();
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getID() == pId)
            return i;
    }
    return -1;
};
exports.CalcTaskXY = function () {
    var vID;
    var vList = this.getList();
    var vBarDiv;
    var vTaskDiv;
    var vParDiv;
    var vLeft, vTop, vWidth;
    var vHeight = Math.floor((this.getRowHeight() / 2));
    for (var i = 0; i < vList.length; i++) {
        vID = vList[i].getID();
        vBarDiv = vList[i].getBarDiv();
        vTaskDiv = vList[i].getTaskDiv();
        if ((vList[i].getParItem() && vList[i].getParItem().getGroup() == 2)) {
            vParDiv = vList[i].getParItem().getChildRow();
        }
        else
            vParDiv = vList[i].getChildRow();
        if (vBarDiv) {
            vList[i].setStartX(vBarDiv.offsetLeft + 1);
            vList[i].setStartY(vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1);
            vList[i].setEndX(vBarDiv.offsetLeft + vBarDiv.offsetWidth + 1);
            vList[i].setEndY(vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1);
        }
    }
};
exports.sLine = function (x1, y1, x2, y2, pClass) {
    var vLeft = Math.min(x1, x2);
    var vTop = Math.min(y1, y2);
    var vWid = Math.abs(x2 - x1) + 1;
    var vHgt = Math.abs(y2 - y1) + 1;
    var vTmpDiv = document.createElement('div');
    vTmpDiv.id = this.vDivId + 'line' + this.vDepId++;
    vTmpDiv.style.position = 'absolute';
    vTmpDiv.style.overflow = 'hidden';
    vTmpDiv.style.zIndex = '0';
    vTmpDiv.style.left = vLeft + 'px';
    vTmpDiv.style.top = vTop + 'px';
    vTmpDiv.style.width = vWid + 'px';
    vTmpDiv.style.height = vHgt + 'px';
    vTmpDiv.style.visibility = 'visible';
    if (vWid == 1)
        vTmpDiv.className = 'glinev';
    else
        vTmpDiv.className = 'glineh';
    if (pClass)
        vTmpDiv.className += ' ' + pClass;
    this.getLines().appendChild(vTmpDiv);
    if (this.vEvents.onLineDraw && typeof this.vEvents.onLineDraw === 'function') {
        this.vEvents.onLineDraw(vTmpDiv);
    }
    return vTmpDiv;
};
exports.drawSelector = function (pPos) {
    var vOutput = document.createDocumentFragment();
    var vDisplay = false;
    for (var i = 0; i < this.vShowSelector.length && !vDisplay; i++) {
        if (this.vShowSelector[i].toLowerCase() == pPos.toLowerCase())
            vDisplay = true;
    }
    if (vDisplay) {
        var vTmpDiv = exports.newNode(vOutput, 'div', null, 'gselector', this.vLangs[this.vLang]['format'] + ':');
        if (this.vFormatArr.join().toLowerCase().indexOf('hour') != -1)
            events_1.addFormatListeners(this, 'hour', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formathour' + pPos, 'gformlabel' + ((this.vFormat == 'hour') ? ' gselected' : ''), this.vLangs[this.vLang]['hour']));
        if (this.vFormatArr.join().toLowerCase().indexOf('day') != -1)
            events_1.addFormatListeners(this, 'day', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formatday' + pPos, 'gformlabel' + ((this.vFormat == 'day') ? ' gselected' : ''), this.vLangs[this.vLang]['day']));
        if (this.vFormatArr.join().toLowerCase().indexOf('week') != -1)
            events_1.addFormatListeners(this, 'week', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formatweek' + pPos, 'gformlabel' + ((this.vFormat == 'week') ? ' gselected' : ''), this.vLangs[this.vLang]['week']));
        if (this.vFormatArr.join().toLowerCase().indexOf('month') != -1)
            events_1.addFormatListeners(this, 'month', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formatmonth' + pPos, 'gformlabel' + ((this.vFormat == 'month') ? ' gselected' : ''), this.vLangs[this.vLang]['month']));
        if (this.vFormatArr.join().toLowerCase().indexOf('quarter') != -1)
            events_1.addFormatListeners(this, 'quarter', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formatquarter' + pPos, 'gformlabel' + ((this.vFormat == 'quarter') ? ' gselected' : ''), this.vLangs[this.vLang]['quarter']));
    }
    else {
        exports.newNode(vOutput, 'div', null, 'gselector');
    }
    return vOutput;
};

},{"../events":5}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printChart = exports.calculateStartEndFromDepend = exports.makeRequestOldBrowsers = exports.makeRequest = exports.moveToolTip = exports.updateFlyingObj = exports.isParentElementOrSelf = exports.criticalPath = exports.hashKey = exports.hashString = exports.fadeToolTip = exports.hideToolTip = exports.isIE = exports.getOffset = exports.calculatePersianCurrentDateOffset = exports.toStandardDate = exports.calculateCurrentDateOffset = exports.getScrollbarWidth = exports.getScrollPositions = exports.benchMark = exports.getZoomFactor = exports.delayedHide = exports.stripUnwanted = exports.stripIds = exports.changeFormat = exports.findObj = exports.internalPropertiesLang = exports.internalProperties = void 0;
var moment = require("jalali-moment");
exports.internalProperties = ['pID', 'pName', 'pStart', 'pEnd', 'pClass', 'pLink', 'pMile', 'pRes', 'pComp', 'pGroup', 'pParent',
    'pOpen', 'pDepend', 'pCaption', 'pNotes', 'pGantt', 'pCost', 'pPlanStart', 'pPlanEnd', 'pPlanClass'];
exports.internalPropertiesLang = {
    'pID': 'id',
    'pName': 'name',
    'pStart': 'startdate',
    'pEnd': 'enddate',
    'pLink': 'link',
    'pMile': 'mile',
    'pRes': 'res',
    'pDuration': 'dur',
    'pComp': 'comp',
    'pGroup': 'group',
    'pParent': 'parent',
    'pOpen': 'open',
    'pDepend': 'depend',
    'pCaption': 'caption',
    'pNotes': 'notes',
    'pCost': 'cost',
    'pPlanStart': 'planstartdate',
    'pPlanEnd': 'planenddate',
    'pPlanClass': 'planclass'
};
exports.findObj = function (theObj, theDoc) {
    if (theDoc === void 0) { theDoc = null; }
    var p, i, foundObj;
    if (!theDoc)
        theDoc = document;
    if (document.getElementById)
        foundObj = document.getElementById(theObj);
    return foundObj;
};
exports.changeFormat = function (pFormat, ganttObj) {
    if (ganttObj)
        ganttObj.setFormat(pFormat);
    else
        alert('Chart undefined');
};
exports.stripIds = function (pNode) {
    for (var i = 0; i < pNode.childNodes.length; i++) {
        if ('removeAttribute' in pNode.childNodes[i])
            pNode.childNodes[i].removeAttribute('id');
        if (pNode.childNodes[i].hasChildNodes())
            exports.stripIds(pNode.childNodes[i]);
    }
};
exports.stripUnwanted = function (pNode) {
    var vAllowedTags = new Array('#text', 'p', 'br', 'ul', 'ol', 'li', 'div', 'span', 'img');
    for (var i = 0; i < pNode.childNodes.length; i++) {
        /* versions of IE<9 don't support indexOf on arrays so add trailing comma to the joined array and lookup value to stop substring matches */
        if ((vAllowedTags.join().toLowerCase() + ',').indexOf(pNode.childNodes[i].nodeName.toLowerCase() + ',') == -1) {
            pNode.replaceChild(document.createTextNode(pNode.childNodes[i].outerHTML), pNode.childNodes[i]);
        }
        if (pNode.childNodes[i].hasChildNodes())
            exports.stripUnwanted(pNode.childNodes[i]);
    }
};
exports.delayedHide = function (pGanttChartObj, pTool, pTimer) {
    var vDelay = pGanttChartObj.getTooltipDelay() || 1500;
    if (pTool)
        pTool.delayTimeout = setTimeout(function () { exports.hideToolTip(pGanttChartObj, pTool, pTimer); }, vDelay);
};
exports.getZoomFactor = function () {
    var vFactor = 1;
    if (document.body.getBoundingClientRect) {
        // rect is only in physical pixel size in IE before version 8
        var vRect = document.body.getBoundingClientRect();
        var vPhysicalW = vRect.right - vRect.left;
        var vLogicalW = document.body.offsetWidth;
        // the zoom level is always an integer percent value
        vFactor = Math.round((vPhysicalW / vLogicalW) * 100) / 100;
    }
    return vFactor;
};
exports.benchMark = function (pItem) {
    var vEndTime = new Date().getTime();
    alert(pItem + ': Elapsed time: ' + ((vEndTime - this.vBenchTime) / 1000) + ' seconds.');
    this.vBenchTime = new Date().getTime();
};
exports.getScrollPositions = function () {
    var vScrollLeft = window.pageXOffset;
    var vScrollTop = window.pageYOffset;
    if (!('pageXOffset' in window)) // Internet Explorer before version 9
     {
        var vZoomFactor = exports.getZoomFactor();
        vScrollLeft = Math.round(document.documentElement.scrollLeft / vZoomFactor);
        vScrollTop = Math.round(document.documentElement.scrollTop / vZoomFactor);
    }
    return { x: vScrollLeft, y: vScrollTop };
};
var scrollbarWidth = undefined;
exports.getScrollbarWidth = function () {
    if (scrollbarWidth)
        return scrollbarWidth;
    var outer = document.createElement('div');
    outer.className = 'gscrollbar-calculation-container';
    document.body.appendChild(outer);
    // Creating inner element and placing it in the container
    var inner = document.createElement('div');
    outer.appendChild(inner);
    // Calculating difference between container's full width and the child width
    scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
};
exports.calculateCurrentDateOffset = function (curTaskStart, curTaskEnd) {
    var tmpTaskStart = Date.UTC(curTaskStart.getFullYear(), curTaskStart.getMonth(), curTaskStart.getDate(), curTaskStart.getHours(), 0, 0);
    var tmpTaskEnd = Date.UTC(curTaskEnd.getFullYear(), curTaskEnd.getMonth(), curTaskEnd.getDate(), curTaskEnd.getHours(), 0, 0);
    return (tmpTaskEnd - tmpTaskStart);
};
//TODO: it should be moved to date_util.ts
exports.toStandardDate = function (date) {
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
    return [date.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('-');
};
exports.calculatePersianCurrentDateOffset = function (curTaskStart, curTaskEnd) {
    var tmpTaskStart = moment.from(exports.toStandardDate(curTaskStart), 'en', 'YYYY-MM-DD HH:mm:ss').locale('fa').format('YYYY-MM-DD HH:mm:ss');
    var tmpTaskEnd = moment.from(exports.toStandardDate(curTaskEnd), 'en', 'YYYY-MM-DD HH:mm:ss').locale('fa').format('YYYY-MM-DD HH:mm:ss');
    var startTime = moment(tmpTaskStart, 'jYYYY/jMM/jDD HH:mm:ss');
    startTime.minute(0);
    startTime.second(0);
    var endTime = moment(tmpTaskEnd, 'jYYYY/jMM/jDD HH:mm:ss');
    endTime.minute(0);
    endTime.second(0);
    var diff = endTime.diff(startTime, 'millisecond', true);
    return diff;
};
exports.getOffset = function (pStartDate, pEndDate, pColWidth, pFormat, pShowWeekends) {
    var DAY_CELL_MARGIN_WIDTH = 3; // Cell margin for 'day' format
    var WEEK_CELL_MARGIN_WIDTH = 3; // Cell margin for 'week' format
    var MONTH_CELL_MARGIN_WIDTH = 3; // Cell margin for 'month' format
    var QUARTER_CELL_MARGIN_WIDTH = 3; // Cell margin for 'quarter' format
    var HOUR_CELL_MARGIN_WIDTH = 3; // Cell margin for 'hour' format
    var vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var curTaskStart = new Date(pStartDate.getTime());
    var curTaskEnd = new Date(pEndDate.getTime());
    var vTaskRightPx = 0;
    moment.locale('fa');
    // Length of task in hours
    var oneHour = 3600000;
    var vTaskRight = 0;
    if (pFormat == 'month') {
        vMonthDaysArr = new Array(31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29);
        vTaskRight = exports.calculatePersianCurrentDateOffset(curTaskStart, curTaskEnd) / oneHour;
    }
    else {
        vTaskRight = exports.calculateCurrentDateOffset(curTaskStart, curTaskEnd) / oneHour;
    }
    var vPosTmpDate;
    if (pFormat == 'day') {
        if (!pShowWeekends) {
            var start = curTaskStart;
            var end = curTaskEnd;
            var countWeekends = 0;
            while (start < end) {
                var day = start.getDay();
                if (day === 6 || day == 0) {
                    countWeekends++;
                }
                start = new Date(start.getTime() + 24 * oneHour);
            }
            vTaskRight -= countWeekends * 24;
        }
        vTaskRightPx = Math.ceil((vTaskRight / 24) * (pColWidth + DAY_CELL_MARGIN_WIDTH) - 1);
    }
    else if (pFormat == 'week') {
        vTaskRightPx = Math.ceil((vTaskRight / (24 * 7)) * (pColWidth + WEEK_CELL_MARGIN_WIDTH) - 1);
    }
    else if (pFormat == 'month') {
        // let vMonthsDiff = (12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear())) + (curTaskEnd.getMonth() - curTaskStart.getMonth());
        var tmpTaskStart = moment.from(exports.toStandardDate(curTaskStart), 'en', 'YYYY-MM-DD').locale('fa').format('YYYY-MM-DD');
        var tmpTaskEnd = moment.from(exports.toStandardDate(curTaskEnd), 'en', 'YYYY-MM-DD').locale('fa').format('YYYY-MM-DD');
        var startTime = moment(tmpTaskStart, 'jYYYY/jMM/jDD');
        var endTime = moment(tmpTaskEnd, 'jYYYY/jMM/jDD');
        var vMonthsDiff = (12 * (endTime.year() - startTime.year())) + (endTime.month() - startTime.month());
        // vPosTmpDate = new Date(curTaskEnd.getTime());
        // vPosTmpDate.setDate(curTaskStart.getDate());
        // let vDaysCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (86400000);
        vPosTmpDate = moment(endTime);
        vPosTmpDate.date(startTime.date());
        // let vDaysCrctn = Math.abs( (vPosTmpDate.diff(endTime)) / (86400000));
        var vDaysCrctn = (endTime.diff(vPosTmpDate)) / (86400000);
        // vTaskRightPx = Math.ceil((vMonthsDiff * (pColWidth + MONTH_CELL_MARGIN_WIDTH)) + (vDaysCrctn * (pColWidth / vMonthDaysArr[curTaskEnd.getMonth()])) - 1);
        vTaskRightPx = Math.ceil((vMonthsDiff * (pColWidth + MONTH_CELL_MARGIN_WIDTH)) + (vDaysCrctn * (pColWidth / vMonthDaysArr[endTime.month()])) - 1);
    }
    else if (pFormat == 'quarter') {
        var vMonthsDiff = (12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear())) + (curTaskEnd.getMonth() - curTaskStart.getMonth());
        vPosTmpDate = new Date(curTaskEnd.getTime());
        vPosTmpDate.setDate(curTaskStart.getDate());
        var vDaysCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (86400000);
        vTaskRightPx = Math.ceil((vMonthsDiff * ((pColWidth + QUARTER_CELL_MARGIN_WIDTH) / 3)) + (vDaysCrctn * (pColWidth / 90)) - 1);
    }
    else if (pFormat == 'hour') {
        // can't just calculate sum because of daylight savings changes
        vPosTmpDate = new Date(curTaskEnd.getTime());
        vPosTmpDate.setMinutes(curTaskStart.getMinutes(), 0);
        var vMinsCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (3600000);
        vTaskRightPx = Math.ceil((vTaskRight * (pColWidth + HOUR_CELL_MARGIN_WIDTH)) + (vMinsCrctn * (pColWidth)));
    }
    return vTaskRightPx;
};
exports.isIE = function () {
    if (typeof document.all != 'undefined') {
        if ('pageXOffset' in window)
            return false; // give IE9 and above the benefit of the doubt!
        else
            return true;
    }
    else
        return false;
};
exports.hideToolTip = function (pGanttChartObj, pTool, pTimer) {
    if (pGanttChartObj.getUseFade()) {
        clearInterval(pTool.fadeInterval);
        pTool.fadeInterval = setInterval(function () { exports.fadeToolTip(-1, pTool, 0); }, pTimer);
    }
    else {
        pTool.style.opacity = 0;
        pTool.style.filter = 'alpha(opacity=0)';
        pTool.style.visibility = 'hidden';
        pTool.vToolCont.setAttribute("showing", null);
    }
};
exports.fadeToolTip = function (pDirection, pTool, pMaxAlpha) {
    var vIncrement = parseInt(pTool.getAttribute('fadeIncrement'));
    var vAlpha = pTool.getAttribute('currentOpacity');
    var vCurAlpha = parseInt(vAlpha);
    if ((vCurAlpha != pMaxAlpha && pDirection == 1) || (vCurAlpha != 0 && pDirection == -1)) {
        var i = vIncrement;
        if (pMaxAlpha - vCurAlpha < vIncrement && pDirection == 1) {
            i = pMaxAlpha - vCurAlpha;
        }
        else if (vAlpha < vIncrement && pDirection == -1) {
            i = vCurAlpha;
        }
        vAlpha = vCurAlpha + (i * pDirection);
        pTool.style.opacity = vAlpha * 0.01;
        pTool.style.filter = 'alpha(opacity=' + vAlpha + ')';
        pTool.setAttribute('currentOpacity', vAlpha);
    }
    else {
        clearInterval(pTool.fadeInterval);
        if (pDirection == -1) {
            pTool.style.opacity = 0;
            pTool.style.filter = 'alpha(opacity=0)';
            pTool.style.visibility = 'hidden';
            pTool.vToolCont.setAttribute("showing", null);
        }
    }
};
exports.hashString = function (key) {
    if (!key) {
        key = 'default';
    }
    key += '';
    var hash = 5381;
    for (var i = 0; i < key.length; i++) {
        if (key.charCodeAt) {
            // tslint:disable-next-line:no-bitwise
            hash = (hash << 5) + hash + key.charCodeAt(i);
        }
        // tslint:disable-next-line:no-bitwise
        hash = hash & hash;
    }
    // tslint:disable-next-line:no-bitwise
    return hash >>> 0;
};
exports.hashKey = function (key) {
    return this.hashString(key);
};
exports.criticalPath = function (tasks) {
    var path = {};
    // calculate duration
    tasks.forEach(function (task) {
        task.duration = new Date(task.pEnd).getTime() - new Date(task.pStart).getTime();
    });
    tasks.forEach(function (task) {
        if (!path[task.pID]) {
            path[task.pID] = task;
        }
        if (!path[task.pParent]) {
            path[task.pParent] = {
                childrens: []
            };
        }
        if (!path[task.pID].childrens) {
            path[task.pID].childrens = [];
        }
        path[task.pParent].childrens.push(task);
        var max = path[task.pParent].childrens[0].duration;
        path[task.pParent].childrens.forEach(function (t) {
            if (t.duration > max) {
                max = t.duration;
            }
        });
        path[task.pParent].duration = max;
    });
    var finalNodes = { 0: path[0] };
    var node = path[0];
    var _loop_1 = function () {
        if (node.childrens.length > 0) {
            var found_1 = node.childrens[0];
            var max_1 = found_1.duration;
            node.childrens.forEach(function (c) {
                if (c.duration > max_1) {
                    found_1 = c;
                    max_1 = c.duration;
                }
            });
            finalNodes[found_1.pID] = found_1;
            node = found_1;
        }
        else {
            node = null;
        }
    };
    while (node) {
        _loop_1();
    }
};
function isParentElementOrSelf(child, parent) {
    while (child) {
        if (child === parent)
            return true;
        child = child.parentElement;
    }
}
exports.isParentElementOrSelf = isParentElementOrSelf;
exports.updateFlyingObj = function (e, pGanttChartObj, pTimer) {
    var vCurTopBuf = 3;
    var vCurLeftBuf = 5;
    var vCurBotBuf = 3;
    var vCurRightBuf = 15;
    var vMouseX = (e) ? e.clientX : window.event.clientX;
    var vMouseY = (e) ? e.clientY : window.event.clientY;
    var vViewportX = document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    var vViewportY = document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    var vNewX = vMouseX;
    var vNewY = vMouseY;
    var screenX = screen.availWidth || window.innerWidth;
    var screenY = screen.availHeight || window.innerHeight;
    var vOldX = parseInt(pGanttChartObj.vTool.style.left);
    var vOldY = parseInt(pGanttChartObj.vTool.style.top);
    if (navigator.appName.toLowerCase() == 'microsoft internet explorer') {
        // the clientX and clientY properties include the left and top borders of the client area
        vMouseX -= document.documentElement.clientLeft;
        vMouseY -= document.documentElement.clientTop;
        var vZoomFactor = exports.getZoomFactor();
        if (vZoomFactor != 1) { // IE 7 at non-default zoom level
            vMouseX = Math.round(vMouseX / vZoomFactor);
            vMouseY = Math.round(vMouseY / vZoomFactor);
        }
    }
    var vScrollPos = exports.getScrollPositions();
    /* Code for positioned right of the mouse by default*/
    /*
    if (vMouseX+vCurRightBuf+pGanttChartObj.vTool.offsetWidth>vViewportX)
    {
        if (vMouseX-vCurLeftBuf-pGanttChartObj.vTool.offsetWidth<0) vNewX=vScrollPos.x;
        else vNewX=vMouseX+vScrollPos.x-vCurLeftBuf-pGanttChartObj.vTool.offsetWidth;
    }
    else vNewX=vMouseX+vScrollPos.x+vCurRightBuf;
    */
    /* Code for positioned left of the mouse by default */
    if (vMouseX - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth < 0) {
        if (vMouseX + vCurRightBuf + pGanttChartObj.vTool.offsetWidth > vViewportX)
            vNewX = vScrollPos.x;
        else
            vNewX = vMouseX + vScrollPos.x + vCurRightBuf;
    }
    else
        vNewX = vMouseX + vScrollPos.x - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth;
    /* Code for positioned below the mouse by default */
    if (vMouseY + vCurBotBuf + pGanttChartObj.vTool.offsetHeight > vViewportY) {
        if (vMouseY - vCurTopBuf - pGanttChartObj.vTool.offsetHeight < 0)
            vNewY = vScrollPos.y;
        else
            vNewY = vMouseY + vScrollPos.y - vCurTopBuf - pGanttChartObj.vTool.offsetHeight;
    }
    else
        vNewY = vMouseY + vScrollPos.y + vCurBotBuf;
    /* Code for positioned above the mouse by default */
    /*
    if (vMouseY-vCurTopBuf-pGanttChartObj.vTool.offsetHeight<0)
    {
        if (vMouseY+vCurBotBuf+pGanttChartObj.vTool.offsetHeight>vViewportY) vNewY=vScrollPos.y;
        else vNewY=vMouseY+vScrollPos.y+vCurBotBuf;
    }
    else vNewY=vMouseY+vScrollPos.y-vCurTopBuf-pGanttChartObj.vTool.offsetHeight;
    */
    var outViewport = Math.abs(vOldX - vNewX) > screenX || Math.abs(vOldY - vNewY) > screenY;
    if (pGanttChartObj.getUseMove() && !outViewport) {
        clearInterval(pGanttChartObj.vTool.moveInterval);
        pGanttChartObj.vTool.moveInterval = setInterval(function () { exports.moveToolTip(vNewX, vNewY, pGanttChartObj.vTool, pTimer); }, pTimer);
    }
    else {
        pGanttChartObj.vTool.style.left = vNewX + 'px';
        pGanttChartObj.vTool.style.top = vNewY + 'px';
    }
};
exports.moveToolTip = function (pNewX, pNewY, pTool, timer) {
    var vSpeed = parseInt(pTool.getAttribute('moveSpeed'));
    var vOldX = parseInt(pTool.style.left);
    var vOldY = parseInt(pTool.style.top);
    if (pTool.style.visibility != 'visible') {
        pTool.style.left = pNewX + 'px';
        pTool.style.top = pNewY + 'px';
        clearInterval(pTool.moveInterval);
    }
    else {
        if (pNewX != vOldX && pNewY != vOldY) {
            vOldX += Math.ceil((pNewX - vOldX) / vSpeed);
            vOldY += Math.ceil((pNewY - vOldY) / vSpeed);
            pTool.style.left = vOldX + 'px';
            pTool.style.top = vOldY + 'px';
        }
        else {
            clearInterval(pTool.moveInterval);
        }
    }
};
exports.makeRequest = function (pFile, json, vDebug) {
    if (json === void 0) { json = true; }
    if (vDebug === void 0) { vDebug = false; }
    if (window.fetch) {
        var f = fetch(pFile);
        if (json) {
            return f.then(function (res) { return res.json(); });
        }
        else {
            return f;
        }
    }
    else {
        return exports.makeRequestOldBrowsers(pFile, vDebug)
            .then(function (xhttp) {
            if (json) {
                var jsonObj = JSON.parse(xhttp.response);
                return jsonObj;
            }
            else {
                var xmlDoc = xhttp.responseXML;
                return xmlDoc;
            }
        });
    }
};
exports.makeRequestOldBrowsers = function (pFile, vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    return new Promise(function (resolve, reject) {
        var bd;
        if (vDebug) {
            bd = new Date();
            console.info('before jsonparse', bd);
        }
        var xhttp;
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        }
        else { // IE 5/6
            xhttp = new window.ActiveXObject('Microsoft.XMLHTTP');
        }
        xhttp.open('GET', pFile, true);
        xhttp.send(null);
        xhttp.onload = function (e) {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    // resolve(xhttp.responseText);
                }
                else {
                    console.error(xhttp.statusText);
                }
                if (vDebug) {
                    bd = new Date();
                    console.info('before jsonparse', bd);
                }
                resolve(xhttp);
            }
        };
        xhttp.onerror = function (e) {
            reject(xhttp.statusText);
        };
    });
};
exports.calculateStartEndFromDepend = function (tasksList) {
};
exports.printChart = function (width, height, css) {
    if (css === void 0) { css = undefined; }
    if (css === undefined) {
        css = // Default injected CSS
            "@media print {\n        @page {\n          size: " + width + "mm " + height + "mm;\n        }\n        /* set gantt container to the same width as the page */\n        .gchartcontainer {\n            width: " + width + "mm;\n        }\n    };";
    }
    var $container = document.querySelector('.gchartcontainer');
    $container.insertAdjacentHTML('afterbegin', "<style>" + css + "</style>");
    // Remove the print CSS when the print dialog is closed
    window.addEventListener('afterprint', function () {
        $container.removeChild($container.children[0]);
    }, { 'once': true });
    // Trigger the print
    window.print();
};

},{"jalali-moment":15}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXMLTask = exports.getXMLProject = exports.AddXMLTask = exports.getXMLNodeValue = exports.findXMLNode = exports.parseXMLString = exports.parseXML = void 0;
var task_1 = require("./task");
var date_utils_1 = require("./utils/date_utils");
var draw_utils_1 = require("./utils/draw_utils");
var general_utils_1 = require("./utils/general_utils");
exports.parseXML = function (pFile, pGanttVar) {
    return general_utils_1.makeRequest(pFile, false, false)
        .then(function (xmlDoc) {
        exports.AddXMLTask(pGanttVar, xmlDoc);
    });
};
exports.parseXMLString = function (pStr, pGanttVar) {
    var xmlDoc;
    if (typeof window.DOMParser != 'undefined') {
        xmlDoc = (new window.DOMParser()).parseFromString(pStr, 'text/xml');
    }
    else if (typeof window.ActiveXObject != 'undefined' &&
        new window.ActiveXObject('Microsoft.XMLDOM')) {
        xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async = 'false';
        xmlDoc.loadXML(pStr);
    }
    exports.AddXMLTask(pGanttVar, xmlDoc);
};
exports.findXMLNode = function (pRoot, pNodeName) {
    var vRetValue;
    try {
        vRetValue = pRoot.getElementsByTagName(pNodeName);
    }
    catch (error) {
        ;
    } // do nothing, we'll return undefined
    return vRetValue;
};
// pType can be 1=numeric, 2=String, all other values just return raw data
exports.getXMLNodeValue = function (pRoot, pNodeName, pType, pDefault) {
    var vRetValue;
    try {
        vRetValue = pRoot.getElementsByTagName(pNodeName)[0].childNodes[0].nodeValue;
    }
    catch (error) {
        if (typeof pDefault != 'undefined')
            vRetValue = pDefault;
    }
    if (typeof vRetValue != 'undefined' && vRetValue != null) {
        if (pType == 1)
            vRetValue *= 1;
        else if (pType == 2)
            vRetValue = vRetValue.toString();
    }
    return vRetValue;
};
exports.AddXMLTask = function (pGanttVar, pXmlDoc) {
    var project = '';
    var Task;
    var n = 0;
    var m = 0;
    var i = 0;
    var j = 0;
    var k = 0;
    var maxPID = 0;
    var ass = new Array();
    var assRes = new Array();
    var res = new Array();
    var pars = new Array();
    var projNode = exports.findXMLNode(pXmlDoc, 'Project');
    if (typeof projNode != 'undefined' && projNode.length > 0) {
        project = projNode[0].getAttribute('xmlns');
    }
    if (project == 'http://schemas.microsoft.com/project') {
        pGanttVar.setDateInputFormat('yyyy-mm-dd');
        Task = exports.findXMLNode(pXmlDoc, 'Task');
        if (typeof Task == 'undefined')
            n = 0;
        else
            n = Task.length;
        var resources = exports.findXMLNode(pXmlDoc, 'Resource');
        if (typeof resources == 'undefined') {
            n = 0;
            m = 0;
        }
        else
            m = resources.length;
        for (i = 0; i < m; i++) {
            var resname = exports.getXMLNodeValue(resources[i], 'Name', 2, '');
            var uid = exports.getXMLNodeValue(resources[i], 'UID', 1, -1);
            if (resname.length > 0 && uid > 0)
                res[uid] = resname;
        }
        var assignments = exports.findXMLNode(pXmlDoc, 'Assignment');
        if (typeof assignments == 'undefined')
            j = 0;
        else
            j = assignments.length;
        for (i = 0; i < j; i++) {
            var uid = void 0;
            var resUID = exports.getXMLNodeValue(assignments[i], 'ResourceUID', 1, -1);
            uid = exports.getXMLNodeValue(assignments[i], 'TaskUID', 1, -1);
            if (uid > 0) {
                if (resUID > 0)
                    assRes[uid] = res[resUID];
                ass[uid] = assignments[i];
            }
        }
        // Store information about parent UIDs in an easily searchable form
        for (i = 0; i < n; i++) {
            var uid = void 0;
            uid = exports.getXMLNodeValue(Task[i], 'UID', 1, 0);
            var vOutlineNumber = void 0;
            if (uid != 0)
                vOutlineNumber = exports.getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
            if (uid > 0)
                pars[vOutlineNumber] = uid;
            if (uid > maxPID)
                maxPID = uid;
        }
        for (i = 0; i < n; i++) {
            // optional parameters may not have an entry
            // Task ID must NOT be zero otherwise it will be skipped
            var pID = exports.getXMLNodeValue(Task[i], 'UID', 1, 0);
            if (pID != 0) {
                var pName = exports.getXMLNodeValue(Task[i], 'Name', 2, 'No Task Name');
                var pStart = exports.getXMLNodeValue(Task[i], 'Start', 2, '');
                var pEnd = exports.getXMLNodeValue(Task[i], 'Finish', 2, '');
                var pPlanStart = exports.getXMLNodeValue(Task[i], 'PlanStart', 2, '');
                var pPlanEnd = exports.getXMLNodeValue(Task[i], 'PlanFinish', 2, '');
                var pDuration = exports.getXMLNodeValue(Task[i], 'Duration', 2, '');
                var pLink = exports.getXMLNodeValue(Task[i], 'HyperlinkAddress', 2, '');
                var pMile = exports.getXMLNodeValue(Task[i], 'Milestone', 1, 0);
                var pComp = exports.getXMLNodeValue(Task[i], 'PercentWorkComplete', 1, 0);
                var pCost = exports.getXMLNodeValue(Task[i], 'Cost', 2, 0);
                var pGroup = exports.getXMLNodeValue(Task[i], 'Summary', 1, 0);
                var pParent = 0;
                var vOutlineLevel = exports.getXMLNodeValue(Task[i], 'OutlineLevel', 1, 0);
                var vOutlineNumber = void 0;
                if (vOutlineLevel > 1) {
                    vOutlineNumber = exports.getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
                    pParent = pars[vOutlineNumber.substr(0, vOutlineNumber.lastIndexOf('.'))];
                }
                var pNotes = void 0;
                try {
                    pNotes = Task[i].getElementsByTagName('Notes')[0].childNodes[1].nodeValue; //this should be a CDATA node
                }
                catch (error) {
                    pNotes = '';
                }
                var pRes = void 0;
                if (typeof assRes[pID] != 'undefined')
                    pRes = assRes[pID];
                else
                    pRes = '';
                var predecessors = exports.findXMLNode(Task[i], 'PredecessorLink');
                if (typeof predecessors == 'undefined')
                    j = 0;
                else
                    j = predecessors.length;
                var pDepend = '';
                for (k = 0; k < j; k++) {
                    var depUID = exports.getXMLNodeValue(predecessors[k], 'PredecessorUID', 1, -1);
                    var depType = exports.getXMLNodeValue(predecessors[k], 'Type', 1, 1);
                    if (depUID > 0) {
                        if (pDepend.length > 0)
                            pDepend += ',';
                        switch (depType) {
                            case 0:
                                pDepend += depUID + 'FF';
                                break;
                            case 1:
                                pDepend += depUID + 'FS';
                                break;
                            case 2:
                                pDepend += depUID + 'SF';
                                break;
                            case 3:
                                pDepend += depUID + 'SS';
                                break;
                            default:
                                pDepend += depUID + 'FS';
                                break;
                        }
                    }
                }
                var pOpen = 1;
                var pCaption = '';
                var pClass = void 0;
                if (pGroup > 0)
                    pClass = 'ggroupblack';
                else if (pMile > 0)
                    pClass = 'gmilestone';
                else
                    pClass = 'gtaskblue';
                // check for split tasks
                var splits = exports.findXMLNode(ass[pID], 'TimephasedData');
                if (typeof splits == 'undefined')
                    j = 0;
                else
                    j = splits.length;
                var vSplitStart = pStart;
                var vSplitEnd = pEnd;
                var vSubCreated = false;
                var vDepend = pDepend.replace(/,*[0-9]+[FS]F/g, '');
                for (k = 0; k < j; k++) {
                    var vDuration = exports.getXMLNodeValue(splits[k], 'Value', 2, '0');
                    //remove all text
                    vDuration = '0' + vDuration.replace(/\D/g, '');
                    vDuration *= 1;
                    if ((vDuration == 0 && !vSubCreated) || (k + 1 == j && pGroup == 2)) {
                        // No time booked in the given period (or last entry)
                        // Make sure the parent task is set as a combined group
                        pGroup = 2;
                        // Handle last loop
                        if (k + 1 == j)
                            vDepend = pDepend.replace(/,*[0-9]+[FS]S/g, '');
                        // Now create a subtask
                        maxPID++;
                        vSplitEnd = exports.getXMLNodeValue(splits[k], (k + 1 == j) ? 'Finish' : 'Start', 2, '');
                        pGanttVar.AddTaskItem(new task_1.TaskItem(maxPID, pName, vSplitStart, vSplitEnd, 'gtaskblue', pLink, pMile, pRes, pComp, 0, pID, pOpen, vDepend, pCaption, pNotes, pGanttVar, pCost, pPlanStart, pPlanEnd, pDuration));
                        vSubCreated = true;
                        vDepend = '';
                    }
                    else if (vDuration != 0 && vSubCreated) {
                        vSplitStart = exports.getXMLNodeValue(splits[k], 'Start', 2, '');
                        vSubCreated = false;
                    }
                }
                if (vSubCreated)
                    pDepend = '';
                // Finally add the task
                pGanttVar.AddTaskItem(new task_1.TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGanttVar, pCost, pPlanStart, pPlanEnd, pDuration, undefined, undefined, pClass));
            }
        }
    }
    else {
        Task = pXmlDoc.getElementsByTagName('task');
        n = Task.length;
        for (i = 0; i < n; i++) {
            // optional parameters may not have an entry
            // Task ID must NOT be zero otherwise it will be skipped
            var pID = exports.getXMLNodeValue(Task[i], 'pID', 1, 0);
            if (pID != 0) {
                var pName = exports.getXMLNodeValue(Task[i], 'pName', 2, 'No Task Name');
                var pStart = exports.getXMLNodeValue(Task[i], 'pStart', 2, '');
                var pEnd = exports.getXMLNodeValue(Task[i], 'pEnd', 2, '');
                var pPlanStart = exports.getXMLNodeValue(Task[i], 'pPlanStart', 2, '');
                var pPlanEnd = exports.getXMLNodeValue(Task[i], 'pPlanEnd', 2, '');
                var pDuration = exports.getXMLNodeValue(Task[i], 'pDuration', 2, '');
                var pLink = exports.getXMLNodeValue(Task[i], 'pLink', 2, '');
                var pMile = exports.getXMLNodeValue(Task[i], 'pMile', 1, 0);
                var pComp = exports.getXMLNodeValue(Task[i], 'pComp', 1, 0);
                var pCost = exports.getXMLNodeValue(Task[i], 'pCost', 2, 0);
                var pGroup = exports.getXMLNodeValue(Task[i], 'pGroup', 1, 0);
                var pParent = exports.getXMLNodeValue(Task[i], 'pParent', 1, 0);
                var pRes = exports.getXMLNodeValue(Task[i], 'pRes', 2, '');
                var pOpen = exports.getXMLNodeValue(Task[i], 'pOpen', 1, 1);
                var pDepend = exports.getXMLNodeValue(Task[i], 'pDepend', 2, '');
                var pCaption = exports.getXMLNodeValue(Task[i], 'pCaption', 2, '');
                var pNotes = exports.getXMLNodeValue(Task[i], 'pNotes', 2, '');
                var pClass = exports.getXMLNodeValue(Task[i], 'pClass', 2, '');
                var pPlanClass = exports.getXMLNodeValue(Task[i], 'pPlanClass', 2, '');
                if (typeof pClass == 'undefined') {
                    if (pGroup > 0)
                        pClass = 'ggroupblack';
                    else if (pMile > 0)
                        pClass = 'gmilestone';
                    else
                        pClass = 'gtaskblue';
                }
                if (typeof pPlanClass == 'undefined')
                    pPlanClass = pClass;
                // Finally add the task
                pGanttVar.AddTaskItem(new task_1.TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGanttVar, pCost, pPlanStart, pPlanEnd, pDuration, undefined, undefined, pPlanClass));
            }
        }
    }
};
exports.getXMLProject = function () {
    var vProject = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
    for (var i = 0; i < this.vTaskList.length; i++) {
        vProject += this.getXMLTask(i, true);
    }
    vProject += '</project>';
    return vProject;
};
exports.getXMLTask = function (pID, pIdx) {
    var i = 0;
    var vIdx = -1;
    var vTask = '';
    var vOutFrmt = date_utils_1.parseDateFormatStr(this.getDateInputFormat() + ' HH:MI:SS');
    if (pIdx === true)
        vIdx = pID;
    else {
        for (i = 0; i < this.vTaskList.length; i++) {
            if (this.vTaskList[i].getID() == pID) {
                vIdx = i;
                break;
            }
        }
    }
    if (vIdx >= 0 && vIdx < this.vTaskList.length) {
        /* Simplest way to return case sensitive node names is to just build a string */
        vTask = '<task>';
        vTask += '<pID>' + this.vTaskList[vIdx].getID() + '</pID>';
        vTask += '<pName>' + this.vTaskList[vIdx].getName() + '</pName>';
        vTask += '<pStart>' + date_utils_1.formatDateStr(this.vTaskList[vIdx].getStart(), vOutFrmt, this.vLangs[this.vLang]) + '</pStart>';
        vTask += '<pEnd>' + date_utils_1.formatDateStr(this.vTaskList[vIdx].getEnd(), vOutFrmt, this.vLangs[this.vLang]) + '</pEnd>';
        vTask += '<pPlanStart>' + date_utils_1.formatDateStr(this.vTaskList[vIdx].getPlanStart(), vOutFrmt, this.vLangs[this.vLang]) + '</pPlanStart>';
        vTask += '<pPlanEnd>' + date_utils_1.formatDateStr(this.vTaskList[vIdx].getPlanEnd(), vOutFrmt, this.vLangs[this.vLang]) + '</pPlanEnd>';
        vTask += '<pDuration>' + this.vTaskList[vIdx].getDuration() + '</pDuration>';
        vTask += '<pClass>' + this.vTaskList[vIdx].getClass() + '</pClass>';
        vTask += '<pLink>' + this.vTaskList[vIdx].getLink() + '</pLink>';
        vTask += '<pMile>' + this.vTaskList[vIdx].getMile() + '</pMile>';
        if (this.vTaskList[vIdx].getResource() != '\u00A0')
            vTask += '<pRes>' + this.vTaskList[vIdx].getResource() + '</pRes>';
        vTask += '<pComp>' + this.vTaskList[vIdx].getCompVal() + '</pComp>';
        vTask += '<pCost>' + this.vTaskList[vIdx].getCost() + '</pCost>';
        vTask += '<pGroup>' + this.vTaskList[vIdx].getGroup() + '</pGroup>';
        vTask += '<pParent>' + this.vTaskList[vIdx].getParent() + '</pParent>';
        vTask += '<pOpen>' + this.vTaskList[vIdx].getOpen() + '</pOpen>';
        vTask += '<pDepend>';
        var vDepList = this.vTaskList[vIdx].getDepend();
        for (i = 0; i < vDepList.length; i++) {
            if (i > 0)
                vTask += ',';
            if (vDepList[i] > 0)
                vTask += vDepList[i] + this.vTaskList[vIdx].getDepType()[i];
        }
        vTask += '</pDepend>';
        vTask += '<pCaption>' + this.vTaskList[vIdx].getCaption() + '</pCaption>';
        var vTmpFrag = document.createDocumentFragment();
        var vTmpDiv = draw_utils_1.newNode(vTmpFrag, 'div', null, null, this.vTaskList[vIdx].getNotes().innerHTML);
        vTask += '<pNotes>' + vTmpDiv.innerHTML + '</pNotes>';
        vTask += '<pPlanClass>' + this.vTaskList[vIdx].getPlanClass() + '</pPlanClass>';
        vTask += '</task>';
    }
    return vTask;
};

},{"./task":10,"./utils/date_utils":11,"./utils/draw_utils":12,"./utils/general_utils":13}],15:[function(require,module,exports){

module.exports = jMoment;

var moment = require("moment/moment");
require("moment/locale/fa");

/************************************
 Constants
 ************************************/

var formattingTokens = /(\[[^\[]*\])|(\\)?j(Mo|MM?M?M?|Do|DDDo|DD?D?D?|w[o|w]?|YYYYY|YYYY|YY|gg(ggg?)?|)|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g
    , localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g
    , parseTokenOneOrTwoDigits = /\d\d?/
    , parseTokenOneToThreeDigits = /\d{1,3}/
    , parseTokenThreeDigits = /\d{3}/
    , parseTokenFourDigits = /\d{1,4}/
    , parseTokenSixDigits = /[+\-]?\d{1,6}/
    , parseTokenWord = /[0-9]*["a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i
    , parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i
    , parseTokenT = /T/i
    , parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/

    , unitAliases = {
        jm: "jmonth"
        , jmonths: "jmonth"
        , jy: "jyear"
        , jyears: "jyear"
    }

    , formatFunctions = {}

    , ordinalizeTokens = "DDD w M D".split(" ")
    , paddedTokens = "M D w".split(" ");

var CalendarSystems = {
    Jalali: 1,
    Gregorian: 2,
}
var formatTokenFunctions = {
    jM: function () {
        return this.jMonth() + 1;
    },
    jMMM: function (format) {
        return this.localeData().jMonthsShort(this, format);
    },
    jMMMM: function (format) {
        return this.localeData().jMonths(this, format);
    },
    jD: function () {
        return this.jDate();
    },
    jDDD: function () {
        return this.jDayOfYear();
    },
    jw: function () {
        return this.jWeek();
    },
    jYY: function () {
        return leftZeroFill(this.jYear() % 100, 2);
    },
    jYYYY: function () {
        return leftZeroFill(this.jYear(), 4);
    },
    jYYYYY: function () {
        return leftZeroFill(this.jYear(), 5);
    },
    jgg: function () {
        return leftZeroFill(this.jWeekYear() % 100, 2);
    },
    jgggg: function () {
        return this.jWeekYear();
    },
    jggggg: function () {
        return leftZeroFill(this.jWeekYear(), 5);
    }
};

function padToken(func, count) {
    return function (a) {
        return leftZeroFill(func.call(this, a), count);
    };
}
function ordinalizeToken(func, period) {
    return function (a) {
        return this.localeData().ordinal(func.call(this, a), period);
    };
}

(function () {
    var i;
    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions["j" + i + "o"] = ordinalizeToken(formatTokenFunctions["j" + i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions["j" + i + i] = padToken(formatTokenFunctions["j" + i], 2);
    }
    formatTokenFunctions.jDDDD = padToken(formatTokenFunctions.jDDD, 3);
}());

/************************************
 Helpers
 ************************************/

function extend(a, b) {
    var key;
    for (key in b)
        if (b.hasOwnProperty(key)){
            a[key] = b[key];
        }
    return a;
}

/**
 * return a string which length is as much as you need
 * @param {number} number input
 * @param {number} targetLength expected length
 * @example leftZeroFill(5,2) => 05
 **/
function leftZeroFill(number, targetLength) {
    var output = number + "";
    while (output.length < targetLength){
        output = "0" + output;
    }
    return output;
}

/**
 * determine object is array or not
 * @param input
 **/
function isArray(input) {
    return Object.prototype.toString.call(input) === "[object Array]";
}

/**
 * Changes any moment Gregorian format to Jalali system format
 * @param {string} format
 * @example toJalaliFormat("YYYY/MMM/DD") => "jYYYY/jMMM/jDD"
 **/
function toJalaliFormat(format) {
    for (var i = 0; i < format.length; i++) {
        if(!i || (format[i-1] !== "j" && format[i-1] !== format[i])) {
            if (format[i] === "Y" || format[i] === "M" || format[i] === "D" || format[i] === "g") {
                format = format.slice(0, i) + "j" + format.slice(i);
            }
        }
    }
    return format;
}

/**
 * Changes any moment Gregorian units to Jalali system units
 * @param {string} units
 * @example toJalaliUnit("YYYY/MMM/DD") => "jYYYY/jMMM/jDD"
 **/
function toJalaliUnit(units) {
    switch (units) {
        case "week" : return "jWeek";
        case "year" : return "jYear";
        case "month" : return "jMonth";
        case "months" : return "jMonths";
        case "monthName" : return "jMonthsShort";
        case "monthsShort" : return "jMonthsShort";
    }
    return units;
}

/**
 * normalize units to be comparable
 * @param {string} units
 **/
function normalizeUnits(units, momentObj) {
    if (isJalali(momentObj)) {
        units = toJalaliUnit(units);
    }
     if (units) {
        var lowered = units.toLowerCase();
        if (lowered.startsWith('j')) units = unitAliases[lowered] || lowered;
        // TODO : add unit test
        if (units === "jday") units = "day";
        else if (units === "jd") units = "d";
    }
    return units;
}

/**
 * set a gregorian date to moment object
 * @param {string} momentInstance
 * @param {string} year in gregorian system
 * @param {string} month in gregorian system
 * @param {string} day in gregorian system
 **/
function setDate(momentInstance, year, month, day) {
    var d = momentInstance._d;
    if (momentInstance._isUTC) {
        /*eslint-disable new-cap*/
        momentInstance._d = new Date(Date.UTC(year, month, day,
            d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()));
        /*eslint-enable new-cap*/
    } else {
        momentInstance._d = new Date(year, month, day,
            d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    }
}

function objectCreate(parent) {
    function F() {}
    F.prototype = parent;
    return new F();
}

function getPrototypeOf(object) {
    if (Object.getPrototypeOf){
        return Object.getPrototypeOf(object);
    }
    else if ("".__proto__){
        return object.__proto__;
    }
    else{
        return object.constructor.prototype;
    }
}

/************************************
 Languages
 ************************************/
extend(getPrototypeOf(moment.localeData()),
    { _jMonths: [ "Farvardin"
        , "Ordibehesht"
        , "Khordaad"
        , "Tir"
        , "Mordaad"
        , "Shahrivar"
        , "Mehr"
        , "Aabaan"
        , "Aazar"
        , "Dey"
        , "Bahman"
        , "Esfand"
    ]
        , jMonths: function (m) {
            if (m) {
                return this._jMonths[m.jMonth()];
            } else {
                return this._jMonths;
            }
    }

        , _jMonthsShort:  [ "Far"
        , "Ord"
        , "Kho"
        , "Tir"
        , "Amo"
        , "Sha"
        , "Meh"
        , "Aab"
        , "Aaz"
        , "Dey"
        , "Bah"
        , "Esf"
    ]
        , jMonthsShort: function (m) {
        if (m) {
            return this._jMonthsShort[m.jMonth()];
        } else {
            return this._jMonthsShort;
        }
    }

        , jMonthsParse: function (monthName) {
        var i
            , mom
            , regex;
        if (!this._jMonthsParse){
            this._jMonthsParse = [];
        }
        for (i = 0; i < 12; i += 1) {
            // Make the regex if we don"t have it already.
            if (!this._jMonthsParse[i]) {
                mom = jMoment([2000, (2 + i) % 12, 25]);
                regex = "^" + this.jMonths(mom, "") + "|^" + this.jMonthsShort(mom, "");
                this._jMonthsParse[i] = new RegExp(regex.replace(".", ""), "i");
            }
            // Test the regex.
            if (this._jMonthsParse[i].test(monthName)){
                return i;
            }
        }
    }
    }
);

/************************************
 Formatting
 ************************************/

function makeFormatFunction(format) {
    var array = format.match(formattingTokens)
        , length = array.length
        , i;

    for (i = 0; i < length; i += 1){
        if (formatTokenFunctions[array[i]]){
            array[i] = formatTokenFunctions[array[i]];
        }
    }
    return function (mom) {
        var output = "";
        for (i = 0; i < length; i += 1){
            output += array[i] instanceof Function ? "[" + array[i].call(mom, format) + "]" : array[i];
        }
        return output;
    };
}

/************************************
 Parsing
 ************************************/

function getParseRegexForToken(token, config) {
    switch (token) {
        case "jDDDD":
            return parseTokenThreeDigits;
        case "jYYYY":
            return parseTokenFourDigits;
        case "jYYYYY":
            return parseTokenSixDigits;
        case "jDDD":
            return parseTokenOneToThreeDigits;
        case "jMMM":
        case "jMMMM":
            return parseTokenWord;
        case "jMM":
        case "jDD":
        case "jYY":
        case "jM":
        case "jD":
            return parseTokenOneOrTwoDigits;
        case "DDDD":
            return parseTokenThreeDigits;
        case "YYYY":
            return parseTokenFourDigits;
        case "YYYYY":
            return parseTokenSixDigits;
        case "S":
        case "SS":
        case "SSS":
        case "DDD":
            return parseTokenOneToThreeDigits;
        case "MMM":
        case "MMMM":
        case "dd":
        case "ddd":
        case "dddd":
            return parseTokenWord;
        case "a":
        case "A":
            return moment.localeData(config._l)._meridiemParse;
        case "X":
            return parseTokenTimestampMs;
        case "Z":
        case "ZZ":
            return parseTokenTimezone;
        case "T":
            return parseTokenT;
        case "MM":
        case "DD":
        case "YY":
        case "HH":
        case "hh":
        case "mm":
        case "ss":
        case "M":
        case "D":
        case "d":
        case "H":
        case "h":
        case "m":
        case "s":
            return parseTokenOneOrTwoDigits;
        default:
            return new RegExp(token.replace("\\", ""));
    }
}
function isNull(variable) {
    return variable === null || variable === undefined;
}
function addTimeToArrayFromToken(token, input, config) {
    var a
        , datePartArray = config._a;

    switch (token) {
        case "jM":
        case "jMM":
            datePartArray[1] = isNull(input)? 0 : ~~input - 1;
            break;
        case "jMMM":
        case "jMMMM":
            a = moment.localeData(config._l).jMonthsParse(input);
            if (!isNull(a)){
                datePartArray[1] = a;
            }
            else{
                config._isValid = false;
            }
            break;
        case "jD":
        case "jDD":
        case "jDDD":
        case "jDDDD":
            if (!isNull(input)){
                datePartArray[2] = ~~input;
            }
            break;
        case "jYY":
            datePartArray[0] = ~~input + (~~input > 47 ? 1300 : 1400);
            break;
        case "jYYYY":
        case "jYYYYY":
            datePartArray[0] = ~~input;
    }
    if (isNull(input)) {
        config._isValid = false;
    }
}

function dateFromArray(config) {
    var g
        , j
        , jy = config._a[0]
        , jm = config._a[1]
        , jd = config._a[2];

    if (isNull(jy) && isNull(jm) && isNull(jd)){
        return;
    }
    jy = !isNull(jy) ? jy : 0;
    jm = !isNull(jm) ? jm : 0;
    jd = !isNull(jd) ? jd : 1;
    if (jd < 1 || jd > jMoment.jDaysInMonth(jy, jm) || jm < 0 || jm > 11){
        config._isValid = false;
    }
    g = toGregorian(jy, jm, jd);
    j = toJalali(g.gy, g.gm, g.gd);
    config._jDiff = 0;
    if (~~j.jy !== jy){
        config._jDiff += 1;
    }
    if (~~j.jm !== jm){
        config._jDiff += 1;
    }
    if (~~j.jd !== jd){
        config._jDiff += 1;
    }
    return [g.gy, g.gm, g.gd];
}

function makeDateFromStringAndFormat(config) {
    var tokens = config._f.match(formattingTokens)
        , string = config._i + ""
        , len = tokens.length
        , i
        , token
        , parsedInput;

    config._a = [];

    for (i = 0; i < len; i += 1) {
        token = tokens[i];
        parsedInput = (getParseRegexForToken(token, config).exec(string) || [])[0];
        if (parsedInput){
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
        }
        if (formatTokenFunctions[token]){
            addTimeToArrayFromToken(token, parsedInput, config);
        }
    }
    if (string){
        config._il = string;
    }
    return dateFromArray(config);
}

function makeDateFromStringAndArray(config, utc) {
    var len = config._f.length
        , i
        , format
        , tempMoment
        , bestMoment
        , currentScore
        , scoreToBeat;

    if (len === 0) {
        return makeMoment(new Date(NaN));
    }

    for (i = 0; i < len; i += 1) {
        format = config._f[i];
        currentScore = 0;
        tempMoment = makeMoment(config._i, format, config._l, config._strict, utc);

        if (!tempMoment.isValid()){
            continue;
        }

        // currentScore = compareArrays(tempMoment._a, tempMoment.toArray())
        currentScore += tempMoment._jDiff;
        if (tempMoment._il){
            currentScore += tempMoment._il.length;
        }
        if (isNull(scoreToBeat) || currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempMoment;
        }
    }

    return bestMoment;
}

function removeParsedTokens(config) {
    var string = config._i + ""
        , input = ""
        , format = ""
        , array = config._f.match(formattingTokens)
        , len = array.length
        , i
        , match
        , parsed;

    for (i = 0; i < len; i += 1) {
        match = array[i];
        parsed = (getParseRegexForToken(match, config).exec(string) || [])[0];
        if (parsed){
            string = string.slice(string.indexOf(parsed) + parsed.length);
        }
        if (!(formatTokenFunctions[match] instanceof Function)) {
            format += match;
            if (parsed){
                input += parsed;
            }
        }
    }
    config._i = input;
    config._f = format;
}

/************************************
 Week of Year
 ************************************/

function jWeekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
    var end = firstDayOfWeekOfYear - firstDayOfWeek
        , daysToDayOfWeek = firstDayOfWeekOfYear - mom.day()
        , adjustedMoment;

    if (daysToDayOfWeek > end) {
        daysToDayOfWeek -= 7;
    }
    if (daysToDayOfWeek < end - 7) {
        daysToDayOfWeek += 7;
    }
    adjustedMoment = jMoment(mom).add(daysToDayOfWeek, "d");
    return  { week: Math.ceil(adjustedMoment.jDayOfYear() / 7)
        , year: adjustedMoment.jYear()
    };
}

/************************************
 Top Level Functions
 ************************************/
function isJalali (momentObj) {
    return momentObj &&
        (momentObj.calSystem === CalendarSystems.Jalali) ||
        (moment.justUseJalali && momentObj.calSystem !== CalendarSystems.Gregorian);
}
function isInputJalali(format, momentObj, input) {
    return (moment.justUseJalali || (momentObj && momentObj.calSystem === CalendarSystems.Jalali))
}
function makeMoment(input, format, lang, strict, utc) {
    if (typeof lang === "boolean") {
        utc = utc || strict;
        strict = lang;
        lang = undefined;
    }
    if (moment.ISO_8601 === format) {
        format = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
    }
    const inputIsJalali = isInputJalali(format, this, input);
    // var itsJalaliDate = (isJalali(this));
    if(input && (typeof input === "string") && !format && inputIsJalali && !moment.useGregorianParser) {
        input = input.replace(/\//g,"-");
        if(/\d{4}\-\d{2}\-\d{2}/.test(input)) {
            format = "jYYYY-jMM-jDD";
        } else if (/\d{4}\-\d{2}\-\d{1}/.test(input)) {
            format = "jYYYY-jMM-jD";
        } else if (/\d{4}\-\d{1}\-\d{1}/.test(input)) {
            format = "jYYYY-jM-jD";
        } else if (/\d{4}\-\d{1}\-\d{2}/.test(input)) {
            format = "jYYYY-jM-jDD";
        } else if (/\d{4}\-W\d{2}\-\d{2}/.test(input)) {
            format = "jYYYY-jW-jDD";
        } else if (/\d{4}\-\d{3}/.test(input)) {
            format = "jYYYY-jDDD";
        } else if (/\d{8}/.test(input)) {
            format = "jYYYYjMMjDD";
        } else if (/\d{4}W\d{2}\d{1}/.test(input)) {
            format = "jYYYYjWWjD";
        } else if (/\d{4}W\d{2}/.test(input)) {
            format = "jYYYYjWW";
        } else if (/\d{4}\d{3}/.test(input)) {
            format = "jYYYYjDDD";
        }
    }
    if (format && inputIsJalali){
        format = toJalaliFormat(format);
    }
    if (format && typeof format === "string"){
        format = fixFormat(format, moment);
    }

    var config =
        { _i: input
            , _f: format
            , _l: lang
            , _strict: strict
            , _isUTC: utc
        }
        , date
        , m
        , jm
        , origInput = input
        , origFormat = format;
    if (format) {
        if (isArray(format)) {
            return makeDateFromStringAndArray(config, utc);
        } else {
            date = makeDateFromStringAndFormat(config);
            removeParsedTokens(config);
            if (date) {
                format = "YYYY-MM-DD-" + config._f;
                input = leftZeroFill(date[0], 4) + "-"
                    + leftZeroFill(date[1] + 1, 2) + "-"
                    + leftZeroFill(date[2], 2) + "-"
                    + config._i;
            }
        }
    }
    if (utc){
        m = moment.utc(input, format, lang, strict);
    }
    else{
        m = moment(input, format, lang, strict);
    }
    if (config._isValid === false || (input && input._isAMomentObject && !input._isValid)){
        m._isValid = false;
    }
    m._jDiff = config._jDiff || 0;
    jm = objectCreate(jMoment.fn);
    extend(jm, m);
    if (strict && jm.isValid()) {
        jm._isValid = jm.format(origFormat) === origInput;
    }
    if (input && input.calSystem) {
        jm.calSystem = input.calSystem;
    }
    return jm;
}

function jMoment(input, format, lang, strict) {
    return makeMoment(input, format, lang, strict, false);
}

extend(jMoment, moment);
jMoment.fn = objectCreate(moment.fn);

jMoment.utc = function (input, format, lang, strict) {
    return makeMoment(input, format, lang, strict, true);
};

jMoment.unix = function (input) {
    return makeMoment(input * 1000);
};

/************************************
 jMoment Prototype
 ************************************/

function fixFormat(format, _moment) {
    var i = 5;
    var replace = function (input) {
        return _moment.localeData().longDateFormat(input) || input;
    };
    while (i > 0 && localFormattingTokens.test(format)) {
        i -= 1;
        format = format.replace(localFormattingTokens, replace);
    }
    return format;
}

jMoment.fn.format = function (format) {
	format = format || jMoment.defaultFormat;
    if (format) {
        if (isJalali(this)) {
            format = toJalaliFormat(format);
        }
        format = fixFormat(format, this);

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }
        format = formatFunctions[format](this);
    }
    var formatted = moment.fn.format.call(this, format);
    return formatted;
};

jMoment.fn.year = function (input) {
    if (isJalali(this)) return jMoment.fn.jYear.call(this,input);
    else return moment.fn.year.call(this, input);
};
jMoment.fn.jYear = function (input) {
    var lastDay
        , j
        , g;
    if (typeof input === "number") {
        j = getJalaliOf(this);
        lastDay = Math.min(j.jd, jMoment.jDaysInMonth(input, j.jm));
        g = toGregorian(input, j.jm, lastDay);
        setDate(this, g.gy, g.gm, g.gd);
        moment.updateOffset(this);
        return this;
    } else {
        return getJalaliOf(this).jy;
    }
};

jMoment.fn.month = function (input) {
    if (isJalali(this)) return jMoment.fn.jMonth.call(this,input);
    else return moment.fn.month.call(this, input);
};
jMoment.fn.jMonth = function (input) {
    var lastDay
        , j
        , g;
    if (!isNull(input)) {
        if (typeof input === "string") {
            input = this.localeData().jMonthsParse(input);
            if (typeof input !== "number"){
                return this;
            }
        }
        j = getJalaliOf(this);
        lastDay = Math.min(j.jd, jMoment.jDaysInMonth(j.jy, input));
        this.jYear(j.jy + div(input, 12));
        input = mod(input, 12);
        if (input < 0) {
            input += 12;
            this.jYear(this.jYear() - 1);
        }
        g = toGregorian(this.jYear(), input, lastDay);
        setDate(this, g.gy, g.gm, g.gd);
        moment.updateOffset(this);
        return this;
    } else {
        return getJalaliOf(this).jm;
    }
};

jMoment.fn.date = function (input) {
    if (isJalali(this)) return jMoment.fn.jDate.call(this,input);
    else return moment.fn.date.call(this, input);
};
function getJalaliOf (momentObj) {
    var d = momentObj._d;
    if (momentObj._isUTC) {
        return toJalali(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    } else {
        return toJalali(d.getFullYear(), d.getMonth(), d.getDate());
    }
}
jMoment.fn.jDate = function (input) {
    var j
        , g;
    if (typeof input === "number") {
        j = getJalaliOf(this);
        g = toGregorian(j.jy, j.jm, input);
        setDate(this, g.gy, g.gm, g.gd);
        moment.updateOffset(this);
        return this;
    } else {
        return getJalaliOf(this).jd;
    }
};

jMoment.fn.jDay = function (input) {
    if (typeof input === "number") {
        return moment.fn.day.call(this, input - 1);
    } else {
        return (moment.fn.day.call(this) + 1) % 7;
    }
};
jMoment.fn.diff = function (input, unitOfTime, asFloat) {
    //code taken and adjusted for jalali calendar from original moment diff module https://github.com/moment/moment/blob/develop/src/lib/moment/diff.js
    if (!isJalali(this))
        return moment.fn.diff.call(this, input, unitOfTime, asFloat);

    var output;
    switch (unitOfTime) {
        case "year":
            output = monthDiff(this, input) / 12;
            break;
        case "month":
            output = monthDiff(this, input);
            break;
        case "quarter":
            output = monthDiff(this, input) / 3;
            break;
        default:
            output = moment.fn.diff.call(this, input, unitOfTime, asFloat);
    }

    return asFloat ? output : (output < 0 ? Math.ceil(output) || 0 : Math.floor(output));

    function monthDiff(a, b) {
        if (a.date() < b.date()) {
            // end-of-month calculations work correct when the start month has more
            // days than the end month.
            return -monthDiff(b, a);
        }
        // difference in months
        var wholeMonthDiff = (b.jYear() - a.jYear()) * 12 + (b.jMonth() - a.jMonth()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, "months"),
            anchor2,
            adjust

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, "months");
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, "months");
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }
}

jMoment.fn.dayOfYear = function (input) {
    if (isJalali(this)) return jMoment.fn.jDayOfYear.call(this,input);
    else return moment.fn.dayOfYear.call(this, input);
};
jMoment.fn.jDayOfYear = function (input) {
    var dayOfYear = Math.round((jMoment(this).startOf("day") - jMoment(this).startOf("jYear")) / 864e5) + 1;
    return isNull(input) ? dayOfYear : this.add(input - dayOfYear, "d");
};

jMoment.fn.week = function (input) {
    if (isJalali(this)) return jMoment.fn.jWeek.call(this,input);
    else return moment.fn.week.call(this, input);
};
jMoment.fn.jWeek = function (input) {
    var week = jWeekOfYear(this, 6, 12).week;
    return isNull(input) ? week : this.add((input - week) * 7, "d");
};

jMoment.fn.weekYear = function (input) {
    if (isJalali(this)) return jMoment.fn.jWeekYear.call(this,input);
    else return moment.fn.weekYear.call(this, input);
};
jMoment.fn.jWeekYear = function (input) {
    var year = jWeekOfYear(this, 6, 12).year;
    return isNull(input) ? year : this.add(input - year, "jyear");
};

jMoment.fn.add = function (val, units) {
    var temp;
    if (!isNull(units) && !isNaN(+units)) {
        temp = val;
        val = units;
        units = temp;
    }
    units = normalizeUnits(units, this);
    if (units === 'jweek' || units==='isoweek') { units = 'week' }
    if (units === "jyear") {
        this.jYear(this.jYear() + val);
    } else if (units === "jmonth") {
        this.jMonth(this.jMonth() + val);
    } else {
        moment.fn.add.call(this, val, units);
    }
    return this;
};

jMoment.fn.subtract = function (val, units) {
    var temp;
    if (!isNull(units) && !isNaN(+units)) {
        temp = val;
        val = units;
        units = temp;
    }
    units = normalizeUnits(units, this);
    if (units === "jyear") {
        this.jYear(this.jYear() - val);
    } else if (units === "jmonth") {
        this.jMonth(this.jMonth() - val);
    } else {
        moment.fn.subtract.call(this, val, units);
    }
    return this;
};

jMoment.fn.startOf = function (units) {
    var nunit = normalizeUnits(units, this);
    if( nunit === "jweek"){
        return this.startOf("day").subtract(this.jDay() , "day");
    }
    if (nunit === "jyear") {
        this.jMonth(0);
        nunit = "jmonth";
    }
    if (nunit === "jmonth") {
        this.jDate(1);
        nunit = "day";
    }
    if (nunit === "day") {
        this.hours(0);
        this.minutes(0);
        this.seconds(0);
        this.milliseconds(0);
        return this;
    } else {
        return moment.fn.startOf.call(this, units);
    }
};

jMoment.fn.endOf = function (units) {
    units = normalizeUnits(units, this);
    if (units === undefined || units === "milisecond") {
        return this;
    }
    return this.startOf(units).add(1, units).subtract(1, "ms");
};

jMoment.fn.isSame = function (other, units) {
    units = normalizeUnits(units, this);
    if (units === "jyear" || units === "jmonth") {
        return moment.fn.isSame.call(this.clone().startOf(units), other.clone().startOf(units));
    }
    return moment.fn.isSame.call(this, other, units);
};

jMoment.fn.isBefore = function (other, units) {
    units = normalizeUnits(units, this);
    if (units === "jyear" || units === "jmonth") {
        return moment.fn.isBefore.call(this.clone().startOf(units), other.clone().startOf(units));
    }
    return moment.fn.isBefore.call(this, other, units);
};

jMoment.fn.isAfter = function (other, units) {
    units = normalizeUnits(units, this);
    if (units === "jyear" || units === "jmonth") {
        return moment.fn.isAfter.call(this.clone().startOf(units), other.clone().startOf(units));
    }
    return moment.fn.isAfter.call(this, other, units);
};

jMoment.fn.clone = function () {
    return jMoment(this);
};

jMoment.fn.doAsJalali = function () {
    this.calSystem = CalendarSystems.Jalali;
    return this;
};
jMoment.fn.doAsGregorian = function () {
    this.calSystem = CalendarSystems.Gregorian;
    return this;
};

jMoment.fn.jYears = jMoment.fn.jYear;
jMoment.fn.jMonths = jMoment.fn.jMonth;
jMoment.fn.jDates = jMoment.fn.jDate;
jMoment.fn.jWeeks = jMoment.fn.jWeek;

jMoment.fn.daysInMonth = function() {
    if (isJalali(this)) {
        return this.jDaysInMonth();
    }
    return moment.fn.daysInMonth.call(this);
};
jMoment.fn.jDaysInMonth = function () {
    var month = this.jMonth();
    var year = this.jYear();
    if (month < 6) {
        return 31;
    } else if (month < 11) {
        return 30;
    } else if (jMoment.jIsLeapYear(year)) {
        return 30;
    } else {
        return 29;
    }
};

jMoment.fn.isLeapYear = function() {
    if (isJalali(this)) {
        return this.jIsLeapYear();
    }
    return moment.fn.isLeapYear.call(this);
};
jMoment.fn.jIsLeapYear = function () {
    var year = this.jYear();
    return isLeapJalaliYear(year);
};
jMoment.fn.locale = function(locale) {
    if (locale && moment.changeCalendarSystemByItsLocale) {
        if (locale === "fa") {
            this.doAsJalali();
        } else {
            this.doAsGregorian();
        }
    }
    return moment.fn.locale.call(this, locale);
};
/************************************
 jMoment Statics
 ************************************/
jMoment.locale = function(locale, options) {
    if (locale && moment.changeCalendarSystemByItsLocale) {
        if (locale === "fa") {
            this.useJalaliSystemPrimarily(options);
        } else {
            this.useJalaliSystemSecondary();
        }
    }
    return moment.locale.call(this, locale);
};

jMoment.from = function(date, locale, format) {
    var lastLocale = jMoment.locale();
    jMoment.locale(locale);
    var m = jMoment(date, format);
    m.locale(lastLocale);
    jMoment.locale(lastLocale);
    return m;
};

jMoment.bindCalendarSystemAndLocale = function () {
    moment.changeCalendarSystemByItsLocale = true;
};
jMoment.unBindCalendarSystemAndLocale = function () {
    moment.changeCalendarSystemByItsLocale = false;
};

jMoment.useJalaliSystemPrimarily = function (options) {
    moment.justUseJalali = true;
    var useGregorianParser = false;
    if (options) {
        useGregorianParser = options.useGregorianParser;
    }
    moment.useGregorianParser = useGregorianParser;
};
jMoment.useJalaliSystemSecondary = function () {
    moment.justUseJalali = false;
};

jMoment.jDaysInMonth = function (year, month) {
    year += div(month, 12);
    month = mod(month, 12);
    if (month < 0) {
        month += 12;
        year -= 1;
    }
    if (month < 6) {
        return 31;
    } else if (month < 11) {
        return 30;
    } else if (jMoment.jIsLeapYear(year)) {
        return 30;
    } else {
        return 29;
    }
};

jMoment.jIsLeapYear = isLeapJalaliYear;

moment.updateLocale("fa", {
        months: ("ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر").split("_")
        , monthsShort: ("ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر").split("_")
        , weekdays: ("یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه").split("_")
        , weekdaysShort: ("یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه").split("_")
        , weekdaysMin: "ی_د_س_چ_پ_ج_ش".split("_")
        , longDateFormat:
            { LT: "HH:mm"
                , L: "jYYYY/jMM/jDD"
                , LL: "jD jMMMM jYYYY"
                , LLL: "jD jMMMM jYYYY LT"
                , LLLL: "dddd، jD jMMMM jYYYY LT"
            }
        , calendar:
            { sameDay: "[امروز ساعت] LT"
                , nextDay: "[فردا ساعت] LT"
                , nextWeek: "dddd [ساعت] LT"
                , lastDay: "[دیروز ساعت] LT"
                , lastWeek: "dddd [ی پیش ساعت] LT"
                , sameElse: "L"
            }
        , relativeTime:
            { future: "در %s"
                , past: "%s پیش"
                , s: "چند ثانیه"
                , m: "1 دقیقه"
                , mm: "%d دقیقه"
                , h: "1 ساعت"
                , hh: "%d ساعت"
                , d: "1 روز"
                , dd: "%d روز"
                , M: "1 ماه"
                , MM: "%d ماه"
                , y: "1 سال"
                , yy: "%d سال"
            }
        , ordinal: "%dم",
        preparse: function (string) {
            return string;
        },
        postformat: function (string) {
            return string;
        }
        , week:
            { dow: 6 // Saturday is the first day of the week.
                , doy: 12 // The week that contains Jan 1st is the first week of the year.
            }
        , meridiem: function (hour) {
            return hour < 12 ? "ق.ظ" : "ب.ظ";
        }
        , jMonths: ("فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند").split("_")
        , jMonthsShort: "فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند".split("_")
    });
jMoment.bindCalendarSystemAndLocale();
moment.locale("en");

jMoment.jConvert =  { toJalali: toJalali
    , toGregorian: toGregorian
};

/************************************
 Jalali Conversion
 ************************************/

function toJalali(gy, gm, gd) {
    var j = convertToJalali(gy, gm + 1, gd);
    j.jm -= 1;
    return j;
}

function toGregorian(jy, jm, jd) {
    var g = convertToGregorian(jy, jm + 1, jd);
    g.gm -= 1;
    return g;
}

/*
 Utility helper functions.
 */

function div(a, b) {
    return ~~(a / b);
}

function mod(a, b) {
    return a - ~~(a / b) * b;
}

/*
 Converts a Gregorian date to Jalali.
 */
function convertToJalali(gy, gm, gd) {
    if (Object.prototype.toString.call(gy) === "[object Date]") {
        gd = gy.getDate();
        gm = gy.getMonth() + 1;
        gy = gy.getFullYear();
    }
    return d2j(g2d(gy, gm, gd));
}

/*
 Converts a Jalali date to Gregorian.
 */
function convertToGregorian(jy, jm, jd) {
    return d2g(j2d(jy, jm, jd));
}

/*
 Is this a leap year or not?
 */
function isLeapJalaliYear(jy) {
    return jalCal(jy).leap === 0;
}

/*
 This function determines if the Jalali (Persian) year is
 leap (366-day long) or is the common year (365 days), and
 finds the day in March (Gregorian calendar) of the first
 day of the Jalali year (jy).
 @param jy Jalali calendar year (-61 to 3177)
 @return
 leap: number of years since the last leap year (0 to 4)
 gy: Gregorian year of the beginning of Jalali year
 march: the March day of Farvardin the 1st (1st day of jy)
 @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
 @see: http://www.fourmilab.ch/documents/calendar/
 */
function jalCal(jy) {
    // Jalali years starting the 33-year rule.
    var breaks =  [ -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210
        , 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
    ]
        , bl = breaks.length
        , gy = jy + 621
        , leapJ = -14
        , jp = breaks[0]
        , jm
        , jump
        , leap
        , leapG
        , march
        , n
        , i;

    if (jy < jp || jy >= breaks[bl - 1])
        throw new Error("Invalid Jalali year " + jy);

    // Find the limiting years for the Jalali year jy.
    for (i = 1; i < bl; i += 1) {
        jm = breaks[i];
        jump = jm - jp;
        if (jy < jm)
            break;
        leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
        jp = jm;
    }
    n = jy - jp;

    // Find the number of leap years from AD 621 to the beginning
    // of the current Jalali year in the Persian calendar.
    leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
    if (mod(jump, 33) === 4 && jump - n === 4)
        leapJ += 1;

    // And the same in the Gregorian calendar (until the year gy).
    leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;

    // Determine the Gregorian date of Farvardin the 1st.
    march = 20 + leapJ - leapG;

    // Find how many years have passed since the last leap year.
    if (jump - n < 6)
        n = n - jump + div(jump + 4, 33) * 33;
    leap = mod(mod(n + 1, 33) - 1, 4);
    if (leap === -1) {
        leap = 4;
    }

    return  { leap: leap
        , gy: gy
        , march: march
    };
}

/*
 Converts a date of the Jalali calendar to the Julian Day number.
 @param jy Jalali year (1 to 3100)
 @param jm Jalali month (1 to 12)
 @param jd Jalali day (1 to 29/31)
 @return Julian Day number
 */
function j2d(jy, jm, jd) {
    var r = jalCal(jy);
    return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

/*
 Converts the Julian Day number to a date in the Jalali calendar.
 @param jdn Julian Day number
 @return
 jy: Jalali year (1 to 3100)
 jm: Jalali month (1 to 12)
 jd: Jalali day (1 to 29/31)
 */
function d2j(jdn) {
    var gy = d2g(jdn).gy // Calculate Gregorian year (gy).
        , jy = gy - 621
        , r = jalCal(jy)
        , jdn1f = g2d(gy, 3, r.march)
        , jd
        , jm
        , k;

    // Find number of days that passed since 1 Farvardin.
    k = jdn - jdn1f;
    if (k >= 0) {
        if (k <= 185) {
            // The first 6 months.
            jm = 1 + div(k, 31);
            jd = mod(k, 31) + 1;
            return  { jy: jy
                , jm: jm
                , jd: jd
            };
        } else {
            // The remaining months.
            k -= 186;
        }
    } else {
        // Previous Jalali year.
        jy -= 1;
        k += 179;
        if (r.leap === 1)
            k += 1;
    }
    jm = 7 + div(k, 30);
    jd = mod(k, 30) + 1;
    return  { jy: jy
        , jm: jm
        , jd: jd
    };
}

/*
 Calculates the Julian Day number from Gregorian or Julian
 calendar dates. This integer number corresponds to the noon of
 the date (i.e. 12 hours of Universal Time).
 The procedure was tested to be good since 1 March, -100100 (of both
 calendars) up to a few million years into the future.
 @param gy Calendar year (years BC numbered 0, -1, -2, ...)
 @param gm Calendar month (1 to 12)
 @param gd Calendar day of the month (1 to 28/29/30/31)
 @return Julian Day number
 */
function g2d(gy, gm, gd) {
    var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
        + div(153 * mod(gm + 9, 12) + 2, 5)
        + gd - 34840408;
    d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
    return d;
}

/*
 Calculates Gregorian and Julian calendar dates from the Julian Day number
 (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
 calendars) to some millions years ahead of the present.
 @param jdn Julian Day number
 @return
 gy: Calendar year (years BC numbered 0, -1, -2, ...)
 gm: Calendar month (1 to 12)
 gd: Calendar day of the month M (1 to 28/29/30/31)
 */
function d2g(jdn) {
    var j
        , i
        , gd
        , gm
        , gy;
    j = 4 * jdn + 139361631;
    j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
    i = div(mod(j, 1461), 4) * 5 + 308;
    gd = div(mod(i, 153), 5) + 1;
    gm = mod(div(i, 153), 12) + 1;
    gy = div(j, 1461) - 100100 + div(8 - gm, 6);
    return  { gy: gy
        , gm: gm
        , gd: gd
    };
}

},{"moment/locale/fa":16,"moment/moment":17}],16:[function(require,module,exports){
//! moment.js locale configuration
//! locale : Persian [fa]
//! author : Ebrahim Byagowi : https://github.com/ebraminio

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';

    //! moment.js locale configuration

    var symbolMap = {
            1: '۱',
            2: '۲',
            3: '۳',
            4: '۴',
            5: '۵',
            6: '۶',
            7: '۷',
            8: '۸',
            9: '۹',
            0: '۰',
        },
        numberMap = {
            '۱': '1',
            '۲': '2',
            '۳': '3',
            '۴': '4',
            '۵': '5',
            '۶': '6',
            '۷': '7',
            '۸': '8',
            '۹': '9',
            '۰': '0',
        };

    var fa = moment.defineLocale('fa', {
        months: 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split(
            '_'
        ),
        monthsShort:
            'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split(
                '_'
            ),
        weekdays:
            'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split(
                '_'
            ),
        weekdaysShort:
            'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split(
                '_'
            ),
        weekdaysMin: 'ی_د_س_چ_پ_ج_ش'.split('_'),
        weekdaysParseExact: true,
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd, D MMMM YYYY HH:mm',
        },
        meridiemParse: /قبل از ظهر|بعد از ظهر/,
        isPM: function (input) {
            return /بعد از ظهر/.test(input);
        },
        meridiem: function (hour, minute, isLower) {
            if (hour < 12) {
                return 'قبل از ظهر';
            } else {
                return 'بعد از ظهر';
            }
        },
        calendar: {
            sameDay: '[امروز ساعت] LT',
            nextDay: '[فردا ساعت] LT',
            nextWeek: 'dddd [ساعت] LT',
            lastDay: '[دیروز ساعت] LT',
            lastWeek: 'dddd [پیش] [ساعت] LT',
            sameElse: 'L',
        },
        relativeTime: {
            future: 'در %s',
            past: '%s پیش',
            s: 'چند ثانیه',
            ss: '%d ثانیه',
            m: 'یک دقیقه',
            mm: '%d دقیقه',
            h: 'یک ساعت',
            hh: '%d ساعت',
            d: 'یک روز',
            dd: '%d روز',
            M: 'یک ماه',
            MM: '%d ماه',
            y: 'یک سال',
            yy: '%d سال',
        },
        preparse: function (string) {
            return string
                .replace(/[۰-۹]/g, function (match) {
                    return numberMap[match];
                })
                .replace(/،/g, ',');
        },
        postformat: function (string) {
            return string
                .replace(/\d/g, function (match) {
                    return symbolMap[match];
                })
                .replace(/,/g, '،');
        },
        dayOfMonthOrdinalParse: /\d{1,2}م/,
        ordinal: '%dم',
        week: {
            dow: 6, // Saturday is the first day of the week.
            doy: 12, // The week that contains Jan 12th is the first week of the year.
        },
    });

    return fa;

})));

},{"../moment":17}],17:[function(require,module,exports){
//! moment.js
//! version : 2.29.4
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return (
            input instanceof Array ||
            Object.prototype.toString.call(input) === '[object Array]'
        );
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return (
            input != null &&
            Object.prototype.toString.call(input) === '[object Object]'
        );
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(obj).length === 0;
        } else {
            var k;
            for (k in obj) {
                if (hasOwnProp(obj, k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return (
            typeof input === 'number' ||
            Object.prototype.toString.call(input) === '[object Number]'
        );
    }

    function isDate(input) {
        return (
            input instanceof Date ||
            Object.prototype.toString.call(input) === '[object Date]'
        );
    }

    function map(arr, fn) {
        var res = [],
            i,
            arrLen = arr.length;
        for (i = 0; i < arrLen; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false,
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this),
                len = t.length >>> 0,
                i;

            for (i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m),
                parsedParts = some.call(flags.parsedDateParts, function (i) {
                    return i != null;
                }),
                isNowValid =
                    !isNaN(m._d.getTime()) &&
                    flags.overflow < 0 &&
                    !flags.empty &&
                    !flags.invalidEra &&
                    !flags.invalidMonth &&
                    !flags.invalidWeekday &&
                    !flags.weekdayMismatch &&
                    !flags.nullInput &&
                    !flags.invalidFormat &&
                    !flags.userInvalidated &&
                    (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid =
                    isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            } else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = (hooks.momentProperties = []),
        updateInProgress = false;

    function copyConfig(to, from) {
        var i,
            prop,
            val,
            momentPropertiesLen = momentProperties.length;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentPropertiesLen > 0) {
            for (i = 0; i < momentPropertiesLen; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return (
            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
        );
    }

    function warn(msg) {
        if (
            hooks.suppressDeprecationWarnings === false &&
            typeof console !== 'undefined' &&
            console.warn
        ) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [],
                    arg,
                    i,
                    key,
                    argLen = arguments.length;
                for (i = 0; i < argLen; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (key in arguments[0]) {
                            if (hasOwnProp(arguments[0], key)) {
                                arg += key + ': ' + arguments[0][key] + ', ';
                            }
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(
                    msg +
                        '\nArguments: ' +
                        Array.prototype.slice.call(args).join('') +
                        '\n' +
                        new Error().stack
                );
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return (
            (typeof Function !== 'undefined' && input instanceof Function) ||
            Object.prototype.toString.call(input) === '[object Function]'
        );
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            if (hasOwnProp(config, i)) {
                prop = config[i];
                if (isFunction(prop)) {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' +
                /\d{1,2}/.source
        );
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig),
            prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (
                hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])
            ) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i,
                res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L',
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (
            (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
            absNumber
        );
    }

    var formattingTokens =
            /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        formatFunctions = {},
        formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(
                    func.apply(this, arguments),
                    token
                );
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i,
            length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i])
                    ? array[i].call(mom, format)
                    : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] =
            formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(
                localFormattingTokens,
                replaceLongDateFormatTokens
            );
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A',
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper
            .match(formattingTokens)
            .map(function (tok) {
                if (
                    tok === 'MMMM' ||
                    tok === 'MM' ||
                    tok === 'DD' ||
                    tok === 'dddd'
                ) {
                    return tok.slice(1);
                }
                return tok;
            })
            .join('');

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d',
        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        w: 'a week',
        ww: '%d weeks',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years',
    };

    function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output)
            ? output(number, withoutSuffix, string, isFuture)
            : output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string'
            ? aliases[units] || aliases[units.toLowerCase()]
            : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [],
            u;
        for (u in unitsObj) {
            if (hasOwnProp(unitsObj, u)) {
                units.push({ unit: u, priority: priorities[u] });
            }
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function absFloor(number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function makeGetSet(unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        return mom.isValid()
            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
            : NaN;
    }

    function set$1(mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (
                unit === 'FullYear' &&
                isLeapYear(mom.year()) &&
                mom.month() === 1 &&
                mom.date() === 29
            ) {
                value = toInt(value);
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
                    value,
                    mom.month(),
                    daysInMonth(value, mom.month())
                );
            } else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }

    function stringSet(units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units),
                i,
                prioritizedLen = prioritized.length;
            for (i = 0; i < prioritizedLen; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    var match1 = /\d/, //       0 - 9
        match2 = /\d\d/, //      00 - 99
        match3 = /\d{3}/, //     000 - 999
        match4 = /\d{4}/, //    0000 - 9999
        match6 = /[+-]?\d{6}/, // -999999 - 999999
        match1to2 = /\d\d?/, //       0 - 99
        match3to4 = /\d\d\d\d?/, //     999 - 9999
        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
        match1to3 = /\d{1,3}/, //       0 - 999
        match1to4 = /\d{1,4}/, //       0 - 9999
        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
        matchUnsigned = /\d+/, //       0 - inf
        matchSigned = /[+-]?\d+/, //    -inf - inf
        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        // any word (or two) characters or numbers including two/three word month in arabic.
        // includes scottish gaelic two word and hyphenated months
        matchWord =
            /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
        regexes;

    regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex)
            ? regex
            : function (isStrict, localeData) {
                  return isStrict && strictRegex ? strictRegex : regex;
              };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(
            s
                .replace('\\', '')
                .replace(
                    /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
                    function (matched, p1, p2, p3, p4) {
                        return p1 || p2 || p3 || p4;
                    }
                )
        );
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i,
            func = callback,
            tokenLen;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        tokenLen = token.length;
        for (i = 0; i < tokenLen; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,
        WEEK = 7,
        WEEKDAY = 8;

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1
            ? isLeapYear(year)
                ? 29
                : 28
            : 31 - ((modMonth % 7) % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths =
            'January_February_March_April_May_June_July_August_September_October_November_December'.split(
                '_'
            ),
        defaultLocaleMonthsShort =
            'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        defaultMonthsShortRegex = matchWord,
        defaultMonthsRegex = matchWord;

    function localeMonths(m, format) {
        if (!m) {
            return isArray(this._months)
                ? this._months
                : this._months['standalone'];
        }
        return isArray(this._months)
            ? this._months[m.month()]
            : this._months[
                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
                      ? 'format'
                      : 'standalone'
              ][m.month()];
    }

    function localeMonthsShort(m, format) {
        if (!m) {
            return isArray(this._monthsShort)
                ? this._monthsShort
                : this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort)
            ? this._monthsShort[m.month()]
            : this._monthsShort[
                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
              ][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i,
            ii,
            mom,
            llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp(
                    '^' + this.months(mom, '').replace('.', '') + '$',
                    'i'
                );
                this._shortMonthsParse[i] = new RegExp(
                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
                    'i'
                );
            }
            if (!strict && !this._monthsParse[i]) {
                regex =
                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'MMMM' &&
                this._longMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'MMM' &&
                this._shortMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict
                ? this._monthsShortStrictRegex
                : this._monthsShortRegex;
        }
    }

    function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict
                ? this._monthsStrictRegex
                : this._monthsRegex;
        }
    }

    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._monthsShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] =
            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function createDate(y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate(y) {
        var date, args;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear,
            resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear,
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek,
            resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear,
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(
        ['w', 'ww', 'W', 'WW'],
        function (input, week, config, token) {
            week[token.substr(0, 1)] = toInt(input);
        }
    );

    // HELPERS

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6, // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd', function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd', function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays =
            'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        defaultWeekdaysRegex = matchWord,
        defaultWeekdaysShortRegex = matchWord,
        defaultWeekdaysMinRegex = matchWord;

    function localeWeekdays(m, format) {
        var weekdays = isArray(this._weekdays)
            ? this._weekdays
            : this._weekdays[
                  m && m !== true && this._weekdays.isFormat.test(format)
                      ? 'format'
                      : 'standalone'
              ];
        return m === true
            ? shiftWeekdays(weekdays, this._week.dow)
            : m
            ? weekdays[m.day()]
            : weekdays;
    }

    function localeWeekdaysShort(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : m
            ? this._weekdaysShort[m.day()]
            : this._weekdaysShort;
    }

    function localeWeekdaysMin(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : m
            ? this._weekdaysMin[m.day()]
            : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i,
            ii,
            mom,
            llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._shortWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._minWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
            }
            if (!this._weekdaysParse[i]) {
                regex =
                    '^' +
                    this.weekdays(mom, '') +
                    '|^' +
                    this.weekdaysShort(mom, '') +
                    '|^' +
                    this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'dddd' &&
                this._fullWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'ddd' &&
                this._shortWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'dd' &&
                this._minWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict
                ? this._weekdaysStrictRegex
                : this._weekdaysRegex;
        }
    }

    function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict
                ? this._weekdaysShortStrictRegex
                : this._weekdaysShortRegex;
        }
    }

    function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict
                ? this._weekdaysMinStrictRegex
                : this._weekdaysMinRegex;
        }
    }

    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [],
            shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom,
            minp,
            shortp,
            longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = regexEscape(this.weekdaysMin(mom, ''));
            shortp = regexEscape(this.weekdaysShort(mom, ''));
            longp = regexEscape(this.weekdays(mom, ''));
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._weekdaysShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
        this._weekdaysMinStrictRegex = new RegExp(
            '^(' + minPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return (
            '' +
            hFormat.apply(this) +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return (
            '' +
            this.hours() +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(
                this.hours(),
                this.minutes(),
                lowercase
            );
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('k', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return (input + '').toLowerCase().charAt(0) === 'p';
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
        // Setting the hour should keep the time, because the user explicitly
        // specified which hour they want. So trying to maintain the same hour (in
        // a new timezone) makes sense. Adding/subtracting hours does not follow
        // this rule.
        getSetHour = makeGetSet('Hours', true);

    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse,
    };

    // internal storage for locale config files
    var locales = {},
        localeFamilies = {},
        globalLocale;

    function commonPrefix(arr1, arr2) {
        var i,
            minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
            if (arr1[i] !== arr2[i]) {
                return i;
            }
        }
        return minl;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (
                    next &&
                    next.length >= j &&
                    commonPrefix(split, next) >= j - 1
                ) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function isLocaleNameSane(name) {
        // Prevent names that look like filesystem paths, i.e contain '/' or '\'
        return name.match('^[^/\\\\]*$') != null;
    }

    function loadLocale(name) {
        var oldLocale = null,
            aliasedRequire;
        // TODO: Find a better way to register and load all the locales in Node
        if (
            locales[name] === undefined &&
            typeof module !== 'undefined' &&
            module &&
            module.exports &&
            isLocaleNameSane(name)
        ) {
            try {
                oldLocale = globalLocale._abbr;
                aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {
                // mark as not found to avoid repeating expensive file require call causing high CPU
                // when trying to find en-US, en_US, en-us for every format call
                locales[name] = null; // null means not found
            }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            } else {
                if (typeof console !== 'undefined' && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn(
                        'Locale ' + key + ' not found. Did you forget to load it?'
                    );
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, config) {
        if (config !== null) {
            var locale,
                parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple(
                    'defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
                );
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config,
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale,
                tmpLocale,
                parentConfig = baseConfig;

            if (locales[name] != null && locales[name].parentLocale != null) {
                // Update existing child locale in-place to avoid memory-leaks
                locales[name].set(mergeConfigs(locales[name]._config, config));
            } else {
                // MERGE
                tmpLocale = loadLocale(name);
                if (tmpLocale != null) {
                    parentConfig = tmpLocale._config;
                }
                config = mergeConfigs(parentConfig, config);
                if (tmpLocale == null) {
                    // updateLocale is called for creating a new locale
                    // Set abbr so it will have a name (getters return
                    // undefined otherwise).
                    config.abbr = name;
                }
                locale = new Locale(config);
                locale.parentLocale = locales[name];
                locales[name] = locale;
            }

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                    if (name === getSetGlobalLocale()) {
                        getSetGlobalLocale(name);
                    }
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow(m) {
        var overflow,
            a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH] < 0 || a[MONTH] > 11
                    ? MONTH
                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
                    ? DATE
                    : a[HOUR] < 0 ||
                      a[HOUR] > 24 ||
                      (a[HOUR] === 24 &&
                          (a[MINUTE] !== 0 ||
                              a[SECOND] !== 0 ||
                              a[MILLISECOND] !== 0))
                    ? HOUR
                    : a[MINUTE] < 0 || a[MINUTE] > 59
                    ? MINUTE
                    : a[SECOND] < 0 || a[SECOND] > 59
                    ? SECOND
                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
                    ? MILLISECOND
                    : -1;

            if (
                getParsingFlags(m)._overflowDayOfYear &&
                (overflow < YEAR || overflow > DATE)
            ) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex =
            /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        basicIsoRegex =
            /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
            ['YYYY-DDD', /\d{4}-\d{3}/],
            ['YYYY-MM', /\d{4}-\d\d/, false],
            ['YYYYYYMMDD', /[+-]\d{10}/],
            ['YYYYMMDD', /\d{8}/],
            ['GGGG[W]WWE', /\d{4}W\d{3}/],
            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
            ['YYYYDDD', /\d{7}/],
            ['YYYYMM', /\d{6}/, false],
            ['YYYY', /\d{4}/, false],
        ],
        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
            ['HH:mm', /\d\d:\d\d/],
            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
            ['HHmmss', /\d\d\d\d\d\d/],
            ['HHmm', /\d\d\d\d/],
            ['HH', /\d\d/],
        ],
        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
        rfc2822 =
            /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
        obsOffsets = {
            UT: 0,
            GMT: 0,
            EDT: -4 * 60,
            EST: -5 * 60,
            CDT: -5 * 60,
            CST: -6 * 60,
            MDT: -6 * 60,
            MST: -7 * 60,
            PDT: -7 * 60,
            PST: -8 * 60,
        };

    // date from iso format
    function configFromISO(config) {
        var i,
            l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime,
            dateFormat,
            timeFormat,
            tzFormat,
            isoDatesLen = isoDates.length,
            isoTimesLen = isoTimes.length;

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDatesLen; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimesLen; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    function extractFromRFC2822Strings(
        yearStr,
        monthStr,
        dayStr,
        hourStr,
        minuteStr,
        secondStr
    ) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10),
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s
            .replace(/\([^()]*\)|[\n\t]/g, ' ')
            .replace(/(\s\s+)/g, ' ')
            .replace(/^\s\s*/, '')
            .replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(
                    parsedInput[0],
                    parsedInput[1],
                    parsedInput[2]
                ).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10),
                m = hm % 100,
                h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)),
            parsedArray;
        if (match) {
            parsedArray = extractFromRFC2822Strings(
                match[4],
                match[3],
                match[2],
                match[5],
                match[6],
                match[7]
            );
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        if (config._strict) {
            config._isValid = false;
        } else {
            // Final attempt, use Input Fallback
            hooks.createFromInputFallback(config);
        }
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
            'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [
                nowValue.getUTCFullYear(),
                nowValue.getUTCMonth(),
                nowValue.getUTCDate(),
            ];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i,
            date,
            input = [],
            currentDate,
            expectedWeekday,
            yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (
                config._dayOfYear > daysInYear(yearToUse) ||
                config._dayOfYear === 0
            ) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] =
                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (
            config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0
        ) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(
            null,
            input
        );
        expectedWeekday = config._useUTC
            ? config._d.getUTCDay()
            : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (
            config._w &&
            typeof config._w.d !== 'undefined' &&
            config._w.d !== expectedWeekday
        ) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(
                w.GG,
                config._a[YEAR],
                weekOfYear(createLocal(), 1, 4).year
            );
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i,
            parsedInput,
            tokens,
            token,
            skipped,
            stringLength = string.length,
            totalParsedInputLength = 0,
            era,
            tokenLen;

        tokens =
            expandFormat(config._f, config._locale).match(formattingTokens) || [];
        tokenLen = tokens.length;
        for (i = 0; i < tokenLen; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
                [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(
                    string.indexOf(parsedInput) + parsedInput.length
                );
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver =
            stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (
            config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0
        ) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(
            config._locale,
            config._a[HOUR],
            config._meridiem
        );

        // handle era
        era = getParsingFlags(config).era;
        if (era !== null) {
            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
        }

        configFromArray(config);
        checkOverflow(config);
    }

    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,
            scoreToBeat,
            i,
            currentScore,
            validFormatFound,
            bestFormatIsValid = false,
            configfLen = config._f.length;

        if (configfLen === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < configfLen; i++) {
            currentScore = 0;
            validFormatFound = false;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (isValid(tempConfig)) {
                validFormatFound = true;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (!bestFormatIsValid) {
                if (
                    scoreToBeat == null ||
                    currentScore < scoreToBeat ||
                    validFormatFound
                ) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                    if (validFormatFound) {
                        bestFormatIsValid = true;
                    }
                }
            } else {
                if (currentScore < scoreToBeat) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                }
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i),
            dayOrDate = i.day === undefined ? i.date : i.day;
        config._a = map(
            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
            function (obj) {
                return obj && parseInt(obj, 10);
            }
        );

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (format === true || format === false) {
            strict = format;
            format = undefined;
        }

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if (
            (isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)
        ) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other < this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        ),
        prototypeMax = deprecate(
            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other > this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +new Date();
    };

    var ordering = [
        'year',
        'quarter',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond',
    ];

    function isDurationValid(m) {
        var key,
            unitHasDecimal = false,
            i,
            orderLen = ordering.length;
        for (key in m) {
            if (
                hasOwnProp(m, key) &&
                !(
                    indexOf.call(ordering, key) !== -1 &&
                    (m[key] == null || !isNaN(m[key]))
                )
            ) {
                return false;
            }
        }

        for (i = 0; i < orderLen; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds =
            +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days + weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + quarters * 3 + years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (
                (dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
            ) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    // FORMATTING

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset(),
                sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return (
                sign +
                zeroFill(~~(offset / 60), 2) +
                separator +
                zeroFill(~~offset % 60, 2)
            );
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher),
            chunk,
            parts,
            minutes;

        if (matches === null) {
            return null;
        }

        chunk = matches[matches.length - 1] || [];
        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff =
                (isMoment(input) || isDate(input)
                    ? input.valueOf()
                    : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset());
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(
                        this,
                        createDuration(input - offset, 'm'),
                        1,
                        false
                    );
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {},
            other;

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted =
                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        // and further modified to allow for strings containing both week and day
        isoRegex =
            /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration(input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months,
            };
        } else if (isNumber(input) || !isNaN(+input)) {
            duration = {};
            if (key) {
                duration[key] = +input;
            } else {
                duration.milliseconds = +input;
            }
        } else if ((match = aspNetRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
            };
        } else if ((match = isoRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                w: parseIso(match[4], sign),
                d: parseIso(match[5], sign),
                h: parseIso(match[6], sign),
                m: parseIso(match[7], sign),
                s: parseIso(match[8], sign),
            };
        } else if (duration == null) {
            // checks for null or undefined
            duration = {};
        } else if (
            typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)
        ) {
            diffRes = momentsDifference(
                createLocal(duration.from),
                createLocal(duration.to)
            );

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
            ret._isValid = input._isValid;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months =
            other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +base.clone().add(res.months, 'M');

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return { milliseconds: 0, months: 0 };
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(
                    name,
                    'moment().' +
                        name +
                        '(period, number) is deprecated. Please use moment().' +
                        name +
                        '(number, period). ' +
                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
                );
                tmp = val;
                val = period;
                period = tmp;
            }

            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add = createAdder(1, 'add'),
        subtract = createAdder(-1, 'subtract');

    function isString(input) {
        return typeof input === 'string' || input instanceof String;
    }

    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
    function isMomentInput(input) {
        return (
            isMoment(input) ||
            isDate(input) ||
            isString(input) ||
            isNumber(input) ||
            isNumberOrStringArray(input) ||
            isMomentInputObject(input) ||
            input === null ||
            input === undefined
        );
    }

    function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'years',
                'year',
                'y',
                'months',
                'month',
                'M',
                'days',
                'day',
                'd',
                'dates',
                'date',
                'D',
                'hours',
                'hour',
                'h',
                'minutes',
                'minute',
                'm',
                'seconds',
                'second',
                's',
                'milliseconds',
                'millisecond',
                'ms',
            ],
            i,
            property,
            propertyLen = properties.length;

        for (i = 0; i < propertyLen; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function isNumberOrStringArray(input) {
        var arrayTest = isArray(input),
            dataTypeTest = false;
        if (arrayTest) {
            dataTypeTest =
                input.filter(function (item) {
                    return !isNumber(item) && isString(input);
                }).length === 0;
        }
        return arrayTest && dataTypeTest;
    }

    function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'sameDay',
                'nextDay',
                'lastDay',
                'nextWeek',
                'lastWeek',
                'sameElse',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6
            ? 'sameElse'
            : diff < -1
            ? 'lastWeek'
            : diff < 0
            ? 'lastDay'
            : diff < 1
            ? 'sameDay'
            : diff < 2
            ? 'nextDay'
            : diff < 7
            ? 'nextWeek'
            : 'sameElse';
    }

    function calendar$1(time, formats) {
        // Support for single parameter, formats only overload to the calendar function
        if (arguments.length === 1) {
            if (!arguments[0]) {
                time = undefined;
                formats = undefined;
            } else if (isMomentInput(arguments[0])) {
                time = arguments[0];
                formats = undefined;
            } else if (isCalendarSpec(arguments[0])) {
                formats = arguments[0];
                time = undefined;
            }
        }
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse',
            output =
                formats &&
                (isFunction(formats[format])
                    ? formats[format].call(this, now)
                    : formats[format]);

        return this.format(
            output || this.localeData().calendar(format, this, createLocal(now))
        );
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween(from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (
            (inclusivity[0] === '('
                ? this.isAfter(localFrom, units)
                : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')'
                ? this.isBefore(localTo, units)
                : !this.isAfter(localTo, units))
        );
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return (
                this.clone().startOf(units).valueOf() <= inputMs &&
                inputMs <= this.clone().endOf(units).valueOf()
            );
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that, zoneDelta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year':
                output = monthDiff(this, that) / 12;
                break;
            case 'month':
                output = monthDiff(this, that);
                break;
            case 'quarter':
                output = monthDiff(this, that) / 3;
                break;
            case 'second':
                output = (this - that) / 1e3;
                break; // 1000
            case 'minute':
                output = (this - that) / 6e4;
                break; // 1000 * 60
            case 'hour':
                output = (this - that) / 36e5;
                break; // 1000 * 60 * 60
            case 'day':
                output = (this - that - zoneDelta) / 864e5;
                break; // 1000 * 60 * 60 * 24, negate dst
            case 'week':
                output = (this - that - zoneDelta) / 6048e5;
                break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default:
                output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        if (a.date() < b.date()) {
            // end-of-month calculations work correct when the start month has more
            // days than the end month.
            return -monthDiff(b, a);
        }
        // difference in months
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2,
            adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true,
            m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(
                m,
                utc
                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
            );
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
                    .toISOString()
                    .replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(
            m,
            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
        );
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect() {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment',
            zone = '',
            prefix,
            year,
            datetime,
            suffix;
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        prefix = '[' + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
        datetime = '-MM-DD[T]HH:mm:ss.SSS';
        suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputString) {
        if (!inputString) {
            inputString = this.isUtc()
                ? hooks.defaultFormatUtc
                : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ to: this, from: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ from: this, to: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData() {
        return this._locale;
    }

    var MS_PER_SECOND = 1000,
        MS_PER_MINUTE = 60 * MS_PER_SECOND,
        MS_PER_HOUR = 60 * MS_PER_MINUTE,
        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return ((dividend % divisor) + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(
                    this.year(),
                    this.month() - (this.month() % 3),
                    1
                );
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - this.weekday()
                );
                break;
            case 'isoWeek':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - (this.isoWeekday() - 1)
                );
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(
                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                    MS_PER_HOUR
                );
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time =
                    startOfDate(
                        this.year(),
                        this.month() - (this.month() % 3) + 3,
                        1
                    ) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - this.weekday() + 7
                    ) - 1;
                break;
            case 'isoWeek':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - (this.isoWeekday() - 1) + 7
                    ) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time +=
                    MS_PER_HOUR -
                    mod$1(
                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                        MS_PER_HOUR
                    ) -
                    1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }

    function unix() {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate() {
        return new Date(this.valueOf());
    }

    function toArray() {
        var m = this;
        return [
            m.year(),
            m.month(),
            m.date(),
            m.hour(),
            m.minute(),
            m.second(),
            m.millisecond(),
        ];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds(),
        };
    }

    function toJSON() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2() {
        return isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict,
        };
    }

    addFormatToken('N', 0, 0, 'eraAbbr');
    addFormatToken('NN', 0, 0, 'eraAbbr');
    addFormatToken('NNN', 0, 0, 'eraAbbr');
    addFormatToken('NNNN', 0, 0, 'eraName');
    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
    addFormatToken('y', ['yy', 2], 0, 'eraYear');
    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

    addRegexToken('N', matchEraAbbr);
    addRegexToken('NN', matchEraAbbr);
    addRegexToken('NNN', matchEraAbbr);
    addRegexToken('NNNN', matchEraName);
    addRegexToken('NNNNN', matchEraNarrow);

    addParseToken(
        ['N', 'NN', 'NNN', 'NNNN', 'NNNNN'],
        function (input, array, config, token) {
            var era = config._locale.erasParse(input, token, config._strict);
            if (era) {
                getParsingFlags(config).era = era;
            } else {
                getParsingFlags(config).invalidEra = input;
            }
        }
    );

    addRegexToken('y', matchUnsigned);
    addRegexToken('yy', matchUnsigned);
    addRegexToken('yyy', matchUnsigned);
    addRegexToken('yyyy', matchUnsigned);
    addRegexToken('yo', matchEraYearOrdinal);

    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
    addParseToken(['yo'], function (input, array, config, token) {
        var match;
        if (config._locale._eraYearOrdinalRegex) {
            match = input.match(config._locale._eraYearOrdinalRegex);
        }

        if (config._locale.eraYearOrdinalParse) {
            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
        } else {
            array[YEAR] = parseInt(input, 10);
        }
    });

    function localeEras(m, format) {
        var i,
            l,
            date,
            eras = this._eras || getLocale('en')._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
            switch (typeof eras[i].since) {
                case 'string':
                    // truncate time
                    date = hooks(eras[i].since).startOf('day');
                    eras[i].since = date.valueOf();
                    break;
            }

            switch (typeof eras[i].until) {
                case 'undefined':
                    eras[i].until = +Infinity;
                    break;
                case 'string':
                    // truncate time
                    date = hooks(eras[i].until).startOf('day').valueOf();
                    eras[i].until = date.valueOf();
                    break;
            }
        }
        return eras;
    }

    function localeErasParse(eraName, format, strict) {
        var i,
            l,
            eras = this.eras(),
            name,
            abbr,
            narrow;
        eraName = eraName.toUpperCase();

        for (i = 0, l = eras.length; i < l; ++i) {
            name = eras[i].name.toUpperCase();
            abbr = eras[i].abbr.toUpperCase();
            narrow = eras[i].narrow.toUpperCase();

            if (strict) {
                switch (format) {
                    case 'N':
                    case 'NN':
                    case 'NNN':
                        if (abbr === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNN':
                        if (name === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNNN':
                        if (narrow === eraName) {
                            return eras[i];
                        }
                        break;
                }
            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
                return eras[i];
            }
        }
    }

    function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? +1 : -1;
        if (year === undefined) {
            return hooks(era.since).year();
        } else {
            return hooks(era.since).year() + (year - era.offset) * dir;
        }
    }

    function getEraName() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].name;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].name;
            }
        }

        return '';
    }

    function getEraNarrow() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].narrow;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].narrow;
            }
        }

        return '';
    }

    function getEraAbbr() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].abbr;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].abbr;
            }
        }

        return '';
    }

    function getEraYear() {
        var i,
            l,
            dir,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            dir = eras[i].since <= eras[i].until ? +1 : -1;

            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (
                (eras[i].since <= val && val <= eras[i].until) ||
                (eras[i].until <= val && val <= eras[i].since)
            ) {
                return (
                    (this.year() - hooks(eras[i].since).year()) * dir +
                    eras[i].offset
                );
            }
        }

        return this.year();
    }

    function erasNameRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNameRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNameRegex : this._erasRegex;
    }

    function erasAbbrRegex(isStrict) {
        if (!hasOwnProp(this, '_erasAbbrRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
    }

    function erasNarrowRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNarrowRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
    }

    function matchEraAbbr(isStrict, locale) {
        return locale.erasAbbrRegex(isStrict);
    }

    function matchEraName(isStrict, locale) {
        return locale.erasNameRegex(isStrict);
    }

    function matchEraNarrow(isStrict, locale) {
        return locale.erasNarrowRegex(isStrict);
    }

    function matchEraYearOrdinal(isStrict, locale) {
        return locale._eraYearOrdinalRegex || matchUnsigned;
    }

    function computeErasParse() {
        var abbrPieces = [],
            namePieces = [],
            narrowPieces = [],
            mixedPieces = [],
            i,
            l,
            eras = this.eras();

        for (i = 0, l = eras.length; i < l; ++i) {
            namePieces.push(regexEscape(eras[i].name));
            abbrPieces.push(regexEscape(eras[i].abbr));
            narrowPieces.push(regexEscape(eras[i].narrow));

            mixedPieces.push(regexEscape(eras[i].name));
            mixedPieces.push(regexEscape(eras[i].abbr));
            mixedPieces.push(regexEscape(eras[i].narrow));
        }

        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
        this._erasNarrowRegex = new RegExp(
            '^(' + narrowPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);

    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(
        ['gggg', 'ggggg', 'GGGG', 'GGGGG'],
        function (input, week, config, token) {
            week[token.substr(0, 2)] = toInt(input);
        }
    );

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy
        );
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.isoWeek(),
            this.isoWeekday(),
            1,
            4
        );
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null
            ? Math.ceil((this.month() + 1) / 3)
            : this.month((input - 1) * 3 + (this.month() % 3));
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict
            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
            : locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear =
            Math.round(
                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
            ) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token, getSetMillisecond;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }

    getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
            return 'Moment<' + this.format() + '>';
        };
    }
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;
    proto.eraName = getEraName;
    proto.eraNarrow = getEraNarrow;
    proto.eraAbbr = getEraAbbr;
    proto.eraYear = getEraYear;
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.weeksInWeekYear = getWeeksInWeekYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates = deprecate(
        'dates accessor is deprecated. Use date instead.',
        getSetDayOfMonth
    );
    proto.months = deprecate(
        'months accessor is deprecated. Use month instead',
        getSetMonth
    );
    proto.years = deprecate(
        'years accessor is deprecated. Use year instead',
        getSetYear
    );
    proto.zone = deprecate(
        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
        getSetZone
    );
    proto.isDSTShifted = deprecate(
        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
        isDaylightSavingTimeShifted
    );

    function createUnix(input) {
        return createLocal(input * 1000);
    }

    function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat(string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;
    proto$1.eras = localeEras;
    proto$1.erasParse = localeErasParse;
    proto$1.erasConvertYear = localeErasConvertYear;
    proto$1.erasAbbrRegex = erasAbbrRegex;
    proto$1.erasNameRegex = erasNameRegex;
    proto$1.erasNarrowRegex = erasNarrowRegex;

    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;

    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1(format, index, field, setter) {
        var locale = getLocale(),
            utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i,
            out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0,
            i,
            out = [];

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths(format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        eras: [
            {
                since: '0001-01-01',
                until: +Infinity,
                offset: 1,
                name: 'Anno Domini',
                narrow: 'AD',
                abbr: 'AD',
            },
            {
                since: '0000-12-31',
                until: -Infinity,
                offset: 1,
                name: 'Before Christ',
                narrow: 'BC',
                abbr: 'BC',
            },
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output =
                    toInt((number % 100) / 10) === 1
                        ? 'th'
                        : b === 1
                        ? 'st'
                        : b === 2
                        ? 'nd'
                        : b === 3
                        ? 'rd'
                        : 'th';
            return number + output;
        },
    });

    // Side effect imports

    hooks.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        getSetGlobalLocale
    );
    hooks.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        getLocale
    );

    var mathAbs = Math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds,
            days = this._days,
            months = this._months,
            data = this._data,
            seconds,
            minutes,
            hours,
            years,
            monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (
            !(
                (milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0)
            )
        ) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return (days * 4800) / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return (months * 146097) / 4800;
    }

    function as(units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days,
            months,
            milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':
                    return months;
                case 'quarter':
                    return months / 3;
                case 'year':
                    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1() {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms'),
        asSeconds = makeAs('s'),
        asMinutes = makeAs('m'),
        asHours = makeAs('h'),
        asDays = makeAs('d'),
        asWeeks = makeAs('w'),
        asMonths = makeAs('M'),
        asQuarters = makeAs('Q'),
        asYears = makeAs('y');

    function clone$1() {
        return createDuration(this);
    }

    function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds'),
        seconds = makeGetter('seconds'),
        minutes = makeGetter('minutes'),
        hours = makeGetter('hours'),
        days = makeGetter('days'),
        months = makeGetter('months'),
        years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round,
        thresholds = {
            ss: 44, // a few seconds to seconds
            s: 45, // seconds to minute
            m: 45, // minutes to hour
            h: 22, // hours to day
            d: 26, // days to month/week
            w: null, // weeks to month
            M: 11, // months to year
        };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
        var duration = createDuration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            weeks = round(duration.as('w')),
            years = round(duration.as('y')),
            a =
                (seconds <= thresholds.ss && ['s', seconds]) ||
                (seconds < thresholds.s && ['ss', seconds]) ||
                (minutes <= 1 && ['m']) ||
                (minutes < thresholds.m && ['mm', minutes]) ||
                (hours <= 1 && ['h']) ||
                (hours < thresholds.h && ['hh', hours]) ||
                (days <= 1 && ['d']) ||
                (days < thresholds.d && ['dd', days]);

        if (thresholds.w != null) {
            a =
                a ||
                (weeks <= 1 && ['w']) ||
                (weeks < thresholds.w && ['ww', weeks]);
        }
        a = a ||
            (months <= 1 && ['M']) ||
            (months < thresholds.M && ['MM', months]) ||
            (years <= 1 && ['y']) || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof roundingFunction === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var withSuffix = false,
            th = thresholds,
            locale,
            output;

        if (typeof argWithSuffix === 'object') {
            argThresholds = argWithSuffix;
            argWithSuffix = false;
        }
        if (typeof argWithSuffix === 'boolean') {
            withSuffix = argWithSuffix;
        }
        if (typeof argThresholds === 'object') {
            th = Object.assign({}, thresholds, argThresholds);
            if (argThresholds.s != null && argThresholds.ss == null) {
                th.ss = argThresholds.s - 1;
            }
        }

        locale = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return (x > 0) - (x < 0) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000,
            days = abs$1(this._days),
            months = abs$1(this._months),
            minutes,
            hours,
            years,
            s,
            total = this.asSeconds(),
            totalSign,
            ymSign,
            daysSign,
            hmsSign;

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

        totalSign = total < 0 ? '-' : '';
        ymSign = sign(this._months) !== sign(total) ? '-' : '';
        daysSign = sign(this._days) !== sign(total) ? '-' : '';
        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return (
            totalSign +
            'P' +
            (years ? ymSign + years + 'Y' : '') +
            (months ? ymSign + months + 'M' : '') +
            (days ? daysSign + days + 'D' : '') +
            (hours || minutes || seconds ? 'T' : '') +
            (hours ? hmsSign + hours + 'H' : '') +
            (minutes ? hmsSign + minutes + 'M' : '') +
            (seconds ? hmsSign + s + 'S' : '')
        );
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asQuarters = asQuarters;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;

    proto$2.toIsoString = deprecate(
        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
        toISOString$1
    );
    proto$2.lang = lang;

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    //! moment.js

    hooks.version = '2.29.4';

    setHookCallback(createLocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD', // <input type="date" />
        TIME: 'HH:mm', // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW', // <input type="week" />
        MONTH: 'YYYY-MM', // <input type="month" />
    };

    return hooks;

})));

},{}]},{},[1])(1)
});
