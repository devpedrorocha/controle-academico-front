<template>
  
  <div class="allSquare">
    <div class="square">
      <slot name="icone" class="icone"></slot>
    </div>
    <div>
      <h2>{{ titleA }}</h2>
    </div>
  </div>

</template>
 
<script lang="ts">
export default {
  name: "SectionVue",
  props: ["titleA"],
};
</script>

<style>
.square {
  background: #000000;
  display: flex;
  justify-content: center;
  width: 12rem;
  height: 12rem;
  border-radius: 6px;
  margin: 10px;
  transition: all 0.2s;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
}

.square:hover {
  background: #322f49;
  cursor: pointer;
}

.allSquare {
  text-align: center;
  transition: all 0.2s;
}

.allSquare:hover {
  transform: scale(1.1);
}
</style>