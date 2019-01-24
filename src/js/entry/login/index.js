import Vue from 'vue';
import Vant from 'vant';
import Test from './test';

Vue.use(Vant);

new Vue({
    el: '#app',
    components: {Test},
    template: '<Test/>'
});