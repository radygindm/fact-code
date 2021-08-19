<template>
    <a11y-dialog
            id="app-dialog"
            app-root="#app"
            dialog-root="#dialog-root"
            @dialog-ref="assignDialogRef"
    >
        <template v-slot:title>
            <span>Error message</span>
        </template>
        <div>
            <p>{{ errorMessage }}</p>
        </div>
    </a11y-dialog>
</template>

<script>
    import { A11yDialog } from 'vue-a11y-dialog';

    export default {
        name: "Modal",
        data: () => ({
            dialog: null,
        }),
        components: {
            'a11y-dialog': A11yDialog,
        },
        props: {
            errorMessage: String,
        },
        methods: {
            openDialog() {
                if (this.dialog) {
                    this.dialog.show()
                }
            },

            assignDialogRef(dialog) {
                this.dialog = dialog
            }
        }
    }
</script>

<style scoped>

</style>