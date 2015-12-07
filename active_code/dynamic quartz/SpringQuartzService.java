package com.ibm.ynmcc.survey.task;

import java.text.ParseException;

import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.scheduling.quartz.CronTriggerBean;

public class SpringQuartzService {

	private Scheduler schedulerFactory;
	
	public void createSpringJobDetail(ScheduleJob job) {
		try {
			String jobId = job.getJobGroup() + "_" + job.getJobId();
			CronTriggerBean cronTrigger = 
					(CronTriggerBean) schedulerFactory.getTrigger(jobId, Scheduler.DEFAULT_GROUP);
			if(cronTrigger == null) {
				cronTrigger = new CronTriggerBean();
			}
			if(!job.getCronExpression().equalsIgnoreCase(cronTrigger.getCronExpression())) {
				System.out.println("reset task invoking time。。。");
				JobDetail jobDetail = new JobDetail(jobId, QuartzJobFactory.class);
				cronTrigger.setJobDetail(jobDetail);
				cronTrigger.setCronExpression(job.getCronExpression());
				cronTrigger.setName(jobId);
				
//				schedulerFactory.rescheduleJob(jobId, Scheduler.DEFAULT_GROUP, cronTrigger);
				
				schedulerFactory.scheduleJob(jobDetail, cronTrigger);
				schedulerFactory.start();
			} else {
				System.out.println("not need to reset task invoking time。。。");
			}
		} catch (ParseException e) {
			e.printStackTrace();
			System.out.println("create spring trigger ParseException...." + e.getMessage());
		} catch (SchedulerException e) {
			e.printStackTrace();
			System.out.println("rescheduleJob SchedulerException...." + e.getMessage());
		}
	}

	public Scheduler getSchedulerFactory() {
		return schedulerFactory;
	}

	public void setSchedulerFactory(Scheduler schedulerFactory) {
		this.schedulerFactory = schedulerFactory;
	}
	
	public static void main(String[] args) {
		ApplicationContext context = new ClassPathXmlApplicationContext("classpath:spring/spring-task.xml");
		
		SpringQuartzService service = (SpringQuartzService) context.getBean("springQuartzService");
		ScheduleJob job = new ScheduleJob();
		job.setJobGroup("Question");
		job.setJobId("1");
		job.setJobName("Question_1");
		job.setCronExpression("0/10 * * * * ?");
		
		System.out.println("start create job..");
		service.createSpringJobDetail(job);
		System.out.println("end create job..");
	}
}
