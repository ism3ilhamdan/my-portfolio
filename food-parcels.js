document.addEventListener("DOMContentLoaded", () => {
    const addParcelForm = document.getElementById("addParcelForm");
    const parcelsTableBody = document.getElementById("parcelsTableBody");

    // تحميل البيانات من الذاكرة المحلية عند بدء الصفحة
    let parcels = JSON.parse(localStorage.getItem("foodParcels")) || [];

    // عرض البيانات الموجودة في الجدول
    const renderTable = () => {
        parcelsTableBody.innerHTML = "";
        parcels.forEach((parcel, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${parcel.number}</td>
                <td>${parcel.beneficiary}</td>
                <td>${parcel.area}</td>
                <td>${parcel.date}</td>
                <td>${parcel.time}</td>
                <td>
                    <span class="badge ${parcel.status === 'تم الاستلام' ? 'bg-success' : 'bg-warning'}">${parcel.status}</span>
                </td>
                <td>
                    <button class="btn btn-warning btn-sm btn-edit" data-index="${index}">تعديل</button>
                    <button class="btn btn-danger btn-sm btn-delete" data-index="${index}">حذف</button>
                    <button class="btn btn-info btn-sm btn-status" data-index="${index}">
                        ${parcel.status === 'تم الاستلام' ? 'لم يستلم' : 'تم الاستلام'}
                    </button>
                </td>
            `;
            parcelsTableBody.appendChild(row);
        });
        // تحديث البيانات في الذاكرة المحلية
        localStorage.setItem("foodParcels", JSON.stringify(parcels));
    };

    // معالجة إضافة طرد جديد
    addParcelForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newParcel = {
            number: document.getElementById("parcelNumber").value,
            beneficiary: document.getElementById("beneficiaryName").value,
            area: document.getElementById("distributionArea").value,
            date: document.getElementById("distributionDate").value,
            time: document.getElementById("distributionTime").value,
            status: "لم يستلم"
        };
        parcels.push(newParcel);
        renderTable();
        addParcelForm.reset(); // تفريغ النموذج
    });

    // معالجة أزرار التعديل والحذف وتغيير الحالة
    parcelsTableBody.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("btn-delete")) {
            if (confirm("هل أنت متأكد من حذف هذا الطرد؟")) {
                parcels.splice(index, 1);
                renderTable();
            }
        } else if (e.target.classList.contains("btn-edit")) {
            const parcelToEdit = parcels[index];
            document.getElementById("parcelNumber").value = parcelToEdit.number;
            document.getElementById("beneficiaryName").value = parcelToEdit.beneficiary;
            document.getElementById("distributionArea").value = parcelToEdit.area;
            document.getElementById("distributionDate").value = parcelToEdit.date;
            document.getElementById("distributionTime").value = parcelToEdit.time;

            const submitBtn = document.querySelector("#addParcelForm button[type='submit']");
            submitBtn.textContent = "تعديل الطرد";
            
            // إلغاء مستمع الحدث السابق وتعيين واحد جديد لمنع الإضافة
            const newSubmitHandler = (editEvent) => {
                editEvent.preventDefault();
                // تحديث البيانات
                parcels[index].number = document.getElementById("parcelNumber").value;
                parcels[index].beneficiary = document.getElementById("beneficiaryName").value;
                parcels[index].area = document.getElementById("distributionArea").value;
                parcels[index].date = document.getElementById("distributionDate").value;
                parcels[index].time = document.getElementById("distributionTime").value;

                renderTable();
                addParcelForm.reset();
                submitBtn.textContent = "إضافة طرد";
                submitBtn.removeEventListener("click", newSubmitHandler);
                addParcelForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    // كود إضافة الطرد
                });
            };
            submitBtn.addEventListener("click", newSubmitHandler, { once: true });
            
        } else if (e.target.classList.contains("btn-status")) {
            parcels[index].status = parcels[index].status === 'تم الاستلام' ? 'لم يستلم' : 'تم الاستلام';
            renderTable();
        }
    });

    // العرض الأولي للبيانات
    renderTable();
});