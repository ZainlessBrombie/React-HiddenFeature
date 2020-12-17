interface FeatureCondition {
    cb?: () => void;
    keyCombo?: string[];
    localStorage?: [string, string];
    computed?: () => boolean;
}
export declare function useHiddenFeature(condition: FeatureCondition): boolean;
export {};
