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
var dataurl;
var jsonObj;
var g;
function start(e) {
    g = new JSGantt.GanttChart(document.getElementById("embedded-Gantt"), "month");
    if (g.getDivId() != null) {
        var newDataurl = document.getElementById("dataurl").value ? document.getElementById("dataurl").value : "./fixes/data.json";
        var vDebug = document.querySelector("#debug:checked") ? true : false;
        //vDebug = true;
        var vEditable = document.querySelector("#editable:checked") ? true : false;
        var vUseSort = document.querySelector("#sort:checked") ? true : false;
        var newtooltiptemplate = document.getElementById("tooltiptemplate").value ? document.getElementById("tooltiptemplate").value : null;
        var vColumnOrder = void 0;
        if (document.querySelector("#vColumnOrder").value) {
            vColumnOrder = document.querySelector("#vColumnOrder").value.split(",");
        }
        var vScrollTo = "today"; // or new Date() or a Date object with a specific date
        // SET LANG FROM INPUT
        lang = e && e.target ? e.target.value : "en";
        lang === 'fa' ? g.vMonthDaysArr = new Array(31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29)
            : g.vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        delay = document.getElementById("delay").value;
        vUseSingleCell = document.getElementById("useSingleCell").value;
        vShowRes = document.querySelector("#vShowRes:checked") ? 1 : 0;
        vShowCost = document.querySelector("#vShowCost:checked") ? 1 : 0;
        vShowAddEntries = document.querySelector("#vShowAddEntries:checked") ? 1 : 0;
        vShowComp = document.querySelector("#vShowComp:checked") ? 1 : 0;
        vShowDur = document.querySelector("#vShowDur:checked") ? 1 : 0;
        vShowStartDate = document.querySelector("#vShowStartDate:checked") ? 1 : 0;
        vShowEndDate = document.querySelector("#vShowEndDate:checked") ? 1 : 0;
        vShowPlanStartDate = document.querySelector("#vShowPlanStartDate:checked") ? 1 : 0;
        vShowPlanEndDate = document.querySelector("#vShowPlanEndDate:checked") ? 1 : 0;
        vShowTaskInfoLink = document.querySelector("#vShowTaskInfoLink:checked") ? 1 : 0;
        vShowEndWeekDate = document.querySelector("#vShowEndWeekDate:checked") ? 1 : 0;
        vTotalHeight = document.querySelector("#vTotalHeight").value || undefined;
        vShowWeekends = document.querySelector("#vShowWeekends:checked") ? 1 : 0;
        vMinDate = document.querySelector("#vMinDate").value;
        vMaxDate = document.querySelector("#vMaxDate").value;
        vAdditionalHeaders = {
            category: {
                title: "Category",
            },
            sector: {
                title: "Sector",
            },
        };
        g.setOptions({
            vCaptionType: "Complete",
            vQuarterColWidth: 36,
            vDateTaskDisplayFormat: "day dd month yyyy",
            vDayMajorDateDisplayFormat: "mon yyyy - Week ww",
            vWeekMinorDateDisplayFormat: "dd mon",
            vLang: lang,
            vUseSingleCell: vUseSingleCell,
            vShowRes: vShowRes,
            vShowCost: vShowCost,
            vShowAddEntries: vShowAddEntries,
            vShowComp: vShowComp,
            vShowDur: vShowDur,
            vShowStartDate: vShowStartDate,
            vShowEndDate: vShowEndDate,
            vShowPlanStartDate: vShowPlanStartDate,
            vShowPlanEndDate: vShowPlanEndDate,
            vTotalHeight: vTotalHeight,
            vMinDate: vMinDate,
            vMaxDate: vMaxDate,
            // EVENTs
            vEvents: {
                taskname: console.log,
                res: console.log,
                dur: console.log,
                comp: console.log,
                start: console.log,
                end: console.log,
                planstart: console.log,
                planend: console.log,
                cost: console.log,
                additional_category: console.log,
                beforeDraw: function () { return console.log("before draw listener"); },
                afterDraw: function () {
                    console.log("after draw listener");
                    if (document.querySelector("#customElements:checked")) {
                        drawCustomElements(g);
                    }
                },
            },
            vEventsChange: {
                taskname: editValue,
                res: editValue,
                dur: editValue,
                comp: editValue,
                start: editValue,
                end: editValue,
                planstart: editValue,
                planend: editValue,
                cost: editValue,
            },
            vEventClickRow: console.log,
            vEventClickCollapse: console.log,
            vResources: [
                { id: 0, name: "Anybody" },
                { id: 1, name: "Mario" },
                { id: 2, name: "Henrique" },
                { id: 3, name: "Pedro" },
            ],
            vShowTaskInfoLink: vShowTaskInfoLink,
            vShowEndWeekDate: vShowEndWeekDate,
            vShowWeekends: vShowWeekends,
            vTooltipDelay: delay,
            vTooltipTemplate: document.querySelector("#dynamicTooltip:checked") ? generateTooltip : newtooltiptemplate,
            vDebug: vDebug,
            vEditable: vEditable,
            vColumnOrder: vColumnOrder,
            vScrollTo: vScrollTo,
            vUseSort: vUseSort,
            vFormat: "month",
            vFormatArr: ["Day", "Week", "Month", "Quarter"],
        });
        //DELAY FROM INPUT
        // Teste manual add task
        // g.AddTaskItemObject({
        //   pID: 100,
        //   pName: "Task 1",
        //   pStart: "2018-09-05",
        //   pEnd: "2018-09-11",
        //   pLink: "",
        //   pClass: "gtaskgreen",
        //   pMile: 0,
        //   pComp: 100,
        //   pGroup: 0,
        //   pParent: 0,
        //   pOpen: 1,
        //   pNotes: "",
        //   category: 'test'
        // });
        // Parameters                     (pID, pName,                  pStart,       pEnd,        pStyle,         pLink (unused)  pLink: pMilpMile: e, pRes,       pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt)
        if (dataurl !== newDataurl) {
            dataurl = newDataurl;
            JSGantt.parseJSON(dataurl, g, vDebug).then(function (j) { return (jsonObj = j); });
        }
        else {
            JSGantt.addJSONTask(g, jsonObj);
        }
        /*
        // Add Custom tasks programatically
        g.AddTaskItem(new JSGantt.TaskItem(1, 'Task Objects', '', '', 'ggroupblack', '', 0, 'Shlomy', 40, 1, 0, '', '', '', '', g));
        g.AddTaskItem(new JSGantt.TaskItem(121, 'Constructor Proc', '2019-08-20', '2020-03-06', 'gtaskblue', '', 0, 'Brian T.', 60, 0, 1, 1, '', '', '', g));
        g.AddTaskItem(new JSGantt.TaskItem(122, 'Task Variables', '2019-08-20', '2020-03-06', 'gtaskred', '', 0, 'Brian', 60, 0, 1, 1, 121, '', '', g));
        g.AddTaskItem(new JSGantt.TaskItem(123, 'Task by Minute/Hour', '2019-08-20', '2020-03-06 12:00', 'gtaskyellow', '', 0, 'Ilan', 60, 0, 1, 1, '', '', '', g));
        g.AddTaskItem(new JSGantt.TaskItem(124, 'Task Functions', '2019-08-20', '2020-03-06', 'gtaskred', '', 0, 'Anyone', 60, 0, 1, 1, '123', 'This is a caption', null, g));
        */
        if (vDebug) {
            bd = new Date();
            console.log("before reloading", bd);
        }
        g.Draw();
        //JSGantt.criticalPath(jsonObj)
        if (vDebug) {
            var ad = new Date();
            console.log("after reloading: total time", ad, ad.getTime() - bd.getTime());
        }
    }
    else {
        alert("Error, unable to create Gantt Chart");
    }
    // document.getElementById("idMainLeft").onscroll = () => {
    //   scrollingTwoMains('idMainLeft', 'idMainRight');
    // };
    // document.getElementById('idMainRight').onscroll = () => {
    //   scrollingTwoMains('idMainRight', 'idMainLeft');
    // };
}
function scrollingTwoMains(mainMoving, mainMoved) {
    document.getElementById(mainMoved).scrollTop = document.getElementById(mainMoving).scrollTop;
}
function clearTasks() {
    g.ClearTasks();
    g.Draw();
}
function printTasksInConsole() {
    var tasks = g.vTaskList.map(function (e) { return (__assign(__assign({}, e.getAllData()), e.getDataObject())); });
    console.log(tasks);
}
function printChart() {
    var _a;
    var width, height;
    _a = document.querySelector("#print_page_size").value.split(","), width = _a[0], height = _a[1];
    g.printChart(width, height);
}
function editValue(list, task, event, cell, column) {
    console.log(list, task, event, cell, column);
    var found = list.find(function (item) { return item.pID == task.getOriginalID(); });
    if (!found) {
        return;
    }
    else {
        found[column] = event ? event.target.value : "";
    }
}
function drawCustomElements(g) {
    for (var _i = 0, _a = g.getList(); _i < _a.length; _i++) {
        var item = _a[_i];
        var dataObj = item.getDataObject();
        if (dataObj && dataObj.deadline) {
            var x = g.chartRowDateToX(new Date(dataObj.deadline));
            var td = item.getChildRow().querySelector("td");
            td.style.position = "relative";
            var div = document.createElement("div");
            div.style.left = x + "px";
            div.classList.add("deadline-line");
            td.appendChild(div);
        }
    }
}
function generateTooltip(task) {
    // default tooltip for level 1
    if (task.getLevel() === 1)
        return;
    // string tooltip for level 2. Show completed/total child count and current timestamp
    if (task.getLevel() === 2) {
        var childCount = 0;
        var complete = 0;
        for (var _i = 0, _a = g.getList(); _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.getParent() == task.getID()) {
                if (item.getCompVal() === 100) {
                    complete++;
                }
                childCount++;
            }
        }
        console.log("Generated dynamic sync template for '" + task.getName() + "'");
        return "\n      <dl>\n        <dt>Name:</dt><dd>{{pName}}</dd>\n        <dt>Complete child tasks:</dt><dd style=\"color:" + (complete === childCount ? "green" : "red") + "\">" + complete + "/" + childCount + "</dd>\n        <dt>Tooltip generated at:</dt><dd>" + new Date() + "</dd>\n      </dl>\n    ";
    }
    // async tooltip for level 3 and below
    return new Promise(function (resolve, reject) {
        var delay = Math.random() * 3000;
        setTimeout(function () {
            console.log("Generated dynamic async template for '" + task.getName() + "'");
            resolve("Tooltip content from the promise after " + Math.round(delay) + "ms");
        }, delay);
    });
}
start("pt");
//# sourceMappingURL=index.js.map