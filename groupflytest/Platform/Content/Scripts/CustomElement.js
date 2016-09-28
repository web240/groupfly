var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//【自定义标签】基类
var CustomElement = (function () {
    function CustomElement(extension) {
        //默认方法
        this.defaultMethod = "function() { }";
        //默认属性
        this.defaultProperty = "{ attribute: {} }";
        this.extension = extension ? extension : {};
        this.properties = new Array();
        this.methods = new Array();
        this.addProperties("name,elementname,state,containerid,viewmodel,customattr,onaftercreate,onafterinsert,onafterremove,onafterattributechange,onbeforeinit,onafterinit");
        this.addboolProperty("isCustomElement");
        this.addboolProperty("initCompleted");
        this.addMethods("enable,disable,setValue,getValue");
        this.addMethod("init", "function() { control.initContent(this); this.initCompleted = true; }");
        this.addMethod("registerEventHandler", "function(name, func) { this.xtag[name] = func; }");
        this.addMethod("triggerEventHandler", "function(name, params) { if(this.xtag[name]) this.xtag[name](params); }");
        this.addMethod("set", "function(name, obj) { this.xtag[name] = obj; }");
        this.addMethod("get", "function(name) { return this.xtag[name]; }");
        this.addMethod("setCustomAttr", "function(attr,value){ this.get(\"customAttrObj\")[attr] = value; }");
        this.addMethod("getCustomAttr", "function(attr){ return this.get(\"customAttrObj\")[attr]; }");
        this.addMethod("createLinkbutton", "function(text, iconCls, onclick){ return control.createLinkbutton(text, iconCls, onclick); }");
        /*this.addMethod("initContent", `function() {  control.initContent(this);  }`);
        this.addMethod("initContent", `function(node) {
                                            if(!node){ node = this; }
                                            if(node.hasChildNodes){
                                                var sonnodes = node.childNodes;
                                                for (var i = 0; i < sonnodes.length; i++) {
                                                    var sonnode = sonnodes.item(i);
                                                    if(sonnode.isCustomElement){
                                                        sonnode.initContent();
                                                    }
                                                    else{
                                                        this.initContent(sonnode);
                                                    }
                                                }
                                            }
                                            if(node.isCustomElement && !node.initCompleted){
                                                 control.initContent(node);
                                                 node.initCompleted = true;
                                                 alert(control.elementName);
                                            }
                                        }`);*/
    }
    //添加属性
    CustomElement.prototype.addProperty = function (name, value) {
        if (name) {
            if (!value) {
                value = this.defaultProperty;
            }
            this.properties[name] = value;
        }
    };
    //添加bool属性
    CustomElement.prototype.addboolProperty = function (name) {
        this.addProperty(name, "{ attribute: { boolean:true } }");
    };
    //批量添加属性
    CustomElement.prototype.addProperties = function (names) {
        var nameArray = names.split(',');
        for (var key in nameArray) {
            this.addProperty(nameArray[key]);
        }
    };
    //批量添加属性
    CustomElement.prototype.addboolProperties = function (names) {
        var nameArray = names.split(',');
        for (var key in nameArray) {
            this.addboolProperty(nameArray[key]);
        }
    };
    //添加方法
    CustomElement.prototype.addMethod = function (name, value) {
        if (name) {
            if (!value) {
                value = this.defaultMethod;
            }
            this.methods[name] = value;
        }
    };
    //批量添加方法
    CustomElement.prototype.addMethods = function (names) {
        var nameArray = names.split(',');
        for (var key in nameArray) {
            this.addMethod(nameArray[key]);
        }
    };
    //注册属性
    CustomElement.prototype.setProperties = function () {
        var accessors = "";
        for (var key in this.properties) {
            if (accessors == "") {
                accessors = key + ":" + this.properties[key];
            }
            else {
                accessors += "," + key + ":" + this.properties[key];
            }
        }
        return accessors;
    };
    //注册方法
    CustomElement.prototype.setMethods = function () {
        var methods = "";
        for (var key in this.methods) {
            if (methods == "") {
                methods = key + ":" + this.methods[key];
            }
            else {
                methods += "," + key + ":" + this.methods[key];
            }
        }
        return methods;
    };
    CustomElement.prototype.createLinkbutton = function (text, iconCls, onclick) {
        var tool = document.createElement("a");
        $(tool).css("margin", "2px");
        tool.innerText = text;
        $(tool).linkbutton({
            iconCls: iconCls + " iconfont"
        });
        $(tool).bind('click', function () {
            if (!$(this).linkbutton('options').disabled) {
                onclick();
            }
        });
        return tool;
    };
    //创建内容
    CustomElement.prototype.initContent = function (element) { };
    //创建后事件
    CustomElement.prototype.create = function (element) {
        var control = this;
        $(element).ready(function () {
            if (control.extension.beforeInit) {
                control.extension.beforeInit(element);
            }
            element.triggerEventHandler("onbeforeinit");
            if (element.onbeforeinit) {
                eval(element.onbeforeinit);
            }
            if (!element.initCompleted) {
                control.initContent(element);
                if (!element.id) {
                    element.id = control.GetUniqueId(control.elementName);
                }
                element.initCompleted = true;
            }
            if (control.extension.afterInit) {
                control.extension.afterInit(element);
            }
            element.triggerEventHandler("onafterinit");
            if (element.onafterinit) {
                eval(element.onafterinit);
            }
        });
    };
    //插入后事件
    CustomElement.prototype.insert = function (element) { };
    //属性修改后事件
    CustomElement.prototype.attributeChange = function (element, attrName, oldValue, newValue) { };
    //移除后事件
    CustomElement.prototype.remove = function (element) { };
    //注册元素
    CustomElement.prototype.register = function () {
        if (!xtag.tags[this.elementName.toLowerCase()]) {
            var accessors = this.setProperties();
            var methods = this.setMethods();
            var extendsfrom = this.extends ? "extends: '" + this.extends + "'," : "";
            var control = this;
            eval("xtag.register(control.elementName, {\n                " + extendsfrom + "\n                content: control.content,\n                accessors: {" + accessors +
                "},\n                lifecycle: {\n                    created: function () {\n                        if(this.customattr) {  this.set(\"customAttrObj\", control.stringToObject(this.customattr)); }\n                        else { this.set(\"customAttrObj\",{}); }\n\n                        this.isCustomElement = true;\n                        this.elementname = control.elementName.toLowerCase();\n\n                        control.create(this);\n                        if (control.extension.afterCreate) {\n                            control.extension.afterCreate(this);\n                        }\n                        if(this.onaftercreate){\n                            eval(this.onaftercreate);\n                        }\n                    },\n                    inserted: function () {\n                        control.insert(this);\n                        if (control.extension.afterInsert) {\n                            control.extension.afterInsert(this);\n                        }\n                        if(this.onafterinsert){\n                            eval(this.onafterinsert);\n                        }\n                    },\n                    removed: function () {\n                        control.remove(this);\n                        if (control.extension.afterRemove) {\n                            control.extension.afterRemove(this);\n                        }\n                        if(this.onafterremove){\n                            eval(this.onafterremove);\n                        }\n                    },\n                    attributeChanged: function (attrName, oldValue, newValue) {\n                        control.attributeChange(this,attrName, oldValue, newValue);\n                        if (control.extension.afterAttributeChange) {\n                            control.extension.afterAttributeChange(this,attrName,oldValue,newValue);\n                        }\n                        if(this.onafterattributechange){\n                            eval(this.onafterattributechange);\n                        }\n                    }\n                },\n                methods: {" + methods + "\n                }\n            });");
        }
    };
    //查询对象属性数
    CustomElement.prototype.getPropertyCount = function (obj, exceptions) {
        var count = 0;
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (!exceptions || exceptions.indexOf(i) < 0) {
                    count++;
                }
            }
        }
        return count;
    };
    //字符串转对象
    CustomElement.prototype.stringToObject = function (str) {
        return eval("(" + str + ")");
    };
    //生成控件Id
    CustomElement.prototype.GetUniqueId = function (prefix) {
        return prefix + Date.parse(new Date().toString()).toString(16) + Math.floor(Math.random() * 10000);
    };
    //
    CustomElement.prototype.isString = function (obj) {
        return Object.prototype.toString.call(obj) === "[object String]";
    };
    return CustomElement;
}());
//【对象详情弹出框】
var GfDialog = (function (_super) {
    __extends(GfDialog, _super);
    function GfDialog(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-Dialog";
        this.addboolProperty("modal");
        this.addProperties("title,width,height,editurl,dataurl");
        this.addMethod("open", "function(id, state, title){ \n                                    var div = this.get('div');\n                                    this.title = title ? title : '\u5BF9\u8C61\u8BE6\u60C5'; \n                                    $(div).dialog({ title: this.title }); \n                                    this.set('key',id); \n                                    this.load(state); \n                                }");
        this.addMethod("close", "function(){ $(this.get('div')).dialog('close'); }");
        this.addMethod("load", "function(state) {  \n                                    var div = this.get('div');\n                                    this.state = state;\n                                    $(div).load(this.dataurl + \"?key=\" + this.get('key') + \"&state=\" + state); \n                                    $(div).dialog('open'); \n                                    control.setState(this);\n                                }");
        this.addMethod("editObjekt", "function(obj) {\n                                           var form = this;\n                                           var objStr = JSON.stringify(obj);\n                                           platformAjax({\n                                                url: form.editurl,\n                                                data:{key:form.get('key'),obj:objStr},\n                                                success: function(result) {\n                                                    form.load(\"read\");\n                                                }\n                                            });\n                                        }");
    }
    GfDialog.prototype.setState = function (element) {
        var toolbarid = element.get("toolbarid");
        var edit = document.getElementById(toolbarid + "edit");
        var save = document.getElementById(toolbarid + "save");
        var read = document.getElementById(toolbarid + "read");
        if (element.state == "edit") {
            $(edit).hide();
            $(save).show();
            $(read).show();
        }
        else {
            $(edit).show();
            $(save).hide();
            $(read).hide();
        }
    };
    GfDialog.prototype.initContent = function (element) {
        var div = document.createElement("div");
        element.set("div", div);
        element.appendChild(div);
        var toolbarid = this.GetUniqueId("toolbar");
        element.set("toolbarid", toolbarid);
        var control = this;
        $(div).css("padding", "2px");
        $(div).dialog({
            title: element.title || 'Dialog',
            width: element.width || 800,
            height: element.height || 600,
            closed: true,
            cache: false,
            toolbar: [{
                    id: toolbarid + "edit",
                    text: '编辑',
                    iconCls: 'fa fa-pencil-square-o',
                    handler: function () { element.load("edit"); }
                }, {
                    id: toolbarid + "save",
                    text: '保存',
                    iconCls: 'fa fa-floppy-o',
                    handler: function () {
                        if (element.state == "edit") {
                            var div = element.get("div");
                            var form = $(div).find("form");
                            element.editObjekt($(form).serializeArray());
                        }
                        else {
                            element.load("read");
                        }
                    }
                }, {
                    id: toolbarid + "read",
                    text: '浏览',
                    iconCls: 'fa fa-picture-o',
                    handler: function () { element.load("read"); }
                }],
            modal: element.modal
        });
    };
    return GfDialog;
}(CustomElement));
//【页面】
var GfPage = (function (_super) {
    __extends(GfPage, _super);
    function GfPage(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-Page";
        this.extends = "body";
        this.addProperties("dataurl,editurl");
        this.addMethod("openObjDetail", "function (groupid, objid, state, title) {\n                                            var existeddialog = document.querySelector(\"#\" + groupid + \"dialog\");\n                                            if (existeddialog) {\n                                                existeddialog.open(objid, state, title);\n                                            } else {\n                                                var dialog = document.createElement(\"Gf-Dialog\");\n                                                $(dialog).attr(\"id\", groupid + \"dialog\");\n                                                $(dialog).attr(\"dataurl\", this.dataurl);\n                                                $(dialog).attr(\"editurl\", this.editurl);\n\n                                                document.body.appendChild(dialog);\n                                                document.querySelector(\"#\" + groupid + \"dialog\").open(objid, state, title);\n                                            }\n                                        }");
        this.addMethod("openPage", "function (id, url, title) {\n                                            var tabs = document.querySelector(\"#frametabs\");\n                                            tabs.add(id, title, url, \"\");\n                                        }");
    }
    return GfPage;
}(CustomElement));
//【文本框】
var GfInput = (function (_super) {
    __extends(GfInput, _super);
    function GfInput(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-Input";
        this.addProperties("width,disabled");
        this.addboolProperty("readonly");
        this.addboolProperty("disabled");
        this.methods["disable"] = "function() {   $(this.xtag.input).textbox('disable'); }";
        this.methods["enable"] = "function() {   $(this.xtag.input).textbox('enable'); }";
        this.methods["setValue"] = "function(val) {   $(this.xtag.input).textbox('setValue', val); }";
        this.methods["getValue"] = "function() {  return $(this.xtag.input).textbox('getValue'); }";
        this.addMethod("setReadOnly", "function(isReadOnly) {  $(this.xtag.input).textbox('readonly',isReadOnly); }");
    }
    GfInput.prototype.buildinput = function (element) {
        var input = document.createElement("input");
        $(input).attr("name", $(element).attr("name"));
        $(input).val($(element).attr("value"));
        element.appendChild(input);
        element.xtag.input = input;
        return input;
    };
    GfInput.prototype.initContent = function (element) {
        var input = this.buildinput(element);
        $(input).textbox({
            width: element.width || 170,
            disabled: element.disabled,
            editable: !element.readonly,
            onChange: function (newValue, oldValue) {
                element.triggerEventHandler("onafterchange", [newValue, oldValue]);
            }
        });
    };
    return GfInput;
}(CustomElement));
//【多行文本域】
var GfText = (function (_super) {
    __extends(GfText, _super);
    function GfText(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-Text";
    }
    GfText.prototype.initContent = function (element) {
        var input = this.buildinput(element);
        $(input).textbox({
            width: element.width || 170,
            multiline: true
        });
    };
    return GfText;
}(GfInput));
//【整数输入框】
var GfIntInput = (function (_super) {
    __extends(GfIntInput, _super);
    function GfIntInput(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-IntInput";
        this.addProperties("min,max");
        this.defaultMaxValue = 2147483647;
        this.defaultMinValue = -2147483648;
        this.precision = 0;
    }
    GfIntInput.prototype.initContent = function (element) {
        var max = parseInt($(element).attr("max"));
        var min = parseInt($(element).attr("min"));
        if (!max || max > this.defaultMaxValue)
            max = this.defaultMaxValue;
        if (!min || min < this.defaultMinValue)
            min = this.defaultMinValue;
        var input = this.buildinput(element);
        $(input).numberbox({
            min: min,
            max: max,
            width: element.width || 170,
            precision: this.precision,
            onChange: function (value) {
                element.triggerEventHandler("onafterchange");
            }
        });
    };
    return GfIntInput;
}(GfInput));
//【大整数输入框】
var GfBigIntInput = (function (_super) {
    __extends(GfBigIntInput, _super);
    function GfBigIntInput(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-BigIntInput";
        this.defaultMaxValue = 9223372036854775807;
        this.defaultMinValue = -9223372036854775808;
    }
    return GfBigIntInput;
}(GfIntInput));
//【小数输入框】
var GfNumberInput = (function (_super) {
    __extends(GfNumberInput, _super);
    function GfNumberInput(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-NumberInput";
        this.precision = 6;
    }
    return GfNumberInput;
}(GfBigIntInput));
//【日期选择】
var GfDatePicker = (function (_super) {
    __extends(GfDatePicker, _super);
    function GfDatePicker(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-DatePicker";
    }
    GfDatePicker.prototype.initContent = function (element) {
        var input = this.buildinput(element);
        $(input).datebox({
            width: element.width || 170,
            editable: false,
            formatter: function (date) { return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(); },
            parser: function (s) {
                var t = Date.parse(s);
                if (!isNaN(t)) {
                    return new Date(t);
                }
                else {
                    return new Date();
                }
            },
            onChange: function (value) {
                element.triggerEventHandler("onafterchange", [value]);
            }
        });
    };
    return GfDatePicker;
}(GfInput));
//【日期时间选择】
var GfDateTimePicker = (function (_super) {
    __extends(GfDateTimePicker, _super);
    function GfDateTimePicker(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-DateTimePicker";
    }
    GfDateTimePicker.prototype.initContent = function (element) {
        var input = this.buildinput(element);
        $(input).datetimebox({
            width: element.width || 170,
            editable: false,
            formatter: function (date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                var h = date.getHours();
                var mi = date.getMinutes();
                var s = date.getSeconds();
                function formatNumber(value) {
                    return (value < 10 ? '0' : '') + value;
                }
                return y + '/' + m + '/' + d + ' ' + formatNumber(h) + ':' + formatNumber(mi) + ':' + formatNumber(s);
            },
            parser: function (s) {
                var t = Date.parse(s);
                if (!isNaN(t)) {
                    return new Date(t);
                }
                else {
                    return new Date();
                }
            },
            onChange: function (value) {
                element.triggerEventHandler("onafterchange", [value]);
            }
        });
        var name = this.elementName;
    };
    return GfDateTimePicker;
}(GfDatePicker));
//【时间选择】
var GfTimePicker = (function (_super) {
    __extends(GfTimePicker, _super);
    function GfTimePicker(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-TimePicker";
    }
    GfTimePicker.prototype.initContent = function (element) {
        var input = this.buildinput(element);
        $(input).timespinner({
            width: element.width || 140,
            showSeconds: true,
            onChange: function (value) {
                element.triggerEventHandler("onafterchange", [value]);
            }
        });
    };
    return GfTimePicker;
}(GfInput));
//【布尔选择】
var GfToggle = (function (_super) {
    __extends(GfToggle, _super);
    function GfToggle(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-Toggle";
        this.addProperty("checked", "{ attribute: {}, get: function()  { return $(this.xtag.input).attr('checked') == 'checked';}, set: function(val)  { this.setValue(val); } }");
        this.methods["disable"] = "function() {   $(this.xtag.input).attr('disabled','disabled'); }";
        this.methods["enable"] = "function() {   $(this.xtag.input).removeAttr('disabled'); }";
        this.methods["setValue"] = "function(val) { $(this.xtag.input).prop('checked',(val && val.toString().toLowerCase()  == 'true')); }";
        this.methods["getValue"] = "function() {   return $(this.xtag.input).prop('checked');}";
    }
    GfToggle.prototype.initContent = function (element) {
        var div = document.createElement("div");
        $(div).addClass("datagrid-cell-check");
        var input = document.createElement("input");
        $(input).attr("name", $(element).attr("name"));
        $(input).attr("type", "checkbox");
        var value = $(element).attr("value");
        if (value && value.toString().toLowerCase() == "true") {
            $(input).attr("checked", "checked");
        }
        $(input).val(value);
        $(input).change(function () {
            if ($(input).prop('checked')) {
                $(input).val("true");
            }
            else {
                $(input).val("false");
            }
            element.triggerEventHandler("onafterchange");
        });
        var hiddenValue = document.createElement("input");
        $(hiddenValue).attr("name", $(element).attr("name"));
        $(hiddenValue).attr("type", "hidden");
        $(hiddenValue).val("false");
        div.appendChild(hiddenValue);
        div.appendChild(input);
        element.xtag.input = input;
        element.appendChild(div);
    };
    return GfToggle;
}(CustomElement));
//【表格】
var GfDataGrid = (function (_super) {
    __extends(GfDataGrid, _super);
    function GfDataGrid(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-DataGrid";
        this.addProperties("loadmsg,title,width,height,klass,idfield,namefield,dataurl,saveurl,exporturl,detailurl");
        this.addboolProperties("tools,autoselect,singleselect,showquery");
        this.addProperty("toolbar", "{ attribute: {}, get: function()  { return this.xtag.toolbar;} }");
        this.addMethod("beginEditRow", "function(index) { $(this.xtag.table).datagrid('beginEdit', index);}");
        this.addMethod("endEditRow", "function(index) { $(this.xtag.table).datagrid('endEdit', index);}");
        this.addMethod("endEditRows", "function(index)  {  \n                                            var rows = this.getRows();\n                                            for(var key in rows){\n                                                var row = rows[key];\n                                                var rowindex = this.getRowIndex(row);\n                                                if(index != rowindex)\n                                                    this.endEditRow(rowindex);\n                                            } \n                                        }");
        this.addMethod("refreshRow", "function(index) { $(this.xtag.table).datagrid('refreshRow', index);}");
        this.addMethod("selectRow", "function(index) { $(this.xtag.table).datagrid('selectRow', index);}");
        this.addMethod("unSelectRow", "function(index) { $(this.xtag.table).datagrid('unselectRow', index);}");
        this.addMethod("unSelectRows", "function(index) {  \n                                            var rows = this.getRows();\n                                            for(var key in rows){\n                                                var row = rows[key];\n                                                var rowindex = this.getRowIndex(row);\n                                                if(index != rowindex)\n                                                    this.unSelectRow(rowindex);\n                                            } \n                                        }");
        this.addMethod("getPager", "function() { return $(this.xtag.table).datagrid('getPager'); }");
        this.addMethod("getRows", "function() { return $(this.xtag.table).datagrid('getRows'); }");
        this.addMethod("getSelectedRow", "function() { return $(this.xtag.table).datagrid('getSelected'); }");
        this.addMethod("getSelectedRows", "function() { return $(this.xtag.table).datagrid('getSelections'); }");
        this.addMethod("getRowIndex", "function(row) { return $(this.xtag.table).datagrid('getRowIndex',row); }");
        this.addMethod("cancelEditRow", "function(index) { $(this.xtag.table).datagrid('cancelEdit', index);}");
        this.addMethod("cancelEditRows", "function(index) {  \n                                            var rows = this.getRows();\n                                            for(var key in rows){\n                                                var row = rows[key];\n                                                if(row.editing){\n                                                    var rowindex = this.getRowIndex(row);\n                                                    if(index != rowindex)\n                                                        this.cancelEditRow(rowindex);\n                                                } \n                                            } \n                                        }");
        this.addMethod("select", "function(index) {  $(this.xtag.pager).pagination('select',index); }");
        this.addMethod("loadData", "function(data) { $(this.xtag.table).datagrid('loadData',data); this.restoreQueryState();}");
        this.addMethod("loading", "function() { $(this.xtag.table).datagrid('loading'); }");
        this.addMethod("loaded", "function() { $(this.xtag.table).datagrid('loaded'); }");
        this.addMethod("reload", "function() { this.loadDataPage(this.xtag.currentPage, this.xtag.currentRows); }");
        this.addMethod("reloadstatic", "function() { this.loadData(this.getData()); }");
        this.addMethod("getData", "function() { return $(this.xtag.table).datagrid('getData'); }");
        this.addMethod("loadDataPage", "function(page, rows) {\n                                            if(page < 1) page = 1;\n                                            var grid = this;\n                                            grid.loading();\n                                            this.xtag.currentPage = page;\n                                            this.xtag.currentRows = rows;\n                                            var param = this.xtag.params ? this.xtag.params.concat(this.xtag.outParams) : this.xtag.outParams;\n                                            var paramstring = param.length > 0 ? JSON.stringify(param) : \"\";\n                                            platformAjax({\n                                                url: grid.dataurl,\n                                                data:{ page:page, rows:rows, param:paramstring },\n                                                success: function(result) {\n                                                    var data = JSON.parse(result.Data);\n                                                    $(data.rows).each(function(){\n                                                        this.customRowId = control.GetUniqueId(\"row\");\n                                                    });\n                                                    grid.xtag.data = JSON.stringify(data.rows); \n                                                    grid.loadData(data);\n                                                    grid.loaded();\n                                                    grid.set('hasChange', false);\n                                                    grid.set('changes', {});\n                                                },\n                                                error: function(result) {\n                                                    grid.loaded();\n                                                    document.write(result.responseText);\n                                                }\n                                            });\n                                        }");
        this.addMethod("restoreQueryState", "function() {\n                                            var columns = this.xtag.columns[0];\n                                            $(columns).each(function() {\n                                                if(!this.hidden && this.param){\n                                                    this.query.setValue(this.param);\n                                                }\n                                            });\n                                        }");
        this.addMethod("queryData", "function(outParams) {\n                                            if(outParams){\n                                                this.set(\"outParams\",outParams);\n                                            }\n                                            var params = new Array();\n                                            var columns = this.xtag.columns[0];\n                                            $(columns).each(function() {\n                                                if(!this.hidden && this.query){\n                                                    var param = this.query[\"getValue\"]();\n                                                    if(param){\n                                                        params.push(param);\n                                                    }\n                                                    this.param = param;\n                                                }\n                                            });\n                                            this.xtag.params = params;\n                                            this.select(1);\n                                            \n                                        }");
        this.addMethod("deleteRow", "function(row) {\n                                        var index = this.getRowIndex(row);\n                                        $(this.xtag.table).datagrid('deleteRow', index);\n                                     }");
        this.addMethod("insertRow", "function(obj) {  $(this.xtag.table).datagrid('insertRow', obj);  }");
        this.addMethod("exportExcel", "function() {\n                                            var grid = this;\n                                            var param = this.xtag.params ? JSON.stringify(this.xtag.params) : \"\";\n                                            platformAjax({\n                                                url: grid.exporturl,\n                                                data : {param : param},\n                                                success: function (result) {\n                                                    $(result).table2excel({\n                                                        exclude: \".noExl\",\n                                                        name: grid.title,\n                                                        filename: grid.title\n                                                    });\n                                                }\n                                            });\n                                        }");
        this.addMethod("toggleQuery", "function(isShow) { \n                                        this.showquery = isShow;\n                                        var clear = this.xtag.clear;\n                                        var array = this.xtag.columns[0];\n                                            $(array).each(function() {\n                                                if(!this.hidden){\n                                                    var query = this.query;\n                                                    if(isShow){ \n                                                        $(query).show(); \n                                                        $(clear).show(); \n                                                    }\n                                                    else{ \n                                                        $(query).hide();\n                                                        $(clear).hide();\n                                                     }\n                                                }\n                                            });}");
        this.addMethod("saveList", "function() {\n                                            var grid = this;\n                                            if(!grid.xtag.hasChange){\n                                                return;\n                                            }\n                                            grid.loading();\n                                            var changes = JSON.stringify(grid.xtag.changes);\n                                            platformAjax({\n                                                url: grid.saveurl,\n                                                data: {changes: changes},\n                                                success: function(result) {\n                                                    grid.loaded();\n                                                    grid.reload();\n                                                },\n                                                error: function(result) {\n                                                    grid.loaded();\n                                                    $.messager.alert('\u5F02\u5E38', result.statusText);\n                                                }\n                                            });\n                                        }");
        this.addMethod("getCellValue", "function(rowid, field) { \n                                            var rows = JSON.parse(this.xtag.data); \n                                            /*var value = \"\";*/\n\n                                            var row = rows.find(function (e, index, array) {\n                                                if (e[\"customRowId\"] == rowid) {\n                                                    return e;\n                                                }\n                                            });\n                                            return row[field];\n                                            /*$(rows).each(function(){\n                                                if(this.customRowId == rowid){\n                                                    value = this[field];\n                                                }\n                                            });\n                                            return value;*/\n                                        }");
        this.extendEditors("Gf-Toggle,Gf-DateTimePicker,Gf-DatePicker,Gf-TimePicker,Gf-IntInput,Gf-BigIntInput,Gf-NumberInput,Gf-Input,Gf-Text,Gf-ObjectSelector,Gf-DropDownList");
    }
    GfDataGrid.prototype.extendEditors = function (elementName) {
        var names = elementName.split(',');
        for (var key in names) {
            var name = names[key];
            var getvalue = "return target[0].getValue();";
            var setvalue = "target[0].setValue(value);";
            var init = "var input = document.createElement(\"" + name + "\");";
            var setProperties = "";
            switch (name) {
                case 'Gf-ObjectSelector':
                    setProperties = "input[\"idfield\"] = options.idfield;\n                                 input[\"namefield\"] = options.namefield;\n                                 input[\"klass\"] = options.klass; \n                                 input[\"href\"] = options.href; ";
                    break;
                case 'Gf-DropDownList':
                    init = "var input = '<Gf-DropDownList defaultoption=\"' + options.defaultoption +'\" data=\"'+ options.data +'\" textfield=\"' + options.textfield + '\" valuefield=\"' + options.valuefield + '\"></Gf-DropDownList>'";
                    break;
                case 'Gf-DatePicker':
                    setvalue = "if(value && value.indexOf(' ') > 0){ value = value.split(' ')[0]; }" + setvalue;
                    break;
            }
            eval("$.extend($.fn.datagrid.defaults.editors, {\n            '" + name + "': {\n                init: function (container, options) {\n                    " + init + "\n                    " + setProperties + "\n                    var $input = $(input).appendTo(container);\n                    return $input;\n                },\n                getValue: function (target) {\n                    " + getvalue + "\n                },\n                setValue: function (target, value) {\n                    " + setvalue + "\n                },\n                resize: function (target, width) {\n                    var input = $(target);\n                    if ($.boxModel == true) {\n                        input.width(width - (input.outerWidth() - input.width()));\n                    } else {\n                        input.width(width);\n                    }\n                }\n            }\n        });");
        }
    };
    GfDataGrid.prototype.buildColums = function (element) {
        var control = this;
        var columns = element.getElementsByTagName("Gf-Column");
        var value = "[[";
        var arr = new Array();
        var check = this.buildCheckColumn(element);
        arr.push(check);
        for (var i = 0; i < columns.length; i++) {
            var obj = columns[i];
            var column = {
                id: this.GetUniqueId("column" + i),
                field: $(obj).attr("field"),
                datatype: $(obj).attr("datatype"),
                label: $(obj).attr("title"),
                title: $(obj).attr("title"),
                hidden: $(obj).attr("ishidden").toLowerCase() == 'true',
                width: ($(obj).attr("width") || 180),
                align: ($(obj).attr("align") || 'left'),
                formatter: $(obj).attr("formatter") ? this.stringToObject("function (value, row, index) { " + $(obj).attr("formatter") + " }") : function (value, row, index) { return value; },
                editor: $(obj).attr("editor") ? this.stringToObject($(obj).attr("editor")) : "",
                styler: function (value, row, index) { },
                query: {},
                param: {}
            };
            if (!column.hidden) {
                var query = this.createQueryEditor(column, element);
                column.title = "<div id='" + column.id + "' style=' padding:3px;'>" + column.label + "<br/></div>";
                column.query = query;
                column.styler = function (value, row, index) {
                    /*var data = element.getCellValue(row.customRowId, this.field);
                    var formatValue = value;
                    var formatData = data;
                    if(this.formatter) {
                        formatData = this.formatter(data, row, index);
                        formatValue = this.formatter(value, row, index);
                    }
                    formatValue = formatValue ? formatValue : "";
                    if (formatValue != formatData){
                        control.recordChange(element, row, this.field, value);
                        return {class:'editflag'};
                    }
                    else{
                        control.removeChange(element, row, this.field, value);
                    }*/
                    if (control.fieldChanged(element, row, this.field)) {
                        return { class: 'editflag' };
                    }
                };
            }
            arr.push(column);
        }
        var arrs = new Array();
        arrs.push(arr);
        element.xtag.columns = arrs;
        return arrs;
    };
    GfDataGrid.prototype.removeChange = function (element, row, field, value) {
        var control = this;
        var exceptions = ["id", "customRowId", "customRowState"];
        var changes = element.get("changes");
        var changedrow = changes[row.customRowId];
        if (changedrow) {
            delete changedrow[field];
            if (control.getPropertyCount(changedrow, exceptions) == 0) {
                delete changes[row.customRowId];
            }
        }
        if (control.getPropertyCount(changes) == 0) {
            element.set("hasChange", false);
        }
        element.set("changes", changes);
    };
    GfDataGrid.prototype.recordChange = function (element, row, field, value) {
        var changes = element.get("changes");
        if (changes[row.customRowId]) {
            changes[row.customRowId][field] = value;
        }
        else {
            var newChange = {};
            if (row[element.idfield]) {
                newChange[element.idfield] = row[element.idfield];
                newChange["customRowState"] = "updated";
            }
            else {
                newChange["customRowState"] = "inserted";
            }
            newChange["customRowId"] = row.customRowId;
            newChange[field] = value;
            changes[row.customRowId] = newChange;
        }
        element.set("hasChange", true);
        element.set("changes", changes);
    };
    GfDataGrid.prototype.recordDelete = function (element, row) {
        var changes = element.get("changes");
        var changedrow = changes[row.customRowId];
        if (changedrow) {
            if (changedrow["customRowState"] == "inserted") {
                delete changes[row.customRowId];
            }
            else {
                changedrow["customRowState"] = "deleted";
            }
        }
        else {
            if (row[element.idfield]) {
                var newChange = {};
                newChange[element.idfield] = row[element.idfield];
                newChange["customRowState"] = "deleted";
                newChange["customRowId"] = row.customRowId;
                changes[row.customRowId] = newChange;
                element.set("hasChange", true);
            }
        }
        element.set("changes", changes);
    };
    GfDataGrid.prototype.fieldChanged = function (element, row, field) {
        var changes = element.get("changes");
        var change = changes[row.customRowId];
        if (change) {
            return !(change[field] == null);
        }
        else {
            return false;
        }
    };
    GfDataGrid.prototype.buildRowNumberHeader = function (element) {
        var clear = document.createElement("a");
        $(clear).attr("href", "javascript:void(0);");
        $(clear).addClass("fa fa-times iconfont");
        $(clear).css("font-size", "16px");
        $(clear).click(function () {
            var columns = element.xtag.columns[0];
            $(columns).each(function () {
                if (!this.hidden && this.query)
                    this.query.clear();
            });
            element.queryData();
        });
        $(clear).hide();
        element.xtag.clear = clear;
        var div = document.createElement("div");
        $(div).html("No.<br />");
        div.id = "rownumber-header";
        div.appendChild(clear);
        $(element).find(".datagrid-header-rownumber").css("height", "auto").append(div);
    };
    GfDataGrid.prototype.buildCheckColumn = function (element) {
        var checkid = this.GetUniqueId("check");
        element.set("checkid", checkid);
        if (element.singleselect) {
            return {
                field: 'checkcolumn', title: '', width: 30,
                formatter: function (value, row, rowIndex) {
                    return "<input type=\"radio\"  name=\"" + checkid + "\" rowIndex=\"" + rowIndex + "\" id=\"" + checkid + "-" + rowIndex + "\" >";
                }
            };
        }
        else {
            return {
                field: 'checkcolumn', title: '<input id=\"' + checkid + '\" type=\"checkbox\"  >', width: 30,
                formatter: function (value, row, rowIndex) {
                    return "<input type=\"checkbox\"  name=\"" + checkid + "\" rowIndex=\"" + rowIndex + "\" id=\"" + checkid + "-" + rowIndex + "\" >";
                }
            };
        }
    };
    GfDataGrid.prototype.createQueryEditor = function (column, element) {
        var query = document.createElement("Gf-QueryCondition");
        query["field"] = column.field;
        query["datatype"] = column.datatype;
        if (column.datatype == 'list') {
            var options = column.editor.options;
            query["listdefaultoption"] = options.defaultoption;
            query["listdata"] = options.data;
            query["listtextfield"] = options.textfield;
            query["listvaluefield"] = options.valuefield;
        }
        $(query).ready(function () {
            query["registerEventHandler"]("onafterchange", function () { element.queryData(); });
            if (!element.showquery) {
                $(query).hide();
            }
        });
        return query;
    };
    GfDataGrid.prototype.buildToolbar = function (element) {
        var control = this;
        var open = this.createLinkbutton("打开", "fa fa-file-text-o", function () {
            var row = element.getSelectedRow();
            if (row) {
                var id = row[element.idfield];
                if (id) {
                    document.body["openObjDetail"](element.id, id, "read", row[element.namefield]);
                }
            }
        });
        var add = this.createLinkbutton("添加", "fa fa-plus", function () {
            element.insertRow({ index: 0, row: { customRowId: control.GetUniqueId("row"), customRowState: "inserted" } });
            element.selectRow(0);
            element.beginEditRow(0);
        });
        var edit = this.createLinkbutton("编辑", "fa fa-pencil-square-o", function () {
            setState("edit");
            var rows = element.getSelectedRows();
            $(rows).each(function () {
                var index = element.getRowIndex(this);
                element.beginEditRow(index);
                var checkid = "#" + element.get("checkid") + "-" + index;
                $(checkid).prop("checked", true);
            });
        });
        var save = this.createLinkbutton("保存", "fa fa-floppy-o", function () {
            var rows = element.getRows();
            $(rows).each(function () {
                if (this.editing) {
                    element.endEditRow(element.getRowIndex(this));
                }
            });
            element.saveList();
        });
        var read = this.createLinkbutton("浏览", "fa fa-picture-o", function () {
            setState("read");
            element.cancelEditRows();
            element.reload();
        });
        var del = this.createLinkbutton("删除", "fa fa-trash", function () {
            var rows = element.getSelectedRows();
            if (rows) {
                $(rows).each(function () {
                    element.deleteRow(this);
                    control.recordDelete(element, this);
                });
            }
        });
        var exporter = this.createLinkbutton("导出", "fa fa-file-excel-o", function () {
            element.exportExcel();
        });
        var query = this.createLinkbutton("查询", "fa fa-search", function () {
            element.toggleQuery(!element.showquery);
            element.reloadstatic();
        });
        var refresh = this.createLinkbutton("刷新", "fa fa-refresh", function () {
            element.reload();
        });
        var setState = function (state) {
            if (state == "edit") {
                $(edit).linkbutton('disable');
                $(add).linkbutton('enable');
                $(del).linkbutton('enable');
                $(save).linkbutton('enable');
                $(read).linkbutton('enable');
            }
            else {
                $(edit).linkbutton('enable');
                $(add).linkbutton('disable');
                $(del).linkbutton('disable');
                $(save).linkbutton('disable');
                $(read).linkbutton('disable');
            }
            element.state = state;
        };
        var div = document.createElement("div");
        div.id = this.GetUniqueId("gridToolbar");
        $(div).addClass("datagrid-toolbar");
        div.appendChild(open);
        div.appendChild(add);
        div.appendChild(del);
        div.appendChild(edit);
        div.appendChild(save);
        div.appendChild(read);
        div.appendChild(refresh);
        div.appendChild(query);
        div.appendChild(exporter);
        element.xtag.toolbar = { div: div, add: add, del: del, edit: edit, save: save, read: read, exporter: exporter, open: open, query: query, refresh: refresh };
        setState(element.state);
        $(element).find(".datagrid-view").before(div);
    };
    GfDataGrid.prototype.initContent = function (element) {
        var control = this;
        var table = document.createElement("table");
        element.set("table", table);
        element.appendChild(table);
        if (!element.state) {
            element.state = "read";
        }
        ;
        $(table).datagrid({
            title: element.title,
            iconCls: 'icon-view',
            loadMsg: element.loadmsg || "数据加载中，请稍后......",
            width: element.width || 1000,
            height: element.height || 400,
            idfield: element.idfield,
            checkOnSelect: false,
            selectOnCheck: false,
            nowrap: true,
            striped: true,
            border: true,
            collapsible: true,
            remoteSort: false,
            singleSelect: element.singleselect,
            pagination: true,
            rownumbers: true,
            columns: this.buildColums(element),
            onSelect: function (index, row) {
                var checkid = "#" + element.get("checkid") + "-" + index;
                var checked = $(checkid).prop("checked");
                if (element.state == "edit") {
                    element.beginEditRow(index);
                }
                $(checkid).prop("checked", checked);
                if (!checked) {
                    if (element.state == "edit") {
                        element.endEditRows(index);
                    }
                    $(checkid).prop("checked", true);
                    element.unSelectRows(index);
                }
            },
            onUnselect: function (index, row) {
                if (element.state == "edit") {
                    element.endEditRow(index);
                }
                var check = $("#" + element.get("checkid") + "-" + index);
                if (check.prop("checked"))
                    check.prop("checked", false);
            },
            onBeforeEdit: function (index, row) {
                row.editing = true;
                element.refreshRow(index);
            },
            onAfterEdit: function (index, row, changes) {
                var columns = element.get("columns")[0];
                for (var property in changes) {
                    var column = columns.find(function (e, index, array) {
                        if (e["field"] == property) {
                            return e;
                        }
                    });
                    var formatter = column.formatter;
                    var data = element.getCellValue(row.customRowId, column.field);
                    if (formatter(changes[property], row, index) != formatter(data, row, index)) {
                        control.recordChange(element, row, property, changes[property]);
                    }
                }
                element.endEditRow(index);
                element.refreshRow(index);
            },
            onCancelEdit: function (index, row) {
                row.editing = false;
                element.refreshRow(index);
            },
            onLoadSuccess: function () {
                var checkid = element.get("checkid");
                var checkall = $("#" + checkid);
                //全选
                checkall.unbind().bind("change", function () {
                    var checked = $(this).prop("checked");
                    $("input[name='" + checkid + "']").each(function () {
                        $(this).prop("checked", checked);
                        var rowIndex = parseInt($(this).attr("rowIndex"));
                        if (checked)
                            element.selectRow(rowIndex);
                        else
                            element.unSelectRow(rowIndex);
                    });
                });
            }
        });
        var gfPager = element.getElementsByTagName("Gf-Pager")[0];
        if (!gfPager) {
            gfPager = {};
        }
        var pager = element.getPager();
        element.xtag.pager = pager;
        $(pager).pagination({
            pageNumber: gfPager.pagenumber || 1,
            pageSize: gfPager.pagesize || 10,
            pageList: this.stringToObject(gfPager.pagelist) || [5, 10, 20, 50, 100],
            beforePageText: gfPager.beforepagetext || '第',
            afterPageText: gfPager.afterpagetext || '页     共{pages}页',
            displayMsg: gfPager.displaymsg || '当前显示{from}-{to}条记录  共{total}条记录',
            onSelectPage: function (pageNumber, pageSize) {
                element.loadDataPage(pageNumber, pageSize);
            }
        });
        if (!element.width && !element.height) {
            var container = $(element).parent();
            container.css("overflow", "hidden");
            $(function () {
                $(table).datagrid('resize', {
                    width: container.width() - 4,
                    height: container.height() - 4
                });
                container.resize(function () {
                    $(table).datagrid('resize', {
                        width: container.width() - 4,
                        height: container.height() - 4
                    });
                });
            });
        }
        element.set("options", $(element.get("table")).datagrid("options"));
        var columns = element.xtag.columns[0];
        $(columns).each(function () {
            if (!this.hidden && this.query) {
                $('#' + this.id).append(this.query);
            }
        });
        this.buildRowNumberHeader(element);
        this.buildToolbar(element);
        element.set("changes", {});
        element.set("outParams", []);
        if (element.autoselect) {
            element.select(1);
        }
    };
    return GfDataGrid;
}(CustomElement));
//【分页】
var GfPager = (function (_super) {
    __extends(GfPager, _super);
    function GfPager(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-Pager";
        this.addProperties("pagenumber,pagesize,pagelist,beforepagetext,afterpagetext,displaymsg");
    }
    return GfPager;
}(CustomElement));
//【列】
var GfColumn = (function (_super) {
    __extends(GfColumn, _super);
    function GfColumn(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-Column";
        this.addProperties("field,title,datatype,ishidden,width,align,formatter,editor");
    }
    return GfColumn;
}(CustomElement));
//【面板】
var GfPanel = (function (_super) {
    __extends(GfPanel, _super);
    function GfPanel(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-Panel";
        this.extends = "div";
        this.addProperties("width,height,title,editurl,dataurl");
        this.addboolProperty("tools");
        this.addboolProperty("collapsible");
        this.addboolProperty("minimizable");
        this.addboolProperty("maximizable");
        this.addboolProperty("isform");
        this.addMethod("load", "function(state) {  $(\"#\"+this.xtag.divid).load(this.dataurl + state); }");
        this.addMethod("editObjekt", "function(obj) {\n                                           var form = this;\n                                           var objStr = JSON.stringify(obj);\n                                           platformAjax({\n                                                url: form.editurl,\n                                                data: { obj : objStr},\n                                                success: function(result) {\n                                                    form.load(\"read\");\n                                                }\n                                            });\n                                        }");
    }
    GfPanel.prototype.buildToolbar = function (element) {
        if (element.tools) {
            var edit = document.createElement("a");
            var save = document.createElement("a");
            var cancel = document.createElement("a");
            $(edit).attr("href", "javascript:void(0);");
            $(edit).addClass("icon-edit");
            $(save).attr("href", "javascript:void(0);");
            $(save).addClass("icon-save");
            $(save).hide();
            $(cancel).attr("href", "javascript:void(0);");
            $(cancel).addClass("icon-cancel");
            $(cancel).hide();
            var setState = function (state) {
                element.state = state;
                if (state == "edit") {
                    $(edit).hide();
                    $(save).show();
                    $(cancel).show();
                }
                else {
                    $(edit).show();
                    $(save).hide();
                    $(cancel).hide();
                }
            };
            $(edit).click(function () {
                setState("edit");
                element.load("edit");
            });
            $(save).click(function () {
                if (element.state == "edit") {
                    element.editObjekt($("#" + element.xtag.formid).serializeArray());
                }
                else {
                    element.load("read");
                }
                setState("read");
            });
            $(cancel).click(function () {
                setState("read");
                element.load("read");
            });
            var toolbardiv = $(element).parent().find(".panel-tool");
            toolbardiv.id = this.GetUniqueId("panelToolbar");
            toolbardiv.prepend(cancel);
            toolbardiv.prepend(save);
            toolbardiv.prepend(edit);
        }
    };
    GfPanel.prototype.initContent = function (element) {
        var state = "";
        var divid = this.GetUniqueId("div");
        element.xtag.divid = divid;
        element.innderHTML = "<div id='" + divid + "'>" + (element.innderHTML || "") + "<div/>";
        if (element.isform) {
            var formid = this.GetUniqueId("form");
            element.innderHTML = "<form id='" + formid + "'>" + (element.innderHTML || "") + "<form/>";
            element.xtag.formid = formid;
            state = "read";
        }
        $(element).panel({
            width: element.width,
            height: element.height,
            title: element.title || "Panel",
            content: element.innderHTML,
            collapsible: element.collapsible,
            minimizable: element.minimizable,
            maximizable: element.maximizable
        });
        this.buildToolbar(element);
        element.load(state);
    };
    return GfPanel;
}(CustomElement));
//【下拉选项】
var GfOption = (function (_super) {
    __extends(GfOption, _super);
    function GfOption(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-Option";
        this.addProperties("value,label");
    }
    return GfOption;
}(CustomElement));
//【按钮点击下拉框】
var GfButtonComboBox = (function (_super) {
    __extends(GfButtonComboBox, _super);
    function GfButtonComboBox(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-ButtonComboBox";
        this.addProperties("width,height,data");
        this.methods["getValue"] = "function() { return $(this.xtag.button).val(); }";
        this.methods["setValue"] = "function(value) { $(this.xtag.button).val(value); }";
        this.addMethod("loadData", "function(data) {\n                                        var expand = $(this.xtag.div);\n                                        var target = $(this.xtag.button);\n                                        var element = this;\n                                        expand.html(\"\");\n\n                                        $(data).each(function() {\n                                            control.addOption(element,this.value,this.label);\n                                        });\n                                    }");
        this.addMethod("toggleExpand", "function() {\n                                            var div = this.xtag.div;\n                                            var button = this.xtag.button;\n\n                                            if (!$(div).is(\":hidden\")) {  $(div).hide(); return;  }\n                                            \n                                            var x= button.getBoundingClientRect().left+document.documentElement.scrollLeft;\n                                            var y =button.getBoundingClientRect().top+document.documentElement.scrollTop;\n                                            div.style.left = x + \"px\";\n                                            div.style.top = y + 20 + \"px\";\n                                            $(div).show();\n                                        }");
    }
    GfButtonComboBox.prototype.addOption = function (element, value, label) {
        var option = document.createElement("div");
        $(option).addClass("combobox-item");
        $(option).css("cursor", "pointer");
        $(option).hover(function () {
            $(option).css("background-color", "#9cc8f7");
            $(option).css("color", "#404040");
        }, function () {
            $(option).css("background-color", "");
            $(option).css("color", "");
        });
        option.innerText = label;
        $(option).attr("value", value);
        $(option).click(function () {
            $(element.xtag.button).val(value);
            $(element.xtag.div).hide();
            element.triggerEventHandler("onafterselect");
        });
        element.xtag.div.appendChild(option);
    };
    GfButtonComboBox.prototype.initContent = function (element) {
        //按钮
        var button = document.createElement("input");
        button.id = this.GetUniqueId("Button");
        $(button).attr("type", "button");
        $(button).css("float", "left");
        $(button).css("width", (element.width || "25"));
        $(button).css("height", (element.height || "20"));
        element.xtag.button = button;
        //下拉框
        var expanddiv = document.createElement("div");
        expanddiv.id = this.GetUniqueId("ComboBox");
        $(expanddiv).addClass("combo-panel panel-body panel-body-noheader");
        $(expanddiv).css("display", "none");
        $(expanddiv).css("position", "absolute");
        $(expanddiv).css("z-index", "9999999");
        $(expanddiv).css("width", "auto");
        $(expanddiv).css("min-width", "60px");
        $(expanddiv).css("height", "auto");
        $(expanddiv).css("max-height", "300px");
        $(expanddiv).css("overflow-y", "auto");
        $(expanddiv).hide();
        element.xtag.div = expanddiv;
        //点击按钮切换下拉框显示/隐藏
        $(button).click(function () {
            element.toggleExpand();
        });
        //在页面其他地方点击将隐藏下拉框
        $(document).click(function (e) {
            if (e.target.id != button.id) {
                $(expanddiv).hide();
            }
        });
        //添加到主元素中
        element.appendChild(button);
        document.body.appendChild(expanddiv);
        //绑定数据
        var options = element.getElementsByTagName("Gf-Option");
        if (options) {
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                this.addOption(element, option.value, option.label);
            }
        }
    };
    return GfButtonComboBox;
}(CustomElement));
//【查询条件】
var GfQueryCondition = (function (_super) {
    __extends(GfQueryCondition, _super);
    function GfQueryCondition(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-QueryCondition";
        this.addProperties("field,datatype,listdefaultoption,listdata,listtextfield,listvaluefield");
        this.addMethod("clear", "function() {\n                                    this.xtag.querySelect.setValue(\"\");\n                                    this.xtag.editor.setValue(\"\");\n                                    if(this.xtag.hasDoubleEditor){\n                                        this.xtag.editorFrom.setValue(\"\");\n                                        this.xtag.editorTo.setValue(\"\");\n                                        $(this.xtag.editor).show();\n                                        $(this.xtag.doubleEditor).hide();\n                                    }\n                                }");
        this.methods["getValue"] = "function() {\n                                        var type = this.xtag.querySelect.getValue();\n                                        if(type){\n                                            var value = (type != \"()\" ? this.xtag.editor.getValue() : control.GetDoubleEditorValue(this));\n                                            return {  field: this.field,\n                                            type: type,\n                                            value: value };\n                                        }else{\n                                            return null;\n                                        } }";
        this.methods["setValue"] = "function(obj) {\n                                        if(obj && obj.type){\n                                            this.xtag.querySelect.setValue(obj.type);\n                                            if(obj.type == \"()\"){\n                                                var values = obj.value.split(',');\n                                                this.xtag.editorFrom.setValue(values[0]);\n                                                this.xtag.editorTo.setValue(values[1]);\n                                            }\n                                            else{\n                                                this.xtag.editor.setValue(obj.value);\n                                            }\n                                        }else{\n                                            this.clear();\n                                        } }";
    }
    GfQueryCondition.prototype.initContent = function (element) {
        element.id = this.GetUniqueId("QueryCondition");
        var querySelect;
        querySelect = document.createElement("Gf-ButtonComboBox");
        var editor;
        var emptyValue;
        emptyValue = "";
        var elementName;
        var hasDoubleEditor = false;
        var commonTypes = [{ value: '=', label: '等于' },
            { value: '!=', label: '不等于' },
            { value: '-', label: '等于空' },
            { value: '!-', label: '不等于空' },
            { value: '', label: '清除条件' }];
        var stringTypes = [{ value: 'C', label: '包含' },
            { value: '!C', label: '不包含' },
            { value: '{', label: '开始于' },
            { value: '}', label: '结束于' }];
        var timeTypes = [{ value: '>', label: '晚于' },
            { value: '>=', label: '晚于等于' },
            { value: '<', label: '早于' },
            { value: '<=', label: '早于等于' },
            { value: '()', label: '介于' }];
        var numberTypes = [{ value: '>', label: '大于' },
            { value: '>=', label: '大于等于' },
            { value: '<', label: '小于' },
            { value: '<=', label: '小于等于' },
            { value: '()', label: '介于' }];
        var selectTypes = commonTypes;
        switch (element.datatype) {
            case "list":
                elementName = "Gf-DropDownList";
                break;
            case "string":
            case "text":
            case "item":
                elementName = "Gf-Input";
                selectTypes = stringTypes.concat(commonTypes);
                break;
            case "boolean":
                elementName = "Gf-Toggle";
                emptyValue = false;
                break;
            case "datetime":
            case "time":
            case "date":
                if (element.datatype == 'datetime')
                    elementName = "Gf-DateTimePicker";
                else if (element.datatype == 'time')
                    elementName = "Gf-TimePicker";
                else if (element.datatype == 'date')
                    elementName = "Gf-DatePicker";
                selectTypes = timeTypes.concat(commonTypes);
                hasDoubleEditor = true;
                break;
            case "float":
            case "double":
            case "decimal":
            case "integer":
            case "bigint":
                if (element.datatype == 'integer')
                    elementName = "Gf-IntInput";
                else if (element.datatype == 'bigint')
                    elementName = "Gf-BigIntInput";
                else
                    elementName = "Gf-NumberInput";
                selectTypes = numberTypes.concat(commonTypes);
                hasDoubleEditor = true;
                break;
            default:
                elementName = "Gf-Input";
                break;
        }
        var id = this.GetUniqueId("queryeditor");
        if (element.datatype == "list") {
            editor = '<Gf-DropDownList id="' + id + '" width="150" defaultoption="' + element.listdefaultoption + '" data="' + element.listdata + '" textfield="' + element.listtextfield + '" valuefield="' + element.listvaluefield + '"></Gf-DropDownList>';
        }
        else {
            editor = document.createElement(elementName);
            editor.id = id;
            editor.width = 150;
            editor.init();
        }
        $(element).append(editor);
        editor = document.querySelector('#' + id);
        element.set("editor", editor);
        querySelect.id = this.GetUniqueId("querySelect");
        querySelect.init();
        querySelect.loadData(selectTypes);
        querySelect.registerEventHandler("onafterselect", function () {
            var type = querySelect.getValue();
            var value = editor.getValue();
            var doubleEditor = element.get("doubleEditor");
            var editorFrom = element.get("editorFrom");
            var editorTo = element.get("editorTo");
            var fromValue = editorFrom ? editorFrom.getValue() : null;
            var toValue = editorTo ? editorTo.getValue() : null;
            if (!type) {
                if (value)
                    editor.setValue(emptyValue);
                if (fromValue)
                    editorFrom.setValue(emptyValue);
                if (toValue)
                    editorTo.setValue(emptyValue);
                if (doubleEditor) {
                    $(editor).show();
                    $(doubleEditor).hide();
                }
                element.triggerEventHandler("onafterchange");
            }
            else if (type == "-" || type == "!-") {
                element.triggerEventHandler("onafterchange");
            }
            else if (type == "()") {
                $(editor).hide();
                $(doubleEditor).show();
                if (fromValue && toValue) {
                    element.triggerEventHandler("onafterchange");
                }
            }
            else {
                if (doubleEditor) {
                    $(editor).show();
                    $(doubleEditor).hide();
                }
                if (editor.elementname == "gf-toggle" || value)
                    element.triggerEventHandler("onafterchange");
            }
        });
        $(editor).attr("onafterinit", "element.registerEventHandler('onafterchange',function () {\n            var querySelect = document.querySelector('#" + querySelect.id + "');\n            var queryCondition = document.querySelector('#" + element.id + "');\n            var type = querySelect.getValue();\n            if(type && type != '!-' && type != '-'){\n                queryCondition.triggerEventHandler('onafterchange');\n            }\n        });");
        element.set("querySelect", querySelect);
        element.appendChild(querySelect);
        if (hasDoubleEditor)
            this.buildDoubleEditor(element, elementName);
        element.set("hasDoubleEditor", hasDoubleEditor);
    };
    GfQueryCondition.prototype.buildDoubleEditor = function (element, elementName) {
        var editorFrom;
        editorFrom = document.createElement(elementName);
        editorFrom.width = 75;
        var editorTo;
        editorTo = document.createElement(elementName);
        editorTo.width = 75;
        var onafterchange = function () {
            if (editorFrom.getValue() && editorTo.getValue()) {
                element.triggerEventHandler("onafterchange");
            }
        };
        editorFrom.registerEventHandler("onafterchange", onafterchange);
        editorTo.registerEventHandler("onafterchange", onafterchange);
        var span = document.createElement("span");
        span.appendChild(editorFrom);
        span.appendChild(editorTo);
        $(span).hide();
        element.appendChild(span);
        element.set("doubleEditor", span);
        element.set("editorFrom", editorFrom);
        element.set("editorTo", editorTo);
    };
    GfQueryCondition.prototype.GetDoubleEditorValue = function (element) {
        if (element.get("hasDoubleEditor")) {
            return element.get("editorFrom").getValue() + ',' + element.get("editorTo").getValue();
        }
        else {
            return "";
        }
    };
    return GfQueryCondition;
}(CustomElement));
//【对象选择】
var GfObjectSelector = (function (_super) {
    __extends(GfObjectSelector, _super);
    function GfObjectSelector(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-ObjectSelector";
        this.addProperties("href,idfield,namefield,klass,value");
        this.addMethod("open", "function(){ \n                                    var dialog = this.get('SelectDialog'); \n                                    if(!this.get(\"loaded\")){\n                                        $(dialog).load(this.href + '?klass=' + this.klass);\n                                        this.set(\"loaded\",true);\n                                    }\n                                    $(dialog).dialog('open'); \n                                }");
        this.addMethod("close", "function(){ $(this.get('SelectDialog')).dialog('close'); }");
        this.methods["getValue"] = "function() { return JSON.stringify(this.get(\"obj\")); }";
        this.methods["setValue"] = "function(value) { \n                                        if(value){ \n                                            if(control.isString(value)){\n                                                obj = JSON.parse(value);\n                                                this.setObject(obj);\n                                            }else{\n                                                this.setObject(value);\n                                            }\n                                        } \n                                        else{\n                                            this.setObject(null);\n                                        }\n                                    }";
        this.addMethod("setObject", "function(obj){ \n                                        if(!obj){\n                                            obj = {};\n                                            obj['klass'] = this.klass;\n                                            obj[this.namefield] = '';\n                                            obj[this.idfield] = '';\n                                        }\n                                        this.set(\"obj\",obj); \n                                        this.get(\"nameinput\").setValue(obj[this.namefield]);\n                                        this.get(\"valueinput\").value = JSON.stringify(obj);\n                                     }");
        this.addMethod("getObject", "function(){ return this.get(\"obj\"); }");
    }
    GfObjectSelector.prototype.initContent = function (element) {
        element.set("loaded", false);
        if (!element.state) {
            element.state = "edit";
        }
        //输入框
        var nameinput = document.createElement("Gf-Input");
        element.set("nameinput", nameinput);
        element.appendChild(nameinput);
        nameinput["width"] = 120;
        nameinput["readonly"] = true;
        nameinput["init"]();
        //存值隐藏域
        var valueinput = document.createElement("input");
        $(valueinput).attr("type", "hidden");
        $(valueinput).attr("name", $(element).attr("name"));
        element.set("valueinput", valueinput);
        element.appendChild(valueinput);
        //按钮
        var createButton = function (name, icon, func) {
            var button = document.createElement("Button");
            $(button).addClass("clean-gray");
            $(button).css("font-size", "10px");
            $(button).css("padding", "2px");
            $(button).css("width", "17");
            $(button).css("height", "22");
            $(button).html("<i class='" + icon + "'></i>");
            $(button).click(func);
            element.set(name, button);
            element.appendChild(button);
        };
        createButton("opendetail", "fa fa-file-text-o", function () {
            var obj = element.getObject();
            if (obj && obj[element.idfield]) {
                document.body["openObjDetail"](element.id, obj[element.idfield], "read", obj[element.namefield]);
            }
        });
        createButton("selectobject", "fa fa-ellipsis-h", function () {
            element.open();
        });
        createButton("clear", "fa fa-times", function () {
            element.setValue(null);
        });
        this.buildSelectDialog(element);
        var control = this;
        element.registerEventHandler("onafterinit", function () {
            if (element.value) {
                var obj = control.stringToObject(element.value);
                element.setObject(obj);
            }
            if (element.state == "read") {
                $(element.get("selectobject")).hide();
                $(element.get("clear")).hide();
            }
        });
    };
    GfObjectSelector.prototype.buildSelectDialog = function (element) {
        var div = document.createElement("div");
        element.set("SelectDialog", div);
        element.appendChild(div);
        $(div).css("padding", "2px");
        $(div).dialog({
            title: '对象选择窗口',
            width: 800,
            height: 460,
            closed: true,
            cache: false,
            modal: true
        });
        this.buildSelectDialogButtons(element);
    };
    GfObjectSelector.prototype.buildSelectDialogButtons = function (element) {
        var sure = this.createLinkbutton("确定", "fa fa-check", function () {
            var grid = $(element.get("SelectDialog")).find("gf-datagrid")[0];
            var row = grid.getSelectedRow();
            if (grid.state != "read") {
                $.messager.alert('提示', '请保存数据后再选择！');
            }
            else if (!row) {
                $.messager.alert('提示', '请至少选择一条数据！');
            }
            else {
                var obj = {};
                obj[element.idfield] = row[element.idfield];
                obj[element.namefield] = row[element.namefield];
                obj["klass"] = element.klass;
                element.setObject(obj);
                element.close();
                grid.reloadstatic();
            }
        });
        var cancel = this.createLinkbutton("取消", "fa fa-times", function () {
            element.close();
        });
        var buttonsdiv = document.createElement("div");
        $(buttonsdiv).addClass("dialog-button");
        buttonsdiv.id = this.GetUniqueId("buttonsdiv");
        buttonsdiv.appendChild(sure);
        buttonsdiv.appendChild(cancel);
        $(element.get("SelectDialog")).after(buttonsdiv);
    };
    return GfObjectSelector;
}(CustomElement));
//【选项卡】
var GfTabs = (function (_super) {
    __extends(GfTabs, _super);
    function GfTabs(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-Tabs";
        this.extends = "div";
        this.addProperties("width,height");
        this.addboolProperties("closable,fit");
        this.addMethod("add", "function(id,title,href,iconCls) {\n                                var container = this;\n\n                                if(!id){\n                                    id = control.GetUniqueId(\"tab\");\n                                }\n                                var tabExist = false;\n                                var alltabs = $(container).tabs('tabs');\n                                $(alltabs).each(function () {\n                                    if(this[0].id == id){\n                                        var index = $(container).tabs('getTabIndex', this[0]);\n                                        $(container).tabs('select', index);\n                                        tabExist = true;\n                                    }\n                                });\n                                if(!tabExist){\n                                    $(container).tabs('add',{\n                                        id : id,\n                                        title: title,\n                                        content : '',\n                                        href : href,\n                                        iconCls : iconCls,\n                                        closable : container.closable\n                                    });\n                                    $(\"#\"+ id).css(\"padding\",\"2px\");\n                                }\n                            }");
    }
    GfTabs.prototype.initContent = function (element) {
        $(element).tabs({
            width: element.width || 'auto',
            height: element.height || 'auto',
            fit: element.fit,
            border: false
        });
        element.add("defaultTab", "主页", "", "");
    };
    return GfTabs;
}(CustomElement));
//【下拉框】
var GfDropDownList = (function (_super) {
    __extends(GfDropDownList, _super);
    function GfDropDownList(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-DropDownList";
        this.addProperties("value,data,width,valuefield,textfield,defaultText,defaultoption");
        this.methods["getValue"] = "function() { \n                                        var obj = this.get(\"obj\");\n                                        if(obj.id){\n                                            return JSON.stringify(obj); \n                                        }\n                                        else{\n                                            return \"\";\n                                        }\n                                    }";
        this.methods["setValue"] = "function(value) { \n                                        if(value){ \n                                            if(control.isString(value)){\n                                                obj = control.stringToObject(value);\n                                                this.setObject(obj);\n                                            }else{\n                                                this.setObject(value);\n                                            }\n                                        } \n                                        else{\n                                            this.setObject(null);\n                                        }\n                                    }";
        this.addMethod("setObject", "function(obj){ \n                                        if(!obj){\n                                            obj = {};\n                                            obj['klass'] = '';\n                                            obj[this.textfield] = '';\n                                            obj[this.valuefield] = '';\n                                        }\n                                        this.set(\"obj\",obj); \n                                        $(this.get(\"valueInput\")).val(JSON.stringify(obj));\n                                        $(this.get(\"select\")).combobox('setValue', obj[this.valuefield]); \n                                     }");
        this.addMethod("getObject", "function(){ return this.get(\"obj\"); }");
        this.addMethod("loadData", "function(data) { \n                                        if(control.isString(data)){\n                                            data = control.stringToObject(data);\n                                        }\n                                        if(this.defaultoption){\n                                            var obj = {};\n                                            obj[this.valuefield] = \"\";\n                                            obj[this.textfield] = this.defaultoption;\n                                            data.unshift(obj);\n                                        }\n                                        $(this.get(\"select\")).combobox('loadData',data); \n                                    }");
        this.addMethod("loadDatastring", "function(data) { \n                                            if(data){\n                                            var objs = [];\n                                            var array = data.split(',');\n                                            var element = this;\n                                            $(array).each(function(){\n                                                if(this.length > 0){\n                                                    var obj = {};\n                                                    obj[element.valuefield] = this.split('_')[0];\n                                                    obj[element.textfield] = this.split('_')[1];\n                                                    objs.push(obj);\n                                                }\n                                            });\n                                            this.loadData(objs);\n                                        }\n                                    }");
    }
    GfDropDownList.prototype.initContent = function (element) {
        var select = document.createElement("select");
        element.appendChild(select);
        element.set("select", select);
        var valueInput = document.createElement("input");
        $(valueInput).attr("type", "hidden");
        $(valueInput).attr("name", $(element).attr("name"));
        element.appendChild(valueInput);
        element.set("valueInput", valueInput);
        $(select).combobox({
            valueField: element.valuefield,
            textField: element.textfield,
            width: element.width || 170,
            editable: false,
            onChange: function (newValue, oldValue) {
            },
            onSelect: function (record) {
                element.setObject(record);
                element.triggerEventHandler("onafterchange", record);
            }
        });
        element.registerEventHandler("onafterinit", function () {
            if (element.data) {
                element.loadDatastring(element.data);
            }
            element.setValue(element.value);
        });
    };
    return GfDropDownList;
}(CustomElement));
//【树】
var GfTree = (function (_super) {
    __extends(GfTree, _super);
    function GfTree(extension) {
        _super.call(this, extension);
        this.elementName = "Gf-Tree";
        this.addProperties("data,click,paddingleft");
        this.addboolProperty("hidefoldericon");
        this.addMethod("loadData", "function(data, click) {\n                                        $(this.get(\"ul\")).tree({\n                                            data : data,\n                                            onClick : click ? click : function(node){}\n                                        });\n                                        control.changeCssClass(this);\n                                    }");
        this.addMethod("loadDatastring", "function(data, click) {\n                                        $(this.get(\"ul\")).tree({\n                                            data : control.stringToObject(data),\n                                            onClick : function (node) {\n                                                if(click){\n                                                    var func = control.stringToObject(click);\n                                                    func(node);\n                                                }\n                                            }\n                                        });\n                                        control.changeCssClass(this);\n                                    }");
    }
    GfTree.prototype.initContent = function (element) {
        var ul = document.createElement("ul");
        element.appendChild(ul);
        element.set("ul", ul);
        if (element.data) {
            element.loadDatastring(element.data, element.click);
        }
    };
    GfTree.prototype.changeCssClass = function (element) {
        $(element).find(".tree-file").removeClass("tree-file");
        if (element.paddingleft) {
            $(element).find(".tree-node").css("padding-left", parseInt(element.paddingleft));
        }
        if (element.hidefoldericon) {
            $(element).find(".tree-folder").removeClass("tree-folder");
        }
    };
    return GfTree;
}(CustomElement));
