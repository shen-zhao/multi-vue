import Vue from 'vue';
import Vant from 'vant';
import Login from './login';

Vue.use(Vant);

new Vue({
    el: '#app',
    components: {Login},
    template: '<Login/>'
});