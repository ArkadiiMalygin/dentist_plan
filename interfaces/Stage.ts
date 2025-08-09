import {TreatmentType} from "../utils/constants";

export interface Task {
    toothNumbers: string[];
    description: string;
    cost: number;
}

export interface Stage {
    title: string;
    tasks: Task[];
}