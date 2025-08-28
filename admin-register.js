document.addEventListener("DOMContentLoaded", () => {
    const adminRegistrationForm = document.getElementById("adminRegistrationForm");
    const adminTableBody = document.getElementById("adminTableBody");

    const renderAdminsTable = () => {
        const admins = JSON.parse(localStorage.getItem('admins')) || [];
        adminTableBody.innerHTML = '';
        admins.forEach((admin, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${admin.name}</td>
                <td>${admin.id}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-edit" data-index="${index}">تعديل</button>
                    <button class="btn btn-danger btn-sm btn-delete" data-index="${index}">حذف</button>
                </td>
            `;
            adminTableBody.appendChild(row);
        });
    };

    if (adminRegistrationForm) {
        adminRegistrationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const admins = JSON.parse(localStorage.getItem('admins')) || [];
            const adminId = document.getElementById('adminId').value;
            const adminPassword = document.getElementById('adminPassword').value;

            // التحقق من أن رقم الهوية غير مكرر
            const idExists = admins.some(a => a.id === adminId);
            if (idExists) {
                alert('رقم الهوية هذا مسجل بالفعل. يرجى استخدام رقم آخر.');
                return;
            }

            const newAdmin = {
                name: document.getElementById('adminName').value,
                id: adminId,
                password: adminPassword,
            };
            admins.push(newAdmin);
            localStorage.setItem('admins', JSON.stringify(admins));
            alert('تمت إضافة المسؤول بنجاح!');
            
            // إعادة تعيين النموذج بعد الحفظ
            adminRegistrationForm.reset();
            
            // تحديث الجدول لعرض المسؤول الجديد
            renderAdminsTable();
        });
    }

    // منطق التعديل والحذف
    if (adminTableBody) {
        adminTableBody.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            const admins = JSON.parse(localStorage.getItem('admins')) || [];
            
            if (e.target.classList.contains('btn-delete')) {
                if (confirm('هل أنت متأكد من حذف هذا المسؤول؟')) {
                    admins.splice(index, 1);
                    localStorage.setItem('admins', JSON.stringify(admins));
                    renderAdminsTable();
                }
            } else if (e.target.classList.contains('btn-edit')) {
                const newName = prompt("أدخل الاسم الجديد:", admins[index].name);
                if (newName !== null) {
                    admins[index].name = newName;
                    localStorage.setItem('admins', JSON.stringify(admins));
                    renderAdminsTable();
                }
            }
        });
    }

    // عرض الجدول عند تحميل الصفحة لأول مرة
    renderAdminsTable();
});