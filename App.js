import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StackNavigator from "./navigations/StackNavigator";
import { ToastProvider } from "react-native-toast-notifications";
import { Provider } from "react-redux";
import store from "./store";
import { ModalPortal } from "react-native-modals";
import { UserContext } from "./context/UserContext";
import { CartContext } from "./context/CartContext";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ToastProvider
        placement="top"
        offset={50}
        renderToast={(toastOptions) => (
          <View
            style={{
              backgroundColor:
                toastOptions.type === "success" ? "#4CAF50" : "#F44336",
              padding: 10,
              borderRadius: 10,
              marginRight: 20,
              alignSelf: "flex-end",
            }}
          >
            <Text style={{ color: "white" }}>{toastOptions.message}</Text>
          </View>
        )}
      >
        <View style={{ flex: 1 }}>
          <CartContext>
            <Provider store={store}>
              <UserContext>
                <StackNavigator />
                <ModalPortal />
              </UserContext>
            </Provider>
          </CartContext>
        </View>
      </ToastProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
