
<template lang='html'>
  <div class='aboutPage'>
    <h3>about页面</h3>
    <div class='box'>
      <div class='heading'>
        <span>item122uuu</span>
        <span>item222ee</span>
      </div>
      <ul class='contain'>
        <li v-text='info'>contain1</li>
        <li v-if='ifture'>contain2</li>
      </ul>
      <my-component></my-component>
      <my-component></my-component>
    </div>
  </div>
</template>
<script>
  var myComponent = {
    template: '<div>A custom component33!</div>'
  }
  export default {
    name: 'aboutP',
    data() {
      return {
        info: 'about-info',
        ifture: false
      }
    },
    components: {
      myComponent
    }
  }
</script>
<style lang='css'>
  h3 {font-size: 30px;}
  .box .heading { padding: 10px; background: #ccc; }
</style>