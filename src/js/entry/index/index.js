import Vue from 'vue';
import Vant from 'vant';
import Com from './com';
import '@/styles/indes.scss';

Vue.use(Vant);

new Vue({
    el: '#app',
    components: {Com},
    template: '<Com/>'
});