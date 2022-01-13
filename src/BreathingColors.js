import Vue from 'vue';
import BreathingColors from 'vue-breathing-colors';

const locoColors = ['#d16a30', '#11c713', '#940aa8', '#1212c9', '#ee061e', '#006076'];
const _BreathingColors = {
    setup: function () {
        Vue.use(BreathingColors);
    },
    buildLocoColors: () => {
        _BreathingColors._shuffle
        Array(
            locoColors
        );
        return {
            colors: locoColors,
            interval: 3000,
            transition: {
                duration: 2000
            }
        }
    },
    _shuffleArray: (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}

export default _BreathingColors;
