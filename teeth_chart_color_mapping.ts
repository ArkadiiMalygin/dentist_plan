import {Stage} from "./interfaces/Stage";
import {TeethChartProps} from "./TeethChart";
import {TreatmentType} from "./utils/constants";

interface ColorMapping {
    [key: string]: string;
}

export function createTeethChartProps(stages: Stage[]): TeethChartProps {
    // Initialize the tooth treatments record
    const toothTreatments: Record<string, string> = {};
    
    // You can customize these colors based on your needs
    const treatmentColors: ColorMapping = {
        [TreatmentType.FILLING]: "#4CAF50",  // Green
        [TreatmentType.ROOT_CANAL]: "#F44336",  // Red
        [TreatmentType.CROWN]: "#2196F3",  // Blue
        [TreatmentType.IMPLANT]: "#FFC107",  // Amber
        // Add more mappings as needed
    };

    // Iterate through all stages and their tasks
    stages.forEach(stage => {
        stage.tasks.forEach(task => {
            // Get the color for this treatment type
            const color = treatmentColors[task.description] || "#9E9E9E"; // Grey as default
            
            // Assign the color to each tooth number in this task
            task.toothNumbers.forEach(toothNumber => {
                toothTreatments[toothNumber] = color;
            });
        });
    });

    return { toothTreatments };
}
