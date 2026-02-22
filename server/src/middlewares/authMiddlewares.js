export const isUserLoginIn = (req, res, next) =>{
    if(req?.session?.user?.userId) return next()
    return res.status(401).json({ success: false, message: "Not authorized as User" });
}

export const isVendorLoginIn = (req, res, next) =>{
    if(req?.session?.vendor?.vendorId) return next()
    return res.status(401).json({ success: false, message: "Not authorized as Vendor" });
}

export const isAdminLoginIn = (req, res, next) =>{
    if(req?.session?.admin?.adminId) return next()
    return res.status(401).json({ success: false, message: "Not authorized as Admin" });
}

export const isUserOrVendorLoggedIn = (req, res, next) =>{
    if(req?.session?.user?.userId || req?.session?.vendor?.vendorId) return next()
    return res.status(401).json({ success: false, message: "Not authorized. Only Users and Vendors are allowed." });
}

export const isUserOrAdminLoggedIn = (req, res, next) =>{
    if(req?.session?.user?.userId || req?.session?.admin?.adminId) return next()
    return res.status(401).json({ success: false, message: "Not authorized. Only Users and Vendors are allowed." });
}

export const isVendorOrAdminLoggedIn = (req, res, next) =>{
    if(req?.session?.vendor?.vendorId || req?.session?.admin?.adminId) return next()
    return res.status(401).json({ success: false, message: "Not authorized. Only Users and Vendors are allowed." });
}

export const isUserOrVendorOrAdminLoggedIn = (req, res, next) =>{
    if(req?.session?.user?.userId || req?.session?.vendor?.vendorId || req?.session?.admin?.adminId) return next()
    return res.status(401).json({ success: false, message: "Not authorized. Users Vendors and Admin are allowed." });
}

// // ✅ User only login check
// export const isUserLoginIn = (req, res, next) => {
//     if (req.session.userId) return next(); // If user is logged in
//     return res.status(401).json({ success: false, message: "Not authorized as User" });
// };

// // ✅ Vendor only login check
// export const isVendorLoginIn = (req, res, next) => {
//     if (req.session.vendorId) return next(); // If vendor is logged in
//     return res.status(401).json({ success: false, message: "Not authorized as Vendor" });
// };

// // ✅ Admin only login check
// export const isAdminLoginIn = (req, res, next) => {
//     if (req.session.adminId) return next(); // If admin is logged in
//     return res.status(401).json({ success: false, message: "Not authorized as Admin" });
// };

// // ✅ Allow: User OR Vendor
// // ❌ Block: Admin and not logged-in users
// export const isUserOrVendorLoggedIn = (req, res, next) => {
//     if (req.session.userId || req.session.vendorId) return next();
//     return res.status(401).json({
//         success: false,
//         message: "Not authorized. Only Users and Vendors are allowed."
//     });
// };

// // ✅ Allow: User OR Admin
// // ❌ Block: Vendor and not logged-in users
// export const isUserOrAdminLoggedIn = (req, res, next) => {
//     if (req.session.userId || req.session.adminId) return next();
//     return res.status(401).json({
//         success: false,
//         message: "Not authorized. Only Users and Admins are allowed."
//     });
// };

// // ✅ Allow: Vendor OR Admin
// // ❌ Block: User and not logged-in users
// export const isVendorOrAdminLoggedIn = (req, res, next) => {
//     if (req.session.vendorId || req.session.adminId) return next();
//     return res.status(401).json({
//         success: false,
//         message: "Not authorized. Only Vendors and Admins are allowed."
//     });
// };

// // ✅ Allow: User OR Vendor OR Admin (any login)
// // ❌ Block: Not logged-in users
// export const isUserOrVendorOrAdminLoggedIn = (req, res, next) => {
//     if (req.session.userId || req.session.vendorId || req.session.adminId) return next();
//     return res.status(401).json({
//         success: false,
//         message: "Not authorized. Only Users, Vendors, or Admins are allowed."
//     });
// };
