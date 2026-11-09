class DivCenter {
    constructor(elFather) {
        // Main
        this.elMain = UI.Div.Row(UI.ClassName.ForApp.Map);
        elFather.appendChild(this.elMain);

        // SVG
        this.elSVG = UI.Draw.Svg();
        this.elMain.appendChild(this.elSVG);

        // SVG Group
        this.elSVGGroup = UI.Draw.SVGGroup();
        this.elSVG.append(this.elSVGGroup);

        // Cordinator
        this.startX = 0;
        this.startY = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.scale = 1;
        this.isDragging = false;
        this.initialPinchDistance = null;

        // Polygons Data
        this.polygonsData = {};
        this.selectedIso3 = null;

        // Transform
        this.updateTransform();
    }

    // #region updataTransform
    updateTransform() {
        this.elSVGGroup.setAttribute(
            "transform", 
            `translate(${this.translateX},${this.translateY}) scale(${this.scale})`
        );    
    }

    //#region renderMap
    async drawGeoJson(fileGeoJson) {
        this.elSVGGroup.innerHTML = "";
        try
        {
            const response = await fetch(fileGeoJson);
            const geoData = await response.json();
            geoData.features.forEach(feature => {
                this.drawMultiPolygons(feature);
            });
        }
        catch(error)
        {
            console.error(error);
        }
    }

    // #region drawMultiPolygons
    drawMultiPolygons(feature) {
        let iso3 = feature.properties?.["ISO3166-1-Alpha-3"];
        if (iso3 == "-99") iso3 = feature.properties?.["name"];

        const geometry = feature.geometry;
        if (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon") return;
        
        // Create Polygons
        let listOfPolygons = [];
        if (geometry.type === "Polygon") {
            listOfPolygons = [geometry.coordinates];
        }
        if(geometry.type === "MultiPolygon") {
            listOfPolygons = geometry.coordinates;
        }

        // Draw Polygons
        listOfPolygons.forEach(polygon => {
            this.drawPolygon(iso3, polygon);
        });
    }

    // #region drawPolygon
    drawPolygon(iso3, polygon) {
        polygon.forEach(ring => {
            const points = ring.map(coord => {
                const [x, y] = Helper.Coordinate.convertToXY(coord[0], coord[1]);
                return `${x},${y}`;
            }).join(" ");

            // Create Polygon
            const polygon = UI.Draw.Polygon(points, UI.ClassName.ForApp.Country);

            // Add to Polygon Dict
            if (!this.polygonsData[iso3]) this.polygonsData[iso3] = [];
            this.polygonsData[iso3].push(polygon);

            // Append to Element Group
            this.elSVGGroup.appendChild(polygon);
        });
    }

    // #region listener
    listen() {
        this.mouseAction();
        this.touchAction();
    }

    // #region mouseAction
    mouseAction() {
        this.elSVG.addEventListener("wheel", (e) => {
            e.preventDefault();
            const rect = this.elSVG.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const oldScale = this.scale;

            if(e.deltaY < 0) {
                this.scale *= 1.05
            } else {
                this.scale *= 0.95
            }

            const worldX = (mouseX - this.translateX) / oldScale;
            const worldY = (mouseY - this.translateY) / oldScale;
            this.translateX = mouseX - (worldX * this.scale);
            this.translateY = mouseY - (worldY * this.scale);

            this.updateTransform();
        });

        this.elSVG.addEventListener("mousedown",(e) => {
            this.isDragging = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
        });

        this.elSVG.addEventListener("mousemove", (e) => {
            if (!this.isDragging) return;
            this.translateX += e.clientX - this.startX;
            this.translateY += e.clientY - this.startY;
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.updateTransform();
        });

        this.elSVG.addEventListener("mouseup",() => {
            this.isDragging = false;
        });

        this.elSVG.addEventListener("mouseleave", () => {
            this.isDragging = false;
        });
    }

    // #region touchAction
    getTouchDistance(touch1, touch2) {
        const distanceX = touch2.clientX - touch1.clientX;
        const distanceY = touch2.clientY - touch1.clientY;
        return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    }

    touchAction() {

        let initialPinchDistance = null;

        this.elSVG.addEventListener("touchstart", (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.startX = e.touches[0].clientX;
                this.startY = e.touches[0].clientY;
            }
            if (e.touches.length === 2) {
                initialPinchDistance = this.getTouchDistance(e.touches[0], e.touches[1])
            }
        },
        {
            passive: false
        });

        this.elSVG.addEventListener("touchmove", (e) => {
            if (e.touches.length === 1 && this.isDragging) {
                e.preventDefault();
                const touch = e.touches[0];
                this.translateX += touch.clientX - this.startX;
                this.translateY += touch.clientY - this.startY;
                this.startX = touch.clientX;
                this.startY = touch.clientY;
                this.updateTransform();
            }
            if (e.touches.length === 2) {
                e.preventDefault();
                const currentDistance = this.getTouchDistance(e.touches[0], e.touches[1])

                if (initialPinchDistance) {
                    const rect = this.elSVG.getBoundingClientRect();
                    const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
                    const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
                    const oldScale = this.scale;
                    const zoomFactor = currentDistance / initialPinchDistance;
                    this.scale *= zoomFactor;

                    const worldX = (centerX - this.translateX) / oldScale;
                    const worldY = (centerY - this.translateY) / oldScale;
                    this.translateX = centerX - worldX * this.scale;
                    this.translateY = centerY - worldY * this.scale;
                    this.updateTransform();
                }
                initialPinchDistance = currentDistance;
            }
        },
        {
            passive: false
        }
        );

        this.elSVG.addEventListener("touchend", () => {
            this.isDragging = false;
            initialPinchDistance = null;
        });

        this.elSVG.addEventListener("touchcancel", () => {
            this.isDragging = false;
            initialPinchDistance = null;
        });
    }

    // #region setSelectedByISO3
    selectCountry(iso3) {

        // Nếu click lại đúng country đang chọn => bỏ chọn
        if (this.selectedIso3 === iso3) {
            const polygons = this.polygonsData[iso3];
            if (polygons) {
                polygons.forEach(polygon => {
                    polygon.classList.remove(UI.ClassName.Selected);
                });
            }
            this.selectedIso3 = null;
            return;
        }

        // Bỏ chọn country cũ
        if (this.selectedIso3) {
            const oldPolygons = this.polygonsData[this.selectedIso3];
            if (oldPolygons) {
                oldPolygons.forEach(polygon => {
                    polygon.classList.remove(UI.ClassName.Selected);
                });
            }
        }

        // Chọn country mới
        this.selectedIso3 = iso3;
        const newPolygons = this.polygonsData[iso3];
        if (newPolygons) {
            newPolygons.forEach(polygon => {
                polygon.classList.add(UI.ClassName.Selected);
            });
        }
    }

    // #region zoomToCountry
    zoomToCountry(iso3) {
        const polygons = this.polygonsData[iso3];
        if (!polygons || polygons.length === 0) return;

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        polygons.forEach(polygon => {
            const box = polygon.getBBox();
            minX = Math.min(minX, box.x);
            minY = Math.min(minY, box.y);
            maxX = Math.max(maxX, box.x + box.width);
            maxY = Math.max(maxY, box.y + box.height );
        });

        const width = maxX - minX;
        const height = maxY - minY;

        const mapRect = this.elSVG.getBoundingClientRect();

        const padding = 0.6;

        const scaleX = mapRect.width / width;
        const scaleY = mapRect.height / height;

        this.scale = Math.min(scaleX, scaleY) * padding;

        const centerX = minX + width / 2;
        const centerY = minY + height / 2;

        this.translateX = mapRect.width / 2 - centerX * this.scale;
        this.translateY = mapRect.height / 2 - centerY * this.scale;

        this.updateTransform();
    }
}