package com.surekam.checkboxcolumn
{
     import flash.events.Event;
     
     import mx.collections.ArrayCollection;
     import mx.controls.Alert;
     import mx.controls.CheckBox;
     import mx.controls.DataGrid;
  
     public class CheckBoxHeaderRenderer extends CenterCheckBox{    
          
         private var _data:CheckBoxColumn;//定义CheckBox列对象      
         public function CheckBoxHeaderRenderer(){ 
             super(); 
             this.addEventListener(Event.CHANGE, onChange);//CheckBox状态变化时触发此事件 
             this.toolTip = "全选"; 
         } 
          
          
         override public function get data():Object{ 
             return _data;//返回的是CheckBox列的对象 
         } 
          
         override public function set data(value:Object):void{ 
             _data = value as CheckBoxColumn; 
//             trace("_data.cloumnSelected: " + _data.cloumnSelected); 
             selected = _data.cloumnSelected; 
         } 
          
         private function onChange(event:Event):void{                 
             var dg:DataGrid = DataGrid(listData.owner);//获取DataGrid对象 
             var column:CheckBoxColumn = dg.columns[listData.columnIndex];//获取整列的显示对象 
              
             var dgDataArr:ArrayCollection = dg.dataProvider as  ArrayCollection; 
              
             column.cloumnSelected = this.selected;//更改列的全选状态 
//             column.selectItems = new Array();//重新初始化用于保存选中列的对象 
//              Alert.show("" + column.currRecord);
//			 Alert.show("selectPage: " + column.selectPage);
			 
             if(dgDataArr.length>0){ 
//                 if(dgDataArr[0]!=""){ 
//				 trace("dgDataArr.length: " + dgDataArr.length);
                     for(var i:int = 0; i < dgDataArr.length; i++){ 
                         Object(dgDataArr[i]).dgSelected = this.selected;//更改没一行的选中状态 
                     }  
//                 }   
             }  
			 if(this.selected){//如果为全部选中的化就将数据源赋值给column.selectItems，不是就不管他，上一步已经初始化为空 
//				 column.selectItems = dgDataArr.toArray(); 
				 for each(var addItem:Object in dgDataArr) {
					 if(column.selectItems.indexOf(addItem) == -1) { // 不存在则添加
					 	column.selectItems.push(addItem);
					 }
				 }
			 } else { // 跨页全选时，取消全选状态，删除相应数据
			 	for each(var dgItem:Object in dgDataArr) {
					for(var ii:int = 0; ii < column.selectItems.length; ii++) {
						if(column.selectItems[ii] == dgItem) {
							column.selectItems.splice(ii, 1);
						}
					}
				}
			 }
             dgDataArr.refresh();//刷新数据源，达到强制更新页面显示效果的功能，防止在使用时没有在VO类中使用绑定而出现点击全选页面没有更改状态的错误       
         } 
     } 
}  

