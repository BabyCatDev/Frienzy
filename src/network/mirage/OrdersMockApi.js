import { Response } from "miragejs";
import { Colors } from "../../utils/AppConstants";
import moment from "moment";
import {
  FETCH_COMPONENTS_ENDPOINT,
  FETCH_PRODUCTS_ENDPOINT,
  FETCH_CATALOG_ENDPOINT,
  FETCH_ORDERS_ENDPOINT,
  FETCH_STORES_ENDPOINT,
  FETCH_FLORISTS_ENDPOINT,
  FETCH_COURIERS_ENDPOINT,
} from "../Constants";

const productNames = [
  "Набор сладких роз",
  "Набор роз",
  "Набор роз с шоколадом",
  "Набор роз с шоколадом и вином",
  "Винный набор",
  "Осенний набор",
  "Эксклюзивный набор",
  "Детский набор",
  "Набор для мужчины",
  "Букет для мужчины",
  "Букет для женщины",
  "Букет для девушки",
  "Букет для подруги",
  "Букет для мамы",
  "Букет для папы",
];

const mockCatalogIds = [
  "a1",
  "a1.1",
  "a1.2",
  "a1.3",
  "a2",
  "a3",
  "a3.1",
  "a3.2",
  "a3.3",
];

const mockCatalogRepsonse = [
  { id: "a0", title: "Витрина", children: [] },
  {
    id: "a1",
    title: "Каталог",
    children: [
      { id: "a1.1", title: "Сборные букеты", children: [] },
      { id: "a1.2", title: "Букет из роз", children: [] },
      { id: "a1.3", title: "Коробки", children: [] },
    ],
  },
  { id: "a2", title: "Доп. товары", children: [] },
  {
    id: "a3",
    title: "Составляющие",
    children: [
      { id: "a3.1", title: "Цветы и зелень", children: [] },
      { id: "a3.2", title: "Прочие", children: [] },
      { id: "a3.3", title: "Услуги", children: [] },
    ],
  },
];

const ingridientNames = [
  "Роза",
  "Листья",
  "Куст",
  "Кустик",
  "Одуванчик",
  "Подснежник",
  "Ромашка",
  "Тюльпан",
  "Гвоздика",
  "Гортензия",
  "Георгина",
  "Гладиолус",
  "Гербера",
  "Гиацинт",
  "Греция",
  "Грозовик",
  "Гуава",
  "Дафния",
  "Дельфиниум",
  "Диана",
  "Дикий ромашка",
  "Дикий тюльпан",
  "Дикий цветок",
  "Дикий шалфей",
  "Дикий шиповник",
];

const flowersPiuctures = [
  "https://images.unsplash.com/photo-1635684034926-65ae5b4ad720?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1613539246066-78db6ec4ff0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1435783459217-ee7fe5414abe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1436891436013-5965265af5fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
];

const tagNames = [
  "Недоступен",
  "Новинка",
  "Скидка",
  "Хит",
  "Лучшее",
  "Популярное",
  "Рекомендуемое",
  "Самое популярное",
  "Самое лучшее",
  "Самое рекомендуемое",
  "Самое хитовое",
  "Самое новое",
  "Самое скидочное",
  "Самое дешевое",
  "Самое дорогое",
  "Самое красивое",
  "Самое крутое",
];
const peopleNames = [
  "Александр",
  "Алексей",
  "Анатолий",
  "Андрей",
  "Антон",
  "Аркадий",
  "Арсений",
  "Артем",
  "Артур",
  "Богдан",
  "Борис",
  "Вадим",
  "Валентин",
  "Валерий",
  "Василий",
  "Виктор",
  "Виталий",
  "Адольф",
  "Мария",
  "Анна",
  "Александра",
  "Полина",
  "Алина",
  "Алёна",
  "Алиса",
  "Алла",
  "Альбина",
  "Альберта",
  "Альфия",
  "Анастасия",
  "Ангелина",
  "Анжелика",
  "Анисья",
  "Антонина",
  "Анфиса",
  "Арина",
  "Арсения",
  "Ася",
  "Беата",
  "Белла",
  "Богдана",
  "Божена",
  "Болеслава",
  "Борислава",
  "Валентина",
  "Валерия",
  "Варвара",
  "Василиса",
  "Василина",
  "Василиса",
];

const peopleSurnames = [
  "Иванова",
  "Петров",
  "Сидорова",
  "Смирнов",
  "Кузнецова",
  "Попов",
  "Васильева",
  "Павлов",
  "Романова",
  "Сергеев",
  "Козлова",
  "Новиков",
  "Лебедева",
  "Егоров",
  "Петухова",
  "Морозов",
  "Волкова",
  "Алексеев",
  "Лебедева",
  "Семенов",
  "Ефимова",
  "Денисов",
  "Григорьева",
  "Воробьев",
  "Федорова",
  "Михайлов",
  "Борисова",
  "Макаров",
  "Андреева",
  "Комаров",
  "Николаева",
  "Антонов",
  "Тарасова",
  "Кудрявцев",
  "Беляева",
  "Кузьмин",
  "Степанова",
  "Яковлев",
  "Сорокина",
  "Соловьев",
  "Якушева",
  "Ковалев",
  "Полякова",
  "Зайцев",
  "Захарова",
  "Богданов",
  "Виноградова",
  "Воронин",
  "Максимова",
];

