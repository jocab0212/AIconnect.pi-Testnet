// ✅ Smooth scroll for CTA buttons
document.querySelector(".cta").addEventListener("click", () => {
  document.getElementById("tools").scrollIntoView({ behavior: "smooth" });
});
document.querySelector(".cta.secondary").addEventListener("click", () => {
  document.getElementById("pricing").scrollIntoView({ behavior: "smooth" });
});

// ✅ Navigation links
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    document.getElementById(targetId).scrollIntoView({ behavior: "smooth" });
  });
});

// ✅ Pi SDK login button
document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    const user = await window.Pi.authenticate(["username","payments"]);
    alert("Welcome " + user.username);
  } catch (err) {
    alert("Login failed. Please try again.");
  }
});

// ✅ Contact form with Formspree
document.getElementById("contactForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById("formStatus");

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      status.textContent = "Message sent successfully!";
      status.style.color = "green";
      form.reset();
    } else {
      status.textContent = "Oops! Something went wrong.";
      status.style.color = "red";
    }
  } catch (err) {
    status.textContent = "Network error. Please try again.";
    status.style.color = "red";
  }
});

// ✅ Tool Modal logic
const modal = document.getElementById("toolModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const closeModal = document.getElementById("closeModal");
const demoBtn = document.getElementById("demoBtn");
const writerDemo = document.getElementById("writerDemo");
const generateBtn = document.getElementById("generateBtn");
const writerOutput = document.getElementById("writerOutput");

document.querySelectorAll(".tool-card .btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const toolName = btn.parentElement.querySelector("h3").textContent;
    const toolDesc = btn.parentElement.querySelector("p").textContent;

    modalTitle.textContent = toolName;
    modalDescription.textContent = toolDesc;
    modal.style.display = "flex";

    if (toolName === "AI Writer") {
      demoBtn.style.display = "none";
      writerDemo.style.display = "block";
    } else {
      demoBtn.style.display = "inline-block";
      writerDemo.style.display = "none";
    }
  });
});

closeModal.addEventListener("click", () => { modal.style.display = "none"; });
window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

// ✅ AI Writer demo
generateBtn.addEventListener("click", () => {
  const topic = document.getElementById("writerInput").value.trim();
  if (!topic) {
    writerOutput.textContent = "Please enter a topic.";
    return;
  }
  writerOutput.textContent = `Here’s a quick draft on "${topic}": 
  AI is transforming industries by automating tasks, improving efficiency, and unlocking new opportunities for innovation.`;
});

// ✅ Subscription modal flow
const subModal = document.getElementById("subModal");
const subTitle = document.getElementById("subTitle");
const subDescription = document.getElementById("subDescription");
const closeSubModal = document.getElementById("closeSubModal");

const subStep1 = document.getElementById("subStep1");
const subStepQR = document.getElementById("subStepQR");
const subStep2 = document.getElementById("subStep2");
const subStep3 = document.getElementById("subStep3");

const nextStepBtn = document.getElementById("nextStepBtn");
const qrNextBtn = document.getElementById("qrNextBtn");
const confirmBtn = document.getElementById("confirmBtn");
const doneBtn = document.getElementById("doneBtn");
const downloadBtn = document.getElementById("downloadBtn");

// Open modal
document.querySelectorAll(".plan").forEach(plan => {
  plan.addEventListener("click", () => {
    const planName = plan.textContent;
    subTitle.textContent = planName;
    subDescription.textContent = `You selected the ${planName} plan. 
    To subscribe, you’ll need to confirm a Pi payment.`;

    subStep1.style.display = "block";
    subStepQR.style.display = "none";
    subStep2.style.display = "none";
    subStep3.style.display = "none";

    subModal.style.display = "flex";
  });
});

// Step transitions
nextStepBtn.addEventListener("click", () => { subStep1.style.display = "none"; subStepQR.style.display = "block"; });
qrNextBtn.addEventListener("click", () => { subStepQR.style.display = "none"; subStep2.style.display = "block"; });
confirmBtn.addEventListener("click", () => {
  subStep2.style.display = "none";
  subStep3.style.display = "block";

  const txnId = "TXN" + Math.floor(Math.random()*1000000000);
  const receiptHTML = `
    <p><strong>Transaction ID:</strong> ${txnId}</p>
    <p><strong>Amount:</strong> 5 Pi</p>
    <p><strong>Status:</strong> Completed</p>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
  `;
  document.getElementById("receiptBox").innerHTML = receiptHTML;
});

// ✅ PDF Receipt with logo + header + watermark
downloadBtn.addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const logoUrl = "https://copilot.microsoft.com/th/id/BCO.a4275d19-cf7e-41e0-86b0-2f7544277b72.png";
  const logo = await fetch(logoUrl)
    .then(res => res.blob())
    .then(blob => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    }));

  // Header bar
  doc.setFillColor(255, 107, 0);
  doc.rect(0, 0, 210, 20, "F");
  doc.setFillColor(0, 188, 212);
  doc.rect(0, 0, 210, 10, "F");

  // Logo + Title
  doc.addImage(logo, "PNG", 10, 25, 25, 25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("AIConnect.pi Subscription Receipt", 45, 35);

  // Watermark
  doc.setTextColor(200);
  doc.setFontSize(60);
  doc.text("AIConnect.pi", 30, 150, { angle: 30 });

  // Receipt details
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const receiptText = document.getElementById("receiptBox").innerText;
  doc.text(receiptText, 20, 70);

  doc.save("AIConnect_pi_Receipt.pdf");
});

// Close modal
doneBtn.addEventListener("click", () => { subModal.style.display = "none"; });
closeSubModal.addEventListener("click", () => { subModal.style.display = "none"; });
window.addEventListener("click", (e) => { if (e.target === subModal) subModal.style.display = "none"; });

console.log("PI_API_KEY from env:", process.env.PI_API_KEY);

