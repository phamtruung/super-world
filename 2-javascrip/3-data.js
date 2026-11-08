//#region SuperCountry
class SuperCountry {
    constructor({
        iso2,
        iso3,
        name,
        capital,
        region,
        subregion,
        area,
        currency,
        currencyName,
        population,
        gdp,
        goverment,
        the_che
    }) {
        this.iso2 = iso2;
        this.iso3 = iso3;
        this.name = name;
        this.capital = capital;
        this.region = region;
        this.subregion = subregion;
        this.area = parseFloat(area) || 0;
        this.currency = currency;
        this.currencyName = currencyName;
        this.population = parseInt(population, 10) || 0;
        this.gdp = parseFloat(gdp) || 0;
        this.goverment = goverment;
        this.the_che = the_che;
    }
    gdpRound() {
        return Math.round(this.gdp / 1000_000_000 * 10) / 10;
    }
    populationPerKm2() {
        if (!this.area) return 0;
        if (!this.population) return 0;
        return this.population / this.area;
    }

    gdpPerPerson() {
        if (!this.population) return 0;
        if (!this.gdp) return 0;
        return this.gdp / this.population;
    }

    static map(obj) {
        return new SuperCountry(obj);
    }
}


//#region Data
class Data {
    constructor({csvFile}) {
        this.version = Data.VERSION;
        this.root = [];
        this.importCSV(csvFile);
    }

    // #region importCSV
    async importCSV(csvFile) {
        const response = await fetch(csvFile);
        const csvText = await response.text();
        const lines = csvText.trim().split(/\r?\n/);
        if(lines.length < 2) return;

        const headers = lines[0].split(",").map(x => x.trim());

        this.root = [];
        for(let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map(x => x.trim());
            const obj = {};

            headers.forEach((header, index) => {
                obj[header] = values[index] ?? "";
            });

            this.root.push(
                new SuperCountry({
                    iso2: obj.iso2,
                    iso3: obj.iso3,
                    name: obj.name,
                    capital: obj.capital,
                    region: obj.region,
                    subregion: obj.subregion,
                    area: obj.area_sq_km,
                    currency: obj.currency,
                    currencyName: obj.currency_name,
                    population: obj.population,
                    gdp: obj.gdp,
                    goverment: obj.government_form,
                    the_che: obj.the_che
                })
            );
        }

    }

    // #region findCountriesByIso3
    findCountriesByIso3(iso3) {
        return this.root.find(superCountry => superCountry.iso3 === iso3)
    }

    // #region findCountriesByName
    findCountriesByName(findName) {
        if (!findName) return [];

        findName = findName.toLowerCase().trim();
        return this.root.filter(superCountry =>
            superCountry.name?.toLowerCase().includes(findName)
        );
    }

    // #region getRegionDict
    getRegionDict() {
        const output = {};

        if (this.root) {
            this.root.forEach(superCountry => {
                const region = superCountry.region;
                if (!region || region == 0) return;

                if (!output[region]) output[region] = [];
                output[region].push(superCountry);
            });
        }
        return output;
    }

    // #region getPopulationDict
    getPopulationDict() {
        const output = {};
        const prefixCSS = "population";
        const listOfValues = [1, 10, 25, 50, 100, 250, 500, 1000];

        if (this.root) {
            this.root.forEach(superCountry => {
                const populationName = Helper.String.createStringFromCompare(
                    prefixCSS, 
                    listOfValues, 
                    superCountry.populationPerKm2()
                );
                if (populationName) {
                    if (!output[populationName]) {
                        output[populationName] = [];
                    }

                    output[populationName].push(superCountry);
                }
            });
        }

        return Helper.Object.sortDictByKey(output);
    }

    // #region getGDPPerPersonDict
    getGDPPerPersonDict() {
        const output = {};
        const prefixCSS = "gdp";
        const listOfValues = [1000, 2500, 5000, 7500, 10000, 25000, 50000, 75000, 100000];

        if (this.root) {
            this.root.forEach(superCountry => {
                const gdpPerPersonName = Helper.String.createStringFromCompare(
                    prefixCSS, 
                    listOfValues, 
                    superCountry.gdpPerPerson()
                );
                if (gdpPerPersonName) {
                    if (!output[gdpPerPersonName]) {
                        output[gdpPerPersonName] = [];
                    }
                    output[gdpPerPersonName].push(superCountry);
                }

            });
        }
        return Helper.Object.sortDictByKey(output);
    }

    // #region getForexDict
    getForexDict() {
        const output = {};
        const listOfForex = ["AUD", "CAD", "CHF", "EUR", "JPY", "NZD", "GBP", "USD"]
        if (this.root) {
            this.root.forEach(superCountry => {
                let currency = superCountry.currency;
                if (!listOfForex.includes(currency)) currency = UI.ClassName.ForApp.NoForex;

                if (!output[currency]) output[currency] = [];
                output[currency].push(superCountry);
            });
        }
        return Helper.Object.sortDictByKey(output);
    }

    // #region getGovermentDict
    getGovermentDict() {
        const output = {};

        if (this.root) {
            this.root.forEach(superCountry => {
                const the_che = superCountry.the_che;
                if (!the_che || the_che == 0) return;

                if (!output[the_che]) output[the_che] = [];
                output[the_che].push(superCountry);
            });
        }
        return Helper.Object.sortDictByKey(output);
    }
}
