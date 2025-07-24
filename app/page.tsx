"use client";

import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { MessageCircleIcon } from "@/components/ui/icon";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI healthcare assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message. As an AI healthcare assistant, I can help you with general health information, appointment scheduling, medication reminders, and more. What specific assistance do you need?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Box className="h-[calc(100vh-4rem)] bg-background-50 flex flex-col p-2 sm:p-4">
      <Box className="w-full max-w-6xl mx-auto h-full flex flex-col">
        {/* Header - Compact */}
        <VStack className="items-center mb-3 sm:mb-4 gap-2">
          <Box className="bg-primary-100 p-2 sm:p-3 rounded-full">
            <MessageCircleIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600" />
          </Box>
          <VStack className="items-center gap-1">
            <Text className="text-xl sm:text-2xl lg:text-3xl font-bold text-typography-900">
              HospAI Assistant
            </Text>
            <Text className="text-sm sm:text-base lg:text-lg text-typography-600 text-center max-w-2xl">
              Get instant answers to your healthcare questions, schedule
              appointments, and manage your health
            </Text>
          </VStack>
        </VStack>

        {/* Chat Container - Takes most space */}
        <Box className="bg-background-0 rounded-xl shadow-lg border border-outline-200 overflow-hidden flex-1 flex flex-col min-h-0">
          {/* Messages - Flexible height with minimum */}
          <ScrollView
            className="flex-1 p-3 sm:p-4 hide-scrollbar min-h-[200px]"
            showsVerticalScrollIndicator={false}
          >
            <VStack className="gap-3">
              {messages.map((message) => (
                <HStack
                  key={message.id}
                  className={`max-w-[85%] sm:max-w-[80%] ${
                    message.isUser ? "self-end" : "self-start"
                  }`}
                >
                  <Box
                    className={`p-2 sm:p-3 rounded-lg ${
                      message.isUser
                        ? "bg-primary-500 ml-auto"
                        : "bg-background-100"
                    }`}
                  >
                    <Text
                      className={`text-sm sm:text-base ${
                        message.isUser
                          ? "text-typography-0"
                          : "text-typography-800"
                      }`}
                    >
                      {message.text}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
          </ScrollView>

          {/* Input Area - Compact */}
          <Box className="border-t border-outline-200 p-2 sm:p-3">
            <HStack className="gap-2 sm:gap-3">
              <Input className="flex-1">
                <InputField
                  placeholder="Type your healthcare question here..."
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={sendMessage}
                />
              </Input>
              <Button onPress={sendMessage} size="sm" className="px-3 sm:px-4">
                <ButtonText className="text-sm">Send</ButtonText>
              </Button>
            </HStack>
          </Box>
        </Box>

        {/* Quick Actions - Compact and responsive */}
        <VStack className="mt-2 sm:mt-3 gap-2 flex-shrink-0">
          <Text className="text-base sm:text-lg font-semibold text-typography-900 text-center">
            Quick Actions
          </Text>
          <HStack className="justify-center gap-1 sm:gap-2 lg:gap-3 flex-wrap">
            <Button variant="outline" size="xs" className="px-2 py-1">
              <ButtonText className="text-xs sm:text-sm">
                Book Appointment
              </ButtonText>
            </Button>
            <Button variant="outline" size="xs" className="px-2 py-1">
              <ButtonText className="text-xs sm:text-sm">
                Medical Records
              </ButtonText>
            </Button>
            <Button variant="outline" size="xs" className="px-2 py-1">
              <ButtonText className="text-xs sm:text-sm">Medication</ButtonText>
            </Button>
            <Button variant="outline" size="xs" className="px-2 py-1">
              <ButtonText className="text-xs sm:text-sm">
                Find Doctors
              </ButtonText>
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}
