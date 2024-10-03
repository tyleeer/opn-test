export class Cart {
  constructor() {
    this.products = [];
    this.discounts = [];
    this.totalPrice = 0;
  }

  addProduct(productId, quantity = 1, price = 0, isUnique = false) {
    const existingProduct = this.products.find(
      (item) => item.productId == productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      this.products.push({ productId, quantity, price, isUnique });
    }
  }

  removeProduct(productId) {
    const productIndex = this.products.findIndex(
      (item) => item.productId == productId
    );

    if (productIndex == -1) {
      console.log("Product not found!");
      return;
    }

    this.products.splice(productIndex, 1);
  }

  destroyCart() {
    this.products = [];
    this.discounts = [];
    this.totalPrice = 0;
  }

  checkProduct(productId) {
    const product = this.products.find((item) => item.productId == productId);

    if (!product) {
      return { message: "Product not found." };
    }

    return { message: "Product was found!", product };
  }

  checkEmptyCart() {
    const productCount = this.products.length;

    return {
      message:
        productCount == 0
          ? "Cart is empty!"
          : `Found ${productCount} product${
              productCount == 1 ? "" : "s"
            } in cart.`,
    };
  }

  getListProducts() {
    return this.products;
  }

  countUniqueProducts() {
    const uniqueProducts = this.products.filter((product) => product.isUnique);
    const uniqueCount = uniqueProducts.length;

    return {
      message:
        uniqueCount == 0
          ? "Unique product not found!"
          : `Found ${uniqueCount} unique product${
              uniqueCount == 1 ? "" : "s"
            } in cart.`,
    };
  }

  getTotalPrice() {
    let total = this.products.reduce(
      (sum, product) => sum + product.quantity * product.price,
      0
    );

    this.discounts.forEach((discount) => {
      if (discount.type == "fixed") {
        total -= discount.value;
      } else if (discount.type == "percentage") {
        const discountAmount = (total * discount.value) / 100;
        total -= discount.maxAmount
          ? Math.min(discountAmount, discount.maxAmount)
          : discountAmount;
      }
    });

    this.totalPrice = Math.max(total, 0);
    return {
      message: `The total amount of products is ${this.totalPrice.toLocaleString()}$`,
    };
  }

  applyDiscount(name, type, value, maxAmount = null) {
    this.discounts.push({ name, type, value, maxAmount });
  }

  removeDiscount(name) {
    this.discounts = this.discounts.filter((discount) => discount.name != name);
  }

  applyFreebie(productId, freebieId) {
    const hasProduct = this.products.some(
      (product) => !product.isUnique && product.productId == productId
    );

    if (hasProduct) {
      const freebie = this.products.find(
        (product) => product.productId == freebieId
      );

      if (freebie) {
        freebie.quantity++;
      } else {
        this.addProduct(freebieId, 1, 0, true);
      }
    }
  }
}
