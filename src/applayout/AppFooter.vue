<template>
  <footer class="footer">
    <div class="footer-inner">
      <span>© 2025 LISCR LLC, ALL RIGHTS RESERVED | Privacy Policy</span>
      <span>
        Contact us :
        <a href="mailto:WPCloudSupport@liscr.com">WPCloudSupport@liscr.com</a>
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--footer-h);       /* use the CSS var */
  background: white;
  z-index: 1100;                 /* make sure it sits above content but below modals */
  box-shadow: 0 -1px 3px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
}

.footer-inner {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 0.85rem;
}
</style>
