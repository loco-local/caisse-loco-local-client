<template>
  <Page>
    <v-toolbar class="mb-0" elevation="0">
      <v-btn @click="back" class="mt-3 mb-3 ml-3">
        Annuler
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :dark="transactionItemsTotal > 0"
             color="secondary"
             :disabled="transactionItemsTotal <= 0"
             @click="showPaymentModal = true; showConfirmSnackbar= false;"
             x-large
      >
        {{ transactionItemsTotal | currency }}
        Payer
      </v-btn>
    </v-toolbar>
    <v-card flat class="" color="transparent">
      <!--      <v-card-title class="logo-font text-h4">-->
      <!--        Transaction-->
      <!--      </v-card-title>-->
      <v-card-actions :class="{
          'pl-0 pr-0': $vuetify.breakpoint.smAndDown
        }">
      </v-card-actions>
      <v-row v-if="isLoading">
        <v-col cols="12" md="4" class="text-center vh-center" v-for="n in 20" :key="n">
          <v-skeleton-loader
              width="250"
              type="image, list-item-two-line"
              color="transparent"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
      <TransactionDetails :products="selectedProducts" :key="detailsKey"
                          :ardoiseUser="null"/>
      <v-divider class="mt-4"></v-divider>
      <v-card-subtitle class="body-1 text-left mb-4 font-italic">
        Les prix sont taxes incluses
      </v-card-subtitle>
      <v-row>
        <v-col cols="12">
          <v-col v-if="categories.length === 0" cols="12" class="text-h6">
            <v-sheet height="400" class="grey--text">
              Pas de résultats
            </v-sheet>
          </v-col>
          <v-row wrap v-for="category in categories" :key="category.id" class="" v-else>
            <v-col cols="12" class="text-left" v-if="category.products.length > 1">
              <h4 class="">
                {{ category.name }}
              </h4>
            </v-col>
            <v-col cols="12" md="4" class="text-center" v-for="product in category.products"
                   :key="product.id">
              <v-card height="150" @click="selectProduct(product)" class="vh-center"
                      :dark="isProductInTransaction(product)" :color="cardColorFromProduct(product)">
                <v-chip
                    color="transparent"
                    v-if="product.quantity && !product.isActivity && !product.isOther && !product.isDonation"
                    style="margin-bottom: -16px;"
                    class="font-weight-bold"
                >
                  Quantité: {{ product.quantity }}
                </v-chip>
                <v-chip
                    color="transparent"
                    v-if="product.isActivity && product.info && product.info.name"
                    style="margin-bottom: -16px;"
                    class="font-weight-bold"
                >
                  {{ product.info.name }}
                </v-chip>
                <v-card-title class="vh-center">
                  {{ product.name }}
                </v-card-title>
                <v-card-subtitle v-if="product.price && !product.isActivity && !product.isOther" class="mt-1 text-h6">
                  {{ product.price | currency }}
                  <small v-if="product.isPriceInKg">/kg</small>
                </v-card-subtitle>
                <v-card-text v-if="product.description">
                  {{ product.description }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="productQuantityDialog" v-if="productQuantityDialog" max-width="600" persistent top
              style=" align-self: flex-end;" fullscreen>
      <v-card>
        <v-card-title class="vh-center">
          {{ selectedProduct.name }}
          <v-spacer></v-spacer>
          <v-icon @click="productQuantityDialog = false">close</v-icon>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form ref="quantityForm">
            <v-row class="vh-center">
              <v-col cols="6" md="4">
                <v-text-field
                    clearable
                    label="Poids"
                    ref="quantityInput"
                    v-model="quantityOfSelectedProduct"
                    suffix="kg"
                    type="number"
                    v-if="selectedProduct.isPriceInKg"
                    @keydown="quantityKeydown"
                    @click:clear="confirmQuantity(0)"
                    @keyup="updateModelOnKeyup($event,'quantityOfSelectedProduct')"
                ></v-text-field>
                <v-text-field
                    clearable
                    label="Quantité"
                    ref="quantityInput"
                    v-model="quantityOfSelectedProduct"
                    type="number"
                    size="2"
                    v-if="!selectedProduct.isPriceInKg"
                    @keydown="quantityKeydown"
                    @click:clear="confirmQuantity(0)"
                    @keyup="updateModelOnKeyup($event,'quantityOfSelectedProduct')"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0 mt-0">
          <v-btn @click="productQuantityDialog=false">
            Annuler
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="confirmQuantity()" x-large class="mb-6">
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="otherProductDialog" v-if="otherProductDialog" max-width="600" persistent fullscreen>
      <v-card>
        <v-card-title class="vh-center">
          {{ selectedProduct.name }}
          <v-spacer></v-spacer>
          <v-icon @click="otherProductDialog=false">close</v-icon>
        </v-card-title>
        <v-form ref="otherProductForm">
          <v-card-text>
            <v-row class="vh-center">
              <v-col cols="10" md="8">
                <v-text-field
                    clearable
                    label="Montant"
                    prepend-inner-icon="attach_money"
                    ref="priceInput"
                    v-model="priceOfSelectedProduct"
                    type="number"
                    size="2"
                    @keydown="otherProductKeydown"
                    :rules="[Rules.required]"
                    required
                    @keyup="updateModelOnKeyup($event,'priceOfSelectedProduct')"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-row class="vh-center">
              <v-col cols="10" md="8">
                <v-text-field
                    clearable
                    label="Nom du produit"
                    v-model="nameOfSelectedProduct"
                    @keydown="otherProductKeydown"
                    :rules="[Rules.required]"
                    required
                    @keyup="updateModelOnKeyup($event,'nameOfSelectedProduct')"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
        <v-card-actions>
          <v-btn @click="otherProductDialog=false">
            Annuler
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="confirmOtherProduct()" x-large>
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="donationProductDialog" v-if="donationProductDialog" max-width="600" persistent fullscreen>
      <v-card>
        <v-card-title class="vh-center pb-0">
          {{ selectedProduct.name }}
          <v-spacer></v-spacer>
          <v-icon @click="donationProductDialog=false">close</v-icon>
        </v-card-title>
        <v-form ref="donationProductForm" class="pb-0">
          <v-card-text class="pb-0">
            <v-row class="vh-center">
              <v-col cols="10" md="8">
                <v-text-field
                    clearable
                    label="Montant"
                    prepend-inner-icon="attach_money"
                    ref="priceInput"
                    v-model="priceOfSelectedProduct"
                    type="number"
                    size="2"
                    @keydown="donationProductDialog"
                    :rules="[Rules.required]"
                    required
                    @keyup="updateModelOnKeyup($event,'priceOfSelectedProduct')"
                    dense
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
        <v-card-actions>
          <v-btn @click="donationProductDialog=false">
            Annuler
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="confirmDonationProduct()" x-large>
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="activityDialog" v-if="activityDialog" max-width="600" persistent top fullscreen>
      <v-card>
        <v-card-title class="vh-center">
          {{ selectedProduct.name }}
          <v-spacer></v-spacer>
          <v-icon @click="activityDialog=false">close</v-icon>
        </v-card-title>
        <v-form ref="activityForm">
          <v-card-text>
            <v-row class="vh-center">
              <v-col cols="10" md="8">
                <v-text-field
                    clearable
                    label="Montant récolté"
                    ref="priceInput"
                    prepend-inner-icon="attach_money"
                    v-model="priceOfSelectedProduct"
                    type="number"
                    size="2"
                    @keydown="activityKeydown"
                    :rules="[Rules.required]"
                    required
                    @keyup="updateModelOnKeyup($event,'priceOfSelectedProduct')"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-row class="vh-center">
              <v-col cols="10" md="8">
                <v-text-field
                    clearable
                    label="Nom de l'activité"
                    v-model="nameOfSelectedActivity"
                    @keydown="activityKeydown"
                    :rules="[Rules.required]"
                    required
                    @keyup="updateModelOnKeyup($event,'nameOfSelectedActivity')"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-row class="vh-center">
              <v-col cols="10" md="8">
                <v-text-field
                    clearable
                    label="Nombre de participants ?"
                    v-model="nbParticipantsOfSelectedProduct"
                    type="number"
                    @keydown="activityKeydown"
                    :rules="[Rules.required]"
                    required
                    @keyup="updateModelOnKeyup($event,'nbParticipantsOfSelectedProduct')"

                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
        <v-card-actions>
          <v-btn @click="activityDialog=false">
            Annuler
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="confirmActivity()" x-large>
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
        color="error"
        timeout="10000"
        v-model="insertYourNameSnackbar"
        top
    >
      <span class="body-1 font-weight-bold">Veuillez saisir votre nom</span>
      <template v-slot:action="{ attrs }">
        <v-btn icon dark color="" class="ml-8" @click.native="insertYourNameSnackbar = false" v-bind="attrs">
          <v-icon color="white">close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        color="secondary"
        :timeout="9999999"
        bottom
        multi-line
        v-model="showConfirmSnackbar"
        class="pl-8 pb-8"
        v-if="!productQuantityDialog && !otherProductDialog && !activityDialog"
    >
      <span class="font-weight-bold body-1">
        Total: {{ transactionItemsTotal | currency }}
      </span>
      <v-btn color="white" class="ml-8 black--text" :disabled="selectedProducts.length === 0"
             @click="showPaymentModal = true; showConfirmSnackbar= false;" x-large>
        Payer
      </v-btn>
      <template v-slot:action="{ attrs }">
        <v-btn icon dark color="" class="ml-8" @click.native="showConfirmSnackbar = false" v-bind="attrs">
          <v-icon color="white">close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-model="showPaymentModal" width="900" fullscreen persistent>
      <v-card flat>
        <!--        <v-card-title class="pb-0">-->
        <!--          <v-spacer></v-spacer>-->
        <!--          <v-icon @click="showPaymentModal=false">close</v-icon>-->
        <!--        </v-card-title>-->
        <v-form ref="paymentForm" @submit.prevent>
          <!--        <v-card-title class="vh-center">-->
          <!--          Mode de paiement-->
          <!--        </v-card-title>-->
          <v-card-text class="vh-center pb-0">
            <v-radio-group v-model="paymentMethod" @change="handleChangePaymentMethod">
              <v-radio
                  label="Comptant"
                  value="cash"
                  class="pt-2 pb-2"
              ></v-radio>
              <v-radio
                  label="Virement interact à admin@loco-local.net"
                  value="interact"
                  class="pt-2 pb-2"
              ></v-radio>
              <v-radio
                  label="Transfert bancaire."
                  value="bankTransfer"
                  class="pt-2 pb-0 mb-0"
                  hint="Transit caisse: 40001, No institution: 815, Folio: 0451286"
                  persistent-hint
              ></v-radio>
              <small class="ml-9">
                <strong>Transit caisse:</strong> 40001
              </small>
              <small class="ml-9">
                <strong>No institution:</strong> 815
              </small>
              <small class="ml-9 pb-2">
                <strong>Folio:</strong> 0451286
              </small>
              <v-radio
                  label="Compte prépayé"
                  value="prepaid"
                  class="pt-2"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-text v-if="paymentMethod === 'prepaid'" class="vh-center">
            <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
                v-if="isLoadingUsers"
            ></v-progress-circular>
            <v-row class="vh-center">
              <v-col cols="12" md="6">
                <v-select
                    v-if="!isLoadingUsers"
                    :items="users"
                    label="Compte prépayé"
                    item-value="id"
                    item-text="text"
                    return-object
                    v-model="prepaidUser"
                    @change="personName = prepaidUser.firstname + ' ' + prepaidUser.lastname"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.firstname }}
                        {{ item.lastname }}
                        <span class="ml-3 mr-3">|</span>
                        <strong>{{ item.balance | currency }}</strong>
                      </v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text class="pb-0 pt-0">
            <v-text-field
                class="pt-0"
                label="Votre nom"
                hint="Pour que l'on vous reconnaisse"
                v-model="personName"
                :rules="[Rules.required]"
                persistent-hint
                @keydown="submitPaymentFormOnEnter"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>
            <v-btn
                x-large
                color="secondary"
                @click.native="confirmTransaction" large
                :loading="isWaitingForTransaction"
                :disabled="isWaitingForTransaction || isLoadingUsers || paymentMethod === null || (paymentMethod === 'prepaid' && prepaidUser === null)"
            >
              Confirmer {{ transactionItemsTotal | currency }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="" text
                   @click.native="showPaymentModal = false; showConfirmSnackbar = true">
              Annuler
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <CompletePaymentModal ref="completePaymentModal"
                          :amount="transactionItemsTotal"
                          :paymentMethod="paymentMethod"
                          :accountBalance="paymentMethod === 'prepaid' && prepaidUser !== null ? prepaidUser.balance: null"></CompletePaymentModal>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";
import Rules from '@/Rules'
import TransactionService from "@/service/TransactionService";
import UserService from "@/service/UserService";

const ENTER_KEY_CODE = 13;
export default {
  name: "Transaction",
  components: {
    Page: () => import('@/components/Page'),
    TransactionDetails: () => import('@/components/TransactionDetails'),
    CompletePaymentModal: () => import('@/components/CompletePaymentModal'),
  },
  data: function () {
    return {
      Rules: Rules,
      isLoading: false,
      categories: {},
      selectedProduct: null,
      selectedProducts: [],
      productQuantityDialog: false,
      showConfirmSnackbar: false,
      showPaymentModal: false,
      detailsKey: Math.random(),
      transactionItemsTotal: 0,
      activityDialog: false,
      otherProductDialog: false,
      donationProductDialog: false,
      priceOfSelectedProduct: null,
      quantityOfSelectedProduct: null,
      nameOfSelectedProduct: null,
      nameOfSelectedActivity: null,
      nbParticipantsOfSelectedProduct: null,
      paymentMethod: null,
      personName: null,
      completedDialog: false,
      prepaidUser: null,
      isLoadingUsers: false,
      isWaitingForTransaction: false,
      users: [],
      insertYourNameSnackbar: false
    }
  },
  methods: {
    submitPaymentFormOnEnter: function (event) {
      if (event.keyCode === ENTER_KEY_CODE) {
        this.confirmTransaction();
      }
    },
    updateModelOnKeyup: function (event, modelName) {
      this[modelName] = event.target.value;
    },
    handleChangePaymentMethod: async function () {
      if (this.paymentMethod === 'prepaid') {
        this.isLoadingUsers = true;
        const response = await UserService.list();
        this.users = response.data.map((user) => {
          user.text = user.firstname + " " + user.lastname + " | " + this.$options.filters.currency(user.balance);
          return user;
        })
        this.isLoadingUsers = false;
      } else {
        this.prepaidUser = null;
      }
    },
    selectedProductsRequireBuyerName : function(){
      return this.selectedProducts.some((product)=>{
        return product.requiresBuyerName;
      });
    },
    confirmTransaction: async function () {
      if ((this.paymentMethod !== 'cash' || this.selectedProductsRequireBuyerName()) && !this.$refs.paymentForm.validate()) {
        this.insertYourNameSnackbar = true;
        return;
      }
      this.insertYourNameSnackbar = false;
      this.isWaitingForTransaction = true;
      if (this.paymentMethod === 'prepaid') {
        this.prepaidUser.balance -= parseFloat(this.transactionItemsTotal);
        await TransactionService.addForUserId(
            this.selectedProducts,
            this.prepaidUser.id,
            this.personName
        );
      } else {
        await TransactionService.addForAnonymous(this.selectedProducts, this.paymentMethod, this.personName);
      }
      this.showPaymentModal = false;
      this.showConfirmSnackbar = false;
      this.$refs.completePaymentModal.enter();
      this.isWaitingForTransaction = false;
    },
    isProductInTransaction: function (product) {
      return (product.quantity !== undefined && product.quantity > 0) ||
          product.isActivity && product.info && product.info.name !== undefined;
    },
    cardColorFromProduct: function (product) {
      if (this.isProductInTransaction(product)) {
        return "secondary";
      }
      return "transparent";
    },
    updateTransactionItemsTotal: function () {
      this.transactionItemsTotal = this.selectedProducts.reduce((sum, item) => {
            return sum + item.quantity * item.price;
          }, 0
      );
      if (isNaN(this.transactionItemsTotal)) {
        console.log(this.transactionItemsTotal);
        this.transactionItemsTotal = 0;
      }
      this.showConfirmSnackbar = this.transactionItemsTotal > 0;
    },
    activityKeydown: function (event) {
      if (event.keyCode === ENTER_KEY_CODE) {
        this.confirmActivity();
      }
    },
    otherProductKeydown: function (event) {
      if (event.keyCode === ENTER_KEY_CODE) {
        this.confirmOtherProduct();
      }
    },
    donationProductKeydown: function (event) {
      if (event.keyCode === ENTER_KEY_CODE) {
        this.confirmOtherProduct();
      }
    },
    quantityKeydown: function (event) {
      if (event.keyCode === ENTER_KEY_CODE) {
        this.confirmQuantity();
      }
    },
    back: function () {
      window.history.back()
    },
    selectProduct: async function (product) {
      this.selectedProduct = product;
      this.priceOfSelectedProduct = product.price;
      this.quantityOfSelectedProduct = product.quantity;
      if (product.info) {
        this.nameOfSelectedProduct = product.info.name;
        this.nbParticipantsOfSelectedProduct = product.info.nbParticipants;
      }
      if (product.isActivity) {
        return this.selectActivityProduct();
      }
      if (product.isOther) {
        return this.selectOtherProduct();
      }
      if (product.isDonation) {
        return this.selectDonationProduct();
      }
      this.productQuantityDialog = true;
      await this.$nextTick();
      setTimeout(() => {
        this.$refs.quantityInput.$el.querySelector("input").focus()
      })
    },
    selectActivityProduct: async function () {
      this.activityDialog = true;
      await this.$nextTick();
      setTimeout(() => {
        this.$refs.priceInput.$el.querySelector("input").focus()
      })
    },
    selectOtherProduct: async function () {
      this.otherProductDialog = true;
      await this.$nextTick();
      setTimeout(() => {
        this.$refs.priceInput.$el.querySelector("input").focus()
      })
    },
    selectDonationProduct: async function () {
      this.donationProductDialog = true;
      await this.$nextTick();
      setTimeout(() => {
        this.$refs.priceInput.$el.querySelector("input").focus()
      })
    },
    confirmDonationProduct: function (price) {
      if (!this.$refs.donationProductForm.validate()) {
        return;
      }
      this.selectedProduct.quantity = 1;
      this._confirmPriceOrQuantity(true, price);
      this.donationProductDialog = false;
    },
    confirmOtherProduct: function (price) {
      if (!this.$refs.otherProductForm.validate()) {
        return;
      }
      this.selectedProduct.info = {
        name: this.nameOfSelectedProduct
      };
      this.selectedProduct.quantity = 1;
      this._confirmPriceOrQuantity(true, price);
      this.otherProductDialog = false;
    },
    confirmActivity: function (price) {
      if (!this.$refs.activityForm.validate()) {
        return;
      }
      this.selectedProduct.info = {
        name: this.nameOfSelectedActivity,
        nbParticipants: this.nbParticipantsOfSelectedProduct
      };
      this.selectedProduct.quantity = 1;
      this._confirmPriceOrQuantity(true, price);
      this.activityDialog = false;
    },
    confirmQuantity: function (quantity) {
      this._confirmPriceOrQuantity(false, quantity);
      this.productQuantityDialog = false;
    },
    _confirmPriceOrQuantity: function (isPrice, paramValue) {
      const propertyName = isPrice ? "price" : "quantity";
      const globalValue = isPrice ? this.priceOfSelectedProduct : this.quantityOfSelectedProduct;
      let value = parseFloat(paramValue === undefined ? globalValue : paramValue);
      if (isNaN(value)) {
        value = null;
      }
      this.selectedProduct[propertyName] = value;
      const productInTransaction = this.selectedProducts.filter((product) => {
        return product.id === this.selectedProduct.id;
      });
      if (productInTransaction.length) {
        productInTransaction[propertyName] = parseFloat(this.selectedProduct[propertyName]);
        this.detailsKey = Math.random();
      } else {
        this.selectedProducts.push(this.selectedProduct);
      }
      this.updateTransactionItemsTotal();
    }
  }
  ,
  mounted: async function () {
    this.isLoading = true;
    let response = await ProductService.listAvailable();
    const products = response.data;
    products.forEach((product) => {
      if (product.isActivity || product.isOther || product.isDonation) {
        product.price = null;
      }
      if (this.categories[product.CategoryId] === undefined) {
        this.categories[product.CategoryId] = {
          name: product.category.name,
          priority: product.category.priority,
          id: product.CategoryId,
          products: []
        }
      }
      this.categories[product.CategoryId].products.push(
          product
      );
    });
    this.categories = Object.values(this.categories).sort(function (a, b) {
      return a.priority - b.priority;
    });
    this.updateTransactionItemsTotal();
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
