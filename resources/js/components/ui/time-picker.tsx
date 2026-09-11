import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimePickerProps {
    value?: string;
    onChange?: (value: string) => void;
    onReject?: () => void;
    className?: string;
    placeholder?: string;
    minTime?: string;
    maxTime?: string;
}

export function TimePicker({ value, onChange, onReject, className, placeholder = "Pilih Waktu", minTime, maxTime }: TimePickerProps) {
    const [open, setOpen] = useState(false);
    
    const [hour, setHour] = useState<string>('');
    const [minute, setMinute] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        setInputValue(value || '');
        if (value) {
            const [h, m] = value.split(':');
            setHour(h || '');
            setMinute(m || '');
        } else {
            setHour('');
            setMinute('');
        }
    }, [value]);

    useEffect(() => {
        if (value && (minTime || maxTime)) {
            const [hStr, mStr] = value.split(':');
            const h = parseInt(hStr);
            const m = parseInt(mStr);
            if (!isNaN(h) && !isNaN(m)) {
                let startLimit = 0;
                let endLimit = 24 * 60 - 1;
                let isWrapped = false;

                if (minTime) {
                    const [mh, mm] = minTime.split(':').map(Number);
                    if (!isNaN(mh) && !isNaN(mm)) startLimit = mh * 60 + mm;
                }
                if (maxTime) {
                    const [mh, mm] = maxTime.split(':').map(Number);
                    if (!isNaN(mh) && !isNaN(mm)) endLimit = mh * 60 + mm;
                }

                if (minTime && maxTime && endLimit < startLimit) {
                    endLimit += 24 * 60;
                    isWrapped = true;
                }

                let t = h * 60 + m;
                if (isWrapped && t < startLimit) {
                    t += 24 * 60;
                }

                const valid = t >= startLimit && t <= endLimit;
                if (!valid) {
                    if (onChange) onChange('');
                    if (onReject) onReject();
                }
            }
        }
    }, [minTime, maxTime, value, onChange]);

    let startLimit = 0;
    let endLimit = 24 * 60 - 1;
    let isWrapped = false;

    if (minTime) {
        const [h, m] = minTime.split(':').map(Number);
        if (!isNaN(h) && !isNaN(m)) startLimit = h * 60 + m;
    }
    if (maxTime) {
        const [h, m] = maxTime.split(':').map(Number);
        if (!isNaN(h) && !isNaN(m)) endLimit = h * 60 + m;
    }

    if (minTime && maxTime && endLimit < startLimit) {
        endLimit += 24 * 60;
        isWrapped = true;
    }

    const isTimeValid = (h: number, m: number) => {
        if (!minTime && !maxTime) return true;
        let t = h * 60 + m;
        if (isWrapped && t < startLimit) {
            t += 24 * 60;
        }
        return t >= startLimit && t <= endLimit;
    };

    const isHourValid = (h: number) => {
        if (!minTime && !maxTime) return true;
        for (let m = 0; m < 60; m++) {
            if (isTimeValid(h, m)) return true;
        }
        return false;
    };

    const isMinuteValid = (hStr: string, m: number) => {
        if (!minTime && !maxTime) return true;
        if (!hStr) {
            for (let i = 0; i < 24; i++) {
                if (isTimeValid(i, m)) return true;
            }
            return false;
        }
        return isTimeValid(parseInt(hStr), m);
    };

    const handleTimeChange = (type: 'hour' | 'minute', val: string) => {
        let newHour = hour;
        let newMinute = minute;

        if (type === 'hour') {
            newHour = val;
            setHour(val);
        } else {
            newMinute = val;
            setMinute(val);
        }

        if (newHour && newMinute) {
            if (!isMinuteValid(newHour, parseInt(newMinute))) {
                for (let m = 0; m < 60; m++) {
                    if (isMinuteValid(newHour, m)) {
                        newMinute = m.toString().padStart(2, '0');
                        setMinute(newMinute);
                        break;
                    }
                }
            }
            if (onChange) onChange(`${newHour}:${newMinute}`);
        } else if (newHour && !newMinute) {
            let mStr = '00';
            if (!isMinuteValid(newHour, 0)) {
                for (let m = 0; m < 60; m++) {
                    if (isMinuteValid(newHour, m)) {
                        mStr = m.toString().padStart(2, '0');
                        break;
                    }
                }
            }
            setMinute(mStr);
            if (onChange) onChange(`${newHour}:${mStr}`);
        } else if (!newHour && newMinute) {
            let hStr = '00';
            if (!isMinuteValid('00', parseInt(newMinute))) {
                 for (let h = 0; h < 24; h++) {
                     if (isMinuteValid(h.toString(), parseInt(newMinute))) {
                         hStr = h.toString().padStart(2, '0');
                         break;
                     }
                 }
            }
            setHour(hStr);
            if (onChange) onChange(`${hStr}:${newMinute}`);
        }
    };

    const hours = Array.from({ length: 24 }).map((_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }).map((_, i) => i.toString().padStart(2, '0'));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        
        // Auto-insert colon
        if (val.length === 2 && inputValue.length === 1 && !val.includes(':')) {
            val = val + ':';
        }
        
        setInputValue(val);
        
        if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val)) {
            const [h, m] = val.split(':');
            if (isTimeValid(parseInt(h), parseInt(m))) {
                 setHour(h.padStart(2, '0'));
                 setMinute(m);
                 if (onChange) onChange(`${h.padStart(2, '0')}:${m}`);
            } else {
                 if (onReject) onReject();
            }
        } else if (val === '') {
            setHour('');
            setMinute('');
            if (onChange) onChange('');
        }
    };

    const handleInputBlur = () => {
         setTimeout(() => {
             setInputValue(value || '');
         }, 150);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className="relative w-full flex items-center border border-neutral-200 rounded-md bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#035EA9] focus-within:ring-offset-2 transition-all">
                <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder={placeholder}
                    className={cn(
                        "border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent flex-1 text-center font-medium",
                        className
                    )}
                />
                <PopoverTrigger asChild>
                    <button type="button" className="p-2 mr-1 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none transition-colors">
                        <Clock className="h-4 w-4" />
                    </button>
                </PopoverTrigger>
            </div>
            <PopoverContent 
                className="w-auto p-0" 
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="flex h-56 divide-x divide-neutral-200">
                    <div className="flex flex-col flex-1">
                        <div className="px-2 py-1.5 text-center text-xs font-semibold text-neutral-500 border-b border-neutral-100 bg-neutral-50/50">Jam</div>
                        <div className="flex-1 overflow-y-auto px-1 py-1 w-20 scrollbar-thin scrollbar-thumb-neutral-200">
                            {hours.map((h) => {
                                const valid = isHourValid(parseInt(h));
                                return (
                                    <button
                                        key={h}
                                        type="button"
                                        disabled={!valid}
                                        onClick={() => handleTimeChange('hour', h)}
                                        className={cn(
                                            "w-full rounded-md px-2 py-1.5 text-sm text-center transition-colors hover:bg-neutral-100",
                                            hour === h && "bg-neutral-900 text-white hover:bg-neutral-800",
                                            !valid && "opacity-30 cursor-not-allowed hover:bg-transparent"
                                        )}
                                    >
                                        {h}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col flex-1">
                        <div className="px-2 py-1.5 text-center text-xs font-semibold text-neutral-500 border-b border-neutral-100 bg-neutral-50/50">Menit</div>
                        <div className="flex-1 overflow-y-auto px-1 py-1 w-20 scrollbar-thin scrollbar-thumb-neutral-200">
                            {minutes.map((m) => {
                                const valid = isMinuteValid(hour, parseInt(m));
                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        disabled={!valid}
                                        onClick={() => {
                                            handleTimeChange('minute', m);
                                        }}
                                        className={cn(
                                            "w-full rounded-md px-2 py-1.5 text-sm text-center transition-colors hover:bg-neutral-100",
                                            minute === m && "bg-neutral-900 text-white hover:bg-neutral-800",
                                            !valid && "opacity-30 cursor-not-allowed hover:bg-transparent"
                                        )}
                                    >
                                        {m}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
