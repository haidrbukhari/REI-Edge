import { SafeAreaView } from "react-native-safe-area-context";

import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
  Share,
  ScrollView,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
// import RNFS from "react-native-fs";

// useEffect(() => {
//   async function testRNFS() {
//     try {
//       const info = await RNFS.getFSInfo();
//       console.log("RNFS Info:", info); // Check the console!
//       Alert.alert("RNFS Works!", JSON.stringify(info)); // For testing
//     } catch (error) {
//       console.error("RNFS Error:", error);
//       Alert.alert("RNFS Error", error.message); // Show the error message
//     }
//   }

//   testRNFS();
// }, []);

const templates = [
  {
    name: "Template 1",
    content:
      "This is the content of template 1. It can span multiple lines and include special characters. This is a longer example to demonstrate text wrapping.",
  },
  {
    name: "Template 2",
    content: "This is the content of template 2. Another example.",
  },
  {
    name: "Template 3",
    content:
      "This is the content of template 1. It can span multiple lines and include special characters. This is a longer example to demonstrate text wrapping.",
  },
  {
    name: "Template 4",
    content: "This is the content of template 2. Another example.",
  },
  {
    name: "Template 5",
    content:
      "This is the content of template 1. It can span multiple lines and include special characters. This is a longer example to demonstrate text wrapping.",
  },
  {
    name: "Template 6",
    content: "This is the content of template 2. Another example.",
  },
];

const Bookmark = () => {
  const [expandedTemplates, setExpandedTemplates] = useState({});

  const handleTemplatePress = (index) => {
    setExpandedTemplates({
      ...expandedTemplates,
      [index]: !expandedTemplates[index],
    });
  };

  const handleCopy = (content) => {
    Clipboard.setString(content);
    Alert.alert("Copied!", "Text copied to clipboard.");
  };

  const handleDownload = async (content, filename) => {
    const path =
      Platform.OS === "ios"
        ? RNFS.DocumentDirectoryPath + "/" + filename
        : RNFS.ExternalDirectoryPath + "/" + filename;

    console.log("File Path:", path); // Log the path!

    try {
      await RNFS.writeFile(path, content, "utf8");
      console.log("File written successfully!");

      const shareOptions = {
        url: "file://" + path, // file:// prefix is crucial
        title: "Sharing Template",
      };

      console.log("Share URL:", shareOptions.url); // Log the share URL

      await Share.share(shareOptions);
      console.log("Share completed!");
    } catch (err) {
      console.error("Error writing/sharing file:", err);
      Alert.alert("Error", "Could not save/share file: " + err.message); // Show detailed error
    }
  };

  const handleShare = async (content) => {
    try {
      await Share.share({
        message: content,
      });
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Could not share text.");
    }
  };

  const renderTemplate = useCallback(
    (template, index) => {
      const isExpanded = expandedTemplates[index] || false;
      return (
        <View key={index} style={styles.templateContainer}>
          <TouchableOpacity onPress={() => handleTemplatePress(index)}>
            <Text style={styles.templateName}>{template.name}</Text>
          </TouchableOpacity>
          {isExpanded && (
            <View>
              <Text style={styles.templateContent}>{template.content}</Text>
              <View style={styles.templateActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleCopy(template.content)}
                >
                  <Text style={styles.actionButtonText}>Copy</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    handleDownload(template.content, `template${index + 1}.txt`)
                  }
                >
                  <Text style={styles.actionButtonText}>Download</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleShare(template.content)}
                >
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      );
    },
    [expandedTemplates]
  );

  return (
    <SafeAreaView className="px-4 my-6 bg-black h-full">
      <Text className="text-2xl text-gray-400 font-psemibold">Templates</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>{templates.map(renderTemplate)}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E2D", // Light background
  },
  scrollContainer: {
    flexGrow: 1, // Ensures scrolling behavior
    paddingVertical: 20,
  },
  templateContainer: {
    backgroundColor: "#9ca3af", // White card background
    borderRadius: 8, // Rounded corners
    marginBottom: 15,
    padding: 15,
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  templateName: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 18,
    color: "white", // Darker text color
  },
  templateContent: {
    marginTop: 10,
    fontSize: 16,
    color: "white", // Slightly lighter text
  },
  templateActions: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-around", // Distribute buttons evenly
  },
  actionButton: {
    backgroundColor: "#f31d27", // Blue button color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  // Add hover effect (not directly supported, but can simulate with opacity change)
  actionButtonHover: {
    opacity: 0.8,
  },
});

export default Bookmark;
