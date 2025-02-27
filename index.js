let index = 0;

//Carousel controller
document.addEventListener("DOMContentLoaded", () => {
    const slide = document.querySelector(".product-slide");
    const images = document.querySelectorAll(".product-slide img");
    const prevBtn = document.querySelector(".previous");
    const nextBtn = document.querySelector(".next");


    let imgwidth = 0;
    let resizing = false;

    function updateSlide() {
        slide.style.transform = `translateX(${-index * imgwidth}px)`;
    }

    function resizeHandler() {
        slide.style.transition = "none";
        imgwidth = slide.clientWidth;
        updateSlide();
    }

    function calculateWidth() {
        imgwidth = images[0].clientWidth;
        //        console.log(imgwidth);
        updateSlide();
    }

    nextBtn.addEventListener("click", () => {
        if (index < images.length - 1) {
            slide.style.transition = "transform 0.3s ease-in-out";
            index++;
            updateSlide();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (index > 0) {
            slide.style.transition = "transform 0.3s ease-in-out";
            index--;
            updateSlide();
        }
    });

    window.addEventListener("resize", resizeHandler);

    window.addEventListener("load", calculateWidth);
});

const menuIcon = document.querySelector("img[alt='menu icon']");
const closeIcon = document.querySelector("nav img[alt='close menu icon']");
const overlay = document.querySelector(".overlay");
const navigation = document.querySelector("header nav");

const cartContainer = document.querySelector(".cart-container");
const cartIcon = document.querySelector("img[alt='cart icon']");
const badge = document.querySelector(".badge");
const basketCard = document.querySelector(".basket-card");
const cartListEl = document.querySelector(".cart-list");
const emptyEl = document.querySelector(".empty");
const checkoutBtn = document.getElementById("checkout");

const quantityInput = document.getElementById("quantity");
const minusEl = document.getElementById("minus");
const plusEl = document.getElementById("plus");
const addToCartBtn = document.getElementById("add-to-cart");

const slideEl = document.querySelector(".product-slide");
const thumbnailEl = document.querySelector(".thumbnail-container");
const closeLightBoxIcon = document.querySelector(".light-box img");

let productPrice = document.querySelector(".price ins").textContent;

const secondSlideEl = document.querySelector(".light-box .product-slide");
const secondThumbnailEl = document.querySelector(".light-box .thumbnail-container");


menuIcon.addEventListener("click", () => {
    navigation.classList.remove("hide-nav");
    overlay.classList.remove("hide");
});

closeIcon.addEventListener("click", () => {
    navigation.classList.add("hide-nav");
    overlay.classList.add("hide");
});

cartContainer.addEventListener("click", () => {
    basketCard.classList.toggle("hide");
});

minusEl.addEventListener("click", () => {
    updateQuantityInput("-");
});

plusEl.addEventListener("click", () => {
    updateQuantityInput("+");
});

addToCartBtn.addEventListener("click", () => {
    if (!Number(quantityInput.value)) return;
    const quantity = quantityInput.value;
    updateCartList();
    addItemToCart(quantity);
});

thumbnailEl.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "img") {
        const selectedThumbnail = event.target;
        deselectAllThumbnail();
        selectedThumbnail.classList.add("thumbnail-selected");
        setProductSlideImage(selectedThumbnail.src);
    }
});

secondThumbnailEl.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "img") {
        const selectedThumbnail = event.target;

        for (const image of Object.values(secondThumbnailEl.children)) {
            image.classList.remove("thumbnail-selected");
        }

        selectedThumbnail.classList.add("thumbnail-selected");

        const indexc = selectedThumbnail.src.match(/-(\d+)-/);
        index = Number(indexc[1]) - 1;
        const imgWidth = secondSlideEl.children[0].clientWidth;
        //Update slide
        secondSlideEl.style.transform = `translateX(${-index * imgWidth}px)`;
    }
});

