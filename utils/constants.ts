import * as FileSystem from 'expo-file-system';

export enum TreatmentType {
    CLEANING = 'Professional Cleaning',
    FILLING = 'Dental Filling',
    ROOT_CANAL = 'Root Canal Treatment',
    CROWN = 'Dental Crown',
    EXTRACTION = 'Tooth Extraction',
    IMPLANT = 'Dental Implant',
    BRIDGE = 'Dental Bridge',
    VENEER = 'Dental Veneer',
    WHITENING = 'Teeth Whitening',
    SCALING = 'Scaling and Root Planing',
    SEALANT = 'Dental Sealant',
    ADJUSTMENT = 'Orthodontic Adjustment'
}

export let TreatmentCosts: Record<TreatmentType, number> = {
    [TreatmentType.CLEANING]: 100,
    [TreatmentType.FILLING]: 150,
    [TreatmentType.ROOT_CANAL]: 800,
    [TreatmentType.CROWN]: 1200,
    [TreatmentType.EXTRACTION]: 200,
    [TreatmentType.IMPLANT]: 3000,
    [TreatmentType.BRIDGE]: 2500,
    [TreatmentType.VENEER]: 1000,
    [TreatmentType.WHITENING]: 350,
    [TreatmentType.SCALING]: 200,
    [TreatmentType.SEALANT]: 60,
    [TreatmentType.ADJUSTMENT]: 150
};
