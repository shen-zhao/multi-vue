<template>
    <div>
        <van-button @click="trigger" type="primary">哈哈</van-button>
        <switch-wrap/>
    </div>
</template>

<script>
import SwitchWrap from '@/js/components/switch'

export default {
    data() {
        return {
            index: 0,
            timer: null
        };
    },
    components: {SwitchWrap},
    mounted() {
        // this.reduce();
    },
    methods: {
        reduce() {
            this.timer = setTimeout(() => {
                this.index++;
                this.reduce();
            }, 1000);
        },
        trigger() {
            if (this.timer !== null) {
                clearTimeout(this.timer);
                this.timer = null
            } else {
                this.reduce();
            }
        }
    }
};

</script>
<style lang='scss' scoped>
button {
    border: 4px solid black;
}
</style>