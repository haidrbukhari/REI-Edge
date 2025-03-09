import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // ✅ Fixed Import
import * as Speech from "expo-speech";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const Create = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false); // ✅ New State
  const [loading, setLoading] = useState(false); // ✅ Added Loading State

  const API_KEY = "AIzaSyDxxQTS9zpeHNZmqCQjPvRL1MVNpsILsBY"; // ✅ Use Your API Key
  const MODEL_NAME = "gemini-1.5-pro"; // ✅ Updated Model Name

  useEffect(() => {
    const startChat = async () => {
      try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const prompt = "Hello!";
        const result = await model.generateContent({
          contents: [{ parts: [{ text: prompt }] }], // ✅ Updated Format
        });

        const text = result.response.text();
        console.log(text);

        showMessage({
          message: "Welcome to Gemini Chat 🤖",
          description: text,
          type: "info",
          icon: "info",
          duration: 2000,
        });

        setMessages([{ text, user: false }]);
      } catch (error) {
        console.error("Gemini API Error:", error);
      }
    };

    startChat();
  }, []); // ✅ Ensures the effect runs once

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { text: userInput, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]); // ✅ Prevents Overwriting Messages
    setShowClearButton(true); // ✅ Change to Clear Button
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const result = await model.generateContent({
        contents: [{ parts: [{ text: userInput }] }], // ✅ Updated Format
      });

      const text = result.response.text();
      setMessages((prevMessages) => [...prevMessages, { text, user: false }]);
      setUserInput("");

      // ✅ Speech Synthesis
      if (text && !isSpeaking) {
        Speech.speak(text);
        setIsSpeaking(true);
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else if (messages.length > 0) {
      Speech.speak(messages[messages.length - 1].text);
      setIsSpeaking(true);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setIsSpeaking(false);
    setShowClearButton(false); // ✅ Reset back to Send Button
  };

  return (
    <SafeAreaView className="bg-black h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-gray-400 font-psemibold">
          AI Chatbot
        </Text>
        <View
          style={{
            backgroundColor: "#d1d5db",
            borderRadius: 15,
            marginTop: 20,
          }}
        >
          {/* <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.text}
            inverted
          /> */}
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <View style={styles.messageContainer}>
                <Text
                  style={[styles.messageText, item.user && styles.userMessage]}
                >
                  {item.text}
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            inverted
          />
        </View>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.micIcon} onPress={toggleSpeech}>
              {isSpeaking ? (
                <FontAwesome
                  name="microphone-slash"
                  size={22}
                  color="black"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
              ) : (
                <FontAwesome
                  name="microphone"
                  size={22}
                  color="black"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
              )}
            </TouchableOpacity>

            <TextInput
              placeholder="Type a message"
              onChangeText={setUserInput}
              value={userInput}
              onSubmitEditing={sendMessage}
              style={styles.input}
              placeholderTextColor="black"
              className="rounded-2xl border-2 border-black-200 focus:border-secondary font-psemibold text-base"
            />

            {/* ✅ Toggle Button: Send → Clear */}
            {showClearButton ? (
              <TouchableOpacity
                style={styles.sendClearButton}
                onPress={clearMessages}
              >
                <Entypo name="controller-stop" size={24} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.sendClearButton}
                onPress={sendMessage}
              >
                <Ionicons name="send" size={24} color="black" />
              </TouchableOpacity>
            )}
            {/* {loading && <ActivityIndicator size="large" color="black" />} */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9ca3af",
    marginTop: 20,
    borderRadius: 35,
    padding: 5,
    // paddingLeft: 5,
    // paddingRight: 5,
    // paddingTop: 30,
    // paddingBottom: 50,
  },
  messageContainer: { padding: 10, marginVertical: 5 },

  messageText: { fontSize: 16.5 },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    height: 50,
    color: "black",
  },
  micIcon: {
    padding: 10,
    backgroundColor: "#f31d27",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  stopIcon: {
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
  },
  sendClearButton: {
    padding: 10,
    backgroundColor: "#9ca3af",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 2,
  },
});

export default Create;