slideEl.addEventListener("click", (event) => {
    if (window.innerWidth < 1024) return;
    document.querySelector(".light-box").classList.toggle("hide");

    for (const image of Object.values(secondThumbnailEl.children)) {
        image.classList.remove("thumbnail-selected");
    }

    const numberToChange = event.target.src.match(/-(\d+)/);

    for (const image of Object.values(secondThumbnailEl.children)) {
        if (image.src.includes(numberToChange[0])) {
            image.classList.add("thumbnail-selected");
            break;
        }
    }

    const imgWidth = secondSlideEl.children[0].clientWidth;
    secondSlideEl.style.transform = `translateX(${-index * imgWidth}px)`;
});

closeLightBoxIcon.addEventListener("click", () => {
    document.querySelector(".light-box").classList.add("hide");

});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
        deselectAllThumbnail();
    }

    for (const image of Object.values(thumbnailEl.children)) {
        if (image.src.includes(`-${index + 1}-`)) {
            deselectAllThumbnail();
            image.classList.add("thumbnail-selected");
            return;
        }
    }
});

function setProductSlideImage(selectedVal) {
    const indexc = selectedVal.match(/-(\d+)-/);
    index = Number(indexc[1]) - 1;
    const imgWidth = slideEl.children[0].clientWidth;
    //Update slide
    slideEl.style.transform = `translateX(${-index * imgWidth}px)`;
}

function deselectAllThumbnail() {
    for (const image of Object.values(thumbnailEl.children)) {
        image.classList.remove("thumbnail-selected");
    }
}

function updateQuantityInput(clickedIcon) {
    let quantity = Number(quantityInput.value);
    if (clickedIcon === "+") {
        quantity++;
        quantityInput.value = quantity;
    }
    if (clickedIcon === "-") {
        if (!quantity) return;
        quantity--;
        quantityInput.value = quantity;
    }
}

function itemsTotalQuantity() {
    const items = cartListEl.children;
    let totalQuantity = 0;
    for (const item of Object.values(items)) {
        totalQuantity += Number(item.querySelector("span").textContent);
    }
    return totalQuantity;
}

function updateCartList() {
    if (cartListEl.children[0].textContent === `Your cart is empty`) {
        cartListEl.innerHTML = '';
        return;
    }
}

function updateBadge() {
    if (cartListEl.children.length) {
        badge.classList.remove("hide");
        badge.innerHTML = itemsTotalQuantity();
        return;
    }

    badge.classList.add("hide");
}

function removeItem(event) {
    const trashIcon = event.target;
    const parentEl = trashIcon.parentElement;
    parentEl.remove();
    updateBadge();
    if (!cartListEl.children.length) {
        cartListEl.innerHTML += `<div class="empty">Your cart is empty</div>`;
        checkoutDisplay(false);
    }
}

function addItemToCart(quantityVal) {
    const total = Number(productPrice.slice(1)) * Number(quantityVal);
    const formatedTotel = new Intl.NumberFormat('en-US').format(total);
    cartListEl.innerHTML += `<div class="cart-item">
                    <img class="thumbail" src="./images/image-product-1-thumbnail.jpg" alt="product thumbnail">
                    <p>Fall Limited Edition Sneakers<br>${productPrice} x <span class="item-quantity">${quantityVal}</span>&nbsp;&nbsp;&nbsp;&nbsp;<strong>$${formatedTotel}.00</strong></p>
                    <img src="./images/icon-delete.svg" alt="trash icon" onclick="removeItem(event)">
                </div>`;
    updateBadge();
    checkoutDisplay(true);
    basketCard.append(checkoutBtn);
}

function checkoutDisplay(bool) {
    if (bool) {
        checkoutBtn.classList.remove("hide");
    } else {
        checkoutBtn.classList.add("hide");
    }
}

function initialisation() {
    thumbnailEl.children[0].classList.add("thumbnail-selected");
}

initialisation();
