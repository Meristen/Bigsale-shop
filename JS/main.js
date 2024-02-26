// API подключения
const USERS_API = "http://localhost:8000/users";
const PRODUCTS_API = "http://localhost:8000/products";
// json-server -w db.json -p 8000

// подключения к навбару
const navLogText = document.querySelector("#nav-log-text");
const navInpSearch = document.querySelector("#nav-inp-search");
const navBtnAdd = document.querySelector("#nav-btn-add");
const navBtnReg = document.querySelector("#nav-btn-reg");
const navBtnLog = document.querySelector("#nav-btn-log");
const navBtnOut = document.querySelector("#nav-btn-out");
const loginName = document.querySelector("#login-name");

// подключения к модалке регистрации
const modalReg = document.querySelector("#modal-reg");
const modalRegP = document.querySelector("#modal-reg-p");
const formReg = document.querySelector("#form-reg");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const age = document.querySelector("#age");
const password = document.querySelector("#password");
const passwordConf = document.querySelector("#passwordConf");
const btnReg = document.querySelector("#btn-reg");

const btnCancel = document.querySelector("#cancel");

// подключения к модалке входа
const modalLog = document.querySelector("#modal-log");
const formLog = document.querySelector("#form-log");
const usernameLogin = document.querySelector("#username-login");
const passwordLogin = document.querySelector("#password-login");
const modalLogP = document.querySelector("#modal-log-p");
const btnLog = document.querySelector("#btn-log");
const btnCancelLog = document.querySelector("#cancel-log");

// подключения к модалке добавления
const modalAdd = document.querySelector("#modal-add");
const formAdd = document.querySelector("#form-add");
const title = document.querySelector("#title");
const category = document.querySelector("#category");
const price = document.querySelector("#price");
const image = document.querySelector("#image");
const modalAddP = document.querySelector("#modal-add-p");
const btnAdd = document.querySelector("#btn-add");
const cancelAdd = document.querySelector("#cancel-add");
const productsList = document.querySelector(".products");
const discAdd = document.querySelector("#discAdd");

// подключения к модалке изменения
const modalEdit = document.querySelector("#modal-edit");
const formEdit = document.querySelector("#form-edit");
const titleEdit = document.querySelector("#titleEdit");
const categoryEdit = document.querySelector("#categoryEdit");
const priceEdit = document.querySelector("#priceEdit");
const imageEdit = document.querySelector("#imageEdit");
const modalEditP = document.querySelector("#modal-edit-p");
const btnEdit = document.querySelector("#btn-edit");
const cancelEdit = document.querySelector("#cancelEdit");
const discEdit = document.querySelector("#discEdit");

//Функция проверки уникальности имени
async function checkUniqueUserName(username) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  return users.some((item) => item.username === username);
}

//Функция скрытия модалки регистрации
function hideModalReg() {
  modalReg.classList.toggle("display-none");
}

//проверка пароля на длину
password.addEventListener("input", () => {
  if (password.value.length < 6) {
    password.style.border = "3px solid red";
    password.style.borderRadius = "3px";
  } else {
    password.style.border = "3px solid green";
    password.style.borderRadius = "3px";
  }
});

//проверка подтверждения пароля
passwordConf.addEventListener("input", () => {
  if (passwordConf.value.length < 6 || password.value !== passwordConf.value) {
    passwordConf.style.border = "3px solid red";
    passwordConf.style.borderRadius = "3px";
  } else {
    passwordConf.style.border = "3px solid green";
    passwordConf.style.borderRadius = "3px";
  }
});

//отбражение модалки регистрации
navBtnReg.addEventListener("click", () => {
  modalReg.classList.toggle("display-none");
});

//Функция проверки регистрации пользователя
async function registerUser(e) {
  e.preventDefault();
  if (
    !username.value.trim() ||
    !email.value.trim() ||
    !age.value.trim() ||
    !password.value.trim() ||
    !passwordConf.value.trim()
  ) {
    modalRegP.innerText = "*Заполните все поля";
    return;
  }

  if (password.value !== passwordConf.value) {
    modalRegP.innerText = " *Пароли не совпадают";
    return;
  }

  if (password.value.length < 6) {
    modalRegP.innerText = " *Пароль должен быть не менее 6 символов";
    return;
  }

  if (await checkUniqueUserName(username.value)) {
    modalRegP.innerText = "*Имя уже занято";
    return;
  }

  const userObj = {
    username: username.value,
    email: email.value,
    age: age.value,
    isAdmin: false,
    password: password.value,
  };

  fetch(USERS_API, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  username.value = "";
  email.value = "";
  age.value = "";
  password.value = "";
  passwordConf.value = "";
  modalRegP.innerText = "";
  password.style = "none";
  passwordConf.style = "none";

  hideModalReg();
}

formReg.addEventListener("submit", registerUser);
btnCancel.addEventListener("click", hideModalReg);

//Логин

navBtnLog.addEventListener("click", () => {
  modalLog.classList.toggle("display-none");
});

function hideModalLog() {
  modalLog.classList.toggle("display-none");
}
async function checkUserPassword(username, password) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  const userObj = users.find((item) => item.username === username);
  return userObj.password === password ? true : false;
}
let admin = false;
async function loginUser(e) {
  e.preventDefault();
  if (!usernameLogin.value.trim() || !passwordLogin.value.trim()) {
    modalLogP.innerText = "Введите данные";
    return;
  }
  let account = await checkUniqueUserName(usernameLogin.value);

  if (!account) {
    modalLogP.innerText = "*Пользователь не зарегистрирован";
    return;
  }
  let logPass = await checkUserPassword(
    usernameLogin.value,
    passwordLogin.value
  );
  if (!logPass) {
    modalLogP.innerText = "*Неверный пароль";
    return;
  }

  let res = await fetch(USERS_API);
  let users = await res.json();
  const userObj = users.find(
    (item) =>
      item.username === usernameLogin.value &&
      item.password === passwordLogin.value
  );

  if (userObj) {
    admin = userObj.isAdmin;

    if (admin) {
      admin = true;
      navBtnAdd.classList.remove("display-none");
    }
    navBtnOut.classList.remove("display-none");
    navBtnLog.classList.add("display-none");
    navBtnReg.classList.add("display-none");
    loginName.innerHTML = `Привет, ${usernameLogin.value}`;
  } else {
    admin = false;
    navBtnOut.classList.add("display-none");
    navBtnLog.classList.remove("display-none");
    navBtnReg.classList.remove("display-none");
    loginName.innerHTML = `Привет, ${usernameLogin.value}`;
  }
  usernameLogin.value = "";
  passwordLogin.value = "";
  hideModalLog();
}
console.log(admin);
formLog.addEventListener("submit", loginUser);
btnCancelLog.addEventListener("click", hideModalLog);

