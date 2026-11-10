class App {
    constructor() {
        const elBody = document.getElementById('body');

        // Data
        this.appName = "Địa Chính Trị";
        this.fileGeoJson = "1-data/json/countries.geojson";
        this.folderSVG = "1-data/svg";
        this.data = new Data({csvFile: "1-data/csv/information.csv"})

        // Header
        this.elHeader = new DivHeader({
            elFather: elBody, 
            appName: this.appName,
        });

        // Main
        const elMain = UI.Div.Row(UI.ClassName.Main);
        elBody.appendChild(elMain);

        // Left Panel
        this.elLeft = new DivLeft(elMain);

        // Center Panel
        this.elCenter = new DivCenter(elMain);

        // Right Panel
        this.elRight = new DivRight(elMain, this.folderSVG);
    }

    // #region install
    async install() {
        await this.elCenter.drawGeoJson(this.fileGeoJson);
        this.elCenter.listen();
        this.appListen();
        this.filterByKey(this.elHeader.elFilter.value);
    }

    // #region appListen
    appListen() {
        this.clickPolygons();
        this.clickFilter();
        this.search();
    }

    // #region clickFilter
    clickFilter() {
        this.elHeader.elFilter.addEventListener("change", () => {
            this.filterByKey(this.elHeader.elFilter.value);
        });
    }

    // #region filterByKey
    filterByKey(index) {
        const collections = this.data.getDictByKey(index);
        this.renderMapByKey(collections);

        this.elLeft.elContent.innerHTML = "";

        Object.entries(collections).forEach(([keyValue, listOfCountries]) => {
            const numberOfCountries = listOfCountries.length;

            // Key
            const elKey = UI.Div.Column(null, false);
            const className = Helper.String.stringToSlug(keyValue);
            elKey.classList.add(className);
            this.elLeft.elContent.appendChild(elKey);

            // Row Title
            const elRowTitle = UI.Div.Row();
            elKey.appendChild(elRowTitle);

            // Key Name
            let textValue;
            if (keyValue.includes("-")) {
                const suffix = keyValue.split('-')[1];
                const suffixValue = parseInt(suffix);
                if (suffixValue) {
                    textValue = `< ${suffixValue}`;
                } else {
                    textValue = suffix;
                }
            } else {
                textValue = keyValue;
            }
            const textRegion = `${textValue} (${numberOfCountries})`;
            elRowTitle.appendChild(UI.Paragraph.Label(textRegion));

            // Sum By Key
            const dictKey = this.data.dataKey[index];
            const sumValue = this.data.sumByKey(listOfCountries, dictKey.detail);
            console.log(sumValue);

            const sumText = `${Helper.Number.formatNumber(sumValue)} ${dictKey.unit}`
            elRowTitle.appendChild(UI.Paragraph.Text(sumText))

            // List of countries
            const elContent = UI.Div.Column();
            elKey.appendChild(elContent);

            // Click Title
            let isOpen = false;
            elRowTitle.addEventListener("click", () => {
                elContent.innerHTML = "";
                if (isOpen) {
                    isOpen = false;
                } else {
                    const elListOfCountries = this.elListOfCountriesByKey(listOfCountries, index);
                    elContent.appendChild(elListOfCountries);
                    isOpen = true;
                }
            })
        });
    }

    // #region renderMapByKey
    renderMapByKey(collections) {
        Object.entries(collections).forEach(([key, listOfCountries]) => {
            listOfCountries.forEach(country => {
                Object.entries(this.elCenter.polygonsData).forEach(([iso3, polygons]) => {
                    const superCountry = this.data.findCountriesByIso3(iso3);
                    if (superCountry === country) {
                        const className = Helper.String.stringToSlug(key);
                        UI.Color.SetColorByClassName(polygons, className);
                    }
                });
            });
        });
    }

    // #region elListOfCountriesByKey
    elListOfCountriesByKey(listOfCountries, index) {
        const keyDict = this.data.dataKey[index];
        const detailOfKey = keyDict.detail;
        const unitOfKey = keyDict.unit;

        const elListOfCountries = UI.Div.Column();

        listOfCountries.forEach(superCountry => {

            // Country
            const elCountry = UI.Div.Row(UI.ClassName.Click, true);
            elCountry.classList.add(UI.ClassName.Wrap);
            elCountry.classList.add(UI.ClassName.Click);
            elListOfCountries.appendChild(elCountry);

            // Name
            elCountry.appendChild(UI.Paragraph.Label(superCountry.name));

            // Area
            const textDetail = `${Helper.Number.formatNumber(superCountry[detailOfKey])} ${unitOfKey}`;
            elCountry.appendChild(UI.Paragraph.Text(textDetail));

            // Click
            elCountry.addEventListener("click", () => {
                this.showCountry(superCountry.iso3, true);
            });
        });

        return elListOfCountries;
    }

    // #region search
    search() {
        this.elHeader.elSearch.addEventListener("input", () => {
            this.elHeader.elSearchResult.innerHTML = "";

            const listOfCountries = this.data.findCountriesByName(this.elHeader.elSearch.value);

            listOfCountries.forEach(superCountry => {
                const elItemCountry = UI.Paragraph.Text(superCountry.name);
                elItemCountry.classList.add(UI.ClassName.SearchItem);
                this.elHeader.elSearchResult.appendChild(elItemCountry);
                
                // Listen
                elItemCountry.addEventListener("click", () => {
                    this.showCountry(superCountry.iso3, true);
                    this.elHeader.elSearch.value = "";
                    this.elHeader.elSearchResult.innerHTML = "";
                });
            });
        });
    }

    // #region clickPolygons
    clickPolygons() {
        const polygonsData = this.elCenter.polygonsData;
        Object.entries(polygonsData).forEach(([iso3, listOfPolygons] ) => {
            listOfPolygons.forEach(polygon => {
                polygon.addEventListener("click", ()=> {this.showCountry(iso3, false)});
            });
        })
    }

    // #region showCountry
    showCountry(iso3, zoom) {
        const superCountry = this.data.root.find(superCountry => superCountry.iso3 === iso3);
        if (superCountry instanceof SuperCountry) {
            this.elRight.showSuperCountry(superCountry);
        } else {
            this.elRight.showCountry(iso3)
        }

        this.elCenter.selectCountry(iso3);
        if(zoom) this.elCenter.zoomToCountry(iso3);
    }
}

// #region DOM
document.addEventListener("DOMContentLoaded", () => {
    const app = new App();
    app.install();
});