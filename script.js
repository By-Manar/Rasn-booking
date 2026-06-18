let selectedDay = "";
const eventTime = "5:00 مساءً - 10:00 مساءً";

const dayInputs = document.querySelectorAll('input[name="day"]');
const form = document.querySelector("form");

dayInputs.forEach(input => {
  input.addEventListener("change", function () {
    const label = document.querySelector(`label[for="${this.id}"]`);
    selectedDay = label.innerText.replace(/\s+/g, " ").trim();
  });
});

function generateTicket() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ticket = "RSN-";

  for (let i = 0; i < 5; i++) {
    ticket += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return ticket;
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.querySelector('input[type="text"]').value.trim();
  const phone = document.querySelector('input[type="tel"]').value.trim();
  const villa = document.querySelectorAll('input[type="text"]')[1].value.trim();
  const email = document.querySelector('input[type="email"]').value.trim();

  if (!selectedDay) {
    alert("يرجى اختيار اليوم أولاً");
    return;
  }

  if (!fullName || !phone || !villa) {
    alert("يرجى تعبئة الاسم ورقم الجوال ورقم الفيلا");
    return;
  }

  const phoneRegex = /^05[0-9]{8}$/;

  if (!phoneRegex.test(phone)) {
    alert("يرجى إدخال رقم جوال صحيح يبدأ بـ 05 ويتكون من 10 أرقام");
    return;
  }

  const ticketNumber = generateTicket();

  const bookingData = {
    fullName: fullName,
    phone: phone,
    villa: villa,
    email: email,
    day: selectedDay,
    time: eventTime,
    ticketNumber: ticketNumber
  };

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbx9fuxsGs56_7xgdfKrUs92t6RCadv-terjTCy7BqNneIR_ueq6qDJUmT1YCqhVxgna/exec", {
      method: "POST",
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();

    if (result.status === "duplicate") {
      alert("هذا الرقم مسجل مسبقًا، لا يمكن الحجز أكثر من مرة بنفس رقم الجوال");
      return;
    }

    if (result.status === "success") {
      alert(
        `تم تأكيد موعدك بنجاح ✅\n\n` +
        `رقم الموعد: ${ticketNumber}\n` +
        `اليوم: ${selectedDay}\n` +
        `الوقت: ${eventTime}`
      );

      form.reset();
      selectedDay = "";
    } else {
      alert("حدث خطأ أثناء التسجيل، يرجى المحاولة لاحقًا");
    }

  } catch (error) {
    alert("تعذر الاتصال بالنظام، يرجى المحاولة لاحقًا");
    console.error(error);
  }
});
