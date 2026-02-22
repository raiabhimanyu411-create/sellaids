// import session from "express-session"
// import MySQLStore from "express-mysql-session"
// import config from "./config.js"

// // ✅ MySQL Session Store
// const MySQLSessionStore = MySQLStore(session)

// let store = null

// if (config.env === "production") {
//     console.log("Using MySQL Session Store (Production Mode)")
//     store = new MySQLSessionStore({
//         host: config.database.host,
//         port: config.database.port,
//         user: config.database.user,
//         password: config.database.password,
//         database: config.database.name,
//         clearExpired: true,
//         checkExpirationInterval: 900000, // 15 min
//         expiration: 30 * 60 * 1000, // 30 min
//         createDatabaseTable: true,
//     })
// } else {
//     console.log("Using In-Memory Session Store (Development Mode)")
// }

// const sessionMiddleware = session({
//     key: "session_cookie_name",
//     secret: config.auth.sessionSecret,
//     store,
//     resave: true,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 30 * 60 * 1000, // 30 minutes inactivity
//         httpOnly: true,
//         sameSite: config.env === "production" ? "strict" : "lax",
//         secure: config.env === "production", // HTTPS me hi true
//     },
//     rolling: true, // refresh session expiry on user activity
// })

// export default sessionMiddleware



// sessionConfig.js
import session from "express-session"
import MySQLStore from "express-mysql-session"
import config from "./config.js"

const MySQLSessionStore = MySQLStore(session)

const store = new MySQLSessionStore({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    clearExpired: true,
    checkExpirationInterval: 900000, // 15 min
    expiration: 30 * 60 * 1000, // 30 min
    createDatabaseTable: true,
});

const sessionMiddleware = session({
    key: "session_cookie_name",
    secret: config.auth.sessionSecret,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: false, // local dev me false rakho
    },
    rolling: true,
});

export default sessionMiddleware;