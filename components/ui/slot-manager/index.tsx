"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form-control";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
} from "@/components/ui/select";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import {
  AddIcon,
  EditIcon,
  TrashIcon,
  ClockIcon,
  ChevronDownIcon,
  LoaderIcon,
  CheckIcon,
} from "@/components/ui/icon";

interface Hospital {
  id: number;
  name: string;
  city?: string;
  state?: string;
}

interface DoctorSlot {
  id: number;
  type: string;
  description?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  startDate: string;
  schedule?: string;
  hospital: Hospital;
  isActive: boolean;
}

interface SlotFormData {
  hospitalId: string;
  type: string;
  description: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  schedule: string;
  startDate: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

const SlotManager: React.FC = () => {
  const [slots, setSlots] = useState<DoctorSlot[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<DoctorSlot | null>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<SlotFormData>({
    hospitalId: "",
    type: "",
    description: "",
    daysOfWeek: [1],
    startTime: "",
    endTime: "",
    schedule: "weekly",
    startDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    startHour: "09",
    startMinute: "00",
    endHour: "17",
    endMinute: "00",
  });

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const scheduleOptions = [
    { label: "Weekly", value: "weekly" },
    { label: "Bi-weekly", value: "biweekly" },
    { label: "Monthly", value: "monthly" },
    { label: "One-time", value: "onetime" },
    { label: "Custom", value: "custom" },
  ];

  const slotTypeOptions = [
    { label: "Out Patients", value: "OUT_PATIENTS" },
    { label: "IP Rounds", value: "IP_ROUNDS" },
    { label: "Surgery", value: "SURGERY" },
    { label: "Consultation", value: "CONSULTATION" },
    { label: "Emergency", value: "EMERGENCY" },
    { label: "OPD", value: "OPD" },
    { label: "Checkup", value: "CHECKUP" },
  ];

  // Generate hour options (0-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    label: i.toString().padStart(2, '0'),
    value: i.toString().padStart(2, '0')
  }));

  // Generate minute options (00, 15, 30, 45)
  const minuteOptions = [
    { label: "00", value: "00" },
    { label: "15", value: "15" },
    { label: "30", value: "30" },
    { label: "45", value: "45" }
  ];

  // Helper functions for time handling
  const parseTime = (timeString: string) => {
    if (!timeString) return { hour: "09", minute: "00" };
    const [hour, minute] = timeString.split(':');
    return { 
      hour: hour?.padStart(2, '0') || "09", 
      minute: minute?.padStart(2, '0') || "00" 
    };
  };

  const formatTime = (hour: string, minute: string) => {
    return `${hour}:${minute}`;
  };

  // Calculate the start date for a specific day of week based on the selected start date
  const calculateStartDateForDay = (baseStartDate: string, targetDayOfWeek: number) => {
    const startDate = new Date(baseStartDate);
    const startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    let daysToAdd = targetDayOfWeek - startDayOfWeek;
    
    // If the target day is earlier in the week than start date, move to next week
    if (daysToAdd < 0) {
      daysToAdd += 7;
    }
    
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + daysToAdd);
    
    return targetDate;
  };

  // Update startTime and endTime when hour/minute changes
  useEffect(() => {
    const newStartTime = formatTime(formData.startHour, formData.startMinute);
    const newEndTime = formatTime(formData.endHour, formData.endMinute);
    
    if (newStartTime !== formData.startTime || newEndTime !== formData.endTime) {
      setFormData(prev => ({
        ...prev,
        startTime: newStartTime,
        endTime: newEndTime
      }));
    }
  }, [formData.startHour, formData.startMinute, formData.endHour, formData.endMinute]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("staffToken");

      if (!token) {
        setError("Authentication required");
        return;
      }

      // Fetch slots and hospitals in parallel
      const [slotsResponse, hospitalsResponse] = await Promise.all([
        fetch("/api/doctor-slots", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/hospitals/list"),
      ]);

      const slotsData = await slotsResponse.json();
      const hospitalsData = await hospitalsResponse.json();

      if (slotsData.success) {
        setSlots(slotsData.data);
      } else {
        setError(slotsData.message || "Failed to fetch slots");
      }

      if (hospitalsData.success) {
        setHospitals(hospitalsData.data);
      } else {
        setError("Failed to fetch hospitals");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof SlotFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
  };

  const resetForm = () => {
    setFormData({
      hospitalId: "",
      type: "",
      description: "",
      daysOfWeek: [1],
      startTime: "",
      endTime: "",
      schedule: "weekly",
      startDate: new Date().toISOString().split('T')[0],
      startHour: "09",
      startMinute: "00",
      endHour: "17",
      endMinute: "00",
    });
    setEditingSlot(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async () => {
    if (
      !formData.hospitalId ||
      !formData.type ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.startDate ||
      formData.daysOfWeek.length === 0
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate start date is not in the past
    const selectedStartDate = new Date(formData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedStartDate < today) {
      setError("Start date cannot be in the past");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("staffToken");

      if (editingSlot) {
        // For editing, use the original single-day API
        const url = `/api/doctor-slots/${editingSlot.id}`;
        const method = "PUT";
        const { daysOfWeek, ...requestData } = formData;
        const finalRequestData = {
          ...requestData,
          dayOfWeek: daysOfWeek[0], // Use first selected day for edit
        };

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(finalRequestData),
        });

        const data = await response.json();

        if (data.success) {
          resetForm();
          fetchData();
        } else {
          setError(data.message || "Failed to save slot");
        }
      } else {
        // For creating, send all selected days to the backend
        const requestData = {
          ...formData,
        };

        const response = await fetch("/api/doctor-slots", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (data.success) {
          resetForm();
          fetchData();
          if (data.partialSuccess) {
            setError(data.message); // Show partial success message with errors
          }
        } else {
          setError(data.message || "Failed to create slots");
        }
      }
    } catch (error) {
      console.error("Error saving slot:", error);
      setError("Failed to save slot");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (slot: DoctorSlot) => {
    const startTimeParts = parseTime(slot.startTime);
    const endTimeParts = parseTime(slot.endTime);
    
    setFormData({
      hospitalId: slot.hospital.id.toString(),
      type: slot.type,
      description: slot.description || "",
      daysOfWeek: [slot.dayOfWeek],
      startTime: slot.startTime,
      endTime: slot.endTime,
      schedule: slot.schedule || "weekly",
      startDate: new Date().toISOString().split('T')[0], // Default to today for editing
      startHour: startTimeParts.hour,
      startMinute: startTimeParts.minute,
      endHour: endTimeParts.hour,
      endMinute: endTimeParts.minute,
    });
    setEditingSlot(slot);
    setShowForm(true);
  };

  const handleDelete = async (slotId: number) => {
    if (!confirm("Are you sure you want to delete this slot?")) {
      return;
    }

    try {
      const token = localStorage.getItem("staffToken");
      const response = await fetch(`/api/doctor-slots/${slotId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        fetchData(); // Refresh the list
      } else {
        setError(data.message || "Failed to delete slot");
      }
    } catch (error) {
      console.error("Error deleting slot:", error);
      setError("Failed to delete slot");
    }
  };

  const formatTimeDisplay = (time: string) => {
    try {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <VStack className="items-center gap-3">
          <LoaderIcon className="h-6 w-6 animate-spin text-primary-500" />
          <Text className="text-typography-500">Loading slots...</Text>
        </VStack>
      </Card>
    );
  }

  return (
    <VStack className="gap-6">
      {/* Header */}
      <HStack className="items-center justify-between">
        <Text className="text-xl font-semibold text-typography-900">
          Schedule Management
        </Text>
        <Button
          onPress={() => setShowForm(!showForm)}
          size="sm"
          className="bg-primary-500"
        >
          <AddIcon className="h-4 w-4 text-white mr-2" />
          <ButtonText>Add Slot</ButtonText>
        </Button>
      </HStack>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-error-50 border border-error-200">
          <Text className="text-error-600 text-sm">{error}</Text>
        </Card>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="p-6">
          <VStack className="gap-4">
            <Text className="text-lg font-medium text-typography-900">
              {editingSlot ? "Edit Slot" : "Add New Slot"}
            </Text>

            {/* Hospital Selection */}
            <FormControl>
              <Text className="text-sm font-medium text-typography-700 mb-2">
                Hospital *
              </Text>
              <Select
                selectedValue={formData.hospitalId}
                onValueChange={(value) =>
                  handleInputChange("hospitalId", value || "")
                }
              >
                <SelectTrigger>
                  <SelectInput placeholder="Select hospital" />
                  <SelectIcon>
                    <ChevronDownIcon className="h-4 w-4" />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectScrollView>
                      {hospitals.map((hospital) => (
                        <SelectItem
                          key={hospital.id}
                          label={hospital.name}
                          value={hospital.id.toString()}
                        >
                          <Text>{hospital.name}</Text>
                          {hospital.city && (
                            <Text className="text-xs text-typography-500">
                              {hospital.city}, {hospital.state}
                            </Text>
                          )}
                        </SelectItem>
                      ))}
                    </SelectScrollView>
                  </SelectContent>
                </SelectPortal>
              </Select>
            </FormControl>

            {/* Type */}
            <FormControl>
              <Text className="text-sm font-medium text-typography-700 mb-2">
                Type *
              </Text>
              <Select
                selectedValue={formData.type}
                onValueChange={(value) =>
                  handleInputChange("type", value || "")
                }
              >
                <SelectTrigger>
                  <SelectInput placeholder="Select slot type" />
                  <SelectIcon>
                    <ChevronDownIcon className="h-4 w-4" />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectScrollView>
                      {slotTypeOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        >
                          <Text>{option.label}</Text>
                        </SelectItem>
                      ))}
                    </SelectScrollView>
                  </SelectContent>
                </SelectPortal>
              </Select>
            </FormControl>

            {/* Description */}
            <FormControl>
              <Text className="text-sm font-medium text-typography-700 mb-2">
                Description
              </Text>
              <Input>
                <InputField
                  placeholder="Optional description"
                  value={formData.description}
                  onChangeText={(value) =>
                    handleInputChange("description", value)
                  }
                />
              </Input>
            </FormControl>

            {/* Days of Week - Multiple Selection */}
            <FormControl>
              <Text className="text-sm font-medium text-typography-700 mb-2">
                Days of Week *
              </Text>
              <VStack className="gap-2">
                {dayNames.map((day, index) => (
                  <Checkbox
                    key={index}
                    value={index.toString()}
                    isChecked={formData.daysOfWeek.includes(index)}
                    onChange={() => {
                      const newDays = formData.daysOfWeek.includes(index)
                        ? formData.daysOfWeek.filter(d => d !== index)
                        : [...formData.daysOfWeek, index];
                      
                      if (newDays.length > 0) {
                        setFormData(prev => ({
                          ...prev,
                          daysOfWeek: newDays
                        }));
                      }
                    }}
                    size="sm"
                  >
                    <CheckboxIndicator>
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel className="text-sm">{day}</CheckboxLabel>
                  </Checkbox>
                ))}
              </VStack>
            </FormControl>

            {/* Start Date */}
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onDateChange={(date) => handleInputChange("startDate", date)}
              placeholder="Select start date"
              required={true}
              minDate={new Date()} // Only allow today or future dates
              className="mb-2"
            />
            
            {formData.startDate && formData.daysOfWeek.length > 0 && (
              <VStack className="gap-1 p-3 bg-background-50 rounded-md border">
                <Text className="text-xs font-medium text-typography-600">
                  Schedule will start on:
                </Text>
                {formData.daysOfWeek.map((dayIndex) => {
                  const calculatedDate = calculateStartDateForDay(formData.startDate, dayIndex);
                  return (
                    <Text key={dayIndex} className="text-xs text-primary-600">
                      • {dayNames[dayIndex]}: {calculatedDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                  );
                })}
              </VStack>
            )}

            {/* Schedule Type */}
            <FormControl>
              <Text className="text-sm font-medium text-typography-700 mb-2">
                Schedule Type *
              </Text>
              <Select
                selectedValue={formData.schedule}
                onValueChange={(value) =>
                  handleInputChange("schedule", value || "weekly")
                }
              >
                <SelectTrigger>
                  <SelectInput placeholder="Select schedule type" />
                  <SelectIcon>
                    <ChevronDownIcon className="h-4 w-4" />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectScrollView>
                      {scheduleOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        >
                          <Text>{option.label}</Text>
                        </SelectItem>
                      ))}
                    </SelectScrollView>
                  </SelectContent>
                </SelectPortal>
              </Select>
            </FormControl>

            {/* Time Range */}
            <VStack className="gap-4">
              {/* Start Time */}
              <VStack className="gap-2">
                <Text className="text-sm font-medium text-typography-700">
                  Start Time *
                </Text>
                <HStack className="gap-2">
                  <Box className="flex-1">
                    <FormControl>
                      <Select
                        selectedValue={formData.startHour}
                        onValueChange={(value) =>
                          handleInputChange("startHour", value || "09")
                        }
                      >
                        <SelectTrigger>
                          <SelectInput placeholder="Hour" value={formData.startHour} />
                          <SelectIcon>
                            <ChevronDownIcon className="h-4 w-4" />
                          </SelectIcon>
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            <SelectDragIndicatorWrapper>
                              <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            <SelectScrollView>
                              {hourOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  label={option.label}
                                  value={option.value}
                                >
                                  <Text>{option.label}</Text>
                                </SelectItem>
                              ))}
                            </SelectScrollView>
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    </FormControl>
                  </Box>
                  <Text className="self-center text-typography-700">:</Text>
                  <Box className="flex-1">
                    <FormControl>
                      <Select
                        selectedValue={formData.startMinute}
                        onValueChange={(value) =>
                          handleInputChange("startMinute", value || "00")
                        }
                      >
                        <SelectTrigger>
                          <SelectInput placeholder="Min" value={formData.startMinute} />
                          <SelectIcon>
                            <ChevronDownIcon className="h-4 w-4" />
                          </SelectIcon>
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            <SelectDragIndicatorWrapper>
                              <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            <SelectScrollView>
                              {minuteOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  label={option.label}
                                  value={option.value}
                                >
                                  <Text>{option.label}</Text>
                                </SelectItem>
                              ))}
                            </SelectScrollView>
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    </FormControl>
                  </Box>
                </HStack>
              </VStack>

              {/* End Time */}
              <VStack className="gap-2">
                <Text className="text-sm font-medium text-typography-700">
                  End Time *
                </Text>
                <HStack className="gap-2">
                  <Box className="flex-1">
                    <FormControl>
                      <Select
                        selectedValue={formData.endHour}
                        onValueChange={(value) =>
                          handleInputChange("endHour", value || "17")
                        }
                      >
                        <SelectTrigger>
                          <SelectInput placeholder="Hour" value={formData.endHour} />
                          <SelectIcon>
                            <ChevronDownIcon className="h-4 w-4" />
                          </SelectIcon>
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            <SelectDragIndicatorWrapper>
                              <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            <SelectScrollView>
                              {hourOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  label={option.label}
                                  value={option.value}
                                >
                                  <Text>{option.label}</Text>
                                </SelectItem>
                              ))}
                            </SelectScrollView>
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    </FormControl>
                  </Box>
                  <Text className="self-center text-typography-700">:</Text>
                  <Box className="flex-1">
                    <FormControl>
                      <Select
                        selectedValue={formData.endMinute}
                        onValueChange={(value) =>
                          handleInputChange("endMinute", value || "00")
                        }
                      >
                        <SelectTrigger>
                          <SelectInput placeholder="Min" value={formData.endMinute} />
                          <SelectIcon>
                            <ChevronDownIcon className="h-4 w-4" />
                          </SelectIcon>
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            <SelectDragIndicatorWrapper>
                              <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            <SelectScrollView>
                              {minuteOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  label={option.label}
                                  value={option.value}
                                >
                                  <Text>{option.label}</Text>
                                </SelectItem>
                              ))}
                            </SelectScrollView>
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    </FormControl>
                  </Box>
                </HStack>
              </VStack>
            </VStack>

            {/* Form Actions */}
            <HStack className="gap-3 justify-end">
              <Button variant="outline" onPress={resetForm}>
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button onPress={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoaderIcon className="h-4 w-4 animate-spin text-white mr-2" />
                ) : null}
                <ButtonText>{editingSlot ? "Update" : "Create"}</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Card>
      )}

      {/* Slots List */}
      <VStack className="gap-4">
        <Text className="text-lg font-medium text-typography-900">
          Current Slots ({slots.length})
        </Text>

        {slots.length === 0 ? (
          <Card className="p-6">
            <VStack className="items-center gap-3">
              <ClockIcon className="h-8 w-8 text-typography-400" />
              <Text className="text-typography-500">No slots scheduled</Text>
              <Text className="text-sm text-typography-400 text-center">
                Add your first slot to start managing your schedule
              </Text>
            </VStack>
          </Card>
        ) : (
          <VStack className="gap-3">
            {slots.map((slot) => (
              <Card key={slot.id} className="p-4">
                <HStack className="items-center justify-between">
                  <VStack className="flex-1 gap-1">
                    <HStack className="items-center gap-2">
                      <Text className="font-medium text-typography-900">
                        {slotTypeOptions.find((opt) => opt.value === slot.type)
                          ?.label || slot.type}
                      </Text>
                      <Text className="text-sm text-primary-600 bg-primary-100 px-2 py-1 rounded">
                        {dayNames[slot.dayOfWeek]}
                      </Text>
                      {slot.schedule && (
                        <Text className="text-sm text-secondary-600 bg-secondary-100 px-2 py-1 rounded">
                          {scheduleOptions.find(
                            (opt) => opt.value === slot.schedule
                          )?.label || slot.schedule}
                        </Text>
                      )}
                    </HStack>
                    <HStack className="items-center gap-4">
                      <Text className="text-sm text-typography-600">
                        {formatTimeDisplay(slot.startTime)} -{" "}
                        {formatTimeDisplay(slot.endTime)}
                      </Text>
                      <Text className="text-sm text-typography-500">
                        @ {slot.hospital.name}
                      </Text>
                      {slot.startDate && (
                        <Text className="text-sm text-info-600">
                          from {new Date(slot.startDate).toLocaleDateString()}
                        </Text>
                      )}
                    </HStack>
                    {slot.description && (
                      <Text className="text-sm text-typography-500">
                        {slot.description}
                      </Text>
                    )}
                  </VStack>

                  <HStack className="gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => handleEdit(slot)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => handleDelete(slot.id)}
                      className="border-error-200 hover:bg-error-50"
                    >
                      <TrashIcon className="h-4 w-4 text-error-600" />
                    </Button>
                  </HStack>
                </HStack>
              </Card>
            ))}
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export { SlotManager };