export const mockUsers = [];
export const mockFlorists = [];
export const mockCouriers = [];

let mockComponents = [];
export let originComponents = [];
let mockTags = [];
export let mockProducts = [];

export const mockStores = [];
let mockOrders = [];

const initMockElements = () => {
  if (mockProducts.length > 0) return;
  if (mockUsers.length > 0) {
    return;
  }

  // generate 20 users
  for (let i = 0; i < 20; i++) {
    const user = {
      id: i,
      firstName: peopleNames[Math.floor(Math.random() * peopleNames.length)],
      lastName:
        peopleSurnames[Math.floor(Math.random() * peopleSurnames.length)],
      phone: `+7${Math.floor(Math.random() * 10000000000)}`,
    };

    user.fullName = `${user.firstName} ${user.lastName}`;

    mockUsers.push(user);
  }

  // generate 8 florists
  for (let i = 0; i < 7; i++) {
    const florist = {
      id: i,
      externalId: Math.floor(Math.random() * 10000000000) + "",
      branchId: Math.floor(Math.random() * 10000) + "",
      firstName: peopleNames[Math.floor(Math.random() * peopleNames.length)],
      lastName:
        peopleSurnames[Math.floor(Math.random() * peopleSurnames.length)],
      phone: `+7${Math.floor(Math.random() * 10000000000)}`,
    };

    florist.fullName = `${florist.firstName} ${florist.lastName}`;

    mockFlorists.push(florist);
  }

  // generate 15 couriers
  for (let i = 0; i < 14; i++) {
    const courier = {
      id: i,
      externalId: Math.floor(Math.random() * 10000000000) + "",
      branchId: Math.floor(Math.random() * 10000) + "",
      firstName: peopleNames[Math.floor(Math.random() * peopleNames.length)],
      lastName:
        peopleSurnames[Math.floor(Math.random() * peopleSurnames.length)],
      phone: `+7${Math.floor(Math.random() * 10000000000)}`,
    };

    courier.fullName = `${courier.firstName} ${courier.lastName}`;

    mockCouriers.push(courier);
  }
  // Components
  for (let i = 0; i < ingridientNames.length; i++) {
    originComponents.push({
      id: i,
      name: ingridientNames[i],
      price: Math.floor(Math.random() * 200),
      catalog: [
        "a0",
        mockCatalogIds[Math.floor(Math.random() * mockCatalogIds.length)],
      ],
      imageUrl:
        flowersPiuctures[Math.floor(Math.random() * flowersPiuctures.length)],
    });
  }
  mockComponents = [...originComponents];

  // Generate tags
  for (let i = 0; i < tagNames.length; i++) {
    mockTags.push({
      id: i,
      name: tagNames[i],
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    });
  }

  //Shuffle product names
  for (let i = productNames.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [productNames[i], productNames[j]] = [productNames[j], productNames[i]];
  }

  // Generate products
  for (let i = 0; i < productNames.length; i++) {
    let product = {
      id: i,
      name: productNames[i],
      price: 0,
      components: [],
      tags: [
        {
          id: 0,
          name: "Недоступен",
          color: Colors.grayscale[700],
        },
        {
          id: 1,
          name: "Акция",
          color: Colors.additional.orange[100],
        },
      ],
      time: Math.floor(Math.random() * 100),
      catalog: [
        "a0",
        mockCatalogIds[Math.floor(Math.random() * mockCatalogIds.length)],
      ],
      // Use random picture
      imageUrl:
        flowersPiuctures[Math.floor(Math.random() * flowersPiuctures.length)],
    };

    // Shuffle ingridinets
    for (let j = 0; j < mockComponents.length; j++) {
      const k = Math.floor(Math.random() * (j + 1));
      const tmp = mockComponents[j];
      mockComponents[j] = mockComponents[k];
      mockComponents[k] = tmp;
    }

    // Generate components
    for (let j = 0; j < 4 + Math.floor(Math.random() * 10); j++) {
      product.components.push(mockComponents[j]);
    }

    // Calculate price
    product.components.forEach((ingridient) => {
      product.price += ingridient.price;
    });

    mockProducts.push(product);
  }
  for (let i = 0; i < 10; i++) {
    let store = {
      id: i,
      name: "Магазин " + i,
      address: "Карла Маркса, 1" + i,
    };
    mockStores.push(store);
  }
  if (mockOrders.length > 0) {
    return;
  }

  const types = [
    { id: 1, name: "Доставка" },
    { id: 2, name: "Самовывоз" },
  ];

  const paymentStatuses = [
    { id: 1, name: "Оплачено" },
    { id: 2, name: "Не оплачено" },
  ];

  const deliveryStatuses = [
    { id: 1, name: "Выполнен" },
    { id: 2, name: "Готов к выдаче" },
    { id: 3, name: "Курьер выехал" },
  ];

  // generate 20 orders
  for (let i = 0; i < 20; i++) {
    const orderDay = moment()
      .add(Math.floor(Math.random() * 20), "days")
      .startOf("day");
    const order = {
      id: i,
      isHot: Math.random() > 0.5,
      // generate random time between 8:00 and 12:00
      timeFrom: orderDay
        .add(Math.floor(Math.random() * 4) + 8, "hours")
        .toDate(),
      // generate random time between 13:00 and 21:00
      timeTo: orderDay
        .add(Math.floor(Math.random() * 8) + 13, "hours")
        .toDate(),
      imageUrl:
        Math.random() > 0.2
          ? `https://picsum.photos/400/600?random=${Math.floor(
              Math.random() * 1000
            )}`
          : null,
      type: types[Math.floor(Math.random() * types.length)],
      paymentStatus:
        paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      price: 0,
      deliveryStatus:
        deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)],
      user: mockUsers[Math.floor(Math.random() * mockUsers.length)],
      florist:
        Math.random() > 0.5
          ? null
          : mockFlorists[Math.floor(Math.random() * (mockFlorists.length - 1))],
      courier:
        Math.random() > 0.5
          ? null
          : mockCouriers[Math.floor(Math.random() * (mockCouriers.length - 1))],
      store: mockStores[Math.floor(Math.random() * (mockStores.length - 1))],
      products: [],
    };

    // Shuffling products
    const products = [...mockProducts];
    for (let i = products.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [products[i], products[j]] = [products[j], products[i]];
    }

    // generate 2-7 products for order
    for (let j = 0; j < Math.floor(Math.random() * 5) + 2; j++) {
      if (products.length > j) {
        order.products.push(products[j]);
        order.price += products[j].price;
      }
    }

    // shuffling components
    const components = [...originComponents];
    for (let i = components.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [components[i], components[j]] = [components[j], components[i]];
    }

    // generate 0-3 components for order
    for (let j = 0; j < Math.floor(Math.random() * 3); j++) {
      if (components.length > j) {
        order.products.push(components[j]);
        order.price += components[j].price;
      }
    }

    mockOrders.push(order);
  }
};

