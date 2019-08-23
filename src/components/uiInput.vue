<template>
    <div class="ui_input">
        <label>
            <span v-html="placeholder ? '':_t" :class="{'hover':active}" :style="style"></span>
            <input
                    ref="input"
                    :type="type"
                    @focus="focus()"
                    @blur="blur()"
                    @input="ent()"
                    :value="text"
                    :maxlength="maxlength"
                    :placeholder="placeholder? _t: ''">
        </label>
    </div>
</template>

<script>
    export default {
        name: "uiInput",
        props: {
            label: {
                type: String,
                default: null,
            },
            type: {
                type: String,
                default: 'text',
            },
            placeholder: {
                type: Boolean,
                default: false
            },
            maxlength: {
                type: Number,
                default: 120
            },
            title: {
                type: String,
                default: null
            },
            value: null,
        },
        data() {
            return {
                text: this.value,
                active: false,
                _t:null,
                style: {},
            }
        },
        watch: {
            value(){
                this.focus()
                this.text = this.value
            }
        },
        created(){
            this._t = this.label
        },
        methods: {
            focus() {
                this.active = true;
                if (this.title) {
                    this._t = this.title
                }
                this.style={
                    opacity: 1
                }
            },
            blur() {
                this.active = this.text
                if (!this.active) {
                    this._t = this.label
                    this.style={
                        opacity: 1
                    }

                }else{
                    this.style={
                        opacity: 0
                    }
                }
                this.$emit('blur', this.text);
            },
            ent() {
                this.text = this.$refs.input.value
                this.$emit('input', this.text);
            }
        }
    }
</script>

<style scoped lang="less">
    .ui_input {
        label {
            display: block;
            color: #ffffff;
            position: relative;
            height: 0.8rem;
            border-bottom: 0.02rem solid #43434E;
            transition: border 0.3s;

            &:hover {
                border-bottom-color: #5CACCF;
            }

            input {
                display: block;
                width: 100%;
                border: none;
                outline: none;
                height: 0.5rem;
                position: absolute;
                left: 0;
                bottom: 0;
                background: none;
                font-size: 0.26rem;
                color: #ffffff;
            }

            span {
                position: absolute;
                left: 0;
                color: #A7ACB9;
                top: 0.28rem;
                font-size: 0.28rem;
                transition: 0.3s;
                /*opacity: 1 !important;*/
                &.hover {
                    color: #ffffff;
                    top: 0;
                    font-size: 0.24rem;
                }
            }
        }
    }
    input:hover, input:active, input:focus, input:visited, input:focus-within, input:-internal-autofill-selected{
        background-color: transparent !important;
    }
</style>
