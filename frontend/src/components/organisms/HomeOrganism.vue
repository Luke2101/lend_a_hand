<script setup lang="ts">
import InfoCardMolecule from "@/components/molecules/InfoCardMolecule.vue";
import TestimonialCardMolecule from "@/components/molecules/TestimonialCardMolecule.vue";

// Daten für die Feature-Karten
const featureCards = [
  {
    icon: 'pi pi-wrench',
    title: 'Gegenstände leihen',
    text: 'Brauchst du eine Bohrmaschine oder eine Leiter? Frag in deiner direkten Nähe nach, statt neu zu kaufen.',
    animation: 'animate-enter fade-in-10 slide-in-from-t-20 animate-duration-1000'
  },
  {
    icon: 'pi pi-users',
    title: 'Nachbarschaftshilfe',
    text: 'Finde Hilfe beim Aufbauen von Möbeln, Blumengießen im Urlaub oder Gassigehen für deinen Hund.',
    animation: 'animate-enter fade-in-10 slide-in-from-b-20 animate-duration-1000'
  },
  {
    icon: 'pi pi-heart',
    title: 'Community stärken',
    text: 'Baue ein starkes, hilfsbereites Netzwerk in deiner Straße auf – kostenfrei und freundlich.',
    animation: 'animate-enter fade-in-10 slide-in-from-t-20 animate-duration-1000'
  }
];

// Daten für die Testimonial-Karten
const testimonialCards = [
  {
    avatarUrl: 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png',
    name: 'Laura S.',
    quote: 'Ich konnte meine Küchenmaschine verleihen und habe im Gegenzug Hilfe beim Umzug bekommen. Genial!',
    animation: 'animate-enter fade-in-10 slide-in-from-l-8 animate-duration-1000'
  },
  {
    avatarUrl: 'https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png',
    name: 'Marko P.',
    quote: 'Die Bohrmaschine brauche ich nur einmal im Jahr. Jetzt weiß ich, wen ich fragen kann. Super unkompliziert.',
    animation: 'animate-enter fade-in-10 animate-duration-1000'
  },
  {
    avatarUrl: 'https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png',
    name: 'Sarah T.',
    quote: 'Es ist schön zu wissen, dass man im Notfall nicht alleine ist. Die Community ist wirklich toll hier!',
    animation: 'animate-enter fade-in-10 slide-in-from-r-8 animate-duration-1000'
  }
];

// Daten für die Statistik-Karten (isPrimary = true für den farbigen Hintergrund)
const statisticCards = [
  {
    numberText: '5.000+',
    title: 'Nachbarn aktiv',
    text: 'Die Gemeinschaft wächst täglich. Werde jetzt Mitglied und finde sofort Helfer in deiner Nähe.',
    isPrimary: true,
    animation: 'animate-enter fade-in-10 slide-in-from-t-20 animate-duration-1000'
  },
  {
    numberText: '85%',
    title: 'Erfolgsquote',
    text: 'Die meisten Anfragen werden innerhalb weniger Stunden beantwortet. Deine Hilfe ist nah.',
    isPrimary: true,
    animation: 'animate-enter fade-in-10 slide-in-from-b-20 animate-duration-1000'
  },
  {
    numberText: '0€',
    title: 'Kostenlos',
    text: 'Die Nachbarschaftshilfe ist und bleibt kostenfrei. Wir bauen auf Freundlichkeit und Vertrauen.',
    isPrimary: true,
    animation: 'animate-enter fade-in-10 slide-in-from-t-20 animate-duration-1000'
  }
];
</script>

<template>
  <div class="card flex flex-col items-center overflow-hidden" style="width: 80%; max-width: 1200px; margin: 0 auto">

    <div class="flex flex-col items-center gap-2 mb-20 mt-10">
      <h1 class="text-4xl font-extrabold text-center">lendAhand - Deine Nachbarschaftshilfe</h1>
      <p class="text-xl text-muted-color text-center max-w-2xl">Bohrmaschine, helfende Hand oder Kuchenrezept – frag deine Nachbarn, bevor du kaufst oder verzweifelst.</p>
      <span class="text-xl font-medium mt-8">Mehr erfahren</span>
      <span class="animate-bounce h-8 w-8 bg-primary text-primary-contrast rounded-full inline-flex items-center justify-center">
        <i class="pi pi-arrow-down" />
      </span>
    </div>

    <div class="mb-20">
      <h2 class="text-3xl font-bold mb-8 text-center">Wie wir helfen</h2>
      <div class="flex flex-wrap justify-center gap-8">
        <InfoCardMolecule
            v-for="(card, index) in featureCards"
            :key="'feature-' + index"
            :icon="card.icon"
            :title="card.title"
            :text="card.text"
            :enterClass="card.animation"
        />
      </div>
    </div>

    <div class="mb-20">
      <h2 class="text-3xl font-bold mb-8 text-center">Was unsere Nachbarn sagen</h2>
      <div class="flex flex-wrap justify-center gap-8">
        <TestimonialCardMolecule
            v-for="(card, index) in testimonialCards"
            :key="'testimonial-' + index"
            :avatarUrl="card.avatarUrl"
            :name="card.name"
            :quote="card.quote"
            :enterClass="card.animation"
        />
      </div>
    </div>


    <div class="mb-20">
      <h2 class="text-3xl font-bold mb-8 text-center">Werde Teil der Bewegung</h2>
      <div class="flex flex-wrap justify-center gap-8">
        <InfoCardMolecule
            v-for="(card, index) in statisticCards"
            :key="'stat-' + index"
            :numberText="card.numberText"
            :title="card.title"
            :text="card.text"
            :isPrimary="card.isPrimary"
            :enterClass="card.animation"
        />
      </div>
    </div>

  </div>
</template>