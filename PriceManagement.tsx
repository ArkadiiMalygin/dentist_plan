import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useServices } from './servicesContext';
import { Service } from './interfaces/Service';

const PriceManagement = () => {
    const { services, updateServices } = useServices();
    const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
    const [updatedCurrentService, setUpdatedCurrentService] = useState({
        name: '',
        price: '',
    });
    const [newService, setNewService] = useState({ name: '', price: 0 });

    const handleUpdateService = async (updatedService: Service, index: number) => {
        const newServices = [...services];
        newServices[index] = {...updatedService};
        await updateServices(newServices);
    };

    const handleDeleteService = (index: number) => {
        Alert.alert(
            'Delete Service',
            'Are you sure you want to delete this service?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const newServices = services.filter((_, i) => i !== index);
                        await updateServices(newServices);
                    },
                },
            ]
        );
    };

    const handleAddService = async () => {
        if (!newService.name || !newService.price) {
            Alert.alert('Error', 'Please fill in both name and price');
            return;
        }

        const price = newService.price;
        if (isNaN(price)) {
            Alert.alert('Error', 'Please enter a valid price');
            return;
        }

        const updatedServices = [...services, { name: newService.name, price }];
        await updateServices(updatedServices);
        setNewService({ name: '', price: 0 });
    };

    const renderItem = ({ item, index }: { item: Service; index: number }) => {
        const isEditing = editingServiceIndex === index;

        if (isEditing) {
            return (
                <View style={styles.serviceItem}>
                    <TextInput
                        style={styles.input}
                        value={updatedCurrentService.name}
                        onChangeText={(text) =>
                            setUpdatedCurrentService({name: text, price: updatedCurrentService.price})
                        }
                    />
                    <TextInput
                        style={styles.input}
                        value={updatedCurrentService.price}
                        keyboardType="numbers-and-punctuation"
                        onChangeText={(text) => setUpdatedCurrentService({name: updatedCurrentService.name, price: text})}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            handleUpdateService({
                                name: updatedCurrentService.name,
                                price: parseFloat(updatedCurrentService.price),
                            }, index)
                            setEditingServiceIndex(null);
                        }}
                    >
                        <Text>Done</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.serviceItem}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.servicePrice}>${item.price}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setEditingServiceIndex(index)
                            setUpdatedCurrentService({
                                name: item.name,
                                price: item.price.toString(),
                            })
                        }}
                    >
                        <Text>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={() => handleDeleteService(index)}
                    >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.addServiceContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Service name"
                    value={newService.name}
                    onChangeText={(text) =>
                        setNewService({ ...newService, name: text })
                    }
                />
                <TextInput
                    style={styles.input}
                    placeholder="Price"
                    keyboardType="numbers-and-punctuation"
                    value={newService.price.toString()}
                    onChangeText={(text) => {
                        if (isNaN(parseFloat(text))) return;
                        setNewService({ ...newService, price: parseFloat(text) })
                    }}
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddService}
                >
                    <Text style={styles.addButtonText}>Add Service</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={services}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                style={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    addServiceContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    list: {
        flex: 1,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    serviceName: {
        flex: 2,
        fontSize: 16,
    },
    servicePrice: {
        flex: 1,
        fontSize: 16,
        textAlign: 'right',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    addButton: {
        backgroundColor: '#34C759',
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    deleteButtonText: {
        color: 'white',
    },
});

export default PriceManagement;