//Логаут
navBtnOut.addEventListener("click", () => {
  admin = false;
  navBtnAdd.classList.add("display-none");
  navBtnOut.classList.toggle("display-none");
  navBtnLog.classList.toggle("display-none");
  navBtnReg.classList.toggle("display-none");
  loginName.innerHTML = "";
});

// ! CRUD
// Создание

navBtnAdd.addEventListener("click", () => {
  modalAdd.classList.toggle("display-none");
});

async function createProduct(e) {
  e.preventDefault();
  const titleValue = title.value.trim();
  const categoryValue = category.value.trim();
  const discAddValue = discAdd.value.trim();
  const imageValue = image.value.trim();
  const priceValue = price.value.trim();

  if (
    !titleValue ||
    !categoryValue ||
    !imageValue ||
    !priceValue ||
    !discAddValue
  ) {
    modalAddP.innerText = "Заполните все поля!!!";
    return;
  }

  const newProduct = {
    title: titleValue,
    category: categoryValue,
    discription: discAddValue,
    image: imageValue,
    price: priceValue,
  };

  await fetch(PRODUCTS_API, {
    method: "POST",
    body: JSON.stringify(newProduct),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  titleValue = "";
  categoryValue = "";
  imageValue = "";
  priceValue = "";
  discAddValue = "";

  render();
}

formAdd.addEventListener("submit", createProduct);

function hideModalAdd() {
  modalAdd.classList.toggle("display-none");
}
cancelAdd.addEventListener("click", hideModalAdd);

// Функция отрисовки
let search = "";

async function render() {
  const requestAPI = `${PRODUCTS_API}?title_like=${search}`;
  const res = await fetch(requestAPI);
  const data = await res.json();
  productsList.innerHTML = "";
  admin = true;
  data.forEach((card) => {
    productsList.innerHTML += `
  <div class='prodList'>
    <img id=${
      card.id
    } class='hover'  width="280px" height="280px" object-fit="contain" src="${
      card.image
    }"/>
    <div class="price"> ${card.price} €</div>
    <div class="title"><b>Наименование: ${card.title}</b></div>
    <div class="test">Категория: ${card.category}</div>
    <div id="discription"  >Описание: ${card.discription}</div>
    ${admin ? `<button id=${card.id} class='deleteBtn'>Удалить</button>` : ""}
    ${admin ? `<button id=${card.id} class='editBtn'>Изменить</button>` : ""}
    <span>Описание>></span>
  </div>
  `;
  });
}

render();
btnAdd.addEventListener("click", () => {
  modalAdd.classList.toggle("display-none");
});

// Удаление

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    await fetch(`${PRODUCTS_API}/${e.target.id}`, {
      method: "DELETE",
    });
    render();
  }
});

// Изменение
let id = null;

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("editBtn")) {
    const productId = e.target.id;
    const res = await fetch(`${PRODUCTS_API}/${productId}`);
    const data = await res.json();
    titleEdit.value = data.title;
    priceEdit.value = data.price;
    categoryEdit.value = data.category;
    discEdit.value = data.discription;
    imageEdit.value = data.image;
    id = productId;
    modalEdit.classList.toggle("display-none");
  }
});

formEdit.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (
    !titleEdit.value.trim() ||
    !priceEdit.value.trim() ||
    !categoryEdit.value.trim() ||
    !imageEdit.value.trim() ||
    !discEdit.value.trim()
  ) {
    modalEditP.innerText = "*Данные не введены";

    return;
  }

  const editedObj = {
    title: titleEdit.value,
    price: priceEdit.value,
    category: categoryEdit.value,
    discription: discEdit.value,
    image: imageEdit.value,
  };

  await fetch(`${PRODUCTS_API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  render();
  hideModalEdit();
});

function hideModalEdit() {
  modalEdit.classList.toggle("display-none");
}
cancelEdit.addEventListener("click", hideModalEdit);

// Поиск
navInpSearch.addEventListener("input", () => {
  search = navInpSearch.value;
  render();
});

//логика модалки описания
const disc = document.querySelector(".disc");
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("hover")) {
    const response = await fetch(`${PRODUCTS_API}/${e.target.id}`);
    const data = await response.json();
    disc.innerHTML = data.discription;
    disc.classList.toggle("display-none");
  }
});
