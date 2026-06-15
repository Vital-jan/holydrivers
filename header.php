<header>
  <div class="header-top">
    <a href="/" class="logo" title="Головна сторінка">
      <img src="/img/logo.png" alt="Головна сторінка" />
    </a>
    <h1><?php echo $h1;?></h1>
    <?php if ($page!="home"):?>
    <div class="home">
      <a href="/">
        <img
          src="/img/home.png"
          alt="На головну сторінку приватний автоінсруктор теремки"
        />
      </a>
    </div>
    <?php endif;?>
  </div>
  <?php if ($page==="home"): ?>
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

