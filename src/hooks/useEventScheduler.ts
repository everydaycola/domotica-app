import {useEffect, useRef} from 'react';

// cron-like string patterns:
// * : matches any value
// N : matches a specific number
// N,M,P : matches any of the numbers in the list
// N-M : matches any number in the range (inclusive)
// * /N : matches any value that is a multiple of N (step) (!!! no space between * and / )

// combinating them is possible (n-m,*/n) just means the union of both ',' is like OR

import type { CronSchedule } from '../model';


// value is the current value (current minute)
// cronPart is the cron string for this field (e.g., "* /15")
// returns true if the value matches the cron part's rule (if current minute is multiple of 15)
const parseCronPart = (value: number, cronPart: string): boolean => {
  if (cronPart === '*') {
    return true;
  }

  // Check for list (,)
  const parts = cronPart.split(',');

  // Check each part in the list
  return parts.some((part) => {
    // Check for step (*/)
    if (part.startsWith('*/')) {
      const step = Number.parseInt(part.substring(2));
      if (Number.isNaN(step)) {
        return false;
      }
      return value % step === 0;
    }

    // Check for range (-)
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (Number.isNaN(start) || Number.isNaN(end)) {
        return false;
      }
      return value >= start && value <= end;
    }

    // Check for specific number
    const num = Number.parseInt(part);
    if (Number.isNaN(num)) {
      return false;
    }
    return value === num;
  });
};

export const shouldTrigger = (date: Date, schedule: CronSchedule): boolean => {
  // Note: getMonth() is 0-11, so we add 1 for cron (1-12)
  const matchesMinute = parseCronPart(date.getMinutes(), schedule.minute);
  const matchesHour = parseCronPart(date.getHours(), schedule.hour);
  const matchesDayOfMonth = parseCronPart(date.getDate(), schedule.dayOfMonth);
  const matchesMonth = parseCronPart(date.getMonth() + 1, schedule.month);
  // for .getDay, Sunday is 0, Monday 1; map to 1-7 with Mon=1, Sun=7
  const dow = ((date.getDay() + 6) % 7) + 1;
  const matchesDayOfWeek = parseCronPart(dow, schedule.dayOfWeek);

  // In cron, dayOfMonth and dayOfWeek are often ORed if both are set.
  // Here, we'll keep it simple and AND them.
  // ex: in linux, if it's * * 15 * 5, it triggers on the 15th of every month and on Friday.
  //     for us, it triggers only when it's on the 15th of the month and that day is also a Friday.
  // For simplicity, we AND everything.
  return (
    matchesMinute &&
    matchesHour &&
    matchesDayOfMonth &&
    matchesMonth &&
    matchesDayOfWeek
  );
};

// custom react hook to run a callback on a cron schedule
// defaults to every 30 seconds
// interval isn't perfect for this, but it works well enough
export const cronToString = (c: CronSchedule | null | undefined): string => {
  if (!c) return 'Not scheduled';
  // Simple compact format: m h dom mon dow
  return `${c.minute} ${c.hour} ${c.dayOfMonth} ${c.month} ${c.dayOfWeek}`;
};

export const useEventScheduler = (
  schedule: CronSchedule,
  onTrigger: () => void,
  pollingIntervalMs: number = 30 * 1000
) => {
  // useRef is like useState, but it's not a state variable, it's a reference to a variable
  const onTriggerRef = useRef(onTrigger);
  onTriggerRef.current = onTrigger;

  // Store the last minute we triggered (not the last check time)
  const lastTriggeredMinuteRef = useRef<number | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();

      // If we already triggered for this minute, skip
      if (lastTriggeredMinuteRef.current === now.getMinutes()) {
        return;
      }
      console.log('Checking schedule:', schedule, ' at ', now.toLocaleTimeString());

      // Check if the current time matches the schedule
      if (shouldTrigger(now, schedule)) {
        console.log('Triggering event for schedule:', schedule);
        onTriggerRef.current();
        lastTriggeredMinuteRef.current = now.getMinutes();
      }
    }, pollingIntervalMs);

    return () => clearInterval(intervalId);
  }, [schedule, pollingIntervalMs]);
};