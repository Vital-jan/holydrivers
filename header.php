<script src="/js/nav.js" defer></script>

<div class="overlay" id="overlay"></div>

<header>
  <div class="header-top">
    <a href="/" class="logo" title="Головна сторінка">
      <img src="/img/logo.webp" alt="HolyDrivers — головна сторінка" />
    </a>

    <h1><?php echo $h1; ?></h1>
  </div>

  <nav class="nav" id="nav">
    <a href="/#intro">Про мене</a>
    <a href="/#training-programs">Для кого</a>
    <a href="/#location">Локація</a>
    <a href="/#price">Вартість</a>
    <a
      href="/reviews/"
      class="<?php echo ($page === 'reviews') ? 'active' : ''; ?>"
      >Відгуки</a
    >
    <a
      href="/program/"
      class="<?php echo ($page === 'program') ? 'active' : ''; ?>"
      >Програма</a
    >
    <a href="/#register" class="cta">Тест-драйв</a>
    <a
      href="/autoschool/"
      class="<?php echo ($page === 'autoschool') ? 'active' : ''; ?>"
      >Автошкола</a
    >
    <a
      href="/pdr/"
      class="<?php echo ($page === 'pdr') ? 'active' : ''; ?>"
      >ПДР</a
    >
    <a
      href="/exam/"
      class="<?php echo ($page === 'exam') ? 'active' : ''; ?>"
      >Іспит</a
    >
    <a
      href="/contacts/"
      class="<?php echo ($page === 'contacts') ? 'active' : ''; ?>"
      >Контакти</a
    >
  </nav>

  <div class="burger" id="burger">
    <span></span>
    <span></span>
    <span></span>
  </div>
</header>

<section class="section hero-section" id="intro">
  <h2 class="section-title">
    <span><?php echo $h2; ?></span>
    <span class="slogan-img">
      <img src="/img/slogan_transparent.webp" alt="Більше, ніж водіння" />
    </span>
  </h2>

  <?php echo $intro ?? ''; ?>
</section>  
</section>
