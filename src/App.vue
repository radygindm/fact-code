<template>
  <div id="app" >
    <div v-if="json.length > 0 && isLoaded" class="main">
      <div class="select">
        <Select ref="select" v-for="(arr, id) in flatSplitData" :type="typeof arr[0]" :data="arr" :key="id" :items="selectState[stateUserPosition]" @select="getSelectValues" @remove="removeOption"></Select>
      </div>
      <List :items="selectState[stateUserPosition]"></List>
      <div class="action-group">
        <button class="btn" @click="stateUserPosition--" :disabled="stateUserPosition === 0">Шаг назад</button>
        <button class="btn" @click="stateUserPosition++" :disabled="stateUserPosition === selectState.length - 1">Шаг вперед</button>
        <button class="btn" @click="reset" :disabled="stateUserPosition === 0">Обнулить</button>
      </div>
      <div class="calc-group">
        <div v-if="hashStr()">Хэш строк равен: {{ this.hashStr() }}</div>
        <div v-if="multiNum() && multiNum() !== 1">Произведение чисел: {{ this.multiNum() }}</div>
      </div>
    </div>
    <div v-if="this.error">Fix problem and reload browser "{{ this.error }}"</div>
    <Modal :error-message="this.error" ref="modal"></Modal>
  </div>
</template>

<script>
import Api from './services/api';
import { flatten, isEmptyObject } from "./services/common";
import Select from "./components/Select";
import List from "./components/List";
import Modal from "./components/Modal";
import { sha256 } from "js-sha256";

export default {
  name: 'App',
  components: {
    Select,
    List,
    Modal,
  },
  data() {
    return {
      isLoaded: true,
      error: '',
      json: [],
      selectState: [[]],
      stateUserPosition: 0,
      elements: [],
    }
  },
  async created() {
    this.isLoaded = false;
    await this.getJson();
    if (this.error === '') {
      this.isLoaded = true;
    }
  },
  computed: {
    flatSplitData() {
      let flatArr = [...flatten(this.json)];
      let types = ['boolean', 'object', 'number', 'string', 'symbol'];
      let objWithPrimitives = {};
      let result = [];
      
      for (let i = 0; i < types.length; i++){
        objWithPrimitives[types[i]] = [];
      }
      
      for (let i = 0; i < flatArr.length; i++){
        if (flatArr[i] === null || (typeof flatArr[i] === 'object' && isEmptyObject(flatArr[i]))) continue;
        if (types.includes(typeof flatArr[i])){
            objWithPrimitives[typeof flatArr[i]].push(flatArr[i]);
        }
      }
      
      for (let key in objWithPrimitives){
        if(objWithPrimitives[key].length > 0) {
          result.push(objWithPrimitives[key])
        }
      }
      
      return result;
    }
  },
  methods: {
    getJson() {
      Api().then(data => {
        this.json.push(...data.testArr);
      }).catch(error => {
        this.error = error.message;
        this.openModal()
      })
    },
    getSelectValues(value) {
      this.elements.push(value);
      this.setSelectState(value)
    },
    reset: function () {
      this.elements = [];
      for (let i = 0; i < this.$refs.select.length; i++) {
        this.$refs.select[i].reset();
      }
      this.selectState = [[]];
      this.stateUserPosition = 0;
    },
    removeOption(option) {
      let idEl = this.elements.findIndex(item => JSON.stringify(item) === JSON.stringify(option));
      this.elements.splice(idEl, 1);
      this.setSelectState();
    },
    setSelectState(value) {
      let curEl;
      if (value) {
        curEl = value;
      }
      if (this.selectState && this.selectState.length > 9) {
        this.selectState.shift();
      } else {
        this.stateUserPosition++;
      }

      if (this.stateUserPosition < this.selectState.length) {
        this.selectState.splice(this.stateUserPosition);
        this.elements.splice(this.stateUserPosition - 1);
        console.log(this.elements)
        if (curEl) {
          this.elements.push(curEl);
        }
        console.log('elements', this.elements, 'state', this.selectState[this.stateUserPosition - 1]);
      }
      this.selectState.push([...this.elements]);
    },
    openModal() {
      this.$refs.modal.openDialog();
    },
    hashStr() {
      let result = '';
      for (let i = 0; i < this.selectState[this.stateUserPosition].length; i++) {
        if (typeof this.selectState[this.stateUserPosition][i] === 'string') {
          result = result + this.selectState[this.stateUserPosition][i]
        }
      }
      if (result) {
        return sha256(result);
      }
    },
    multiNum() {
      let result = 1;
      for (let i = 0; i < this.selectState[this.stateUserPosition].length; i++) {
        if (typeof this.selectState[this.stateUserPosition][i] === 'number') {
          result *= this.selectState[this.stateUserPosition][i]
        }
      }
      return result;
    }
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
.select {
  width: 100%;
  display: flex;
  .multiselect {
    margin: 10px;
    width: 320px;
  }
}
.btn {
  padding: 12px 40px;
  background: #41b883;
  color: white;
  border: none;
  border-radius: 5px;
  margin: 10px;
  transition: .3s ease;
  &:hover {
    cursor: pointer;
    background: lighten(#41b883, 15%);
  }
  &:disabled {
    background: #999999;
  }
}
  .calc-group {
    margin-left: 10px;
  }
</style>
