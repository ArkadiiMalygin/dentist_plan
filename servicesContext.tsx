// PriceContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Service} from "./interfaces/Service";
import {TreatmentCosts} from "./utils/constants";

const defaultServices: Service[] = Object.entries(TreatmentCosts).map(([k, v]): Service => {
    return {
        name: k,
        price: v
    };
});

type ServiceContextType = {
    services: Service[];
    updateServices: (newServices: Service[]) => Promise<void>;
};
const ServiceContext = createContext<ServiceContextType| null>(null);

export const ServiceProvider: React.FC<{children: any}> = ({ children }) => {
    const [services, setServices] = useState<Service[]>(defaultServices);

    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem('services');
            if (stored) setServices(JSON.parse(stored));
        })();
    }, []);

    const updateServices = async (newServices: Service[]) => {
        setServices([...newServices]);
        await AsyncStorage.setItem('services', JSON.stringify([...newServices]));
    };

    return (
        <ServiceContext.Provider value={{ services, updateServices }}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useServices = (): ServiceContextType => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('usePrices must be used within a PriceProvider');
    }
    return context;
};
