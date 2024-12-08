import { useToast } from "react-native-toast-notifications";

const useCustomToast = () => {
  const toast = useToast();

  const showToast = (mes = "", type = "", duration = 3000) => {
    toast.show(mes, {
      type,
      duration,
    });
  };

  return { showToast };
};

export default useCustomToast;
