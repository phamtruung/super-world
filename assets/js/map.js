let heatmapEnabled = false;
let selectedCountry = null;
let heatmapMode =
    "none";

const countryLayers = {};

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

function getGDPPerCapita(country)
{
    const gdp =
        Number(country.gdp);

    const population =
        Number(
            country.population
        );

    if(
        !gdp ||
        !population
    )
    {
        return 0;
    }

    return (
        gdp * 1000000
    ) / population;
}

function getPopulationDensity(
    country
)
{
    const population =
        Number(
            country.population
        );

    const area =
        Number(
            country.area_sq_km
        );

    if(
        !population ||
        !area
    )
    {
        return 0;
    }

    return population / area;
}

function getHeatColor(
    value,
    min,
    max
)
{
    if(
        !value ||
        value <= 0
    )
    {
        return "#fcfbfb";
    }

    const t =
        (
            Math.log(value)
            -
            Math.log(min)
        )
        /
        (
            Math.log(max)
            -
            Math.log(min)
        );

    const hue =
        240 - (240 * t);

    return `hsl(${hue},70%,50%)`;
}

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
                            if(selectedCountry)
                            {
                                selectedCountry.classList.remove(
                                    "selected"
                                );
                            }

                            node.classList.add(
                                "selected"
                            );

                            selectedCountry =
                                node;

                            const country =
                                countriesData[id];

                            if(country)
                            {
                                showCountry(country);
                            }
                        }
                    );

                    if(!countryLayers[id])
                    {
                        countryLayers[id] = [];
                    }

                    countryLayers[id].push(node);

                    mapGroup.appendChild(node);

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

        if (e.touches.length === 2)
        {
            e.preventDefault();

            const touch1 =
                e.touches[0];

            const touch2 =
                e.touches[1];

            const currentDistance =
                getTouchDistance(
                    touch1,
                    touch2
                );

            if (initialPinchDistance)
            {
                const rect =
                    svg.getBoundingClientRect();

                const centerX =
                    (
                        touch1.clientX +
                        touch2.clientX
                    ) / 2 - rect.left;

                const centerY =
                    (
                        touch1.clientY +
                        touch2.clientY
                    ) / 2 - rect.top;

                const oldScale =
                    scale;

                const zoomFactor =
                    currentDistance /
                    initialPinchDistance;

                scale *= zoomFactor;

                scale = Math.max(
                    0.3,
                    Math.min(scale,20)
                );

                const worldX =
                    (
                        centerX -
                        translateX
                    ) / oldScale;

                const worldY =
                    (
                        centerY -
                        translateY
                    ) / oldScale;

                translateX =
                    centerX -
                    worldX * scale;

                translateY =
                    centerY -
                    worldY * scale;

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

function applyGDPHeatmap()
{
    const values = [];

    Object.values(
        countriesData
    ).forEach(country =>
    {
        const value =
            getGDPPerCapita(
                country
            );

        if(value > 0)
        {
            values.push(
                value
            );
        }
    });

    const min =
        Math.min(...values);

    const max =
        Math.max(...values);

    Object.entries(
        countriesData
    ).forEach(
        ([iso3,country]) =>
        {
            const value =
                getGDPPerCapita(
                    country
                );

            const color =
                getHeatColor(
                    value,
                    min,
                    max
                );

            const polygons =
                countryLayers[
                    iso3
                ];

            if(!polygons)
                return;

            polygons.forEach(
                polygon =>
                {
                    polygon.style.fill =
                        color;
                }
            );
        }
    );
}
function densityColor(density)
{
    if (density < 1)
    {
        return "rgb(230, 243, 225)";
    }

    if (density < 10)
    {
        return "rgb(173, 218, 143)";
    }

    if (density < 50)
    {
        return "rgb(165, 209, 45)";
    }

    if (density < 100)
    {
        return "rgb(224, 221, 47)";
    }

    if (density < 200)
    {
        return "rgb(219, 160, 49)";
    }
    if (density < 300)
    {
        return "rgb(228, 135, 29)";
    }
    if (density < 500)
    {
        return "rgb(238, 109, 22)";
    }
    if (density < 750)
    {
        return "rgb(223, 73, 35)";
    }
    if (density < 1000)
    {
        return "rgb(223, 57, 35)";
    }

    return "rgb(255, 0, 0)"; // đỏ
}

function applyPopulationDensityHeatmap()
{
    Object.entries(
        countriesData
    ).forEach(
        ([iso3, country]) =>
        {
            const density =
                getPopulationDensity(
                    country
                );

            const polygons =
                countryLayers[
                    iso3
                ];

            if (!polygons)
            {
                return;
            }

            const color =
                densityColor(
                    density
                );

            polygons.forEach(
                polygon =>
                {
                    polygon.style.fill =
                        color;
                }
            );
        }
    );
}


function resetCountryColors()
{
    Object.values(
        countryLayers
    ).forEach(
        polygons =>
        {
            polygons.forEach(
                polygon =>
                {
                    polygon.style.fill =
                        "#60a5fa";
                    
                    polygon.style.hover = 
                        "#3a6396";
                }
            );
        }
    );
}

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
            if(selectedCountry)
            {
                selectedCountry.classList.remove(
                    "selected"
                );
            }
            scale = 1;

            translateX = 0;
            translateY = 0;

            updateTransform();
        }
    );
}
