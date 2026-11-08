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
        this.filterByDefault();

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
            if (this.elHeader.elFilter.value == 0) {
                this.filterByDefault();
            } else if (this.elHeader.elFilter.value == 1) {
                this.filterByRegion();
            } else if (this.elHeader.elFilter.value == 2) {
                this.filterByPopulation();
            } else if (this.elHeader.elFilter.value == 3) {
                this.filterByGDP();
            } else if (this.elHeader.elFilter.value == 4) {
                this.filterByForex();
            } else if (this.elHeader.elFilter.value == 5) {
                this.filterByGoverment();
            }
        });
    }

    // #region filterByDefault
    filterByDefault() {
        this.renderMapByDefault();
        const numberOfCountries = this.data.root.length;

        this.elLeft.elTitle.innerHTML = `Đất Nước: ${numberOfCountries}`;
        this.elLeft.elContent.innerHTML = "";

        // List Of Countries
        const elListOfCountries = this.elListOfCountriesByArea(this.data.root);
        this.elLeft.elContent.appendChild(elListOfCountries);
    }

    renderMapByDefault() {
        Object.values(this.elCenter.polygonsData).forEach((polygons) => {
            UI.Color.SetColorByClassName(polygons, UI.ClassName.ForApp.Country);
        });
    }

    // #region filterByRegion
    filterByRegion() {
        const collections = this.data.getRegionDict();

        this.renderMapByRegion(collections);

        this.elLeft.elTitle.innerHTML = "6 Châu Lục";
        this.elLeft.elContent.innerHTML = "";

        Object.entries(collections).forEach(([region, listOfCountries]) => {
            const numberOfCountries = listOfCountries.length;

            // Region
            const elRegion = UI.Div.Column(null, false);
            elRegion.classList.add(region.toLowerCase());
            this.elLeft.elContent.appendChild(elRegion);

            // Row Title
            const elRowTitle = UI.Div.Row();
            elRegion.appendChild(elRowTitle);

            // Region Name
            const textRegion = `${region} (${numberOfCountries})`;
            elRowTitle.appendChild(UI.Paragraph.Label(textRegion));

            // Numer of Area
            let totalArea = 0;
            listOfCountries.forEach(superCountry => {
                totalArea += superCountry.area;
            });
            const textArea = `${Helper.Number.formatNumber(totalArea / 1000_000)} triệu km2`
            elRowTitle.appendChild(UI.Paragraph.Text(textArea));

            // List of countries
            const elContent = UI.Div.Column();
            elRegion.appendChild(elContent);

            // Click Title
            let isOpen = false;
            elRowTitle.addEventListener("click", () => {
                elContent.innerHTML = "";
                if (isOpen) {
                    isOpen = false;
                } else {
                    const elListOfCountries = this.elListOfCountriesByArea(listOfCountries);
                    elContent.appendChild(elListOfCountries);
                    isOpen = true;
                }
            })

        });
    }

    // #region renderMapByRegion
    renderMapByRegion(collections) {
        Object.entries(collections).forEach(([region, listOfCountries]) => {
            listOfCountries.forEach(country => {
                Object.entries(this.elCenter.polygonsData).forEach(([iso3, polygons]) => {
                    const superCountry = this.data.findCountriesByIso3(iso3);
                    if (superCountry === country) {
                        UI.Color.SetColorByClassName(polygons, region.toLowerCase());
                    }
                });
            });
        });
    }

    // #region elListOfCountriesByArea
    elListOfCountriesByArea(listOfCountries) {
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
            const area = `${Helper.Number.formatNumber(superCountry.area)} km2`;
            elCountry.appendChild(UI.Paragraph.Text(area));

            // Click
            elCountry.addEventListener("click", () => {
                this.showCountry(superCountry.iso3, true);
            });
        });

        return elListOfCountries;
    }

    // #region filterByPopulation
    filterByPopulation() {
        this.elLeft.elTitle.innerHTML = "Người/Km2";
        this.elLeft.elContent.innerHTML = "";

        const collections = this.data.getPopulationDict();

        this.renderMapByPopulation(collections);

        Object.entries(collections).forEach(([population, listOfCountries]) => {
            const numberOfCountries = "(" + listOfCountries.length + ")";

            // Population
            const elPopulation = UI.Div.Column(population, false);
            this.elLeft.elContent.appendChild(elPopulation);

            // Row Title
            const elRowTitle = UI.Div.Row();
            elPopulation.appendChild(elRowTitle);

            // Region Name
            let textPopulation;
            const numberPopulation = parseInt(population.split('-')[1]) || "max";
            if (numberPopulation == "max") {
                textPopulation = "> 1000 người/km2";
            } else {
                textPopulation = `< ${numberPopulation} người/km2`;
            }
            elRowTitle.appendChild(UI.Paragraph.Label(textPopulation));

            // Numer of countries
            elRowTitle.appendChild(UI.Paragraph.Text(numberOfCountries));

            // List of countries
            const elContent = UI.Div.Column();
            elPopulation.appendChild(elContent);

            // Click Title
            let isOpen = false;
            elRowTitle.addEventListener("click", () => {
                elContent.innerHTML = "";
                if (isOpen) {
                    isOpen = false;
                } else {
                    const elListOfCountries = this.elListOfCountriesByPopulation(listOfCountries);
                    elContent.appendChild(elListOfCountries);
                    isOpen = true;
                }
            })
        });
    }

    // #region elListOfCountriesByPopulation
    elListOfCountriesByPopulation(listOfCountries) {
        const elListOfCountries = UI.Div.Column();

        listOfCountries.forEach(superCountry => {

            // Country
            const elCountry = UI.Div.Row(UI.ClassName.Click, true);
            elCountry.classList.add(UI.ClassName.Wrap);
            elCountry.classList.add(UI.ClassName.Click);
            elListOfCountries.appendChild(elCountry);

            // Name
            elCountry.appendChild(UI.Paragraph.Label(superCountry.name));

            // Population
            const population = `${Math.round(superCountry.populationPerKm2())} ng/km2`
            elCountry.appendChild(UI.Paragraph.Text(population));

            // Click
            elCountry.addEventListener("click", () => {
                this.showCountry(superCountry.iso3, true);
            });
        });

        return elListOfCountries;
    }

    // #region renderMapByPopulation
    renderMapByPopulation(collections) {
        Object.entries(collections).forEach(([population, listOfCountries]) => {
            listOfCountries.forEach(country => {
                Object.entries(this.elCenter.polygonsData).forEach(([iso3, polygons]) => {
                    const superCountry = this.data.findCountriesByIso3(iso3);
                    if (superCountry === country) {
                        UI.Color.SetColorByClassName(polygons, population);
                    }
                });
            });
        });
    }

    // #region filterByGDP
    filterByGDP() {
        this.elLeft.elTitle.innerHTML = "USD/Người/Năm";
        this.elLeft.elContent.innerHTML = "";

        const collections = this.data.getGDPPerPersonDict();

        this.renderMapByPPP(collections);

        Object.entries(collections).forEach(([gdp, listOfCountries]) => {
            const numberOfCountries = "(" + listOfCountries.length + ")";

            // GDP
            const elGDP = UI.Div.Column(gdp, false);
            this.elLeft.elContent.appendChild(elGDP);

            // Row Title
            const elRowTitle = UI.Div.Row();
            elGDP.appendChild(elRowTitle);

            // Region Name
            let textGDP;
            const numberGDP = parseInt(gdp.split('-')[1]) || "max";
            if (numberGDP == "max") {
                textGDP = "> 100.000 $/p";
            } else {
                textGDP = `< ${Helper.Number.formatNumber(numberGDP)} $/p`;
            }
            elRowTitle.appendChild(UI.Paragraph.Label(textGDP));

            // Numer of countries
            elRowTitle.appendChild(UI.Paragraph.Text(numberOfCountries));

            // List of countries
            const elContent = UI.Div.Column();
            elGDP.appendChild(elContent);

            // Click Title
            let isOpen = false;
            elRowTitle.addEventListener("click", () => {
                elContent.innerHTML = "";
                if (isOpen) {
                    isOpen = false;
                } else {
                    const elListOfCountries = this.elListOfCountriesByGDP(listOfCountries);
                    elContent.appendChild(elListOfCountries);
                    isOpen = true;
                }
            })
        });
    }

    // #region elListOfCountriesByGDP
    elListOfCountriesByGDP(listOfCountries) {
        const elListOfCountries = UI.Div.Column();

        listOfCountries.forEach(superCountry => {

            // Country
            const elCountry = UI.Div.Row(UI.ClassName.Click, true);
            elCountry.classList.add(UI.ClassName.Wrap);
            elCountry.classList.add(UI.ClassName.Click);
            elListOfCountries.appendChild(elCountry);

            // Name
            elCountry.appendChild(UI.Paragraph.Label(superCountry.name));

            // GDPPerPerson
            const gdpPerPerson = `${Helper.Number.formatNumber(superCountry.gdpPerPerson())} $/p`
            elCountry.appendChild(UI.Paragraph.Text(gdpPerPerson));

            // Click
            elCountry.addEventListener("click", () => {
                this.showCountry(superCountry.iso3, true);
            });
        });

        return elListOfCountries;
    }

    // #region renderMapByPPP
    renderMapByPPP(collections) {
        Object.entries(collections).forEach(([gdp, listOfCountries]) => {
            listOfCountries.forEach(country => {
                Object.entries(this.elCenter.polygonsData).forEach(([iso3, polygons]) => {
                    const superCountry = this.data.findCountriesByIso3(iso3);
                    if (superCountry === country) {
                        UI.Color.SetColorByClassName(polygons, gdp);
                    }
                });
            });
        });
    }

    // #region filterByForex
    filterByForex() {
        this.elLeft.elTitle.innerHTML = "Forex 8";
        this.elLeft.elContent.innerHTML = "";

        const collections = this.data.getForexDict();
        console.log(collections);

        this.renderMapByForex(collections);

        Object.entries(collections).forEach(([currency, listOfCountries]) => {
            const numberOfCountries = listOfCountries.length;

            // Currency
            const elCurrency = UI.Div.Column(currency, false);
            this.elLeft.elContent.appendChild(elCurrency);

            // Row Title
            const elRowTitle = UI.Div.Row();
            elCurrency.appendChild(elRowTitle);

            // Currency Name
            const textCurreny = currency;
            elRowTitle.appendChild(UI.Paragraph.Label(textCurreny));

            // Number of Countries
            elRowTitle.appendChild(UI.Paragraph.Label(`(${numberOfCountries})`))

            // Number Of GDP and Population
            let totalGDP = 0;
            let totalPopulation = 0;
            listOfCountries.forEach(superCountry => {
                totalGDP += superCountry.gdp;
                totalPopulation += superCountry.population;
            })
            const ppp = totalGDP / totalPopulation;
            const textTotaPPP = Helper.Number.formatNumber(ppp) + " $/p";
            elRowTitle.appendChild(UI.Paragraph.Text(textTotaPPP));

            // List of countries
            const elContent = UI.Div.Column();
            elCurrency.appendChild(elContent);

            // Click Title
            let isOpen = false;
            elRowTitle.addEventListener("click", () => {
                elContent.innerHTML = "";
                if (isOpen) {
                    isOpen = false;
                } else {
                    const elListOfCountries = this.elListOfCountriesByGDP(listOfCountries);
                    elContent.appendChild(elListOfCountries);
                    isOpen = true;
                }
            })
        });
    }

    // #region renderMapByForex
    renderMapByForex(collections) {
        Object.entries(collections).forEach(([currency, listOfCountries]) => {
            listOfCountries.forEach(country => {
                Object.entries(this.elCenter.polygonsData).forEach(([iso3, polygons]) => {
                    const superCountry = this.data.findCountriesByIso3(iso3);
                    if (superCountry === country) {
                        UI.Color.SetColorByClassName(polygons, currency);
                    }
                });
            });
        });
    }

    // #region filterByGoverment
    filterByGoverment() {
        const collections = this.data.getGovermentDict();
        this.renderMapByTheChe(collections);

        this.elLeft.elTitle.innerHTML = "Thể Chế: 5 Loại";
        this.elLeft.elContent.innerHTML = "";

        Object.entries(collections).forEach(([the_che, listOfCountries]) => {
            const numberOfCountries = listOfCountries.length;

            // Goverment
            const elGoverment = UI.Div.Column(null, false);
            const className = Helper.String.stringToSlug(the_che);
            elGoverment.classList.add(className);
            this.elLeft.elContent.appendChild(elGoverment);

            // Row Title
            const elRowTitle = UI.Div.Row();
            elGoverment.appendChild(elRowTitle);

            // Region Name
            elRowTitle.appendChild(UI.Paragraph.Label(the_che));

            // Number of Countries
            elRowTitle.appendChild(UI.Paragraph.Label(`(${numberOfCountries})`))

            // Number Of GDP and Population
            let totalGDP = 0;
            let totalPopulation = 0;
            listOfCountries.forEach(superCountry => {
                totalGDP += superCountry.gdp;
                totalPopulation += superCountry.population;
            })
            const ppp = totalGDP / totalPopulation;
            const textTotaPPP = Helper.Number.formatNumber(ppp) + " $/p";
            elRowTitle.appendChild(UI.Paragraph.Text(textTotaPPP));

            // List of countries
            const elContent = UI.Div.Column();
            elGoverment.appendChild(elContent);

            // Click Title
            let isOpen = false;
            elRowTitle.addEventListener("click", () => {
                elContent.innerHTML = "";
                if (isOpen) {
                    isOpen = false;
                } else {
                    const elListOfCountries = this.elListOfCountriesByGDP(listOfCountries);
                    elContent.appendChild(elListOfCountries);
                    isOpen = true;
                }
            })

        });
    }

    // #region renderMapByTheChe
    renderMapByTheChe(collections) {
        Object.entries(collections).forEach(([the_che, listOfCountries]) => {
            listOfCountries.forEach(country => {
                Object.entries(this.elCenter.polygonsData).forEach(([iso3, polygons]) => {
                    const superCountry = this.data.findCountriesByIso3(iso3);
                    if (superCountry === country) {
                        const classNameTheChe = Helper.String.stringToSlug(the_che);
                        UI.Color.SetColorByClassName(polygons, classNameTheChe);
                    }
                });
            });
        });
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



document.addEventListener("DOMContentLoaded", () => {
    const app = new App();
    app.install();
});