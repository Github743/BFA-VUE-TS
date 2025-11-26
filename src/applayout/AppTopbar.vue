<template>
  <header class="topbar border-bottom bg-white">
    <div
      class="container-fluid d-flex align-items-center justify-content-between px-4"
    >
      <!-- LEFT SECTION -->
      <div class="d-flex align-items-center gap-4">
        <!-- Logo -->
        <img
          src="@/assets/liscr_logo.png"
          alt="Liberian Registry"
          class="topbar-logo"
        />

        <!-- Vertical Divider -->
        <div class="vr"></div>

        <!-- Nav Links -->
        <nav class="d-flex align-items-center gap-5 fw-semibold">
          <RouterLink to="/" class="nav-link px-0">Home</RouterLink>
          <RouterLink to="/dashboard" class="nav-link px-0"
            >Dashboard</RouterLink
          >
          <RouterLink to="/bfaorders" class="nav-link px-0">BFA</RouterLink>
          <RouterLink to="/annualbilling" class="nav-link px-0"
            >Annual Billing</RouterLink
          >
        </nav>
      </div>

      <!-- RIGHT SECTION -->
      <div class="d-flex align-items-center gap-4">
        <!-- Vertical Divider -->
        <div class="vr"></div>

        <!-- Settings Icon -->
        <button class="btn btn-link p-0">
          <i class="bi bi-gear fs-5"></i>
        </button>

        <!-- Admin Dropdown Placeholder -->
        <div class="fw-semibold text-muted small">Admin ▾</div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { RouterLink } from "vue-router";
</script>

<style scoped>
  .router-link-active,
  .router-link-exact-active {
    color: #0d6efd !important; /* blue highlight */
    font-weight: 600 !important; /* bold */
  }

  .topbar {
    height: 56px;
    display: flex;
    align-items: center;
  }

  .topbar-logo {
    height: 28px;
    width: auto;
  }

  .nav-link {
    color: #222;
    text-decoration: none;
  }

  .nav-link:hover {
    color: #0d6efd;
  }

  .nav-link.active {
    color: #0d6efd;
    font-weight: 600;
  }

  .vr {
    height: 24px;
    border-left: 1px solid #dcdcdc;
  }
</style>
