const backendURL = 'http://localhost:5000/api'; // Cập nhật URL nếu cần

// Đăng ký khách hàng
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${backendURL}/customers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const result = await response.json();
    document.getElementById('registerResponse').innerText = JSON.stringify(result, null, 2);
  } catch (error) {
    document.getElementById('registerResponse').innerText = error.message;
  }
});

// Thêm sản phẩm vào giỏ hàng
document.getElementById('addToCartForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const customerId = document.getElementById('customerId').value;
  const productId = document.getElementById('productId').value;
  const quantity = document.getElementById('quantity').value;

  try {
    const response = await fetch(`${backendURL}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, items: [{ productId, quantity }] })
    });
    const result = await response.json();
    document.getElementById('cartResponse').innerText = JSON.stringify(result, null, 2);
  } catch (error) {
    document.getElementById('cartResponse').innerText = error.message;
  }
});

// Xem giỏ hàng
document.getElementById('viewCartForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const customerId = document.getElementById('viewCustomerId').value;

  try {
    const response = await fetch(`${backendURL}/cart/${customerId}`);
    const result = await response.json();
    document.getElementById('cartContent').innerText = JSON.stringify(result, null, 2);
  } catch (error) {
    document.getElementById('cartContent').innerText = error.message;
  }
});
