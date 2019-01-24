<template>
    <div>
        <van-button @click="trigger" type="primary">{{index}}</van-button>
        <switch-wrap v-if="show"></switch-wrap>
    </div>
</template>

<script>
import { $get, $post } from 'utils/request';
const SwitchWrap = () => import('@/js/components/switch');

export default {
    data() {
        return {
            index: 0,
            timer: null,
            show: false
        };
    },
    components: {SwitchWrap},
    mounted() {
        this.reduce();
    },
    methods: {
        reduce() {
            this.timer = setTimeout(() => {
                this.index++;
                this.reduce();
            }, 1000);
        },
        trigger() {
            this.show = !this.show;
            if (this.timer !== null) {
                clearTimeout(this.timer);
                this.timer = null
            } else {
                this.reduce();
            }
            $get('app/list', {name: 'shenzhao'}).then((res) => {
                console.log(res);
            });
        }
    }
};

</script>
<style lang='scss' scoped>
button {
    border: 4px solid black;
}
</style>