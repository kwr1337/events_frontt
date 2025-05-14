<template>
  <div v-if="isMainPage" class="vk-widget">
    <div id="vk_groups"></div>
  </div>
</template>

<script>
export default {
  name: 'VkWidget',
  data() {
    return {
      isScriptLoaded: false
    }
  },
  computed: {
    isMainPage() {
      return this.$route.path === '/' || this.$route.path === '/main';
    }
  },
  methods: {
    initVKWidget() {
      try {
        if (window.VK && window.VK.Widgets && this.isMainPage) {
          window.VK.Widgets.Group(
            "vk_groups",
            {
              mode: 1,
              no_cover: 1,
              height: "300",
              width: "200",
              color1: 'FFFFFF',
              color2: '000000',
              color3: '5181B8'
            },
            185329799
          );
        }
      } catch (error) {
        console.error('Ошибка инициализации виджета ВК:', error);
      }
    },
    loadVKScript() {
      if (!this.isMainPage) return Promise.resolve();

      return new Promise((resolve, reject) => {
        if (document.getElementById('vk-openapi')) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.id = 'vk-openapi';
        script.src = 'https://vk.com/js/api/openapi.js?168';
        script.async = true;
        
        script.onload = () => {
          this.isScriptLoaded = true;
          resolve();
        };
        
        script.onerror = (error) => {
          console.error('Ошибка загрузки скрипта ВК:', error);
          reject(error);
        };

        document.head.appendChild(script);
      });
    }
  },
  async mounted() {
    if (!this.isMainPage) return;

    try {
      await this.loadVKScript();
      setTimeout(() => {
        this.initVKWidget();
      }, 100);
    } catch (error) {
      console.error('Ошибка при монтировании компонента:', error);
    }
  },
  beforeUnmount() {
    const widget = document.getElementById('vk_groups');
    if (widget) {
      widget.innerHTML = '';
    }
    const script = document.getElementById('vk-openapi');
    if (script) {
      script.remove();
    }
  }
}
</script>

<style lang="scss" scoped>
.vk-widget {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  background: #FFFFFF;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 1600px) {
    display: none;
  }
}
</style> 