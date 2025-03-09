import Purchases from "react-native-purchases";
import { Platform } from "react-native";

// Your RevenueCat API keys
// const API_KEY =
//   Platform.OS === "ios"
//     ? "appl_BxecFJucvYpjwBsnXifGUKiSkmm"
//     : "your_revenuecat_android_api_key";

const API_KEY = "appl_BxecFJucvYpjwBsnXifGUKiSkmm";

export const configureRevenueCat = () => {
  Purchases.configure({ apiKey: API_KEY });
};

export const checkSubscriptionStatus = async () => {
  try {
    const purchaserInfo = await Purchases.getCustomerInfo();
    return purchaserInfo.activeSubscriptions.length > 0;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
};
