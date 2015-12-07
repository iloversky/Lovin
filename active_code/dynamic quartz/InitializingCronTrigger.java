package com.ibm.ynmcc.survey.task;

import java.io.Serializable;
import java.text.ParseException;

import org.springframework.scheduling.quartz.CronTriggerBean;

public class InitializingCronTrigger extends CronTriggerBean implements
		Serializable {

	private static final long serialVersionUID = 1L;

	private ScheduleInfoManager scheduleInfoManager;
	
	// 设值注入，通过setter方法传入被调用者的实例scheduleInfoManager
	public void setScheduleInfoManager(ScheduleInfoManager scheduleInfoManager)
			throws ParseException {
		this.scheduleInfoManager = scheduleInfoManager;
	}
	
	public ScheduleInfoManager getScheduleInfoManager() {
		return scheduleInfoManager;
	}
}
