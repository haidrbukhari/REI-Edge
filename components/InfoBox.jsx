import { View, Text } from "react-native";

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
  return (
    <View className={containerStyles}>
      <Text
        className={`text-gray-300 text-center font-psemibold ${titleStyles}`}
      >
        {title}
      </Text>
      <Text className="text-sm text-black-300 text-center font-pregular">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
