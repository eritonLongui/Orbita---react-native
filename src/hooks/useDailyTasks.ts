import { useCallback, useEffect, useState } from 'react';
import { getTodayTasks, saveTodayTasks } from '../services/dailyTasks';
import { DailyTask } from '../types';

export function useDailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const list = await getTodayTasks();
    setTasks(list);
    setLoaded(true);
    return list;
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggleDone = useCallback((taskId: string) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
      void saveTodayTasks(next);
      return next;
    });
  }, []);

  return { tasks, loaded, refresh, toggleDone };
}
