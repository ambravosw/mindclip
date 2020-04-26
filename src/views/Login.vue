<template>
    <v-form
        ref="form"
        lazy-validation
    >
        <v-text-field
            v-model="form.email"
            label="email"
            required
        ></v-text-field>
        <v-text-field
            v-model="form.password"
            label="password"
            required
        ></v-text-field>
        <v-btn
          class="mr-4"
          @click.prevent="onSubmit()"
        >
            login
        </v-btn>
    </v-form>
</template>
<script>
import { mapActions } from "vuex";

export default {
    name: "login",
    data() {
      return {
        form: {
                email: "a@a.com",
                password: "",
            }
        }
    },
    methods:{
        ...mapActions('app',['login']),
        onSubmit(){
            this.login({email:this.form.email,password:this.form.password})
        }
    }
}

</script>