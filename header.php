<script src="/js/nav.js" defer></script>

<div class="overlay" id="overlay"></div>

<header>
  <div class="header-top">
    <!-- <a href="javascript:history.back()" class="logo" title="Головна сторінка"> -->
    <a href="/" class="logo" title="Головна сторінка">
      <img src="/img/logo.webp" alt="Головна сторінка" />
    </a>
    <h1><?php echo $h1;?></h1>
    <!-- <?php if ($page!="home"):?>
    <div class="home">
      <a href="javascript:history.back()">
        <img
          src="/img/home.webp"
          alt="На головну сторінку приватний автоінсруктор теремки"
        />
      </a>
    </div>
    <?php endif;?> -->
  </div>
  <?php if (0===0): ?>
  <nav class="nav" id="nav">
    <a href="/#intro">Про мене</a>
    <a href="/#training-programs">Для кого</a>
    <a href="/#location">Локація</a>
    <a href="/#price">Вартість</a>
    <a href="/#register" class="cta">Тест-драйв</a>
    <a href="/program/">Програма</a>
    <a href="/reviews/">Відгуки</a>
    <a href="/contacts/">Контакти</a>
  </nav>
  <div class="burger" id="burger">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <?php endif;?>
</header>
<section class="section hero-section" id="intro">
  <h2 class="section-title">
    <span><?php echo $h2;?></span>
    <div class="slogan-img">
      <img src="/img/slogan_transparent.webp" alt="" />
    </div>
  </h2>
  <?php echo $intro; ?>
</section>
