const cart = [];
  const rupiah = value => 'Rp ' + Number(value).toLocaleString('id-ID');
  const toast = (message) => {
    const box = document.getElementById('toastCart');
    document.getElementById('toastMessage').textContent = message;
    box.style.display = 'block';
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => box.style.display = 'none', 2600);
  };
  document.querySelectorAll('.add-cart').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.product-card');
      const item = {name:card.dataset.name, price:Number(card.dataset.price), img:card.dataset.img};
      const found = cart.find(product => product.name === item.name);
      if (found) found.qty++; else cart.push({...item, qty:1});
      updateCart();
      toast(item.name + ' ditambahkan ke keranjang.');
    });
  });
  function updateCart() {
    const count = cart.reduce((sum,item) => sum + item.qty, 0);
    const total = cart.reduce((sum,item) => sum + item.price * item.qty, 0);
    document.getElementById('cartCount').textContent = count;
    document.getElementById('cartTotal').textContent = rupiah(total);
    document.getElementById('mobileCartCount').textContent = count;
    document.getElementById('mobileCartTotal').textContent = rupiah(total);
    const mobileList = document.getElementById('mobileMiniCart');
    if (!cart.length) mobileList.innerHTML = '<div class="mini-empty">Keranjang kamu masih kosong.</div>';
    else mobileList.innerHTML = cart.map(item => `<div class="mini-row"><img class="mini-thumb" src="${item.img}" alt=""><div class="flex-grow-1"><div class="name">${item.name}</div><div class="price">${item.qty} × ${rupiah(item.price)}</div></div></div>`).join('');
    const list = document.getElementById('miniCartItems');
    if (!cart.length) {
      list.innerHTML = '<div class="mini-empty"><i class="fa-solid fa-basket-shopping fs-4 d-block mb-2"></i>Keranjang kamu masih kosong.</div>';
      return;
    }
    list.innerHTML = cart.map(item => `<div class="mini-row"><img class="mini-thumb" src="${item.img}" alt=""><div class="flex-grow-1"><div class="name">${item.name}</div><div class="price">${item.qty} × ${rupiah(item.price)}</div></div><button class="btn btn-sm btn-light text-danger remove-item" data-name="${item.name}" aria-label="Hapus"><i class="fa-solid fa-trash"></i></button></div>`).join('');
    list.querySelectorAll('.remove-item').forEach(btn => btn.addEventListener('click', () => {
      const index = cart.findIndex(item => item.name === btn.dataset.name);
      if (index >= 0) cart.splice(index,1);
      updateCart();
    }));
  }

  document.getElementById('mobileSearchForm').addEventListener('submit', event => {
    event.preventDefault();
    const query = document.getElementById('mobileSearchInput').value.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll('.product-card').forEach(card => {
      const match = card.dataset.name.toLowerCase().includes(query);
      card.style.display = match || !query ? '' : 'none';
      if (match || !query) visible++;
    });
    document.getElementById('produk').scrollIntoView({behavior:'smooth'});
    if (query && !visible) toast('Produk "' + query + '" belum ditemukan.');
  });

  document.getElementById('searchForm').addEventListener('submit', event => {
    event.preventDefault();
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll('.product-card').forEach(card => {
      const match = card.dataset.name.toLowerCase().includes(query);
      card.style.display = match || !query ? '' : 'none';
      if (match || !query) visible++;
    });
    document.getElementById('produk').scrollIntoView({behavior:'smooth'});
    if (query && !visible) toast('Produk "' + query + '" belum ditemukan.');
  });
  function useLocation() {
    const input = document.getElementById('pickup');
    if (!navigator.geolocation) { input.focus(); toast('Browser tidak mendukung lokasi otomatis.'); return; }
    input.placeholder = 'Mengambil lokasi...';
    navigator.geolocation.getCurrentPosition(position => {
      input.value = position.coords.latitude.toFixed(6) + ', ' + position.coords.longitude.toFixed(6);
      input.placeholder = 'Lokasi jemput';
      toast('Koordinat lokasi berhasil diambil.');
    }, () => {
      input.placeholder = 'Masukkan alamat jemput secara manual';
      toast('Lokasi tidak diizinkan. Silakan masukkan alamat manual.');
    });
  }
  function swapAddress() {
    const pickup = document.getElementById('pickup');
    const destination = document.getElementById('destination');
    [pickup.value, destination.value] = [destination.value, pickup.value];
  }
  function addNote() {
    const note = document.getElementById('orderNote');
    note.classList.toggle('d-none');
    if (!note.classList.contains('d-none')) note.focus();
  }
  document.getElementById('orderForm').addEventListener('submit', event => {
    event.preventDefault();
    toast('Form pesanan siap. Sambungkan ke backend untuk memproses pesanan.');
  });
  // Countdown demo: mulai dari 1 jam 36 menit 36 detik.
  let remaining = 1*3600 + 36*60 + 36;
  setInterval(() => {
    if (remaining > 0) remaining--;
    const h = String(Math.floor(remaining/3600)).padStart(2,'0');
    const m = String(Math.floor((remaining%3600)/60)).padStart(2,'0');
    const s = String(remaining%60).padStart(2,'0');
    document.getElementById('countdown').textContent = `${h}:${m}:${s}`;
  },1000);

  const popupLokasi = document.getElementById('popupLokasi');
const inputLokasi = document.getElementById('inputLokasi');
const teksLokasi = document.querySelector('.location-line');

function bukaLokasi() {
    const lokasiTersimpan = localStorage.getItem('lokasiPengiriman') || '';
    inputLokasi.value = lokasiTersimpan;
    popupLokasi.classList.add('active');
    setTimeout(() => inputLokasi.focus(), 100);
}

function tutupLokasi() {
    popupLokasi.classList.remove('active');
}

function simpanLokasi() {
    const lokasi = inputLokasi.value.trim();

    if (!lokasi) {
        alert('Masukkan kota atau kecamatan tujuan pengiriman!');
        inputLokasi.focus();
        return;
    }

    localStorage.setItem('lokasiPengiriman', lokasi);
    teksLokasi.innerHTML = `<i class="fa-solid fa-location-dot me-1"></i>Dikirim ke : <a href="javascript:void(0)" onclick="bukaLokasi()">${lokasi.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}</a>`;

    tutupLokasi();
}

popupLokasi.addEventListener('click', function(e) {
    if (e.target === popupLokasi) tutupLokasi();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') tutupLokasi();
});

document.addEventListener('DOMContentLoaded', function() {
    const lokasi = localStorage.getItem('lokasiPengiriman');

    if (lokasi) {
        teksLokasi.innerHTML = `<i class="fa-solid fa-location-dot me-1"></i>Dikirim ke : <a href="javascript:void(0)" onclick="bukaLokasi()">${lokasi.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}</a>`;
    }
});