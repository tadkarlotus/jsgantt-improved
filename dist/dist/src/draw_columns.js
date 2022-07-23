"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.draw_task_headings = exports.draw_bottom = exports.draw_header = exports.GanttOptionsValue = exports.GantDatepicker = exports.COLUMN_ORDER = void 0;
var date_utils_1 = require("./utils/date_utils");
var task_1 = require("./task");
var events_1 = require("./events");
var draw_utils_1 = require("./utils/draw_utils");
var persian_datepicker_1 = require("@ms.shafaei/persian-datepicker");
var moment = require("moment-jalaali");
var jquery = require("jquery");
// this helps TypeScript to understand jQuery best !!!  otherwise It will confused .
var $ = jquery;
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
var GantDatepicker = /** @class */ (function (_super) {
    __extends(GantDatepicker, _super);
    function GantDatepicker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GantDatepicker;
}(persian_datepicker_1.default));
exports.GantDatepicker = GantDatepicker;
var GanttOptionsValue = /** @class */ (function () {
    function GanttOptionsValue() {
    }
    return GanttOptionsValue;
}());
exports.GanttOptionsValue = GanttOptionsValue;
exports.draw_header = function (column, i, vTmpRow, vTaskList, vEditable, vEventsChange, vEvents, vDateTaskTableDisplayFormat, vAdditionalHeaders, vFormat, vLangs, vLang, vResources, Draw) {
    var vTmpCell, vTmpDiv;
    if ('vShowRes' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gres');
        var text = draw_utils_1.makeInput(vTaskList[i].getResource(), vEditable, 'resource', vTaskList[i].getResource(), vResources, vLang);
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setResource(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'res', Draw, 'change');
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'res');
    }
    if ('vShowDur' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gdur');
        var text = draw_utils_1.makeInput(vTaskList[i].getDuration(vFormat, vLangs[vLang], vLang), vEditable, 'text', vTaskList[i].getDuration(), null, vLang);
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setDuration(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'dur', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'dur');
    }
    if ('vShowComp' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gcomp');
        var text = draw_utils_1.makeInput(vTaskList[i].getCompStr(), vEditable, 'percentage', vTaskList[i].getCompVal(), null, vLang);
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { task.setComp(e.target.value); task.setCompVal(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'comp', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'comp');
    }
    if ('vShowStartDate' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gstartdate');
        var v = date_utils_1.formatDateStr(vTaskList[i].getStartVar(), vDateTaskTableDisplayFormat, vLangs[vLang], this.vLang);
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getStartVar(), null, vLang, vTaskList[i].getID());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = null;
        if (vLang === 'fa') {
            // callback = (task, e) => console.log(e.target.value);
            var ganttOptions = new GanttOptionsValue();
            ganttOptions.onChange = function (selectedDate, self) {
                console.log(selectedDate);
                if (!self.task)
                    return;
                var date = moment(selectedDate[0]);
                self.task.setStart(date.format('YYYY-MM-DD'));
                // self.dateInputElement.value = date.format('jYYYY-jMM-jDD');
                document.getElementById(self.dateInputElement.id).value = date.format('jYYYY/jMM/jDD');
                self.onAfterDateSelected(selectedDate, self);
            };
            ganttOptions.onClick = function (selectedDate, self) {
                console.log(selectedDate);
            };
            ganttOptions.defaultValue = false;
            ganttOptions.autoClose = true;
            ganttOptions.minDate = false;
            ganttOptions.maxDate = false;
            var persianDatePicker = new GantDatepicker(vTmpDiv.children[0], ganttOptions);
            persianDatePicker.task = vTaskList[i];
            persianDatePicker.dateInputElement = vTmpDiv.children[0];
            window['persianDatePickers'].push(persianDatePicker);
            events_1.addListenerPersianDateCell(persianDatePicker, vTmpCell, vEventsChange, callback, vTaskList, i, 'start', Draw);
        }
        else {
            callback = function (task, e) { return task.setStart(e.target.value); };
            events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'start', Draw);
        }
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'start');
    }
    if ('vShowEndDate' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'genddate');
        var v = date_utils_1.formatDateStr(vTaskList[i].getEndVar(), vDateTaskTableDisplayFormat, vLangs[vLang], this.vLang);
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getEndVar(), null, vLang, vTaskList[i].getID());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = null;
        if (vLang === 'fa') {
            // callback = (task, e) => console.log(e.target.value);
            var ganttOptions = new GanttOptionsValue();
            ganttOptions.onChange = function (selectedDate, self) {
                console.log(selectedDate);
                if (!self.task)
                    return;
                var date = moment(selectedDate[0]);
                self.task.setEnd(date.format('YYYY-MM-DD'));
                // self.dateInputElement.value = date.format('jYYYY-jMM-jDD');
                document.getElementById(self.dateInputElement.id).value = date.format('jYYYY/jMM/jDD');
                self.onAfterDateSelected(selectedDate, self);
            };
            ganttOptions.onClick = function (selectedDate, self) {
                console.log(selectedDate);
            };
            ganttOptions.defaultValue = false;
            ganttOptions.autoClose = true;
            ganttOptions.minDate = false;
            ganttOptions.maxDate = false;
            var persianDatePicker = new GantDatepicker(vTmpDiv.children[0], ganttOptions);
            persianDatePicker.task = vTaskList[i];
            persianDatePicker.dateInputElement = vTmpDiv.children[0];
            window['persianDatePickers'].push(persianDatePicker);
            events_1.addListenerPersianDateCell(persianDatePicker, vTmpCell, vEventsChange, callback, vTaskList, i, 'end', Draw);
        }
        else {
            callback = function (task, e) { return task.setEnd(e.target.value); };
            events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'end', Draw);
        }
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'end');
    }
    if ('vShowPlanStartDate' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gplanstartdate');
        var v = vTaskList[i].getPlanStart() ? date_utils_1.formatDateStr(vTaskList[i].getPlanStart(), vDateTaskTableDisplayFormat, vLangs[vLang], this.vLang) : '';
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getPlanStart(), null, vLang, vTaskList[i].getID());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        // const callback = (task, e) => task.setPlanStart(e.target.value);
        var callback = null;
        if (vLang === 'fa') {
            // callback = (task, e) => console.log(e.target.value);
            // let ganttOptions = new GanttOptionsValue()
            // ganttOptions.onChange = function (selectedDate: ISelectedDates, self: GantDatepicker): void {
            //   console.log(selectedDate);
            //   if (!self.task) return;
            //   let date = moment(selectedDate[0]);
            //   self.task.setPlanStart(date.format('YYYY-MM-DD'));
            //   // self.dateInputElement.value = date.format('jYYYY-jMM-jDD');
            //   (document.getElementById(self.dateInputElement.id) as HTMLInputElement).value = date.format('jYYYY/jMM/jDD');
            //   self.onAfterDateSelected(selectedDate, self);
            // };
            // ganttOptions.onClick = function (selectedDate: ISelectedDates, self: GantDatepicker): void {
            //   console.log(selectedDate);
            // };
            // ganttOptions.defaultValue = false;
            // ganttOptions.autoClose = true;
            // ganttOptions.minDate = false;
            // ganttOptions.maxDate = false;
            // let persianDatePicker = new GantDatepicker(vTmpDiv.children[0], ganttOptions);
            // persianDatePicker.task = vTaskList[i];
            // persianDatePicker.dateInputElement = vTmpDiv.children[0];
            // window['persianDatePickers'].push(persianDatePicker);
            // $(vTmpDiv.children[0]).pDatepicker();
            // ($(vTmpDiv.children[0]) as any).pDatepicker();
            $(vTmpDiv.children[0]).pDatepicker();
            // //vTmpDiv.children[0].pDatepicker();      
            events_1.addListenerPersianDateCell(vTmpDiv.children[0], vTmpCell, vEventsChange, callback, vTaskList, i, 'planstart', Draw);
        }
        else {
            callback = function (task, e) { return task.setPlanStart(e.target.value); };
            events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'planstart', Draw);
        }
        // addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'planstart', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'planstart');
    }
    if ('vShowPlanEndDate' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gplanenddate');
        var v = vTaskList[i].getPlanEnd() ? date_utils_1.formatDateStr(vTaskList[i].getPlanEnd(), vDateTaskTableDisplayFormat, vLangs[vLang], this.vLang) : '';
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getPlanEnd(), null, vLang, vTaskList[i].getID());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        // const callback = (task, e) => task.setPlanEnd(e.target.value);
        var callback = null;
        if (vLang === 'fa') {
            // callback = (task, e) => console.log(e.target.value);
            var ganttOptions = new GanttOptionsValue();
            ganttOptions.onChange = function (selectedDate, self) {
                console.log(selectedDate);
                if (!self.task)
                    return;
                var date = moment(selectedDate[0]);
                self.task.setPlanEnd(date.format('YYYY-MM-DD'));
                // self.dateInputElement.value = date.format('jYYYY-jMM-jDD');
                document.getElementById(self.dateInputElement.id).value = date.format('jYYYY/jMM/jDD');
                self.onAfterDateSelected(selectedDate, self);
            };
            ganttOptions.onClick = function (selectedDate, self) {
                console.log(selectedDate);
            };
            ganttOptions.defaultValue = false;
            ganttOptions.autoClose = true;
            ganttOptions.minDate = false;
            ganttOptions.maxDate = false;
            var persianDatePicker = new GantDatepicker(vTmpDiv.children[0], ganttOptions);
            persianDatePicker.task = vTaskList[i];
            persianDatePicker.dateInputElement = vTmpDiv.children[0];
            window['persianDatePickers'].push(persianDatePicker);
            events_1.addListenerPersianDateCell(persianDatePicker, vTmpCell, vEventsChange, callback, vTaskList, i, 'planend', Draw);
        }
        else {
            callback = function (task, e) { return task.setPlanEnd(e.target.value); };
            events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'planend', Draw);
        }
        // addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'planend', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'planend');
    }
    if ('vShowCost' === column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gcost');
        var text = draw_utils_1.makeInput(vTaskList[i].getCost(), vEditable, 'cost', null, null, vLang);
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
//# sourceMappingURL=draw_columns.js.map