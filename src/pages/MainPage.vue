<template>
  <NavBar />
  <div id="start">
  <div class="__container" >
    <StartView />
    <Sessions style="margin-top: 150px"/>
    <ActivityDirections />
    <SocialProjects class="distance"/>
  </div>
    <Feedback class="distance" id="feedback"/>
  <div class="__container">
    <About class="distance" id="about"/>
    <Contacts class="distance" id="contacts"/>
  </div>
  </div>
</template>

<script>
import StartView from "@/components/MainPage/StartView.vue";
import NavBar from "@/components/MainPage/NavBar.vue";
import Sessions from "@/components/MainPage/Sessions.vue";
import About from "@/components/MainPage/About.vue";
import Contacts from "@/components/MainPage/Contacts.vue";
import Feedback from "@/components/MainPage/Feedback.vue";
import SocialProjects from "@/components/MainPage/SocialProjects.vue";
import ActivityDirections from "@/components/MainPage/ActivityDirections.vue";

export default {
  components: {
    Feedback, 
    Contacts, 
    About, 
    Sessions, 
    StartView, 
    NavBar,
    ActivityDirections,
    SocialProjects,
  }
}
</script>

<style lang="scss">
body{
  background: #162831 !important;
}

.__container{
  margin: 0 auto;
  width: 1300px;
}
.distance{
  margin-top: 0px;
}
@media (max-width: 1300px) {
  .__container{
    width: 1000px;
  }
}
@media (max-width: 1023px) {
  .__container{
    width: 100%;
    padding: 0 20px;
  }
}
</style>