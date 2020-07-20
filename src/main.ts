import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import './common/stylus/index.styl'
// import { usePlayerStore } from './store/player'
const app = createApp(App)
  // .use(usePlayerStore)
  .use(router)
  .use(store)
  .use(lazyPlugin, {
    loading: require('common/image/default.png'),
  })
  .mount('#app')
