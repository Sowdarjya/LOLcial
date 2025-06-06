import { styles } from "@/styles/auth.styles";
import { useAuth } from "@clerk/clerk-expo";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const index = () => {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => signOut()}>
        <Text style={{ color: "lime" }}> Signout </Text>
      </TouchableOpacity>
    </View>
  );
};

export default index;
