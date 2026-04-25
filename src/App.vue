<template>
  <div class="app-shell">
    <header class="app-header">
      <h1 class="app-title">67705261-APi</h1>
      <nav>
        <router-link to="/products/create">Product Form</router-link> |
        <router-link to="/products">Product List</router-link>
      </nav>
    </header>
  </div>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.app-shell {
  background: linear-gradient(180deg, #f8fafc 0%, #eef3f6 100%);
}

.app-header {
  padding: 24px 16px 18px;
}

.app-title {
  margin: 0 0 12px;
  color: #4f6774;
  font-size: 2rem;
  font-weight: 700;
}

nav {
  padding: 0 0 12px;
}

nav a {
  font-weight: bold;
  color: #4f6774;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #6b8796;
}
</style>
