<template>
  <div>
    <div class="color-controls">
      <label>
        Text Color:
        <input type="color" v-model="textColor" />
      </label>
      <label>
        Background Color:
        <input type="color" v-model="bgColor" />
      </label>
      <label>
        Font Size:
        <input type="range" v-model="fontSize" min="12" max="32" />
        {{ fontSize }}px
      </label>
    </div>

    <div
      class="preview-box"
      :style="{
        color: textColor,
        backgroundColor: bgColor,
        fontSize: fontSize + 'px',
        padding: `${padding}px`,
        border: `2px solid ${borderColor}`,
        borderRadius: radius + '%',
      }"
    >
      <p>This is a preview text with dynamic styles</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textColor: '#333333',
      bgColor: '#f0f0f0',
      fontSize: 16,
      padding: 20,
      borderColor: '#cccccc',
      radius: 5,
    }
  },
}
</script>
