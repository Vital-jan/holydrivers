function hash(phone) {
  var digits = String(phone == null ? "" : phone).replace(/\D+/g, ""); // лишаємо тільки цифри
  if (!digits) return "";

  // digest (2 параметри — без вказання charset)
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    digits
  );

  // перші 8 байт = 64 біти
  var hex = "";
  for (var i = 0; i < 8; i++) {
    var b = bytes[i];
    if (b < 0) b += 256; // нормалізація байта
    hex += b.toString(16).padStart(2, "0"); // у hex
  }
  return hex;
}
