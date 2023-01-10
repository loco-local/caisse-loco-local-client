<template>
  <v-overlay :value="isAppIdle" v-if="isAppIdle" z-index="999999" v-breathing-colors="locoColors">
    <v-card>
      <v-card-text>
        <v-carousel v-model="imageIndex" width="100%" height="100%" :show-arrows="false"  hide-delimiters interval="6000" :cycle="true">
          <v-carousel-item
              v-for="(image, i) in images"
              :key="i"
              transition="fade-transition"
          >
            <div>
              <v-img :src="getImgUrl(image)">
                <template v-slot:placeholder>
                  <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                  >
                    <v-progress-circular
                        indeterminate
                        color="secondary"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script>
import BreathingColors from "@/BreathingColors";

export default {
  name: "ScreenSaver",
  data: function () {
    return {
      imageIndex: 0,
      locoColors: BreathingColors.buildLocoColors(),
      images: [
        {
          isLoaded: false,
          src: "2021_distributionarbresmai.jpg"
        },
        {
          isLoaded: false,
          src: "2022-08Babyfoot.jpg"
        },
        {
          isLoaded: false,
          src: "2022-08showMomo1.jpg"
        },
        {
          isLoaded: false,
          src: "2022_Loco de haut.JPG"
        },
        {
          isLoaded: false,
          src: "2022_PartageHeure_ateliervelo2.jpg"
        },
        {
          isLoaded: false,
          src: "FB_IMG_1664380818508.jpg"
        },
        {
          isLoaded: false,
          src: "FB_IMG_1664380839215.jpg"
        }
      ]
    }
  },
  mounted: function () {
    this.locoColors = BreathingColors.buildLocoColors();
    this.shuffleImages();
  },
  methods: {
    getImgUrl(image) {
      return require('@/assets/screensaver/' + image.src)
    },
    shuffleImages: function(){
      for (let i = this.images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.images[i], this.images[j]] = [this.images[j], this.images[i]];
      }
    }
  },
  watch:{
    isAppIdle: function(){
      if(this.isAppIdle === false){
        this.shuffleImages();
      }
    }
  }
}
</script>

<style scoped>

</style>
