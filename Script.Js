
// =================================
// VILGAI TOOL ANALYZER
// MAIN SCRIPT
// =================================

let socket;
let tickCount = 0;
let prices = [];

// Connect to WebSocket
function connectToDeriv() {

    socket = new WebSocket(
        "wss://ws.derivws.com/websockets/v3?app_id=1089"
    );

    socket.onopen = function () {

        console.log("Connected to Deriv");

        socket.send(JSON.stringify({
            ticks: "R_10",
            subscribe: 1
        }));
    };

    socket.onmessage = function (event) {

        const data = JSON.parse(event.data);

        if (data.tick) {

            tickCount++;

            const price = data.tick.quote;

            prices.push(price);

            // Keep only last 100 ticks
            if (prices.length > 100) {
                prices.shift();
            }

            // Update tick count
            const tickElement =
                document.getElementById("tickCount");

            if (tickElement) {
                tickElement.textContent = tickCount;
            }

            // Update current price
            const priceElement =
                document.getElementById("currentPrice");

            if (priceElement) {
                priceElement.textContent =
                    Number(price).toFixed(2);
            }

            console.log("New tick:", price);

            // Update analysis
            updateAnalysis();
        }
    };

    socket.onerror = function () {

        console.log("Connection error");

        const status =
            document.getElementById("engineStatus");

        if (status) {
            status.textContent = "ERROR";
        }
    };

    socket.onclose = function () {

        console.log("Disconnected");

        const status =
            document.getElementById("engineStatus");

        if (status) {
            status.textContent = "DISCONNECTED";
        }
    };
}


// =================================
// ANALYSIS
// =================================

function updateAnalysis() {

    if (prices.length === 0) {
        return;
    }

    let even = 0;
    let odd = 0;
    let over = 0;
    let under = 0;

    prices.forEach(function(price) {

        const text = price.toString();

        const lastDigit =
            Number(text[text.length - 1]);

        // Even / Odd
        if (lastDigit % 2 === 0) {
            even++;
        } else {
            odd++;
        }

        // Over / Under 5
        if (lastDigit >= 5) {
            over++;
        } else {
            under++;
        }
    });

    const total = prices.length;

    const evenPercent =
        Math.round((even / total) * 100);

    const oddPercent =
        Math.round((odd / total) * 100);

    const overPercent =
        Math.round((over / total) * 100);

    const underPercent =
        Math.round((under / total) * 100);


    // Update Even / Odd
    const evenElement =
        document.getElementById("evenPercent");

    const oddElement =
        document.getElementById("oddPercent");

    if (evenElement) {
        evenElement.textContent =
            evenPercent + "%";
    }

    if (oddElement) {
        oddElement.textContent =
            oddPercent + "%";
    }


    // Update Over / Under
    const overElement =
        document.getElementById("overPercent");

    const underElement =
        document.getElementById("underPercent");

    if (overElement) {
        overElement.textContent =
            overPercent + "%";
    }

    if (underElement) {
        underElement.textContent =
            underPercent + "%";
    }
}


// =================================
// RESET ANALYSIS
// =================================

function resetAnalysis() {

    tickCount = 0;

    prices = [];

    const tickElement =
        document.getElementById("tickCount");

    const priceElement =
        document.getElementById("currentPrice");

    if (tickElement) {
        tickElement.textContent = "0";
    }

    if (priceElement) {
        priceElement.textContent = "0.00";
    }

    console.log("Analysis reset");
}


// =================================
// BUTTONS
// =================================

const analyzeButton =
    document.getElementById("analyzeButton");

if (analyzeButton) {

    analyzeButton.addEventListener(
        "click",
        function() {

            connectToDeriv();

            const status =
                document.getElementById("engineStatus");

            if (status) {
                status.textContent = "RUNNING";
            }
        }
    );
}


const resetButton =
    document.getElementById("resetButton");

if (resetButton) {

    resetButton.addEventListener(
        "click",
        resetAnalysis
    );
}let socket;
let tickCount = 0;
let prices = [];

function connectToDeriv() {
    socket = new WebSocket(
        "wss://ws.derivws.com/websockets/v3?app_id=1089"
    );

    socket.onopen = function () {
        console.log("Connected to Deriv");

        document.getElementById("engineStatus").textContent = "CONNECTED";

        socket.send(JSON.stringify({
            ticks: "R_10",
            subscribe: 1
        }));
    };

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);

        if (data.tick) {
            tickCount++;

            const price = data.tick.quote;

            prices.push(price);

            if (prices.length > 100) {
                prices.shift();
            }

            const tickElement =
                document.getElementById("tickCount");

            const priceElement =
                document.getElementById("currentPrice");

            if (tickElement) {
                tickElement.textContent = tickCount;
            }

            if (priceElement) {
                priceElement.textContent =
                    Number(price).toFixed(2);
            }

            updateAnalysis();
        }
    };

    socket.onerror = function () {
        document.getElementById("engineStatus").textContent =
            "ERROR";
    };

    socket.onclose = function () {
        document.getElementById("engineStatus").textContent =
            "DISCONNECTED";
    };
}

function updateAnalysis() {
    if (prices.length < 2) {
        return;
    }

    const lastPrice = prices[prices.length - 1];

    const lastDigit = Number(
        String(lastPrice).replace(".", "").slice(-1)
    );

    const digitContainer =
        document.getElementById("digitContainer");

    if (digitContainer) {
        digitContainer.innerHTML = "";

        const digitElement = document.createElement("span");

        digitElement.textContent = lastDigit;

        digitContainer.appendChild(digitElement);
    }

    const signalElement =
        document.getElementById("signalStrength");

    if (signalElement) {
        signalElement.textContent = "50%";
    }
}

function resetAnalysis() {
    tickCount = 0;
    prices = [];

    document.getElementById("tickCount").textContent = "0";
    document.getElementById("currentPrice").textContent = "0.00";
    document.getElementById("signalStrength").textContent = "0%";
    document.getElementById("engineStatus").textContent = "READY";

    document.getElementById("digitContainer").innerHTML =
        "<span>-</span><span>-</span><span>-</span><span>-</span><span>-</span>";
}

document
    .getElementById("analyzeButton")
    .addEventListener("click", function () {
        connectToDeriv();
    });

document
    .getElementById("resetButton")
    .addEventListener("click", function () {
        resetAnalysis();
    }); 