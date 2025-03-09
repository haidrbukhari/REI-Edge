import { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert } from "react-native";
import Purchases from "react-native-purchases";

const SubscriptionScreen = ({ navigation }) => {
  const [offerings, setOfferings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        const { current } = await Purchases.getOfferings();
        if (current && current.availablePackages.length > 0) {
          setOfferings(current.availablePackages);
        } else {
          Alert.alert("No subscriptions available. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching offerings:", error);
        Alert.alert(
          "Error fetching subscriptions. Please check your connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOfferings();
  }, []);

  const purchaseSubscription = async (pkg) => {
    try {
      const purchaseInfo = await Purchases.purchasePackage(pkg);
      Alert.alert("Success", "Subscription purchased successfully!");
      navigation.navigate("Home"); // Redirect back to Home screen after purchase
    } catch (error) {
      console.error("Purchase failed:", error);
      Alert.alert("Purchase Failed", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={{ backgroundColor: "black", height: "100%" }}>
      <Text className="font-pmedium text-lg text-white text-center mb-6 mt-4">
        Choose a Subscription Plan
      </Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        offerings?.map((pkg) => (
          <Button
            key={pkg.identifier}
            title={`Subscribe to ${pkg.product.title} - ${pkg.product.priceString}`}
            onPress={() => purchaseSubscription(pkg)}
          />
        ))
      )}
    </View>
  );
};

export default SubscriptionScreen;
