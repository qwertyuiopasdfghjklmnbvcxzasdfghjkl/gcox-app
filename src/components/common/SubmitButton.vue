<template>
    <button :style="`background:${bgColor}`"><slot></slot></button>
</template>

<script>
    export default {
        name: "submit-button",
        props:{
            bgColor:{
                type: String,
                default: '#4AC6C3'
            }
        }
    }
</script>

<style scoped>
    button {
        width: 100%;
        height: 0.96rem;
        color: #fff;
        font-size: 0.34rem;
        border: none;
        border-radius: 2rem;
        margin-top: 0.2rem;
    }
</style>
