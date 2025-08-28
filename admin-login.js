document.addEventListener("DOMContentLoaded", () => {
    const adminLoginForm = document.getElementById("adminLoginForm");

    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const adminId = document.getElementById("adminId").value;
            const adminPassword = document.getElementById("adminPassword").value;

            // بيانات المسؤول الافتراضية إذا لم يكن هناك مسؤول مسجل
            const defaultAdmins = [{ id: "admin1", password: "password123" }];
            
            // استرجاع بيانات المسؤولين من localStorage أو استخدام البيانات الافتراضية
            const admins = JSON.parse(localStorage.getItem('admins')) || defaultAdmins;
            
            // البحث عن المسؤول المطابق
            const loggedInAdmin = admins.find(admin => 
                admin.id === adminId && admin.password === adminPassword
            );

            if (loggedInAdmin) {
                // حفظ حالة تسجيل الدخول في sessionStorage
                sessionStorage.setItem('loggedInAdmin', JSON.stringify(loggedInAdmin));
                
                // توجيه المستخدم إلى لوحة التحكم
                alert("تم تسجيل الدخول بنجاح!");
                window.location.href = "admin-panel.html"; 
            } else {
                alert("رقم الهوية أو كلمة المرور غير صحيحة.");
            }
        });
    }
});