document.getElementById("generateBtn").addEventListener("click", function () {
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const annualIncome = parseFloat(document.getElementById("annualIncome").value);
    const monthlyIncome = annualIncome / 12;

    // Calculate monthly deductions
    const monthlyUIF = monthlyIncome * 0.01; // 1% UIF
    const monthlyPension = monthlyIncome * 0.07; // 7% Pension

    // Convert monthly income to annual income for tax calculation
    const annualIncomeCalc = monthlyIncome * 12;

    // South African tax brackets (2024/2025 example)
    let annualTax = 0;
    if (annualIncomeCalc <= 237100) {
        annualTax = annualIncomeCalc * 0.18;
    } else if (annualIncomeCalc <= 370500) {
        annualTax = 42678 + (annualIncomeCalc - 237100) * 0.26;
    } else if (annualIncomeCalc <= 512800) {
        annualTax = 77362 + (annualIncomeCalc - 370500) * 0.31;
    } else if (annualIncomeCalc <= 673000) {
        annualTax = 121475 + (annualIncomeCalc - 512800) * 0.36;
    } else if (annualIncomeCalc <= 857900) {
        annualTax = 179147 + (annualIncomeCalc - 673000) * 0.39;
    } else if (annualIncomeCalc <= 1817000) {
        annualTax = 251258 + (annualIncomeCalc - 857900) * 0.41;
    } else {
        annualTax = 644489 + (annualIncomeCalc - 1817000) * 0.45;
    }

    // Convert annual tax to monthly
    const monthlyTax = annualTax / 12;

    // Total deductions
    const monthlyDeductions = monthlyUIF + monthlyTax + monthlyPension;
    const annualDeductions = monthlyDeductions * 12;

    // Net income
    const monthlyNetIncome = monthlyIncome - monthlyDeductions;
    const annualNetIncome = monthlyNetIncome * 12;

    // Generate QR code using QRCode.js
    const qrCodeCanvas = document.createElement("canvas");

    // Use QRCode.toCanvas to generate the QR codep
    QRCode.toCanvas(qrCodeCanvas, "https://dolcepayslips.netlify.app", function (error) {
        if (error) {
            console.error(error);
        } else {
            // Generate PDF using jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Set margins and font size
            const margin = 10;
            doc.setFontSize(10);

            // Add company logo
            const logoImg = new Image();
            logoImg.src = "Money Coin Bag Icon PNG & SVG Design For T-Shirts.jpg"; // Path to your logo image
            logoImg.onload = () => {
                doc.addImage(logoImg, "PNG", margin, margin, 30, 30); // Adjust position and size
                doc.text("Company Name", 50, margin + 5);

                // Add payslip content
                doc.text("Payslip", margin, 50);
                doc.text(`Name: ${name} ${surname}`, margin, 60);
                doc.text(`Monthly Income: R${monthlyIncome.toFixed(2)}`, margin, 70);
                doc.text(`Annual Income: R${annualIncomeCalc.toFixed(2)}`, margin, 80);

                doc.text("Monthly Deductions:", margin, 90);
                doc.text(`- UIF (1%): R${monthlyUIF.toFixed(2)}`, margin, 100);
                doc.text(`- Pension Fund (7%): R${monthlyPension.toFixed(2)}`, margin, 110);
                doc.text(`- Income Tax: R${monthlyTax.toFixed(2)}`, margin, 120);

                doc.text("Annual Deductions:", margin, 130);
                doc.text(`- UIF (1%): R${(monthlyUIF * 12).toFixed(2)}`, margin, 140);
                doc.text(`- Pension Fund (7%): R${(monthlyPension * 12).toFixed(2)}`, margin, 150);
                doc.text(`- Income Tax: R${annualTax.toFixed(2)}`, margin, 160);

                doc.text(`Total Monthly Deductions: R${monthlyDeductions.toFixed(2)}`, margin, 170);
                doc.text(`Total Annual Deductions: R${annualDeductions.toFixed(2)}`, margin, 180);

                doc.text(`Net Monthly Income: R${monthlyNetIncome.toFixed(2)}`, margin, 190);
                doc.text(`Net Annual Income: R${annualNetIncome.toFixed(2)}`, margin, 200);

                // Add QR code to the PDF
                const qrCodeData = qrCodeCanvas.toDataURL("image/png");
                doc.addImage(qrCodeData, "PNG", margin, 210, 25, 25); // Adjust position and size

                // Footer
                doc.setFontSize(8);
                doc.text("Dolce-Payslip © 2025. All Rights Reserved.\n\n" +
                    "The information and documents provided by PapaDolce & Co. are for educational and informational purposes only.\n" +
                    "We make no representations or warranties regarding the accuracy or completeness of the calculations.\n" +
                    "The estimated earnings and deductions provided are based on the data inputted by the user,\n and should not be considered as official financial advice or a guarantee of actual results.\n" +
                    "PapaDolce & Co. shall not be held liable for any use or misuse of the information,\n nor for any outcomes derived from using the documents or calculations provided on this site.", margin, 250);

                // Save the PDF
                const filename = `${name} ${surname} .pdf`;
                doc.save(filename);
            };

            // Handle case where the logo doesn't load (fallback)
            logoImg.onerror = () => {
                doc.setFontSize(16);
                doc.text("Dolce-Pay-Slips", 50, margin + 5);
                doc.text("Payslip", margin, 50);
                doc.text(`Name: ${name} ${surname}`, margin, 60);
                doc.text(`Monthly Income: R${monthlyIncome.toFixed(2)}`, margin, 70);
                doc.text(`Annual Income: R${annualIncomeCalc.toFixed(2)}`, margin, 80);

                doc.text("Monthly Deductions:", margin, 90);
                doc.text(`- UIF (1%): R${monthlyUIF.toFixed(2)}`, margin, 100);
                doc.text(`- Pension Fund (7%): R${monthlyPension.toFixed(2)}`, margin, 110);
                doc.text(`- Income Tax: R${monthlyTax.toFixed(2)}`, margin, 120);

                doc.text("Annual Deductions:", margin, 130);
                doc.text(`- UIF (1%): R${(monthlyUIF * 12).toFixed(2)}`, margin, 140);
                doc.text(`- Pension Fund (7%): R${(monthlyPension * 12).toFixed(2)}`, margin, 150);
                doc.text(`- Income Tax: R${annualTax.toFixed(2)}`, margin, 160);

                doc.text(`Total Monthly Deductions: R${monthlyDeductions.toFixed(2)}`, margin, 170);
                doc.text(`Total Annual Deductions: R${annualDeductions.toFixed(2)}`, margin, 180);

                doc.text(`Net Monthly Income: R${monthlyNetIncome.toFixed(2)}`, margin, 190);
                doc.text(`Net Annual Income: R${annualNetIncome.toFixed(2)}`, margin, 200);

                // Save the PDF
                const filename = `${name} ${surname}.pdf`;
                doc.save(filename);
            };
        }
    });
});
