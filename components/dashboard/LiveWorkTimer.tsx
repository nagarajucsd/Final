import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Icon from '../common/Icon';
import Button from '../common/Button';
import { AttendanceRecord } from '../../types';

interface LiveWorkTimerProps {
  record: AttendanceRecord;
  onClockIn: () => void;
  onClockOut: () => void;
  weeklyAccumulatedMs: number;
  isWeeklyTimerActive: boolean;
}

const formatMillisecondsToHHMMSS = (ms: number) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const LiveWorkTimer: React.FC<LiveWorkTimerProps> = ({ record, onClockIn, onClockOut, weeklyAccumulatedMs, isWeeklyTimerActive }) => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const isClockedOut = !!record.clockOut;
  
  const FORTY_HOURS_MS = 40 * 60 * 60 * 1000;

  useEffect(() => {
    if (isClockedOut) {
      // If clocked out, show the final accumulated weekly time.
      setElapsedTime(formatMillisecondsToHHMMSS(weeklyAccumulatedMs));
      setWeeklyProgress(Math.min(100, (weeklyAccumulatedMs / FORTY_HOURS_MS) * 100));
      return;
    }

    if (!record.clockIn) {
      setElapsedTime('00:00:00');
      setWeeklyProgress(0);
      return;
    }

    // Use clockInTimestamp if available, otherwise parse clockIn string
    let clockInTime: number;
    if (record.clockInTimestamp) {
      clockInTime = new Date(record.clockInTimestamp).getTime();
    } else {
      const [time, modifier] = record.clockIn.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      const [year, month, day] = record.date.split('-').map(Number);
      const clockInDate = new Date(year, month - 1, day, hours, minutes);
      clockInTime = clockInDate.getTime();
    }

    const updateDisplayTime = () => {
        const now = Date.now();
        // Calculate today's session duration (starts from 00:00:00)
        const sessionDurationMs = Math.max(0, now - clockInTime);
        
        // For display: show only today's session time
        setElapsedTime(formatMillisecondsToHHMMSS(sessionDurationMs));
        
        // For weekly progress: add today's session to accumulated time
        const totalMs = isWeeklyTimerActive ? weeklyAccumulatedMs + sessionDurationMs : weeklyAccumulatedMs;
        setWeeklyProgress(Math.min(100, (totalMs / FORTY_HOURS_MS) * 100));
    };
    
    updateDisplayTime();
    const timerId = setInterval(updateDisplayTime, 1000);

    return () => clearInterval(timerId);
  }, [record.clockIn, record.clockInTimestamp, record.clockOut, weeklyAccumulatedMs, isWeeklyTimerActive, record.date, isClockedOut, FORTY_HOURS_MS]);

  const titleText = isClockedOut 
      ? 'Today\'s Work Hours' 
      : 'Today\'s Work Hours (Live)';
  
  const weeklyHours = (weeklyProgress / 100) * 40;
      
  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full ${isClockedOut ? 'bg-secondary' : 'bg-success/10'}`}>
              <Icon name="clock" className={`h-8 w-8 ${isClockedOut ? 'text-muted-foreground' : 'text-success'}`} />
            </div>
            <div>
              {/* Show both clock-in and clock-out times */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Clock In: {record.clockIn || 'Not clocked in'}
                </p>
                {record.clockOut && (
                  <p className="text-sm font-medium text-muted-foreground">
                    Clock Out: {record.clockOut}
                  </p>
                )}
              </div>
              <p className="text-4xl font-bold text-foreground tracking-wider mt-2">{elapsedTime}</p>
              <p className="text-xs text-muted-foreground">{titleText}</p>
            </div>
          </div>
          {/* Always show both buttons - Clock In unlocked for testing */}
          <div className="flex flex-col gap-2">
            <Button 
              variant="default" 
              size="lg" 
              onClick={onClockIn}
              title="Clock in for today (Always enabled for testing)"
            >
              🕐 Clock In
            </Button>
            <Button 
              variant="destructive" 
              size="lg" 
              onClick={onClockOut}
              title="Clock out"
              disabled={isClockedOut || !record.clockIn}
            >
              🕐 Clock Out
            </Button>
          </div>
        </div>
        
        {/* Weekly Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Weekly Goal Progress</span>
            <span className="font-semibold">{weeklyHours.toFixed(1)} / 40 hours ({weeklyProgress.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                weeklyProgress >= 100 ? 'bg-green-500' : 
                weeklyProgress >= 75 ? 'bg-blue-500' : 
                weeklyProgress >= 50 ? 'bg-yellow-500' : 
                'bg-orange-500'
              }`}
              style={{ width: `${weeklyProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {weeklyProgress >= 100 
              ? '🎉 Weekly goal completed!' 
              : `${(40 - weeklyHours).toFixed(1)} hours remaining to reach 40-hour goal`
            }
          </p>
        </div>
      </div>
    </Card>
  );
};

export default LiveWorkTimer;
