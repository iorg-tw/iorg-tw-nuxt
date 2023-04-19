<template>
<div class="page query">
  <div class="form-container">
    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdcZEtdE15lCgVcOhiiQJ9E-qMQWZYU3ImVb2LjY3Uvl8m32g/viewform"></iframe>
  </div>
</div>
</template>

<style lang="scss">
.page.query {
  > .form-container {
    width: 100%;
    max-width: 640px;
    height: 960px;
    max-height: calc(100vh - 160px);
    margin: 2rem auto;
    padding-top: 1rem;
    background-color: rgb(238, 238, 238);
    border-radius: 0.75rem;
    transform: translateX(0); // HACK!
    overflow: hidden;
    > iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
}

</style>
