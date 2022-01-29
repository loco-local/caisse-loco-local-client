<template>
  <Page>
    <v-card flat>
      <v-card-actions class="mb-4">
        <v-btn to="/">
          Annuler
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="secondary" dark @click="addCategory()" fab absolute right>
          <v-icon>add</v-icon>
        </v-btn>
      </v-card-actions>
      <v-data-table
          :headers="headers"
          :items="categories"
          :search="search"
          hide-default-footer
          class="elevation-1"
          disable-pagination
          :options="tableOptions"
      >
        <template v-slot:top>
          <v-text-field
              prepend-inner-icon="search"
              label="Recherche"
              single-line
              hide-details
              v-model="search"
              class="mx-4"
          ></v-text-field>
        </template>
        <template v-slot:item.name="{ item }">
          <div style="max-width: 200px;" class="mt-6">
            <v-text-field
                v-model="item.name"
                outlined
                @change="updateName(item)"
                dense
                width="200"
            />
          </div>
        </template>
        <template v-slot:item.priority="{ item }">
          <div style="max-width: 100px;" class="mt-6">
            <v-text-field
                v-model="item.priority"
                min="0"
                outlined
                type="number"
                @change="updatePriority(item)"
                x-small
                dense
                width="100"
            />
          </div>
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ item.createdAt | dayDate }}
        </template>
        <v-layout slot="no-results">
          <v-flex xs3></v-flex>
          <v-flex xs6 class="text-h6">
            Votre recherche pour "{{ search }}" n'a retourné aucun résultat.
          </v-flex>
          <v-flex xs3></v-flex>
        </v-layout>
      </v-data-table>
    </v-card>
    <v-snackbar
        v-model="categoryModifySuccess"
        bottom
        color="accent"
        dark
        :timeout="7000"
        class="font-weight-bold body-1"
    >
      La catégorie a été modifiée.
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            icon
            v-bind="attrs"
            @click="categoryModifySuccess = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </Page>
</template>

<script>
import CategoryService from "@/service/CategoryService";

export default {
  name: "Catégories",
  components: {
    Page: () => import('@/components/Page'),
  },
  data: function () {
    return {
      categories: [],
      categoryModifySuccess: false,
      search: null,
      tableOptions: {
        sortBy: ['priority'],
        sortAsc: [true]
      },
      headers: [
        {
          text: "Nom",
          value: 'name'
        },
        {
          text: "Priorité d'affichage",
          value: 'priority'
        },
        {
          text: "Créé",
          value: 'createdAt'
        }
      ],
    }
  },
  mounted: async function () {
    await this.setup();
  },
  methods: {
    updateName: async function (category) {
      await CategoryService.updateName(
          category.id,
          category.name
      );
      const timeout = this.categoryModifySuccess === true ? 1000 : 0;
      this.categoryModifySuccess = false;
      await this.$nextTick();
      setTimeout(() => {
        this.categoryModifySuccess = true;
      }, timeout)
    },
    updatePriority: async function (category) {
      await CategoryService.updatePriority(
          category.id,
          category.priority
      );
      const timeout = this.categoryModifySuccess === true ? 1000 : 0;
      this.categoryModifySuccess = false;
      await this.$nextTick();
      setTimeout(() => {
        this.categoryModifySuccess = true;
      }, timeout)
    },
    setup: async function () {
      const response = await CategoryService.list();
      this.categories = response.data;
    },
    addCategory: async function () {
      const response = await CategoryService.create();
      const newCategory = response.data;
      this.categories.push({
        id: newCategory.id,
        createdAt: newCategory.createdAt,
        name: "",
        priority: -1
      })
    }
  }
}
</script>

<style scoped>

</style>
