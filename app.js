// SELECT ELEMENTS
const productsEl = document.querySelector(".shop");
// const manufacturersEl = document.querySelector(".item-manufacturer");
const cartItemsEl = document.querySelector(".cart-items");
const totalEl = document.querySelector(".total");
const subtotalEl = document.querySelector(".subtotal");
const totalItemsInCartEl = document.querySelector(".cartAmount");

// RENDER PRODUCTS
function renderProducts() {
  shop.forEach((product) => {
    productsEl.innerHTML += `
          <div class="item" id=product-id${product.id}>
                <div class="foodphoto">
                    <img
                    src=${product.imgSrc}
                    class="food-photo"
                    />
                    <div class="product-name-manufacturer">
                    <h1>${product.name}</h1>
                    <h2><i>${product.manufacturer}</i></h2>
                    </div>
                </div>
                <span class="description">${product.description}</span> 
                <div class="products-all">
                    <div class="product-amount">$${product.price}</div>
                    <input id=${product.id} class="quantity" min="0" type="number" value="${product.quantity}" />
                    <div class="plus-minus-buttons">
                      <i onclick="update('plus', ${product.id})" class="bi bi-plus"></i>
                      <i onclick="update('minus', ${product.id})" class="bi bi-dash"></i>
                    </div>
                      <div class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="bi bi-cart-plus-fill"></i></div>
                </div>
          </div>

        `;
  });
}
renderProducts();

let update = (action, id) => {
  let input = document.getElementById(id);
  let value = input.value;
  if (action === "minus" && value > 1) {
    value--;
  } else if (action === "plus") {
    value++;
  }
  input.value = value;
};

let basket = [];

let cart = JSON.parse(localStorage.getItem("CART")) || [];
updateCart();

//ADD TO CART
function addToCart(id) {
  let input = document.getElementById(id);
  if (cart.some((item) => item.id === id)) {
    changeNumberOfUnits("plus", id, input);
  } else {
    const item = shop.find((product) => product.id === id);

    cart.push({
      ...item,
      numberOfUnits: input.value,
    });
    // console.log(cart);
  }
  // input.value = 1;
  updateCart();
}

function updateCart() {
  renderCartItems();
  renderSubtotal();
  localStorage.setItem("CART", JSON.stringify(cart));
}

function renderSubtotal() {
  let totalPrice = 0,
    totalItems = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.numberOfUnits;
    totalItems += +item.numberOfUnits;
    console.log(totalItems);
  });

  subtotalEl.innerHTML = `Grand total: ${totalPrice.toFixed(2)}$`;
  totalItemsInCartEl.innerHTML = totalItems;
}
// function renderTotal() {
//   let totalManufacturerPrice = 0,
//     totalManufacturerItems = 0;

//   cart.forEach((item) => {
//     totalPrice += item.price * item.numberOfUnits;
//     totalItems += +item.numberOfUnits;
//     console.log(totalItems);
//   });
// }

// Object.keys(groupByManufacturer).forEach((manufacturer) => {
//   let total = "";
//   groupByManufacturer[manufacturer].forEach((item) => {
//     total += renderTotal(item);
//     totalManufacturerPrice += item.price * item.numberOfUnits;
//     totalManufacturerItems += +item.numberOfUnits;
//     // console.log(totalItems);
//   });
// });

function renderCartItems() {
  cartItemsEl.innerHTML = "";

  const groupByManufacturer = cart.reduce((group, item) => {
    const { manufacturer } = item;
    group[manufacturer] = group[manufacturer] ?? [];
    group[manufacturer].push(item);
    return group;
  }, {});
  console.log(groupByManufacturer, cart);

  function renderCartItem(item) {
    let totalPrice = item.price * item.numberOfUnits;

    return ` 
      
      <div class="cart-item">
            <label>
                <input type="radio" name="${item.name}" class="radio" />
                <div class="radio-name">${item.name}</div>
                <div class="cart-price">${totalPrice.toFixed(2)}$</div>
                <div class="units">
                  <div class="number">${item.numberOfUnits}</div>
                  <div class="plus-minus-buttons">
                    <i onclick="changeNumberOfUnits('plus', ${
                      item.id
                    })" class="bi bi-plus"></i>
                    <i onclick="changeNumberOfUnits('minus', ${
                      item.id
                    })" class="bi bi-dash"></i>
                  </div>
            </label>
                </div>
                <i onclick="removeItemFromCart(${
                  item.id
                })" class="bi bi-trash3-fill"></i>   
       </div>
             
       `;
  }

  Object.keys(groupByManufacturer).forEach((manufacturer) => {
    let renderedItems = "";
    let total = 0;
    groupByManufacturer[manufacturer].forEach((item) => {
      renderedItems += renderCartItem(item);
      total += item.price * item.numberOfUnits;

      console.log(total);
    });

    cartItemsEl.innerHTML += ` 
    <div class="item-manufacturer">
      <div class="manufacturer" id="manufacturer">${manufacturer}</div>  

      ${renderedItems}

      
              
        <div class="total">Total: ${total.toFixed(2)}</div>
      </div>
    </div>
     `;
  });
}

function removeItemFromCart(id) {
  cart = cart.filter((item) => item.id !== id);

  updateCart();
}

function changeNumberOfUnits(action, id) {
  let input = document.getElementById(id);
  let value = +input.value;

  cart = cart.map((item) => {
    let numberOfUnits = item.numberOfUnits;
    console.log(numberOfUnits);

    if (item.id === id) {
      if (action === "minus" && numberOfUnits > 1) {
        numberOfUnits--;
      } else if (action === "plus" && numberOfUnits < item.instock) {
        numberOfUnits = +numberOfUnits + value;
      }
      input.value = 1;
    }

    return {
      ...item,
      numberOfUnits,
    };
  });
  updateCart();
}
