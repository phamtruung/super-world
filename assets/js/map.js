const svg =
    document.getElementById(
        "world-map"
    );

const mapGroup =
    document.getElementById(
        "map-group"
    );

const tooltip =
    document.getElementById(
        "tooltip"
    );

let scale = 1;

let translateX = 0;
let translateY = 0;

let isDragging = false;

let startX = 0;
let startY = 0;

let initialPinchDistance = null;

/**
 * Chuyển lon/lat sang SVG
 */
function project(lon, lat)
{
    const x =
        (lon + 180) * 5;

    const y =
        (90 - lat) * 5;

    return [x, y];
}

/**
 * Cập nhật zoom + pan
 */
function updateTransform()
{
    mapGroup.setAttribute(
        "transform",
        `translate(${translateX},${translateY}) scale(${scale})`
    );
}

/**
 * Khoảng cách 2 ngón tay
 */
function getTouchDistance(
    touch1,
    touch2
)
{
    const dx =
        touch2.clientX -
        touch1.clientX;

    const dy =
        touch2.clientY -
        touch1.clientY;

    return Math.sqrt(
        dx * dx + dy * dy
    );
}

/**
 * Vẽ quốc gia
 */
function drawFeature(feature)
{
    const id =
        feature.id;

    const name =
        feature.properties?.name ||
        "Unknown";

    const geometry =
        feature.geometry;

    if(
        geometry.type !== "Polygon"
        &&
        geometry.type !== "MultiPolygon"
    )
    {
        return;
    }

    let polygons = [];

    if(
        geometry.type === "Polygon"
    )
    {
        polygons = [
            geometry.coordinates
        ];
    }

    if(
        geometry.type ===
        "MultiPolygon"
    )
    {
        polygons =
            geometry.coordinates;
    }

    polygons.forEach(
        polygon =>
        {
            polygon.forEach(
                ring =>
                {
                    const points =
                        ring
                        .map(coord =>
                        {
                            const [
                                x,
                                y
                            ] =
                                project(
                                    coord[0],
                                    coord[1]
                                );

                            return `${x},${y}`;
                        })
                        .join(" ");

                    const node =
                        document
                        .createElementNS(
                            "http://www.w3.org/2000/svg",
                            "polygon"
                        );

                    node.setAttribute(
                        "points",
                        points
                    );

                    node.classList.add(
                        "country"
                    );

                    node.addEventListener(
                        "mouseenter",
                        () =>
                        {
                            tooltip.style.display =
                                "block";

                            tooltip.innerHTML =
                            `
                                <div>
                                    <b>${id}</b>
                                    <br>
                                    ${name}
                                </div>
                            `;
                        }
                    );

                    node.addEventListener(
                        "mousemove",
                        (e) =>
                        {
                            tooltip.style.left =
                                (
                                    e.pageX + 10
                                ) + "px";

                            tooltip.style.top =
                                (
                                    e.pageY + 10
                                ) + "px";
                        }
                    );

                    node.addEventListener(
                        "mouseleave",
                        () =>
                        {
                            tooltip.style.display =
                                "none";
                        }
                    );

                    node.addEventListener(
                        "click",
                        () =>
                        {
                            const country =
                                countriesData[
                                    id
                                ];

                            if(country)
                            {
                                showCountry(
                                    country
                                );
                            }
                        }
                    );

                    mapGroup.appendChild(
                        node
                    );
                }
            );
        }
    );
}

/**
 * Load GeoJSON
 */
async function initializeMap()
{
    try
    {
        const response =
            await fetch(
                "geo/countries.geojson"
            );

        const geoData =
            await response.json();

        geoData.features.forEach(
            feature =>
            {
                drawFeature(
                    feature
                );
            }
        );

        console.log(
            "Map loaded."
        );
    }
    catch(error)
    {
        console.error(
            error
        );
    }
}

/* ==========================
   ZOOM CHUỘT
========================== */

svg.addEventListener(
    "wheel",
    (e) =>
    {
        e.preventDefault();

        const rect =
            svg
            .getBoundingClientRect();

        const mouseX =
            e.clientX - rect.left;

        const mouseY =
            e.clientY - rect.top;

        const oldScale =
            scale;

        if(e.deltaY < 0)
        {
            scale *= 1.05;
        }
        else
        {
            scale *= 0.95;
        }

        scale = Math.max(
            0.3,
            Math.min(scale,20)
        );

        const worldX =
            (
                mouseX
                -
                translateX
            )
            /
            oldScale;

        const worldY =
            (
                mouseY
                -
                translateY
            )
            /
            oldScale;

        translateX =
            mouseX -
            (
                worldX * scale
            );

        translateY =
            mouseY -
            (
                worldY * scale
            );

        updateTransform();
    }
);

/* ==========================
   PAN CHUỘT
========================== */

svg.addEventListener(
    "mousedown",
    (e) =>
    {
        isDragging = true;

        startX =
            e.clientX;

        startY =
            e.clientY;
    }
);

svg.addEventListener(
    "mousemove",
    (e) =>
    {
        if(!isDragging)
            return;

        translateX +=
            e.clientX -
            startX;

        translateY +=
            e.clientY -
            startY;

        startX =
            e.clientX;

        startY =
            e.clientY;

        updateTransform();
    }
);

svg.addEventListener(
    "mouseup",
    () =>
    {
        isDragging = false;
    }
);

svg.addEventListener(
    "mouseleave",
    () =>
    {
        isDragging = false;
    }
);

/* ==========================
   TOUCH PAN
========================== */

svg.addEventListener(
    "touchstart",
    (e) =>
    {
        if(
            e.touches.length === 1
        )
        {
            isDragging = true;

            startX =
                e.touches[0]
                .clientX;

            startY =
                e.touches[0]
                .clientY;
        }

        if(
            e.touches.length === 2
        )
        {
            initialPinchDistance =
                getTouchDistance(
                    e.touches[0],
                    e.touches[1]
                );
        }
    },
    {
        passive:false
    }
);

svg.addEventListener(
    "touchmove",
    (e) =>
    {
        if(
            e.touches.length === 1
            &&
            isDragging
        )
        {
            e.preventDefault();

            const touch =
                e.touches[0];

            translateX +=
                touch.clientX -
                startX;

            translateY +=
                touch.clientY -
                startY;

            startX =
                touch.clientX;

            startY =
                touch.clientY;

            updateTransform();
        }

        if(
            e.touches.length === 2
        )
        {
            e.preventDefault();

            const currentDistance =
                getTouchDistance(
                    e.touches[0],
                    e.touches[1]
                );

            if(
                initialPinchDistance
            )
            {
                const zoom =
                    currentDistance /
                    initialPinchDistance;

                scale *= zoom;

                scale = Math.max(
                    0.3,
                    Math.min(scale,20)
                );

                updateTransform();
            }

            initialPinchDistance =
                currentDistance;
        }
    },
    {
        passive:false
    }
);

svg.addEventListener(
    "touchend",
    () =>
    {
        isDragging = false;
        initialPinchDistance =
            null;
    }
);

svg.addEventListener(
    "touchcancel",
    () =>
    {
        isDragging = false;
        initialPinchDistance =
            null;
    }
);

/* ==========================
   RESET
========================== */

const resetButton =
    document.getElementById(
        "resetMap"
    );

if(resetButton)
{
    resetButton.addEventListener(
        "click",
        () =>
        {
            scale = 1;

            translateX = 0;
            translateY = 0;

            updateTransform();
        }
    );
}