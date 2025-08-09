
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ToothProps {
    number: number;
    hasTask: boolean;
    onPress: (number: number) => void;
}

const Tooth: React.FC<ToothProps> = ({ number, hasTask, onPress }) => (
    <View 
        style={[
            styles.tooth, 
            hasTask && styles.toothWithTask
        ]}
        onTouchEnd={() => onPress(number)}
    >
        <Text style={styles.toothNumber}>{number}</Text>
    </View>
);

interface DentalChartProps {
    tasks: Array<{ toothNumber: number }>;
    onToothPress: (toothNumber: number) => void;
}

export const DentalChart: React.FC<DentalChartProps> = ({ tasks, onToothPress }) => {
    const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
    const lowerTeeth = Array.from({ length: 16 }, (_, i) => i + 17);
    
    const hasTask = (toothNumber: number) => 
        tasks.some(task => task.toothNumber === toothNumber);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dental Chart</Text>
            
            {/* Upper teeth */}
            <View style={styles.row}>
                {upperTeeth.map(number => (
                    <Tooth
                        key={number}
                        number={number}
                        hasTask={hasTask(number)}
                        onPress={onToothPress}
                    />
                ))}
            </View>
            
            <View style={styles.separator} />
            
            {/* Lower teeth */}
            <View style={styles.row}>
                {lowerTeeth.map(number => (
                    <Tooth
                        key={number}
                        number={number}
                        hasTask={hasTask(number)}
                        onPress={onToothPress}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        margin: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 4,
        padding: 8,
    },
    tooth: {
        width: 32,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    toothWithTask: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
        borderWidth: 2,
    },
    toothNumber: {
        fontSize: 12,
        color: '#333',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 8,
        marginHorizontal: 24,
    },
});
