import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface TeethChartProps {
    // Example: { "14": "blue", "15": "blue", "16": "green" }
    // Tooth numbers as keys, treatment color or label as values
    toothTreatments: Record<string, string>;
}

const upperTeeth = [
    18, 17, 16, 15, 14, 13, 12, 11,
    21, 22, 23, 24, 25, 26, 27, 28
];

const lowerTeeth = [
    48, 47, 46, 45, 44, 43, 42, 41,
    31, 32, 33, 34, 35, 36, 37, 38
];

export const TeethChart: React.FC<TeethChartProps> = ({ toothTreatments }) => {
    const renderTooth = (number: number) => {
        const treatment = toothTreatments[number.toString()];
        const color = treatment ? treatment : '#ddd';
        return (
            <View key={number} style={styles.toothContainer}>
                <View style={[styles.toothShape, { backgroundColor: color }]}>
                    <Text style={styles.toothNumber}>{number}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.chartContainer}>
            <View style={styles.row}>
                {upperTeeth.map(renderTooth)}
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
                {lowerTeeth.map(renderTooth)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',  // TODO nowrap -> deside what to do with overflow
        justifyContent: 'center',
    },
    toothContainer: {
        width: 30,
        height: 40,
        alignItems: 'center',
        margin: 2,
    },
    toothShape: {
        width: 28,
        height: 28,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toothNumber: {
        fontSize: 10,
        color: '#000',
    },
    separator: {
        height: 20,
    },
});