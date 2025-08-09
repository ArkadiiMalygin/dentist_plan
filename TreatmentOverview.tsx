
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Stage } from "./interfaces/Stage";
import {TreatmentCosts} from "./utils/constants";
import {TeethChart} from "./TeethChart";
import {createTeethChartProps} from "./teeth_chart_color_mapping";
import {Doctor, Patient} from "./interfaces/People";

interface TreatmentOverviewProps {
    stages: Stage[];
    patientInfo: Patient;
    doctorInfo: Doctor;
}

export const TreatmentOverview: React.FC<TreatmentOverviewProps> = ({
                                                                        stages,
                                                                        patientInfo,
                                                                        doctorInfo
                                                                    }) => {
    const totalCost = stages.reduce(
        (sum, stage) => sum + stage.tasks.reduce((s, t) => s + t.cost, 0),
        0
    );

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Пациент: {patientInfo.familyName} {patientInfo.firstName}
                </Text>
                <Text style={styles.headerText}>
                    Дата создания: {(new Date(Date.now())).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    })}
                </Text>
            </View>

            {/* Greeting */}
            <Text style={styles.greeting}>
                Dear {patientInfo.firstName},
            </Text>
            <Text style={styles.planTitle}>
                Primary dental treatment plan
            </Text>
            <div>
                <TeethChart toothTreatments={createTeethChartProps(stages).toothTreatments}/>
            </div>

            {/* Treatment Table */}
            {stages.map((stage, stageIndex) => (
                <View key={stageIndex} style={styles.stageContainer}>
                    <Text style={styles.stageTitle}>
                        {stageIndex + 1} Этап {stage.tasks.reduce((sum, task) => sum + task.cost, 0)}
                    </Text>

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.columnHeader, styles.noColumn]}>No</Text>
                        <Text style={[styles.columnHeader, styles.serviceColumn]}>Услуга</Text>
                        <Text style={[styles.columnHeader, styles.priceColumn]}>Цена за ед.</Text>
                        <Text style={[styles.columnHeader, styles.qtyColumn]}>Кол-во</Text>
                        <Text style={[styles.columnHeader, styles.totalColumn]}>Всего</Text>
                    </View>

                    {/* Table Content */}
                    {stage.tasks.map((task, taskIndex) => (
                        <React.Fragment key={taskIndex}>
                            <View style={styles.tableRow}>
                                <Text style={[styles.cell, styles.noColumn]}>{taskIndex + 1}</Text>
                                <Text style={[styles.cell, styles.serviceColumn]}>{task.description}</Text>
                                <Text style={[styles.cell, styles.priceColumn]}>{task.cost / task.toothNumbers.length}</Text>
                                <Text style={[styles.cell, styles.qtyColumn]}>{task.toothNumbers.length}</Text>
                                <Text style={[styles.cell, styles.totalColumn]}>
                                    {task.cost}
                                </Text>
                            </View>
                            <Text style={styles.toothNumbers}>
                                {task.toothNumbers.length > 31 ? 'All teeth' : task.toothNumbers.join(', ')}
                            </Text>
                        </React.Fragment>
                    ))}
                </View>
            ))}

            {/* Total */}
            <Text style={styles.totalCost}>
                ИТОГО ПО ПРАЙСУ: {totalCost}
            </Text>

            {/* Doctor's Information */}
            <View style={styles.doctorInfo}>
                <Text style={styles.doctorText}>{doctorInfo.name}</Text>
                <Text style={styles.doctorText}>{doctorInfo.additionalInfo}</Text>
                <Text style={styles.doctorText}>{doctorInfo.license}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    headerText: {
        fontSize: 16,
        marginBottom: 5,
    },
    greeting: {
        fontSize: 16,
        marginBottom: 10,
    },
    planTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    stageContainer: {
        marginBottom: 20,
    },
    stageTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingBottom: 5,
        marginBottom: 5,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 5,
    },
    columnHeader: {
        fontWeight: 'bold',
    },
    cell: {
        fontSize: 14,
    },
    noColumn: {
        width: '10%',
    },
    serviceColumn: {
        width: '40%',
    },
    priceColumn: {
        width: '15%',
    },
    qtyColumn: {
        width: '15%',
    },
    totalColumn: {
        width: '20%',
    },
    toothNumbers: {
        fontSize: 14,
        color: '#666',
        paddingLeft: '10%',
        marginBottom: 5,
    },
    totalCost: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 30,
    },
    doctorInfo: {
        marginTop: 20,
    },
    doctorText: {
        fontSize: 14,
        marginBottom: 5,
    },
});
