//#region SuperCountry
class SuperCountry {
    constructor({
        iso2,
        iso3,
        name,
        capital,
        region,
        subregion,
        chau_luc,
        khu_vuc,
        area,
        currency,
        currencyName,
        population,
        gdp,
        goverment,
        the_che,
        oil,
        gold_geological,
        gold_bank,
        silver,
        copper,
        rare_earth,
        cereal,
        meat,
        seafood,
        agricultural
    }) {
        this.iso2 = iso2;
        this.iso3 = iso3;
        this.name = name;
        this.capital = capital;
        this.region = region;
        this.subregion = subregion;
        this.chau_luc = chau_luc;
        this.khu_vuc = khu_vuc;
        this.area = parseFloat(area) || 0;
        this.currency = currency;
        this.currencyName = currencyName;
        this.population = parseInt(population, 10) || 0;
        this.gdp = parseFloat(gdp) || 0;
        this.goverment = goverment;
        this.the_che = the_che;
        this.oil = parseFloat(oil);
        this.gold_geological = parseFloat(gold_geological);
        this.gold_bank = parseFloat(gold_bank);
        this.silver = silver;
        this.copper = copper;
        this.rare_earth = rare_earth;
        this.cereal = cereal;
        this.meat = meat;
        this.seafood = seafood;
        this.agricultural = agricultural;
        this.populationDensity = this.calcPopulationDensity();
        this.populationMilion = this.calcPopulationMilion();
        this.gdpPerson = this.calcGDPPerson();
        this.gdpMilion = this.calcGDPMilion();
        this.gdpBiliion = this.calcGDPBilion();
        this.goldTotal = this.gold_geological + this.gold_bank;
    }
    calcPopulationMilion() {
        return this.population / 1000_000;
    }
    calcGDPMilion() {
        return this.gdp / 1000_000;
    }
    calcGDPBilion() {
        return this.gdp / 1000_000_000;
    }
    calcPopulationDensity() {
        if (!this.area) return 0;
        if (!this.population) return 0;
        return this.population / this.area;
    }

    calcGDPPerson() {
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

        // #region dataKey
        this.dataKey = [
            {
                name: "Đất Nước",
                detail: "area",
                unit: "km2"
            },
            {
                key: "chau_luc", 
                detail: "area",
                unit: "km2"
            },
            {
                key: "khu_vuc", 
                detail: "area",
                unit: "km2"
            },
            {            
                key: "populationDensity", 
                values: [1, 10, 25, 50, 100, 250, 500, 1000],
                detail: "populationDensity",
                unit: "p/km2"
            },
            {
                key: "gdpPerson",
                values: [1000, 2500, 5000, 7500, 10000, 25000, 50000, 75000, 100000],
                detail: "gdpPerson",
                unit: "$/p"
            },
            {
                key: "currency",
                values: ["AUD", "CAD", "CHF", "EUR", "JPY", "NZD", "GBP", "USD"],
                detail: "gdpMilion",
                unit: "m$"
            },
            {
                key: "the_che",
                detail: "gdpMilion",
                unit: "m$"
            },
            {
                key: "oil",
                values: [1, 50, 100, 500, 1000, 2500, 5000],
                detail: "oil",
                unit: "TWh"
            },
            {
                key: "gold_geological",
                values: [1, 25, 50, 100, 250, 500, 1000, 2500, 5000],
                detail: "gold_geological",
                unit: "tấn"
            },
            {
                key: "gold_bank",
                values: [1, 25, 50, 100, 250, 500, 1000],
                detail: "gold_bank",
                unit: "tấn"
            },
            {
                key: "goldTotal",
                values: [1, 50, 100, 250, 500, 1000, 2500, 5000, 7500],
                detail: "goldTotal",
                unit: "tấn"
            },
        ]
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
                    chau_luc: obj.chau_luc,
                    khu_vuc: obj.khu_vuc,
                    area: obj.area_sq_km,
                    currency: obj.currency,
                    currencyName: obj.currency_name,
                    population: obj.population,
                    gdp: obj.gdp,
                    goverment: obj.government_form,
                    the_che: obj.the_che,
                    oil: obj.oil,
                    gold_geological: obj.gold_geological,
                    gold_bank: obj.gold_bank,
                    silver: obj.silver,
                    copper: obj.copper,
                    rare_earth: obj.rare_earth,
                    cereal: obj.cereal,
                    meat: obj.meat,
                    seafood: obj.seafood,
                    agricultural: obj.agricultural,
                })
            );
        }

    }

    // #region find
    findCountriesByIso3(iso3) {
        return this.root.find(superCountry => superCountry.iso3 === iso3)
    }

    findCountriesByName(findName) {
        if (!findName) return [];

        findName = findName.toLowerCase().trim();
        return this.root.filter(superCountry =>
            superCountry.name?.toLowerCase().includes(findName)
        );
    }

    // #region sumByKey
    sumByKey(listOfCountries, key) {
        let total = 0;
        listOfCountries.forEach(superCountry => {
            total += superCountry[key];
        })
        return total;
    }

    // #region getDictByKey
    getDictByKey(index) {
        const output = {};
        const dictKey = this.dataKey[index];
        const keyOfKey = dictKey.key;
        const nameOfKey = dictKey.name;
        const valuesOfKey = dictKey.values;

        if (keyOfKey) {
            this.root.forEach(superCountry => {
                let newKey = null;
                if (valuesOfKey) {
                    newKey = Helper.String.createStringFromCompare(
                        keyOfKey,
                        valuesOfKey,
                        superCountry[keyOfKey]
                    )
                } else {
                    newKey = superCountry[keyOfKey];
                }

                if (newKey) {
                    if (!output[newKey]) {
                        output[newKey] = [];
                    }

                    output[newKey].push(superCountry);
                }
            });
        } else {
            output[nameOfKey] = this.root;
        }

        return Helper.Object.sortDictByKey(output);
    }
}
