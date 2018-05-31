/*webpack入口文件*/
import Vue from 'vue';
import index from './components/index.vue';

var myVue = new Vue({
    el:"#firstVue",
    components: {'my-component': index},
    data:{
        myData:"vue:5444"
    }
})