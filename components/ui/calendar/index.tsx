"use client";

import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icon";

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  disablePastDates?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  selectedDate,
  className,
  minDate,
  maxDate,
  disablePastDates = false,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    if (!isDateDisabled(day) && onDateSelect) {
      onDateSelect(clickedDate);
    }
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if past dates should be disabled
    if (disablePastDates && date < today) {
      return true;
    }
    
    // Check against minDate
    if (minDate) {
      const minDateCopy = new Date(minDate);
      minDateCopy.setHours(0, 0, 0, 0);
      if (date < minDateCopy) {
        return true;
      }
    }
    
    // Check against maxDate
    if (maxDate) {
      const maxDateCopy = new Date(maxDate);
      maxDateCopy.setHours(23, 59, 59, 999);
      if (date > maxDateCopy) {
        return true;
      }
    }
    
    return false;
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  return (
    <Card className={`p-4 ${className || ""}`}>
      <VStack className="gap-4">
        {/* Calendar Header */}
        <HStack className="items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onPress={() => navigateMonth('prev')}
            className="p-2"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          
          <Text className="text-lg font-semibold text-typography-900">
            {monthNames[currentMonth]} {currentYear}
          </Text>
          
          <Button
            variant="outline"
            size="sm"
            onPress={() => navigateMonth('next')}
            className="p-2"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </HStack>

        {/* Day Headers */}
        <Box className="grid grid-cols-7 gap-1">
          {dayNames.map((dayName) => (
            <Box key={dayName} className="p-2 text-center">
              <Text className="text-xs font-medium text-typography-500">
                {dayName}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Calendar Grid */}
        <Box className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <Box key={index} className="aspect-square">
              {day ? (
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => handleDateClick(day)}
                  disabled={isDateDisabled(day)}
                  className={`w-full h-full border-transparent ${
                    isDateDisabled(day)
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-background-100"
                  } ${
                    isToday(day)
                      ? "bg-primary-500 hover:bg-primary-600"
                      : isSelected(day)
                      ? "bg-primary-100 border-primary-300"
                      : ""
                  }`}
                >
                  <ButtonText
                    className={`text-sm ${
                      isDateDisabled(day)
                        ? "text-typography-300"
                        : isToday(day)
                        ? "text-white font-semibold"
                        : isSelected(day)
                        ? "text-primary-700 font-medium"
                        : "text-typography-700"
                    }`}
                  >
                    {day}
                  </ButtonText>
                </Button>
              ) : (
                <Box className="w-full h-full" />
              )}
            </Box>
          ))}
        </Box>
      </VStack>
    </Card>
  );
};

export { Calendar };