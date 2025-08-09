import React, { useState } from 'react';
import {View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import {TreatmentCosts, TreatmentType} from "./utils/constants";
import {Stage, Task} from "./interfaces/Stage";
import {useServices} from "./servicesContext";
import {Doctor, Patient} from "./interfaces/People";

const OPACITY_DISABLED = 0.5;

interface DentistTreatmentPlannerProps {
    stages: Stage[];
    setStages: (stages: Stage[]) => void;
    navigation: any;
    patient: Patient;
    setPatient: (patient: Patient) => void;
    doctor: Doctor;
    setDoctor: (doctor: Doctor) => void;
}

export default function DentistTreatmentPlanner({stages, setStages, navigation, patient, setPatient, doctor, setDoctor}: DentistTreatmentPlannerProps) {
    const {services} = useServices();
    const [stageTitle, setStageTitle] = useState('');
    const [selectedStageIndex, setSelectedStageIndex] = useState<number | null>(null);
    const [selectedTeeth, setSelectedTeeth] = useState<string[]>([]);
    const [task, setTask] = useState<Task>({
        toothNumbers: [],
        description: TreatmentType.CLEANING,
        cost: TreatmentCosts[TreatmentType.CLEANING]
    });

    const toothNumbers = ['18', '17', '16', '15', '14', '13', '12', '11',
        '28', '27', '26', '25', '24', '23', '22', '21',
        '38', '37', '36', '35', '34', '33', '32', '31',
        '48', '47', '46', '45', '44', '43', '42', '41'];


    const handleTeethSelection = (value: string) => {
        if (value === 'all') {
            setSelectedTeeth(toothNumbers);
            setTask({ ...task, toothNumbers: toothNumbers });
        } else {
            const updatedTeeth = selectedTeeth.includes(value)
                ? selectedTeeth.filter(t => t !== value)
                : [...selectedTeeth, value];
            setSelectedTeeth(updatedTeeth);
            setTask({ ...task, toothNumbers: updatedTeeth });
        }
    };


    // Add deleteTask function
    const deleteTask = (stageIndex: number, taskIndex: number) => {
        const updatedStages = [...stages];
        updatedStages[stageIndex].tasks.splice(taskIndex, 1);
        setStages(updatedStages);
    };

    // Previous functions remain the same
    const addStage = () => {
        setStages([...stages, { title: stageTitle, tasks: [] }]);
        setStageTitle('');
        setSelectedStageIndex(stages.length);
    };

    const addTaskToStage = () => {
        if (selectedStageIndex !== null && task.toothNumbers.length > 0) {
            const updatedStages = [...stages];
            // Calculate total cost based on number of teeth
            const totalCost = task.cost * task.toothNumbers.length;
            updatedStages[selectedStageIndex].tasks.push({
                ...task,
                cost: totalCost
            });
            setStages(updatedStages);
            // Reset task and selected teeth
            setTask({
                toothNumbers: [],
                description: TreatmentType.CLEANING,
                cost: TreatmentCosts[TreatmentType.CLEANING]
            });
            setSelectedTeeth([]);
        }
    };


    const handleTreatmentChange = (treatmentName: string, treatmentIndex: number) => {
        const treatment = services[treatmentIndex];
        if (treatment.name !== treatmentName) {
            console.log(`Wrong treatment indexing: ${treatmentName} != ${treatment.name}`);
        }
        setTask({
            ...task,
            description: treatment.name,
            cost: treatment.price,
        });
    };


    const totalCost = stages.reduce(
        (sum, stage) => sum + stage.tasks.reduce((s, t) => s + t.cost, 0),
        0
    );


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Dentist Treatment Planner</Text>

            <Text style={styles.sectionTitle}>Patient</Text>
            <Text style={styles.inputLabel}>First name</Text>
            <TextInput
                value={patient.firstName}
                onChangeText={(value: string) => {
                    setPatient({...patient, firstName: value});
                }}
                style={styles.textInput}
                placeholder="John"
            />

            <Text style={styles.inputLabel}>Family name</Text>
            <TextInput
                value={patient.familyName}
                onChangeText={(value: string) => {
                    setPatient({...patient, familyName: value});
                }}
                style={styles.textInput}
                placeholder="Smith"
            />

            <Text style={styles.sectionTitle}>Stages</Text>
            <Text style={styles.inputLabel}>New Stage Title</Text>
            <TextInput
                value={stageTitle}
                onChangeText={setStageTitle}
                style={styles.textInput}
                placeholder="Enter stage title"
            />
            <TouchableOpacity style={styles.button} onPress={addStage}>
                <Text style={styles.buttonText}>Add Stage</Text>
            </TouchableOpacity>

            {stages.map((stage, stageIdx) => (
                <View key={stageIdx} style={styles.stageContainer}>
                    <Text style={styles.stageTitle}>{stage.title}</Text>
                    <TouchableOpacity
                        style={{...styles.button, opacity: selectedStageIndex === stageIdx ? OPACITY_DISABLED : 1}}
                        onPress={() => setSelectedStageIndex(stageIdx)}
                        disabled={selectedStageIndex === stageIdx}
                    >
                        <Text style={styles.buttonText}>Select Stage</Text>
                    </TouchableOpacity>
                    {stage.tasks.map((task, taskIdx) => (
                        <View key={taskIdx} style={styles.taskContainer}>
                            <Text style={styles.taskText}>
                                {`${task.toothNumbers.length === toothNumbers.length
                                    ? 'All Teeth'
                                    : `Teeth ${task.toothNumbers.join(', ')}`
                                }: ${task.description} ($${task.cost.toFixed(2)})`}
                            </Text>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteTask(stageIdx, taskIdx)}
                            >
                                <Text style={styles.deleteButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            ))}

            <Text style={styles.sectionTitle}>Add Task to Selected Stage</Text>

            <Text style={styles.inputLabel}>Select Teeth</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedTeeth.length === toothNumbers.length ? 'all' : selectedTeeth.length === 1 ? selectedTeeth[0] : ''}
                    onValueChange={handleTeethSelection}
                >
                    <Picker.Item label="Select teeth..." value="" />
                    <Picker.Item label="All Teeth" value="all" />
                    {toothNumbers.map((num) => (
                        <Picker.Item
                            key={num}
                            label={`Tooth ${num}${selectedTeeth.includes(num) ? ' (Selected)' : ''}`}
                            value={num}
                        />
                    ))}
                </Picker>
            </View>

            <Text style={styles.selectedTeethText}>
                Selected teeth: {
                selectedTeeth.length === toothNumbers.length
                    ? 'All Teeth'
                    : selectedTeeth.join(', ')
            }
            </Text>

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={task.description}
                    onValueChange={(itemValue, itemIndex) => handleTreatmentChange(itemValue, itemIndex)}
                >
                    {Object.values(services).map((treatment, index) => (
                        <Picker.Item
                            key={treatment.name}
                            label={`${treatment.name} ($${treatment.price.toFixed(2)} per tooth)`}
                            value={treatment.name}
                        />
                    ))}
                </Picker>
            </View>

            <Text style={styles.selectedCost}>
                Selected Treatment Cost: ${(task.cost * selectedTeeth.length).toFixed(2)}
                {selectedTeeth.length > 1 ? ` (${selectedTeeth.length} teeth)` : ''}
            </Text>

            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        opacity: selectedTeeth.length === 0 || selectedStageIndex === null ? OPACITY_DISABLED : 1
                    }
                ]}
                onPress={addTaskToStage}
                disabled={selectedTeeth.length === 0 || selectedStageIndex === null}
            >
                <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>

            <Text style={styles.totalCost}>Total Cost: ${totalCost.toFixed(2)}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('TreatmentOverview')}
            >
                <Text style={styles.buttonText}>Review PDF Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { marginBottom: 24 }]}
                onPress={() => navigation.navigate('PriceManagement')}
            >
                <Text style={styles.buttonText}>Manage Prices & Services</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
        padding: 16,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a237e',
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        color: '#424242',
        marginBottom: 8,
        fontWeight: '600',
    },
    textInput: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 16,
        fontSize: 16,
    },
    stageContainer: {
        backgroundColor: '#ffffff',
        marginTop: 20,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    stageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a237e',
        marginBottom: 12,
    },
    taskContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    taskText: {
        flex: 1,
        fontSize: 15,
        color: '#424242',
    },
    deleteButton: {
        backgroundColor: '#ef5350',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    pickerContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginVertical: 12,
        overflow: 'hidden',
    },
    selectedCost: {
        marginTop: 12,
        marginBottom: 20,
        fontSize: 16,
        color: '#1a237e',
        fontWeight: '600',
    },
    totalCost: {
        marginTop: 24,
        marginBottom: 16,
        fontSize: 20,
        color: '#1a237e',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#1a237e',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginVertical: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a237e',
        marginTop: 24,
        marginBottom: 12,
    },
    selectedTeethText: {
        fontSize: 15,
        color: '#424242',
        marginVertical: 8,
    }
});