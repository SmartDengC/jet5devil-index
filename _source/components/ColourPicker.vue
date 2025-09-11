<template>
  <div class="color-picker">
    <button class="toggle-button" @click="togglePanel" title="button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <g fill="none">
          <g clip-path="url(#SVGXv8lpc2Y)">
            <path
              fill="#66e1ff"
              d="M19.17 8.181q.002.632-.114 1.253a7.04 7.04 0 0 0-3.232-.775c-1.354 0-2.68.384-3.824 1.11a7.13 7.13 0 0 0-3.824-1.11a7.04 7.04 0 0 0-3.232.775A6.7 6.7 0 0 1 4.83 8.18c0-5.52 5.975-8.97 10.755-6.21a7.17 7.17 0 0 1 3.585 6.21"
            />
            <path
              fill="#78eb7b"
              d="M12.001 9.768a7.1 7.1 0 0 0-3.231 4.8a7.12 7.12 0 0 1-3.824-5.134a7.15 7.15 0 0 1 7.056.335"
            />
            <path
              fill="#ffef5e"
              d="M12.001 21.881A7.06 7.06 0 0 1 8.177 23c-5.52-.008-8.961-5.988-6.195-10.764a7.17 7.17 0 0 1 2.964-2.802a7.12 7.12 0 0 0 3.824 5.134A7.12 7.12 0 0 0 12 21.88"
            />
            <path
              fill="#e3e3e3"
              d="M15.231 14.568a7.05 7.05 0 0 1-6.462 0A7.12 7.12 0 0 1 12 9.768a7.12 7.12 0 0 1 3.231 4.8"
            />
            <path
              fill="#d480ff"
              d="M19.057 9.434a7.12 7.12 0 0 1-3.824 5.134A7.12 7.12 0 0 0 12 9.768a7.14 7.14 0 0 1 3.824-1.109a7.04 7.04 0 0 1 3.232.775"
            />
            <path
              fill="#c77f67"
              d="M15.347 15.83A7.12 7.12 0 0 1 12 21.88a7.12 7.12 0 0 1-3.232-7.313a7.05 7.05 0 0 0 6.463 0q.115.624.115 1.262"
            />
            <path
              fill="#ff808c"
              d="M22.995 15.83a7.17 7.17 0 0 1-7.17 7.17A7.06 7.06 0 0 1 12 21.881a7.12 7.12 0 0 0 3.231-7.313a7.12 7.12 0 0 0 3.825-5.134a7.14 7.14 0 0 1 3.939 6.396"
            />
            <path
              stroke="#191919"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.17 8.181q.002.632-.114 1.253a7.04 7.04 0 0 0-3.232-.775c-1.354 0-2.68.384-3.824 1.11a7.13 7.13 0 0 0-3.824-1.11a7.04 7.04 0 0 0-3.232.775A6.7 6.7 0 0 1 4.83 8.18c0-5.52 5.975-8.97 10.755-6.21a7.17 7.17 0 0 1 3.585 6.21"
              stroke-width="1"
            />
            <path
              stroke="#191919"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12.001 9.768a7.1 7.1 0 0 0-3.231 4.8a7.12 7.12 0 0 1-3.824-5.134a7.15 7.15 0 0 1 7.056.335"
              stroke-width="1"
            />
            <path
              stroke="#191919"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12.001 21.881A7.06 7.06 0 0 1 8.177 23c-5.52-.008-8.961-5.988-6.195-10.764a7.17 7.17 0 0 1 2.964-2.802a7.12 7.12 0 0 0 3.824 5.134A7.12 7.12 0 0 0 12 21.88"
              stroke-width="1"
            />
            <path
              stroke="#191919"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.231 14.568a7.05 7.05 0 0 1-6.462 0A7.12 7.12 0 0 1 12 9.768a7.12 7.12 0 0 1 3.231 4.8"
              stroke-width="1"
            />
            <path
              stroke="#191919"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.232 14.568a7.12 7.12 0 0 0 3.824-5.134a7.04 7.04 0 0 0-3.231-.775c-1.354 0-2.68.384-3.824 1.11a7.12 7.12 0 0 1 3.231 4.799m0 0a7.05 7.05 0 0 1-6.463 0a7.12 7.12 0 0 0 3.232 7.313a7.12 7.12 0 0 0 3.231-7.313"
              stroke-width="1"
            />
            <path
              stroke="#191919"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M22.995 15.83a7.17 7.17 0 0 1-7.17 7.17A7.06 7.06 0 0 1 12 21.881a7.12 7.12 0 0 0 3.231-7.313a7.12 7.12 0 0 0 3.825-5.134a7.14 7.14 0 0 1 3.939 6.396"
              stroke-width="1"
            />
          </g>
          <defs>
            <clipPath id="SVGXv8lpc2Y">
              <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
          </defs>
        </g>
      </svg>
    </button>

    <div v-if="showPanel" class="control-panel">
      <div class="slider-container">
        <input
          type="range"
          min="0"
          max="360"
          v-model="hue"
          @input="updateTheme"
          class="slider"
        />
      </div>

      <div
        class="color-preview"
        :style="{ backgroundColor: `hsl(${hue}, 50%, 50%)` }"
      ></div>

      <div class="actions">
        <button class="reset-button" @click="resetTheme">
          <span class="icon">↺</span> 重置默认
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPanel: false,
      hue: 200, // 默认蓝色
      defaulthue: 200,
    };
  },
  mounted() {
    // 从本地存储加载保存的颜色
    const savedHue = localStorage.getItem("themeHue");
    if (savedHue) {
      this.hue = parseInt(savedHue);
      this.updateTheme();
    }
  },
  methods: {
    togglePanel() {
      this.showPanel = !this.showPanel;
    },
    updateTheme() {
      // 更新 CSS 变量
      document.documentElement.style.setProperty(
        "--theme-hue",
        `${this.hue}deg`
      );

      // 保存到本地存储
      localStorage.setItem("themeHue", this.hue);
    },
    resetTheme() {
      // 重置为默认值
      this.hue = this.defaulthue;

      // 更新主题
      this.updateTheme();
    },
  },
};
</script>

<style scoped>
.toggle-button {
  padding: 8px 16px;
}

.control-panel {
  margin-top: 10px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 250px;
  position: fixed;
  bottom: 10%;
  right: 10%;
  background-color: var(--vp-code-block-bg);
  display: flex;
  flex-direction: column;
}

.slider-container {
  margin-bottom: 15px;
  color: var(--vp-c-text-1);
}

.slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    red,
    yellow,
    lime,
    cyan,
    blue,
    magenta,
    red
  );
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 2px solid #555;
  cursor: pointer;
}

.color-preview {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin: 0 auto;
  border: 1px solid #eee;
}
</style>