export default OrdersMockApi = (routes) => {
  initMockElements();
  routes.get(FETCH_CATALOG_ENDPOINT, (schema, request) => {
    try {
      return new Response(200, {}, mockCatalogRepsonse);
    } catch (e) {
      return new Response(
        400,
        {},
        {
          error: "Invalid request",
        }
      );
    }
  });
  routes.get(FETCH_COMPONENTS_ENDPOINT, (schema, request) => {
    try {
      return new Response(200, {}, { components: originComponents });
    } catch (e) {
      return new Response(
        400,
        {},
        {
          error: "Invalid request",
        }
      );
    }
  });
  routes.get(FETCH_PRODUCTS_ENDPOINT, (schema, request) => {
    try {
      let products = mockProducts;
      if (request.queryParams.catalog) {
        products = mockProducts.filter((product) => {
          return product.catalog.indexOf(request.queryParams.catalog) !== -1;
        });
      }
      return new Response(200, {}, { products });
    } catch (e) {
      return new Response(
        400,
        {},
        {
          error: "Invalid request",
        }
      );
    }
  });
  routes.get(FETCH_STORES_ENDPOINT, (schema, request) => {
    try {
      let stores = mockStores;

      return new Response(200, {}, { stores });
    } catch (e) {
      return new Response(
        400,
        {},
        {
          error: "Invalid request",
        }
      );
    }
  });
  routes.get(FETCH_ORDERS_ENDPOINT, (schema, request) => {
    try {
      let orders = mockOrders;
      const floristId = request.queryParams.floristId;
      if (request.queryParams.floristId) {
        orders = orders.filter((order) => {
          return (
            order.florist?.id + "" === floristId ||
            (floristId == -1 && order.florist != null)
          );
        });
      }
      return new Response(200, {}, { orders });
    } catch (e) {
      return new Response(
        400,
        {},
        {
          error: "Invalid request",
        }
      );
    }
  });
  routes.get(FETCH_FLORISTS_ENDPOINT, (schema, request) => {
    try {
      let florists = mockFlorists;
      /*if (request.queryParams.florist) {
        products = mockProducts.filter((product) => {
          return product.catalog.indexOf(request.queryParams.catalog) !== -1;
        });
      }*/
      return new Response(200, {}, { florists });
    } catch (e) {
      return new Response(
        400,
        {},
        {
          error: "Invalid request",
        }
      );
    }
  });

  routes.get(FETCH_COURIERS_ENDPOINT, (schema, request) => {
    try {
      let couriers = mockCouriers;
      /*if (request.queryParams.florist) {
        products = mockProducts.filter((product) => {
          return product.catalog.indexOf(request.queryParams.catalog) !== -1;
        });
      }*/
      return new Response(200, {}, { couriers });
    } catch (e) {
      return new Response(
        400,
        {},
        {
          error: "Invalid request",
        }
      );
    }
  });
};
