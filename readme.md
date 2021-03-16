# RESTful API
[__Guest features__](#Guest-features)  
[__User features__](#User-features)

## Guest features

### Guest gets all products with pagination and keyword
GET /api/products?keyword=[keyword: string]&pageNumber=[pageNumer: number]  

```js
response = [
    {
        price,          // number (float)
        countInStock,   // number (int)
        numReviews,     // number (int)
        rating,         // number (int)
        _id,            // string
        name,           // string
        image,          // string
        description,    // string
        brand,          // string
        category,       // string
        reviews,        // object (array of reviews)
        __v,            // number (int)
        createdAt,      // string (date)
        updatedAt       // string (date)
    }
]
```
### Guest gets top 4 products (limit = 4)
GET /api/products/top  

```js
response = [
    product, // object
    product, // object
    product, // object
    product // object
]

```
### Guest gets product details by product id
GET /api/products/[productId: string]

```js
response = {
    productDetails: {
        name,           // string
        brand,          // string
        category,       // string
        description,    // string
        price,          // number (float)
        countInStock,   // number (int)
        image,          // string
        reviews: [
            {
                name,       // string
                rating,     // number (int)
                comment,    // string
                user        // object
            },
            // ...
        ]        
        numReviews,     // number (int)
        rating,         // number (float)
    } 
}
```

### Guest registers
POST /api/users/  

```js
request = {
    userName,       // string
    userEmail,      // string
    userPassword    // string
}

response = {
    createdUser: {
        userName,   // string
        userToken   // string (jsonwebtoken)
    }    
}
```

---

## User features

### User logins
POST /api/users/login

```js
request = {
    userEmail,      // string
    userPassword    // string
}

response = {
    loggedUser: {
        userName,   // string
        userToken   // string (jsonwebtoken)
    }    
}
```

### User gets profile data
GET /api/users/profile

```js
request = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }
}

response = {
    userProfile: {
        userName,   // string
        userEmail   // string
    }
}

```

### User updates profile data
PUT /api/users/profile

```js
request = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    },
    
    body: {
        dataToUpdate: {
            userName,       // string
            userEmail,      // string
            userPassword    // string
        }
    }
}

response = {
    updatedUser: {
        userName,       // string
        userEmail,      // string
    }
}
```

### User removes profile
DELETE /api/users/profile

```js
request = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }
}

response = {
    profileDeleted: {
        userEmail,      // string
    }
}
```

### User creates order
POST /api/orders/

```js
request = {
   headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    },
    
    order = {
        orderItems: [
            {
                productId,  // string (mongo _id)
                productQty  // number (int)
            },
            // ...
        ],
        shippingAddress: {
            address,        // string
            city,           // string
            postalCode,     // string
            country,        // string
        },
        paymentMethod,      // string
    }
}

response = {
    createdOrder: {
        user: {
            userName,
            userEmail
        },
        orderItems: [
            {
                productId,      // string (mongo _id)
                productName,    // string 
                productQty,     // number (int)
                productPriceInDollars,   // number (float)
                productCostInDollars,   // number (float)
                productImage,   // string (media data)
            },
            // ...
        ],
        shippingAddress: {
            address,        // string
            city,           // string
            postalCode,     // string
            country,        // string
        },
        paymentMethod,      // string
        itemsCostInDollars // number (float)
        taxPriceInDollars,           // number (float)
        shippingPriceInDollars,      // number (float)
        totalCostInDollars,         // number (float)
        isPaid: false,      // boolean
        isDelivered: false, // boolean
        createdAt,          // string (date)
    }
}

```

### User gets order details
GET /api/orders/[orderId: string]

```js
request = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    },

    body: null
}

response = {
    order: {
       user: {
            userName,
            userEmail
        },
        orderItems: [
            {
                productId,      // string (mongo _id)
                productName,    // string 
                productQty,     // number (int)
                productPriceInDollars,   // number (float)
                productCostInDollars,   // number (float)
                productImage,   // string (media data)
            },
            // ...
        ],
        shippingAddress: {
            address,        // string
            city,           // string
            postalCode,     // string
            country,        // string
        },
        paymentMethod,      // string
        itemsCostInDollars // number (float)
        taxPriceInDollars,           // number (float)
        shippingPriceInDollars,      // number (float)
        totalCostInDollars,         // number (float)
        isPaid,      // boolean
        isDelivered, // boolean
        createdAt,          // string (date)
    }
}

```

### User gets all orders
GET /api/orders/orderslist

```js
request = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    },

    body: null
}

response = {
    user: {
            userName,
            userEmail
        },
    orders: [
        {
            orderItems: [
            {
                productId,      // string (mongo _id)
                productName,    // string 
                productQty,     // number (int)
                productPriceInDollars,   // number (float)
                productCostInDollars,   // number (float)
                productImage,   // string (media data)
            },
            // ...
        ],
        shippingAddress: {
            address,        // string
            city,           // string
            postalCode,     // string
            country,        // string
        },
        paymentMethod,      // string
        itemsCostInDollars // number (float)
        taxPriceInDollars,           // number (float)
        shippingPriceInDollars,      // number (float)
        totalCostInDollars,         // number (float)
        isPaid,      // boolean
        isDelivered, // boolean
        createdAt,          // string (date)
        },
        // ...
    ]
}

```

### User pays order
PUT /api/orders/:[orderId: string]/pay

```js
request = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    },

    body: {
        paymentData: {
            paymentId, // string
            paymentStatus, // boolean
            paymentTime, // string (date)
            payerEmail // string
        }
    }
}

response = {
    payedOrder: {
        orderId, // string (mongo id)
        payerEmail // string
    }
}

```