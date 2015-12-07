package com.surekam.checkboxcolumn
{  
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import mx.controls.Alert;
	import mx.controls.CheckBox;
	import mx.controls.DataGrid;
	import mx.events.FlexEvent;
	
	public class CheckBoxItemRenderer extends CenterCheckBox{  
		private var currentData:Object; //保存当前一行值的对象  
		
		public function CheckBoxItemRenderer(){  
			super();  
			this.addEventListener(Event.CHANGE, onClickCheckBox);  
			this.toolTip = "选择";  
		}  
		
		override public function set data(value:Object):void{  
			super.data = value; // DataGrid RollColor颜色改变有效
			
			this.selected = value.dgSelected;  
			this.currentData = value; //保存整行的引用  
		}  
//		
		//点击check box时，根据状况向selectedItems array中添加当前行的引用，或者从array中移除  
		private function onClickCheckBox(e:Event):void{   
			var dg:DataGrid = DataGrid(listData.owner);//获取DataGrid对象  
			var column:CheckBoxColumn = dg.columns[listData.columnIndex];//获取整列的显示对 象  
			var selectItems:Array = column.selectItems;  
			
			currentData.dgSelected = this.selected;// 根据是否选中的状态，更改数据源中选中的标记  
//			trace(column + "; " + listData.columnIndex);
			
			if(this.selected){  
				selectItems.push(this.currentData);  
			}else{  
				column.cloumnSelected = false; // 存在一项未选中，则取消全选状态
				for(var i:int = 0; i<selectItems.length; i++){  
					if(selectItems[i] == this.currentData){  
						selectItems.splice(i,1)  
					}  
				}  
			}  
			dg.dataProvider.refresh(); // 刷新数据源，更新选择框状态
		}  
	}  
}  
