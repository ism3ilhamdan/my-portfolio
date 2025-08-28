document.addEventListener("DOMContentLoaded", () => {
    // جلب بيانات المستخدم المسجل دخوله من sessionStorage
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const userHeaderTitle = document.getElementById('userHeaderTitle');

    if (loggedInUser && userHeaderTitle) {
        userHeaderTitle.textContent = `مرحباً, ${loggedInUser.fullName}`;
    }

    // ... باقي أكواد user-profile.js كما هي ...
    // (جميع الأكواد الأخرى التي قدمتها لك سابقاً تبقى في مكانها)
});
document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    const dynamicContent = document.getElementById("dynamic-content");
    const distributionTable = document.getElementById("dynamic-content").querySelector('table');
    const distributionTableBody = document.getElementById("distributionTableBody");
    const tableTitle = document.getElementById("table-title");
    const backToMenuBtn = document.getElementById("backToMenuBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const dashboardItems = document.querySelectorAll(".dashboard-item");

    const showDistributionTable = (type, title) => {
        mainContent.style.display = "none";
        dynamicContent.style.display = "block";
        tableTitle.textContent = title;
        
        let data = [];
        let headers = [];

        if (type === "food-parcels") {
            data = JSON.parse(localStorage.getItem("foodParcels")) || [];
            headers = ['اسم المستفيد', 'رقم الطرد', 'تاريخ التوزيع', 'وقت التسليم', 'منطقة التوزيع', 'حالة التوزيع'];
        } else if (type === "water") {
            data = JSON.parse(localStorage.getItem("waterDistribution")) || [];
            headers = ['منطقة التوزيع', 'الكمية (باللتر)', 'تاريخ التوزيع', 'وقت التسليم', 'حالة التوزيع'];
        } else if (type === "food") {
            data = JSON.parse(localStorage.getItem("foodDistribution")) || [];
            headers = ['منطقة التوزيع', 'اسم الوجبة', 'تاريخ التوزيع', 'وقت التوزيع', 'عدد القدور', 'حالة التوزيع'];
        }

        // بناء رأس الجدول ديناميكياً
        const tableHeaderRow = distributionTable.querySelector('thead tr');
        tableHeaderRow.innerHTML = '';
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            tableHeaderRow.appendChild(th);
        });

        // عرض رسالة في حال عدم وجود بيانات
        if (data.length === 0) {
             distributionTableBody.innerHTML = `<tr><td colspan="${headers.length}" class="text-center">لا توجد بيانات متاحة حاليًا.</td></tr>`;
             return;
        }
        
        // بناء محتوى الجدول ديناميكياً
        distributionTableBody.innerHTML = "";
        data.forEach(item => {
            const row = document.createElement("tr");
            let rowContent = '';
            
            if (type === 'food-parcels') {
                rowContent = `
                    <td>${item.beneficiary}</td>
                    <td>${item.number}</td>
                    <td>${item.date}</td>
                    <td>${item.time}</td>
                    <td>${item.area}</td>
                    <td><span class="badge ${item.status === 'تم الاستلام' ? 'bg-success' : 'bg-danger'}">${item.status}</span></td>
                `;
            } else if (type === 'water') {
                rowContent = `
                    <td>${item.area}</td>
                    <td>${item.quantity} لتر</td>
                    <td>${item.date}</td>
                    <td>${item.time}</td>
                    <td><span class="badge ${item.status === 'تم التسليم' ? 'bg-success' : 'bg-danger'}">${item.status}</span></td>
                `;
            } else if (type === 'food') {
                rowContent = `
                    <td>${item.area}</td>
                    <td>${item.mealName}</td>
                    <td>${item.date}</td>
                    <td>${item.time}</td>
                    <td>${item.potsCount}</td>
                    <td><span class="badge ${item.status === 'تم التسليم' ? 'bg-success' : 'bg-danger'}">${item.status}</span></td>
                `;
            }
            row.innerHTML = rowContent;
            distributionTableBody.appendChild(row);
        });
    };

    dashboardItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const dataType = item.dataset.type;
            let title = "";
            if (dataType === "food-parcels") {
                title = "مواعيد توزيع الطرود الغذائية";
            } else if (dataType === "water") {
                title = "مواعيد توزيع المياه";
            } else if (dataType === "food") {
                title = "مواعيد توزيع الطعام";
            }
            showDistributionTable(dataType, title);
        });
    });

    backToMenuBtn.addEventListener("click", () => {
        mainContent.style.display = "block";
        dynamicContent.style.display = "none";
    });

    logoutBtn.addEventListener("click", () => {
        alert("تم تسجيل الخروج بنجاح.");
        window.location.href = "options.html";
    });
});