import {useEffect, useRef, useState} from "react";
import {useKeyPress} from "./useKeyPress";


interface FeatureCondition {
    cb?: () => void,
    keyCombo?: string[],
    localStorage?: [string, string],
    computed?: () => boolean
}

function applies(featureCondition: FeatureCondition, currentKeyCombo: string[]) {
    let doesApply = true;

    if (featureCondition.computed) {
        doesApply = doesApply && featureCondition.computed();
    }

    if (featureCondition.localStorage) {
        let value = window.localStorage.getItem(featureCondition.localStorage[0]);
        doesApply = doesApply && value === featureCondition.localStorage[1];
    }

    if (featureCondition.keyCombo && featureCondition.keyCombo.length === currentKeyCombo.length) {
        for (let i = 0; i < featureCondition.keyCombo.length; i++) {
            doesApply = doesApply && (featureCondition.keyCombo[i] === currentKeyCombo[i]);
        }
    }

    return doesApply;
}

export function useHiddenFeature(condition: FeatureCondition): boolean {
    const keysPushedArray: {current: string[]} = useRef([]);

    const [applied, setApplies] = useState(false);

    // TODO useKeyPress handles changes to keycombo incorrectly. Or not at all.
    useKeyPress((k) => {
        if (!condition.keyCombo) return;
        if (condition.keyCombo.length > keysPushedArray.current.length) {
            keysPushedArray.current.splice(0, 1);
        }
        keysPushedArray.current.push(k);

        if (applies(condition, keysPushedArray.current)) {
            console.log("Activating secret!");
            setApplies(true);
        }
    });

    useEffect(() => {
        setInterval(() => {
            if (applies(condition, keysPushedArray.current)) {
                keysPushedArray.current.push("done"); // TODO ugly as hell
                console.log("Activating secret!");
                setApplies(true);
            }
        }, 1000);
    }, []);

    return applied;
}


