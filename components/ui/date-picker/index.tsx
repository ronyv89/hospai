"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Input, InputField } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form-control";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDaysIcon } from "@/components/ui/icon";

interface DatePickerProps {
  value?: string;
  onDateChange?: (date: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onDateChange,
  placeholder = "Select date",
  label,
  required = false,
  minDate,
  maxDate,
  disabled = false,
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && event.target && event.target instanceof Element && !event.target.closest('.date-picker-calendar')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateSelect = (date: Date) => {
    // Validate against min/max dates
    if (minDate && date < minDate) {
      return;
    }
    if (maxDate && date > maxDate) {
      return;
    }

    setSelectedDate(date);
    const formattedDate = formatDate(date);
    if (onDateChange) {
      onDateChange(formattedDate);
    }
    setIsOpen(false);
  };

  // Update selected date when value prop changes
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
      }
    } else {
      setSelectedDate(undefined);
    }
  }, [value]);

  const getMinDateMessage = () => {
    if (minDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (minDate.getTime() === today.getTime()) {
        return "Please select today or a future date";
      }
      return `Please select a date from ${formatDisplayDate(minDate)} onwards`;
    }
    return null;
  };

  return (
    <FormControl className={className}>
      {label && (
        <Text className="text-sm font-medium text-typography-700 mb-2">
          {label} {required && "*"}
        </Text>
      )}
      
      <Box className="relative">
        <Pressable 
          onPress={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
            }
          }}
          disabled={disabled}
          className="cursor-pointer"
        >
          <Input>
            <InputField
              placeholder={placeholder}
              value={selectedDate ? formatDisplayDate(selectedDate) : ""}
              editable={false}
              pointerEvents="none"
              className="cursor-pointer"
            />
          </Input>
          <Box className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <CalendarDaysIcon className="h-4 w-4 text-typography-400" />
          </Box>
        </Pressable>

      </Box>

      {/* Error message */}
      {error && (
        <Text className="text-xs text-error-600 mt-1">{error}</Text>
      )}
      
      {/* Min date message */}
      {getMinDateMessage() && !error && (
        <Text className="text-xs text-typography-500 mt-1">
          {getMinDateMessage()}
        </Text>
      )}

      {/* Calendar overlay with fixed positioning */}
      {isOpen && (
        <Box 
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.1)' }}
        >
          {/* Backdrop */}
          <Pressable 
            className="absolute inset-0" 
            onPress={() => setIsOpen(false)}
          />
          
          {/* Calendar Container */}
          <Box className="relative date-picker-calendar">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              minDate={minDate}
              maxDate={maxDate}
              disablePastDates={!minDate && !maxDate}
              className="shadow-2xl border border-outline-200 bg-background-0 rounded-lg"
            />
          </Box>
        </Box>
      )}
    </FormControl>
  );
};

export { DatePicker };