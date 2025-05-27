import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/auth.styles";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
      <TouchableOpacity onPress={() => alert("sexy boi")}>
        <Text>Press me</Text>
      </TouchableOpacity>
      <Pressable onPress={() => alert("sexy boi")}>
        <Text>Press me 2</Text>
      </Pressable>
      <Image
        source={require("../assets/images/icon.png")}
        style={{
          width: 100,
          height: 100,
          marginTop: 20,
          borderRadius: 50,
        }}
      />
    </View>
  );
}
