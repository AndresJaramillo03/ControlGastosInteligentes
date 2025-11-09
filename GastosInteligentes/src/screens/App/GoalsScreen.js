import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, Alert } from "react-native";
import { useGoals } from "../../hooks/useGoals";
import { useFocusEffect } from "@react-navigation/native";

const GoalsScreen = () => {
    const { goals, loading, handleAddGoal, handleDeleteGoal, refreshGoals } = useGoals();
    const [name, setName] = useState("");
    const [target, setTarget] = useState("");


    useFocusEffect(
        useCallback(() => {
            refreshGoals();
        }, [])
    );

    const activeGoal = goals?.[0]; // solo 1 meta permitida

    const addGoal = async () => {
        if (!name || !target) {
            Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
            return;
        }

        try {
            await handleAddGoal({
                name,
                target: Number(target),
                progress: 0,
                reached: false,
            });
            setName("");
            setTarget("");
        } catch (error) {
            console.error("Error al agregar meta:", error);
            Alert.alert("Error", "No se pudo guardar la meta.");
        }
    };

    const deleteGoal = async (id) => {
        Alert.alert("Eliminar meta", "¿Seguro que deseas eliminar esta meta?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Eliminar", style: "destructive", onPress: () => handleDeleteGoal(id) },
        ]);
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
                <Text>Cargando metas...</Text>
            </View>
        );
    }

    if (activeGoal) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 16,
                }}
            >
                <View
                    style={{
                        backgroundColor: activeGoal.reached ? "#d4edda" : "#e8f2ff",
                        padding: 20,
                        borderRadius: 10,
                        width: "90%",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 8 }}>
                        🎯 {activeGoal.name}
                    </Text>
                    <Text style={{ fontSize: 16 }}>Meta: ${activeGoal.target}</Text>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                        Progreso: ${activeGoal.progress ?? 0}
                    </Text>
                    {activeGoal.reached && (
                        <Text style={{ color: "green", marginBottom: 10 }}>
                            ✅ ¡Meta alcanzada!
                        </Text>
                    )}
                    <Button title="Eliminar meta" color="red" onPress={() => deleteGoal(activeGoal.id)} />

                    {activeGoal.reached && (
                        <View style={{ marginTop: 10, width: "100%" }}>
                            <Button title="Crear nueva meta" onPress={() => handleDeleteGoal(activeGoal.id)} />
                        </View>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>
                Crear nueva meta de ahorro
            </Text>

            <TextInput
                placeholder="Nombre de la meta"
                value={name}
                onChangeText={setName}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 8,
                    marginBottom: 8,
                    borderRadius: 6,
                }}
            />

            <TextInput
                placeholder="Monto objetivo"
                value={target}
                onChangeText={setTarget}
                keyboardType="numeric"
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 8,
                    marginBottom: 12,
                    borderRadius: 6,
                }}
            />

            <Button title="Guardar meta" onPress={addGoal} />
        </View>
    );
};

export default GoalsScreen;
