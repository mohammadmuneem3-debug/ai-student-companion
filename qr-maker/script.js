/* =====================================================
   QR MAKER
   COMPLETE SCRIPT.JS
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const generatorPanel =
        document.getElementById("generatorPanel");

    const generatorTitle =
        document.getElementById("generatorTitle");

    const formContainer =
        document.getElementById("formContainer");

    const generateButton =
        document.getElementById("generateButton");

    const clearButton =
        document.getElementById("clearButton");

    const closeGenerator =
        document.getElementById("closeGenerator");

    const qrPreview =
        document.getElementById("qrPreview");


    // =====================================================
    // VARIABLES
    // =====================================================

    let currentGenerator = "";

    let currentQRSize = 500;

    let lastQRData = "";

    let lastQRImageURL = "";


    // =====================================================
    // GENERATOR INFORMATION
    // =====================================================

    const generatorInfo = {

        website: {

            title: "Website QR Code",

            fields: `
                <div class="form-group">

                    <label for="websiteUrl">
                        Website URL
                    </label>

                    <input
                        type="url"
                        id="websiteUrl"
                        placeholder="https://example.com"
                    >

                    <span class="input-help">
                        Enter the complete website address.
                    </span>

                </div>
            `

        },


        wifi: {

            title: "Wi-Fi QR Code",

            fields: `
                <div class="form-group">

                    <label for="wifiName">
                        Wi-Fi Name
                    </label>

                    <input
                        type="text"
                        id="wifiName"
                        placeholder="My WiFi"
                    >

                </div>


                <div class="form-group">

                    <label for="wifiPassword">
                        Wi-Fi Password
                    </label>

                    <input
                        type="text"
                        id="wifiPassword"
                        placeholder="Enter Wi-Fi password"
                    >

                </div>


                <div class="form-group">

                    <label for="wifiSecurity">
                        Security
                    </label>

                    <select id="wifiSecurity">

                        <option value="WPA">
                            WPA / WPA2 / WPA3
                        </option>

                        <option value="WEP">
                            WEP
                        </option>

                        <option value="nopass">
                            No Password
                        </option>

                    </select>

                </div>
            `

        },


        whatsapp: {

            title: "WhatsApp QR Code",

            fields: `
                <div class="form-group">

                    <label for="whatsappNumber">
                        WhatsApp Number
                    </label>

                    <input
                        type="tel"
                        id="whatsappNumber"
                        placeholder="919876543210"
                    >

                    <span class="input-help">
                        Include country code without +.
                    </span>

                </div>


                <div class="form-group">

                    <label for="whatsappMessage">
                        Message
                    </label>

                    <textarea
                        id="whatsappMessage"
                        rows="4"
                        placeholder="Hello! I would like to contact you."
                    ></textarea>

                </div>
            `

        },


        contact: {

            title: "Contact QR Code",

            fields: `
                <div class="form-group">

                    <label for="contactName">
                        Full Name
                    </label>

                    <input
                        type="text"
                        id="contactName"
                        placeholder="John Doe"
                    >

                </div>


                <div class="form-group">

                    <label for="contactPhone">
                        Phone Number
                    </label>

                    <input
                        type="tel"
                        id="contactPhone"
                        placeholder="+91 9876543210"
                    >

                </div>


                <div class="form-group">

                    <label for="contactEmail">
                        Email
                    </label>

                    <input
                        type="email"
                        id="contactEmail"
                        placeholder="john@example.com"
                    >

                </div>


                <div class="form-group">

                    <label for="contactOrganization">
                        Organization
                    </label>

                    <input
                        type="text"
                        id="contactOrganization"
                        placeholder="Company / Organization"
                    >

                </div>
            `

        },


        upi: {

            title: "UPI QR Code",

            fields: `
                <div class="form-group">

                    <label for="upiId">
                        UPI ID
                    </label>

                    <input
                        type="text"
                        id="upiId"
                        placeholder="yourname@upi"
                    >

                </div>


                <div class="form-group">

                    <label for="upiName">
                        Payee Name
                    </label>

                    <input
                        type="text"
                        id="upiName"
                        placeholder="Your Name"
                    >

                </div>


                <div class="form-group">

                    <label for="upiAmount">
                        Amount (Optional)
                    </label>

                    <input
                        type="number"
                        id="upiAmount"
                        placeholder="100"
                        min="0"
                        step="0.01"
                    >

                </div>
            `

        },


        text: {

            title: "Text QR Code",

            fields: `
                <div class="form-group">

                    <label for="textContent">
                        Your Text
                    </label>

                    <textarea
                        id="textContent"
                        rows="6"
                        placeholder="Enter any text you want to convert into a QR code."
                    ></textarea>

                </div>
            `

        }

    };


    // =====================================================
    // GENERATOR CARDS
    // =====================================================

    const generatorCards =
        document.querySelectorAll(
            ".generator-card"
        );


    generatorCards.forEach(function (card) {

        card.addEventListener(
            "click",
            function () {

                const type =
                    card.getAttribute(
                        "data-generator"
                    );

                openGenerator(type);

            }
        );

    });


    // =====================================================
    // OPEN GENERATOR
    // =====================================================

    function openGenerator(type) {

        if (!generatorInfo[type]) {
            return;
        }

        currentGenerator = type;

        currentQRSize = 500;

        generatorTitle.textContent =
            generatorInfo[type].title;


        formContainer.innerHTML = `
            ${generatorInfo[type].fields}


            <div class="form-group qr-size-group">

                <label for="qrSize">
                    QR Code Size
                </label>

                <select id="qrSize">

                    <option value="300">
                        300 × 300
                    </option>

                    <option
                        value="500"
                        selected
                    >
                        500 × 500
                    </option>

                    <option value="800">
                        800 × 800
                    </option>

                </select>

            </div>


            <button
                id="backToGenerators"
                type="button"
                class="back-button"
            >
                ← Back to Generators
            </button>
        `;


        generatorPanel.classList.add(
            "active"
        );


        qrPreview.innerHTML = `
            <div class="qr-placeholder">

                <div class="placeholder-icon">
                    ▦
                </div>

                <strong>
                    Your QR code will appear here
                </strong>

                <span>
                    Enter your information and click
                    Generate QR Code.
                </span>

            </div>
        `;


        const qrSize =
            document.getElementById(
                "qrSize"
            );


        if (qrSize) {

            qrSize.addEventListener(
                "change",
                function () {

                    currentQRSize =
                        Number(
                            this.value
                        );

                }
            );

        }


        const backButton =
            document.getElementById(
                "backToGenerators"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                function () {

                    generatorPanel.classList.remove(
                        "active"
                    );


                    const generatorsSection =
                        document.querySelector(
                            ".generators-section"
                        );


                    if (generatorsSection) {

                        window.scrollTo({

                            top:
                                generatorsSection.offsetTop - 70,

                            behavior:
                                "smooth"

                        });

                    }

                }
            );

        }


        setTimeout(
            function () {

                generatorPanel.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            },
            50
        );

    }


    // =====================================================
    // CLOSE GENERATOR
    // =====================================================

    if (closeGenerator) {

        closeGenerator.addEventListener(
            "click",
            function () {

                generatorPanel.classList.remove(
                    "active"
                );

            }
        );

    }


    // =====================================================
    // GENERATE BUTTON
    // =====================================================

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            function () {

                let data = "";


                // =========================================
                // WEBSITE
                // =========================================

                if (
                    currentGenerator === "website"
                ) {

                    const input =
                        document.getElementById(
                            "websiteUrl"
                        );


                    if (
                        !input ||
                        !input.value.trim()
                    ) {

                        showError(
                            "Please enter a website URL."
                        );

                        return;

                    }


                    const url =
                        input.value.trim();


                    try {

                        new URL(url);

                    } catch (error) {

                        showError(
                            "Please enter a valid website URL, such as https://example.com"
                        );

                        return;

                    }


                    data = url;

                }


                // =========================================
                // WIFI
                // =========================================

                else if (
                    currentGenerator === "wifi"
                ) {

                    const name =
                        document.getElementById(
                            "wifiName"
                        ).value.trim();


                    const password =
                        document.getElementById(
                            "wifiPassword"
                        ).value;


                    const security =
                        document.getElementById(
                            "wifiSecurity"
                        ).value;


                    if (!name) {

                        showError(
                            "Please enter the Wi-Fi name."
                        );

                        return;

                    }


                    if (
                        security !== "nopass" &&
                        !password
                    ) {

                        showError(
                            "Please enter the Wi-Fi password."
                        );

                        return;

                    }


                    data =
                        `WIFI:T:${security};S:${escapeWifi(name)};P:${escapeWifi(password)};;`;

                }


                // =========================================
                // WHATSAPP
                // =========================================

                else if (
                    currentGenerator === "whatsapp"
                ) {

                    const number =
                        document.getElementById(
                            "whatsappNumber"
                        ).value.trim();


                    const message =
                        document.getElementById(
                            "whatsappMessage"
                        ).value.trim();


                    if (!number) {

                        showError(
                            "Please enter a WhatsApp number."
                        );

                        return;

                    }


                    const cleanNumber =
                        number.replace(
                            /[^\d]/g,
                            ""
                        );


                    if (
                        cleanNumber.length < 8
                    ) {

                        showError(
                            "Please enter a valid WhatsApp number."
                        );

                        return;

                    }


                    data =
                        `https://wa.me/${cleanNumber}`;


                    if (message) {

                        data +=
                            `?text=${encodeURIComponent(message)}`;

                    }

                }


                // =========================================
                // CONTACT
                // =========================================

                else if (
                    currentGenerator === "contact"
                ) {

                    const name =
                        document.getElementById(
                            "contactName"
                        ).value.trim();


                    const phone =
                        document.getElementById(
                            "contactPhone"
                        ).value.trim();


                    const email =
                        document.getElementById(
                            "contactEmail"
                        ).value.trim();


                    const organization =
                        document.getElementById(
                            "contactOrganization"
                        ).value.trim();


                    if (!name) {

                        showError(
                            "Please enter the contact name."
                        );

                        return;

                    }


                    data =
`BEGIN:VCARD
VERSION:3.0
FN:${escapeVCard(name)}
ORG:${escapeVCard(organization)}
TEL:${escapeVCard(phone)}
EMAIL:${escapeVCard(email)}
END:VCARD`;

                }


                // =========================================
                // UPI
                // =========================================

                else if (
                    currentGenerator === "upi"
                ) {

                    const upiId =
                        document.getElementById(
                            "upiId"
                        ).value.trim();


                    const upiName =
                        document.getElementById(
                            "upiName"
                        ).value.trim();


                    const amount =
                        document.getElementById(
                            "upiAmount"
                        ).value.trim();


                    if (!upiId) {

                        showError(
                            "Please enter your UPI ID."
                        );

                        return;

                    }


                    data =
                        `upi://pay?pa=${encodeURIComponent(upiId)}`;


                    if (upiName) {

                        data +=
                            `&pn=${encodeURIComponent(upiName)}`;

                    }


                    if (amount) {

                        data +=
                            `&am=${encodeURIComponent(amount)}`;

                    }


                    data +=
                        "&cu=INR";

                }


                // =========================================
                // TEXT
                // =========================================

                else if (
                    currentGenerator === "text"
                ) {

                    const text =
                        document.getElementById(
                            "textContent"
                        ).value.trim();


                    if (!text) {

                        showError(
                            "Please enter some text."
                        );

                        return;

                    }


                    data = text;

                }


                // =========================================
                // CHECK DATA
                // =========================================

                if (!data) {

                    showError(
                        "Please enter the required information."
                    );

                    return;

                }


                lastQRData = data;


                createQRCode(data);

            }
        );

    }


    // =====================================================
    // CLEAR
    // =====================================================

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            function () {

                const inputs =
                    formContainer.querySelectorAll(
                        "input, textarea"
                    );


                inputs.forEach(
                    function (input) {

                        input.value = "";

                    }
                );


                const qrSize =
                    document.getElementById(
                        "qrSize"
                    );


                if (qrSize) {

                    qrSize.value =
                        "500";

                    currentQRSize =
                        500;

                }


                generateButton.disabled =
                    false;


                generateButton.textContent =
                    "Generate QR Code";


                qrPreview.innerHTML = `
                    <div class="qr-placeholder">

                        <div class="placeholder-icon">
                            ▦
                        </div>

                        <strong>
                            Your QR code will appear here
                        </strong>

                        <span>
                            Enter your information and click
                            Generate QR Code.
                        </span>

                    </div>
                `;

            }
        );

    }


    // =====================================================
    // CREATE QR CODE
    // =====================================================

    function createQRCode(data) {

        // -----------------------------------------------
        // SHOW LOADING STATE
        // -----------------------------------------------

        generateButton.disabled =
            true;

        generateButton.textContent =
            "Generating...";


        qrPreview.innerHTML = `
            <div class="qr-loading">

                <div class="loading-icon"></div>

                <strong>
                    Creating your QR code...
                </strong>

                <span>
                    Please wait a moment.
                </span>

            </div>
        `;


        const encodedData =
            encodeURIComponent(data);


        const qrURL =
            `https://api.qrserver.com/v1/create-qr-code/?size=${currentQRSize}x${currentQRSize}&margin=10&data=${encodedData}`;


        lastQRImageURL =
            qrURL;


        // -----------------------------------------------
        // PRELOAD IMAGE
        // -----------------------------------------------

        const image =
            new Image();


        image.onload =
            function () {

                generateButton.disabled =
                    false;

                generateButton.textContent =
                    "Generate QR Code";


                qrPreview.innerHTML = `
                    <div class="qr-result">

                        <div class="qr-result-header">

                            <div class="qr-result-title">
                                Your QR Code is Ready
                            </div>

                            <div class="qr-result-subtitle">
                                ${currentQRSize} × ${currentQRSize} PNG
                            </div>

                        </div>


                        <div class="qr-image-wrapper">

                            <img
                                id="qrImage"
                                src="${qrURL}"
                                alt="Generated QR Code"
                            >

                        </div>


                        <div class="qr-success-message">
                            ✓ QR code generated successfully
                        </div>


                        <div class="qr-actions">

                            <button
                                class="download-button"
                                id="downloadQR"
                                type="button"
                            >
                                Download PNG
                            </button>


                            <button
                                class="copy-button"
                                id="copyQR"
                                type="button"
                            >
                                Copy QR
                            </button>


                            <button
                                class="regenerate-button"
                                id="regenerateQR"
                                type="button"
                            >
                                Regenerate
                            </button>

                        </div>

                    </div>
                `;


                setupQRButtons();

            };


        image.onerror =
            function () {

                generateButton.disabled =
                    false;

                generateButton.textContent =
                    "Generate QR Code";


                showError(
                    "Unable to create the QR code. Please check your internet connection and try again."
                );

            };


        image.src =
            qrURL;

    }


    // =====================================================
    // QR BUTTONS
    // =====================================================

    function setupQRButtons() {

        // -----------------------------------------------
        // DOWNLOAD
        // -----------------------------------------------

        const downloadQR =
            document.getElementById(
                "downloadQR"
            );


        if (downloadQR) {

            downloadQR.addEventListener(
                "click",
                async function () {

                    const originalText =
                        downloadQR.textContent;


                    downloadQR.textContent =
                        "Preparing...";


                    downloadQR.disabled =
                        true;


                    try {

                        const response =
                            await fetch(
                                lastQRImageURL
                            );


                        if (!response.ok) {

                            throw new Error(
                                "Download request failed."
                            );

                        }


                        const blob =
                            await response.blob();


                        const blobURL =
                            URL.createObjectURL(
                                blob
                            );


                        const link =
                            document.createElement(
                                "a"
                            );


                        link.href =
                            blobURL;


                        link.download =
                            `qr-maker-${currentGenerator}-${currentQRSize}x${currentQRSize}.png`;


                        document.body.appendChild(
                            link
                        );


                        link.click();


                        document.body.removeChild(
                            link
                        );


                        URL.revokeObjectURL(
                            blobURL
                        );


                        showTemporaryMessage(
                            downloadQR,
                            "Downloaded!"
                        );


                    } catch (error) {

                        const link =
                            document.createElement(
                                "a"
                            );


                        link.href =
                            lastQRImageURL;


                        link.target =
                            "_blank";


                        link.rel =
                            "noopener noreferrer";


                        document.body.appendChild(
                            link
                        );


                        link.click();


                        document.body.removeChild(
                            link
                        );


                        showTemporaryMessage(
                            downloadQR,
                            "Opened QR"
                        );

                    }


                    setTimeout(
                        function () {

                            downloadQR.disabled =
                                false;

                            downloadQR.textContent =
                                originalText;

                        },
                        1800
                    );

                }
            );

        }


        // -----------------------------------------------
        // COPY
        // -----------------------------------------------

        const copyQR =
            document.getElementById(
                "copyQR"
            );


        if (copyQR) {

            copyQR.addEventListener(
                "click",
                async function () {

                    const originalText =
                        copyQR.textContent;


                    copyQR.textContent =
                        "Copying...";


                    copyQR.disabled =
                        true;


                    try {

                        const response =
                            await fetch(
                                lastQRImageURL
                            );


                        if (!response.ok) {

                            throw new Error(
                                "Unable to fetch QR image."
                            );

                        }


                        const blob =
                            await response.blob();


                        if (
                            navigator.clipboard &&
                            window.ClipboardItem
                        ) {

                            const item =
                                new ClipboardItem({

                                    [blob.type]:
                                        blob

                                });


                            await navigator.clipboard.write([
                                item
                            ]);


                            showTemporaryMessage(
                                copyQR,
                                "Copied!"
                            );

                        } else {

                            showTemporaryMessage(
                                copyQR,
                                "Copy unavailable"
                            );

                        }

                    } catch (error) {

                        showTemporaryMessage(
                            copyQR,
                            "Copy unavailable"
                        );

                    }


                    setTimeout(
                        function () {

                            copyQR.disabled =
                                false;

                            copyQR.textContent =
                                originalText;

                        },
                        1800
                    );

                }
            );

        }


        // -----------------------------------------------
        // REGENERATE
        // -----------------------------------------------

        const regenerateQR =
            document.getElementById(
                "regenerateQR"
            );


        if (regenerateQR) {

            regenerateQR.addEventListener(
                "click",
                function () {

                    if (lastQRData) {

                        createQRCode(
                            lastQRData
                        );

                    }

                }
            );

        }

    }


    // =====================================================
    // WIFI ESCAPE
    // =====================================================

    function escapeWifi(value) {

        return value

            .replace(
                /\\/g,
                "\\\\"
            )

            .replace(
                /;/g,
                "\\;"
            )

            .replace(
                /,/g,
                "\\,"
            )

            .replace(
                /:/g,
                "\\:"
            );

    }


    // =====================================================
    // VCARD ESCAPE
    // =====================================================

    function escapeVCard(value) {

        return value

            .replace(
                /\\/g,
                "\\\\"
            )

            .replace(
                /\n/g,
                "\\n"
            )

            .replace(
                /;/g,
                "\\;"
            )

            .replace(
                /,/g,
                "\\,"
            );

    }


    // =====================================================
    // ERROR
    // =====================================================

    function showError(message) {

        qrPreview.innerHTML = `
            <div class="qr-placeholder">

                <div class="placeholder-icon">
                    !
                </div>

                <strong>
                    ${message}
                </strong>

                <span>
                    Please check the information above
                    and try again.
                </span>

            </div>
        `;

    }


    // =====================================================
    // TEMPORARY BUTTON MESSAGE
    // =====================================================

    function showTemporaryMessage(
        button,
        message
    ) {

        button.textContent =
            message;

        setTimeout(
            function () {

                if (button.id === "downloadQR") {

                    button.textContent =
                        "Download PNG";

                }

                else if (button.id === "copyQR") {

                    button.textContent =
                        "Copy QR";

                }

            },
            1800
        );

    }

});