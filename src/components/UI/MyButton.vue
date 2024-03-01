<template>
  <button class="btn" :class="applyColor"><slot></slot></button>
</template>

<script>
export default {
  name: 'my-button',
  props:{
    color:{
      type: String
    }
  },
  computed:{
    applyColor(){
      if(this.color === 'white')return 'white'
    }
  }
}
</script>

<style lang="scss" scoped>
.btn{
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 9px 15px;
  color: #fff;
  font-size: 13px;
  font-weight: 520;
  line-height: 140%;
  border-radius: 3px;
  background: #018ABE;
  border: solid #018ABE 1px;
  height: 36px;
  &:hover{
    background: #fff;
    color: #018ABE;
  }
}
.white{
  background: #fff;
  border: solid #fff 1px;
  color: #018ABE;
}
</style>