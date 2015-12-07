package com.ibm.ynmcc.survey.task;

import java.net.InetAddress;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.quartz.Scheduler;
import org.springframework.scheduling.quartz.CronTriggerBean;

import com.ibm.ynmcc.survey.dao.QuestionSurveyExampaperDao;
import com.ibm.ynmcc.survey.pojo.TQuestionSurveyExampaper;
import com.ibm.ynmcc.survey.pojo.TQuestionSurveyExamperson;
import com.ibm.ynmcc.survey.service.QuestionSurveyExampaperService;

/**
 * @Title: ScheduleInfoManager.java
 * @author iLover
 * @Description: 动态设置 Quartz任务调度时间
 * @date 2014-3-7 上午10:12:33   
 * @version v1.0
 */
public class ScheduleInfoManager {
	
	private Scheduler scheduler;
	
	private QuestionSurveyExampaperDao surveyExampaperDao; //问卷Dao
	
	private final String VALID_IP = "10.173.143.106"; // "10.173.254.86";"10.173.143.106"
	
	private final String[] TEST_TASK_CRONEXPRESSION = new String[]{"0/5 * * * * ?", "0/10 * * * * ?", 
			"0/15 * * * * ?", "0/20 * * * * ?", "0/25 * * * * ?", "0/30 * * * * ?", "0/35 * * * * ?"};

	public QuestionSurveyExampaperDao getSurveyExampaperDao() {
		return surveyExampaperDao;
	}

	public void setSurveyExampaperDao(QuestionSurveyExampaperDao surveyExampaperDao) {
		this.surveyExampaperDao = surveyExampaperDao;
	}

	// 设值注入，通过setter方法传入被调用者的实例scheduler
	public void setScheduler(Scheduler scheduler) {
		this.scheduler = scheduler;
	}

	public void reScheduleJob() {
		System.out.println("ScheduleInfoManager, reScheduleJob....." + new Date());
		InetAddress address = null;
		try {
			address = InetAddress.getLocalHost();
			String currentIp = address.getHostAddress();
			System.out.println("当前 IP：" + currentIp);
			if (VALID_IP.equals(currentIp.trim())) {
				// 运行时可通过动态注入的scheduler得到trigger，注意采用这种注入方式在有的项目中会有问题，
				// 如果遇到注入问题，可以采取在运行方法时候，获得bean来避免错误发生。
				CronTriggerBean trigger = (CronTriggerBean) scheduler.getTrigger(
						"cronTrigger", Scheduler.DEFAULT_GROUP);
//				List<TQuestionSurveyExampaper> questionSurveyExampaperList = 
//						surveyExampaperDao.findSurveyExampaperList();
//				
//				if(questionSurveyExampaperList != null) {
//					for(TQuestionSurveyExampaper exmapaper : questionSurveyExampaperList) {
//						
//					}
					String dbCronExpression = TEST_TASK_CRONEXPRESSION[new Random().nextInt(6)]; // exam;
					System.out.println("current cron....." + dbCronExpression);
					String originConExpression = trigger.getCronExpression();
					// 判断从DB中取得的任务时间(dbCronExpression)和现在的quartz线程中的任务时间(originConExpression)是否相等
					// 如果相等，则表示用户并没有重新设定数据库中的任务时间，这种情况不需要重新rescheduleJob
					if (!originConExpression.equalsIgnoreCase(dbCronExpression)) {
						trigger.setCronExpression(dbCronExpression);
						scheduler.rescheduleJob("cronTrigger", Scheduler.DEFAULT_GROUP,
								trigger);
					}
					// 下面是具体的job内容，可自行设置
				}
//			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("reScheduleJob Exception....");
		}
	}
	
	public static void main(String[] args) {
		for(int i = 0; i < 50; i++) {
			System.out.println(new Random().nextInt(10));
		}
	}
}
