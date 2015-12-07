package com.surekam.checkboxcolumn
{  
	import mx.controls.dataGridClasses.DataGridColumn;
	import mx.core.ClassFactory;

	public class CheckBoxColumn extends DataGridColumn{ 
		public var cloumnSelected:Boolean = false;//保存该列是否全选的属性（用户先点击全选后在手动的取消几行数据的选中状态时，这里的状态不会改变）           
		public var selectItems:Array = new Array();//用户保存用户选中的数据 
		
//		public var currRecord:int = 15; // 每页显示的记录数，用于全选时选中的数据项数目
//		public var selectPage:int = 0;// 全选状态为 true时所在页
//		public var selectPageArr:Array = new Array(); // 全选状态为 true时所在页数组
		
		public function CheckBoxColumn(columnName:String=null){ 
			super(columnName);  
			this.sortable = false;
			this.headerRenderer = new ClassFactory(CheckBoxHeaderRenderer);
			this.itemRenderer = new ClassFactory(CheckBoxItemRenderer);
		} 
	} 
}  
