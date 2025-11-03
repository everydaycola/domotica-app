// Shared cron schedule type for scenes and scheduler hook
export type CronSchedule = {
  /** Minute (1-59 or patterns like *, 0-59 actually used by JS Date) */
  minute: string;
  /** Hour (0-23) */
  hour: string;
  /** Day of the month (1-31) */
  dayOfMonth: string;
  /** Month (1-12) */
  month: string;
  /** Day of the week (1-7, where 1 is Monday, 7 is Sunday) */
  dayOfWeek: string;
};
