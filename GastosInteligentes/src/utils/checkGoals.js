import * as Notifications from "expo-notifications";
import { updateGoal } from "../services/goalService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export const checkGoalsProgress = async (transactions, goals) => {
  const totalSaved = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const net = await NetInfo.fetch();

  for (const goal of goals) {
    const progress = totalSaved;
    const reached = totalSaved >= goal.target;

    // Actualiza meta offline u online
    await updateGoal(goal.id, { progress, reached });

    // Notificación solo si hay internet
    if (reached && !goal.reached && net.isConnected) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎉 ¡Meta alcanzada!",
          body: `Has alcanzado tu meta de ahorro: ${goal.name}`,
        },
        trigger: null,
      });
    }
  }
};
