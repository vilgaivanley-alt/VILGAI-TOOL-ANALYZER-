
// ================================
// VILGAI TOOL ANALYZER
// DERIV WEBSOCKET CONNECTION
// ================================

let socket;
let tickCount = 0;

// Connect to Deriv WebSocket
function connectToDeriv() {

    socket = new WebSocket(
        "wss://ws.derivws.com/websockets/v3?app_id=1089"
    );

    // When connected
    socket.onopen = function () {

        console.log("Connected to Deriv");

        // Subscribe to Volatility 10 Index
        socket.send(JSON.stringify({
            ticks: "R_10",
            subscribe: 1
        }));
    };

    // When new market data arrives
    socket.onmessage = function (event) {

        const data = JSON.parse(event.data);

        if (data.tick) {

            tickCount++;

            const price = data.tick.quote;

            console.log("New tick:", price);

            // Update the dashboard
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
        }
    };

    // If connection closes
    socket.onclose = function () {

        console.log("Connection closed");

        setTimeout(function () {
            connectToDeriv();
        }, 3000);
    };

    // If there is an error
    socket.onerror = function (error) {

        console.log("WebSocket error:", error);
    };
}

// Start the connection
connectToDeriv();