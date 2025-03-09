import React, { useState, useCallback, useEffect } from "react";
import { checkSubscriptionStatus } from "../RevenueCatService";
import { useNavigation } from "@react-navigation/native"; // ✅ Import useNavigation
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Text,
  Dimensions,
  View,
  StyleSheet,
  Button,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

import { images } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import {
  CustomButton,
  EmptyState,
  Trending,
  VideoCard,
} from "../../components";

const { width } = Dimensions.get("window");
const videoData = [
  { id: "1", title: "Real Estate Marketing 101", videoId: "dQw4w9WgXcQ" },
  { id: "2", title: "How to Generate Leads", videoId: "YQHsXMglC9A" },
  { id: "3", title: "Facebook Ads for Real Estate", videoId: "3JZ_D3ELwOQ" },
  { id: "4", title: "Real Estate Marketing 101", videoId: "dQw4w9WgXcQ" },
  { id: "5", title: "How to Generate Leads", videoId: "YQHsXMglC9A" },
  { id: "6", title: "Real Estate Marketing 101", videoId: "dQw4w9WgXcQ" },
  { id: "7", title: "How to Generate Leads", videoId: "YQHsXMglC9A" },
  { id: "8", title: "Facebook Ads for Real Estate", videoId: "3JZ_D3ELwOQ" },
  { id: "9", title: "Real Estate Marketing 101", videoId: "dQw4w9WgXcQ" },
  { id: "10", title: "How to Generate Leads", videoId: "YQHsXMglC9A" },
];

const Home = () => {
  const [hasAccess, setHasAccess] = useState(null); // null = loading state
  const navigation = useNavigation(); // ✅ Get navigation object

  useEffect(() => {
    const checkAccess = async () => {
      const status = await checkSubscriptionStatus();
      setHasAccess(status);
    };
    checkAccess();
  }, []);

  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      setSelectedVideo(null);
    }
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // one flatlist
  // with list header
  // and horizontal flatlist

  //  we cannot do that with just scrollview as there's both horizontal and vertical scroll (two flat lists, within trending)

  return (
    <SafeAreaView>
      {hasAccess === null ? (
        <ActivityIndicator size="large" />
      ) : hasAccess ? (
        <SafeAreaView className="bg-black h-full">
          <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <VideoCard
                title={item.title}
                thumbnail={item.thumbnail}
                video={item.video}
                creator={item.creator.username}
                avatar={item.creator.avatar}
              />
            )}
            ListHeaderComponent={() => (
              <View className="flex my-6 px-4 space-y-6">
                <View className="flex justify-between items-start flex-row mb-6">
                  <View>
                    <Text className="font-pmedium text-sm text-white">
                      Welcome Back
                    </Text>
                    <Text className="text-2xl font-psemibold text-gray-400">
                      Real Estate Marketing
                    </Text>
                  </View>

                  <View className="mt-1.5">
                    <Image
                      source={images.logoSmall}
                      className="w-12 h-12"
                      resizeMode="contain"
                    />
                  </View>
                </View>

                {/* <SearchInput /> */}

                <View className="w-full flex-1 pt-5 pb-8">
                  <Text className="text-lg font-pregular text-white mb-3">
                    Videos
                  </Text>

                  <View style={styles.container}>
                    {selectedVideo ? (
                      <View style={styles.videoContainer}>
                        {/* <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setSelectedVideo(null)}
                    >
                      <Ionicons name="close" size={30} color="white" />
                    </TouchableOpacity> */}
                        <YoutubePlayer
                          height={width * 0.5625} // Maintain 16:9 ratio
                          width={width}
                          play={playing}
                          videoId={selectedVideo}
                          onChangeState={onStateChange}
                        />
                        <TouchableOpacity
                          style={{ marginTop: 14, marginBottom: 14 }}
                        >
                          <Button
                            title="go back"
                            onPress={() => setSelectedVideo(null)}
                            color="#f31d27"
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <FlatList
                        data={videoData}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.videoItem}
                            onPress={() => {
                              setSelectedVideo(item.videoId);
                              setPlaying(true);
                            }}
                          >
                            <Text style={styles.videoTitle}>{item.title}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    )}
                  </View>

                  {/* <Trending posts={latestPosts ?? []} /> */}
                </View>
              </View>
            )}
          />
        </SafeAreaView>
      ) : (
        <SafeAreaView className="bg-black h-full flex justify-center items-center px-6 py-8">
          <FontAwesome
            name="lock"
            size={150}
            color="#f31d27"
            className="mb-4"
          />
          <Text className="font-pmedium text-lg text-white text-center mb-6">
            You need a subscription to access this content.
          </Text>
          <CustomButton
            title="Subscribe Now"
            handlePress={() => navigation.navigate("SubscriptionScreen")}
            containerStyles="w-full my-5"
          />
          {/* <Button
            title="Subscribe Now"
            color="#f31d27"
            onPress={() => navigation.navigate("SubscriptionScreen")}
            className="w-full py-3 px-6 rounded-full bg-red-600 text-white font-semibold"
          /> */}
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#9ca3af" },
  videoContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: { position: "absolute", top: 20, right: 20, zIndex: 1 },
  videoItem: {
    padding: 15,
    backgroundColor: "#f31d27",
    marginVertical: 8,
    borderRadius: 5,
    elevation: 4,
  },
  videoTitle: { fontSize: 16, fontWeight: "bold", color: "white" },
});

export default Home;
