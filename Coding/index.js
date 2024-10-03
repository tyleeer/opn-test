import { Cart } from "./cartService.js";

const cart = new Cart();

console.log(cart.checkEmptyCart());

cart.addProduct(1, 5, 100); // productId: 1, quantity: 5, price: 100
cart.addProduct(2, 2, 500); // productId: 2, quantity: 2, price: 500
console.log(cart.getListProducts());
cart.addProduct(2, 2, 500); // productId: 2, quantity: 2, price: 500

console.log(cart.checkProduct(2));

console.log(cart.getListProducts());
console.log(cart.getTotalPrice());

cart.removeProduct(1); // remove productId == 1
console.log(cart.checkProduct(1));

console.log(cart.getListProducts());
console.log(cart.getTotalPrice());

cart.addProduct(1, 5, 100); // productId: 1, quantity: 5, price: 100
cart.addProduct(2, 5, 500); // productId: 2, quantity: 2, price: 500
cart.addProduct(3, 1, 800); // productId: 2, quantity: 2, price: 500

console.log(cart.getTotalPrice());
cart.applyDiscount("10%", "percentage", 10, 200);
console.log(cart.getTotalPrice());
cart.removeDiscount("10%");
console.log(cart.getTotalPrice());

console.log(cart.getTotalPrice());
cart.applyDiscount("10%", "percentage", 10, 500);
console.log(cart.getTotalPrice());
cart.removeDiscount("10%");
console.log(cart.getTotalPrice());

console.log(cart.countUniqueProducts());
cart.applyFreebie(3, 4);
console.log(cart.getListProducts());
console.log(cart.countUniqueProducts());
cart.applyFreebie(4, 5);
console.log(cart.getListProducts());

cart.applyFreebie(3, 4);
console.log(cart.getListProducts());

cart.destroyCart();
console.log(cart.getListProducts());
