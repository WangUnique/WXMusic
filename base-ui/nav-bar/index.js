// base-ui/nav-bar/index.js
Component({
  options:{
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: "默认标题"
    }
  },

  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    navBarHeight: getApp().globalData.navBarHeight
  },

  lifetimes:{
    ready() {
    }
  },

  methods: {
    handleLeftClick() {
      this.triggerEvent('click')
    }
  }
})
