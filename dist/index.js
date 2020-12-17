Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

// Hook
var counter = 0;
function useKeyPress(cb, doRerender) {
    // State for keeping track of whether key is pressed
    // const [keyPressed, setKeyPressed] = useState(false);
    var _a = react.useState(0), rerender = _a[1];
    // If pressed key is our target key then set to true
    function downHandler(_a) {
        var key = _a.key;
        cb(key);
        if (doRerender) {
            rerender(counter);
        }
    }
    // If released key is our target key then set to false
    /*const upHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    };*/
    // Add event listeners
    react.useEffect(function () {
        window.addEventListener('keydown', downHandler);
        //window.addEventListener('keyup', upHandler);
        // Remove event listeners on cleanup
        return function () {
            window.removeEventListener('keydown', downHandler);
            //window.removeEventListener('keyup', upHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount
    // return keyPressed;
}

function applies(featureCondition, currentKeyCombo) {
    var doesApply = true;
    if (featureCondition.computed) {
        doesApply = doesApply && featureCondition.computed();
    }
    if (featureCondition.localStorage) {
        var value = window.localStorage.getItem(featureCondition.localStorage[0]);
        doesApply = doesApply && value === featureCondition.localStorage[1];
    }
    if (featureCondition.keyCombo && featureCondition.keyCombo.length === currentKeyCombo.length) {
        for (var i = 0; i < featureCondition.keyCombo.length; i++) {
            doesApply = doesApply && (featureCondition.keyCombo[i] === currentKeyCombo[i]);
        }
    }
    return doesApply;
}
function useHiddenFeature(condition) {
    var keysPushedArray = react.useRef([]);
    var _a = react.useState(false), applied = _a[0], setApplies = _a[1];
    // TODO useKeyPress handles changes to keycombo incorrectly. Or not at all.
    useKeyPress(function (k) {
        if (!condition.keyCombo)
            return;
        if (condition.keyCombo.length > keysPushedArray.current.length) {
            keysPushedArray.current.splice(0, 1);
        }
        keysPushedArray.current.push(k);
        if (applies(condition, keysPushedArray.current)) {
            console.log("Activating secret!");
            setApplies(true);
        }
    });
    react.useEffect(function () {
        setInterval(function () {
            if (applies(condition, keysPushedArray.current)) {
                console.log("Activating secret!");
                setApplies(true);
            }
        }, 1000);
    }, []);
    return applied;
}

exports.useHiddenFeature = useHiddenFeature;
//# sourceMappingURL=index.js.map
