document.addEventListener("DOMContentLoaded", () => {
    const addWaterForm = document.getElementById("addWaterForm");
    const waterTableBody = document.getElementById("waterTableBody");

    let waterData = JSON.parse(localStorage.getItem("waterDistribution")) || [];

    const renderTable = () => {
        waterTableBody.innerHTML = "";
        waterData.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.area}</td>
                <td>${item.quantity} لتر</td>
                <td>${item.date}</td>
                <td>${item.time}</td>
                <td>
                    <span class="badge ${item.status === 'تم التسليم' ? 'bg-success' : 'bg-warning'}">${item.status}</span>
                </td>
                <td>
                    <button class="btn btn-warning btn-sm btn-edit" data-index="${index}">تعديل</button>
                    <button class="btn btn-danger btn-sm btn-delete" data-index="${index}">حذف</button>
                    <button class="btn btn-info btn-sm btn-status" data-index="${index}">
                        ${item.status === 'تم التسليم' ? 'لم يتم التسليم' : 'تم التسليم'}
                    </button>
                </td>
            `;
            waterTableBody.appendChild(row);
        });
        localStorage.setItem("waterDistribution", JSON.stringify(waterData));
    };

    addWaterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newRecord = {
            area: document.getElementById("waterArea").value,
            quantity: document.getElementById("waterQuantity").value,
            date: document.getElementById("distributionDate").value,
            time: document.getElementById("distributionTime").value,
            status: "لم يتم التسليم"
        };
        waterData.push(newRecord);
        renderTable();
        addWaterForm.reset();
    });

    waterTableBody.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("btn-delete")) {
            if (confirm("هل أنت متأكد من حذف هذا السجل؟")) {
                waterData.splice(index, 1);
                renderTable();
            }
        } else if (e.target.classList.contains("btn-edit")) {
            const itemToEdit = waterData[index];
            document.getElementById("waterArea").value = itemToEdit.area;
            document.getElementById("waterQuantity").value = itemToEdit.quantity;
            document.getElementById("distributionDate").value = itemToEdit.date;
            document.getElementById("distributionTime").value = itemToEdit.time;

            const submitBtn = document.querySelector("#addWaterForm button[type='submit']");
            submitBtn.textContent = "تعديل السجل";
            
            const newSubmitHandler = (editEvent) => {
                editEvent.preventDefault();
                waterData[index].area = document.getElementById("waterArea").value;
                waterData[index].quantity = document.getElementById("waterQuantity").value;
                waterData[index].date = document.getElementById("distributionDate").value;
                waterData[index].time = document.getElementById("distributionTime").value;

                renderTable();
                addWaterForm.reset();
                submitBtn.textContent = "إضافة توزيع مياه";
                submitBtn.removeEventListener("click", newSubmitHandler);
                addWaterForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    // Re-add the original submit logic
                });
            };
            submitBtn.addEventListener("click", newSubmitHandler, { once: true });
        } else if (e.target.classList.contains("btn-status")) {
            waterData[index].status = waterData[index].status === 'تم التسليم' ? 'لم يتم التسليم' : 'تم التسليم';
            renderTable();
        }
    });

    renderTable();
});