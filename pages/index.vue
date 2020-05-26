<template>
<div class="page index">
  <img src="/images/logo-tmp-small.png" width="64" />
  <div class="container">
    <div class="panel">
      <h2>Event Studies of Chinese Information Operations Against Taiwan</h2>
      <a class="start" href="https://github.com/iorg-tw/documents/raw/master/iorg-model-1.pdf"><label>Download</label></a>
    </div>
  </div>
</div>
</template>

<script>
</script>

<style lang="scss">
.start {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0 0;
  > label {
    background-color: var(--iorg-primary-dark-color);
    color: var(--iorg-primary-light-color);
    line-height: 1;
    padding: 0.75rem 1rem;
    border-radius: 1.25rem;
    cursor: pointer;
  }
}
.container {
  display: flex;
}
.panel {
  max-width: 20rem;
  margin: 1rem;
  padding: 0.75rem;
  background-color: white;
  box-shadow: 0 0.5rem 3rem 0 rgba(0, 0, 0, 0.25);
}
h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: normal;
  font-style: italic;
}
</style>
