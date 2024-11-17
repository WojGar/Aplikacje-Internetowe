let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

let placedPieces = 0;
const totalPieces = 16;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log(position);
        },
        (error) => {
            console.error(error);
        }
    );
} else {
    console.log("Geolokalizacja jest niedostępna");
}

if (Notification.permission !== "granted") {
    Notification.requestPermission().then(function(permission) {
        console.log(permission);
    });
}

document.getElementById("getLocation").addEventListener("click", function () {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            map.setView([lat, lon]);
            marker.setLatLng([lat, lon]);
            document.getElementById("coordinates").textContent = `Twoja lokalizacja: ${lat}, ${lon}`;
        },
        (positionError) => {
            console.error(positionError);
        }
    );
});

document.getElementById("saveButton").addEventListener("click", function () {
    leafletImage(map, function (err, canvas) {
        if (err) {
            console.error("Error generating map image:", err);
            return;
        }

        let mapImageCanvas = document.getElementById("mapImageCanvas");
        let mapImageContext = mapImageCanvas.getContext("2d");
        mapImageContext.clearRect(0, 0, mapImageCanvas.width, mapImageCanvas.height);
        mapImageContext.drawImage(canvas, 0, 0, 600, 300);

        const puzzlePieces = [];
        const pieceWidth = canvas.width / 4;
        const pieceHeight = canvas.height / 4;

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const pieceCanvas = document.createElement("canvas");
                pieceCanvas.width = pieceWidth;
                pieceCanvas.height = pieceHeight;
                const pieceContext = pieceCanvas.getContext("2d");

                pieceContext.drawImage(
                    canvas,
                    col * pieceWidth,
                    row * pieceHeight,
                    pieceWidth,
                    pieceHeight,
                    0,
                    0,
                    pieceWidth,
                    pieceHeight
                );

                puzzlePieces.push(pieceCanvas);
            }
        }

        const puzzleContainer = document.getElementById("puzzleContainer");
        drawGridOnCanvas(puzzleCanvas, 4, 4);
        puzzleContainer.innerHTML = "";
        shuffleArray(puzzlePieces).forEach((piece, index) => {
            const puzzlePieceDiv = document.createElement("div");
            puzzlePieceDiv.draggable = true;
            puzzlePieceDiv.style.margin = "2px";
            puzzlePieceDiv.appendChild(piece);
            puzzlePieceDiv.dataset.index = index;

            puzzlePieceDiv.addEventListener("dragstart", dragStart);
            puzzlePieceDiv.addEventListener("dragover", dragOver);
            puzzlePieceDiv.addEventListener("drop", drop);

            puzzleContainer.appendChild(puzzlePieceDiv);
        });
    });
});

let draggedElement = null;

function dragStart(event) {
    draggedElement = event.target;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    if (draggedElement) {
        const target = event.target.closest("div");
        if (target && target !== draggedElement) {
            const targetParent = target.parentNode;
            const draggedParent = draggedElement.parentNode;

            targetParent.replaceChild(draggedElement, target);
            draggedParent.appendChild(target);

            placedPieces++;

            checkCompletion();
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const puzzleCanvas = document.getElementById("puzzleCanvas");
const puzzleCanvasContext = puzzleCanvas.getContext("2d");

puzzleCanvas.addEventListener("dragover", dragOver);
puzzleCanvas.addEventListener("drop", function (event) {
    event.preventDefault();

    if (!draggedElement) return;

    const pieceIndex = draggedElement.dataset.index;
    const pieceCanvas = draggedElement.querySelector("canvas");

    const rect = puzzleCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pieceWidth = puzzleCanvas.width / 4;
    const pieceHeight = puzzleCanvas.height / 4;

    const gridX = Math.floor(x / pieceWidth);
    const gridY = Math.floor(y / pieceHeight);

    const targetX = gridX * pieceWidth;
    const targetY = gridY * pieceHeight;

    puzzleCanvasContext.clearRect(targetX, targetY, pieceWidth, pieceHeight);
    puzzleCanvasContext.drawImage(pieceCanvas, targetX, targetY, pieceWidth, pieceHeight);

    draggedElement.parentNode.removeChild(draggedElement);

    placedPieces++;

    checkCompletion();
});

function checkCompletion() {
    if (placedPieces === totalPieces) {
        if (Notification.permission === "granted") {
            new Notification("Gratulacje! Wszystkie puzzle zostały ułożone!");
        }

        console.log("Gratulacje! Wszystkie puzzle zostały ułożone!");
    }
}

function drawGridOnCanvas(canvas, rows, cols) {
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const cellWidth = width / cols;
    const cellHeight = height / rows;

    context.strokeStyle = "#cccccc";
    context.lineWidth = 1;

    for (let col = 1; col < cols; col++) {
        const x = col * cellWidth;
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
    }

    for (let row = 1; row < rows; row++) {
        const y = row * cellHeight;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
    }
}
