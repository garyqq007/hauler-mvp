const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//登陆
export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

//创建订单
export async function createOrder(orderData: any) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });

  if (!res.ok) {
    throw new Error("Create order failed");
  }

  return res.json();
}

//查看开放订单
export async function getOpenOrders() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/orders/open`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}

//司机接单
export async function acceptOrder(orderId: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/orders/${orderId}/accept`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to accept order");
  }

  return res.json();
}

//司机查看自己 active 订单情况
export async function getMyActiveOrders() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/orders/my-active`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to fetch active orders");

  return res.json();
}

//司机查看自己 history 已完成 订单情况
export async function getMyHistoryOrders() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/orders/my-history`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to fetch history orders");

  return res.json();
}

//
export async function getMyOrders() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/orders/my`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch my orders");
  }

  return res.json();
}

//司机端更新状态
export async function updateOrderStatus(orderId: string, status: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/orders/${orderId}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    throw new Error("Failed to update status");
  }

  return res.json();
}

//注册用户
export async function register(userData: any) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  if (!res.ok) {
    throw new Error("Register failed");
  }

  return res.json();
}

//用户查看自己订单
export async function getMyCustomerOrders() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/orders/my-customer`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch customer orders");
  }

  return res.json();
}



