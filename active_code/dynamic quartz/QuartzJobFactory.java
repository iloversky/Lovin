package com.ibm.ynmcc.survey.task;

import java.util.Date;
import java.util.Iterator;
import java.util.Set;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public class QuartzJobFactory implements Job {

	public void execute(JobExecutionContext context) throws JobExecutionException {
		System.out.println("任务成功运行: " + new Date());
		JobDataMap dataMap = context.getMergedJobDataMap();
		System.out.println("dataMap size: " + dataMap.size());
		Set<String> keySet = dataMap.keySet();
		Iterator<String> keyIt = keySet.iterator();
		while(keyIt.hasNext()) {
			ScheduleJob scheduleJob = (ScheduleJob) dataMap.get(keyIt.next());
			System.out.println("任务名称 = [" + scheduleJob.getJobName() + "]");
		}
	}
}
