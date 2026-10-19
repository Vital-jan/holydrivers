<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="geo.region" content="UA-30" />
  <meta name="geo.placename" content="Kyiv" />
  <title><?php echo $title;?></title>
  <meta name="description" content="<?php echo $description;?>" />
  <meta name="robots" content="<?php echo $robots;?>" />
  <link rel="canonical" href="<?php echo $canonical;?>" />
  <link rel="stylesheet" href="/css/styles.css?v=6.0" />
  <link rel="icon" href="/favicon.ico" />
  <!-- Google tag (gtag.js) -->

<!-- Google Analytics + Google Ads: відкладене завантаження -->
<script>
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }

  function loadGoogleTags() {
    if (window.googleTagsLoaded) return;
    window.googleTagsLoaded = true;

    const script = document.createElement("script");
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=G-N7Y08PKZ4P";
    script.async = true;
    document.head.appendChild(script);

    gtag("js", new Date());
    gtag("config", "G-N7Y08PKZ4P");
    gtag("config", "AW-17507774985");
  }

window.addEventListener("load", function () {
  setTimeout(loadGoogleTags, 5000);
});</script>

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "HolyDrivers — автоінструктор Київ",
      "telephone": "+380632209770",
      "url": "https://holydrivers.com.ua",
      "image": "https://holydrivers.com.ua/img/vital.webp",

      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 50.38570166076134,
        "longitude": 30.46478151128239
      },

      "areaServed": [
        "Київ",
        "Теремки",
        "Голосіїв",
        "Деміївка",
        "Солом'янка",
        "Феофанія",
        "Чабани",
        "Гатне"
      ],

      "sameAs": [
        "https://t.me/holydrivers_ua",
        "https://youtube.com/@HolyDrivers",
        "https://fb.com/holydrivers",
        "https://www.tiktok.com/@holydrivers"
      ]
    }
  </script>
</head>
