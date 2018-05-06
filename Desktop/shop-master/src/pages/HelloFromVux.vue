<template>
  <div>
    <div class="vux-demo">
      <h1> {{name}}</h1>
      <h1> {{count}}</h1>
    </div>
    <group title="cell demo">
      <cell title="VUX" value="cool" is-link></cell>
    </group>
          <button @click="changeName('dfd')">fdsaf</button>
          <button @click="add(6)">add1</button>
          <group>
      <cell title="title" value="value"></cell>
    </group>
  </div>
</template>

<script>
import { Group, Cell, } from 'vux'
import {mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Group,
    Cell
  },
  data () {
    return {
      msg: 'Hello World!',
    }
  },
  computed:
   mapGetters([
    'name',
    'count'
  ]),
  methods: {
    ...mapActions([
      'changeName',
      'add'
      ]),
  }
}
</script>

<style lang="less" scoped>
  @base: #3e9c26;
  .vux-demo {
    text-align: center;
  }
  h1{
    color: @base;
  }
  .logo {
    width: 100px;
    height: 100px
  }

</style>
