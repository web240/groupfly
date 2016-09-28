var TestCallBack = (function () {
    function TestCallBack() {
    }
    TestCallBack.prototype.beforeCreate = function (element) {
        alert(element.innerHTML);
    };
    TestCallBack.prototype.afterCreate = function (element) {
        alert(element.innerHTML);
        element.disable();
    };
    TestCallBack.prototype.afterAttributeChange = function (element, attrName, oldValue, newValue) {
        alert("attrName : " + attrName + "; oldValue : " + oldValue + "; newValue : " + newValue);
    };
    return TestCallBack;
}());
new GfPager().register();
new GfColumn().register();
new GfOption().register();
new GfInput().register();
new GfText().register();
new GfIntInput().register();
new GfBigIntInput().register();
new GfNumberInput().register();
new GfDropDownList().register();
new GfDatePicker().register();
new GfToggle().register();
new GfDateTimePicker().register();
new GfTimePicker().register();
new GfPanel().register();
new GfButtonComboBox().register();
new GfQueryCondition().register();
new GfPage().register();
new GfDataGrid().register();
new GfDialog().register();
new GfObjectSelector().register();
new GfTabs().register();
new GfTree().register();
/*new GfLayout().register();*/
/*
var createGridHeaderContextMenu = function(e, field) {
    e.preventDefault();
    var grid = $(this);
    var headerContextMenu = this.headerContextMenu;
    var okCls = 'tree-checkbox1';//选中
    var emptyCls = 'tree-checkbox0';//取消
    if (!headerContextMenu) {
        var tmenu = $('<div style="width:100px;"></div>').appendTo('body');
        var fields = grid.datagrid('getColumnFields');
        for ( var i = 0; i < fields.length; i++) {
            var fildOption = grid.datagrid('getColumnOption', fields[i]);
            if (!fildOption.hidden) {
                $('<div iconCls="'+okCls+'" field="' + fields[i] + '"/>').html(fildOption.title).appendTo(tmenu);
            } else {
                $('<div iconCls="'+emptyCls+'" field="' + fields[i] + '"/>').html(fildOption.title).appendTo(tmenu);
            }
        }
        headerContextMenu = this.headerContextMenu = tmenu.menu({
            onClick : function(item) {
                var field = $(item.target).attr('field');
                if (item.iconCls == okCls) {
                    grid.datagrid('hideColumn', field);
                    $(this).menu('setIcon', {
                        target : item.target,
                        iconCls : emptyCls
                    });
                } else {
                    grid.datagrid('showColumn', field);
                    $(this).menu('setIcon', {
                        target : item.target,
                        iconCls : okCls
                    });
                }
            }
        });
    }
    headerContextMenu.menu('show', {
        left : e.pageX,
        top : e.pageY
    });
};
$.fn.datagrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;
$.fn.treegrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;  */ 
